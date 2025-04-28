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

export type Supervisors = {
    idSV: string;
    nomorIndukKaryawan: string;
    namaKaryawan: string;
    gender: string;
    personnelArea: string;
    personnelSubarea: string;
    position: string;
    levelPosition: string;
    tanggalMasukKerja: Date;
    tanggalLahir: Date;
    age: number;
    tahunPensiun: Date;
    lengthOfService: number;
};

export const columns: ColumnDef<Supervisors>[] = [
        {
        accessorKey: "nomorIndukKaryawan",
        header: ({ column }) => (
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
            Nama Karyawan
            <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        },
        {
        accessorKey: "namaKaryawan",
        header: ({ column }) => (
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
            Nama Karyawan
            <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        },
        {
        accessorKey: "gender",
        header: "Gender",
        enableGlobalFilter: false,
        },
        {
        accessorKey: "personnelArea",
        header: "Personnel Area",
        enableGlobalFilter: false,
        },
        {
        accessorKey: "personnelSubarea",
        header: "Personnel Subarea",
        enableGlobalFilter: false,
        },
        {
        accessorKey: "position",
        header: "Position",
        enableGlobalFilter: false,
        },
        {
        accessorKey: "levelPosition",
        header: "Level",
        enableGlobalFilter: false,
        },
        {
        accessorKey: "tanggalMasukKerja",
        header: "Tanggal Masuk",
        enableGlobalFilter: false,
        },
        {
        accessorKey: "tanggalLahir",
        header: "Tanggal Lahir",
        enableGlobalFilter: false,
        },
        {
        accessorKey: "age",
        header: ({ column }) => (
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
            Usia
            <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        enableGlobalFilter: false,
        },
        {
        accessorKey: "tahunPensiun",
        header: ({ column }) => (
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
            Usia
            <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        enableGlobalFilter: false,
        },
        {
        accessorKey: "lengthOfService",
        header: ({ column }) => (
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
            Masa Kerja
            <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        enableGlobalFilter: false,
        },
        {
        id: "actions",
        cell: ({ row }) => {
            const supervisor = row.original
    
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
                    onClick={() => navigator.clipboard.writeText(supervisor.nomorIndukKaryawan)}
                >
                    Copy NIK
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem >Delete Data</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            )
        },
        enableGlobalFilter: false,
        },
    ]
