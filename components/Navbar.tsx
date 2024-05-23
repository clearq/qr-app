'use client'
import React, { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ui/modeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { useRouter } from "next/navigation";
import { Customer } from "@prisma/client";
import { toast } from "./ui/use-toast";
import * as yup from "yup";
import { useFormik } from "formik";

interface Props {
  user: Customer;
}

export const Navbar = ({ user: userData }: Props) => {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const validation = useFormik({
    initialValues: {
      email: userData?.email,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      phone: userData?.phone || "",
      company: userData?.company || "",
      image: userData?.image || Buffer,
    },
    validationSchema: yup.object({
      email: yup.string().email().required("Email is required"),
      firstName: yup.string().required("First name is required"),
      lastName: yup.string().required("Last name is required"),
      phone: yup.string().nullable(),
      company: yup.string().nullable(),
      image: yup.string().nullable(),
    }),
    onSubmit: (values) => {
      console.log("Form values:", values);
      fetch("/api/profile", {
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

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <ul className="flex flex-wrap justify-between items-center m-10">
        <div>
          <Link href="/">
            <li className="cursor-pointer">Qr-generator</li>
          </Link>
        </div>
        <div className="flex flex-wrap gap-4 sm:gap-10 items-center">
          {!session ? (
            <>
              <Link href="/login">
                <li className="cursor-pointer">Login</li>
              </Link>
              <Link href="/register">
                <li className="cursor-pointer">Register</li>
              </Link>
            </>
          ) : (
            <>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      <Avatar className="flex flex-col justify-center items-center mr-2">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="User Image"
                        />
                        <AvatarFallback>
                          {session.user.firstName ? userData.firstName[0] : ""}
                          {session.user.lastName ? userData.lastName[0] : ""}
                        </AvatarFallback>
                      </Avatar>
                      {/* Show email on larger screens */}
                      <span className="hidden sm:inline">
                        {session.user?.email}
                      </span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 sm:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                          <Link href="/profile">
                            <NavigationMenuLink asChild>
                              <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                                Profile
                                <p className="text-sm leading-tight text-muted-foreground">
                                  Beautifully designed components that you can
                                  copy and paste into your apps. Accessible.
                                  Customizable. Open Source.
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                        <li className="row-span-3">
                          <Link href="/dashboard">
                            <NavigationMenuLink asChild>
                              <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                                QR
                                <p className="text-sm leading-tight text-muted-foreground">
                                  Beautifully designed components that you can
                                  copy and paste into your apps. Accessible.
                                  Customizable. Open Source.
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                        <li className="row-span-3">
                          <Link href="/dashboardVcard">
                            <NavigationMenuLink asChild>
                              <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                                VCard
                                <p className="text-sm leading-tight text-muted-foreground">
                                  Beautifully designed components that you can
                                  copy and paste into your apps. Accessible.
                                  Customizable. Open Source.
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* Conditionally render icon on mobile */}
              <li>
                <Button
                  onClick={handleSignOut}
                  className="p-2 hover:text-white px-5 hover:bg-blue-500"
                  variant="outline"
                >
                  {/* Render logout icon on small screens */}
                  <span className="inline sm:hidden">↩</span>
                  Logout
                </Button>
              </li>
            </>
          )}
          <ModeToggle />
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
