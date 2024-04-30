'use client'
import { prisma } from "@/lib/db";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [qrCodes, setQRCodes] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const qrCodesData = await prisma.qr.findMany({
          include: {
            customer: true, 
          },
        });
    
        console.log("QR Codes Data:", qrCodesData);
    
        setQRCodes(qrCodesData);
      } catch (error) {
        console.error("Error fetching QR codes:", error);
      }
    };
    

    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">QR Code Dashboard</h1>
      <DataTable />
    </div>
  );
}
