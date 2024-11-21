"use client";
import React, { useState } from "react";
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

  const formik = useFormik({
    initialValues: {
      id: tData.id,
      ticketsName: tData?.ticketsName || "",
      description: tData?.description || "",
      fromDate: tData?.fromDate || "",
      toDate: tData?.toDate || "",
      qrNumber: tData?.qrNumber || "",
      guestMail: tData?.guestMail || "",
    },
    onSubmit: (values) => {
      fetch("/api/ticketScan", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then(async (response) => {
          if (response.status === 201) {
            toast({
              title: `Ticket updated successfully!`,
              description: `${new Date().toLocaleDateString()}`,
            });
            window.location.reload();
          } else {
            toast({
              variant: "destructive",
              title: `Error updating ticket`,
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
    <>
      <Dialog open={openDialog} onOpenChange={() => setOpenDialog(!openDialog)}>
        <DialogTrigger className="w-full">
          <Button className="w-full" variant="ghost">
            <MdModeEdit size={20} />
          </Button>
        </DialogTrigger>
        <DialogContent className="overflow-y-auto h-[90%] w-[90%]">
          <form onSubmit={formik.handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit your ticket</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              {/* Disabled Input Field for Ticket ID */}
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

              {/* No required validation for these fields */}
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
                <Label htmlFor="fromDate">From Date</Label>
                <Input
                  id="fromDate"
                  name="fromDate"
                  placeholder="YYYY-MM-DD"
                  value={formik.values.fromDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="toDate">To Date</Label>
                <Input
                  id="toDate"
                  name="toDate"
                  placeholder="YYYY-MM-DD"
                  value={formik.values.toDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

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
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
          <TooltipProvider>
            <Tooltip delayDuration={300} open={isTooltipVisible}>
              <TooltipTrigger
                className="absolute right-8 top-[247px]"
                onClick={handleCopy}
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
    </>
  );
};

export default EditButton;
