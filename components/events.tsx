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
    },
    validationSchema: yup.object({
      eventsTitle: yup.string().nullable(),
      description: yup.string().nullable(),
    }),
    onSubmit: (values) => {
      fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventsTitle: values.eventsTitle,
          description: values.description,
        }),
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
    <div>
      <CardHeader>
        <CardTitle className="text-6xl">New Event</CardTitle>
        <CardDescription>Add your events here</CardDescription>
      </CardHeader>
      <form onSubmit={validation.handleSubmit} className="w-full space-y-4">
        <div>
          <label htmlFor="eventsTitle" className="block">
            Event Title
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
          </label>
          <Input
            id="description"
            value={validation.values.description}
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            placeholder="Enter event description"
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
