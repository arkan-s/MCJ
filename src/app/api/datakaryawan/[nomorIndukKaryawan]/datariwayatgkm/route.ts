import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

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
        const dataGKM = await prisma.dataRiwayatGKM.findUnique({
            where: { nomorIndukKaryawan: nomorIndukKaryawan },
        });
        
        if (!dataGKM) {
            return NextResponse.json({ error: "Data not found", message: "Data karyawan mungkin tak tersedia di database!" }, { status: 404 });
        }

        return NextResponse.json(dataGKM, { status: 200 });
    } catch (e) {
        return NextResponse.json({ error: "Internal Server Error", message: (e as any).message }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { nomorIndukKaryawan: string } }) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }

    const { nomorIndukKaryawan } = await params;

    if (session.user.role === "employee" && session.user.nik !== nomorIndukKaryawan) {
        return NextResponse.json({ error: "Forbidden", message: "Mohon gunakan nomor induk karyawan anda sendiri" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { banyakKeikutsertaan, posisiTertinggi } = body;

        const dataRiwayatGKM = await prisma.dataRiwayatGKM.upsert({
            where: { nomorIndukKaryawan: nomorIndukKaryawan },
            update: {
                banyakKeikutsertaan: banyakKeikutsertaan,
                posisiTertinggi: posisiTertinggi,
            },
            create: {
                nomorIndukKaryawan: nomorIndukKaryawan,
                banyakKeikutsertaan: banyakKeikutsertaan,
                posisiTertinggi: posisiTertinggi,
            },
        });

        return NextResponse.json(dataRiwayatGKM, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Internal Server Error", message: (e as any).message }, { status: 500 });
    }
}