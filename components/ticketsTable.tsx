"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog } from "./ui/dialog";
import EditButton from "./EditButtonTicket";


interface Events {
    id: string;
    eventsTitle: string;
  }

export type Ticket = {
  id: string;
  eventsTitle: string
  description: string | null;
  ticketsName: string;
  fromDate: string;
  toDate: string;
  email: string;
  status: "pending" | "processing" | "success" | "failed";
};

export const columns: ColumnDef<Ticket>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "eventsTitle",
    header: "Event Title",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("eventsTitle")}</div>
    ),
  },
  {
    accessorKey: "ticketsName",
    header: "Ticket Name",
    cell: ({ row }) => <div>{row.getValue("ticketsName")}</div>,
  },
  {
    accessorKey: "status",
    header: "Edit",
    cell: ({ row }) => {
      const ticket = row.original; // Get the entire ticket object for the row
      return (
        <div className="relative right-7 capitalize">
{
  //@ts-ignore
          <EditButton ticketData={ticket} /> 
        }
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const ticket = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(ticket.id)}
            >
              Copy ticket ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function TicketsTable() {
  const [data, setData] = React.useState<Ticket[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
const [events, setEvents] = React.useState<Events[]>([])
const [selectedEventId, setSelectedEventId] = React.useState<string | null>(null); 


  React.useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/events"); 
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const fetchedEvents: Events[] = await response.json();
        setEvents(fetchedEvents);
        if(fetchedEvents){
          setSelectedEventId(fetchedEvents[0].id)
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

 
  React.useEffect(() => {
    if (!selectedEventId) return;

    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/downloadTicket?eventId=${selectedEventId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch tickets");
        }
        const tickets: Ticket[] = await response.json();
        setData(tickets);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [selectedEventId]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedRowIds = selectedRows.map((row) => row.original.id);

  const handleDeleteSelected = async () => {
    if (!selectedRowIds.length) return;

    // Confirm deletion
    const confirmed = window.confirm("Are you sure you want to delete the selected tickets?");
    if (!confirmed) return;

    try {
      await Promise.all(
        selectedRowIds.map(async (id) => {
          await fetch(`/api/ticketScan/${id}`, { method: "DELETE" });
        })
      );
      window.location.reload()
      setData((prevData) => prevData.filter((ticket) => !selectedRowIds.includes(ticket.id)));
    } catch (error) {
      console.error("Error deleting tickets:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>Error: {error}</div>; 
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <label htmlFor="event-select" className="block mb-2 text-sm font-medium text-gray-700">
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
      {/* <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
          />
      </div> */}
          {selectedRows.length > 0 && (
            <div className="mb-4 flex justify-start">
              <Button
                variant="destructive"
                onClick={handleDeleteSelected}
              >
                Delete
              </Button>
            </div>
          )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
