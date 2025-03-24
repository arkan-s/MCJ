import { bitter } from "../fonts";
import  * as contextHook  from "@/hooks/context/formcontext";
import { AnimatePresence, motion } from "framer-motion";

export function ComiteeHistoryComponents(){

    function ComiteeHistoryComponent({indexComp}:{indexComp:number}){
        return (
            <div className={`${bitter.className} block flex-col gap-5 shadow-lg p-3 w-auto h-auto bg-white rounded-lg`}>
                <div className="flex flex-wrap justify-between gap-1"> 
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor={`Nama${String(indexComp)}`}><b>Nama</b></label>
                        <input
                            type="text"
                            id={`Nama${String(indexComp)}`}
                            name={`Nama${String(indexComp)}`}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={
                                !comiteeHistory || comiteeHistory.length === 0 || !comiteeHistory[indexComp] ? 
                                    "Masukkan nama acara kepanitian yang anda ikuti" : 
                                    comiteeHistory[indexComp].name ? 
                                        comiteeHistory[indexComp].name : 
                                        "Masukkan nama acara kepanitian yang anda ikuti"
                            }
                            onBlur={
                                (e) => {
                                    const previousValue = e.target.defaultValue; 
                                    const trimmedValue = e.target.value.trim(); 
                            
                                    if (trimmedValue === "") {
                                        e.target.value = previousValue;
                                    }
                                    handleOnBlur(e.target.value, new Date(), 0, "name", indexComp);
                                }
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-6/12">
                        <label htmlFor={`position${String(indexComp)}`}><b>Position</b></label>
                        <input
                            type="text"
                            id={`position${String(indexComp)}`}
                            name={`position${String(indexComp)}`}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={
                                !comiteeHistory || comiteeHistory.length === 0 || !comiteeHistory[indexComp] ? 
                                    "Masukkan posisi anda dalam acara kepanitian yang anda ikuti" : 
                                    comiteeHistory[indexComp].jabatan ? 
                                        comiteeHistory[indexComp].jabatan : 
                                        "Masukkan posisi anda dalam acara kepanitian yang anda ikuti"
                            }
                            onBlur={
                                (e) => {
                                    const previousValue = e.target.defaultValue; 
                                    const trimmedValue = e.target.value.trim(); 
                            
                                    if (trimmedValue === "") {
                                        e.target.value = previousValue;
                                    }
                                    handleOnBlur(e.target.value, new Date(), 0, "jabatan", indexComp);
                                }
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-5/12">
                        <label htmlFor={`startYear${String(indexComp)}`}><b>Start Year</b></label>
                        <input
                            type="date"
                            id={`startYear${String(indexComp)}`}
                            name={`startYear${String(indexComp)}`}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={
                                !comiteeHistory || comiteeHistory.length === 0 || !comiteeHistory[indexComp] ? 
                                    "Masukkan posisi anda dalam acara kepanitian yang anda ikuti" : 
                                    comiteeHistory[indexComp].year ? 
                                        String(comiteeHistory[indexComp].year) : 
                                        "Masukkan posisi anda dalam acara kepanitian yang anda ikuti"
                            }
                            onBlur={
                                (e) => {
                                    const previousValue = e.target.defaultValue; 
                                    const trimmedValue = e.target.value.trim(); 
                            
                                    if (trimmedValue === "") {
                                        e.target.value = previousValue;
                                    }
                                    handleOnBlur("", new Date(), parseInt(e.target.value), "year", indexComp);
                                }
                            }
                        />
                    </div>
                </div>
            </div>
        )
    }

    const { comiteeHistory, setComiteeHistory } = contextHook.useComiteeHistory()!;

    const handleAddComponent = () => {
        setComiteeHistory(comiteeHistory === null ?
                                contextHook.initialComiteeHistoryVal : 
                                [...comiteeHistory, contextHook.initialComiteeHistoryVal[0]]
                        )
    }

    const handleOnBlur = (valString: string = "", valDate: Date = new Date(), valNumber: number = 0, whatdata: string, indexComp: number)=>{
        const newComiteeHistory = comiteeHistory === undefined ? contextHook.initialComiteeHistoryVal : comiteeHistory?.map(
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
                        case "year":
                            return {
                                ...data,
                                year: valNumber
                            }
                        default:
                            return data;
                    }
                } else {
                    return data;
                }
            }
        )
        return setComiteeHistory( newComiteeHistory === undefined ? contextHook.initialComiteeHistoryVal : newComiteeHistory)
    }

    return (
        <>
        {/* MAP CONTEXT DI SINI */}
        <form>
            {comiteeHistory?.map((e, indexcomp)=>{
                return(
                    <motion.div
                        key={indexcomp}
                        initial={{ opacity: 0, scale: 0.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale:0.1 }}
                        transition={{ type: "spring", duration:1, stiffness: 250, damping: 15 }}
                        className="mb-2"
                    >
                        <ComiteeHistoryComponent indexComp={indexcomp}></ComiteeHistoryComponent>
                    </motion.div>
                )
            })}
        </form>
        <button className={` flex justify-center items-center bg-blue-500 text-white text-lg font-semibold py-2 px-4 rounded-md w-full md:w-[25%] hover:bg-blue-600 mt-5`}
                onClick={handleAddComponent}>
            <span className='mr-[10px]'>
                <svg
                width={20}
                height={20}
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
            Tambah
        </button>
    </>
    )
}