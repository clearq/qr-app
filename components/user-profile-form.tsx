"use client";
import React, { useRef, useState } from "react";
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
import { redirect } from "next/navigation";
import {
  uploadFile,
  autoLoginToCDN,
  getImageUrl,
  getFile,
} from "@/actions/api";
import Image from "next/image";
import { Icon } from "@iconify/react";
import avatar0 from "@/public/image/dotted.png";
import MediaPreview from '@/app/MediaPreview';

interface Props {
  user: Customer;
}

export const EditProfileForm = ({ user: userData }: Props) => {
  const [logo, setLogo] = useState<string | ArrayBuffer | null>(userData.image);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [retrievedFile, setRetrievedFile] = useState<string>("");
  const [key, setKey] = useState('');

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
        body: JSON.stringify(values),
      })
        .then(async (response) => {
          if (response.status === 201) {
            const data = await response.json();
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

  const handleInputImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const userId = userData?.id || "default_user";
      const contentFolder = "profile";
      const key = `${userId}_${file.name}`;

      try {
        setUploading(true);

        // Retrieve the token from sessionStorage instead of localStorage
        const token =
          localStorage.getItem("cdnToken") || (await autoLoginToCDN());

        await uploadFile(key, file, token, userId, contentFolder);

        // Generate full image URL
        const imageUrl = getImageUrl(key, userId, contentFolder);
        console.log(imageUrl);
        const response = await getFile(key, token, userId, contentFolder);
        const fileUrl = URL.createObjectURL(response.data);
        setRetrievedFile(fileUrl);

        // Update the user profile
        await fetch("/api/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: key, // Pass the image key for URL generation in the backend
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone,
            company: userData.company,
            orgNumber: userData.orgNumber,
            address: userData.address,
            country: userData.country,
            city: userData.city,
            zip: userData.zip,
          }),
        });

        setLogo(imageUrl);
        toast({
          title: "Profile image updated!",
          description: "Your profile image has been updated successfully.",
        });
      } catch (error) {
        console.error("Error uploading profile image:", error);
        toast({
          variant: "destructive",
          title: "Error uploading image",
          description: "There was an error uploading your profile image.",
        });
      } finally {
        setUploading(false);
      }
    }
  };

  if (!userData) {
    redirect("/");
  }

  return (
    <div className="container mx-auto">
      <Card className="flex flex-col justify-center items-center">
        <CardHeader>
          <CardTitle>Edit your Profile</CardTitle>
          <CardDescription>Update your profile here.</CardDescription>
        </CardHeader>
        {/* <Avatar className="flex flex-col w-[200px] h-[200px] justify-center items-center relative">
          <AvatarImage
            //@ts-ignore
            src={logo ? logo.toString() : userData.image}
            alt="User Image"
          />
          <AvatarFallback>
            {userData.firstName[0]}
            {userData.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center space-x-4 mt-4">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div> */}
        <div className="w-[124px] h-[124px] relative rounded-full">
          {/* <Image
            src={logo ? logo.toString() : userData.image || avatar0.src}
            alt="Profile Image"
            className="w-full h-full object-cover rounded-full"
            width={300}
            height={300}
          /> */}
          <MediaPreview retrievedFile={retrievedFile} fileKey={key}/>
          <Button
            asChild
            size="icon"
            className="h-8 w-8 rounded-full cursor-pointer absolute bottom-0 right-0"
            disabled={uploading}
          >
            <Label htmlFor="image">
              <Icon
                className={`w-5 h-5 ${
                  uploading ? "text-gray-400" : "text-primary-foreground"
                }`}
                icon={
                  uploading ? "heroicons:refresh" : "heroicons:pencil-square"
                }
              />
            </Label>
          </Button>
          <input
            className="hidden"
            type="file"
            name="image"
            accept="image/jpg, image/jpeg, image/png"
            onChange={handleInputImageChange}
            id="image"
          />
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
