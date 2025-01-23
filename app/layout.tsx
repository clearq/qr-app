import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Navbar";
import SessionProvider from "@/utils/SessionProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/toaster";
import CookieConsentBanner from "@/components/Cookies";
import "@uploadthing/react/styles.css";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import Image from "next/image";
import logoImage from "../public/image/qrLogo.png"; // Import the logo image
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Qr Generator App",
  description: "Powered by ClearQ",
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
      <body className={cn(inter.className, "flex flex-col min-h-screen")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            {/* Header with Logo */}

            {/* Main Content */}
            <div className="flex-1">
              <Link className="p-4 absolute" href="/">
                <Image
                  alt="logo"
                  src={logoImage}
                  className="w-[50px] h-auto"
                  priority // Ensures the logo loads quickly
                />
              </Link>
              <Sidebar user={session?.user} />
              <Toaster />
              {children}
            </div>

            {/* Footer at the bottom of the page */}
            <Footer />
          </SessionProvider>
        </ThemeProvider>
        <CookieConsentBanner />
      </body>
    </html>
  );
}
