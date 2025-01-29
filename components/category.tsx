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
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext"; // Import the useLanguage hook

interface Shop {
  id: string;
  name: string;
}

interface CategoryProps extends React.HTMLAttributes<HTMLDivElement> {
  shopId?: string; // Add shopId as an optional prop
}

const Category = ({ className, shopId: initialShopId }: CategoryProps) => {
  const [categories, setCategories] = useState([{ name: "" }]); // Array for multiple categories
  const [shops, setShops] = useState<Shop[]>([]); // List of shops
  const [selectedShopId, setSelectedShopId] = useState<string | null>(
    initialShopId || null
  ); // Selected shop ID
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingShops, setIsLoadingShops] = useState(true); // Loading state for shops
  const router = useRouter();
  const { translations } = useLanguage(); // Use the translations

  // Fetch shops on component mount
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch("/api/shop");
        if (!response.ok) throw new Error("Failed to fetch shops");
        const data = await response.json();

        if (!Array.isArray(data.data)) {
          console.error("Expected an array but received:", data);
          setShops([]);
          return;
        }

        setShops(data.data); // Use data.data

        // Pre-select the shop if initialShopId is provided
        if (initialShopId && data.data.length > 0) {
          setSelectedShopId(initialShopId);
        }
      } catch (error) {
        console.error("Error fetching shops:", error);
        toast({
          variant: "destructive",
          title: translations.error,
          description: translations.failedToFetchShops,
        });
      } finally {
        setIsLoadingShops(false);
      }
    };

    fetchShops();
  }, [initialShopId, translations]); // Add initialShopId and translations as dependencies

  const handleCategoryChange = (index: number, value: string) => {
    const updatedCategories = [...categories];
    updatedCategories[index].name = value;
    setCategories(updatedCategories);
  };

  const addCategoryField = () => {
    setCategories([...categories, { name: "" }]);
  };

  const removeCategoryField = (index: number) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
  };

  const submitCategories = async () => {
    if (!selectedShopId) {
      toast({
        variant: "destructive",
        title: translations.error,
        description: translations.selectShopBeforeSubmit,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categories, shopId: selectedShopId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: translations.categoriesCreatedSuccessfully,
          description: new Date().toLocaleDateString(),
        });
        router.replace("/shop");
        setCategories([{ name: "" }]); // Clear all inputs after success
      } else {
        toast({
          variant: "destructive",
          title: translations.errorCreatingCategories,
          description: data.error || translations.somethingWentWrong,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: translations.somethingWentWrong,
        description: new Date().toLocaleDateString(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mt-16 h-full p-4 sm:pl-[260px]">
      <CardTitle className="text-2xl">{translations.createCategory}</CardTitle>
      <CardHeader className="relative right-5 mt-10">
        <CardTitle className="text-3xl">{translations.newCategories}</CardTitle>
        <CardDescription>{translations.addMultipleCategories}</CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitCategories();
        }}
        className="w-full space-y-4"
      >
        {/* Shop Selection Dropdown */}
        <div>
          <Select
            value={selectedShopId || ""} // Set the value of the dropdown
            onValueChange={(value) => {
              setSelectedShopId(value);
            }}
            disabled={isLoadingShops || isSubmitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={translations.selectShop} />
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

        {/* Category Input Fields */}
        {categories.map((category, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                name={`category-${index}`}
                value={category.name}
                onChange={(e) => handleCategoryChange(index, e.target.value)}
                placeholder={translations.enterCategoryName}
                className="mb-2"
                disabled={isSubmitting || !selectedShopId} // Disable if no shop is selected
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              onClick={() => removeCategoryField(index)}
              disabled={
                isSubmitting || categories.length === 1 || !selectedShopId
              } // Prevent removing last field or if no shop is selected
            >
              {translations.remove}
            </Button>
          </div>
        ))}

        {/* Add Another Category Button */}
        <div>
          <Button
            type="button"
            variant="outline"
            className="w-full md:w-auto"
            onClick={addCategoryField}
            disabled={isSubmitting || !selectedShopId} // Disable if no shop is selected
          >
            {translations.addAnotherCategory}
          </Button>
        </div>

        {/* Save All Button */}
        <div>
          <Button
            type="submit"
            className="w-full mt-3 md:w-auto"
            disabled={isSubmitting || !selectedShopId} // Disable if no shop is selected
          >
            {isSubmitting ? translations.saving : translations.saveAll}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Category;
