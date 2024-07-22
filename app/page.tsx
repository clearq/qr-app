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

            <div className="mb-16 md:text-2xl text-lg text-gray-600 ml- mr-9">
              <p>
                Welcome to our QrGen! We offer a powerful tool for creating QR
                codes that can be used for various purposes. Whether you need to
                create QR codes to share research articles, links to online
                resources, or other types of information, our service is here to
                help you.
              </p>
              <br />
              <p>
                We provide data analysis to help you understand how your QR
                codes are being used and what type of interaction they generate.
                Best of all, our service is completely FREE to use. All you need
                to do is register for an account.
              </p>
              <br />
              <p>
                Once you have registered, you can create and save as many QR
                codes as you want. Additionally, you can easily edit them as
                needed to ensure they are up-to-date and relevant. And the best
                part is that your QR codes have a lifetime, so you don’t have to
                worry about them disappearing.
              </p>
              <br />
              So start using our QR code generator today to effectively share
              your academic information and maximize your interaction with your
              target audience!
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
