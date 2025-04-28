import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"
import { Prisma } from "@prisma/client";


export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Mohon login terlebih dahulu" }, { status: 401 });
    }
    if(session.user.role === "employee"){
        return NextResponse.json({error: "Forbidden", message: "Anda bukanlah seorang HR" }, { status : 403});
    }

    const { searchParams } = req.nextUrl;
    const findpersonnnelArea = searchParams.get("personnnelArea");
    const findpersonnelSubarea = searchParams.get("personnelSubarea");
    const filters = {
        personnelArea: session.user.role === "hr" ? 
                            session.user.branch === "N001" ?
                                findpersonnnelArea ?? undefined
                                : session.user.branch
                            : session.user.branch,
        personnelSubarea: session.user.role === "hr" ? 
                                findpersonnelSubarea ?? undefined
                                : session.user.dept,
    }
    
    try{
        let datakaryawan = await prisma.dataKaryawan.findMany({
            where: {
                personnelArea: filters.personnelArea,
                personnelSubarea: filters.personnelSubarea
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


// LIHAT ATURAN
// export async function POST(req: NextRequest) {
//     const session = await auth();

//     if (!session || !session.user) {
//         return NextResponse.json(
//             { error: "Unauthorized", message: "Anda belum login" },
//             { status: 401 }
//         );
//     }
    
//     if (session.user.role !== "hr") {
//         return NextResponse.json(
//             { error: "Forbidden", message: "Anda tidak memiliki akses terhadap api ini" },
//             { status: 403 }
//         );
//     }

//     if (!req.headers.get("content-type")?.includes("application/json")) {
//         return NextResponse.json(
//             { error: "Invalid Content-Type", message: "Gunakan 'application/json'" },
//             { status: 415 }
//         );
//     }

//     try {

//         const data = await req.json();
//         const dataMasuk = data.map(async (data: any)=>{
//             return {
//                 nomorIndukKaryawan: data.nomorIndukKaryawan as string,                         
//                 namaKaryawan: data.namaKaryawan as string,
//                 tanggalLahir: data.tanggalLahir as Date,
//                 tanggalMasukKerja: data.tanggalMasukKerja as Date,
//                 gender: data.gender as string,
//                 personnelArea: dbAligner.toIDBranch(String(data.personnelArea)),
//                 personnelSubarea: dbAligner.toIDDept(String(data.personnelSubarea)),
//                 position: await dbAligner.toIDName(String(data.position), String(data.personnelSubarea)),
//                 levelPosition: String(data.levelPosition),
//                 pend: String(data.pend),
//                 namaSekolah: String(data.namaSekolah),
//                 namaJurusan: String(data.namaJurusan),
//                 age: dayjs().diff(dayjs(data.tanggalLahir), "year", true),
//                 lengthOfService: dayjs().diff(dayjs(data.tanggalMasukKerja), "year", true),
//                 formFilled: 0,
//                 questionnaire: 0,
//                 createdAt: new Date(),
//             };
//         })
//         const newKaryawan = await prisma.dataKaryawan.createMany({
//             data: dataMasuk
//         })
//         return NextResponse.json(
//             {  
//                 data: newKaryawan,
//                 message: "User berhasil ditambahkan!" 
//             },
//             { status: 201 }
//         );
//     } catch (error) {
//         return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
//     }
// }

// export async function PUT(req: NextRequest) {
//     const session = await auth();

//     if (!session || !session.user) {
//         return NextResponse.json(
//             { error: "Unauthorized", message: "Anda belum login atau bukan seorang HR" },
//             { status: 401 }
//         );
//     }
//     if (session.user.role !== "hr") {
//         return NextResponse.json(
//             { error: "Forbidden", message: "Anda tidak memiliki akses" },
//             { status: 403 }
//         );
//     }

//     if (!req.headers.get("content-type")?.includes("application/json")) {
//         return NextResponse.json(
//             { error: "Invalid Content-Type", message: "Gunakan 'application/json'" },
//             { status: 415 }
//         );
//     }

//     const data = await req.json();
//     const dataKaryawan = data.map((data: any)=>{
//         return {
//             nomorIndukKaryawan: data.nomorIndukKaryawan as string,                         
//             namaKaryawan: data.namaKaryawan as string,
//             tanggalLahir: data.tanggalLahir as Date,
//             tanggalMasukKerja: data.tanggalMasukKerja as Date,
//             gender: data.gender as string,
//             personnelArea: dbAligner.toIDBranch(String(data.personnelArea)),
//             position: String(data.position),
//             personnelSubarea: dbAligner.toIDDept(String(data.personnelSubarea)),
//             levelPosition: String(data.levelPosition),
//             pend: String(data.pend),
//             namaSekolah: String(data.namaSekolah),
//             namaJurusan: String(data.namaJurusan),
//             age: dayjs().diff(dayjs(data.tanggalLahir), "year", true),
//             lengthOfService: dayjs().diff(dayjs(data.tanggalMasukKerja), "year", true)
//         };
//     })

//     const results = await Promise.allSettled(
//         dataKaryawan.map(async (karyawan: any) => {
//             try {
//             return await prisma.dataKaryawan.upsert({
//                 where: {
//                     nomorIndukKaryawan: karyawan.nomorIndukKaryawan
//                 },
//                 update: {
//                     ...karyawan
//                 },
//                 create: { 
//                     ...karyawan
//                 },
//             });
//             } catch (error) {
//             return { error: (error as any).message, nomorIndukKaryawan : karyawan.nomorIndukKaryawan };
//             }
//         })
//     );

//     const errors = results.filter(e=>e.status === "rejected");

// }

// export async function DELETE(req: Request) {
//     const session = await auth();
//     if (!session || !session.user) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     if (session.user.role !== "hr") {
//         return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     try {
//         if (!req.headers.get("content-type")?.includes("application/json")) {
//             return NextResponse.json(
//                 { error: "Invalid Content-Type", message: "Gunakan 'application/json'" },
//                 { status: 415 }
//             );
//         }

//         const data = await req.json();
//         const { nomorIndukKaryawan } = data;
//         await prisma.dataKaryawan.delete({
//             where: {
//                 nomorIndukKaryawan: nomorIndukKaryawan as string
//             }
//         })
//         return NextResponse.json(
//             { message: "User berhasil dihapus!" },
//             { status: 201 }
//         );
//     } catch (error) {
//         return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
//     }
// }