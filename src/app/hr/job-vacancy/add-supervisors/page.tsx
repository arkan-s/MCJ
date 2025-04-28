'use client'
import { AddFile } from "@/components/ui/addFile/AddFile"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { ScrollArea } from "@/components/ui/scroll-area"

import { Separator } from "@/components/ui/separator"

export default function AddData(){
    const router = useRouter()
    const handleNavigation = (href: string) => {
        router.push(href); // Redirect to "/dashboard"
    };
    return ( 
        <>
            <div className="flex flex-col items-center justify-center grow py-4">
                <div className="w-[80%] flex flex-col justify-between items-center py-4">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="self-start border-2 border-amber-500 font-bold hover:font-extrabold" size="lg">
                                Penting!
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="flex flex-col max-w-[80%] max-h-[80vh]"> 
                            <AlertDialogHeader className="flex-shrink-0">
                                <AlertDialogTitle className="font-extrabold text-xl">Instuksi</AlertDialogTitle>
                            </AlertDialogHeader>

                            {/* Scrollable content */}
                            <ScrollArea className="flex-grow h-[50vh] overflow-y-auto p-2">
                                <div>
                                    <h1 className="mb-3 font-bold">Terkait Fungsi</h1>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>
                                            <p>Tombol besar di tengah digunakan untuk mengupload file excel nominasi karyawan.</p>
                                        </li>
                                        <li>
                                            <p>Data nominasi karyawan akan disimpan di sistem dan akan dibuatkan akun per karyawan.</p>
                                        </li>
                                        <li>
                                            <p>
                                                Harap memastikan NIK dalam setiap baris excel berbeda atau unik karena NIK yang sama akan diskip. <br />
                                                Terkait kasus NIK ganda, jika terdapat karyawan yang terlewat, harap ditambah manual pada tombol "Tambah Secara Individual".
                                            </p>
                                        </li>
                                        <li>
                                            <p > <strong>Penting!</strong> Dalam mengupload file excel, diharuskan mengikuti template struktur file excel yang dijelaskan di bagian "Aturan File Excel"</p>
                                        </li>
                                    </ul>
                                </div>
                                <Separator className="my-3" />
                                <div>
                                    <h1 className="mb-4 font-bold">Aturan File Excel</h1>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>
                                            <p>Excel hanya boleh memiliki satu sheet.</p>
                                        </li>
                                        <li>
                                            <p>Table data harus dimulai dari Column B dengan Column A dibiarkan kosong.</p>
                                        </li>
                                        <li>
                                            <p>Table data harus dimulai dari Row 1 yang merupakan header dari table data.</p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Penting!</strong> Harap mengikuti urutan header berikut:
                                                <br /> B1 = No {"(tidak terlalu penting, tetapi harus ada)"}
                                                <br /> C1 = Personnel Area
                                                <br /> D1 = Pers. Number {"(atau Nomor Induk Karyawan)"}
                                                <br /> E1 = Employee Name
                                                <br /> F1 = Position
                                                <br /> G1 = Personnel Subarea {"(Gunakan departemen berformat seperti \"ADM Fin.& Acct.\")"}
                                                <br /> H1 = Lv {"(Gunakan level yang berformat \"Spv\", \"Staff\", \"Mgr\", dan \"Opr\")"}
                                                <br /> I1 = TMK
                                                <br /> J1 = Birthdate
                                                <br /> K1 = Gender {"(\"Female\" atau \"Male\")"}
                                                <br /> L1 = Age
                                                <br /> M1 = Length of Service
                                                <br /> N1 = Pend
                                                <br /> O1 = Nama Sekolah/Univ
                                                <br /> P1 = Jurusan
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            </ScrollArea>

                            {/* Footer with Close Button */}
                            <AlertDialogFooter className="flex-shrink-0">
                                <AlertDialogAction className="border-2 border-zinc-700">Download Template</AlertDialogAction>
                                <AlertDialogCancel className="border-2 border-zinc-700">Close</AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </div>
                <AddFile url={"/supervisors"}>
                </AddFile>
                {/* <div className="w-[80%] flex flex-col justify-between items-center py-4">
                    <Button className="self-end bg-blue-500 hover:bg-blue-300" variant="default" size="lg" onClick={()=>handleNavigation("/hr/accountcontrol/addaccount/employee")}>
                        Tambah Secara Individual
                    </Button>
                </div> */}
            </div>
        </>
    )
}