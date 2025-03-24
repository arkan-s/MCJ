"use client"

import { useEffect, useRef, useState } from "react"
import { bitter } from "../fonts"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm, useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash } from "lucide-react"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PaginationFormHandler } from "../pagination/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnimatePresence, motion } from "framer-motion"


// Schema
const formSchema = z.object({
    CareerHistorySchema: z.array(
        z.object({
            position: z.string(),
            personnelArea: z.enum([
                'ICBP-Noodle Head Office', 'ICBP-Noodle DKI', 'ICBP-Noodle Cibitung',
                'ICBP-Noodle Tangerang', 'ICBP-Noodle Bandung', 'ICBP-Noodle Semarang',
                'ICBP-Noodle Surabaya', 'ICBP-Noodle Medan', 'ICBP-Noodle Cirebon',
                'ICBP-Noodle Pekanbaru', 'ICBP-Noodle Palembang', 'ICBP-Noodle Lampung',
                'ICBP-Noodle Banjarmasin', 'ICBP-Noodle Pontianak', 'ICBP-Noodle Manado',
                'ICBP-Noodle Makassar', 'ICBP-Noodle Jambi', 'ICBP-Noodle Tj. Api Api',
            ], { message: "Pilih cabang tempat bekerja!" }),
            personnelSubarea: z.enum([
                'ADM Fin.& Acct.', 'ADM Gen.Mgt', 'ADM HR', 'MFG Manufactur',
                'MFG PPIC', 'MFG Production', 'MFG Purchasing', 'MFG Technical',
                'MFG Warehouse', 'MKT Marketing', 'MKT Sales&Distr',
                'R&D QC/QA', 'R&D Resrch.Dev.',
            ], { message: "Pilih departemen tempat bekerja!" }),
            levelPosition: z.enum(["mgr", "spv", "staff", "opr"], { message: "Pilih level karyawan" }),
            tanggalMulai: z.number().nonnegative({ message: "Tidak boleh angka negatif" }).gt(0, {message: "Tidak boleh 0"}),
            tanggalBerakhir: z.number().nonnegative({ message: "Tidak boleh angka negatif" }).gt(0, {message: "Tidak boleh 0"}),
            status: z.enum(["1", "0"],{message:"Isilah dengan angka satu untuk aktif atau nol untuk tidak aktif"})
        })
    ),
    OrgIntHistorySchema: z.array(z.object({
        namaOrganisasi: z.string().min(1, "Isilah nama orgnisasi yang anda ikuti!"),
        namaPosisi: z.string().min(1, "Isilah posisi anda pada orgnisasi yang anda ikuti!"),
        tahunMulai: z.number().nonnegative({ message: "Tidak boleh angka negatif" }).gt(0, {message: "Tidak boleh 0"}),
        tahunSelesai: z.number().nonnegative({ message: "Tidak boleh angka negatif" }).gt(0, {message: "Tidak boleh 0"}),
    })),
    ProjectHistorySchema: z.array(z.object({
        judulProject: z.string().min(1, "Judul dari project harus diisi"),
        namaPosisi: z.string().min(1, "Isilah nama posisi yang anda duduki selama pengerjaan project"),
        lamaKolaborasi: z.number().nonnegative({ message: "Tidak boleh angka negatif" }).gt(0, {message: "Tidak boleh 0"}),
        shortDesc: z.string().min(1, "Mohon dielaborasi atau dijelaskan bagaimana peran anda dalam project!")
    })),
    ComiteeHistorySchema: z.array(z.object({
        namaAcara: z.string().min(1, "Isilah nama acara yang anda jalankan"),
        namaPosisi: z.string().min(1, "Sebagai apa anda pada kepanitiaan tersebut"),
        tahunPelaksanaan: z.number().nonnegative({ message: "Tidak boleh angka negatif" })
    })),
    TrainingWantedSchema: z.array(z.object({
        topikPelatihan: z.string().min(1, "Isilah nama atau topik training yang anda ingin ikuti"),
    })),
    GKMHistorySchema: z.object({
        banyakkeikutsertaan: z.string().min(1, "Isilah jumlah keikutsertaan anda dalam GKM, taruh 0 jika tidak pernah mengikuti"),
        posisiTertinggi: z.string().min(1, "Apa posisi tertinggi selama mengikuti GKM? taruh 0 jika tidak pernah")
    }),
    MentorWantedSchema: z.object({
        namaMentor: z.string().min(1, "Isilah nama atasan yang ingin dijadikan mentor"),
        posisi: z.string().min(1, "Isilah posisi atau jabatan orang yang anda ingin jadikan mentor"),
        cabang: z.enum([
            'ICBP-Noodle Head Office', 'ICBP-Noodle DKI', 'ICBP-Noodle Cibitung',
            'ICBP-Noodle Tangerang', 'ICBP-Noodle Bandung', 'ICBP-Noodle Semarang',
            'ICBP-Noodle Surabaya', 'ICBP-Noodle Medan', 'ICBP-Noodle Cirebon',
            'ICBP-Noodle Pekanbaru', 'ICBP-Noodle Palembang', 'ICBP-Noodle Lampung',
            'ICBP-Noodle Banjarmasin', 'ICBP-Noodle Pontianak', 'ICBP-Noodle Manado',
            'ICBP-Noodle Makassar', 'ICBP-Noodle Jambi', 'ICBP-Noodle Tj. Api Api'
        ], { message: "Pilih cabang tempat bekerja!" }),
    }),
    BestEmployeeSchema: z.number().nonnegative({ message: "Tidak boleh angka negatif" }),
    EmpCareerChoiceSchema: z.object({
        interest: z.enum(["yes","no"], { message: "Pilihkan berdasarkan ketertarikan, minat, atau kesediaan"}),
        crossdept: z.enum(["yes","no"], { message: "Pilihkan berdasarkan ketertarikan, minat, atau kesediaan"}),
        crossbranch: z.enum(["yes","no"], { message: "Pilihkan berdasarkan ketertarikan, minat, atau kesediaan"})
    }),
    CareerOfMyChoiceSchema: z.object({
        shortterm: z.string(),
        longterm: z.string()
    })
})



export default function SelfForm({nomorIndukKaryawan, posisi, dept}:{nomorIndukKaryawan: string, posisi: string, dept: string}){
    const [submittedData, setsubmittedData] = useState<any>(null)
    const [positions, setPositions] = useState<{ namaPosition: string }[]>([]);
    
    useEffect(() => {
    fetch("/api/position") // Ganti dengan URL API backend
        .then((response) => response.json()) // Parse response menjadi JSON
        .then((data) => setPositions(data)) // Simpan data ke state
        .catch((error) => console.error("Error fetching positions:", error));
    }, []);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            CareerHistorySchema: [{
                position: "",
                personnelArea: undefined,
                personnelSubarea: undefined,
                levelPosition: undefined,
                tanggalMulai: 0,
                tanggalBerakhir: 0,
                status: "0"
            }],
            OrgIntHistorySchema: [{
                namaOrganisasi: "",
                namaPosisi: "",
                tahunMulai: 0, 
                tahunSelesai: 0
            }],
            ProjectHistorySchema: [{
                judulProject: "",
                namaPosisi: "",
                lamaKolaborasi: 0,
                shortDesc: ""
            }],
            ComiteeHistorySchema: [{
                namaAcara: "",
                namaPosisi: "",
                tahunPelaksanaan: 0
            }],
            TrainingWantedSchema: [{
                topikPelatihan: ""
            }],
            GKMHistorySchema: {
                banyakkeikutsertaan: "0",
                posisiTertinggi: "0"
            },
            MentorWantedSchema: {
                namaMentor: "",
                posisi: "",
                cabang: undefined
            },
            BestEmployeeSchema: 0,
            EmpCareerChoiceSchema: {
                interest: undefined,
                crossdept: undefined,
                crossbranch: undefined
            },
            CareerOfMyChoiceSchema: {
                shortterm: "",
                longterm: ""
            }
        },
    });
    

    const { fields: CareerHistoryfield, append: CareerHistoryappend, remove: CareerHistoryremove } = useFieldArray({
        control: form.control,
        name: "CareerHistorySchema"
    });
    
    const { fields: OrgIntHistoryfield, append: OrgIntHistoryappend, remove: OrgIntHistoryremove } = useFieldArray({
        control: form.control,
        name: "OrgIntHistorySchema"
    });
    
    const { fields: ProjectHistoryfield, append: ProjectHistoryappend, remove: ProjectHistoryremove } = useFieldArray({
        control: form.control,
        name: "ProjectHistorySchema"
    });
    
    const { fields: ComiteeHistoryfield, append: ComiteeHistoryappend, remove: ComiteeHistoryremove } = useFieldArray({
        control: form.control,
        name: "ComiteeHistorySchema"
    });
    
    

    function onSubmit(values: z.infer<typeof formSchema>){
        setsubmittedData(values);
        console.log("Submitted Data:", values)
    }

    function CareerHistoryComp(){
        return(
            <div className="flex flex-col w-full bg-gray-100 my-2 p-2">
                <div className="flex flex-col w-full">
                    {CareerHistoryfield.map((item, index) => (
                        <div key={item.id} className="flex flex-col md:flex-row items-center justify-center rounded-lg bg-blue-100 mt-2 p-2 w-full md:w-full md:min-w-0">
                            <div className="flex flex-col md:flex-row md:w-11/12 md:justify-between flex-wrap w-full gap-2 md:gap-1"> {/* Tambahkan flex-wrap & gap untuk keseimbangan */}
                                
                                {/* Posisi */}
                                <FormField
                                    control={form.control}
                                    name={`CareerHistorySchema.${index}.position`}
                                    render={({ field }) => (
                                        <FormItem className="w-full min-w-0 md:w-2/5"> {/* Pastikan w-full dan min-w-0 */}
                                            <FormLabel>Posisi</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="border-2 border-zinc-300 w-full"> {/* Pastikan SelectTrigger juga w-full */}
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

                                {/* Level Position */}
                                <FormField
                                    control={form.control}
                                    name={`CareerHistorySchema.${index}.levelPosition`}
                                    render={({ field }) => (
                                        <FormItem className="w-full min-w-0 md:w-2/5">
                                            <FormLabel>Level</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="border-2 border-zinc-300 w-full">
                                                        <SelectValue placeholder="Pilih Level" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {formSchema.shape.CareerHistorySchema.element.shape.levelPosition._def.values.map((level: any) => (
                                                        <SelectItem key={level} value={level}>{level}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Personnel Area */}
                                <FormField
                                    control={form.control}
                                    name={`CareerHistorySchema.${index}.personnelArea`}
                                    render={({ field }) => (
                                        <FormItem className="w-full min-w-0 md:w-2/5">
                                            <FormLabel>Cabang</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="border-2 border-zinc-300 w-full">
                                                        <SelectValue placeholder="Pilih Cabang" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {formSchema.shape.CareerHistorySchema.element.shape.personnelArea._def.values.map((area: any) => (
                                                        <SelectItem key={area} value={area}>{area}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Personnel Subarea */}
                                <FormField
                                    control={form.control}
                                    name={`CareerHistorySchema.${index}.personnelSubarea`}
                                    render={({ field }) => (
                                        <FormItem className="w-full min-w-0 md:w-2/5">
                                            <FormLabel>Departemen</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="border-2 border-zinc-300 w-full">
                                                        <SelectValue placeholder="Pilih Departemen" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {formSchema.shape.CareerHistorySchema.element.shape.personnelSubarea._def.values.map((dept: any) => (
                                                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Tanggal Mulai */}
                                <FormField
                                    control={form.control}
                                    name={`CareerHistorySchema.${index}.tanggalMulai`}
                                    render={({ field }) => (
                                        <FormItem className="w-full min-w-0 md:w-2/5">
                                            <FormLabel>Tanggal Mulai</FormLabel>
                                            <Input
                                                type="date"
                                                className="border-2 border-zinc-300 p-2 flex justify-center rounded-md w-full"
                                                placeholder="Pilih Tanggal Awal Mulai Bekerja di Posisi Ini"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value)}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Tanggal Berakhir */}
                                <FormField
                                    control={form.control}
                                    name={`CareerHistorySchema.${index}.tanggalBerakhir`}
                                    render={({ field }) => (
                                        <FormItem className="w-full min-w-0 md:w-2/5">
                                            <FormLabel>Tanggal Berakhir</FormLabel>
                                            <Input
                                                type="date"
                                                className="border-2 border-zinc-300 flex justify-center p-2 rounded-md w-full"
                                                placeholder="Pilih Tanggal Akhir Bekerja di Posisi Ini"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value)}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Tombol Hapus */}
                            <div className="flex justify-end items-end md:items-center md:justify-center w-full md:w-1/12 mt-2">
                                <Button type="button" variant="destructive" size="icon" onClick={() => CareerHistoryremove(index)}>
                                    <Trash size={16} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tombol Tambah */}
                <Button type="button" className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => CareerHistoryappend({
                        position: "",
                        personnelArea: "ICBP-Noodle Head Office",
                        personnelSubarea: "ADM HR",
                        levelPosition: "staff",
                        tanggalMulai: 0,
                        tanggalBerakhir: 0,
                        status: "0"})}
                >
                    <PlusCircle className="mr-2" size={16} /> Tambah Pengalaman Karir
                </Button>
            </div>

        )
    }

    function OrgIntHistoryComp(){
        return (
            <div className="flex flex-col w-full bg-gray-100 my-2 p-2">
                <div className="flex flex-col w-full">
                    {OrgIntHistoryfield.map((item, index) => (
                        <div key={item.id} className="flex flex-col md:flex-row items-center justify-center rounded-lg bg-blue-100 mt-2 p-2 w-full md:w-full md:min-w-0">
                            <div className="flex flex-col md:flex-row md:w-11/12 md:justify-between flex-wrap w-full gap-2 md:gap-1">
                                
                                {/* Nama Organisasi */}
                                <FormField
                                    control={form.control}
                                    name={`OrgIntHistorySchema.${index}.namaOrganisasi`}
                                    render={({ field }) => (
                                        <FormItem className="w-full min-w-0 md:w-2/5">
                                            <FormLabel>Nama Organisasi</FormLabel>
                                            <Input
                                                className="border-2 border-zinc-300 p-2 rounded-md w-full"
                                                placeholder="Nama Organisasi"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
    
                                {/* Nama Posisi */}
                                <FormField
                                    control={form.control}
                                    name={`OrgIntHistorySchema.${index}.namaPosisi`}
                                    render={({ field }) => (
                                        <FormItem className="w-full min-w-0 md:w-2/5">
                                            <FormLabel>Nama Posisi</FormLabel>
                                            <Input
                                                className="border-2 border-zinc-300 p-2 rounded-md w-full"
                                                placeholder="Nama Posisi"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
    
                                {/* Tahun Mulai */}
                                <FormField
                                    control={form.control}
                                    name={`OrgIntHistorySchema.${index}.tahunMulai`}
                                    render={({ field }) => (
                                        <FormItem className="w-full min-w-0 md:w-2/5">
                                            <FormLabel>Tahun Mulai</FormLabel>
                                            <Input
                                                type="number"
                                                className="border-2 border-zinc-300 p-2 rounded-md w-full"
                                                placeholder="Tahun Mulai"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
    
                                {/* Tahun Selesai */}
                                <FormField
                                    control={form.control}
                                    name={`OrgIntHistorySchema.${index}.tahunSelesai`}
                                    render={({ field }) => (
                                        <FormItem className="w-full min-w-0 md:w-2/5">
                                            <FormLabel>Tahun Selesai</FormLabel>
                                            <Input
                                                type="number"
                                                className="border-2 border-zinc-300 p-2 rounded-md w-full"
                                                placeholder="Tahun Selesai"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
    
                            {/* Tombol Hapus */}
                            <div className="flex justify-end items-end md:items-center md:justify-center w-full md:w-1/12 mt-2">
                                <Button type="button" variant="destructive" size="icon" onClick={() => OrgIntHistoryremove(index)}>
                                    <Trash size={16} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
    
                {/* Tombol Tambah */}
                <Button
                    type="button"
                    className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => OrgIntHistoryappend({
                        namaOrganisasi: "",
                        namaPosisi: "",
                        tahunMulai: 0,
                        tahunSelesai: 0,
                    })}
                >
                    <PlusCircle className="mr-2 text-xs" size={16} /> Tambah Pengalaman
                </Button>
            </div>
        )
    }
    

    function ProjectHistoryComp() {
        return (
            <div className="flex flex-col w-full bg-gray-100 my-2 p-2">
                <div className="flex flex-col w-full">
                    {ProjectHistoryfield.map((item, index) => (
                        <div key={item.id} className="flex flex-col md:flex-row items-center justify-center rounded-lg bg-blue-100 mt-2 p-2 w-full md:w-full md:min-w-0">
                            <div className="flex flex-col md:flex-row md:w-11/12 md:justify-between flex-wrap w-full gap-2 md:gap-1">
                                
                                {/* Judul Proyek */}
                                <FormField
                                    control={form.control}
                                    name={`ProjectHistorySchema.${index}.judulProject`}
                                    render={({ field }) => (
                                        <FormItem className="w-full min-w-0 md:w-2/5">
                                            <FormLabel>Judul Proyek</FormLabel>
                                            <Input
                                                className="border-2 border-zinc-300 p-2 rounded-md w-full"
                                                placeholder="Judul Proyek"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
    
                                {/* Nama Posisi */}
                                <FormField
                                    control={form.control}
                                    name={`ProjectHistorySchema.${index}.namaPosisi`}
                                    render={({ field }) => (
                                        <FormItem className="w-full min-w-0 md:w-2/5">
                                            <FormLabel>Nama Posisi</FormLabel>
                                            <Input
                                                className="border-2 border-zinc-300 p-2 rounded-md w-full"
                                                placeholder="Nama Posisi"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
    
                                {/* Lama Kolaborasi */}
                                <FormField
                                    control={form.control}
                                    name={`ProjectHistorySchema.${index}.lamaKolaborasi`}
                                    render={({ field }) => (
                                        <FormItem className="w-full min-w-0 md:w-2/5">
                                            <FormLabel>Lama Kolaborasi (bulan)</FormLabel>
                                            <Input
                                                type="number"
                                                className="border-2 border-zinc-300 p-2 rounded-md w-full"
                                                placeholder="Lama Kolaborasi"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
    
                                {/* Deskripsi Singkat */}
                                <FormField
                                    control={form.control}
                                    name={`ProjectHistorySchema.${index}.shortDesc`}
                                    render={({ field }) => (
                                        <FormItem className="w-full min-w-0 md:w-2/5">
                                            <FormLabel>Deskripsi Singkat</FormLabel>
                                            <Input
                                                className="border-2 border-zinc-300 p-2 rounded-md w-full"
                                                placeholder="Deskripsi Singkat"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
    
                            {/* Tombol Hapus */}
                            <div className="flex justify-end items-end md:items-center md:justify-center w-full md:w-1/12 mt-2">
                                <Button type="button" variant="destructive" size="icon" onClick={() => ProjectHistoryremove(index)}>
                                    <Trash size={16} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
    
                {/* Tombol Tambah */}
                <Button
                    type="button"
                    className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() =>
                        ProjectHistoryappend({
                            judulProject: "",
                            namaPosisi: "",
                            lamaKolaborasi: 0,
                            shortDesc: "",
                        })
                    }
                >
                    <PlusCircle className="mr-2" size={16} /> Tambah Pengalaman Proyek
                </Button>
            </div>
        );
    }
    

    function ComiteeHistoryComp() {
        return (
            <div className="flex flex-col w-full bg-gray-100 my-2 p-2">
                <div className="flex flex-col w-full">
                    {ComiteeHistoryfield.map((item, index) => (
                        <div key={item.id} className="flex flex-col md:flex-row items-center justify-center rounded-lg bg-blue-100 mt-2 p-2 w-full md:w-full md:min-w-0">
                            <div className="flex flex-col md:flex-row md:w-11/12 md:justify-between flex-wrap w-full gap-2 md:gap-1">
                                
                                {/* Nama Acara */}
                                <FormField
                                    control={form.control}
                                    name={`ComiteeHistorySchema.${index}.namaAcara`}
                                    render={({ field }) => (
                                        <FormItem className="w-full min-w-0 md:w-2/5">
                                            <FormLabel>Nama Acara</FormLabel>
                                            <Input
                                                className="border-2 border-zinc-300 p-2 rounded-md w-full"
                                                placeholder="Nama Acara"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
    
                                {/* Nama Posisi */}
                                <FormField
                                    control={form.control}
                                    name={`ComiteeHistorySchema.${index}.namaPosisi`}
                                    render={({ field }) => (
                                        <FormItem className="w-full min-w-0 md:w-2/5">
                                            <FormLabel>Nama Posisi</FormLabel>
                                            <Input
                                                className="border-2 border-zinc-300 p-2 rounded-md w-full"
                                                placeholder="Nama Posisi"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
    
                                {/* Tahun Pelaksanaan */}
                                <FormField
                                    control={form.control}
                                    name={`ComiteeHistorySchema.${index}.tahunPelaksanaan`}
                                    render={({ field }) => (
                                        <FormItem className="w-full min-w-0 md:w-2/5">
                                            <FormLabel>Tahun Pelaksanaan</FormLabel>
                                            <Input
                                                type="number"
                                                className="border-2 border-zinc-300 p-2 rounded-md w-full"
                                                placeholder="Tahun Pelaksanaan"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
    
                            {/* Tombol Hapus */}
                            <div className="flex justify-end items-end md:items-center md:justify-center w-full md:w-1/12 mt-2">
                                <Button type="button" variant="destructive" size="icon" onClick={() => ComiteeHistoryremove(index)}>
                                    <Trash size={16} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
    
                {/* Tombol Tambah */}
                <Button type="button" className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => ComiteeHistoryappend({
                        namaAcara: "",
                        namaPosisi: "",
                        tahunPelaksanaan: 0,
                    })}
                >
                    <PlusCircle className="mr-2" size={16} /> Tambah Pengalaman Kepanitiaan
                </Button>
            </div>
        );
    }
    
    const { fields: TrainingWantedfield, append: TrainingWantedappend, remove: TrainingWantedremove } = useFieldArray({
        control: form.control,
        name: "TrainingWantedSchema",
    });


    
    function TrainingWantedComp() {
        return (
            <div className="flex flex-col w-full bg-gray-100 my-2 p-2">
                <div className="flex flex-col w-full">
                    {TrainingWantedfield.map((item, index) => (
                        <div key={item.id} className="flex flex-col md:flex-row items-center justify-center rounded-lg bg-blue-100 mt-2 p-2 w-full md:w-full md:min-w-0">
                            <div className="flex flex-col md:flex-row md:w-11/12 md:justify-between flex-wrap w-full gap-2 md:gap-1">
                                {/* Topik Pelatihan */}
                                <FormField
                                    control={form.control}
                                    name={`TrainingWantedSchema.${index}.topikPelatihan`}
                                    render={({ field }) => (
                                        <FormItem className="w-full min-w-0 md:w-2/5">
                                            <FormLabel>Topik Pelatihan</FormLabel>
                                            <Input
                                                className="border-2 border-zinc-300 p-2 rounded-md w-full"
                                                placeholder="Topik Pelatihan"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* Tombol Hapus */}
                            <div className="flex justify-end items-end md:items-center md:justify-center w-full md:w-1/12 mt-2">
                                <Button type="button" variant="destructive" size="icon" onClick={() => TrainingWantedremove(index)}>
                                    <Trash size={16} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
    
                {/* Tombol Tambah */}
                <Button type="button" className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => TrainingWantedappend({
                        topikPelatihan: "",
                    })}
                >
                    <PlusCircle className="mr-2" size={16} /> Tambah Pelatihan yang Diinginkan
                </Button>
            </div>
        );
    }
    

    function GKMHistoryComp() {
        return (
            <div className="w-full">
                <div className="flex flex-col w-full p-4 rounded-lg mb-2">
                    <FormField
                        control={form.control}
                        name="GKMHistorySchema.banyakkeikutsertaan"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Jumlah Keikutsertaan</FormLabel>
                                <Input
                                    className="border-2 border-zinc-300 p-2 rounded-md"
                                    placeholder="Jumlah Keikutsertaan"
                                    {...field}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="GKMHistorySchema.posisiTertinggi"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Posisi Tertinggi</FormLabel>
                                <Input
                                    className="border-2 border-zinc-300 p-2 rounded-md"
                                    placeholder="Posisi Tertinggi"
                                    {...field}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        );
    }

    function MentorWantedComp() {
        return (
            <div className="w-full">
                <div className="flex flex-col w-full p-4 rounded-lg mb-2">
                    <FormField
                        control={form.control}
                        name="MentorWantedSchema.namaMentor"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Nama Mentor</FormLabel>
                                <Input
                                    className="border-2 border-zinc-300 p-2 rounded-md"
                                    placeholder="Nama Mentor"
                                    {...field}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="MentorWantedSchema.posisi"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Posisi</FormLabel>
                                <Input
                                    className="border-2 border-zinc-300 p-2 rounded-md"
                                    placeholder="Posisi"
                                    {...field}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="MentorWantedSchema.cabang"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Cabang</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="border-2 border-zinc-300">
                                            <SelectValue placeholder="Pilih Cabang" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {formSchema.shape.MentorWantedSchema.shape.cabang._def.values.map((cabang: any) => (
                                            <SelectItem key={cabang} value={cabang}>{cabang}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        );
    }

    function BestEmployeeComp() {
        return (
            <div className="w-full">
                <div className="flex flex-col w-full p-4 rounded-lg mb-2">
                    <FormField
                        control={form.control}
                        name="BestEmployeeSchema"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Jumlah Penghargaan</FormLabel>
                                <Input
                                    type="number"
                                    className="border-2 border-zinc-300 p-2 rounded-md"
                                    placeholder="Jumlah Penghargaan"
                                    {...field}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        );
    }

    function EmpCareerChoiceComp() {

        const { control, watch } = useFormContext();
const interest = watch("EmpCareerChoiceSchema.interest");

return (
    <div className="w-full">
        <div className="flex flex-col w-full p-4 rounded-lg mb-2">
            <FormField
                control={control}
                name="EmpCareerChoiceSchema.interest"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>Minat</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="border-2 border-zinc-300">
                                    <SelectValue placeholder="Pilih Minat" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {formSchema.shape.EmpCareerChoiceSchema.shape.interest._def.values.map((interest: any) => (
                                    <SelectItem key={interest} value={interest}>{interest}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            
            {/* Cetak nilai interest */}
            <p>Nilai Interest: {interest}</p>

            {interest === "yes" && (
                <>
                    <FormField
                        control={control}
                        name="EmpCareerChoiceSchema.crossdept"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Minat Pindah Departemen</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="border-2 border-zinc-300">
                                            <SelectValue placeholder="Pilih Minat Pindah Departemen" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {formSchema.shape.EmpCareerChoiceSchema.shape.crossdept._def.values.map((crossdept: any) => (
                                            <SelectItem key={crossdept} value={crossdept}>{crossdept}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </>
            )}
        </div>
    </div>
);

    }

    function CareerOfMyChoiceComp() {
        return (
            <div className="w-full">
                <div className="flex flex-col w-full p-4 rounded-lg mb-2">
                    <FormField
                        control={form.control}
                        name="CareerOfMyChoiceSchema.shortterm"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Rencana Jangka Pendek</FormLabel>
                                <Input
                                    className="border-2 border-zinc-300 p-2 rounded-md"
                                    placeholder="Rencana Jangka Pendek"
                                    {...field}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="CareerOfMyChoiceSchema.longterm"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Rencana Jangka Panjang</FormLabel>
                                <Input
                                    className="border-2 border-zinc-300 p-2 rounded-md"
                                    placeholder="Rencana Jangka Panjang"
                                    {...field}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        );
    }



    const usePrevious = <T,>(val: T) => {
        const ref = useRef<undefined | T>(undefined);
        useEffect(() => {
            ref.current = val;
        });
        return ref.current;
    }

    const [activeIndex, setActiveIndex] = useState(0);
    const previousIndex = usePrevious(activeIndex) ?? activeIndex;

    const components = [
        { component: [<CareerHistoryComp />], label: 'Riwayat Pekerjaan atau Karir'},
        { component: [<OrgIntHistoryComp />], label: 'Riwayat Organisasi Internal' },
        { component: [<ProjectHistoryComp />], label: 'Riwayat Project yang Pernah Diikuti'},
        { component: [<ComiteeHistoryComp/>], label: 'Riwayat Keikutsertaan Kepanitiaan'},
        { component: [<GKMHistoryComp />], label: 'Riwayat keikutesertaan GKM'},
        { component: [<MentorWantedComp />], label: 'Mentor yang Diinginkan'},
        { component: [<TrainingWantedComp />], label: 'Training yang Ingin Diikuti'},
        { component: [<BestEmployeeComp />], label: 'Record menjadi Karyawan Terbaik'},
        { component: [<EmpCareerChoiceComp />], label: 'Keinginan Karyawan Dalam Mengembangkan Karir'},
        { component: [<CareerOfMyChoiceComp />], label: 'Rencana Perjalanan Karir'}
    ];
    const total_components = components.length;
    
    const direction: Direction = previousIndex > activeIndex
                ? 'back'
                : 'forward';

    type Direction = 'back' | 'forward';
    const variants = {
        initial: (direction: Direction) => ({
            x: direction === 'forward' ? '150%' : '-150%', opacity: 1, scale:0.1, transition: { type: "spring", stiffness: 100, damping: 15 }
        }),
        target: {
            x: '0%', opacity: 1, scale:1, transition: { type: "spring", stiffness: 100, damping: 15 }
        },
        exit: (direction: Direction) => ({
            x: direction === 'forward' ? '-150%' : '150%', opacity: 1, scale:0.1, transition: { type: "spring", stiffness: 100, damping: 15 }
        }),
    };
    const backandforthButton = (inp:number)=>{
        if (inp===-1) {
            setActiveIndex(prev => prev === 0 ? components.length - 1 : prev - 1);
        }else if(inp===1){
            setActiveIndex(prev => prev === components.length - 1 ? 0 : prev + 1);
        }
    }

    return(
        <div className="grow flex flex-col px-5 py-5 w-full md:px-[5%] md:pt-[5%] md:pb-[2%] overflow-x-hidden">
            <div className="grow w-full flex flex-col overflow-y-auto overflow-x-hidden relative"> {/* Tambahkan relative di sini */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="">
                        <AnimatePresence initial={false} mode="sync" custom={direction}>
                            <motion.div
                                variants={variants}
                                initial="initial"
                                animate="target"
                                exit="exit"
                                custom={direction}
                                key={activeIndex}
                                className="w-full p-5 flex flex-col"
                                style={{ position: "absolute", width: "100%" }} // Gunakan absolute karena akan berganti halaman
                            >
                                <h1 className={`${bitter.className} block text-lg mb-5 text-center font-bold`}>
                                    {components[activeIndex].label}
                                </h1>

                                {components[activeIndex].component.map((Comp, index) => (
                                    <motion.div
                                        key={index} 
                                        initial={{ opacity: 0, scale: 0.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.1 }}
                                        transition={{ type: "spring", duration: 0.5, stiffness: 250, damping: 15 }}
                                        className="mb-2"
                                    >
                                        {Comp} 
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </form>
                </Form>
            </div>

            {/* PAGINATION */}
            <div>
                <PaginationFormHandler 
                    total_pages={total_components} 
                    page_number={activeIndex} 
                    changing_page={backandforthButton} 
                />
            </div>
        </div>

    )


}
