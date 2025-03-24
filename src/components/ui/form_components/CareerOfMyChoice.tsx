import { bitter } from "../fonts";
import  * as contextHook  from "@/hooks/context/formcontext";

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
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={
                                !careerOfMyChoice || !careerOfMyChoice.short || careerOfMyChoice.short === "" ?
                                    "Posisi apa yang kamu ingin capai dalam jangka waktu 1-3 tahun ke depan?":
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
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={
                                !careerOfMyChoice || !careerOfMyChoice.short || careerOfMyChoice.short === "" ?
                                    "Posisi apa yang kamu ingin capai dalam jangka waktu 3 sampai 5 tahun ke depan?":
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