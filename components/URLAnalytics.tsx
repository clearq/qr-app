"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useLanguage } from "@/context/LanguageContext";

interface URLAnalyticsProps {
  data: { month: string; url: number }[]; // Data structure matches your requirements
}

export function URLAnalytics({ data }: URLAnalyticsProps) {
  const { translations } = useLanguage();

  const chartConfig = {
    url: {
      label: translations.link, // Use translation for the label
      color: "#D4AF37", // Use your desired color
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>{translations.urlAnalytics}</CardTitle>
        <CardDescription>
          {translations.urlAnalyticsDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center text-gray-500">No data available</div>
        ) : (
          <ChartContainer
            className="h-[200px] sm:h-[500px] w-[100%]"
            config={chartConfig}
          >
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                accessibilityLayer
                data={data}
                layout="vertical" // Use vertical layout
                margin={{
                  left: -20, // Adjust margin for better alignment
                }}
              >
                <XAxis type="number" dataKey="url" hide /> {/* Hide X-axis */}
                <YAxis
                  dataKey="month"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) =>
                    value ? String(value).slice(0, 3) : ""
                  } // Format month to 3 letters
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="url" fill="var(--color-url)" radius={5} />{" "}
                {/* Use url as dataKey */}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {translations.trendingUp} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {translations.urlAnalyticsFooter}
        </div>
      </CardFooter> */}
    </Card>
  );
}
