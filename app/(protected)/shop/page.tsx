"use client";
import React, { useCallback, useEffect, useState } from "react";
import DataTable from "./data-table";
import { SHOP } from "@/typings";
import { useSession } from "next-auth/react"; // Assuming you're using next-auth for session management

export default function Event() {
  const { data: session } = useSession(); // Get the session data
  const [sData, setShopData] = useState<SHOP[]>([]);
  const [customerId, setCustomerId] = useState<string>("");

  // Fetch shops by customerId
  const fetchData = useCallback(async () => {
    if (!customerId) return; // Don't fetch if customerId is not set

    try {
      const shopResponse = await fetch(`/api/shop?customerId=${customerId}`);
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
  }, [customerId]);

  // Set customerId from session when the component mounts
  useEffect(() => {
    if (session?.user?.id) {
      setCustomerId(session.user.id);
    }
  }, [session]);

  // Fetch data when customerId changes
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
