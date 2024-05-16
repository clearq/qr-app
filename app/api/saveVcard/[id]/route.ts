
import { removeVcard } from "@/actions/vcard";
import { NextRequest, NextResponse } from "next/server";

type Params = {
    id : string;
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


export async function PUT (req: NextRequest, context: { params: Params }){
    const id = context.params.id;



}
