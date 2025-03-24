import NextAuth, { AuthError } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { comparePassword } from "@/utils/password";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma";
import authConfig from "./auth.config"


export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                nik: { label: "nik", type: "string"},
                password: { label: "password", type: "password"}
            },
            authorize: async (credentials) => {
                
                let user = null;
                if (!credentials) {
                    throw new Error("NIK atau Password tidak terinput!" );
                }
                
                                    
                // logic to verify if the user exists
                const { nik, password } = credentials as { nik: string; password: string };
                

                const userData = await prisma.user.findUnique({
                    where: { 
                        nomorIndukKaryawan: nik
                    },
                    select: {
                        nomorIndukKaryawan: true,
                        password: true,
                        role: true,
                        isFirstLogin: true
                    }
                });
                

                if (!userData) {
                    throw new Error("Data user tidak ditemukan.");
                }
                
                user = userData
                    ? {
                        nik: userData.nomorIndukKaryawan,
                        role: userData.role,
                        isFirstLogin: userData.isFirstLogin
                    }
                    : null;

                const confirmPassword = await comparePassword(password, userData.password);
                
                if(!confirmPassword){
                    throw new Error("Password salah");
                }
        
                // return user object with their profile data
                return user
            }
        })
    ]
})