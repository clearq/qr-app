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
    const eventTables = await prisma.eventTable.findMany({
      where: {
        eventId: eventId, // Match the eventId with EventTable's eventId field
      },
      include: {
        event: {
          select: { eventsTitle: true }, // Include event title for display
        },
      },
    });

    if (eventTables.length === 0) {
      return NextResponse.json(
        { error: "No event tables found for this event" },
        { status: 404 }
      );
    }

    // Format the data for the frontend
    const formattedEventTables = eventTables.map((table) => ({
      id: table.id,
      eventsTable: table.tableNumber || "No Table Number",
      availableSeats: table.availableSeats || "No Seats Info",
      eventsTitle: table.event?.eventsTitle || "No Event Title",
    }));

    return NextResponse.json(formattedEventTables, { status: 200 });
  } catch (error) {
    console.error("Error fetching event tables:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
