// app/api/sendEmail/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { email, firstName, password } = await request.json();

    const logoUrl = `${process.env.NEXT_PUBLIC_APP_URL}/image/qrLogo.png`;
    const mailOptions = {
      from: `"QrGen" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Welcome to Our App!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px;">
          <p style="font-size: 18px; color: #333;">Dear ${firstName},</p>
          <p style="font-size: 16px; color: #555;">Thank you for registering! Here are your login details:</p>
          <p style="font-size: 16px; color: #555;"><strong>Email:</strong> ${email}</p>
          <p style="font-size: 16px; color: #555;"><strong>Password:</strong> ${password}</p> <!-- Include password -->
          <p style="font-size: 16px; color: #555;">We’re glad to have you on board.</p>
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

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
