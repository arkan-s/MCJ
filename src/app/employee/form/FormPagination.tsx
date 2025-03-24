'use client'
import * as context from "@/hooks/context/formcontext";
import { useEffect, useState } from "react";

export function PaginationFormHandler({allowedNext, total_pages, page_number, changing_page} : {allowedNext: boolean, total_pages:number, page_number:number, changing_page:(arg:number)=>void}){
    const { careerHistory, setCareerHistory } = context.useCareerHistory()!;
    function validateCareerHistory(careerHistory: context.CareerHistoryItem){
        const isInvalid = careerHistory.some(item =>
            !item.position || 
            !item.personnelArea || 
            !item.personnelSubarea || 
            !item.levelPosition || 
            item.tanggalMulai === null ||
            (item.tanggalBerakhir === null && item.status !== 1)
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
                        <button className={`block grow px-1 py-1 rounded-md h-[40px] w-full border border-zinc-500 hover:border-zinc-900 hover:border-2 hover:font-extrabold disabled:opacity-40`} 
                                // onClick={}
                        >
                            <span className="hover:font-extrabold">Submit</span>
                        </button>
                    )}
                </div>
            </div>
);
}