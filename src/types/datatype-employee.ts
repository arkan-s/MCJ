import { CareerPath, DataBranch, DataLevel, DataPosition } from "./datatype-general";
import { Forms } from "./datatype-questionnaire";

export type DataKaryawan = {
    nomorIndukKaryawan: string;
    namaKaryawan: string;
    tanggalLahir: Date;
    tanggalMasukKerja: Date;
    gender: string;
    personnelArea: string;
    position: number;
    personnelSubarea: string;
    levelPosition: string;
    age: number;
    lengthOfService: number;
    pend: string;
    namaSekolah: string;
    namaJurusan: string;

    BestEmployee: number | null;

    formFilled: number;
    questionnaire: number;
    createdAt: Date;
    lastUpdatedAt: Date | null;

    DataBranch: DataBranch;
    DataLevel: DataLevel;
    DataPosition: DataPosition;
}

//  ===========================================================

export type DataRiwayatKarir = {
    idCareerHistory: string;
    nomorIndukKaryawan: string;
    personnelArea: string;
    personnelSubarea: string;
    position: number;
    levelPosition: string;
    tanggalMulai: Date | null;
    tanggalBerakhir: Date | null;
    status: number;
};

export type DataRiwayatProject = {
    idRiwayatProject: string;
    nomorIndukKaryawan: string;
    judulProject: string;
    namaPosisi: string;
    lamaKolaborasi: number;
    shortDesc: string;
};

export type DataRiwayatOrganisasiInternal = {
    idRiwayatOrganisasiInternal: string;
    nomorIndukKaryawan: string;
    namaOrganisasi: string;
    namaPosisi: string;
    tahunMulai: number;
    tahunSelesai: number | null;
};

export type DataRiwayatKepanitiaan = {
    idRiwayatKepanitiaan: string;
    nomorIndukKaryawan: string;
    namaAcara: string;
    namaPosisi: string;
    tahunPelaksanaan: number;
};

export type DataRiwayatGKM = {
    nomorIndukKaryawan: string;
    banyakKeikutsertaan: number | null;
    posisiTertinggi: string | null;
};  

export type DataTrainingWanted = {
    idTraining: string;
    nomorIndukKaryawan: string;
    topikTraining: string;
};

export type DataMentorWanted = {
    nomorIndukKaryawan: string;
    namaMentor: string | null;
    cabangMentor: string | null;
    posisiMentor: string | null;
};

export type EmpCareerChoice = {
    nomorIndukKaryawan: string;
    careerDevWill: boolean;
    rotationWill: boolean | null;
    crossDeptWill: boolean | null;
};


export type DataCareerPlan = {
    nomorIndukKaryawan: string;
    positionShortTerm: string;
    positionLongTerm: string;

    shortTermCareerPath: CareerPath | null;
    longTermCareerPath: CareerPath | null;
};

// ==================================================

export type Responses = {
    idResp: string;
    id_form: string;
    nomorIndukKaryawan: string;
    created_at: Date;
    
    Forms: Forms;
    DataKaryawan: DataKaryawan;
};

export type Answers = {
    idAnswer: string;
    idResp: string;
    idAssess: string;
    idQuestion: string;
    answer: number;
};

// ==================================================