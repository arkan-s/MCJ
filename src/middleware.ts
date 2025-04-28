import { auth } from "@/auth"
import { NextResponse } from "next/server";



export default auth(async (req) => {

    const PUBLIC_ROUTES: string[] = ["/login", "/register", "/loginadmin", "/"]
    const REDIRECT_ROLE = {
        "employee": new URL("/employee/dashboard", req.nextUrl.origin),
        "hr": new URL("/hr/dashboard", req.nextUrl.origin),
        "hd": new URL("/hd/dashboard", req.nextUrl.origin)
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

    if (req.nextUrl.pathname.startsWith("/rbac") && isAuthenticated) {
        switch (req.auth?.user?.role) {
            case "employee":
                if (req.auth.user.formFilled === 0) {
                    return NextResponse.redirect(new URL("/employee/form", req.nextUrl.origin));
                } else if (req.auth.user.questionnaire === 0){
                    return NextResponse.redirect(new URL("/employee/questionnaire", req.nextUrl.origin));
                }
                return NextResponse.redirect(REDIRECT_ROLE.employee);
            case "hr":
                return NextResponse.redirect(REDIRECT_ROLE.hr);
            case "hd":
                return NextResponse.redirect(REDIRECT_ROLE.hd);
            default:
                return NextResponse.redirect(REDIRECT_UNAUTH); // kalau rolenya gak ketahuan
        }
    }

    if (req.nextUrl.pathname === "/employee" && req?.auth?.user.role === "employee") {
        return NextResponse.redirect(REDIRECT_ROLE.employee);
    }
    if (req.nextUrl.pathname === "/hr" && req?.auth?.user.role === "hr") {
        return NextResponse.redirect(REDIRECT_ROLE.hr);
    }
    if (req.nextUrl.pathname === "/hd" && req?.auth?.user.role === "hd") {
        return NextResponse.redirect(REDIRECT_ROLE.hd);
    }

    // if(req.nextUrl.pathname.startsWith("/employee") && req.auth?.user?.role === "employee"){
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