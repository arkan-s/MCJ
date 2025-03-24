'use client'
import { useSession,} from "next-auth/react";
import { useState, useEffect, useId } from "react";
import * as contextHook from "@/hooks/context/formcontext"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { bitter } from "@/components/ui/fonts";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod"
import { v4 as uuidv4 } from "uuid";

// import * as formValidContext from "@/app/employee/form/FormValidationContext"

export function SelfCareerHistoryForm(){
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
    const { data: session, status } = useSession();
    const nik = session?.user.nik;

    const { careerHistory, setCareerHistory } = contextHook.useCareerHistory()!;
    useEffect(()=>{
        fetch(`/api/datakaryawan/${nik}/datariwayatkarir`)
        .then((response) => response.json())
        .then(data=>setCareerHistory([{...data, id: data.idCareerHistory}]))
        .catch((error: any)=>console.error("Error fetching user's career history", error))
    }, []);
    
    const createCareerHistory = () => {
        setCareerHistory(careerHistory === null ?
            contextHook.initialCareerHistoryVal :
            [...careerHistory, {...contextHook.initialCareerHistoryVal[0], id: uuidv4()}]
        )
    }
    const updateCareerHistory = (valString: string = "", valDate: Date | null, whatdata: string, indexComp: string)=>{
            const newCareerHistory = careerHistory === undefined ? contextHook.initialCareerHistoryVal : careerHistory?.map(
                (data) => {
                    if (data.id === indexComp) {
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
    const removeCareerHistory = (index:string) => {
        setCareerHistory(prevCareerHistory => 
            prevCareerHistory ? prevCareerHistory.filter((_, idx) => _.id !== index) : []
        );
    }

    



    function CHCard({indexComp}:{indexComp:string}){
        const [tempValue, setTempValue] = useState(careerHistory?.find((e)=>e.id === indexComp)?.tanggalMulai || undefined);        
        const [tempEValue, setTempEValue] = useState(careerHistory?.find((e)=>e.id === indexComp)?.tanggalBerakhir || undefined);  
        const idunique = useId();
        console.log(indexComp);
        return (
            <div className="flex flex-col md:flex-row md:items-center w-full bg-blue-100 my-2 p-2">
                <div className="flex flex-col w-full md:w-11/12">
                    <div className="flex flex-wrap justify-between gap-1"> {/*ABOUT POSITION */} {/*AMBIL DATA BUAT BIKIN DROPDOWN LIST BUAT POSISI DAN CABANG*/}
                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label htmlFor={`position${idunique}`}><b>Position</b></label>
                            <Select 
                                onValueChange={(value) => {
                                    const trimmedValue = value.trim();
                                    if (trimmedValue === "") {
                                        return;
                                    }
                                    updateCareerHistory(trimmedValue, new Date(), "posisi", indexComp);
                                }}
                                defaultValue=""
                            >
                                <SelectTrigger className="border-2 border-zinc-300 w-full"> 
                                    <SelectValue placeholder={careerHistory && careerHistory.find((e) => e.id === indexComp)?.position || "Pilih Posisi"}/>
                                </SelectTrigger>
                                <SelectContent>
                                    {positions.map((pos, index) => (
                                        <SelectItem key={index} value={pos.namaPosition}>{pos.namaPosition}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label htmlFor={`levelPosition${idunique}`}><b>Level</b></label>
                            <Select 
                                onValueChange={(value) => {
                                    const trimmedValue = value.trim();
                                    updateCareerHistory(trimmedValue, new Date(), "level", indexComp);
                                }}
                                defaultValue=""
                            >
                                <SelectTrigger className="border-2 border-zinc-300 w-full"> {/* Pastikan SelectTrigger juga w-full */}
                                    <SelectValue placeholder={careerHistory && careerHistory.find((e) => e.id === indexComp)?.levelPosition || "Pilih level"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {levels.map((lev:any, index:any) => (
                                        <SelectItem key={index} value={lev.namaLevel}>{lev.namaLevel}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label htmlFor={`branches${idunique}`}><b>Cabang</b></label>
                            <Select 
                                onValueChange={(value) => {
                                    const trimmedValue = value.trim();
                                    if (trimmedValue === "") {
                                        return;
                                    }
                                    updateCareerHistory(trimmedValue, new Date(), "cabang", indexComp);
                                }}
                                defaultValue=""
                            >
                                <SelectTrigger className="border-2 border-zinc-300 w-full"> {/* Pastikan SelectTrigger juga w-full */}
                                    <SelectValue placeholder={careerHistory && careerHistory.find((e) => e.id === indexComp)?.personnelArea || "Pilih Cabang"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {branches.map((br:any, index:any) => (
                                        <SelectItem key={index} value={br.namaBranch}>{br.namaBranch}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label htmlFor={`depts${idunique}`}><b>Department</b></label>
                            <Select 
                                onValueChange={(value) => {
                                    const trimmedValue = value.trim();
                                    if (trimmedValue === "") {
                                        return;
                                    }
                                    updateCareerHistory(trimmedValue, new Date(), "dept", indexComp);
                                }}
                                defaultValue=""
                            >
                                <SelectTrigger className="border-2 border-zinc-300 w-full"> {/* Pastikan SelectTrigger juga w-full */}
                                    <SelectValue placeholder={careerHistory && careerHistory.find((e) => e.id === indexComp)?.personnelSubarea || "Pilih Department"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {depts.map((dept:any, index:any) => (
                                        <SelectItem key={index} value={dept.namaDepartment}>{dept.namaDepartment}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                        </div>
                    </div>
                    <div className={`${bitter.className} flex justify-between w-full md:flex-row flex-col`}> {/*ABOUT TIME */}
                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label className="leading-loose" htmlFor={`tanggalMulai${idunique}`}>
                                <b>Tanggal Mulai</b>
                            </label>
                            <input
                                type="date"
                                id={`tanggalMulai${idunique}`}
                                name={`tanggalMulai${idunique}`}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-500"
                                value={tempValue === undefined ? "": !isNaN(Date.parse(tempValue.toISOString().split("T")[0])) ? tempValue.toISOString().split("T")[0] : "" }
                                onChange={(e) => setTempValue(e.target.value === "" ? undefined : new Date(e.target.value))}
                                onBlur={
                                    (e) => {
                                        if(isNaN(Date.parse(e.target.value))){
                                            updateCareerHistory("", null, "startDate", indexComp);
                                        } else {
                                            updateCareerHistory("", new Date(e.target.value), "startDate", indexComp);
                                        }
                                    }
                                }
                            />

                        </div>

                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label className="leading-loose" htmlFor={`tanggalBerakhir${idunique}`}>
                                <b>Tanggal Berakhir</b>
                            </label>
                            <input
                                type="date"
                                id={`tanggalBerakhir${idunique}`}
                                name={`tanggalBerakhir${idunique}`}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-500"
                                value={tempEValue === undefined ? "": !isNaN(Date.parse(tempEValue.toISOString().split("T")[0])) ? tempEValue.toISOString().split("T")[0] : "" }
                                onChange={(e) => setTempEValue(e.target.value === "" ? undefined : new Date(e.target.value))}
                                onBlur={
                                    (e) => {
                                        if(isNaN(Date.parse(e.target.value))){
                                            updateCareerHistory("", null, "endDate", indexComp);
                                        } else {
                                            updateCareerHistory("", new Date(e.target.value), "endDate", indexComp);
                                        }
                                    }
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-end md:items-center md:justify-center w-full md:w-1/12 md:mt-0 mt-2">
                    
                        <Button type="button" variant="destructive" size="icon" onClick={() => {
                            removeCareerHistory(indexComp);
                        }}>
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
                        return(
                            <motion.div
                                key={indexcomp}
                                initial={{ opacity: 0, scale: 0.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale:0.1 }}
                                transition={{ type: "spring", duration:1, stiffness: 250, damping: 15 }}
                                className="mb-2"
                            >
                                <CHCard indexComp={e.id}></CHCard>
                            </motion.div>
                        )
                    })}
                </form>
                <Button type="button" className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={createCareerHistory}
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



export function SelfOrgIntHistoryForm() {
    const { orgIntHistory, setOrgIntHistory } = contextHook.useOrgIntHistory()!;
    
    const createOrgInt = () => {
        setOrgIntHistory(
            orgIntHistory === null ?
                contextHook.initialOrgIntVal : 
                [...orgIntHistory, {...contextHook.initialOrgIntVal[0], id: uuidv4()}]
        )
    }

    const updateOrgInt = (valString: string = "", valDate: Date = new Date(), valNumber: number = 0, whatdata: string, indexComp: string)=>{
            const newOrgIntHistory = orgIntHistory === undefined ? contextHook.initialOrgIntVal : orgIntHistory?.map(
                (data) => {
                    if (data.id === indexComp) {
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
    
    function removeOrgInt(index:string){
        setOrgIntHistory(prevOrgIntHistory => 
            prevOrgIntHistory ? prevOrgIntHistory.filter((_) => _.id !== index) : []
        );
    }


    function OICard({indexComp}:{indexComp:string}){
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
                                    updateOrgInt(e.target.value, new Date(), 0, "name", indexComp);
                                }}
                                placeholder={orgIntHistory ? String(orgIntHistory.find((e)=>e.id === indexComp)?.name) === "" ? "Nama Organisasi" : String(orgIntHistory.find((e)=>e.id === indexComp)?.name) : "Nama organisasi"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-500"
                                defaultValue=""
                            />
                        </div>
    
                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label className="leading-loose" htmlFor={`jabatan${String(indexComp)}`}> <b>Posisi</b> </label>
                            <input
                                type="text"
                                id={`jabatan${String(indexComp)}`}
                                name={`jabatan${String(indexComp)}`}
                                onBlur={(e) => {
                                    updateOrgInt(e.target.value, new Date(), 0, "jabatan", indexComp);
                                }}
                                placeholder={orgIntHistory ? String(orgIntHistory.find((e)=>e.id === indexComp)?.jabatan) === "" ? "Jabatan atau posisi" : String(orgIntHistory.find((e)=>e.id === indexComp)?.jabatan) : "Jabatan atau posisi"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-500"
                            />
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
                                    updateOrgInt("", new Date(), input, "startYear", indexComp)
                                }}
                                placeholder={orgIntHistory?.find((e)=>e.id === indexComp)?.startYear? String((orgIntHistory).find((e)=>e.id === indexComp)?.startYear): "Tahun acara"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-500"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-end md:items-center md:justify-center w-full md:w-1/12 md:mt-0 mt-2">
                    <Button type="button" variant="destructive" size="icon" onClick={() => 
                        {
                            removeOrgInt(indexComp);
                        }

                    }>
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
                        return(
                            <motion.div
                                key={indexcomp}
                                initial={{ opacity: 0, scale: 0.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale:0.1 }}
                                transition={{ type: "spring", duration:1, stiffness: 250, damping: 15 }}
                                className="mb-2"
                            >
                                <OICard indexComp={e.id}></OICard>
                            </motion.div>
                        )
                    })}
                </form>
                <Button type="button" className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={createOrgInt}
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
    const { projectHistory, setProjectHistory } = contextHook.useProjectHistory()!;

    const createProject = () => {
        setProjectHistory(
            projectHistory === null ?
                [{...contextHook.initialProjectHistoryVal[0], id: uuidv4()}] : 
                [...projectHistory, {...contextHook.initialProjectHistoryVal[0], id: uuidv4()}]
        )
    }

    const updateProject = (valString: string = "", valNumber: number = 0, whatdata: string, indexComp: string) => {
        const newProjectHistory = projectHistory === undefined ? contextHook.initialProjectHistoryVal : projectHistory?.map(
            (data) => {
                if (data.id === indexComp) {
                    switch (whatdata) {
                        case "name":
                            return {
                                ...data,
                                name: valString
                            }
                        case "peran":
                            return {
                                ...data,
                                peran: valString
                            }
                        case "year":
                            return {
                                ...data,
                                year: valNumber
                            }
                        case "shortDesc":
                            return {
                                ...data,
                                shortDesc: valString
                            }
                        default:
                            return data;
                    }
                } else {
                    return data;
                }
            }
        )
        return setProjectHistory(newProjectHistory === undefined ? contextHook.initialProjectHistoryVal : newProjectHistory)
    }

    function removeProject(index: string) {
        setProjectHistory(prevProjectHistory => 
            prevProjectHistory ? prevProjectHistory.filter((_) => _.id !== index) : []
        );
    }

    
    function ProjectCard({ indexComp }:{indexComp:string}) {
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
                                placeholder={projectHistory ? String(projectHistory.find((e)=>e.id === indexComp)?.name) === "" ? "Nama Proyek" : String(projectHistory.find((e)=>e.id === indexComp)?.name) : "Nama Proyek"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onBlur={(e) => {
                                    updateProject(e.target.value, 0, "name", indexComp);
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label className="leading-loose" htmlFor={`year${indexComp}`}>
                                <b>Tahun</b>
                            </label>
                            <input
                                type="number"
                                id={`year${indexComp}`}
                                name={`year${indexComp}`}
                                placeholder={projectHistory?.find((e)=>e.id === indexComp)?.year ? String((projectHistory).find((e)=>e.id === indexComp)?.year): "Tahun acara"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onBlur={(e) => {
                                    let input: number = parseInt(e.target.value);
                                    if (Number.isNaN(input)) {
                                        input = 0;
                                    }
                                    updateProject(e.target.value, input, "year", indexComp);
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label className="leading-loose" htmlFor={`peran${indexComp}`}>
                                <b>Peran</b>
                            </label>
                            <input
                                type="text"
                                id={`peran${indexComp}`}
                                name={`peran${indexComp}`}
                                placeholder={projectHistory ? String(projectHistory.find((e)=>e.id === indexComp)?.peran) === "" ? "Peran anda dalam propyek" : String(projectHistory.find((e)=>e.id === indexComp)?.peran) : "Peran anda dalam propyek"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onBlur={(e) => {
                                    updateProject(e.target.value, 0, "peran", indexComp);
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <label className="leading-loose" htmlFor={`shortDesc${indexComp}`}>
                                <b>Short Desc</b>
                            </label>
                            <textarea
                                id={`shortDesc${indexComp}`}
                                name={`shortDesc${indexComp}`}
                                rows={5}
                                placeholder={projectHistory ? String(projectHistory.find((e)=>e.id === indexComp)?.shortDesc) === "" ? "Deskripsikan pekerjaan seacara singkat" : String(projectHistory.find((e)=>e.id === indexComp)?.shortDesc) : "Deskripsikan pekerjaan secara singkat"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-visible"
                                onBlur={(e) => {
                                    updateProject(e.target.value, 0, "shortDesc", indexComp);
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-end md:items-center md:justify-center w-full md:w-1/12 md:mt-0 mt-2">
                    <Button type="button" variant="destructive" size="icon" onClick={() => {
                        removeProject(indexComp);
                        
                    }}>
                        <Trash size={16} />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-fit px-2 pb-2">
            <form>
                {projectHistory?.map((_, indexcomp) => {
                    return (
                        <motion.div
                            key={indexcomp}
                            initial={{ opacity: 0, scale: 0.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.1 }}
                            transition={{ type: "spring", duration: 1, stiffness: 250, damping: 15 }}
                            className="mb-2"
                        >
                            <ProjectCard indexComp={_.id} />
                        </motion.div>
                    )
                })}
            </form>
            <Button type="button" className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={createProject}
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
    const { comiteeHistory, setComiteeHistory } = contextHook.useComiteeHistory()!;
    
    const createComiteeHistory = () => {
        setComiteeHistory(comiteeHistory === null ?
            [{...contextHook.initialComiteeHistoryVal[0], id: uuidv4()}] :
            [...comiteeHistory, {...contextHook.initialComiteeHistoryVal[0], id: uuidv4()}]
        );
    };

    const updateComiteeHistory = (valString = "", valNumber = 0, whatdata: string, indexComp: string) => {
        const newComiteeHistory = comiteeHistory === undefined ? contextHook.initialComiteeHistoryVal : comiteeHistory?.map(
            (data:any) => {
                if (data.id === indexComp) {
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
            prevComiteeHistory ? prevComiteeHistory.filter((_, idx) => _.id !== index) : []
        );
    }

    function ComiteeCard({ indexComp }:{indexComp:string}) {
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
                                placeholder={comiteeHistory?.find((e)=>e.id === indexComp)?.name ? (comiteeHistory).find((e)=>e.id === indexComp)?.name : "Nama acara"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onBlur={(e) => {
                                    updateComiteeHistory(e.target.value, 0, "name", indexComp);
                                    }
                                }
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label className="leading-loose" htmlFor={`year${indexComp}`}>
                                <b>Tahun</b>
                            </label>
                            <input
                                type="number"
                                id={`year${indexComp}`}
                                name={`year${indexComp}`}
                                placeholder={comiteeHistory?.find((e)=>e.id === indexComp)?.year ? String((comiteeHistory).find((e)=>e.id === indexComp)?.year): "Tahun acara"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onBlur={
                                    (e) => {
                                        let input: number = parseInt(e.target.value);
                                        if (Number.isNaN(input)) {
                                            input = 0;
                                        }
                                        updateComiteeHistory("", input, "year", indexComp);
                                    }
                                }
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label className="leading-loose" htmlFor={`jabatan${indexComp}`}>
                                <b>Jabatan</b>
                            </label>
                            <input
                                type="text"
                                id={`jabatan${indexComp}`}
                                name={`jabatan${indexComp}`}
                                placeholder={comiteeHistory?.find((e)=>e.id === indexComp)?.jabatan ? (comiteeHistory).find((e)=>e.id === indexComp)?.jabatan : "Nama posisi atau jabatan"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onBlur={(e) =>
                                    {
                                        updateComiteeHistory(e.target.value, 0, "jabatan", indexComp);
                                    }
                                }
                            />
                            
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-end md:items-center md:justify-center w-full md:w-1/12 md:mt-0 mt-2">
                    <Button type="button" variant="destructive" size="icon" onClick={() => 
                        {
                            removeComiteeHistory(indexComp);
                        }
                    }>
                        <Trash size={16} />
                    </Button>
                </div>
            </div>
        );
    }
    

    return (
        <div className="flex flex-col w-full h-fit px-2 pb-2">
            <form>
                {
                comiteeHistory?.map((_, indexcomp) => {
                    return (
                    <motion.div
                        key={indexcomp}
                        initial={{ opacity: 0, scale: 0.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.1 }}
                        transition={{ type: "spring", duration: 1, stiffness: 250, damping: 15 }}
                        className="mb-2"
                    >
                        <ComiteeCard indexComp={_.id} />
                    </motion.div>
                )})}
            </form>
            <Button type="button" className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={createComiteeHistory}
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
    const { trainingWanted, setTrainingWanted } = contextHook.useTrainingWanted()!;
    
    const createTraining = () => {
        setTrainingWanted(trainingWanted === null ? [{id: uuidv4(), name: ""}] : [...trainingWanted, {id: uuidv4(), name: ""}]);
    };

    const updateTraining = (valString = "", id: string) => {
        const newTrainingWanted = trainingWanted?.map((data) => (
            id === data.id ? { ...data, name: valString } : data
        ));
        setTrainingWanted(newTrainingWanted ?? [{id: uuidv4(), name: ""}]);
    };

    const removeTraining = (id: string) => {
        setTrainingWanted(prevTrainingWanted => 
            prevTrainingWanted ? prevTrainingWanted.filter((e) => e.id !== id) : []
        );
    }
    

    function TrainingCard({ indexComp }: { indexComp: string}) {
        const trainingItem = trainingWanted?.find(item => item.id === indexComp); 
        return (
            <div className="flex flex-col md:flex-row md:items-center w-full bg-blue-100 my-2 p-2">
                <div className="flex flex-col w-full md:w-11/12">
                    <div className="flex flex-col gap-1 w-full">
                        <input
                            type="text"
                            id={`training${indexComp}`}
                            name={`training${indexComp}`}
                            placeholder={trainingItem ? trainingItem.name : "Judul atau topik pelatihan"}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onBlur={(e) => {
                                updateTraining(e.target.value, indexComp);
                            }}
                        />
                        
                    </div>
                </div>
                <div className="flex justify-end items-end md:items-center md:justify-center w-full md:w-1/12 md:mt-0 mt-2">
                    <Button type="button" variant="destructive" size="icon" onClick={() => {
                        removeTraining(indexComp);}
                        }>
                        <Trash size={16} />
                    </Button>
                </div>
            </div>
        );
    }

    return (
            <div className="flex flex-col w-full h-fit px-2 pb-2">
                <form>
                    {trainingWanted?.map((_, indexComp) => {
                        return (
                        <motion.div
                            key={indexComp}
                            initial={{ opacity: 0, scale: 0.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.1 }}
                            transition={{ type: "spring", duration: 1, stiffness: 250, damping: 15 }}
                            className="mb-2"
                        >
                            <TrainingCard indexComp={_.id} />
                        </motion.div>
                    )})}
                </form>
                <Button type="button" className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={createTraining}
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
    const { gkmHistory, setGkmHistory } = contextHook.useGKMHistory()!;

    const updateGKM = (valString: string, valNumber: number, whatdata: string) => {
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
    
    

    return (
        <div className="flex flex-col w-full h-fit px-2 pb-2">
            `<form>
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
                                    placeholder={gkmHistory ? String(gkmHistory.amountOfTime) : "Banyak Keikutsertaan"}
                                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onBlur={(e) => {
                                        let input: number = parseInt(e.target.value);
                                        if (Number.isNaN(input)) {
                                            input = 0;
                                        }
                                        
                                        updateGKM("", input, "amountOfTime");
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-full ">
                                <label className="leading-loose" htmlFor="highestPosition">
                                    <b>Jabatan Tertinggi</b>
                                </label>
                                <input
                                    type="text"
                                    id="highestPosition"
                                    name="highestPosition"
                                    disabled={gkmHistory?.amountOfTime === 0 ? true :  false}
                                    placeholder={gkmHistory ? gkmHistory.amountOfTime === 0 ? "-" : (gkmHistory.highestPosition || "Jabatan tertinggi")  : "Jabatan Tertinggi"}
                                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onBlur={(e) => 
                                        {
                                            updateGKM(e.target.value, 0, "highestPosition");
                                        }
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
    
}


export function MentorWantedForm() {
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
    const updateMentor = (valString: string, field: keyof contextHook.MentorWanted) => {
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
                                    placeholder={mentorWanted ? mentorWanted.name !== "" ? mentorWanted.name : "Nama Mentor" : "Nama Mentor"}
                                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onBlur={(e) => 
                                        {
                                            updateMentor(e.target.value, "name");
                                        }
                                    }
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
                                        updateMentor(trimmedValue, "jabatan");
                                    }}
                                    onOpenChange={(isOpen)=>{
                                        if(!isOpen){
                                            if (mentorWanted?.jabatan === "") {
                                            }
                                        }
                                    }}
                                    defaultValue=""
                                    
                                >
                                    <SelectTrigger className="border-2 border-zinc-300 w-full"> {/* Pastikan SelectTrigger juga w-full */}
                                        <SelectValue placeholder={mentorWanted ? mentorWanted.jabatan === "" ? "Pilih posisi mentor" : mentorWanted.jabatan : "Pilih posisi mentor"}/>
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
                                        updateMentor(trimmedValue, "cabang");
                                    }}
                                    
                                    defaultValue=""
                                    
                                >
                                    <SelectTrigger className="border-2 border-zinc-300 w-full"> {/* Pastikan SelectTrigger juga w-full */}
                                        <SelectValue placeholder={mentorWanted ? mentorWanted.cabang === "" ? "Pilih cabang mentor" : mentorWanted.cabang : "Pilih cabang mentor"}/>
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
        );
        
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

    console.log(empCareerChoice);

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
                                    "Rencana karir untuk 1-3 tahun?" :
                                    careerOfMyChoice.short || "Rencana karir untuk 1-3 tahun?"
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
                                    careerOfMyChoice.long || "Rencana karir untuk 3-5 tahun?"
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

    console.log(careerOfMyChoice);

    return (
        <form>
            <CareerOfMyChoiceComp></CareerOfMyChoiceComp>
        </form>
    )
}

export function BestEmployeeComponents(){
    function InputBestEmployee() {
        const { bestEmployee, setBestEmployee } = contextHook.useBestEmployee()!;
    
        const updateBE = (val: number) => {
            if (!isNaN(val)) { // Pastikan hanya angka yang diupdate
                setBestEmployee(val);
            }
        };
    
        return (
            <div className={`${bitter.className} flex flex-col w-full h-1/5 justify-center p-3`}>
                <textarea
                    id="bestEmployeeInput"
                    name="bestEmployeeInput"
                    className="border-b border-gray-300 text-gray-300 text-xl focus:border-b-2 focus:border-blue-500 focus:outline-none focus:caret-blue-500 block w-full p-1 focus:text-gray-900 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    placeholder={`Berapa kali anda pernah menjadi karyawan teladan? : ${bestEmployee ?? "-"}`}
                    onBlur={(e) => {
                        const trimmedValue = e.target.value.trim();
                        if (trimmedValue === "") {
                            updateBE(bestEmployee ?? 0); // Gunakan bestEmployee yang sudah ada, default ke 0
                        } else {
                            updateBE(parseInt(trimmedValue));
                        }
                    }}
                    rows={3}
                />
            </div>
        );
    }
    

    const {bestEmployee, setBestEmployee} = contextHook.useBestEmployee()!;

    const updateBE = (val: number)=>{
        if (isNaN(val)){
            return setBestEmployee(val)
        }
    }

    console.log(bestEmployee)
    
    return(
        <form>
            <InputBestEmployee></InputBestEmployee>
        </form>
    )
}
