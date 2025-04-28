import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';


export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }


    // Check if the user has the required role
    if (!session.user.role || session.user.role === "employee") {
        return NextResponse.json({ error: "Unauthorized", message: "You do not have permission to access this resource" }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const idAssess = searchParams.get('idAssess');
        const idQuestion = searchParams.get('idQuestion'); 

        const answers = await prisma.answers.findMany({
            where: {
                idAssess: idAssess === null ? undefined : idAssess,
                idQuestion: idQuestion === null ? undefined : idQuestion, 
            }
        });

        return NextResponse.json(answers, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch answers' }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { answers } = body;

        if (!answers || !Array.isArray(answers) || answers.length === 0) {
            return NextResponse.json({ error: "Bad Request", message: "Data answers harus berupa array dan tidak boleh kosong" }, { status: 400 });
        }

        const createResult = await prisma.answers.createMany({
            data: answers.map((ans: any) => ({
                idResp: ans.idResp,
                idAssess: ans.idAssess,
                idQuestion: ans.idQuestion,
                answer: ans.answer,
            })),
        });

        return NextResponse.json({ message: "Answers created", count: createResult.count }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create answers' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('idResp');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await prisma.answers.delete({
            where: { idAnswer : id },
        });

        return NextResponse.json({ message: 'Response deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete response' }, { status: 500 });
    }
}