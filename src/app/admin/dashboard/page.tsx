import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Activity, Clock, FileCheck, Mail, MessageCircle, Send, CheckCircle, Clock4 } from "lucide-react";
import connectToDatabase from "@/lib/mongodb";
import { Conversion } from "@/models/Conversion";
import { Contact } from "@/models/Contact";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { AdminDashboardClient } from "./DashboardClient";

export const revalidate = 0; // Disable caching for admin dashboard

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) redirect("/admin/login");

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
  } catch (err) {
    redirect("/admin/login");
  }
}

async function getData() {
  try {
    await connectToDatabase();
    
    // Stats
    const total = await Conversion.countDocuments();
    const completed = await Conversion.countDocuments({ status: "completed" });
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const stats = await Conversion.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, avgTime: { $avg: "$processingTime" } } }
    ]);
    const avgTimeMs = stats[0]?.avgTime || 0;
    const avgTimeSec = (avgTimeMs / 1000).toFixed(1);

    const popular = await Conversion.aggregate([
      { $group: { _id: "$conversionType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const recent = await Conversion.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("originalFileName conversionType status createdAt");

    // Contacts
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(50);

    const data = { 
      total, 
      successRate, 
      avgTimeSec, 
      popular, 
      recent, 
      contacts 
    };

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return { total: 0, successRate: 0, avgTimeSec: "0", popular: [], recent: [], contacts: [] };
  }
}

export default async function AdminDashboardPage() {
  await checkAuth();
  const data = await getData();

  return <AdminDashboardClient initialData={data} />;
}
