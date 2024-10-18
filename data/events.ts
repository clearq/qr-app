import { prisma } from "@/lib/db";

export const eventsCodeById = async (id: string) => {
    try {
      const evetsData = await prisma.events.findUnique({
        where: { id },
      });
      return evetsData;
    } catch {
      return null;
    }
  };
  
  export const getAlleData = async (userId: string) => {
    try {
      const eData = await prisma.events.findMany({
        where: {
          customerId: userId,
        },
      });
  
      return eData;
    } catch (error) {
      console.error("Error fetching events data:", error);
      return null;
    }
  };