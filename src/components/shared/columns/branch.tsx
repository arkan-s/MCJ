"use client";

import { ColumnDef } from "@tanstack/react-table";
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
import { DataBranch } from "@/types/datatype-general";

export const branchCol: ColumnDef<DataBranch>[] = [
    {
        accessorKey: "idBranch",
        header: "ID Cabang",
        
    },
    {
        accessorKey: "namaBranch",
        header: "Nama Cabang",
        
    },
    {
        accessorKey: "alamat",
        header: "Alamat",
        cell: ({row})=>{
            const alamat = row.original.alamat;
            if (alamat === null) {
                return "Belum diupdate";
            }
            return alamat;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
        const branch = row.original
    
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
            <DropdownMenuItem>
                Edit Data
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                Hapus Data
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        )
    }, 
    },
]