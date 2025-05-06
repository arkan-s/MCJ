"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { DataKaryawan } from "@/types/datatype-employee";

export const employeeCol: ColumnDef<DataKaryawan>[] = [
    { accessorKey: "nomorIndukKaryawan", header: "NIK", enableGlobalFilter: true },
    {
        accessorKey: "namaKaryawan",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Nama Karyawan <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        enableGlobalFilter: true,
    },
    {
        accessorKey: "tanggalLahir",
        header: () => <span className="whitespace-nowrap">Tanggal Lahir</span>,
        enableGlobalFilter: false,
        cell: ({ row }) => {
            const tanggalLahir = new Date(row.original.tanggalLahir).toISOString().split("T")[0];
        
            return <span className="whitespace-nowrap">{tanggalLahir}</span>;
        },
    },
    {
        accessorKey: "tanggalMasukKerja",
        header: () => <span className="whitespace-nowrap">Tanggal Masuk Perusahaan</span>,
        enableGlobalFilter: false,
        cell: ({ row }) => {
            const tanggalMasuk = new Date(row.original.tanggalMasukKerja).toISOString().split("T")[0];
        
            return <span className="whitespace-nowrap">{tanggalMasuk}</span>;
        },
    },
    { accessorKey: "gender", header: "Gender", enableGlobalFilter: false },
    {
        accessorFn: (row) => row.DataBranch?.namaBranch ?? "-",
        id: "personnelArea",
        enableColumnFilter: true,
        enableGlobalFilter: false,
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Personnel Area <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {   
        accessorFn: (row) => row.DataPosition?.namaPosition ?? "-",
        id: "position",
        header: "Posisi",
        enableColumnFilter: true, 
        enableGlobalFilter: false,
        cell: ({ row }) => (
            <span className="whitespace-nowrap">{row.original.DataPosition?.namaPosition}</span>
        ),
    },
    {
        accessorFn: (row) => row.DataPosition.DataDepartment.namaDepartment ?? "-",
        id: "personnelSubarea",
        header: () => <span className="whitespace-nowrap">Personnel Subarea</span>,
        enableGlobalFilter: false,
    },
    {
        id: "levelPosition",
        header: () => <span className="whitespace-nowrap">Level</span>,
        enableGlobalFilter: false,
        cell: ({ row }) => {
            return <span className="whitespace-nowrap">{row.original.DataLevel.namaLevel}</span>;
        },
    },
    {
        accessorKey: "age",
        header: () => <span className="whitespace-nowrap">Umur</span>,
        enableGlobalFilter: false,
        cell: ({ row }) => {
            const age = row.original.age.toFixed(2);
            
            return <span className="whitespace-nowrap">{age} Tahun</span>;
        },
    },
    {
        accessorKey: "lengthOfService",
        header: () => <span className="whitespace-nowrap">Masa Kerja</span>,
        enableGlobalFilter: false,
        cell: ({ row }) => {
            const MK = row.original.lengthOfService.toFixed(2);
            
            return <span className="whitespace-nowrap">{MK} Tahun</span>;
        },
    },
    {
        accessorKey: "pend",
        header: () => <span className="whitespace-nowrap">Pendidikan</span>,
        enableGlobalFilter: false,
    },
    {
        accessorKey: "namaSekolah",
        header: () => <span className="whitespace-nowrap">Nama Sekolah</span>,
        enableGlobalFilter: false,
        cell: ({ row }) => {
            return <span className="whitespace-nowrap">{row.original.namaSekolah}</span>;
        },
    },
    {
        accessorKey: "namaJurusan",
        header: () => <span className="whitespace-nowrap">Jurusan</span>,
        enableGlobalFilter: false,
    },
    {
        accessorKey: "BestEmployee",
        header: () => <span className="whitespace-nowrap">Best Employee</span>,
        enableGlobalFilter: false,
        cell: ({ row }) => {
            return <span className="whitespace-nowrap">{row.original.BestEmployee ?? 0}</span>;
        },
    },
    {
        accessorKey: "formFilled",
        header: () => <span className="whitespace-nowrap">Form</span>,
        enableGlobalFilter: false,
        cell: ({ row }) => {
            return <span className={`${row.original.formFilled === 0 ? 'text-red-500' : 'text-green-500'} whitespace-nowrap`}>{row.original.formFilled === 0 ? "Belum Mengisi Form" : "Sudah Mengisi Form"}</span>;
        },
    },
    {
        accessorKey: "questionnaire",
        header: () => <span className="whitespace-nowrap">Questionnaire</span>,
        enableGlobalFilter: false,
        cell: ({ row }) => {
            return <span className={`${row.original.questionnaire === 0 ? 'text-red-500' : 'text-green-500'} whitespace-nowrap`}>{row.original.questionnaire === 0 ? "Belum Mengisi Questionnaire" : "Sudah Mengisi Questionnaire"}</span>;
        },
    },
    {
        accessorKey: "createdAt",
        header: () => <span className="whitespace-nowrap">Dibuat Pada</span>,
        enableGlobalFilter: false,
        cell: ({ row }) => {
            const value = row.original.createdAt;
            if (!value) return "-";
            const date = new Date(value);
            return <span className="whitespace-nowrap">{format(date, "dd MMM yyyy, HH:mm")}</span>;
        },
    },
    {
        accessorKey: "lastUpdatedAt",
        header: () => <span className="whitespace-nowrap">Update Terakhir</span>,
        enableGlobalFilter: false,
        cell: ({ row }) => {
            const value = row.original.lastUpdatedAt;
            if (!value) return "-";
            const date = new Date(value);
            return <span className="whitespace-nowrap">{format(date, "dd MMM yyyy, HH:mm")}</span>;
        },
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
    },
    enableGlobalFilter: false,
    },
]


