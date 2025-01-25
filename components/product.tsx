"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "./RichTextEditor"; // Import the RichTextEditor
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

interface Shop {
  id: string;
  name: string;
}

interface ProductProps extends React.HTMLAttributes<HTMLDivElement> {
  shopId?: string; // Make shopId optional
}

const Product = ({ className, shopId: initialShopId }: ProductProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<string | null>(
    initialShopId || null
  );
  const [products, setProducts] = useState([
    { title: "", description: "", categoryId: "", itemId: "" }, // Add itemId
  ]); // Array for multiple products
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Fetch shops on mount
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch("/api/shop");
        if (!response.ok) throw new Error("Failed to fetch shops");
        const data = await response.json();

        if (!Array.isArray(data.data)) {
          console.error("Expected an array but received:", data);
          setShops([]); // Set to an empty array if the response is not an array
          return;
        }

        setShops(data.data); // Use data.data to match the API response structure

        // Pre-select the first shop if no initial shopId is provided
        if (!initialShopId && data.data.length > 0) {
          setSelectedShopId(data.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching shops:", error);
        toast({
          variant: "destructive",
          title: "Error fetching shops",
          description: "Failed to load shops. Please try again later.",
        });
      }
    };

    fetchShops();
  }, [initialShopId]);

  // Fetch categories when the selected shop changes
  useEffect(() => {
    if (selectedShopId) {
      const fetchCategories = async () => {
        try {
          const response = await fetch(
            `/api/category?shopId=${selectedShopId}`
          );
          if (!response.ok) throw new Error("Failed to fetch categories");
          const data = await response.json();
          setCategories(data);
        } catch (error) {
          console.error("Error fetching categories:", error);
          toast({
            variant: "destructive",
            title: "Error fetching categories",
            description: "Not able to find any categories",
          });
        }
      };

      fetchCategories();
    }
  }, [selectedShopId]);

  const handleProductChange = (
    index: number,
    field: "title" | "description" | "categoryId" | "itemId", // Add itemId
    value: string
  ) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value; // TypeScript now knows `field` is one of the valid keys
    setProducts(updatedProducts);
  };

  const addProductRow = () => {
    setProducts([
      ...products,
      { title: "", description: "", categoryId: "", itemId: "" }, // Add itemId
    ]);
  };

  const removeProductRow = (index: number) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const submitProducts = async () => {
    if (!selectedShopId) {
      toast({
        variant: "destructive",
        title: "No shop selected",
        description: "Please select a shop before submitting products.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products, shopId: selectedShopId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Products created successfully!",
          description: `${new Date().toLocaleDateString()}`,
        });
        router.replace("/shop/products/datatable");
        setProducts([
          { title: "", description: "", categoryId: "", itemId: "" },
        ]);
      } else {
        toast({
          variant: "destructive",
          title: "Error creating products",
          description: data.error || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: `${new Date().toLocaleDateString()}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mt-20 h-full p-4 sm:pl-[260px]">
      {" "}
      <CardHeader className="relative right-5 mt-10">
        <CardTitle className=" text-3xl">New Item</CardTitle>
        <CardDescription>Add a new items here</CardDescription>
      </CardHeader>
      {/* Shop Selector Dropdown */}
      <div className="mb-6">
        <Select
          value={selectedShopId || ""}
          onValueChange={(value) => setSelectedShopId(value)}
          disabled={isSubmitting}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a shop" />
          </SelectTrigger>
          <SelectContent>
            {shops.map((shop) => (
              <SelectItem key={shop.id} value={shop.id}>
                {shop.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitProducts();
        }}
        className="w-full space-y-6"
      >
        {products.map((product, index) => (
          <div key={index} className="space-y-4">
            {/* Title */}
            <div>
              <Input
                name={`product-title-${index}`}
                value={product.title}
                onChange={(e) =>
                  handleProductChange(index, "title", e.target.value)
                }
                placeholder="Enter title"
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            {/* Description (RichTextEditor) */}
            <div>
              <RichTextEditor
                value={product.description}
                onChange={(value) =>
                  handleProductChange(index, "description", value)
                }
                placeholder="Enter product description"
                disabled={isSubmitting}
                className="min-h-[200px]" // Set a minimum height for the editor
              />
            </div>

            {/* Business Unit ID (Optional) */}
            <div>
              <Input
                name={`business-unit-id-${index}`}
                value={product.itemId}
                onChange={(e) =>
                  handleProductChange(index, "itemId", e.target.value)
                }
                placeholder="Enter Article Number ID (optional)"
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            {/* Category Selector and Remove Button */}
            <div className="flex items-center gap-4">
              <Select
                onValueChange={(value) =>
                  handleProductChange(index, "categoryId", value)
                }
                disabled={isSubmitting}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeProductRow(index)}
                disabled={isSubmitting || products.length === 1} // Prevent removing last field
              >
                Remove
              </Button>
            </div>
          </div>
        ))}

        {/* Add Another Product and Save Buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={addProductRow}
            disabled={isSubmitting}
          >
            Add Another Product
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Product;
