import { getTicketsByEventId, removeEvents } from "@/actions/events";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
  


  export async function GET(req: NextRequest, context: { params: Params }) {
    const { id } = context.params;
  
    if (!id) {
      return NextResponse.json({ error: "Event ID is required!" }, { status: 400 });
    }
  
    try {
      const event = await prisma.events.findUnique({
        where: { id },
        include: { ticket: { select: { id: true } } },
      });
  
      if (!event) {
        return NextResponse.json({ error: "Event not found!" }, { status: 404 });
      }
  
      const eventWithTicketCount = {
        ...event,
        ticketCount: event.ticket.length,
      };
  
      return NextResponse.json(eventWithTicketCount, { status: 200 });
    } catch (error) {
      console.error("Error fetching event:", error);
      return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
    }
  }