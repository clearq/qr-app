import { prisma } from "@/lib/db";
import { Ticket } from "@prisma/client";

export async function createTicket(data: {
  ticketsName: string;
  eventsTitle?: string;
  qrNumber: string;
  description?: string;
  amountOfPeople?: number;
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
      amountOfPeople: data.amountOfPeople,
      fromDate: data.fromDate,
      toDate: data.toDate,
      customerId: data.customerId,
    },
  });
}
