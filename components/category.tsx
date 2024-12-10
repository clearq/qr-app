"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryProps extends React.HTMLAttributes<HTMLDivElement> {
  shopId: string; // Pass shopId as a prop
}

export const Category = ({ className, shopId }: CategoryProps) => {
  const [categories, setCategories] = useState([{ name: "" }]); // Array for multiple categories
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categories, shopId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: `Categories created successfully!`,
          description: `${new Date().toLocaleDateString()}`,
        });
        window.location.reload();
        setCategories([{ name: "" }]); // Clear all inputs after success
      } else {
        toast({
          variant: "destructive",
          title: `Error creating Categories`,
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
        <CardTitle className="text-6xl">New Categories</CardTitle>
        <CardDescription>Add multiple categories here</CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitCategories();
        }}
        className="w-full space-y-4"
      >
        {categories.map((category, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                name={`category-${index}`}
                value={category.name}
                onChange={(e) => handleCategoryChange(index, e.target.value)}
                placeholder="Enter category name"
                className="mb-2"
                disabled={isSubmitting}
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              onClick={() => removeCategoryField(index)}
              disabled={isSubmitting || categories.length === 1} // Prevent removing last field
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
            onClick={addCategoryField}
            disabled={isSubmitting}
          >
            Add Another Category
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
