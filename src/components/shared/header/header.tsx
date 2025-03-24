import Image from "next/image"
import Link from "next/link"
import { Logo } from "@/components/ui/icon/iconST"
import { div } from "framer-motion/client"

export default function Header(){
    return (
        
        <Link
            className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-500 p-4 md:h-40"
            href="/">
            <div className="w-32 text-white grow md:w-40 flex items-center md:flex-col">
                <Image src="/image/logo-indomie.png" alt="My Career Journey - Noodle Division" width={200} height={85} className="hidden md:block"/>
                <Image src="/image/logo-indomie.png" alt="My Career Journey - Noodle Division" width={75} height={35} className="md:hidden block"/>
                <p className="flex-grow-1 whitespace-nowrap ms-2 md:ms-0">My Career Journey</p>
            </div>
        </Link>
        
    )
}

// export default function Header(){
//     return (
//         <header className="flex items-center p-0 shadow-md">
//             <div>
//                 <Logo img="/image/logo-indomie.png" alt=""/>
//                 <Logo img="/image/logo-popmie.png" alt=""/>
//                 <Logo img="/image/logo-icbp.png" alt=""/>
//                 <Logo img="/image/logo-intermi.png" alt=""/>
//                 <Logo img="/image/logo-mietelur.png" alt=""/>
//             </div>
//             <h3 className="mb-0 ml-3 text-l sm:text-xl font-semibold">My Career Journey</h3>
//         </header>
//     )
// }