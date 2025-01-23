import React, { useCallback, useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import DataTable from "@/app/(protected)/shop/data-table";
import { Shop } from "@prisma/client";

export default function ShopChart() {
  const [shopData, setShoptData] = useState<Shop[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const shopResponse = await fetch("/api/shop");
      const shopJson = await shopResponse.json();
      setShoptData(shopJson);
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
      <Card className="w-[97%] sm:w-full " x-chunk="dashboard-05-chunk-3">
        <Carousel>
          <CarouselContent>
            <CarouselItem className="p-4 sm:px-14 sm:py-5">
              <DataTable
                //@ts-ignore
                shopData={shopData}
                refetchDataTable={refetchDataTable}
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </Card>
    </>
  );
}
