"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import QrChart from "./qrChart";
import VcardChart from "./vcardChart";
import AllChart from "./allChart";
import { Progress } from "./ui/progress";

export default function AllForm() {
  const params = useSearchParams();
  const id = params.get("id");
  const [userData, setUserData] = React.useState(null);
  const router = useRouter();

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setUserData(data);
    };

    fetchData();
  }, []);

  const handleProfile = () => {
    router.push("/profile");
  };

  return (
    <div className="flex w-full flex-col bg-muted/40">
      <Card>
        <div className="flex flex-col sm:py-10 sm:pl-14 sm:pr-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background  sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <CardTitle className="text-5xl mb-5">Overview</CardTitle>
          </header>
          <main className="items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {userData ? (
                  <>
                    <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
                      <CardHeader className="pb-3">
                        <CardTitle>
                        {
                        //@ts-ignore
                        userData?.firstName
                      }{" "}
                      {
                        //@ts-ignore
                        userData?.lastName
                      }
                        </CardTitle>
                        <CardDescription className="max-w-lg text-balance leading-relaxed">
                        {
                        //@ts-ignore
                        userData?.email
                      }
                      <br />
                      {
                        //@ts-ignore
                        userData?.phone
                      }
                      <br />
                      {
                        //@ts-ignore
                        userData?.address
                      }
                      <br />
                      {
                        //@ts-ignore
                        userData?.city
                      }
                      <br />
                      {
                        //@ts-ignore
                        userData?.zip
                      }
                      <br />
                      {
                        //@ts-ignore
                        userData?.company
                      }
                      <br />
                      {
                        //@ts-ignore
                        userData?.orgNumber
                      }
                      <br />
                        </CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button onClick={handleProfile}>View Your Profile</Button>
                      </CardFooter>
                    </Card>
                    <Card x-chunk="dashboard-05-chunk-1">
                      <CardHeader className="pb-2">
                        <CardDescription className="text-2xl font-semibold">URL</CardDescription>
                        <CardTitle className="text-9xl flex justify-center items-center">
                          {
                            //@ts-ignore
                          userData._count.qr}
                        </CardTitle>
                      </CardHeader>
                      <CardContent></CardContent>
                      <CardFooter></CardFooter>
                    </Card>
                    <Card x-chunk="dashboard-05-chunk-2">
                      <CardHeader className="pb-2">
                        <CardDescription className="text-2xl font-semibold">VCard</CardDescription>
                        <CardTitle className="text-9xl flex justify-center items-center">
                          {
                            //@ts-ignore
                          userData._count.vcard}
                        </CardTitle>
                      </CardHeader>
                      <CardContent></CardContent>
                      <CardFooter></CardFooter>
                    </Card>
                  </>
                ) : (
                  <Progress value={87}/>
                )}
              </div>
              <Tabs defaultValue="URL">
                <div className="flex items-center">
                  <TabsList>
                    <TabsTrigger value="URL">URL</TabsTrigger>
                    <TabsTrigger value="VCard">VCard</TabsTrigger>
                    {/* <TabsTrigger value="Analys">Analys</TabsTrigger> */}
                  </TabsList>
                </div>
                <TabsContent value="URL">
                  <QrChart />
                </TabsContent>
                <TabsContent value="VCard">
                  <VcardChart />
                </TabsContent>
                <TabsContent value="Analys">
                  <AllChart />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </Card>
    </div>
  );
}
