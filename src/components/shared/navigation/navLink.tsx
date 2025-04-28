'use client';
import { useEffect, useRef } from "react";

export default function Nav_Links({
  navFeature,
  mobileNavToggle,
  handleOnClick
}: {
  navFeature: { id: string; Section: string; href: string }[];
  mobileNavToggle: boolean;
  handleOnClick: (ind: boolean) => void;
}) {

  return (
    <ul
      className={`md:block md:relative md:top-[0px] flex flex-col md:w-[100%] grow rounded-md bg-gray-100 transition-all duration-300 ease-linear ${
        mobileNavToggle
          ? "overflow-hidden top-[24px] absolute opacity-85 p-4 z-10 w-full rounded-t-none"
          : "overflow-hidden absolute top-[24px] z-10 w-full max-h-0 p-0"
      } md:overflow-visible md:max-h-none md:opacity-100 md:p-0`}
    >
      {navFeature.map((item, index) => (
        <li key={item.id} className="my-3">
          <a
            className="block w-[100%] py-3 pl-1 text-left hover:bg-blue-500 hover:text-white"
            href={item.href}
            onClick={()=>handleOnClick(false)}
          >
            {item.Section}
          </a>
        </li>
      ))}
    </ul>
  );
}


// export default function Nav_Links({ navFeature, mobileNavToggle }: { 
//     navFeature: { id:string, Section: string,  href: string }[];
//     mobileNavToggle: boolean;
// }) {
//     return (
//         <ul className={`md:block md:relative md:top-[0px] flex flex-col md:w-[100%] grow rounded-md bg-gray-100 transition-all duration-300 ease-linear ${mobileNavToggle ? "overflow-hidden top-[24px] absolute opacity-85 p-4 z-10 w-full rounded-t-none" : "overflow-hidden absolute top-[24px] z-10 w-full max-h-0 p-0"} md:overflow-visible md:max-h-none md:opacity-100 md:p-0`}>
//             {navFeature.map((item, index)=>{
//                 return (
//                     <div key={index+1}>
//                         <li className="my-3" key={item.id}>
//                             <a className="block w-[100%] py-3 pl-1 text-left hover:bg-blue-500 hover:text-white"  href={item.href}>{item.Section}</a>
//                         </li>
//                     </div>
//                 )
//             })}
//         </ul>
//     )
// }


// import {
//     Popover,
//     PopoverTrigger,
//     PopoverContent,
// } from "@/components/ui/popover"
// import { Button } from "@/components/ui/button"

// export default function Nav_Links({
//     navFeature,
//     mobileNavToggle,
// }: {
//     navFeature: { id: string; Section: string; href: string }[]
//     mobileNavToggle: boolean
// }) {
//     return (
//     <>
//       {/* Mobile - pakai Popover */}
//         <div className="w-full md:hidden">
//             <Popover>
//                 <PopoverTrigger asChild>
//                     <Button variant="outline" className="md:hidden w-full">
//                     Menu
//                     </Button>
//                 </PopoverTrigger>
//                 <PopoverContent
//                     className="md:hidden flex w-screen p-0 bg-gray-100 rounded-md"
//                     sideOffset={0}
//                     align="start"
//                     >
//                     <ul className="flex flex-col">
//                         {navFeature.map((item) => (
//                         <li key={item.id} className="my-2">
//                             <a
//                             href={item.href}
//                             className="block w-full py-2 pl-3 text-left hover:bg-blue-500 hover:text-white"
//                             >
//                             {item.Section}
//                             </a>
//                         </li>
//                         ))}
//                     </ul>
//                     </PopoverContent>
//             </Popover>
//         </div>

//       {/* Desktop - tampil biasa */}
//       <ul className="hidden md:flex md:flex-col md:w-full md:bg-gray-100 rounded-md">
//         {navFeature.map((item) => (
//           <li key={item.id} className="my-2">
//             <a
//               href={item.href}
//               className="block w-full py-3 pl-3 text-left hover:bg-blue-500 hover:text-white"
//             >
//               {item.Section}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </>
//   )
// }
