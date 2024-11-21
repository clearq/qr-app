import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { format } from "date-fns";

export async function GET(
  req: NextRequest,
  context: { params: { id: string; type: string } }
) {
  const { id, type } = context.params;

  // Validate the parameters
  if (!id) {
    return NextResponse.json({ error: "ID is required!" }, { status: 400 });
  }

  if (!type) {
    return NextResponse.json({ error: "Type is required!" }, { status: 400 });
  }

  try {
    // Fetch scans based on profileId and type
    const scans = await prisma.scan.findMany({
      where: {
        profileId: id,
        type: Number(type), // Ensure 'type' is treated as a number
      },
      select: {
        scannedAt: true, // Assuming 'scannedAt' is the datetime field
      },
    });

    if (!scans || scans.length === 0) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    // Group scans by month
    const monthlyCounts = scans.reduce((acc: any, scan) => {
      const monthKey = format(scan.scannedAt, "yyyy-MM"); // 'YYYY-MM' format
      acc[monthKey] = (acc[monthKey] || 0) + 1;
      return acc;
    }, {});

    const groupedData = Object.entries(monthlyCounts).map(([month, count]) => ({
      month,
      count,
    }));

    return NextResponse.json({ data: groupedData }, { status: 200 });
  } catch (error) {
    console.error("[GET BY ID & TYPE] Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
