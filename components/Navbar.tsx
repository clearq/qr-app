"use client";
import Link from "next/link";
import { ModeToggle } from "./ui/modeToggle";
import Image from "next/image";
import logoImage from "../public/image/qrLogo.png";
import { ExtendedUser } from "@/next-auth";
import { useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import React from "react";
import { logOut } from "@/actions/logOut";

interface Props {
  user?: ExtendedUser;
}

export const Navbar = ({ user: userData }: Props) => {
  const [user, setUser] = React.useState(null);

  const router = useRouter();

  const handleSignOut = async () => {
    await logOut();
    router.replace("/");
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setUser(data);
    };

    fetchData();
  }, []);

  return (
    <div className="">
      <ul className="flex flex-wrap justify-end items-end m-4 sm:m-10">
        <div className="mr-auto">
          <Link href="/">
            <Image
              alt="logo-image"
              src={logoImage}
              className="w-[50px] h-auto sm:w-[50px]"
            />
          </Link>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          {userData ? (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuContent></NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/all" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Overview
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/profile" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {
                        //@ts-ignore
                        user?.firstName
                      }{" "}
                      {
                        //@ts-ignore
                        user?.lastName
                      }
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <span className="cursor-pointer">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      onClick={handleSignOut}
                    >
                      Logout
                    </NavigationMenuLink>
                  </span>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
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
          <div className="z-50">
            <ModeToggle />
          </div>
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
