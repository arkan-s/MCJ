import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";


export async function GET(req: NextRequest, { params }:{ params : { nomorIndukKaryawan : string } }){
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }

    const { nomorIndukKaryawan } = await params;
    if(session.user.role === "employee" && session.user.nik !== nomorIndukKaryawan){
        return NextResponse.json({error: "Forbidden", message: "Mohon gunakan nomor induk karyawan anda sendiri" }, { status : 403});
    }

    try {
        const dataRiwayatKarir = await prisma.dataRiwayatKarir.findMany({
            where: { 
                nomorIndukKaryawan: nomorIndukKaryawan
            }
        })
        if(!dataRiwayatKarir.length){
            return NextResponse.json({ error: "Data not found", message: "Data mungkin tak tersedia di database!" }, { status: 404 });
        }
        return NextResponse.json(dataRiwayatKarir, {status: 200});
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

export async function POST(req: NextRequest, { params }:{ params : { nomorIndukKaryawan : string } }){
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }
    if (session.user.role === "hd"){
        return NextResponse.json({error: "Unauthorized", message: "Anda tidak memiliki akses untuk melakukan ini!"}, {status: 401})
    }

    const { nomorIndukKaryawan } = await params;
    
    if(session.user.role === "employee" && session.user.nik !== nomorIndukKaryawan){
        return NextResponse.json({error: "Forbidden", message: "Mohon gunakan nomor induk karyawan anda sendiri" }, { status : 403});
    }
    if (!req.headers.get("content-type")?.includes("application/json")) {
        return NextResponse.json(
            { error: "Invalid Content-Type", message: "Gunakan 'application/json'" },
            { status: 415 }
        );
    }

    try {
        const dataRiwayatKarir = await req.json();
        let updatedData, insertedData, updatedDataKaryawan;

        if (dataRiwayatKarir.status === 1) {
            const oldData = await prisma.dataRiwayatKarir.findFirst({
                where: {
                    nomorIndukKaryawan: session.user.role === "hr" ? nomorIndukKaryawan : session.user.nik,
                    status: 1,
                }
            })
            if(oldData?.tanggalMulai === null || oldData?.tanggalMulai === undefined){
                return NextResponse.json({ error: "Invalid Date", message: "Tanggal mulai posisi anda sekarang tidak valid" }, { status: 400 });
            }
            if (oldData.tanggalMulai >= dataRiwayatKarir.tanggalMulai) {
                return NextResponse.json({ error: "Invalid Date", message: "Tanggal mulai posisi yang akan anda tambah lebih usang dari pada posisi aktif anda sekarang" }, { status: 400 });
            }
            updatedData = await prisma.dataRiwayatKarir.update({
                where: {
                    idCareerHistory: oldData.idCareerHistory
                },
                data: {
                    status: 0
                }
            })

            insertedData = await prisma.dataRiwayatKarir.create({
                data: {
                    ...dataRiwayatKarir,
                    position: parseInt(dataRiwayatKarir.position),
                    nomorIndukKaryawan: session.user.role === "hr" ? nomorIndukKaryawan : session.user.nik
                }
            })

            updatedDataKaryawan = await prisma.dataKaryawan.update({
                where: {
                    nomorIndukKaryawan: session.user.role === "hr" ? nomorIndukKaryawan : session.user.nik,
                },
                data: {
                    position: dataRiwayatKarir.position,
                    levelPosition: dataRiwayatKarir.levelPosition,
                    personnelArea: dataRiwayatKarir.personnelArea,
                    personnelSubarea: dataRiwayatKarir.personnelSubarea,
                }
            })
        }
        else{
            updatedData = await prisma.dataRiwayatKarir.create({
                data: {
                    ...dataRiwayatKarir,
                    position: parseInt(dataRiwayatKarir.position),
                    nomorIndukKaryawan: nomorIndukKaryawan
                }
            })
        }

        return NextResponse.json({newDataRiwayatKarir : insertedData, newDataKaryawan : updatedDataKaryawan}, {status: 200});

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