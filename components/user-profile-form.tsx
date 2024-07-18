"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "@/components/ui/use-toast";
import { Customer } from "@prisma/client";
import { DeleteUser } from "./DeleteUser";
import { ChangePasswordForm } from "./change-password-form";
import ImageUpload from "./uploadImage";
import { useRouter } from "next/navigation";

interface Props {
  user: Customer;
}

export const EditProfileForm = ({ user: userData }: Props) => {
  const [logo, setLogo] = useState<string | ArrayBuffer | null>(userData.image);
  const [highQualityLogo, setHighQualityLogo] = useState<
    string | ArrayBuffer | null
  >(userData.image);
  const qrRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter()

  useEffect(() => {
    if (!userData) {
      router.replace('/');
    }
  }, [userData, router]);

  const validation = useFormik({
    initialValues: {
      email: userData?.email,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      phone: userData?.phone || "",
      company: userData?.company || "",
      image: userData.image,
      orgNumber: userData?.orgNumber || "",
      address: userData?.address || "",
      country: userData?.country || "",
      city: userData?.city || "",
      zip: userData?.zip || "",
    },
    validationSchema: yup.object({
      email: yup.string().email().required("Email is required"),
      firstName: yup.string().required("First name is required"),
      lastName: yup.string().required("Last name is required"),
      phone: yup.string().nullable(),
      company: yup.string().nullable(),
      orgNumber: yup.string().nullable(),
      address: yup.string().nullable(),
      country: yup.string().nullable(),
      city: yup.string().nullable(),
      zip: yup.string().nullable(),
    }),
    onSubmit: (values) => {
      fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, highQualityImage: highQualityLogo }),
      })
        .then(async (response) => {
          if (response.status === 201) {
            const data = await response.json();
            setLogo(data.image);
            setHighQualityLogo(data.highQualityImage);
            toast({
              title: `Updated successfully!`,
              description: `${new Date().toLocaleDateString()}`,
            });
            window.location.reload();
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // Read the high-quality image
      const reader = new FileReader();
      reader.onloadend = () => {
        setHighQualityLogo(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Resize the image for storage
      resizeImage(file, (resizedDataUrl) => {
        setLogo(resizedDataUrl);
        validation.setFieldValue("image", resizedDataUrl);
      });
    }
  };

  const handleRemoveImage = () => {
    setLogo(null);
    setHighQualityLogo(null);
    validation.setFieldValue("image", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Submit the form to update the server immediately after removing the image
    validation.handleSubmit();
  };

  if (!userData) return null;

  return (
    <div className="container mx-auto">
      <Card className="flex flex-col justify-center items-center">
        <CardHeader>
          <CardTitle>Edit your Profile</CardTitle>
          <CardDescription>Update your profile here.</CardDescription>
        </CardHeader>
        <label htmlFor="imageInput" style={{ cursor: "pointer" }}>
          <Avatar
            ref={qrRef}
            className="flex flex-col w-[100px] h-[100px] justify-center items-center relative"
          >
            {/* First image for storage */}
            <AvatarImage
              id="qr-code-svg"
              //@ts-ignore
              src={logo ? logo.toString() : userData.image}
              alt="User Image"
              className="absolute inset-0 opacity-0"
            />
            {/* Second image for display */}
            <AvatarImage
              //@ts-ignore
              src={
                highQualityLogo ? highQualityLogo.toString() : userData.image
              }
              alt="User Image"
            />
            <AvatarFallback className="text-[2rem]">
              {userData.firstName[0]}
              {userData.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </label>
        {/* <ImageUpload/> */}
        <div className="flex items-center space-x-4 mt-4">
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
        </div>
        <CardContent className="mt-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
            }}
            className="w-full grid grid-cols-2 gap-4"
          >
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="firstName">
                First Name<span className="text-red-700">*</span>
              </Label>
              <Input
                name="firstName"
                placeholder="First Name"
                value={validation.values.firstName}
                onChange={validation.handleChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastName">
                Last Name<span className="text-red-700">*</span>
              </Label>
              <Input
                name="lastName"
                placeholder="Last Name"
                value={validation.values.lastName}
                onChange={validation.handleChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">
                Email<span className="text-red-700">*</span>
              </Label>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={validation.values.email}
                onChange={validation.handleChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={validation.values.phone}
                onChange={validation.handleChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="company">Company</Label>
              <Input
                name="company"
                placeholder="Company"
                value={validation.values.company}
                onChange={validation.handleChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="orgNumber">Org.Number</Label>
              <Input
                name="orgNumber"
                placeholder="123456-7890"
                value={validation.values.orgNumber}
                onChange={validation.handleChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Input
                name="address"
                placeholder="1017 Airline Dr"
                value={validation.values.address}
                onChange={validation.handleChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input
                name="city"
                placeholder="Kenner"
                value={validation.values.city}
                onChange={validation.handleChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="zip">Zip/Postal Code</Label>
              <Input
                name="zip"
                placeholder="70062"
                value={validation.values.zip}
                onChange={validation.handleChange}
              />
            </div>   
            <Button type="submit" className="mt-[25px] mb-4 w-full">
              Save changes
            </Button>
            <div className="mt-4 w-full"></div>
          </form>
          <CardTitle>Change password</CardTitle>
          <ChangePasswordForm
            //@ts-ignore
            user={userData}
          />
          <DeleteUser user={userData} />
        </CardContent>
      </Card>
    </div>
  );
};
