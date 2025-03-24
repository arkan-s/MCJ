import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import * as dbAligner from "@/utils/dbAligner";


const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { nomorIndukKaryawan: string } }) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }
    
    try {
        const { nomorIndukKaryawan } = params;
        if(session.user.role === "employee" && session.user.nik !== nomorIndukKaryawan){
            return NextResponse.json({error: "Forbidden", message: "Mohon gunakan nomor induk karyawan anda sendiri" }, { status : 403});
        }
        const datakaryawan = await prisma.dataKaryawan.findUnique({
            where: { nomorIndukKaryawan: nomorIndukKaryawan },
        });

        if (!datakaryawan) {
            return NextResponse.json({ error: "Data not found", message: "Data karyawan mungkin tak tersedia di database!" }, { status: 404 });
        }

        return NextResponse.json(datakaryawan, { status: 200 });
    } catch (e) {
        return NextResponse.json({ error: "Internal Server Error", message: (e as any).message }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { nomorIndukKaryawan: string } }) {
    const session = await auth();

    if (!session || !session.user) {
        return NextResponse.json(
            { error: "Unauthorized", message: "Anda belum login atau bukan seorang HR" },
            { status: 401 }
        );
    }

    try {
        if (!req.headers.get("content-type")?.includes("application/json")) {
            return NextResponse.json(
                { error: "Invalid Content-Type", message: "Gunakan 'application/json'" },
                { status: 415 }
            );
        }

        if(session.user.role === "hd"){
            return NextResponse.json({ error: "Forbidden", message: "Anda tidak memiliki akses" }, { status: 403 });
        }

        const data = await req.json();

        const dataRiwayatKarir = await prisma.dataRiwayatKarir.create({
            data: {
                nomorIndukKaryawan: data.nomorIndukKaryawan as string,
                position: data.position as string,
                levelPosition: data.levelPosition as string,
                personnelArea: dbAligner.toIDBranch(String(data.personnelArea)),
                personnelSubarea: dbAligner.toIDDept(String(data.personnelSubarea)),
                tanggalMulai: data.tanggalMulai as Date,
                tanggalBerakhir: data.tanggalBerakhir as Date,
                status: 0
            }
        });

        return NextResponse.json(dataRiwayatKarir, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
    }
}

export async function PATCH(req : NextRequest, { params }: { params: { nomorIndukKaryawan: string } }){
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }
    const { nomorIndukKaryawan } = params;
    if(session.user.role === "employee" && session.user.nik !== nomorIndukKaryawan){
        return NextResponse.json({error: "Forbidden", message: "Mohon gunakan nomor induk karyawan anda sendiri" }, { status : 403});
    }

    try {
        const nik = params.nomorIndukKaryawan;
        if(session.user.role === "employee" && session.user.nik !== nomorIndukKaryawan){
            return NextResponse.json({error: "Forbidden", message: "Mohon gunakan nomor induk karyawan anda sendiri" }, { status : 403});
        }
        const prev_data = await prisma.dataKaryawan.findUnique({
            where: { nomorIndukKaryawan: nomorIndukKaryawan },
        });
        if (!prev_data) {
            return NextResponse.json({ error: "Data not found", message: "Data karyawan mungkin tak tersedia di database!" }, { status: 404 });
        }

        const data = await req.json();
        const updatedData = await await prisma.dataKaryawan.update({
            where: { nomorIndukKaryawan: nik },
            data: {
                nomorIndukKaryawan: data.nomorIndukKaryawan,
                namaKaryawan: data.namaKaryawan,
                tanggalLahir: data.tanggalLahir,
                tanggalMasukKerja: data.tanggalMasukKerja,
                gender: data.gender,
                personnelArea: dbAligner.toIDBranch(data.personnelArea),
                position: data.position,
                personnelSubarea: dbAligner.toIDDept(data.personnelSubarea),
                levelPosition: data.levelPosition,
                pend: data.pend,
                namaSekolah: data.namaSekolah,
                namaJurusan: data.namaJurusan
            },
        });
        
        ///NOT YET RAMPUNG
        const toUpdate = [];
        
        if (prev_data) {
            for (const key in ["personnelArea", "personnelSubarea", "levelPosition", "position", "tanggalMasukKerja"]) {
                if (data[key] !== (prev_data as any)[key]) {
                    toUpdate.push(key);
                }
                }
        }
        
        return NextResponse.json( updatedData, {status: 200});
    } catch (error) {
        return NextResponse.json({error: "Error occured! Update failed", message: (error as any).message}, {status: 500})
    }
}