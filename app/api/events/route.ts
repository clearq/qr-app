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
    console.log("Received body:", body);

    const { eventsTitle, description } = body;

    // Ensure required fields
    if (!eventsTitle || !description) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await auth();

    if (!user || !user.user) {
      return NextResponse.json(
        { message: "Unauthorized, please log in." },
        { status: 401 }
      );
    }

    const customerId = user.user.id;

    const newEvent = await prisma.events.create({
      data: {
        eventsTitle,
        description,
        customerId,
      },
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

  // If a specific event ID is provided, return that event
  if (id) {
    try {
      const event = await prisma.events.findUnique({
        where: { id },
        include: {
          ticket: {
            select: {
              id: true, // Just select the ticket IDs, we only need the count
            },
          },
        },
      });

      if (!event) {
        return NextResponse.json(
          { error: "Event not found!" },
          { status: 404 }
        );
      }

      // Add ticket count to the response
      const eventWithTicketCount = {
        ...event,
        ticketCount: event.ticket.length,
      };

      return NextResponse.json(eventWithTicketCount, { status: 200 });
    } catch (error) {
      console.error("Error fetching event:", error);
      return NextResponse.json(
        { error: "Cannot fetch event" },
        { status: 500 }
      );
    }
  }

  // Fetch all events for the authenticated user
  const user = await auth();

  if (!user?.user) {
    return NextResponse.json({ error: "You need to log in" }, { status: 400 });
  }

  const { id: userId } = user.user;
  
  // Fetch all events with ticket counts
  try {
    const events = await prisma.events.findMany({
      where: {
        customerId: userId, // Only fetch events belonging to this user
      },
      include: {
        ticket: {
          select: {
            id: true, // Just fetch the ticket IDs, we only need the count
          },
        },
      },
    });

    // Map over events to add ticket counts
    const eventsWithTicketCount = events.map((event) => ({
      ...event,
      ticketCount: event.ticket.length,
    }));

    return NextResponse.json(eventsWithTicketCount, { status: 200 });
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
      return NextResponse.json({ error: "Cannot remove the event!" }, { status: 400 });
    }

    return NextResponse.json({ message: "Removed successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error removing event data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
