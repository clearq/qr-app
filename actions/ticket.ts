import { prisma } from "@/lib/db";
import { Ticket } from "@prisma/client";

export async function createTicket(data: {
  ticketsName: string;
  eventsTitle?: string;
  qrNumber: string;
  description?: string;
  scanCount?: number;
  scans?: number;
  fromDate?: string | null;
  toDate?: string | null;
  customerId: string;
}) {
  return await prisma.ticket.create({
    data: {
      ticketsName: data.ticketsName,
      // eventsTitle: data.eventsTitle,
      qrNumber: data.qrNumber,
      description: data.description,
      scanCount: data.scanCount,
      scans: data.scans,
      // fromDate: data.fromDate ? new Date(data.fromDate) : null, 
      // toDate: data.toDate ? new Date(data.toDate) : null,
      customerId: data.customerId, 
    },
  });
}
