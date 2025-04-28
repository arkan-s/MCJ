import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(req: NextRequest, { params } : { params : { idForm: string } }) {
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
    const { idForm } = params;

    try {
        const data = await req.json();
        const { titleForm, descForm } = data;

        const updatedForm = await prisma.forms.update({
            where: { idForm },
            data: {
                titleForm,
                descForm
            }
        });

        return NextResponse.json(updatedForm, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params } : { params : { idForm: string } }) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }
    if (session.user.role !== "hr") {
        return NextResponse.json({ error: "Forbidden", message: "Anda bukanlah seorang HR" }, { status: 403 });
    }
    const { idForm } = params;

    try {
        const deletedForm = await prisma.forms.delete({
            where: { idForm }
        });

        return NextResponse.json(deletedForm, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
    }
}