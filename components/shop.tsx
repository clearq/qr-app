"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "@/components/ui/use-toast";
import { CardDescription, CardHeader, CardTitle } from "./ui/card";

export const ShopComponent = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => {
  const validation = useFormik({
    initialValues: {
      name: "",
      address: "",
      description: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("Shop name is required"),
      address: yup.string(),
      description: yup.string(),
    }),
    onSubmit: (values) => {
      fetch("/api/shop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then(async (response) => {
          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            toast({
              title: `Shop created successfully!`,
              description: `${new Date().toLocaleDateString()}`,
            });
            window.location.reload();
          } else {
            toast({
              variant: "destructive",
              title: `Error creating Shop`,
              description: `${new Date().toLocaleDateString()}`,
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          toast({
            variant: "destructive",
            title: `Something went wrong`,
            description: `${new Date().toLocaleDateString()}`,
          });
        });
    },
  });

  return (
    <div>
      <CardHeader>
        <CardTitle className="text-6xl">New Shop</CardTitle>
        <CardDescription>Add a new shop here</CardDescription>
      </CardHeader>
      <form onSubmit={validation.handleSubmit} className="w-full space-y-4">
        <div>
          <label htmlFor="name" className="block">
            Shop Name
            <span className="text-red-600">*</span>
          </label>
          <Input
            id="name"
            value={validation.values.name}
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            placeholder="Enter shop name"
            className="mb-2"
          />
          <label htmlFor="address" className="block">
            Address
          </label>
          <Input
            id="address"
            value={validation.values.address}
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            placeholder="Enter shop address"
          />
          <label htmlFor="description" className="block">
            Description
          </label>
          <Input
            id="description"
            value={validation.values.description}
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            placeholder="Enter shop description"
          />
        </div>
        <div>
          <Button type="submit" className="w-full mt-3 md:w-auto">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};
