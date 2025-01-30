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

interface TicketAnalyticsProps {
  data: { ticket: string; count: number }[];
}

export function TicketAnalytics({ data }: TicketAnalyticsProps) {
  const { translations } = useLanguage();

  const chartConfig = {
    ticket: {
      label: translations.tickets,
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translations.ticketAnalytics}</CardTitle>
        <CardDescription>
          {translations.ticketAnalyticsDescription}
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
              dataKey="ticket"
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
            <Bar dataKey="count" fill="var(--color-ticket)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {translations.trendingUp} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {translations.ticketAnalyticsFooter}
        </div>
      </CardFooter>
    </Card>
  );
}
