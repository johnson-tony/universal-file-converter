import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import connectToDatabase from "@/lib/mongodb";
import { Contact } from "@/models/Contact";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) return false;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch (err) {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const isAuth = await verifyAuth();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contactId, replyMessage } = await req.json();

    if (!contactId || !replyMessage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();
    const contact = await Contact.findById(contactId);

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // Send email to the user
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: contact.email,
        subject: `Re: ${contact.subject}`,
        text: `
Hello ${contact.name},

${replyMessage}

---
In response to your message:
"${contact.message}"

Best regards,
FileForge Support Team
        `,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <p>Hello ${contact.name},</p>
            <p style="white-space: pre-wrap;">${replyMessage}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #666; font-size: 12px;">In response to your message:</p>
            <blockquote style="border-left: 4px solid #eee; padding-left: 15px; color: #666; font-style: italic;">
              ${contact.message}
            </blockquote>
            <p style="margin-top: 20px;">Best regards,<br /><strong>FileForge Support Team</strong></p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    // Update database status
    contact.status = "replied";
    contact.adminReply = replyMessage;
    contact.repliedAt = new Date();
    await contact.save();

    return NextResponse.json({ message: "Reply sent successfully" });
  } catch (error: any) {
    console.error("Admin Reply Error:", error);
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}
