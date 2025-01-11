import { prisma } from "@/lib/db";

// Get product by ID
export const getProductById = async (id: string) => {
  try {
    if (!id) {
      return { error: "Product ID is required!" };
    }

    const productData = await prisma.product.findUnique({
      where: { id },
    });

    if (!productData) {
      return { error: "Product not found!" };
    }

    return productData;
  } catch (error) {
    console.error("Error fetching product data:", error);
    return { error: "Error fetching product data." };
  }
};

// Get all products for a category
export const getAllProductsByCategoryId = async (categoryId: string) => {
  try {
    if (!categoryId) {
      return { error: "Category ID is required!" };
    }

    const products = await prisma.product.findMany({
      where: {
        categoryId,
      },
    });

    if (products.length === 0) {
      return { message: "No products found for this category." };
    }

    return products;
  } catch (error) {
    console.error("Error fetching products data:", error);
    return { error: "Error fetching products data." };
  }
};

// Remove product by ID
export const removeProduct = async (id: string) => {
  try {
    if (!id) {
      return { error: "Product ID is required!" };
    }

    await prisma.product.delete({
      where: { id },
    });

    return { message: "Product removed successfully." };
  } catch (error) {
    console.error("Error removing product:", error);
    return { error: "Error removing product." };
  }
};
