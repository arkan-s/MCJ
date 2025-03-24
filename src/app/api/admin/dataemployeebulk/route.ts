import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { auth } from "@/auth"
import path from "path";
import { writeFile } from "fs/promises";
import xlsx from "xlsx";
import { convertDate } from "@/utils/typeConvertion"
import * as dbAligner from "@/utils/dbAligner"
import { generatePassword } from "@/utils/password";

export async function GET() {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Anda tidak terdaftar" }, { status: 401 });
    }
    if(session.user.role === "employee"){
        return NextResponse.json({ error: "Forbidden", message: "Anda bukanlah seorang HR" }, { status: 403 });
    }

    try {
        
        let employeeData = await prisma.dataKaryawan.findMany(
            {
                select:  {
                    nomorIndukKaryawan: true,
                    namaKaryawan: true,
                    gender: true,
                    personnelArea: true, // Cabang
                    position: true,
                    personnelSubarea: true, // Department
                    levelPosition: true, // Level : "opt" | "staff" | "spv" 
                }
            }
        )

        let userData = await prisma.user.findMany({
            select:{
                nomorIndukKaryawan: true,
                role: true,
                password: true
            },where:{
                role: "employee",
            }
        })

        const plusFeatureMap = new Map(userData.map(ud => [ud.nomorIndukKaryawan, ud]));

        const merged_data = employeeData.map(item => ({
            ...item,
            personnelArea: item?.personnelArea ? dbAligner.toNameBranch(item.personnelArea) : "Tidak ditemukan",
            personnelSubarea: item?.personnelSubarea ? dbAligner.toNameDept(item.personnelSubarea) : "Tidak ditemukan",
            ...plusFeatureMap.get(item.nomorIndukKaryawan) // Mengambil data dari Map (O(1))
        }));

        console.log(merged_data);
        if (merged_data.length === 0) {
            return NextResponse.json({ error: "No Data", message: "Tidak ada data karyawan" }, { status: 404 });
        }

        return NextResponse.json(merged_data, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", message: (error as any).message }, { status: 500 });
    }
}

export async function POST(req: Request) { 
    // 1900-01-01 is 1.0
    // 1901-01-01 is 367.0, +366 days (Excel incorrectly treats 1900 as a leap year)
    // 1902-01-01 is 732.0, +365 days (as expected)
    
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Anda belum login atau bukan seorang HR" }, { status: 401 });
    }
    if(session.user.role !== "hr"){
        return NextResponse.json({ error: "Forbidden", message: "Anda belum login atau bukan seorang HR" }, { status: 403 });
    }
    try {
        let formData;
        try{
            formData = await req.formData();
        }catch(error){
            return NextResponse.json({ message: "Error parsing form data", details: (error as any).message }, { status: 400 });
        }
        
        const file = formData.get("file") as File;
        if (!file) return NextResponse.json({ message: "No file uploaded" }, { status: 400 });

        // File diubah ke bentuk arraBuffer kemudian dijadikan Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Buffer disimpan ke folder public untuk sementara
        const filePath = path.join(process.cwd(), "public", "uploads", file.name);
        await writeFile(filePath, buffer);

        // membaca buffer dengan library xlsx
        const workbook = xlsx.read(buffer, { type: "buffer" });


        const sheetName = workbook.SheetNames[0];
        const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, raw: true});
        const DBInput = jsonData.slice(1);

        const DBInput_User = DBInput.map((e: any)=> {
            return {
                nomorIndukKaryawan: String(e[3]),
                password: generatePassword(String(e[3]), convertDate(e[9]).toISOString().split('T')[0]),
                role: "employee",
                isFirstLogin: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })

        const DBInput_DataKaryawan = DBInput.map((e: any)=>{
            return {                               
                nomorIndukKaryawan: String(e[3]),                         
                namaKaryawan: String(e[4]),                              
                tanggalLahir: convertDate(e[9]),
                tanggalMasukKerja: convertDate(e[8]),
                gender: String(e[10]),
                personnelArea: dbAligner.toIDBranch(String(e[2])),
                position: String(e[5]),
                personnelSubarea: dbAligner.toIDDept(String(e[6])),
                levelPosition: String(e[7]),              
                age: dayjs().diff(dayjs(convertDate(e[9])), "year", true),
                lengthOfService: dayjs().diff(dayjs(convertDate(e[8])), "year", true),               
                pend: String(e[13]),                               
                namaSekolah: String(e[14]),                              
                namaJurusan: String(e[15])
            };
        })
        

        const DBInput_DataRiwayatKarir = DBInput.map((e:any)=>{
            return {
                nomorIndukKaryawan: String(e[3]),                         
                position: String(e[5]),
                levelPosition: String(e[7]),              
                personnelArea: dbAligner.toIDBranch(String(e[2])),
                personnelSubarea: dbAligner.toIDDept(String(e[5])),
                status: 1
            }
        })

        try{
            const result = await prisma.$transaction([
                prisma.dataKaryawan.createMany({
                    data: DBInput_DataKaryawan,
                }),
                prisma.user.createMany({
                    data: DBInput_User,
                }),
                prisma.dataRiwayatKarir.createMany({
                    data: DBInput_DataRiwayatKarir,
                })
            ])

            console.log("Transaction completed...", result);
            return NextResponse.json({ message: "Data uploaded successfully!" }, { status: 200});
        }catch(e){
            console.log("Transaction failed...", e);
            return NextResponse.json({ message: "Error uploading data", details: (e as any).message }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({
            message: "Error occured...",
            details: (error as any).message
        },{
            status: 500
        })
    }
}