"use client";

import { Switch } from '@/components/ui/switch';
import React, { useEffect } from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
}
    from '@/components/ui/card';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import useFetch from '@/hooks/use-fetch';
import { updateDefaultAcount } from '@/actions/account';
import { toast } from 'sonner';

const AccountCard = ({ account }) => {
    const { name, type, balance, id, isDefault } = account;

    const {
        loading: updateDefaultLoading,
        fn: updateDefaultFn,
        data: updateAccount,
        error,
    } = useFetch(updateDefaultAcount);              // we are passing the function from the action that we created

    const handleDefaultChange = async (event) => {           //we are using this function so that when we make a account default other account will be unchecked
        event.preventDefault();

        if(isDefault) {
            toast.warning("You need atleast one default account");
            return;    //Don't allow toggling off the default account
        }
        await updateDefaultFn(id);
    };

    useEffect(() => {
        if (updateAccount?.success) {
            toast.success("Default account updated Successfully");
        }
    }, [updateAccount, updateDefaultLoading]);

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Failed to update default account");
        }
    }, [error]);

    return (
        <Card className="hover:shadow-md transition-shadow group relative">
            <Link href={`/account/${id}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-s font-medium capitalize">
                        {name}
                    </CardTitle>
                    <Switch 
                    checked={isDefault}
                    onClick={handleDefaultChange}
                    disabled={updateDefaultLoading}/>
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>
                        ${parseFloat(balance).toFixed(2)}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                        {type.charAt(0) + type.slice(1).toLowerCase()} Account
                    </p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <ArrowUpRight className='mr-1 h-4 2-5 text-green-500' />
                        Income
                    </div>
                    <div className='flex items-center'>
                        <ArrowDownRight className='mr-1 h-4 2-4 text-red-500' />
                        Expense
                    </div>
                </CardFooter>
            </Link>
        </Card>

    )
}

export default AccountCard