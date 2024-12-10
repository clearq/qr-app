import { prisma } from "@/lib/db";

// Get category by ID
export const getCategoryById = async (id: string) => {
  try {
    if (!id) {
      return { error: "Category ID is required!" };
    }

    const categoryData = await prisma.category.findUnique({
      where: { id },
    });

    if (!categoryData) {
      return { error: "Category not found!" };
    }

    return categoryData;
  } catch (error) {
    console.error("Error fetching category data:", error);
    return { error: "Error fetching category data." };
  }
};

// Get all categories for a shop
export const getAllCategoriesByShopId = async (shopId: string) => {
  try {
    if (!shopId) {
      return { error: "Shop ID is required!" };
    }

    const categories = await prisma.category.findMany({
      where: {
        shopId,
      },
    });

    if (categories.length === 0) {
      return { message: "No categories found for this shop." };
    }

    return categories;
  } catch (error) {
    console.error("Error fetching categories data:", error);
    return { error: "Error fetching categories data." };
  }
};

// Remove category by ID
export const removeCategory = async (id: string) => {
  try {
    if (!id) {
      return { error: "Category ID is required!" };
    }

    await prisma.category.delete({
      where: { id },
    });

    return { message: "Category removed successfully." };
  } catch (error) {
    console.error("Error removing category:", error);
    return { error: "Error removing category." };
  }
};
