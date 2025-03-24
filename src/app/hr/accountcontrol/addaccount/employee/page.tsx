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

// Schema
const formSchema = z.object({
    nomorIndukKaryawan: z.string().min(4, "Nomor Induk Karyawan minimal 4 karakter"),
    namaKaryawan: z.string().min(1, "Harus Diisi"),
    personnelArea: z.enum([
        'ICBP-Noodle Head Office', 'ICBP-Noodle DKI', 'ICBP-Noodle Cibitung',
        'ICBP-Noodle Tangerang', 'ICBP-Noodle Bandung', 'ICBP-Noodle Semarang',
        'ICBP-Noodle Surabaya', 'ICBP-Noodle Medan', 'ICBP-Noodle Cirebon',
        'ICBP-Noodle Pekanbaru', 'ICBP-Noodle Palembang', 'ICBP-Noodle Lampung',
        'ICBP-Noodle Banjarmasin', 'ICBP-Noodle Pontianak', 'ICBP-Noodle Manado',
        'ICBP-Noodle Makassar', 'ICBP-Noodle Jambi', 'ICBP-Noodle Tj. Api Api'
    ], { message: "Pilih cabang tempat bekerja!" }),
    personnelSubarea: z.enum([
        'ADM Fin.& Acct.', 'ADM Gen.Mgt', 'ADM HR', 'MFG Manufactur',
        'MFG PPIC', 'MFG Production', 'MFG Purchasing', 'MFG Technical',
        'MFG Warehouse', 'MKT Marketing', 'MKT Sales&Distr',
        'R&D QC/QA', 'R&D Resrch.Dev.'
    ], { message: "Pilih departemen tempat bekerja!" }),
    position: z.string(),
    level: z.enum(["mgr", "spv", "staff", "opr"], { message: "Pilih level karyawan" }),
    TMK: z.string().min(1, "Harus Diisi"), // ISO string untuk tanggal masuk kerja
    birthdate: z.string().min(1, "Harus Diisi"), // ISO string untuk tanggal lahir
    gender: z.enum(["Female", "Male"], { message: "Pilih gender" }),
    pend: z.string().min(1, "Isilah Pendidikan Terakhir Karyawan yang Bersangkutan"),
    namaSekolahUniv: z.string().min(1, "Harus Diisi"),
    namaJurusan: z.string().min(1, "Harus Diisi"),
})



export default function AddEmployeeForm() {
    const [submittedData, setSubmittedData] = useState<any>(null)
    const [positions, setPositions] = useState<{ namaPosition: string }[]>([]);


    useEffect(() => {
    fetch("/api/position") // Ganti dengan URL API backend
        .then((response) => response.json()) // Parse response menjadi JSON
        .then((data) => setPositions(data)) // Simpan data ke state
        .catch((error) => console.error("Error fetching positions:", error));
    }, []);


    // Initialize form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nomorIndukKaryawan: "",
            namaKaryawan: "",
            personnelArea: undefined,
            personnelSubarea: undefined,
            position: "",
            level: undefined,
            TMK: "",
            birthdate: "",
            gender: undefined,
            pend: "",
            namaSekolahUniv: "",
            namaJurusan: "",
        },
    })

    // Handle form submission
    function onSubmit(values: z.infer<typeof formSchema>) {
        setSubmittedData(values) // Simpan data sebagai JSON
        console.log("Submitted Data:", values)
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
                                        <SelectTrigger className="border-2 border-zinc-300">
                                            <SelectValue placeholder="Pilih Cabang" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {formSchema.shape.personnelArea._def.values.map((area) => (
                                            <SelectItem key={area} value={area}>{area}</SelectItem>
                                        ))}
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="border-2 border-zinc-300">
                                            <SelectValue placeholder="Pilih Department" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {formSchema.shape.personnelSubarea._def.values.map((area) => (
                                            <SelectItem key={area} value={area}>{area}</SelectItem>
                                        ))}
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="border-2 border-zinc-300">
                                            <SelectValue placeholder="Pilih Posisi" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {positions.map((pos, index) => (
                                            <SelectItem key={index} value={pos.namaPosition}>{pos.namaPosition}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="level"
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
                                        {formSchema.shape.level._def.values.map((area) => (
                                            <SelectItem key={area} value={area}>{area}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="TMK"
                        render={({ field }) => (
                            <FormItem className="inline-block w-full lg:w-2/5">
                                <FormLabel>TMK</FormLabel>
                                <Input 
                                    type="date" 
                                    className="border-2 border-zinc-300 p-2 rounded-md flex justify-center w-full"
                                    placeholder="Pilih Tanggal Masuk Kerja"
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value)}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

<FormField
                        control={form.control}
                        name="birthdate"
                        render={({ field }) => (
                            <FormItem className="inline-block w-full lg:w-2/5">
                                <FormLabel>Tanggal Lahir</FormLabel>
                                <Input 
                                    type="date" 
                                    className="border-2 border-zinc-300 p-2 rounded-md flex justify-center w-full"
                                    placeholder="Pilih Tanggal Lahir"
                                    {...field}
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
                                    <Input className="border-2 border-zinc-300" placeholder="Masukkan jenjang pendidikan tertinggi!" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="namaSekolahUniv"
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
                    <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Submit
                    </Button>
                </form>
            </Form>

            {/* Menampilkan data JSON setelah submit */}
            {submittedData && (
                <div className="mt-6 w-96 p-4 bg-gray-100 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Submitted Data</h3>
                    <pre className="text-sm">{JSON.stringify(submittedData, null, 2)}</pre>
                </div>
            )}
        </div>
    )
}
