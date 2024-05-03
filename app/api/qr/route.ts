import { createQrCode } from "@/actions/qr";
import { auth } from "@/auth";
import { getAllQrData } from "@/data/qr";
import { NextResponse } from "next/server";


export async function GET() {
  const user = await auth();
  if (!user?.user) {
    return NextResponse.json({error : "You need to login in"}, {status: 400})
  }

  const {id} = user.user
    const qrData = await getAllQrData(id);

    if (!qrData) {
        return NextResponse.json("Qr data not found!", {status: 400});
    }

    return NextResponse.json(qrData, {status: 200})
}

export async function POST(req: Request) {
    const user = await auth();
    if (!user?.user) {
      return NextResponse.json({error : "You need to login in"}, {status: 400})
    }

    const {id} = user.user
    const body = await req.json();

    if (!id) {
      return NextResponse.json("You need to login!", {status: 401})
    }

    const createQr = await createQrCode(body, id);

    if (!createQr) {
      return NextResponse.json("Cannot create qrCode", {status: 400})
    }

    return NextResponse.json(
      {
        success : "Created qr successfully"
      },
      { status: 201 }
    );
  }