import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { IQR } from "@/typings";
import { useRouter } from "next/navigation";
import { AddButton } from "@/components/AddButton";
import { EditButton } from "@/components/EditButton";
import { DeleteButton } from "@/components/DeleteButton";

interface DataTableProps {
  qrData: IQR[];
  refetchDataTable: () => void;
}

const DisabledPaginationItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaginationItem>
    <PaginationLink href="#" onClick={(e) => e.preventDefault()} style={{ pointerEvents: 'none', color: '#ccc' }}>
      {children}
    </PaginationLink>
  </PaginationItem>
);

export const DataTable: React.FC<DataTableProps> = ({ qrData: qrcodeData, refetchDataTable }) => {
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

  const handleUrl = () => {
    router.push("/qr");
  };

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
      <Table className="mb-10">
        <TableHeader className="h-12">
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="flex flex-row space-x-7 justify-end items-end">
              <AddButton onClick={handleUrl} />
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
                      <EditButton qrData={qr} />
                      <DeleteButton id={qr.id} onDelete={handleDelete} />
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
