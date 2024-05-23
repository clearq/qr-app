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
import { IQR } from "@/typings";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { toast } from "@/components/ui/use-toast";
import * as yup from "yup";
import QRCode from "qrcode.react";

interface DataTableProps {
  qrData: IQR;
  refetchDataTable: () => void;
}

export const DataTable = ({ qrData, refetchDataTable }: DataTableProps) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5); // Items per page

  const validation = useFormik({
    initialValues: {
      url: qrData.url,
      tag: qrData.tag,
      logoType: "",
    },
    validationSchema: yup.object({
      url: yup.string().url().nullable(),
      tag: yup.string().nullable(),
      logoType: yup.string().url().uuid(),
    }),
    onSubmit: (values) => {
      fetch("/api/qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((data) => {
        if (data?.status === 201) {
          toast({
            title: `Created sucessfully!`,
            description: `${new Date().toLocaleDateString()}`,
          });
          validation.resetForm();
        } else {
          toast({
            variant: "destructive",
            title: `Something went worng`,
            description: `${new Date().toLocaleDateString()}`,
          });
        }
      });
    },
  });

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

  const handleUrl = () => {
    router.push("/");
  };

  if (!isMounted) return null;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  //@ts-ignore
  const currentData = qrData.slice(indexOfFirstItem, indexOfLastItem);

  // @ts-ignore
  const totalPages = Math.ceil(qrData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <Table className="mb-10">
        <TableHeader className="h-12">
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="flex flex-row space-x-7 justify-end items-end">
              <Button variant="outline" className="" onClick={handleUrl}>
                Add URL
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
              {currentData.map((qr, index: number) => (
                <TableRow key={qr.id}>
                  <TableCell>
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </TableCell>
                  <TableCell>{qr.tag}</TableCell>
                  <TableCell>QR</TableCell>
                  <TableCell>
                    <div className="m-3 flex flex-row space-x-7 justify-end items-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">✎</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px]">
                          <DialogHeader>
                            <DialogTitle>Edit your QR</DialogTitle>
                            <DialogDescription>
                              Edit your QR here and save your changes.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="url" className="text-right">
                                URL
                              </Label>
                              <Input
                                type="text"
                                id="url"
                                value={qr.url}
                                className="col-span-3"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="username" className="text-right">
                                Username
                              </Label>
                              <Input
                                id="username"
                                value={qr.tag}
                                className="col-span-3"
                              />
                            </div>
                            <QRCode
                              className="flex flex-col left-12 justify-center items-center mt-5 relative"
                              id="qr-code-svg"
                              value={qr.url}
                              size={400}
                              renderAs="svg"
                              // imageSettings={{
                              //   //@ts-ignore
                              //   src: null,
                              //   height: 48,
                              //   width: 48,
                              //   excavate: true, // Make the QR code transparent where the logo is placed
                              // }}
                            />
                            <div className="mt-5 flex w-[50%] flex-row gap-4 items-center justify-center sm:w-auto">
                              <Button className="">Download PNG</Button>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Save changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        className="hover:bg-red-500"
                        variant="outline"
                        onClick={() => handleDelete(qr.id)}
                      >
                        🗑️
                      </Button>
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
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => handlePageChange(currentPage - 1)}
              //@ts-ignore
              disabled={currentPage === 1}
            />
          </PaginationItem>
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
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => handlePageChange(currentPage + 1)}
              //@ts-ignore
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
