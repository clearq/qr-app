import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST: Create a Shop
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, address, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Shop name is required" },
        { status: 400 }
      );
    }

    const shop = await prisma.shop.create({
      data: {
        name,
        address,
        description,
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
    const shops = await prisma.shop.findMany({
      include: {
        categories: true, // Include categories relation
        products: true, // Include products relation
      },
    });
    return NextResponse.json(shops, { status: 200 });
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
