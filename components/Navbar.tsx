"use client";
import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
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
import Image from "next/image";
import logoImage from "../public/image/clearqr2.svg";
import { ExtendedUser } from "@/next-auth";

interface Props {
  user?: ExtendedUser;
}

export const Navbar = ({ user: userData }: Props) => {
console.log("🚀 ~ Navbar ~ userData:", userData)

  // const validation = useFormik({
  //   initialValues: {
  //     email: userData?.email,
  //     firstName: userData?.firstName,
  //     lastName: userData?.lastName,
  //     phone: userData?.phone || "",
  //     company: userData?.company || "",
  //     image: userData?.image || undefined,
  //   },
  //   validationSchema: yup.object({
  //     email: yup.string().email().required("Email is required"),
  //     firstName: yup.string().required("First name is required"),
  //     lastName: yup.string().required("Last name is required"),
  //     phone: yup.string().nullable(),
  //     company: yup.string().nullable(),
  //     image: yup.string().nullable(),
  //   }),
  //   onSubmit: (values) => {
  //     console.log("Form values:", values);
  //     fetch("/api/profile", {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(values),
  //     })
  //       .then(async (response) => {
  //         if (response.status === 201) {
  //           toast({
  //             title: `Updated successfully!`,
  //             description: `${new Date().toLocaleDateString()}`,
  //           });
  //         } else {
  //           toast({
  //             variant: "destructive",
  //             title: `Error updating data`,
  //             description: `${new Date().toLocaleDateString()}`,
  //           });
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error:", error);
  //         toast({
  //           variant: "destructive",
  //           title: `Something went wrong`,
  //           description: `${new Date().toLocaleDateString()}`,
  //         });
  //       });
  //   },
  // });

  const handleSignOut = () => {
    signOut();
  };

  

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <ul className="flex flex-wrap justify-between items-center m-4 sm:m-10">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/">
            <Image
              alt="logo-image "
              src={logoImage}
              className="cursor-pointer w-[80%] text-base sm:text-lg"
            />
          </Link>
          {!userData ? (
            <>
              <Link href="/login">
                <li className="cursor-pointer text-sm sm:text-base">Login</li>
              </Link>
              <Link href="/register">
                <li className="cursor-pointer text-sm sm:text-base">
                  Register
                </li>
              </Link>
            </>
          ) : (
            <>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      <Avatar className="flex justify-center items-center mr-2 w-8 h-8 sm:w-10 sm:h-10">
                        <AvatarImage
                          src={userData?.image || ""}
                          alt="User Image"
                        />
                        <AvatarFallback>
                          {userData?.firstName ? userData?.firstName[0] : ""}
                          {userData?.lastName ? userData?.lastName[0] : ""}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline text-sm sm:text-base">
                        {userData?.email}
                      </span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 sm:w-[300px] lg:w-[400px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                          <Link href="/profile">
                            <NavigationMenuLink asChild>
                              <a className="flex h-full w-full select-none flex-col justify-start rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                                Profile
                                <p className="text-sm leading-tight text-muted-foreground">
                                  You can view your profile and edit the
                                  information here.
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                        <li className="row-span-3">
                          <Link href="/dashboard">
                            <NavigationMenuLink asChild>
                              <a className="flex h-full w-full select-none flex-col justify-start rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                                URL
                                <p className="text-sm leading-tight text-muted-foreground">
                                  View your QR-code here.
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                        <li className="row-span-3">
                          <Link href="/dashboardVcard">
                            <NavigationMenuLink asChild>
                              <a className="flex h-full w-full select-none flex-col justify-start rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                                VCard
                                <p className="text-sm leading-tight text-muted-foreground">
                                  View your VCard here.
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
              <li>
                <Button
                  onClick={handleSignOut}
                  className="p-2 text-sm sm:text-base hover:text-white px-3 sm:px-5 hover:bg-blue-500"
                  variant="outline"
                >
                  <span className="inline sm:hidden">↩</span>
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </li>
            </>
          )}
          <div>
            <ModeToggle />
          </div>
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
