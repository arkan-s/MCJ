import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"
import { Prisma } from "@prisma/client";


export async function GET(req: NextRequest, {params}:{params:{nomorIndukKaryawan: string}}) {
    const session = await auth();
    const { nomorIndukKaryawan } = await params;
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }
    
    try{
        let datakaryawan = await prisma.dataKaryawan.findUnique({
            where: {
                nomorIndukKaryawan: nomorIndukKaryawan
            },
            include: {
                DataBranch: {
                    select: {
                        namaBranch: true,
                    },
                },
                DataLevel: {
                    select: {
                        namaLevel: true,
                    },
                },
                DataPosition: {
                    select: {
                        namaPosition: true,
                        DataDepartment: {
                            select:{
                                namaDepartment: true,
                            }
                        }
                    },
                },
                DataRiwayatKarir: true,
                DataRiwayatOrganisasiInternal: true,
                DataRiwayatProject: true,
                DataRiwayatKepanitiaan: true,
                DataRiwayatGKM: true,
                DataMentorWanted: true,
                DataTrainingWanted: true,
                DataCareerPlan: true
            },
        });
        return NextResponse.json(datakaryawan, { status: 200 });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return NextResponse.json({ error: `Prisma Error with code ${error.code}`, message: (error as any).message }, { status: 400 });
        } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
            console.error('Unknown Prisma error:', error.message);
            return NextResponse.json({ error: `Unknown Prisma error with message : ${error.message}`, message: (error as any).message }, { status: 500 });

        } else {
            return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
        }
    }
}