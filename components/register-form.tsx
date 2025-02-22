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
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormik } from "formik";
import * as yup from "yup";
import { createCustomer } from "@/actions/auth";
import { toast } from "./ui/use-toast";

export function RegisterForm() {
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("account");
  const router = useRouter();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const company = formData.get("company") as string;
    const orgNumber = formData.get("orgNumber") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const phone = formData.get("phone") as string;
    const zip = formData.get("zip") as string;

    if (!isValidEmail(email)) {
      setError("Invalid email");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    const roleId = company && orgNumber ? "2" : "1";

    try {
      const response = await createCustomer({
        email,
        password,
        firstName,
        lastName,
        company,
        orgNumber,
        address,
        city,
        phone,
        zip,
        roleId,
      });

      if (response?.customer) {
        toast({
          title: "Success",
          description: response.message || "Registered successfully",
        });
        setError(""); // Clear any previous errors

        // Send email
        const emailData = { email, firstName, lastName };
        const emailResponse = await fetch("/api/sendEmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailData),
        });

        if (!emailResponse.ok) {
          throw new Error("Email not sent");
        }

        router.replace("/login");
      } else {
        setError(response?.message || "Something went wrong");
        toast({
          title: "Error",
          description: response?.message || "Something went wrong",
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Something went wrong");
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    }
  };

  const validation = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      company: "",
      orgNumber: "",
      address: "",
      country: "",
      city: "",
      zip: "",
      phone: "",
      image: "",
      roleId: "",
    },
    validationSchema: yup.object({
      email: yup.string().email().required(),
      password: yup
        .string()
        .required("Is required")
        .matches(/(?=.*[0-9])/, "Must contain at least one number"),
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      company: yup.string(),
      orgNumber: yup.string(),
      address: yup.string(),
      country: yup.string(),
      city: yup.string(),
      zip: yup.string(),
      phone: yup.string(),
      image: yup.string(),
      roleId: yup.string().required(),
    }),
    onSubmit: async (values) => {
      const roleId = values.company && values.orgNumber ? "2" : "1";

      try {
        const response = await createCustomer({ ...values, roleId });

        if (response?.customer) {
          toast({
            title: "Success",
            description: response.message || "Registered successfully",
          });
          setError(""); // Clear any previous errors
          router.replace("/login");
        } else {
          setError(response?.message || "Something went wrong");
          toast({
            title: "Error",
            description: response?.message || "Something went wrong",
          });
        }
      } catch (error) {
        console.error("Error during registration:", error);
        setError("Something went wrong");
        toast({
          title: "Error",
          description: "Something went wrong",
        });
      }
    },
  });

  return (
    <div className="flex mt-20 sm:mt-0 justify-center items-center">
      <Tabs
        defaultValue="account"
        className="w-[400px]"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account" className="text-[#D4AF37]">
            Account
          </TabsTrigger>
          <TabsTrigger value="company" className="text-[#D4AF37]">
            Company
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>Sign up as user here.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Label>First Name</Label>
                <Input
                  type="text"
                  name="firstName"
                  value={validation.values.firstName}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  className="w-full border border-gray-30 rounded px-3 py-2 mb-4 focus:outline-none "
                  placeholder="James"
                  required
                />
                <Label>Last Name</Label>
                <Input
                  type="text"
                  name="lastName"
                  value={validation.values.lastName}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  className="w-full border border-gray-30 rounded px-3 py-2 mb-4 focus:outline-none "
                  placeholder="Rodrigez"
                  required
                />
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={validation.values.email}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  className="w-full border border-gray-30 rounded px-3 py-2 mb-4 focus:outline-none "
                  placeholder="example@qrgen.se"
                  required
                />
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={validation.values.password}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  className="w-full border border-gray-30 rounded px-3 py-2 mb-4 focus:outline-none "
                  placeholder="Password"
                  autoComplete="new-password"
                  required
                />
                {validation.touched.password && validation.errors.password && (
                  <div className="text-red-500">
                    {validation.errors.password}
                  </div>
                )}

                <p className="text-red-600 text-sm mt-2">{error}</p>
                <Button type="submit" className="">
                  {" "}
                  Register
                </Button>
              </form>

              <div className="text-center text-gray-500 text-[20px] ">
                - OR -
              </div>
              <Link
                href="/login"
                className="block text-center mb-4 text-[16px] text-grey-500 hover:underline mt-2"
              >
                Login with existing account
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Register</CardTitle>
              <CardDescription>Sign up as Company here.</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="grid grid-cols-2 space-x-1"
                onSubmit={handleSubmit}
              >
                <div>
                  <Label>First Name</Label>
                  <Input
                    type="text"
                    name="firstName"
                    value={validation.values.firstName}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    className="w-[90%] border border-gray-30 rounded px-3 py-2 mb-4 focus:outline-none "
                    placeholder="James"
                    required
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    value={validation.values.lastName}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    className="w-[90%] border border-gray-30 rounded px-3 py-2 mb-4 focus:outline-none "
                    placeholder="Rodrigez"
                    required
                  />
                </div>
                <div>
                  <Label>Org.Number</Label>
                  <Input
                    type="text"
                    name="orgNumber"
                    value={validation.values.orgNumber}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    className="w-[90%] border border-gray-30 rounded px-3 py-2 mb-4 focus:outline-none "
                    placeholder="123456-7890"
                    required
                  />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input
                    type="text"
                    name="company"
                    value={validation.values.company}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    className="w-[90%] border border-gray-30 rounded px-3 py-2 mb-4 focus:outline-none "
                    placeholder="QrGen"
                    required
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={validation.values.email}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    className="w-[90%] border border-gray-30 rounded px-3 py-2 mb-4 focus:outline-none "
                    placeholder="example@qrgen.se"
                    required
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    type="text"
                    name="address"
                    value={validation.values.address}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    className="w-[90%] border border-gray-30 rounded px-3 py-2 mb-4 focus:outline-none "
                    placeholder="1017 Airline Dr"
                    required
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <Input
                    type="text"
                    name="city"
                    value={validation.values.city}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    className="w-[90%] border border-gray-30 rounded px-3 py-2 mb-4 focus:outline-none "
                    placeholder="Kenner"
                    required
                  />
                </div>
                <div>
                  <Label>Zip/Postal Code</Label>
                  <Input
                    type="text"
                    name="zip"
                    value={validation.values.zip}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    className="w-[90%] border border-gray-30 rounded px-3 py-2 mb-4 focus:outline-none "
                    placeholder="70062"
                    required
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    name="password"
                    value={validation.values.password}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    className="w-[90%] border border-gray-30 rounded px-3 py-2 mb-4 focus:outline-none "
                    placeholder="Password"
                    autoComplete="new-password"
                    required
                  />
                  {validation.touched.password &&
                    validation.errors.password && (
                      <div className="text-[12px] text-red-500">
                        {validation.errors.password}
                      </div>
                    )}
                </div>
                {/* <div>
                  <Label>Role ID</Label>
                  <Input
                    type="text"
                    name="roleId"
                    value={activeTab === "account" ? "1" : "2"} // Automatically set roleId
                    readOnly
                    className="w-[90%] border border-gray-30 rounded px-3 py-2 mb-4 focus:outline-none "
                  />
                </div> */}
                <div>
                  {/* <Label>Image URL</Label>
                  <Input
                    type="text"
                    name="image"
                    value={validation.values.image}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    className="w-[90%] border border-gray-30 rounded px-3 py-2 mb-4 focus:outline-none "
                    placeholder="Image URL"
                  /> */}
                </div>
                <Button type="submit" className="w-[50%]">
                  {" "}
                  Register
                </Button>
                <p className="text-red-600 text-sm mt-2">{error}</p>
              </form>

              <div className="text-center text-gray-500 text-[20px] ">
                - OR -
              </div>
              <Link
                href="/login"
                className="block text-center mb-4 text-[16px] text-grey-500 hover:underline mt-2"
              >
                Login with existing account
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
