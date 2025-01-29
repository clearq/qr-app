"use client";
import { DataTable } from "./data-table";
import { useState, useEffect, useCallback } from "react";
import { PRODUCT } from "@/typings";
import { toast } from "@/components/ui/use-toast";

export default function Dashboard() {
  const [pData, setProductData] = useState<PRODUCT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);

  const fetchData = useCallback(async (shopId: string | null) => {
    setLoading(true);
    try {
      const url = shopId ? `/api/product?shopId=${shopId}` : "/api/product";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch products.");
      }
      const data: PRODUCT[] = await response.json();
      setProductData(data);
    } catch (error) {
      console.error("Error fetching data", error);
      toast({
        title: "Error fetching products",
        description: "Failed to load products. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(selectedShopId);
  }, []);

  const refetchDataTable = () => {
    fetchData(selectedShopId);
  };

  return (
    <div className="">
      <DataTable
        productData={pData}
        refetchDataTable={refetchDataTable}
        selectedShopId={selectedShopId}
        setSelectedShopId={setSelectedShopId}
      />
    </div>
  );
}
