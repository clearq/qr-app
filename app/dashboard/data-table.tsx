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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IQR } from "@/typings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



interface DataTableProps {
  qrData: IQR[];
  refetchDataTable: () => void;
}

export const DataTable = ({ qrData = [], refetchDataTable }: DataTableProps) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleEdit = (id: string) => {
    console.log("");
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/qr/${id}`, {
      method: "DELETE",
    })
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        refetchDataTable();
      })
      .catch((err) => console.log(err));
  };

  const handleSaveQR = () => {
    console.log("Save QR");
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
      <Table>
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Type</TableHead>
            <div className="flex flex-row space-x-7 justify-end items-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="m-2">
                    Add
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="flex flex-col mt-2" align="end">
                  <Button className="mb-2" onClick={() => handleUrl()}>
                    URL
                  </Button>
                  <Button onClick={() => handleVcard()}>VCard</Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TableRow>
        </TableHeader>
        <TableBody>
          {qrData?.map((qr, index: number) => (
            <TableRow key={qr.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{qr.url}</TableCell>
              <TableCell>{}</TableCell>
              <div className=" m-3 flex flex-row space-x-7 justify-end items-end">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">✎</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit your Qr</DialogTitle>
                      <DialogDescription>
                        Edit your Qr here and save your changes.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="id" className="text-right">
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <Button
        className="hover:bg-blue-600"
        variant="outline"
        onClick={handleSaveQR}
      >
        Save
      </Button> */}
    </div>
  );
};
