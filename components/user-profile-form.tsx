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
import { uploadFile, autoLoginToCDN, getImageUrl } from "@/actions/api";
import { Icon } from "@iconify/react";
import MediaPreview from "@/app/MediaPreview";
import { Skeleton } from "./ui/skeleton";

interface Props {
  user: Customer;
}

export const EditProfileForm = ({ user: userData }: Props) => {
  const [logo, setLogo] = useState<string>(userData.image || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [retrievedFile, setRetrievedFile] = useState<string>("");
  const [loading, setLoading] = React.useState(true); // Loading state
  const [fileKey, setFileKey] = useState<string>("");
  const [showChangePassword, setShowChangePassword] = useState(false);

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

        // Retrieve the token from sessionStorage or auto-login to CDN
        const token =
          localStorage.getItem("cdnToken") || (await autoLoginToCDN());

        // Upload the file to the CDN
        await uploadFile(key, file, token, userId, contentFolder);

        // Generate the full image URL
        const imageUrl = getImageUrl(key, userId, contentFolder);

        if (imageUrl) {
          // Set the retrieved file and key for preview
          setRetrievedFile(imageUrl);
          setFileKey(key);

          // Update the user profile with the new image key
          const response = await fetch("/api/profile", {
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

          if (response.ok) {
            // Refresh the image URL after updating the profile
            const updatedUser = await response.json();
            const refreshedImageUrl = getImageUrl(
              updatedUser.image,
              userId,
              contentFolder
            );
            if (refreshedImageUrl) {
              setLogo(refreshedImageUrl);
              setRetrievedFile(refreshedImageUrl);
            }

            toast({
              title: "Profile image updated!",
              description: "Your profile image has been updated successfully.",
            });
          } else {
            throw new Error("Failed to update profile");
          }
        } else {
          throw new Error("Failed to generate image URL.");
        }
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
    <div className="w-full mt-20 h-full p-4 sm:pl-[260px]">
      {" "}
      <CardTitle className="text-2xl ">Profile</CardTitle>
      <div className="mt-5">
        <header>
          <h1 className="font-bold">Edit your Profile</h1>
          <h2>Update your profile here.</h2>
        </header>
        <div className="w-[124px] h-[124px] sm:ml-[40rem] ml-[7rem] relative rounded-full">
          {retrievedFile ? (
            <MediaPreview retrievedFile={retrievedFile} fileKey={fileKey} />
          ) : (
            <Avatar className="w-[124px] h-[124px]">
              <AvatarImage src={logo || undefined} alt="Profile Image" />
              <AvatarFallback>
                {userData.firstName[0]}
                {userData.lastName[0]}
              </AvatarFallback>
            </Avatar>
          )}
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
                style={{ fontSize: "16px" }} // Ensure font size is 16px
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
                style={{ fontSize: "16px" }} // Ensure font size is 16px
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
                style={{ fontSize: "16px" }} // Ensure font size is 16px
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
                style={{ fontSize: "16px" }} // Ensure font size is 16px
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="company">Company</Label>
              <Input
                name="company"
                placeholder="Company"
                value={validation.values.company}
                onChange={validation.handleChange}
                style={{ fontSize: "16px" }} // Ensure font size is 16px
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="orgNumber">Org.Number</Label>
              <Input
                name="orgNumber"
                placeholder="123456-7890"
                value={validation.values.orgNumber}
                onChange={validation.handleChange}
                style={{ fontSize: "16px" }} // Ensure font size is 16px
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Input
                name="address"
                placeholder="1017 Airline Dr"
                value={validation.values.address}
                onChange={validation.handleChange}
                style={{ fontSize: "16px" }} // Ensure font size is 16px
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input
                name="city"
                placeholder="Kenner"
                value={validation.values.city}
                onChange={validation.handleChange}
                style={{ fontSize: "16px" }} // Ensure font size is 16px
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="zip">Zip/Postal Code</Label>
              <Input
                name="zip"
                placeholder="70062"
                value={validation.values.zip}
                onChange={validation.handleChange}
                style={{ fontSize: "16px" }} // Ensure font size is 16px
              />
            </div>
            <Button type="submit" className="mt-[25px] mb-4 w-full">
              Save changes
            </Button>
          </form>
          {/* Updated Change Password Section */}
          <div className="mt-6">
            {!showChangePassword ? (
              <Button
                variant="link"
                className="text-sm justify-start mr-2"
                onClick={() => setShowChangePassword(true)}
              >
                Do you want to change password?
              </Button>
            ) : (
              <div>
                <CardTitle className="mb-4">Change Password</CardTitle>
                <ChangePasswordForm
                  //@ts-ignore
                  user={userData}
                />
                <Button
                  variant="link"
                  className="text-sm mt-2"
                  onClick={() => setShowChangePassword(false)}
                >
                  Hide Change Password
                </Button>
              </div>
            )}
          </div>
          <DeleteUser user={userData} />
        </CardContent>
      </div>
    </div>
  );
};
