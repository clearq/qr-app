"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "@/components/ui/use-toast";
import { CardDescription, CardHeader, CardTitle } from "./ui/card";

export const EventsComponent = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => {
  const validation = useFormik({
    initialValues: {
      eventsTitle: "",
      description: "",
      numberOfTables: 0,
      availabilityPerTable: 0 || "",
    },
    validationSchema: yup.object({
      eventsTitle: yup.string().required("Title is required"),
      description: yup.string().required("Description is required"),
      numberOfTables: yup.number(),
      availabilityPerTable: yup.number(),
    }),
    onSubmit: (values) => {
      fetch("/api/events", {
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
              title: `Created successfully!`,
              description: `${new Date().toLocaleDateString()}`,
            });
            window.location.reload();
          } else {
            toast({
              variant: "destructive",
              title: `Error creating Event`,
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
    <div className="w-full h-full p-4 sm:pl-[260px]">
      {" "}
      <CardHeader>
        <CardTitle className="text-6xl">New Event</CardTitle>
        <CardDescription>Add your events here</CardDescription>
      </CardHeader>
      <form onSubmit={validation.handleSubmit} className="w-full space-y-4">
        <div>
          <label htmlFor="eventsTitle" className="block">
            Event Title
            <span className="text-red-600">*</span>
          </label>
          <Input
            id="eventsTitle"
            value={validation.values.eventsTitle}
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            placeholder="Enter event title"
            className="mb-2"
          />
          <label htmlFor="eventDescription" className="block">
            Description
            <span className="text-red-600">*</span>
          </label>
          <Input
            id="description"
            value={validation.values.description}
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            placeholder="Enter event description"
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="numberOfTables">Number of tables</label>
          <Input
            id="numberOfTables"
            name="numberOfTables"
            placeholder="Number of tables"
            type="number"
            value={validation.values.numberOfTables}
            onChange={(e) => {
              const value = Math.max(0, parseInt(e.target.value || "0", 10)); // Ensure value doesn't go below 0
              validation.setFieldValue("numberOfTables", value);
            }}
            onBlur={validation.handleBlur}
            min={0} // Prevents typing values below 0 in supported browsers
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="availabilityPerTable">Seats per table</label>
          <Input
            id="availabilityPerTable"
            name="availabilityPerTable"
            placeholder="Available Plases"
            type="number"
            value={validation.values.availabilityPerTable}
            onChange={(e) => {
              const value = Math.max(0, parseInt(e.target.value || "0", 10)); // Ensure value doesn't go below 0
              validation.setFieldValue("availabilityPerTable", value);
            }}
            onBlur={validation.handleBlur}
            min={0} // Prevents typing values below 0 in supported browsers
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
