"use client";

import React, { useEffect, useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Customer } from "@prisma/client";

interface Props {
    user : Customer;
}

export const EditProfileForm = ({
    user : userData
}: Props) => {

 const {status: sessionStatus} = useSession()

  const router = useRouter();


  const validation = useFormik({
    initialValues: {
      email: userData?.email,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      phone: userData?.phone || "",
      company: userData?.company || "",
      image: userData?.image || null,
    },
    validationSchema: yup.object({
      email: yup.string().email().required("Email is required"),
      firstName: yup.string().required("First name is required"),
      lastName: yup.string().required("Last name is required"),
      phone: yup.string().nullable(),
      company: yup.string().nullable(),
      image: yup.string().nullable(),
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
              title: `Error updateing data`,
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
        <Avatar className="flex flex-col w-[150px] h-[150px] justify-center items-center">
          <AvatarImage src={userData?.image || undefined} alt="User Image" />
          <AvatarFallback>
            {userData.firstName[0]}
            {userData.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <CardContent className="mt-10">
          <form onSubmit={(e) => {
            e.preventDefault()
            validation.handleSubmit()
          }} className="grid grid-cols-2 gap-4 max-w-md w-full">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="firstName">First Name<span className="text-red-700">*</span></Label>
              <Input
                name="firstName"
                placeholder="First Name"
                value={validation.values.firstName || userData.firstName}
                onChange={validation.handleChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastName">Last Name<span className="text-red-700">*</span></Label>
              <Input
                name="lastName"
                placeholder="Last Name"
                value={validation.values.lastName || userData.lastName}
                onChange={validation.handleChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email<span className="text-red-700">*</span></Label>
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
          </form>
            <Button type="submit" className="mt-4 w-full">Save changes</Button>
        </CardContent>
      </Card>
    </div>
  );
};

