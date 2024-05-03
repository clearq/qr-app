'use client'
import React, { useState, ChangeEvent } from 'react';
import QRCode from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import { useFormik } from 'formik';
import * as yup from "yup";
import { useToast } from "@/components/ui/use-toast";


const QRCodeGenerator: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [logo, setLogo] = useState<string | null>(null);
  const [qrCodeData, setQRCodeData] = useState<string>('');
  const [qrCode, setQRCode] = useState<string>("");
  const { toast } = useToast();


  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    generateQRCode(e.target.value);
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
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

  const generateQRCode = (value: string) => {
    // Generate QR code data
    setQRCodeData(value);
  };

  const handleSave = () => {
    // Here you can implement saving the QR code data to the database
    // For demonstration purposes, let's just log it
    console.log('QR code saved to the database:', qrCodeData);
  };

  const handleDownload = () => {
    const qrCodeSVG = document.getElementById('qr-code-svg');
    const logoImage = document.createElement('img');
    if (qrCodeSVG && logo) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const svgData = new XMLSerializer().serializeToString(qrCodeSVG);
  
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
  
        // Set canvas background to transparent
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.globalCompositeOperation = 'destination-over';
          context.fillStyle = 'transparent';
          context.fillRect(0, 0, canvas.width, canvas.height);
  
          // Draw QR code onto canvas
          context.drawImage(img, 0, 0);
  
          // Draw logo onto canvas
          logoImage.onload = () => {
            context.drawImage(logoImage, canvas.width / 2 - 24, canvas.height / 2 - 24, 48, 48);
  
            // Create a temporary link and trigger download
            const pngData = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = pngData;
            a.download = 'qrcode_with_logo.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
          logoImage.src = logo;
        }
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
  };
  
  
  
  

  return (
    <div>
      <Input
      className='w-[50%]'
        type="text"
        placeholder="https://"
        name='url'
        value={url}
        onChange={handleUrlChange}
      />
      <br />
      <Input className='w-[20%] bg-slate-400' type="file" accept="image/*" onChange={handleLogoChange} />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <QRCode className="flex flex-col justify-end items-end bottom-[25rem] right-[50rem] fixed"
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
      <br />
      <div className='flex flex-row mb-4'>
      <Button className='flex mr-3' onClick={() => validation.handleSubmit()}>Save</Button>
      <Button onClick={handleDownload}>Download QR Code</Button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;