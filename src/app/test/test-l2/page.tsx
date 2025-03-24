'use client';
import { bitter } from '@/components/ui/fonts';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useRef, useEffect } from "react";
import { CareerHistoryComponents } from '@/components/ui/form_components/CareerHistoryComp';
import { OrgInHistoryComponents } from '@/components/ui/form_components/OrgIntHistoryComp';
import { PaginationFormHandler } from "@/components/ui/pagination/pagination";
import { ProjectHistoryComponents } from '@/components/ui/form_components/ProjectHistoryComp';
import { ComiteeHistoryComponents } from '@/components/ui/form_components/ComiteeHistoryComp';
import { GKMHistoryComponents } from '@/components/ui/form_components/GKMHistoryComp';
import { MentorWantedComponents } from '@/components/ui/form_components/MentorWantedComp';
import { TrainingWantedComponents } from '@/components/ui/form_components/TrainingWantedComp';
import { BestEmployeeComponents } from '@/components/ui/form_components/BestEmployee';
import { EmpCareerChoiceComponents } from '@/components/ui/form_components/EmpCareerChoiceComp';
import { CareerofMyChoiceComponents } from '@/components/ui/form_components/CareerOfMyChoice';

const usePrevious = <T,>(val: T) => {
    const ref = useRef<undefined | T>(undefined);
    useEffect(() => {
        ref.current = val;
    });
    return ref.current;
}

export default function Form() {
    const [activeIndex, setActiveIndex] = useState(0);
    const previousIndex = usePrevious(activeIndex) ?? activeIndex;
    
    const direction: Direction = previousIndex > activeIndex
                ? 'back'
                : 'forward';

    type Direction = 'back' | 'forward';
    const variants = {
        initial: (direction: Direction) => ({
            x: direction === 'forward' ? '150%' : '-150%', opacity: 1, scale:0.1, transition: { type: "spring", stiffness: 100, damping: 15 }
        }),
        target: {
            x: '0%', opacity: 1, scale:1, transition: { type: "spring", stiffness: 100, damping: 15 }
        },
        exit: (direction: Direction) => ({
            x: direction === 'forward' ? '-150%' : '150%', opacity: 1, scale:0.1, transition: { type: "spring", stiffness: 100, damping: 15 }
        }),
    };
    const backandforthButton = (inp:number)=>{
        if (inp===-1) {
            setActiveIndex(prev => prev === 0 ? components.length - 1 : prev - 1);
        }else if(inp===1){
            setActiveIndex(prev => prev === components.length - 1 ? 0 : prev + 1);
        }
    }

    const components = [
        { component: [<CareerHistoryComponents />], label: 'Riwayat Pekerjaan atau Karir'},
        { component: [<OrgInHistoryComponents />], label: 'Riwayat Organisasi Internal' },
        { component: [<ProjectHistoryComponents />], label: 'Riwayat Project yang Pernah Diikuti'},
        { component: [<ComiteeHistoryComponents/>], label: 'Riwayat Keikutsertaan Kepanitiaan'},
        { component: [<GKMHistoryComponents/>], label: 'Riwayat keikutesertaan GKM'},
        { component: [<MentorWantedComponents/>], label: 'Mentor yang Diinginkan'},
        { component: [<TrainingWantedComponents />], label: 'Training yang Ingin Diikuti'},
        { component: [<BestEmployeeComponents/>], label: 'Record menjadi Karyawan Terbaik'},
        { component: [<EmpCareerChoiceComponents/>], label: 'Keinginan Karyawan Dalam Mengembangkan Karir'},
        { component: [<CareerofMyChoiceComponents/>], label: 'Rencana Perjalanan Karir'}
    ];
    const total_components = components.length;
    

    return (
        <div className="grow flex flex-col px-5 py-5 w-full md:px-[5%] md:pt-[5%] md:pb-[2%] z-10 overflow-x-hidden">
            <div className="relative grow w-full flex flex-col overflow-y-auto overflow-x-hidden"> {/*MENAMPILKAN PERTANYAANNYA*/}
                
                
                <AnimatePresence initial={false} mode="sync" custom={direction}>

                    <motion.div
                        variants={variants}
                        initial="initial"
                        animate="target"
                        exit="exit"
                        custom={direction}
                        key={activeIndex}
                        className="w-full p-5 flex-col"
                        style={{ position: "absolute", width: "100%" }}
                        >
                            <h1 className={`${bitter.className} block text-lg mb-5 justify-self-center text-center`}><b>{components[activeIndex].label}</b></h1>
                            {components[activeIndex].component.map((Comp, index)=>(
                                <motion.div
                                key={index} 
                                initial={{ opacity: 0, scale: 0.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale:0.1 }}
                                transition={{ type: "spring", duration:0.5, stiffness: 250, damping: 15 }}
                                className="mb-2"
                            >{Comp}</motion.div>
                            ))}
                        </motion.div>

                </AnimatePresence>
            </div>
            <div> {/*UNTUK PAGINATION TOMBOLNNYA */}
                <PaginationFormHandler total_pages={total_components} page_number={activeIndex} changing_page={backandforthButton}/>
            </div>
        </div>
    )
}
