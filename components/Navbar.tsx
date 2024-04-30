"use client";
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Dropdown";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ui/modeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function Navbar() {
  const { data: session }: any = useSession();
  return (
    <div className="">
      <ul className="flex justify-between m-10 item-canter">
        <div>
          <Link href="/">
            <li>Qr-generator</li>
          </Link>
        </div>
        <div className="flex gap-10">
          {!session ? (
            <>
              <Link href="/login">
                <li>Login</li>
              </Link>
              <Link href="/register">
                <li>Register</li>
              </Link>
            </>
          ) : (
            <>
              <DropdownMenu>
                <Avatar>
                  <AvatarImage>{session.user?.image}</AvatarImage>
                  {/* <AvatarFallback>CN</AvatarFallback> */}
                </Avatar>
                <DropdownMenuTrigger>{session.user?.email}</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <li>
                <Button
                  onClick={() => {
                    signOut();
                  }}
                  className="p-2 hover:text-white px-5 -mt-1 hover:bg-blue-500 "
                  variant='outline'
                >
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
}

export default Navbar;
