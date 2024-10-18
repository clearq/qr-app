"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { IVCARD } from "@/typings";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EditButton from "@/components/EditButtonVcard";
import { DeleteButton } from "@/components/DeleteButton";
import QRCode from "qrcode.react";
import { Vcard } from "@/components/Vcard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Dropdown";
import { FaChartLine } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import Link from "next/link";
import { VcardAnalys } from "@/components/vcardAnalys";

interface DataTableProps {
  vcardData: IVCARD[];
  refetchDataTable: () => void;
}

const DisabledPaginationItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaginationItem>
    <PaginationLink href="#" onClick={(e) => e.preventDefault()} style={{ pointerEvents: "none", color: "#ccc" }}>
      {children}
    </PaginationLink>
  </PaginationItem>
);

export const DataTable = ({ vcardData: vData, refetchDataTable }: DataTableProps) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [selectedQr, setSelectedQr] = useState<IVCARD | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/saveVcard/${id}`, {
      method: "DELETE",
    })
      .then((data) => data.json())
      .then(() => {
        refetchDataTable();
      })
      .catch((err) => console.log(err));
  };

  const handleAnalyticsOpen = (vcard: IVCARD) => {
    setSelectedQr(vcard);
    fetchAnalyticsData(vcard.id);
  };

  const fetchAnalyticsData = async (id: string) => {
    try {
      const response = await fetch(`/api/scans/${id}/1`);
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
  const currentData = vData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(vData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <Table className="mb-5">
        <TableHeader className="h-16">
          <TableRow>
            <TableHead className="w-[60px] sm:w-[100px]">ID</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Qr-code</TableHead>
            <TableHead>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2 ml-2">
                    <MdAdd />
                    <span className="hidden sm:inline">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="overflow-y-auto w-[90%] h-[90%]">
                  <Vcard />
                </DialogContent>
              </Dialog>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>No data available</TableCell>
            </TableRow>
          ) : (
            <>
              {currentData.map((vcard, index: number) => (
                <TableRow key={vcard.id}>
                  <TableCell>
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </TableCell>
                  <TableCell>{vcard.tag}</TableCell>
                  <TableCell>VCARD</TableCell>
                  <TableCell>
                    <Link href={`vcard/details?id=${vcard.id}`}>
                      <QRCode
                        className="hover:border hover:border-cyan-500 hover:border-opacity-10 transition-color"
                        value={`${process.env.NEXT_PUBLIC_APP_URL}/vcard/details?id=${vcard.id}`}
                        size={50}
                        renderAs="canvas"
                      />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="ml-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">≡</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="flex flex-col justify-center items-center">
                          <DropdownMenuSeparator />
                          <Button
                            className="w-full"
                            onClick={() => handleAnalyticsOpen(vcard)}
                            variant="ghost"
                          >
                            <FaChartLine size={20} />
                          </Button>
                          <DropdownMenuSeparator />

                          <EditButton vcardData={vcard} />
                          <DropdownMenuSeparator />

                          <DeleteButton id={vcard.id} onDelete={handleDelete} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </>
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