import { SessionProvider } from "next-auth/react";
import * as contextHook from "@/hooks/context/formcontext"


export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
    
    return (
        <SessionProvider>
            <contextHook.AllProviders>
                {children}
            </contextHook.AllProviders>
        </SessionProvider>
    )
}