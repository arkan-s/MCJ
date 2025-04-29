'use client';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import { branch, department, getDashboardKaryawan, level, position } from "@/utils/fetchData"
import { getQueryClient } from '@/lib/getQueryClient';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CareerHistoryCard, ComiteeCard, OrgIntCard, ProjectCard } from './Cards';
import { Scrollbar } from '@radix-ui/react-scroll-area';
import dayjs from 'dayjs';
import 'dayjs/locale/id'; // supaya Bahasa Indonesia





export default function Dashboard() {
    dayjs.locale('id'); // set ke Bahasa Indonesia

    const { data: session } = useSession();
    
    // const params = useParams();
    // const nik = params.nik as string;
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

    const { data: dashboardData, isLoading: dashboardLoading, isError: dashboardError } = useQuery({
        queryKey: ['employeedashboard', session?.user?.nik],
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

    const [ profileField, setProfileField ] = useState<{title: string, value: string}[]>()


    useEffect(() => {
        if (dashboardData) {
            const newProfileFields = [
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
            setProfileField(newProfileFields); // Update state with new profile fields
        }
    }, [dashboardData, dashboardLoading]);

    console.log(dashboardData?.DataRiwayatKarir)


    return (
        <div className="flex flex-col grow my-1 mx-3 md:m-3 p-1 md:p-0 md:mx-1 md:my-1 overflow-y-auto">
            <div className="flex font-semibold italic text-center md:text-start md:w-full md:text-3xl md:p-1 md:h-2/12 mb-2 md:mb-0 border-b border-blue-500">
                <h1>Employee Dashboard</h1>
            </div>
            <div className="flex md:grow flex-col md:flex-wrap md:w-full md:h-10/12">
                <div className="flex grow flex-col md:flex-row md:h-2/5 ">
                    <div className="flex flex-col md:mt-8 md:w-[30%] items-center">
                        <button className="block w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            <img src="/path/to/profile.jpg" alt="Profile Photo" className="w-full h-full object-cover" />
                        </button>
                        <h1 className="hidden md:block overflow-x-visible md:text-base break-words whitespace-normal text-center md:my-1"> {profileField?.find((e: any)=>e.title === "Nama")?.value} </h1>
                        <h3 className="block overflow-x-visible md:text-sm break-words whitespace-normal text-center mb-2"> <span className="italic">{profileField?.find((e: any)=>e.title === "Posisi")?.value}</span> - <span className="not-italic">{profileField?.find((e: any)=>e.title === "Level")?.value}</span></h3>
                        <h3 className="hidden md:block overflow-x-visible md:text-sm break-words whitespace-normal text-center mb-1"> {profileField?.find((e: any)=>e.title === "Department")?.value} </h3>
                        <h3 className="hidden md:block overflow-x-visible md:text-sm break-words whitespace-normal text-center mb-1"> {profileField?.find((e: any)=>e.title === "Cabang")?.value} </h3>
                    </div>
                    <div className=" flex grow flex-col justify-around md:w-[35%] md:h-full mb-1 md:mb-0">{
                        profileField?.slice(0,6).map((e: any)=>(
                            <h3 key={e.title} className="flex overflow-x-visible md:text-sm break-words whitespace-normal m-1">
                                <span className="w-1/2">{e.title}</span> 
                                <span className="w-1/2">{e.value}</span>
                            </h3>
                        ))
                    }</div>
                    <div className=" flex flex-row flex-wrap md:flex-col justify-center justify-around items-around md:items-center md:w-[35%] md:h-full">
                        <button className="flex h-[50%] md:h-[10%] w-[45%] md:w-[80%] ring-2 ring-blue-500 ring-offset-2 ring-offset-white rounded-sm mb-4 
                                bg-white text-blue-500 hover:text-white hover:bg-blue-500 active:text-white active:bg-blue-500 
                                cursor-pointer items-center justify-center text-xs md:text-base">Edit data diri</button>
                        <button className="flex h-[50%] md:h-[10%] w-[45%] md:w-[80%] ring-2 ring-blue-500 ring-offset-2 ring-offset-white rounded-sm mb-4 
                                bg-white text-blue-500 hover:text-white hover:bg-blue-500 active:text-white active:bg-blue-500 
                                cursor-pointer items-center justify-center text-xs md:text-base">Download data</button>
                        <button className="flex h-[50%] md:h-[10%] w-[90%] md:w-[80%] ring-2 ring-blue-500 ring-offset-2 ring-offset-white mb-4 
                                bg-white text-blue-500 hover:text-white hover:bg-blue-500 active:text-white active:bg-blue-500 
                                cursor-pointer items-center justify-center text-xs md:text-base">Lihat jawaban kuesioner</button>
                    </div>
                </div>
                <div className="flex grow md:h-3/5">
                        <Tabs defaultValue="Riwayat Karir" className="flex flex-col w-full grow">
                            <TabsList className="grid w-fit grid-cols-6 bg-slate-300 mb-0 rounded-bl-none">
                                <TabsTrigger className="truncate text-[8px] md:text-sm" value="Riwayat Karir">Riwayat Karir</TabsTrigger>
                                <TabsTrigger className="truncate text-[8px] md:text-sm" value="Project">Project</TabsTrigger>
                                <TabsTrigger className="truncate text-[8px] md:text-sm" value="Organisasi Internal">Organisasi Internal</TabsTrigger>
                                <TabsTrigger className="truncate text-[8px] md:text-sm" value="Kepanitiaan">Kepanitiaan</TabsTrigger>
                                <TabsTrigger className="truncate text-[8px] md:text-sm" value="Riwayat GKM">GKM</TabsTrigger>
                                <TabsTrigger className="truncate text-[8px] md:text-sm" value="Training">Training</TabsTrigger>
                            </TabsList>
                            <TabsContent value="Riwayat Karir" className="flex flex-col md:flex-row grow justify-center items-center md:justify-start p-1 md:-mt-px">
                                    {
                                        dashboardData?.DataRiwayatKarir?.length === 0 || dashboardData?.formFilled === 0 ?
                                            (
                                                <h1>Data anda masih kosong</h1>
                                            )
                                            :
                                            dashboardData?.DataRiwayatKarir?.map((e:any, index: number)=>(
                                                <CareerHistoryCard key={index} data={e}></CareerHistoryCard>
                                            ))
                                    }
                            </TabsContent>
                            <TabsContent value="Project" className="flex flex-col md:flex-row grow justify-center items-center md:justify-start p-1 md:-mt-px">
                                    {
                                        dashboardData?.DataRiwayatProject?.length === 0 ?
                                            (
                                                <h1>Data anda masih kosong</h1>
                                            )
                                            :
                                            dashboardData?.DataRiwayatProject?.map((e:any, index: number)=>(
                                                <ProjectCard key={index} data={e}></ProjectCard>
                                            ))
                                    }
                            </TabsContent>
                            <TabsContent value="Organisasi Internal" className="flex flex-col md:flex-row grow justify-center items-center md:justify-start p-1 md:-mt-px">
                                {
                                    dashboardData?.DataRiwayatOrganisasiInternal?.length === 0 ?
                                        (
                                            <h1>Data anda masih kosong</h1>
                                        )
                                        :
                                        dashboardData?.DataRiwayatOrganisasiInternat?.map((e:any, index: number)=>(
                                            <OrgIntCard key={index} data={e}></OrgIntCard>
                                        ))
                                }
                            </TabsContent>
                            <TabsContent value="Kepanitiaan" className="flex flex-col md:flex-row grow justify-center items-center md:justify-start p-1 md:-mt-px">
                                {
                                    dashboardData?.DataRiwayatKepanitiaan?.length === 0 ?
                                        (
                                            <h1>Data anda masih kosong</h1>
                                        )
                                        :
                                        dashboardData?.DataRiwayatKepanitiaan?.map((e:any, index: number)=>(
                                            <ComiteeCard key={index} data={e}></ComiteeCard>
                                        ))
                                }
                            </TabsContent>
                            <TabsContent value="Kepanitiaan" className="flex flex-col md:flex-row grow justify-center items-center md:justify-start p-1 md:-mt-px">
                                {
                                    dashboardData?.DataRiwayatGKM ?
                                        (
                                            <h1>Data anda masih kosong</h1>
                                        )
                                        :
                                        (
                                        <Card className="flex flex-col h-80 w-80 max-w-80 p-1 overflow-y-auto shadow-md border border-gray-200 rounded-2xl">
                                            <CardContent>
                                                <div className="flex flex-col">
                                                    <label className="text-sm text-gray-600 mb-1" htmlFor={`tahunPelaksanaan${dashboardData?.DataRiwayatGKM?.nomorIndukKaryawan}`}>
                                                        Total keikutsertaan
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id={`tahunPelaksanaan${dashboardData?.DataRiwayatGKM?.nomorIndukKaryawan}`}
                                                        name={`tahunPelaksanaan${dashboardData?.DataRiwayatGKM?.nomorIndukKaryawan}`}
                                                        placeholder={dashboardData ? dashboardData?.DataRiwayatGKM?.banyakKeikutsertaan === null ? "Berapa kali ikut GKM?" : String(dashboardData?.DataRiwayatGKM?.banyakKeikutsertaan) : "Berapa kali ikut GKM?"}
                                                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="text-sm text-gray-600 mb-1" htmlFor={`posisiTertinggi${dashboardData?.DataRiwayatGKM?.nomorIndukKaryawan}`}>
                                                        Posisi Tertinggi
                                                    </label>
                                                    <input
                                                        type="String"
                                                        id={`posisiTertinggi${dashboardData?.DataRiwayatGKM?.nomorIndukKaryawan}`}
                                                        name={`posisiTertinggi${dashboardData?.DataRiwayatGKM?.nomorIndukKaryawan}`}
                                                        placeholder={dashboardData ? dashboardData?.DataRiwayatGKM?.banyakKeikutsertaan === null ? "Berapa kali ikut GKM?" : String(dashboardData?.DataRiwayatGKM?.banyakKeikutsertaan) : "Berapa kali ikut GKM?"}
                                                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                        )
                                }
                            </TabsContent>

                        </Tabs>
                </div>
            </div>
            
        </div>
        
    )
}
