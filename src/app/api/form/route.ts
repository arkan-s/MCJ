import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }

    if (!req.headers.get("content-type")?.includes("application/json")) {
        return NextResponse.json(
            { error: "Invalid Content-Type", message: "Gunakan 'application/json'" },
            { status: 415 }
        );
    }

    try {
        const data = await req.json();

        const result  = await prisma.$transaction(
            [
                prisma.dataRiwayatKarir.update({
                    where: { idCareerHistory: data.careerHistory[0].idCareerHistory },
                    data: {
                        position: data.careerHistory[0].position,
                        levelPosition: data.careerHistory[0].levelPosition,
                        personnelArea: data.careerHistory[0].personnelArea,
                        personnelSubarea: data.careerHistory[0].personnelSubarea,
                        tanggalMulai: data.careerHistory[0].tanggalMulai,
                        tanggalBerakhir: data.careerHistory[0].tanggalBerakhir,
                        status: data.careerHistory[0].status
                    },
                }),
                ...(data.careerHistory.length === 1 ? [] : 
                    data.careerHistory.slice(1).map((e: any)=>
                        prisma.dataRiwayatKarir.create({
                            data: {
                                position: e.position,
                                levelPosition: e.levelPosition,
                                personnelArea: e.personnelArea,
                                personnelSubarea: e.personnelSubarea,
                                tanggalMulai: e.tanggalMulai,
                                tanggalBerakhir: e.tanggalBerakhir,
                                status: e.status,
                                idCareerHistory: e.idCareerHistory,
                                nomorIndukKaryawan: session.user.nik,
                            },
                        })
                    )),
                ...(data.orgIntHistory.length !== 0 ? 
                    data.orgIntHistory.map((e: any) =>
                        prisma.dataRiwayatOrganisasiInternal.create({
                            data: {
                                idRiwayatOrganisasiInternal: e.id,
                                namaOrganisasi: e.name,
                                namaPosisi: e.jabatan,
                                tahunMulai: e.startYear,
                                tahunSelesai: e.endYear,
                                nomorIndukKaryawan: session.user.nik,
                            },
                        })
                    )
                    : []),
                ...(data.projectHistory.length !== 0 ? 
                    data.projectHistory.map((e: any) =>
                        prisma.dataRiwayatProject.create({
                            data: {
                                idRiwayatProject: e.id,
                                judulProject: e.name,
                                namaPosisi: e.peran,
                                lamaKolaborasi: e.year,
                                shortDesc: e.shortDesc,
                                nomorIndukKaryawan: session.user.nik,
                            },
                        })
                    )
                    : []),
                ...(data.comiteeHistory.length !== 0 ? 
                    data.comiteeHistory.map((e: any) =>
                        prisma.dataRiwayatKepanitiaan.create({
                            data: {
                                idRiwayatKepanitiaan: e.id,
                                namaAcara: e.name,
                                namaPosisi: e.jabatan,
                                tahunPelaksanaan: e.year,
                                nomorIndukKaryawan: session.user.nik,
                            },
                        })
                    )
                    : []),
                prisma.dataRiwayatGKM.create({
                    data: {
                        nomorIndukKaryawan: session.user.nik,
                        banyakKeikutsertaan: data.gkmHistory.amountOfTime,
                        posisiTertinggi: data.gkmHistory.highestPosition
                    }
                }),
                prisma.dataMentorWanted.create({
                    data: {
                        namaMentor: data.mentorWanted.name,
                        posisiMentor: data.mentorWanted.jabatan,
                        cabangMentor: data.mentorWanted.cabang,
                        nomorIndukKaryawan: session.user.nik
                    }
                }),
                ...(data.trainingWanted.length !== 0 ? 
                    data.trainingWanted.map((e: any) =>
                        prisma.dataTrainingWanted.create({
                            data: {
                                idTraining: e.id,
                                topikTraining: e.name,
                                nomorIndukKaryawan: session.user.nik,
                            },
                        })
                    )
                    : []),
                prisma.dataKaryawan.update({
                    where: {
                        nomorIndukKaryawan: session.user.nik
                    },
                    data: {
                        BestEmployee: data.bestEmployee
                    }
                }),
                prisma.empCareerChoice.create({
                    data: {
                        careerDevWill: data.empCareerChoice.careerDevWill,
                        rotationWill: data.empCareerChoice.rotationWill,
                        crossDeptWill: data.empCareerChoice.crossDeptWill,
                        nomorIndukKaryawan: session.user.nik
                    }
                }),
                prisma.dataCareerPlan.create({
                    data: {
                        nomorIndukKaryawan: session.user.nik,
                        positionShortTerm: data.careerOfMyChoice.short,
                        positionLongTerm: data.careerOfMyChoice.long
                    }
                })
            ]
        )

        return NextResponse.json(result, {status: 200});
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