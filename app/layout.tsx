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
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <div className="mx-auto max-w-7xl text-2xl gap-2 mb-10">
              <Navbar user={session?.user} />
              <Toaster />
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
