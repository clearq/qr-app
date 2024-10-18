"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { TICKET } from "@/typings";

interface Ticket {
  id: string;
  ticketsName: string;
}

const fetchTicketsByEventId = async (eventId: string): Promise<TICKET[]> => {
  try {
    // Pass eventId in the query parameters
    const response = await fetch(`/api/downloadTicket?eventId=${eventId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch tickets");
    }

    const tickets = await response.json();
    return tickets;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
};

export default function QRCodePage({ params }: { params: { eventId: string } }) {
  const { eventId } = params;
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [qrCodes, setQrCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQRCodes = async () => {
      try {
        // Fetch tickets based on event ID
        const ticketsData = await fetchTicketsByEventId(eventId);
        setTickets(ticketsData);

        // Generate QR codes for each ticket
        const qrCodesPromises = ticketsData.map(async (ticket) => {
          const qrCodeDataUrl = await QRCode.toDataURL(ticket.id, {
            errorCorrectionLevel: "H",
            width: 300,
          });
          return qrCodeDataUrl;
        });

        const qrCodesData = await Promise.all(qrCodesPromises);
        setQrCodes(qrCodesData);
      } catch (error) {
        console.error('Error generating QR codes:', error);
      } finally {
        setLoading(false);
      }
    };

    generateQRCodes();
  }, [eventId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tickets.length) {
    return <div>No tickets available for this event.</div>;
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl mb-5">QR Codes for Event {eventId}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tickets.map((ticket, index) => (
          <div key={ticket.id} className="flex flex-col items-center">
            <img
              src={qrCodes[index]}
              alt={`QR code for ticket ${ticket.id}`}
              className="mb-2"
            />
            <p className="text-center">{ticket.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
