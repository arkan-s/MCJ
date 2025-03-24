'use client';
import { bitter } from '@/components/ui/fonts';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useRef, useEffect } from "react";
import { CareerHistoryComponents } from '@/components/ui/form_components/CareerHistoryComp';
import { OrgInHistoryComponents } from '@/components/ui/form_components/OrgIntHistoryComp';
import { PaginationFormHandler } from "@/components/ui/pagination/pagination";
import { ProjectHistoryComponents } from '@/components/ui/form_components/ProjectHistoryComp';
import { ComiteeHistoryComponents } from '@/components/ui/form_components/ComiteeHistoryComp';



export default function Form() {
    const components = [
        { component: [<CareerHistoryComponents />], label: 'Riwayat Pekerjaan atau Karir'},
        { component: [<OrgInHistoryComponents />], label: 'Riwayat Organisasi Internal' },
        { component: [<ProjectHistoryComponents />], label: 'Riwayat Project yang Pernah Diikuti'},
        { component: [<ComiteeHistoryComponents/>], label: 'Riwayat Keikutsertaan Kepanitiaan'}
    ];
    
    const total_components = components.length;
    

    return (
        <div className="grow flex bg-blue-500 flex-col px-5 py-5 w-full md:px-[5%] md:pt-[5%] md:pb-[2%] z-10 overflow-x-hidden">
            <div className="relative bg-red-500 grow w-full flex flex-col overflow-y-auto overflow-x-hidden"> {/*MENAMPILKAN PERTANYAANNYA*/}
                hello
                {/* CARD LAGI */}
                <div>
                    
                </div>
            </div>
            {/* <div> UNTUK PAGINATION TOMBOLNNYA */}
                {/* <PaginationFormHandler total_pages={total_components} page_number={activeIndex} changing_page={backandforthButton}/>
            </div> */}
        </div>
    )
}
