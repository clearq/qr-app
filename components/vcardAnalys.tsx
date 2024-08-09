import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

export const VcardAnalys = ({ count }: { count: string }) => { 

  // Prepare the data for BarChart
  const chartsData = [
    { name: 'Visitors', vcard: count }
  ];

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
          <BarChart  accessibilityLayer data={chartsData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar className='' dataKey="vcard" fill="var(--color-vcard)" radius={4} />
          </BarChart>
        </ChartContainer>
      </Card>
    </div>
  );
};
