import type { Metadata } from "next";
import { metadata as rootMetadata } from "../layout"; // Impor metadata dari root layout
import NavBar from "@/components/shared/navigation/navigation";
import { auth } from "@/auth";

export const metadata: Metadata = {
  ...rootMetadata, // Mewarisi metadata dari root layout
  title: "Employee - My Career Journey", // Bisa override jika perlu
};

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    return (
        <main className="flex md:flex-row justify-center flex-col w-full h-screen grow">
            <NavBar role="employee" disable={session?.user.isFirstLogin === true ? true : false}/>
            {children}
        </main>
    )
}