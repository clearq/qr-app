import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

interface VcardAnalysProps {
  id: string;
}

export const VcardAnalys = ({ id}: VcardAnalysProps) => { 
  const [chartsData, setChartsData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/scans/${id}`);
      const data = await response.json();
      setChartsData(data.vCardmonthlyCounts);
    }

    fetchData();
  }, [id]);
  
  const chartsConfig = {
    vcard: {
      label: "VCard",
      color: "#2b2b2b",
    },
  };

  return (
    <div className="w-[95%] sm:w-[52%]">
      <Card>
        <ChartContainer config={chartsConfig} className="h-[200px] sm:h-[500px] w-[100%]">
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
            <Bar dataKey="vcard" fill="var(--color-vcard)" radius={4} />
          </BarChart>
        </ChartContainer>
      </Card>
    </div>
  );
};
