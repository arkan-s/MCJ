'use client'
import { useState, useEffect, useId } from "react";
import * as contextHook from "@/hooks/context/formcontext"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { bitter } from "@/components/ui/fonts";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod"
import { v4 as uuidv4 } from "uuid";
import * as formValidContext from "@/app/employee/form/FormValidationContext"



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

    const { careerHistory, setCareerHistory } = contextHook.useCareerHistory()!;
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

    const careerHistoryValidation = z.array(
        z.object({
            position: z.string().min(1, "Position tidak boleh kosong"),
            personnelArea: z.string().min(1, "Personnel Area tidak boleh kosong"),
            personnelSubarea: z.string().min(1, "Personnel Subarea tidak boleh kosong"),
            levelPosition: z.string().min(1, "Level Position tidak boleh kosong"),
            tanggalMulai: z.date().nullable().refine(val => val !== null, {
                message: "Tanggal mulai tidak boleh kosong",
            }),
            tanggalBerakhir: z.date().nullable().refine(val => val !== null, {
                message: "Tanggal berakhir tidak boleh kosong",
            }),
            status: z.number(),
            id: z.string().min(1, "ID kosong"),
        })
    );

    const context = formValidContext.useCareerHistoryErr();
    const {careerHistoryErr, setCareerHistoryErr} = context ?? { careerHistoryErr: null, setCareerHistoryErr: () => {} };


    const removeCareerHistoryErr = (index: string) => {
        setCareerHistoryErr(prevCareerHistoryErr => 
            prevCareerHistoryErr ? prevCareerHistoryErr.filter((e) => e.id !== index) : []
        );
    }

    const manipulateCareerHistoryError = (index: string, field: keyof contextHook.CareerHistoryItem[0], value: string | Date | null) => {
        // setCareerHistory((prevCareerHistory) => {
        //     const newCareerHistory = [...prevCareerHistory || contextHook.initialCareerHistoryVal];
        //     const newCareerHistory2 = newCareerHistory.map(
        //         (e) => e.id === index ? { ...e, [field]: value } : e
        //     );
        //     return newCareerHistory2;
        // });

        try {
            careerHistoryValidation.element.shape[field].parse(value);
            if(careerHistoryErr !== null){
                if(careerHistoryErr.find((e)=>e.id === index)){
                    setCareerHistoryErr(careerHistoryErr.map((e)=>
                        e.id === index ? {...e, [field]: ""} : e
                    ));
                } else {
                    const dupliTemp = careerHistoryErr.map(e=>e);
                    dupliTemp.push({...formValidContext.careerHistoryErrInVal[0], id:index, [field]: ""});
                    setCareerHistoryErr(dupliTemp);
                }
            }else{
                setCareerHistoryErr([{...formValidContext.careerHistoryErrInVal[0],id: index, [field]: ""}]);
            }
        } catch (error: any) {
            if(careerHistoryErr !== null){
                if(careerHistoryErr.find((e)=>e.id === index)){
                    setCareerHistoryErr(careerHistoryErr.map((e)=>
                        e.id === index ? {...e, [field]: error.errors[0].message} : e
                    ));
                } else {
                    const dupliTemp = careerHistoryErr.map(e=>e);
                    dupliTemp.push({...formValidContext.careerHistoryErrInVal[0], id:index, [field]: error.errors[0].message});
                    setCareerHistoryErr(dupliTemp);
                }
            }else{
                setCareerHistoryErr([{...formValidContext.careerHistoryErrInVal[0],id: index, [field]: error.errors[0].message}]);
            }
        }
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
                                    manipulateCareerHistoryError(indexComp, "position", trimmedValue);
                                    updateCareerHistory(trimmedValue, new Date(), "posisi", indexComp);
                                    if(careerHistoryErr !== null){
                                        if(careerHistoryErr.find((e)=>e.id === indexComp)){
                                            setCareerHistoryErr(careerHistoryErr.map((e)=>
                                                e.id === indexComp ? {...e, position: ""} : e
                                            ));
                                        } else {
                                            const dupliTemp = careerHistoryErr.map(e=>e);
                                            dupliTemp.push({...formValidContext.careerHistoryErrInVal[0], id:indexComp, position: ""});
                                            setCareerHistoryErr(dupliTemp);
                                        }
                                    }else{
                                        setCareerHistoryErr([{...formValidContext.careerHistoryErrInVal[0],id: indexComp, position: ""}]);
                                    }
                                }}
                                onOpenChange={(isOpen) => {
                                    if (!isOpen) {
                                        if(careerHistoryErr !== null){
                                            if(careerHistoryErr.find((e)=>e.id === indexComp)){
                                                setCareerHistoryErr(careerHistoryErr.map((e)=>
                                                    e.id === indexComp ? {...e, position: "Posisi harus dipilih"} : e
                                                ));
                                            } else {
                                                const dupliTemp = careerHistoryErr.map(e=>e);
                                                dupliTemp.push({...formValidContext.careerHistoryErrInVal[0], id:indexComp, position: "Posisi harus dipilih"});
                                                setCareerHistoryErr(dupliTemp);
                                            }
                                        }else{
                                            setCareerHistoryErr([{...formValidContext.careerHistoryErrInVal[0],id: indexComp, position: "Posisi harus dipilih"}]);
                                        }
                                    }
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
                            {careerHistory?.find((e)=>e.id === indexComp)?.position === "" && <p className="text-red-500">{careerHistoryErr?.find((e)=>e.id === indexComp)?.position}</p>}
                        </div>

                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label htmlFor={`levelPosition${idunique}`}><b>Level</b></label>
                            <Select 
                                onValueChange={(value) => {
                                    const trimmedValue = value.trim();
                                    manipulateCareerHistoryError(indexComp, "levelPosition", trimmedValue);
                                    updateCareerHistory(trimmedValue, new Date(), "level", indexComp);
                                    if(careerHistoryErr !== null){
                                        if(careerHistoryErr.find((e)=>e.id === indexComp)){
                                            setCareerHistoryErr(careerHistoryErr.map((e)=>
                                                e.id === indexComp ? {...e, levelPosition: ""} : e
                                            ));
                                        } else {
                                            const dupliTemp = careerHistoryErr.map(e=>e);
                                            dupliTemp.push({...formValidContext.careerHistoryErrInVal[0], id:indexComp, levelPosition: ""});
                                            setCareerHistoryErr(dupliTemp);
                                        }
                                    }else{
                                        setCareerHistoryErr([{...formValidContext.careerHistoryErrInVal[0],id: indexComp, levelPosition: ""}]);
                                    }
                                }}
                                onOpenChange={(isOpen) => {
                                    console.log("Dropdown dibuka?", isOpen);
                                    console.log(careerHistory?.find((e)=>e.id === indexComp)?.levelPosition)
                                    if (!isOpen) {
                                        if(careerHistoryErr !== null){
                                            if(careerHistoryErr.find((e)=>e.id === indexComp)){
                                                setCareerHistoryErr(careerHistoryErr.map((e)=>
                                                    e.id === indexComp ? {...e, levelPosition: "Level harus dipilih!"} : e
                                                ));
                                            } else {
                                                const dupliTemp = careerHistoryErr.map(e=>e);
                                                dupliTemp.push({...formValidContext.careerHistoryErrInVal[0], id:indexComp, levelPosition: "Level harus dipilih!"});
                                                setCareerHistoryErr(dupliTemp);
                                            }
                                        }else{
                                            setCareerHistoryErr([{...formValidContext.careerHistoryErrInVal[0],id: indexComp, levelPosition: "Level harus dipilih!"}]);
                                        }
                                }}}
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
                            {careerHistory?.find((e)=>e.id === indexComp)?.levelPosition === "" && <p className="text-red-500">{careerHistoryErr?.find((e)=>e.id === indexComp)?.levelPosition}</p>}
                        </div>

                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label htmlFor={`branches${idunique}`}><b>Cabang</b></label>
                            <Select 
                                onValueChange={(value) => {
                                    const trimmedValue = value.trim();
                                    if (trimmedValue === "") {
                                        return;
                                    }
                                    manipulateCareerHistoryError(indexComp, "personnelArea", trimmedValue);
                                    updateCareerHistory(trimmedValue, new Date(), "cabang", indexComp);
                                    if(careerHistoryErr !== null){
                                        if(careerHistoryErr.find((e)=>e.id === indexComp)){
                                            setCareerHistoryErr(careerHistoryErr.map((e)=>
                                                e.id === indexComp ? {...e, personnelArea: ""} : e
                                            ));
                                        } else {
                                            const dupliTemp = careerHistoryErr.map(e=>e);
                                            dupliTemp.push({...formValidContext.careerHistoryErrInVal[0], id:indexComp, personnelArea: ""});
                                            setCareerHistoryErr(dupliTemp);
                                        }
                                    }else{
                                        setCareerHistoryErr([{...formValidContext.careerHistoryErrInVal[0],id: indexComp, personnelArea: ""}]);
                                    }
                                }}
                                onOpenChange={(isOpen) => {
                                    if (!isOpen) {
                                        if(careerHistoryErr !== null){
                                            if(careerHistoryErr.find((e)=>e.id === indexComp)){
                                                setCareerHistoryErr(careerHistoryErr.map((e)=>
                                                    e.id === indexComp ? {...e, personnelArea: "Cabang harus dipilih!"} : e
                                                ));
                                            } else {
                                                const dupliTemp = careerHistoryErr.map(e=>e);
                                                dupliTemp.push({...formValidContext.careerHistoryErrInVal[0], id:indexComp, personnelArea: "Cabang harus dipilih!"});
                                                setCareerHistoryErr(dupliTemp);
                                            }
                                        }else{
                                            setCareerHistoryErr([{...formValidContext.careerHistoryErrInVal[0],id: indexComp, personnelArea: "Cabang harus dipilih!"}]);
                                        }
                                }}
                            }
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
                            {careerHistory?.find((e)=>e.id === indexComp)?.personnelArea === "" && <p className="text-red-500">{careerHistoryErr?.find((e)=>e.id === indexComp)?.personnelArea}</p>}
                        </div>

                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label htmlFor={`depts${idunique}`}><b>Department</b></label>
                            <Select 
                                onValueChange={(value) => {
                                    const trimmedValue = value.trim();
                                    if (trimmedValue === "") {
                                        return;
                                    }
                                    manipulateCareerHistoryError(indexComp, "personnelSubarea", trimmedValue);
                                    updateCareerHistory(trimmedValue, new Date(), "dept", indexComp);
                                    if(careerHistoryErr !== null){
                                        if(careerHistoryErr.find((e)=>e.id === indexComp)){
                                            setCareerHistoryErr(careerHistoryErr.map((e)=>
                                                e.id === indexComp ? {...e, personnelSubarea: ""} : e
                                            ));
                                        } else {
                                            const dupliTemp = careerHistoryErr.map(e=>e);
                                            dupliTemp.push({...formValidContext.careerHistoryErrInVal[0], id:indexComp, personnelSubarea: ""});
                                            setCareerHistoryErr(dupliTemp);
                                        }
                                    }else{
                                        setCareerHistoryErr([{...formValidContext.careerHistoryErrInVal[0],id: indexComp, personnelSubarea: ""}]);
                                    }
                                }}
                                onOpenChange={(isOpen) => {
                                    if (!isOpen) {
                                        if(careerHistoryErr !== null){
                                            if(careerHistoryErr.find((e)=>e.id === indexComp)){
                                                setCareerHistoryErr(careerHistoryErr.map((e)=>
                                                    e.id === indexComp ? {...e, personnelSubarea: "Department harus dipilih!"} : e
                                                ));
                                            } else {
                                                const dupliTemp = careerHistoryErr.map(e=>e);
                                                dupliTemp.push({...formValidContext.careerHistoryErrInVal[0], id:indexComp, personnelSubarea: "Department harus dipilih!"});
                                                setCareerHistoryErr(dupliTemp);
                                            }
                                        }else{
                                            setCareerHistoryErr([{...formValidContext.careerHistoryErrInVal[0],id: indexComp, personnelSubarea: "Department harus dipilih!"}]);
                                        }
                                    }
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
                            {careerHistory?.find((e)=>e.id === indexComp)?.personnelSubarea === "" && <p className="text-red-500">{careerHistoryErr?.find((e)=>e.id === indexComp)?.personnelSubarea}</p>}

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
                                            manipulateCareerHistoryError(indexComp, "tanggalMulai", null);
                                        } else {
                                            updateCareerHistory("", new Date(e.target.value), "startDate", indexComp);
                                            manipulateCareerHistoryError(indexComp, "tanggalMulai", new Date(e.target.value));
                                        }
                                    }
                                }
                            />
                            {careerHistoryErr?.find((e)=>e.id === indexComp)?.tanggalMulai !== ""  && <p className="text-red-500">{careerHistoryErr?.find((e)=>e.id === indexComp)?.tanggalMulai}</p>}

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
                                            manipulateCareerHistoryError(indexComp, "tanggalBerakhir", null);
                                        } else {
                                            updateCareerHistory("", new Date(e.target.value), "endDate", indexComp);
                                            manipulateCareerHistoryError(indexComp, "tanggalBerakhir", new Date(e.target.value));
                                        }
                                    }
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-end md:items-center md:justify-center w-full md:w-1/12 md:mt-0 mt-2">
                    
                        <Button type="button" variant="destructive" size="icon" onClick={() => {
                            removeCareerHistoryErr(indexComp);
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
                        console.log(careerHistory, careerHistoryErr)
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
    const { orgIntErrors, setOrgIntErrors } = formValidContext.useOrgIntHistoryErrors();
    
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

    const validationOrgInt = z.array(
        z.object({
            name: z.string().min(1, "Name tidak boleh kosong"),
            jabatan: z.string().min(1, "Jabatan tidak boleh kosong"),
            startYear: z.number().min(1900, "Tahun mulai tidak valid").max(new Date().getFullYear(), "Tahun mulai tidak valid"),
            id: z.string().min(1, "ID kosong"),
        })
    );

    const manipulateOrgIntErr = (index: string, field: keyof contextHook.OrgIntHistoryItem[0], value: string | number) => {       
        setOrgIntHistory(
            orgIntHistory === null ?
                [{...contextHook.initialOrgIntVal[0], id: index, [field]: value }] : 
                orgIntHistory?.map((e)=> e.id === index ? {...e, [field]: value } : e)
        );

        // Validasi
        try {
            validationOrgInt.element.shape[field].parse(value);
            if(orgIntErrors !== null){
                if(Object.values(orgIntErrors).find((e)=>e.id === index)){
                    setOrgIntErrors(prevErrors => {
                        return Object.fromEntries(
                            Object.entries(prevErrors).map(([key, value]) => 
                                value.id === index 
                                    ? [key, { ...value, [field]: "" }] 
                                    : [key, value]  
                            )
                        )
                    })
                } else {
                    const newErr = Object.fromEntries(
                        Object.keys(contextHook.initialOrgIntVal[0]).map(key => [key, ""])
                    );                    
                    setOrgIntErrors(prevErrors => {
                        const newKey = Math.max(0, ...Object.keys(prevErrors).map(Number)) + 1;
                        return {
                            ...prevErrors,
                            [newKey]: {...newErr, id: index, [field]: "" }
                        };
                    });
                }
            }else{
                const newErr = Object.fromEntries(
                    Object.keys(contextHook.initialOrgIntVal[0]).map(key => [key, ""])
                );                
                setOrgIntErrors({
                    0: {...newErr, id: index}
                });
            }
        } catch (error: any) {
            if(orgIntErrors !== null){
                if(Object.values(orgIntErrors).find((e)=>e.id === index)){
                    setOrgIntErrors(prevErrors => {
                        return Object.fromEntries(
                            Object.entries(prevErrors).map(([key, value]) => 
                                value.id === index 
                                    ? [key, { ...value, [field]: error.errors[0].message }] 
                                    : [key, value]  
                            )
                        )
                    })
                } else {
                    setOrgIntErrors(prevErrors => {
                        const newKey = Math.max(0, ...Object.keys(prevErrors).map(Number)) + 1;
                        const newErr = Object.fromEntries(
                            Object.keys(contextHook.initialOrgIntVal[0]).map(key => [key, ""])
                        );
                        
                        return {
                            ...prevErrors,
                            [newKey]: {...newErr, id: index, [field]: error.errors[0].message  }
                        };
                    });
                }
            }else{
                const newErr = Object.fromEntries(
                    Object.keys(contextHook.initialOrgIntVal[0]).map(key => [key, ""])
                );                
                setOrgIntErrors({
                    0: {...newErr, id: index, [field]: error.errors[0].message }
                });
            }
        }
    };

    const removeOrgIntErr = (index: string) => {
        setOrgIntErrors(orgIntErrors => {
            return Object.fromEntries(
                Object.entries(orgIntErrors).filter(([key, value]) => 
                    value.id !== index
                )
            )
        });
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
                                    manipulateOrgIntErr(indexComp, "name", e.target.value);
                                }}
                                placeholder={orgIntHistory ? String(orgIntHistory.find((e)=>e.id === indexComp)?.name) === "" ? "Nama Organisasi" : String(orgIntHistory.find((e)=>e.id === indexComp)?.name) : "Nama organisasi"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-500"
                                defaultValue=""
                            />
                            {Object.values(orgIntErrors).find((e)=>e.id === indexComp)?.name !== "" && <p className="text-red-500 text-sm">{Object.values(orgIntErrors).find((e)=>e.id === indexComp)?.name}</p>}
                        </div>
    
                        <div className="flex flex-col gap-1 w-full md:w-[45%]">
                            <label className="leading-loose" htmlFor={`jabatan${String(indexComp)}`}> <b>Posisi</b> </label>
                            <input
                                type="text"
                                id={`jabatan${String(indexComp)}`}
                                name={`jabatan${String(indexComp)}`}
                                onBlur={(e) => {
                                    updateOrgInt(e.target.value, new Date(), 0, "jabatan", indexComp);
                                    manipulateOrgIntErr(indexComp, "jabatan", e.target.value);
                                }}
                                placeholder={orgIntHistory ? String(orgIntHistory.find((e)=>e.id === indexComp)?.jabatan) === "" ? "Jabatan atau posisi" : String(orgIntHistory.find((e)=>e.id === indexComp)?.jabatan) : "Jabatan atau posisi"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-500"
                            />
                            {Object.values(orgIntErrors).find((e)=>e.id === indexComp)?.jabatan !== "" && <p className="text-red-500 text-sm">{Object.values(orgIntErrors).find((e)=>e.id === indexComp)?.jabatan}</p>}
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
                                    manipulateOrgIntErr(indexComp, "startYear", input);
                                }}
                                placeholder={orgIntHistory?.find((e)=>e.id === indexComp)?.startYear? String((orgIntHistory).find((e)=>e.id === indexComp)?.startYear): "Tahun acara"}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-500"
                            />
                            {Object.values(orgIntErrors).find((e)=>e.id === indexComp)?.startYear !== "" && <p className="text-red-500 text-sm">{Object.values(orgIntErrors).find((e)=>e.id === indexComp)?.startYear}</p>}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-end md:items-center md:justify-center w-full md:w-1/12 md:mt-0 mt-2">
                    <Button type="button" variant="destructive" size="icon" onClick={() => 
                        {
                            removeOrgIntErr(indexComp)
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
                        console.log(orgIntHistory, orgIntErrors)
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
    const { projectErrors, setProjectErrors } = formValidContext.useProjectHistoryErrors();

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

    const validationProject = z.array(
        z.object({
            name: z.string().min(1, "Name tidak boleh kosong"),
            peran: z.string().min(1, "Peran tidak boleh kosong"),
            year: z.number().min(1900, "Tahun tidak valid").max(new Date().getFullYear(), "Tahun tidak valid"),
            shortDesc: z.string().min(1, "Deskripsi tidak boleh kosong"),
            id: z.string().min(1, "ID kosong"),
        })
    );

    const manipulateProjectErr = (index: string, field: keyof contextHook.ProjectHistoryItem[0], value: string | number) => {
        setProjectHistory(
            projectHistory === null ?
                [{ ...contextHook.initialProjectHistoryVal[0], id: uuidv4(), [field]: value }] :
                projectHistory?.map((e) => e.id === index ? { ...e, [field]: value } : e)
        );

        // Validasi
        try {
            validationProject.element.shape[field].parse(value);
            if (projectErrors !== null) {
                if (Object.values(projectErrors).find((e) => e.id === index)) {
                    setProjectErrors(prevErrors => {
                        return Object.fromEntries(
                            Object.entries(prevErrors).map(([key, value]) =>
                                value.id === index
                                    ? [key, { ...value, [field]: "" }]
                                    : [key, value]
                            )
                        )
                    })
                } else {
                    const newErr = Object.fromEntries(
                        Object.keys(contextHook.initialProjectHistoryVal[0]).map(key => [key, ""])
                    );
                    setProjectErrors(prevErrors => {
                        const newKey = Math.max(0, ...Object.keys(prevErrors).map(Number)) + 1;
                        return {
                            ...prevErrors,
                            [newKey]: { ...newErr, id: index, [field]: "" }
                        };
                    });
                }
            } else {
                const newErr = Object.fromEntries(
                    Object.keys(contextHook.initialProjectHistoryVal[0]).map(key => [key, ""])
                );
                setProjectErrors({
                    0: { ...newErr, id: index }
                });
            }
        } catch (error: any) {
            if (projectErrors !== null) {
                if (Object.values(projectErrors).find((e) => e.id === index)) {
                    setProjectErrors(prevErrors => {
                        return Object.fromEntries(
                            Object.entries(prevErrors).map(([key, value]) =>
                                value.id === index
                                    ? [key, { ...value, [field]: error.errors[0].message }]
                                    : [key, value]
                            )
                        )
                    })
                } else {
                    setProjectErrors(prevErrors => {
                        const newKey = Math.max(0, ...Object.keys(prevErrors).map(Number)) + 1;
                        const newErr = Object.fromEntries(
                            Object.keys(contextHook.initialProjectHistoryVal[0]).map(key => [key, ""])
                        );

                        return {
                            ...prevErrors,
                            [newKey]: { ...newErr, id: index, [field]: error.errors[0].message }
                        };
                    });
                }
            } else {
                const newErr = Object.fromEntries(
                    Object.keys(contextHook.initialProjectHistoryVal).map(key => [key, ""])
                );
                setProjectErrors({
                    0: { ...newErr, id: index, [field]: error.errors[0].message }
                });
            }
        }
    };

    const removeProjectErr = (index: string) => {
        setProjectErrors(prevErrors => {
            return Object.fromEntries(
                Object.entries(prevErrors).filter(([key, value]) =>
                    value.id !== index
                )
            )
        });
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
                                    manipulateProjectErr(indexComp, "name", e.target.value);
                                }}
                            />
                            {Object.values(projectErrors).find((e)=>e.id === indexComp)?.name !== "" && <p className="text-red-500 text-sm">{Object.values(projectErrors).find((e)=>e.id === indexComp)?.name}</p>}
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
                                    manipulateProjectErr(indexComp, "year", input);
                                }}
                            />
                            {Object.values(projectErrors).find((e) => e.id === indexComp)?.year !== "" && <p className="text-red-500 text-sm">{Object.values(projectErrors).find((e)=>e.id === indexComp)?.year}</p>}
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
                                    manipulateProjectErr(indexComp, "peran", e.target.value);
                                }}
                            />
                            {Object.values(projectErrors).find((e)=>e.id === indexComp)?.peran !== "" && <p className="text-red-500 text-sm">{Object.values(projectErrors).find((e)=>e.id === indexComp)?.peran}</p>}
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
                                    manipulateProjectErr(indexComp, "shortDesc", e.target.value);
                                    updateProject(e.target.value, 0, "shortDesc", indexComp);
                                }}
                            />
                            {Object.values(projectErrors).find((e)=>e.id === indexComp)?.shortDesc !== "" && <p className="text-red-500 text-sm">{Object.values(projectErrors).find((e)=>e.id === indexComp)?.shortDesc}</p>}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-end md:items-center md:justify-center w-full md:w-1/12 md:mt-0 mt-2">
                    <Button type="button" variant="destructive" size="icon" onClick={() => {
                        removeProjectErr(indexComp);
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
                    console.log(projectHistory, projectErrors);
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
    const { comerrors, setcomErrors } = formValidContext.useComiteeHistoryErrors();
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

    const validationComitee = z.array(
        z.object({
            name: z.string().min(1, "Name tidak boleh kosong"),
            jabatan: z.string().min(1, "Jabatan tidak boleh kosong"),
            year: z.number().min(1900, "Tahun tidak valid").max(new Date().getFullYear(), "Tahun tidak valid"),
            id: z.string().min(1, "ID Kosong"),
        })
    );

    const manipulateComiteeError = (index: string, field: keyof contextHook.ComiteeHistoryItem[0], value: string | number) => {
        setComiteeHistory(
            comiteeHistory === null ?
                [{ ...contextHook.initialComiteeHistoryVal[0], id: index, [field]: value }] :
                comiteeHistory?.map((e) => e.id === index ? { ...e, [field]: value } : e)
        );

        // Validasi
        try {
            validationComitee.element.shape[field].parse(value);
            if (comerrors !== null) {
                if (Object.values(comerrors).find((e) => e.id === index)) {
                    setcomErrors(prevErrors => {
                        return Object.fromEntries(
                            Object.entries(prevErrors).map(([key, value]) =>
                                value.id === index
                                    ? [key, { ...value, [field]: "" }]
                                    : [key, value]
                            )
                        )
                    })
                } else {
                    const newErr = Object.fromEntries(
                        Object.keys(contextHook.initialComiteeHistoryVal[0]).map(key => [key, ""])
                    );
                    setcomErrors(prevErrors => {
                        const newKey = Math.max(0, ...Object.keys(prevErrors).map(Number)) + 1;
                        return {
                            ...prevErrors,
                            [newKey]: { ...newErr, id: index, [field]: "" }
                        };
                    });
                }
            } else {
                const newErr = Object.fromEntries(
                    Object.keys(contextHook.initialComiteeHistoryVal[0]).map(key => [key, ""])
                );
                setcomErrors({
                    0: { ...newErr, id: index }
                });
            }
        } catch (error: any) {
            if (comerrors !== null) {
                if (Object.values(comerrors).find((e) => e.id === index)) {
                    setcomErrors(prevErrors => {
                        return Object.fromEntries(
                            Object.entries(prevErrors).map(([key, value]) =>
                                value.id === index
                                    ? [key, { ...value, [field]: error.errors[0].message }]
                                    : [key, value]
                            )
                        )
                    })
                } else {
                    setcomErrors(prevErrors => {
                        const newKey = Math.max(0, ...Object.keys(prevErrors).map(Number)) + 1;
                        const newErr = Object.fromEntries(
                            Object.keys(contextHook.initialComiteeHistoryVal[0]).map(key => [key, ""])
                        );

                        return {
                            ...prevErrors,
                            [newKey]: { ...newErr, id: index, [field]: error.errors[0].message }
                        };
                    });
                }
            } else {
                const newErr = Object.fromEntries(
                    Object.keys(contextHook.initialComiteeHistoryVal[0]).map(key => [key, ""])
                );
                setcomErrors({
                    0: { ...newErr, id: index, [field]: error.errors[0].message }
                });
            }
        }
    };

    const removeComErr = (index: string) => {
        setcomErrors(prevErrors => {
            return Object.fromEntries(
                Object.entries(prevErrors).filter(([key, value]) =>
                    value.id !== index
                )
            )
        });
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
                                    manipulateComiteeError(indexComp, "name", e.target.value);
                                    }
                                }
                            />
                            {Object.values(comerrors).find((e)=>e.id === indexComp)?.name !== "" && <p className="text-red-500 text-sm">{Object.values(comerrors).find((e)=>e.id === indexComp)?.name}</p>}
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
                                        manipulateComiteeError(indexComp, "year", input);
                                        updateComiteeHistory("", input, "year", indexComp);
                                    }
                                }
                            />
                            {Object.values(comerrors).find((e)=>e.id === indexComp)?.year !== "" && <p className="text-red-500 text-sm">{Object.values(comerrors).find((e)=>e.id === indexComp)?.year}</p>}
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
                                        manipulateComiteeError(indexComp, "jabatan", e.target.value);
                                    }
                                }
                            />
                            {Object.values(comerrors).find((e)=>e.id === indexComp)?.jabatan !== "" && <p className="text-red-500 text-sm">{Object.values(comerrors).find((e)=>e.id === indexComp)?.jabatan}</p>}
                            
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-end md:items-center md:justify-center w-full md:w-1/12 md:mt-0 mt-2">
                    <Button type="button" variant="destructive" size="icon" onClick={() => 
                        {
                            removeComErr(indexComp)
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
                    console.log("TEST", comiteeHistory, comerrors);
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
    const { trainingErrors, setTrainingErrors } = formValidContext.useTrainingErrors();

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


    const validationTraining = z.array(
        z.object({
            name: z.string().min(1, "Training tidak boleh kosong"),
            id: z.string().min(1, "ID kosong")
        })
    )

    function removeErrorTraining(id: string) {
        setTrainingErrors(prevTrainingError => 
            prevTrainingError ? prevTrainingError.filter((e) => e.id !== id) : []
        );
    }


    const manipulateTrainingError = (index: string, field: keyof contextHook.TrainingWanted[0], value: string) => {
        setTrainingWanted((trainingWanted) => {
            const newTraining = [...(trainingWanted || [{id: index, name: ""}])];
            const newTrainingError = newTraining.map((e) => 
                e.id === index ? {...e, name: value} : e
            );
            return newTrainingError;
        });
    
        // Validasi
        try {
            validationTraining.element.shape[field].parse(value);
            setTrainingErrors((prevErrors) => [
                ...prevErrors.filter((err) => err.id !== index), // Hapus error lama jika ada
                { id: index, error: "" },  // Tambahkan error baru
            ]);
        } catch (error: any) {
            setTrainingErrors((prevErrors) => [
                ...prevErrors.filter((err) => err.id !== index), // Hapus error lama jika ada
                { id: index, error: error.errors[0].message },  // Tambahkan error baru
            ]);
        }
    };
    

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
                                manipulateTrainingError(indexComp, "name", e.target.value)
                            }}
                        />
                        {trainingErrors.find((e)=>e.id === indexComp) && (
                            <p className="text-red-500 text-sm mt-1">{trainingErrors.find((e)=>e.id === indexComp)?.error}</p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end items-end md:items-center md:justify-center w-full md:w-1/12 md:mt-0 mt-2">
                    <Button type="button" variant="destructive" size="icon" onClick={() => {
                        removeErrorTraining(indexComp);
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
                        console.log(trainingWanted, trainingErrors);
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
    const {gkmErr, setGKMErr } = formValidContext.useGKMErr();

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
    
    const manipulateGKMErr = (field: keyof contextHook.GKMHistoryItem, value: string | number) => {
        setGkmHistory((prev) => {
            if (!prev) return { amountOfTime: 0, highestPosition: "" };
            return { ...prev, [field]: value };
        });
        
        // Validasi
        try {
            validationGkm.shape[field].parse(value);
            setGKMErr((prev) => ({
                ...prev,
                [field]: "",
            }));
        } catch (error: any) {
            setGKMErr((prev) => ({
                ...prev,
                [field]: error.errors[0].message,
            }));
        }
    };

    const validationGkm = z.object({
        amountOfTime: z.preprocess(
            (val) => (val === "" ? NaN : val), z.number().min(0, "Isilah dengan angka yang valid")),
        highestPosition: z.string().min(1, "Posisi tidak boleh kosong"),
        id: z.string().min(1, "ID Kosong!"),
    });

    console.log(gkmHistory, gkmErr)

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
                                        manipulateGKMErr("amountOfTime", input);
                                        updateGKM("", input, "amountOfTime");
                                    }}
                                />
                                {gkmErr.amountOfTime !== "" && (
                                    <p className="text-red-500 text-sm mt-1">{gkmErr.amountOfTime}</p>
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
                                    disabled={gkmHistory?.amountOfTime === 0 ? true :  false}
                                    placeholder={gkmHistory ? gkmHistory.amountOfTime === 0 ? "-" : (gkmHistory.highestPosition || "Jabatan tertinggi")  : "Jabatan Tertinggi"}
                                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onBlur={(e) => 
                                        {
                                            manipulateGKMErr("highestPosition", e.target.value);
                                            updateGKM(e.target.value, 0, "highestPosition");
                                        }
                                    }
                                />
                                {gkmErr.highestPosition !== "" && (
                                    <p className="text-red-500 text-sm mt-1">{gkmErr.highestPosition}</p>
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

    

    const {mentorErr, setMentorErr} = formValidContext.useMentorErr();
    const updateMentor = (valString: string, field: keyof contextHook.MentorWanted) => {
        setMentorWanted(prev => prev ? { ...prev, [field]: valString } : { name: "", jabatan: "", cabang: "" });
    };

    const validationMentor = z.object({
        name: z.string().min(1, "Nama mentor tidak boleh kosong"),
        jabatan: z.string().min(1, "Jabatan mentor tidak boleh kosong"),
        cabang: z.string().min(1, "Cabang mentor tidak boleh kosong"),
    });

    const manipulateMentorErr = (field: keyof contextHook.MentorWanted, value: string) => {
        setMentorWanted((prev) => ({ ...prev, [field]: value } as contextHook.MentorWanted));
        
        // Validasi
        try {
            validationMentor.shape[field].parse(value);
            setMentorErr((prev) => ({
                ...prev,
                [field]: "",
            }));
        } catch (error: any) {
            setMentorErr((prev) => ({
                ...prev,
                [field]: error.errors[0].message,
            }));
        }
    };

    console.log(mentorWanted, mentorErr);

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
                                            manipulateMentorErr("name", e.target.value);
                                        }
                                    }
                                />
                                {mentorErr.name !== "" && (
                                    <p className="text-red-500 text-sm mt-1">{mentorErr.name}</p>
                                )}
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
                                        manipulateMentorErr("jabatan", trimmedValue);
                                    }}
                                    onOpenChange={(isOpen)=>{
                                        if(!isOpen){
                                            if (mentorWanted?.jabatan === "") {
                                                manipulateMentorErr("jabatan", "");
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
                                {mentorErr.jabatan !== "" && (
                                    <p className="text-red-500 text-sm mt-1">{mentorErr.jabatan}</p>
                                )}
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
                                        manipulateMentorErr("cabang", trimmedValue);
                                    }}
                                    onOpenChange={(isOpen)=>{
                                        if(!isOpen){
                                            if (mentorWanted?.cabang === "") {
                                                manipulateMentorErr("cabang", "");
                                            }
                                        }
                                        // if (!isOpen) {
                                        //     if(mentorErr !== null){
                                        //         if(mentorErr){
                                        //             setMentorErr({ 
                                        //                 name: "",
                                        //                 jabatan: "",
                                        //                 cabang: "Cabang mentor harus dipilih!",
                                        //             });
                                        //         } else {
                                        //             const dupliTemp = mentorErr.map(e=>e);
                                        //             dupliTemp.push({...formValidContext.careerHistoryErrInVal[0], id:indexComp, personnelArea: "Cabang harus dipilih!"});
                                        //             setMentorErr(dupliTemp);
                                        //         }
                                        //     }else{
                                        //         setMentorErr([{...formValidContext.careerHistoryErrInVal[0],id: indexComp, personnelArea: "Cabang harus dipilih!"}]);
                                        //     }
                                        // }
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
                                {mentorErr.cabang !== "" && (
                                    <p className="text-red-500 text-sm mt-1">{mentorErr.cabang}</p>
                                )}
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
    const { empCErr, setempCErr} = formValidContext.useempCErr();
    const interested = (val:boolean) => {
        setEmpCareerChoice(
            {   careerDevWill: val,
                rotationWill: null,
                crossDeptWill: null
            }
        );
        setempCErr(
            {
                careerDevWill: true,
                rotationWill: false,
                crossDeptWill: false
            }
        )
    };
    const rotWill = (val: boolean) => {
        setEmpCareerChoice((prev) => {
            if (!prev) return null;
            return { ...prev, rotationWill: val };
        });
        setempCErr((prev)=>{
            return {
                ...prev, rotationWill: true
            }
        })
    };
    
    const CDWill = (val: boolean) => {
        setEmpCareerChoice((prev) => {
            if (!prev) return null;
            return { ...prev, crossDeptWill: val };
        });
        setempCErr((prev)=>{
            return {
                ...prev, crossDeptWill: true
            }
        })
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
                    {empCErr.careerDevWill === false && <p className="text-red-500 text-sm mt-1">Pilihlah salah satu!</p>}
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
