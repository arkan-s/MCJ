import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(req: NextRequest, { params }:{ params : { nomorIndukKaryawan : string, idDelete : string } }) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role === "hd"){
        return NextResponse.json({ error: "Forbidden", message: "Anda tidak memiliki akses" }, { status: 403 });
    }

    const { nomorIndukKaryawan, idDelete } = await params;

    if(session.user.role === "employee" && session.user.nik !== nomorIndukKaryawan){
        return NextResponse.json({ error: "Forbidden", message: "Anda bukan pemilik data" }, { status: 403 });
    }

    try {
        const deletedData = await prisma.dataTrainingWanted.delete({
            where: {
                idTraining: idDelete,
            },
            select: {
                idTraining: true
            }
        });

        return NextResponse.json({ data : deletedData , message: "Data berhasil dihapus!" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
    }
}
