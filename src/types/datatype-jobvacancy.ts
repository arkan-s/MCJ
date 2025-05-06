import { DataBranch, DataLevel, DataPosition } from "./datatype-general";

export type DataSupervisors = {
    idSV: string;
    personnelArea: string;
    nomorIndukKaryawan: string;
    namaKaryawan: string;
    position: number;
    personnelSubarea: string;
    levelPosition: Date;
    tanggalMasukKerja: Date; 
    tanggalLahir: string;
    gender: string;
    age: number;
    lengthOfService: number;
    tahunPensiun: Date;

    DataBranch: DataBranch;
    DataLevel: DataLevel;
    DataPosition: DataPosition;
};

export type JobVacancy = {
    idJV: string;
    personnelArea: string;
    personnelSubarea: string;
    position: number;
    levelPosition: string;
    available: Date; 
    published: number;
    JobSummary: string | null;
    JobDescription: string | null;

    DataBranch: DataBranch;
    DataLevel: DataLevel | null;  
    DataPosition: DataPosition;
};