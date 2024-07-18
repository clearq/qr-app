import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { apiRoutes, privateRoute, publicRoute } from "./routes";
import { NextResponse } from "next/server";


const {auth} = NextAuth(authConfig);


export default auth((req) => {
    const {nextUrl}= req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiRoutes);
    const isPublic = publicRoute.includes(nextUrl.pathname);
    // const isPrivate = privateRoute.includes(nextUrl.pathname);

    if (isApiAuthRoute) {
       
        return
    }

  //   if (isPrivate) {
  //     if (isLoggedIn) {

  
  //         return Response.redirect(new URL("/profile", nextUrl))
  //     }
  //   return;
  // }

    if (!isLoggedIn && !isPublic) {
     
      return NextResponse.redirect(new URL("/", nextUrl))
    }

})

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  }