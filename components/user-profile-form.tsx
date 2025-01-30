"use client";
import React, { useRef, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "@/components/ui/use-toast";
import { Customer } from "@prisma/client";
import { DeleteUser } from "./DeleteUser";
import { ChangePasswordForm } from "./change-password-form";
import { redirect } from "next/navigation";
import { uploadFile, autoLoginToCDN, getImageUrl } from "@/actions/api";
import { Icon } from "@iconify/react";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  user: Customer;
}

export const EditProfileForm = ({ user: userData }: Props) => {
  const [logo, setLogo] = useState<string | ArrayBuffer | null>(
    userData.image || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = React.useState(true); // Loading state
  const [fileKey, setFileKey] = useState<string>("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { translations } = useLanguage(); // Use the translation

  const validation = useFormik({
    initialValues: {
      email: userData?.email,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      phone: userData?.phone || "",
      company: userData?.company || "",
      image: userData.image,
      orgNumber: userData?.orgNumber || "",
      address: userData?.address || "",
      country: userData?.country || "",
      city: userData?.city || "",
      zip: userData?.zip || "",
    },
    validationSchema: yup.object({
      email: yup.string().email().required(`${translations.emailRequired}`),
      firstName: yup.string().required(`${translations.firstNameRequired}`),
      lastName: yup.string().required(`${translations.lastNameRequired}`),
      phone: yup.string().nullable(),
      company: yup.string().nullable(),
      orgNumber: yup.string().nullable(),
      address: yup.string().nullable(),
      country: yup.string().nullable(),
      city: yup.string().nullable(),
      zip: yup.string().nullable(),
    }),
    onSubmit: (values) => {
      fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then(async (response) => {
          if (response.status === 201) {
            const data = await response.json();
            toast({
              title: translations.updatedSuccessfully,
              description: `${new Date().toLocaleDateString()}`,
            });
            window.location.reload();
          } else {
            toast({
              variant: "destructive",
              title: translations.errorUpdatingData,
              description: `${new Date().toLocaleDateString()}`,
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          toast({
            variant: "destructive",
            title: translations.somethingWentWrong,
            description: `${new Date().toLocaleDateString()}`,
          });
        });
    },
  });

  const handleInputImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const userId = userData?.id || "default_user";
      const contentFolder = "profile";
      const key = `${userId}_${file.name}`;

      try {
        setUploading(true);

        // Retrieve the token from sessionStorage or auto-login to CDN
        const token =
          localStorage.getItem("cdnToken") || (await autoLoginToCDN());

        // Upload the file to the CDN
        await uploadFile(key, file, token, userId, contentFolder);

        // Generate the full image URL
        const imageUrl = getImageUrl(key, userId, contentFolder);

        if (imageUrl) {
          // Update the user profile with the new image key
          const response = await fetch("/api/profile", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: key, // Pass the image key for URL generation in the backend
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              phone: userData.phone,
              company: userData.company,
              orgNumber: userData.orgNumber,
              address: userData.address,
              country: userData.country,
              city: userData.city,
              zip: userData.zip,
            }),
          });

          if (response.ok) {
            // Refresh the image URL after updating the profile
            const updatedUser = await response.json();
            const refreshedImageUrl = getImageUrl(
              updatedUser.image,
              userId,
              contentFolder
            );
            if (refreshedImageUrl) {
              setLogo(refreshedImageUrl);
            }

            toast({
              title: translations.profileImageUpdated,
              description: translations.profileImageUpdatedDescription,
            });
          } else {
            throw new Error(translations.failedToUpdateProfile);
          }
        } else {
          throw new Error(translations.failedToGenImgUrl);
        }
      } catch (error) {
        console.error(translations.errorUploadingProfileImage, error);
        toast({
          variant: "destructive",
          title: translations.errorUploadingImage,
          description: translations.thereIsAnErrorImage,
        });
      } finally {
        setUploading(false);
      }
    }
  };

  // Handle the logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
        validation.setFieldValue("image", reader.result); // Save the image to the form field
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove the uploaded logo
  const handleRemoveLogo = () => {
    setLogo(null);
    validation.setFieldValue("image", ""); // Clear the form field value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!userData) {
    redirect("/");
  }

  return (
    <div className="w-full mt-20 h-full p-4 sm:pl-[260px]">
      <CardTitle className="text-2xl ">{translations.profile}</CardTitle>
      <div className="mt-5">
        <header>
          <h1 className="font-bold">{translations.editYourProfile}</h1>
          <h2>{translations.updateYourProfileHere}</h2>
        </header>
        <label className="flex mt-5 justify-center items-center">
          <div className="w-[124px] mt-5 h-[124px] mb-5 relative rounded-full">
            <Avatar className="w-32 h-32 mb-4">
              {logo ? (
                <AvatarImage src={logo as string} alt="Uploaded Logo" />
              ) : (
                <AvatarFallback className="uppercase text-[16px]">
                  {validation.values.firstName[0]}
                  {validation.values.lastName[0]}
                </AvatarFallback>
              )}
            </Avatar>
            <Button
              asChild
              size="icon"
              className="h-8 w-8 rounded-full cursor-pointer absolute bottom-0 right-0"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Label htmlFor="image">
                <Icon
                  className={`w-5 h-5 ${
                    uploading ? "text-gray-400" : "text-primary-foreground"
                  }`}
                  icon={
                    uploading ? "heroicons:refresh" : "heroicons:pencil-square"
                  }
                />
              </Label>
            </Button>
            <input
              ref={fileInputRef}
              id="imageInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />

            {logo && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemoveLogo}
                className="w-[35px] h-[35px] right-0 bottom-[52px] relative rounded-full"
              >
                X
              </Button>
            )}
          </div>
        </label>
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
                {translations.firstName}
                <span className="text-red-700">*</span>
              </Label>
              <Input
                name="firstName"
                placeholder={translations.firstName}
                value={validation.values.firstName}
                onChange={validation.handleChange}
                style={{ fontSize: "16px" }}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastName">
                {translations.lastName}
                <span className="text-red-700">*</span>
              </Label>
              <Input
                name="lastName"
                placeholder={translations.lastName}
                value={validation.values.lastName}
                onChange={validation.handleChange}
                style={{ fontSize: "16px" }}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">
                {translations.email}
                <span className="text-red-700">*</span>
              </Label>
              <Input
                type="email"
                name="email"
                placeholder={translations.email}
                value={validation.values.email}
                onChange={validation.handleChange}
                style={{ fontSize: "16px" }}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phone">{translations.phone}</Label>
              <Input
                type="tel"
                name="phone"
                placeholder={translations.phone}
                value={validation.values.phone}
                onChange={validation.handleChange}
                style={{ fontSize: "16px" }}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="company">{translations.company}</Label>
              <Input
                name="company"
                placeholder={translations.company}
                value={validation.values.company}
                onChange={validation.handleChange}
                style={{ fontSize: "16px" }}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="orgNumber">{translations.orgNumber}</Label>
              <Input
                name="orgNumber"
                placeholder={translations.orgNr}
                value={validation.values.orgNumber}
                onChange={validation.handleChange}
                style={{ fontSize: "16px" }}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="address">{translations.address}</Label>
              <Input
                name="address"
                placeholder={translations.street}
                value={validation.values.address}
                onChange={validation.handleChange}
                style={{ fontSize: "16px" }}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="city">{translations.city}</Label>
              <Input
                name="city"
                placeholder={translations.cityName}
                value={validation.values.city}
                onChange={validation.handleChange}
                style={{ fontSize: "16px" }}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="zip">{translations.zip}</Label>
              <Input
                name="zip"
                placeholder={translations.zipNr}
                value={validation.values.zip}
                onChange={validation.handleChange}
                style={{ fontSize: "16px" }}
              />
            </div>
            <Button type="submit" className="mt-[25px] mb-4 w-full">
              {translations.saveChanges}
            </Button>
          </form>
          {/* Updated Change Password Section */}
          <div className="mt-6">
            {!showChangePassword ? (
              <Button
                variant="link"
                className="text-sm justify-start mr-2"
                onClick={() => setShowChangePassword(true)}
              >
                {translations.passwordChangeConformation}
              </Button>
            ) : (
              <div>
                <CardTitle className="mb-4">
                  {translations.changePassword}
                </CardTitle>
                <ChangePasswordForm
                  //@ts-ignore
                  user={userData}
                />
                <Button
                  variant="link"
                  className="text-sm mt-2"
                  onClick={() => setShowChangePassword(false)}
                >
                  {translations.hidePassword}
                </Button>
              </div>
            )}
          </div>
          <DeleteUser user={userData} />
        </CardContent>
      </div>
    </div>
  );
};
