import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest, { params } : { params : { personnelsubarea: string, pos: string } }) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }

    const { personnelsubarea, pos } = await params;

    try {
        const Questionnaires = await prisma.forms.findMany({
            where: {
                InvolvedDept: {
                    some: {
                        idDepartement: personnelsubarea
                    }
                }
            },
            include:{
                AssessmentType: {
                    where: {
                        InvolvedPosition: {
                            some: {
                                idPosition: parseInt(pos)
                            }
                        }
                    },
                    include: {
                        Questions: {
                            
                        }
                    }
                }
            }
        })
        return NextResponse.json(Questionnaires, { status: 200 });
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