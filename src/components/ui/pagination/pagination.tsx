'use client'

export function PaginationHandler({total_pages, page_number, changing_page} : {total_pages:number, page_number:number, changing_page:(arg:number)=>void}){
    const pagesPagi = (total_pages:number, page_number:number) =>{
        if (total_pages <= 5) return [...Array(total_pages).keys()];
        if(page_number <= 2){
            return [0, 1, 2, 3, 4]
        }
        if (page_number >= total_pages - 3){
            return [total_pages - 5, total_pages - 4, total_pages - 3, total_pages - 2, total_pages - 1];
        }
        return [page_number - 2, page_number - 1, page_number, page_number + 1, page_number + 2];
    }

    return (
        <div className="flex flex-row justify-center md:justify-end">
            <div className="flex flex-row gap-1 pt-1 overflow-x-auto">
                <button className={`px-1 py-1 rounded-md h-[40px] border border-gray-400`} onClick={()=>changing_page(0)}>Home</button>                
                <button className="p-1 rounded-md h-[40px] border border-gray-400 " onClick={()=>changing_page(page_number-1)} disabled={page_number===0}>Prev</button>
                {   
                pagesPagi(total_pages, page_number).map((item)=>(<button key={item} className={`px-1 py-1 rounded-md w-[40px] h-[40px] border border-gray-400 ${item === page_number ? 'bg-blue-200' : ''}`} onClick={()=>changing_page(item)}>{item+1}</button>))
                }
                <button className="p-1 rounded-md h-[40px] border border-gray-400 " onClick={()=>changing_page(page_number+1)} disabled={page_number===total_pages-1}>Next</button>
                <button className={`px-1 py-1 rounded-md h-[40px] border border-gray-400`} onClick={()=>changing_page(total_pages-1)}>End</button>
            </div>
        </div>
);
}