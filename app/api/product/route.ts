import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST: Create a Product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { products, shopId } = body;

    // Validate required fields
    if (!shopId || !products || products.length === 0) {
      return NextResponse.json(
        { error: "Shop ID and products are required" },
        { status: 400 }
      );
    }

    // Create multiple products
    const createdProducts = await prisma.product.createMany({
      data: products.map(
        (product: {
          title: any;
          description: any;
          categoryId: any;
          itemId: any;
          image: any; // Add image field
        }) => ({
          title: product.title,
          description: product.description,
          categoryId: product.categoryId,
          shopId,
          itemId: product.itemId,
          image: product.image, // Include the image field
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

// GET: Fetch all Products for a Shop or Category
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("customerId");
  const shopId = searchParams.get("shopId");
  const categoryId = searchParams.get("categoryId");

  try {
    let products;
    if (customerId) {
      // Fetch the shopId of the customer first
      const shop = await prisma.shop.findFirst({
        where: { customerId },
        select: { id: true },
      });

      if (!shop) {
        return NextResponse.json(
          { error: "No shop found for this customer" },
          { status: 404 }
        );
      }

      // Fetch products for that shop
      products = await prisma.product.findMany({
        where: { shopId: shop.id },
        include: { category: true, shop: true },
      });
    } else if (shopId) {
      // Fetch products by shopId
      products = await prisma.product.findMany({
        where: { shopId },
        include: { category: true, shop: true },
      });
    } else if (categoryId) {
      // Fetch products by category
      products = await prisma.product.findMany({
        where: { categoryId },
        include: { category: true, shop: true },
      });
    } else {
      // Fetch all products if no filters provided
      products = await prisma.product.findMany({
        include: { category: true, shop: true },
      });
    }

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

  // Validate product ID
  if (!productId) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    // Delete the product
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
    const { id, title, description, shopId, categoryId, itemId, image } = body;

    // Validate required fields
    if (!id || !title || !shopId || !categoryId) {
      return NextResponse.json(
        {
          error: "Product ID, title, shop ID, and category ID are required",
        },
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

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        shopId,
        categoryId,
        itemId,
        image, // Include itemId
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
