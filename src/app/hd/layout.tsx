import type { Metadata } from "next";
import { metadata as rootMetadata } from "../layout"; // Impor metadata dari root layout

export const metadata: Metadata = {
  ...rootMetadata, // Mewarisi metadata dari root layout
  title: "Employee - My Career Journey", // Bisa override jika perlu
};

export default function HeadDeptLayout({ children }: { children: React.ReactNode }) {
    return <section>{children}</section>;
}
