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
import Pages from "./Pages";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./Dropdown";

interface Props {
  user?: ExtendedUser;
}

export const Navbar = ({ user: userData }: Props) => {
  console.log("🚀 ~ Navbar ~ userData:", userData);

  const handleSignOut = () => {
    signOut();
  };

  const router = useRouter();

  const handleUrl = () => {
    router.push("/qr");
  };

  const handleAll = () => {
    router.push("/all");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <ul className="flex flex-wrap justify-end items-end m-4 sm:m-10">
          <Link href="/">
            <Image
              alt="logo-image"
              src={logoImage}
              className=" w-24 h-auto sm:w-52"
            />
          </Link>
        <div className="flex items-center gap-4 sm:gap-6">
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
              <li>
                <Button
                  onClick={handleAll}
                  className="p-2 text-sm sm:text-base px-3 sm:px-5"
                  variant="link"
                >
                  <span className="inline sm:hidden">↩</span>
                  <span className="hidden sm:inline">Overview</span>
                </Button>
              </li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
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
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href={'/profile'}>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  </Link>
                  <DropdownMenuSeparator />
                  <Link href={'/dashboard'}>
                    <DropdownMenuItem className="cursor-pointer">Qr Dashboard</DropdownMenuItem>
                  </Link>
                  <Link href={'/dashboardVcard'}>
                    <DropdownMenuItem className="cursor-pointer">VCard Dashboard</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
