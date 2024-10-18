import { NextApiRequest, NextApiResponse } from "next";
import { createTicket} from "@/actions/ticket"; 
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAlltData } from "@/data/ticket";

export async function POST(req: Request) {
  const user = await auth();

  if (!user?.user) {
    return NextResponse.json(
      { error: "You need to log in" },
      { status: 400 }
    );
  }

  const { id: customerId } = user.user; 
  const body = await req.json();

  try {
    const createdTicket = await createTicket({
      ...body,
      customerId,
    });

    return NextResponse.json(
      {
        success: "Created ticket successfully",
        id: createdTicket.id,
      },
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
    return NextResponse.json(
      { error: "You need to log in" },
      { status: 400 }
    );
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
    return NextResponse.json(
      { error: "You need to log in" },
      { status: 401 }
    );
  }

  try {
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

    if (!id  || !ticketsName ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 403 }
      );
    }

    // Update the record
    const updatedUser = await prisma.ticket.update({
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
        customerId: id
      },
    });

    return NextResponse.json(updatedUser, { status: 201 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

