'use client'
import { DataTable } from "./data-table";
import { useState, useEffect, useCallback } from "react";
import { getAllQrData } from "@/data/qr";
import { IQR } from "@/typings";

export default function Dashboard() {
  const [qrData, setQrData] = useState<IQR[]>([]);

  const fetchData = useCallback(async() => {
    await fetch("/api/qr").then((data) => data.json()).then((data) => setQrData(data))
  }, []);



  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">QR Code Dashboard</h1>
      <DataTable qrData={qrData} refetchDataTable={fetchData} />
    </div>
  );
}
