import { bitter } from "../fonts";
import  * as contextHook  from "@/hooks/context/formcontext";

export function BestEmployeeComponents(){
    function InputBestEmployee(){
        return (
            <div className={`${bitter.className} flex flex-col w-full h-1/5 justify-center p-3`}>
                
                <label htmlFor="bestEmployeeInput" className="block mb-2 text-xl md:text-2xl font-normal text-gray-900">Best Employee Records</label>
                <input 
                    type="number" 
                    id="bestEmployeeInput" 
                    name="bestEmployeeInput"
                    className="border-b border-gray-300 text-gray-300 text-xl focus:border-b-2 focus:border-blue-500 focus:outline-none focus:caret-blue-500 block w-full p-1 focus:text-gray-900 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" 
                    placeholder={
                        !bestEmployee ? 
                                "Seberapa banyak anda pernah menjadi karyawan teladan?" : 
                                String(bestEmployee)
                    }
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

