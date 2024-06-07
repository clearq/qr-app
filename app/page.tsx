"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
 "@/components/ui/card";



function Home() {

    
      return (
        <>
          <div className="flex gap-10 items-center justify-center">

              <>
                <div className="text-left">
                  <h1 className="mt-32 mb-16 text-center text-5xl font-bold">
                    QR Generator
                  </h1>
                  <div className="mb-16 text-gray-600">
                    <p>
                      Välkommen till vår QR-generator! Vi erbjuder en kraftfull
                      verktyg för att skapa QR-koder som kan användas för olika
                      ändamål. Oavsett om du behöver skapa QR-koder för att dela
                      forskningsartiklar, länkar till online-resurser, eller
                      andra typer av information, så är vår tjänst här för att
                      hjälpa dig.
                    </p>
                    <br />
                    <p>
                      Vi erbjuder dataanalys för att hjälpa dig att förstå hur
                      dina QR-koder används och vilken typ av interaktion de
                      genererar. Det bästa av allt är att vår tjänst är helt
                      GRATIS att använda. Allt du behöver göra är att registrera
                      dig för ett konto.
                    </p>
                    <br />
                    <p>
                      När du har registrerat dig kan du skapa och spara hur
                      många QR-koder du vill. Dessutom kan du enkelt redigera
                      dem efter behov för att säkerställa att de är aktuella och
                      relevanta. Och det bästa är att dina QR-koder har livstid,
                      så du behöver inte oroa dig för att de kommer att
                      försvinna.
                    </p>
                    <br />
                    Så börja använda vår QR-kodgenerator idag för att effektivt
                    dela din akademiska information och maximera din interaktion
                    med målgruppen!
                  </div>
                  <Link href="/register">
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4">
                      Register
                    </Button>
                  </Link>
                </div>
              </>

{/**
 *               // <div className="flex flex-col w-full ">
              //   <Pages />
              //   <Card className=" mt-10">
              //     <CardHeader>
              //       <CardTitle>URL</CardTitle>
              //       <CardDescription>Enter URL</CardDescription>
              //     </CardHeader>
              //     <CardContent>
              //       <QRCodeGenerator qrData={{
              //           id: "",
              //           url: "",
              //           tag: "",
              //           logoType: null,
              //           customerId: ""
              //         }} />
              //     </CardContent>
              //   </Card>
              // </div>
 */}

          </div>
        </>
      );
  };
  

export default Home;
