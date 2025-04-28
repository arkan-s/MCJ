'use client';

import { branch, department, getData, getdatakaryawan } from "@/utils/fetchData"
import { useQuery } from "@tanstack/react-query";
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { useSession } from "next-auth/react"
import { JVColumn } from "./column";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { ListFilter, MapPin, NotebookText, Rocket } from "lucide-react";



export default function JobVacancy(){
    const { data: session } = useSession();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState("")
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    
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

    const { data: dataKaryawan, isLoading: karyawanLoading, isError: karyawanError } = useQuery({
        queryKey: ['datakaryawan'],
        queryFn: () => getdatakaryawan(session?.user?.nik),
        refetchOnWindowFocus: false,
        enabled: !!session?.user?.nik,
        retry: 3, 
        retryDelay: (attemptIndex: number) => Math.min(1000 * 1 ** attemptIndex, 30000),
    })

    const { data: jobVacancyData, isLoading: jobVacancyLoading, isError: jobVacancyError } = useQuery({
        queryKey: ['jobvacancy'],
        queryFn: () => getData('/api/jobvacancy'),
        refetchOnWindowFocus: false,
        enabled: !!session?.user?.nik,
        retry: 3, 
        retryDelay: (attemptIndex: number) => Math.min(1000 * 1 ** attemptIndex, 30000),
    })

    const JobVacancyTable = useReactTable({
        data: jobVacancyData || [],
        columns: JVColumn,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            pagination
        },
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        autoResetPageIndex: false, 
    });

    console.log(JobVacancyTable.getRowModel().rows);

    const resetFilters = () => {
        setColumnFilters([]);    
        setGlobalFilter("");     
        setSorting([]);          
    };

    if (branchLoading || departmentLoading || karyawanLoading || jobVacancyLoading) {
        return (
            <div className="flex flex-col grow w-full justify-center items-center">
                <ClipLoader size={60} color="#3498db" />;
            </div>
        )
    }

    return (
        <div className="flex flex-col grow w-full">
            <div className="flex flex-wrap md:flex-nowrap md:justify-between items-center justify-center gap-4 p-4">
                <input
                    placeholder="Cari Posisi..."
                    value={JobVacancyTable.getColumn("position")?.getFilterValue() as string | number | readonly string[] | undefined}
                    onChange={(e) => JobVacancyTable.getColumn("position")?.setFilterValue(String(e.target.value))}
                    className="w-full md:w-[30%] h-10 border-2 border-blue-500 rounded-lg text-center"
                />
                <div className="flex flex-row grow justify-between md:justify-end">
                    <Select 
                    value={JobVacancyTable.getColumn("personnelSubarea")?.getFilterValue() as string || ""} 
                    onValueChange={(e) => {
                        console.log(e);
                        JobVacancyTable.getColumn("personnelSubarea")?.setFilterValue(String(e));}}>
                        <SelectTrigger className="w-[50%] h-10 border-2 border-blue-500 rounded-lg m-1">
                            <ListFilter/>
                            <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                        {departmentLoading ? (
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
                            <SelectItem key={index} value={dept.namaDepartment}>
                                {dept.namaDepartment}
                            </SelectItem>
                            ))
                        )}
                        </SelectContent>
                    </Select>
                    <Select 
                    value={JobVacancyTable.getColumn("personnelArea")?.getFilterValue() as string || ""} 
                    onValueChange={(e) => JobVacancyTable.getColumn("personnelArea")?.setFilterValue(e)}>
                        <SelectTrigger className="w-[50%] h-10 border-2 border-blue-500 rounded-lg m-1">
                            <ListFilter/>
                            <SelectValue placeholder="Cabang" />
                        </SelectTrigger>
                        <SelectContent>
                        {branchLoading ? (
                            <div className="flex justify-center items-center">
                            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                            <p className="ml-2 text-sm text-gray-500">Loading...</p>
                            </div>
                        ) : branchError ? (
                            <div className="flex justify-center items-center">
                            <p className="text-sm text-red-500">Datanya kosong atau terjadi error. Mohon untuk refresh.</p>
                            </div>
                        ) : (
                            branchData.map((branch: any, index: any) => (
                            <SelectItem key={index} value={branch.namaBranch}>
                                {branch.namaBranch}
                            </SelectItem>
                            ))
                        )}
                        </SelectContent>
                    </Select>
                </div>
                <Button
                    onClick={resetFilters}
                    variant={"ghost"}
                    className="w-full h-10 border-2 border-blue-500 rounded-lg m-1"
                >
                    Reset filter
                </Button>
            </div>
            <div className="flex flex-col items-center grow overflow-y-scroll">
                {jobVacancyLoading ? (
                    <div className="flex justify-center items-center">
                    <ClipLoader size={30} color="#3498db" />;
                    <p className="ml-2 text-sm text-gray-500">Loading...</p>
                    </div>
                ) : jobVacancyError ? (
                    <div className="flex justify-center items-center">
                    <p className="text-sm text-red-500">Datanya kosong atau terjadi error. Mohon untuk refresh.</p>
                    </div>
                ) : jobVacancyData && Array.isArray(jobVacancyData) && jobVacancyData.length > 0 && JobVacancyTable ? (
                    JobVacancyTable.getRowModel().rows.map((jv: any, index: any) => (
                    <Card key={index} className="w-80 h-80 md:w-[55%] m-2">
                        <CardHeader className="flex flex-col w-full">
                            <div className="bg-amber-200 rounded-full w-fit p-1">
                                {jv.getValue("personnelSubarea")}
                            </div>
                            <CardTitle>
                                {jv.getValue("position")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-y-1 items-start md:flex-row md:gap-x-2">
                            <div className="flex flex-row justify-center items-center gap-1">
                                <MapPin width={14} height={14}></MapPin>
                                <p className="text-[14px]">{jv.getValue("personnelArea")}</p>
                            </div>
                            <div className="flex flex-row justify-center items-center gap-1">
                                <Rocket width={14} height={14}></Rocket>
                                <p className="text-[14px]">{jv.getValue("available").split("T")[0]}</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                        <div className="flex flex-row justify-center items-center gap-1">
                                <NotebookText width={14} height={14}></NotebookText>
                                <p className="text-[14px]">{jv.getValue("JobSummary") ?? "Belum tersedia ringkasan pekerjaan"}</p>
                            </div>
                        </CardFooter>
                    </Card>
                ))
                ) : (
                    <div className="text-center text-gray-500">Tidak ada data tersedia.</div> 
                )}
            </div>
            <div className="flex items-center justify-evenly md:justify-end md:gap-2 m-1 md:m-2">
            <Button
            variant="outline"
            onClick={() => JobVacancyTable.firstPage()}
            disabled={!JobVacancyTable.getCanPreviousPage()}
            className="border border-blue-500 hover:bg-blue-400"
            >
            {'<<'}
            </Button>
            <Button
            variant="outline"
            onClick={() => JobVacancyTable.previousPage()}
            disabled={!JobVacancyTable.getCanPreviousPage()}
            className="border border-blue-500 hover:bg-blue-400"    
            >
            {'<'}
            </Button>
            {/* <select
            value={JobVacancyTable.getState().pagination.pageSize}
            onChange={e => {
                JobVacancyTable.setPageSize(Number(e.target.value))
            }}
            >
            {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                {pageSize}
                </option>
            ))}
            </select> */}
            <Button
            variant="outline"
            onClick={() => JobVacancyTable.nextPage()}
            disabled={!JobVacancyTable.getCanNextPage()}
            className="border border-blue-500 hover:bg-blue-400"
            >
            {'>'}
            </Button>
            <Button
            variant="outline"
            onClick={() => JobVacancyTable.lastPage()}
            disabled={!JobVacancyTable.getCanNextPage()}
            className="border border-blue-500 hover:bg-blue-400"
            >
            {'>>'}
            </Button>
            </div>
        </div>
    )

}