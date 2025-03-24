'use client';
import { createContext, ReactNode, useContext, useState } from "react";
import * as contextHook from "@/hooks/context/formcontext";

// type CareerHistoryErrContext = Record<number, Partial<Record<keyof contextHook.CareerHistoryItem[0], string>>>;

// interface CareerHistoryErrContextType {
//     careerHistoryErr: CareerHistoryErrContext;
//     setCareerHistoryErr: React.Dispatch<React.SetStateAction<CareerHistoryErrContext>>;
// }

// const CareerHistoryErrContext = createContext<CareerHistoryErrContextType | undefined>(undefined);

// export const CareerHistoryErrProvider = ({ children }: { children: React.ReactNode }) => {
//     const [careerHistoryErr, setCareerHistoryErr] = useState<CareerHistoryErrContext>({});

//     return (
//         <CareerHistoryErrContext.Provider value={{ careerHistoryErr, setCareerHistoryErr }}>
//             {children}
//         </CareerHistoryErrContext.Provider>
//     );
// };

// export const useCareerHistoryErr = () => {
//     const context = useContext(CareerHistoryErrContext);
//     if (!context) {
//         throw new Error("useOrgIntHistoryErrors must be used within an OrgIntHistoryErrorsProvider");
//     }
//     return context;
// };


type CareerHistoryErrContextType = {
    position: string;
    personnelArea: string;
    personnelSubarea: string;
    levelPosition: string;
    tanggalMulai: string;
    tanggalBerakhir: string;
    status: string;
    id: string;
}[];
export const careerHistoryErrInVal: CareerHistoryErrContextType = [{
    position: "Position tidak boleh kosong",
    personnelArea: "Personnel Area tidak boleh kosong",
    personnelSubarea: "Personnel Subarea tidak boleh kosong",
    levelPosition: "Level Position tidak boleh kosong",
    tanggalMulai: "Tanggal mulai tidak boleh kosong",
    tanggalBerakhir: "Tanggal berakhir tidak boleh kosong",
    status: "",
    id: "",
}]

// Membuat context
export const CareerHistoryErrContext = createContext<{ careerHistoryErr: CareerHistoryErrContextType| null; setCareerHistoryErr: React.Dispatch<React.SetStateAction<CareerHistoryErrContextType | null>> } | null>(null);

// Provider
export const CareerHistoryErrProvider = ({ children }: { children: React.ReactNode }) => {
    const [careerHistoryErr, setCareerHistoryErr] = useState<CareerHistoryErrContextType | null>(null);
    
    return (
        <CareerHistoryErrContext.Provider value={{careerHistoryErr, setCareerHistoryErr}}>
            {children}
        </CareerHistoryErrContext.Provider>
    );
};
export const useCareerHistoryErr = () => useContext(CareerHistoryErrContext);

// Custom hook untuk penggunaan context
export const useCareerHistory = () => {
    const context = useContext(CareerHistoryErrContext);
    if (!context) {
        throw new Error("useCareerHistory must be used within a CareerHistoryProvider");
    }
    return context;
};

type OrgIntHistoryErrors = Record<number, Partial<Record<keyof contextHook.OrgIntHistoryItem[0], string>>>;

interface OrgIntHistoryErrorsContextType {
    orgIntErrors: OrgIntHistoryErrors;
    setOrgIntErrors: React.Dispatch<React.SetStateAction<OrgIntHistoryErrors>>;
}

const OrgIntHistoryErrorsContext = createContext<OrgIntHistoryErrorsContextType | undefined>(undefined);

export const OrgIntHistoryErrorsProvider = ({ children }: { children: React.ReactNode }) => {
    const [orgIntErrors, setOrgIntErrors] = useState<OrgIntHistoryErrors>({});

    return (
        <OrgIntHistoryErrorsContext.Provider value={{ orgIntErrors, setOrgIntErrors }}>
            {children}
        </OrgIntHistoryErrorsContext.Provider>
    );
};

export const useOrgIntHistoryErrors = () => {
    const context = useContext(OrgIntHistoryErrorsContext);
    if (!context) {
        throw new Error("useOrgIntHistoryErrors must be used within an OrgIntHistoryErrorsProvider");
    }
    return context;
};




type ProjectHistoryErrors = Record<number, Partial<Record<keyof contextHook.ProjectHistoryItem[0], string>>>;

interface ProjectHistoryErrorsContextType {
    projectErrors: ProjectHistoryErrors;
    setProjectErrors: React.Dispatch<React.SetStateAction<ProjectHistoryErrors>>;
}

const ProjectHistoryErrorsContext = createContext<ProjectHistoryErrorsContextType | undefined>(undefined);

export const ProjectHistoryErrorsProvider = ({ children }: { children: React.ReactNode }) => {
    const [projectErrors, setProjectErrors] = useState<ProjectHistoryErrors>({});

    return (
        <ProjectHistoryErrorsContext.Provider value={{ projectErrors, setProjectErrors }}>
            {children}
        </ProjectHistoryErrorsContext.Provider>
    );
};

export const useProjectHistoryErrors = () => {
    const context = useContext(ProjectHistoryErrorsContext);
    if (!context) {
        throw new Error("useProjectHistoryErrors must be used within a ProjectHistoryErrorsProvider");
    }
    return context;
};




type ComiteeHistoryErrors = Record<number, Partial<Record<keyof contextHook.ComiteeHistoryItem[0], string>>>;

interface ComiteeHistoryErrorsContextType {
    comerrors: ComiteeHistoryErrors;
    setcomErrors: React.Dispatch<React.SetStateAction<ComiteeHistoryErrors>>;
}

const ComiteeHistoryErrorsContext = createContext<ComiteeHistoryErrorsContextType | undefined>(undefined);

export const ComiteeHistoryErrorsProvider = ({ children }: { children: React.ReactNode }) => {
    const [comerrors, setcomErrors] = useState<ComiteeHistoryErrors>({});

    return (
        <ComiteeHistoryErrorsContext.Provider value={{ comerrors, setcomErrors }}>
            {children}
        </ComiteeHistoryErrorsContext.Provider>
    );
};

export const useComiteeHistoryErrors = () => {
    const context = useContext(ComiteeHistoryErrorsContext);
    if (!context) {
        throw new Error("useComiteeHistoryErrors must be used within a ComiteeHistoryErrorsProvider");
    }
    return context;
};

export type TrainingError = {
    error: string;
    id: string;
}[];

interface TrainingErrorsContextType {
    trainingErrors: TrainingError;
    setTrainingErrors: React.Dispatch<React.SetStateAction<TrainingError>>;
}

// Membuat Context
const TrainingErrorsContext = createContext<TrainingErrorsContextType | undefined>(undefined);

// Provider untuk TrainingErrors
export const TrainingErrorsProvider = ({ children }: { children: ReactNode }) => {
    const [trainingErrors, setTrainingErrors] = useState<TrainingError>([]);

    return (
        <TrainingErrorsContext.Provider value={{ trainingErrors, setTrainingErrors }}>
            {children}
        </TrainingErrorsContext.Provider>
    );
};

// Custom hook untuk menggunakan TrainingErrors
export const useTrainingErrors = () => {
    const context = useContext(TrainingErrorsContext);
    if (!context) {
        throw new Error("useTrainingErrors must be used within a TrainingErrorsProvider");
    }
    return context;
};


export type GKMError = {
    amountOfTime: string;
    highestPosition: string;
    id: string;
};

const GKMErrorIn = {
    amountOfTime: "",
    highestPosition: "",
    id: "",
};

interface GKMErrContextType {
    gkmErr: GKMError;
    setGKMErr: React.Dispatch<React.SetStateAction<GKMError>>;
}

const GKMErrContext = createContext<GKMErrContextType | undefined>(undefined);

export const GKMErrProvider = ({ children }: { children: React.ReactNode }) => {
    const [gkmErr, setGKMErr] = useState<GKMError>(GKMErrorIn);

    return (
        <GKMErrContext.Provider value={{ gkmErr, setGKMErr }}>
            {children}
        </GKMErrContext.Provider>
    );
};

export const useGKMErr = () => {
    const context = useContext(GKMErrContext);
    if (!context) {
        throw new Error("useGKMErr must be used within a GKMErrProvider");
    }
    return context;
};


export type MentorErr = {
    name: string;
    jabatan: string;
    cabang: string;
};



const MentorErrIn: MentorErr = {
    name: "",
    jabatan: "",
    cabang: "",
};


interface MentorErrContextType {
    mentorErr: MentorErr;
    setMentorErr: React.Dispatch<React.SetStateAction<MentorErr>>;
}

const MentorErrContext = createContext<MentorErrContextType | undefined>(undefined);

export const MentorErrProvider = ({ children }: { children: React.ReactNode }) => {
    const [mentorErr, setMentorErr] = useState<MentorErr>(MentorErrIn);

    return (
        <MentorErrContext.Provider value={{ mentorErr, setMentorErr }}>
            {children}
        </MentorErrContext.Provider>
    );
};

export const useMentorErr = () => {
    const context = useContext(MentorErrContext);
    if (!context) {
        throw new Error("useMentorErr must be used within a MentorErrProvider");
    }
    return context;
};


export type EmpChoiceT = {
    careerDevWill: boolean;
    rotationWill: boolean;
    crossDeptWill: boolean;
}
const EmpChoice: EmpChoiceT = {
    careerDevWill: false,
    rotationWill: false,
    crossDeptWill: false,
}
interface EmpChoiceConType {
    empCErr: EmpChoiceT;
    setempCErr: React.Dispatch<React.SetStateAction<EmpChoiceT>>;
}
const EmpChoiceContext = createContext<EmpChoiceConType | undefined>(undefined);
export const EmpChoiceProvider = ({ children }: { children: React.ReactNode }) => {
    const [empCErr, setempCErr] = useState<EmpChoiceT>(EmpChoice);

    return (
        <EmpChoiceContext.Provider value={{ empCErr, setempCErr }}>
            {children}
        </EmpChoiceContext.Provider>
    );
};
export const useempCErr = () => {
    const context = useContext(EmpChoiceContext);
    if (!context) {
        throw new Error("useempCErr must be used within a EmpChoiceProvider");
    }
    return context;
};
