import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { id, type } = await req.json();

    if (!id) {
      return NextResponse.json({error : "ID is required" },{status: 400})
    }

    if (type === 0) {
      // qrcode
      const findQr = await prisma.qr.findUnique({
        where: {
          id
        },
        include:{
          customer: true
        }
      });

      if (!findQr) {
        return NextResponse.json({error : "Qr data not found" },{status: 404})
      };

      const createdAnalys = await prisma.scan.create({
        data : {
          profileId: findQr.id,
          type : 0,
          customerId: findQr.customer?.id
        }
      });

      if (!createdAnalys) {
        return NextResponse.json({error : "Cannot create analytics data" },{status: 400})
      }

      return NextResponse.json(findQr, { status: 201 });
    } else {
      // vcard 
      const findVcard = await prisma.vCard.findUnique({
        where: {
          id
        },
        include:{
          customer: true
        }
      });

      if (!findVcard) {
        return NextResponse.json({error : "VCard data not found" },{status: 404})
      };

      const createdAnalys = await prisma.scan.create({
        data : {
          profileId: findVcard.id,
          type : 1,
          customerId: findVcard.customer?.id
        }
      });

      if (!createdAnalys) {
        return NextResponse.json({error : "Cannot create analytics data" },{status: 400})
      }

      return NextResponse.json(findVcard, { status: 201 });

    }
  } catch (error) {
    console.error("Error creating scan:", error);
    return NextResponse.json("Something went wrong", { status: 400 });
  }
}


export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const customerId = url.searchParams.get("customerId");

    const scanCounts = await prisma.scan.groupBy({
      by: ["customerId"],
      _sum: { count: true },
      where: { customerId: customerId ? customerId : undefined },
    });

    return NextResponse.json(scanCounts, { status: 200 });
  } catch (error) {
    console.error("Error retrieving scan counts:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}