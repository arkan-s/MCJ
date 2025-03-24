import { auth } from "@/auth"
import { NextResponse } from "next/server";



export default auth(async (req) => {

    const PUBLIC_ROUTES: string[] = ["/login", "/register", "/"]
    const REDIRECT_ROLE = {
    "employee": new URL("/employee", req.nextUrl.origin),
    "hr": new URL("/hr", req.nextUrl.origin),
    "hd": new URL("/hd", req.nextUrl.origin)
    }
    const REDIRECT_UNAUTH = new URL("/login", req.nextUrl.origin);
    const isAuthenticated = !!req.auth;
	const isPublicRoute = PUBLIC_ROUTES.includes(req.nextUrl.pathname); 


    if(isPublicRoute && isAuthenticated){
        switch (req.auth?.user?.role) {
            case "employee":
                return NextResponse.redirect(REDIRECT_ROLE.employee);
            case "hr":
                return NextResponse.redirect(REDIRECT_ROLE.hr);
            case "hd":
                return NextResponse.redirect(REDIRECT_ROLE.hd);
        }
    }
	// Izinkan akses jika halaman publik
    if (isPublicRoute) {
        return undefined;
    }

    // Cek apakah user sudah login, jika belum, arahkan ke /login
    if (!isAuthenticated) {
        return NextResponse.redirect(REDIRECT_UNAUTH)
    }

    // if(req.nextUrl.pathname.startsWith("/employee") && req.auth?.user?.role === "employee"){
    //     console.log("emp bisa");
    //     return NextResponse.next();
    // } else {
    //     if (req.auth?.user?.role === "hr") {
    //         return NextResponse.redirect(REDIRECT_ROLE.hr)
    //     } else {
    //         return NextResponse.redirect(REDIRECT_ROLE.hd);
    //     }
    // }

    // if(req.nextUrl.pathname.startsWith("/hr") && req.auth?.user?.role === "hr"){
    //     console.log("hr bisa");
    //     return NextResponse.next();
    // } else {
    //     if (req.auth?.user?.role === "employee") {
    //         return NextResponse.redirect(REDIRECT_ROLE.employee)
    //     } else {
    //         return NextResponse.redirect(REDIRECT_ROLE.hd);
    //     }
    // }

    // if(req.nextUrl.pathname.startsWith("/hd") && req.auth?.user?.role === "hd"){
    //     console.log("hd bisa");
    //     return NextResponse.next();
    // } else {
    //     if (req.auth?.user?.role === "hd") {
    //         return NextResponse.redirect(REDIRECT_ROLE.employee)
    //     } else {
    //         return NextResponse.redirect(REDIRECT_ROLE.hd);
    //     }
    // }

    
})

export const config = {
    matcher: ["/employee/:path*", "/hr/:path*", "/hd/:path*", "/rbac", "/login", "/register", "/((?!api|_next/static|_next/image|favicon.ico).*)", "/(!/global.css)"]
}