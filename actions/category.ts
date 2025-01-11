import { prisma } from "@/lib/db";

// Create a new category for a shop
export async function createCategory(data: { name: string; shopId: string }) {
  return await prisma.category.create({
    data: {
      name: data.name,
      shopId: data.shopId,
    },
  });
}

// Fetch all categories for a shop
export async function fetchCategories(shopId: string) {
  return await prisma.category.findMany({
    where: { shopId },
    include: { products: true }, // Include related products
  });
}

// Delete a category by ID
export async function deleteCategory(categoryId: string) {
  return await prisma.category.delete({
    where: { id: categoryId },
  });
}
