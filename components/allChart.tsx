import React, { useEffect, useState } from "react";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card } from "./ui/card";

export default function AllChart() {
  const [chartsData, setChartsData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/scans');
      const data = await response.json();
      setChartsData(data);
    }

    fetchData();
  }, []);

  const chartsConfig = {
    url: {
      label: "URL",
      color: "#0197B2",
    },
    vcard: {
      label: "VCard",
      color: "#2b2b2b",
    },
  };

  return (
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
  );
}
