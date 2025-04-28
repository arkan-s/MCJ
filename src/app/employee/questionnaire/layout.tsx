'use client'
import * as questionnaire from "@/hooks/context/questionnairecontext"
import { SessionProvider } from "next-auth/react";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <questionnaire.QuestionnairesProvider>
                    {children}
            </questionnaire.QuestionnairesProvider>    
        </SessionProvider>
    )
}
// LAYOUT ONLY FOR CONTEXT