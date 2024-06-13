"use server"
import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";



export const createCustomer = async (values : {
    email : string;
    password : string;
    firstName : string;
    lastName : string
}) => {
    try {
        const { email, firstName, lastName, password } = values;

    
        if (!email || !firstName || !lastName || !password) {
          return {message : "Fields are required"}
        }
    
        const existingUserByEmail = await prisma.customer.findUnique({
          where: { email},
        });
        if (existingUserByEmail) {

            return {
              customer: null,
              message: "User with this email already exists!",
            }
        }
    
        const hashedPassword = await hash(password, 10);
        const newUser = await prisma.customer.create({
          data: {
            email,
            firstName,
            lastName,
            password: hashedPassword,
            // Include other fields like phone and image if applicable
          },
        });
        const { password: newUserPassword, ...rest } = newUser;
    
        return {
            customer: rest,
            message: "User created successfully!",
        }
        
      } catch (error) {
        console.error("Error during registration:", error);
        return {
            message : "Server error"
        }
        
      }
}

export const removeCustomer = async (id : string) => {
  try {
      if (!id) {
          return {
              error : "Id is required!"
          }
      }

      await prisma.customer.delete({
          where: {id}
      })

      return "Removed qrcode successfully"
  } catch {
      return null;
  }
}