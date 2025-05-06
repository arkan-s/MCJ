'use client';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useMutation, useQuery } from "@tanstack/react-query"
import { branch, department, getDashboardKaryawan, level, position, putData } from "@/utils/fetchData"
import { getQueryClient } from '@/lib/getQueryClient';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CareerHistoryCard, ComiteeCard, OrgIntCard, ProjectCard, TrainingCard } from './Cards';
import dayjs from 'dayjs';
import 'dayjs/locale/id'; 
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DataKaryawan } from '@/types/datatype-employee';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Dashboard() {
    
    dayjs.locale('id'); 
    const { data: session } = useSession();
    const router = useRouter();
    // const params = useParams();\
    // const nik = params.nik as string;

    // ====== Must-Fetched Data ======
    const { data: branchData, isLoading: branchLoading, isError: branchError } = useQuery({
        queryKey: ["cabang"],
        queryFn: branch,
        retry: 3, 
        retryDelay: attemptIndex => Math.min(1000 * 1.5 ** attemptIndex, 30000),
        staleTime: Infinity,
        
    });
        
    const { data: departmentData, isLoading: departmentLoading, isError: departmentError } = useQuery({
        queryKey: ["department"],
        queryFn: department,
        retry: 3, 
        retryDelay: attemptIndex => Math.min(1000 * 1.5 ** attemptIndex, 30000),
        staleTime: Infinity,        
    });

    const { data: positionData, isLoading: positionLoading, isError: positionError } = useQuery({
        queryKey: ["position"],
        queryFn: position,
        retry: 3, 
        retryDelay: attemptIndex => Math.min(1000 * 1.5 ** attemptIndex, 30000),
        staleTime: Infinity, 
    });

    const { data: levelData, isLoading: levelLoading, isError: levelError } = useQuery({
        queryKey: ["level"],
        queryFn: level,
        retry: 3, 
        retryDelay: attemptIndex => Math.min(1000 * 1.5 ** attemptIndex, 30000),
        staleTime: Infinity, 
    });

    const nik = session?.user?.nik;
    const queryKey = ['employeedashboard', nik];    

    const { data: dashboardData, isLoading: dashboardLoading, isError: dashboardError } = useQuery({
        queryKey: ['employeedashboard', queryKey],
        queryFn: () => {
            if (!session?.user?.nik) {
                throw new Error("NIK is not available");
                }
                return getDashboardKaryawan(session.user.nik);
            },
        enabled:  !!session?.user?.nik,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 1.5 ** attemptIndex, 30000),
        staleTime: Infinity
    })

    const { mutate: updateDashboardData, isPending: isUpdateDashboardDataPending } = useMutation({
        mutationFn: ({ id, newData, url }: { id: any; newData: any; url: any }) => putData(id, newData, url),
        onMutate: () => {
            closeEditData(); // Dialog ditutup sebelum loading mulai
        },
        onSuccess: () => {
            // closeEditData();
            setEditResultNotice({status: "success", message: "Data telah berhasil diubah!", isOpen: true});
            getQueryClient().invalidateQueries({ queryKey: ['employeedashboard', queryKey] });
            getQueryClient().refetchQueries({ queryKey: ['employeedashboard', queryKey] });
        },
        onError: (error) => {
            // closeEditData();
            setEditResultNotice({status: "error", message: `Terjadi error : ${error.message}. Mohon refresh dan ulangi.`, isOpen: true});
        },
    });

    const openResultQuestionnaire = () => {

    }

    

    // ====== Initialize and Re Component's States ======
    const profileField = useMemo(() => {
        if (!dashboardData) return [];
        return [
            { title: "NIK", value: dashboardData.nomorIndukKaryawan },
            { title: "Nama", value: dashboardData.namaKaryawan },
            { title: "Tanggal Lahir", value: dayjs(dashboardData.tanggalLahir.split("T")[0]).format('dddd, D MMMM YYYY') },
            { title: "Pendidikan", value: dashboardData.pend },
            { title: "Sekolah", value: dashboardData.namaSekolah },
            { title: "Jurusan", value: dashboardData.namaJurusan },
            { title: "Tanggal Masuk Kerja", value: dashboardData.tanggalMasukKerja },
            { title: "Gender", value: dashboardData.gender },
            { title: "Age", value: dashboardData.age },
            { title: "Cabang", value: dashboardData.DataBranch.namaBranch},
            { title: "Department", value: dashboardData.DataPosition.DataDepartment.namaDepartment },
            { title: "Posisi", value:dashboardData.DataPosition.namaPosition },
            { title: "Level", value: dashboardData.DataLevel.namaLevel },
        ];
    }, [dashboardData]);

    const [ isRedirecting, setIsRedirecting ] = useState<boolean>(false); 
    const formFilled_0 = () => {
        setIsRedirecting(true);
        router.push('/employee/form');
    }

    const [ isEditOpen, setIsEditOpen ] = useState<boolean>(false);
    const [ editData, setEditData ] = useState<Partial<DataKaryawan>>();
    useEffect(()=>{
        if (dashboardLoading) {
            return;
        }
        if (dashboardData) {
            const data = {
                nomorIndukKaryawan: dashboardData.nomorIndukKaryawan,
                namaKaryawan: dashboardData.namaKaryawan,
                tanggalLahir: new Date(dashboardData.tanggalLahir),
                tanggalMasukKerja: new Date(dashboardData.tanggalMasukKerja),
                gender: dashboardData.gender,
                personnelArea: dashboardData.personnelArea,
                position: dashboardData.position,
                personnelSubarea: dashboardData.personnelSubarea,
                levelPosition: dashboardData.levelPosition,
                age: dashboardData.age,
                lengthOfService: dashboardData.lengthOfService,
                pend: dashboardData.pend,
                namaSekolah: dashboardData.namaSekolah,
                namaJurusan: dashboardData.namaJurusan,
    
                BestEmployee: dashboardData.BestEmployee === null ? 0 : dashboardData.BestEmployee,
    
                formFilled: dashboardData.formFilled,
                questionnaire: dashboardData.questionnaire,
                createdAt: dashboardData.createdAt,
                lastUpdatedAt: dashboardData.lastUpdateAt,
            }
            setEditData(data);
        }
        
    }, [dashboardData, isEditOpen]);
    const openEditData = () => {
        setIsEditOpen(true);
    }
    const closeEditData = () => {
        setIsEditOpen(false);
    }

    const [ editResultNotice, setEditResultNotice ] = useState<{status: "success" | "error", message: string, isOpen: boolean}>({status: "success", message: "", isOpen: false});

    const [ failedDownloadOpen, setFailedDownloadOpen ] = useState<boolean>(false);
    const downloadData = () => {
        if (session?.user.formFilled === 0 || session?.user.questionnaire === 0) {
            setFailedDownloadOpen(true);
            return;
        }

    }


    
    // ====== Initialize and Re Other States ======

    // ====== Initialize and Re Component's Components ======

    const DashboardSkeleton = () => {
        return (
            <div className="flex flex-col grow my-1 mx-3 md:m-3 p-1 md:p-0 md:mx-1 md:my-1 overflow-y-auto">
                {/* Header */}
                <Skeleton className="h-10 w-1/3 mb-4" />
        
                <div className="flex md:grow flex-col md:flex-wrap md:w-full md:h-10/12">
                    <div className="flex grow flex-col md:flex-row md:h-2/5">
                        {/* Profile Section */}
                        <div className="flex flex-col md:mt-8 md:w-[30%] items-center">
                        <Skeleton className="w-32 h-32 rounded-full mb-2" />
                        <Skeleton className="w-24 h-4 mb-1" />
                        <Skeleton className="w-32 h-3 mb-1" />
                        <Skeleton className="w-24 h-3 mb-1" />
                        <Skeleton className="w-24 h-3 mb-1" />
                        </div>
            
                        {/* Detail Info */}
                        <div className="flex grow flex-col justify-around md:w-[35%] md:h-full mb-1 md:mb-0">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="w-full h-4 m-1" />
                        ))}
                        </div>
            
                        {/* Buttons */}
                        <div className="flex flex-row flex-wrap md:flex-col justify-center md:items-center md:w-[35%] md:h-full">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-10 w-[80%] mb-4" />
                        ))}
                        </div>
                    </div>  
        
                {/* Tabs Skeleton */}
                    <div className="flex grow md:h-3/5 flex-col">
                        <Skeleton className="w-full h-10 mb-4" />
                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-24 w-48" />
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };   

    // ====== Consoling ======
    console.log(profileField);

    // ====== Loading Handling ======
    if (dashboardLoading) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-20">
                <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
                <p className="mt-4 text-lg font-semibold">Loading data...</p>
            </div>
        )
    }

    if (isRedirecting) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-20">
                <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
                <p className="mt-4 text-lg font-semibold">Loading data...</p>
            </div>
        )
    }

    // ====== Error Handling ======
    if (dashboardError) {
        return (
            <>
                <DashboardSkeleton />
                <AlertDialog defaultOpen>
                    <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle> Terjadi kesalahan </AlertDialogTitle>
                        <AlertDialogDescription>
                            Gagal memuat data dashboard. Silakan muat ulang halaman.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => window.location.reload()}>
                            Muat Ulang Halaman
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </>
        );
    }


    // ====== Return ======
    return (
        <div className="flex flex-col grow my-1 mx-3 md:m-3 p-1 md:p-0 md:mx-1 md:my-1 overflow-y-auto">
            <div className="flex font-semibold italic text-center md:text-start md:w-full md:text-3xl md:p-1 md:h-2/12 mb-2 md:mb-0 border-b border-blue-500">
                <h1>Employee Dashboard</h1>
            </div>
            <div className="flex md:grow flex-col md:flex-wrap md:w-full md:h-10/12">
                <div className="flex grow flex-col md:flex-row md:h-2/5 ">
                    <div className="flex flex-col md:mt-8 md:w-[30%] items-center">
                        <button className="block w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            <img alt="Profile Photo" className="w-full h-full object-contain" />
                        </button>
                        <h1 className="hidden md:block overflow-x-visible md:text-base break-words whitespace-normal text-center md:my-1"> {profileField?.find((e: any)=>e.title === "Nama")?.value} </h1>
                        <h3 className="block overflow-x-visible md:text-sm break-words whitespace-normal text-center mb-2"> <span className="italic">{profileField?.find((e: any)=>e.title === "Posisi")?.value}</span> - <span className="not-italic">{profileField?.find((e: any)=>e.title === "Level")?.value}</span></h3>
                        <h3 className="hidden md:block overflow-x-visible md:text-sm break-words whitespace-normal text-center mb-1"> {profileField?.find((e: any)=>e.title === "Department")?.value} </h3>
                        <h3 className="hidden md:block overflow-x-visible md:text-sm break-words whitespace-normal text-center mb-1"> {profileField?.find((e: any)=>e.title === "Cabang")?.value} </h3>
                    </div>
                    <div className=" flex grow flex-col justify-around md:w-[35%] md:h-full mb-1 md:mb-0">
                    {
                        profileField?.slice(0,6).map((e: any)=>(
                            <h3 key={e.title} className="flex overflow-x-visible md:text-sm break-words whitespace-normal m-1">
                                <span className="w-1/2">{e.title}</span> 
                                <span className="w-1/2">{e.value}</span>
                            </h3>
                        ))
                    }
                    </div>
                    <div className=" flex flex-row flex-wrap md:flex-col justify-center justify-around items-around md:items-center md:w-[35%] md:h-full">
                        <button className="flex h-[50%] md:h-[10%] w-[45%] md:w-[80%] ring-2 ring-blue-500 ring-offset-2 ring-offset-white rounded-sm mb-4 
                                bg-white text-blue-500 hover:text-white hover:bg-blue-500 active:text-white active:bg-blue-500 
                                cursor-pointer items-center justify-center text-xs md:text-base"
                                onClick={()=>openEditData()}
                        >
                            Edit data diri
                        </button>
                        <button className="flex h-[50%] md:h-[10%] w-[45%] md:w-[80%] ring-2 ring-blue-500 ring-offset-2 ring-offset-white rounded-sm mb-4 
                                bg-white text-blue-500 hover:text-white hover:bg-blue-500 active:text-white active:bg-blue-500 
                                cursor-pointer items-center justify-center text-xs md:text-base"
                                onClick={()=>downloadData()}
                        >
                            Download data
                        </button>
                        <button className="flex h-[50%] md:h-[10%] w-[90%] md:w-[80%] ring-2 ring-blue-500 ring-offset-2 ring-offset-white mb-4 
                                bg-white text-blue-500 hover:text-white hover:bg-blue-500 active:text-white active:bg-blue-500 
                                cursor-pointer items-center justify-center text-xs md:text-base"
                        >
                            Lihat jawaban kuesioner
                        </button>
                    </div>
                </div>
                <div className="flex grow md:h-3/5">
                    {
                        dashboardData?.formFilled === 0 ?
                        (
                            <div className="flex grow md:h-3/5 flex-col relative">
                                {/* Skeleton atas */}
                                <Skeleton className="w-full h-10 mb-4" />

                                {/* Skeleton bawah */}
                                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                    {[...Array(3)].map((_, i) => (
                                    <Skeleton key={i} className="h-24 w-48" />
                                    ))}
                                </div>

                                {/* Tombol overlay */}
                                <div className="absolute grow inset-0 flex items-center justify-center z-10">
                                    <div className="flex flex-col justify-center items-center bg-yellow-200 w-64 h-44 border border-red-500 gap-2 rounded rounded-xl hover:shadow-xl hover:bg-yellow-100 shadow-lg p-2">
                                        <h3 className="block text-center text-red-600 font-bold">Anda belum mengisi Form Data diri. Mohon isi terlebih dahulu.</h3>
                                        <Button onClick={()=>formFilled_0()} className="px-4 py-2 bg-red-500 text-amber-400 hover:text-yellow-100 rounded hover:bg-red-600 shadow-lg">
                                            Isi Form
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        )
                        :
                        (
                            <Tabs defaultValue="Riwayat Karir" className="flex flex-col w-full grow">
                                <TabsList className="grid w-fit grid-cols-6 bg-slate-300 mb-0 rounded-bl-none">
                                    <TabsTrigger className="truncate text-[8px] md:text-sm" value="Riwayat Karir">Riwayat Karir</TabsTrigger>
                                    <TabsTrigger className="truncate text-[8px] md:text-sm" value="Project">Project</TabsTrigger>
                                    <TabsTrigger className="truncate text-[8px] md:text-sm" value="Organisasi Internal">Organisasi Internal</TabsTrigger>
                                    <TabsTrigger className="truncate text-[8px] md:text-sm" value="Kepanitiaan">Kepanitiaan</TabsTrigger>
                                    <TabsTrigger className="truncate text-[8px] md:text-sm" value="Riwayat GKM">GKM</TabsTrigger>
                                    <TabsTrigger className="truncate text-[8px] md:text-sm" value="Training">Training</TabsTrigger>
                                </TabsList>
                                <TabsContent value="Riwayat Karir" className="flex flex-wrap overflow-x-auto items-center justify-center md:justify-start p-1 md:-mt-px">
                                {
                                    dashboardData?.DataRiwayatKarir?.length && dashboardData?.formFilled === 1
                                    ? dashboardData.DataRiwayatKarir.map((e: any, i: number) => (
                                        <CareerHistoryCard key={i} data={e} />
                                        ))
                                    : 
                                    (
                                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                            {[...Array(3)].map((_, i) => (
                                            <Skeleton key={i} className="h-24 w-48" />
                                            ))}
                                        </div>
                                    )
                                }
                                </TabsContent>

                                <TabsContent value="Project" className="flex flex-wrap overflow-x-auto items-center justify-center md:justify-start p-1 md:-mt-px">
                                {
                                    dashboardData?.DataRiwayatProject?.length 
                                    ? dashboardData.DataRiwayatProject.map((e: any, i: number) => (
                                        <ProjectCard key={i} data={e} />
                                        ))

                                    : <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                            {[...Array(3)].map((_, i) => (
                                            <Skeleton key={i} className="h-24 w-48" />
                                            ))}
                                        </div>
                                }
                                </TabsContent>

                                <TabsContent value="Organisasi Internal" className="flex flex-wrap overflow-x-auto items-center justify-center md:justify-start p-1 md:-mt-px">
                                {
                                    dashboardData?.DataRiwayatOrganisasiInternal?.length 
                                    ? dashboardData.DataRiwayatOrganisasiInternal.map((e: any, i: number) => (
                                        <OrgIntCard key={i} data={e} />
                                        ))
                                    :   <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                            {[...Array(3)].map((_, i) => (
                                            <Skeleton key={i} className="h-24 w-48" />
                                            ))}
                                        </div>
                                }
                                </TabsContent>

                                <TabsContent value="Kepanitiaan" className="flex flex-wrap overflow-x-auto items-center justify-center md:justify-start p-1 md:-mt-px">
                                {
                                    dashboardData?.DataRiwayatKepanitiaan?.length 
                                    ? dashboardData.DataRiwayatKepanitiaan.map((e: any, i: number) => (
                                        <ComiteeCard key={i} data={e} />
                                        ))
                                    :   <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                            {[...Array(3)].map((_, i) => (
                                            <Skeleton key={i} className="h-24 w-48" />
                                            ))}
                                        </div>
                                }
                                </TabsContent>

                                <TabsContent value="Riwayat GKM" className="flex flex-wrap overflow-x-auto items-center justify-center p-1 md:-mt-px">
                                {
                                    dashboardData?.DataRiwayatGKM
                                    ? (
                                        <Card className="flex flex-col h-80 w-80 p-4 shadow-md border rounded-2xl">
                                            <CardContent>
                                                <div className="flex flex-col mb-4">
                                                <label className="text-sm text-gray-600 mb-1" htmlFor={`tahunPelaksanaan${dashboardData?.DataRiwayatGKM.nomorIndukKaryawan}`}>
                                                    Total keikutsertaan
                                                </label>
                                                <input
                                                    type="number"
                                                    id={`tahunPelaksanaan${dashboardData.DataRiwayatGKM.nomorIndukKaryawan}`}
                                                    placeholder={dashboardData?.DataRiwayatGKM.banyakKeikutsertaan?.toString() || "Berapa kali ikut GKM?"}
                                                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                </div>
                                                <div className="flex flex-col">
                                                <label className="text-sm text-gray-600 mb-1" htmlFor={`posisiTertinggi${dashboardData?.DataRiwayatGKM.nomorIndukKaryawan}`}>
                                                    Posisi Tertinggi
                                                </label>
                                                <input
                                                    type="text"
                                                    id={`posisiTertinggi${dashboardData?.DataRiwayatGKM.nomorIndukKaryawan}`}
                                                    placeholder={dashboardData.DataRiwayatGKM.posisiTertinggi || "Masukkan posisi"}
                                                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                    :   <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                            {[...Array(3)].map((_, i) => (
                                            <Skeleton key={i} className="h-24 w-48" />
                                            ))}
                                        </div>
                                }
                                </TabsContent>

                                <TabsContent value="Training" className="flex flex-wrap overflow-x-auto items-center justify-center md:justify-start p-1 md:-mt-px gap-y-2">
                                {
                                    dashboardData?.DataTrainingWanted?.length 
                                    ? dashboardData.DataTrainingWanted.map((e: any, i: number) => (
                                        <TrainingCard key={i} data={e} /> 
                                        ))
                                    :   <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                            {[...Array(3)].map((_, i) => (
                                            <Skeleton key={i} className="h-24 w-48" />
                                            ))}
                                        </div>
                                }
                                </TabsContent>
                            </Tabs>
                        )
                    }
                </div>
            </div>
            {
                editResultNotice.isOpen && (
                    <AlertDialog open={editResultNotice.isOpen} onOpenChange={(open) => setEditResultNotice(prev => ({ ...prev, isOpen: open }))}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{editResultNotice.status}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {editResultNotice.message}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel 
                                    onClick={() => {
                                            setEditResultNotice(prev => ({ ...prev, isOpen: false }));
                                            window.location.reload();
                                        }
                                        }>
                                    Okay!
                                </AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )
            }
            {
                isUpdateDashboardDataPending && (
                    <div className="fixed top-0 left-0 z-30 w-screen h-screen flex flex-col items-center justify-center bg-grey-50">
                        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
                        <p className="mt-4 text-lg font-semibold">Editing data...</p>
                    </div>
                )
            }
            {
                failedDownloadOpen && (
                    <AlertDialog open={failedDownloadOpen} onOpenChange={setFailedDownloadOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Tidak bisa download!</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Isi form dan kuesioner terlebih dahulu sebelum mengunduh data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setFailedDownloadOpen(false)}>
                                    Cancel
                                </AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )
            }
            {
                isEditOpen && (
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogContent className="flex flex-col grow gap-y-4">
                            <DialogHeader>
                                <DialogTitle>Edit profile</DialogTitle>
                                <DialogDescription>
                                    Lakukan perubahan pada profil Anda di sini. Klik simpan setelah selesai.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-x-2 w-full">
                                <div className="flex flex-col">
                                    <label htmlFor="">NIK</label>
                                    <Input 
                                        value={editData?.nomorIndukKaryawan} 
                                        readOnly
                                        onChange={val=>setEditData({
                                            ...editData,
                                            nomorIndukKaryawan: val.target.value,
                                        })}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Nama Karyawan</label>
                                    <Input 
                                        value={editData?.namaKaryawan} 
                                        onChange={val=>setEditData({
                                            ...editData,
                                            namaKaryawan: val.target.value,
                                        })}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Tanggal Lahir</label>
                                    <Input
                                        type='Date'
                                        value={editData?.tanggalLahir?.toISOString().split("T")[0]} 
                                        onChange={val=>setEditData({
                                            ...editData,
                                            tanggalLahir: new Date(val.target.value),
                                        })} 
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Tanggal Masuk Perusahaan</label>
                                    <Input 
                                        type='Date'
                                        value={editData?.tanggalMasukKerja?.toISOString().split("T")[0]} 
                                        onChange={val=>setEditData({
                                            ...editData,
                                            tanggalMasukKerja: new Date(val.target.value),
                                        })} 
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Gender</label>
                                    <Select
                                        onValueChange={(value) => {
                                            setEditData({
                                                ...editData,
                                                gender: value,
                                            })
                                        }}
                                        defaultValue={editData && editData.gender || ""}
                                    >
                                        <SelectTrigger className="border-2 border-zinc-300 w-full">
                                            <SelectValue placeholder={editData && editData.personnelArea || "Pilih Cabang"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem key={"1-Male"} value={"Male"}>Male/Laki-laki</SelectItem>
                                            <SelectItem key={"2-Female"} value={"Female"}>Female/Perempuan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Karyawan Terbaik</label>
                                    <Input 
                                        type="number"
                                        value={String(editData?.BestEmployee) ?? String(0)} 
                                        onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            BestEmployee: Number(e.target.value), // konversi string ke number
                                        })
                                        } 
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Cabang</label>
                                    <Select
                                        onValueChange={(value) => {
                                            setEditData({
                                                ...editData,
                                                personnelArea: value
                                            })
                                        }}
                                        defaultValue={editData && editData.personnelArea || ""}
                                    >
                                        <SelectTrigger className="border-2 border-zinc-300 w-full">
                                            <SelectValue placeholder={editData && editData.personnelArea || "Pilih Cabang"} />
                                        </SelectTrigger>
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
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Department</label>
                                    <Select
                                        onValueChange={(value) => {
                                            setEditData({
                                                ...editData,
                                                personnelSubarea: value
                                            })
                                        }}
                                        defaultValue={editData && editData.personnelSubarea || ""}
                                    >
                                        <SelectTrigger className="border-2 border-zinc-300 w-full">
                                            <SelectValue placeholder={editData && editData.personnelSubarea || "Pilih Department"} />
                                        </SelectTrigger>
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
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Posisi</label>
                                    <Select
                                        onValueChange={(value) => {
                                            setEditData({
                                                ...editData,
                                                position: parseInt(value)
                                            })
                                        }}
                                        defaultValue={editData && String(editData.position) || ""}
                                    >
                                        <SelectTrigger className="border-2 border-zinc-300 w-full">
                                            <SelectValue placeholder={editData && String(editData.position) || "Pilih Posisi"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                        {
                                            positionLoading ? 
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
                                                positionData.filter((e:any)=>editData?.personnelSubarea === e.dept).map((pos: any, index:any) => (
                                                    <SelectItem key={index} value={String(pos.idPosition)}>{pos.namaPosition}</SelectItem>
                                                ))
                                            )
                                        }
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Level</label>
                                    <Select
                                        onValueChange={(value) => {
                                            setEditData({
                                                ...editData,
                                                levelPosition: value
                                            })
                                        }}
                                        defaultValue={editData && editData.levelPosition || ""}
                                    >
                                        <SelectTrigger className="border-2 border-zinc-300 w-full">
                                            <SelectValue placeholder={editData && editData.levelPosition || "Pilih Posisi"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                        {
                                            levelLoading ? 
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
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Pendidikan</label>
                                    <Input 
                                        value={editData?.pend} 
                                        onChange={val=>setEditData({
                                            ...editData,
                                            pend: val.target.value,
                                        })} 
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Nama Sekolah / Universitas</label>
                                    <Input 
                                        value={editData?.namaSekolah} 
                                        onChange={val=>setEditData({
                                            ...editData,
                                            namaSekolah: val.target.value,
                                        })} 
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Nama Jurusan</label>
                                    <Input 
                                        value={editData?.namaJurusan} 
                                        onChange={val=>setEditData({
                                            ...editData,
                                            namaJurusan: val.target.value,
                                        })} 
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" onClick={()=>closeEditData()}>Tutup</Button>
                            </DialogClose>
                            <Button 
                                onClick={()=>updateDashboardData({id: session?.user.nik, newData: editData, url: `/api/datakaryawan/${session?.user.nik}`})}
                            >
                                Simpan
                            </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )
            }            
        </div>
        
    )
}
