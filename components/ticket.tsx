"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { format, addDays } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Import the Select components
import { CardTitle } from "./ui/card";

interface Event {
  id: string;
  eventsTitle: string;
}

export const TicketComponent = ({
  selectedEvent,
}: {
  selectedEvent: { id: string; title: string } | null;
}) => {
  const today = new Date();
  const [events, setEvents] = useState<Event[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch("/api/events");
      const data = await response.json();

      // Extract the events array if the response is an object
      const eventsArray = data.events || data;
      setEvents(eventsArray);
    };
    fetchEvents();
  }, []);

  const validation = useFormik({
    initialValues: {
      eventId: selectedEvent?.id || "",
      ticketCount: 1,
      fromDate: format(today, "yyyy-MM-dd"),
      toDate: format(addDays(today, 20), "yyyy-MM-dd"),
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      eventId: yup.string().required("Please select an event"),
      ticketCount: yup
        .number()
        .min(1)
        .required("Enter the number of tickets to generate"),
      fromDate: yup.date().required("Start date is required"),
      toDate: yup.date().required("End date is required"),
    }),
    onSubmit: (values) => {
      // Format dates
      const formattedFromDate = values.fromDate
        ? new Date(values.fromDate).toISOString()
        : null;
      const formattedToDate = values.toDate
        ? new Date(values.toDate).toISOString()
        : null;

      fetch("/api/generate-tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: values.eventId,
          ticketCount: values.ticketCount,
          fromDate: formattedFromDate,
          toDate: formattedToDate,
        }),
      })
        .then(async (response) => {
          const data = await response.json();
          if (response.status === 201) {
            toast({
              title: `Tickets generated successfully!`,
              description: `${new Date().toLocaleDateString()}`,
            });
            router.replace("/events");
          } else {
            toast({
              variant: "destructive",
              title: `Error generating tickets`,
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
    <div className="w-full mt-20 h-full p-4 sm:pl-[260px]">
      {" "}
      <CardTitle className="text-2xl">Create Tickets</CardTitle>
      <form
        onSubmit={validation.handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="mt-20 w-full space-y-4"
      >
        <div className="grid grid-cols-2 gap-7">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="eventId">Select Event</Label>
            <Select
              value={validation.values.eventId}
              onValueChange={(value) =>
                validation.setFieldValue("eventId", value)
              }
              disabled={validation.isSubmitting}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(events) &&
                  events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.eventsTitle}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {validation.touched.eventId && validation.errors.eventId && (
              <div className="text-sm text-red-500">
                {validation.errors.eventId}
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="ticketCount">Number of Tickets</Label>
            <Input
              id="ticketCount"
              type="number"
              value={validation.values.ticketCount}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              placeholder="Enter number of tickets"
              min={1}
              className="w-full"
            />
            {validation.touched.ticketCount &&
              validation.errors.ticketCount && (
                <div className="text-sm text-red-500">
                  {validation.errors.ticketCount}
                </div>
              )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="fromDate">Start Date</Label>
            <Input
              id="fromDate"
              name="fromDate"
              type="date"
              value={validation.values.fromDate}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
            />
            {validation.touched.fromDate && validation.errors.fromDate && (
              <div className="text-sm text-red-500">
                {validation.errors.fromDate}
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="toDate">End Date</Label>
            <Input
              id="toDate"
              name="toDate"
              type="date"
              value={validation.values.toDate}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
            />
            {validation.touched.toDate && validation.errors.toDate && (
              <div className="text-sm text-red-500">
                {validation.errors.toDate}
              </div>
            )}
          </div>
        </div>

        <div>
          <Button type="submit" className="w-full mt-3 md:w-auto">
            Generate Tickets
          </Button>
        </div>
      </form>
      <Button
        className="mt-5"
        variant="outline"
        onClick={() => setIsDialogOpen(false)}
      >
        Cancel
      </Button>
    </div>
  );
};
