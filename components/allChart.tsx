import React, { useEffect, useState } from "react";
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

type ChartData = {
  month: string;
  url: number;
  vcard: number;
};

export default function AllChart() {
  const [chartsData, setChartsData] = useState<ChartData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch scan data from the API
        const response = await fetch("/api/scans");
        const scans = await response.json();

        // Aggregate data by month
        const aggregatedData = scans.reduce((acc: { [key: string]: { url: number; vcard: number } }, scan: any) => {
          // Extract month and year from scannedAt
          const date = new Date(scan.scannedAt);
          const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;

          // Initialize the month if it does not exist
          if (!acc[monthYear]) {
            acc[monthYear] = { url: 0, vcard: 0 };
          }

          // Aggregate counts based on type
          if (scan.type === 0) {
            acc[monthYear].url += scan.count;
          } else if (scan.type === 1) {
            acc[monthYear].vcard += scan.count;
          }

          return acc;
        }, {});

        // Transform the aggregated data into an array for the chart
        const formattedData = Object.keys(aggregatedData).map((key) => ({
          month: key,
          url: aggregatedData[key].url,
          vcard: aggregatedData[key].vcard,
        }));

        // Sort by month
        formattedData.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

        setChartsData(formattedData);
      } catch (error) {
        console.error("Error fetching scan data:", error);
      }
    }

    fetchData();
  }, []);

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
      <Card className="p-4">
        <ChartContainer config={chartsConfig} className="w-full">
          <BarChart data={chartsData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const [year, month] = value.split("-");
                const date = new Date(parseInt(year), parseInt(month) - 1);
                return date.toLocaleString('default', { month: 'short', year: 'numeric' });
              }}
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
