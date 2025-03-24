import { bitter } from "../fonts";
import  * as contextHook  from "@/hooks/context/formcontext";

export function GKMHistoryComponents(){

    function GKMHistoryComponent(){
        return (
            <div className={`${bitter.className} block flex-col gap-5 p-3 w-auto h-auto rounded-lg shadow-lg`}>
                <div className="flex flex-wrap justify-between gap-1"> 
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor={`gkm`} ><b>Berapa kali berada pada kepengurusan GKM?</b></label>
                        <input id={`gkm`} name={`gkm`} className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder={
                            !gkmHistory || !gkmHistory.amountOfTime ? 
                                    "Sudah berapa banyak anda mengikuti GKM?" : 
                                    String(gkmHistory.amountOfTime)
                        }
                        onBlur={
                            (e) => {
                                const previousValue = e.target.defaultValue; 
                                const trimmedValue = e.target.value.trim(); 
                        
                                if (trimmedValue === "") {
                                    e.target.value = previousValue;
                                }
                                handleOnBlur("", new Date(), parseInt(e.target.value), "name");
                            }
                        }
                        type="number" min="1" max="120" step="1" x-model="charsLength"/>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor={`highestPos`} ><b>Posisi Tertinggi</b></label>
                        <input
                            type="text"
                            id={`highestPos`}
                            name={`highestPos`}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={
                                !gkmHistory || !gkmHistory.highestPosition ? 
                                        "Apa posisi tertinggi anda selama berada di GKM?" : 
                                        String(gkmHistory.highestPosition)
                            }
                            onBlur={
                                (e) => {
                                    const previousValue = e.target.defaultValue; 
                                    const trimmedValue = e.target.value.trim(); 
                            
                                    if (trimmedValue === "") {
                                        e.target.value = previousValue;
                                    }
                                    handleOnBlur(e.target.value, new Date(), 0, "hp");
                                }
                            }
                        />
                    </div>
                </div>
            </div>
        )
    }

    const { gkmHistory, setGkmHistory } = contextHook.useGKMHistory()!;

    const handleOnBlur = (valString: string = "", valDate: Date = new Date(), valNumber: number = 0, whatdata: string)=>{
        const newGkmHistory: contextHook.GKMHistoryItem = {
            amountOfTime: whatdata === "aot" ? valNumber : gkmHistory?.amountOfTime ? contextHook.initialGKMHistoryVal.amountOfTime : 0,
            highestPosition: whatdata === "hp" ? valString : gkmHistory?.highestPosition ? contextHook.initialGKMHistoryVal.highestPosition : ""
        };
            return setGkmHistory( newGkmHistory === undefined ? contextHook.initialGKMHistoryVal : newGkmHistory)
        }

    return (
        <form>
            
            <GKMHistoryComponent ></GKMHistoryComponent>
                    
        </form>
    )
}