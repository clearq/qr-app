"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import "@/components/ui/card";
import Globe from "@/components/magicui/globe";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const userData = await response.json();
          if (userData.error) {
            // User not authenticated
            setAuthenticated(false);
          } else {
            // User authenticated
            setAuthenticated(true);
          }
        } else {
          console.error("Failed to fetch user data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(2500px_circle_at_center,white,transparent)]"
        )}
      />
      <div className="flex gap-10 items-center justify-center">
        <>
          <Globe className="relative" />
          <div className="text-left">
            <h1 className="mt-16 mb-16 text-start text-5xl font-bold">QrGen</h1>

            <div className="mb-16 md:text-2xl  text-lg w-[65%]  ml- mr-9">
              <p>
                <p>
                  Welcome to QrGen! Our tool lets you create QR codes for
                  sharing research articles, links, and more. We offer URL and
                  VCard creation for all users. Companies can additionally
                  access stamp cards and campaign cards.
                </p>
                <br />
                <p>
                  Enjoy free data analysis to see how your codes are used. Just
                  register to create, save, and edit unlimited QR codes that
                  last a lifetime. Start now to effectively share academic
                  information and engage with your audience!
                </p>
              </p>
            </div>
            {!authenticated && (
              <Link href="/register">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white ml-9 font-bold py-2 px-4 rounded mt-4">
                  Register
                </Button>
              </Link>
            )}
          </div>
        </>
      </div>
    </>
  );
}
