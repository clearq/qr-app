import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { removeVcard } from "@/actions/vcard";
import { ticketCodeById } from "@/data/ticket";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "ID is required!" });
  }

  try {
    const ticket = await ticketCodeById(id as string);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found!" });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "ID is required!" });
  }

  try {
    const removedData = await removeVcard(id as string);

    if (!removedData) {
      return res.status(400).json({ error: "Cannot remove the ticket!" });
    }

    return res.status(200).json({ message: "Removed successfully!" });
  } catch (error) {
    console.error("Error removing ticket:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
