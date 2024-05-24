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
      image: userData?.image || '',
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


  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const WIDTH = 300;
  
      let imgObj = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(imgObj);
  
      reader.onload = e => {
        let imageUrl = e.target?.result;
        let image = document.createElement("img");
        //@ts-ignore
        image.src = imageUrl;
  
        image.onload = (e) => {
          let canvas = document.createElement('canvas');
        //@ts-ignore
          let ratio = WIDTH / e.target.width;
          canvas.width = WIDTH;
        //@ts-ignore
          canvas.height = e.target.height * ratio;
          const context = canvas.getContext("2d");
        //@ts-ignore
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
  
          canvas.toBlob((blob) => {
        //@ts-ignore
            const new_image = URL.createObjectURL(blob);
            // Use new_image for your purposes (e.g., saving or displaying)
            validation.setFieldValue('image', new_image);
          }, 'image/jpeg');
        }
      }
    }
  }

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
              src={validation.values.image}
              alt="User Image"
            />
            <AvatarFallback className="text-[3rem]">
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
        <Button onClick={handleBrowseClick} className="mt-6">
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
