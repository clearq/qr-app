import React, { useEffect, useState } from "react";
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
import { IQR } from "@/typings";
import { useRouter } from "next/navigation";
import { EditButton } from "@/components/EditButton";
import { DeleteButton } from "@/components/DeleteButton";
import QRCode from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaChartLine } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import Link from "next/link";
import { QrForm } from "@/components/qr-form";
import { VcardAnalys } from "@/components/vcardAnalys";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps {
  qrData: IQR[];
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

export const DataTable: React.FC<DataTableProps> = ({
  qrData: qrcodeData,
  refetchDataTable,
}) => {
  const [logo, setLogo] = useState<string | ArrayBuffer | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5); // Items per page
  const [selectedQr, setSelectedQr] = useState<IQR | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/qr/${id}`, {
      method: "DELETE",
    })
      .then((data) => data.json())
      .then(() => {
        refetchDataTable();
      })
      .catch((err) => console.log(err));
  };

  const handleAnalyticsOpen = (vcard: IQR) => {
    setSelectedQr(vcard);
    fetchAnalyticsData(vcard.id);
  };

  const fetchAnalyticsData = async (id: string) => {
    try {
      const response = await fetch(`/api/scans/${id}/0`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        setAnalyticsData(null);
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setAnalyticsData(null);
    }
  };

  const router = useRouter();

  if (!isMounted) return null;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = qrcodeData?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(qrcodeData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
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
      {/* Adjusted layout */}
      <h1 className="text-3xl font-bold mb-6"></h1>
      <Table className="mb-5">
        <TableHeader className="h-16">
          <TableRow>
            <TableHead className="w-[60px] sm:w-[100px]">ID</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Qr-code</TableHead>
            <TableHead className="flex justify-end">
              <Link href={"/qr"}>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 ml-2"
                >
                  <MdAdd />
                </Button>
              </Link>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>No data available</TableCell>
            </TableRow>
          ) : (
            currentData.map((qr, index: number) => (
              <TableRow key={qr.id}>
                <TableCell>
                  {index + 1 + (currentPage - 1) * itemsPerPage}
                </TableCell>
                <TableCell>{qr.tag}</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>
                  <Link href={`qr/details?id=${qr.id}`}>
                    <QRCode
                      className="hover:border hover:border-cyan-500 hover:border-opacity-10 transition-color"
                      value={`https://qrgen.clearq.se/redirect?id=${qr?.id}&type=qr`}
                      size={50}
                      renderAs="canvas"
                      imageSettings={{
                        //@ts-ignore
                        src: logo ? logo.toString() : qr.logoType,
                        height: 20,
                        width: 20,
                        excavate: true,
                      }}
                    />
                  </Link>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">≡</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col justify-center items-center">
                      <DropdownMenuSeparator />
                      <Button
                        className="w-full"
                        onClick={() => handleAnalyticsOpen(qr)}
                        variant="ghost"
                      >
                        <FaChartLine size={20} />
                      </Button>
                      <DropdownMenuSeparator />
                      <EditButton qrData={qr} />
                      <DropdownMenuSeparator />
                      <DeleteButton id={qr.id} onDelete={handleDelete} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
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
      {/* Dialog for displaying analytics */}
      {selectedQr && (
        <Dialog open={!!selectedQr} onOpenChange={() => setSelectedQr(null)}>
          <DialogContent>
            <VcardAnalys id={selectedQr.id} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
