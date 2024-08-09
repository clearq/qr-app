import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/db"

interface Params {
    id : string;
    type : "0" | "1"
}

export async function GET(req: NextRequest, context: { params: Params }) {
    const id = context.params.id;
    const type = context.params.type;
  try {
 
    if (!id) {
     return NextResponse.json({error : "ID is required!"}, {status: 400})
    }

    if (!type) {
        return NextResponse.json({error : "Type is required!"}, {status: 400})
    }
              const data = await prisma.scan.findMany({
                where: { profileId: id , type: Number(type)},
              });
         
              if (!data) {
        
                return NextResponse.json({ error: "Data not found" }, { status: 404 });
        
              }
                return NextResponse.json(data.length, { status: 200 });
              
  } catch (error) {
    console.log("[GET BY ID & TYPE] , Error");

    return NextResponse.json({error: "Server Error"}, { status: 500 });
  }
 }