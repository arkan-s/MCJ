import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest, { params }: { params: { nomorIndukKaryawan: string } }) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }

    const { nomorIndukKaryawan } = await params;

    if (session.user.role === "employee" && session.user.nik !== nomorIndukKaryawan) {
        return NextResponse.json({ error: "Forbidden", message: "Mohon gunakan nomor induk karyawan anda sendiri" }, { status: 403 });
    }

    try {
        const dataCareerPlan = await prisma.dataCareerPlan.findUnique({
            where: { nomorIndukKaryawan: nomorIndukKaryawan },
        });

        if (!dataCareerPlan) {
            return NextResponse.json({ error: "Data not found", message: "Data career plan mungkin tak tersedia di database!" }, { status: 404 });
        }

        return NextResponse.json(dataCareerPlan, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Internal Server Error", message: (e as any).message }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { nomorIndukKaryawan: string } }) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }

    const { nomorIndukKaryawan } =await params;

    if (session.user.role === "employee" && session.user.nik !== nomorIndukKaryawan) {
        return NextResponse.json({ error: "Forbidden", message: "Mohon gunakan nomor induk karyawan anda sendiri" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { positionShortTerm, positionLongTerm } = body;

        const dataCareerPlan = await prisma.dataCareerPlan.upsert({
            where: { nomorIndukKaryawan: nomorIndukKaryawan },
            update: {
                positionShortTerm: positionShortTerm,
                positionLongTerm: positionLongTerm,
            },
            create: {
                nomorIndukKaryawan: nomorIndukKaryawan,
                positionShortTerm: positionShortTerm,
                positionLongTerm: positionLongTerm,
            },
        });

        return NextResponse.json(dataCareerPlan, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Internal Server Error", message: (e as any).message }, { status: 500 });
    }
}
