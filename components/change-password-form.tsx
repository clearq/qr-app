"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from "@/context/LanguageContext"; // Import the useLanguage hook

export const ChangePasswordForm = () => {
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const { translations } = useLanguage(); // Use the translations

  const toggleShowPassword = (field: string) => {
    setShowPassword((prevState) => ({
      ...prevState,
      //@ts-ignore
      [field]: !prevState[field],
    }));
  };

  const validation = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: yup.object({
      currentPassword: yup
        .string()
        .required(translations.currentPasswordRequired),
      newPassword: yup.string().required(translations.newPasswordRequired),
      confirmPassword: yup
        .string()
        .oneOf(
          [yup.ref("newPassword"), undefined],
          translations.passwordsMustMatch
        )
        .required(translations.confirmPasswordRequired),
    }),
    onSubmit: (values) => {
      fetch("/api/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then(async (response) => {
          if (response.status === 201) {
            toast({
              title: translations.passwordUpdatedSuccessfully,
              description: `${new Date().toLocaleDateString()}`,
            });
            validation.resetForm();
          } else {
            const errorData = await response.json();
            toast({
              variant: "destructive",
              title: translations.errorUpdatingPassword,
              description:
                errorData.error || `${new Date().toLocaleDateString()}`,
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

  return (
    <form
      onSubmit={validation.handleSubmit}
      className="w-full grid grid-cols-1 gap-4 mt-4"
    >
      <div className="flex flex-col space-y-1.5 relative">
        <Label htmlFor="currentPassword">{translations.currentPassword}</Label>
        <Input
          type={showPassword.currentPassword ? "text" : "password"}
          name="currentPassword"
          placeholder={translations.currentPassword}
          value={validation.values.currentPassword}
          onChange={validation.handleChange}
        />
        <span
          className="absolute right-2 top-6 cursor-pointer"
          onClick={() => toggleShowPassword("currentPassword")}
        >
          {showPassword.currentPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      <div className="flex flex-col space-y-1.5 relative">
        <Label htmlFor="newPassword">{translations.newPassword}</Label>
        <Input
          type={showPassword.newPassword ? "text" : "password"}
          name="newPassword"
          placeholder={translations.newPassword}
          value={validation.values.newPassword}
          onChange={validation.handleChange}
        />
        <span
          className="absolute right-2 top-6 cursor-pointer"
          onClick={() => toggleShowPassword("newPassword")}
        >
          {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      <div className="flex flex-col space-y-1.5 relative">
        <Label htmlFor="confirmPassword">{translations.confirmPassword}</Label>
        <Input
          type={showPassword.confirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder={translations.confirmPassword}
          value={validation.values.confirmPassword}
          onChange={validation.handleChange}
        />
        <span
          className="absolute right-2 top-6 cursor-pointer"
          onClick={() => toggleShowPassword("confirmPassword")}
        >
          {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      <Button type="submit" className="mt-4 w-full">
        {translations.savePassword}
      </Button>
    </form>
  );
};
