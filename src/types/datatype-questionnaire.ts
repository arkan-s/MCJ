import { DataDepartment, DataPosition } from "./datatype-general";

export type Forms = {
    idForm: string;
    titleForm: string;
    descForm: string;

    AssessmentType: AssessmentType[];
};

export type AssessmentType = {
    idAssessmentType: string;
    titleAT: string;
    descAT: string;
    typeAT: string;
    idForm: string;

    Questions: Questions[];
};

export type Questions = {
    idQuestion: string;
    titleQue: string;
    Question: string;
    idAT: string;
}

// ==================================================

export type InvolvedDept = {
    idID: string;
    idForm: string;
    idDepartement: string;
    DataDepartment: DataDepartment;
    Forms: Forms;
};

export type InvolvedPosition = {
    idIP: string;
    idAssessmentType: string;
    idPosition: number;
    AssessmentType: AssessmentType;
    DataPosition: DataPosition;
};