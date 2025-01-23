"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Product component
const Product = dynamic(() => import("@/components/product"), { ssr: false });

export default function ProductsPage() {
  const [shopId, setShopId] = useState<string | null>(null);

  useEffect(() => {
    const fetchShopId = async () => {
      try {
        const response = await fetch("/api/shop");
        if (!response.ok) throw new Error("Failed to fetch shops");
        const data = await response.json();
        console.log("API Response:", data);

        if (Array.isArray(data.data) && data.data.length > 0) {
          setShopId(data.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching shop data:", error);
      }
    };

    fetchShopId();
  }, []);

  if (!shopId) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Product shopId={shopId} />
    </div>
  );
}
