import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: User & DefaultSession["user"];
    }
    interface User {
        nik: string;
        role: string;
        branch: string;
        dept: string;
        name: string;
        email: string?;
        formFilled: number;
        questionnaire: number;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        sub: string;
        nik: string;
        role: string;
        branch: string;
        dept: string;
        name: string;
        email: string?;
        formFilled: number;
        questionnaire: number;
    }
}