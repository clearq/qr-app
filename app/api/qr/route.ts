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
  // Check user authentication
  const user = await auth();
  console.log("User:", user);

  if (!user || !user.user) {
    console.log("User not authenticated");
    return NextResponse.json(
      { error: "You need to login" },
      { status: 401 } 
    );
  }

  // Extract user ID
  const { id } = user.user;
  console.log("User ID:", id); // Log the user ID

  if (!id) {
    console.log("User ID not found");
    return NextResponse.json("You need to login!", { status: 401 });
  }

  try {
    // Parse request body
    const body = await req.json();
    console.log("Request body:", body);

    // Create QR code
    const createQr = await createQrCode(body, id);
    console.log("QR code creation response:", createQr);

    // Check if QR code creation was successful
    if (!createQr) {
      console.log("Failed to create QR code");
      return NextResponse.json("Cannot create QR code", { status: 400 });
    }

    // Return success response
    return NextResponse.json(
      { success: "Created QR successfully" },
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

    if (!id || !url || !tag || !logoType) {
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
