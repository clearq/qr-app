import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Navbar";
import SessionProvider from "@/utils/SessionProvider";
import { ThemeProvider } from "@/components/theme-provider"; // From shadcn/ui
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/toaster";
import CookieConsentBanner from "@/components/Cookies";
import "@uploadthing/react/styles.css";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import LogoWrapper from "@/components/LogoWrapper"; // Import the new LogoWrapper component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Qaaf",
  description: "Powered by ClearQ",
  icons: [
    {
      rel: "icon",
      url: "favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      url: "/image/QaafGold.png",
    },
  ],
};

interface Props {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: Props) {
  const session = await auth();
  const language = session?.user?.language || "en"; // Default to "en" if language is not set

  return (
    <html
      lang={language}
      dir={language === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <head>
        {/* Add the viewport meta tag here */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body className={cn(inter.className, "flex flex-col min-h-screen")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            {/* Use the LogoWrapper component */}
            <LogoWrapper />

            {/* Main Content */}
            <div className="flex-1">
              <LanguageProvider>
                <Sidebar user={session?.user} />
                <Toaster />
                {children}
              </LanguageProvider>
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
