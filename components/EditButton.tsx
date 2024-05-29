import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import * as yup from "yup";
import QRCode from "qrcode.react";
import { toast } from "@/components/ui/use-toast";
import { Qr } from "@prisma/client";

interface EditButtonProps {
  qrData: Qr;
}

export const EditButton = ({ qrData: qr }: EditButtonProps) => {
  const validation = useFormik({
    initialValues: {
      id: qr.id,
      url: qr.url || "",
      tag: qr.tag || "",
      logoType: "",
    },
    validationSchema: yup.object({
      url: yup.string().url().nullable(),
      tag: yup.string().nullable(),
      logoType: yup.string().url().uuid(),
    }),
    onSubmit: (values) => {
      fetch("/api/qr", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((response) => {
        if (response.status === 201) {
          toast({
            title: `Created successfully!`,
            description: `${new Date().toLocaleDateString()}`,
          });
          validation.resetForm();
          window.location.reload();
        } else {
          toast({
            variant: "destructive",
            title: `Something went wrong`,
            description: `${new Date().toLocaleDateString()}`,
          });
        }
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">✎</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit your QR</DialogTitle>
          <DialogDescription>
            Edit your QR here and save your changes.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
          }}
        >
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                type="text"
                id="url"
                value={validation.values.url}
                className="col-span-3"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Label
              </Label>
              <Input
                id="tag"
                value={validation.values.tag}
                className="col-span-3"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
              />
            </div>
            <QRCode
              className="flex flex-col left-12 justify-center items-center mt-5 relative"
              id="qr-code-svg"
              value={validation.values.url}
              size={400}
              renderAs="svg"
            />
            <div className="mt-5 flex w-[50%] flex-row gap-4 items-center justify-center sm:w-auto">
              <Button className="">Download PNG</Button>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
