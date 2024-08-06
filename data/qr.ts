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
    const count = await prisma.scan.aggregate({
      _sum: {
        count: true,
      },
      where: {
        profileId,
      },
    });
    return count._sum.count || 0; // return 0 if no scans found
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    return 0; // return 0 in case of error
  }
};