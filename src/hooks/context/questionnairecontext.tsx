'use client'
import { createContext, useContext, useState, ReactNode } from "react";


export type templateDataForm = { /* Data Exposed from DB (get per dept) */
    IDForm : string;
    TitleForm : string;
    DescForm : string;
    AssessmentType : { /* Skills (get per position or/and level) */
        IDSkill : string; /* DB : AT.ID_AT */
        TitleSkill : string; /* DB : AT.Title | nama skill */
        DescSkill : string; /* DB : AT.Desc | deskripsi skill */
        TypeSkill : "teknikal" | "managerial" | "general"; /* DB : AT.Type | untuk menentukan urutan */
        Ques : { /* pertanyaan atau subskill */
            IDQue : string;
            TitleQue : string; /* nama subskill */
            DescQue : string; /* Deskripsi subskill atau pertanyaan */
        }[]
    }[]  
}[]

export type templateDataAnswer = { /* UNTUK PER FORM */
    ID : string; /* DB : Responses.Id_resp */
    Form : string; /* DB : Form.Id_Form */
    Employee : string; /* DB : User.nik */
    Answers : {
        IDAnswer : string;
        Que : string; /* Questions.Id_que */
        answer : number; /* 1 - 5 */
    }[]
}[]



