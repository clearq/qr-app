import { auth } from "@/auth";
import { getAllVData } from "@/data/vcard";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET() {
  const user = await auth();
  if (!user?.user) {
    return NextResponse.json({error : "You need to login in"}, {status: 400})
  }

  const {id} = user.user
    const vData = await getAllVData(id);
  
    if ( !vData) {
        return NextResponse.json("Qr data not found!", {status: 400});
    }

    return NextResponse.json(vData, {status: 200})
}


export async function POST(req: Request) {
  const user = await auth();
  
  if (!user?.user) {
    return NextResponse.json(
      { error: "You need to login in" },
      { status: 400 }
    );
  }

  const { id } = user.user;
  const body = await req.json();

  

 const createdVcard =  await prisma.vCard.create({
    data: {
      ...body,
      customerId: id,
    },
  });

  if (!createdVcard) {
    return NextResponse.json({error: "Cannot create vcard"},{status: 400})
  }

  return NextResponse.json(
    {
      success: "created vCard successfully",
    },
    { status: 201 }
  );
}
