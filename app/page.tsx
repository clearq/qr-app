'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import "@/components/ui/card";

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
      <div className="flex gap-10 items-center justify-center">
        <>
          <div className="text-left">
            <h1 className="mt-16 mb-16 text-center text-5xl font-bold">
              QrGen
            </h1>
            <div className="mb-16 md:text-2xl text-lg text-gray-600 ml-9 mr-9">
              <p>
                Välkommen till vår QrGen! Vi erbjuder en kraftfull verktyg för
                att skapa QR-koder som kan användas för olika ändamål. Oavsett
                om du behöver skapa QR-koder för att dela forskningsartiklar,
                länkar till online-resurser, eller andra typer av information,
                så är vår tjänst här för att hjälpa dig.
              </p>
              <br />
              <p>
                Vi erbjuder dataanalys för att hjälpa dig att förstå hur dina
                QR-koder används och vilken typ av interaktion de genererar.
                Det bästa av allt är att vår tjänst är helt GRATIS att använda.
                Allt du behöver göra är att registrera dig för ett konto.
              </p>
              <br />
              <p>
                När du har registrerat dig kan du skapa och spara hur många
                QR-koder du vill. Dessutom kan du enkelt redigera dem efter
                behov för att säkerställa att de är aktuella och relevanta. Och
                det bästa är att dina QR-koder har livstid, så du behöver inte
                oroa dig för att de kommer att försvinna.
              </p>
              <br />
              Så börja använda vår QR-kodgenerator idag för att effektivt dela
              din akademiska information och maximera din interaktion med
              målgruppen!
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
};

