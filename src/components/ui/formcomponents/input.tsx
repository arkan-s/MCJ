import { Input } from "../input"
import { Button } from "../button"
import { PlusCircle } from "lucide-react"

function CareerHistoryCard({indexComp}:{indexComp:number}){ {/* Data berbentuk object yang berisi apa saja yang perlu diisi */}
    return(
        <div className="flex flex-col w-full bg-gray-100 my-2 p-2">
            <div className="flex flex-col w-full">
                
            </div>

            {/* Tombol Tambah */}
            <Button type="button" className={`mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded`} >
                <PlusCircle className="mr-2" size={16} /> Tambah Pengalaman Karir
            </Button>
        </div>
    )
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