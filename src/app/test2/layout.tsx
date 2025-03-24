import type { Metadata } from "next";
import { metadata as rootMetadata } from "../layout"; // Impor metadata dari root layout
import NavBar from "@/components/shared/navigation/navigation";

export const metadata: Metadata = {
  ...rootMetadata, // Mewarisi metadata dari root layout
  title: "Employee - My Career Journey", // Bisa override jika perlu
};

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex md:flex-row justify-center flex-col grow w-full">
            <NavBar role="employee"/>
            {children}
        </main>
    )
}
