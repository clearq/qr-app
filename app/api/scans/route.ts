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
        return NextResponse.json(
          { error: "QR data not found" },
          { status: 404 }
        );
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

    if (type === 1) {
      // VCard
      const findVcard = await prisma.vCard.findUnique({
        where: { id },
        include: { customer: true },
      });

      if (!findVcard) {
        return NextResponse.json(
          { error: "VCard data not found" },
          { status: 404 }
        );
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

    if (type === 2) {
      // Event
      const findEvent = await prisma.events.findUnique({
        where: { id },
        include: { customer: true },
      });

      if (!findEvent) {
        return NextResponse.json(
          { error: "Event data not found" },
          { status: 404 }
        );
      }

      await prisma.scan.create({
        data: {
          profileId: findEvent.id,
          type: 2,
          customerId: findEvent.customer?.id,
        },
      });

      return NextResponse.json(findEvent, { status: 201 });
    }

    if (type === 3) {
      // Shop
      const findShop = await prisma.shop.findUnique({
        where: { id },
        include: { customer: true },
      });

      if (!findShop) {
        return NextResponse.json(
          { error: "Shop data not found" },
          { status: 404 }
        );
      }

      await prisma.scan.create({
        data: {
          profileId: findShop.id,
          type: 3,
          customerId: findShop.customer?.id,
        },
      });

      return NextResponse.json(findShop, { status: 201 });
    }

    if (type === 4) {
      // Ticket
      const findTicket = await prisma.ticket.findUnique({
        where: { id },
        include: { customer: true },
      });

      if (!findTicket) {
        return NextResponse.json(
          { error: "Ticket data not found" },
          { status: 404 }
        );
      }

      await prisma.scan.create({
        data: {
          profileId: findTicket.id,
          type: 4,
          customerId: findTicket.customer?.id,
        },
      });

      return NextResponse.json(findTicket, { status: 201 });
    }

    if (type === 5) {
      // Product
      const findProduct = await prisma.product.findUnique({
        where: { id },
        include: { shop: { include: { customer: true } } },
      });

      if (!findProduct) {
        return NextResponse.json(
          { error: "Product data not found" },
          { status: 404 }
        );
      }

      await prisma.scan.create({
        data: {
          profileId: findProduct.id,
          type: 5,
          customerId: findProduct.shop.customer?.id,
        },
      });

      return NextResponse.json(findProduct, { status: 201 });
    }

    // If type is not 0, 1, 2, 3, 4, or 5
    return NextResponse.json(
      { error: "Invalid type specified" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error creating scan:", error);
    return NextResponse.json("Something went wrong", { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const customerId = url.searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    // Fetch shop statistics filtered by customerId
    const shopStats = await prisma.shop.findMany({
      where: { customerId },
    });
    const totalShops = shopStats.length;

    // Fetch events statistics filtered by customerId
    const eventStats = await prisma.events.findMany({
      where: { customerId },
    });
    const totalEvents = eventStats.length;

    // Calculate upcoming and past events based on `fromDate`
    const upcomingEvents = eventStats.filter(
      (event) => event.fromDate && new Date(event.fromDate) > new Date()
    ).length;
    const pastEvents = totalEvents - upcomingEvents;

    // Fetch ticket statistics filtered by customerId
    const ticketStats = await prisma.ticket.findMany({
      where: { customerId },
    });
    const totalTickets = ticketStats.length;

    // Fetch product statistics filtered by customerId
    const productStats = await prisma.product.findMany({
      where: { shop: { customerId } },
    });
    const totalProducts = productStats.length;

    // Fetch monthly counts along with detailed data for analytics
    const monthlyCounts = await getMonthlyCounts(customerId); // Pass customerId here
    const vCardmonthlyCounts = await getVcardMonthlyCounts(customerId); // Pass customerId here

    const data = {
      monthlyCounts,
      vCardmonthlyCounts,
      shopStats: {
        totalShops,
      },
      eventStats: {
        totalEvents,
        upcomingEvents,
        pastEvents,
      },
      ticketStats: {
        totalTickets,
      },
      productStats: {
        totalProducts,
      },
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
