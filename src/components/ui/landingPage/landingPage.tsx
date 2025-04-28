'use client'
import Image from "next/image"
import { lusitana } from "@/components/ui/fonts"
import { AnimatePresence, motion } from "framer-motion"

export default function LandingPageComp() {
return (
    <div className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal flex flex-col justify-center items-center h-screen bg-blue-50 w-full`}>

        <Image src="/image/logo-icbp.png" alt="logo icbp" width={300} height={60} />
        <h2 className="mt-4 text-center">Selamat Datang di Sistem Informasi <strong><em>My Career Journey</em></strong></h2>
        <AnimatePresence>
            <motion.a href="/login" 
                className="mt-5 w-2/5 flex justify-center items-center rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white hover:opacity-[90%] active:bg-blue-400 md:text-base"
                whileTap={{ scale: 0.55 }} 
                animate={{ scale: 1 }} 
                transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                <p>Enter</p>
                <svg width="40px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none" className="block ms-1">
                    <path stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M2 10h16m0 0l-7-7m7 7l-7 7"/>
                </svg>
            </motion.a>
        </AnimatePresence>
    </div>

)
}
