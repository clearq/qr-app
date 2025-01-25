"use client";
import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Product component
const Category = dynamic(() => import("@/components/category"), { ssr: false });

export default function CategoryPage() {
  const [shopId, setShopId] = useState<string | null>(null);

  useEffect(() => {
    const fetchShopId = async () => {
      try {
        const response = await fetch("/api/shop");
        if (!response.ok) throw new Error("Failed to fetch shops");
        const data = await response.json();

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
      <Category shopId={shopId} />
    </div>
  );
}
