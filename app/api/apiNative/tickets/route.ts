import { NextResponse } from "next/server";
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
    return NextResponse.json(
      { error: "You need to log in" },
      { status: 400 }
    );
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

// Handle GET request (Fetch tickets)
export async function GET(req: Request) {
  // Extract the ticket ID from query parameters (if provided)
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (id) {
    try {
      // Find a specific ticket by ID
      const ticket = await prisma.ticket.findUnique({
        where: { id },
      });

      // If ticket is not found, return 404
      if (!ticket) {
        return NextResponse.json(
          { error: "Ticket data not found!" },
          { status: 404 }
        );
      }

      // Return the found ticket
      return NextResponse.json(ticket, { status: 200 });
    } catch (error) {
      // Handle errors during fetching specific ticket
      console.error("Error fetching ticket:", error);
      return NextResponse.json(
        { error: "Cannot fetch ticket" },
        { status: 500 }
      );
    }
  }

  // Authenticate the user if no specific ticket ID is provided
  const user = await auth();

  // If the user is not authenticated, return an error
  if (!user?.user) {
    return NextResponse.json(
      { error: "You need to log in" },
      { status: 400 }
    );
  }

  const { id: userId } = user.user;

  try {
    // Fetch all tickets associated with the user
    const tData = await getAlltData(userId);

    // If no tickets are found, return 404
    if (!tData) {
      return NextResponse.json(
        { error: "Ticket data not found!" },
        { status: 400 }
      );
    }

    // Return the fetched tickets
    return NextResponse.json(tData, { status: 200 });
  } catch (error) {
    // Handle errors during fetching tickets
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Cannot fetch tickets" },
      { status: 500 }
    );
  }
}

// Handle PUT request (Update a ticket)
export async function PUT(req: Request) {
  // Authenticate the user
  const user = await auth();

  // If the user is not authenticated, return an error
  if (!user?.user) {
    return NextResponse.json(
      { error: "You need to log in" },
      { status: 401 }
    );
  }

  try {
    // Parse the request body
    const {
      id,
      description,
      eventsTitle,
      fromDate,
      qrNumber,
      ticketsName,
      scanCount,
      toDate,
      scans,
    } = await req.json();

    // Validate that required fields are provided
    if (!id || !ticketsName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 403 }
      );
    }

    // Update the ticket in the database
    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        description,
        eventsTitle,
        fromDate,
        qrNumber,
        ticketsName,
        scanCount,
        toDate,
        scans,
        customerId: user.user.id,
      },
    });

    // Return the updated ticket
    return NextResponse.json(updatedTicket, { status: 201 });
  } catch (error) {
    // Handle errors during updating ticket
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
