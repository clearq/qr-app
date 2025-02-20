"use client";

import { PRODUCT } from "@/typings";
import { useEffect, useState, useRef } from "react";
import DOMPurify from "dompurify";
import QRCode from "qrcode.react";
import { FaQrcode } from "react-icons/fa"; // Import QR code icon
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import Image from "next/image";

interface ProductSingleProps {
  product: PRODUCT;
}

export const ProductSingle = ({ product }: ProductSingleProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null); // Ref for the QR code section

  // Sanitize the description HTML
  const sanitizedDescription = DOMPurify.sanitize(
    product.description || "No description"
  );

  // Function to scroll to the QR code section
  const scrollToQRCode = () => {
    if (qrCodeRef.current) {
      qrCodeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const copyUrlToClipboard = () => {
    //@ts-ignore
    const url = `https://qrgen.clearq.se/shop/products/details?id=${product?.id}&type=product`;
    // const url = `localhost:3000/shop/products/details?id=${product?.id}&type=product`;
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

  return (
    <div className="space-y-4 overflow-y-auto max-h-[80vh]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{product.title}</h2>
        {/* Button to scroll to QR code */}
        <Button
          variant={"ghost"}
          onClick={scrollToQRCode}
          className="p-2 mr-4 transition-colors"
        >
          <FaQrcode className="w-6 h-6" /> {/* QR code icon */}
        </Button>
      </div>

      <div className="space-y-2">
        {product.image && (
          <div className="justify-center items-center w-[300px]">
            <Image
              className="justify-center items-center"
              src={product?.image || ""}
              alt="Product Image"
              width={300}
              height={300}
            />
          </div>
        )}
        <p>
          <strong>Description:</strong>
        </p>
        {/* Render the sanitized description as HTML */}
        <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
      </div>

      <div className="space-y-2">
        <p>
          <strong>Category:</strong> {product.category?.name || "N/A"}
        </p>
        <p>{/* <strong>Shop:</strong> {product.shop || "N/A"} */}</p>
        <p>
          <strong>Artical Number ID:</strong> {product.itemId}
        </p>
        <p>
          <strong>Product ID:</strong> {product.id}
        </p>
      </div>

      {/* QR code section with ref */}
      <div ref={qrCodeRef} className="flex justify-center mt-4">
        <QRCode
          value={`https://qrgen.clearq.se/shop/products/details?id=${product?.id}&type=product`}
          // value={`localhost:3000/shop/products/details?id=${product?.id}&type=product`}
          size={window.innerWidth > 768 ? 200 : 300}
          renderAs="canvas"
          imageSettings={{
            //@ts-ignore
            src: "",
            height: 75,
            width: 75,
            excavate: true,
          }}
        />
      </div>
      <Button onClick={copyUrlToClipboard}>Copy URL</Button>
    </div>
  );
};
