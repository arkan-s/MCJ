import { JobVacancy } from "@/types/datatype-jobvacancy";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const JVColumn: ColumnDef<JobVacancy>[] = [
    {
        accessorKey: "idJV",
        header: () => <span className="whitespace-nowrap">ID Job Vacancy</span>,
        enableGlobalFilter: false,
    },
    {
        accessorFn: (row) => row.DataBranch?.namaBranch ?? "-",
        id: "personnelArea",
        header: () => <span className="whitespace-nowrap">Cabang</span>,
        cell: ({ row }) => {
            const value = row.original.DataBranch.namaBranch;
            return <span className="whitespace-nowrap">{value}</span>;
        },
        enableColumnFilter: true,
        enableGlobalFilter: false,
    },
    {
        accessorFn: (row) => row.DataPosition?.DataDepartment?.namaDepartment ?? "-",
        id: "personnelSubarea",
        header: () => <span className="whitespace-nowrap">Department</span>,
        enableColumnFilter: true,
        enableGlobalFilter: false,
    },
    {
        accessorFn: (row) => row.DataPosition?.namaPosition ?? "-",
        id: "position",
        header: () => <span className="whitespace-nowrap">Posisi</span>,
        enableGlobalFilter: true,
        enableColumnFilter: true,
    },
    {
        accessorFn: (row) => row.DataLevel?.namaLevel ?? "-",
        id: "levelPosition",
        header: () => <span className="whitespace-nowrap">Level</span>,
        enableGlobalFilter: false,
    },
    {
        accessorKey: "available",
        header: () => <span className="whitespace-nowrap">Perkiraan kosong</span>,
        sortingFn: "datetime",
        cell: ({ row }) => {
            const value = row.getValue("available") as string;
            if (!value) return "-";
            const date = new Date(value);
            return format(date, "MMM yyyy");
        },
        enableGlobalFilter: false,
    },
    {
        accessorKey: "JobSummary",
        header: () => <span className="whitespace-nowrap">Ringkasan Pekerjaan</span>,
        cell: ({ row }) => {
            const value = row.getValue("JobSummary") as string | null;
            return value ? value : "Tidak ada ringkasan pekerjaan";
        },
    },
    {
        accessorKey: "JobDescription",
        header: () => <span className="whitespace-nowrap">Deskripsi Pekerjaan</span>,
        cell: ({ row }) => {
            const value = row.getValue("JobDescription") as string | null;
            return value ? value : "Tidak ada deskripsi pekerjaan";
        },
    },
    {
    id: "actions",
    cell: ({ row }) => {
        const jobvacancy = row.original
        return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(jobvacancy.idJV)}
            >
                Copy NIK
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem >Delete Data</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        )
        },
        enableGlobalFilter: false,
    },
]