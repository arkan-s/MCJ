import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import * as bdAligner from "@/utils/dbAligner";


const prisma = new PrismaClient();

