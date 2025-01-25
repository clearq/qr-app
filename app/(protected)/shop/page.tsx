"use client";
import React, { useCallback, useEffect, useState } from "react";
import DataTable from "./data-table";
import { SHOP } from "@/typings";

export default function Event() {
  const [sData, setShopData] = useState<SHOP[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const shopResponse = await fetch("/api/shop");
      if (!shopResponse.ok) {
        throw new Error("Failed to fetch shops");
      }
      const shopJSON = await shopResponse.json();

      if (!Array.isArray(shopJSON.data)) {
        console.error("Expected an array but received:", shopJSON);
        setShopData([]);
        return;
      }

      setShopData(shopJSON.data); // Use shopJSON.data
    } catch (error) {
      console.error("Error fetching data", error);
      setShopData([]);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetchDataTable = () => {
    fetchData();
  };

  return (
    <div>
      <DataTable shopData={sData} refetchDataTable={refetchDataTable} />
    </div>
  );
}
