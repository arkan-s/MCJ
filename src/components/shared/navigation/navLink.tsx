
export default function Nav_Links({ navFeature, handleFunction, mobileMenuNavToggle, mobileNavToggle }: { 
    navFeature: { id:string, Section: string, Subsection: { name: string, href: string }[] }[];
    handleFunction: (handleparam: number) => void;
    mobileMenuNavToggle: number|null;
    mobileNavToggle: boolean;
}) {
    return (
        <ul className={`md:block md:relative md:top-[0px] flex flex-col md:w-[100%] grow rounded-md bg-gray-100 transition-all duration-300 ease-linear ${mobileNavToggle ? "overflow-hidden top-[24px] absolute opacity-85 p-4 z-10 w-full rounded-t-none" : "overflow-hidden absolute top-[24px] z-10 w-full max-h-0 p-0"} md:overflow-visible md:max-h-none md:opacity-100 md:p-0`}>
            {navFeature.map((item, index)=>{
                return (
                    <div key={index+1}>
                        <li className="my-3" key={item.id}>
                            <button className="block w-[100%] py-3 pl-1 text-left"  onClick={() => handleFunction(index+1)}>{item.Section}</button>
                        </li>
                        <div className={`overflow-hidden flex-col justify-center transition-all rounded-md bg-gray-100 duration-300 ease-in-out ${mobileMenuNavToggle === index+1 ? "opacity-100 p-2" : "max-h-0 overflow-hidden p-0"}`}>
                            {item.Subsection.map((nextItem, index2)=>{
                                return(
                                    <li className="block w-full py-0 my-3 pl-3 hover:bg-blue-500 hover:text-white" key={item.id+String(index2+1)}><a className="block w-full" href={nextItem.href}>{nextItem.name}</a></li>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </ul>
    )
}