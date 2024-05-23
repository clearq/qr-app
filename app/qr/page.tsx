"use client";
import React, { useState, ChangeEvent } from "react";
import QRCode from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

const QRCodeGenerator: React.FC = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const { toast } = useToast();
  const { data: session } = useSession();

  const validation = useFormik({
    initialValues: {
      url: "",
      tag: "",
      logoType: "",
    },
    validationSchema: yup.object({
      url: yup.string().url().nullable(),
      tag: yup.string().nullable(),
      logoType: yup.string().url().uuid(),
    }),
    onSubmit: (values) => {
      fetch("/api/qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((data) => {
        if (data?.status === 201) {
          toast({
            title: `Created successfully!`,
            description: `${new Date().toLocaleDateString()}`,
          });
          validation.resetForm();
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

  const handleDownload = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return; // Check if svg is null

    const svgData = new XMLSerializer().serializeToString(svg);

    const canvas = document.createElement("canvas");
    const svgSize = svg.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return; // Check if context is null

    const img = document.createElement("img");

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.download = "qr-code.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="flex flex-col md:flex-row items-start justify-between w-full h-full px-4">
      <form onSubmit={validation.handleSubmit} className="w-full md:w-1/2 space-y-4">
        <div>
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            type="text"
            placeholder="https://"
            name="url"
            value={validation.values.url}
            onChange={validation.handleChange}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="tag">Label</Label>
          <Input
            id="tag"
            type="text"
            placeholder="Label"
            name="tag"
            value={validation.values.tag}
            onChange={validation.handleChange}
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full md:w-auto">
          Save
        </Button>
      </form>
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 mt-8 md:mt-0">
        <QRCode
          id="qr-code-svg"
          value={validation.values.url}
          size={window.innerWidth > 768 ? 400 : 300} // Adjust size based on screen width
          renderAs="svg"
          imageSettings={{
            //@ts-ignore
            src: logo ?? null,
            height: 48,
            width: 48,
            excavate: true, // Make the QR code transparent where the logo is placed
          }}
        />
        <Button onClick={handleDownload} className="mt-4 w-full md:w-auto">
          Download QR Code
        </Button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
