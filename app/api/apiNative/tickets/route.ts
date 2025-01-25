import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createTicket } from "@/actions/ticket";
import { getAlltData } from "@/data/ticket";
import { auth } from "@/auth";

// Handle POST request (Create a ticket)
export async function POST(req: Request) {
  // Authenticate the user
  const user = await auth();

  // If the user is not authenticated, return an error
  if (!user?.user) {
    return NextResponse.json({ error: "You need to log in" }, { status: 400 });
  }

  // Extract customer ID from authenticated user
  const { id: customerId } = user.user;

  // Parse the request body
  const body = await req.json();

  try {
    // Create the ticket using the parsed body and customerId
    const createdTicket = await createTicket({
      ...body,
      customerId,
    });

    // Return success response
    return NextResponse.json(
      {
        success: "Created ticket successfully",
        id: createdTicket.id,
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle errors during ticket creation
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Cannot create ticket" },
      { status: 400 }
    );
  }
}

// Modify the GET function to include multiple parameters for validation
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const qrNumber = searchParams.get("qrNumber");
  const eventsTitleId = searchParams.get("eventsTitleId");
  const customerId = searchParams.get("customerId");


  if (!qrNumber || !eventsTitleId || !customerId) {
    return NextResponse.json(
      { error: "qrNumber, eventsTitleId, and customerId are required" },
      { status: 400 }
    );
  }

  try {
    const ticket = await prisma.ticket.findFirst({
      where: {
        qrNumber,
        eventsTitleId: eventsTitleId,
        customerId,
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket validation failed. Invalid or not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: "Ticket is valid" }, { status: 200 });
  } catch (error) {
    console.error("Error validating ticket:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Handle PUT request (Update a ticket)
export async function PUT(req: Request) {
  const user = await auth();

  if (!user?.user) {
    return NextResponse.json({ error: "You need to log in" }, { status: 401 });
  }

  try {
    const {
      id,
      description,
      eventsTitle,
      fromDate,
      qrNumber,
      ticketsName,
      amountOfPeople,
      toDate,
    } = await req.json();

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: "Missing required field: id" },
        { status: 400 }
      );
    }

    if (!ticketsName) {
      return NextResponse.json(
        { error: "Missing required field: ticketsName" },
        { status: 400 }
      );
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        description,
        eventsTitle,
        fromDate,
        qrNumber,
        ticketsName,
        amountOfPeople,
        toDate,
        customerId: user.user.id,
      },
    });

    return NextResponse.json(updatedTicket, { status: 200 });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
