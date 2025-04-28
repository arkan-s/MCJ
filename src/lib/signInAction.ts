'use server';
import { signInSchema } from "@/utils/zod";
import { signIn } from "@/auth";
import { ZodError } from "zod";
import { AuthError } from "next-auth";
import * as hrhd from "@/utils/hrhdFunction"

export async function signInAction(prevState: unknown, formData: FormData){
    try {        
        const validationFields = signInSchema.safeParse(
            Object.fromEntries(formData.entries())
        );
        
        if(!validationFields.success){
            return {
                error: validationFields.error.flatten().fieldErrors,
            };
        }

        const { nik, password } = validationFields.data;

        console.log("ISI DARI RESPONSE : ");
        const response = await signIn("credentials", { nik, password, redirectTo: "/rbac" });
        console.log("ISI DARI RESPONSE : ", response);
    } 
    catch (error: any){
        if(error instanceof ZodError){
            return {
                error: error.flatten().fieldErrors
            }
        }
        if (error instanceof AuthError){
            switch (error.type) {
                case "CredentialsSignin":
                    return { message: "NIK atau Password salah!" };
            
                default:
                    return { message: "Internal server error!" };
            }
        }
        
        throw error;
    } 
    
}

export async function adminSignInAction(prevState: unknown, formData: FormData){
    try {        
        const validationFields = signInSchema.safeParse(
            Object.fromEntries(formData.entries())
        );
        
        if(!validationFields.success){
            return {
                error: validationFields.error.flatten().fieldErrors,
            };
        }

        const { nik, password } = validationFields.data;

        console.log("ISI DARI RESPONSE : ");
        const response = await signIn("credentials", { nik: hrhd.nikGenerate(nik), password, redirectTo: "/rbac" });
        console.log("ISI DARI RESPONSE : ", response);
    } 
    catch (error: any){
        if(error instanceof ZodError){
            return {
                error: error.flatten().fieldErrors
            }
        }
        if (error instanceof AuthError){
            switch (error.type) {
                case "CredentialsSignin":
                    return { message: "NIK atau Password salah!" };
            
                default:
                    return { message: "Internal server error!" };
            }
        }
        
        throw error;
    } 
    
}