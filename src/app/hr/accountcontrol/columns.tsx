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

export type Employee = {
    nomorIndukKaryawan: string;
    namaKaryawan: string;
    gender: string;
    personnelArea: string;
    position: string;
    personnelSubarea: string;
    levelPosition: string;
    role: string;
    password: string;
};

export const columns: ColumnDef<Employee>[] = [
    { 
        accessorKey: "nomorIndukKaryawan",
        header: "NIK",
        enableGlobalFilter: true,
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
        enableGlobalFilter: true,
    },
    {
        accessorKey: "gender",
        header: "Gender",
        enableGlobalFilter: false,
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
        enableGlobalFilter: false,
    },
    {
        accessorKey: "position",
        header: "Position",
        enableGlobalFilter: false,
    },
    {
        accessorKey: "personnelSubarea",
        header: "Personnel Subarea",
        enableGlobalFilter: false,
    },
    
    {
        accessorKey: "levelPosition",
        header: "Level",
        enableGlobalFilter: false,
    },
    {
        accessorKey: "role",
        header: "Role",
        enableGlobalFilter: false,
    },
    {
        accessorKey: "password",
        header: "Password Akun",
        enableGlobalFilter: false,
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
                onClick={() => navigator.clipboard.writeText(employee.nomorIndukKaryawan)}
            >
                Copy NIK
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Data</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        )
    }, enableGlobalFilter: false,
    },
];
