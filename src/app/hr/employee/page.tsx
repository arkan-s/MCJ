import { Show_Data } from "@/components/ui/showdata/showData";
import { cookies } from "next/headers";
import { employeeCol } from "@/components/shared/columns/employee";
import { DataTable } from "@/components/ui/data_table"
import { EmployeeTable } from "@/components/ui/table/employeeTable";

async function getCookieString() {
    const cookieStore = await cookies();
    return cookieStore.toString(); // Mengubah cookies menjadi string
}

const cookieString = await getCookieString();

console.log(cookieString);

async function fetchData() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/datakaryawan`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieString, // Pastikan cookieString sudah didefinisikan
            },
        });

        // Parse response JSON
        const result = await response.json();

        // Jika status API 404 atau lainnya, pastikan error tertangani dengan baik
        if (!response.ok) {
            return {
                error: result.error || "Unknown Error",
                message: result.message || "Something went wrong",
                status: response.status,
                data: null, // Tidak ada data jika error
            };
        }

        // Jika sukses, return data
        return {
            error: null,
            message: "Success",
            status: response.status,
            data: result, // Data tersedia hanya jika response.ok = true
        };
    } catch (error:any) {
        console.error("Fetch error:", error);
        return { error: "Fetch failed", message: error.message, status: 500, data: null };
    }
}

export default async function accountcontrolEmployee(){
    // ====== Must-Fetched Data ======
    const json_data = await fetchData();

    // ====== Initialize and Re Component's States ======
    const data = json_data.data || [];

    // ====== Initialize and Re Other States ======

    // ====== Initialize and Re Component's Components ======

    // ====== Consoling ======
    
    // ====== Loading Handling ======

    // ====== Error Handling ======

    // ====== Return ======
    return (
        <div className="container overflow-x-hidden pt-1">
            <EmployeeTable columns={employeeCol} data={data} addDataURL={"/addaccount/employeexcel"} />
        </div>
    )
}