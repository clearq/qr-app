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
import { IQR } from "@/typings";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DataTableProps {
  qrData: IQR[];
  refetchDataTable: () => void;
}

export const DataTable = ({
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

  const router = useRouter();

  const handleUrl = () => {
    router.push("/");
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
    </div>
  );
};
