import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import * as yup from "yup";

import { toast } from "@/components/ui/use-toast";

import { CardContent } from "./ui/card";
import { Customer } from "@prisma/client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  user: Customer;
}

// interface DeleteButtonProps {
//     id: string;
//     onDelete: (id: string) => void;
//   }

export const DeleteUser = ({ user: userData}: Props) => {
  const [deleteEmail, setDeleteEmail] = useState("");
  const router = useRouter()

  const validation = useFormik({
    initialValues: {
      email: userData?.email,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      phone: userData?.phone || "",
      company: userData?.company || "",
      image: userData.image,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: yup.object({
      email: yup.string().email()
    }),
    onSubmit: (values) => {
      fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },})
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

  const handleDeleteAccount = async (id: string) => {
    if (deleteEmail !== userData.email) {
      toast({
        variant: "destructive",
        title: "Email does not match",
        description: "Please enter the correct email to delete your account",
      });
      return;
    }
  
    try {
      const response = await fetch(`/api/profile/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: deleteEmail }),
      });
  
      if (response.status === 200) {
        toast({
          title: "Account deleted successfully",
          description: `${new Date().toLocaleDateString()}`,
        });
  
        // Clear the session
        signOut();
  
        // Redirect to the homepage or login page
        router.push('/');
  
      } else {
        const errorData = await response.json();
        console.error("Error response data:", errorData);
        toast({
          variant: "destructive",
          title: "Error deleting account",
          description: `${new Date().toLocaleDateString()}`,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: `${new Date().toLocaleDateString()}`,
      });
    }
  };
  
  

  return (
    <div className="flex mr-9 mt-5 ">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="hover:bg-red-500" variant="outline">
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Do you want to delete Your account?</DialogTitle>
            <DialogDescription>
              {
                "If you delete your account you will lose all your data(Vcard, Qr etc.) and your analytics. Whenever you want to delete your account ENTER your EMAIL CORRECTLY and then click on delete.  "
              }
            </DialogDescription>
          </DialogHeader>
          <CardContent className="mt-10 w-full">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="deleteEmail">Enter your email to delete account</Label>
            <Input
              type="email"
              name="deleteEmail"
              placeholder="Email"
              value={deleteEmail}
              onChange={(e) => setDeleteEmail(e.target.value)}
            />
            <Button onClick={() => handleDeleteAccount(userData.id)} className="mt-4 bg-red-500 w-full">
              Delete Account
            </Button>
          </div>
        </CardContent>
        </DialogContent>
      </Dialog>
    </div>
  );
};
