"use client";
import * as React from "react";
import {
  TrendingUp,} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { saveAs } from "file-saver";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IVCARD } from "@/typings";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "./ui/use-toast";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import {
  Label,
  Pie,
  PieChart,
} from "recharts";
import { DataTable } from "@/app/(protected)/dashboard/data-table";

export default function AllForm() {
  const params = useSearchParams();

  const chartData = [
    { browser: "Apple", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "Samsung", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 190, fill: "var(--color-other)" },
  ];

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
    firefox: {
      label: "Firefox",
      color: "hsl(var(--chart-3))",
    },
    edge: {
      label: "Edge",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  const chartDatas = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ];
  const chartConfigs = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  const id = params.get("id");
  const [userData, setUserData] = React.useState(null);
  const router = useRouter();
  const [vcardData, setVcardData] = React.useState<IVCARD>();
  const [logo, setLogo] = React.useState<string | ArrayBuffer | null>(null);
  const qrRef = React.useRef<HTMLDivElement>(null);

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
  const handleVcard = () => {
    router.push("/dashboardVcard");
  };
  const handleQr = () => {
    router.push("/dashboard");
  };

  const downloadQRCode = (format: "png" | "svg") => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector("canvas");
    if (canvas) {
      if (format === "png") {
        canvas.toBlob((blob) => {
          if (blob) {
            saveAs(blob, `qrcode.${format}`);
          }
        }, "image/png");
      } else if (format === "svg") {
        const svg = qrRef.current.querySelector("svg");
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const blob = new Blob([svgData], {
            type: "image/svg+xml;charset=utf-8",
          });
          saveAs(blob, `qrcode.${format}`);
        }
      }
    }
  };

  const copyUrlToClipboard = () => {
    //@ts-ignore
    const url = `https://qrgen.clearq.se/vcard/details?id=${vcardData.id}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast({
          title: "URL copied to clipboard",
          description: `${new Date().toLocaleDateString()}`,
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Failed to copy URL",
          description: `${new Date().toLocaleDateString()}`,
        });
      });
  };
  if (!userData) {
    return (
      <div className="flex mr-9 ml-9 justify-center items-center h-screen">
        <Progress className="text-center" value={33} />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col bg-muted/40">
      <Card>
        <div className="flex flex-col sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background  sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <CardTitle className="text-5xl">Overview</CardTitle>
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
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
                    <Button onClick={() => handleProfile()}>
                      View Your Profile
                    </Button>
                  </CardFooter>
                </Card>
                <Card x-chunk="dashboard-05-chunk-1">
                  <CardHeader className="pb-2">
                    <CardDescription>QR</CardDescription>
                    <CardTitle className="text-4xl">
                      {
                        //@ts-ignore
                        userData._count.qr
                      }
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      Check here:
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => handleQr()}>{"->"}</Button>
                    {/* <Progress value={userData._count.qr} aria-label="25% increase" /> */}
                  </CardFooter>
                </Card>
                <Card x-chunk="dashboard-05-chunk-2">
                  <CardHeader className="pb-2">
                    <CardDescription>VCard</CardDescription>
                    <CardTitle className="text-4xl">
                      {
                        //@ts-ignore
                        userData._count.vcard
                      }
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      Check here:
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => handleVcard()}>{"->"}</Button>
                    {/* <Progress value={userData._count.vcard} aria-label="12% increase" /> */}
                  </CardFooter>
                </Card>
              </div>
              <Tabs defaultValue="Qr">
                <div className="flex items-center">
                  <TabsList>
                    <TabsTrigger value="Qr">Qr</TabsTrigger>
                    <TabsTrigger value="month">VCard</TabsTrigger>
                    <TabsTrigger value="year">Analys</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="Qr">
                  <Card x-chunk="dashboard-05-chunk-3">
                    <Carousel>
                      <CarouselContent>
                        <CarouselItem>
                          <CardHeader className="items-center pb-0">
                            <CardTitle>Pie Chart - Donut with Text</CardTitle>
                            <CardDescription>
                              January - June 2024
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1 pb-0">
                            <ChartContainer
                              config={chartConfig}
                              className="mx-auto aspect-square max-h-[250px]"
                            >
                              <PieChart>
                                <ChartTooltip
                                  cursor={false}
                                  content={<ChartTooltipContent hideLabel />}
                                />
                                <Pie
                                  data={chartData}
                                  dataKey="visitors"
                                  nameKey="browser"
                                  innerRadius={60}
                                  strokeWidth={5}
                                >
                                  <Label
                                    content={({ viewBox }) => {
                                      if (
                                        viewBox &&
                                        "cx" in viewBox &&
                                        "cy" in viewBox
                                      ) {
                                        return (
                                          <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                          >
                                            <tspan
                                              x={viewBox.cx}
                                              y={viewBox.cy}
                                              className="fill-foreground text-3xl font-bold"
                                            >
                                              {totalVisitors.toLocaleString()}
                                            </tspan>
                                            <tspan
                                              x={viewBox.cx}
                                              y={(viewBox.cy || 0) + 24}
                                              className="fill-muted-foreground"
                                            >
                                              Visitors
                                            </tspan>
                                          </text>
                                        );
                                      }
                                    }}
                                  />
                                </Pie>
                              </PieChart>
                            </ChartContainer>
                          </CardContent>
                          <CardFooter className="flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2 font-medium leading-none">
                              Trending up by 5.2% this month{" "}
                              <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="leading-none text-muted-foreground">
                              Showing total visitors for the last 6 months
                            </div>
                          </CardFooter>
                        </CarouselItem>
                        <CarouselItem>
                          <DataTable
                            qrData={[]}
                            refetchDataTable={function (): void {
                              throw new Error("Function not implemented.");
                            }}
                          />
                        </CarouselItem>
                        <CarouselItem>...</CarouselItem>
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </Card>
    </div>
  );
}
