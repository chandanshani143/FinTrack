"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


const serializeTransaction = (obj) => {
    const serialized = {...obj};
    
    if (obj.balance) {
        serialized.balance = obj.balance.toNumber();      // Convert the Biodecimal value to number since nextjs doen't support decimal numvbers
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

        const shouldBeDafault = 
        existingAccount.lenght===0 ? true : data.isDefault;

        //If this account should be default, unset other default accounts
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