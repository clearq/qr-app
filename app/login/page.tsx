"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthError } from "next-auth";
import { Input } from "@/components/ui/input";

const Login = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
      if(session){
          router.replace("/dashboard")
      }
  },[session, router])

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password is invalid");
      return;
    }
    try {
      
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.error) {
      setError("Invalid email or password");
    } else {
      setError("");
    }
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            setError("Invalid email or password")
            default: 
            setError("something went worng")
          };
      }
    }
  };

  if (sessionStatus === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Progress className="text-center" value={33} />
      </div>
    );
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex min-h-screen flex-col items-center justify-center p-2">
          <CardHeader className="">
            Login
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              className="w-full border border-gray-30 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:text-black "
              placeholder="Email"
              required
            />

            <Input
              autoComplete="password"
              type="password"
              className="w-full border border-gray-30 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:text-black "
              placeholder="Password"
              required
            />

            <Button
              type="submit"
              className=" hover:text-white py-2 rounded hover:bg-blue-600"
              variant='outline'
            >
              {" "}
              Sign in
            </Button>
            <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
          </form>
          <div className="text-center text-gray-500 mt-4">- OR -</div>
          <Link
            href="/register"
            className="block text-center text-blue-500 hover:underline mt-2"
          >
            Register Here
          </Link>
        
      </div>
    )
  );
};

export default Login;
