"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "./ui/progress";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { AuthError } from "next-auth";
import Link from "next/link";

// Import SVG icons for the providers
import TimeerIcon from "@/public/image/timeerSVG.svg";
import StaffinIcon from "@/public/image/staffinSVG.svg";
import GoogleIcon from "@/public/image/googleSVG.svg";
import AppleIcon from "@/public/image/appleSVG.svg";

export function LoginForm() {
  const [error, setError] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (session) {
      const redirectUrl = sessionStorage.getItem("redirectUrl") || "/all";
      router.replace(redirectUrl);
      sessionStorage.removeItem("redirectUrl");
    }
  }, [session, router]);

  const isValidEmail = (input: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const orgNrRegex = /^\d{6}-\d{4}$/;
    return emailRegex.test(input) || orgNrRegex.test(input);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const identifier = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmail(identifier)) {
      setError("Invalid email or organization number");
      return;
    }

    if (!password || password.length < 8) {
      setError("Invalid email or organization number");
      return;
    }

    sessionStorage.setItem("redirectUrl", pathname);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: identifier, // Use identifier for both email and org number
        password,
      });
      if (res?.error) {
        setError("Invalid email or organization number");
      } else {
        setError("");
        // Reload the page
        window.location.reload();
      }
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            setError("Invalid email or organization number");
          default:
            setError("Something went wrong");
        }
      }
    }
  };

  const handleProviderSignIn = async (provider: string) => {
    try {
      await signIn(provider, { callbackUrl: "/all" });
    } catch (error) {
      setError("Failed to sign in with provider");
    }
  };

  return (
    <div className="flex mt-20 sm:mt-5 justify-center items-center">
      <Tabs defaultValue="account" className="w-[400px]">
        {/* <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account" className="text-[#D4AF37]">
            Account
          </TabsTrigger>
          <TabsTrigger value="company" className=" text-[#D4AF37]">
            Company
          </TabsTrigger>
        </TabsList> */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Sign in with your email here.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Label>Email</Label>
                <Input
                  type="text"
                  className="w-full border border-gray-30 rounded px-3 py-2 mb-4 focus:outline-none "
                  placeholder="example@qrgen.se"
                  required
                />
                <Label>Password</Label>
                <Input
                  autoComplete="password"
                  type="password"
                  className="w-full border border-gray-30 rounded px-3 py-2 mb-4 focus:outline-none"
                  placeholder="Password"
                  required
                />
                <Button type="submit" className="">
                  Sign in
                </Button>
                <p className="text-red-600 text-[16px] mb-4">
                  {error && error}
                </p>
              </form>
              <Link href="/forgot-password" className="text-sm hover:underline">
                Forgot Password?
              </Link>
              <div className="text-center text-gray-500 text-[20px]">
                - OR -
              </div>
              {/* <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => handleProviderSignIn("timeer")}
                  className="p-2"
                >
                  <TimeerIcon className="w-12 h-12" />
                </button>
                <button
                  onClick={() => handleProviderSignIn("staffin")}
                  className="p-2"
                >
                  <StaffinIcon className="w-12 h-12" />
                </button>
                <button
                  onClick={() => handleProviderSignIn("google")}
                  className="p-2"
                >
                  <GoogleIcon className="w-12 h-12" />
                </button>
                <button
                  onClick={() => handleProviderSignIn("apple")}
                  className="p-2"
                >
                  <AppleIcon className="w-12 h-12" />
                </button>
              </div> */}
              <Link
                href="/register"
                className="block text-center mb-4 text-[16px] text-grey-500 hover:underline mt-2"
              >
                Register Here
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company</CardTitle>
              <CardDescription>
                Sign in with your organization number here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Label>Email</Label>
                <Input
                  type="text"
                  className="w-full border border-gray-30 rounded px-3 py-2 mb-4 focus:outline-none"
                  placeholder="example@qrgen.se"
                  required
                />
                <Label>Password</Label>
                <Input
                  autoComplete="password"
                  type="password"
                  className="w-full border border-gray-30 rounded px-3 py-2 mb-4 focus:outline-none"
                  placeholder="Password"
                  required
                />
                <Button type="submit" className="">
                  Sign in
                </Button>
                <p className="text-red-600 text-[16px] mb-4">
                  {error && error}
                </p>
              </form>
              <Link href="/forgot-password" className="text-sm hover:underline">
                Forgot Password?
              </Link>
              <div className="text-center text-gray-500 text-[20px]">
                - OR -
              </div>
              {/* <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => handleProviderSignIn("timeer")}
                  className="p-2"
                >
                  <TimeerIcon className="w-12 h-12" />
                </button>
                <button
                  onClick={() => handleProviderSignIn("staffin")}
                  className="p-2"
                >
                  <StaffinIcon className="w-12 h-12" />
                </button>
                <button
                  onClick={() => handleProviderSignIn("google")}
                  className="p-2"
                >
                  <GoogleIcon className="w-12 h-12" />
                </button>
                <button
                  onClick={() => handleProviderSignIn("apple")}
                  className="p-2"
                >
                  <AppleIcon className="w-12 h-12" />
                </button>
              </div> */}
              <Link
                href="/register"
                className="block text-center mb-4 text-[16px] text-grey-500 hover:underline mt-2"
              >
                Register Here
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
