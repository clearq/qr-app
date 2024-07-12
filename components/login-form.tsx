'use client'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Progress } from "./ui/progress"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { AuthError } from "next-auth"
import Link from "next/link"

export function LoginForm() {

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
        setError("Invalid email or password");
        return;
      }
    
      if (!password || password.length < 8) {
        setError("Invalid email or password");
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
          // Reload the page
          window.location.reload();
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
        className="mr-9 ml-9"
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
    <div className="flex justify-center items-center mt-52">
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="company">Company</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
        <CardHeader>
            <CardTitle>User</CardTitle>
            <CardDescription>
            Sign in with your email here.
            </CardDescription>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleSubmit}>
              <Label>Email</Label>
            <Input
              type="text"
              className="w-full border border-gray-30 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:text-black "
              placeholder="example@qrgen.se"
              required
              />
              <Label>Password</Label>
            <Input
              autoComplete="password"
              type="password"
              className="w-full border border-gray-30 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:text-black "
              placeholder="Password"
              required
            />

            <Button
              type="submit"
              className=" text-white hover:text-white py-2 rounded bg-slate-800 hover:bg-slate-950"
              variant='outline'
            >
              {" "}
              Sign in
            </Button>
            <p className="text-red-600 text-[16px]  mb-4">{error && error}</p>
          </form>
          <div className="text-center text-gray-500 text-[20px] ">- OR -</div>
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
            Sign in with your organistation number here.
            </CardDescription>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleSubmit}>
              <Label>Org.Nr</Label>
            <Input
              type="text"
              className="w-full border border-gray-30 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:text-black "
              placeholder="123456-7890"
              required
              />
              <Label>Password</Label>
            <Input
              autoComplete="password"
              type="password"
              className="w-full border border-gray-30 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:text-black "
              placeholder="Password"
              required
            />

            <Button
              type="submit"
              className=" text-white hover:text-white py-2 rounded bg-slate-800 hover:bg-slate-950"
              variant='outline'
            >
              {" "}
              Sign in
            </Button>
            <p className="text-red-600 text-[16px]  mb-4">{error && error}</p>
          </form>
          <div className="text-center text-gray-500 text-[20px] ">- OR -</div>
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
  )
}
