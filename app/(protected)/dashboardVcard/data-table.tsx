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
import { IVCARD } from "@/typings";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "@/components/ui/use-toast";
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
import { FaEye } from "react-icons/fa";
import { MdAdd } from "react-icons/md";

interface DataTableProps {
  vcardData: IVCARD[];
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
  vcardData: vData,
  refetchDataTable,
}: DataTableProps) => {
  const [logo, setLogo] = useState<string | ArrayBuffer | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);

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

  const router = useRouter();

  const handleVcard = () => {
    router.push("/vcard");
  };

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
      <Table className="m-5">
        <TableHeader className="h-16">
          <TableRow>
            <TableHead className="w-[60px] sm:w-[100px]">ID</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Qr-code</TableHead>
            <TableHead>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                  <MdAdd/> Add</Button>
                </DialogTrigger>
                <DialogContent>
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
                    <QRCode
                      value={`${process.env.NEXT_PUBLIC_APP_URL}/vcard/details?id=${vcard.id}`}
                      size={50}
                      renderAs="canvas"
                      // includeMargin={true}
                      imageSettings={{
                        //@ts-ignore
                        src: logo ? logo.toString() : vcard.logoType,
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
                              router.replace(`vcard/details?id=${vcard.id}`)
                            }
                            variant="ghost"
                          >
                            <FaEye size={20} />
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
    </div>
  );
};
