import { bitter } from "../fonts";
import  * as contextHook  from "@/hooks/context/formcontext";
import { AnimatePresence, motion } from "framer-motion";

export function OrgIntHistoryComponents(){
    
    function OrgIntHistoryComponent({indexComp}:{indexComp:number}){
        return (
            <div className={`${bitter.className} block flex-col gap-5 shadow-lg p-3 w-auto h-auto bg-white rounded-lg`}>
                <div className="flex flex-wrap justify-between gap-1"> 
                    
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor={`Nama${String(indexComp)}`}><b>Nama Organisasi</b></label>
                        <select
                            id={`Nama${String(indexComp)}`}
                            name={`Nama${String(indexComp)}`}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            defaultValue={
                                !orgIntHistory || orgIntHistory.length === 0 || !orgIntHistory[indexComp] ? 
                                    "" : 
                                    orgIntHistory[indexComp].name ? 
                                        orgIntHistory[indexComp].name : 
                                        ""
                            }
                            onBlur={
                                (e) => {
                                    handleOnBlurOrgInt(e.target.value, new Date(), 0, "name", indexComp)
                                }
                            }
                        >
                            <option value="" disabled>Pilih Organisasi...</option>
                            <option value="Koperasi">Koperasi</option>
                            <option value="LDS">LDS</option>
                            <option value="Serikat Pekerja">Serikat Pekerja</option>
                            <option value="lainnya">Lainnya</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1 w-6/12">
                        <label htmlFor={`position${String(indexComp)}`}><b>Posisi</b></label>
                        <input
                            type="text"
                            id={`position${String(indexComp)}`}
                            name={`position${String(indexComp)}`}
                            placeholder={
                                !orgIntHistory || orgIntHistory.length === 0 || !orgIntHistory[indexComp] ? 
                                    "Masukkan jabatan anda" : 
                                    orgIntHistory[indexComp].jabatan ? 
                                        orgIntHistory[indexComp].jabatan : 
                                        "Masukkan jabatan anda"
                            }
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onBlur={
                                (e) => {
                                    const previousValue = e.target.defaultValue; 
                                    const trimmedValue = e.target.value.trim(); 
                            
                                    if (trimmedValue === "") {
                                        e.target.value = previousValue;
                                    }
                                    handleOnBlurOrgInt(e.target.value, new Date(), 0, "jabatan", indexComp);
                                }
                            }
                            />
                    </div>
                    <div className="flex flex-col gap-1 w-5/12">
                        <label htmlFor={`startYear${String(indexComp)}`}><b>Tahun Awal Kepengurusan</b></label>
                        <input
                            type="date"
                            id={`startYear${String(indexComp)}`}
                            name={`startYear${String(indexComp)}`}
                            placeholder={
                                !orgIntHistory || orgIntHistory.length === 0 || !orgIntHistory[indexComp] ? 
                                    "Masukkan tahun awal kepengurusan Anda" : 
                                    orgIntHistory[indexComp].startYear ? 
                                        String(orgIntHistory[indexComp].startYear) : 
                                        "Masukkan tahun awal kepengurusan Anda"
                            }
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onBlur={
                                (e) => {
                                    const previousValue = e.target.defaultValue; 
                                    const trimmedValue = e.target.value.trim(); 
                            
                                    if (trimmedValue === "") {
                                        e.target.value = previousValue;
                                    }
                                    handleOnBlurOrgInt("", new Date(), parseInt(e.target.value), "startYear", indexComp);
                                }
                            }
                            />
                    </div>
                    {/* BUAT LAMA BEKERJA */}
                    {/* <div className="flex flex-col gap-1 w-5/12">
                        <label htmlFor={`startYear${String(indexComp)}`}><b>Start Year</b></label>
                        <input
                            type="date"
                            id={`startYear${String(indexComp)}`}
                            name={`startYear${String(indexComp)}`}
                            placeholder=""
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                    </div> */}
                    
                </div>
            </div>
        )
    }
    
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

    return (
        <>
        {/* MAP CONTEXT DI SINI */}
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
                        <OrgIntHistoryComponent indexComp={indexcomp}></OrgIntHistoryComponent>
                    </motion.div>
                )
            })}
        </form>
        <button className={` flex justify-center items-center bg-blue-500 text-white text-lg font-semibold py-2 px-4 rounded-md w-full md:w-[25%] hover:bg-blue-600 mt-5`}
                onClick={handleAddComponentOrgInt}>
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