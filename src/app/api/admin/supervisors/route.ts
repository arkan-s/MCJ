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
        const returnedData = await prisma.dataSupervisors.findMany(
            {
                include:{
                    DataLevel: true,
                    DataBranch:  true,
                    DataPosition: {
                        include: {
                            DataDepartment: true
                        }
                    }
                }
            }
        );

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
            return NextResponse.json({error: "unauthorized", message: `Hanya HR Head Office yang bisa mengupload data ini!`},{status: 401})
        }
        const DBInput_supervisors = await Promise.all(DBInput.map(async (e: any)=>{
            return {
                personnelArea: dbAligner.toIDBranch(String(e[2])),
                nomorIndukKaryawan: String(e[3]),            
                namaKaryawan: e[4],           
                position: (await dbAligner.toIDPos(String(e[5]), String(e[6]))) ?? 0,            
                personnelSubarea: dbAligner.toIDDept(String(e[6])),            
                levelPosition: String(e[7]).toLowerCase(),
                tanggalMasukKerja: convertDate(e[8]), 
                tanggalLahir: convertDate(e[9]),        
                gender: String(e[10]),                       
                age: dayjs().diff(dayjs(convertDate(e[9])), "year", true),                  
                tahunPensiun: dayjs(convertDate(e[9])).add(55, "year").toDate(),                                                
                lengthOfService: e[13]
            };
        }))
        const DBInput_jobvacancy = await Promise.all(DBInput.map(async (e: any)=>{
            return {
                personnelArea: dbAligner.toIDBranch(String(e[2])),
                personnelSubarea: dbAligner.toIDDept(String(e[6])),            
                position: (await dbAligner.toIDPos(String(e[5]), String(e[6]))) ?? 0,            
                levelPosition: String(e[7]).toLowerCase(),
                available: dayjs(convertDate(e[9])).add(55, "year").toDate(),                  
                JobSummary: "",                                                
                JobDescription: ""
            };
        }))
        try{
            const result = await prisma.$transaction([
                prisma.dataSupervisors.createMany({
                    data: DBInput_supervisors
                }),
                prisma.jobVacancy.createMany({
                    data: DBInput_jobvacancy
                })
            ])
            return NextResponse.json({ message: "Data uploaded successfully!" }, { status: 200});
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
    } catch(error){
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