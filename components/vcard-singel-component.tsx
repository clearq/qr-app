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
import { useFormik } from "formik";
import * as yup from "yup";
import QRCode from "qrcode.react";
import { useSession } from "next-auth/react";
import { saveAs } from "file-saver";
import { ExtendedUser } from "@/next-auth";
import { Separator } from "./ui/separator";
import EditButton from "./EditButtonVcardSingle";

interface Props {
  user?: ExtendedUser;
}

export const VcardSingelComponent = ({ user }: Props) => {
  const params = useSearchParams();
  const router = useRouter();

  const id = params.get("id");
  const type = params.get("type")
  const [vcardData, setVcardData] = useState<IVCARD | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { data: session, status } = useSession(); // Check session status
  const [logo, setLogo] = useState<string | ArrayBuffer | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const validation = useFormik({
    initialValues: {
      customerEmail: vcardData?.customerEmail || "",
      firstName: vcardData?.firstName || "",
      lastName: vcardData?.lastName || "",
      phone: vcardData?.phone || "",
      company: vcardData?.company || "",
      image: vcardData?.image,
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
    fetch(`/api/saveVcard/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast({
            title: `${data.error}`,
            description: `${new Date().toLocaleDateString()}`,
          });
        } else {
          setVcardData(data);
          validation.setValues(data);
        }
      })
      .catch((err) =>
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: `${new Date().toLocaleDateString()}`,
        })
      );
  }, [id]);

  useEffect(() => {
    if (id && type === "vcard") {
      fetch(`/api/scans`, {
        method: "POST",
        body: JSON.stringify({
          type : 1,
          id
        })
      })
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const generateVCardString = (values: any) => {
    const photo = values.logoType
      ? `PHOTO;ENCODING=b;TYPE=PNG:${values.logoType}`
      : "";
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
            saveAs(blob, `${validation.values.tag}.${format}`);
          }
        }, "image/png");
      } else if (format === "svg") {
        const svg = qrRef.current.querySelector("svg");
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const blob = new Blob([svgData], {
            type: "image/svg+xml;charset=utf-8",
          });
          saveAs(blob, `${validation.values.tag}.${format}`);
        }
      }
    }
  };

  const copyUrlToClipboard = () => {
    //@ts-ignore
    const url = `https://qrgen.clearq.se/vcard/details?id=${vcardData.id}&type=vcard`;
    // const url = `localhost:3000/vcard/details?id=${vcardData.id}&type=vcard`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast({
          title: "URL copied to clipboard",
          description: `${new Date().toLocaleDateString()}`,
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Failed to copy URL",
          description: `${new Date().toLocaleDateString()}`,
        });
      });
  };

  const handleBack = () => {
    router.push("/all");
  };

  
  if (!id) {
    router.replace("/");
    return null;
  }
  
  return (
    <div>
      { session ? (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            onClick={() => handleBack()}
            className="flex mb-4 font-light text-4xl justify-start items-start"
            variant={"link"}
          >
            {"<-"}
          </Button>
          <Card className="flex flex-col justify-center items-center">
            <CardHeader>
              <CardTitle>VCard Details</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <Avatar className="flex justify-center items-center w-24 h-24 sm:w-52 sm:h-52">
              <AvatarImage src={vcardData?.logoType || ""} alt="User Image" />
              <AvatarFallback>
                {vcardData?.firstName ? vcardData?.firstName[0] : ""}
                {vcardData?.lastName ? vcardData?.lastName[0] : ""}
              </AvatarFallback>
            </Avatar>
            <CardContent className="mt-10 w-full">
              <form className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                {validation.values.firstName && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="firstName">First Name</Label>
                    <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                      {validation.values.firstName}
                    </Label>
                    <Separator />
                  </div>
                )}
                {validation.values.lastName && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                      {validation.values.lastName}
                    </Label>
                    <Separator />
                  </div>
                )}
                {validation.values.customerEmail && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                      {validation.values.customerEmail}
                    </Label>
                    <Separator />
                  </div>
                )}
                {validation.values.phone && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                      {validation.values.phone}
                    </Label>
                    <Separator />
                  </div>
                )}
                {validation.values.company && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="company">Company</Label>
                    <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                      {validation.values.company}
                    </Label>
                    <Separator />
                  </div>
                )}
                {validation.values.title && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="title">Title</Label>
                    <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                      {validation.values.title}
                    </Label>
                    <Separator />
                  </div>
                )}
                {validation.values.tag && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="tag">Tag</Label>
                    <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                      {validation.values.tag}
                    </Label>
                    <Separator />
                  </div>
                )}
                {validation.values.url && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="url">URL</Label>
                    <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                      {validation.values.url}
                    </Label>
                    <Separator />
                  </div>
                )}
                {validation.values.linkedIn && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="linkedIn">LinkedIn</Label>
                    <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                      {validation.values.linkedIn}
                    </Label>
                    <Separator />
                  </div>
                )}
                {validation.values.x && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="x">X</Label>
                    <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                      {validation.values.x}
                    </Label>
                    <Separator />
                  </div>
                )}
                {validation.values.facebook && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                      {validation.values.facebook}
                    </Label>
                    <Separator />
                  </div>
                )}
                {validation.values.instagram && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                      {validation.values.instagram}
                    </Label>
                    <Separator />
                  </div>
                )}
                {validation.values.snapchat && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="snapchat">Snapchat</Label>
                    <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                      {validation.values.snapchat}
                    </Label>
                    <Separator />
                  </div>
                )}
                {validation.values.tiktok && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="tiktok">Tiktok</Label>
                    <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                      {validation.values.tiktok}
                    </Label>
                    <Separator />
                  </div>
                )}
              </form>
              <div className="flex flex-row sm:flex-row items-center mt-4">
                <Button
                  onClick={handleDownloadVcard}
                  className="w-full sm:w-auto mb-2 sm:mb-0 sm:mr-2"
                >
                  Download vCard
                </Button>
              </div>
            </CardContent>
          </Card>
          {user?.id === vcardData?.customerId && (
            <div className="flex flex-row mt-2">
              {
                //@ts-ignore
              <EditButton vcardData={vcardData} />
              }
            </div>
          )}
          {user?.id === vcardData?.customerId && (
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
                    value={`https://qrgen.clearq.se/vcard/details?id=${vcardData?.id}&type=vcard`}
                    size={window.innerWidth > 768 ? 500 : 300}
                    renderAs="canvas"
                    // includeMargin={true}
                    imageSettings={{
                      //@ts-ignore
                      src: logo ? logo.toString() : vcardData.logoType,
                      height: 75,
                      width: 75,
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
        <div className="">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="flex flex-col justify-center items-center">
              <CardHeader>
                <CardTitle>VCard Details</CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <label htmlFor="imageInput" className="cursor-pointer">
                <Avatar className="flex flex-col w-[150px] h-[150px] justify-center items-center">
                  <AvatarImage src={vcardData?.logoType || ""} alt="User Image" />
                  <AvatarFallback>
                    {vcardData?.firstName ? vcardData.firstName[0] : ""}
                    {vcardData?.lastName ? vcardData.lastName[0] : ""}
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
                  {validation.values.firstName && (
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="firstName">First Name</Label>
                      <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                        {validation.values.firstName}
                      </Label>
                      <Separator />
                    </div>
                  )}
                  {validation.values.lastName && (
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                        {validation.values.lastName}
                      </Label>
                      <Separator />
                    </div>
                  )}
                  {validation.values.customerEmail && (
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                        {validation.values.customerEmail}
                      </Label>
                      <Separator />
                    </div>
                  )}
                  {validation.values.phone && (
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="phone">Phone</Label>
                      <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                        {validation.values.phone}
                      </Label>
                      <Separator />
                    </div>
                  )}
                  {validation.values.company && (
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="company">Company</Label>
                      <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                        {validation.values.company}
                      </Label>
                      <Separator />
                    </div>
                  )}
                  {validation.values.title && (
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="title">Title</Label>
                      <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                        {validation.values.title}
                      </Label>
                      <Separator />
                    </div>
                  )}
                  {validation.values.tag && (
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="tag">Tag</Label>
                      <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                        {validation.values.tag}
                      </Label>
                      <Separator />
                    </div>
                  )}
                  {validation.values.url && (
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="url">URL</Label>
                      <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                        {validation.values.url}
                      </Label>
                      <Separator />
                    </div>
                  )}
                  {validation.values.linkedIn && (
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="linkedIn">LinkedIn</Label>
                      <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                        {validation.values.linkedIn}
                      </Label>
                      <Separator />
                    </div>
                  )}
                  {validation.values.x && (
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="x">X</Label>
                      <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                        {validation.values.x}
                      </Label>
                      <Separator />
                    </div>
                  )}
                  {validation.values.facebook && (
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                        {validation.values.facebook}
                      </Label>
                      <Separator />
                    </div>
                  )}
                  {validation.values.instagram && (
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                        {validation.values.instagram}
                      </Label>
                      <Separator />
                    </div>
                  )}
                  {validation.values.snapchat && (
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="snapchat">Snapchat</Label>
                      <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                        {validation.values.snapchat}
                      </Label>
                      <Separator />
                    </div>
                  )}
                  {validation.values.tiktok && (
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="tiktok">Tiktok</Label>
                      <Label className="cursor-text ml-1 text-lg font-normal text-slate-500">
                        {validation.values.tiktok}
                      </Label>
                      <Separator />
                    </div>
                  )}
                </form>
                <div className="flex flex-col sm:flex-row items-start justify-between mt-4">
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
