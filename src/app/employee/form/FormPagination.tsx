'use client'
import * as context from "@/hooks/context/formcontext";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getdatakaryawan, updateDataKaryawan } from "@/utils/fetchData";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation';


export function PaginationFormHandler({total_pages, page_number, changing_page, submitLoading} : {total_pages:number, page_number:number, changing_page:(arg:number)=>void, submitLoading:any}){

    const session = useSession();
    const queryClient = useQueryClient();
    const router = useRouter();
    

    const { careerHistory, setCareerHistory } = context.useCareerHistory()!;
    function validateCareerHistory(careerHistory: context.CareerHistoryItem){
        const isInvalid = careerHistory.some(item =>
            !item.position || 
            !item.personnelArea || 
            !item.personnelSubarea || 
            !item.levelPosition || 
            item.tanggalMulai === null 
        );
    
        return isInvalid ? false : true;
    }

    const { orgIntHistory, setOrgIntHistory } = context.useOrgIntHistory()!;
    function validateOrgIntHistory(orgIntHistory: context.OrgIntHistoryItem){
        const isInvalid = orgIntHistory.some(
            item => 
                !item.jabatan ||
                !item.name ||
                !item.startYear 
        )
        return isInvalid ? false : true;
    }
    const { projectHistory, setProjectHistory } = context.useProjectHistory()!;
    function validateProjectHistory(projectHistory: context.ProjectHistoryItem) {
        const isInvalid = projectHistory.some(
            item => 
                !item.name || 
                !item.year || 
                !item.peran || 
                !item.shortDesc
        );
        return isInvalid ? false : true;
    }

    const { comiteeHistory, setComiteeHistory } = context.useComiteeHistory()!;
    function validateComiteeHistory(comiteeHistory: context.ComiteeHistoryItem) {
        const isInvalid = comiteeHistory.some(
            item => 
                !item.name || 
                !item.jabatan || 
                !item.year
        );
        return isInvalid ? false : true;
    }
    const { gkmHistory, setGkmHistory } = context.useGKMHistory()!;
    function validateGkmHistory(gkmHistory: context.GKMHistoryItem) {
        if(gkmHistory.amountOfTime === 0){
            return true;
        }
        return !!gkmHistory.amountOfTime && !!gkmHistory.highestPosition;
    }

    const { mentorWanted, setMentorWanted } = context.useMentorWanted()!;
    function validateMentorWanted(mentor: context.MentorWanted): boolean {
        return mentor.name !== "" && mentor.jabatan !== "" && mentor.cabang !== "";
    }
    
    const { trainingWanted, setTrainingWanted } = context.useTrainingWanted()!;
    function validateTrainingWanted(trainingList: context.TrainingWanted): boolean {
        return !trainingList.some(item => !item.name);
    }
    
    const { bestEmployee, setBestEmployee } = context.useBestEmployee()!;
    function validateBestEmployee(bestEmployee: context.BestEmployee): boolean {
        return bestEmployee !== null && bestEmployee !== undefined;
    }
    
    const { empCareerChoice, setEmpCareerChoice } = context.useEmpCareerChoice()!;
    function validateEmpCareerChoiceData(data: any): boolean {
        if(data === null){
            return false;
        }
        return data.careerDevWill !== null && data.careerDevWill !== undefined;
    }

    const { careerOfMyChoice, setCareerOfMyChoice } = context.useCareerofMyChoice()!;
    function validateCareerOfMChoice(data: any): boolean {
        if(empCareerChoice?.careerDevWill === null || false){
            return false;
        } else {
            if (careerOfMyChoice?.short !== null) {
                if (careerOfMyChoice?.long === null){
                    return true;
                }
                return false;
            }
            return true;
        }
    }

    const [isDisabled, setIsDisabled] = useState(true);
    console.log("awal page number :", page_number);

    useEffect(() => {
        console.log("🔄 Updating isDisabled...");
        let disabled = true;

        switch (page_number) {
            case 0:
                disabled = !validateCareerHistory(careerHistory || []);
                break;
            case 1:
                disabled = !validateOrgIntHistory(orgIntHistory || []);
                break;
            case 2:
                disabled = !validateProjectHistory(projectHistory || []);
                break;
            case 3:
                disabled = !validateComiteeHistory(comiteeHistory || []);
                break;
            case 4:
                disabled = !validateGkmHistory(gkmHistory || context.initialGKMHistoryVal);
                break;
            case 5:
                disabled = !validateMentorWanted(mentorWanted || context.initialMentorWantedVal);
                break;
            case 6:
                disabled = !validateTrainingWanted(trainingWanted || []);
                break;
            case 7:
                disabled = !validateBestEmployee(bestEmployee || 0);
                break;
            case 8:
                disabled = !validateEmpCareerChoiceData(empCareerChoice);
                break;
            default:
                console.log("DEFAULT SWITCH MASUK");
                disabled = true;
                console.log("DEFAULT SWITCH KELUAR");
        }
        
        console.log("isDisabled belum terupdate : ", isDisabled)
        setIsDisabled(disabled);
        console.log("isDisabled terupdate : ", isDisabled);
    }, [page_number, careerHistory, orgIntHistory, projectHistory, comiteeHistory, gkmHistory, mentorWanted, trainingWanted, bestEmployee, empCareerChoice]);

    console.log("apakah nilainya:", isDisabled);

    const nik = session.data?.user.nik;


    const { data: empData, isLoading: empLoading, isError: empError } = useQuery({
        queryKey: ['datakaryawan'],
        queryFn: () => getdatakaryawan(session?.data?.user.nik),
        retry: 3, 
        retryDelay: attemptIndex => Math.min(1000 * 1 ** attemptIndex, 30000),
        staleTime: Infinity, 
    });


    const mutationFn = async () => {
        // 1. Ambil dari cache
        let prev_data: any = queryClient.getQueryData(['datakaryawan']);

        if (!prev_data) {
            prev_data = await queryClient.fetchQuery({
                queryKey: ['datakaryawan'],
                queryFn: () => getdatakaryawan(session?.data?.user.nik),
                retry: 3, 
                retryDelay: attemptIndex => Math.min(1000 * 1 ** attemptIndex, 30000),
                staleTime: Infinity,
            });
        }

        // 2. Transform datanya
        const updatedData = {
            namaKaryawan: prev_data.namaKaryawan,
            tanggalLahir: prev_data.tanggalLahir,
            tanggalMasukKerja: prev_data.tanggalMasukKerja,
            gender: prev_data.gender,
            personnelArea: prev_data.personnelArea,
            position: prev_data.position,
            personnelSubarea: prev_data.personnelSubarea,
            levelPosition: prev_data.levelPosition,
            pend: prev_data.pend,
            namaSekolah: prev_data.namaSekolah,
            namaJurusan: prev_data.namaJurusan,
            age: (new Date().getTime() - new Date(prev_data.tanggalLahir).getTime()) / (1000 * 60 * 60 * 24 * 365.25),
            lengthOfService: (new Date().getTime() - new Date(prev_data.tanggalMasukKerja).getTime()) / (1000 * 60 * 60 * 24 * 365.25),
            formFilled: 1,
            questionnaire: prev_data.questionnaire,
            createdAt: prev_data.createdAt,
            lastUpdatedAt: new Date(),
        };

        // 3. Panggil API update
        return updateDataKaryawan(prev_data.nomorIndukKaryawan, updatedData);
    };

    const { mutate, isPending, isError, error, reset } = useMutation({
        mutationFn, 
        onError: (err: any) => {
            console.error('Error updating data: ', err);
        },
        onSuccess: () => {
            console.log('Data berhasil diupdate');
            // Kalau mau refresh cache juga bisa:
            queryClient.invalidateQueries({ queryKey: ['datakaryawan'] });
        },
        retry: 3,
        retryDelay: (attempt: any) => Math.min(1000 * 2 ** attempt, 30000),
    });

    const [ submitResult, setSubmitResult ] = useState<{message: string, detail: string, popUp: boolean}>({message: "", detail:"", popUp:false});
    async function submitAll(){
        submitLoading(true);

        const toLocalStorage = {
            careerHistory: careerHistory?.map((e:any)=>{ return {...e, position: parseInt(e.position)} }),
            orgIntHistory: orgIntHistory,
            projectHistory: projectHistory,
            comiteeHistory: comiteeHistory,
            gkmHistory: gkmHistory,
            mentorWanted: mentorWanted,
            trainingWanted: trainingWanted,
            bestEmployee: bestEmployee,
            empCareerChoice: empCareerChoice,
            careerOfMyChoice: careerOfMyChoice
        }
        console.log(toLocalStorage);

        localStorage.setItem("submitForm", JSON.stringify(toLocalStorage));

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/form`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(toLocalStorage)
        });

        const data = await res.json();
        if(res.ok === false){
            submitLoading(false);

            throw data;
        }

        submitLoading(false);

        setSubmitResult({message: "Data berhasil disimpan!", detail: "", popUp: true});

        mutate();
        router.push('/employee/questionnaire');

        return data;
        
    }

    return (
            <div className="flex flex-row justify-end">
                <div className="flex grow flex-row gap-1 pt-1">
                    <button className={`block px-1 py-1 rounded-md h-[40px] border border-zinc-500 hover:border-zinc-900 hover:border-2 active:font-bold disabled:opacity-40`} 
                        onClick={()=>changing_page(-1)} 
                        disabled={page_number===0}>
                        <svg width="40px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
                            <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 10H2m0 0l7-7m-7 7l7 7"/>
                        </svg>
                    </button>
                    {page_number+1 !== total_pages && (<button className={`block grow px-1 py-1 rounded-md h-[40px] md:grow-0 border border-zinc-500 hover:border-zinc-900 hover:border-2 active:font-bold disabled:opacity-40`} onClick={()=>changing_page(1)} 
                    disabled={isDisabled}>
                        <svg width="40px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none" className="hidden md:block">
                            <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 10h16m0 0l-7-7m7 7l-7 7"/>
                        </svg>
                        <span className="md:hidden active:font-extrabold">Continue</span>
                    </button>)}
                    {page_number+1 === total_pages && (
                        <button className={`block grow px-1 py-1 rounded-md h-[40px] w-full border border-zinc-500 hover:border-zinc-900 hover:border-2 hover:font-extrabold disabled:opacity-40 disabled:bg-red-300`} 
                                
                            onClick={async (e) => {
                                e.currentTarget.blur();
                                try {
                                    await submitAll();
                                } catch (err: any) {
                                    setSubmitResult({message: err.error, detail: err.message, popUp: false})
                                }
                            }}
                        >
                            <span className="hover:font-extrabold">Submit</span>
                        </button>
                    )}
                </div>
                <AlertDialog open={submitResult.popUp}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle className="font-extrabold text-xl">{submitResult.message}</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                            {submitResult.detail}
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={()=>setSubmitResult({message: "", detail: "", popUp: false})} className="border-2 border-zinc-700" >Tutup</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
);
}