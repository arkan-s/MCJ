import { prisma } from "@/lib/prisma";

async function main() {
    let dataAvail ;

    // Seed data contoh untuk tabel cabang
    const Cabang = [ // atau personel area
        {"idBranch": "N001", "namaBranch": "ICBP-Noodle Head Office"},
        {"idBranch": "N002", "namaBranch": "ICBP-Noodle DKI"},
        {"idBranch": "N003", "namaBranch": "ICBP-Noodle Cibitung"},
        {"idBranch": "N004", "namaBranch": "ICBP-Noodle Tangerang"},
        {"idBranch": "N005", "namaBranch": "ICBP-Noodle Bandung"},
        {"idBranch": "N006", "namaBranch": "ICBP-Noodle Semarang"},
        {"idBranch": "N007", "namaBranch": "ICBP-Noodle Surabaya"},
        {"idBranch": "N008", "namaBranch": "ICBP-Noodle Medan"},
        {"idBranch": "N009", "namaBranch": "ICBP-Noodle Cirebon"},
        {"idBranch": "P001", "namaBranch": "ICBP-Noodle Pekanbaru"},
        {"idBranch": "P002", "namaBranch": "ICBP-Noodle Palembang"},
        {"idBranch": "P003", "namaBranch": "ICBP-Noodle Lampung"},
        {"idBranch": "P004", "namaBranch": "ICBP-Noodle Banjarmasin"},
        {"idBranch": "P005", "namaBranch": "ICBP-Noodle Pontianak"},
        {"idBranch": "P006", "namaBranch": "ICBP-Noodle Manado"},
        {"idBranch": "P007", "namaBranch": "ICBP-Noodle Makassar"},
        {"idBranch": "P008", "namaBranch": "ICBP-Noodle Jambi"},
        {"idBranch": "P009", "namaBranch": "ICBP-Noodle Tj. Api Api"},
    ]
    for (let i = 0; i < Cabang.length; i++) {
        await prisma.dataBranch.upsert(
            {
                where: { idBranch : Cabang[i]["idBranch"] },
                update: {},
                create: { idBranch : Cabang[i]["idBranch"], namaBranch : Cabang[i]["namaBranch"]},
            }
        )        
    }



    const Department = [ // atau pers subarea 
        {"idDepartment": "ADM-FA", "namaDepartment": "ADM Fin.& Acct."},
        {"idDepartment": "ADM-GM", "namaDepartment": "ADM Gen.Mgt"},
        {"idDepartment": "ADM-HR", "namaDepartment": "ADM HR"},
        {"idDepartment": "MFG-MFT", "namaDepartment": "MFG Manufactur"},
        {"idDepartment": "MFG-PPIC", "namaDepartment": "MFG PPIC"},
        {"idDepartment": "MFG-PROD", "namaDepartment": "MFG Production"},
        {"idDepartment": "MFG-PURC", "namaDepartment": "MFG Purchasing"},
        {"idDepartment": "MFG-TECH", "namaDepartment": "MFG Technical"},
        {"idDepartment": "MFG-WRH", "namaDepartment": "MFG Warehouse"},
        {"idDepartment": "MKT-MKT", "namaDepartment": "MKT Marketing"},
        {"idDepartment": "MKT-SD", "namaDepartment": "MKT Sales&Distr"},
        {"idDepartment": "RND-QCA", "namaDepartment": "R&D QC/QA"},
        {"idDepartment": "RND-RD", "namaDepartment": "R&D Resrch.Dev."},
    ]
    for (let i = 0; i < Department.length; i++) {
        await prisma.dataDepartment.upsert(
            {
                where: { idDepartment : Department[i]["idDepartment"] },
                update: {},
                create: { idDepartment : Department[i]["idDepartment"], namaDepartment : Department[i]["namaDepartment"]},
            }
        )        
    }
    
    const levelPosition = [
        {"idLevel": "opr", "namaLevel": "Operational"},
        {"idLevel": "staff", "namaLevel": "Staff"},
        {"idLevel": "spv", "namaLevel": "Supervisor"},
        {"idLevel": "mgr", "namaLevel": "Manager"},
    ]
    for (let i = 0; i < levelPosition.length; i++) {
        await prisma.dataLevel.upsert(
            {
                where: { idLevel : levelPosition[i]["idLevel"] },
                update: {},
                create: { idLevel : levelPosition[i]["idLevel"], namaLevel : levelPosition[i]["namaLevel"]},
            }
        )        
    }
    
    const Position = [
        {
         "idPosition": 1,
         "namaPosition": "A & P Admin",
         "personnelSubarea": "MKT-MKT"
        },
        {
         "idPosition": 2,
         "namaPosition": "A & P Coord",
         "personnelSubarea": "MKT-MKT"
        },
        {
         "idPosition": 3,
         "namaPosition": "A & P Spv",
         "personnelSubarea": "MKT-MKT"
        },
        {
         "idPosition": 4,
         "namaPosition": "A & P Staff",
         "personnelSubarea": "MKT-MKT"
        },
        {
         "idPosition": 5,
         "namaPosition": "Acct Spv",
         "personnelSubarea": "ADM-FA"
        },
        {
         "idPosition": 6,
         "namaPosition": "Acct Staff",
         "personnelSubarea": "ADM-FA"
        },
        {
         "idPosition": 7,
         "namaPosition": "Admin to ASPM",
         "personnelSubarea": "MKT-MKT"
        },
        {
         "idPosition": 8,
         "namaPosition": "Admin to BHRM",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 9,
         "namaPosition": "Admin to BPDQC Mgr",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 10,
         "namaPosition": "Admin to Fin & Acct Mgr",
         "personnelSubarea": "ADM-FA"
        },
        {
         "idPosition": 11,
         "namaPosition": "Admin to FM",
         "personnelSubarea": "MFG-PROD"
        },
        {
         "idPosition": 12,
         "namaPosition": "Admin to PM",
         "personnelSubarea": "MFG-PROD"
        },
        {
         "idPosition": 13,
         "namaPosition": "Admin to Whs Mgr",
         "personnelSubarea": "MFG-WRH"
        },
        {
         "idPosition": 14,
         "namaPosition": "Area Sales & Promotion Mgr, Act",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 15,
         "namaPosition": "Area Sales & Promotion Repr",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 16,
         "namaPosition": "Area Sales & Promotion Repr, Act",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 17,
         "namaPosition": "Area Sales & Promotion Spv",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 18,
         "namaPosition": "Area Sales & Promotion Spv, Act",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 19,
         "namaPosition": "Assistant BM Indomie",
         "personnelSubarea": "MKT-MKT"
        },
        {
         "idPosition": 20,
         "namaPosition": "Bag Noodle Dev Spv",
         "personnelSubarea": "RND-RD"
        },
        {
         "idPosition": 21,
         "namaPosition": "BPDQC Mgr, Act",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 22,
         "namaPosition": "BPDQC Spv",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 23,
         "namaPosition": "Branch HR Mgr, Act",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 24,
         "namaPosition": "Branch HR Officer",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 25,
         "namaPosition": "Budget & Controller Spv",
         "personnelSubarea": "ADM-FA"
        },
        {
         "idPosition": 26,
         "namaPosition": "Budget & Controller Spv, Act",
         "personnelSubarea": "ADM-FA"
        },
        {
         "idPosition": 27,
         "namaPosition": "Buyer",
         "personnelSubarea": "MFG-PURC"
        },
        {
         "idPosition": 28,
         "namaPosition": "Cashier",
         "personnelSubarea": "ADM-FA"
        },
        {
         "idPosition": 29,
         "namaPosition": "Category Management Specialist",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 30,
         "namaPosition": "Central Doc Control Spv",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 31,
         "namaPosition": "Chemical Analyst",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 32,
         "namaPosition": "Comben Assistant",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 33,
         "namaPosition": "Comben Spv",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 34,
         "namaPosition": "Comben Spv, Act",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 35,
         "namaPosition": "Comben Staff",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 36,
         "namaPosition": "Continous Improvement Spv",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 37,
         "namaPosition": "Coord Ingr. & Alkali",
         "personnelSubarea": "MFG-PROD"
        },
        {
         "idPosition": 38,
         "namaPosition": "Cost & Finance Spv",
         "personnelSubarea": "ADM-FA"
        },
        {
         "idPosition": 39,
         "namaPosition": "Cost Acct Spv",
         "personnelSubarea": "ADM-FA"
        },
        {
         "idPosition": 40,
         "namaPosition": "Cost Acct Staff",
         "personnelSubarea": "ADM-FA"
        },
        {
         "idPosition": 41,
         "namaPosition": "CQA & CQC Admin",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 42,
         "namaPosition": "Cup Noodle & RM Dev Spv",
         "personnelSubarea": "RND-RD"
        },
        {
         "idPosition": 43,
         "namaPosition": "Distribution Admin",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 44,
         "namaPosition": "Distribution Assistant",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 45,
         "namaPosition": "Distribution Officer",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 46,
         "namaPosition": "Distribution Officer, Act",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 47,
         "namaPosition": "Distribution Staff",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 48,
         "namaPosition": "Doc Controller Spv",
         "personnelSubarea": "ADM-GM"
        },
        {
         "idPosition": 49,
         "namaPosition": "Doc Controller Staff",
         "personnelSubarea": "ADM-GM"
        },
        {
         "idPosition": 50,
         "namaPosition": "Draft & Design Sect Spv",
         "personnelSubarea": "MFG-TECH"
        },
        {
         "idPosition": 51,
         "namaPosition": "Electrical Technical Spv",
         "personnelSubarea": "MFG-TECH"
        },
        {
         "idPosition": 52,
         "namaPosition": "Employee Service Staff",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 53,
         "namaPosition": "Fin & Acct Mgr, Act",
         "personnelSubarea": "ADM-FA"
        },
        {
         "idPosition": 54,
         "namaPosition": "Finance Spv",
         "personnelSubarea": "ADM-FA"
        },
        {
         "idPosition": 55,
         "namaPosition": "Finance Staff",
         "personnelSubarea": "ADM-FA"
        },
        {
         "idPosition": 56,
         "namaPosition": "Flavour Dev Technician",
         "personnelSubarea": "RND-RD"
        },
        {
         "idPosition": 57,
         "namaPosition": "Flavour Engineering & Dev Spv",
         "personnelSubarea": "RND-RD"
        },
        {
         "idPosition": 58,
         "namaPosition": "Food Services Spv",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 59,
         "namaPosition": "GAS Assistant",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 60,
         "namaPosition": "GAS Coord",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 61,
         "namaPosition": "GAS Spv",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 62,
         "namaPosition": "GAS Spv, Act",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 63,
         "namaPosition": "GAS Staff",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 64,
         "namaPosition": "General Acct Spv",
         "personnelSubarea": "ADM-FA"
        },
        {
         "idPosition": 65,
         "namaPosition": "General Acct Staff",
         "personnelSubarea": "ADM-FA"
        },
        {
         "idPosition": 66,
         "namaPosition": "Halal Coord & Customer Complain Spv",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 67,
         "namaPosition": "HCO EDP Spv",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 68,
         "namaPosition": "HCO Spv",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 69,
         "namaPosition": "HR Admin",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 70,
         "namaPosition": "HR Admin Spv",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 71,
         "namaPosition": "HR EDP Staff",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 72,
         "namaPosition": "HRIS & Comben Spv",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 73,
         "namaPosition": "HRIS Spv",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 74,
         "namaPosition": "Indomie Brand Admin",
         "personnelSubarea": "MKT-MKT"
        },
        {
         "idPosition": 75,
         "namaPosition": "Instrument Analyst",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 76,
         "namaPosition": "IR & PR Asst",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 77,
         "namaPosition": "IR & PR Spv",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 78,
         "namaPosition": "IR & PR Staff",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 79,
         "namaPosition": "IR Assistant",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 80,
         "namaPosition": "IR Spv",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 81,
         "namaPosition": "IR Staff",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 82,
         "namaPosition": "Key Account Spv",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 83,
         "namaPosition": "Key Account Spv E-Commerce",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 84,
         "namaPosition": "Key Account Spv Modern Food Service",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 85,
         "namaPosition": "Key Account Spv MTKA",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 86,
         "namaPosition": "Lab Chemistry Coordinator",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 87,
         "namaPosition": "Lab Microbiology Coordinator",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 88,
         "namaPosition": "Management EDP Spv",
         "personnelSubarea": "ADM-GM"
        },
        {
         "idPosition": 89,
         "namaPosition": "Management EDP Spv, Act",
         "personnelSubarea": "ADM-GM"
        },
        {
         "idPosition": 90,
         "namaPosition": "Management EDP Staff",
         "personnelSubarea": "ADM-GM"
        },
        {
         "idPosition": 91,
         "namaPosition": "Manpower Productivity Spv",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 92,
         "namaPosition": "Marketing Admin",
         "personnelSubarea": "MKT-MKT"
        },
        {
         "idPosition": 93,
         "namaPosition": "Marketing EDP Spv",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 94,
         "namaPosition": "Marketing EDP Spv",
         "personnelSubarea": "MKT-MKT"
        },
        {
         "idPosition": 95,
         "namaPosition": "Marketing EDP Spv, Act",
         "personnelSubarea": "MKT-MKT"
        },
        {
         "idPosition": 96,
         "namaPosition": "Marketing EDP Staff",
         "personnelSubarea": "MKT-MKT"
        },
        {
         "idPosition": 97,
         "namaPosition": "Microbiology Analyst",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 98,
         "namaPosition": "Modern Trade Promotion Analyst & Support",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 99,
         "namaPosition": "MT Acct",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 100,
         "namaPosition": "MT HR",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 101,
         "namaPosition": "MT MFG",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 102,
         "namaPosition": "MT PPIC",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 103,
         "namaPosition": "MT Sales",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 104,
         "namaPosition": "Nd Others, Shelf Life & Regulatory Staff",
         "personnelSubarea": "RND-RD"
        },
        {
         "idPosition": 105,
         "namaPosition": "NPL Project & Shelf Life Spv",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 106,
         "namaPosition": "OD & PD Staff",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 107,
         "namaPosition": "Operation Dev Spv",
         "personnelSubarea": "MFG-MFT"
        },
        {
         "idPosition": 108,
         "namaPosition": "Org Dev Spv",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 109,
         "namaPosition": "Org Dev Spv, Act",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 110,
         "namaPosition": "Org Dev Staff",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 111,
         "namaPosition": "Panel Dev Staff",
         "personnelSubarea": "RND-RD"
        },
        {
         "idPosition": 112,
         "namaPosition": "Panelis Dev Coordinator",
         "personnelSubarea": "RND-RD"
        },
        {
         "idPosition": 113,
         "namaPosition": "People Dev Staff",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 114,
         "namaPosition": "PPIC Assistant",
         "personnelSubarea": "MFG-PPIC"
        },
        {
         "idPosition": 115,
         "namaPosition": "PPIC RM Planning Assistant",
         "personnelSubarea": "MFG-PPIC"
        },
        {
         "idPosition": 116,
         "namaPosition": "PPIC RM Planning Staff",
         "personnelSubarea": "MFG-PPIC"
        },
        {
         "idPosition": 117,
         "namaPosition": "PPIC Spv",
         "personnelSubarea": "MFG-PPIC"
        },
        {
         "idPosition": 118,
         "namaPosition": "PPIC Spv, Act",
         "personnelSubarea": "MFG-PPIC"
        },
        {
         "idPosition": 119,
         "namaPosition": "PPIC Staff",
         "personnelSubarea": "MFG-PPIC"
        },
        {
         "idPosition": 120,
         "namaPosition": "PR Staff",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 121,
         "namaPosition": "Prod EPS Section Spv",
         "personnelSubarea": "MFG-PROD"
        },
        {
         "idPosition": 122,
         "namaPosition": "Prod EPS Spv",
         "personnelSubarea": "MFG-PROD"
        },
        {
         "idPosition": 123,
         "namaPosition": "Prod Section SILO",
         "personnelSubarea": "MFG-PROD"
        },
        {
         "idPosition": 124,
         "namaPosition": "Prod Section Spv",
         "personnelSubarea": "MFG-PROD"
        },
        {
         "idPosition": 125,
         "namaPosition": "Prod Section Spv, Act",
         "personnelSubarea": "MFG-PROD"
        },
        {
         "idPosition": 126,
         "namaPosition": "Prod Shift Spv",
         "personnelSubarea": "MFG-PROD"
        },
        {
         "idPosition": 127,
         "namaPosition": "Prod Shift Spv, Act",
         "personnelSubarea": "MFG-PROD"
        },
        {
         "idPosition": 128,
         "namaPosition": "Product Dev Technician",
         "personnelSubarea": "RND-RD"
        },
        {
         "idPosition": 129,
         "namaPosition": "Production Mgr, Act",
         "personnelSubarea": "MFG-PROD"
        },
        {
         "idPosition": 130,
         "namaPosition": "Production Spv",
         "personnelSubarea": "MFG-PROD"
        },
        {
         "idPosition": 131,
         "namaPosition": "Prototype Technician",
         "personnelSubarea": "RND-RD"
        },
        {
         "idPosition": 132,
         "namaPosition": "Proximat Analyst",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 133,
         "namaPosition": "Purchasing Admin",
         "personnelSubarea": "MFG-PURC"
        },
        {
         "idPosition": 134,
         "namaPosition": "Purchasing Assistant",
         "personnelSubarea": "MFG-PURC"
        },
        {
         "idPosition": 135,
         "namaPosition": "Purchasing Officer",
         "personnelSubarea": "MFG-PURC"
        },
        {
         "idPosition": 136,
         "namaPosition": "Purchasing Staff",
         "personnelSubarea": "MFG-PURC"
        },
        {
         "idPosition": 137,
         "namaPosition": "QC Auditor Spv",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 138,
         "namaPosition": "QC FG Section Spv",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 139,
         "namaPosition": "QC FG Section Spv, Act",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 140,
         "namaPosition": "QC PD Section Spv",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 141,
         "namaPosition": "QC PD Spv",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 142,
         "namaPosition": "QC Process Section Spv",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 143,
         "namaPosition": "QC Process Spv",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 144,
         "namaPosition": "QC Process Spv, Act",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 145,
         "namaPosition": "QC RM & FG Section Spv",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 146,
         "namaPosition": "QC RM & FG Spv",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 147,
         "namaPosition": "QC RM & FG Spv, Act",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 148,
         "namaPosition": "QC RM Section Spv",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 149,
         "namaPosition": "QC Section Spv",
         "personnelSubarea": "RND-QCA"
        },
        {
         "idPosition": 150,
         "namaPosition": "Sales EDP Spv",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 151,
         "namaPosition": "Sales Trainee",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 152,
         "namaPosition": "Sales Trainee - ASPR, Act",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 153,
         "namaPosition": "Sarimi Brand Admin",
         "personnelSubarea": "MKT-MKT"
        },
        {
         "idPosition": 154,
         "namaPosition": "Secretary to BM",
         "personnelSubarea": "ADM-GM"
        },
        {
         "idPosition": 155,
         "namaPosition": "Secretary to Div. Head",
         "personnelSubarea": "ADM-GM"
        },
        {
         "idPosition": 156,
         "namaPosition": "Secretary to GM",
         "personnelSubarea": "ADM-GM"
        },
        {
         "idPosition": 157,
         "namaPosition": "Secretary to GM Fin & Acct",
         "personnelSubarea": "ADM-FA"
        },
        {
         "idPosition": 158,
         "namaPosition": "Secretary to GM HR",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 159,
         "namaPosition": "Secretary to GM Marketing",
         "personnelSubarea": "MKT-MKT"
        },
        {
         "idPosition": 160,
         "namaPosition": "Secretary to GM Mfg",
         "personnelSubarea": "MFG-MFT"
        },
        {
         "idPosition": 161,
         "namaPosition": "Secretary to GM Sales",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 162,
         "namaPosition": "Section Whs Spare Part",
         "personnelSubarea": "MFG-TECH"
        },
        {
         "idPosition": 163,
         "namaPosition": "Security Chief",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 164,
         "namaPosition": "Security Grp Leader",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 165,
         "namaPosition": "SHE Assistant",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 166,
         "namaPosition": "SHE Spv",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 167,
         "namaPosition": "SHE Staff",
         "personnelSubarea": "ADM-HR"
        },
        {
         "idPosition": 168,
         "namaPosition": "System Analyst Spv",
         "personnelSubarea": "ADM-FA"
        },
        {
         "idPosition": 169,
         "namaPosition": "Targeted Flavour Dev Spv",
         "personnelSubarea": "RND-RD"
        },
        {
         "idPosition": 170,
         "namaPosition": "Targeted Flavour Dev Staff",
         "personnelSubarea": "RND-RD"
        },
        {
         "idPosition": 171,
         "namaPosition": "Tax & Acct Spv",
         "personnelSubarea": "ADM-FA"
        },
        {
         "idPosition": 172,
         "namaPosition": "Tax Officer",
         "personnelSubarea": "ADM-FA"
        },
        {
         "idPosition": 173,
         "namaPosition": "Tax Staff",
         "personnelSubarea": "ADM-FA"
        },
        {
         "idPosition": 174,
         "namaPosition": "Tech Building & General Sec",
         "personnelSubarea": "MFG-TECH"
        },
        {
         "idPosition": 175,
         "namaPosition": "Tech EPS Section Spv",
         "personnelSubarea": "MFG-TECH"
        },
        {
         "idPosition": 176,
         "namaPosition": "Tech PM Section Spv",
         "personnelSubarea": "MFG-TECH"
        },
        {
         "idPosition": 177,
         "namaPosition": "Tech Process Spv",
         "personnelSubarea": "MFG-TECH"
        },
        {
         "idPosition": 178,
         "namaPosition": "Tech Prod EPS Section Spv",
         "personnelSubarea": "MFG-TECH"
        },
        {
         "idPosition": 179,
         "namaPosition": "Tech Prod Section Spv",
         "personnelSubarea": "MFG-TECH"
        },
        {
         "idPosition": 180,
         "namaPosition": "Tech Prod Spv",
         "personnelSubarea": "MFG-TECH"
        },
        {
         "idPosition": 181,
         "namaPosition": "Tech Utility Section Spv",
         "personnelSubarea": "MFG-TECH"
        },
        {
         "idPosition": 182,
         "namaPosition": "Tech Utility Spv",
         "personnelSubarea": "MFG-TECH"
        },
        {
         "idPosition": 183,
         "namaPosition": "Tech Workshop Section",
         "personnelSubarea": "MFG-TECH"
        },
        {
         "idPosition": 184,
         "namaPosition": "Tech Workshop Section Spv",
         "personnelSubarea": "MFG-TECH"
        },
        {
         "idPosition": 185,
         "namaPosition": "Technical Mgr, Act",
         "personnelSubarea": "MFG-TECH"
        },
        {
         "idPosition": 186,
         "namaPosition": "Technical Spv",
         "personnelSubarea": "MFG-TECH"
        },
        {
         "idPosition": 187,
         "namaPosition": "Trade Marketing Spv GT",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 188,
         "namaPosition": "Trade Marketing Spv MTI",
         "personnelSubarea": "MKT-SD"
        },
        {
         "idPosition": 189,
         "namaPosition": "Warehouse FG Spv",
         "personnelSubarea": "MFG-WRH"
        },
        {
         "idPosition": 190,
         "namaPosition": "Warehouse Mgr, Act",
         "personnelSubarea": "MFG-WRH"
        },
        {
         "idPosition": 191,
         "namaPosition": "Warehouse Spv",
         "personnelSubarea": "MFG-WRH"
        },
        {
         "idPosition": 192,
         "namaPosition": "Whs FG Section Spv",
         "personnelSubarea": "MFG-WRH"
        },
        {
         "idPosition": 193,
         "namaPosition": "Whs FG Spv",
         "personnelSubarea": "MFG-WRH"
        },
        {
         "idPosition": 194,
         "namaPosition": "Whs RM Admin",
         "personnelSubarea": "MFG-WRH"
        },
        {
         "idPosition": 195,
         "namaPosition": "Whs RM Section Spv",
         "personnelSubarea": "MFG-WRH"
        },
        {
         "idPosition": 196,
         "namaPosition": "Whs RM Section Spv, Act",
         "personnelSubarea": "MFG-WRH"
        },
        {
         "idPosition": 197,
         "namaPosition": "Whs RM Spv",
         "personnelSubarea": "MFG-WRH"
        },
        {
         "idPosition": 198,
         "namaPosition": "Whs RM Spv, Act",
         "personnelSubarea": "MFG-WRH"
        },
        {
         "idPosition": 199,
         "namaPosition": "Whs SP & A&P Section Spv",
         "personnelSubarea": "MFG-WRH"
        },
        {
         "idPosition": 200,
         "namaPosition": "Whs SP Section Spv",
         "personnelSubarea": "MFG-WRH"
        },
        {
         "idPosition": 201,
         "namaPosition": "Workshop Supervisor",
         "personnelSubarea": "MFG-TECH"
        }
    ]
    for (let index = 0; index < Position.length; index++) {
        await prisma.dataPosition.upsert(
            {
                where: { 
                    idPosition : Position[index].idPosition
                },
                update: {
                    // idPosition: Position[index].idPosition,
                    namaPosition: Position[index].namaPosition,
                    dept: Position[index].personnelSubarea
                },
                create: { 
                    // idPosition: Position[index].idPosition,
                    namaPosition: Position[index].namaPosition,
                    dept: Position[index].personnelSubarea
                },
            }
        )
    }

console.log('Done seeding!');
}

main()
.catch((e) => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    return null;
});
