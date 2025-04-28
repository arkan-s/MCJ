"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"
import { branch, department, level, position } from "@/utils/fetchData"
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



// Schema
const formSchema = z.object({
    nomorIndukKaryawan: z
    .string()
    .min(4, "Nomor Induk Karyawan minimal 4 karakter")
    .regex(/^\d+$/, "Nomor Induk Karyawan hanya boleh angka"),
    namaKaryawan: z.string().min(1, "Harus Diisi"),
    personnelArea: z.string().min(1, "Harus dipilih"),
    personnelSubarea: z.string().min(1, "Harus dipilih"),
    position: z.number(),
    levelPosition: z.string().min(1, "Harus dipilih"),
    tanggalMasukKerja: z.coerce.date({ invalid_type_error: "Tanggal masuk kerja harus valid" }), // ← jadi Date
    tanggalLahir: z.coerce.date({ invalid_type_error: "Tanggal lahir harus valid" }), // ← jadi Date
    gender: z.enum(["Female", "Male"], { message: "Pilih gender" }),
    pend: z.string().min(1, "Isilah Pendidikan Terakhir Karyawan yang Bersangkutan"),
    namaSekolah: z.string().min(1, "Harus Diisi"),
    namaJurusan: z.string().min(1, "Harus Diisi"),
})



export default function AddEmployeeForm() {
    const { data: branchData, isLoading: branchLoading, isError: branchError } = useQuery({
        queryKey: ["cabang"],
        queryFn: branch,
        retry: 3, 
        retryDelay: attemptIndex => Math.min(1000 * 1 ** attemptIndex, 30000),
        staleTime: Infinity,
        
    });
    
    const { data: departmentData, isLoading: departmentLoading, isError: departmentError } = useQuery({
        queryKey: ["department"],
        queryFn: department,
        retry: 3, 
        retryDelay: attemptIndex => Math.min(1000 * 1 ** attemptIndex, 30000),
        staleTime: Infinity,        
    });
    
    const { data: positionData, isLoading: positionLoading, isError: positionError } = useQuery({
        queryKey: ["position"],
        queryFn: position,
        retry: 3, 
        retryDelay: attemptIndex => Math.min(1000 * 1 ** attemptIndex, 30000),
        staleTime: Infinity, 
    });
    
    const { data: levelData, isLoading: levelLoading, isError: levelError } = useQuery({
        queryKey: ["level"],
        queryFn: level,
        retry: 3, 
        retryDelay: attemptIndex => Math.min(1000 * 1 ** attemptIndex, 30000),
        staleTime: Infinity, 
    });

    const [submittedData, setSubmittedData] = useState<any>(null)
    const [positions, setPositions] = useState<{ idPosition: number, namaPosition: string, dept: string }[]>();
    const [currentDept, setCurrentDept] = useState<string | undefined>();

    useEffect(() => {
        if (!positionLoading && !positionError && positionData) {
            const filteredPositions = positionData.filter((pos: any) => pos.dept === currentDept);
            setPositions(filteredPositions);
        }
    }, [positionData, positionLoading, positionError, currentDept]);
        

    // Initialize form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nomorIndukKaryawan: "",
            namaKaryawan: "",
            personnelArea: undefined,
            personnelSubarea: undefined,
            position: undefined,
            levelPosition: undefined,
            tanggalMasukKerja: undefined,
            tanggalLahir: undefined,
            gender: undefined,
            pend: "",
            namaSekolah: "",
            namaJurusan: "",
        },
    })

    const tingkatPendidikan = [
        { label: "SD", value: "SD" },
        { label: "SMP", value: "SMP" },
        { label: "SMA/SMK", value: "SMA/SMK" },
        { label: "D1", value: "D1" },
        { label: "D2", value: "D2" },
        { label: "D3", value: "D3" },
        { label: "D4", value: "D4" },
        { label: "S1", value: "S1" },
        { label: "S2", value: "S2" },
        { label: "S3", value: "S3" },
    ];
    

    // Handle form submission
    const [ submitResult, setSubmitResult ] = useState<{message: string, detail: string, popUp: boolean}>({message: "", detail:"", popUp:false});
    const [ submitLoading, setSubmitLoading ] = useState<{message: string, popUp: boolean}>({message: "", popUp:false});
    async function onSubmit(values: z.infer<typeof formSchema>) {

        setSubmittedData(values)
        setSubmitLoading({message: "Sedang diproses! Mohon ditunggu...", popUp: true})
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/EmployeeUsers/${values.nomorIndukKaryawan}`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        });

        if (!response.ok) {
            const errorData = await response.json();
            setSubmitLoading({message: "", popUp: false});

            setSubmitResult({message: errorData.error, detail: errorData.message, popUp: true});
            return;
        }

        setSubmitLoading({message: "", popUp: false})

    }

    return (
        <div className="flex lg:flex-wrap justify-between w-full bg-gray-100 mt-4 p-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className=" flex flex-wrap justify-between gap-6 bg-white p-6 rounded-lg shadow-md w-full">
                    {/* Nomor Induk Karyawan */}
                    <FormField
                        control={form.control}
                        name="nomorIndukKaryawan"
                        render={({ field }) => (
                            <FormItem className="inline-block w-full lg:w-2/5">
                                <FormLabel>Nomor Induk Karyawan</FormLabel>
                                <FormControl>
                                    <Input className="border-2 border-zinc-300" placeholder="Masukkan Nomor Induk Karyawan!" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Nama */}
                    <FormField
                        control={form.control}
                        name="namaKaryawan"
                        render={({ field }) => (
                            <FormItem className="inline-block w-full lg:w-2/5">
                                <FormLabel>Nama</FormLabel>
                                <FormControl>
                                    <Input className="border-2 border-zinc-300" placeholder="Masukkan Nama Karyawan!" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Personnel Area */}
                    <FormField
                        control={form.control}
                        name="personnelArea"
                        render={({ field }) => (
                            <FormItem className="inline-block w-full lg:w-2/5">
                                <FormLabel>Cabang</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger disabled={branchLoading} className="border-2 border-zinc-300">
                                            <SelectValue placeholder="Pilih Cabang" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {branchLoading ? 
                                            (
                                                <div className="flex justify-center items-center">
                                                    <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                                                    <p className="ml-2 text-sm text-gray-500">Loading...</p>
                                                </div>
                                            ) : branchError ? (
                                                <div className="flex justify-center items-center">
                                                    <p className="text-sm text-red-500">Datanya kosong atau terjadi error. Mohon untuk refresh.</p>
                                                </div>
                                            ) : (
                                                branchData.map((br: any, index: any) => (
                                                    <SelectItem key={index} value={br.idBranch}>{br.namaBranch}</SelectItem>
                                                ))
                                            )
                                        }
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="personnelSubarea"
                        render={({ field }) => (
                            <FormItem className="inline-block w-full lg:w-2/5">
                                <FormLabel>Department</FormLabel>
                                <Select onValueChange={(val)=>{ 
                                    field.onChange(val);
                                    setCurrentDept(val);
                                }} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger disabled={departmentLoading} className="border-2 border-zinc-300">
                                            <SelectValue placeholder="Pilih Department" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {departmentLoading ? 
                                        (
                                            <div className="flex justify-center items-center">
                                                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                                                <p className="ml-2 text-sm text-gray-500">Loading...</p>
                                            </div>
                                        ) : departmentError ? (
                                            <div className="flex justify-center items-center">
                                                <p className="text-sm text-red-500">Datanya kosong atau terjadi error. Mohon untuk refresh.</p>
                                            </div>
                                        ) : (
                                            departmentData.map((dept: any, index: any) => (
                                                <SelectItem key={index} value={dept.idDepartment}>{dept.namaDepartment}</SelectItem>
                                            ))
                                        )
                                    }
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                            <FormItem className="inline-block w-full lg:w-2/5">
                                <FormLabel>Posisi</FormLabel>
                                <Select disabled={!currentDept} onValueChange={(val) => field.onChange(Number(val))} >
                                    <FormControl>
                                        <SelectTrigger disabled={positionLoading && currentDept === null && currentDept === undefined} className="border-2 border-zinc-300">
                                            <SelectValue placeholder="Pilih Posisi" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {positionLoading ? 
                                            (
                                                <div className="flex justify-center items-center">
                                                    <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                                                    <p className="ml-2 text-sm text-gray-500">Loading...</p>
                                                </div>
                                            ) : positionError ? (
                                                <div className="flex justify-center items-center">
                                                    <p className="text-sm text-red-500">Datanya kosong atau terjadi error. Mohon untuk refresh.</p>
                                                </div>
                                            ) : (
                                                (positions ?? []).map((pos: any, index:any) => (
                                                    <SelectItem key={index} value={String(pos.idPosition)}>{pos.namaPosition}</SelectItem>
                                                ))
                                            )
                                        }
                                    </SelectContent>
                                </Select>
                                {!currentDept && <p className="text-sm text-gray-500 italic">Pilih Department terlebih dahulu</p>}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="levelPosition"
                        render={({ field }) => (
                            <FormItem className="inline-block w-full lg:w-2/5">
                                <FormLabel>Level</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="border-2 border-zinc-300">
                                            <SelectValue placeholder="Pilih Level" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {levelLoading ? 
                                        (
                                            <div className="flex justify-center items-center">
                                                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                                                <p className="ml-2 text-sm text-gray-500">Loading...</p>
                                            </div>
                                        ) : levelError ? (
                                            <div className="flex justify-center items-center">
                                                <p className="text-sm text-red-500">Datanya kosong atau terjadi error. Mohon untuk refresh.</p>
                                            </div>
                                        ) : (
                                            levelData.map((dept: any, index: any) => (
                                                <SelectItem key={index} value={dept.idLevel}>{dept.namaLevel}</SelectItem>
                                            ))
                                        )
                                    }
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="tanggalMasukKerja"
                        render={({ field }) => (
                            <FormItem className="inline-block w-full lg:w-2/5">
                                <FormLabel>TMK</FormLabel>
                                <Input 
                                    type="date" 
                                    className="border-2 border-zinc-300 p-2 rounded-md flex justify-center w-full"
                                    placeholder="Pilih Tanggal Masuk Kerja"
                                    {...field}
                                    value={field.value ? new Date(field.value).toISOString().split('T')[0] : ""}
                                    onChange={(e) => field.onChange(e.target.value)}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                <FormField
                        control={form.control}
                        name="tanggalLahir"
                        render={({ field }) => (
                            <FormItem className="inline-block w-full lg:w-2/5">
                                <FormLabel>Tanggal Lahir</FormLabel>
                                <Input 
                                    type="date" 
                                    className="border-2 border-zinc-300 p-2 rounded-md flex justify-center w-full"
                                    placeholder="Pilih Tanggal Lahir"
                                    {...field}
                                    value={field.value ? new Date(field.value).toISOString().split('T')[0] : ""}
                                    onChange={(e) => field.onChange(e.target.value)}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    {/* Gender */}
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem className="inline-block w-full lg:w-2/5">
                                <FormLabel>Jenis Kelamin</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="border-2 border-zinc-300">
                                            <SelectValue placeholder="Pilih Gender" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Male">Laki-laki</SelectItem>
                                        <SelectItem value="Female">Perempuan</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

            <FormField
            control={form.control}
            name="pend"
            render={({ field }) => (
                <FormItem className="inline-block w-full lg:w-2/5">
                <FormLabel>Tingkat Pendidikan Terakhir</FormLabel>
                <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="border-2 border-zinc-300">
                        <SelectValue placeholder="Pilih tingkat pendidikan" />
                    </SelectTrigger>
                    <SelectContent>
                        {tingkatPendidikan.map((pend: any) => (
                        <SelectItem key={pend.value} value={pend.value}>
                            {pend.label}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

                    <FormField
                        control={form.control}
                        name="namaSekolah"
                        render={({ field }) => (
                            <FormItem className="inline-block w-full lg:w-2/5">
                                <FormLabel>Nama Institusi Pendidikan Terakhir Karyawan</FormLabel>
                                <FormControl>
                                    <Input className="border-2 border-zinc-300" placeholder="Masukkan Nama Institusi Pendidikan!" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="namaJurusan"
                        render={({ field }) => (
                            <FormItem className="inline-block w-full lg:w-2/5">
                                <FormLabel>Jurusan yang Ditempuh</FormLabel>
                                <FormControl>
                                    <Input className="border-2 border-zinc-300" placeholder="Masukkan Nama Jurusan Karyawan!" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <Button type="submit"  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Submit
                    </Button>
                </form>
            </Form>
            <AlertDialog open={submitResult.popUp} >
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle className="font-extrabold text-xl">{submitResult.message}</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm">
                        {submitResult.detail}
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel onClick={()=>setSubmitResult({message: "", detail: "", popUp: false})} className="border-2 border-zinc-700" >Tutup</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog 
            open={submitLoading.popUp}
            onOpenChange={(open) => {
                if (!open) setSubmitLoading({message: "", popUp: false});
            }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle className="font-extrabold text-xl">Sedang diproses</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm">
                        {submitLoading.message}
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
        
    )
}
