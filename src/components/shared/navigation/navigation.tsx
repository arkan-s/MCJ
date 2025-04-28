'use client';
import { useEffect, useRef, useState } from "react";
import Header from "../header/header";
import { SignOutButton } from "@/components/signout_button";


export default function NavBar({role, disable}:{role:string, disable:boolean}){
    const EmployeeFeatures = [
        {   id: 'D',
            Section: 'Dashboard',
            href: '/employee/dashboard',
            // Subsection: [
            //     {
            //         name: 'Dashboard',
            //         href: '/employee/dashboard', //buat dynamic ambil id employee
            //     },
            //     {
            //         name: 'Form',
            //         href: '/employee/form', // buat dynamic ambil id employee
            //     }
            // ]
        },
        {   id: 'VP',
            Section: 'Vacant positions',
            href: '/employee/job-vacancy',
            // Subsection: [
            //     {
            //         name: 'Job Vacancy',
            //         href: '/job-vacancy', //page job vacancy
            //     },
            //     {
            //         name: 'Job Applied',
            //         href: '/employee/myinterest', // buat dynamic ambil id employee
            //     }
            // ]
        },
        {   id: 'Q',
            Section: 'Questionnaire',
            href: '/employee/questionnaire',
            // Subsection: [
            //     {
            //         name: 'Job Vacancy',
            //         href: '/job-vacancy', //page job vacancy
            //     },
            //     {
            //         name: 'Job Applied',
            //         href: '/employee/myinterest', // buat dynamic ambil id employee
            //     }
            // ]
        },
        {   id: 'F',
            Section: 'Form',
            href: '/employee/form',
            // Subsection: [
            //     {
            //         name: 'Job Vacancy',
            //         href: '/job-vacancy', //page job vacancy
            //     },
            //     {
            //         name: 'Job Applied',
            //         href: '/employee/myinterest', // buat dynamic ambil id employee
            //     }
            // ]
        },
    ];
    const HRFeatures = [
        {   id: 'D',
            Section: 'Dashboard',
            href: '/hr/dashboard',
        },
        {   id: 'EMP',
            Section: 'Employee',
            href: '/hr/employee',
        },
        {   id: 'Q',
            Section: 'Questionnaire',
            href: '/hr/questionnaire',
        },
        {   id: 'JV',
            Section: 'Job Vacancy',
            href: '/hr/job-vacancy',
        },
        {   id: 'DB',
            Section: 'Databases',
            href: '/hr/database',
        },
        {   id: 'AC',
            Section: 'Account Control',
            href: '/hr/accountcontrol',
        },
    ];
    const HDFeatures = [
        {   id: 'D',
            Section: 'Dashboard',
            href: '/hd/dashboard',
            // Subsection: [
            //     {
            //         name: 'Dashboard',
            //         href: '/employee/dashboard', //buat dynamic ambil id employee
            //     },
            //     {
            //         name: 'Show Answer to Questionnaire',
            //         href: '/employee/result', // buat dynamic ambil id employee
            //     }
            // ]
        },
        {   id: 'VP',
            Section: 'Vacant positions',
            href: '/hd/job-vacancy',
            // Subsection: [
            //     {
            //         name: 'Job Vacancy',
            //         href: '/', //page job vacancy
            //     },
            //     {
            //         name: 'Job Applied',
            //         href: '/employee/myinterest', // buat dynamic ambil id employee
            //     }
            // ]
        },
    ]; 

    const [openMenu, setopenMenu] = useState<boolean>(false)
    const navRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const handleopenMenu = (ind: boolean) => {
        setopenMenu(ind);
    };

    // Tutup menu jika klik di luar area nav
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node;

            // Jika klik berasal dari dalam nav atau tombol menu, abaikan
            if (
                navRef.current?.contains(target) || 
                buttonRef.current?.contains(target)
            ) {
                return;
            }

            // Kalau menu lagi terbuka dan klik di luar, tutup
            if (openMenu) {
                setopenMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside); // untuk mobile

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [openMenu]);


    const navRole = role === "employee" ? EmployeeFeatures : role === "hr" ? HRFeatures : HDFeatures;
        
    return (
        <div className={`flex flex-col w-full md:w-56 md:flex-grow-0 p-3 md:px-2 z-50 ${disable ? "pointer-events-none opacity-50" : ""}`}>
            <Header />
            <nav ref={navRef} className={`flex w-full gap-24 flex-col rounded-md bg-gray-100 relative mb-2 ${openMenu ? "rounded-b-none" : ""}`}>
                <button ref={buttonRef} className="block w-[100%] md:hidden" onClick={() => { handleopenMenu(!openMenu) }}>
                    Menu
                </button>
                <ul
                    className={`md:block md:relative md:top-[0px] flex flex-col md:w-[100%] grow rounded-md bg-gray-100 transition-all duration-300 ease-linear ${
                    openMenu
                        ? "overflow-hidden top-[24px] absolute opacity-85 p-4 z-10 w-full rounded-t-none"
                        : "overflow-hidden absolute top-[24px] z-10 w-full max-h-0 p-0"
                    } md:overflow-visible md:max-h-none md:opacity-100 md:p-0`}
                >
                    {navRole.map((item, index) => (
                    <li key={item.id} className="my-3">
                        <a
                        className="block w-[100%] py-3 pl-1 text-left hover:bg-blue-500 hover:text-white"
                        href={item.href}
                        onClick={()=>handleopenMenu(false)}
                        >
                        {item.Section}
                        </a>
                    </li>
                    ))}
                </ul>
            </nav>
            <div className="hidden h-auto w-full grow rounded-md bg-gray-100 md:block flex flex-col justify-end p-4">
                {/* Kotak Sign Out */}
                <SignOutButton/>
            </div>
        </div>
    )
}