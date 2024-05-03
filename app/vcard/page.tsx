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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Pages from "@/components/Pages";
import QRCode from "qrcode.react";
import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import * as yup from 'yup'
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const { toast } = useToast();

  const [vCard, setVcard] = useState<string>("");
  const [logo, setLogo] = useState<string | null>(null);
  const [qrCodeData, setQRCodeData] = useState<string>("");

  const handleVcardChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVcard(e.target.value);
    generateQRCode(e.target.value);
  };

  const { data: session } = useSession();

  const validation = useFormik({
    initialValues: {
      url: "",
    },
    validationSchema: yup.object({
      url: yup.string().url().nullable(),
    }),
    onSubmit: (values) => {
      fetch("/api/qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((data) => {
        if (data?.status === 201) {
          toast({
            title: `Created sucessfully!`,
            description: `${new Date().toLocaleDateString()}`,
          });
        } else {
          toast({
            variant: "destructive",
            title: `Something went worng`,
            description: `${new Date().toLocaleDateString()}`,
          });
        }
      });
    },
  });

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  const generateQRCode = (value: string) => {
    // Generate QR code data
    setQRCodeData(value);
  };

  const handleSave = () => {
    // Here you can implement saving the QR code data to the database
    // For demonstration purposes, let's just log it
    console.log("QR code saved to the database:", qrCodeData);
  };

  const handleDownload = () => {
    const qrCodeSVG = document.getElementById("qr-code-svg");
    const logoImage = document.createElement("img");
    if (qrCodeSVG && logo) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const svgData = new XMLSerializer().serializeToString(qrCodeSVG);

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Set canvas background to transparent
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.globalCompositeOperation = "destination-over";
          context.fillStyle = "transparent";
          context.fillRect(0, 0, canvas.width, canvas.height);

          // Draw QR code onto canvas
          context.drawImage(img, 0, 0);

          // Draw logo onto canvas
          logoImage.onload = () => {
            context.drawImage(
              logoImage,
              canvas.width / 2 - 24,
              canvas.height / 2 - 24,
              48,
              48
            );

            // Create a temporary link and trigger download
            const pngData = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = pngData;
            a.download = "qrcode_with_logo.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
          logoImage.src = logo;
        }
      };
      img.src =
        "data:image/svg+xml;base64," +
        btoa(unescape(encodeURIComponent(svgData)));
    }
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
            <form className="">
              <div className="grid grid-cols-2 w-[50%] items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="firstName">First Name<span className="text-red-700">*</span></Label>
                  <Input
                    type="text"
                    id="firstName"
                    placeholder="First Name"
                    value={vCard}
                    onChange={handleVcardChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="lastName">Last Name<span className="text-red-700">*</span></Label>
                  <Input
                    type="text"
                    id="lasttName"
                    placeholder="Last Name"
                    value={vCard}
                    onChange={handleVcardChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email<span className="text-red-700">*</span></Label>
                  <Input
                    type="text"
                    id="email"
                    placeholder="Email"
                    value={vCard}
                    onChange={handleVcardChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    type="text"
                    id="phone"
                    placeholder="Tel."
                    value={vCard}
                    onChange={handleVcardChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    type="text"
                    id="company"
                    placeholder="Company"
                    value={vCard}
                    onChange={handleVcardChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="firstName">First Name*</Label>
                  <Input
                    type="text"
                    id="firstName"
                    placeholder="First Name"
                    value={vCard}
                    onChange={handleVcardChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="firstName">First Name*</Label>
                  <Input
                    type="text"
                    id="firstName"
                    placeholder="First Name"
                    value={vCard}
                    onChange={handleVcardChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="firstName">First Name*</Label>
                  <Input
                    type="text"
                    id="firstName"
                    placeholder="First Name"
                    value={vCard}
                    onChange={handleVcardChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="firstName">First Name*</Label>
                  <Input
                    type="text"
                    id="firstName"
                    placeholder="First Name"
                    value={vCard}
                    onChange={handleVcardChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="firstName">First Name*</Label>
                  <Input
                    type="text"
                    id="firstName"
                    placeholder="First Name"
                    value={vCard}
                    onChange={handleVcardChange}
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Framework</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
              </div>
            </form>
            <div className="flex flex-col justify-end items-end bottom-[25rem] right-[50rem] fixed">
              <QRCode 
                id="qr-code-svg"
                value={qrCodeData}
                size={450}
                renderAs="svg"
                imageSettings={{
                  //@ts-ignore
                  src: logo ?? null,
                  height: 48,
                  width: 48,
                  excavate: true, // Make the QR code transparent where the logo is placed
                }}
              />
            </div>
            <br />
            <div className="flex flex-row">
              <Button className="flex mr-3" onClick={handleSave}>
                Save
              </Button>
              <Button onClick={handleDownload}>Download QR Code</Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {/* <Button variant="outline">Cancel</Button> */}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
