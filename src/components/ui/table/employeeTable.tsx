"use client"

import { Button } from "@/components/ui/button"
import * as React from "react"

import {
    ColumnDef,
    flexRender,
    SortingState,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"


import { Input } from "@/components/ui/input"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface EmployeeTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    addDataURL: string
}

export function EmployeeTable<TData, TValue>({columns,data, addDataURL}: EmployeeTableProps<TData, TValue>){
    // ====== Must-Fetched Data ======

    // ====== Initialize and Re Component's States ======
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = React.useState("")

    const employeeTable = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
            globalFilter,
        },
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
    })

    // ====== Initialize and Re Other States ======

    // ====== Initialize and Re Component's Components ======

    // ====== Consoling ======
    
    // ====== Loading Handling ======

    // ====== Error Handling ======

    // ====== Return ======
    return (
            <div>
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Cari posisi..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-sm"
                    />
                    {/* <div className="flex justify-end grow">
                        <button className="bg-blue-500 text-white text-lg font-semibold py-2 px-4 lg:p-1 rounded-md lg:w-[300px] lg:m-3 hover:bg-blue-600 w-full"
                        onClick={() => window.location.href = window.location.href + addDataURL}>Add Data</button>
                    </div> */}
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                        {employeeTable.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                        )}
                                </TableHead>
                                )
                            })}
                            </TableRow>
                        ))}
                        </TableHeader>
                        <TableBody>
                        {employeeTable.getRowModel().rows?.length ? (
                            employeeTable.getRowModel().rows.map((row) => (
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
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => employeeTable.previousPage()}
                    disabled={!employeeTable.getCanPreviousPage()}
                    >
                    Previous
                    </Button>
    
                    {employeeTable.getPageCount() > 1 && (() => {
                        const pageIndex = employeeTable.getState().pagination.pageIndex;
                        const totalPages = employeeTable.getPageCount();
    
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
                                        onClick={() => employeeTable.setPageIndex(page)}
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
                    onClick={() => employeeTable.nextPage()}
                    disabled={!employeeTable.getCanNextPage()}
                    >
                    Next
                    </Button>
                </div>
            </div>
        )
}