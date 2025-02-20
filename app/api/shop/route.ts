import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST: Create a Shop
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, address, description, customerId } = body;

    // Validate required fields
    if (!name || !customerId) {
      return NextResponse.json(
        { error: "Shop name and customer ID are required" },
        { status: 400 }
      );
    }

    // Check if the customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Check if a shop with the same name and customerId already exists
    const existingShop = await prisma.shop.findFirst({
      where: {
        name,
        customerId,
      },
    });

    if (existingShop) {
      return NextResponse.json(
        { error: "A shop with this name already exists for the customer" },
        { status: 409 }
      );
    }

    // Create the shop
    const shop = await prisma.shop.create({
      data: {
        name,
        address,
        description,
        customerId,
      },
    });

    return NextResponse.json(shop, { status: 201 });
  } catch (error) {
    console.error("Error creating shop:", error);
    return NextResponse.json(
      { error: "Failed to create shop" },
      { status: 500 }
    );
  }
}

// GET: Fetch all Shops
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId"); // Get customerId from query params
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    console.log("Fetching shops for customerId:", customerId); // Debugging

    // Fetch shops with optional customerId filter
    const shops = await prisma.shop.findMany({
      where: customerId ? { customerId } : undefined, // Filter by customerId if provided
      skip: (page - 1) * limit, // Pagination: skip
      take: limit, // Pagination: limit
      include: {
        customer: true,
        categories: true,
        products: true,
      },
    });

    // Get total count for pagination
    const totalShops = await prisma.shop.count({
      where: customerId ? { customerId } : undefined,
    });

    return NextResponse.json(
      {
        data: shops,
        pagination: {
          page,
          limit,
          total: totalShops,
          totalPages: Math.ceil(totalShops / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching shops:", error);
    return NextResponse.json(
      { error: "Failed to fetch shops" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a Shop by ID
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shopId = searchParams.get("id");

  if (!shopId) {
    return NextResponse.json({ error: "Shop ID is required" }, { status: 400 });
  }

  try {
    // Delete the shop and its related categories and products
    await prisma.shop.delete({
      where: { id: shopId },
    });

    return NextResponse.json(
      { message: "Shop deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting shop:", error);
    return NextResponse.json(
      { error: "Failed to delete shop" },
      { status: 500 }
    );
  }
}
