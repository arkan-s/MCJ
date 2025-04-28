"use client"; // <-- Tambahkan ini di paling atas

import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data_table";
import { columns } from "./columns";

async function fetchData() {
try {
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/supervisors`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            
        },
        credentials: 'include', 
        });

        const result = await response.json();

        if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
        }

        return result;
    } catch (error: any) {
        console.error("Fetch error:", error);
        throw new Error(error.message || "Fetch failed");
    }
}

export default function AccountControlEmployee() {
    const { data, error, isLoading } = useQuery({
        queryKey: ["supervisors"],
        queryFn: fetchData,
    });

    if (isLoading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">Error: {(error as Error).message}</div>;
    }

    return (
        <div className="container mx-auto pt-1">
            <DataTable columns={columns} data={data || []} addDataURL="/add-supervisors" />
        </div>
    );
}
