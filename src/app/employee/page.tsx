'use server';
import { auth }  from "@/auth";

export default async function employeePage() {
    const session = await auth();
    
    return(
        <div className="grow flex justify-center items-center">
        </div>
    );
}
