'use server';
import { signInSchema } from "@/utils/zod";
import { signIn } from "../auth";
import { ZodError } from "zod";
import { AuthError } from "next-auth";

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


        await signIn("credentials", {nik, password, redirectTo:"/rbac"});
    } 
    catch (error: any){
        if(error instanceof ZodError){
            return {
                error: error.flatten().fieldErrors
            }
        }
        if (error instanceof AuthError){
            return {
                message: error.cause?.err?.message
            }
        }

        return {
            message: "NIK atau Password salah!"
        }


    } 
    
}