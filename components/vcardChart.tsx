import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
} from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,

} from "./ui/carousel";

import { IVCARD } from "@/typings";
import { DataTable } from "@/app/(protected)/dashboardVcard/data-table";
export default function VcardChart() {
    const [vData, setVCardData] = useState<IVCARD[]>([]);

    const fetchData = useCallback(async () => {
      try {
        const vCardResponse = await fetch("/api/saveVcard");
        const vCardJson = await vCardResponse.json();
        setVCardData(vCardJson);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }, []);
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const refetchDataTable = () => {
      fetchData();
    };

  return (
    <>
      <Card
        className="w-full"
        x-chunk="dashboard-05-chunk-3"
      >
        <Carousel>
          <CarouselContent>
            <CarouselItem className="p-4 sm:px-14 sm:py-5">
            <DataTable vcardData={vData} refetchDataTable={refetchDataTable} />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </Card>
    </>
  );
}
