import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import { EVENTS } from "@/typings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Dropdown";
import { FaTicketAlt, FaEye } from "react-icons/fa";
import { MdAdd, MdDownload } from "react-icons/md";
import { DeleteButton } from "@/components/DeleteButton";
import { TicketComponent } from "@/components/ticket";
import { TicketsTable } from "@/components/ticketsTable";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { EventsComponent } from "@/components/events";
import { EventsTable } from "@/components/eventsTable";
import Link from "next/link";
import { CardTitle } from "@/components/ui/card";

interface Ticket {
  id: string;
  ticketsName: string;
}

interface DataTableProps {
  eventData: EVENTS[];
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
  eventData: eData = [], // Default to an empty array if eventData is undefined
  refetchDataTable,
}: DataTableProps) => {
  const [selectedEvent, setSelectedEvent] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5); // Ensure itemsPerPage is always > 0
  const router = useRouter();

  useEffect(() => {
    // Detect window size on mount and on resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // If width is less than 768px, it's considered mobile
    };

    handleResize(); // Run on initial load
    window.addEventListener("resize", handleResize); // Listen for window resizing

    setIsMounted(true); // Mark as mounted to avoid SSR issues

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup event listener
    };
  }, []);

  if (!isMounted) return null; // Prevent SSR issues by waiting until component mounts

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = Array.isArray(eData)
    ? eData.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  // Ensure totalPages is always valid
  const totalPages =
    eData.length > 0 ? Math.ceil(eData.length / itemsPerPage) : 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      refetchDataTable(); // After successful deletion, refresh the table data
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const fetchTicketsByEventId = async (eventId: string): Promise<Ticket[]> => {
    try {
      const response = await fetch(`/api/downloadTicket?eventId=${eventId}`);
      if (!response.ok) throw new Error("Failed to fetch tickets");

      return await response.json();
    } catch (error) {
      console.error("Error fetching tickets:", error);
      return [];
    }
  };

  const downloadQRCodeZip = async (eventId: string) => {
    try {
      const zip = new JSZip();
      const tickets = await fetchTicketsByEventId(eventId);

      if (tickets.length === 0) {
        alert("No tickets found for this event.");
        return;
      }

      for (const ticket of tickets) {
        const qrCodeDataUrl = await QRCode.toDataURL(ticket.id, { width: 300 });
        const response = await fetch(qrCodeDataUrl);
        const imgBlob = await response.blob();

        zip.file(`${ticket.ticketsName || ticket.id}.png`, imgBlob);
      }

      const zipContent = await zip.generateAsync({ type: "blob" });
      saveAs(zipContent, `event-${eventId}-tickets.zip`);
    } catch (error) {
      console.error("Error during QR code generation or zip creation:", error);
    }
  };

  const handleRowClick = (event: EVENTS) => {
    setSelectedEvent({ id: event.id, title: event.eventsTitle });
  };

  return (
    <div className="w-full mt-20 h-full p-4 sm:pl-[260px]">
      {" "}
      {/* Mobile View Message */}
      {isMobile ? (
        <div className="text-center mt-20 text-sm py-4">
          <p>This content is only visible on desktop or tablet.</p>
          <p>You can still create tickets or events.</p>
          <div className="mt-4 space-x-2">
            <Link href={"/shop/products"}>
              <Button variant={"outline"}>Create Tickets</Button>
            </Link>
            <Link href={"/shop/category"}>
              <Button>Create Events</Button>
            </Link>
          </div>
        </div>
      ) : (
        // Desktop & Tablet Content
        <div>
          <CardTitle className="text-2xl">Events Table</CardTitle>
          <Table className="mt-20">
            <TableHeader className="h-16">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Tables</TableHead>
                <TableHead>Tickets</TableHead>
                <TableHead>View</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="flex justify-end">
                  <Link href={"/events/createEvent"}>
                    <Button
                      variant="outline"
                      className="flex items-center space-x-2 ml-2"
                    >
                      <MdAdd />
                      <span className="hidden sm:inline">Add Event</span>
                    </Button>
                  </Link>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>No data available</TableCell>
                </TableRow>
              ) : (
                currentData.map((event, index: number) => (
                  <TableRow
                    onClick={() => handleRowClick(event)}
                    key={event.id}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{event.eventsTitle}</TableCell>
                    <TableCell>{event.description}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="link"
                            disabled={
                              !Array.isArray(event.eventTables) ||
                              event.eventTables.length === 0
                            }
                          >
                            {Array.isArray(event.eventTables)
                              ? event.eventTables.length
                              : 0}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          {Array.isArray(event.eventTables) &&
                          event.eventTables.length > 0 ? (
                            <EventsTable selectedEventId={event.id} />
                          ) : (
                            <p>No tables available</p>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>

                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="link"
                            disabled={
                              typeof event.ticketCount !== "number" ||
                              event.ticketCount <= 0
                            }
                          >
                            {typeof event.ticketCount === "number"
                              ? event.ticketCount
                              : 0}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          {typeof event.ticketCount === "number" &&
                          event.ticketCount > 0 ? (
                            <TicketsTable selectedEventId={event.id} />
                          ) : (
                            <p>No tickets available</p>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>

                    <TableCell>
                      <Button
                        className="relative right-2"
                        variant={"link"}
                        onClick={() => {
                          setSelectedEventId(event.id);
                          router.push(`/events/${event.id}`);
                        }}
                      >
                        <FaEye />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="">
                          Open
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  className="w-full"
                                  variant={"ghost"}
                                  onClick={(e: any) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <FaTicketAlt />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <TicketComponent
                                  selectedEvent={{
                                    id: event.id,
                                    title: event.eventsTitle,
                                  }}
                                />
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Button
                              onClick={() => downloadQRCodeZip(event.id)}
                              className="w-full"
                              variant={"ghost"}
                            >
                              <MdDownload />
                            </Button>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <DeleteButton
                              id={event.id}
                              onDelete={() => {
                                deleteEvent(event.id);
                              }}
                            />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex justify-center w-full mt-4">
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
        </div>
      )}
    </div>
  );
};
