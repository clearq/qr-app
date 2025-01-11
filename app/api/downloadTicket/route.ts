import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  if (!eventId) {
    return NextResponse.json(
      { error: "Event ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch tickets associated with the given event ID
    const tickets = await prisma.ticket.findMany({
      where: {
        eventsTitleId: eventId, // Match event ID with tickets
      },
      include: {
        eventsTitle: true, // Include related event details
      },
    });

    if (tickets.length === 0) {
      return NextResponse.json(
        { error: "No tickets found for this event" },
        { status: 404 }
      );
    }

    // Transform the data to match the structure expected by the frontend
    const formattedTickets = tickets.map((ticket) => ({
      id: ticket.id,
      ticketsName: ticket.ticketsName || "Unnamed Ticket", // Provide fallback if name is missing
      eventsTitle: ticket.eventsTitle
        ? { eventsTitle: ticket.eventsTitle.eventsTitle }
        : null, // Ensure event title structure matches frontend interface
    }));

    return NextResponse.json(formattedTickets, { status: 200 });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
