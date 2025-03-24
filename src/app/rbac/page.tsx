
import Image from "next/image"
import { lusitana } from "@/components/ui/fonts"

export default function LandingPage() {
  return (
    <div className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal flex flex-col justify-center items-center h-screen bg-blue-50 w-full`}>

      <Image src="/image/logo-icbp.png" alt="logo icbp" width={300} height={60} />
      <h2 className="mt-4 text-center">Selamat Datang di Sistem Informasi <strong><em>My Career Journey</em></strong></h2>
    </div>

  )
}
