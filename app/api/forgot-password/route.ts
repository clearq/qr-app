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
    const user = await prisma.customer.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Email not found." }, { status: 404 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiration time (30 seconds from now)
    const resetPasswordTokenExpires = new Date(Date.now() + 30 * 1000); // 30 seconds

    // Save the OTP and its expiration time in the database
    await prisma.customer.update({
      where: { email },
      data: {
        resetPasswordToken: otp,
        resetPasswordTokenExpires,
      },
    });

    // Email content
    const logoUrl = `${process.env.NEXT_PUBLIC_APP_URL}/image/qrLogo.png`;
    const resetPasswordUrl = `${
      process.env.NEXT_PUBLIC_PASSWORD_URL
    }/reset-password?email=${encodeURIComponent(email)}`;

    const mailOptions = {
      from: `"QrGen" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px;">
          <p style="font-size: 18px; color: #333;">Dear ${user.firstName},</p>
          <p style="font-size: 16px; color: #555;">We received a request to reset your password. Here is your OTP:</p>
          <p style="font-size: 16px; color: #555;"><strong>OTP:</strong> ${otp}</p>
          <p style="font-size: 16px; color: #555;">This OTP will expire in <strong>30 seconds</strong>.</p>
          <p style="font-size: 16px; color: #555;">Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetPasswordUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 16px; color: #555;">If you did not request this, please ignore this email.</p>
          <p style="font-size: 16px; color: #555;">Best Regards,<br>QrGen</p>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${logoUrl}" alt="QrGen Logo" style="width: 50px; height: auto;" />
          </div>
          <footer style="margin-top: 20px; font-size: 12px; color: #999; text-align: center;">
            &copy; ${new Date().getFullYear()} QrGen. All rights reserved.
          </footer>
        </div>
      `,
    };

    // Send the OTP via email using Nodemailer
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to send OTP." }, { status: 500 });
  }
}
