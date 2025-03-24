import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { auth } from "@/auth"
import * as dbAligner from "@/utils/dbAligner"
import { generatePassword } from "@/utils/password";

export async function GET(req: Request) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Anda tidak terdaftar" }, { status: 401 });
    }
    if(session.user.role === "employee"){
        return NextResponse.json({ error: "Forbidden", message: "Anda bukanlah seorang HR" }, { status: 403 });
    }

    

    try{
        const { searchParams } = new URL(req.url);
        if(!searchParams){
            return NextResponse.json({ error: "Bad Request", message: "SearchParams tidak boleh kosong! harus berisi nik!" }, { status: 400 });
        }
        const nomorIndukKaryawan  = searchParams.get("nik");
        
        if(!nomorIndukKaryawan){
            return NextResponse.json({ error: "Bad Request", message: "Mohon berikan nik yang akan dicari!" }, { status: 400 });
        }

        const dataEmployee = await prisma.dataKaryawan.findUnique({
            where: {
                nomorIndukKaryawan: nomorIndukKaryawan
            },
            select:  {
                nomorIndukKaryawan: true,
                namaKaryawan: true,
                gender: true,
                personnelArea: true, // Cabang
                position: true,
                personnelSubarea: true, // Department
                levelPosition: true, // Level : "opt" | "staff" | "spv" 
            }
        })
        const dataUser =  await prisma.user.findUnique({
            where: {
                nomorIndukKaryawan: nomorIndukKaryawan
            },
            select:{
                nomorIndukKaryawan: true,
                role: true,
                password: true
            }
        })

        const merged_data = {
            ...dataEmployee,
            personnelArea: dataEmployee?.personnelArea ? dbAligner.toNameBranch(dataEmployee.personnelArea) : "Tidak ditemukan",
            personnelSubarea: dataEmployee?.personnelSubarea ? dbAligner.toNameDept(dataEmployee.personnelSubarea) : "Tidak ditemukan",
            ...dataUser
        };

        return NextResponse.json(merged_data, { status: 200 });
    }catch(error){
        return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
    }
}


export async function POST(req: Request){
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

    try {
        if (!req.headers.get("content-type")?.includes("application/json")) {
            return NextResponse.json(
                { error: "Invalid Content-Type", message: "Gunakan 'application/json'" },
                { status: 415 }
            );
        }

        const data = await req.json();
        
        const DBInput_DataKaryawan = {
            nomorIndukKaryawan: data.nomorIndukKaryawan as string,                         
            namaKaryawan: data.namaKaryawan as string,
            tanggalLahir: data.tanggalLahir as Date,
            tanggalMasukKerja: data.tanggalMasukKerja as Date,
            gender: data.gender as string,
            personnelArea: dbAligner.toIDBranch(String(data.personnelArea)),
            position: String(data.position),
            personnelSubarea: dbAligner.toIDDept(String(data.personnelSubarea)),
            levelPosition: String(data.levelPosition),
            pend: String(data.pend),
            namaSekolah: String(data.namaSekolah),
            namaJurusan: String(data.namaJurusan),
            age: dayjs().diff(dayjs(data.tanggalLahir), "year", true),
            lengthOfService: dayjs().diff(dayjs(data.tanggalMasukKerja), "year", true)
        }
        const DBInput_User = {
            nomorIndukKaryawan: String(data.nomorIndukKaryawan),
            password: generatePassword(String(data.nomorIndukKaryawan), data.tanggalLahir.split('T')[0]),
            role: "employee",
            isFirstLogin: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        try{
            const result = await prisma.$transaction([
                prisma.dataKaryawan.create({
                    data: DBInput_DataKaryawan,
                }),
                prisma.user.create({
                    data: DBInput_User,
                })
            ])

            console.log("Transaction completed...", result);
            return NextResponse.json(
                { message: "User berhasil ditambahkan!" },
                { status: 201 }
            );
        }catch(e){
            console.log("Transaction failed...", e);
            return NextResponse.json({ message: "Error uploading data", details: (e as any).message }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
    }
}