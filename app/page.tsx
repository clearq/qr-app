"use client";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import QRCode from "qrcode";
import mergeImages from "merge-images";
import { useState } from "react";

import VCardPage from "./vcard/page";
import { useFormik } from "formik";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import Pages from "@/components/Pages";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SelectedFormats {
  png: boolean;
  pdf: boolean;
  svg: boolean;
  eps: boolean;
  jpg: boolean;
  [key: string]: boolean;
}

function Home() {
  const [selectedOption, setSelectedOption] = useState<"qrCode" | "vCard">(
    "qrCode"
  );
  // const [text, setText] = useState<string>("");
  const [qrCode, setQRCode] = useState<string>("");
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [resizedLogo, setResizedLogo] = useState<{
    src: string;
    width: number;
    height: number;
  } | null>(null);
  const [selectedFormats, setSelectedFormats] = useState<SelectedFormats>({
    png: false,
    pdf: false,
    svg: false,
    eps: false,
    jpg: false,
  });

  const generateQRCode = async () => {
    try {
      const options = {
        width: 600,
        height: 600,
        color: {
          dark: "#000000",
          light: "#0000",
        },
        rendererOpts: {
          quality: 1,
        },
      };

      const qrCodeDataUrl = await QRCode.toDataURL(
        validation.values.url,
        options
      );

      if (resizedLogo) {
        const maxLogoSize = 100;
        const logoSize = Math.min(maxLogoSize, options.width / 2);
        const logoPositionX = (options.width - logoSize) / 2;
        const logoPositionY = (options.height - logoSize) / 2;

        const whiteBackgroundCanvas = document.createElement("canvas");
        whiteBackgroundCanvas.width = options.width;
        whiteBackgroundCanvas.height = options.height;
        const whiteBackgroundCtx = whiteBackgroundCanvas.getContext("2d");
        if (whiteBackgroundCtx) {
          whiteBackgroundCtx.fillStyle = "#ffffff";
          whiteBackgroundCtx.fillRect(0, 0, options.width, options.height);
        }

        const mergedImage = await mergeImages([
          { src: whiteBackgroundCanvas.toDataURL(), x: 0, y: 0 },
          { src: qrCodeDataUrl, x: options.width, y: options.height },
          // { src: qrCodeDataUrl, x: 0, y: 0, width: options.width, height: options.height, crossOrigin: 'anonymous' },
        ]);

        const emptySpaceSize = 100;
        const emptySpaceCanvas = document.createElement("canvas");
        emptySpaceCanvas.width = options.width;
        emptySpaceCanvas.height = options.height;
        const emptySpaceCtx = emptySpaceCanvas.getContext("2d");
        if (emptySpaceCtx) {
          emptySpaceCtx.fillStyle = "#ffffff";
          emptySpaceCtx.fillRect(
            (options.width - emptySpaceSize) / 2,
            (options.height - emptySpaceSize) / 2,
            emptySpaceSize,
            emptySpaceSize
          );
        }

        const finalImage = await mergeImages([
          { src: mergedImage, x: 0, y: 0 },
          { src: emptySpaceCanvas.toDataURL(), x: 0, y: 0 },
          { src: resizedLogo.src, x: logoPositionX, y: logoPositionY },
          // { src: resizedLogo.src, x: logoPositionX, y: logoPositionY, width: logoSize, height: logoSize },
        ]);

        setQRCode(finalImage);
      } else {
        setQRCode(qrCodeDataUrl);
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];

    if (file) {
      //@ts-ignore
      const image = new Image();
      image.src = URL.createObjectURL(file);

      image.onload = () => {
        const maxWidth = 600;
        const maxHeight = 600;

        if (
          image.width &&
          image.height &&
          image.width <= maxWidth &&
          image.height <= maxHeight
        ) {
          const reader = new FileReader();
          reader.onload = async (event) => {
            const resizedLogo = await resizeImage(
              event.target?.result as string,
              100,
              100
            );
            setLogoImage(event.target?.result as string);
            //@ts-ignore
            setResizedLogo(resizedLogo);
          };
          reader.readAsDataURL(file);
        } else {
          alert(
            "Bildens storlek överstiger de tillåtna dimensionerna (600x600). Välj en mindre bild."
          );
          e.target.value = "";
        }
      };
    }
  };

  const downloadQRCode = () => {
    const allFormats = ["png", "pdf", "svg", "eps", "jpg"];
    const formatsToDownload = allFormats.filter(
      (format) => selectedFormats[format]
    );

    formatsToDownload.forEach((format) => {
      const downloadLink = document.createElement("a");
      downloadLink.href = qrCode;
      downloadLink.download = `qrcode.${format}`;
      downloadLink.click();
    });
  };

  const handleLogoRemove = () => {
    setResizedLogo(null);
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
        console.log(data);
      });
    },
  });

  const renderContent = () => {
    const isQRCodeGenerated = !!qrCode;

    if (selectedOption === "qrCode") {
      return (
        <>
        <Pages/>
          <div className="flex gap-10 items-center justify-center">
            {!session ? (
              <>
                <div className="text-left">
                  <h1 className="mt-32 mb-16 text-center text-5xl font-bold">
                    QR Generator
                  </h1>
                  <div className="mb-16 text-gray-600">
                    <p>
                      Välkommen till vår QR-generator! Vi erbjuder en kraftfull
                      verktyg för att skapa QR-koder som kan användas för olika
                      ändamål. Oavsett om du behöver skapa QR-koder för att dela
                      forskningsartiklar, länkar till online-resurser, eller
                      andra typer av information, så är vår tjänst här för att
                      hjälpa dig.
                    </p>
                    <br />
                    <p>
                      Vi erbjuder dataanalys för att hjälpa dig att förstå hur
                      dina QR-koder används och vilken typ av interaktion de
                      genererar. Det bästa av allt är att vår tjänst är helt
                      GRATIS att använda. Allt du behöver göra är att registrera
                      dig för ett konto.
                    </p>
                    <br />
                    <p>
                      När du har registrerat dig kan du skapa och spara hur
                      många QR-koder du vill. Dessutom kan du enkelt redigera
                      dem efter behov för att säkerställa att de är aktuella och
                      relevanta. Och det bästa är att dina QR-koder har livstid,
                      så du behöver inte oroa dig för att de kommer att
                      försvinna.
                    </p>
                    <br />
                    Så börja använda vår QR-kodgenerator idag för att effektivt
                    dela din akademiska information och maximera din interaktion
                    med målgruppen!
                  </div>
                  <Link href="/register">
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4">
                      Register
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div>
                
                <Card className="flex justify-center items-center mt-40">
                  <div
                    className={`w-[1080px] h-[${
                      isQRCodeGenerated ? "auto" : "0"
                    }] p-8 bg-slate-200 bg-opacity-20 rounded-md outline-none flex flex-col transition-all duration-500`}
                  >
                    <h1 className="text-black text-[45px] font-bold mb-4">
                      URL Generator
                    </h1>
                    {resizedLogo && (
                      <div className="mb-4">
                        <label className="text-black">
                          Uppladdad Logotyp
                          <Button
                            className="ml-2 p-2 bg-red-500 text-white rounded-md"
                            onClick={handleLogoRemove}
                          >
                            Ta bort
                          </Button>
                        </label>
                        <Image
                          src={resizedLogo.src}
                          alt="Logotyp"
                          className="max-w-full h-auto"
                          width={100}
                          height={100}
                        />
                      </div>
                    )}
                    <label className="text-black">
                      Ladda upp logotyp
                      <input
                        className="mr-2"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                    </label>
                    <label className="text-black" htmlFor="text-input">
                      Ange text:
                    </label>
                    <div className="flex items-center">
                      <Input
                        className="border-b border-white outline-none bg-transparent text-black p-2 flex-grow"
                        type="text"
                        placeholder="https://"
                        id="text-input"
                        name="url"
                        value={validation.values.url}
                        onChange={validation.handleChange}
                      />
                      {validation.errors.url && validation.touched.url && (
                        <p className="text-red-500 font-bold">
                          {validation.errors.url}
                        </p>
                      )}
                      <Button
                        variant="outline"
                        className="ml-4 p-2 hover:bg-slate-400 hover:text-white rounded-md"
                        onClick={generateQRCode}
                      >
                        Generate
                      </Button>
                    </div>
                    {isQRCodeGenerated && (
                      <div className="p-4 mt-4">
                        <h2 className="text-black text-2xl mb-2">
                          Generera QR-kod:
                        </h2>
                        <Image
                          src={qrCode}
                          alt="QR-kod"
                          className={
                            selectedFormats.png ? "bg-white" : "bg-white"
                          }
                          width={100}
                          height={100}
                        />
                        <div className="flex space-x-5 mt-2">
                          <label className="text-black">
                            <input
                              className="mr-2"
                              type="checkbox"
                              checked={selectedFormats.png}
                              onChange={() =>
                                setSelectedFormats({
                                  ...selectedFormats,
                                  png: !selectedFormats.png,
                                })
                              }
                            />
                            PNG
                          </label>
                        </div>
                        <Button
                          variant="outline"
                          className="mt-2 p-2 hover:bg-slate-400 hover:text-white rounded-md"
                          onClick={downloadQRCode}
                        >
                          Ladda ner
                        </Button>
                        <Button
                          variant="outline"
                          className="mt-2 ml-2 p-2 hover:bg-slate-400 hover:text-white rounded-md"
                          onClick={() => validation.handleSubmit()}
                        >
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </>
      );
    } else if (selectedOption === "vCard") {
      return <VCardPage />;
    }
  };
  return renderContent();
}

async function resizeImage(url: string, width: number, height: number) {
  throw new Error("Function not implemented.");
}

export default Home;
