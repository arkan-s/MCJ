import { bitter } from "@/components/ui/fonts";
import  * as contextHook  from "@/hooks/context/formcontext";


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
                        <button onClick={()=>{interested(true)}} className={`border text-lg font-semibold py-2 px-4 rounded-md w-[45%] md:w-[35%] shadow-md active:bg-blue-500
                        ${empCareerChoice?.careerDevWill === true ? "bg-blue-600 text-white shadow-inner border-white-400" : "bg-blue-50 border-blue-500 text-blue-500 opacity-[0.7] hover:opacity-[1] hover:bg-blue-400 hover:text-white"}
                    `}>YES</button>
                        <button onClick={()=>{interested(false)}} className={`border border-zinc-500 text-lg font-semibold py-2 px-4 rounded-md w-[45%] md:w-[35%] active:bg-zinc-400
                        ${empCareerChoice?.careerDevWill === false ? "bg-zinc-600 text-white" : "opacity-[0.5] hover:bg-zinc-200 hover:opacity-[1]"}
                    `}>NO</button>
                    </div>
                </div>
                <div className={`${empCareerChoice?.careerDevWill === true? 'block' : 'hidden'}`}>
                    <h3 className="mb-1 mt-3 text-lg font-medium text-gray-900">Do you want to get rotated to another branch?</h3>
                    <div className="flex justify-around">
                        <button onClick={()=>{rotWill(true)}} className={`border text-lg font-semibold py-2 px-4 rounded-md w-[45%] md:w-[35%] shadow-md active:bg-blue-500
                        ${empCareerChoice?.rotationWill === true ? "bg-blue-600 text-white shadow-inner border-white-400" : "bg-blue-50 border-blue-500 text-blue-500 opacity-[0.6] hover:opacity-[1] hover:bg-blue-400 hover:text-white"}
                    `}>YES</button>
                        <button onClick={()=>{rotWill(false)}} className={`border border-zinc-500 text-lg font-semibold py-2 px-4 rounded-md w-[45%] md:w-[35%] active:bg-zinc-400
                        ${empCareerChoice?.rotationWill === false ? "bg-zinc-600 text-white" : "opacity-[0.5] hover:bg-zinc-200 hover:opacity-[1]"}
                    `}>NO</button>
                    </div>
                    <h3 className="mb-1 mt-3 text-lg font-medium text-gray-900">Are you interested in having career in another departement?</h3>
                    <div className="flex justify-around">
                        <button onClick={()=>{CDWill(true)}} className={`border text-lg font-semibold py-2 px-4 rounded-md w-[45%] md:w-[35%] shadow-md active:bg-blue-500
                        ${empCareerChoice?.crossDeptWill === true ? "bg-blue-600 text-white shadow-inner border-white-400" : "bg-blue-50 border-blue-500 text-blue-500 opacity-[0.6] hover:opacity-[1] hover:bg-blue-400 hover:text-white"}
                    `}>YES</button>
                        <button onClick={()=>{CDWill(false)}} className={`border border-zinc-500 text-lg font-semibold py-2 px-4 rounded-md w-[45%] md:w-[35%] active:bg-zinc-400
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