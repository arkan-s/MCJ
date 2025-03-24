'use client'
// import * as formValidContext from "@/app/employee/form/FormValidationContext"
import { useEmpCareerChoice } from "@/hooks/context/formcontext";
import { useEffect, useState } from "react";

export function PaginationFormHandler({total_pages, page_number, changing_page} : {total_pages:number, page_number:number, changing_page:(arg:number)=>void}){
    const { careerHistoryErr, setCareerHistoryErr } = formValidContext.useCareerHistoryErr()!;
    const careerHistoryValid = () => {
        return !careerHistoryErr?.some(e => 
            Object.values(e).some(value => value !== "")
        );
    }
    const [isCareerHistoryValid, setIsCareerHistoryValid] = useState<boolean>(true)
    useEffect(() => {
        const isValid = careerHistoryValid();  
        setIsCareerHistoryValid(isValid);
    }, [careerHistoryErr]);

    const { orgIntErrors, setOrgIntErrors } = formValidContext.useOrgIntHistoryErrors();
    const orgIntHistoryValid = () => {
        return !Object.values(orgIntErrors)?.some(errorObj =>
            Object.values(errorObj).some(value => value !== "")
        );
    };
    const [isOrgIntHistoryValid, setIsOrgIntHistoryValid] = useState<boolean>();
    useEffect(()=>{
        const isValid = orgIntHistoryValid();
        setIsOrgIntHistoryValid(isValid);
    }, [orgIntErrors]);

    const { projectErrors, setProjectErrors } = formValidContext.useProjectHistoryErrors();
    const projectHistoryValid = () => {
        return !Object.values(projectErrors)?.some(errorObj =>
            Object.values(errorObj).some(value => value !== "")
        );
    };
    const [isProjectHistoryValid, setIsProjectHistoryValid] = useState<boolean>();
    useEffect(() => {
        const isValid = projectHistoryValid();
        setIsProjectHistoryValid(isValid);
    }, [projectErrors]);

    const { comerrors, setcomErrors } = formValidContext.useComiteeHistoryErrors();
    const comiteeHistoryValid = () => {
        return !Object.values(comerrors)?.some(errorObj =>
            Object.values(errorObj).some(value => value !== "")
        );
    };
    const [isComiteeHistoryValid, setIsComiteeHistoryValid] = useState<boolean>();
    useEffect(() => {
        const isValid = comiteeHistoryValid();
        setIsComiteeHistoryValid(isValid);
    }, [comerrors]);

    const { trainingErrors, setTrainingErrors } = formValidContext.useTrainingErrors()!;
    const trainingWantedValid = () => {
        return !trainingErrors?.some(e => 
            Object.values(e).some(value => value !== "")
        );
    }
    const [isTrainingWantedValid, setIsTrainingWantedValid] = useState<boolean>()
    useEffect(() => {
        const isValid = careerHistoryValid();  
        setIsCareerHistoryValid(isValid);
    }, [careerHistoryErr]);

    const { gkmErr, setGKMErr} = formValidContext.useGKMErr();
    const gkmValid = () => {
        return !Object.values(gkmErr).some(value=> value !== "")
    }
    const [isGKMValid, setIsGKMValid] = useState<boolean>()
    useEffect(()=>{
        const isValid = gkmValid();
        setIsGKMValid(isValid);
    }, [gkmErr]);

    const { mentorErr, setMentorErr } = formValidContext.useMentorErr();
    const mentorValid = () => {
        return !Object.values(mentorErr).some(value=>value!=="");
    }
    const [ isMentorValid, setIsMentorValid] = useState<boolean>();
    useEffect(()=>{
        const isValid = mentorValid();
        setIsMentorValid(isValid);
    }, [mentorErr])

    const { empCErr, setempCErr } = formValidContext.useempCErr();
    const empChoiceValid = () =>{
        return empCErr.careerDevWill === true;
    }
    const [isEmpChoiceValid, setIsEmpChoiceValid] = useState<boolean>();
    useEffect(()=>{
        const isValid = empChoiceValid();
        setIsMentorValid(isValid);
    }, [empCErr])


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
                    disabled={page_number===total_pages-1 ||
                        (() => {
                            switch (page_number) {
                                case 0:
                                    return !isCareerHistoryValid; 
                                case 1:
                                    return !isOrgIntHistoryValid;
                                case 2:
                                    return !isProjectHistoryValid;
                                case 3:
                                    return !isComiteeHistoryValid;
                                case 4:
                                    return !isGKMValid;
                                case 5:
                                    return !isMentorValid;
                                case 6:
                                    return !isTrainingWantedValid;
                                case 7:
                                    return true
                                case 8:
                                    return !isEmpChoiceValid;
                                case 9:
                                    return true
                                default:
                                    return true; 
                            }
                        })()
                    }>
                        <svg width="40px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none" className="hidden md:block">
                            <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 10h16m0 0l-7-7m7 7l-7 7"/>
                        </svg>
                        <span className="md:hidden active:font-extrabold">Continue</span>
                    </button>)}
                    {page_number+1 === total_pages && (
                        <button className={`block grow px-1 py-1 rounded-md h-[40px] w-full border border-zinc-500 hover:border-zinc-900 hover:border-2 hover:font-extrabold disabled:opacity-40`} 
                                onClick={()=>changing_page(1)} 
                                disabled={page_number!==total_pages-1 || 
                                    (() => {
                                        switch (page_number) {
                                            case 0:
                                                return isCareerHistoryValid; 
                                            case 1:
                                                return isOrgIntHistoryValid;
                                            case 2:
                                                return isProjectHistoryValid;
                                            case 3:
                                                return isComiteeHistoryValid;
                                            case 4:
                                                return isGKMValid;
                                            case 5:
                                                return isMentorValid;
                                            case 6:
                                                return isTrainingWantedValid;
                                            case 7:
                                                return true
                                            case 8:
                                                return isEmpChoiceValid;
                                            case 9:
                                                return true
                                            default:
                                                return true; 
                                        }
                                    })()
                                }
                        >
                            <span className="hover:font-extrabold">Submit</span>
                        </button>
                    )}
                </div>
            </div>
);
}