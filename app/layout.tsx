import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionProvider from "@/utils/SessionProvider";
import { ThemeProvider } from "@/components/theme-provider"
import {auth} from '@/auth'
import { Toaster } from "@/components/ui/toaster"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QR- Generator",
  description: "Power by ClearQ",
};

interface Props {
  children : React.ReactNode
}

export default async function RootLayout({children}: Props) {
  const session = await auth()
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
            <Navbar />
            {children}
          </div>
        </SessionProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}
