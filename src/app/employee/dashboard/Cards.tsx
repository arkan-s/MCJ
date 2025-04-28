import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { putData } from "@/utils/employeeAPI";
import { branch, department, level, position } from "@/utils/fetchData";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react"

export function CareerHistoryCard({data}:
    {
        data:{
            idCareerHistory: string,
            nomorIndukKaryawan: string,
            personnelArea: string,
            personnelSubarea: string,
            position: number,
            levelPosition: string,
            tanggalMulai: Date | null,
            tanggalBerakhir: Date | null,
            status: number,
        }
    }
){    
    const { data: session } = useSession();
    // LoadingSpinner.tsx
    const LoadingSpinner = () => (
        <div className="flex justify-center items-center py-4">
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="ml-2 text-sm text-gray-500">Loading...</p>
        </div>
    );
    
  // ErrorMessage.tsx
    const ErrorMessage = ({ message }: { message: string }) => (
        <div className="flex justify-center items-center py-4">
        <p className="text-sm text-red-500">{message}</p>
        </div>
    );
    
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
    const [ editOn, setEditOn] = useState<boolean>(false);

    const [dataLokal, setDataLokal] = useState<{
                                                idCareerHistory: string,
                                                nomorIndukKaryawan: string,
                                                personnelArea: string,
                                                personnelSubarea: string,
                                                position: number,
                                                levelPosition: string,
                                                tanggalMulai: Date | null,
                                                tanggalBerakhir: Date | null,
                                                status: number,
                                            }>();
    useEffect(() => {
        setDataLokal({
            ...data,
            tanggalMulai: data.tanggalMulai === null ? null : new Date(data.tanggalMulai),
            tanggalBerakhir: data.tanggalBerakhir === null ? null : new Date(data.tanggalBerakhir)
        });
    }, [data]);
    const [localPositions, setLocalPositions] = useState<{idPosition: number, namaPosition: string, dept: string}[] | []>([]);
    const [tempValue, setTempValue] = useState(dataLokal?.tanggalMulai || undefined);
    const handleStartDateChange = (dateString: string) => {
        if (isNaN(Date.parse(dateString))) {
            setDataLokal((prev) => ({
                ...(prev || {
                    idCareerHistory: "",
                    nomorIndukKaryawan: "",
                    personnelArea: "",
                    personnelSubarea: "",
                    position: 0,
                    levelPosition: "",
                    tanggalMulai: null,
                    tanggalBerakhir: null,
                    status: 0,
                })
            }));
        } else {
            setDataLokal((prev) => ({
                ...prev || {
                    idCareerHistory: "",
                    nomorIndukKaryawan: "",
                    personnelArea: "",
                    personnelSubarea: "",
                    position: 0,
                    levelPosition: "",
                    tanggalMulai: null,
                    tanggalBerakhir: null,
                    status: 0,
                },
                tanggalMulai: new Date(dateString)
            }));
        }
    };
    const handleEndDateChange = (dateString: string) => {
        if (isNaN(Date.parse(dateString))) {
            setDataLokal((prev) => ({
                ...prev || {
                    idCareerHistory: "",
                    nomorIndukKaryawan: "",
                    personnelArea: "",
                    personnelSubarea: "",
                    position: 0,
                    levelPosition: "",
                    tanggalMulai: null,
                    tanggalBerakhir: null,
                    status: 0,
                }
            }));
        } else {
            setDataLokal((prev) => ({
                ...prev || {
                    idCareerHistory: "",
                    nomorIndukKaryawan: "",
                    personnelArea: "",
                    personnelSubarea: "",
                    position: 0,
                    levelPosition: "",
                    tanggalMulai: null,
                    tanggalBerakhir: null,
                    status: 0,
                },
                tanggalBerakhir: new Date(dateString)
            }));
        }
        
    };
    const [tempEValue, setTempEValue] = useState(dataLokal?.tanggalBerakhir || undefined);
    const defaultDataLokal = {
            idCareerHistory: "",
            nomorIndukKaryawan: "",
            personnelArea: "",
            personnelSubarea: "",
            position: 0,
            levelPosition: "",
            tanggalMulai: null,
            tanggalBerakhir: null,
            status: 0,
        }   
    
    
    useEffect(() => {
        if (!positionLoading && !positionError && positionData) {
            const filteredPositions = positionData.filter((pos: any) => pos.dept === dataLokal?.personnelSubarea);
            setLocalPositions(filteredPositions);
        }
    }, [positionData, positionLoading, positionError, dataLokal?.personnelSubarea]);
    useEffect(()=>{
        setTempValue(dataLokal?.tanggalMulai ?? undefined);
        setTempEValue(dataLokal?.tanggalBerakhir ?? undefined);
    },[dataLokal])
    console.log(
        dataLokal,
        tempValue,
        tempEValue,
        localPositions
    );
    return (
        <Card className="flex flex-col h-80 w-80 max-w-80 p-1 shadow-md border border-gray-200 rounded-2xl">
            <CardHeader className="text-center h-[10%] p-1">
                <CardTitle className="text-base font-bold">
                    {dataLokal?.status === 1 ? "Posisi Sekarang" : "Riwayat Posisi"}
                </CardTitle>
            </CardHeader>

            <CardContent className="h-[80%]">
            <div className="grid grid-cols-2 gap-1 text-sm">
                {/* Select Personnel Area */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Cabang</label>
                    {!editOn ? (
                        <div className="truncate border-2 border-gray-300 rounded-lg w-full p-2 text-sm text-gray-700 bg-gray-100">
                            {branchData?.find((e: any) => e.idBranch === dataLokal?.personnelArea)?.namaBranch.split("-Noodle")[1] || "Pilih Cabang"}
                        </div>
                        ) : (
                        <Select
                            onValueChange={(value: any) => {
                            const trimmedValue = value.trim();
                            if (trimmedValue !== "") {
                                setDataLokal((prev) => ({
                                ...(prev || defaultDataLokal),
                                personnelArea: value,
                                }));
                            }
                            }}
                            defaultValue={dataLokal?.personnelArea || ""}
                        >
                            <SelectTrigger className="border-2 border-gray-300 rounded-lg w-full">
                            <SelectValue
                                placeholder={
                                branchData?.find((e: any) => e.idBranch === dataLokal?.personnelArea)?.namaBranch.split("-Noodle")[1] || "Pilih Cabang"
                                }
                            />
                            </SelectTrigger>
                            <SelectContent>
                            {branchData.map((br: any, index: any) => (
                                <SelectItem key={index} value={br.idBranch}>
                                {br.namaBranch.split("-Noodle")[1]}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        )}
                </div>

                {/* Select Subarea */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Department</label>
                    {!editOn ? (
                        <div className="truncate border-2 border-gray-300 rounded-lg w-full p-2 text-sm text-gray-700 bg-gray-100">
                            {departmentData?.find((e: any) => e.idDepartment === dataLokal?.personnelSubarea)?.namaDepartment || "Pilih Department"}
                        </div>
                        ) :(
                            <Select
                                onValueChange={(value: any) => {
                                const trimmedValue = value.trim();
                                if (trimmedValue !== "") {
                                    setDataLokal((prev) => ({
                                    ...(prev || defaultDataLokal),
                                    personnelSubarea: value,
                                    }));
                                }
                                }}
                                defaultValue={dataLokal?.personnelSubarea || ""}
                                disabled={!editOn}
                            >
                                <SelectTrigger className="border-2 border-gray-300 rounded-lg w-full">
                                <SelectValue placeholder={departmentData.find((e:any)=> e.idDepartment === dataLokal?.personnelSubarea)?.namaDepartment || "Pilih Departemen"} />
                                </SelectTrigger>
                                <SelectContent>
                                {departmentLoading ? (
                                    <LoadingSpinner />
                                ) : departmentError ? (
                                    <ErrorMessage message="Data kosong / error. Refresh ya." />
                                ) : (
                                    departmentData.map((br: any, index: any) => (
                                    <SelectItem key={index} value={br.idDepartment}>
                                        {br.namaDepartment}
                                    </SelectItem>
                                    ))
                                )}
                                </SelectContent>
                            </Select>
                        )
                    }
                </div>
                

                {/* Select Position */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Posisi</label>
                    {!editOn ? (
                        <div className="truncate border-2 border-gray-300 rounded-lg w-full p-2 text-sm text-gray-700 bg-gray-100">
                            {positionData?.find((e: any) => e.idPosition === dataLokal?.position)?.namaPosition || "Pilih Posisi"}
                        </div>
                        ) :(
                            <Select
                                onValueChange={(value: any) => {
                                const trimmedValue = value.trim();
                                if (trimmedValue !== "") {
                                    setDataLokal((prev) => ({
                                    ...(prev || defaultDataLokal),
                                    position: parseInt(value),
                                    }));
                                }
                                }}
                                defaultValue={String(dataLokal?.position) || ""}
                                disabled={!editOn}
                            >
                                <SelectTrigger className="border-2 border-gray-300 rounded-lg w-full">
                                    <SelectValue placeholder={String(localPositions.find((e:any)=>e.idPosition === dataLokal?.position)?.namaPosition) || "Pilih Posisi"} />
                                </SelectTrigger>
                                <SelectContent>
                                {positionLoading ? (
                                    <LoadingSpinner />
                                ) : positionError ? (
                                    <ErrorMessage message="Data kosong / error. Refresh ya." />
                                ) : (
                                    localPositions.map((pos: any, index: any) => (
                                    <SelectItem key={index} value={String(pos.idPosition)}>
                                        {pos.namaPosition}
                                    </SelectItem>
                                    ))
                                )}
                                </SelectContent>
                            </Select>
                        )
                    }
                </div>
                

                {/* Select Level */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Level</label>
                    {!editOn ? (
                        <div className="truncate border-2 border-gray-300 rounded-lg w-full p-2 text-sm text-gray-700 bg-gray-100">
                            {levelData?.find((e: any) => e.idLevel === dataLokal?.levelPosition)?.namaLevel || "Pilih level"}
                        </div>
                        ) :(
                            <Select
                                onValueChange={(value: any) => {
                                const trimmedValue = value.trim();
                                if (trimmedValue !== "") {
                                    setDataLokal((prev) => ({
                                    ...(prev || defaultDataLokal),
                                    levelPosition: value,
                                    }));
                                }
                                }}
                                defaultValue={dataLokal?.levelPosition || ""}
                                disabled={!editOn}
                            >
                                <SelectTrigger className="border-2 border-gray-300 rounded-lg w-full">
                                <SelectValue placeholder={levelData.find((e:any)=>e.idLevel === dataLokal?.levelPosition)?.namaLevel || "Pilih Level"} />
                                </SelectTrigger>
                                <SelectContent>
                                {levelLoading ? (
                                    <LoadingSpinner />
                                ) : levelError ? (
                                    <ErrorMessage message="Data kosong / error. Refresh ya." />
                                ) : (
                                    levelData.map((dept: any, index: any) => (
                                    <SelectItem key={index} value={dept.idLevel}>
                                        {dept.namaLevel}
                                    </SelectItem>
                                    ))
                                )}
                                </SelectContent>
                            </Select>
                        )
                    }
                </div>
                
                

                {/* Tanggal Mulai */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Tanggal Mulai</label>
                    <input
                    type="date"
                    className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={tempValue ? tempValue.toISOString().split("T")[0] : ""}
                    onChange={(e) => setTempValue(e.target.value ? new Date(e.target.value) : undefined)}
                    onBlur={(e) => handleStartDateChange(e.target.value)}
                    disabled={!editOn}
                    />
                </div>

                {/* Tanggal Berakhir */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Tanggal Berakhir</label>
                    {
                        dataLokal?.status === 1 ?
                        <div className="truncate border-2 border-gray-300 rounded-lg w-full p-2 text-sm text-gray-700 bg-gray-100">
                            Now
                        </div>
                        :
                        <input
                        type="date"
                        className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={tempEValue ? tempEValue.toISOString().split("T")[0] : ""}
                        onChange={(e) => setTempEValue(e.target.value ? new Date(e.target.value) : undefined)}
                        onBlur={(e) => handleEndDateChange(e.target.value)}
                        disabled={!editOn}
                        />
                    }
                </div>
            </div>
            </CardContent>

            <CardFooter className="flex justify-end h-[10%] gap-4 mt-4">
                {!editOn ? (
                    <button
                        onClick={() => setEditOn(true)}
                        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                    >
                        Edit
                    </button>
                    ) : (
                    <button
                        onClick={async () => {
                            try {
                                // Menutup mode edit
                                setEditOn(false);
                    
                                // Menyiapkan data yang akan dikirimkan
                                const nik = session?.user.nik;
                                const idRecord = dataLokal?.idCareerHistory; // Ganti dengan ID record yang sesuai
                                const updatedData = {
                                    nomorIndukKaryawan: dataLokal?.nomorIndukKaryawan,
                                    personnelArea: dataLokal?.personnelArea,
                                    personnelSubarea: dataLokal?.personnelSubarea,
                                    position: dataLokal?.position,
                                    levelPosition: dataLokal?.levelPosition,
                                    tanggalMulai: dataLokal?.tanggalMulai,
                                    tanggalBerakhir: dataLokal?.tanggalBerakhir,
                                    status: dataLokal?.status,
                                };
                    
                                const url = '/update'; // Ganti dengan URL endpoint yang sesuai
                    
                                // Panggil fungsi putData
                                if (nik && idRecord) {
                                    const result = await putData(nik, idRecord, updatedData, url);
                                } else {
                                    console.error('Missing required parameters: nik or idRecord');
                                    alert('Gagal memperbarui data');
                                }
                    
                                // Kalau berhasil, lakukan sesuatu, misalnya menampilkan alert
                                alert('Data berhasil diperbarui');
                            } catch (error) {
                                // Tangani error jika ada
                                console.error('Gagal memperbarui data:', error);
                                alert('Gagal memperbarui data');
                            }
                        }}
                        className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition"
                    >
                        Selesai
                    </button>
                )}
            </CardFooter>
        </Card>

    )
}


export function ProjectCard({data}:{data:{
    idRiwayatProject: string,
    judulProject: string,
    namaPosisi: string
    lamaKolaborasi: number
    shortDesc: string
    nomorIndukKaryawan: string
}}){
    const [ editOn, setEditOn] = useState<boolean>(false);
    const [dataLokal, setDataLokal] = useState<{
                                                idRiwayatProject: string,
                                                judulProject: string,
                                                namaPosisi: string
                                                lamaKolaborasi: number
                                                shortDesc: string
                                                nomorIndukKaryawan: string
                                                }>();
    useEffect(() => {
        setDataLokal(data);
    }, [data]);

    console.log(
        dataLokal
    );

    return (
        <Card className="flex flex-col h-80 w-80 max-w-80 p-1 overflow-y-auto shadow-md border border-gray-200 rounded-2xl">
            <CardContent className="">
            <div className="flex flex-col">
                <label htmlFor={`name${dataLokal?.idRiwayatProject}`} className="text-sm text-gray-600 mb-1">Judul Project</label>
                <input
                    type="text"
                    id={`name${dataLokal?.idRiwayatProject}`}
                    name={`name${dataLokal?.idRiwayatProject}`}
                    placeholder={dataLokal ? dataLokal.judulProject === null ? "Nama Proyek" : dataLokal.judulProject : "Nama Proyek"}
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onBlur={(e) => {
                        setDataLokal((prev) => ({
                            ...(prev || {
                                idRiwayatProject: "",
                                judulProject: "",
                                namaPosisi: "",
                                lamaKolaborasi: 0,
                                shortDesc: "",
                                nomorIndukKaryawan: "",
                            }),
                            judulProject: e.target.value
                        }))
                    }}
                    disabled={!editOn}

                />
            </div>
            <div className="flex flex-col">
                <label htmlFor={`posisi${dataLokal?.idRiwayatProject}`} className="text-sm text-gray-600 mb-1">Posisi atau peran</label>
                <input
                    type="text"
                    id={`posisi${dataLokal?.idRiwayatProject}`}
                    name={`posisi${dataLokal?.idRiwayatProject}`}
                    placeholder={dataLokal ? dataLokal.judulProject === null ? "Nama Proyek" : dataLokal.judulProject : "Nama Proyek"}
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onBlur={(e) => {
                        setDataLokal((prev) => ({
                            ...(prev || {
                                idRiwayatProject: "",
                                judulProject: "",
                                namaPosisi: "",
                                lamaKolaborasi: 0,
                                shortDesc: "",
                                nomorIndukKaryawan: "",
                            }),
                            judulProject: e.target.value
                        }))
                    }}
                    disabled={!editOn}

                />
            </div>
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1" htmlFor={`year${dataLokal?.idRiwayatProject}`}>
                    Tahun
                </label>
                <input
                    type="number"
                    id={`year${dataLokal?.idRiwayatProject}`}
                    name={`year${dataLokal?.idRiwayatProject}`}
                    placeholder={dataLokal ? dataLokal.lamaKolaborasi === null ? "Tahun project" : String(dataLokal.lamaKolaborasi) : "Tahun project"}
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onBlur={(e) => {
                        setDataLokal((prev) => ({
                            ...(prev || {
                                idRiwayatProject: "",
                                judulProject: "",
                                namaPosisi: "",
                                lamaKolaborasi: 0,
                                shortDesc: "",
                                nomorIndukKaryawan: "",
                            }),
                            lamaKolaborasi: parseInt(e.target.value)
                        }))
                    }}
                    disabled={!editOn}

                />
            </div>
            <div className="flex flex-col gap-1 w-full">
                <label className="text-sm text-gray-600 mb-1" htmlFor={`shortDesc${dataLokal?.idRiwayatProject}`}>
                    Short Desc
                </label>
                <textarea
                    id={`shortDesc${dataLokal?.idRiwayatProject}`}
                    name={`shortDesc${dataLokal?.idRiwayatProject}`}
                    rows={5}
                    placeholder={dataLokal ? dataLokal.shortDesc === null ? "Short Description" : dataLokal.shortDesc : "Short Description"}
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-visible"
                    onBlur={(e) => {
                        setDataLokal((prev) => ({
                            ...(prev || {
                                idRiwayatProject: "",
                                judulProject: "",
                                namaPosisi: "",
                                lamaKolaborasi: 0,
                                shortDesc: "",
                                nomorIndukKaryawan: "",
                            }),
                            shortDesc: e.target.value
                        }))
                    }}
                    disabled={!editOn}

                />
            </div>
            </CardContent>
            <CardFooter className="flex justify-end h-[10%] gap-4 mt-4">
                {!editOn ? (
                    <button
                        onClick={() => setEditOn(true)}
                        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                    >
                        Edit
                    </button>
                    ) : (
                    <button
                        onClick={() => setEditOn(false)}
                        className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition"
                    >
                        Selesai
                    </button>
                )}
            </CardFooter>
        </Card>
    )
    
}