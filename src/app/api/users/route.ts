import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"
import { Prisma } from "@prisma/client";



export async function GET() {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if(session.user.role !== "hr"){
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        let usersData = await prisma.user.findMany(
            {
                select:  
                {
                    nomorIndukKaryawan: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true
                }
            }
        )
        return NextResponse.json(usersData, { status: 200 });
    } catch (e) {
        if (e instanceof Prisma.PrismaClientUnknownRequestError) {
            console.error("Prisma Unknown Request Error:", e.message);
            return NextResponse.json({ error: e.name, message: e.message }, { status: 504 });
        } else {
            console.error("Prisma Unknown Request Error:");
            return NextResponse.json({ error: "Internal Server Error", message: (e as any).message }, { status: 500 });
        }
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
    if (session.user.role !== "hr") {
        return NextResponse.json(
            { error: "Forbidden", message: "Anda tidak memiliki akses" },
            { status: 403 }
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
        const { nomorIndukKaryawan, password, role } = data;

        if (!nomorIndukKaryawan || !password || !role) {
            return NextResponse.json(
                { error: "Missing required fields", message: "nomorIndukKaryawan, password, dan role harus diisi" },
                { status: 400 }
            );
        }

        await prisma.user.create({
            data: {
                nomorIndukKaryawan: nomorIndukKaryawan as string,
                password: password as string,
                role: role as string,
                isFirstLogin: false,
            }
        });

        return NextResponse.json(
            { message: "User berhasil ditambahkan!" },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error", message: (error as any).message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request){
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if(session.user.role !== "hr"){
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        if (!req.headers.get("content-type")?.includes("application/json")) {
            return NextResponse.json(
                { error: "Invalid Content-Type", message: "Gunakan 'application/json'" },
                { status: 415 }
            );
        }

        const data = await req.json();
        const { nomorIndukKaryawan } = data;

        if (!nomorIndukKaryawan) {
            return NextResponse.json(
                { error: "Missing required fields", message: "nomorIndukKaryawan harus diisi" },
                { status: 400 }
            );
        }

        await prisma.user.delete({
            where: {
                nomorIndukKaryawan: nomorIndukKaryawan as string
            }
        });

        return NextResponse.json(
            { message: "User berhasil dihapus!" },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error", message: (error as any).message },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request){
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if(session.user.role !== "hr"){
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        if (!req.headers.get("content-type")?.includes("application/json")) {
            return NextResponse.json(
                { error: "Invalid Content-Type", message: "Gunakan 'application/json'" },
                { status: 415 }
            );
        }

        const data = await req.json();
        const { nomorIndukKaryawan, password, role } = data;

        if (!nomorIndukKaryawan || !password || !role) {
            return NextResponse.json(
                { error: "Missing required fields", message: "nomorIndukKaryawan, password, dan role harus diisi" },
                { status: 400 }
            );
        }

        await prisma.user.update({
            where: {
                nomorIndukKaryawan: nomorIndukKaryawan as string
            },
            data: {
                password: password as string,
                role: role as string
            }
        });

        return NextResponse.json(
            { message: "User berhasil diubah!" },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error", message: (error as any).message },
            { status: 500 }
        );
    }
}