import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, firstName, lastName, phone, password, image } = body;

    const existingUserByEmail = await prisma.customer.findFirst({
      where: { email: email },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        {
          customer: null,
          message: "User by this email already exists!",
        },
        { status: 409 }
      );
    }

    const hasedPassword = await hash(password, 10);
    const newUser = await prisma.customer.create({
      data: {
        email,
        firstName,
        lastName,
        password: hasedPassword,
      },
    });
    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      {
        customer: rest,
        message: "User created successfuly!",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        
        message: "Somthing went wrong!",
      },
      { status: 500 }
    );
  }
}
