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

  const handleVcard = () => {
    router.push("/vcard");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <ul className="flex flex-wrap justify-between items-center m-4 sm:m-10">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/">
            <Image
              alt="logo-image "
              src={logoImage}
              className="cursor-pointer w-[80%] text-base justify-start items-start sm:text-lg"
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
              <div className="flex">
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 max-w-md sm:w-[200px]">
                  <Button
                    onClick={handleUrl}
                    variant="outline"
                    className="hover:bg-gray-800 hover:text-white"
                  >
                    URL
                  </Button>
                  <Button
                    onClick={handleVcard}
                    variant="outline"
                    className="hover:bg-gray-800 hover:text-white"
                  >
                    Vcard
                  </Button>
                </div>
              </div>

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
              {/* <li>
                <Button
                  onClick={handleSignOut}
                  className="p-2 text-sm sm:text-base hover:text-white px-3 sm:px-5 hover:bg-blue-500"
                  variant="outline"
                >
                  <span className="inline sm:hidden">↩</span>
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </li> */}
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
