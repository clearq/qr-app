"use client";
import { DataTable } from "./data-table";
import { useState, useEffect, useCallback } from "react";
import { IQR, IVCARD } from "@/typings";

export default function Dashboard() {
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
    <div className="container mt-15 mx-auto py-10">
      <DataTable vcardData={vData} refetchDataTable={refetchDataTable} />
    </div>
  );
}
