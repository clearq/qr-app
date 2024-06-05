import { removeQrCode } from "@/actions/qr";
import { NextRequest, NextResponse } from "next/server";

type Params = {
    id : string;
}

export async function DELETE(req: NextRequest, context: { params: Params }) {
   const id = context.params.id;

   if (!id) {
    return NextResponse.json("ID is required!", {status: 400})
   }


   const removedData = await removeQrCode(id);

   if (!removedData) {
    return NextResponse.json("Cannot removed the qrcode!", {status: 400})
   }

   return NextResponse.json("Removed was successfully!", {status: 200})
}
