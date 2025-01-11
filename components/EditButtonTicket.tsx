"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFormik } from "formik";
import { toast } from "@/components/ui/use-toast";
import { Ticket } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MdModeEdit } from "react-icons/md";
import { CopyIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface EditButtonProps {
  ticketData: Ticket;
}

const EditButton = ({ ticketData: tData }: EditButtonProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState("Copy");
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tableOptions, setTableOptions] = useState<number[]>([]);

  useEffect(() => {
    const fetchTableOptions = async () => {
      try {
        const response = await fetch(
          `/api/events?eventId=${tData.eventsTitleId}`
        );
        if (response.ok) {
          const data = await response.json();
          setTableOptions(data);
        } else {
          console.error("Failed to fetch table options");
        }
      } catch (error) {
        console.error("Error fetching table options:", error);
      }
    };

    if (tData.eventsTitleId) {
      fetchTableOptions();
    }
  }, [tData.eventsTitleId]);

  const formik = useFormik({
    initialValues: {
      id: tData.id,
      ticketsName: tData.ticketsName || "",
      description: tData.description || "",
      qrNumber: tData.qrNumber || "",
      guestMail: tData.guestMail || "",
      tableNumber: tData.tableNumber || 0,
      amountOfPeople: tData.amountOfPeople || 0,
      fullName: tData.fullName || "",
      eventsTitleId: tData.eventsTitleId || "",
      customerId: tData.customerId || "",
    },
    onSubmit: async (values) => {
      try {
        const response = await fetch("/api/ticketScan", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          toast({ title: "Ticket updated successfully!" });
          window.location.reload();
        } else {
          const error = await response.json();
          toast({
            variant: "destructive",
            title: "Error updating ticket",
            description: error.error || "Unknown error occurred",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        toast({
          variant: "destructive",
          title: "Something went wrong",
        });
      }
    },
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(formik.values.qrNumber);
    setTooltipMessage("Copied");

    // Hide tooltip after clicking
    setIsTooltipVisible(true);

    // Reset the tooltip message back to "Copy" after a short delay
    setTimeout(() => {
      setTooltipMessage("Copy");
      setIsTooltipVisible(false); // Hide tooltip after delay
    }, 2000); // Change this delay as needed
  };

  return (
    <Dialog open={openDialog} onOpenChange={(isOpen) => setOpenDialog(isOpen)}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="ghost">
          <MdModeEdit size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="overflow-y-auto h-[90%] w-[90%]"
        onClick={(e) => e.stopPropagation()} // Prevent closing on content click
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit your ticket</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {/* Ticket ID */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="id">Ticket ID</Label>
              <Input
                id="id"
                name="id"
                value={formik.values.id}
                disabled
                className="cursor-not-allowed"
              />
            </div>

            {/* Ticket Name */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="ticketsName">Ticket Name</Label>
              <Input
                id="ticketsName"
                name="ticketsName"
                placeholder="Ticket Name"
                value={formik.values.ticketsName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
              />
            </div>

            {/* Guest Email */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="guestMail">Guest Email</Label>
              <Input
                id="guestMail"
                name="guestMail"
                placeholder="Email"
                value={formik.values.guestMail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {/* QR Number */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="qrNumber">QR Generated ID</Label>
              <Input
                disabled
                id="qrNumber"
                name="qrNumber"
                placeholder="QR Code"
                value={formik.values.qrNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="eventsTitleId">Event Title ID</Label>
              <Input
                id="eventsTitleId"
                name="eventsTitleId"
                value={formik.values.eventsTitleId}
                onChange={formik.handleChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="tableNumber">Table Number</Label>
              <Input
                id="tableNumber"
                name="tableNumber"
                type="number"
                value={formik.values.tableNumber}
                onChange={formik.handleChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="amountOfPeople">Amount of People</Label>
              <Input
                id="amountOfPeople"
                name="amountOfPeople"
                type="number"
                value={formik.values.amountOfPeople}
                onChange={formik.handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
        <TooltipProvider>
          <Tooltip delayDuration={300} open={isTooltipVisible}>
            <TooltipTrigger
              className="absolute right-8 top-[247px]"
              onClick={(e) => {
                e.stopPropagation(); // Prevent tooltip click from closing dialog
                handleCopy();
              }}
              onMouseEnter={() => setIsTooltipVisible(true)}
              onMouseLeave={() => setIsTooltipVisible(false)}
            >
              <CopyIcon />
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltipMessage}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
};

export default EditButton;
