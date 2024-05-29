import React, { useState } from "react";
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
      image: vData?.image || undefined,
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
      console.log("Form values:", values);
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const WIDTH = 300;

      let imgObj = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(imgObj);

      reader.onload = (e) => {
        let imageUrl = e.target?.result;
        let image = document.createElement("img");
        //@ts-ignore
        image.src = imageUrl;

        image.onload = (e) => {
          let canvas = document.createElement("canvas");
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
            validation.setFieldValue("image", new_image);
          }, "image/jpeg");
        };
      };
    }
  };

  return (
    <>
      <Dialog open={openDialog} onOpenChange={() => setOpenDialog(!openDialog)}>
        <DialogTrigger>
          <Button variant="outline">✎</Button>
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
                      src={validation.values.image}
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
                <Label htmlFor="linkedIn">LinkedIn</Label>
                <Input
                  id="linkedIn"
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
