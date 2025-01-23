"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DeleteButton } from "@/components/DeleteButton";
import QRCode from "qrcode.react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Dropdown";
import { MdAdd } from "react-icons/md";
import Link from "next/link";
import { TicketComponent } from "@/components/ticket";
import { TICKET } from "@/typings";

interface DataTableProps {
  ticketData: TICKET[];
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

export const DataTable = ({
  ticketData: tData = [],
  refetchDataTable,
}: DataTableProps) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/ticketScan/${id}`, {
      method: "DELETE",
    })
      .then((data) => data.json())
      .then(() => {
        refetchDataTable();
      })
      .catch((err) => console.log(err));
  };

  if (!isMounted) return null;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = tData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full h-full p-4 sm:pl-[260px]">
      {" "}
      <Table className="mb-5">
        <TableHeader className="h-16">
          <TableRow>
            <TableHead className="w-[60px] sm:w-[100px]">ID</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>QrNumber</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Qr-code</TableHead>
            <TableHead>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 ml-2"
                  >
                    <MdAdd />
                    <span className="hidden sm:inline">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="overflow-y-auto w-full md:w-[700px] max-h-[90vh] p-6">
                  <TicketComponent selectedEvent={null} />
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
            currentData.map((ticket, index: number) => (
              <TableRow key={ticket.id}>
                <TableCell>
                  {index + 1 + (currentPage - 1) * itemsPerPage}
                </TableCell>
                <TableCell>{ticket.eventsTitle}</TableCell>
                <TableCell>{ticket.qrNumber}</TableCell>
                <TableCell>TICKET</TableCell>
                <TableCell>
                  <Link href={`ticket/details?id=${ticket.id}`}>
                    <QRCode
                      className="hover:border hover:border-cyan-500 hover:border-opacity-10 transition-color"
                      value={`${process.env.NEXT_PUBLIC_APP_URL}/ticket/details?id=${ticket.id}`}
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
                        <DeleteButton id={ticket.id} onDelete={handleDelete} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
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
    </div>
  );
};
