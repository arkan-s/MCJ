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


