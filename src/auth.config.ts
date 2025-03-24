import { NextAuthConfig } from "next-auth";

export default {
    secret: process.env.AUTH_SECRET,
    session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
    pages: { 
        signIn: '/login',
        signOut: '/login',
        error: '/login',
    },
    providers: [],
    callbacks: {
        async jwt({token, user}){
            if(user){
                token.nik = user.nik;
                token.role = user.role;
                token.isFirstLogin = user.isFirstLogin;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.nik = token.nik;
            session.user.role = token.role;
            return session;
        },
        async redirect({ url, baseUrl }) {
            
            console.log("TANDAIN..", url, baseUrl);
            // Allows relative callback URLs
            if (url.startsWith("/")) {
                console.log("cek if");
                return `${baseUrl}${url}`;
            }
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) {
                console.log("cek else"); 
                return url;
            }
            console.log("last cek")
            return baseUrl;
        },
    }
} satisfies NextAuthConfig;
