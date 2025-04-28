import { ButtonAccountByRole } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"

export default function accountcontrolHR(){
    
    return (
        <>
        <ScrollArea className="flex flex-col pt-2 w-full lg:hidden flex-1 max-h-screen overflow-auto">
            <ButtonAccountByRole src="/image/karyawan.png" alt="logo karyawan" caption="Karyawan" href="/hr/accountcontrol/employee" />
            <ButtonAccountByRole src="/image/hr.png" alt="logo hr" caption="HR" href="/hr/accountcontrol/hr" />
            <ButtonAccountByRole src="/image/hd.png" alt="logo head dept" caption="Head Dept" href="/hr/accountcontrol/employee" />
        </ScrollArea>

        <div className="hidden lg:flex flex-row w-full justify-around items-center">
            <ButtonAccountByRole src="/image/karyawan.png" alt="logo karyawan" caption="Karyawan" href="/hr/accountcontrol/employee" />
            <ButtonAccountByRole src="/image/hr.png" alt="logo hr" caption="HR" href="/hr/accountcontrol/hr" />
            <ButtonAccountByRole src="/image/hd.png" alt="logo head dept" caption="Head Dept" href="/hr/accountcontrol/employee" />
        </div>
        </>

    )
}