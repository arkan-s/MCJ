'use client';

import Image from "next/image";
import { bitter } from "@/components/ui/fonts";
import { adminSignInAction } from "@/lib/signInAction";
import { useActionState, useEffect } from "react";


export default function login() {

    const [state, formAction] = useActionState(adminSignInAction, null);
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //     console.log("Cek sesuatu setiap 5 detik...");
    //     }, 5000); // 5000 ms = 5 detik
    
    //     return () => clearInterval(interval); // Bersihkan interval saat komponen unmount
    // }, []);
    
    return(
        <div className={`${bitter.className} block h-full flex justify-center items-center bg-blue-50`}>

            <div className="absolute top-10 flex justify-center items-center gap-2 shadow-lg p-3 rounded-full">
                <Image src="/image/logo-icbp.png" alt="logo icbp" width={100} height={20} />
                <Image src="/image/logo-indomie.png" alt="logo indomie" width={100} height={20} />
            </div>

            <form action={formAction} className="block flex flex-col gap-3 shadow-md p-3 mt-6 md:mt-0 md:w-[50%] bg-white rounded-lg bg-opacity-50">
                
                {state?.message ? (
                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100" role="alert">
                        <span className="font-medium">{state.message}</span>
                    </div>
                ): null}
                
                <div className="flex flex-col gap-1">
                    <label htmlFor="nik"><b>NIK</b></label>
                    <input
                        type="text"
                        id="nik"
                        name="nik"
                        placeholder="Masukkan NIK Anda"
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div aria-live="polite" aria-atomic="true">
                    <ul>
                        {state?.error?.nik?.map((err, index) => (
                            <li className="text-sm text-red-500 block" key={index}>{err}</li>
                        ))}
                    </ul>
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="password"><b>Password</b></label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Masukkan Password Anda"
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div aria-live="polite" aria-atomic="true">
                    <ul>
                    {state?.error?.password?.map((err, index) => (
                        <li className="text-sm text-red-500 block" key={index}>{err}</li>
                    ))}
                    </ul>
                </div>

                <div className="flex flex-col justify-center items-center">
                    <button type="submit" 
                        className="bg-blue-500 text-white text-lg font-semibold py-2 px-4 rounded-md w-full md:w-[65%] hover:bg-blue-700">
                        Log In
                    </button>
                    {/* <a className="text-xs mt-1 self-start md:self-center md:text-sm text-blue-600">Forget password?</a> */}
                </div>
            </form>
        </div>
    )
}