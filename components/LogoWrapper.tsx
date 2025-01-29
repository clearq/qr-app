"use client"; // Mark this as a Client Component

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeImage from "@/components/ThemeImage";

export default function LogoWrapper() {
  const pathname = usePathname(); // Get the current route

  // Define the routes where the logo should not be displayed
  const hideLogoRoutes = ["/"]; // Add the routes where you want to hide the logo

  // Check if the current route is in the hideLogoRoutes array
  const shouldHideLogo = hideLogoRoutes.includes(pathname);

  // Conditionally render the logo
  if (shouldHideLogo) {
    return null; // Don't render the logo
  }

  return (
    <Link className="p-4 absolute" href="/">
      <ThemeImage /> {/* Use the updated ThemeImage component here */}
    </Link>
  );
}
