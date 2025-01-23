import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: Fetch all Products for a Category
export async function GET(
  req: NextRequest,
  params: { params: { shopId: string } }
) {
  const shopId = params.params.shopId;

  if (!shopId) {
    return NextResponse.json({ error: "Shop ID is required" }, { status: 400 });
  }

  try {
    const products = await prisma.product.findMany({
      where: { shopId },
    });



    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
