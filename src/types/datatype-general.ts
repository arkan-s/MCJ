import { DataCareerPlan, DataKaryawan, DataMentorWanted, DataRiwayatGKM, DataRiwayatKarir, DataRiwayatKepanitiaan, DataRiwayatOrganisasiInternal, DataRiwayatProject, DataTrainingWanted, EmpCareerChoice } from "./datatype-employee";

export type DataBranch = {
    idBranch: string;
    namaBranch: string;
    alamat: string | null;
}

export type DataDepartment = {
    idDepartment: string;
    namaDepartment: string;
}

export type DataPosition = {
    idPosition: number;
    namaPosition: string;
    dept: string;
    DataDepartment: DataDepartment;
}

export type DataLevel = {
    idLevel: string;
    namaLevel: string;
}

// ==================================================

export type CareerPath = {
    
    idCP: string;
    existing: number;
    future: number;     
    
    startCareer: DataPosition;
    desCareer: DataPosition;
}

// ==================================================

export type JobInterest = {
    idJI: string;
    nomorIndukKaryawan: string;
    idJV: string;
    createdAt: Date;
};

// ==================================================

export type EmployeeDashboard = DataKaryawan & {
    DataRiwayatKarir: DataRiwayatKarir[];
    DataRiwayatProject: DataRiwayatProject[];
    DataRiwayatOrganisasiInternal: DataRiwayatOrganisasiInternal[];
    DataRiwayatKepanitiaan: DataRiwayatKepanitiaan[];
    DataTrainingWanted: DataTrainingWanted[];
    
    DataRiwayatGKM: DataRiwayatGKM | null;

    DataMentorWanted: DataMentorWanted | null;

    EmpCareerChoice: EmpCareerChoice | null;
    DataCareerPlan: DataCareerPlan | null;
}