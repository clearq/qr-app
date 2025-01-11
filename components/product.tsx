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

interface Category {
  id: string;
  name: string;
}

interface ProductProps extends React.HTMLAttributes<HTMLDivElement> {
  shopId: string; // Pass shopId as a prop
}

export const Product = ({ className, shopId }: ProductProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState([
    { title: "", description: "", categoryId: "" },
  ]); // Array for multiple products
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/category?shopId=${shopId}`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          variant: "destructive",
          title: `Error fetching categories`,
          description: "Not able to find any categories",
        });
      }
    };

    fetchCategories();
  }, [shopId]);

  const handleProductChange = (
    index: number,
    field: "title" | "description" | "categoryId",
    value: string
  ) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value; // TypeScript now knows `field` is one of the valid keys
    setProducts(updatedProducts);
  };

  const addProductRow = () => {
    setProducts([...products, { title: "", description: "", categoryId: "" }]);
  };

  const removeProductRow = (index: number) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const submitProducts = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products, shopId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: `Products created successfully!`,
          description: `${new Date().toLocaleDateString()}`,
        });
        window.location.reload();
        setProducts([{ title: "", description: "", categoryId: "" }]); // Clear all inputs after success
      } else {
        toast({
          variant: "destructive",
          title: `Error creating products`,
          description: data.error || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: `Something went wrong`,
        description: `${new Date().toLocaleDateString()}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()} // Prevent dialog from closing
      className={className}
    >
      <CardHeader>
        <CardTitle className="text-6xl">New Products</CardTitle>
        <CardDescription>Add multiple products here</CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitProducts();
        }}
        className="w-full space-y-4"
      >
        {products.map((product, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                name={`product-title-${index}`}
                value={product.title}
                onChange={(e) =>
                  handleProductChange(index, "title", e.target.value)
                }
                placeholder="Enter title"
                className=""
                disabled={isSubmitting}
              />
            </div>
            <div className="flex-1">
              <Input
                name={`product-description-${index}`}
                value={product.description}
                onChange={(e) =>
                  handleProductChange(index, "description", e.target.value)
                }
                placeholder="Enter product description"
                className=""
                disabled={isSubmitting}
              />
            </div>
            <div className="flex-1">
              <Select
                onValueChange={(value) =>
                  handleProductChange(index, "categoryId", value)
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
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
            </div>
            <Button
              type="button"
              variant="destructive"
              onClick={() => removeProductRow(index)}
              disabled={isSubmitting || products.length === 1} // Prevent removing last field
            >
              Remove
            </Button>
          </div>
        ))}
        <div>
          <Button
            type="button"
            variant="outline"
            className="w-full md:w-auto"
            onClick={addProductRow}
            disabled={isSubmitting}
          >
            Add Another Product
          </Button>
        </div>
        <div>
          <Button
            type="submit"
            className="w-full mt-3 md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save All"}
          </Button>
        </div>
      </form>
    </div>
  );
};
