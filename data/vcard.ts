"use server";
import { prisma } from "@/lib/db";

export const vCodeById = async (id: string) => {
  try {
    const vcData = await prisma.vCard.findFirst({
      where: { id },
    });
    return vcData;
  } catch {
    return null;
  }
};

export const getAllVData = async (id: string) => {
  try {
    const vData = await prisma.vCard.findMany({
      where: {
        customerId: id,
      },
    });

    return vData;
  } catch {
    return null;
  }
};
