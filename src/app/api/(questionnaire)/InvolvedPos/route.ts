import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }
    if (session.user.role !== "hr") {
        return NextResponse.json({ error: "Forbidden", message: "Anda bukanlah seorang HR" }, { status: 403 });
    }

    try {
        const involvedPos = await prisma.involvedPosition.findMany({});
        return NextResponse.json(involvedPos, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }
    if (session.user.role !== "hr") {
        return NextResponse.json({ error: "Forbidden", message: "Anda bukanlah seorang HR" }, { status: 403 });
    }
    if (!req.headers.get("content-type")?.includes("application/json")) {
        return NextResponse.json(
            { error: "Invalid Content-Type", message: "Gunakan 'application/json'" },
            { status: 415 }
        );
    }

    try {
        const data = await req.json();
        const { idAssessmentType, idPosition } = data;

        const createdInvolvedPos = await prisma.involvedPosition.create({
            data: {
                idAssessmentType: idAssessmentType,
                idPosition: idPosition,
            }
        });

        return NextResponse.json(createdInvolvedPos, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
    }
}
