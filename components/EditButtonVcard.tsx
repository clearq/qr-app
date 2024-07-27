import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "@/components/ui/use-toast";
import { VCard } from "@prisma/client";
import { DialogDescription } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface EditButtonProps {
  vcardData: VCard;
}

const EditButton = ({ vcardData: vData }: EditButtonProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [logo, setLogo] = useState<string | ArrayBuffer | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const validation = useFormik({
    initialValues: {
      id: vData.id,
      url: vData?.url || "",
      customerEmail: vData?.customerEmail || "",
      firstName: vData?.firstName || "",
      lastName: vData?.lastName || "",
      tag: vData?.tag || "",
      phone: vData?.phone || "",
      company: vData?.company || "",
      title: vData?.title || "",
      logoType: vData?.logoType || "",
      image: vData.image,
      linkedIn: vData?.linkedIn || "",
      x: vData?.x || "",
      facebook: vData?.facebook || "",
      instagram: vData?.instagram || "",
      snapchat: vData?.snapchat || "",
      tiktok: vData?.tiktok || "",
    },
    validationSchema: yup.object({
      url: yup.string().url().nullable(),
      customerEmail: yup.string().email().required("Email is required"),
      firstName: yup.string().min(3).required("First name is required"),
      lastName: yup.string().min(3).required("Last name is required"),
      tag: yup.string().min(3).required("Label is required"),
      phone: yup.number().nullable(),
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
      resizeImage(file, (resizedDataUrl) => {
        setLogo(resizedDataUrl);
        validation.setFieldValue("image", resizedDataUrl);
      });
    }
  };

  const handleRemoveImage = () => {
    setLogo(null);
    validation.setFieldValue('image', '');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <Dialog open={openDialog} onOpenChange={() => setOpenDialog(!openDialog)}>
        <DialogTrigger className="w-full">
          <Button className="w-full" variant="ghost">✎</Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={validation.handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit your vCard</DialogTitle>
              <DialogDescription>
                Edit your vCard here and save your changes.
              </DialogDescription>
              <label
                htmlFor="imageInput"
                className="cursor-pointer flex justify-center items-center"
              >
                <div className="relative w-32 h-32">
                  <Avatar className="absolute inset-0 flex items-center justify-center w-full h-full">
                    <AvatarImage
                    //@ts-ignore
                      src={logo ? logo.toString() : vData.logoType}
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
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    onChange={handleImageChange}
                  />
                </div>
              </label>
              <div className="flex items-center space-x-4 mt-4">
          <label htmlFor="logoType" className="text-[15px] px-5 py-0.5 justify-center items-center sm:ml-[40%] ml-[35%] mt-3 text-secondary cursor-pointer border rounded-[6px] bg-primary">
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
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="firstName">
                  First Name
                  <span className="text-red-700">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={validation.values.firstName}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="lastName">
                  Last Name
                  <span className="text-red-700">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={validation.values.lastName}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">
                  Email<span className="text-red-700">*</span>
                </Label>
                <Input
                  id="customerEmail"
                  placeholder="Email"
                  value={validation.values.customerEmail}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="label">
                  Label<span className="text-red-700">*</span>
                </Label>
                <Input
                  id="tag"
                  placeholder="Label"
                  value={validation.values.tag}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Title"
                  value={validation.values.title}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="Tel."
                  value={validation.values.phone}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Company"
                  value={validation.values.company}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="url">Website</Label>
                <Input
                  id="url"
                  placeholder="https://"
                  value={validation.values.url}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="linkedIn">LinkedIn</Label>
                <Input
                  id="linkedIn"
                  placeholder="https://"
                  value={validation.values.linkedIn}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  placeholder="https://"
                  value={validation.values.facebook}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  placeholder="https://"
                  value={validation.values.instagram}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="tiktok">Tiktok</Label>
                <Input
                  id="tiktok"
                  placeholder="https://"
                  value={validation.values.tiktok}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="snapchat">Snapchat</Label>
                <Input
                  id="snapchat"
                  placeholder="https://"
                  value={validation.values.snapchat}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="x">X</Label>
                <Input
                  id="x"
                  placeholder="https://"
                  value={validation.values.x}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditButton;
