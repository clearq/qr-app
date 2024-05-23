"use client";
import { useState, useCallback, useEffect } from "react";
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

interface Props {
  vDetails: IVCARD;
}

export const VcardSingelComponent = ({ vDetails: vData }: Props) => {
  const params = useSearchParams();
  const router = useRouter();

  const id = params.get("id");
  const [vcardData, setVcardData] = useState<IVCARD>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const validation = useFormik({
    initialValues: {
      customerEmail: vData?.customerEmail || "",
      firstName: vData?.firstName || "",
      lastName: vData?.lastName || "",
      phone: vData?.phone || "",
      company: vData?.company || "",
      image: vData?.image || Buffer,
      tag: vData?.tag || "",
      title: vData?.title || "",
      linkedIn: vData?.linkedIn || "",
      x: vData?.x || "",
      facebook: vData?.facebook || "",
      instagram: vData?.instagram || "",
      snapchat: vData?.snapchat || "",
      tiktok: vData?.tiktok || "",
      url: vData?.url || "",
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
    }),
    onSubmit: (values) => {
      console.log("Form values:", values);
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
  }, [id, validation]);

  useEffect(() => {
    if (id) {
      fetchData();
    } else {
      router.replace("/dashboardVcard");
    }
  }, [id, fetchData, router]);

  const generateVCardString = (values: any) => {
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
    console.log("Download vCard values:", values); // Debugging line
    const vCardData = generateVCardString(values);

    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${values.firstName}_${values.lastName}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!vcardData) {
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
    <div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 opacity-10">
        <Card className="flex flex-col justify-center items-center">
          <CardHeader>
            <CardTitle>VCard Details</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <label htmlFor="imageInput" style={{ cursor: "pointer" }}>
            <Avatar className="flex flex-col w-[150px] h-[150px] justify-center items-center">
              <AvatarImage
                src={
                  imagePreview ||
                  (vcardData.image
                    ? `data:image/jpeg;base64,${Buffer.from(
                        vcardData.image
                      ).toString("base64")}`
                    : undefined) // Use undefined if there's no image data
                }
                alt="User Image"
              />
              <AvatarFallback>
                {vcardData.firstName ? vcardData.firstName[0] : ""}
                {vcardData.lastName ? vcardData.lastName[0] : ""}
              </AvatarFallback>
            </Avatar>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
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
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={validation.values.customerEmail}
                  readOnly
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={validation.values.phone}
                  readOnly
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="company">Company</Label>
                <Input
                  name="company"
                  placeholder="Company"
                  value={validation.values.company}
                  readOnly
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  name="title"
                  placeholder="Title"
                  value={validation.values.title}
                  readOnly
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="url">Website</Label>
                <Input
                  name="url"
                  placeholder="Empty"
                  value={validation.values.url}
                  readOnly
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="linkedIn">LinkedIn</Label>
                <Input
                  name="linkedIn"
                  placeholder="Empty"
                  value={validation.values.linkedIn}
                  readOnly
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  name="facebook"
                  placeholder="Empty"
                  value={validation.values.facebook}
                  readOnly
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  name="instagram"
                  placeholder="Empty"
                  value={validation.values.instagram}
                  readOnly
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="tiktok">TikTok</Label>
                <Input
                  name="tiktok"
                  placeholder="Empty"
                  value={validation.values.tiktok}
                  readOnly
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="snapchat">Snapchat</Label>
                <Input
                  name="snapchat"
                  placeholder="Empty"
                  value={validation.values.snapchat}
                  readOnly
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="x">X</Label>
                <Input
                  name="x"
                  placeholder="Empty"
                  value={validation.values.x}
                  readOnly
                />
              </div>
            </form>
            <Button className="mt-5 w-full sm:w-auto" onClick={handleDownloadVcard}>
              Download vCard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
