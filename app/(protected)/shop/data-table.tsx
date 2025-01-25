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
import { SHOP } from "@/typings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Dropdown";
import { FaEye, FaProductHunt } from "react-icons/fa";
import { MdAdd, MdCategory, MdDownload } from "react-icons/md";
import { DeleteButton } from "@/components/DeleteButton";
import { ShopComponent } from "@/components/shop";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { CategoryTable } from "@/components/categoryTable";
import { ProductsTable } from "@/components/productsTable";
import Category from "@/components/category";
import Product from "@/components/product";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface DataTableProps {
  shopData: SHOP[];
  refetchDataTable: () => void;
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

const DataTable = ({
  shopData: sData = [], // Default to an empty array if shopData is undefined
  refetchDataTable,
}: DataTableProps) => {
  const [selectedShop, setSelectedShop] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const router = useRouter();

  useEffect(() => {
    // Detect window size on mount and on resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // If width is less than 768px, it's considered mobile
    };

    handleResize(); // Run on initial load
    window.addEventListener("resize", handleResize); // Listen for window resizing

    setIsMounted(true); // Mark as mounted to avoid SSR issues

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup shop listener
    };
  }, []);

  if (!isMounted) return null; // Prevent SSR issues by waiting until component mounts

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = sData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const deleteShop = async (shopId: string) => {
    try {
      const response = await fetch(`/api/shop?id=${shopId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete shop");
      }

      refetchDataTable(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting shop:", error);
    }
  };

  const handleRowClick = (shop: SHOP) => {
    setSelectedShop({ id: shop.id, title: shop.name });
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
          <Table className="mt-20">
            <TableHeader className="h-16">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Shop Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>View</TableHead>
                <TableHead>Delete</TableHead>
                <TableHead className="flex justify-end">
                  <Link href={"/shop/createShop"}>
                    <Button
                      variant="outline"
                      className="flex items-center space-x-2 ml-2"
                    >
                      <MdAdd />
                      <span className="hidden sm:inline">Add Event</span>
                    </Button>
                  </Link>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>No shops available.</TableCell>
                </TableRow>
              ) : (
                currentData.map((shop, index) => (
                  <TableRow
                    key={shop.id}
                    onClick={() => handleRowClick(shop)}
                    className="cursor-pointer"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{shop.name}</TableCell>
                    <TableCell>{shop.address || "N/A"}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link">
                            {Array.isArray(shop.categories)
                              ? shop.categories.length
                              : 0}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <CategoryTable selectedShopId={shop.id} />
                        </DialogContent>
                      </Dialog>
                    </TableCell>

                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link">
                            {Array.isArray(shop.products)
                              ? shop.products.length
                              : 0}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <ProductsTable selectedShopId={shop.id} />
                        </DialogContent>
                      </Dialog>
                    </TableCell>

                    <TableCell>
                      <Button
                        className="relative right-2"
                        variant={"link"}
                        onClick={() => {
                          setSelectedShopId(shop.id);
                          router.push(`/shop/${shop.id}`);
                        }}
                      >
                        <FaEye />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <DeleteButton
                        id={shop.id}
                        onDelete={() => deleteShop(shop.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
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
                {[...Array(totalPages)].map((_, pageIndex) => (
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
                {currentPage === totalPages ? (
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

export default DataTable;
