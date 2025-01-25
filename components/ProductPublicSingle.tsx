"use client";

import { PRODUCT } from "@/typings";
import { useEffect, useState, useRef, useCallback } from "react";
import DOMPurify from "dompurify";
import QRCode from "qrcode.react";
import { FaQrcode } from "react-icons/fa"; // Import QR code icon
import { Button } from "./ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";
import { useSession } from "next-auth/react";
import { ExtendedUser } from "@/next-auth";
import { saveAs } from "file-saver";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

interface ProductSingleProps {
  user?: ExtendedUser; // Add user prop
}

export const ProductPublicSingle = ({ user }: ProductSingleProps) => {
  const params = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const id = params.get("id");
  const type = params.get("type");
  const [product, setProduct] = useState<PRODUCT | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null); // Ref for the QR code section
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode

  // Formik for form handling and validation
  const validation = useFormik({
    initialValues: {
      title: product?.title || "",
      description: product?.description || "",
      categoryId: "",
      shopId: "",
    },
    validationSchema: yup.object({
      title: yup.string().required("Title is required"),
      description: yup.string().nullable(),
      categoryId: yup.string(),
      shopId: yup.string(),
    }),
    onSubmit: (values) => {
      fetch(`/api/product`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...values }), // Include `id` in the request body
      })
        .then(async (response) => {
          if (response.status === 201) {
            toast({
              title: `Product updated successfully!`,
              description: `${new Date().toLocaleDateString()}`,
            });
            fetchData(); // Refresh product data
            setIsEditing(false); // Exit edit mode
          } else {
            toast({
              variant: "destructive",
              title: `Error updating product`,
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

  // Fetch product data
  const fetchData = useCallback(() => {
    if (!id) {
      router.replace("/");
      return;
    }

    fetch(`/api/product/items/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch product data");
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          toast({
            title: `${data.error}`,
            description: `${new Date().toLocaleDateString()}`,
          });
        } else {
          setProduct(data);
          validation.setValues(data); // Set form values
          setQrCodeUrl(window.location.href); // Set QR code URL to current page URL
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err); // Debugging
        toast({
          title: "Something went wrong",
          description: `${new Date().toLocaleDateString()}`,
        });
      });
  }, [id, router]);

  // Track scans for the product
  useEffect(() => {
    if (id && type === "product") {
      fetch(`/api/scans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: 5,
          id,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log("Scan recorded:", data)) // Debugging
        .catch((err) => console.error("Scan error:", err)); // Debugging
    }
  }, [id, type]);

  // Fetch product data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sanitize product description
  const sanitizedDescription =
    typeof window !== "undefined" && DOMPurify
      ? DOMPurify.sanitize(product?.description || "No description")
      : product?.description || "No description";

  // Handle download QR code
  const downloadQRCode = (format: "png" | "svg") => {
    if (!qrCodeRef.current) return;

    const canvas = qrCodeRef.current.querySelector("canvas");
    if (canvas && format === "png") {
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${product?.title || "product"}.png`);
        }
      }, "image/png");
    } else if (format === "svg") {
      const svg = qrCodeRef.current.querySelector("svg");
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        saveAs(blob, `${product?.title || "product"}.svg`);
      }
    }
  };

  // Handle copy URL to clipboard
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

  // Function to scroll to the QR code section
  const scrollToQRCode = () => {
    if (qrCodeRef.current) {
      qrCodeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  // Check if the current user is the owner of the product
  const isOwner = session?.user?.id === product.shop?.customerId;

  return (
    <div className="w-full h-full p-4 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="flex flex-col justify-center items-center">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="mt-10 w-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{product.title}</h2>
                {/* Show QR code button only for the owner */}
                {isOwner && (
                  <Button
                    variant={"ghost"}
                    onClick={scrollToQRCode}
                    className="p-2 mr-4 transition-colors"
                  >
                    <FaQrcode className="w-6 h-6" /> {/* QR code icon */}
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <p>
                  <strong>Description:</strong>
                </p>
                {/* Render the sanitized description as HTML */}
                {isOwner && isEditing ? (
                  <textarea
                    value={validation.values.description}
                    onChange={(e) =>
                      validation.setFieldValue("description", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  <div
                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                  />
                )}
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
            </div>
          </CardContent>
        </Card>

        {/* Show QR code and actions only for the owner */}
        {isOwner && (
          <>
            <div ref={qrCodeRef} className="flex flex-col items-center mt-4">
              {qrCodeUrl && (
                <QRCode
                  value={`https://qrgen.clearq.se/shop/products/details?id=${product?.id}&type=product`}
                  // value={`localhost:3000/shop/products/details?id=${product?.id}&type=product`}
                  size={window.innerWidth > 768 ? 200 : 300}
                  renderAs="canvas"
                  includeMargin={true}
                />
              )}
              <div className="flex space-x-4 mt-4">
                <Button onClick={() => downloadQRCode("png")}>
                  Download PNG
                </Button>
                <Button onClick={copyUrlToClipboard}>Copy URL</Button>
              </div>
            </div>

            {/* Edit and Save buttons */}
            <div className="mt-4">
              {isEditing ? (
                <Button onClick={() => validation.handleSubmit()}>
                  Save Changes
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
