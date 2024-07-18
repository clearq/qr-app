'use client'
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ui/modeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./Dropdown";
import Image from "next/image";
import logoImage from "../public/image/qrLogo.png";
import { ExtendedUser } from "@/next-auth";
import { useRouter } from "next/navigation";


interface Props {
  user?: ExtendedUser;
}

export const Navbar = ({ user: userData }: Props) => {
  const router = useRouter();

  const handleSignOut = async () => {
    signOut();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <ul className="flex flex-wrap justify-end items-end m-4 sm:m-10">
        <div className="mr-auto">
          <Link href="/">
            <Image
              alt="logo-image"
              src={logoImage}
              className="w-24 h-auto sm:w-24"
            />
          </Link>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          {userData ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                >
                  <Avatar className="flex justify-center items-center w-8 h-8 sm:w-15 sm:h-15">
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
                <Link href="/profile">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                </Link>
                <DropdownMenuSeparator />
                {/* <Link href="/all">
                  <DropdownMenuItem className="cursor-pointer">Overview</DropdownMenuItem>
                </Link> */}
                <Link href="/dashboard">
                  <DropdownMenuItem className="cursor-pointer">Qr Dashboard</DropdownMenuItem>
                </Link>
                <Link href="/dashboardVcard">
                  <DropdownMenuItem className="cursor-pointer">VCard Dashboard</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
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
