import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getMonthlyCounts, getVcardMonthlyCounts } from "@/actions/scans";
import { getVisitorCount } from "@/data/qr";

export async function POST(req: Request) {
  try {
    const { id, type } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (type === 0) {
      // QR code
      const findQr = await prisma.qr.findUnique({
        where: { id },
        include: { customer: true },
      });

      if (!findQr) {
        return NextResponse.json({ error: "QR data not found" }, { status: 404 });
      }

      await prisma.scan.create({
        data: {
          profileId: findQr.id,
          type: 0,
          customerId: findQr.customer?.id,
        },
      });

      return NextResponse.json(findQr, { status: 201 });
    } 

    if(type === 1) {
      // VCard
      const findVcard = await prisma.vCard.findUnique({
        where: { id },
        include: { customer: true },
      });

      if (!findVcard) {
        return NextResponse.json({ error: "VCard data not found" }, { status: 404 });
      }

      await prisma.scan.create({
        data: {
          profileId: findVcard.id,
          type: 1,
          customerId: findVcard.customer?.id,
        },
      });

      return NextResponse.json(findVcard, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating scan:", error);
    return NextResponse.json("Something went wrong", { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    // Fetch monthly counts along with detailed data for analytics
    const monthlyCounts = await getMonthlyCounts();
    const vCardmonthlyCounts = await getVcardMonthlyCounts();
    const qrData = await prisma.qr.findMany({ include: { customer: true } });
    const vCardData = await prisma.vCard.findMany({ include: { customer: true } });
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    
    if (id) {
      const qrData = await prisma.qr.findUnique({
        where: { id },
        include: { customer: true },
      });

      const visitorCount = await getVisitorCount(id);

      if (qrData) {
        return NextResponse.json({ ...qrData, visitorCount }, { status: 200 });
      }

      const vCardData = await prisma.vCard.findUnique({
        where: { id },
        include: { customer: true },
      });

      if (vCardData) {
        return NextResponse.json({ ...vCardData, visitorCount }, { status: 200 });
      }

      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    const data = {
      monthlyCounts,
      vCardmonthlyCounts,
      qrData,
      vCardData,
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

