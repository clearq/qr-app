'use server'
import { prisma } from "@/lib/db";

export const qrCodeById = async (id: string) => {
  try {
    const qrData = await prisma.qr.findFirst({
      where: { id },
    });
    return qrData;
  } catch {
    return null;
  }
};


export const getAllQrData = async (id: string) => {
  try {
    const qrData = await prisma.qr.findMany({
      where:{
        customerId: id
      },
    });

    return qrData
  } catch {
    return null
  }
}

export const getVisitorCount = async (profileId: string) => {
  try {
    console.log("Fetching visitor count for profileId:", profileId);
    const count = await prisma.scan.aggregate({
      _sum: {
        count: true,
      },
      where: {
        profileId,
      },
    });
    console.log("Visitor count fetched:", count._sum.count);
    if (!count._sum.count) {
      return null
    }
    return count._sum.count
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    return 0;
  }
};