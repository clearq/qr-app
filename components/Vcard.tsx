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
      phone: yup.string().nullable(), // Changed to string to match input type
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

  const generateVCardString = (values: any) => {
    const photo = values.logoType
      ? `PHOTO;ENCODING=b;TYPE=PNG:${values.logoType}`
      : "";
    return `
BEGIN:VCARD
VERSION:3.0
N: ${values.firstName} ${values.lastName}
FN:${values.firstName} ${values.lastName}
EMAIL:${values.customerEmail}
TEL:${values.phone ?? ""}
ORG:${values.company ?? ""}
TITLE:${values.title ?? ""}
URL:${values.url ?? ""}
X-LINKEDIN:${values.linkedIn ?? ""}
X-TWITTER:${values.x ?? ""}
X-FACEBOOK:${values.facebook ?? ""}
X-INSTAGRAM:${values.instagram ?? ""}
X-SNAPCHAT:${values.snapchat ?? ""}
X-TIKTOK:${values.tiktok ?? ""}
END:VCARD
    `.trim();
  };

  const handleDownloadVcard = () => {
    const values = validation.values;
    const vCardData = generateVCardString(values);

    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${values.firstName}_${values.lastName}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

  const handleBack = () => {
    router.push("/dashboardVcard");
  };

  return (
    <div>
      <CardHeader>
        <CardTitle>VCard</CardTitle>
        <CardDescription>Create your VCard here</CardDescription>
      </CardHeader>
      <label htmlFor="imageInput" className="flex justify-center items-center">
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-32 h-32 mb-4">
            <AvatarFallback className="uppercase text-[3rem]">
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
