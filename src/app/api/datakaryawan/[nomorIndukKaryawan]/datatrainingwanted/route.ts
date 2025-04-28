import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest, { params }:{ params : { nomorIndukKaryawan : string } }) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { nomorIndukKaryawan } = await params;
    if(session.user.role === "employee" && session.user.nik !== nomorIndukKaryawan){
        return NextResponse.json({error: "Forbidden", message: "Mohon gunakan nomor induk karyawan anda sendiri" }, { status : 403});
    }
    
    try {
        const dataTrainingWanted = await prisma.dataTrainingWanted.findMany({
            where: {
                nomorIndukKaryawan: nomorIndukKaryawan
            }
        })
        if(!dataTrainingWanted.length){
            return NextResponse.json({error: "Data not found", message: "Data mungkin tak tersedia di database!" }, { status: 404 })
        }
        return NextResponse.json(dataTrainingWanted, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }:{ params : { nomorIndukKaryawan : string } }) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json(
            { error: "Unauthorized", message: "Anda belum login atau bukan seorang HR" },
            { status: 401 }
        );
    }
    if (session.user.role === "hd"){
        return NextResponse.json({error: "Unauthorized", message: "Anda tidak memiliki akses untuk melakukan task ini!"}, {status: 401})
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
        const data = await req.json();

        const dataTrainingWanted = await prisma.dataTrainingWanted.create({
            data: {
                nomorIndukKaryawan: nomorIndukKaryawan,
                topikTraining: data.topikTraining as string,
            }
        });

        return NextResponse.json(dataTrainingWanted, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
    }
}