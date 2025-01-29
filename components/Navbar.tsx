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
import {
  PowerOff,
  Menu,
  Home,
  User,
  Link as LinkIcon,
  Contact,
  Calendar,
  Ticket,
  Building,
  FolderPlus,
  List,
  Plus,
  Folder,
} from "lucide-react"; // Import icons
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { ICUSTOMER } from "@/typings";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "./ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useLanguage } from "@/context/LanguageContext";
import ThemeImage from "./ThemeImage";

export const ROLES = {
  ACCOUNT: "1",
  COMPANY: "2",
};

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
  const { translations, setLanguage, language } = useLanguage();

  const handleSignOut = async () => {
    toast({
      title: `Do you want to signout?`,
      description: `Please confirm`,
      action: (
        <button
          onClick={async () => {
            await logOut();
            window.location.replace("/");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Confirm Logout
        </button>
      ),
    });
  };

  const validation = useFormik({
    initialValues: {
      roleId: userData?.roleId || "",
    },
    validationSchema: yup.object({
      roleId: yup.string().required("Role ID is required"),
    }),
    onSubmit: () => {},
  });

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setUser(data);
      validation.setValues({ roleId: data.roleId });
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    "/qr": "Create URL",
    "/shop/products": "Create Item",
    "/shop/category": "Create Category",
  };
  const pageTitle = pageTitles[pathname] || "";

  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/shop/products/details" ||
    pathname === "/reset-password" ||
    pathname === "/forgot-password"
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
    <div className="flex z-50 h-screen fixed">
      {/* Mobile Menu Button */}
      <button
        className={`fixed top-4 right-4 z-50 p-2 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen || !isVisible ? "opacity-0" : "opacity-100"
        }`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="w-6 h-6 sm:w-0 sm:h-0" />
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
        className={`w-48 shadow-md flex flex-col fixed lg:relative h-screen bg-white dark:bg-[#151515] transform transition-transform duration-300 ease-in-out z-50 ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
            {/* <Image alt="logo" src={logoImage} className="w-[50px] h-auto" /> */}
            <ThemeImage />
          </Link>
          <ModeToggle />
        </div>
        <nav className="flex-1 flex flex-col p-4">
          {userData ? (
            <>
              <Link
                href="/all"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-2 flex items-center space-x-2 rounded-lg hover:underline ${
                  pathname === "/all" ? "font-bold" : ""
                }`}
              >
                <Home className="w-5 h-5" />
                <span>{translations.overview}</span>
              </Link>
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-2 flex items-center space-x-2 mt-2 rounded-lg hover:underline ${
                  pathname === "/profile" ? "font-bold" : ""
                }`}
              >
                <User className="w-5 h-5" />
                <span>{translations.profile}</span>
              </Link>
              <Accordion className="ml-1" type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="flex items-center space-x-2">
                    <LinkIcon className="w-5 h-5" />
                    <span>{translations.link}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Link
                      href="/qr"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`py-2 px-3 flex items-center space-x-2 rounded-lg hover:underline ${
                        pathname === "/qr" ? "font-bold" : ""
                      }`}
                    >
                      <Plus className="w-5 h-5" />
                      <span>{translations.createLink}</span>
                    </Link>
                  </AccordionContent>
                  <AccordionContent>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`py-2 px-3 flex items-center space-x-2 rounded-lg hover:underline ${
                        pathname === "/dashboard" ? "font-bold" : ""
                      }`}
                    >
                      <List className="w-5 h-5" />
                      <span>{translations.linkTable}</span>
                    </Link>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="flex items-center space-x-2">
                    <Contact className="w-5 h-5" />
                    <span>{translations.vcard}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Link
                      href="/vcard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`py-2 px-3 flex items-center space-x-2 rounded-lg hover:underline ${
                        pathname === "/qr" ? "font-bold" : ""
                      }`}
                    >
                      <Plus className="w-5 h-5" />
                      <span>{translations.createVCard}</span>
                    </Link>
                  </AccordionContent>
                  <AccordionContent>
                    <Link
                      href="/dashboardVcard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`py-2 px-3 flex items-center space-x-2 rounded-lg hover:underline ${
                        pathname === "/dashboard" ? "font-bold" : ""
                      }`}
                    >
                      <List className="w-5 h-5" />
                      <span>{translations.vcardTable}</span>
                    </Link>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>{translations.event}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Link
                      href="/events/createEvent"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`py-2 px-3 flex items-center space-x-2 rounded-lg hover:underline ${
                        pathname === "/events/createEvent" ? "font-bold" : ""
                      }`}
                    >
                      <Plus className="w-5 h-5" />
                      <span>{translations.createEvent}</span>
                    </Link>
                  </AccordionContent>
                  <AccordionContent>
                    <Link
                      href="/events"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`py-2 px-3 flex items-center space-x-2 rounded-lg hover:underline ${
                        pathname === "/dashboard" ? "font-bold" : ""
                      }`}
                    >
                      <List className="w-5 h-5" />
                      <span>{translations.eventsTable}</span>
                    </Link>
                  </AccordionContent>
                  <AccordionContent>
                    <Link
                      href="/ticket"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`py-2 px-3 flex items-center space-x-2 rounded-lg hover:underline ${
                        pathname === "/ticket" ? "font-bold" : ""
                      }`}
                    >
                      <Ticket className="w-5 h-5" />
                      <span>{translations.createTickets}</span>
                    </Link>
                  </AccordionContent>
                </AccordionItem>
                {validation.values.roleId === ROLES.COMPANY && (
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="flex items-center space-x-2">
                      <Building className="w-5 h-5" />
                      <span>{translations.businessUnit}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Link
                        href="/shop/createShop"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`py-2 px-3 flex items-center space-x-2 rounded-lg hover:underline ${
                          pathname === "/shop/createShop" ? "font-bold" : ""
                        }`}
                      >
                        <Plus className="w-5 h-5" />
                        <span>{translations.createUnit}</span>
                      </Link>
                    </AccordionContent>
                    <AccordionContent>
                      <Link
                        href="/shop"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`py-2 px-3 flex items-center space-x-2 rounded-lg hover:underline ${
                          pathname === "/shop" ? "font-bold" : ""
                        }`}
                      >
                        <List className="w-5 h-5" />
                        <span>{translations.businessUnitTable}</span>
                      </Link>
                    </AccordionContent>
                    <AccordionContent>
                      <Link
                        href="/shop/category"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`py-2 px-3 flex items-center space-x-2 rounded-lg hover:underline ${
                          pathname === "/shop/category" ? "font-bold" : ""
                        }`}
                      >
                        <FolderPlus className="w-5 h-5" />
                        <span>{translations.createCategory}</span>
                      </Link>
                    </AccordionContent>
                    <AccordionContent>
                      <Link
                        href="/shop/products"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`py-2 px-3 flex items-center space-x-2 rounded-lg hover:underline ${
                          pathname === "/shop/products" ? "font-bold" : ""
                        }`}
                      >
                        <Plus className="w-5 h-5" />
                        <span>{translations.createItems}</span>
                      </Link>
                    </AccordionContent>
                    <AccordionContent>
                      <Link
                        href="/shop/products/datatable"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`py-2 px-3 flex items-center space-x-2 rounded-lg hover:underline ${
                          pathname === "/shop/products/datatable"
                            ? "font-bold"
                            : ""
                        }`}
                      >
                        <List className="w-5 h-5" />
                        <span>{translations.itemsTable}</span>
                      </Link>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-2 px-3 flex items-center space-x-2 rounded-lg ${
                  pathname === "/login"
                    ? "bg-gray-200 dark:bg-gray-800"
                    : "hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                <Home className="w-5 h-5" />
                <span>{translations.login}</span>
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-2 px-3 flex items-center space-x-2 rounded-lg ${
                  pathname === "/register"
                    ? "bg-gray-200 dark:bg-gray-800"
                    : "hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                <User className="w-5 h-5" />
                <span>{translations.register}</span>
              </Link>
            </>
          )}
        </nav>
        <div className="flex flex-row mr-1 space-x-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-2 mb-28 flex flex-row space-x-2 sm:mb-2 hover:text-slate-500 hover:transition-transform justify-start items-start"
                  onClick={handleSignOut}
                >
                  <PowerOff className="w-5 h-5" />
                  <p className="flex justify-start items-start">
                    {translations.logout}
                  </p>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="flex justify-start items-start">
                  {translations.logout}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Select
            value={language}
            onValueChange={(value) => setLanguage(value)}
          >
            <SelectTrigger className=" p-2 border rounded-md">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">En</SelectItem>
              <SelectItem value="sv">Sv</SelectItem>
              <SelectItem value="ar">Ar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </aside>

      {/* Main Content */}
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
    </div>
  );
};

export default Sidebar;
