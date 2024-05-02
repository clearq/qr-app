import { createQrCode } from "@/actions/qr";
import { auth } from "@/auth";
import { getAllQrData } from "@/data/qr";
import { NextResponse } from "next/server";


export async function GET() {
    const qrData = await getAllQrData();

    if (!qrData) {
        return NextResponse.json("Qr data not found!", {status: 400});
    }

    return NextResponse.json(qrData, {status: 200})
}

export async function POST(req: Request) {
    const user = await auth();
    try {
      if (!user?.user) {
        return NextResponse.json({error : "You need to login in"}, {status: 400})
      }
  
      const {id} = user.user
      const body = await req.json()
  
      const createQr = await createQrCode(body, id);

      if (!createQr) {
        return NextResponse.json("Cannot create qrCode", {status: 400})
      }
  
      return NextResponse.json(
        {
          success : "created qr successfully"
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