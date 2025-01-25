// app/api/reset-password/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { email, otp, newPassword } = await request.json();

  try {
    // Verify the OTP and its expiration
    const user = await prisma.customer.findUnique({
      where: { email },
    });

    if (
      !user ||
      user.resetPasswordToken !== otp ||
      !user.resetPasswordTokenExpires ||
      new Date() > new Date(user.resetPasswordTokenExpires)
    ) {
      return NextResponse.json(
        { error: "Invalid or expired OTP." },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the OTP fields
    await prisma.customer.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpires: null,
      },
    });

    return NextResponse.json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Failed to reset password." },
      { status: 500 }
    );
  }
}
