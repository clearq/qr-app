// pages/api/sendEmail.ts
import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

// Configure the Nodemailer transporter with Gmail SMTP settings
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, firstName } = req.body;

    const mailOptions = {
      from: `"QrGen" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Welcome to Our App!",
      html: `
        <p>Dear ${firstName},</p>
        <p>Thank you for registering! Here are your login details:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>We’re glad to have you on board.</p>
        <p>Best Regards,<br>Your App Team</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
