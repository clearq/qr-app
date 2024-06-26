'use client';
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "@/components/ui/use-toast";

export const ChangePasswordForm = () => {
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

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
      currentPassword: yup.string().required("Current password is required"),
      newPassword: yup.string().required("New password is required"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword"), undefined], "Passwords must match")
        .required("Confirm password is required"),
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
              title: `Password updated successfully!`,
              description: `${new Date().toLocaleDateString()}`,
            });
            validation.resetForm();
          } else {
            const errorData = await response.json();
            toast({
              variant: "destructive",
              title: `Error updating password`,
              description: errorData.error || `${new Date().toLocaleDateString()}`,
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

  return (
    <form onSubmit={validation.handleSubmit} className="w-full grid grid-cols-1 gap-4 mt-4">
      <div className="flex flex-col space-y-1.5 relative">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          type={showPassword.currentPassword ? "text" : "password"}
          name="currentPassword"
          placeholder="Current Password"
          value={validation.values.currentPassword}
          onChange={validation.handleChange}
        />
        <span className="absolute right-2 top-5 cursor-pointer" onClick={() => toggleShowPassword("currentPassword")}>
          {showPassword.currentPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      <div className="flex flex-col space-y-1.5 relative">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          type={showPassword.newPassword ? "text" : "password"}
          name="newPassword"
          placeholder="New Password"
          value={validation.values.newPassword}
          onChange={validation.handleChange}
        />
        <span className="absolute right-2 top-5 cursor-pointer" onClick={() => toggleShowPassword("newPassword")}>
          {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      <div className="flex flex-col space-y-1.5 relative">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          type={showPassword.confirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={validation.values.confirmPassword}
          onChange={validation.handleChange}
        />
        <span className="absolute right-2 top-5 cursor-pointer" onClick={() => toggleShowPassword("confirmPassword")}>
          {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      <Button type="submit" className="mt-4 w-full">
        Change Password
      </Button>
    </form>
  );
};
