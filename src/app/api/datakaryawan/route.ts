import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"
import { Prisma } from "@prisma/client";
import * as dbAligner from "@/utils/dbAligner";
import dayjs from "dayjs";


export async function GET(req: Request) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }
    if(session.user.role !== "employee"){
        return NextResponse.json({error: "Forbidden", message: "Anda bukanlah seorang HR" }, { status : 403});
    }
    
    try{
        const url = new URL(req.url);
        const findpersonnnelArea = url.searchParams.get("personnnelArea");
        const findpersonnelSubarea = url.searchParams.get("personnelSubarea");
        const findposition = url.searchParams.get("position");
        const findlevelPosition = url.searchParams.get("levelPosition");
        let datakaryawan = await prisma.dataKaryawan.findMany({
            where: {
                personnelArea: findpersonnnelArea ?? undefined,
                personnelSubarea: findpersonnelSubarea ?? undefined,
                position: findposition ?? undefined,
                levelPosition: findlevelPosition ?? undefined
            }
        });
        return NextResponse.json(datakaryawan, { status: 200 });
    } catch (e) {
        if (e instanceof Prisma.PrismaClientUnknownRequestError) {
            console.error("Prisma Unknown Request Error:", e.message);
            return NextResponse.json({ error: e.name, message: e.message }, { status: 504 });
        } else {
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
        const newKaryawan = await prisma.dataKaryawan.create({
            data: {
                nomorIndukKaryawan: data.nomorIndukKaryawan as string,                         
                namaKaryawan: data.namaKaryawan as string,
                tanggalLahir: data.tanggalLahir as Date,
                tanggalMasukKerja: data.tanggalMasukKerja as Date,
                gender: data.gender as string,
                personnelArea: dbAligner.toIDBranch(String(data.personnelArea)),
                position: String(data.position),
                personnelSubarea: dbAligner.toIDDept(String(data.personnelSubarea)),
                levelPosition: String(data.levelPosition),
                pend: String(data.pend),
                namaSekolah: String(data.namaSekolah),
                namaJurusan: String(data.namaJurusan),
                age: dayjs().diff(dayjs(data.tanggalLahir), "year", true),
                lengthOfService: dayjs().diff(dayjs(data.tanggalMasukKerja), "year", true)
            }
        })
        return NextResponse.json(
            { message: "User berhasil ditambahkan!" },
            { status: 201 }
        );
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
        const { nomorIndukKaryawan, ...rest } = data;
        const updatedKaryawan = await prisma.dataKaryawan.update({
            where: {
                nomorIndukKaryawan: nomorIndukKaryawan as string
            },
            data: {
                ...rest,
                personnelArea: dbAligner.toIDBranch(String(data.personnelArea)),
                personnelSubarea: dbAligner.toIDDept(String(data.personnelSubarea)),
                levelPosition: String(data.levelPosition),
                age: dayjs().diff(dayjs(data.tanggalLahir), "year", true),
                lengthOfService: dayjs().diff(dayjs(data.tanggalMasukKerja), "year", true)
            }
        })
        return NextResponse.json(
            { ...updatedKaryawan,
                message: "User berhasil diubah!" },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "hr") {
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
        await prisma.dataKaryawan.delete({
            where: {
                nomorIndukKaryawan: nomorIndukKaryawan as string
            }
        })
        return NextResponse.json(
            { message: "User berhasil dihapus!" },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
    }
}