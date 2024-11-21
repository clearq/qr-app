import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis } from "recharts";

interface VcardAnalysProps {
  id: string;
}

export const VcardAnalys = ({ id }: VcardAnalysProps) => {
  const [chartsData, setChartsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const response = await fetch(`/api/scans/${id}/1`);
      const data = await response.json();
      setChartsData(data.data);
      setLoading(false);
    }

    fetchData();
  }, [id]);

  const chartsConfig = {
    vcard: {
      label: "VCard",
      color: "#2b2b2b",
    },
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[95%] sm:w-[52%]">
      <Card>
        <ChartContainer
          config={chartsConfig}
          className="h-[200px] sm:h-[500px] w-[100%]"
        >
          <BarChart data={chartsData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 7)}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="count" fill="var(--color-vcard)" radius={4} />
          </BarChart>
        </ChartContainer>
      </Card>
    </div>
  );
};
