import { prisma } from "@/lib/db";

export const removeEvents = async (id : string) => {
    try {
        if (!id) {
            return {
                error : "Id is required!"
            }
        }

        await prisma.events.delete({
            where: {id}
        })

        return "Removed qrcode successfully"
    } catch {
        return null;
    }
}

export const getTicketsByEventId = async (eventId: string) => {
    try {
      if (!eventId) {
        return { error: "Event ID is required!" };
      }
  
      // Fetch all tickets related to the given event ID
      const tickets = await prisma.ticket.findMany({
        where: { eventsTitleId: eventId },
      });
  
      if (tickets.length === 0) {
        return { message: "No tickets found for this event." };
      }
  
      return tickets;
    } catch (error) {
      console.error("Error fetching tickets:", error);
      return { error: "Error fetching tickets." };
    }
  };