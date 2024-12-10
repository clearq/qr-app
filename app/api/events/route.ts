import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAlleData } from "@/data/events";
import { auth } from "@/auth";
import { removeEvents } from "@/actions/events";

type Params = {
  id: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventsTitle, description, numberOfTables, availabilityPerTable } =
      body;

    // Validate inputs
    if (
      !eventsTitle ||
      !description ||
      numberOfTables == null ||
      availabilityPerTable == null
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Authenticate user
    const user = await auth();
    if (!user?.user) {
      return NextResponse.json(
        { message: "Unauthorized, please log in." },
        { status: 401 }
      );
    }

    const customerId = user.user.id;

    // Create event and tables transactionally
    const newEvent = await prisma.$transaction(async (prisma) => {
      // Create event
      const event = await prisma.events.create({
        data: {
          eventsTitle,
          description,
          numberOfTables,
          availabilityPerTable,
          customer: { connect: { id: customerId } },
        },
      });

      // Create event tables
      const eventTables = Array.from({ length: numberOfTables }, (_, i) => ({
        tableNumber: i + 1,
        availableSeats: availabilityPerTable,
        eventId: event.id,
      }));

      await prisma.eventTable.createMany({ data: eventTables });

      return event;
    });

    return NextResponse.json(newEvent, { status: 200 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  // Fetch a single event by its ID
  if (id) {
    try {
      const event = await prisma.events.findUnique({
        where: { id },
        include: {
          customer: true,
          eventTables: true, // Include event tables when fetching a single event
        },
      });

      if (!event) {
        return NextResponse.json(
          { error: "Event not found!" },
          { status: 404 }
        );
      }

      // Include the number of tables for the single event
      const eventWithTableCount = {
        ...event,
        tableCount: event.eventTables.length,
      };

      return NextResponse.json(eventWithTableCount, { status: 200 });
    } catch (error) {
      console.error("Error fetching event:", error);
      return NextResponse.json(
        { error: "Cannot fetch event" },
        { status: 500 }
      );
    }
  }

  // Log authentication status
  const user = await auth();

  if (!user?.user) {
    console.error("User not authenticated");
    return NextResponse.json({ error: "You need to log in" }, { status: 400 });
  }

  const { id: userId } = user.user;

  try {
    // Fetch all events for the authenticated user
    const events = await prisma.events.findMany({
      where: { customerId: userId },
      include: {
        eventTables: true, // Ensure eventTables are included
        ticket: {
          select: { id: true },
        },
      },
    });

    // Map events to include ticket count and table count
    const eventsWithCounts = events.map((event) => ({
      ...event,
      ticketCount: event.ticket.length,
      tableCount: event.eventTables.length, // Add table count to the event
    }));

    return NextResponse.json(eventsWithCounts, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Cannot fetch events" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Params }) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ error: "ID is required!" }, { status: 400 });
  }

  try {
    const removedData = await removeEvents(id);

    if (!removedData) {
      return NextResponse.json(
        { error: "Cannot remove the event!" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Removed successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing event data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
