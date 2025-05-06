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
import { DataLevel } from "@/types/datatype-general";

export const levelCol: ColumnDef<DataLevel>[] = [
    {
        accessorKey: "idLevel",
        header: "ID level",
        
    },
    {
        accessorKey: "namaLevel",
        header: "Nama level",
    },
    // {
    //     id: "actions",
    //     cell: ({ row }) => {
    //     const level = row.original
    
    //     return (
    //     <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //         <Button variant="ghost" className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <MoreHorizontal className="h-4 w-4" />
    //         </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end">
    //         <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //         <DropdownMenuItem>
    //             Edit Data
    //         </DropdownMenuItem>
    //         <DropdownMenuSeparator />
    //         <DropdownMenuItem>
    //             Hapus Data
    //         </DropdownMenuItem>
    //         </DropdownMenuContent>
    //     </DropdownMenu>
    //     )
    // }, 
    // },
]
