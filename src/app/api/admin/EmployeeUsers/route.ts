import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { auth } from "@/auth";
import xlsx from "xlsx";
import { convertDate } from "@/utils/typeConvertion"
import * as dbAligner from "@/utils/dbAligner"
import { generatePassword } from "@/utils/password";
import { Prisma } from "@prisma/client";

export async function GET() {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized", message: "Anda tidak terdaftar" }, { status: 401 });
    }
    if(session.user.role !== "hr"){
        return NextResponse.json({ error: "Forbidden", message: "Anda bukanlah seorang HR" }, { status: 403 });
    }

    try {
        const usersWithEmployeeData = await prisma.user.findMany({
            where: {
                role: "employee",
                branch: session.user.branch !== "N001" ? session.user.branch : undefined,
            },
            include: {
                DataKaryawan: {
                include: {
                    DataBranch: true,
                    DataLevel: true,
                    DataPosition: {
                    include: {
                        DataDepartment: true,
                    }
                    },
                },
                },
            },
        });

        const returnedData = usersWithEmployeeData.map((e: any)=>{
            return {
                nomorIndukKaryawan: e.nomorIndukKaryawan,
                namaKaryawan: e.DataKaryawan.namaKaryawan,
                gender: e.DataKaryawan.gender,
                personnelArea: e.DataKaryawan.DataBranch.namaBranch,
                personnelSubarea: e.DataKaryawan.DataPosition.DataDepartment.namaDepartment,
                position: e.DataKaryawan.DataPosition.namaPosition,
                levelPosition: e.DataKaryawan.DataLevel.namaLevel,
                role: e.role,
                password: e.password
            }
        })

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

        return NextResponse.json(returnedData, { status: 200 });

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

export async function POST(req: NextRequest) { 
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
            return NextResponse.json({ error: "Error parsing form data", message: (error as any).message }, { status: 400 });
        }
        
        const file = formData.get("file") as File;
        if (!file) return NextResponse.json({ error: "File not found", message: "No file uploaded" }, { status: 400 });

        // File diubah ke bentuk arraBuffer kemudian dijadikan Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // // Buffer disimpan ke folder public untuk sementara
        // const filePath = path.join(process.cwd(), "public", "uploads", file.name);
        // await writeFile(filePath, buffer);

        // membaca buffer dengan library xlsx
        const workbook = xlsx.read(buffer, { type: "buffer" });


        const sheetName = workbook.SheetNames[0];
        const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, raw: true});
        const DBInput: any[] = jsonData.slice(1);

        if(session.user.branch !== "N001"){
            for (let index = 0; index < jsonData.length; index++) {
                const element = jsonData[index] as any[];
                if(element[2] !== session.user.branch){
                    return NextResponse.json({error: "unauthorized", message: `Silahkan mengupload data khusus untuk karyawan cabang anda, dalam data terdapat karyawan cabang lain dalam baris ${index+2} `},{status: 401})
                }
                
            }
        }

        const DBInput_User = DBInput.map((e: any)=> {
            return {
                nomorIndukKaryawan: String(e[3]),
                password: generatePassword(String(e[3]), convertDate(e[9]).toISOString().split('T')[0]),
                role: "employee",
                branch: dbAligner.toIDBranch(String(e[2])),
                dept: dbAligner.toIDDept(String(e[6])),
                name: String(e[4]),
                createdAt: new Date(),
            }
        })

        const DBInput_DataKaryawan = await Promise.all(DBInput.map(async (e: any)=>{
            return {                               
                nomorIndukKaryawan: String(e[3]),                         
                namaKaryawan: String(e[4]),                              
                tanggalLahir: convertDate(e[9]),
                tanggalMasukKerja: convertDate(e[8]),
                gender: String(e[10]),
                personnelArea: dbAligner.toIDBranch(String(e[2])),
                position: (await dbAligner.toIDPos(String(e[5]), String(e[6]))) ?? 0,
                personnelSubarea: dbAligner.toIDDept(String(e[6])),
                levelPosition: String(e[7]),              
                age: dayjs().diff(dayjs(convertDate(e[9])), "year", true),
                lengthOfService: dayjs().diff(dayjs(convertDate(e[8])), "year", true),               
                pend: String(e[13]),                               
                namaSekolah: String(e[14]),                              
                namaJurusan: String(e[15]),
                formFilled: 0,
                questionnaire: 0,
                createdAt: new Date(),
            };
        }))
        

        const DBInput_DataRiwayatKarir = await Promise.all(DBInput.map(async (e:any)=>{
            return {
                nomorIndukKaryawan: String(e[3]),                         
                position: (await dbAligner.toIDPos(String(e[5]), String(e[6]))) ?? 0,
                levelPosition: String(e[7]),              
                personnelArea: dbAligner.toIDBranch(String(e[2])),
                personnelSubarea: dbAligner.toIDDept(String(e[5])),
                status: 1
            }
        }))

        try{
            const result = await prisma.$transaction([
                prisma.user.createMany({
                    data: DBInput_User,
                }),
                prisma.dataKaryawan.createMany({
                    data: DBInput_DataKaryawan
                }),
                prisma.dataRiwayatKarir.createMany({
                    data: DBInput_DataRiwayatKarir,
                })
            ])

            console.log("Transaction completed...", result);
            return NextResponse.json({ message: "Data uploaded successfully!" }, { status: 200});
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