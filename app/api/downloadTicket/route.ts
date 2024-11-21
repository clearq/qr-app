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
    const tickets = await prisma.ticket.findMany({
      where: {
        eventsTitleId: eventId,
      },
      include: {
        eventsTitle: true,
      },
    });

    if (tickets.length === 0) {
      return NextResponse.json(
        { error: "No tickets found for this event" },
        { status: 404 }
      );
    }

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
