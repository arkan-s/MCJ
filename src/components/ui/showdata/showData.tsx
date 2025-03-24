'use client';
import { useState } from "react";
import { PaginationHandler } from "@/components/ui/pagination/pagination";

export function Utility_Buttons(){
    return (
        <div className="flex flex-col w-full lg:flex-row items-center px-2">
            <div className="flex w-full p-2">
                    <input type="text" 
                        placeholder="Search" 
                        className="border border-gray-300 rounded-md p-2 lg:p-1 lg:m-1 focus:outline-none focus:ring-2 focus:ring-blue-500 grow lg:w-[50%]"/>
            </div>
            <div className="flex flex-col lg:flex-row w-full p-2">
                <div className="flex justify-around lg:justify-end grow">
                    <button className="bg-blue-500 text-white text-lg font-semibold py-2 px-4 lg:p-1 rounded-md lg:w-[120px] hover:bg-blue-600 w-full"
                    onClick={() => window.location.href = window.location.href + "../addData"}>Add Data</button>
                </div>
                <div className="flex justify-between lg:justify-evenly grow">
                    <button className="border border-gray-400 mt-2 lg:mt-0 text-gray-400 text-lg py-2 px-4 lg:p-1 rounded-md lg:w-[120px] hover:text-white hover:bg-gray-400 w-[49%]">Actions</button>
                    <button className="border border-gray-400 mt-2 lg:mt-0 text-gray-400 text-lg py-2 px-4 lg:p-1 rounded-md lg:w-[120px] hover:text-white hover:bg-gray-400 w-[49%]">Filters</button>
                </div>
            </div>
        </div>
    )
}

export function Show_Data({json_data}:{json_data:any}){

    if(json_data.status !== 200){
        return (
            <div className="grow flex justify-center items-center">
                <div className="flex-col items-center">
                    <h1 className="box text-2xl font-bold w-full text-center">{json_data.error}</h1>
                    <p className="text-xl box w-full text-center">Pesan: {json_data.message}</p>
                    <div className="flex justify-center grow p-6">
                        <button className="bg-blue-500 text-white text-lg font-semibold py-2 px-4 lg:p-1 rounded-md lg:w-[300px] lg:m-3 hover:bg-blue-600 w-full"
                        onClick={() => window.location.href = window.location.href + "/../addemployeedata"}>Add Data</button>
                    </div>
                </div>
            </div>
        )
    }

    const [dataTemp, setDataTemp] = useState(json_data);

    // ambil parameter
    const keys = Object.keys(dataTemp[0])
    console.log(keys)
    // Atur page number
    const [pageNumber, setPageNumber] = useState<number>(0)
    const changePageNumber = (pn:number) => {
        setPageNumber(pn);
    }
    
    // cincang data (slice)
    const rowsPerPage = 10;
    const currentData = dataTemp.slice(pageNumber*rowsPerPage, (pageNumber+1)*rowsPerPage);
    const totalPages = Math.ceil(dataTemp.length / rowsPerPage);


    return (
        <>
            <div className= "border-2 rounded-lg p-1 m-1 flex flex-col grow md:justify-between"> {/* Show_Data Component */}
                {/* BUAT CONTENT TABEL (BIKIN COMPONENT LAGI) */}
                <div className="overflow-x-auto">
                    <table className="table-auto">
                        <thead>
                            <tr>
                                {keys.map((ind)=>(<th key={ind} className="border border-gray-300 px-4 py-2">{ind}</th>))}
                            </tr>
                        </thead>
                        <tbody className="">
                            {currentData.map((data: any)=>
                                (
                                    <tr key={data.id}>
                                        {Object.entries(data).map(([key, value]) => (
                                        <td key={key} className="border border-gray-300 px-4 py-2 w-auto whitespace-nowrap">
                                            {value as React.ReactNode}
                                        </td>))}
                                        <td key={data.id} className="border border-gray-300 px-4 py-2 w-auto whitespace-nowrap">
                                            <button type="button" /*onClick=*/>
                                                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M5 2C3.34315 2 2 3.34315 2 5V8C2 9.65685 3.34315 11 5 11H8C9.65685 11 11 9.65685 11 8V5C11 3.34315 9.65685 2 8 2H5ZM4 5C4 4.44772 4.44772 4 5 4H8C8.55228 4 9 4.44772 9 5V8C9 8.55228 8.55228 9 8 9H5C4.44772 9 4 8.55228 4 8V5Z" fill="#000000"/>
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M16 2C14.3431 2 13 3.34315 13 5V8C13 9.65685 14.3431 11 16 11H19C20.6569 11 22 9.65685 22 8V5C22 3.34315 20.6569 2 19 2H16ZM15 5C15 4.44772 15.4477 4 16 4H19C19.5523 4 20 4.44772 20 5V8C20 8.55228 19.5523 9 19 9H16C15.4477 9 15 8.55228 15 8V5Z" fill="#000000"/>
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M2 16C2 14.3431 3.34315 13 5 13H8C9.65685 13 11 14.3431 11 16V19C11 20.6569 9.65685 22 8 22H5C3.34315 22 2 20.6569 2 19V16ZM5 15C4.44772 15 4 15.4477 4 16V19C4 19.5523 4.44772 20 5 20H8C8.55228 20 9 19.5523 9 19V16C9 15.4477 8.55228 15 8 15H5Z" fill="#000000"/>
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M16 13C14.3431 13 13 14.3431 13 16V19C13 20.6569 14.3431 22 16 22H19C20.6569 22 22 20.6569 22 19V16C22 14.3431 20.6569 13 19 13H16ZM15 16C15 15.4477 15.4477 15 16 15H19C19.5523 15 20 15.4477 20 16V19C20 19.5523 19.5523 20 19 20H16C15.4477 20 15 19.5523 15 19V16Z" fill="#000000"/>
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
                {/* BUAT PAGINATION */}
                <div className="">
                    <PaginationHandler total_pages={totalPages} page_number={pageNumber} changing_page={changePageNumber}/>
                </div>
            </div>
        </>
    );
}