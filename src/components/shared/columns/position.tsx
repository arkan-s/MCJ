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
import { DataPosition } from "@/types/datatype-general";

export const positionCol: ColumnDef<DataPosition>[] = [
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