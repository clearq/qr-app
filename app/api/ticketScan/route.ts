import { NextApiRequest, NextApiResponse } from "next";
import { createTicket } from "@/actions/ticket";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAlltData } from "@/data/ticket";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  const user = await auth();

  if (!user?.user) {
    return NextResponse.json({ error: "You need to log in" }, { status: 400 });
  }

  const { id: customerId } = user.user;
  const body = await req.json();

  const { eventsTitleId, tableNumber, availabilityPerTable, ...ticketData } =
    body;

  try {
    const event = await prisma.events.findUnique({
      where: { id: eventsTitleId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found!" }, { status: 404 });
    }

    if (!event?.numberOfTables) {
      return NextResponse.json(
        { error: "The number of tables for the event is not set." },
        { status: 400 }
      );
    }

    if (tableNumber < 1 || tableNumber > event.numberOfTables) {
      return NextResponse.json(
        {
          error: `Invalid table number. Choose a number between 1 and ${event.numberOfTables}.`,
        },
        { status: 400 }
      );
    }

    const createdTicket = await prisma.ticket.create({
      data: {
        ...ticketData,
        tableNumber,
        availabilityPerTable,
        eventsTitleId,
        customerId,
      },
    });

    return NextResponse.json(
      { success: "Created ticket successfully", id: createdTicket.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Cannot create ticket" },
      { status: 400 }
    );
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (id) {
    try {
      const ticket = await prisma.ticket.findUnique({
        where: { id },
      });

      if (!ticket) {
        return NextResponse.json(
          { error: "Ticket data not found!" },
          { status: 404 }
        );
      }

      return NextResponse.json(ticket, { status: 200 });
    } catch (error) {
      console.error("Error fetching ticket:", error);
      return NextResponse.json(
        { error: "Cannot fetch ticket" },
        { status: 500 }
      );
    }
  }

  const user = await auth();

  if (!user?.user) {
    return NextResponse.json({ error: "You need to log in" }, { status: 400 });
  }

  const { id: userId } = user.user;
  const tData = await getAlltData(userId);

  if (!tData) {
    return NextResponse.json(
      { error: "Ticket data not found!" },
      { status: 400 }
    );
  }

  return NextResponse.json(tData, { status: 200 });
}

export async function PUT(req: Request) {
  const user = await auth();

  if (!user?.user) {
    return NextResponse.json({ error: "You need to log in" }, { status: 401 });
  }

  try {
    const {
      id,
      description,
      eventsTitleId,
      guestMail,
      qrNumber,
      ticketsName,
      fullName,
      tableNumber,
      amountOfPeople,
    } = await req.json();

    if (!id || !ticketsName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 403 }
      );
    }

    // Ensure the event exists before updating
    if (eventsTitleId) {
      const eventExists = await prisma.events.findUnique({
        where: { id: eventsTitleId },
      });

      if (!eventExists) {
        return NextResponse.json(
          { error: "Invalid eventsTitleId. Event does not exist." },
          { status: 404 }
        );
      }
    }

    // Update the record
    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        description,
        eventsTitle: {
          connect: { id: eventsTitleId },
        },
        qrNumber,
        guestMail,
        fullName,
        ticketsName,
        tableNumber,
        amountOfPeople,
      } as Prisma.TicketUncheckedUpdateInput, // Explicitly cast as UncheckedUpdateInput
    });

    return NextResponse.json(updatedTicket, { status: 201 });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
