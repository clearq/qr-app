'use server'
import { prisma } from "@/lib/db";

export const qrCodeById = async (id: string) => {
  try {
    const qrData = await prisma.qr.findFirst({
      where: { id },
      include: {
        scans: true,
      },
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
      include: {
        scans: true,
      },
    });

    return qrData
  } catch {
    return null
  }
}
