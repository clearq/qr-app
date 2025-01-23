import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: Fetch a single product by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Validate product ID
  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch the product by ID, including related shop and category data
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        shop: {
          include: {
            customer: true, // Include customer data for the shop
          },
        },
        category: true, // Include category data
      },
    });

    // If product is not found, return a 404 error
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Return the product data, including itemId
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT: Update a product by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Validate product ID
  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { title, description, shopId, categoryId, itemId } = body;

    // Validate required fields
    if (!title || !shopId || !categoryId) {
      return NextResponse.json(
        { error: "Title, shop ID, and category ID are required" },
        { status: 400 }
      );
    }

    // Check if the product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update the product, including itemId
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        shopId,
        categoryId,
        itemId, // Include itemId
      },
    });

    // Return the updated product
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a product by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Validate product ID
  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    // Delete the product
    await prisma.product.delete({
      where: { id },
    });

    // Return success message
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
