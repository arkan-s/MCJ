import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest, { params }: { params: { nomorIndukKaryawan: string } }) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }
    const { nomorIndukKaryawan } = await params;
    if(session.user.role === "employee" && session.user.nik !== nomorIndukKaryawan){
        return NextResponse.json({error: "Forbidden", message: "Mohon gunakan nomor induk karyawan anda sendiri" }, { status : 403});
    }
    
    try {
        const datakaryawan = await prisma.dataKaryawan.findUnique({
            where: { nomorIndukKaryawan: nomorIndukKaryawan },
        });
        
        if (!datakaryawan) {
            return NextResponse.json({ error: "Data not found", message: "Data karyawan mungkin tak tersedia di database!" }, { status: 404 });
        }
        if(session.user.role === "hr" && session.user.branch !== "N001"){
            if(session.user.branch !== datakaryawan?.personnelArea){
                return NextResponse.json({error: "Forbidden",  message: "Karyawan bukan berasal dari cabang anda!"}, {status: 403});
            }
        }
        if(session.user.role === "hd"){
            if(session.user.dept !== datakaryawan.personnelSubarea){
                return NextResponse.json({error: "Forbidden",  message: "Karyawan bukan berasal dari department anda!"}, {status: 403});
            }
            if(session.user.branch !== datakaryawan.personnelArea){
                return NextResponse.json({error: "Forbidden",  message: "Karyawan bukan berasal dari cabang anda!"}, {status: 403});
            }
        }

        return NextResponse.json(datakaryawan, { status: 200 });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return NextResponse.json({ error: `Prisma Error with code ${error.code}`, message: (error as any).message }, { status: 400 });
        } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
            console.error('Unknown Prisma error:', error.message);
            return NextResponse.json({ error: `Unknown Prisma error with message : ${error.message}`, message: (error as any).message }, { status: 500 });

        } else {
            return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
        }
    }
}

// TIDAK ADA MEMBUAT DATA KARYAWAN SECARA TERPISAH DENGAN PEMBUATAN AKUN
// export async function POST(req: Request, { params }: { params: { nomorIndukKaryawan: string } }) {
//     const session = await auth();

//     if (!session || !session.user) {
//         return NextResponse.json(
//             { error: "Unauthorized", message: "Anda belum login atau bukan seorang HR" },
//             { status: 401 }
//         );
//     }
//     if(session.user.role === "hd" || session.user.role){
//         return NextResponse.json({ error: "Forbidden", message: "Anda tidak memiliki akses" }, { status: 403 });
//     }
//     if (!req.headers.get("content-type")?.includes("application/json")) {
//         return NextResponse.json(
//             { error: "Invalid Content-Type", message: "Gunakan 'application/json'" },
//             { status: 415 }
//         );
//     }
//     if()

//     try {


//         const data = await req.json();

//         const dataRiwayatKarir = await prisma.dataRiwayatKarir.create({
//             data: {
//                 nomorIndukKaryawan: data.nomorIndukKaryawan as string,
//                 position: data.position as string,
//                 levelPosition: data.levelPosition as string,
//                 personnelArea: dbAligner.toIDBranch(String(data.personnelArea)),
//                 personnelSubarea: dbAligner.toIDDept(String(data.personnelSubarea)),
//                 tanggalMulai: data.tanggalMulai as Date,
//                 tanggalBerakhir: data.tanggalBerakhir as Date,
//                 status: 0
//             }
//         });

//         return NextResponse.json(dataRiwayatKarir, { status: 201 });
//     } catch (error) {
//         return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
//     }
// }

export async function PUT(req : NextRequest, { params }: { params: { nomorIndukKaryawan: string } }){
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }
    const { nomorIndukKaryawan } = await params;
    if(session.user.role === "employee" && session.user.nik !== nomorIndukKaryawan){
        return NextResponse.json({error: "Forbidden", message: "Mohon gunakan nomor induk karyawan anda sendiri" }, { status : 403});
    }
    if (session.user.role === "hd") {
        return NextResponse.json({error: "Forbidden", message: "Anda tidak berhak melakukan edit data karyawan" }, { status : 403});
    }

    try {
        const prev_data = await prisma.dataKaryawan.findUnique({
            where: { nomorIndukKaryawan: nomorIndukKaryawan },
        });
        if (!prev_data) {
            return NextResponse.json({ error: "Data not found", message: "Data karyawan mungkin tak tersedia di database!" }, { status: 404 });
        }
        if(session.user.role==="hr" && session.user.branch !== "N001"){
            if(prev_data.personnelSubarea !== session.user.branch){
                return NextResponse.json({error: "Forbidden", message: `Karyawan dengan nik ${nomorIndukKaryawan} bukan dari cabang anda!` }, { status : 403});
            }
        }

        const data = await req.json();
        const updatedData = await prisma.dataKaryawan.update({
            where: { nomorIndukKaryawan: nomorIndukKaryawan },
            data: {
                namaKaryawan: data.namaKaryawan,
                tanggalLahir: data.tanggalLahir,
                tanggalMasukKerja: data.tanggalMasukKerja,
                gender: data.gender,
                age: (new Date().getTime() - new Date(data.tanggalLahir).getTime()) / 1000 * 60 * 60 * 24 * 365.25,
                personnelArea: prev_data.personnelArea,
                personnelSubarea: prev_data.personnelSubarea,
                position: prev_data.position,
                levelPosition: prev_data.levelPosition,
                
                pend: data.pend,
                namaSekolah: data.namaSekolah,
                namaJurusan: data.namaJurusan,
                
                formFilled: prev_data.formFilled,
                questionnaire: prev_data.questionnaire,

                BestEmployee: data.BestEmployee,
                
                lengthOfService: (new Date().getTime() - new Date(data.tanggalMasukKerja).getTime()) / 1000 * 60 * 60 * 24 * 365.25,
                createdAt: prev_data.createdAt,
                lastUpdatedAt: new Date(),
            },
        });
        
        
        return NextResponse.json( updatedData, {status: 200});
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return NextResponse.json({ error: `Prisma Error with code ${error.code}`, message: (error as any).message }, { status: 400 });
        } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
            console.error('Unknown Prisma error:', error.message);
            return NextResponse.json({ error: `Unknown Prisma error with message : ${error.message}`, message: (error as any).message }, { status: 500 });

        } else {
            return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
        }
    }
}