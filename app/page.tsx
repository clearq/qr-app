"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import "@/components/ui/card";
import Globe from "@/components/magicui/globe";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import LottieAnimation from "@/components/animations/QrAnimation";
import PeopleAnimation from "@/components/animations/PeopleAnimation";

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
    <div className=" flex flex-col justify-between">
      <main className="flex-grow">
        <DotPattern
          className={cn(
            "fixed inset-0 -z-10 [mask-image:radial-gradient(3000px_circle_at_center,white,transparent)]"
          )}
        />
        <div className="flex gap-10 items-center justify-center">
          <>
            <div>
              <LottieAnimation />
            </div>
            <div className="text-left z-50">
              <h1 className="mt-20 mb-5  text-start text-5xl font-bold">
                QrGen
              </h1>
              <div className="mb-16 md:text-2xl text-lg w-[85%] ml- mr-9">
                <p>
                  Welcome to QrGen! Our tool lets you create QR codes for
                  sharing research articles, links, and more. We offer URL and
                  VCard creation for all users. Companies can additionally
                  access stamp cards and campaign cards.
                </p>
                <p>
                  Enjoy free data analysis to see how your codes are used. Just
                  register to create, save, and edit unlimited QR codes that
                  last a lifetime. Start now to effectively share academic
                  information and engage with your audience!
                </p>
              </div>
              <div className="space-x-6">
                {authenticated ? (
                  <Link href="/all">
                    <Button
                      variant={"outline"}
                      className="font-bold py-2 px-4 rounded mt-4"
                    >
                      Home <span className="ml-2">→</span>
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/register">
                      <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4">
                        Register
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button className="font-bold py-2 px-4 rounded mt-4">
                        Login
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </>
        </div>
      </main>
    </div>
  );
}
