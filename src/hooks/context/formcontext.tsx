'use client'
import { createContext, useContext, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";


export type CareerHistoryItem = {
    position: string;
    personnelArea: string;
    personnelSubarea: string;
    levelPosition: string;
    tanggalMulai: Date | null;
    tanggalBerakhir: Date | null;
    status: number;
    id: string;
}[];

export const initialCareerHistoryVal: CareerHistoryItem = [{ 
// AMBIL DARI BE, KALAU NULL INI, KALAU GAK NULL DATA DARI BE 
// (SATU DOANG YANG STATUS AKTIF KARENA PAGE FORM CUMA DIAKSES SEKALI SEUMUR HIDUP AKUN)
    position: "",
    personnelArea: "",
    personnelSubarea: "",
    levelPosition: "",
    tanggalMulai: null,
    tanggalBerakhir: null,
    status: 0,
    id: uuidv4()
}];

export const CareerHistoryContext = createContext<{ careerHistory: CareerHistoryItem | null; setCareerHistory: React.Dispatch<React.SetStateAction<CareerHistoryItem | null>> } | null>(null);

export const CareerHistoryProvider = ({ children }: { children: ReactNode }) => {
    const [careerHistory, setCareerHistory] = useState<CareerHistoryItem | null>(null);
return <CareerHistoryContext.Provider value={{ careerHistory, setCareerHistory }}>{children}</CareerHistoryContext.Provider>;
};

export const useCareerHistory = () => useContext(CareerHistoryContext);

// =======================================================

export type OrgIntHistoryItem = {
    name: string;
    jabatan: string;
    startYear: number;
    id: string;
}[];

export const initialOrgIntVal: OrgIntHistoryItem = [{
    name: "",
    jabatan: "",
    startYear: 0,
    id: uuidv4(),
}];

export const OrgIntHistoryContext = createContext<{ orgIntHistory: OrgIntHistoryItem | null; setOrgIntHistory: React.Dispatch<React.SetStateAction<OrgIntHistoryItem | null>> } | null>(null);

export const OrgIntHistoryProvider = ({ children }: { children: ReactNode }) => {
    const [orgIntHistory, setOrgIntHistory] = useState<OrgIntHistoryItem | null>(null);
    return <OrgIntHistoryContext.Provider value={{ orgIntHistory, setOrgIntHistory }}>{children}</OrgIntHistoryContext.Provider>;
};

export const useOrgIntHistory = () => useContext(OrgIntHistoryContext);

// =======================================================\

export type ProjectHistoryItem = {
    name: string;
    year: number;
    peran: string;
    shortDesc: string;
    id: string;
}[];

export const initialProjectHistoryVal: ProjectHistoryItem = [{
    name: "",
    year: 0,
    peran: "",
    shortDesc: "",
    id: uuidv4(),
}];

export const ProjectHistoryContext = createContext<{ projectHistory: ProjectHistoryItem | null; setProjectHistory: React.Dispatch<React.SetStateAction<ProjectHistoryItem | null>> } | null>(null);

export const ProjectHistoryProvider = ({ children }: { children: ReactNode }) => {
    const [projectHistory, setProjectHistory] = useState<ProjectHistoryItem | null>(null);
    return <ProjectHistoryContext.Provider value={{ projectHistory, setProjectHistory }}>{children}</ProjectHistoryContext.Provider>;
};

export const useProjectHistory = () => useContext(ProjectHistoryContext);

// ======================================================

export type ComiteeHistoryItem = {
    name: string;
    jabatan: string;
    year: number;
    id: string;
}[];

export const initialComiteeHistoryVal: ComiteeHistoryItem = [{
    name: "",
    jabatan: "",
    year: 0,
    id: uuidv4(),
}]

export const ComiteeHistoryContext = createContext<{ comiteeHistory: ComiteeHistoryItem | null; setComiteeHistory: React.Dispatch<React.SetStateAction<ComiteeHistoryItem | null>> } | null>(null);

export const ComiteeHistoryProvider = ({ children }: { children: ReactNode }) => {
    const [comiteeHistory, setComiteeHistory] = useState<ComiteeHistoryItem | null>(null);
    return <ComiteeHistoryContext.Provider value={{ comiteeHistory, setComiteeHistory }}>{children}</ComiteeHistoryContext.Provider>;
};

export const useComiteeHistory = () => useContext(ComiteeHistoryContext);

// ======================================================

export type GKMHistoryItem = {
    amountOfTime: number;
    highestPosition: string;
};

export const initialGKMHistoryVal = {
    amountOfTime: 0,
    highestPosition: ""
}

export const GKMHistoryContext = createContext<{ gkmHistory: GKMHistoryItem | null; setGkmHistory: React.Dispatch<React.SetStateAction<GKMHistoryItem | null>> } | null>(null);

export const GKMHistoryProvider = ({ children }: { children: ReactNode }) => {
    const [gkmHistory, setGkmHistory] = useState<GKMHistoryItem | null>(null);
    return <GKMHistoryContext.Provider value={{ gkmHistory, setGkmHistory }}>{children}</GKMHistoryContext.Provider>;
};

export const useGKMHistory = () => useContext(GKMHistoryContext);

//  =====================================================

export type MentorWanted = {
    name: string;
    jabatan: string;
    cabang: string;
};

export const initialMentorWantedVal = {
    name: "",
    jabatan: "",
    cabang: ""
}

export const MentorWantedContext = createContext<{ mentorWanted: MentorWanted | null; setMentorWanted: React.Dispatch<React.SetStateAction<MentorWanted | null>> } | null>(null);

export const MentorWantedProvider = ({ children }: { children: ReactNode }) => {
    const [mentorWanted, setMentorWanted] = useState<MentorWanted | null>(null);
    return <MentorWantedContext.Provider value={{ mentorWanted, setMentorWanted }}>{children}</MentorWantedContext.Provider>;
};

export const useMentorWanted = () => useContext(MentorWantedContext);

// =====================================================

export const initialCareerOfMyChoiceVal = {
    short: "",
    long: ""
}

// FROM BACKEND
export type empData = {
    nIK: number| null;
    name: string| null;
    TMK: Date| null;
    birthdate: Date| null;
    gender: number| null;
    educationLevel: string| null;
    schColName: string| null;
    major: String| null;
}


// INPUT
export type empCareerChoiceData = {
    careerDevWill: boolean;
    rotationWill:boolean | null;
    crossDeptWill: boolean | null;
}
export type CareerofMyChoice = { // MAKE DROPDOWN CHOICELIST FROM BACKEND
    short: string | null;
    long: string | null;
};

// Start Here (urutan ngisi)

export type TrainingWanted = {
    name: string;
    id: string;
}[];
export const TrainingWantedContext = createContext<{ trainingWanted: TrainingWanted | null; setTrainingWanted: React.Dispatch<React.SetStateAction<TrainingWanted | null>> } | null>(null);
export const useTrainingWanted = () => useContext(TrainingWantedContext);
export const TrainingWantedProvider = ({ children }: { children: ReactNode }) => {
    const [trainingWanted, setTrainingWanted] = useState<TrainingWanted | null>(null);
    return <TrainingWantedContext.Provider value={{ trainingWanted, setTrainingWanted }}>{children}</TrainingWantedContext.Provider>;
};


export type BestEmployee = number;


// Define Contexts
export const EmpDataContext = createContext<{ empData: empData | null; setEmpData: React.Dispatch<React.SetStateAction<empData | null>> } | null >(null);
export const EmpCareerChoiceContext = createContext<{ empCareerChoice: empCareerChoiceData | null; setEmpCareerChoice: React.Dispatch<React.SetStateAction<empCareerChoiceData | null>> } | null>(null);
export const BestEmployeeContext = createContext<{ bestEmployee: BestEmployee | null; setBestEmployee: React.Dispatch<React.SetStateAction<BestEmployee | null>> } | null>(null);
export const CareerofMyChoiceContext = createContext<{  careerOfMyChoice: CareerofMyChoice | null; setCareerOfMyChoice: React.Dispatch<React.SetStateAction<CareerofMyChoice | null>> } | null>(null);
// Provider Components
export const EmpDataProvider = ({ children }: { children: ReactNode }) => {
    const [empData, setEmpData] = useState<empData | null>(null);
    return <EmpDataContext.Provider value={{ empData, setEmpData }}>{children}</EmpDataContext.Provider>;
};

export const EmpCareerChoiceProvider = ({ children }: { children: ReactNode }) => {
        const [empCareerChoice, setEmpCareerChoice] = useState<empCareerChoiceData | null>(null);

    return <EmpCareerChoiceContext.Provider value={{ empCareerChoice, setEmpCareerChoice }}>{children}</EmpCareerChoiceContext.Provider>;
};

export const BestEmployeeProvider = ({ children }: { children: ReactNode }) => {
    const [bestEmployee, setBestEmployee] = useState<BestEmployee | null>(null);
    return <BestEmployeeContext.Provider value={{ bestEmployee, setBestEmployee }}>{children}</BestEmployeeContext.Provider>;
};

export const CareerOfMyChoiceProvider = ({ children }: { children: ReactNode }) => {
    const [careerOfMyChoice, setCareerOfMyChoice] = useState<CareerofMyChoice | null>(null);
    return <CareerofMyChoiceContext.Provider value={{ careerOfMyChoice, setCareerOfMyChoice }}>{children}</CareerofMyChoiceContext.Provider>;
};


// Custom Hooks for Each Context
export const useEmpData = () => useContext(EmpDataContext);
export const useEmpCareerChoice = () => useContext(EmpCareerChoiceContext);
export const useBestEmployee = () => useContext(BestEmployeeContext);
export const useCareerofMyChoice = () => useContext(CareerofMyChoiceContext);


export const formConditionaContext = createContext(null);


// Combined Provider to Wrap the Entire App
export const AllProviders = ({ children }: { children: ReactNode }) => {
    return (
        <EmpDataProvider>
            <EmpCareerChoiceProvider>
                <CareerHistoryProvider>
                    <OrgIntHistoryProvider>
                        <ComiteeHistoryProvider>
                            <ProjectHistoryProvider>
                                <GKMHistoryProvider>
                                    <MentorWantedProvider>
                                        <TrainingWantedProvider>
                                            <BestEmployeeProvider>
                                                <CareerOfMyChoiceProvider>
                                                    {children}
                                                </CareerOfMyChoiceProvider>
                                            </BestEmployeeProvider>
                                        </TrainingWantedProvider>
                                    </MentorWantedProvider>
                                </GKMHistoryProvider>
                            </ProjectHistoryProvider>
                        </ComiteeHistoryProvider>
                    </OrgIntHistoryProvider>
                </CareerHistoryProvider>
            </EmpCareerChoiceProvider>
        </EmpDataProvider>
    );
};