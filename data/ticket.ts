"use server";
import { prisma } from "@/lib/db";

export const ticketCodeById = async (id: string) => {
  try {
    const ticketData = await prisma.ticket.findUnique({
      where: { id },
    });
    return ticketData;
  } catch {
    return null;
  }
};

export const getAlltData = async (userId: string) => {
  try {
    const tData = await prisma.ticket.findMany({
      where: {
        customerId: userId,
      },
    });

    return tData;
  } catch (error) {
    console.error("Error fetching ticket data:", error);
    return null;
  }
};