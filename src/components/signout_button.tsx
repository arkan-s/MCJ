"use client"
import { signOut } from "next-auth/react"

export function SignOutButton() {
    return <button onClick={() => signOut()} className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition">Sign Out</button>
}