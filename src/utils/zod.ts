import { object, string } from "zod"

const regexNIK = /^\d+$/

export const signInSchema = object({
    nik: string({ required_error: "nik is required" })
        .min(4, "nik harus terdiri dari setidaknya 4 karakter")
        .max(10, "nik tidak boleh lebih dari 10 karakter")
        .refine((val) => regexNIK.test(val), { message: "NIK harus terdiri dari angka" })
    ,
    password: string({ required_error: "Password is required" })
        .min(1, "Password tidak boleh kosong.")
    
})