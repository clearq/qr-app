import { removeCustomer} from "@/actions/auth";
import { getUserById } from "@/data/auth";
import { userById } from "@/data/profile";
import { NextRequest, NextResponse } from "next/server";

type Params = {
    id: string;
}

export async function DELETE(req: NextRequest, context: { params: Params }) {
    const id = context.params.id;

    if (!id) {
        return NextResponse.json("ID is required!", { status: 400 });
    }

    const { email } = await req.json();

    if (!email) {
        return NextResponse.json("Email is required!", { status: 400 });
    }

  
    const user = await userById(id);

    if (!user) {
        return NextResponse.json("User not found!", { status: 404 });
    }


    if (user.email !== email) {
        return NextResponse.json("Email does not match!", { status: 400 });
    }

    const removedData = await removeCustomer(id);

    if (!removedData) {
        return NextResponse.json("Cannot remove the User!", { status: 400 });
    }

    return NextResponse.json("Removed successfully!", { status: 200 });
}
