import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(req: NextRequest, { params }: { params: { idQue: string } }) {
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

    const { idQue } = params;

    try {
        const data = await req.json();
        const { titleQue, Question, idAT } = data;

        const updatedQue = await prisma.questions.update({
            where: { idQuestion: idQue },
            data: {
                titleQue: titleQue,
                Question: Question,
                idAT: idAT,
            }
        });

        return NextResponse.json(updatedQue, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { idQue: string } }) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }
    if (session.user.role !== "hr") {
        return NextResponse.json({ error: "Forbidden", message: "Anda bukanlah seorang HR" }, { status: 403 });
    }

    const { idQue } = params;

    try {
        const deletedQuestion = await prisma.questions.delete({
            where: { idQuestion: idQue }
        });

        return NextResponse.json(deletedQuestion, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
    }
}