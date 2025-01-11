import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST: Create a Product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { products, shopId } = body;

    if (!shopId || !products || products.length === 0) {
      return NextResponse.json(
        { error: "Shop ID and products are required" },
        { status: 400 }
      );
    }

    const createdProducts = await prisma.product.createMany({
      data: products.map(
        (product: { title: any; description: any; categoryId: any }) => ({
          title: product.title,
          description: product.description,
          categoryId: product.categoryId,
          shopId,
        })
      ),
    });

    return NextResponse.json(createdProducts, { status: 201 });
  } catch (error) {
    console.error("Error creating products:", error);
    return NextResponse.json(
      { error: "Failed to create products" },
      { status: 500 }
    );
  }
}

// GET: Fetch all Products for a Category
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shopId = searchParams.get("shopId");

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

// DELETE: Delete a Product by ID
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("id");

  if (!productId) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

// PUT: Update a Product
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, description } = body;

    if (!id || !title) {
      return NextResponse.json(
        { error: "Product ID and title are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
