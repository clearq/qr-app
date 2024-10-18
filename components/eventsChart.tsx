import React, { useCallback, useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { Events } from "@prisma/client";
import { DataTable } from "@/app/(protected)/events/data-table";

export default function EventsChart() {
  const [eventsData, setEventstData] = useState<Events[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const eventsResponse = await fetch("/api/events");
      const eventsJson = await eventsResponse.json();
      setEventstData(eventsJson);
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
                eventData={eventsData}
                refetchDataTable={refetchDataTable}
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </Card>
    </>
  );
}
