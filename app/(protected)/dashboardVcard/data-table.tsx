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

interface DataTableProps {
  vcardData: IVCARD[];
  refetchDataTable: () => void;
}

const DisabledPaginationItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaginationItem>
    <PaginationLink href="#" onClick={(e) => e.preventDefault()} style={{ pointerEvents: 'none', color: '#ccc' }}>
      {children}
    </PaginationLink>
  </PaginationItem>
);

export const DataTable = ({ vcardData: vData, refetchDataTable }: DataTableProps) => {
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
      <Table>
        <TableHeader className="h-12">
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="flex flex-row space-x-7 justify-end items-end">
              <Button variant="outline" className="" onClick={handleVcard}>
                Add VCard
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>No data available</TableCell>
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
                      <div className="m-3 flex flex-row space-x-7 justify-end items-end">
                      <Button
                        onClick={() =>
                          router.replace(`vcard/details?id=${vcard.id}`)
                        }
                        variant="outline"
                      >
                        👁️‍🗨️
                      </Button>
                      <EditButton vcardData={vcard} />
                      <DeleteButton id={vcard.id} onDelete={handleDelete} />
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
              <PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} />
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
              <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};
