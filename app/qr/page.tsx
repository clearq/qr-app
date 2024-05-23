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
  const [url, setUrl] = useState<string>("");
  const [logo, setLogo] = useState<string | null>(null);
  const [qrCodeData, setQRCodeData] = useState<string>("");
  const [qrCode, setQRCode] = useState<string>("");
  const { toast } = useToast();

  // const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setUrl(e.target.value);
  //   generateQRCode(e.target.value);
  // };

  // const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setLogo(URL.createObjectURL(file));
  //   }
  // };

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
            title: `Created sucessfully!`,
            description: `${new Date().toLocaleDateString()}`,
          });
          validation.resetForm();
        } else {
          toast({
            variant: "destructive",
            title: `Something went worng`,
            description: `${new Date().toLocaleDateString()}`,
          });
        }
      });
    },
  });

  // const generateQRCode = (value: string) => {
  //   // Generate QR code data
  //   setQRCodeData(value);
  // };

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
    <div className="flex items-start justify-between flex-col md:flex-row px-4 w-full h-full">
      <form onSubmit={validation.handleSubmit} className="w-full">
        <div className="space-y-5 w-[90%]">
          <Label>Url </Label>
          <Input
            className=""
            type="text"
            placeholder="https://"
            name="url"
            value={validation.values.url}
            onChange={validation.handleChange}
          />

          <Label>Lable</Label>
          <Input
            className=""
            type="text"
            placeholder="Label"
            name="tag"
            value={validation.values.tag}
            onChange={validation.handleChange}
          />

          <Button className="flex mr-3" type="submit">
            Save
          </Button>
        </div>
      </form>
      <div className="flex items-center flex-col justify-center px-4">
        <QRCode
          className="flex flex-col relative"
          id="qr-code-svg"
          value={validation.values.url}
          size={450}
          renderAs="svg"
          imageSettings={{
            //@ts-ignore
            src: logo ?? null,
            height: 48,
            width: 48,
            excavate: true, // Make the QR code transparent where the logo is placed
          }}
        />

        <div className="flex flex-row mb-4">
          <Button onClick={handleDownload} className="mt-4 w-full">
            Download QR Code
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
