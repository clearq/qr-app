import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAllVData } from "@/data/vcard";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (id) {
    const vCard = await prisma.vCard.findUnique({
      where: { id },
    });

    if (!vCard) {
      return NextResponse.json(
        { error: "Vcard data not found!" },
        { status: 400 }
      );
    }

    return NextResponse.json(vCard, { status: 200 });
  }

  const user = await auth();

  if (!user?.user) {
    return NextResponse.json(
      { error: "You need to log in" },
      { status: 400 }
    );
  }

  const { id: userId } = user.user;
  const vData = await getAllVData(userId);

  if (!vData) {
    return NextResponse.json("Vcard data not found!", { status: 400 });
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
      id: createdVcard.id,
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
      url,
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
        url,
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
