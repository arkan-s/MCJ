'use client';

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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { branch, department, getCareerPath, level, position, postData } from "@/utils/fetchData"
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { CPDataTable } from "@/components/ui/datashow/cp-table";
import { PositionDataTable } from "@/components/ui/datashow/position-table";
import { DepartmentDataTable } from "@/components/ui/datashow/dept-table";
import { BranchDataTable } from "@/components/ui/datashow/branch-table";
import { LevelDataTable } from "@/components/ui/datashow/level-table";
import { branchCol } from "@/components/shared/columns/branch";
import { departmentCol } from "@/components/shared/columns/department";
import { positionCol } from "@/components/shared/columns/position";
import { levelCol } from "@/components/shared/columns/level";
import { careerPathCol } from "@/components/shared/columns/careerpath";


export default function Database() {
    const queryClient = useQueryClient();

    // ====== Must-Fetched Data ======
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

    const { mutate: addPosition, isPending: isAddPositionPending } = useMutation({
        mutationFn: (newData: any) => postData(newData, "/api/position"),
        onSuccess: () => {
            alert("Berhasil menambahkan Data");
            queryClient.invalidateQueries({ queryKey: ["position"] });
        },
        onError: (error) => {
            console.error(error);
            alert("Gagal menambah posisi");
        },
    });

    const handlePositionAdd = (newData: any) => {
        addPosition(newData);
    };

    const { data: levelData, isLoading: levelLoading, isError: levelError } = useQuery({
        queryKey: ["level"],
        queryFn: level,
        retry: 3, 
        retryDelay: attemptIndex => Math.min(1000 * 1 ** attemptIndex, 30000),
        staleTime: Infinity, 
    });

    const { data: cpData, isLoading: cpLoading, isError: cpError} = useQuery({
        queryKey: ["careerPath"],
        queryFn: getCareerPath,
        retry: 3, 
        retryDelay: attemptIndex => Math.min(1000 * 1 ** attemptIndex, 30000),
        staleTime: Infinity, 
    })

    const { mutate: addCareerPath, isPending: isAddCPPending } = useMutation({
        mutationFn: (newData: any) => postData(newData, "/api/careerpath"),
        onSuccess: () => {
            alert("Berhasil menambahkan Data");
            queryClient.invalidateQueries({ queryKey: ["careerPath"] });
        },
        onError: (error) => {
            console.error(error);
            alert("Gagal menambah career path");
        },
    });

    const handleCPAdd = (newData: any) => {
        addCareerPath(newData);
    };

    type involvedDept = {
        idID: string;
        idForm: string;
        titleForm: string;
        idDepartment: string;
        namaDepartment: string;
    }
    // const { data: idData, isLoading: idLoading, isError: idError } = useQuery({
    //     queryKey: ["involvedDept"],
    //     queryFn: getInvolvedDept,
    //     retry: 3, 
    //     retryDelay: attemptIndex => Math.min(1000 * 1 ** attemptIndex, 30000),
    //     staleTime: Infinity, 
    // })

    type involvedPosition = {
        idIP: string;
        titleForm: string;
        idAssessmentType: string;
        titleAssessmentType: string;
        idPosition: number;
        namaPosition: string;
    }
    // const { data: ipData, isLoading: ipLoading, isError: ipError } = useQuery({
    //     queryKey: ["involvedDept"],
    //     queryFn: getInvolvedPosition,
    //     retry: 3, 
    //     retryDelay: attemptIndex => Math.min(1000 * 1 ** attemptIndex, 30000),
    //     staleTime: Infinity, 
    // }) 

    // ====== Initialize and Re Component's States ======
    const isAnyLoading = branchLoading || departmentLoading || positionLoading || levelLoading || cpLoading;
    const isAnyError = branchError || departmentError || positionError || levelError || cpError;

    // ====== Initialize and Re Other States ======

    // ====== Initialize and Re Component's Components ======

    // ====== Consoling ======
    
    // ====== Loading Handling ======

    // ====== Error Handling ======

    // ====== Return ======
    return (
        <div className="flex grow max-h-screen overflow-y-auto p-3 w-full">
            {isAnyLoading ? (
            <div className="flex flex-col items-center justify-center w-full py-20">
                <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
                <p className="mt-4 text-lg font-semibold">Loading data...</p>
            </div>
            ) : isAnyError ? (
                <div className="flex flex-col items-center justify-center w-full py-20 text-red-500">
                    <p className="text-lg font-semibold">Gagal memuat data. Coba refresh halaman.</p>
                </div>
                ) : ( 
                    <>
            <Tabs className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="Cabang">Cabang</TabsTrigger>
                    <TabsTrigger value="Department">Department</TabsTrigger>
                    <TabsTrigger value="Posisi">Posisi</TabsTrigger>
                    <TabsTrigger value="Level">Level</TabsTrigger>
                    <TabsTrigger value="CareerPath">Career Path</TabsTrigger>
                </TabsList>
                <TabsContent value="Cabang">
                    <BranchDataTable columns={branchCol} data={branchData}></BranchDataTable>
                </TabsContent>
                <TabsContent value="Department">
                    <DepartmentDataTable columns={departmentCol} data={departmentData}></DepartmentDataTable>
                </TabsContent>
                <TabsContent value="Posisi">
                    <PositionDataTable columns={positionCol} data={positionData} addFn={handlePositionAdd}></PositionDataTable>
                </TabsContent>
                <TabsContent value="Level">
                    <LevelDataTable columns={levelCol} data={levelData}></LevelDataTable>
                </TabsContent>
                <TabsContent value="CareerPath">
                    <CPDataTable columns={careerPathCol} data={cpData} addFn={handleCPAdd}></CPDataTable>
                </TabsContent>
            </Tabs>
            <Dialog open={isAddCPPending}>
                <DialogContent className="flex flex-col items-center justify-center gap-4 py-8">
                <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
                <p className="text-lg font-semibold">Menyimpan Data...</p>
                </DialogContent>
            </Dialog>
            </>
            )
            }
        </div>
        
    )
}
