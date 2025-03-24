"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type HeadDept = {
    
};

export const columns: ColumnDef<HeadDept>[] = [
    { 
        accessorKey: "nomorIndukKaryawan",
        header: "NIK",
    },
    {
        accessorKey: "namaKaryawan",
        header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nama Karyawan
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
    },
    {
        accessorKey: "gender",
        header: "Gender",
    },
    {
        accessorKey: "personnelArea",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Personnel Area
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "position",
        header: "Position",
    },
    {
        accessorKey: "personnelSubarea",
        header: "Personnel Subarea",
    },
    
    {
        accessorKey: "levelPosition",
        header: "Level",
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    {
        accessorKey: "password",
        header: "Password Akun",
    },
    {
        id: "actions",
        cell: ({ row }) => {
        const employee = row.original
    
        return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(HeadDept.nomorIndukKaryawan)}
            >
                Copy NIK
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Data</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        )
    },
    },
];
