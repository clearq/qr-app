import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { qrId, ipAddress, latitude, longitude } = await req.json();

    if (!qrId || !ipAddress || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newScan = await prisma.scan.create({
      data: {
        qrId,
        ipAddress,
        latitude,
        longitude,
      },
    });

    return NextResponse.json(newScan, { status: 201 });
  } catch (error) {
    console.error("Error logging scan:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
