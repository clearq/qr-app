import React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card } from "./ui/card";

export default function AllChart() {
  const chartsData = [
    { month: "January", url: 186, vcard: 80 },
    { month: "February", url: 305, vcard: 200 },
    { month: "March", url: 237, vcard: 120 },
    { month: "April", url: 73, vcard: 190 },
    { month: "May", url: 209, vcard: 130 },
    { month: "June", url: 214, vcard: 140 },
  ];
  const chartsConfig = {
    url: {
      label: "URL",
      color: "#2563eb",
    },
    vcard: {
      label: "VCard",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  return (
    <>
      <Card>
        <ChartContainer config={chartsConfig} className="h-[500px] w-full">
          <BarChart accessibilityLayer data={chartsData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="url" fill="var(--color-url)" radius={4} />
            <Bar dataKey="vcard" fill="var(--color-vcard)" radius={4} />
          </BarChart>
        </ChartContainer>
      </Card>
    </>
  );
}
