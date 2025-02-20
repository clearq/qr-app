"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "@/components/ui/use-toast";
import { CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useSession } from "next-auth/react"; // Import useSession to get the authenticated user

export const ShopComponent = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { data: session } = useSession(); // Get the authenticated user's session

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
      if (!session?.user?.id) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to create a shop.",
        });
        return;
      }

      // Include the customerId from the session in the request body
      const requestBody = {
        ...values,
        customerId: session.user.id, // Automatically add the customerId
      };

      fetch("/api/shop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then(async (response) => {
          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            toast({
              title: `Shop created successfully!`,
              description: `${new Date().toLocaleDateString()}`,
            });
            window.location.replace("/shop");
          } else {
            toast({
              variant: "destructive",
              title: `Error creating Shop`,
              description: data.error || "Something went wrong.",
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
    <div className="w-full mt-20 h-full p-4 sm:pl-[260px]">
      {" "}
      <CardTitle className="text-2xl">Create Unit</CardTitle>
      <CardHeader>
        <CardTitle className="text-3xl">New Unit</CardTitle>
        <CardDescription>Add a new business unit here</CardDescription>
      </CardHeader>
      <form onSubmit={validation.handleSubmit} className="w-full space-y-4">
        <div>
          <label htmlFor="name" className="block">
            Unit Name
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
