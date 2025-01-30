import React, { ChangeEvent, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";

export const Vcard = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [logo, setLogo] = useState<string | ArrayBuffer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validation = useFormik({
    initialValues: {
      url: "",
      customerEmail: "",
      firstName: "",
      lastName: "",
      tag: "",
      phone: "",
      company: "",
      title: "",
      logoType: "",
      image: "",
      linkedIn: "",
      x: "",
      facebook: "",
      instagram: "",
      snapchat: "",
      tiktok: "",
    },
    validationSchema: yup.object({
      url: yup.string().url().nullable(),
      customerEmail: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
      firstName: yup
        .string()
        .min(3, "First name must be at least 3 characters")
        .required("First name is required"),
      lastName: yup
        .string()
        .min(3, "Last name must be at least 3 characters")
        .required("Last name is required"),
      tag: yup
        .string()
        .min(3, "Tag must be at least 3 characters")
        .required("Tag is required"),
      phone: yup.string().nullable(),
      company: yup.string().nullable(),
      image: yup.string().nullable(),
      title: yup.string(),
      logoType: yup.string().nullable(),
      linkedIn: yup.string().nullable(),
      x: yup.string().nullable(),
      facebook: yup.string().nullable(),
      instagram: yup.string().nullable(),
      snapchat: yup.string().nullable(),
      tiktok: yup.string().nullable(),
    }),
    onSubmit: (values) => {
      fetch("/api/saveVcard", {
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
            router.replace(`/vcard/details?id=${data.id}`);
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
        validation.setFieldValue("logoType", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    validation.setFieldValue("logoType", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBack = () => {
    router.push("/dashboardVcard");
  };

  return (
    <div className="w-full mt-20 h-full p-4 sm:pl-[260px]">
      <CardTitle className="text-2xl">Create VCard</CardTitle>
      <header className="mt-5">
        <h1 className="font-bold">VCard</h1>
        <h2>Create your vcard here.</h2>
      </header>
      <label
        htmlFor="imageInput"
        className="flex mt-5 justify-center items-center"
      >
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-32 h-32 mb-4">
            <AvatarFallback className="uppercase text-[16px]">
              {validation.values.firstName[0]}
              {validation.values.lastName[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      </label>
      <CardContent>
        <form onSubmit={validation.handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="firstName">
                First name <span className="text-xs text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="firstName"
                placeholder="First name"
                value={validation.values.firstName}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                style={{ fontSize: "16px" }} // Add this line
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastName">
                Last name <span className="text-xs text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={validation.values.lastName}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                style={{ fontSize: "16px" }} // Add this line
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="tag">
                Tag <span className="text-xs text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="tag"
                placeholder="Tag"
                value={validation.values.tag}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                style={{ fontSize: "16px" }} // Add this line
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                name="title"
                placeholder="Title"
                value={validation.values.title}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                style={{ fontSize: "16px" }} // Add this line
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="customerEmail">
                Email address <span className="text-xs text-red-500">*</span>
              </Label>
              <Input
                type="email"
                name="customerEmail"
                placeholder="Email address"
                value={validation.values.customerEmail}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                style={{ fontSize: "16px" }} // Add this line
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                type="tel"
                name="phone"
                placeholder="Phone number"
                value={validation.values.phone}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                style={{ fontSize: "16px" }} // Add this line
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="company">Company</Label>
              <Input
                type="text"
                name="company"
                placeholder="Company"
                value={validation.values.company}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                style={{ fontSize: "16px" }} // Add this line
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="url">URL</Label>
              <Input
                type="url"
                name="url"
                placeholder="https://example.com"
                value={validation.values.url}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                style={{ fontSize: "16px" }} // Add this line
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="linkedIn">LinkedIn</Label>
              <Input
                type="text"
                name="linkedIn"
                placeholder="LinkedIn"
                value={validation.values.linkedIn}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                style={{ fontSize: "16px" }} // Add this line
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="x">Twitter</Label>
              <Input
                type="text"
                name="x"
                placeholder="Twitter"
                value={validation.values.x}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                style={{ fontSize: "16px" }} // Add this line
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                type="text"
                name="facebook"
                placeholder="Facebook"
                value={validation.values.facebook}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                style={{ fontSize: "16px" }} // Add this line
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                type="text"
                name="instagram"
                placeholder="Instagram"
                value={validation.values.instagram}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                style={{ fontSize: "16px" }} // Add this line
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="snapchat">Snapchat</Label>
              <Input
                type="text"
                name="snapchat"
                placeholder="Snapchat"
                value={validation.values.snapchat}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                style={{ fontSize: "16px" }} // Add this line
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="tiktok">TikTok</Label>
              <Input
                type="text"
                name="tiktok"
                placeholder="TikTok"
                value={validation.values.tiktok}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                style={{ fontSize: "16px" }} // Add this line
              />
            </div>
          </div>
          <Button type="submit" className="bg-primary mt-4">
            Save
          </Button>
        </form>
      </CardContent>
    </div>
  );
};
