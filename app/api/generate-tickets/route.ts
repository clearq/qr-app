import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Named export for the POST method
export async function POST(req: Request) {
  try {
    const user = await auth(); // Ensure the user is authenticated

    if (!user?.user) {
      return NextResponse.json({ error: "You need to log in" }, { status: 400 });
    }

    const { eventId, ticketCount, fromDate, toDate } = await req.json();

    if (!eventId || !ticketCount || !fromDate || !toDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate the specified number of tickets
    const tickets = [];
    for (let i = 0; i < ticketCount; i++) {
      tickets.push({
        eventsTitleId: eventId,
        customerId: user.user.id,
        fromDate,
        toDate,
        qrNumber: Math.floor(100000000000 + Math.random() * 900000000000).toString(), // Generate a random QR number
        ticketsName: `Ticket ${i + 1}`,
      });
    }

    // Save the generated tickets in the database
    const createdTickets = await prisma.ticket.createMany({
      data: tickets,
    });

    return NextResponse.json({ success: "Tickets generated successfully", createdTickets }, { status: 201 });
  } catch (error) {
    console.error("Error generating tickets:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
