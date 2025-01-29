"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PRODUCT, SHOP } from "@/typings";

import { MdDownload } from "react-icons/md";
import { DeleteButton } from "@/components/DeleteButton";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { ProductSingle } from "@/components/ProductSingle"; // Import the new component
import Link from "next/link";
import { CardTitle } from "@/components/ui/card";

interface DataTableProps {
  productData: PRODUCT[];
  refetchDataTable: (shopId?: string) => void; // Update to accept shopId
  selectedShopId: string | null;
  setSelectedShopId: (shopId: string | null) => void;
}

const DisabledPaginationItem: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <PaginationItem>
    <PaginationLink
      href="#"
      onClick={(e) => e.preventDefault()}
      style={{ pointerEvents: "none", color: "#ccc" }}
    >
      {children}
    </PaginationLink>
  </PaginationItem>
);

const stripHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

const truncateText = (text: string, maxWords: number = 3): string => {
  const words = text.split(" ").filter(Boolean);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
};

export const DataTable = ({
  productData: pData = [],
  refetchDataTable,
  selectedShopId,
  setSelectedShopId,
}: DataTableProps) => {
  const [shops, setShops] = useState<SHOP[]>([]); // State for stores
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [selectedProduct, setSelectedProduct] = useState<PRODUCT | null>(null); // State for selected product
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null); // State for QR code URL
  const router = useRouter();

  // Filter products by selectedShopId
  const filteredProducts = selectedShopId
    ? pData.filter((product) => product.shopId === selectedShopId)
    : pData;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const validTotalPages =
    isFinite(totalPages) && totalPages > 0 ? totalPages : 0;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    setIsMounted(true);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch("/api/shop");
        if (!response.ok) {
          throw new Error("Failed to fetch shops.");
        }
        const data = await response.json();

        if (!Array.isArray(data.data)) {
          console.error("Expected an array but received:", data);
          setShops([]); // Set to an empty array if the response is not an array
          return;
        }

        setShops(data.data); // Use data.data to match the API response structure

        // Pre-select the first shop if no shop is already selected
        if (!selectedShopId && data.data.length > 0) {
          setSelectedShopId(data.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching shops:", error);
        toast({
          title: "Error fetching shops",
          description: "Failed to load shops. Please try again later.",
          variant: "destructive",
        });
        setShops([]); // Set to an empty array in case of an error
      }
    };

    fetchShops();
  }, [setSelectedShopId, selectedShopId]); // Add selectedShopId to the dependency array

  // Generate QR code for the selected product
  useEffect(() => {
    if (selectedProduct) {
      QRCode.toDataURL(selectedProduct.id, { width: 200 })
        .then((url) => setQrCodeUrl(url))
        .catch((error) => console.error("Error generating QR code:", error));
    }
  }, [selectedProduct]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const deleteShop = async (shopId: string) => {
    try {
      const response = await fetch(`/api/product?id=${shopId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product");
      refetchDataTable();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const fetchProductsByShopId = async (shopId: string) => {
    if (!shopId) {
      console.error("Error: Missing shopId");
      return [];
    }
    try {
      const response = await fetch(`/api/product?shopId=${shopId}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return await response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

  const downloadQRCodeZip = async (shopId: string) => {
    try {
      const zip = new JSZip();
      const products = await fetchProductsByShopId(shopId);

      if (products.length === 0) {
        alert("No products found for this shop.");
        return;
      }

      for (const product of products) {
        // Generate QR code with the desired value
        const qrCodeDataUrl = await QRCode.toDataURL(
          // `localhost:3000/shop/products/details?id=${product?.id}&type=product`,
          `https://qrgen.clearq.se/shop/products/details?id=${product?.id}&type=product`,
          {
            width: 300,
          }
        );
        const response = await fetch(qrCodeDataUrl);
        const imgBlob = await response.blob();

        // Add the QR code to the ZIP file with the product title and ID as the filename
        const fileName = `${product.title || "product"}_${product.id}.png`;
        zip.file(fileName, imgBlob);
      }

      // Generate and download the ZIP file
      const zipContent = await zip.generateAsync({ type: "blob" });
      saveAs(zipContent, `shop-${shopId}_qr_codes.zip`);
    } catch (error) {
      console.error("Error during QR code generation or zip creation:", error);
      toast({
        title: "Error",
        description: "Failed to generate QR codes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRowClick = (product: PRODUCT) => {
    setSelectedProduct(product); // Set the selected product
  };

  if (!isMounted) {
    return (
      <div className="w-full mt-52 h-full p-4 sm:pl-[260px]">
        <Skeleton className="h-10 w-full mb-4" /> {/* Loading skeleton */}
        <Skeleton className="h-10 w-full mb-4" /> {/* Loading skeleton */}
        <Skeleton className="h-10 w-full mb-4" /> {/* Loading skeleton */}
        <Skeleton className="h-10 w-full mb-4" /> {/* Loading skeleton */}
        <Skeleton className="h-10 w-full mb-4" /> {/* Loading skeleton */}
      </div>
    );
  }

  return (
    <div className="w-full mt-20 h-full p-4 sm:pl-[260px]">
      {" "}
      {isMobile ? (
        <div className="text-center mt-20 text-sm py-4">
          <p>This content is only visible on desktop or tablet.</p>
          <p>You can still create items or categories.</p>
          <div className="mt-4 space-x-2">
            <Link href={"/shop/products"}>
              <Button variant={"outline"}>Create Item</Button>
            </Link>
            <Link href={"/shop/category"}>
              <Button>Create Category</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <CardTitle className="text-2xl">Items Table</CardTitle>

          {/* Shop Selector Dropdown */}
          <div className="flex mb-6 justify-end items-end">
            <Select
              value={selectedShopId || ""}
              onValueChange={(value) => setSelectedShopId(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a shop" />
              </SelectTrigger>
              <SelectContent>
                {shops.map((shop) => (
                  <SelectItem key={shop.id} value={shop.id}>
                    {shop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Button to download all QR codes for the selected shop */}
            <Button
              onClick={() => {
                if (selectedShopId) {
                  downloadQRCodeZip(selectedShopId);
                } else {
                  toast({
                    title: "No shop selected",
                    description: "Please select a shop first.",
                    variant: "destructive",
                  });
                }
              }}
              className="ml-4"
              variant="default"
            >
              <MdDownload className="mr-2" /> Download All QR Codes
            </Button>
          </div>

          <Table className="mt-20">
            <TableHeader className="h-16">
              <TableRow>
                <TableHead></TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Product Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Download</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>No products available.</TableCell>
                </TableRow>
              ) : (
                currentData.map((product, index) => {
                  const plainTextDescription = stripHtml(
                    product.description || ""
                  );
                  const truncatedDescription =
                    truncateText(plainTextDescription);

                  return (
                    <TableRow key={product.id}>
                      <TableCell></TableCell>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{product.title}</TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="relative right-4"
                            variant={"link"}
                            onClick={() => setSelectedProduct(product)}
                          >
                            <TableCell>{truncatedDescription}</TableCell>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] overflow-y-auto">
                          {selectedProduct && (
                            <ProductSingle product={selectedProduct} />
                          )}
                        </DialogContent>
                      </Dialog>
                      <TableCell>{product.category?.name || "N/A"}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => downloadQRCodeZip(product.id)}
                          className="ml-2"
                          variant={"ghost"}
                        >
                          <MdDownload />
                        </Button>
                      </TableCell>
                      {/* Add Delete Button */}
                      <TableCell>
                        <DeleteButton
                          onDelete={() => deleteShop(product.id)} // Pass the delete function
                          id={""}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <div className="flex justify-center w-full mt-4">
            <Pagination>
              <PaginationContent>
                {currentPage === 1 ? (
                  <DisabledPaginationItem>&lt;</DisabledPaginationItem>
                ) : (
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => handlePageChange(currentPage - 1)}
                    />
                  </PaginationItem>
                )}
                {validTotalPages > 0 &&
                  [...Array(validTotalPages)].map((_, pageIndex) => (
                    <PaginationItem key={pageIndex}>
                      <PaginationLink
                        href="#"
                        onClick={() => handlePageChange(pageIndex + 1)}
                        isActive={currentPage === pageIndex + 1}
                      >
                        {pageIndex + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                {currentPage === validTotalPages ? (
                  <DisabledPaginationItem>&gt;</DisabledPaginationItem>
                ) : (
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() => handlePageChange(currentPage + 1)}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
};
