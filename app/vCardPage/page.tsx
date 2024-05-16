"use client";
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Pages from "@/components/Pages";
import QRCode from "qrcode.react";
import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const { toast } = useToast();

  const [logo, setLogo] = useState<string | null>(null);

  const { data: session } = useSession();

  const validation = useFormik({
    initialValues: {
      url: "",
      customerEmail: "",
      firstName: "",
      lastName: "",
      phone: "",
      company: "",
      title: "",
      logoType: "",
      image : "",
      linkedIn: "",
      x: "",
      facebook: "",
      instagram: "",
      snapchat: "",
      tiktok: "",
    },
    validationSchema: yup.object({
      url: yup.string().url().nullable(),
      customerEmail: yup.string().email().required("Email is required"),
      firstName: yup.string().min(3).required("First name is required"),
      lastName: yup.string().min(3).required("Last name is required"),
      phone: yup.number().nullable(),
      company: yup.string().nullable(),
      image : yup.string().nullable(),
      title: yup.string().nullable(),
      logoType: yup.string().nullable(),
      linkedIn: yup.string().nullable(),
      x: yup.string().nullable(),
      facebook: yup.string().nullable(),
      instagram: yup.string().nullable(),
      snapchat: yup.string().nullable(),
      tiktok: yup.string().nullable(),
    }),
    onSubmit: (values) => {
      console.log("Form values:", values); // Log form values
      fetch("/api/saveVcard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },  
        body: JSON.stringify(values),
      })
      .then(async (response) => {

        if (response.status === 201) {
          toast({
            title: `Created successfully!`,
            description: `${new Date().toLocaleDateString()}`,
          });
        } else {
          toast({
            variant: "destructive",
            title: `Error create VCard`,
            description: `${new Date().toLocaleDateString()}`,
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error); // Log any errors
        toast({
          variant: "destructive",
          title: `Something went wrong`,
          description: `${new Date().toLocaleDateString()}`,
        });
      });
    },
  });

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  const generateVCardString = (values: any) => {
    return `
BEGIN:VCARD
VERSION:3.0
N: ${values.firstName} ${values.lastName}
FN:${values.firstName} ${values.lastName}
EMAIL:${values.customerEmail}
TEL:${values.phone ?? ""}
ORG:${values.company ?? ""}
TITLE:${values.title ?? ""}
URL:${values.url ?? ""}
X-LINKEDIN:${values.linkedIn ?? ""}
X-TWITTER:${values.x ?? ""}
X-FACEBOOK:${values.facebook ?? ""}
X-INSTAGRAM:${values.instagram ?? ""}
X-SNAPCHAT:${values.snapchat ?? ""}
X-TIKTOK:${values.tiktok ?? ""}
END:VCARD
    `.trim();
  };

  const handleDownload = () => {
    const values = validation.values;
    const vCardData = generateVCardString(values);

    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${values.firstName}_${values.lastName}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-col w-full ">
        <Pages />
        <Card className="mt-40">
          <CardHeader>
            <CardTitle>VCard</CardTitle>
            <CardDescription>Create your VCard here</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="" onSubmit={validation.handleSubmit}>
              <div className="grid grid-cols-2 w-[50%] items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="firstName">
                    First Name<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={validation.values.firstName}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.firstName && validation.errors.firstName ? (
                    <div className="text-red-500">{validation.errors.firstName}</div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="lastName">
                    Last Name<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={validation.values.lastName}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.lastName && validation.errors.lastName ? (
                    <div className="text-red-500">{validation.errors.lastName}</div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">
                    Email<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="customerEmail"
                    placeholder="Email"
                    value={validation.values.customerEmail}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.customerEmail && validation.errors.customerEmail ? (
                    <div className="text-red-500">{validation.errors.customerEmail}</div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="url">Website</Label>
                  <Input
                    type="text"
                    name="url"
                    placeholder="https://"
                    value={validation.values.url}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.url && validation.errors.url ? (
                    <div className="text-red-500">{validation.errors.url}</div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    type="text"
                    name="phone"
                    placeholder="Tel."
                    value={validation.values.phone}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.phone && validation.errors.phone ? (
                    <div className="text-red-500">{validation.errors.phone}</div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={validation.values.company}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.company && validation.errors.company ? (
                    <div className="text-red-500">{validation.errors.company}</div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={validation.values.title}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.title && validation.errors.title ? (
                    <div className="text-red-500">{validation.errors.title}</div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="linkedIn">LinkedIn</Label>
                  <Input
                    type="text"
                    name="linkedIn"
                    placeholder="https://"
                    value={validation.values.linkedIn}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.linkedIn && validation.errors.linkedIn ? (
                    <div className="text-red-500">{validation.errors.linkedIn}</div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    type="text"
                    name="facebook"
                    placeholder="https://"
                    value={validation.values.facebook}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.facebook && validation.errors.facebook ? (
                    <div className="text-red-500">{validation.errors.facebook}</div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    type="text"
                    name="instagram"
                    placeholder="https://"
                    value={validation.values.instagram}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.instagram && validation.errors.instagram ? (
                    <div className="text-red-500">{validation.errors.instagram}</div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="tiktok">Tiktok</Label>
                  <Input
                    type="text"
                    name="tiktok"
                    placeholder="https://"
                    value={validation.values.tiktok}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.tiktok && validation.errors.tiktok ? (
                    <div className="text-red-500">{validation.errors.tiktok}</div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="snapchat">Snapchat</Label>
                  <Input
                    type="text"
                    name="snapchat"
                    placeholder="https://"
                    value={validation.values.snapchat}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.snapchat && validation.errors.snapchat ? (
                    <div className="text-red-500">{validation.errors.snapchat}</div>
                  ) : null}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="x">X</Label>
                  <Input
                    type="text"
                    name="x"
                    placeholder="https://"
                    value={validation.values.x}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                  />
                  {validation.touched.x && validation.errors.x ? (
                    <div className="text-red-500">{validation.errors.x}</div>
                  ) : null}
                </div>
              </div>
            </form>
            <div className="grid grid-flow-row justify-start mt-4 items-start bottom-96">
              <QRCode
                id="qr-code-svg"
                value={generateVCardString(validation.values)}
                size={450}
                imageSettings={{
                  //@ts-ignore
                  src: logo ?? null,
                  height: 48,
                  width: 48,
                  excavate: true,
                }}
              />
            </div>
            <br />
            <div className="flex flex-row">
              <Button
                className="flex mr-3"
                onClick={() => validation.handleSubmit()}
              >
                Save
              </Button>
              <Button onClick={handleDownload}>Download vCard</Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
