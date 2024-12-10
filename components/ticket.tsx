"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { format, addDays } from "date-fns";
import { DateRange } from "react-day-picker";
// import AddToGoogleWallet from "./addToGoogleWallet";

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

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch("/api/events");
      const data = await response.json();
      setEvents(data);
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
      fromDate: yup.date().required(),
      toDate: yup.date().required(),
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
            window.location.reload();
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
    <div>
      <form
        onSubmit={validation.handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="eventTitle">Selected Event</Label>
            <Input
              id="eventTitle"
              value={selectedEvent?.title || ""}
              disabled
              className="w-full"
            />
            {validation.errors.eventId && (
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
            <Label htmlFor="fromDate">From Date</Label>
            <Input
              id="fromDate"
              name="fromDate"
              placeholder="YYYY-MM-DD"
              value={validation.values.fromDate}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="toDate">To Date</Label>
            <Input
              id="toDate"
              name="toDate"
              placeholder="YYYY-MM-DD"
              value={validation.values.toDate}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
            />
          </div>
        </div>

        <div>
          <Button type="submit" className="w-full mt-3 md:w-auto">
            Generate Tickets
          </Button>
        </div>
        {/* <div>
          <AddToGoogleWallet ticketId={""} />
        </div> */}
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
