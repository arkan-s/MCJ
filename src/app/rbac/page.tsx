
import Image from "next/image";
import { lusitana } from "@/components/ui/fonts";
import { auth } from "@/auth";


export default async function LandingPage() {
  const session = await auth();
  
  return (
    <div className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal flex flex-col justify-center items-center h-screen bg-blue-50 w-full`}>

      <Image src="/image/logo-icbp.png" alt="logo icbp" width={300} height={60} />
      <h2 className="mt-4 text-center">Selamat Datang <i>{session?.user.name || "Karyawan Indofood"}</i> di Sistem Informasi <strong><em>My Career Journey</em></strong></h2>
    </div>

  )
}
