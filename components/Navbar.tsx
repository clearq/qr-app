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
  const [isVisible, setIsVisible] = React.useState(true); // Track navbar visibility
  const [lastScrollY, setLastScrollY] = React.useState(0); // Track last scroll position
  const [isAtTop, setIsAtTop] = React.useState(true);
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

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down and scrolled past 50px
        setIsVisible(false);
      } else {
        // Scrolling up or at the top
        setIsVisible(true);
      }
      setIsAtTop(currentScrollY === 0);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      {/* Navbar */}
      <div
        className={`fixed sm:w-[60%] top-0 w-full z-50 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isAtTop
            ? "bg-transparent"
            : "bg-white dark:bg-black sm:dark:bg-transparent sm:bg-transparent sm:shadow-none shadow-md"
        }`}
      >
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
                          user?.firstName[0]
                        }
                        {""}
                        {
                          //@ts-ignore
                          user?.lastName[0]
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

      {/* Spacer to prevent overlapping */}
      <div className="h-[80px] sm:h-[100px]"></div>
    </>
  );
};

export default Navbar;
