"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const serializeTransaction = (obj) => {
    const serialized = { ...obj };
    if (obj.balance) {
        serialized.balance = obj.balance.toNumber();      // Convert the Biodecimal value to number since nextjs doen't support decimal numvbers
    }

    if (obj.amount) {
        serialized.amount = obj.amount.toNumber();
    }

    return serialized;
};

export async function updateDefaultAcount(accountId) {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User not authorized");
        }

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });
        if (!user) {
            throw new Error("User not found");
        }

        await db.account.updateMany({
            where: { userId: user.id, isDefault: true },
            data: { isDefault: false },
        });

        const account = await db.account.update({
            where: {
                id: accountId,
                userId: user.id,
            },
            data: { isDefault: true },
        });

        revalidatePath("/dashboard");
        return { success: true, data: serializeTransaction(account) };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}


export async function getAccountWithTransactions(accountId) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("User not authorized");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });
    if (!user) {
        throw new Error("User not found");
    }

    const account = await db.account.findUnique({
        where: {
            id: accountId,
            userId: user.id,
        },
        include: {
            transactions: {
                orderBy: { date: "desc" },
            },
            _count: {
                select: { transactions: true },
            },
        },
    })

    if (!account) return null;           //if no account is present then return null

    return {
        ...serializeTransaction(account),
        transactions: account.transactions.map(serializeTransaction),
    };
}

export async function bulkDeleteTransactions(transactionIds) {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User not authorized");
        }

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });
        if (!user) {
            throw new Error("User not found");
        }

        //Get transactions to calculate the balance changes
        const transactions = await db.transaction.findMany({
            where: {
                id: { in: transactionIds },
                userId: user.id,
            }
        });

        console.log(transactions);

        //Group transactions by accountId and calculate the balance changes
        const accountBalanceChanges = transactions.reduce((acc, transaction) => {
            const change = transaction.type === "EXPENSE"      // if the transaction is an expense then subtract the amount from the account balance
                ? transaction.amount
                : -transaction.amount;

            // we'll update the amount even if account is different
            acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;   // add the change to the account balance
            return acc;
        }, {});

        //Delete transaction and update balance amount balances in a transaction
        await db.$transaction(async (tx) => {                           //this $transaction is from prisma
            await tx.transaction.deleteMany({
                where: {
                    id: { in: transactionIds },
                    userId: user.id,
                },
            });

            //update account balances
            for (const [accountId, balanceChange] of Object.entries(accountBalanceChanges)) {       //Object.entries() converts the object into an array of key-value pairs
                await tx.account.update({
                    where: {id: accountId},
                    data: {
                        balance: {
                            increment: balanceChange,       //increment the balance by the change
                        },
                    },
                });
            }
        });
        revalidatePath("/dashboard");
        revalidatePath("/account/[id]");

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}