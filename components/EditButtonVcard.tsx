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
import { MdModeEdit } from "react-icons/md";
import { useLanguage } from "@/context/LanguageContext"; // Import the useLanguage hook

interface EditButtonProps {
  vcardData: VCard;
}

const EditButton = ({ vcardData: vData }: EditButtonProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [logo, setLogo] = useState<string | ArrayBuffer | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { translations } = useLanguage(); // Use the translations

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
      customerEmail: yup.string().email().required(translations.emailRequired),
      firstName: yup
        .string()
        .min(3, translations.minLength)
        .required(translations.firstNameRequired),
      lastName: yup
        .string()
        .min(3, translations.minLength)
        .required(translations.lastNameRequired),
      tag: yup
        .string()
        .min(3, translations.minLength)
        .required(translations.labelRequired),
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
              title: translations.updatedSuccessfully,
              description: new Date().toLocaleDateString(),
            });
            window.location.reload();
          } else {
            toast({
              variant: "destructive",
              title: translations.errorUpdatingData,
              description: new Date().toLocaleDateString(),
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          toast({
            variant: "destructive",
            title: translations.somethingWentWrong,
            description: new Date().toLocaleDateString(),
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
    validation.setFieldValue("image", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Dialog open={openDialog} onOpenChange={() => setOpenDialog(!openDialog)}>
        <DialogTrigger className="w-[full]">
          <Button className="w-full" variant="ghost">
            <MdModeEdit size={20} />
          </Button>
        </DialogTrigger>
        <DialogContent className="overflow-y-auto h-[90%] w-[90%]">
          <form onSubmit={validation.handleSubmit}>
            <DialogHeader>
              <DialogTitle>{translations.editYourVCard}</DialogTitle>
              <DialogDescription>
                {translations.editVCardDescription}
              </DialogDescription>
              <label
                htmlFor="imageInput"
                className="flex justify-center items-center"
              >
                <div className="relative w-32 h-32">
                  <Avatar className="absolute inset-0 flex items-center justify-center w-full h-full">
                    <AvatarFallback className="text-[20px]">
                      {validation.values.firstName
                        ? validation.values.firstName[0]
                        : ""}
                      {validation.values.lastName
                        ? validation.values.lastName[0]
                        : ""}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </label>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              {/* First Name */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="firstName">
                  {translations.firstName}
                  <span className="text-red-700">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder={translations.firstName}
                  value={validation.values.firstName}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="lastName">
                  {translations.lastName}
                  <span className="text-red-700">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder={translations.lastName}
                  value={validation.values.lastName}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">
                  {translations.email}
                  <span className="text-red-700">*</span>
                </Label>
                <Input
                  id="customerEmail"
                  placeholder={translations.email}
                  value={validation.values.customerEmail}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>

              {/* Label */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="label">
                  {translations.label}
                  <span className="text-red-700">*</span>
                </Label>
                <Input
                  id="tag"
                  placeholder={translations.label}
                  value={validation.values.tag}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>

              {/* Title */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">{translations.title}</Label>
                <Input
                  id="title"
                  placeholder={translations.title}
                  value={validation.values.title}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phone">{translations.phone}</Label>
                <Input
                  id="phone"
                  placeholder={translations.phone}
                  value={validation.values.phone}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>

              {/* Company */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="company">{translations.company}</Label>
                <Input
                  id="company"
                  placeholder={translations.company}
                  value={validation.values.company}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>

              {/* Website */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="url">{translations.website}</Label>
                <Input
                  id="url"
                  placeholder="https://"
                  value={validation.values.url}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>

              {/* LinkedIn */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="linkedIn">{translations.linkedIn}</Label>
                <Input
                  id="linkedIn"
                  placeholder="https://"
                  value={validation.values.linkedIn}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>

              {/* Facebook */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="facebook">{translations.facebook}</Label>
                <Input
                  id="facebook"
                  placeholder="https://"
                  value={validation.values.facebook}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>

              {/* Instagram */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="instagram">{translations.instagram}</Label>
                <Input
                  id="instagram"
                  placeholder="https://"
                  value={validation.values.instagram}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>

              {/* TikTok */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="tiktok">{translations.tiktok}</Label>
                <Input
                  id="tiktok"
                  placeholder="https://"
                  value={validation.values.tiktok}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>

              {/* Snapchat */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="snapchat">{translations.snapchat}</Label>
                <Input
                  id="snapchat"
                  placeholder="https://"
                  value={validation.values.snapchat}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>

              {/* X (Twitter) */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="x">{translations.x}</Label>
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
              <Button type="submit">{translations.saveChanges}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditButton;
