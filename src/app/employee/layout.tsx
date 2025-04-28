import type { Metadata } from "next";
import { metadata as rootMetadata } from "../layout"; // Impor metadata dari root layout
import NavBar from "@/components/shared/navigation/navigation";
import { getQueryClient } from "@/lib/getQueryClient";
import { auth } from "@/auth"

export const metadata: Metadata = {
  ...rootMetadata, // Mewarisi metadata dari root layout
  title: "Employee - My Career Journey", // Bisa override jika perlu
};

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery(
        {
            queryKey: ["datakaryawan"],

            queryFn: async () => {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/datakaryawan/${session?.user.nik}`);
                if (!res.ok) {
                    throw new Error('API Error!');
                }
                const result = await res.json();
                return result;
            }
        }
    )


    return (
        <main className="flex md:flex-row justify-center flex-col w-full min-h-screen grow overflow-y-auto">
            <NavBar role="employee" disable={false}/>
            {children}
        </main>
    )
}