"use client"

import { Button } from "@/components/ui/button"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    ColumnDef,
    flexRender,
    SortingState,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    ColumnFiltersState,
} from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"

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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { department, position } from "@/utils/fetchData"
import { useQuery } from "@tanstack/react-query"
import { createId } from "@paralleldrive/cuid2"

interface CPTable<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    addFn: (data: {existing: number; future: number }) => void
}

export function CPDataTable<TData, TValue>({columns,data, addFn}: CPTable<TData, TValue>){
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState("")
    
    const careerPathTable = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
            columnFilters,
            globalFilter
        },
        onGlobalFilterChange: setGlobalFilter,
    })

    const { data: departmentData, isLoading: departmentLoading, isError: departmentError } = useQuery({
        queryKey: ["department"],
        queryFn: department,
        retry: 3, 
        retryDelay: (attemptIndex: number) => Math.min(1000 * 1 ** attemptIndex, 30000),
        staleTime: Infinity,        
    });
    const { data: positionData, isLoading: positionLoading, isError: positionError } = useQuery({
        queryKey: ["position"],
        queryFn: position,
        retry: 3, 
        retryDelay: (attemptIndex: number) => Math.min(1000 * 1 ** attemptIndex, 30000),
        staleTime: Infinity, 
    });
    const [existingPosition, setExistingPosition] = useState<string>("");
    const [futurePosition, setFuturePosition] = useState<string>("");
    const handleSave = () => {
        
        if (!existingPosition || !futurePosition) {
            alert("Pilihlah posisi awal dan posisi akhirnya!");
            return;
        }

        const newData = {
            existing: parseInt(existingPosition),
            future: parseInt(futurePosition),
        };

        addFn(newData); // panggil callback kirim ke parent
    };

    return (
        <div>
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Cari posisi..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-sm"
                />
                {/* <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline">Filtering by Dept</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms" />
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                Accept terms and conditions
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms" />
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                Accept terms and conditions
                                </label>
                            </div>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a fruit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel>Fruits</SelectLabel>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="blueberry">Blueberry</SelectItem>
                                    <SelectItem value="grapes">Grapes</SelectItem>
                                    <SelectItem value="pineapple">Pineapple</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </PopoverContent>
                </Popover> */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="bg-blue-500 text-white text-lg font-semibold py-2 px-4 lg:p-1 rounded-md lg:w-[300px] lg:m-3 hover:bg-blue-600 w-full">
                            Add Data
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Menambah Data</DialogTitle>
                            <DialogDescription>Pilih posisi existing dan future untuk career path.</DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="existing" className="text-right">
                                Existing
                                </Label>
                                <Select onValueChange={setExistingPosition}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Pilih Existing" />
                                </SelectTrigger>
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
                                            positionData.map((pos: any, index:any) => (
                                                <SelectItem key={index} value={String(pos.idPosition)}>{pos.namaPosition}</SelectItem>
                                            ))
                                        )
                                    }
                                </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="future" className="text-right">
                                Future
                                </Label>
                                <Select onValueChange={setFuturePosition}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Pilih Future" />
                                </SelectTrigger>
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
                                            positionData.map((pos: any, index:any) => (
                                                <SelectItem key={index} value={String(pos.idPosition)}>{pos.namaPosition}</SelectItem>
                                            ))
                                        )
                                    }
                                </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter>
                        <Button onClick={handleSave}>Tambah Data</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="rounded-md border">
            {careerPathTable ? (
                <Table>
                    <TableHeader>
                    {careerPathTable.getHeaderGroups()?.length ? (
                        careerPathTable.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                            </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableHead colSpan={columns.length} className="text-center">
                            Loading header...
                            </TableHead>
                        </TableRow>
                        )}
                    </TableHeader>
                    <TableBody>
                    {careerPathTable.getRowModel().rows?.length ? (
                        careerPathTable.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                            {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                            ))}
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            No results.
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                ) : (
                <div className="text-center p-4">Loading table...</div>
                )}
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                variant="outline"
                size="sm"
                onClick={() => careerPathTable.previousPage()}
                disabled={!careerPathTable.getCanPreviousPage()}
                >
                Previous
                </Button>

                {careerPathTable.getPageCount() > 1 && (() => {
                    const pageIndex = careerPathTable.getState().pagination.pageIndex;
                    const totalPages = careerPathTable.getPageCount();

                    let start = Math.max(0, pageIndex - 2); 
                    let end = Math.min(totalPages - 1, pageIndex + 2);

                    if (end - start < 4) {
                        if (start === 0) {
                            end = Math.min(4, totalPages - 1);
                        } else if (end === totalPages - 1) {
                            start = Math.max(totalPages - 5, 0);
                        }
                    }

                    return (
                        <>
                            {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((page) => (
                                <Button
                                    key={page}
                                    variant={pageIndex === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => careerPathTable.setPageIndex(page)}
                                >
                                    {page + 1}
                                </Button>
                            ))}
                        </>
                    );
                })()}


                <Button
                variant="outline"
                size="sm"
                onClick={() => careerPathTable.nextPage()}
                disabled={!careerPathTable.getCanNextPage()}
                >
                Next
                </Button>
            </div>
        </div>
    )
}