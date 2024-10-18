import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // Adjust the import to your project structure

// Named export for GET request handling
export async function GET(req: NextRequest) {
  // Parse URL to extract query parameters
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('eventId'); // Get the 'eventId' from query string

  if (!eventId) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  try {
    // Fetch tickets for the given eventId from your database
    const tickets = await prisma.ticket.findMany({
      where: {
        eventsTitleId: eventId,
      },
    });

    if (tickets.length === 0) { 
      return NextResponse.json({ error: 'No tickets found for this event' }, { status: 404 });
    }

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
