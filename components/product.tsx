/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useRef } from "react";
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
import { RichTextEditor } from "./RichTextEditor";
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
    { title: "", description: "", categoryId: "", itemId: "", image: "" }, // Add image field
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]); // Error state for validation

  // Fetch shops on mount
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const userResponse = await fetch("/api/profile"); // Fetch logged-in user info
        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const userData = await userResponse.json();
        const customerId = userData.customerId; // Store the logged-in customer ID

        const shopResponse = await fetch(`/api/shop?customerId=${customerId}`);
        if (!shopResponse.ok) throw new Error("Failed to fetch shops.");
        const shopData = await shopResponse.json();

        if (!Array.isArray(shopData.data)) {
          console.error("Expected an array but received:", shopData);
          setShops([]);
          return;
        }

        setShops(shopData.data);

        // Auto-select the first shop if no shop is already selected
        if (!selectedShopId && shopData.data.length > 0) {
          setSelectedShopId(shopData.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching shops:", error);
        toast({
          title: "Error fetching shops",
          description: "Failed to load shops. Please try again later.",
          variant: "destructive",
        });
        setShops([]);
      }
    };

    fetchShops();
  }, [setSelectedShopId, selectedShopId]);

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

  // Handle product field changes
  const handleProductChange = (
    index: number,
    field: "title" | "description" | "categoryId" | "itemId" | "image",
    value: string
  ) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  // Add a new product row
  const addProductRow = () => {
    setProducts([
      ...products,
      { title: "", description: "", categoryId: "", itemId: "", image: "" },
    ]);
  };

  // Remove a product row
  const removeProductRow = (index: number) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  // Handle image upload
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target?.result as string; // Get the base64-encoded image
        handleProductChange(index, "image", base64Image); // Save the base64 image to the form field
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  // Remove the uploaded image
  const handleRemoveImage = (index: number) => {
    handleProductChange(index, "image", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit products
  const submitProducts = async () => {
    let newErrors = products.map((product) =>
      product.title.trim() === "" ? "Title is required." : ""
    );

    setErrors(newErrors); // Update the error state

    // If there are any errors, stop the submission
    if (newErrors.some((error) => error !== "")) {
      toast({
        variant: "destructive",
        title: "Missing required fields!",
        description: "Please fill in all required fields before submitting.",
      });
      return;
    }

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
        body: JSON.stringify({
          products: products.map((product) => ({
            title: product.title,
            description: product.description,
            categoryId: product.categoryId,
            itemId: product.itemId,
            image: product.image,
          })),
          shopId: selectedShopId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Products created successfully!",
          description: `${new Date().toLocaleDateString()}`,
        });
        router.replace("/shop/products/datatable");
        setProducts([
          { title: "", description: "", categoryId: "", itemId: "", image: "" },
        ]);
        setErrors([]); // Reset errors
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
      <CardTitle className="text-2xl">Create Items</CardTitle>
      <CardHeader className="relative right-5 mt-10">
        <CardTitle className="text-3xl">New Item</CardTitle>
        <CardDescription>Add a new item here</CardDescription>
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
            {/* Image Upload */}
            <div>
              <label
                htmlFor={`image-upload-${index}`}
                className="cursor-pointer"
              >
                {/* Title */}
                <div>
                  <Input
                    name={`product-title-${index}`}
                    value={product.title}
                    onChange={(e) =>
                      handleProductChange(index, "title", e.target.value)
                    }
                    placeholder="Enter title"
                    className="w-full mb-2"
                    disabled={isSubmitting}
                  />
                </div>
                {product.image ? (
                  <div className="relative">
                    <img
                      src={product.image}
                      alt="Uploaded"
                      className="w-[150px] h-[150px] object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="w-[150px] h-[150px] border-2 border-dashed rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Upload Image</span>
                  </div>
                )}
              </label>
              <input
                id={`image-upload-${index}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, index)}
                ref={fileInputRef}
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
                className="min-h-[200px]"
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
                disabled={isSubmitting || products.length === 1}
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
