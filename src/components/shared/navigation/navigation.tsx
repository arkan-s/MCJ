'use client';
import { useState } from "react";
import Nav_Links from "./navLink";
import Header from "../header/header";


export default function NavBar({role, disable}:{role:string, disable:boolean}){
    const [openMenu, setopenMenu] = useState<boolean>(false)
    const [openSS, setopenSS] = useState<number|null>(null)
    const handleopenMenu = (ind:boolean)=>{
        setopenMenu(ind===openMenu?false : ind);}
    const handleopenSS = (ind:number)=>{
        setopenSS(ind===openSS? null : ind);}

    const EmployeeFeatures = [
        {   id: 'D',
            Section: 'Dashboard',
            Subsection: [
                {
                    name: 'Dashboard',
                    href: '/employee/dashboard', //buat dynamic ambil id employee
                },
                {
                    name: 'Show Answer to Questionnaire',
                    href: '/employee/result', // buat dynamic ambil id employee
                }
            ]
        },
        {   id: 'VP',
            Section: 'Vacant positions',
            Subsection: [
                {
                    name: 'Job Vacancy',
                    href: '/job-vacancy', //page job vacancy
                },
                {
                    name: 'Job Applied',
                    href: '/employee/myinterest', // buat dynamic ambil id employee
                }
            ]
        },
    ];

    const HRFeatures = [
        {   id: 'D',
            Section: 'Dashboard',
            Subsection: [
                {
                    name: 'Dashboard',
                    href: '/hr/dashboard', 
                }
            ]
        },
        {   id: 'AC',
            Section: 'Account Control',
            Subsection: [
                {
                    name: 'Account Data',
                    href: '/hr/accountcontrol', // Buat HR bikin akun
                },
            ]
        },
        {   id: 'EMP',
            Section: 'Employee',
            Subsection: [
                {
                    name: 'Show Employee Data',
                    href: '/hr/showemployeedata', //SHOW DATA EMPLOYEE BULK
                },
                {
                    name: 'Show Answer To Questionnaire',
                    href: '/hr/questionnaire-answers', //SHOW DATA Questionnaire BULK
                },
                {
                    name: 'Show Data Processing',
                    href: '/', //SHOW Processed DATA of the questionnaire
                }
            ]
        },
        {   id: 'SPV',
            Section: 'Supervisors',
            Subsection: [
                {
                    name: 'Supervisors Data',
                    href: '/hr/spv-data', //To put soon to be retired supervisors Data
                }
            ]
        },
        {   id: 'JV',
            Section: 'Job Vacancy',
            Subsection: [
                {
                    name: 'Job Vacancy',
                    href: '/hr/job-vacancy', //To update job vacancy data
                }
            ]
        },
    ];

    const HDFeatures = [
        {   id: 'D',
            Section: 'Dashboard',
            Subsection: [
                {
                    name: 'Dashboard',
                    href: '/employee/dashboard', //buat dynamic ambil id employee
                },
                {
                    name: 'Show Answer to Questionnaire',
                    href: '/employee/result', // buat dynamic ambil id employee
                }
            ]
        },
        {   id: 'VP',
            Section: 'Vacant positions',
            Subsection: [
                {
                    name: 'Job Vacancy',
                    href: '/', //page job vacancy
                },
                {
                    name: 'Job Applied',
                    href: '/employee/myinterest', // buat dynamic ambil id employee
                }
            ]
        },
    ];


    const navRole = role === "employee" ? EmployeeFeatures : role === "hr" ? HRFeatures : HDFeatures;
        
    return (
        <div className={`flex flex-col w-full md:w-56 md:flex-grow-0 p-3 md:px-2 z-50 ${disable ? "pointer-events-none opacity-50" : ""}`}>
            <Header />
            <nav className={`flex w-full gap-24 flex-col rounded-md bg-gray-100 relative mb-2 ${openMenu ? "rounded-b-none" : ""}`}>
                <button className="block w-[100%] md:hidden" onClick={() => { handleopenMenu(true); handleopenSS(0) }}>
                    Menu
                </button>
                <Nav_Links navFeature={navRole} handleFunction={handleopenSS} mobileMenuNavToggle={openSS} mobileNavToggle={openMenu} />
            </nav>
            <div className="hidden h-auto w-full grow rounded-md bg-gray-100 md:block flex flex-col justify-end p-4">
                {/* Kotak Sign Out */}
                <button 
                    className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
                     // Gantilah dengan fungsi sign out yang sesuai
                >
                    Sign Out
                </button>
            </div>
        </div>
    )
}