import { getImageUrl } from "@/actions/api";
import { removeCustomer } from "@/actions/auth";
import { auth } from "@/auth";
import { userById } from "@/data/profile";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  id: string;
};

export async function GET() {
  const user = await auth();
  if (!user?.user) {
    return NextResponse.json({ error: "You need to login" }, { status: 400 });
  }

  const { id } = user.user;

  const userData = await prisma.customer.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          qr: true,
          vcard: true,
          tickets: true,
          shop: true,
          events: true,
        },
      },
      role: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!userData) {
    return NextResponse.json("User data not found!", { status: 404 });
  }

  // Generate the full image URL if an image key exists
  if (userData.image) {
    const imageUrl = getImageUrl(userData.image, id, "profile");
    userData.image = imageUrl;
  }

  // Add roleId, customerId, and language to the response
  const responseData = {
    ...userData,
    roleId: userData.role?.id,
    customerId: userData.id,
    language: userData.language, // Include the `language` property
  };

  return NextResponse.json(responseData, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const user = await auth();

  if (!user?.user) {
    return NextResponse.json({ error: "You need to login" }, { status: 400 });
  }
  const { id } = user.user;

  try {
    const requestBody = await req.json();

    const {
      email,
      firstName,
      lastName,
      phone,
      company,
      image,
      orgNumber,
      address,
      country,
      city,
      zip,
      roleId,
      language, // Include the `language` property
    } = requestBody;

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Determine the roleId based on whether orgNumber is provided
    const newRoleId = orgNumber ? "2" : "1"; // Assuming "2" is the roleId for companies and "1" for individual accounts

    // Update the user profile with the image key, roleId, and language
    const updatedUser = await prisma.customer.update({
      where: { id },
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        company: company,
        image: image, // Store the image key
        orgNumber: orgNumber,
        address: address,
        country: country,
        city: city,
        zip: zip,
        roleId: newRoleId, // Update the roleId based on the presence of orgNumber
        language: language, // Update the `language` property
      },
    });

    return NextResponse.json(updatedUser, { status: 201 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
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
