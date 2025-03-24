import { bitter } from "../fonts";
import  * as contextHook  from "@/hooks/context/formcontext";

export function MentorWantedComponents(){
    
    function MentorWantedComponent(){
        return (
            <div className={`${bitter.className} block flex-col gap-5 shadow-lg p-3 w-auto h-auto bg-white rounded-lg`}>
                <div className="flex flex-wrap justify-between gap-1"> {/*ABOUT POSITION */} {/*AMBIL DATA BUAT BIKIN DROPDOWN LIST BUAT POSISI DAN CABANG*/}
                    <div className="flex flex-col gap-1 w-5/12">
                        <label htmlFor={`name`}><b>Nama</b></label>
                        <input
                            type="text"
                            id={`name`}
                            name={`name`}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={
                                !mentorWanted || !mentorWanted.name ? 
                                        "Siapa orang yang anda ingin jadikan mentor?" : 
                                        String(mentorWanted.name)
                            }
                            onBlur={
                                (e) => {
                                    const previousValue = e.target.defaultValue; 
                                    const trimmedValue = e.target.value.trim(); 
                            
                                    if (trimmedValue === "") {
                                        e.target.value = previousValue;
                                    }
                                    handleOnBlur(e.target.value, new Date(), 0, "name");
                                }
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-5/12">
                        <label htmlFor={`position`}><b>Posisi</b></label>
                        <input
                            type="text"
                            id={`position`}
                            name={`position`}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={
                                !mentorWanted || !mentorWanted.name ? 
                                        "Apa posisi orang yang anda ingin jadikan mentor tersebut?" : 
                                        String(mentorWanted.jabatan)
                            }
                            onBlur={
                                (e) => {
                                    const previousValue = e.target.defaultValue; 
                                    const trimmedValue = e.target.value.trim(); 
                            
                                    if (trimmedValue === "") {
                                        e.target.value = previousValue;
                                    }
                                    handleOnBlur(e.target.value, new Date(), 0, "jabatan");
                                }
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor={`branch`}><b>Cabang</b></label>
                        <input
                            type="text"
                            id={`branch`}
                            name={`branch`}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={
                                !mentorWanted || !mentorWanted.name ? 
                                        "Dari cabang mana orang yang anda ingin jadikan mentor tersebut?" : 
                                        String(mentorWanted.cabang)
                            }
                            onBlur={
                                (e) => {
                                    const previousValue = e.target.defaultValue; 
                                    const trimmedValue = e.target.value.trim(); 
                            
                                    if (trimmedValue === "") {
                                        e.target.value = previousValue;
                                    }
                                    handleOnBlur(e.target.value, new Date(), 0, "cabang");
                                }
                            }
                        />
                    </div>
                </div>
            </div>
        )
    }

    const { mentorWanted, setMentorWanted } = contextHook.useMentorWanted()!;
    
    const handleOnBlur = (valString: string = "", valDate: Date = new Date(), valNumber: number = 0, whatdata: string)=>{
        const newMentorWanted: contextHook.MentorWanted = {
            name: whatdata === "name" ? valString : mentorWanted?.name ? contextHook.initialMentorWantedVal.name : "",
            jabatan: whatdata === "jabatan" ? valString : mentorWanted?.jabatan ? contextHook.initialMentorWantedVal.jabatan : "",
            cabang: whatdata === "cabang" ? valString : mentorWanted?.cabang ? contextHook.initialMentorWantedVal.cabang : ""
        }
        return setMentorWanted( newMentorWanted === undefined ? contextHook.initialMentorWantedVal : newMentorWanted)
    }

    return(
        <form>
            <MentorWantedComponent></MentorWantedComponent>
        </form>
    )
}