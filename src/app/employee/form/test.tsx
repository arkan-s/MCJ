'use client'
import * as contextHook from "@/hooks/context/formcontext"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod"
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { bitter } from "@/components/ui/fonts";
import { PaginationFormHandler } from "@/components/ui/pagination/pagination";

const usePrevious = <T,>(val: T) => {
    const ref = useRef<undefined | T>(undefined);
    useEffect(() => {
        ref.current = val;
    });
    return ref.current;
}

export default function Form() {
    const [positions, setPositions] = useState<{ namaPosition: string }[]>([]);
    const [levels, setLevels] = useState<any>([]);
    const [branches, setBranches] = useState<any>([]);
    const [depts, setDepts] = useState<any>([]);
    useEffect(() => {
    fetch("/api/position") // Ganti dengan URL API backend
        .then((response) => response.json()) // Parse response menjadi JSON
        .then((data) => setPositions(data)) // Simpan data ke state
        .catch((error) => console.error("Error fetching positions:", error));
    fetch("/api/level")
        .then((response) => response.json()) // Parse response menjadi JSON
        .then((data) => setLevels(data)) // Simpan data ke state
        .catch((error) => console.error("Error fetching levels:", error));
    fetch("/api/branch")
        .then((response) => response.json()) // Parse response menjadi JSON
        .then((data) => setBranches(data)) // Simpan data ke state
        .catch((error) => console.error("Error fetching branches:", error));
    fetch("/api/dept")
        .then((response) => response.json()) // Parse response menjadi JSON
        .then((data) => setDepts(data)) // Simpan data ke state
        .catch((error) => console.error("Error fetching depts", error));
    }, []);


    const [cherrors, setchErrors] = useState<Record<number, Partial<Record<keyof contextHook.CareerHistoryItem[0], string>>>>({});
    const { careerHistory, setCareerHistory } = contextHook.useCareerHistory()!;
    const [tempValue, setTempValue] = useState(careerHistory?.[indexComp]?.tanggalMulai || undefined);        
    const [tempEValue, setTempEValue] = useState(careerHistory?.[indexComp]?.tanggalBerakhir || undefined);        
    
    function SelfCareerHistoryForm(){

        const handleChange = (index: number, field: keyof contextHook.CareerHistoryItem[0], value: string | null | Date) => {
            setCareerHistory((careerHistory) => {
                const newHistory = [...careerHistory || contextHook.initialCareerHistoryVal];
                newHistory[index] = { ...newHistory[index], [field]: value };
                return newHistory;
            });
        
            // Validasi
            try {
                validationCH.element.shape[field].parse(value);
                setchErrors((prev) => ({
                    ...prev,
                    [index]: { ...prev[index], [field]: "" },
                }));
            } catch (error:any) {
                setchErrors((prev) => ({
                    ...prev,
                    [index]: { ...prev[index], [field]: error.errors[0].message },
                }));
            }
        };
        
    
    
        const validationCH = z.array(
            z.object({
                position: z.string().min(1, "Position tidak boleh kosong"),
                personnelArea: z.string().min(1, "Personnel Area tidak boleh kosong"),
                personnelSubarea: z.string().min(1, "Personnel Subarea tidak boleh kosong"),
                levelPosition: z.string().min(1, "Level Position tidak boleh kosong"),
                tanggalMulai: z.date().nullable().refine(val => val !== null, {
                    message: "Tanggal mulai tidak boleh kosong",
                }),
                tanggalBerakhir: z.date().nullable(),
                status: z.number(),
            })
        );
    
        const handleAddComponentCareerHistory = () => {
            setCareerHistory(careerHistory === null ?
                                    contextHook.initialCareerHistoryVal : 
                                    [...careerHistory, contextHook.initialCareerHistoryVal[0]]
                            )
        }
        const handleOnBlurCareerHistory = (valString: string = "", valDate: Date | null, whatdata: string, indexComp: number)=>{
                const newCareerHistory = careerHistory === undefined ? contextHook.initialCareerHistoryVal : careerHistory?.map(
                    (data, ind) => {
                        if (ind === indexComp) {
                            switch (whatdata) {
                                case "posisi":
                                    return {
                                        ...data,
                                        position: valString
                                    }
                                case "level":
                                    return {
                                        ...data,
                                        levelPosition: valString
                                    }
                                case "cabang":
                                    return {
                                        ...data,
                                        personnelArea: valString
                                    }
                                case "dept":
                                    return {
                                        ...data,
                                        personnelSubarea: valString
                                    }
                                case "startDate":
                                    return {
                                        ...data,
                                        tanggalMulai: valDate
                                    }
                                case "endDate":
                                    return {
                                        ...data,
                                        tanggalBerakhir: valDate
                                    }
                                default:
                                    return data;
                            }
                        } else {
                            return data;
                        }
                    }
                )
                return setCareerHistory(newCareerHistory === undefined ? contextHook.initialCareerHistoryVal : newCareerHistory)
            }
        function CareerHistoryremove(index:number){
            setCareerHistory(prevCareerHistory => 
                prevCareerHistory ? prevCareerHistory.filter((_, idx) => idx !== index) : []
            );
        }
    
        function CHCard({indexComp}:{indexComp:number}){
            return (
                <div className="flex flex-col md:flex-row md:items-center w-full bg-blue-100 my-2 p-2">
                    <div className="flex flex-col w-full md:w-11/12">
                        <div className="flex flex-wrap justify-between gap-1"> {/*ABOUT POSITION */} {/*AMBIL DATA BUAT BIKIN DROPDOWN LIST BUAT POSISI DAN CABANG*/}
                            <div className="flex flex-col gap-1 w-full md:w-[45%]">
                                <label htmlFor={`position${String(indexComp)}`}><b>Position</b></label>
                                <Select 
                                    onValueChange={(value) => {
                                        const trimmedValue = value.trim();
                                        if (trimmedValue === "") {
                                            return;
                                        }
                                        handleChange(indexComp, "position", trimmedValue);
                                        handleOnBlurCareerHistory(trimmedValue, new Date(), "posisi", indexComp);
                                        setchErrors((prev) => ({
                                            ...prev,
                                            [indexComp]: { ...prev[indexComp], position: "" },
                                        }));
                                    }}
                                    onOpenChange={(isOpen) => {
                                        if (!isOpen && !careerHistory?.[indexComp]?.position) {
                                            setchErrors((prev) => ({
                                                ...prev,
                                                [indexComp]: { ...prev[indexComp], position: "Posisi harus dipilih!" },
                                            }));
                                        }
                                    }}
                                    defaultValue=""
                                >
                                    <SelectTrigger className="border-2 border-zinc-300 w-full"> {/* Pastikan SelectTrigger juga w-full */}
                                        <SelectValue placeholder={careerHistory ? careerHistory[indexComp].position : "Pilih Posisi"}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {positions.map((pos, index) => (
                                            <SelectItem key={index} value={pos.namaPosition}>{pos.namaPosition}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {cherrors[indexComp]?.position && <p className="text-red-500">{cherrors[indexComp]?.position}</p>}
                            </div>
    
                            <div className="flex flex-col gap-1 w-full md:w-[45%]">
                                <label htmlFor={`levelPosition${String(indexComp)}`}><b>Level</b></label>
                                <Select 
                                    onValueChange={(value) => {
                                        const trimmedValue = value.trim();
                                        if (trimmedValue === "") {
                                            return;
                                        }
                                        handleChange(indexComp, "levelPosition", trimmedValue);
                                        handleOnBlurCareerHistory(trimmedValue, new Date(), "level", indexComp);
                                        setchErrors((prev) => ({
                                            ...prev,
                                            [indexComp]: { ...prev[indexComp], levelPosition: "" },
                                        }));
                                    }}
                                    onOpenChange={(isOpen) => {
                                        if (!isOpen && !careerHistory?.[indexComp]?.levelPosition) {
                                            setchErrors((prev) => ({
                                                ...prev,
                                                [indexComp]: { ...prev[indexComp], levelPosition: "Level harus dipilih!" },
                                            }));
                                        }
                                    }}
                                    defaultValue=""
                                >
                                    <SelectTrigger className="border-2 border-zinc-300 w-full"> {/* Pastikan SelectTrigger juga w-full */}
                                        <SelectValue placeholder={careerHistory ? careerHistory[indexComp].levelPosition : "Pilih Level"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {levels.map((lev:any, index:any) => (
                                            <SelectItem key={index} value={lev.namaLevel}>{lev.namaLevel}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {cherrors[indexComp]?.levelPosition && <p className="text-red-500">{cherrors[indexComp]?.levelPosition}</p>}
                            </div>
    
                            <div className="flex flex-col gap-1 w-full md:w-[45%]">
                                <label htmlFor={`branches${String(indexComp)}`}><b>Cabang</b></label>
                                <Select 
                                    onValueChange={(value) => {
                                        const trimmedValue = value.trim();
                                        if (trimmedValue === "") {
                                            return;
                                        }
                                        handleChange(indexComp, "personnelArea", trimmedValue);
                                        handleOnBlurCareerHistory(trimmedValue, new Date(), "cabang", indexComp);
                                        setchErrors((prev) => ({
                                            ...prev,
                                            [indexComp]: { ...prev[indexComp], personnelArea: "" },
                                        }));
                                    }}
                                    onOpenChange={(isOpen) => {
                                        if (!isOpen && !careerHistory?.[indexComp]?.personnelArea) {
                                            setchErrors((prev) => ({
                                                ...prev,
                                                [indexComp]: { ...prev[indexComp], personnelArea: "Cabang harus dipilih!" },
                                            }));
                                        }
                                    }}
                                    defaultValue=""
                                >
                                    <SelectTrigger className="border-2 border-zinc-300 w-full"> {/* Pastikan SelectTrigger juga w-full */}
                                        <SelectValue placeholder={careerHistory ? careerHistory[indexComp].personnelArea : "Pilih Cabang"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {branches.map((br:any, index:any) => (
                                            <SelectItem key={index} value={br.namaBranch}>{br.namaBranch}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {cherrors[indexComp]?.personnelArea && <p className="text-red-500">{cherrors[indexComp]?.personnelArea}</p>}
                            </div>
    
                            <div className="flex flex-col gap-1 w-full md:w-[45%]">
                                <label htmlFor={`depts${String(indexComp)}`}><b>Department</b></label>
                                <Select 
                                    onValueChange={(value) => {
                                        const trimmedValue = value.trim();
                                        if (trimmedValue === "") {
                                            return;
                                        }
                                        handleChange(indexComp, "personnelSubarea", trimmedValue);
                                        handleOnBlurCareerHistory(trimmedValue, new Date(), "dept", indexComp);
                                        setchErrors((prev) => ({
                                            ...prev,
                                            [indexComp]: { ...prev[indexComp], personnelSubarea: "" },
                                        }));
                                    }}
                                    onOpenChange={(isOpen) => {
                                        if (!isOpen && !careerHistory?.[indexComp]?.personnelSubarea) {
                                            setchErrors((prev) => ({
                                                ...prev,
                                                [indexComp]: { ...prev[indexComp], personnelSubarea: "Department harus dipilih!" },
                                            }));
                                        }
                                    }}
                                    defaultValue=""
                                >
                                    <SelectTrigger className="border-2 border-zinc-300 w-full"> {/* Pastikan SelectTrigger juga w-full */}
                                        <SelectValue placeholder={careerHistory ? careerHistory[indexComp].personnelSubarea : "Pilih Department"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {depts.map((dept:any, index:any) => (
                                            <SelectItem key={index} value={dept.namaDepartment}>{dept.namaDepartment}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {cherrors[indexComp]?.personnelSubarea && <p className="text-red-500">{cherrors[indexComp]?.personnelSubarea}</p>}
    
                            </div>
                        </div>
                        <div className={`${bitter.className} flex justify-between w-full md:flex-row flex-col`}> {/*ABOUT TIME */}
                            <div className="flex flex-col gap-1 w-full md:w-[45%]">
                                <label className="leading-loose" htmlFor={`tanggalMulai${String(indexComp)}`}>
                                    <b>Tanggal Mulai</b>
                                </label>
                                <input
                                    type="date"
                                    id={`tanggalMulai${String(indexComp)}`}
                                    name={`tanggalMulai${String(indexComp)}`}
                                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-500"
                                    value={tempValue === undefined ? "": !isNaN(Date.parse(tempValue.toISOString().split("T")[0])) ? tempValue.toISOString().split("T")[0] : "" }
                                    onChange={(e) => setTempValue(e.target.value === "" ? undefined : new Date(e.target.value))}
                                    onBlur={
                                        (e) => {
                                            if(isNaN(Date.parse(e.target.value))){
                                                handleOnBlurCareerHistory("", null, "startDate", indexComp);
                                                handleChange(indexComp, "tanggalMulai", null);
                                            } else {
                                                handleOnBlurCareerHistory("", new Date(e.target.value), "startDate", indexComp);
                                                handleChange(indexComp, "tanggalMulai", new Date(e.target.value));
                                            }
                                        }
                                    }
                                />
                            </div>
    
                            <div className="flex flex-col gap-1 w-full md:w-[45%]">
                                <label className="leading-loose" htmlFor={`tanggalBerakhir${String(indexComp)}`}>
                                    <b>Tanggal Berakhir</b>
                                </label>
                                <input
                                    type="date"
                                    id={`tanggalBerakhir${String(indexComp)}`}
                                    name={`tanggalBerakhir${String(indexComp)}`}
                                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-500"
                                    value={tempEValue === undefined ? "": !isNaN(Date.parse(tempEValue.toISOString().split("T")[0])) ? tempEValue.toISOString().split("T")[0] : "" }
                                    onChange={(e) => setTempEValue(e.target.value === "" ? undefined : new Date(e.target.value))}
                                    onBlur={
                                        (e) => {
                                            if(isNaN(Date.parse(e.target.value))){
                                                handleOnBlurCareerHistory("", null, "startDate", indexComp);
                                                handleChange(indexComp, "tanggalMulai", null);
                                            } else {
                                                handleOnBlurCareerHistory("", new Date(e.target.value), "startDate", indexComp);
                                                handleChange(indexComp, "tanggalMulai", new Date(e.target.value));
                                            }
                                        }
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end items-end md:items-center md:justify-center w-full md:w-1/12 md:mt-0 mt-2">
                        
                            <Button type="button" variant="destructive" size="icon" onClick={() => CareerHistoryremove(indexComp)}>
                                <Trash size={16} />
                            </Button>
                        
                    </div>
                </div>
            )
        }
    
        return (
            <div className="flex flex-col w-full h-fit px-2 pb-2">
                    <form>
                        {careerHistory?.map((e, indexcomp)=>{
                            console.log(careerHistory)
                            return(
                                <motion.div
                                    key={indexcomp}
                                    initial={{ opacity: 0, scale: 0.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale:0.1 }}
                                    transition={{ type: "spring", duration:1, stiffness: 250, damping: 15 }}
                                    className="mb-2"
                                >
                                    <CHCard indexComp={indexcomp}></CHCard>
                                </motion.div>
                            )
                        })}
                    </form>
                    <Button type="button" className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleAddComponentCareerHistory}
                    >
                        <span className='mr-[10px]'>
                            <svg
                            width={16}
                            height={16}
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-current"
                            >
                            <g clipPath="url(#clip0_906_8052)">
                                <path d="M13.1875 9.28125H10.6875V6.8125C10.6875 6.4375 10.375 6.125 9.96875 6.125C9.59375 6.125 9.28125 6.4375 9.28125 6.84375V9.3125H6.8125C6.4375 9.3125 6.125 9.625 6.125 10.0312C6.125 10.4062 6.4375 10.7187 6.84375 10.7187H9.3125V13.1875C9.3125 13.5625 9.625 13.875 10.0312 13.875C10.4062 13.875 10.7187 13.5625 10.7187 13.1562V10.6875H13.1875C13.5625 10.6875 13.875 10.375 13.875 9.96875C13.875 9.59375 13.5625 9.28125 13.1875 9.28125Z" />
                                <path d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.8125 19.4688 10.0312 19.4688C15.25 19.4688 19.5 15.2188 19.5 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.5625 18.0625 10C18.0625 14.4375 14.4375 18.0625 10 18.0625Z" />
                            </g>
                            <defs>
                                <clipPath id="clip0_906_8052">
                                <rect width={20} height={20} fill="white" />
                                </clipPath>
                            </defs>
                            </svg>
                        </span> Tambah Pengalaman Karir
                    </Button>
            </div>
        )
    }

    
    
    
    
    
    
    
    
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
    return (
        <contextHook.AllProviders>
        <div className="grow flex flex-col px-5 py-5 w-full md:px-[5%] md:pt-[5%] md:pb-[2%] z-10 overflow-x-hidden">
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
                        <h1 className={`${bitter.className} block text-lg mb-5 justify-self-center text-center`}>
                            <b>{components[activeIndex].label}</b>
                        </h1>
                        <div className="mb-2">{components[activeIndex].component}</div>
                    </motion.div>
                </AnimatePresence>
            </div>
            {/* UNTUK PAGINATION TOMBOLNYA */}
            <div>
                <PaginationFormHandler total_pages={total_components} page_number={activeIndex} changing_page={backandforthButton} />
            </div>
        </div>
    </contextHook.AllProviders>
    )
}


export function SelfOrgIntHistoryForm() {
    const [oierrors, setoiErrors] = useState<Record<number, Partial<Record<keyof contextHook.OrgIntHistoryItem[0], string>>>>({});

    const { orgIntHistory, setOrgIntHistory } = contextHook.useOrgIntHistory()!;
    
    const handleAddComponentOrgInt = () => {
        setOrgIntHistory(orgIntHistory === null ?
                                contextHook.initialOrgIntVal : 
                                [...orgIntHistory, contextHook.initialOrgIntVal[0]]
                        )
    }

    const handleOnBlurOrgInt = (valString: string = "", valDate: Date = new Date(), valNumber: number = 0, whatdata: string, indexComp: number)=>{
            const newOrgIntHistory = orgIntHistory === undefined ? contextHook.initialOrgIntVal : orgIntHistory?.map(
                (data, ind) => {
                    if (ind === indexComp) {
                        switch (whatdata) {
                            case "name":
                                return {
                                    ...data,
                                    name: valString
                                }
                            case "jabatan":
                                return {
                                    ...data,
                                    jabatan: valString
                                }
                            case "startYear":
                                return {
                                    ...data,
                                    startYear: valNumber
                                }
                            default:
                                return data;
                        }
                    } else {
                        return data;
                    }
                }
            )
            return setOrgIntHistory( newOrgIntHistory === undefined ? contextHook.initialOrgIntVal : newOrgIntHistory)
        }
    
    function OrgIntHistoryremove(index:number){
        setOrgIntHistory(prevOrgIntHistory => 
            prevOrgIntHistory ? prevOrgIntHistory.filter((_, idx) => idx !== index) : []
        );
    }

    const handleChange = (index: number, field: keyof contextHook.OrgIntHistoryItem[0], value: string | number) => {
        setOrgIntHistory((orgIntHistory) => {
            const newHistory = [...orgIntHistory || contextHook.initialOrgIntVal];
            newHistory[index] = { ...newHistory[index], [field]: value };
            return newHistory;
        });

        // Validasi
        try {
            validationOrgInt.element.shape[field].parse(value);
            setoiErrors((prev) => ({
                ...prev,
                [index]: { ...prev[index], [field]: "" },
            }));
        } catch (error: any) {
            setoiErrors((prev) => ({
                ...prev,
                [index]: { ...prev[index], [field]: error.errors[0].message },
            }));
        }
    };

    const validationOrgInt = z.array(
        z.object({
            name: z.string().min(1, "Name tidak boleh kosong"),
            jabatan: z.string().min(1, "Jabatan tidak boleh kosong"),
            startYear: z.number().min(1900, "Tahun mulai tidak valid").max(new Date().getFullYear(), "Tahun mulai tidak valid"),
        })
    );


    function OICard({indexComp}:{indexComp:number}){
        return (
            <div className="flex flex-col md:flex-row md:items-center w-full bg-blue-100 my-2 p-2">
                <div className="flex flex-col w-full md:w-11/12">
                    <div className={`${bitter.className} flex justify-between w-full md:flex-row md:flex-wrap flex-col`}> {/*ABOUT TIME */}
                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label className="leading-loose" htmlFor={`name${String(indexComp)}`}> <b>Nama Organisasi</b> </label>
                            <input
                                type="text"
                                id={`name${String(indexComp)}`}
                                name={`name${String(indexComp)}`}
                                onBlur={(e) => {
                                    handleOnBlurOrgInt(e.target.value, new Date(), 0, "name", indexComp);
                                    handleChange(indexComp, "name", e.target.value);
                                }}
                                placeholder={orgIntHistory ? String(orgIntHistory[indexComp].name) === "" ? "Nama Organisasi" : String(orgIntHistory[indexComp].name) : "Nama organisasi"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-500"
                                defaultValue=""
                            />
                            {oierrors[indexComp]?.name && <p className="text-red-500 text-sm">{oierrors[indexComp]?.name}</p>}
                        </div>
    
                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label className="leading-loose" htmlFor={`jabatan${String(indexComp)}`}> <b>Posisi</b> </label>
                            <input
                                type="text"
                                id={`jabatan${String(indexComp)}`}
                                name={`jabatan${String(indexComp)}`}
                                onBlur={(e) => {
                                    handleOnBlurOrgInt(e.target.value, new Date(), 0, "jabatan", indexComp);
                                    handleChange(indexComp, "jabatan", e.target.value);
                                }}
                                placeholder={orgIntHistory ? String(orgIntHistory[indexComp].jabatan) === "" ? "Nama Posisi" : String(orgIntHistory[indexComp].jabatan) : "Nama posisi"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-500"
                            />
                            {oierrors[indexComp]?.jabatan && <p className="text-red-500 text-sm">{oierrors[indexComp]?.jabatan}</p>}
                        </div>
    
                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label className="leading-loose" htmlFor={`tahunMulai${String(indexComp)}`}> <b>Tahun Mulai</b> </label>
                            <input
                                type="number"
                                id={`tahunMulai${String(indexComp)}`}
                                name={`tahunMulai${String(indexComp)}`}
                                onBlur={(e) => {
                                    let input: number = parseInt(e.target.value);
                                    if (Number.isNaN(input)) {
                                        input = 0;
                                    }
                                    handleOnBlurOrgInt("", new Date(), input, "startYear", indexComp)
                                    handleChange(indexComp, "startYear", input);
                                }}
                                placeholder={orgIntHistory ? String(orgIntHistory[indexComp].startYear) === "NaN" ? "Tahun masuk organisasi" : String(orgIntHistory[indexComp].startYear) : "Tahun masuk organisasi"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-500"
                            />
                            {oierrors[indexComp]?.startYear && <p className="text-red-500 text-sm">{oierrors[indexComp]?.startYear}</p>}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-end md:items-center md:justify-center w-full md:w-1/12 md:mt-0 mt-2">
                    <Button type="button" variant="destructive" size="icon" onClick={() => OrgIntHistoryremove(indexComp)}>
                        <Trash size={16} />
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full h-fit px-2 pb-2">
                <form>
                    {orgIntHistory?.map((e, indexcomp)=>{
                        console.log(orgIntHistory)
                        return(
                            <motion.div
                                key={indexcomp}
                                initial={{ opacity: 0, scale: 0.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale:0.1 }}
                                transition={{ type: "spring", duration:1, stiffness: 250, damping: 15 }}
                                className="mb-2"
                            >
                                <OICard indexComp={indexcomp}></OICard>
                            </motion.div>
                        )
                    })}
                </form>
                <Button type="button" className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleAddComponentOrgInt}
                >
                    <span className='mr-[10px]'>
                        <svg
                        width={16}
                        height={16}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-current"
                        >
                        <g clipPath="url(#clip0_906_8052)">
                            <path d="M13.1875 9.28125H10.6875V6.8125C10.6875 6.4375 10.375 6.125 9.96875 6.125C9.59375 6.125 9.28125 6.4375 9.28125 6.84375V9.3125H6.8125C6.4375 9.3125 6.125 9.625 6.125 10.0312C6.125 10.4062 6.4375 10.7187 6.84375 10.7187H9.3125V13.1875C9.3125 13.5625 9.625 13.875 10.0312 13.875C10.4062 13.875 10.7187 13.5625 10.7187 13.1562V10.6875H13.1875C13.5625 10.6875 13.875 10.375 13.875 9.96875C13.875 9.59375 13.5625 9.28125 13.1875 9.28125Z" />
                            <path d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.8125 19.4688 10.0312 19.4688C15.25 19.4688 19.5 15.2188 19.5 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.5625 18.0625 10C18.0625 14.4375 14.4375 18.0625 10 18.0625Z" />
                        </g>
                        <defs>
                            <clipPath id="clip0_906_8052">
                            <rect width={20} height={20} fill="white" />
                            </clipPath>
                        </defs>
                        </svg>
                    </span> Tambah Pengalaman Karir
                </Button>
        </div>
    )
}


export function ProjectHistoryForm() {
    const [pherrors, setphErrors] = useState<Record<number, Partial<Record<keyof contextHook.ProjectHistoryItem[0], string>>>>({});

    const { projectHistory, setProjectHistory } = contextHook.useProjectHistory()!;
    
    const handleAddComponentProject = () => {
        setProjectHistory(projectHistory === null ?
            contextHook.initialProjectHistoryVal :
            [...projectHistory, contextHook.initialProjectHistoryVal[0]]
        );
    };

    const handleOnBlurProject = (valString = "", valNumber = 0, whatdata: string, indexComp: number) => {
        const newProjectHistory = projectHistory === undefined ? contextHook.initialProjectHistoryVal : projectHistory?.map(
            (data:any, ind:any) => {
                if (ind === indexComp) {
                    switch (whatdata) {
                        case "name":
                            return { ...data, name: valString };
                        case "year":
                            return { ...data, year: valNumber };
                        case "peran":
                            return { ...data, peran: valString };
                        case "shortDesc":
                            return { ...data, shortDesc: valString };
                        default:
                            return data;
                    }
                } else {
                    return data;
                }
            }
        );
        setProjectHistory(newProjectHistory === undefined ? contextHook.initialProjectHistoryVal : newProjectHistory);
    };
    
    function removeProjectHistory(index:any) {
        setProjectHistory(prevProjectHistory => 
            prevProjectHistory ? prevProjectHistory.filter((_, idx) => idx !== index) : []
        );
    }

    const handleChange = (index: number, field: keyof contextHook.ProjectHistoryItem[0], value: string | number) => {
        setProjectHistory((projectHistory) => {
            const newHistory = [...projectHistory || contextHook.initialProjectHistoryVal];
            newHistory[index] = { ...newHistory[index], [field]: value };
            return newHistory;
        });

        // Validasi
        try {
            validationProject.element.shape[field].parse(value);
            setphErrors((prev) => ({
                ...prev,
                [index]: { ...prev[index], [field]: "" },
            }));
        } catch (error: any) {
            setphErrors((prev) => ({
                ...prev,
                [index]: { ...prev[index], [field]: error.errors[0].message },
            }));
        }
    };

    const validationProject = z.array(
        z.object({
            name: z.string().min(1, "Name tidak boleh kosong"),
            year: z.number().min(1900, "Tahun proyek tidak valid").max(new Date().getFullYear(), "Tahun proyek tidak valid"),
            peran: z.string().min(1, "Peran tidak boleh kosong"),
            shortDesc: z.string().min(1, "Deskripsi singkat tidak boleh kosong"),
        })
    );

    function ProjectCard({ indexComp }:{indexComp:number}) {
        return (
            <div className="flex flex-col md:flex-row md:items-center w-full bg-blue-100 my-2 p-2">
                <div className="flex flex-col md:flex-row md:flex-wrap w-full md:w-11/12">
                    <div className="flex justify-between w-full md:flex-row md:flex-wrap flex-col">
                        <div className="flex flex-col gap-1 w-full">
                            <label className="leading-loose" htmlFor={`name${indexComp}`}>
                                <b>Nama Proyek</b>
                            </label>
                            <input
                                type="text"
                                id={`name${indexComp}`}
                                name={`name${indexComp}`}
                                placeholder={projectHistory ? (projectHistory[indexComp].name || "Nama Proyek") : "Nama Proyek"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onBlur={(e) => {
                                    handleOnBlurProject(e.target.value, 0, "name", indexComp);
                                    handleChange(indexComp, "name", e.target.value);
                                }}
                            />
                            {pherrors[indexComp]?.name && <p className="text-red-500 text-sm">{pherrors[indexComp]?.name}</p>}
                        </div>
                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label className="leading-loose" htmlFor={`year${indexComp}`}>
                                <b>Tahun</b>
                            </label>
                            <input
                                type="number"
                                id={`year${indexComp}`}
                                name={`year${indexComp}`}
                                placeholder={projectHistory ? String(projectHistory[indexComp].year || "Tahun") : "Tahun"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onBlur={(e) => {
                                    let input: number = parseInt(e.target.value);
                                    if (Number.isNaN(input)) {
                                        input = 0;
                                    }
                                    handleChange(indexComp, "year", input);
                                    handleOnBlurProject(e.target.value, input, "year", indexComp);
                                }}
                            />
                            {pherrors[indexComp]?.year && <p className="text-red-500 text-sm">{pherrors[indexComp]?.year}</p>}
                        </div>
                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label className="leading-loose" htmlFor={`peran${indexComp}`}>
                                <b>Peran</b>
                            </label>
                            <input
                                type="text"
                                id={`peran${indexComp}`}
                                name={`peran${indexComp}`}
                                placeholder={projectHistory ? (projectHistory[indexComp].peran || "Peran") : "Peran"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onBlur={(e) => {
                                    handleChange(indexComp, "peran", e.target.value);
                                    handleOnBlurProject(e.target.value, 0, "peran", indexComp);
                                }}
                            />
                            {pherrors[indexComp]?.peran && <p className="text-red-500 text-sm">{pherrors[indexComp]?.peran}</p>}
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <label className="leading-loose" htmlFor={`shortDesc${indexComp}`}>
                                <b>Short Desc</b>
                            </label>
                            <textarea
                                id={`shortDesc${indexComp}`}
                                name={`shortDesc${indexComp}`}
                                rows={5}
                                placeholder={projectHistory ? (projectHistory[indexComp].shortDesc || "Deskripsi pekerjaan secara singkat") : "Deskripsi pekerjaan secara singkat"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-visible"
                                onBlur={(e) => {
                                    handleChange(indexComp, "shortDesc", e.target.value);
                                    handleOnBlurProject(e.target.value, 0, "shortDesc", indexComp);
                                }}
                            />
                            {pherrors[indexComp]?.shortDesc && <p className="text-red-500 text-sm">{pherrors[indexComp]?.shortDesc}</p>}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-end md:items-center md:justify-center w-full md:w-1/12 md:mt-0 mt-2">
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeProjectHistory(indexComp)}>
                        <Trash size={16} />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-fit px-2 pb-2">
            <form>
                {projectHistory?.map((_, indexcomp) => (
                    <motion.div
                        key={indexcomp}
                        initial={{ opacity: 0, scale: 0.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.1 }}
                        transition={{ type: "spring", duration: 1, stiffness: 250, damping: 15 }}
                        className="mb-2"
                    >
                        <ProjectCard indexComp={indexcomp} />
                    </motion.div>
                ))}
            </form>
            <Button type="button" className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleAddComponentProject}
            >
                <span className='mr-[10px]'>
                        <svg
                        width={16}
                        height={16}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-current"
                        >
                        <g clipPath="url(#clip0_906_8052)">
                            <path d="M13.1875 9.28125H10.6875V6.8125C10.6875 6.4375 10.375 6.125 9.96875 6.125C9.59375 6.125 9.28125 6.4375 9.28125 6.84375V9.3125H6.8125C6.4375 9.3125 6.125 9.625 6.125 10.0312C6.125 10.4062 6.4375 10.7187 6.84375 10.7187H9.3125V13.1875C9.3125 13.5625 9.625 13.875 10.0312 13.875C10.4062 13.875 10.7187 13.5625 10.7187 13.1562V10.6875H13.1875C13.5625 10.6875 13.875 10.375 13.875 9.96875C13.875 9.59375 13.5625 9.28125 13.1875 9.28125Z" />
                            <path d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.8125 19.4688 10.0312 19.4688C15.25 19.4688 19.5 15.2188 19.5 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.5625 18.0625 10C18.0625 14.4375 14.4375 18.0625 10 18.0625Z" />
                        </g>
                        <defs>
                            <clipPath id="clip0_906_8052">
                            <rect width={20} height={20} fill="white" />
                            </clipPath>
                        </defs>
                        </svg>
                    </span>
                Tambah Proyek
            </Button>
        </div>
    );
}


export function ComiteeHistoryForm() {
    const [comerrors, setcomErrors] = useState<Record<number, Partial<Record<keyof contextHook.ComiteeHistoryItem[0], string>>>>({});

    const { comiteeHistory, setComiteeHistory } = contextHook.useComiteeHistory()!;
    
    const handleAddComponentComitee = () => {
        setComiteeHistory(comiteeHistory === null ?
            contextHook.initialComiteeHistoryVal :
            [...comiteeHistory, contextHook.initialComiteeHistoryVal[0]]
        );
    };

    const handleOnBlurComitee = (valString = "", valNumber = 0, whatdata: string, indexComp: number) => {
        const newComiteeHistory = comiteeHistory === undefined ? contextHook.initialComiteeHistoryVal : comiteeHistory?.map(
            (data:any, ind:any) => {
                if (ind === indexComp) {
                    switch (whatdata) {
                        case "name":
                            return { ...data, name: valString };
                        case "year":
                            return { ...data, year: valNumber };
                        case "jabatan":
                            return { ...data, jabatan: valString };
                        default:
                            return data;
                    }
                } else {
                    return data;
                }
            }
        );
        setComiteeHistory(newComiteeHistory === undefined ? contextHook.initialComiteeHistoryVal : newComiteeHistory);
    };
    
    function removeComiteeHistory(index:any) {
        setComiteeHistory(prevComiteeHistory => 
            prevComiteeHistory ? prevComiteeHistory.filter((_, idx) => idx !== index) : []
        );
    }

    const handleChange = (index: number, field: keyof contextHook.ComiteeHistoryItem[0], value: string | number) => {
        setComiteeHistory((comiteeHistory) => {
            const newHistory = [...comiteeHistory || contextHook.initialComiteeHistoryVal];
            newHistory[index] = { ...newHistory[index], [field]: value };
            return newHistory;
        });

        // Validasi
        try {
            validationComitee.element.shape[field].parse(value);
            setcomErrors((prev) => ({
                ...prev,
                [index]: { ...prev[index], [field]: "" },
            }));
        } catch (error: any) {
            setcomErrors((prev) => ({
                ...prev,
                [index]: { ...prev[index], [field]: error.errors[0].message },
            }));
        }
    };

    const validationComitee = z.array(
        z.object({
            name: z.string().min(1, "Name tidak boleh kosong"),
            jabatan: z.string().min(1, "Jabatan tidak boleh kosong"),
            year: z.number().min(1900, "Tahun tidak valid").max(new Date().getFullYear(), "Tahun tidak valid"),
        })
    );


    function ComiteeCard({ indexComp }:{indexComp:number}) {
        return (
            <div className="flex flex-col md:flex-row md:items-center w-full bg-blue-100 my-2 p-2">
                <div className="flex flex-col w-full md:w-11/12">
                    <div className="flex justify-between w-full md:flex-row md:flex-wrap flex-col">
                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label className="leading-loose" htmlFor={`name${indexComp}`}>
                                <b>Nama Acara</b>
                            </label>
                            <input
                                type="text"
                                id={`name${indexComp}`}
                                name={`name${indexComp}`}
                                placeholder={comiteeHistory ? (comiteeHistory[indexComp].name || "Nama Acara") : "Nama Acara"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onBlur={(e) => handleChange(indexComp, "name", e.target.value)}
                            />
                            {comerrors[indexComp]?.name && <p className="text-red-500 text-sm">{comerrors[indexComp]?.name}</p>}
                        </div>
                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label className="leading-loose" htmlFor={`year${indexComp}`}>
                                <b>Tahun</b>
                            </label>
                            <input
                                type="number"
                                id={`year${indexComp}`}
                                name={`year${indexComp}`}
                                placeholder={comiteeHistory ? String(comiteeHistory[indexComp].year || "Tahun") : "Tahun"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onBlur={(e) => handleChange(indexComp, "year", parseInt(e.target.value))}
                            />
                            {comerrors[indexComp]?.year && <p className="text-red-500 text-sm">{comerrors[indexComp]?.year}</p>}
                        </div>
                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label className="leading-loose" htmlFor={`jabatan${indexComp}`}>
                                <b>Jabatan</b>
                            </label>
                            <input
                                type="text"
                                id={`jabatan${indexComp}`}
                                name={`jabatan${indexComp}`}
                                placeholder={comiteeHistory ? (comiteeHistory[indexComp].jabatan || "Jabatan atau peran") : "Jabatan atau peran"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onBlur={(e) => handleChange(indexComp, "jabatan", e.target.value)}
                            />
                            {comerrors[indexComp]?.jabatan && <p className="text-red-500 text-sm">{comerrors[indexComp]?.jabatan}</p>}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-end md:items-center md:justify-center w-full md:w-1/12 md:mt-0 mt-2">
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeComiteeHistory(indexComp)}>
                        <Trash size={16} />
                    </Button>
                </div>
            </div>
        );
    }
    

    return (
        <div className="flex flex-col w-full h-fit px-2 pb-2">
            <form>
                {comiteeHistory?.map((_, indexcomp) => (
                    <motion.div
                        key={indexcomp}
                        initial={{ opacity: 0, scale: 0.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.1 }}
                        transition={{ type: "spring", duration: 1, stiffness: 250, damping: 15 }}
                        className="mb-2"
                    >
                        <ComiteeCard indexComp={indexcomp} />
                    </motion.div>
                ))}
            </form>
            <Button type="button" className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleAddComponentComitee}
            >
                <span className='mr-[10px]'>
                        <svg
                        width={16}
                        height={16}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-current"
                        >
                        <g clipPath="url(#clip0_906_8052)">
                            <path d="M13.1875 9.28125H10.6875V6.8125C10.6875 6.4375 10.375 6.125 9.96875 6.125C9.59375 6.125 9.28125 6.4375 9.28125 6.84375V9.3125H6.8125C6.4375 9.3125 6.125 9.625 6.125 10.0312C6.125 10.4062 6.4375 10.7187 6.84375 10.7187H9.3125V13.1875C9.3125 13.5625 9.625 13.875 10.0312 13.875C10.4062 13.875 10.7187 13.5625 10.7187 13.1562V10.6875H13.1875C13.5625 10.6875 13.875 10.375 13.875 9.96875C13.875 9.59375 13.5625 9.28125 13.1875 9.28125Z" />
                            <path d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.8125 19.4688 10.0312 19.4688C15.25 19.4688 19.5 15.2188 19.5 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.5625 18.0625 10C18.0625 14.4375 14.4375 18.0625 10 18.0625Z" />
                        </g>
                        <defs>
                            <clipPath id="clip0_906_8052">
                            <rect width={20} height={20} fill="white" />
                            </clipPath>
                        </defs>
                        </svg>
                    </span>
                Tambah Pengalaman Kepanitiaan
            </Button>
        </div>
    );
}


export function TrainingWantedForm() {
    const [trainingErrors, setTrainingErrors] = useState<Record<number, string>>({});

    const { trainingWanted, setTrainingWanted } = contextHook.useTrainingWanted()!;
    
    const handleAddTraining = () => {
        setTrainingWanted(trainingWanted === null ? [""] : [...trainingWanted, ""]);
    };

    const handleOnBlurTraining = (valString = "", indexComp: number) => {
        const newTrainingWanted = trainingWanted?.map((data, ind) => (
            ind === indexComp ? valString : data
        ));
        setTrainingWanted(newTrainingWanted ?? [""]);
    };
    
    function removeTraining(index: number) {
        setTrainingWanted(prevTrainingWanted => 
            prevTrainingWanted ? prevTrainingWanted.filter((_, idx) => idx !== index) : []
        );
    }

    const handleTrainingChange = (index: number, value: string) => {
        setTrainingWanted((trainingWanted) => {
            const newTraining = [...trainingWanted || [""]];
            newTraining[index] = value;
            return newTraining;
        });

        // Validasi
        try {
            validationTraining.parse(value);
            setTrainingErrors((prev) => ({
                ...prev,
                [index]: "",
            }));
        } catch (error: any) {
            setTrainingErrors((prev) => ({
                ...prev,
                [index]: error.errors[0].message,
            }));
        }
    };

    const validationTraining = z.string().min(1, "Training tidak boleh kosong");


    function TrainingCard({ indexComp }: { indexComp: number }) {
        return (
            <div className="flex flex-col md:flex-row md:items-center w-full bg-blue-100 my-2 p-2">
                <div className="flex flex-col w-full md:w-11/12">
                    <div className="flex flex-col gap-1 w-full">
                        <input
                            type="text"
                            id={`training${indexComp}`}
                            name={`training${indexComp}`}
                            placeholder={trainingWanted ? (trainingWanted[indexComp] || "Judul atau topik pelatihan") : "Judul atau topik pelatihan"}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onBlur={(e) => handleTrainingChange(indexComp, e.target.value)}
                        />
                        {trainingErrors[indexComp] && (
                            <p className="text-red-500 text-sm mt-1">{trainingErrors[indexComp]}</p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end items-end md:items-center md:justify-center w-full md:w-1/12 md:mt-0 mt-2">
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeTraining(indexComp)}>
                        <Trash size={16} />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-fit px-2 pb-2">
            <form>
                {trainingWanted?.map((_, indexComp) => (
                    <motion.div
                        key={indexComp}
                        initial={{ opacity: 0, scale: 0.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.1 }}
                        transition={{ type: "spring", duration: 1, stiffness: 250, damping: 15 }}
                        className="mb-2"
                    >
                        <TrainingCard indexComp={indexComp} />
                    </motion.div>
                ))}
            </form>
            <Button type="button" className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleAddTraining}
            >
                <span className='mr-[10px]'>
                        <svg
                        width={16}
                        height={16}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-current"
                        >
                        <g clipPath="url(#clip0_906_8052)">
                            <path d="M13.1875 9.28125H10.6875V6.8125C10.6875 6.4375 10.375 6.125 9.96875 6.125C9.59375 6.125 9.28125 6.4375 9.28125 6.84375V9.3125H6.8125C6.4375 9.3125 6.125 9.625 6.125 10.0312C6.125 10.4062 6.4375 10.7187 6.84375 10.7187H9.3125V13.1875C9.3125 13.5625 9.625 13.875 10.0312 13.875C10.4062 13.875 10.7187 13.5625 10.7187 13.1562V10.6875H13.1875C13.5625 10.6875 13.875 10.375 13.875 9.96875C13.875 9.59375 13.5625 9.28125 13.1875 9.28125Z" />
                            <path d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.8125 19.4688 10.0312 19.4688C15.25 19.4688 19.5 15.2188 19.5 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.5625 18.0625 10C18.0625 14.4375 14.4375 18.0625 10 18.0625Z" />
                        </g>
                        <defs>
                            <clipPath id="clip0_906_8052">
                            <rect width={20} height={20} fill="white" />
                            </clipPath>
                        </defs>
                        </svg>
                    </span>
                Tambah Pelatihan
            </Button>
        </div>
    );
}


export function GKMHistoryForm() {
    const [gkmErrors, setGkmErrors] = useState<Partial<Record<keyof contextHook.GKMHistoryItem, string>>>({});

    const { gkmHistory, setGkmHistory } = contextHook.useGKMHistory()!;

    const handleOnBlurGKM = (valString: string, valNumber: number, whatdata: string) => {
        setGkmHistory(prevGkmHistory => {
            if (!prevGkmHistory) return { amountOfTime: 0, highestPosition: "" };
            
            switch (whatdata) {
                case "amountOfTime":
                    return { ...prevGkmHistory, amountOfTime: valNumber };
                case "highestPosition":
                    return { ...prevGkmHistory, highestPosition: valString };
                default:
                    return prevGkmHistory;
            }
        });
    };
    
    const handleGkmChange = (field: keyof contextHook.GKMHistoryItem, value: string | number) => {
        setGkmHistory((prev) => {
            if (!prev) return { amountOfTime: 0, highestPosition: "" };
            return { ...prev, [field]: value };
        });
        
        // Validasi
        try {
            validationGkm.shape[field].parse(value);
            setGkmErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        } catch (error: any) {
            setGkmErrors((prev) => ({
                ...prev,
                [field]: error.errors[0].message,
            }));
        }
    };

    const validationGkm = z.object({
        amountOfTime: z.number().min(1, "Waktu tidak valid"),
        highestPosition: z.string().min(1, "Posisi tidak boleh kosong"),
    });


    return (
        <div className="flex flex-col w-full h-fit px-2 pb-2">
            <form>
                <div className="flex flex-col w-full bg-blue-100 my-2 p-2">
                    <div className="flex flex-col w-full">
                        <div className="flex justify-between w-full flex-col">
                            <div className="flex flex-col gap-1 w-full ">
                                <label className="leading-loose" htmlFor="amountOfTime">
                                    <b>Banyak Keikutsertaan</b>
                                </label>
                                <input
                                    type="number"
                                    id="amountOfTime"
                                    name="amountOfTime"
                                    placeholder={gkmHistory ? String(gkmHistory.amountOfTime || "Banyak Keikutsertaan") : "Banyak Keikutsertaan"}
                                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onBlur={(e) => handleGkmChange("amountOfTime", parseInt(e.target.value))}
                                />
                                {gkmErrors.amountOfTime && (
                                    <p className="text-red-500 text-sm mt-1">{gkmErrors.amountOfTime}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1 w-full ">
                                <label className="leading-loose" htmlFor="highestPosition">
                                    <b>Jabatan Tertinggi</b>
                                </label>
                                <input
                                    type="text"
                                    id="highestPosition"
                                    name="highestPosition"
                                    placeholder={gkmHistory ? (gkmHistory.highestPosition || "Jabatan Tertinggi") : "Jabatan Tertinggi"}
                                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onBlur={(e) => handleGkmChange("highestPosition", e.target.value)}
                                />
                                {gkmErrors.highestPosition && (
                                    <p className="text-red-500 text-sm mt-1">{gkmErrors.highestPosition}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
    
}


export function MentorWantedForm() {
    const [mentorErrors, setMentorErrors] = useState<Partial<Record<keyof contextHook.MentorWanted, string>>>({});

    const [positions, setPositions] = useState<{ namaPosition: string }[]>([]);
    const [branches, setBranches] = useState<any>([]);
    useEffect(() => {
    fetch("/api/position") // Ganti dengan URL API backend
        .then((response) => response.json()) // Parse response menjadi JSON
        .then((data) => setPositions(data)) // Simpan data ke state
        .catch((error) => console.error("Error fetching positions:", error));
    fetch("/api/branch") // Ganti dengan URL API backend
    .then((response) => response.json()) // Parse response menjadi JSON
    .then((data) => setBranches(data)) // Simpan data ke state
    .catch((error) => console.error("Error fetching branch:", error));
    }, [])

    const { mentorWanted, setMentorWanted } = contextHook.useMentorWanted()!;

    const handleMentorChange = (field: keyof contextHook.MentorWanted, value: string) => {
        setMentorWanted((prev) => ({ ...prev, [field]: value } as contextHook.MentorWanted));
        
        // Validasi
        try {
            validationMentor.shape[field].parse(value);
            setMentorErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        } catch (error: any) {
            setMentorErrors((prev) => ({
                ...prev,
                [field]: error.errors[0].message,
            }));
        }
    };

    const validationMentor = z.object({
        name: z.string().min(1, "Nama mentor tidak boleh kosong"),
        jabatan: z.string().min(1, "Jabatan mentor tidak boleh kosong"),
        cabang: z.string().min(1, "Cabang mentor tidak boleh kosong"),
    });
    const handleOnBlurMentor = (valString: string, field: "name" | "jabatan" | "cabang") => {
        setMentorWanted(prev => prev ? { ...prev, [field]: valString } : { name: "", jabatan: "", cabang: "" });
    };

    return (
        <div className="flex flex-col w-full h-fit px-2 pb-2">
            <form>
                <div className="flex flex-col md:flex-row md:items-center w-full bg-blue-100 my-2 p-2">
                    <div className="flex flex-col w-full">
                        <div className="flex justify-between w-full md:flex-row md:flex-wrap flex-col">
                            <div className="flex flex-col gap-1 w-full">
                                <label className="leading-loose" htmlFor="mentorName">
                                    <b>Nama Mentor</b>
                                </label>
                                <input
                                    type="text"
                                    id="mentorName"
                                    name="mentorName"
                                    placeholder={mentorWanted?.name || "Nama Mentor"}
                                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onBlur={(e) => handleOnBlurMentor(e.target.value, "name")}
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-full md:w-[45%]">
                                <label className="leading-loose" htmlFor="mentorJabatan">
                                    <b>Jabatan</b>
                                </label>
                                <Select 
                                    onValueChange={(value) => {
                                        const trimmedValue = value.trim();
                                        if (trimmedValue === "") {
                                            return;
                                        }
                                        handleOnBlurMentor(trimmedValue, "jabatan");
                                    }}
                                    defaultValue=""
                                >
                                    <SelectTrigger className="border-2 border-zinc-300 w-full"> {/* Pastikan SelectTrigger juga w-full */}
                                        <SelectValue placeholder={mentorWanted ? mentorWanted.jabatan : "Pilih Posisi"}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {positions.map((pos, index) => (
                                            <SelectItem key={index} value={pos.namaPosition}>{pos.namaPosition}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-1 w-full md:w-[45%]">
                                <label className="leading-loose" htmlFor="mentorCabang">
                                    <b>Cabang</b>
                                </label>
                                <Select 
                                    onValueChange={(value) => {
                                        const trimmedValue = value.trim();
                                        if (trimmedValue === "") {
                                            return;
                                        }
                                        handleOnBlurMentor(trimmedValue, "cabang");
                                    }}
                                    defaultValue=""
                                >
                                    <SelectTrigger className="border-2 border-zinc-300 w-full"> {/* Pastikan SelectTrigger juga w-full */}
                                        <SelectValue placeholder={mentorWanted ? mentorWanted.cabang : "Pilih Cabang"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {branches.map((br:any, index:any) => (
                                            <SelectItem key={index} value={br.namaBranch}>{br.namaBranch}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export function EmpCareerChoiceComponents(){
    const { empCareerChoice, setEmpCareerChoice } = contextHook.useEmpCareerChoice()!;
    const interested = (val:boolean) => {
        setEmpCareerChoice(
            {   careerDevWill: val,
                rotationWill: null,
                crossDeptWill: null
            }
        )
    };
    const rotWill = (val: boolean) => {
        setEmpCareerChoice((prev) => {
            if (!prev) return null;
            return { ...prev, rotationWill: val };
        });
    };
    
    const CDWill = (val: boolean) => {
        setEmpCareerChoice((prev) => {
            if (!prev) return null;
            return { ...prev, crossDeptWill: val };
        });
    };

    function EmpCareerChoiceComponent(){
        return (
            <div className={`${bitter.className} block flex-col gap-5 shadow-lg p-3 w-auto h-auto bg-white rounded-lg`}>
                <div>
                    <h3 className="mb-1 mt-3 text-lg font-medium text-gray-900">Are you interested to take your career journey to the next level?</h3>
                    <div className="flex justify-around">
                        <button onClick={()=>{interested(true)}} className={`border text-md font-semibold px-4 rounded-md w-[45%] h-[30px]  md:w-[35%] shadow-md active:bg-blue-500
                        ${empCareerChoice?.careerDevWill === true ? "bg-blue-600 text-white shadow-inner border-white-400" : "bg-blue-50 border-blue-500 text-blue-500 opacity-[0.7] hover:opacity-[1] hover:bg-blue-400 hover:text-white"}
                    `}>YES</button>
                        <button onClick={()=>{interested(false)}} className={`border border-zinc-500 text-md font-semibold px-4 rounded-md w-[45%] h-[30px]  md:w-[35%] active:bg-zinc-400
                        ${empCareerChoice?.careerDevWill === false ? "bg-zinc-600 text-white" : "opacity-[0.5] hover:bg-zinc-200 hover:opacity-[1]"}
                    `}>NO</button>
                    </div>
                </div>
                <div className={`${empCareerChoice?.careerDevWill === true? 'block' : 'hidden'}`}>
                    <h3 className="mb-1 mt-3 text-lg font-medium text-gray-900">Do you want to get rotated to another branch?</h3>
                    <div className="flex justify-around">
                        <button onClick={()=>{rotWill(true)}} className={`border text-md font-semibold px-4 rounded-md w-[45%] h-[30px]  md:w-[35%] shadow-md active:bg-blue-500
                        ${empCareerChoice?.rotationWill === true ? "bg-blue-600 text-white shadow-inner border-white-400" : "bg-blue-50 border-blue-500 text-blue-500 opacity-[0.6] hover:opacity-[1] hover:bg-blue-400 hover:text-white"}
                    `}>YES</button>
                        <button onClick={()=>{rotWill(false)}} className={`border border-zinc-500 text-md font-semibold px-4 rounded-md w-[45%] h-[30px]  md:w-[35%] active:bg-zinc-400
                        ${empCareerChoice?.rotationWill === false ? "bg-zinc-600 text-white" : "opacity-[0.5] hover:bg-zinc-200 hover:opacity-[1]"}
                    `}>NO</button>
                    </div>
                    <h3 className="mb-1 mt-3 text-lg font-medium text-gray-900">Are you interested in having career in another departement?</h3>
                    <div className="flex justify-around">
                        <button onClick={()=>{CDWill(true)}} className={`border text-md font-semibold px-4 rounded-md w-[45%] h-[30px]  md:w-[35%] shadow-md active:bg-blue-500
                        ${empCareerChoice?.crossDeptWill === true ? "bg-blue-600 text-white shadow-inner border-white-400" : "bg-blue-50 border-blue-500 text-blue-500 opacity-[0.6] hover:opacity-[1] hover:bg-blue-400 hover:text-white"}
                    `}>YES</button>
                        <button onClick={()=>{CDWill(false)}} className={`border border-zinc-500 text-md font-semibold px-4 rounded-md w-[45%] h-[30px]  md:w-[35%] active:bg-zinc-400
                        ${empCareerChoice?.crossDeptWill === false ? "bg-zinc-600 text-white" : "opacity-[0.5] hover:bg-zinc-200 hover:opacity-[1]"}
                    `}>NO</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <form>
            <EmpCareerChoiceComponent></EmpCareerChoiceComponent>
        </form>
    )
}

export function CareerofMyChoiceComponents(){
    function CareerOfMyChoiceComp(){
        return (
            <div className={`${bitter.className} block flex-col shadow-lg p-3 w-auto h-auto bg-white rounded-lg`}>
                <div className="flex flex-wrap justify-between gap-1 mb-5"> 
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor={`short`}><b>Short Term Career Plan</b></label>
                        <input
                            type="text"
                            id={`short`}
                            name={`short`}
                            className="border border-gray-300 rounded-md p-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={
                                !careerOfMyChoice || !careerOfMyChoice.short || careerOfMyChoice.short === "" ?
                                    "Rencana karir untuk 1-3 tahun?":
                                    careerOfMyChoice.short
                            }
                            onBlur={
                                (e)=>{
                                    const previousValue = e.target.defaultValue; 
                                    const trimmedValue = e.target.value.trim(); 
                            
                                    if (trimmedValue === "") {
                                        e.target.value = previousValue;
                                    }
                                    handleOnBlur(e.target.value, "short");
                                }
                            }
                        />
                    </div>
                </div>
                <div className="flex flex-wrap justify-between gap-1"> 
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor={`long`}><b>Long Term Career Plan</b></label>
                        <input
                            type="text"
                            id={`long`}
                            name={`long`}
                            className="border border-gray-300 rounded-md p-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={
                                !careerOfMyChoice || !careerOfMyChoice.short || careerOfMyChoice.short === "" ?
                                    "Rencana karir untuk 3-5 tahun?":
                                    careerOfMyChoice.long
                            }
                            onBlur={
                                (e)=>{
                                    const previousValue = e.target.defaultValue; 
                                    const trimmedValue = e.target.value.trim(); 
                            
                                    if (trimmedValue === "") {
                                        e.target.value = previousValue;
                                    }
                                    handleOnBlur(e.target.value, "long");
                                }}
                        />
                    </div>
                </div>
            </div>
        )
    }

    const { careerOfMyChoice, setCareerOfMyChoice } = contextHook.useCareerofMyChoice()!;

    const handleOnBlur = (val: string = "", whatdata: string)=>{
        const newCareerChoice: contextHook.CareerofMyChoice = {
            short: whatdata === "short" ? val : careerOfMyChoice?.short ? contextHook.initialCareerOfMyChoiceVal.short : "",
            long: whatdata === "long" ? val : careerOfMyChoice?.long ? contextHook.initialCareerOfMyChoiceVal.long : "",
        }
        return setCareerOfMyChoice( newCareerChoice === undefined ? contextHook.initialCareerOfMyChoiceVal : newCareerChoice)
    }

    return (
        <form>
            <CareerOfMyChoiceComp></CareerOfMyChoiceComp>
        </form>
    )
}

export function BestEmployeeComponents(){
    function InputBestEmployee(){
        return (
            <div className={`${bitter.className} flex flex-col w-full h-1/5 justify-center p-3`}>
                
                <textarea
                    id="bestEmployeeInput" 
                    name="bestEmployeeInput"
                    className="border-b border-gray-300 text-gray-300 text-xl focus:border-b-2 focus:border-blue-500 focus:outline-none focus:caret-blue-500 block w-full p-1 focus:text-gray-900 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" 
                    placeholder={"Berapa kali anda pernah menjadi karyawan teladan ? : " + (String(bestEmployee ?? "-") ?? "-")}
                    onBlur={
                        (e) => {
                            const previousValue = e.target.defaultValue; 
                            const trimmedValue = e.target.value.trim(); 
                    
                            if (trimmedValue === "") {
                                e.target.value = previousValue;
                            }
                            handleOnBlur(parseInt(e.target.value));
                        }
                    }
                    rows={3}
                />
                
            </div>
        )
    }

    const {bestEmployee, setBestEmployee} = contextHook.useBestEmployee()!;

    const handleOnBlur = (val: number)=>{
        return setBestEmployee(val)
    }
    
    return(
        <form>
            <InputBestEmployee></InputBestEmployee>
        </form>
    )
}

