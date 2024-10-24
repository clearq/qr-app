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

export const GET = async (req: NextRequest) => {
  const url = req.nextUrl; // Use nextUrl which is correctly parsed
  const userId = url.searchParams.get('userId');  // Get userId from the query parameter

  if (!userId) {
    return NextResponse.json(
      { message: 'User ID is required.' },
      { status: 400 }
    );
  }

  try {
    // Fetch events related to the userId
    const events = await prisma.events.findMany({
      where: { customerId: userId },  // Fetch events based on userId
    });

    if (!events || events.length === 0) {
      return NextResponse.json(
        { message: 'No events found for this user.' },
        { status: 404 }
      );
    }

    return NextResponse.json(events, { status: 200 });

  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { message: 'Internal server error.' },
      { status: 500 }
    );
  }
};


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
