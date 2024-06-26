import { removeVcard } from "@/actions/vcard";
import { vCodeById } from "@/data/vcard";
import { NextRequest, NextResponse } from "next/server";

type Params = {
    id : string;
}

export async function GET(req: NextRequest, context: { params: Params }) {
   const id = context.params.id;

   if (!id) {
    return NextResponse.json({error : "ID is required!"}, {status: 400})
   }


   const vCardData = await vCodeById(id);

   if (!vCardData) {
    return NextResponse.json({error : "Not found!"}, {status: 404})
   }

   return NextResponse.json(vCardData, {status: 200})
}
export async function DELETE(req: NextRequest, context: { params: Params }) {
   const id = context.params.id;

   if (!id) {
    return NextResponse.json("ID is required!", {status: 400})
   }


   const removedData = await removeVcard(id);

   if (!removedData) {
    return NextResponse.json("Cannot removed the qrcode!", {status: 400})
   }

   return NextResponse.json("Removed was successfully!", {status: 200})
}
