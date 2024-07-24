"use client";
import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  ListFilter,
  MoreVertical,
  TrendingUp,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { saveAs } from "file-saver";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ICUSTOMER, IQR, IVCARD } from "@/typings";
import { useRouter, useSearchParams } from "next/navigation";
import QRCode from "qrcode.react";
import { toast } from "./ui/use-toast";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Area, AreaChart, CartesianGrid, Label, Pie, PieChart, XAxis } from "recharts"
import { Qr, VCard } from "@prisma/client";


export default function AllForm() {
  const params = useSearchParams();
  
  const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 190, fill: "var(--color-other)" },
  ]
  
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
  } satisfies ChartConfig
  
  const chartDatas = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ]
  const chartConfigs = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig
  
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [])

  const id = params.get("id");
  const [userData, setUserData] = React.useState(null);
  const router = useRouter();
  const [vcardData, setVcardData] = React.useState<VCard>();
  const [qrData, setQRData] = React.useState<Qr>();
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
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
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
                  <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 gap-1 text-sm"
                        >
                          <ListFilter className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only">Filter</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked>
                          Fulfilled
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>
                          Declined
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>
                          Refunded
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1 text-sm"
                    >
                      <File className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only">Export</span>
                    </Button>
                  </div>
                </div>
                <TabsContent value="Qr">
                  <Card x-chunk="dashboard-05-chunk-3">
                    <Carousel>
                      <CarouselContent>
                        <CarouselItem>
                          <div>
                          {qrData?.tag}
                          </div>
                          <div
                            ref={qrRef}
                            className="flex flex-col items-center justify-center mt-7 mb-7"
                          >
                            <QRCode
                              value={`https://qrgen.clearq.se/qr/details?id=${qrData?.id}`}
                              size={window.innerWidth > 768 ? 500 : 300}
                              renderAs="canvas"
                              // includeMargin={true}
                              imageSettings={{
                                //@ts-ignore
                                src: logo
                                  ? logo.toString()
                                  : qrData?.logoType,
                                height: 75,
                                width: 75,
                                excavate: true,
                              }}
                              bgColor="rgba(0,0,0,0)"
                              fgColor="#000000"
                            />
                            <div className="flex flex-row space-x-4 justify-center items-center mt-6">
                              <Button
                                onClick={() => downloadQRCode("png")}
                                className=""
                              >
                                Download PNG
                              </Button>
                              <Button onClick={copyUrlToClipboard}>
                                Copy URL
                              </Button>
                            </div>
                            {/* <Link href={'/'}>
                    <Image className="mt-5" alt="appleWallet" width={150} height={150} src={'/image/appleWallet.svg'} />
                    </Link> */}
                          </div>
                        </CarouselItem>
                        <CarouselItem>
                        <div>
                          {qrData?.tag}
                          </div>
                          <div
                            ref={qrRef}
                            className="flex flex-col items-center justify-center mt-7 mb-7"
                          >
                            <QRCode
                              value={`https://qrgen.clearq.se/qr/details?id=${qrData?.id}`}
                              size={window.innerWidth > 768 ? 500 : 300}
                              renderAs="canvas"
                              // includeMargin={true}
                              imageSettings={{
                                //@ts-ignore
                                src: logo
                                  ? logo.toString()
                                  : qrData?.logoType,
                                height: 75,
                                width: 75,
                                excavate: true,
                              }}
                              bgColor="rgba(0,0,0,0)"
                              fgColor="#000000"
                            />
                            <div className="flex flex-row space-x-4 justify-center items-center mt-6">
                              <Button
                                onClick={() => downloadQRCode("png")}
                                className=""
                              >
                                Download PNG
                              </Button>
                              <Button onClick={copyUrlToClipboard}>
                                Copy URL
                              </Button>
                            </div>
                            {/* <Link href={'/'}>
                    <Image className="mt-5" alt="appleWallet" width={150} height={150} src={'/image/appleWallet.svg'} />
                    </Link> */}
                          </div>
                        </CarouselItem>
                        <CarouselItem>
                          <div>
                          {qrData?.tag}
                          </div>
                          <div
                            ref={qrRef}
                            className="flex flex-col items-center justify-center mt-7 mb-7"
                          >
                            <QRCode
                              value={`https://qrgen.clearq.se/qr/details?id=${qrData?.id}`}
                              size={window.innerWidth > 768 ? 500 : 300}
                              renderAs="canvas"
                              // includeMargin={true}
                              imageSettings={{
                                //@ts-ignore
                                src: logo
                                  ? logo.toString()
                                  : qrData?.logoType,
                                height: 75,
                                width: 75,
                                excavate: true,
                              }}
                              bgColor="rgba(0,0,0,0)"
                              fgColor="#000000"
                            />
                            <div className="flex flex-row space-x-4 justify-center items-center mt-6">
                              <Button
                                onClick={() => downloadQRCode("png")}
                                className=""
                              >
                                Download PNG
                              </Button>
                              <Button onClick={copyUrlToClipboard}>
                                Copy URL
                              </Button>
                            </div>
                            {/* <Link href={'/'}>
                    <Image className="mt-5" alt="appleWallet" width={150} height={150} src={'/image/appleWallet.svg'} />
                    </Link> */}
                          </div>
                        </CarouselItem>
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            <div>
              {/* <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
                <CardHeader className="flex flex-row items-start bg-muted/50">
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                      Order Oe31b70H
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Copy className="h-3 w-3" />
                        <span className="sr-only">Copy Order ID</span>
                      </Button>
                    </CardTitle>
                    <CardDescription>Date: November 23, 2023</CardDescription>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <Button size="sm" variant="outline" className="h-8 gap-1">
                      <Truck className="h-3.5 w-3.5" />
                      <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                        Track Order
                      </span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                          <span className="sr-only">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Export</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Trash</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                  <div className="grid gap-3">
                    <div className="font-semibold">Order Details</div>
                    <ul className="grid gap-3">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Glimmer Lamps x <span>2</span>
                        </span>
                        <span>$250.00</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Aqua Filters x <span>1</span>
                        </span>
                        <span>$49.00</span>
                      </li>
                    </ul>
                    <Separator className="my-2" />
                    <ul className="grid gap-3">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>$299.00</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>$5.00</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span>$25.00</span>
                      </li>
                      <li className="flex items-center justify-between font-semibold">
                        <span className="text-muted-foreground">Total</span>
                        <span>$329.00</span>
                      </li>
                    </ul>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-3">
                      <div className="font-semibold">Shipping Information</div>
                      <address className="grid gap-0.5 not-italic text-muted-foreground">
                        <span>Liam Johnson</span>
                        <span>1234 Main St.</span>
                        <span>Anytown, CA 12345</span>
                      </address>
                    </div>
                    <div className="grid auto-rows-max gap-3">
                      <div className="font-semibold">Billing Information</div>
                      <div className="text-muted-foreground">
                        Same as shipping address
                      </div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-semibold">Customer Information</div>
                    <dl className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Customer</dt>
                        <dd>Liam Johnson</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Email</dt>
                        <dd>
                          <a href="mailto:">liam@acme.com</a>
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Phone</dt>
                        <dd>
                          <a href="tel:">+1 234 567 890</a>
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-semibold">Payment Information</div>
                    <dl className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <dt className="flex items-center gap-1 text-muted-foreground">
                          <CreditCard className="h-4 w-4" />
                          Visa
                        </dt>
                        <dd>**** **** **** 4532</dd>
                      </div>
                    </dl>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                  <div className="text-xs text-muted-foreground">
                    Updated <time dateTime="2023-11-23">November 23, 2023</time>
                  </div>
                  <Pagination className="ml-auto mr-0 w-auto">
                    <PaginationContent>
                      <PaginationItem>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                          <span className="sr-only">Previous Order</span>
                        </Button>
                      </PaginationItem>
                      <PaginationItem>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                          <span className="sr-only">Next Order</span>
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </CardFooter>
              </Card> */}
              <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
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
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
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
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
            </div>
          </main>
        </div>
      </Card>
    </div>
  );
}
