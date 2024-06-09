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
  user? : ExtendedUser
}

export const QrSingelComponent = ({ user }: Props) => {
  const params = useSearchParams();
  const router = useRouter();

  const id = params.get("id");
  const [qrcodeData, setQrCodeData] = useState<IVCARD>();
  const { data: session } = useSession();
  const [logo, setLogo] = useState<string | ArrayBuffer | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const validation = useFormik({
    initialValues: {
      url: qrcodeData?.url || "",
      tag: qrcodeData?.tag || "",
      logoType: qrcodeData?.logoType || "",
    },
    validationSchema: yup.object({
      url: yup.string().url("Invalid URL").required("URL is required"),
      tag: yup.string().nullable(),
      logoType: yup.string().nullable(),
    }),
    onSubmit: (values) => {

      fetch("/api/qr", {
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

    fetch(`/api/qr/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast({
            title: `${data.error}`,
            description: `${new Date().toLocaleDateString()}`,
          });
        }
        setQrCodeData(data);
        validation.setValues(data);
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

  if (!qrcodeData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Progress className="text-center" value={33} />
      </div>
    );
  }

  if (!id) {
    router.replace("/dashboard");
  }

  return (
    <div>
      {session ? (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {user?.id === qrcodeData.customerId && 
          
          <Card className="flex flex-col items-center mt-52">
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div
                ref={qrRef}
                className="flex flex-col items-center justify-center md:w-1/2 md:ml-52 mt-8 md:mt-0"
              >
                <QRCode
                  value={`${process.env.NEXT_PUBLIC_APP_URL}/qr/details?id=${qrcodeData.id}`}
                  size={600}
                  renderAs="canvas"
                  // includeMargin={true}
                  imageSettings={{
                    //@ts-ignore
                    src: logo ? logo.toString() : qrcodeData.logoType,
                    height: 55,
                    width: 55,
                    excavate: true,
                  }}
                  bgColor="rgba(0,0,0,0)"
                  fgColor="#000000"
                />
                <div className="flex flex-row space-x-4 justify-center items-center mt-4">
                  <Button onClick={() => downloadQRCode("png")} className="">
                    Download PNG
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          }
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
        </div>
      )}
    </div>
  );
};