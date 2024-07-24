import { createQrCode } from "@/actions/qr";
import { auth } from "@/auth";
import { getAllQrData } from "@/data/qr";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await auth();
  if (!user?.user) {
    return NextResponse.json(
      { error: "You need to login in" },
      { status: 400 }
    );
  }



  const { id } = user.user;
  const qrData = await getAllQrData(id);
  
  if (!qrData) {
    return NextResponse.json("Qr data not found!", { status: 400 });
  }

  
  return NextResponse.json(qrData, { status: 200 });
}

export async function POST(req: Request) {
  const user = await auth();

  if (!user?.user) {
    return NextResponse.json(
      { error: "You need to login" },
      { status: 400 } 
    );
  }

  const { id } = user.user;

  if (!id) {
    return NextResponse.json("You need to login!", { status: 401 });
  }

  try {
    // Parse request body
    const body = await req.json();

    // Create QR code
    const createQr = await createQrCode(body, id);

    if (!createQr) {
      return NextResponse.json("Cannot create QR code", { status: 400 });
    }

    // Return success response with QR code ID
    return NextResponse.json(
      { success: "Created QR successfully", qrId: createQr },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating QR code:", error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  const user = await auth();

  if (!user?.user) {
    return NextResponse.json({ error: "You need to login" }, { status: 401 });
  }

  try {
    const { id, url, tag, logoType } = await req.json();

    if (!id || !url || !tag) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 403 }
      );
    }

    const updatedQr = await prisma.qr.update({
      where: { id },
      data: { url, tag, logoType },
    });

    return NextResponse.json(updatedQr, { status: 201 });
  } catch (error) {
    console.error("Error updating QR code:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}