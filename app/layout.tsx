import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionProvider from "@/utils/SessionProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/toaster";
import CookieConsentBanner from "@/components/Cookies";
import "@uploadthing/react/styles.css";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import MobileFooterNavbar from "@/components/MobileFooterNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Qr Generator App",
  description: "Powerd by ClearQ",
  themeColor: "#000000",
  manifest: "/manifest.json",
  icons: [
    {
      rel: "icon",
      url: "/image/qrLogo.png",
    },
    {
      rel: "apple-touch-icon",
      url: "/image/qrLogo-apple.png",
    },
  ],
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
              <DotPattern
                className={cn(
                  "fixed inset-0 -z-10 [mask-image:radial-gradient(3000px_circle_at_center,white,transparent)]"
                )}
              />
              {children}
            </div>
            <Footer />
            {/* <MobileFooterNavbar /> */}
          </SessionProvider>
        </ThemeProvider>
        <CookieConsentBanner />
      </body>
    </html>
  );
}
