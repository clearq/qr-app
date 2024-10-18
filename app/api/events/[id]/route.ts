import { getTicketsByEventId, removeEvents } from "@/actions/events";
import { NextRequest, NextResponse } from "next/server";

type Params = {
    id: string;
  };

export async function DELETE(req: NextRequest, context: { params: Params }) {
    const { id } = context.params;
  
    if (!id) {
      return NextResponse.json({ error: "ID is required!" }, { status: 400 });
    }
  
    try {
      const removedData = await removeEvents(id);
  
      if (!removedData) {
        return NextResponse.json({ error: "Cannot remove the vCard!" }, { status: 400 });
      }
  
      return NextResponse.json({ message: "Removed successfully!" }, { status: 200 });
    } catch (error) {
      console.error("Error removing vCard data:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  


  // GET handler to fetch all tickets under a specific event
export async function GET(req: NextRequest, context: { params: Params }) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ error: "Event ID is required!" }, { status: 400 });
  }

  try {
    // Fetch all tickets related to the event
    const tickets = await getTicketsByEventId(id);

    if (!tickets) {
      return NextResponse.json({ message: "No tickets found for this event." }, { status: 404 });
    }

    return NextResponse.json(tickets, { status: 200 });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}
