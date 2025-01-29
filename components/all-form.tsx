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
import { useRouter } from "next/navigation";
import { Progress } from "./ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"; // Example chart library (Recharts)
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext"; // Import the useLanguage hook
import { Skeleton } from "./ui/skeleton";

interface AllFormProps {
  id: string; // Add id as a prop
}

export default function AllForm({ id }: AllFormProps) {
  const [userData, setUserData] = React.useState(null);
  const [shopStats, setShopStats] = React.useState(null); // State for shop statistics
  const [eventStats, setEventStats] = React.useState(null); // State for event statistics
  const [loading, setLoading] = React.useState(true); // Loading state
  const [error, setError] = React.useState(null); // Error state
  const [chartData, setChartData] = React.useState([]); // State for chart data
  const router = useRouter();
  const { translations } = useLanguage(); // Use the translations

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the user data
        const userRes = await fetch("/api/profile");
        if (!userRes.ok) throw new Error("Failed to fetch user data");
        const userData = await userRes.json();
        setUserData(userData);

        // Ensure customerId is available
        if (!userData.customerId) {
          throw new Error("Customer ID not found in user data");
        }

        // Fetch product and ticket statistics for the logged-in user
        const statsRes = await fetch(
          `/api/scans?customerId=${userData.customerId}`
        );
        if (!statsRes.ok) throw new Error("Failed to fetch statistics");
        const statsData = await statsRes.json();
        setShopStats(statsData.shopStats);
        setEventStats(statsData.eventStats);

        // Fetch all analytics data (URL, VCard, Products, Tickets) for the logged-in user
        const analyticsRes = await fetch(
          `/api/scans?customerId=${userData.customerId}`
        );
        if (!analyticsRes.ok) throw new Error("Failed to fetch analytics data");
        const analyticsData = await analyticsRes.json();
        setChartData(analyticsData.monthlyCounts); // Set the chart data
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProfile = () => {
    router.push("/profile");
  };

  if (loading) {
    return (
      <div className="flex flex-col mt-16 w-full h-full p-4 sm:pl-[260px]">
        <div className="mt-24 flex flex-wrap items-start gap-4">
          {/* Skeleton for User Details Card */}
          <Card className="w-full sm:w-[30%] h-64">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
            </CardHeader>
            <CardFooter className="flex justify-end">
              <Skeleton className="h-10 w-10 rounded-full" />
            </CardFooter>
          </Card>

          {/* Skeleton for URL and VCard Cards */}
          <div className="flex flex-col w-full sm:w-[20%] gap-4">
            <Card className="w-full h-[171px]">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-12 w-full" />
              </CardHeader>
            </Card>

            <Card className="w-full">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-12 w-full" />
              </CardHeader>
            </Card>
          </div>

          {/* Skeleton for Event and Shop Cards */}
          <div className="flex flex-col w-full sm:w-[20%] gap-4">
            <Card className="w-full">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-12 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-12 w-full" />
              </CardHeader>
            </Card>
          </div>
        </div>
        <div className="mt-10">
          <Card className="w-full">
            <CardHeader className="pb-2">
              <Skeleton className="h-[200px] sm:h-[500px] w-full" />
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  // Define colors and labels for each analytics type
  const chartsConfig = {
    url: {
      label: translations.link,
      color: "#D4AF37", // Gold
    },
    vcard: {
      label: translations.vcard,
      color: "#151515", // Black
    },
    product: {
      label: translations.products,
      color: "#4169E1", // Brown
    },
    ticket: {
      label: translations.tickets,
      color: "#B22222", // Light Blue
    },
  };

  return (
    <div className="flex flex-col mt-16 w-full h-full p-4 sm:pl-[260px]">
      <CardTitle className="text-2xl">{translations.overview}</CardTitle>
      <main className="mt-24 flex flex-wrap items-start gap-4">
        {userData ? (
          <>
            {/* User Details Card */}
            <Card className="w-full sm:w-[30%] h-64">
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
                </CardDescription>
              </CardHeader>
              <CardFooter className=" flex justify-end">
                {" "}
                {/* Align the icon to the right */}
                <Button
                  onClick={handleProfile}
                  variant="ghost" // Use a ghost variant for a minimal look
                  size="icon" // Make the button circular and icon-sized
                  className="rounded-full" // Ensure the button is circular
                >
                  <User className="h-5 w-5" /> {/* Use the User icon */}
                </Button>
              </CardFooter>
            </Card>

            {/* URL and VCard Cards */}
            <div className="flex flex-col w-full sm:w-[20%] gap-4">
              {/* URL Count Card */}
              <Card className="w-full h-[171px]">
                <CardHeader className="pb-2">
                  <CardDescription className="text-l font-semibold">
                    {translations.link}
                  </CardDescription>
                  <CardTitle className="text-5xl text-[#937100] flex justify-center items-center">
                    {
                      //@ts-ignore
                      userData._count.qr
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent></CardContent>
                <CardFooter></CardFooter>
              </Card>

              {/* VCard Count Card */}
              <Card className="w-full">
                <CardHeader className="pb-2">
                  <CardDescription className="text-l font-semibold">
                    {translations.vcard}
                  </CardDescription>
                  <CardTitle className="text-5xl text-[#937100] flex justify-center items-center">
                    {
                      //@ts-ignore
                      userData._count.vcard
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent></CardContent>
                <CardFooter></CardFooter>
              </Card>
            </div>

            {/* Event and Shop Cards */}
            <div className="flex flex-col w-full sm:w-[20%] gap-4">
              {/* Event Statistics Card */}
              <Card className="w-full">
                <CardHeader className="pb-2">
                  <CardDescription className="text-l font-semibold">
                    {translations.events}
                  </CardDescription>
                  <CardTitle className="text-5xl text-[#937100] flex justify-center items-center">
                    {
                      //@ts-ignore
                      eventStats?.totalEvents || 0
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    {translations.upcomingEvents}:{" "}
                    {
                      //@ts-ignore
                      eventStats?.upcomingEvents || 0
                    }
                  </p>
                  <p className="text-sm text-gray-500">
                    {translations.pastEvents}:{" "}
                    {
                      //@ts-ignore
                      eventStats?.pastEvents || 0
                    }
                  </p>
                </CardContent>
              </Card>

              {/* Shop Statistics Card */}
              <Card className="w-full">
                <CardHeader className="pb-2">
                  <CardDescription className="text-l font-semibold">
                    {translations.businessUnit}
                  </CardDescription>
                  <CardTitle className="text-5xl text-[#937100] flex justify-center items-center">
                    {
                      //@ts-ignore
                      shopStats?.totalShops || 0
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent></CardContent>
                <CardFooter></CardFooter>
              </Card>
            </div>
          </>
        ) : (
          <div>{translations.noUserDataFound}</div>
        )}
      </main>

      {/* Analytics Section */}
      <div className="mt-8 w-full">
        <h2 className="text-xl font-semibold mb-4">{translations.analytics}</h2>

        {/* Chart */}
        <Card className="w-full h-full">
          <CardContent className="p-6">
            <ChartContainer
              config={chartsConfig}
              className="h-[200px] sm:h-[500px] w-[100%]"
            >
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)} // Format month to "MMM"
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="url" fill="var(--color-url)" radius={4} />
                <Bar dataKey="vcard" fill="var(--color-vcard)" radius={4} />
                <Bar dataKey="product" fill="var(--color-product)" radius={4} />
                <Bar dataKey="ticket" fill="var(--color-ticket)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
