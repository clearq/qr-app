"use client";
import React, { useState } from "react";
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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Customer, PrismaClient } from "@prisma/client";

interface Props {
  user: Customer;
}

export const EditProfileForm = ({ user: userData }: Props) => {
  const { status: sessionStatus } = useSession();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const router = useRouter();

  const validation = useFormik({
    initialValues: {
      email: userData?.email,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      phone: userData?.phone || "",
      company: userData?.company || "",
      image: userData?.image || Buffer,
    },
    validationSchema: yup.object({
      email: yup.string().email().required("Email is required"),
      firstName: yup.string().required("First name is required"),
      lastName: yup.string().required("Last name is required"),
      phone: yup.string().nullable(),
      company: yup.string().nullable(),
    }),
    onSubmit: (values) => {
      console.log("Form values:", values);
      fetch("/api/profile", {
        method: "PUT",
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

  const prisma = new PrismaClient();

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          // Convert the file to binary data
          const fileBuffer = Buffer.from(reader.result as ArrayBuffer);

          // Set the image preview
          const url = URL.createObjectURL(file);
          setImagePreview(url);

          // Update the image field in the form
          setImageFile(file);
        } catch (error) {
          console.error("Error updating image:", error);
          toast({
            variant: "destructive",
            title: "Error updating image",
            description: `${new Date().toLocaleDateString()}`,
          });
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const onSubmit = async (values: any) => {
    // Assuming other form fields are also updated
    try {
      // Update the customer data in the database
      await prisma.customer.update({
        where: { id: userData.id },
        data: {
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          company: values.company,
          image: values.image,
        },
      });
      // Show success message
      toast({
        title: `Updated successfully!`,
        description: `${new Date().toLocaleDateString()}`,
      });
    } catch (error) {
      console.error("Error updating data:", error);
      toast({
        variant: "destructive",
        title: `Error updating data`,
        description: `${new Date().toLocaleDateString()}`,
      });
    }
  };

  const handleBrowseClick = () => {
    const input = document.getElementById("imageInput");
    if (input) {
      input.click();
    }
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="container mx-auto">
      <Card className="flex flex-col justify-center items-center">
        <CardHeader>
          <CardTitle>Edit your Profile</CardTitle>
          <CardDescription>Update your profile here.</CardDescription>
        </CardHeader>
        <label htmlFor="imageInput" style={{ cursor: "pointer" }}>
          <Avatar className="flex flex-col w-[150px] h-[150px] justify-center items-center">
            <AvatarImage
              src={
                imagePreview ||
                (userData?.image
                  ? `data:image/jpeg;base64,${Buffer.from(
                      userData.image
                    ).toString("base64")}`
                  : undefined) // Use undefined if there's no image data
              }
              alt="User Image"
            />
            <AvatarFallback>
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
        <Button onClick={handleBrowseClick} className="mt-2">
          Browse
        </Button>
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
                value={validation.values.firstName || userData.firstName}
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
                value={validation.values.lastName || userData.lastName}
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
                value={validation.values.email || userData.email}
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
            <Button type="submit" className="mt-4 w-full">
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
