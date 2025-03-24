"use client"

import { useEffect, useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"


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
        }
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
    
    const { fields: TrainingWantedfield, append: TrainingWantedappend, remove: TrainingWantedremove } = useFieldArray({
        control: form.control,
        name: "TrainingWantedSchema"
    });
    

    function onSubmit(values: z.infer<typeof formSchema>){
        setsubmittedData(values);
        console.log("Submitted Data:", values)
    }

    function CareerHistoryComp(){
        return(
            <div className="w-full">
                <h3 className="text-lg font-semibold">Pengalaman Kerja</h3>
                {CareerHistoryfield.map((item, index)=>(
                    <div key={item.id} className="flex flex-row items-center justify-center p-4 rounded-lg mb-2">
                        <div className="flex ">
                                
                            <FormField
                            control={form.control}
                            name={`CareerHistorySchema.${index}.position`}
                            render={({ field }) => (
                                <FormItem className="w-1/3">
                                <FormLabel>Posisi</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="border-2 border-zinc-300">
                                                <SelectValue placeholder="Pilih Posisi" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {positions.map((pos, index)=>(
                                                <SelectItem key={index} value={pos.namaPosition}>{pos.namaPosition}</SelectItem>
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
                                <FormItem className="w-1/3">
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="border-2 border-zinc-300">
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
                                <FormItem className="w-1/3">
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="border-2 border-zinc-300">
                                                <SelectValue placeholder="Pilih Cabang" />
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

                            {/* Level Position */}
                            <FormField
                            control={form.control}
                            name={`CareerHistorySchema.${index}.levelPosition`}
                            render={({ field }) => (
                                <FormItem className="w-1/3">
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="border-2 border-zinc-300">
                                                <SelectValue placeholder="Pilih Cabang" />
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

                            {/* Tanggal Mulai */}
                            <FormField
                            control={form.control}
                            name={`CareerHistorySchema.${index}.tanggalMulai`}
                            render={({ field }) => (
                                <FormItem className="inline-block w-full lg:w-2/5">
                                    <FormLabel>Tanggal Mulai</FormLabel>
                                    <Input 
                                        type="date" 
                                        className="border-2 border-zinc-300 p-2 rounded-md flex justify-center w-full"
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
                                <FormItem className="inline-block w-full lg:w-2/5">
                                    <FormLabel>Tanggal Mulai</FormLabel>
                                    <Input 
                                        type="date" 
                                        className="border-2 border-zinc-300 p-2 rounded-md flex justify-center w-full"
                                        placeholder="Pilih Tanggal Akhir Bekerja di Posisi Ini"
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="flex justify-center items-center">
                            <Button type="button" variant="destructive" size="icon" onClick={() => CareerHistoryremove(index)}>
                                <Trash size={16} />
                            </Button>
                        </div>
                    </div>
                ))}
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
            <div className="w-full">
                <h3 className="text-lg font-semibold">Pengalaman Organisasi</h3>
                {OrgIntHistoryfield.map((item, index) => (
                    <div key={item.id} className="flex flex-row items-center justify-center p-4 rounded-lg mb-2">
                        <div className="flex flex-col w-full">
                            <FormField
                                control={form.control}
                                name={`OrgIntHistorySchema.${index}.namaOrganisasi`}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Nama Organisasi</FormLabel>
                                        <Input
                                            className="border-2 border-zinc-300 p-2 rounded-md"
                                            placeholder="Nama Organisasi"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`OrgIntHistorySchema.${index}.namaPosisi`}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Nama Posisi</FormLabel>
                                        <Input
                                            className="border-2 border-zinc-300 p-2 rounded-md"
                                            placeholder="Nama Posisi"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`OrgIntHistorySchema.${index}.tahunMulai`}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Tahun Mulai</FormLabel>
                                        <Input
                                            type="number"
                                            className="border-2 border-zinc-300 p-2 rounded-md"
                                            placeholder="Tahun Mulai"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`OrgIntHistorySchema.${index}.tahunSelesai`}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Tahun Selesai</FormLabel>
                                        <Input
                                            type="number"
                                            className="border-2 border-zinc-300 p-2 rounded-md"
                                            placeholder="Tahun Selesai"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-center items-center">
                            <Button type="button" variant="destructive" size="icon" onClick={() => OrgIntHistoryremove(index)}>
                                <Trash size={16} />
                            </Button>
                        </div>
                    </div>
                ))}
                <Button
                    type="button"
                    className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() =>
                        OrgIntHistoryappend({
                            namaOrganisasi: "",
                            namaPosisi: "",
                            tahunMulai: 0,
                            tahunSelesai: 0,
                        })
                    }
                >
                    <PlusCircle className="mr-2" size={16} /> Tambah Pengalaman Organisasi Internal
                </Button>
            </div>
        )
    }

    function ProjectHistoryComp() {
        return (
            <div className="w-full">
                <h3 className="text-lg font-semibold">Pengalaman Proyek</h3>
                {ProjectHistoryfield.map((item, index) => (
                    <div key={item.id} className="flex flex-row items-center justify-center p-4 rounded-lg mb-2">
                        <div className="flex flex-col w-full">
                            <FormField
                                control={form.control}
                                name={`ProjectHistorySchema.${index}.judulProject`}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Judul Proyek</FormLabel>
                                        <Input
                                            className="border-2 border-zinc-300 p-2 rounded-md"
                                            placeholder="Judul Proyek"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`ProjectHistorySchema.${index}.namaPosisi`}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Nama Posisi</FormLabel>
                                        <Input
                                            className="border-2 border-zinc-300 p-2 rounded-md"
                                            placeholder="Nama Posisi"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`ProjectHistorySchema.${index}.lamaKolaborasi`}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Lama Kolaborasi (bulan)</FormLabel>
                                        <Input
                                            type="number"
                                            className="border-2 border-zinc-300 p-2 rounded-md"
                                            placeholder="Lama Kolaborasi"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`ProjectHistorySchema.${index}.shortDesc`}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Deskripsi Singkat</FormLabel>
                                        <Input
                                            className="border-2 border-zinc-300 p-2 rounded-md"
                                            placeholder="Deskripsi Singkat"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-center items-center">
                            <Button type="button" variant="destructive" size="icon" onClick={() => ProjectHistoryremove(index)}>
                                <Trash size={16} />
                            </Button>
                        </div>
                    </div>
                ))}
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
            <div className="w-full">
                <h3 className="text-lg font-semibold">Pengalaman Kepanitiaan</h3>
                {ComiteeHistoryfield.map((item, index) => (
                    <div key={item.id} className="flex flex-row items-center justify-center p-4 rounded-lg mb-2">
                        <div className="flex flex-col w-full">
                            <FormField
                                control={form.control}
                                name={`ComiteeHistorySchema.${index}.namaAcara`}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Nama Acara</FormLabel>
                                        <Input
                                            className="border-2 border-zinc-300 p-2 rounded-md"
                                            placeholder="Nama Acara"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`ComiteeHistorySchema.${index}.namaPosisi`}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Nama Posisi</FormLabel>
                                        <Input
                                            className="border-2 border-zinc-300 p-2 rounded-md"
                                            placeholder="Nama Posisi"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`ComiteeHistorySchema.${index}.tahunPelaksanaan`}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Tahun Pelaksanaan</FormLabel>
                                        <Input
                                            type="number"
                                            className="border-2 border-zinc-300 p-2 rounded-md"
                                            placeholder="Tahun Pelaksanaan"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-center items-center">
                            <Button type="button" variant="destructive" size="icon" onClick={() => ComiteeHistoryremove(index)}>
                                <Trash size={16} />
                            </Button>
                        </div>
                    </div>
                ))}
                <Button
                    type="button"
                    className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() =>
                        ComiteeHistoryappend({
                            namaAcara: "",
                            namaPosisi: "",
                            tahunPelaksanaan: 0,
                        })
                    }
                >
                    <PlusCircle className="mr-2" size={16} /> Tambah Pengalaman Kepanitiaan
                </Button>
            </div>
        );
    }

    function TrainingWantedComp() {
        return (
            <div className="w-full">
                <h3 className="text-lg font-semibold">Pelatihan yang Diinginkan</h3>
                {TrainingWantedfield.map((item, index) => (
                    <div key={item.id} className="flex flex-row items-center justify-center p-4 rounded-lg mb-2">
                        <div className="flex flex-col w-full">
                            <FormField
                                control={form.control}
                                name={`TrainingWantedSchema.${index}.topikPelatihan`}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Topik Pelatihan</FormLabel>
                                        <Input
                                            className="border-2 border-zinc-300 p-2 rounded-md"
                                            placeholder="Topik Pelatihan"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-center items-center">
                            <Button type="button" variant="destructive" size="icon" onClick={() => TrainingWantedremove(index)}>
                                <Trash size={16} />
                            </Button>
                        </div>
                    </div>
                ))}
                <Button
                    type="button"
                    className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() =>
                        TrainingWantedappend({
                            topikPelatihan: "",
                        })
                    }
                >
                    <PlusCircle className="mr-2" size={16} /> Tambah Pelatihan yang Diinginkan
                </Button>
            </div>
        );
    }

    function GKMHistoryComp() {
        return (
            <div className="w-full">
                <h3 className="text-lg font-semibold">Pengalaman GKM</h3>
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
                <h3 className="text-lg font-semibold">Mentor yang Diinginkan</h3>
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
                <h3 className="text-lg font-semibold">Penghargaan Karyawan Terbaik</h3>
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
        <h3 className="text-lg font-semibold">Pilihan Karir Karyawan</h3>
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
                <h3 className="text-lg font-semibold">Karir Pilihan Saya</h3>
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

    const questions = [
        <CareerHistoryComp/>,
        <OrgIntHistoryComp/>,
        <ProjectHistoryComp/>,
        <ComiteeHistoryComp/>,
        <GKMHistoryComp/>,
        <MentorWantedComp/>,
        <TrainingWantedComp/>,
        <BestEmployeeComp/>,
        <EmpCareerChoiceComp/>,
        <CareerOfMyChoiceComp/>
    ]



    return (
        <div className="flex flex-col bg-gray-100 mt-4 p-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-md">
                    <Carousel>
                        <CarouselContent>
                            {questions.map((component, index)=>(
                                <CarouselItem key={index}>
                                    <div className="p-1">
                                        <Card>
                                            <CardContent className="flex w-[20%] items-center justify-center p-6">
                                                <span className="text-4xl font-semibold">{component}</span>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious/>
                        <CarouselNext/>
                    </Carousel>
                </form>
            </Form>
        </div>
    )
}