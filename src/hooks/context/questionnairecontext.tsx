'use client'
import { createContext, useContext, useState, ReactNode } from "react";


export type questionnairesFE = { /* Data Exposed from DB (get per dept) */
    IDForm : string;
    TitleForm : string;
    DescForm : string;
    AssessmentType : { /* Skills (get per position or/and level) */
        IDAssessment : string; /* DB : AT.ID_AT */
        TitleAssessment : string; /* DB : AT.Title | nama skill */
        DescAssessment : string; /* DB : AT.Desc | deskripsi skill */
        TypeAssessment : "teknikal" | "managerial" | "general"; /* DB : AT.Type | untuk menentukan urutan */
        Ques : { /* pertanyaan atau subskill */
            IDQue : string;
            TitleQue : string; /* nama subskill */
            DescQue : string; /* Deskripsi subskill atau pertanyaan */
            answer : number | null
        }[]
    }[]  
}[]

type QuestionnairesContextType = {
    questionnaires: questionnairesFE;
    setQuestionnaires: (questionnaires: questionnairesFE) => void;
};

const QuestionnairesContext = createContext<QuestionnairesContextType | undefined>(undefined);

export function QuestionnairesProvider({ children }: { children: ReactNode }) {
    const [questionnaires, setQuestionnaires] = useState<questionnairesFE>([]);

    return (
        <QuestionnairesContext.Provider value={{ questionnaires, setQuestionnaires }}>
            {children}
        </QuestionnairesContext.Provider>
    );
}

export function useTemplateForm() {
    const context = useContext(QuestionnairesContext);
    if (!context) {
        throw new Error('useTemplateForm must be used within a QuestionnairesProvider');
    }
    return context;
}