import { NextAuthConfig } from "next-auth";

export default {
    secret: process.env.AUTH_SECRET,
    session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
    pages: { 
        signIn: '/rbac',
        signOut: '/login',
        error: '/login',
    },
    providers: [],
    callbacks: {
        async jwt({token, user}){
            if(user){
                token.nik = user.nik;
                token.role = user.role;
                token.branch = user.branch;
                token.dept = user.dept;
                token.name = user.name ?? "";
                token.email = user.email ?? "";
                token.formFilled = user.formFilled;
                token.questionnaire = user.questionnaire;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.nik = token.nik;
            session.user.role = token.role;
            session.user.branch = token.branch;
            session.user.dept = token.dept;
            session.user.name = token.name;
            session.user.email = token.email ?? "";
            session.user.formFilled = token.formFilled;
            session.user.questionnaire = token.questionnaire
            return session;
        },
        async redirect({ url, baseUrl }) {
            
            console.log("TANDAIN..", url, baseUrl); 
            if (url.startsWith("/")) {
                console.log("cek if");
                return `${baseUrl}${url}`;
            }
            else if (new URL(url).origin === baseUrl) {
                console.log("cek else"); 
                return url;
            }
            console.log("last cek")
            return baseUrl;
        },
    }
} satisfies NextAuthConfig;
