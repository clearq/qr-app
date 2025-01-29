import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import * as yup from "yup";
import QRCode from "qrcode.react";
import { toast } from "@/components/ui/use-toast";
import { Qr } from "@prisma/client";
import { useRouter } from "next/navigation";
import { MdModeEdit } from "react-icons/md";
import { useLanguage } from "@/context/LanguageContext"; // Import the useLanguage hook

interface EditButtonProps {
  qrData: Qr;
}

export const EditButton = ({ qrData: qr }: EditButtonProps) => {
  const [logo, setLogo] = useState<string | ArrayBuffer | null>(
    qr.logoType || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { translations } = useLanguage(); // Use the translations

  const validation = useFormik({
    initialValues: {
      id: qr.id,
      url: qr.url || "",
      tag: qr.tag || "",
      logoType: qr.logoType || "",
    },
    validationSchema: yup.object({
      url: yup.string().url().nullable(),
      tag: yup.string().nullable(),
      logoType: yup.string().nullable(),
    }),
    onSubmit: (values) => {
      fetch("/api/qr", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, logoType: logo }),
      }).then((response) => {
        if (response.status === 201) {
          toast({
            title: translations.updatedSuccessfully,
            description: new Date().toLocaleDateString(),
          });
          validation.resetForm();
          window.location.reload();
        } else {
          toast({
            variant: "destructive",
            title: translations.somethingWentWrong,
            description: new Date().toLocaleDateString(),
          });
        }
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

        // Calculate the new dimensions
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
              // Convert the resized image blob to data URL
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

  const handleCancel = () => {
    window.location.reload();
  };

  return (
    <>
      <Dialog>
        <DialogTrigger className="w-full">
          <Button className="w-full" variant="ghost">
            <MdModeEdit size={20} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{translations.editYourQR}</DialogTitle>
            <DialogDescription>
              {translations.editQRDescription}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  {translations.url}
                </Label>
                <Input
                  type="text"
                  id="url"
                  value={validation.values.url}
                  className="col-span-3"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tag" className="text-right">
                  {translations.label}
                </Label>
                <Input
                  id="tag"
                  value={validation.values.tag}
                  className="col-span-3"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                />
              </div>
              <div className="flex flex-col space-x-4">
                {logo ? (
                  <Button onClick={handleRemoveLogo} className="bg-red-500">
                    {translations.removeLogo}
                  </Button>
                ) : (
                  <>
                    <label
                      htmlFor="logoType"
                      className="text-[15px] px-5 py-2 text-center text-secondary cursor-pointer border rounded-[6px] bg-primary"
                    >
                      {translations.browse}
                    </label>
                    <input
                      type="file"
                      id="logoType"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleLogoUpload}
                    />
                  </>
                )}
              </div>
              <QRCode
                className="flex flex-col left-5 md:left-1 justify-center items-center mt-5 relative"
                value={`https://qrgen.clearq.se/redirect?id=${qr?.id}&type=qr`}
                size={window.innerWidth > 768 ? 500 : 300}
                imageSettings={{
                  src: logo ? logo.toString() : "",
                  height: 55,
                  width: 55,
                  excavate: true,
                }}
                renderAs="svg"
              />
            </div>
            <DialogFooter>
              <Button type="submit">{translations.saveChanges}</Button>
            </DialogFooter>
          </form>
          <Button
            variant={"destructive"}
            className="top-"
            onClick={handleCancel}
          >
            {translations.cancel}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
