import { auth } from "@/auth";
import { userById } from "@/data/profile";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const user = await auth();
  if (!user?.user) {
    return NextResponse.json(
      { error: "You need to login in" },
      { status: 400 }
    );
  }

  const { id } = user.user;
  const userData = await userById(id);

  if (!userData) {
    return NextResponse.json("User data not found!", { status: 404 });
  }

  return NextResponse.json(userData, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const user = await auth();

  if (!user?.user) {
    return NextResponse.json(
      { error: "You need to login in" },
      { status: 400 }
    );
  }
  const { id } = user.user;

  try {
    const { email, firstName, lastName, phone, company, image } =
      await req.json();

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.customer.update({
      where: { id },
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        company: company,
        image: image,
      },
    });

    return NextResponse.json(updatedUser, { status: 201 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
