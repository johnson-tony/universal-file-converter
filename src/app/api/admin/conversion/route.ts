import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Conversion } from "@/models/Conversion";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) return false;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
    await jwtVerify(token, secret);
    return true;
  } catch (err) {
    return false;
  }
}

export async function DELETE(req: Request) {
  try {
    const isAuth = await verifyAuth();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing conversion ID" }, { status: 400 });
    }

    await connectToDatabase();
    const deletedConversion = await Conversion.findByIdAndDelete(id);

    if (!deletedConversion) {
      return NextResponse.json({ error: "Conversion record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Conversion record deleted successfully" });
  } catch (error: any) {
    console.error("Admin Conversion Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete conversion record" }, { status: 500 });
  }
}
