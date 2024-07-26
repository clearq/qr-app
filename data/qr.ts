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
