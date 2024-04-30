"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { qrCodeById } from "@/data/qr";
import { prisma } from "@/lib/db";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function DataTable() {
  const [qrData, setQrData] = useState([]);

  useEffect(() => {
    fetchQrData();
  }, []);

  const fetchQrData = async () => {
    try {
      const qrData = prisma.qr;
      setQrData(qrData);
    } catch (error) {
      console.error("Error fetching QR data:", error);
    }
  };

  const handleEdit = (id: string) => {
    console.log("Edit QR with ID:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete QR with ID:", id);
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

  return (
    <div>
      <Table>
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Title</TableHead>
            <div className="flex flex-row space-x-7 justify-end items-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="m-2">
                    New+
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Button onClick={() => handleUrl()}>URL</Button>
                  <Button onClick={() => handleVcard()}>VCard</Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TableRow>
        </TableHeader>
        <TableBody>
          {qrData.map((qr) => (
            <TableRow key={qr}>
              <TableCell>{}</TableCell>
              <TableCell>{}</TableCell>
              <TableCell>{}</TableCell>
              <div className=" m-3 flex flex-row space-x-7 justify-end items-end">
                <Button
                  className="hover:bg-slate-400"
                  variant="outline"
                  onClick={() => handleEdit('Edit')}
                >
                  Edit
                </Button>
                <Button
                  className="hover:bg-red-500"
                  variant="outline"
                  onClick={() => handleDelete('Sucsess')}
                >
                  X
                </Button>
              </div>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        className="hover:bg-blue-600"
        variant="outline"
        onClick={handleSaveQR}
      >
        Save QR
      </Button>
    </div>
  );
}
