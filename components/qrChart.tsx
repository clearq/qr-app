import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { Label, Pie, PieChart } from "recharts";
import { DataTable } from "@/app/(protected)/dashboard/data-table";
import { IQR } from "@/typings";

export default function QrChart() {
  const [qrData, setQrData] = useState<IQR[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const qrResponse = await fetch("/api/qr");
      const qrJson = await qrResponse.json();
      setQrData(qrJson);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetchDataTable = () => {
    fetchData();
  };

  return (
    <Card className="w-[97%] sm:w-full ">
      <Carousel>
        <CarouselContent>
          <CarouselItem className="p-4 sm:px-14 sm:py-5">
            <DataTable qrData={qrData} refetchDataTable={refetchDataTable} />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </Card>
  );
}
