import type { Metadata } from "next";
import { metadata as rootMetadata } from "../layout"; // Impor metadata dari root layout
import NavBar from "@/components/shared/navigation/navigation";

export const metadata: Metadata = {
  ...rootMetadata, // Mewarisi metadata dari root layout
  title: "HR - My Career Journey", // Bisa override jika perlu
};

export default function HumanRLayout({ children }: { children: React.ReactNode }) {
    return (
        // <main className="flex md:flex-row flex-col grow w-full h-screen">
        <main className="flex md:flex-row flex-col grow justify-center w-screen md:h-screen">
            <NavBar role="hr" disable={false}/>
            {children}
        </main>
    )
}
