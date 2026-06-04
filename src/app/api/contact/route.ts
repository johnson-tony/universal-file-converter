import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import connectToDatabase from "@/lib/mongodb";
import { Contact } from "@/models/Contact";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // Default subject if not provided
    const subject = `New Inquiry from ${name}`;

    // Save to Database
    await connectToDatabase();
    await Contact.create({
      name,
      email,
      subject,
      message,
      status: "pending",
    });

    // Send notification email to Admin
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER, // Must be the authenticated user
        to: "tonyjanson121@gmail.com",
        replyTo: email,
        subject: `[Contact Form] ${subject}`,
        text: `
        Name: ${name}
        Email: ${email}
        
        Message:
        ${message}
      `,
        html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4F46E5;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
      };

      await transporter.sendMail(mailOptions);

      // Send automated "Thank You" email to User
      const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Thank you for reaching out to FileForge",
        text: `
Hello ${name},

Thank you for contacting FileForge! We've received your message and our team will review it shortly.

You can expect a response from us within 24 hours.

Best regards,
The FileForge Team
        `,
        html: `
          <div style="font-family: sans-serif; padding: 40px; color: #333; background-color: #f9fafb; border-radius: 20px;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 16px; shadow: 0 4px 6px rgba(0,0,0,0.05);">
              <h2 style="color: #4F46E5; margin-top: 0;">Thanks for reaching out!</h2>
              <p>Hello <strong>${name}</strong>,</p>
              <p>We've received your message and it's currently being forged into a response by our team.</p>
              <p>We usually get back to our users within <strong>24 hours</strong>.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 14px; color: #666;">This is an automated confirmation. No need to reply to this email.</p>
              <p style="margin-top: 20px;">Best regards,<br /><strong>The FileForge Team</strong></p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(userMailOptions);
    }

    return NextResponse.json({ message: "Message received successfully" });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}
