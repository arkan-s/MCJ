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
        const dataCareerChoice = await prisma.empCareerChoice.findUnique({
            where: { nomorIndukKaryawan },
        });

        if (!dataCareerChoice) {
            return NextResponse.json({ error: "Data not found", message: "Data karyawan mungkin tak tersedia di database!" }, { status: 404 });
        }

        return NextResponse.json(dataCareerChoice, { status: 200 });
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

    const { nomorIndukKaryawan } = await params;

    if (session.user.role === "employee" && session.user.nik !== nomorIndukKaryawan) {
        return NextResponse.json({ error: "Forbidden", message: "Mohon gunakan nomor induk karyawan anda sendiri" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { careerDevWill, rotationWill, crossDeptWill } = body;

        const dataCareerChoice = await prisma.empCareerChoice.upsert({
            where: { nomorIndukKaryawan },
            update: {
                careerDevWill,
                rotationWill,
                crossDeptWill,
            },
            create: {
                nomorIndukKaryawan,
                careerDevWill,
                rotationWill,
                crossDeptWill,
            },
        });

        return NextResponse.json(dataCareerChoice, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Internal Server Error", message: (e as any).message }, { status: 500 });
    }
}
