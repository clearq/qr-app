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
import { useEffect, useState } from "react";
import { VCard } from "@prisma/client";

interface DataTableProps {
  vData: IVCARD[];
  user: VCard;
  refetchDataTable: () => void;
}

export const DataTable = ({
  vData = [],
  refetchDataTable,
}: DataTableProps) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5); // Items per page

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDeleteV = async (id: string) => {
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

  // Calculate the data for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = vData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle pagination
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
                  <TableCell>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                  <TableCell>{vcard.tag}</TableCell>
                  <TableCell>VCARD</TableCell>
                  <TableCell>
                    <div className="m-3 flex flex-row space-x-7 justify-end items-end">
                          <Button onClick={() => router.replace(`vcard/details?id=${vcard.id}`)} variant="outline">👁️‍🗨️</Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">✎</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Edit your vCard</DialogTitle>
                            <DialogDescription>
                              Edit your vCard here and save your changes.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="flex flex-col space-y-1.5">
                              <Label htmlFor="firstName">
                                First Name
                                <span className="text-red-700">*</span>
                              </Label>
                              <Input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={vcard.firstName}
                              />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                              <Label htmlFor="lastName">
                                Last Name<span className="text-red-700">*</span>
                              </Label>
                              <Input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={vcard.lastName}
                              />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                              <Label htmlFor="email">
                                Email<span className="text-red-700">*</span>
                              </Label>
                              <Input
                                type="text"
                                name="customerEmail"
                                placeholder="Email"
                                value={vcard.customerEmail}
                              />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                              <Label htmlFor="label">
                                Label<span className="text-red-700">*</span>
                              </Label>
                              <Input
                                type="text"
                                name="tag"
                                placeholder="Label"
                                value={vcard.tag}
                              />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                              <Label htmlFor="url">Website</Label>
                              <Input
                                type="text"
                                name="url"
                                placeholder="https://"
                                value={vcard.url}
                              />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                              <Label htmlFor="phone">Phone</Label>
                              <Input
                                type="text"
                                name="phone"
                                placeholder="Tel."
                                value={vcard.phone}
                              />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                              <Label htmlFor="company">Company</Label>
                              <Input
                                type="text"
                                name="company"
                                placeholder="Company"
                                value={vcard.company}
                              />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                              <Label htmlFor="title">Title</Label>
                              <Input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={vcard.title}
                              />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                              <Label htmlFor="linkedIn">LinkedIn</Label>
                              <Input
                                type="text"
                                name="linkedIn"
                                placeholder="https://"
                                value={vcard.linkedIn}
                              />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                              <Label htmlFor="facebook">Facebook</Label>
                              <Input
                                type="text"
                                name="facebook"
                                placeholder="https://"
                                value={vcard.facebook}
                              />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                              <Label htmlFor="instagram">Instagram</Label>
                              <Input
                                type="text"
                                name="instagram"
                                placeholder="https://"
                                value={vcard.instagram}
                              />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                              <Label htmlFor="tiktok">Tiktok</Label>
                              <Input
                                type="text"
                                name="tiktok"
                                placeholder="https://"
                                value={vcard.tiktok}
                              />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                              <Label htmlFor="snapchat">Snapchat</Label>
                              <Input
                                type="text"
                                name="snapchat"
                                placeholder="https://"
                                value={vcard.snapchat}
                              />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                              <Label htmlFor="x">X</Label>
                              <Input
                                type="text"
                                name="x"
                                placeholder="https://"
                                value={vcard.x}
                              />
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
                        onClick={() => handleDeleteV(vcard.id)}
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
