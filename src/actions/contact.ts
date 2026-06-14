"use server";

import nodemailer from "nodemailer";
import { z } from "zod";

const ContactFormSchema = z.object({
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

export type ContactFormValues = z.infer<typeof ContactFormSchema>;

export async function sendContactAction(values: ContactFormValues) {
  try {
    const validated = await ContactFormSchema.parseAsync(values);

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      console.error("Missing SMTP env vars");
      return { success: false, message: "Server email configuration missing." };
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
        <p><strong>Name:</strong> ${validated.firstName} ${validated.lastName}</p>
        <p><strong>Email:</strong> ${validated.email}</p>
        <p><strong>Phone:</strong> ${validated.phone ?? ""}</p>
        <p><strong>City/Location:</strong> ${validated.city ?? ""}</p>
        <p><strong>Message:</strong></p>
        <p>${validated.message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: "The message has been sent!" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Could not send the message." };
  }
}