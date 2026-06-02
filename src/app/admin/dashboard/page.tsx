import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Activity, Clock, FileCheck } from "lucide-react";
import connectToDatabase from "@/lib/mongodb";
import { Conversion } from "@/models/Conversion";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

export const revalidate = 60; // Revalidate every 60 seconds

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
  } catch (err) {
    redirect("/admin/login");
  }
}

async function getStats() {
  try {
    await connectToDatabase();
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

    return { total, successRate, avgTimeSec, popular, recent };
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return { total: 0, successRate: 0, avgTimeSec: "0", popular: [], recent: [] };
  }
}

export default async function AdminDashboardPage() {
  await checkAuth();
  const { total, successRate, avgTimeSec, popular, recent } = await getStats();

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">System-wide metrics and real-time conversion monitoring.</p>
        </div>
        <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
          Auto-refreshes every 60s
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 text-muted-foreground">
            <CardTitle className="text-sm font-medium uppercase tracking-wider">Total Orders</CardTitle>
            <BarChart className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{total.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 text-muted-foreground">
            <CardTitle className="text-sm font-medium uppercase tracking-wider">Success Rate</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{successRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 text-muted-foreground">
            <CardTitle className="text-sm font-medium uppercase tracking-wider">Latency</CardTitle>
            <Clock className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgTimeSec}s</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 text-muted-foreground">
            <CardTitle className="text-sm font-medium uppercase tracking-wider">Files Count</CardTitle>
            <FileCheck className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{total.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-sm border-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest conversion requests across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recent.length > 0 ? (
                recent.map((req, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate max-w-[200px] sm:max-w-xs">{req.originalFileName}</p>
                      <p className="text-xs text-muted-foreground font-mono">{req.conversionType}</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${req.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                          req.status === 'failed' ? 'bg-red-100 text-red-700' : 
                          'bg-blue-100 text-blue-700'}`}>
                        {req.status}
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                        {new Date(req.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-8 text-center">No recent activity detected.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-2">
          <CardHeader>
            <CardTitle>Usage Heatmap</CardTitle>
            <CardDescription>Most popular conversion types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {popular.length > 0 ? (
                popular.map((pop, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase truncate max-w-[150px]">{pop._id}</span>
                      <span className="text-xs font-medium text-muted-foreground">{pop.count} orders</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full" 
                        style={{ width: `${(pop.count / total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-8 text-center">No data available.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
