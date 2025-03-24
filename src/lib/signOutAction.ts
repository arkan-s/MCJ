import { signOut } from "next-auth/react";

const handleSignOut = async () => {
    try {
        await signOut({ callbackUrl: "/" }); // Redirect ke halaman utama setelah sign out
    } catch (error) {
        console.error("Error saat sign out:", error);
    }
};
