import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"

export default function DeleteButton({Deletefn, indexDelete} : {Deletefn:any,indexDelete:any}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" size="icon">
                    <Trash size={16} />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="flex flex-col md:max-w-[35%] max-w-[80%] md:max-h-[25vh]">
                <AlertDialogHeader className="flex-shrink-0">
                    <AlertDialogTitle className="font-extrabold text-xl">Hapus?</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm">
                        Data yang dihapus tidak dapat dikembalikan. Yakin mau lanjut?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-shrink-0">
                    <AlertDialogCancel className="border-2 border-zinc-700"> Cancel </AlertDialogCancel>
                    <AlertDialogAction onClick={()=>Deletefn(indexDelete)} className="border-2 mb-2 text-white bg-red-200 border-red-500 hover:bg-red-500 hover:border-red-50"> Hapus </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}