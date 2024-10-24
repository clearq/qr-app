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
  // Extract query parameters from URL
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const qrNumber = url.searchParams.get("qrNumber"); // Extract qrNumber from query params

  // If a qrNumber is provided, check the ticket based on that
  if (qrNumber) {
    try {
      // Find a ticket by its qrNumber
      const ticket = await prisma.ticket.findUnique({
        where: { qrNumber }, // Search by qrNumber instead of id
      });

      if (!ticket) {
        return NextResponse.json(
          { error: "Ticket not found!" },
          { status: 404 }
        );
      }

      return NextResponse.json(ticket, { status: 200 });
    } catch (error) {
      console.error("Error fetching ticket by QR code:", error);
      return NextResponse.json(
        { error: "Cannot fetch ticket by QR code" },
        { status: 500 }
      );
    }
  }

  // If an id is provided, check the ticket by ID
  if (id) {
    try {
      const ticket = await prisma.ticket.findUnique({
        where: { id },
      });

      if (!ticket) {
        return NextResponse.json(
          { error: "Ticket not found!" },
          { status: 404 }
        );
      }

      return NextResponse.json(ticket, { status: 200 });
    } catch (error) {
      console.error("Error fetching ticket by ID:", error);
      return NextResponse.json(
        { error: "Cannot fetch ticket" },
        { status: 500 }
      );
    }
  }

  // If no id or qrNumber is provided, return an error
  return NextResponse.json(
    { error: "No ticket identifier provided" },
    { status: 400 }
  );
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
