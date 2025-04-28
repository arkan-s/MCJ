import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(req: NextRequest, { params }:{ params : { nomorIndukKaryawan : string, idProjectHistory : string } }) {
    const session = await auth();

    if (!session || !session.user) {
        return NextResponse.json(
            { error: "Unauthorized", message: "Anda belum login atau bukan seorang HR" },
            { status: 401 }
        );
    }
    if (session.user.role === "hd"){
        return NextResponse.json({ error: "Forbidden", message: "Anda tidak memiliki akses" }, { status: 403 });
    }
    const { nomorIndukKaryawan, idProjectHistory } = await params;
    if (!req.headers.get("content-type")?.includes("application/json")) {
        return NextResponse.json(
            { error: "Invalid Content-Type", message: "Gunakan 'application/json'" },
            { status: 415 }
        );
    }
    if(session.user.role === "employee" && session.user.nik !== nomorIndukKaryawan){
        return NextResponse.json({ error: "Forbidden", message: "Anda bukan pemilik data" }, { status: 403 });
    }

    try {
        const data = await req.json();

        const updatedData = await prisma.dataRiwayatProject.update({
            where: {
                idRiwayatProject: idProjectHistory,
            },
            data: {
                nomorIndukKaryawan: nomorIndukKaryawan,
                judulProject: data.judulProject as string,
                namaPosisi: data.namaPosisi as string,
                lamaKolaborasi: data.lamaKolaborasi as number,
                shortDesc: data.shortDesc as string,
            }
        });

        return NextResponse.json(updatedData, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }:{ params : { nomorIndukKaryawan : string, idProjectHistory : string } }) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role === "hd"){
        return NextResponse.json({ error: "Forbidden", message: "Anda tidak memiliki akses" }, { status: 403 });
    }

    const { nomorIndukKaryawan, idProjectHistory } = await params;

    if(session.user.role === "employee" && session.user.nik !== nomorIndukKaryawan){
        return NextResponse.json({ error: "Forbidden", message: "Anda bukan pemilik data" }, { status: 403 });
    }

    try {
        const deletedData = await prisma.dataRiwayatProject.delete({
            where: {
                idRiwayatProject: idProjectHistory,
            },
            select: {
                idRiwayatProject: true
            }
        });

        return NextResponse.json({ data : deletedData , message: "Data berhasil dihapus!" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
    }
}
