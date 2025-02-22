import { removeVcard } from "@/actions/vcard";
import { ticketCodeById } from "@/data/ticket";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  id: string;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ error: "ID is required!" }, { status: 400 });
  }

  try {
    const ticketData = await ticketCodeById(id);
    if (!ticketData) {
      return NextResponse.json({ error: "Not found!" }, { status: 404 });
    }

    return NextResponse.json(ticketData, { status: 200 });
  } catch (error) {
    console.error("Error fetching vCard data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: { params: Params }) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ error: "ID is required!" }, { status: 400 });
  }

  try {
    const removedData = await removeVcard(id);

    if (!removedData) {
      return NextResponse.json(
        { error: "Cannot remove the vCard!" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Removed successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing vCard data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
