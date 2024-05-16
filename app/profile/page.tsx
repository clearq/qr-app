"use client";

import React, { useState } from "react";
import Head from "next/head";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

const EditProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleNameChange = (e: any) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Here you can add logic to update the user's profile information
    console.log("Name:", name);
    console.log("Email:", email);
  };

  const validation = useFormik({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      company: "",
    },
    validationSchema: yup.object({
      email: yup.string().email().required("Email is required"),
      firstName: yup.string().min(3).required("First name is required"),
      lastName: yup.string().min(3).required("Last name is required"),
      phone: yup.number().nullable(),
      company: yup.string().nullable(),
      image: yup.string().nullable(),
    }),
    onSubmit: (values) => {
      console.log("Form values:", values); // Log form values
      fetch("/api/saveVcard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then(async (response) => {
          if (response.status === 201) {
            toast({
              title: `Created successfully!`,
              description: `${new Date().toLocaleDateString()}`,
            });
          } else {
            toast({
              variant: "destructive",
              title: `Error create VCard`,
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

  // const handleInputImageChange = e => {
  //   if (e.target.files && e.target.files[0]) {
  //     const WIDTH = 300;
  //     let imgObj = e.target.files[0]
  //     // initiate reader and convert blob to base64.
  //     let reader = new FileReader()
  //     reader.readAsDataURL(imgObj)

  //     reader.onload = e => {
  //       let imageUrl = e.target?.result
  //       let image = document.createElement("img");

  //       image.src = imageUrl

  //       image.onload = (e) => {

  //         let canvas = document.createElement('canvas');
  //         let ratio = WIDTH / e.target.width
  //         canvas.width = WIDTH
  //         canvas.height = e.target.height * ratio

  //         const context = canvas.getContext("2d")
  //         context.drawImage(image, 0, 0, canvas.width, canvas.height);

  //         let new_image = context.canvas.toDataURL("image/jpeg", 80);
  //         validation.setFieldValue('image', new_image)
  //       }

  //     }
  //   }
  // }

  return (
    <div className="container mx-auto">
      <Card className="flex flex-col justify-center items-center">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <Avatar className="flex flex-col justify-center items-center">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center items-center">
          <CardContent className="grid grid-cols-2">
            <form className="flex flex-col justify-center items-center">
              <div className="grid grid-cols-2 w-[50%] items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="firstName">
                    First Name<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={name}
                    onChange={handleNameChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="firstName">
                    First Name<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={name}
                    onChange={handleNameChange}
                  />
                </div>
                {/* <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="logotype">Logo</Label>
                  <Input className='w-[100%]' value={validation.values.logoType} name="logoType" type="file" accept="image/*" onChange={handleLogoChange} />
                </div> */}
                {/* 
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="framework">Framework</Label>
                  <Select>
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="next">Next.js</SelectItem>
                      <SelectItem value="sveltekit">SvelteKit</SelectItem>
                      <SelectItem value="astro">Astro</SelectItem>
                      <SelectItem value="nuxt">Nuxt.js</SelectItem>
                      </SelectContent>
                      </Select>
                    </div> */}
              </div>
            </form>
          </CardContent>
        </div>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditProfilePage;
