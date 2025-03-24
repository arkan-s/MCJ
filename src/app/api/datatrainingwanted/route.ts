import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
        if (session.user.role === "employee") {
            let dataTrainingWanted;
            dataTrainingWanted = await prisma.dataTrainingWanted.findMany({
                where: {
                    nomorIndukKaryawan: session.user.nik
                }
            });
            return NextResponse.json(dataTrainingWanted, { status: 200 });
        } else { 
            const { searchParams } = new URL(req.url);
            if(!searchParams){
                return NextResponse.json({ error: "Bad Request", message: "SearchParams tidak boleh kosong! harus berisi nik!" }, { status: 400 });
            }
            const nik = searchParams.get("nik");

            const dataTrainingWanted = await prisma.dataTrainingWanted.findMany({
                where: {
                    nomorIndukKaryawan: String(nik)
                }
            })
            return NextResponse.json(dataTrainingWanted, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
    }
}

export async function POST(req: Request) {
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

        const dataTrainingWanted = await prisma.dataTrainingWanted.create({
            data: {
                nomorIndukKaryawan: data.nomorIndukKaryawan as string,
                topikTraining: data.topikTraining as string,
            }
        });

        return NextResponse.json(dataTrainingWanted, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
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

        const data = await req.json();

        if(session.user.role === "employee" && session.user.nik !== data.nomorIndukKaryawan){
            return NextResponse.json({ error: "Forbidden", message: "Anda bukan pemilik data" }, { status: 403 });
        }else if(session.user.role === "hd"){
            return NextResponse.json({ error: "Forbidden", message: "Anda tidak memiliki akses" }, { status: 403 });
        }

        const dataTrainingWanted = await prisma.dataTrainingWanted.update({
            where: {
                idTraining: data.idTraining as string
            },
            data: {
                topikTraining: data.topikTraining as string,
            }
        });

        return NextResponse.json(dataTrainingWanted, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        if (!req.headers.get("content-type")?.includes("application/json")) {
            return NextResponse.json(
                { error: "Invalid Content-Type", message: "Gunakan 'application/json'" },
                { status: 415 }
            );
        }

        const data = await req.json();

        if(session.user.role === "employee" && session.user.nik !== data.nomorIndukKaryawan){
            return NextResponse.json({ error: "Forbidden", message: "Anda bukan pemilik data" }, { status: 403 });
        }else if(session.user.role === "hd"){
            return NextResponse.json({ error: "Forbidden", message: "Anda tidak memiliki akses" }, { status: 403 });
        }

        await prisma.dataTrainingWanted.delete({
            where: {
                idTraining: data.idTraining as string,
            }
        });

        return NextResponse.json({ message: "Data berhasil dihapus!" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
    }
}
