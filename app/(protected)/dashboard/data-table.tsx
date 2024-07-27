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
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { QrForm } from "@/components/qr-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const router = useRouter();

  if (!isMounted) return null;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = qrcodeData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(qrcodeData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <Table className="">
        <TableHeader className="h-12">
          <TableRow>
            <TableHead className="w-[60px] sm:w-[100px]">ID</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Qr-code</TableHead>
            <TableHead className="">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Add</Button>
                </DialogTrigger>
                <DialogContent>
                  <QrForm />
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
            currentData.map((qr, index: number) => (
              <TableRow key={qr.id}>
                <TableCell>
                  {index + 1 + (currentPage - 1) * itemsPerPage}
                </TableCell>
                <TableCell>{qr.tag}</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>
                  <QRCode
                    value={`https://qrgen.clearq.se/redirect?id=${qr?.id}`}
                    size={50}
                    renderAs="canvas"
                    imageSettings={{
                      //@ts-ignore
                      src: logo ? logo.toString() : qr.logoType,
                      height: 20,
                      width: 20,
                      excavate: true,
                    }}
                    bgColor="rgba(0,0,0,0)"
                    fgColor="#000000"
                  />
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
                          onClick={() =>
                            router.replace(`qr/details?id=${qr.id}`)
                          }
                          variant="ghost"
                        >
                          👁️‍🗨️
                        </Button>
                        <DropdownMenuSeparator />

                        <EditButton qrData={qr} />
                        <DropdownMenuSeparator />

                        <DeleteButton id={qr.id} onDelete={handleDelete} />
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
