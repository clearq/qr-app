import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await auth();
  try {
    if (!user?.user) {
      return NextResponse.json(
        { error: "You need to login in" },
        { status: 400 }
      );
    }

    const { id } = user.user;
    const body = await req.json();
    const {
      url,
      email,
      firstName,
      lastName,
      company,
      customer,
      facebook,
      image,
      linkedIn,
      logoType,
      phone,
    } = body;

    await prisma.vCard.create({
      data: {
        url,
        email,
        customerId: id,
        firstName,
        lastName,
        company,
        customer,
        facebook,
        image,
        linkedIn,
        logoType,
        phone,
      },
    });

    return NextResponse.json(
      {
        success: "created vCard successfully",
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
