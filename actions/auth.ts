"use server";
import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";

// Function to create a customer
export const createCustomer = async (values: any) => {
  try {
    const { email, firstName, lastName, password, company, orgNumber, roleId } = values;

    // Check required fields
    if (!email || !firstName || !lastName || !password || !roleId) {
      return { message: "Fields are required" };
    }

    // Check if the role is either 1 (account) or 2 (company)
    const validRoleIds = ["1", "2"];
    if (!validRoleIds.includes(roleId)) {
      return { message: "Invalid roleId. Must be either '1' or '2'" };
    }

    // Check for role 2 (company) specific fields
    if (roleId === "2" && (!company || !orgNumber)) {
      return { message: "Company name and organization number are required for role 2" };
    }

    // Check if user with the same email already exists
    const existingUserByEmail = await prisma.customer.findUnique({
      where: { email },
    });
    if (existingUserByEmail) {
      return {
        customer: null,
        message: "User with this email already exists!",
      };
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create new user
    const newUser = await prisma.customer.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        company: roleId === "2" ? company : null,
        orgNumber: roleId === "2" ? orgNumber : null,
        roleId,
      },
    });

    // Exclude password from the response
    const { password: newUserPassword, ...rest } = newUser;

    return {
      customer: rest,
      message: "User created successfully!",
    };
  } catch (error) {
    console.error("Error during registration:", error);
    return {
      message: "Server error",
    };
  }
};

// Function to remove a customer
export const removeCustomer = async (id: string) => {
  try {
    if (!id) {
      return {
        error: "Id is required!"
      };
    }

    await prisma.customer.delete({
      where: { id }
    });

    return "Removed customer successfully";
  } catch (error) {
    console.error("Error during customer removal:", error);
    return {
      message: "Server error",
    };
  }
};
