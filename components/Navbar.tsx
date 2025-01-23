"use client";

import Link from "next/link";
import { ModeToggle } from "./ui/modeToggle";
import Image from "next/image";
import logoImage from "../public/image/qrLogo.png";
import { ExtendedUser } from "@/next-auth";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { logOut } from "@/actions/logOut";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { PowerOff, Menu } from "lucide-react"; // Import Menu icon
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { ICUSTOMER } from "@/typings";

interface Props {
  user?: ExtendedUser;
}

export const Sidebar = ({ user: userData }: Props) => {
  const [user, setUser] = React.useState<ICUSTOMER | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

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

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Hide burger menu and page title on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        setIsVisible(false); // Hide when scrolled down
      } else {
        setIsVisible(true); // Show when at the top
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Map route to header title
  const pageTitles: Record<string, string> = {
    "/all": "Overview",
    "/events": "Events",
    "/ticket": "Tickets",
    "/dashboard": "URL",
    "/dashboardVcard": "Vcard",
    "/shop": "Business Unit",
    "/shop/products/datatable": "Items Table",
    "/shop/products/details": "Items ",
    "/profile": "Profile",
    "/login": "Login",
    "/register": "Register",
    "/qr": "Create URL",
  };
  const pageTitle = pageTitles[pathname] || "";

  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/shop/products/details"
  ) {
    return (
      <main className="flex-1 overflow-auto">
        <div className="p-4">
          <h1 className="ml-16 text-3xl font-bold">{pageTitle}</h1>
        </div>
        <section className="p-4">{/* Home Page Content */}</section>
      </main>
    );
  }

  return (
    <div className="flex h-screen z-50 fixed">
      {/* Mobile Menu Button */}
      <button
        className={`fixed top-4 right-4 z-50 p-2 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen || !isVisible ? "opacity-0" : "opacity-100"
        }`} // Hide button when sidebar is open or when scrolling down
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="w-6 h-6 sm:w-0 sm:h-0" /> {/* Hamburger icon */}
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`w-48 shadow-md flex flex-col fixed lg:relative h-screen bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out z-50 ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`} // Hide sidebar on mobile by default
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
          <Link href="/">
            <Image alt="logo" src={logoImage} className="w-[50px] h-auto" />
          </Link>
          <ModeToggle />
        </div>
        <nav className="flex-1 flex flex-col p-4">
          {userData ? (
            <>
              <Link
                href="/all"
                className={`py-2 flex-row rounded-lg hover:underline ${
                  pathname === "/all"
                }`}
              >
                Overview
              </Link>
              <Link
                href="/profile"
                className={`py-2 rounded-lg hover:underline ${
                  pathname === "/profile"
                }`}
              >
                Profile
              </Link>
              <Accordion className="ml-1" type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>URL</AccordionTrigger>
                  <AccordionContent>
                    <Link
                      href="/dashboard"
                      className={`py-2 px-3 rounded-lg hover:underline ${
                        pathname === "/dashboard"
                      }`}
                    >
                      URL Table
                    </Link>
                  </AccordionContent>
                  <AccordionContent>
                    <Link
                      href="/qr"
                      className={`py-2 px-3 rounded-lg hover:underline ${
                        pathname === "/qr"
                      }`}
                    >
                      Create URL
                    </Link>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>VCard</AccordionTrigger>
                  <AccordionContent>
                    <Link
                      href="/dashboardVcard"
                      className={`py-2 px-3 rounded-lg hover:underline ${
                        pathname === "/dashboard"
                      }`}
                    >
                      VCard Table
                    </Link>
                  </AccordionContent>
                  <AccordionContent>
                    <Link
                      href="/vcard"
                      className={`py-2 px-3 rounded-lg hover:underline ${
                        pathname === "/qr"
                      }`}
                    >
                      Create VCard
                    </Link>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Event</AccordionTrigger>
                  <AccordionContent>
                    <Link
                      href="/events"
                      className={`py-2 px-3 rounded-lg hover:underline ${
                        pathname === "/dashboard"
                      }`}
                    >
                      Events Table
                    </Link>
                  </AccordionContent>
                  <AccordionContent>
                    <Link
                      href="/ticket"
                      className={`py-2 px-3 rounded-lg hover:underline ${
                        pathname === "/qr"
                      }`}
                    >
                      Create Tickets
                    </Link>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Business Unit</AccordionTrigger>
                  <AccordionContent>
                    <Link
                      href="/shop"
                      className={`py-2 px-3 rounded-lg hover:underline ${
                        pathname === "/dashboard"
                      }`}
                    >
                      Business Unit Table
                    </Link>
                  </AccordionContent>
                  <AccordionContent>
                    <Link
                      href="/shop/products/datatable"
                      className={`py-2 px-3 rounded-lg hover:underline ${
                        pathname === "/shop/products/datatable"
                      }`}
                    >
                      Items Table
                    </Link>
                  </AccordionContent>
                  <AccordionContent>
                    <Link
                      href="/shop/category"
                      className={`py-2 px-3 rounded-lg hover:underline ${
                        pathname === "/qr"
                      }`}
                    >
                      Create Category
                    </Link>
                  </AccordionContent>
                  <AccordionContent>
                    <Link
                      href="/shop/products"
                      className={`py-2 px-3 rounded-lg hover:underline ${
                        pathname === "/qr"
                      }`}
                    >
                      Create Items
                    </Link>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`py-2 px-3 rounded-lg ${
                  pathname === "/login"
                    ? "bg-gray-200 dark:bg-gray-800"
                    : "hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={`py-2 px-3 rounded-lg ${
                  pathname === "/register"
                    ? "bg-gray-200 dark:bg-gray-800"
                    : "hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                Register
              </Link>
            </>
          )}
        </nav>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="p-2 hover:text-slate-500 hover:transition-transform justify-start items-start"
                onClick={handleSignOut}
              >
                <PowerOff />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="flex justify-start items-start">Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div
          className={`p-4 transition-opacity duration-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`} // Hide page title when scrolling down
        >
          <h1 className="sm:ml-16 mt-16 sm:mt-16 text-3xl font-bold">
            {pageTitle}
          </h1>
        </div>
        <section className="p-4">
          {pathname === "/all"}
          {pathname === "/events"}
          {pathname === "/dashboard"}
          {pathname === "/ticket"}
          {pathname === "/dashboardVcard"}
          {pathname === "/profile"}
          {pathname === "/login"}
          {pathname === "/register"}
          {pathname === "/"}
        </section>
      </main>
    </div>
  );
};

export default Sidebar;
