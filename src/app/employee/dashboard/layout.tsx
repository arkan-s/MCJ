import { SessionProvider } from "next-auth/react";


export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
    
    return (
        <SessionProvider>
                {children}
        </SessionProvider>
    )
}