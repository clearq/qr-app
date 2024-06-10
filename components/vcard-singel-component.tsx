"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { IVCARD } from "@/typings";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "./ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useFormik } from "formik";
import * as yup from "yup";
import { Progress } from "./ui/progress";
import QRCode from "qrcode.react";
import { useSession } from "next-auth/react";
import { GetImage } from "./GetImage";
import { saveAs } from "file-saver";
import { ExtendedUser } from "@/next-auth";

interface Props {
  user?: ExtendedUser;
}

export const VcardSingelComponent = ({ user }: Props) => {
  const params = useSearchParams();
  const router = useRouter();

  const id = params.get("id");
  const [vcardData, setVcardData] = useState<IVCARD>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { data: session } = useSession();
  const [logo, setLogo] = useState<string | ArrayBuffer | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validation = useFormik({
    initialValues: {
      customerEmail: vcardData?.customerEmail || "",
      firstName: vcardData?.firstName || "",
      lastName: vcardData?.lastName || "",
      phone: vcardData?.phone || "",
      company: vcardData?.company || "",
      image: vcardData?.image || undefined,
      tag: vcardData?.tag || "",
      title: vcardData?.title || "",
      linkedIn: vcardData?.linkedIn || "",
      x: vcardData?.x || "",
      facebook: vcardData?.facebook || "",
      instagram: vcardData?.instagram || "",
      snapchat: vcardData?.snapchat || "",
      tiktok: vcardData?.tiktok || "",
      url: vcardData?.url || "",
    },
    validationSchema: yup.object({
      customerEmail: yup.string().email().required("Email is required"),
      firstName: yup.string().required("First name is required"),
      lastName: yup.string().required("Last name is required"),
      phone: yup.string().nullable(),
      company: yup.string().nullable(),
      tag: yup.string().nullable(),
      title: yup.string().nullable(),
      linkedIn: yup.string().nullable(),
      x: yup.string().nullable(),
      facebook: yup.string().nullable(),
      instagram: yup.string().nullable(),
      snapchat: yup.string().nullable(),
      tiktok: yup.string().nullable(),
      url: yup.string().nullable(),
      image: yup.string().nullable(),
    }),
    onSubmit: (values) => {
      fetch("/api/saveVcard", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then(async (response) => {
          if (response.status === 201) {
            toast({
              title: `Updated successfully!`,
              description: `${new Date().toLocaleDateString()}`,
            });
          } else {
            toast({
              variant: "destructive",
              title: `Error updating data`,
              description: `${new Date().toLocaleDateString()}`,
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          toast({
            variant: "destructive",
            title: `Something went wrong`,
            description: `${new Date().toLocaleDateString()}`,
          });
        });
    },
  });

  const fetchData = useCallback(() => {
    // put analyes action to increment the views number

    fetch(`/api/saveVcard/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast({
            title: `${data.error}`,
            description: `${new Date().toLocaleDateString()}`,
          });
        }
        setVcardData(data);
        validation.setValues(data); // Ensure formik values are set
      })
      .catch((err) =>
        toast({
          title: "Something went wrong",
          description: `${new Date().toLocaleDateString()}`,
        })
      );
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const generateVCardString = (values: any) => {
    const photo = values.logoType ? `PHOTO;ENCODING=b;TYPE=PNG:${values.logoType}` : '';
    return `
BEGIN:VCARD
VERSION:3.0
N:${values.lastName};${values.firstName};;;
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

  const handleDownloadVcard = () => {
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

  const downloadQRCode = (format: "png" | "svg") => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector("canvas");
    if (canvas) {
      if (format === "png") {
        canvas.toBlob((blob) => {
          if (blob) {
            saveAs(blob, `qrcode.${format}`);
          }
        }, "image/png");
      } else if (format === "svg") {
        const svg = qrRef.current.querySelector("svg");
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const blob = new Blob([svgData], {
            type: "image/svg+xml;charset=utf-8",
          });
          saveAs(blob, `qrcode.${format}`);
        }
      }
    }
  };

  const copyUrlToClipboard = () => {
    //@ts-ignore
    const url = `https://qrgen.clearq.se/vcard/details?id=${vcardData.id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "URL copied to clipboard",
        description: `${new Date().toLocaleDateString()}`,
      });
    }).catch((error) => {
      toast({
        variant: "destructive",
        title: "Failed to copy URL",
        description: `${new Date().toLocaleDateString()}`,
      });
    });
  };

  if (!vcardData) {
    return (
      <div className="flex mr-9 ml-9 justify-center items-center h-screen">
        <Progress className="text-center" value={33} />
      </div>
    );
  }

  if (!id) {
    router.replace("/dashboardVcard");
  }

  return (
    <div>
      {session ? (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="flex flex-col justify-center items-center">
            <CardHeader>
              <CardTitle>VCard Details</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <GetImage vData={vcardData} />
            <CardContent className="mt-10 w-full">
              <form className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="firstName">
                    First Name<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    name="firstName"
                    placeholder="First Name"
                    value={validation.values.firstName}
                    readOnly
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="lastName">
                    Last Name<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    name="lastName"
                    placeholder="Last Name"
                    value={validation.values.lastName}
                    readOnly
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">
                    Email<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    name="email"
                    placeholder="Email"
                    value={validation.values.customerEmail}
                    readOnly
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    name="phone"
                    placeholder="Phone"
                    value={validation.values.phone ?? ""}
                    readOnly
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    name="company"
                    placeholder="Company"
                    value={validation.values.company ?? ""}
                    readOnly
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    name="title"
                    placeholder="Title"
                    value={validation.values.title ?? ""}
                    readOnly
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="tag">Tag</Label>
                  <Input
                    name="tag"
                    placeholder="Tag"
                    value={validation.values.tag ?? ""}
                    readOnly
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    name="url"
                    placeholder="URL"
                    value={validation.values.url ?? ""}
                    readOnly
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="linkedIn">LinkedIn</Label>
                  <Input
                    name="linkedIn"
                    placeholder="LinkedIn"
                    value={validation.values.linkedIn ?? ""}
                    readOnly
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="x">X</Label>
                  <Input
                    name="x"
                    placeholder="X"
                    value={validation.values.x ?? ""}
                    readOnly
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    name="facebook"
                    placeholder="Facebook"
                    value={validation.values.facebook ?? ""}
                    readOnly
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    name="instagram"
                    placeholder="Instagram"
                    value={validation.values.instagram ?? ""}
                    readOnly
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="snapchat">Snapchat</Label>
                  <Input
                    name="snapchat"
                    placeholder="Snapchat"
                    value={validation.values.snapchat ?? ""}
                    readOnly
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="tiktok">Tiktok</Label>
                  <Input
                    name="tiktok"
                    placeholder="Tiktok"
                    value={validation.values.tiktok ?? ""}
                    readOnly
                  />
                </div>
              </form>
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
                <Button
                  onClick={handleDownloadVcard}
                  className="w-full sm:w-auto mb-2 sm:mb-0 sm:mr-2"
                >
                  Download vCard
                </Button>
              </div>
            </CardContent>
          </Card>
          {user?.id === vcardData.customerId && (
            <Card className="flex flex-col items-center mt-6">
              <CardHeader>
                <CardTitle>QR Code</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div
                  ref={qrRef}
                  className="flex flex-col items-center justify-center md:w-1/2 md:ml-52 md:mt-0"
                >
                  <QRCode
                    value={`https://qrgen.clearq.se/vcard/details?id=${vcardData.id}`}
                    size={window.innerWidth > 768 ? 500 : 300}
                    renderAs="canvas"
                    // includeMargin={true}
                    imageSettings={{
                      //@ts-ignore
                      src: logo ? logo.toString() : vcardData.logoType,
                      height: 55,
                      width: 55,
                      excavate: true,
                    }}
                    bgColor="rgba(0,0,0,0)"
                    fgColor="#000000"
                  />
                  <div className="flex flex-row space-x-4 justify-center items-center mt-6">
                    <Button onClick={() => downloadQRCode("png")} className="">
                      Download PNG
                    </Button>
                    <Button onClick={copyUrlToClipboard}>Copy URL</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="flex flex-col justify-center items-center">
              <CardHeader>
                <CardTitle>VCard Details</CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <label htmlFor="imageInput" className="cursor-pointer">
                <Avatar className="flex flex-col w-[150px] h-[150px] justify-center items-center">
                  <AvatarImage src={validation.values.image} alt="User Image" />
                  <AvatarFallback>
                    {vcardData.firstName ? vcardData.firstName[0] : ""}
                    {vcardData.lastName ? vcardData.lastName[0] : ""}
                  </AvatarFallback>
                </Avatar>
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImagePreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              <CardContent className="mt-10 w-full">
                <form className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="firstName">
                      First Name<span className="text-red-700">*</span>
                    </Label>
                    <Input
                      name="firstName"
                      placeholder="First Name"
                      value={validation.values.firstName}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="lastName">
                      Last Name<span className="text-red-700">*</span>
                    </Label>
                    <Input
                      name="lastName"
                      placeholder="Last Name"
                      value={validation.values.lastName}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">
                      Email<span className="text-red-700">*</span>
                    </Label>
                    <Input
                      name="email"
                      placeholder="Email"
                      value={validation.values.customerEmail}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      name="phone"
                      placeholder="Phone"
                      value={validation.values.phone ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      name="company"
                      placeholder="Company"
                      value={validation.values.company ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      name="title"
                      placeholder="Title"
                      value={validation.values.title ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="tag">Tag</Label>
                    <Input
                      name="tag"
                      placeholder="Tag"
                      value={validation.values.tag ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="url">URL</Label>
                    <Input
                      name="url"
                      placeholder="URL"
                      value={validation.values.url ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="linkedIn">LinkedIn</Label>
                    <Input
                      name="linkedIn"
                      placeholder="LinkedIn"
                      value={validation.values.linkedIn ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="x">X</Label>
                    <Input
                      name="x"
                      placeholder="X"
                      value={validation.values.x ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      name="facebook"
                      placeholder="Facebook"
                      value={validation.values.facebook ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      name="instagram"
                      placeholder="Instagram"
                      value={validation.values.instagram ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="snapchat">Snapchat</Label>
                    <Input
                      name="snapchat"
                      placeholder="Snapchat"
                      value={validation.values.snapchat ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="tiktok">Tiktok</Label>
                    <Input
                      name="tiktok"
                      placeholder="Tiktok"
                      value={validation.values.tiktok ?? ""}
                      readOnly
                    />
                  </div>
                </form>
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
                  <Button
                    onClick={handleDownloadVcard}
                    className="w-full sm:w-auto mb-2 sm:mb-0 sm:mr-2"
                  >
                    Download vCard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
