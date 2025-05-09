"use client";

import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react'


import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { format, set } from 'date-fns';
import { Clock, RefreshCw } from 'lucide-react';
import { categoryColors } from '@/data/categories';
import { useRouter } from 'next/navigation';


const RECURRING_INTERVALS = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
};

const TransactionTable = ({ transactions }) => {
    const router = useRouter();

    const [selectedIds, setSelectedIds] = useState([]);                 //for multiple selection
    const [sortConfig, setSortConfig] = useState({                      //for sorting
        field: "date",
        direction: "desc",
    });

    const filterredAndSortedTransactions = transactions;

    const handleSort = (field) => {
        setSortConfig((current) => ({
            field,
            direction: current.field == field && current.direction == "asc" ? "desc" : "asc",
        }));
    };

    const handleSelect = (id) => {          //if id already selected, remove it from selectedIds, else add it to selectedIds
        setSelectedIds((current) => 
            current.includes(id) ? current.filter((item) => item != id) : [...current, id]
    );
    }

    const handleSelectAll = () => {         //if all transactions are selected, deselect all, else select all
        setSelectedIds((current) => current.length === filterredAndSortedTransactions.length 
        ? [] : filterredAndSortedTransactions.map((t) => t.id));
    }

    return (
        <div>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox 
                                onCheckedChange={handleSelectAll}
                                checked={selectedIds.length === filterredAndSortedTransactions.length &&
                                    filterredAndSortedTransactions.length > 0
                                }/>
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("date")}
                            >
                                <div className='flex items-center'>
                                    Date{" "}
                                    {sortConfig.field === "date" && (sortConfig.direction === "asc" ? (
                                        <ChevronUp className='ml-1 h-4 w-4' />
                                    ) : (
                                        <ChevronDown className='ml-1 h-4 w-4' />
                                    ))}
                                </div>
                            </TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("category")}
                            >
                                <div className='flex items-center'>
                                    Category
                                    {sortConfig.field === "category" && (sortConfig.direction === "asc" ? (
                                        <ChevronUp className='ml-1 h-4 w-4' />
                                    ):(
                                        <ChevronDown className='ml-1 h-4 w-4' />
                                    ))}
                                    </div>
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}
                            >
                                <div className='flex items-center justify-end'>
                                    Amount
                                    {sortConfig.field === "amount" && (sortConfig.direction === "asc" ? (
                                        <ChevronUp className='ml-1 h-4 w-4' />
                                    ) : (
                                        <ChevronDown className='ml-1 h-4 w-4' />
                                    ))}
                                </div>
                            </TableHead>
                            <TableHead>Recurring</TableHead>
                            <TableHead className="w-[50px]" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filterredAndSortedTransactions.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="text-center text-muted-foreground"
                                >
                                    No Transactions Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filterredAndSortedTransactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>
                                        <Checkbox 
                                        onCheckedChange={() => handleSelect(transaction.id)}
                                        checked={selectedIds.includes(transaction.id)}/>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(transaction.date), "PP")}
                                    </TableCell>
                                    <TableCell>{transaction.description}</TableCell>
                                    <TableCell className="capitalize">
                                        <span
                                            style={{
                                                backgroundColor: categoryColors[transaction.category]
                                            }}
                                            className='px-2 py-1 rounded text-white text-sm'
                                        >
                                            {transaction.category}
                                        </span>
                                    </TableCell>
                                    <TableCell
                                        className="text-right font-medium"
                                        style={{
                                            color: transaction.type === "EXPENSE" ? "red" : "green",
                                        }}
                                    >
                                        {transaction.type == "EXPENSE" ? "-" : "+"}${transaction.amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        {transaction.isRecurring ? (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Badge variant="outline" className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200">
                                                            <RefreshCw className="h-3 2-3" />
                                                            {
                                                                RECURRING_INTERVALS[transaction.recurringInterval]
                                                            }
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <div className='text-sm'>
                                                            <div className='font-medium'>Next Date:</div>
                                                            <div>
                                                                {format(new Date(transaction.nextRecurringDate), "PP")}
                                                            </div>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ) : (
                                            <Badge variant="outline" className="gap-1">
                                                <Clock className="h-3 2-3" />
                                                One-time
                                            </Badge>)}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 2-8 p-0">
                                                    <MoreHorizontal className="h-4 2-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel
                                                    onClick={() =>
                                                        router.push(`/transactions/create?edit=${transaction.id}`)
                                                    }
                                                >
                                                    Edit
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                //  onClick={()=>deleteFn([transaction.id])}
                                                >Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                    </TableCell>
                                </TableRow>
                            ))

                        )}
                    </TableBody>
                </Table>

            </div>
        </div>
    )
}

export default TransactionTable