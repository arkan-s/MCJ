import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { auth } from "@/auth"
import * as dbAligner from "@/utils/dbAligner"
import { generatePassword } from "@/utils/password";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest, {params}:{params:{nomorIndukKaryawan: string}}) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Anda tidak terdaftar" }, { status: 401 });
    }
    if(session.user.role !== "hr"){
        return NextResponse.json({ error: "Forbidden", message: "Anda bukanlah seorang HR" }, { status: 403 });
    }

    const { nomorIndukKaryawan } = params;

    try {
            const usersWithEmployeeData = await prisma.user.findFirstOrThrow({
                where: {
                    role: "employee",
                    nomorIndukKaryawan: nomorIndukKaryawan,
                },
                include: {
                    DataKaryawan: {
                    include: {
                        DataBranch: true,
                        DataLevel: true,
                        DataPosition: {
                        include: {
                            DataDepartment: true,
                        },
                        },
                    },
                    },
                },
            });
    
            // const plusFeatureMap = new Map(userData.map(ud => [ud.nomorIndukKaryawan, ud]));
    
            // const merged_data = await Promise.all(employeeData.map(async item => ({
            //     ...item,
            //     personnelArea: item?.personnelArea ? dbAligner.toNameBranch(item.personnelArea) : "Tidak ditemukan",
            //     personnelSubarea: item?.personnelSubarea ? dbAligner.toNameDept(item.personnelSubarea) : "Tidak ditemukan",
            //     position: item?.position ? await dbAligner.toNamePos(item.position) : "tidak ditemukan",
            //     ...plusFeatureMap.get(item.nomorIndukKaryawan) // Mengambil data dari Map (O(1))
            // })));
    
            // console.log(merged_data);
            // if (merged_data.length === 0) {
            //     return NextResponse.json({ error: "No Data", message: "Tidak ada data karyawan" }, { status: 404 });
            // }
    
            return NextResponse.json(usersWithEmployeeData, { status: 200 });
    
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


export async function POST(req: NextRequest, { params }:{params:{nomorIndukKaryawan: string}}){
    const session = await auth();
    
    if (!session || !session.user) {
        return NextResponse.json(
            { error: "Unauthorized", message: "Anda belum login" },
            { status: 401 }
        );
    }
    if (session.user.role !== "hr") {
        return NextResponse.json(
            { error: "Forbidden", message: "Anda tidak memiliki akses karena bukan seorang HR" },
            { status: 403 }
        );
    }

    if (!req.headers.get("content-type")?.includes("application/json")) {
        return NextResponse.json(
            { error: "Invalid Content-Type", message: "Gunakan 'application/json'" },
            { status: 415 }
        );
    }

    const data = await req.json();
    const { nomorIndukKaryawan } = await params;


    if(session.user.branch !== "N001"){
        if(session.user.branch !== String(data.personnelSubarea)){
            return NextResponse.json({error: "Unauthorized", message: "Anda hanya bisa menambahkan karyawan untuk cabang anda!"}, { status: 401})
        }
    }

    try {        
        const DBInput_DataKaryawan = {
            nomorIndukKaryawan: nomorIndukKaryawan as string,                         
            namaKaryawan: data.namaKaryawan as string,
            tanggalLahir: data.tanggalLahir as Date,
            tanggalMasukKerja: data.tanggalMasukKerja as Date,
            gender: data.gender as string,
            personnelArea: data.personnelArea,
            personnelSubarea: data.personnelSubarea,
            position: data.position,
            levelPosition: data.levelPosition,
            age: dayjs().diff(dayjs(data.tanggalLahir), "year", true),
            lengthOfService: dayjs().diff(dayjs(data.tanggalMasukKerja), "year", true),
            pend: String(data.pend),
            namaSekolah: String(data.namaSekolah),
            namaJurusan: String(data.namaJurusan),
            
            formFilled: 0,
            questionnaire: 0,
            createdAt: new Date()
        }
        const DBInput_User = {
            nomorIndukKaryawan: String(nomorIndukKaryawan),
            password: generatePassword(String(data.nomorIndukKaryawan), data.tanggalLahir.split('T')[0]),
            role: "employee",
            branch: data.personnelArea,
            dept: data.personnelSubarea,
            name: data.namaKaryawan as string,
            createdAt: new Date()
        }
        const DBInput_DataRiwayatKarir = {
            nomorIndukKaryawan: String(nomorIndukKaryawan),                         
            position: data.position,
            levelPosition: data.levelPosition,              
            personnelArea: data.personnelArea,
            personnelSubarea: data.personnelSubarea,
            status: 1
        }

        try{
            const result = await prisma.$transaction([
                prisma.user.create({
                    data: DBInput_User,
                }),
                prisma.dataKaryawan.create({
                    data: DBInput_DataKaryawan,
                }),
                prisma.dataRiwayatKarir.create({
                    data: DBInput_DataRiwayatKarir,
                })
            ])

            return NextResponse.json(
                { 
                    result: result,
                    message: "User berhasil ditambahkan!" 
                },
                { status: 201 }
            );
        }catch(e){
            console.log("Transaction failed...", e);
            throw e;
        }
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

export async function PUT(req: NextRequest, { params }:{params:{nomorIndukKaryawan: string}}){
    const session = await auth();
    
    if (!session || !session.user) {
        return NextResponse.json(
            { error: "Unauthorized", message: "Anda belum login" },
            { status: 401 }
        );
    }
    if (session.user.role !== "hr") {
        return NextResponse.json(
            { error: "Forbidden", message: "Anda tidak memiliki akses karena bukan seorang HR" },
            { status: 403 }
        );
    }

    if (!req.headers.get("content-type")?.includes("application/json")) {
        return NextResponse.json(
            { error: "Invalid Content-Type", message: "Gunakan 'application/json'" },
            { status: 415 }
        );
    }

    const data = await req.json();
    const { nomorIndukKaryawan } = params;

    if(session.user.branch !== "N001"){
        if(session.user.branch !== String(data.personnelSubarea)){
            return NextResponse.json({error: "Unauthorized", message: "Anda hanya bisa mengubah data karyawan untuk cabang anda!"}, { status: 401})
        }
    }

    const DBUpdate_User = {
        password: data.password,
        name: data.namaKaryawan as string,
        email: data.email ?? "",
        lastUpdateat: new Date(),
    }
    try{
        const result = await prisma.user.update({
                where: {
                    nomorIndukKaryawan: nomorIndukKaryawan
                },
                data: {
                    ...DBUpdate_User
                }
            })

        return NextResponse.json(
            { 
                result: result,
                message: "User berhasil ditambahkan!" 
            },
            { status: 201 }
        );
    }catch(e){
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return NextResponse.json({ error: `Prisma Error with code ${e.code}`, message: (e as any).message }, { status: 400 });
        } else if (e instanceof Prisma.PrismaClientUnknownRequestError) {
            console.error('Unknown Prisma error:', e.message);
            return NextResponse.json({ error: `Unknown Prisma error with message : ${e.message}`, message: (e as any).message }, { status: 500 });

        } else {
            return NextResponse.json({ error: "Internal Server Error", message: (e as any).message }, { status: 500 });
        }
    }
}

export async function DELETE(req: NextRequest, { params }:{params:{nomorIndukKaryawan: string}}){
    const session = await auth();
    
    if (!session || !session.user) {
        return NextResponse.json(
            { error: "Unauthorized", message: "Anda belum login" },
            { status: 401 }
        );
    }
    if (session.user.role !== "hr") {
        return NextResponse.json(
            { error: "Forbidden", message: "Anda tidak memiliki akses karena bukan seorang HR" },
            { status: 403 }
        );
    }
    
    const { nomorIndukKaryawan } = params;
    try {
        const toDeleteUser = await prisma.dataKaryawan.findUnique(
            {where:{nomorIndukKaryawan: nomorIndukKaryawan}}
        )
        if(!toDeleteUser){
            return NextResponse.json({error: "not found", message: "data karyawan tidak ditemukan"}, {status: 404});
        }
        if(session.user.branch !== "N001"){
            if(session.user.branch !== String(toDeleteUser.personnelSubarea)){
                return NextResponse.json({error: "Unauthorized", message: "Anda hanya bisa menghapus data karyawan untuk cabang anda!"}, { status: 401})
            }
        }
        try {
            const result = await prisma.$transaction([
                prisma.dataKaryawan.delete({
                    where: {
                        nomorIndukKaryawan: toDeleteUser.nomorIndukKaryawan,
                    } 
                }),
                prisma.user.delete({
                    where: {
                        nomorIndukKaryawan: toDeleteUser.nomorIndukKaryawan,
                    } 
                })
            ])

            return NextResponse.json(
                { 
                    result: result,
                    message: "User berhasil dihapus!" 
                },
                { status: 201 }
            );
        } catch (error) {
            throw error;
        }
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