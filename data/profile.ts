"use server";
import { prisma } from "@/lib/db";

export const userById = async (id: string) => {
  try {
    const userdata = await prisma.customer.findFirst({
      where: { id },
    });
    return userdata;
  } catch {
    return null;
  }
};