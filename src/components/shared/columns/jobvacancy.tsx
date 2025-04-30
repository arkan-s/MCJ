import { JobVacancy } from "@/types/datatype-jobvacancy";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const JVColumn: ColumnDef<JobVacancy>[] = [
    {
        accessorKey: "idJV",
        header: "ID Job Vacancy",
        enableGlobalFilter: false,
    },

    {
        accessorFn: (row) => row.DataBranch?.namaBranch ?? "-",
        id: "personnelArea",
        header: "Personnel Area",
        enableColumnFilter: true,
        enableGlobalFilter: false,
    },
    {
        accessorFn: (row) => row.DataPosition?.DataDepartment?.namaDepartment ?? "-",
        id: "personnelSubarea",
        header: "Personnel Subarea",
        enableColumnFilter: true,
        enableGlobalFilter: false,
    },
    {
        accessorFn: (row) => row.DataPosition?.namaPosition ?? "-",
        id: "position",
        header: "Posisi",
        enableGlobalFilter: true,
        enableColumnFilter: true,

    },
    {
        accessorFn: (row) => row.DataLevel?.namaLevel ?? "-",
        id: "levelPosition",
        header: "Level",
        enableGlobalFilter: false,
    },

    {
        accessorKey: "available",
        header: "Perkiraan Kosong",
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
        header: "Ringkasan Pekerjaan",
        cell: ({ row }) => {
            const value = row.getValue("JobSummary") as string | null;
            return value ? value : "Tidak ada ringkasan pekerjaan";
        },
    },
    
    {
        accessorKey: "JobDescription",
        header: "Deskripsi Pekerjaan",
        cell: ({ row }) => {
            const value = row.getValue("JobDescription") as string | null;
            return value ? value : "Tidak ada deskripsi pekerjaan";
        },
    },
]