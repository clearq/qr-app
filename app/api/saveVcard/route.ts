import { createQrCode } from "@/actions/qr";
import { auth } from "@/auth";
import { getAllVData } from "@/data/vcard";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const user = await auth();
  if (!user?.user) {
    return NextResponse.json(
      { error: "You need to log in" },
      { status: 400 }
    );
  }

  const { id } = user.user;
  const vData = await getAllVData(id);

  if (!vData) {
    return NextResponse.json("Qr data not found!", { status: 400 });
  }

  return NextResponse.json(vData, { status: 200 });
}

export async function POST(req: Request) {
  const user = await auth();

  if (!user?.user) {
    return NextResponse.json(
      { error: "You need to log in" },
      { status: 400 }
    );
  }

  const { id } = user.user;
  const body = await req.json();

  const createdVcard = await prisma.vCard.create({
    data: {
      ...body,
      customerId: id,
    },
  });

  if (!createdVcard) {
    return NextResponse.json({ error: "Cannot create vCard" }, { status: 400 });
  }


  return NextResponse.json(
    {
      success: "Created vCard successfully",
      id: createdVcard.id, // Include the ID in the response
    },
    { status: 201 }
  );
}

export async function PUT(req: Request) {
  const user = await auth();

  if (!user?.user) {
    return NextResponse.json(
      { error: "You need to log in" },
      { status: 401 }
    );
  }

  try {
    const {
      id,
      customerEmail,
      firstName,
      lastName,
      phone,
      company,
      image,
      website,
      tag,
      title,
      linkedIn,
      x,
      facebook,
      instagram,
      tiktok,
      snapchat,
    } = await req.json();

    if (!id || !customerEmail || !firstName || !lastName || !tag) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 403 }
      );
    }


    // Update the record
    const updatedUser = await prisma.vCard.update({
      where: { id },
      data: {
        customerEmail,
        firstName,
        lastName,
        phone,
        company,
        image,
        url: website,
        tag,
        title,
        linkedIn,
        x,
        facebook,
        instagram,
        tiktok,
        snapchat,
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