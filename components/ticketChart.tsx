import React, { useCallback, useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { Ticket } from "@prisma/client";
import { DataTable } from "@/app/(protected)/ticket/data-table";
export default function VcardChart() {
  const [ticketData, setTicketData] = useState<Ticket[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const ticketResponse = await fetch("/api/ticketScan");
      const ticketJson = await ticketResponse.json();
      setTicketData(ticketJson);
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
                ticketData={ticketData}
                refetchDataTable={refetchDataTable}
                titleData={[]}
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </Card>
    </>
  );
}
