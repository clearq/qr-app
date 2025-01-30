"use client";

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
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
import { TrendingUp } from "lucide-react";

interface VCardAnalyticsProps {
  data: { tag: string; count: number }[];
}

export function VCardAnalytics({ data }: VCardAnalyticsProps) {
  const { translations } = useLanguage();

  const chartConfig = {
    vcard: {
      label: translations.vcard,
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translations.vcardAnalytics}</CardTitle>
        <CardDescription>
          {translations.vcardAnalyticsDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              left: -20,
            }}
          >
            <XAxis type="number" dataKey="count" hide />
            <YAxis
              dataKey="tag"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => String(value).slice(0, 3)} // Convert value to string
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-vcard)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {translations.trendingUp} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {translations.vcardAnalyticsFooter}
        </div>
      </CardFooter>
    </Card>
  );
}
