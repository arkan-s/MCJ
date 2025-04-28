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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteData } from "@/utils/fetchData";

export type branch = {
    idBranch: string;
    namaBranch: string;
    alamat: string;
}

export const branchCol: ColumnDef<branch>[] = [
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

export type department = {
    idDepartment: string;
    namaDepartment: string;
}

export const departmentCol: ColumnDef<department>[] = [
    {
        accessorKey: "idDepartment",
        header: "ID Department",
        
    },
    {
        accessorKey: "namaDepartment",
        header: "Nama Department",
        
    },
    {
        id: "actions",
        cell: ({ row }) => {
        const dept = row.original
    
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

export type position = {
    idPosition: number;
    namaPosition: string;
    dept: string;
}

export const positionCol: ColumnDef<position>[] = [
    {
        accessorKey: "idPosition",
        header: "ID Posisi",
        
    },
    {
        accessorKey: "namaPosition",
        header: "Nama Posisi",
    },
    {
        accessorKey: "dept",
        header: "Nama Department",
    },
    {
        id: "actions",
        cell: ({ row }) => {          
    
        const queryClient = useQueryClient();
        const posisi = row.original

        const { mutate: deletePosition, isPending: isDeletePositionPending } = useMutation({
            mutationFn: (idRecord: any) => deleteData(idRecord, "/api/position"),
            onSuccess: () => {
                alert("Berhasil menghapus Data");
                queryClient.invalidateQueries({ queryKey: ["position"] });
            },
            onError: (error: any) => {
                console.error(error);
                alert("Gagal menambah position");
            },
        });
        const handleDelete = (id: number) => {
            if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                deletePosition(id) // Panggil mutasi untuk menghapus
            }
        }

    
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
            <DropdownMenuItem onClick={()=>handleDelete(posisi.idPosition)}>
                Hapus Data
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        )
    }, 
    },
]

export type level = { 
    idLevel: string;
    namaLevel: string;
}

export const levelCol: ColumnDef<level>[] = [
    {
        accessorKey: "idLevel",
        header: "ID level",
        
    },
    {
        accessorKey: "namaLevel",
        header: "Nama level",
    },
    {
        id: "actions",
        cell: ({ row }) => {
        const level = row.original
    
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


export type careerPath = {
    idCP: string;
    existing: number;
    future: number;
    existingString: string;
    futureString: string;
    existingDept: string;
    futureDept: string;
}

export const careerPathCol: ColumnDef<careerPath>[] = [
    {
        accessorKey: "idCP",
        header: "ID Career Path",
        enableGlobalFilter: false,
    },
    {
        accessorKey: "existing",
        header: "ID Posisi Existing",
        enableGlobalFilter: false,
    },
    {
        accessorKey: "existingString",
        header: "Nama Posisi Existing",
    },
    {
        accessorKey: "existingDept",
        header: "Department",
        enableGlobalFilter: false,
    },
    {
        accessorKey: "future",
        header: "ID Posisi Future",
        enableGlobalFilter: false,
    },
    {
        accessorKey: "futureString",
        header: "Nama Posisi Future",
    },
    {
        accessorKey: "futureDept",
        header: "Department",
        enableGlobalFilter: false,
    },
    {
        id: "actions",
        cell: ({ row }) => {
        
        const queryClient = useQueryClient();
        const careerPath = row.original;

        const { mutate: deleteCareerPath, isPending: isDeleteCPPending } = useMutation({
            mutationFn: (idRecord: any) => deleteData(idRecord, "/api/position"),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["careerPath"] });
            },
            onError: (error: any) => {
                console.error(error);
                alert("Gagal menghapus career path");
            },
        });

        const handleDelete = (id: string) => {
            if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                deleteCareerPath(id) // Panggil mutasi untuk menghapus
            }
        }
    
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
            <DropdownMenuItem onClick={()=>handleDelete(careerPath.idCP)}>
                Hapus Data
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        )
    }, 
    },
]