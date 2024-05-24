'use client'
import { DataTable } from "./data-table";
import { useState, useEffect, useCallback } from "react";
import { IQR, IVCARD } from "@/typings";

export default function Dashboard() {
  const [qrData, setQrData] = useState<IQR[]>([]);
  const [vData, setVCardData] = useState<IVCARD[]>([]);
 
  const fetchData = useCallback(async() => {
    try {
      const qrResponse = await fetch("/api/qr");
      const qrJson = await qrResponse.json();
      setQrData(qrJson);

      const vCardResponse = await fetch("/api/saveVcard");
      const vCardJson = await vCardResponse.json();
      setVCardData(vCardJson);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  },[]);

  useEffect(() => {
    fetchData();
  }, []);

  const refetchDataTable = () => {
    fetchData();
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">URL Dashboard</h1>
      <DataTable vData={vData} qrData={qrData} refetchDataTable={refetchDataTable} />
    </div>
  );
}
