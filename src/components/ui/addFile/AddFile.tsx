"use client";
import { bitter } from "../fonts";
import { useState } from "react";


export function AddFile ({url}:{url:string}) {
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleFile = async (file: File) => {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`/api/admin${url}`, {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            console.log(result);
            alert(result.message);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Gagal mengunggah file");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            handleFile(event.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
    };

    function InputFile() {
        return (
            <div className={`${bitter.className} flex items-center justify-center w-full`}>
                <label
                    htmlFor="dropzone-file"
                    className={`flex flex-col items-center justify-center w-full h-64 border-2 ${dragActive ? "border-blue-500 bg-blue-100" : "border-blue-300 bg-blue-200"} border-dashed rounded-lg cursor-pointer transition-all`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {!loading && (
                            <svg className="w-8 h-8 mb-4 text-zinc-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                        )}
                        {loading && <div className="w-12 h-12 mb-4 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>}
                        {!loading && (
                            <>
                                <p className="mb-2 text-sm text-zinc-500">
                                    <span className="font-semibold">Click or Drag file here</span>
                                </p>
                                <p className="text-xs text-zinc-500">.xlsx .xls or .csv</p>
                            </>
                        )}
                        {loading && <p className="mb-2 text-sm text-zinc-500">Loading...</p>}
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
                </label>
            </div>
        );
    }

    return ( 
        <form className="flex w-[80%] justify-center items-center">
            <InputFile></InputFile>
        </form>
    )


}
