import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

export const runtime = "nodejs"; // ensure Node runtime for nodemailer

const FormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.union([z.string().max(50), z.literal("")]).optional(),
  city: z.union([z.string().max(100), z.literal("")]).optional(),
  message: z
    .string()
    .min(1, "Message is required")
    .max(2000, "Max 2000 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const values = await FormSchema.parseAsync(body);

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      console.error("Missing SMTP env vars");
      return NextResponse.json(
        { message: "Server email configuration missing." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const mailOptions = {
      from: SMTP_USER,
      to: SMTP_USER,
      subject: "New message from the website contact form",
      html: `
        <h2>Contact Inquiry</h2>
        <p><strong>Name:</strong> ${values.firstName} ${values.lastName}</p>
        <p><strong>Email:</strong> ${values.email}</p>
        <p><strong>Phone:</strong> ${values.phone ?? ""}</p>
        <p><strong>City/Location:</strong> ${values.city ?? ""}</p>
        <p><strong>Message:</strong></p>
        <p>${values.message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "The message has been sent!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Could not send the message." },
      { status: 500 }
    );
  }
}
