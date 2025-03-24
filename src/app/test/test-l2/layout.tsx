'use client'
import { AllProviders } from "@/hooks/context/formcontext"

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
    return (
        <AllProviders>
            {children}
        </AllProviders>
    )
}
// LAYOUT ONLY FOR CONTEXT