"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import "@/components/ui/card";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const userData = await response.json();
          setAuthenticated(!userData.error);
        } else {
          console.error("Failed to fetch user data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col">
      <main className="flex-grow">
        <DotPattern
          className={cn(
            "fixed inset-0 -z-10 [mask-image:radial-gradient(3000px_circle_at_center,white,transparent)]"
          )}
        />
        <div className="container mx-auto px-4  flex flex-col lg:flex-row items-center justify-center ">
          {/* Image Section */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end p-4">
            <Link href="/">
              <Image
                alt="Qaaf"
                src="/image/QaafGold.png"
                width={150}
                height={150}
                className="w-full max-w-[70px] sm:max-w-[150px]"
                priority
              />
            </Link>
          </div>

          {/* Text Section */}
          <div className="w-full lg:w-1/2 text-center lg:text-left z-50 p-4">
            <h1 className="text-[#937100] text-4xl lg:text-5xl font-bold mb-5">
              QrGen
            </h1>
            <div className="mb-8 text-lg lg:text-xl max-w-[85%] mx-auto lg:mx-0">
              <p className="mb-4">
                Welcome to QrGen! Our tool lets you create QR codes for sharing
                research articles, links, and more. We offer URL and VCard
                creation for all users. Companies can additionally access stamp
                cards and campaign cards.
              </p>
              <p>
                Enjoy free data analysis to see how your codes are used. Just
                register to create, save, and edit unlimited QR codes that last
                a lifetime. Start now to effectively share academic information
                and engage with your audience!
              </p>
            </div>
            <div className="space-x-4 space-y-4 lg:space-y-0">
              {authenticated ? (
                <Link href="/all">
                  <Button className="bg-[#937100] hover:bg-[#D4AF37] text-white font-bold py-2 px-4 ">
                    Home <span className="ml-2">→</span>
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button className="bg-[#937100] hover:bg-[#D4AF37] text-white font-bold py-2 px-4 rounded">
                      Register
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button className="font-bold py-2 px-4 rounded">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
