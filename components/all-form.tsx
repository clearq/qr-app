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
import TicketChart from "./ticketChart";
import EventsChart from "./eventsChart";

export default function AllForm() {
  const params = useSearchParams();
  const id = params.get("id");
  const [userData, setUserData] = React.useState(null);
  const router = useRouter();

  
  const [selectedTab, setSelectedTab] = React.useState<string>("URL");

 
  React.useEffect(() => {
    const savedTab = localStorage.getItem("selectedTab");
    if (savedTab) {
      setSelectedTab(savedTab); 
    }
  }, []);

  // Fetch the user data
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setUserData(data);
    };

    fetchData();
  }, []);

  
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    localStorage.setItem("selectedTab", value);
  };

  const handleProfile = () => {
    router.push("/profile");
  };
  return (
    <div className="flex ml-2 w-[96%] sm:w-full flex-col bg-muted/40">
      <Card>
        <div className="flex flex-col sm:py-10 sm:pl-14 sm:pr-14">
            <CardTitle className="text-3xl sm:text-5xl ml-4 mt-5 sm:mt-0 mb-2 sm:mb-5">Overview</CardTitle>
          <main className="items-start gap-1 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <div className="grid gap-4 grid-cols-1 ml-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {userData ? (
                  <>
                    <Card className="w-[98%] sm:w-full sm:col-span-2 md:col-span-1 lg:col-span-1 xl:col-span-2" x-chunk="dashboard-05-chunk-0">
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
                    <Card
                    className="w-[97%] sm:w-full"
                     x-chunk="dashboard-05-chunk-1">
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
                    <Card
                    className="w-[97%] sm:w-full"
                     x-chunk="dashboard-05-chunk-2">
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
              <Tabs value={selectedTab} onValueChange={handleTabChange}>
                <div className="ml-1 flex items-center">
                  <TabsList>
                    <TabsTrigger value="URL">URL</TabsTrigger>
                    <TabsTrigger value="VCard">VCard</TabsTrigger>
                    <TabsTrigger value="Events">Events</TabsTrigger>
                    <TabsTrigger value="Analys">Analytics</TabsTrigger>
                  </TabsList>
                </div>

                {/* Content for each tab */}
                <TabsContent value="URL">
                  <QrChart />
                </TabsContent>
                <TabsContent value="VCard">
                  <VcardChart />
                </TabsContent>
                <TabsContent value="Analys">
                  <AllChart />
                </TabsContent>
                <TabsContent value="Ticket">
                  <TicketChart />
                </TabsContent>
                <TabsContent value="Events">
                  <EventsChart />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </Card>
    </div>
  );
}