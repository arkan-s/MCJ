import { Show_Data } from "@/components/ui/showdata/showData";
import { cookies } from "next/headers";
import { Employee, columns } from "./columns"
import { DataTable } from "@/components/ui/data_table"

async function getCookieString() {
    const cookieStore = await cookies();
    return cookieStore.toString(); // Mengubah cookies menjadi string
}

const cookieString = await getCookieString();

console.log(cookieString);

async function fetchData() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/EmployeeUsers`, {
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
    const json_data = await fetchData();

    const data = json_data.data || [];

    // const data = Array.from({ length: 100 }, (_, i) => ({
    //     nomorIndukKaryawan: (1000 + i).toString(),
    //     namaKaryawan: `Employee ${i + 1}`,
    //     gender: i % 2 === 0 ? "Male" : "Female",
    //     personnelArea: ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang"][i % 5],
    //     position: ["Software Engineer", "HR", "Marketing", "Finance", "Operations"][i % 5],
    //     personnelSubarea: ["IT", "Admin", "Sales", "Accounting", "Production"][i % 5],
    //     levelPosition: ["staff", "spv", "opt", "manager", "intern"][i % 5],
    //     role: "employee",
    //     password: `hashedpassword${1000 + i}`
    // }));
    
    // console.log(data);
    

    return (
        <div className="container mx-auto pt-1">
            <DataTable columns={columns} data={data} addDataURL={"/addaccount/employeexcel"} />
        </div>
    )

    // return (
    //     <div className="flex grow flex-col">
    //         <Show_Data json_data={json_data}></Show_Data>
    //     </div>
    // )
}