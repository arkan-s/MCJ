import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";


export async function PUT(req: NextRequest, { params }:{ params : { nomorIndukKaryawan : string, idCareerHistory : string } }){
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }
    if (session.user.role === "hd"){
        return NextResponse.json({error: "Forbidden", message: "Anda tidak memiliki akses untuk melakukan ini!"}, {status: 403})
    }
    if (!req.headers.get("content-type")?.includes("application/json")) {
        return NextResponse.json(
            { error: "Invalid Content-Type", message: "Gunakan 'application/json'" },
            { status: 415 }
        );
    }
    const { nomorIndukKaryawan, idCareerHistory } = await params;
    if(session.user.role === "employee" && session.user.nik !== nomorIndukKaryawan){
        return NextResponse.json({error: "Forbidden", message: "Mohon gunakan nomor induk karyawan anda sendiri" }, { status : 403});
    }

    let updatedData;

    try {
        const dataRiwayatKarir = await req.json();
        
        updatedData = await prisma.dataRiwayatKarir.update({
            where: {
                idCareerHistory: idCareerHistory,
            },
            data: {
                ...dataRiwayatKarir
            }
        })
        return NextResponse.json(updatedData, {status: 200});
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


export async function DELETE(req: NextRequest, { params }:{ params : { nomorIndukKaryawan : string, idCareerHistory : string } }) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }
    if (session.user.role === "hd"){
        return NextResponse.json({error: "Unauthorized", message: "Anda tidak memiliki akses untuk melakukan ini!"}, {status: 401})
    }
    const { nomorIndukKaryawan, idCareerHistory } = await params;
    if(session.user.role === "employee" && session.user.nik !== nomorIndukKaryawan){
        return NextResponse.json({error: "Forbidden", message: "Mohon gunakan nomor induk karyawan anda sendiri" }, { status : 403});
    }

    try {
        const dataRiwayatKarir = await prisma.dataRiwayatKarir.findUnique({
            where: { idCareerHistory: idCareerHistory },
        });
        if (!dataRiwayatKarir) {
            return NextResponse.json({ error: "Data not found", message: "Data tidak ditemukan!" }, { status: 404 });
        }
        if (dataRiwayatKarir?.status === 1) {
            return NextResponse.json({error: "Bad request", message: "Tidak bisa menghapus posisi aktif anda sekarang! Buat posisi aktif baru terlebih dahulu!"},{status: 400})
        }
        const deletedData = await prisma.dataRiwayatKarir.delete({
            where: { idCareerHistory: idCareerHistory },
            select: {
                idCareerHistory: true
            }
        })
        return NextResponse.json(deletedData, {status: 200});
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