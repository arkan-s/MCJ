import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';


// GET: Fetch responses with optional filter by nomorIndukKaryawan
export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }


    try {
        const { searchParams } = new URL(req.url);
        const nomorIndukKaryawan = searchParams.get('nomorIndukKaryawan');
        const id_form = searchParams.get('id_form');
        const idDepartement = searchParams.get('idDepartement');
        const idBranch = searchParams.get('idBranch');

        const responses = await prisma.responses.findMany({
            where: {
                nomorIndukKaryawan: nomorIndukKaryawan === null ? undefined : nomorIndukKaryawan,
                id_form: id_form === null ? undefined : id_form,
                DataKaryawan: {
                    personnelArea: idBranch === null ? undefined : idBranch,
                    personnelSubarea: idDepartement === null ? undefined : idDepartement,
                }
            },
        });

        return NextResponse.json(responses, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 });
    }
}

// POST: Create a new response
export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { responses } = body;

        if (!responses|| !Array.isArray(responses) || responses.length === 0) {
            return NextResponse.json({ error: "Bad Request", message: "Data answers harus berupa array dan tidak boleh kosong" }, { status: 400 });
        }

        // Setiap object wajib punya: idResp, idQuestion, answer
        const createResult = await prisma.responses.createMany({
            data: responses.map((res: any) => ({
                id_form: res.id_form,
                nomorIndukKaryawan: res.nomorIndukKaryawan,
            })),
        });

        return NextResponse.json({ message: "Responses created", count: createResult.count }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create responses' }, { status: 500 });
    }
}

// PUT: Update an existing response
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { idResp, id_form, nomorIndukKaryawan } = body;

        const updatedResponse = await prisma.responses.update({
            where: { idResp },
            data: {
                id_form,
                nomorIndukKaryawan,
            },
        });

        return NextResponse.json(updatedResponse);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update response' }, { status: 500 });
    }
}

// DELETE: Delete a response by ID
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const idResp = searchParams.get('idResp');

        if (!idResp) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await prisma.responses.delete({
            where: { idResp },
        });

        return NextResponse.json({ message: 'Response deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete response' }, { status: 500 });
    }
}