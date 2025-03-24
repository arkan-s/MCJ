import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"
import { Prisma } from "@prisma/client";


export async function GET(req: NextRequest, { params }: { params: { nomorIndukKaryawan: string } }) {
    const { nomorIndukKaryawan } = await params;
    
    const session = await auth()
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Anda tidak terdaftar" }, { status: 401 });
    }
    if(session.user.role === "employee"){
        if(nomorIndukKaryawan !== session.user.nik){
            return NextResponse.json({ error: "Forbidden", message: "Anda bukanlah seorang HR" }, { status: 403 });
        }
    }

    try{
        const datakaryawan = await prisma.dataKaryawan.findUnique({
            where: { nomorIndukKaryawan: nomorIndukKaryawan}
        });
        return NextResponse.json(datakaryawan, { status: 200 });
    } catch (e) {
        if (e instanceof Prisma.PrismaClientUnknownRequestError) {
            console.error("Prisma Unknown Request Error:", e.message);
            return NextResponse.json({ error: e.name, message: e.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: "Internal Server Error", message: (e as any).message }, { status: 500 });
        }
    }
}