"use client";
import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useFormik } from "formik";
import { Customer, VCard } from "@prisma/client";
import * as yup from "yup";
import { toast } from "./ui/use-toast";

interface Props {
  vData: VCard;
}

export const GetImage = ({ vData: vcard }: Props) => {
  const [logo, setLogo] = useState<string | ArrayBuffer | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validation = useFormik({
    initialValues: {
        firstName: vcard?.firstName,
        lastName: vcard?.lastName,
      logoType: vcard?.logoType || vcard.logoType,
    },
    validationSchema: yup.object({
      firstName: yup.string().required("First name is required"),
      lastName: yup.string().required("Last name is required"),
      logoType: yup.string().nullable(),
    }),
    onSubmit: (values) => {
      fetch("/api/saveVcard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then(async (response) => {
          if (response.status === 201) {
            toast({
              title: `Updated successfully!`,
              description: `${new Date().toLocaleDateString()}`,
            });
          } else {
            toast({
              variant: "destructive",
              title: `Error updating data`,
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

  return (
    <>
      <label
                htmlFor="imageInput"
                className="flex justify-center items-center"
              >
                <div className="relative w-32 h-32">
                  <Avatar className="absolute inset-0 flex items-center justify-center w-full h-full">
                    <AvatarImage
                      src={validation.values.logoType || ""}
                      alt="User Image"
                    />
                    <AvatarFallback>
                      {validation.values.firstName
                        ? validation.values.firstName[0]
                        : ""}
                      {validation.values.lastName
                        ? validation.values.lastName[0]
                        : ""}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </label>
      {/* <div className="flex items-center space-x-4 mt-4">
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
          onChange={handleImageChange}
        />
        {logo && (
          <Button onClick={handleRemoveImage} className="bg-red-500">
            Remove Logo
          </Button>
        )}
      </div> */}
    </>
  );
};
