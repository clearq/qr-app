'use client'
import { useState } from "react";
import Link from "next/link";
import {
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  ShoppingCart,
  Users,
  WalletCardsIcon,
  QrCodeIcon,
  BanknoteIcon,
  BoxIcon
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import StampSection from "./stamp-section";
import { UrlSection } from "./url-section";
import { VcardSection } from "./vcard-section";
import CampSection from "./camp-section";

export function Dashboard() {
  const [activeContent, setActiveContent] = useState("inventory");

  const renderContent = () => {
    switch (activeContent) {
      case "url":
        return <UrlSection/>;
      case "vcard":
        return <VcardSection/>;
      case "stamps":
        return <StampSection/>;
      case "campaign":
        return <CampSection/>;
      default:
        return <UrlSection/>;
    }
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r  md:block">
        <div className="flex h-full  flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            {/* <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">QrGen</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button> */}
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <button
                onClick={() => setActiveContent("url")}
                className="flex items-center gap-3 hover:bg-muted rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <QrCodeIcon className="h-4 w-4" />
                Url
              </button>
              <button
                onClick={() => setActiveContent("vcard")}
                className="flex items-center gap-3 rounded-lg hover:bg-muted px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <BanknoteIcon className="h-4 w-4" />
                Vcard
              </button>
              <button
                onClick={() => setActiveContent("stamps")}
                className="flex items-center gap-3 rounded-lg hover:bg-muted px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <WalletCardsIcon className="h-4 w-4" />
                Stamps{" "}
              </button>
              <button
                onClick={() => setActiveContent("campaign")}
                className="flex items-center gap-3 rounded-lg hover:bg-muted px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <BoxIcon className="h-4 w-4" />
                Campaign
              </button>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border- px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              <button
                onClick={() => setActiveContent("url")}
                className="flex items-center gap-3 hover:bg-muted rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <QrCodeIcon className="h-4 w-4" />
                Url
              </button>
              <button
                onClick={() => setActiveContent("vcard")}
                className="flex items-center gap-3 rounded-lg hover:bg-muted px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <BanknoteIcon className="h-4 w-4" />
                Vcard
              </button>
              <button
                onClick={() => setActiveContent("stamps")}
                className="flex items-center gap-3 rounded-lg hover:bg-muted px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <WalletCardsIcon className="h-4 w-4" />
                Stamps{" "}
              </button>
              <button
                onClick={() => setActiveContent("campaign")}
                className="flex items-center gap-3 rounded-lg hover:bg-muted px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <BoxIcon className="h-4 w-4" />
                Campaign
              </button>
            </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <CardTitle>James Rodrigez</CardTitle>
                {""}
              </div>
            </form>
          </div>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
          </div>
          
            {renderContent()}
            
        </main>
      </div>
    </div>
  );
}
