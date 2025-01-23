/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { EVENTS } from "@/typings";

export default function event() {
  const [eData, setEventsData] = useState<EVENTS[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const eventResponse = await fetch("/api/events");
      const eventJSON = await eventResponse.json();
      setEventsData(eventJSON);
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
    <div>
      <DataTable eventData={eData} refetchDataTable={refetchDataTable} />
    </div>
  );
}
