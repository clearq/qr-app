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
import { IQR, IVCARD } from "@/typings";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DataTableProps {
  qrData: IQR[];
  vData: IVCARD[];
  refetchDataTable: () => void;
}

export const DataTable = ({
  vData = [],
  qrData = [],
  refetchDataTable,
}: DataTableProps) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

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

  const handleUrl = () => {
    router.push("/");
  };

  const handleVcard = () => {
    router.push("/vcard");
  };

  

  if (!isMounted) return null;

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
          {qrData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>No data available</TableCell>
            </TableRow>
          ) : (
            <>
              {qrData.map((qr, index: number) => (
                <TableRow key={qr.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{qr.tag}</TableCell>
                  <TableCell>QR</TableCell>
                  <TableCell>
                    <div className="m-3 flex flex-row space-x-7 justify-end items-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">✎</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
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
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="username" className="text-right">
                                Username
                              </Label>
                              <Input
                                id="username"
                                value="@peduarte"
                                className="col-span-3"
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
          {vData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>No data available</TableCell>
            </TableRow>
          ) : (
            <>
              {vData.map((vcard, index: number) => (
                <TableRow key={vcard.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{vcard.tag}</TableCell>
                  <TableCell>VCARD</TableCell>
                  <TableCell>
                    <div className="m-3 flex flex-row space-x-7 justify-end items-end">
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
                          <div className="grid gap-4 py-4">
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
    </div>
  );
};
