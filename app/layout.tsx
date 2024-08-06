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
        {/* <Image quality={100} width={10000} height={10000} className="absolute -z-40 opacity-60 top-0   w-[3500px]" src={'/image/dotted.png'} alt="barcode"></Image> */}
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          >
          <SessionProvider session={session}>
            <div className="mx-auto max-w-7xl text-2xl gap-2 mb-10">
              <Toaster />
            <Navbar user={session?.user} />
              {children}
        {/* <Image quality={100} width={10000} height={10000} className="absolute opacity-60 top-96 right-44 w-[300px]" src={'/image/barcode.png'} alt="barcode"></Image>
        <Image quality={100} width={10000} height={10000} className="absolute opacity-60 top-[700px] left-[600px] w-[200px]" src={'/image/analytics.png'} alt="barcode"></Image>
        <Image quality={100} width={10000} height={10000} className="absolute opacity-60 top-32 left-52 w-[300px]" src={'/image/qrphone.png'} alt="barcode"></Image> */}
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