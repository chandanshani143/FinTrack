"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


const serializeTransaction = (obj) => {
    const serialized = {...obj};
    if (obj.balance) {
        serialized.balance = obj.balance.toNumber();      // Convert the Biodecimal value to number since nextjs doen't support decimal numvbers
    }

    if (obj.amount) {
        serialized.amount = obj.amount.toNumber();
    }

    return serialized;
};

export async function getUserAccounts() {
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

    try {
        const accounts = await db.account.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          include: {
            _count: {
              select: {
                transactions: true,
              },
            },
          },
        });

        //serialize account before sneding to client
        const serializedAccounts = accounts.map(serializeTransaction);

        return serializedAccounts;
        } catch (error) {
            console.error(error.message);
    }
}

export async function createAccount(data) {
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

        //convert balance to float before saving
        const balanceFloat = parseFloat(data.balance);
        if (isNaN(balanceFloat)) {
            throw new Error("Invalid balance amount");
        }

        //check if this is the user's first account
        const existingAccount = await db.account.findMany({
            where: { userId: user.id },
        });

        // If it's the first account, make it default regardless of user input
        // If not, use the user's preference 
        const shouldBeDafault = 
        existingAccount.length === 0 ? true : data.isDefault;

        // If this account should be default, unset other default accounts
        if (shouldBeDafault) {
            await db.account.updateMany({
                where: { userId: user.id, isDefault: true },
                data: { isDefault: false },
            });
        }

        const account = await db.account.create({
            data: {
                ...data,
                balance: balanceFloat,
                userId: user.id,
                isDefault: shouldBeDafault,
            },
        });

        const serializedAccount = serializeTransaction(account);

        revalidatePath("/dashboard");      //refetch the dashboard page to show the new account
        return { success: true, data: serializedAccount };
    } catch (error) {
        throw new Error(error.message);
    }
}

// fetching all transaction data for piechart and recent transactions list
export async function getDashboardData() {
     const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get all user transactions
  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return transactions.map(serializeTransaction);
}