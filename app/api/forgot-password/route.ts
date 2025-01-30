// app/api/forgot-password/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import nodemailer from "nodemailer";

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    // Check if the email exists in the database
    const user = await prisma.customer.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Email not found." }, { status: 404 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiration time (2 minutes from now)
    const resetPasswordTokenExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    // Save OTP and expiration in the database
    await prisma.customer.update({
      where: { email },
      data: { resetPasswordToken: otp, resetPasswordTokenExpires },
    });

    // Email content
    const logoUrl = `${process.env.NEXT_PUBLIC_APP_URL}/image/QaafGold.png`;
    const resetPasswordUrl = `${
      process.env.NEXT_PUBLIC_PASSWORD_URL
    }/reset-password?email=${encodeURIComponent(email)}`;

    const mailOptions = {
      from: `"Qaaf Support" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "🔐 Reset Your Password - OTP Inside",
      html: `
        <div style="background-color: #252525; color: #D4AF37; font-family: Arial, sans-serif; padding: 30px; border-radius: 8px; text-align: center;">
          <img src="${logoUrl}" alt="Qaaf Logo" style="width: 80px; margin-bottom: 20px;" />
          <h2 style="color: #D4AF37; margin-bottom: 10px;">Password Reset Request</h2>
          <p style="font-size: 16px; color: #ffffff; margin-bottom: 20px;">
            Hello <strong>${user.firstName}</strong>,<br>
            We received a request to reset your password. Use the OTP below to proceed:
          </p>
          <div style="font-size: 24px; font-weight: bold; background-color: #D4AF37; color: #252525; padding: 10px 20px; display: inline-block; border-radius: 5px; margin-bottom: 20px;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #bbbbbb; margin-bottom: 10px;">
            This OTP is valid for <strong>2 minutes</strong>. Please do not share it with anyone.
          </p>
          <a href="${resetPasswordUrl}" style="background-color: #D4AF37; color: #252525; padding: 12px 24px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">
            Reset Password
          </a>
          <p style="font-size: 12px; color: #aaaaaa; margin-top: 30px;">
            If you did not request this, please ignore this email.<br>
            Need help? Contact our <a href="mailto:support@qaaf.com" style="color: #D4AF37; text-decoration: none;">Support Team</a>.
          </p>
          <footer style="font-size: 12px; color: #888888; margin-top: 20px;">
            &copy; ${new Date().getFullYear()} Qaaf. All rights reserved.
          </footer>
        </div>
      `,
    };

    // Send OTP via email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to send OTP." }, { status: 500 });
  }
}
