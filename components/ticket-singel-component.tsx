"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import { toast } from "./ui/use-toast";
import { Button } from "./ui/button";
import QRCode from "qrcode.react";
import { saveAs } from "file-saver";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Ticket {
  id: string;
  ticketsName: string;
  qrNumber: string;
  description: string | null;
}

interface Events {
  id: string;
  eventsTitle: string;
}

export const QRCodePage = () => {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Events[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [ticketsData, setTicketsData] = useState<Ticket[]>([]);
  const qrRefs = useRef<HTMLDivElement[]>([]); // For multiple QR code refs

  // Fetch Events
  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch("/api/events");
      const fetchedEvents: Events[] = await response.json();
      setEvents(fetchedEvents);
      if (fetchedEvents.length > 0) {
        setSelectedEventId(fetchedEvents[0].id); // Auto-select first event
      }
    } catch (error) {
      toast({
        title: "Error fetching events",
        variant: "destructive",
        description: `${new Date().toLocaleDateString()}`,
      });
    }
  }, []);

  // Fetch Tickets based on selected event
  const fetchTickets = useCallback(async () => {
    if (!selectedEventId) return;
    try {
      const response = await fetch(
        `/api/downloadTicket?eventId=${selectedEventId}`
      );
      const tickets: Ticket[] = await response.json();
      setTicketsData(tickets);
    } catch (error) {
      toast({
        title: "Error fetching tickets",
        variant: "destructive",
        description: `${new Date().toLocaleDateString()}`,
      });
    }
  }, [selectedEventId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const downloadQRCode = (format: "png" | "svg", index: number) => {
    const qrDiv = qrRefs.current[index];
    if (!qrDiv) return;
    const canvas = qrDiv.querySelector("canvas");
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `ticket_${index}.${format}`);
        }
      }, `image/${format}`);
    }
  };

  // Table columns
  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: "ticketsName",
      header: "",
      cell: ({ row }) => (
        <div className=" text-center font-bold mb-2">
          {row.getValue("ticketsName")}
        </div>
      ),
    },
    {
      accessorKey: "qrNumber",
      header: "",
      cell: ({ row }) => (
        <div
          ref={(el) => {
            if (el) qrRefs.current[row.index] = el; // Use row.index
          }}
          className="flex flex-col items-center justify-center"
        >
          <QRCode
            value={row.getValue("qrNumber")}
            size={150}
            renderAs="canvas"
          />
          <div className="flex space-x-4 justify-center mt-4">
            <Button onClick={() => downloadQRCode("png", row.index)}>
              Download PNG
            </Button>
          </div>
        </div>
      ),
    },
    // {
    //   accessorKey: "description",
    //   header: "",
    //   cell: ({ row }) => <div>{row.getValue("description")}</div>,
    // },
  ];

  const table = useReactTable({
    data: ticketsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      {session ? (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Event Selector */}
          <div className="mb-4">
            <label
              htmlFor="event-select"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Select Event:
            </label>
            <select
              id="event-select"
              className="p-2 border rounded-md"
              value={selectedEventId || ""}
              onChange={(e) => setSelectedEventId(e.target.value)}
            >
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.eventsTitle}
                </option>
              ))}
            </select>
          </div>

          {/* Ticket Table */}
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </div>
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    No tickets found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      )}
    </div>
  );
};
