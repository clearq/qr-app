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

interface Ticket {
  id: string;
  ticketsName: string;
  eventsTitle: {
    eventsTitle: string;
  } | null;
}

interface TicketsTableProps {
  selectedEventId: string | null;
}

export function TicketsTable({ selectedEventId }: TicketsTableProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const itemsPerPage = 5;

  const fetchTickets = useCallback(async () => {
    if (!selectedEventId) return;
    setLoading(true);
    try {
      const response = await fetch(
        `/api/downloadTicket?eventId=${selectedEventId}`
      );
      const tickets: Ticket[] = await response.json();
      console.log(tickets);
      setTickets(tickets);
    } catch (error) {
      toast({
        title: "Error fetching tickets",
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
    if (!ticketToDelete) return;
    try {
      const response = await fetch(`/api/ticketScan/${ticketToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete ticket");
      }

      setTickets((prev) =>
        prev.filter((ticket) => ticket.id !== ticketToDelete)
      );
      toast({
        title: "Ticket Deleted",
        description: "The ticket has been successfully deleted.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast({
        title: "Error deleting ticket",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setTicketToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setTicketToDelete(id);
    setShowDeleteDialog(true);
  };

  const toggleSelectTicket = (id: string) => {
    setSelectedTickets((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((ticketId) => ticketId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTickets.length === tickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(tickets.map((ticket) => ticket.id));
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = tickets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tickets.length / itemsPerPage);

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
                checked={selectedTickets.length === tickets.length}
                onChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Ticket Name</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTickets.length > 0 ? (
            currentTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedTickets.includes(ticket.id)}
                    onChange={() => toggleSelectTicket(ticket.id)}
                  />
                </TableCell>
                <TableCell>{ticket.ticketsName}</TableCell>
                <TableCell className="capitalize">
                  {ticket.eventsTitle
                    ? ticket.eventsTitle.eventsTitle
                    : "No event title"}
                </TableCell>
                <TableCell>
                  {
                    //@ts-ignore
                    <EditButton ticketData={ticket} />
                  }
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => confirmDelete(ticket.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No tickets available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {selectedTickets.length} of {tickets.length} row(s) selected.
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
            Are you sure you want to delete this ticket? This action cannot be
            undone.
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
