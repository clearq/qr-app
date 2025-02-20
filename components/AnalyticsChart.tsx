"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardTitle, CardContent } from "@/components/ui/card";

// Define the TypeScript types
interface ProductSales {
  id: string;
  name: string;
  scanCount: number; // Number of scans (sales)
}

const AnalyticsChart = () => {
  const [data, setData] = useState<ProductSales[]>([]);

  // Simulating data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product scan/sales data from API
        const response = await fetch("/api/analytics");
        if (!response.ok) throw new Error("Failed to fetch analytics data.");
        const salesData = await response.json();

        // Map API response to required format
        const formattedData = salesData.map((product: any) => ({
          id: product.id,
          name: product.name,
          scanCount: product.scanCount,
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="p-4">
      <CardTitle className="text-2xl text-center mb-4">
        📊 Product Analytics
      </CardTitle>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: "#555" }}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="scanCount" fill="#4F46E5" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
