import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { apiRoutes, privateRoute, publicRoute } from "./routes";
import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';


const {auth} = NextAuth(authConfig);


export default auth((req) => {
    const {nextUrl}= req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiRoutes);
    const isPublic = publicRoute.includes(nextUrl.pathname);
    const isPrivate = privateRoute.includes(nextUrl.pathname);

    if (isApiAuthRoute) {
       
        return
    }

  //   if (isPrivate) {
  //     if (isLoggedIn) {

  
  //         return Response.redirect(new URL("/", nextUrl))
  //     }
  //   return;
  // }

    // if (!isLoggedIn && !isPublic) {
     
    //   return NextResponse.redirect(new URL("/", nextUrl))
    // }

})

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  }


  export function middleware(req: NextRequest) {
    const res = NextResponse.next();
  
    // Set CORS headers
    res.headers.set('Access-Control-Allow-Credentials', 'true');
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    return res;
  }