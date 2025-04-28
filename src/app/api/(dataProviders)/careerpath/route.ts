import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"
import { Prisma } from "@prisma/client";


export async function GET() {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
        let data;
        data = await prisma.careerPath.findMany({
            include:
            {
                startCareer: {
                    include: {
                        DataDepartment: true
                    }
                },
                desCareer: {
                    include: {
                        DataDepartment: true
                    }
                },
            }
        });
        const returnedData = data.map((e:any)=> { return {
            idCP: e.idCP,
            existing: e.existing,
            future: e.future,
            existingString: e.startCareer.namaPosition,
            futureString: e.desCareer.namaPosition,
            existingDept: e.startCareer.DataDepartment.namaDepartment,
            futureDept: e.desCareer.DataDepartment.namaDepartment
        }})
        return NextResponse.json(returnedData, { status: 200 });
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

export async function POST(req: NextRequest) { 
    
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Anda belum login atau bukan seorang HR" }, { status: 401 });
    }
    if(session.user.role !== "hr"){
        return NextResponse.json({ error: "Forbidden", message: "Anda belum login atau bukan seorang HR" }, { status: 403 });
    }
    if (!req.headers.get("content-type")?.includes("application/json")) {
        return NextResponse.json(
            { error: "Invalid Content-Type", message: "Gunakan 'application/json'" },
            { status: 415 }
        );
    }

    try {
        const data = await req.json();
        const result = await prisma.careerPath.create({
            data: data
        })

        return NextResponse.json(
            { 
                result: result,
                message: "Career path berhasil ditambahkan!" 
            },
            { status: 201 }
        );
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

export async function DELETE(req: NextRequest){
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Anda belum login atau bukan seorang HR" }, { status: 401 });
    }
    if(session.user.role !== "hr"){
        return NextResponse.json({ error: "Forbidden", message: "Anda belum login atau bukan seorang HR" }, { status: 403 });
    }
    const url = req.nextUrl;
    const idCP = url.searchParams.get("idRecord");
    if (!idCP) {
        return NextResponse.json({ error: "Bad Request", message: "ID Career Path tidak ditemukan" }, { status: 400 });
    }

    try {
        const result = await prisma.careerPath.delete({
            where: {
                idCP: idCP,
            } 
        })
        return NextResponse.json(
            { 
                result: result,
                message: "Career Path berhasil dihapus!" 
            },
            { status: 200 }
        );
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