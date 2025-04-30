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
import { CareerPath } from "@/types/datatype-general";

export const careerPathCol: ColumnDef<CareerPath>[] = [
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