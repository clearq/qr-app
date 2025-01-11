import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST: Create a Category
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { categories, shopId } = body;

    if (!shopId || !categories || categories.length === 0) {
      return NextResponse.json(
        { error: "Shop ID and categories are required" },
        { status: 400 }
      );
    }

    const createdCategories = await prisma.category.createMany({
      data: categories.map((category: { name: any }) => ({
        name: category.name,
        shopId,
      })),
    });

    return NextResponse.json(createdCategories, { status: 201 });
  } catch (error) {
    console.error("Error creating categories:", error);
    return NextResponse.json(
      { error: "Failed to create categories" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shopId = searchParams.get("shopId");

  if (!shopId) {
    return NextResponse.json({ error: "Shop ID is required" }, { status: 400 });
  }

  try {
    const categories = await prisma.category.findMany({
      where: { shopId },
      include: {
        _count: {
          select: {
            products: true, // Count related products
          },
        },
      },
    });

    // Map the result to include `productsCount`
    const categoriesWithCount = categories.map((category) => ({
      id: category.id,
      name: category.name,
      productsCount: category._count.products,
    }));

    return NextResponse.json(categoriesWithCount, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a Category by ID
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("id");

  if (!categoryId) {
    return NextResponse.json(
      { error: "Category ID is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
