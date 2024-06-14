import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionProvider from "@/utils/SessionProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/toaster";
import { CardFooter } from "@/components/ui/card";
import CookieConsentBanner from "@/components/Cookies";
import "@uploadthing/react/styles.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
 
import { ourFileRouter } from "../app/api/upladingthings/core";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QR-Generator",
  description: "Powered by ClearQ",
};

interface Props {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: Props) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <div className="mx-auto max-w-5xl text-2xl gap-2 mb-10">
              <Toaster />
            <NextSSRPlugin
         routerConfig={extractRouterConfig(ourFileRouter)}
        />
          <Navbar user={session?.user} />
              {children}
            </div>
            <CardFooter className="flex justify-center bottom-auto align-bottom items-center text-center mt-10">
              Powered by{" "}
              <span className="ml-1 hover:text-cyan-600 cursor-pointer transition-colors duration-300 font-semibold">
                <a
                  href="https://clearq.se"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ClearQ
                </a>
              </span>
            </CardFooter>
          </SessionProvider>
        </ThemeProvider>
      <CookieConsentBanner/>
      </body>
    </html>
  );
}
