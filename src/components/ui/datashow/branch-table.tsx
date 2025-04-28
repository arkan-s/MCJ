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

interface CPTable<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function BranchDataTable<TData, TValue>({columns,data}: CPTable<TData, TValue>){
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState("")
    
    const branchTable = useReactTable({
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

    const [dept, setDept] = useState<string>("");
    

    return (
        <div>
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Cari branch..."
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
                {/* <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="bg-blue-500 text-white text-lg font-semibold py-2 px-4 lg:p-1 rounded-md lg:w-[300px] lg:m-3 hover:bg-blue-600 w-full">
                            Add Data
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Menambah Data</DialogTitle>
                            <DialogDescription>Masukkan Nama Posisi dan branchnya.</DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="newPos" className="text-right">
                                Posisi
                            </Label>
                            <Input
                                id="newPos"
                                value={newbranch}
                                onChange={(e) => setNewbranch(e.target.value)}
                                placeholder="Masukkan nama posisi"
                            />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="future" className="text-right">
                                branch
                                </Label>
                                <Select onValueChange={setDept}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Pilih Future" />
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
                                            branchData.map((pos: any, index:any) => (
                                                <SelectItem key={index} value={String(pos.idbranch)}>{pos.namabranch}</SelectItem>
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
                </Dialog> */}
            </div>
            <div className="rounded-md border">
            {branchTable ? (
                <Table>
                    <TableHeader>
                    {branchTable.getHeaderGroups()?.length ? (
                        branchTable.getHeaderGroups().map((headerGroup) => (
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
                    {branchTable.getRowModel().rows?.length ? (
                        branchTable.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                        >
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
                onClick={() => branchTable.previousPage()}
                disabled={!branchTable.getCanPreviousPage()}
                >
                Previous
                </Button>

                {branchTable.getPageCount() > 1 && (() => {
                    const pageIndex = branchTable.getState().pagination.pageIndex;
                    const totalPages = branchTable.getPageCount();

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
                                    onClick={() => branchTable.setPageIndex(page)}
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
                onClick={() => branchTable.nextPage()}
                disabled={!branchTable.getCanNextPage()}
                >
                Next
                </Button>
            </div>
        </div>
    )
}