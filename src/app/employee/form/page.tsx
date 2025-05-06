'use client'
import { SelfCareerHistoryForm, SelfOrgIntHistoryForm, ProjectHistoryForm, ComiteeHistoryForm, TrainingWantedForm, GKMHistoryForm, MentorWantedForm, EmpCareerChoiceComponents, CareerofMyChoiceComponents, BestEmployeeComponents} from "./Form"
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { bitter } from "@/components/ui/fonts";
import { PaginationFormHandler } from "@/app/employee/form/FormPagination";
import { useRouter } from 'next/navigation';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getdatakaryawan } from "@/utils/fetchData";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import LoadingFullPage from "@/components/shared/loading/loading-fullpage";

const usePrevious = <T,>(val: T) => {
    const ref = useRef<undefined | T>(undefined);
    useEffect(() => {
        ref.current = val;
    });
    return ref.current;
}

export default function Form() {
    const { data: session } = useSession();
    
    const { data: dataKaryawan, isLoading: karyawanLoading, isError: karyawanError } = useQuery({
        queryKey: ['datakaryawan'],
        queryFn: () => getdatakaryawan(session?.user?.nik),
        refetchOnWindowFocus: false,
        enabled: !!session?.user?.nik,
        retry: 3, 
        retryDelay: attemptIndex => Math.min(1000 * 1 ** attemptIndex, 30000),
    })

    const [activeIndex, setActiveIndex] = useState(0);
    const previousIndex = usePrevious(activeIndex) ?? activeIndex;
    const [loadSubmit, setLoadSubmit] = useState<boolean>(false);
        
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
        { component: <SelfCareerHistoryForm />, label: 'Riwayat Pekerjaan atau Karir'},
        { component: <SelfOrgIntHistoryForm />, label: 'Riwayat Organisasi Internal' },
        { component: <ProjectHistoryForm />, label: 'Riwayat Project yang Pernah Diikuti'},
        { component: <ComiteeHistoryForm/>, label: 'Riwayat Keikutsertaan Kepanitiaan'},
        { component: <GKMHistoryForm/>, label: 'Riwayat keikutesertaan GKM'},
        { component: <MentorWantedForm/>, label: 'Mentor yang Diinginkan'},
        { component: <TrainingWantedForm />, label: 'Training yang Ingin Diikuti'},
        { component: <BestEmployeeComponents/>, label: 'Record menjadi Karyawan Terbaik'},
        { component: <EmpCareerChoiceComponents/>, label: 'Keinginan Karyawan Dalam Mengembangkan Karir'},
        { component: <CareerofMyChoiceComponents/>, label: 'Rencana Perjalanan Karir'}
    ];
    const total_components = components.length;

    if(session?.user.formFilled === 1){
        return (
            <div className={`flex text-xl text-gray-800 md:text-3xl md:leading-normal flex flex-col justify-center items-center grow bg-blue-50 w-full`}>
                <Image src="/image/logo-icbp.png" alt="logo icbp" width={300} height={60} />
                <h2 className="mt-4 text-center">Terima kasih karena sudah mengisi form data diri.</h2>
            </div>
        )
    }
    

    if (karyawanLoading) {
        return (
            <LoadingFullPage/>
        );
    }

    return (
        <div className="flex flex-col grow px-5 py-5 w-full md:px-3 md:my-3 z-10 overflow-x-hidden">
            <h1 className={`${bitter.className} block text-lg mb-5 justify-self-center text-center`}>
                <b>{components[activeIndex].label}</b>
            </h1>
            <div className="relative grow w-full flex flex-col overflow-y-auto overflow-x-hidden">
                {/* MENAMPILKAN PERTANYAAN */}
                <AnimatePresence initial={false} mode="sync" custom={direction}>
                    <motion.div
                        key={activeIndex} // Harus unik agar Framer Motion bisa melacak perubahan
                        variants={variants}
                        initial="initial"
                        animate="target"
                        exit="exit"
                        custom={direction}
                        transition={{ type: "spring", duration: 0.5, stiffness: 250, damping: 15 }}
                        className="w-full p-1 flex-col"
                        style={{ position: "absolute", width: "100%" }}
                    >
                        <div className="mb-2">{components[activeIndex].component}</div>
                    </motion.div>
                </AnimatePresence>
            </div>
            <AlertDialog open={loadSubmit} onOpenChange={setLoadSubmit}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle className="font-extrabold text-xl">Mengupload Data</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm">
                        Data sedang di-upload. Mohon tunggu sebentar.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/* UNTUK PAGINATION TOMBOLNYA */}
            <div>
                <PaginationFormHandler total_pages={total_components} page_number={activeIndex} changing_page={backandforthButton} submitLoading={setLoadSubmit}/>
            </div>
        </div>
    )
}