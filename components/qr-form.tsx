"use client";
import React, { useState, useRef } from "react";
import QRCode from "qrcode.react";
import { saveAs } from "file-saver";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "./ui/breadcrumb";
import { useRouter, useSearchParams } from "next/navigation";
import { IQR } from "@/typings";

export const QrForm = () => {
  const [logo, setLogo] = useState<string | ArrayBuffer | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [qrcodeData, setQrCodeData] = useState<IQR>();
  const params = useSearchParams();
  const id = params.get("id");
  const router = useRouter();

  const validation = useFormik({
    initialValues: {
      url: qrcodeData?.url || "",
      tag: qrcodeData?.tag || "",
      logoType: qrcodeData?.logoType || "",
    },
    validationSchema: yup.object({
      url: yup.string().nullable(),
      tag: yup.string().nullable(),
      logoType: yup.string().nullable(),
    }),
    onSubmit: (values) => {
      fetch("/api/qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then(async (response) => {
          const data = await response.json();
          if (response.status === 201) {
            toast({
              title: `Created successfully!`,
              description: `${new Date().toLocaleDateString()}`,
            });

            window.location.reload();
          } else {
            toast({
              variant: "destructive",
              title: `Error creating vCard`,
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

  const resizeImage = (file: File, callback: (dataUrl: string) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 40;
        let width = img.width;
        let height = img.height;

        // Calculate the new dimensions
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              // Convert the resized image blob to data URL
              const reader = new FileReader();
              reader.onloadend = () => {
                const dataUrl = reader.result as string;
                callback(dataUrl);
              };
              reader.readAsDataURL(blob);
            }
          }, "image/png");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      resizeImage(file, (resizedDataUrl) => {
        setLogo(resizedDataUrl);
        validation.setFieldValue("logoType", resizedDataUrl);
      });
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    validation.setFieldValue("logoType", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadQRCode = (format: "png" | "svg") => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector("canvas");
    if (canvas) {
      if (format === "png") {
        canvas.toBlob((blob) => {
          if (blob) {
            saveAs(blob, `${validation.values.tag}.${format}`);
          }
        }, "image/png");
      } else if (format === "svg") {
        const svg = qrRef.current.querySelector("svg");
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const blob = new Blob([svgData], {
            type: "image/svg+xml;charset=utf-8",
          });
          saveAs(blob, `${validation.values.tag}.${format}`);
        }
      }
    }
  };

  return (
    <div className="w-full h-full p-4 sm:pl-[260px]">
      {" "}
      <CardHeader className="mt-5">
        <CardDescription>Create your Qr here</CardDescription>
      </CardHeader>
      <div className="flex flex-col md:flex-row w-full">
        <form onSubmit={validation.handleSubmit} className="w-full  space-y-4">
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="text"
              name="url"
              placeholder="https://"
              value={validation.values.url}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              className="w-full"
            />
            {validation.touched.url && validation.errors.url && (
              <div className="text-sm text-red-500">
                {validation.errors.url}
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="tag">Label</Label>
            <Input
              id="tag"
              type="text"
              name="tag"
              placeholder="Label"
              value={validation.values.tag}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              className="w-full"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label
              htmlFor="logoType"
              className="text-[15px] px-5 py-0.5 text-secondary cursor-pointer border rounded-[6px] bg-primary"
            >
              Browse
            </label>
            <input
              type="file"
              id="logoType"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleLogoUpload}
            />
            {logo && (
              <Button onClick={handleRemoveLogo} className="bg-red-500">
                Remove Logo
              </Button>
            )}
          </div>
          <Button type="submit" className="w-full md:w-auto">
            Save
          </Button>
        </form>
        {/* <div
              ref={qrRef}
              className="flex flex-col items-center justify-center md:w-1/2 md:ml-8 md:mr-8 mt-6"
            >
              <QRCode
                value={validation.values.url}
                size={window.innerWidth > 300 ? 500 : 300}
                    includeMargin={true}
                renderAs="canvas"
                imageSettings={{
                  src: logo ? logo.toString() : "",
                  height: 55,
                  width: 55,
                  excavate: true,
                }}
                  
              />
              <div className="flex flex-row space-x-4 justify-center items-center mb-9 mt-4">
                <Button onClick={() => downloadQRCode("png")} className="">
                  Download PNG
                </Button>
                <Button onClick={() => downloadQRCode("svg")} className="">
                  Download SVG
                </Button>
              </div>
            </div> */}
      </div>
    </div>
  );
};
