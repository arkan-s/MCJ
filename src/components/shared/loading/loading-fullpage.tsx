import { Loader2 } from "lucide-react"

export default function LoadingFullPage(){
    return (
        <div className="flex flex-col items-center justify-center w-full py-20">
            <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
            <p className="mt-4 text-lg font-semibold">Loading data...</p>
        </div>
    )
}