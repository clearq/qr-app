import { prisma } from "@/lib/db";

// Get shop by ID
export const getShopById = async (id: string) => {
  try {
    if (!id) {
      return { error: "Shop ID is required!" };
    }

    const shopData = await prisma.shop.findUnique({
      where: { id },
    });

    if (!shopData) {
      return { error: "Shop not found!" };
    }

    return shopData;
  } catch (error) {
    console.error("Error fetching shop data:", error);
    return { error: "Error fetching shop data." };
  }
};

// Get all shops for a user
export const getAllShopsByUserId = async (userId: string) => {
  try {
    if (!userId) {
      return { error: "User ID is required!" };
    }

    const shops = await prisma.shop.findMany({
      where: {
        id: userId,
      },
    });

    if (shops.length === 0) {
      return { message: "No shops found for this user." };
    }

    return shops;
  } catch (error) {
    console.error("Error fetching shops data:", error);
    return { error: "Error fetching shops data." };
  }
};

// Remove shop by ID
export const removeShop = async (id: string) => {
  try {
    if (!id) {
      return { error: "Shop ID is required!" };
    }

    await prisma.shop.delete({
      where: { id },
    });

    return { message: "Shop removed successfully." };
  } catch (error) {
    console.error("Error removing shop:", error);
    return { error: "Error removing shop." };
  }
};
