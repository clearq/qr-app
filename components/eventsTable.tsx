"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EditButton from "./EditButtonTicket";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "./ui/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Events {
  id: string;
  eventsTable: string;
  eventsTitle: string | null;
}

interface EventsTableProps {
  selectedEventId: string | null;
}

export function EventsTable({ selectedEventId }: EventsTableProps) {
  const [eventTables, setEventTables] = useState<Events[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventTables, setSelectedEventTables] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [eventTableToDelete, setEventTableToDelete] = useState<string | null>(
    null
  );
  const itemsPerPage = 5;

  const fetchTickets = useCallback(async () => {
    if (!selectedEventId) return;
    setLoading(true);
    try {
      const response = await fetch(
        `/api/eventsTable?eventId=${selectedEventId}`
      );
      const eventTables: Events[] = await response.json();
      setEventTables(eventTables);
    } catch (error) {
      toast({
        title: "Error fetching eventTables",
        variant: "destructive",
        description: `${new Date().toLocaleDateString()}`,
      });
    } finally {
      setLoading(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleDelete = async () => {
    if (!eventTableToDelete) return;
    try {
      const response = await fetch(`/api/events/${eventTableToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete eventTable");
      }

      setEventTables((prev) =>
        prev.filter((eventTable) => eventTable.id !== eventTableToDelete)
      );
      toast({
        title: "Event Table Deleted",
        description: "The eventTable has been successfully deleted.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting eventTable:", error);
      toast({
        title: "Error deleting eventTable",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setEventTableToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setEventTableToDelete(id);
    setShowDeleteDialog(true);
  };

  const toggleSelectTicket = (id: string) => {
    setSelectedEventTables((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((ticketId) => ticketId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedEventTables.length === eventTables.length) {
      setSelectedEventTables([]);
    } else {
      setSelectedEventTables(eventTables.map((eventTable) => eventTable.id));
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = eventTables.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(eventTables.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={selectedEventTables.length === eventTables.length}
                onChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Table.Nr</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTickets.length > 0 ? (
            currentTickets.map((eventTable) => (
              <TableRow key={eventTable.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedEventTables.includes(eventTable.id)}
                    onChange={() => toggleSelectTicket(eventTable.id)}
                  />
                </TableCell>
                <TableCell>
                  {eventTable.eventsTable || "No Table Number"}
                </TableCell>
                <TableCell className="capitalize">
                  {eventTable.eventsTitle || "No Event Title"}
                </TableCell>
                <TableCell>
                  {/* <EditButton ticketData={eventTable} /> */}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => confirmDelete(eventTable.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No event tables available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {selectedEventTables.length} of {eventTables.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this eventTable? This action cannot
            be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
