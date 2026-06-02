import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Activity, Clock, FileCheck } from "lucide-react";
import connectToDatabase from "@/lib/mongodb";
import { Conversion } from "@/models/Conversion";

export const revalidate = 60; // Revalidate every 60 seconds

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
      .limit(5)
      .select("originalFileName conversionType status createdAt");

    return { total, successRate, avgTimeSec, popular, recent };
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return { total: 0, successRate: 0, avgTimeSec: "0", popular: [], recent: [] };
  }
}

export default async function DashboardPage() {
  const { total, successRate, avgTimeSec, popular, recent } = await getStats();

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">System Dashboard</h1>
        <p className="text-muted-foreground">Read-only analytics and system metrics.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Conversions</CardTitle>
            <BarChart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
            <Activity className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTimeSec}s</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Files Processed</CardTitle>
            <FileCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest conversion requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recent.length > 0 ? (
                recent.map((req, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-sm truncate max-w-[200px] sm:max-w-xs">{req.originalFileName}</p>
                      <p className="text-xs text-muted-foreground">{req.conversionType}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${req.status === 'completed' ? 'bg-success/10 text-success' : 
                          req.status === 'failed' ? 'bg-destructive/10 text-destructive' : 
                          'bg-primary/10 text-primary'}`}>
                        {req.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(req.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Converters</CardTitle>
            <CardDescription>Most frequently used conversion types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popular.length > 0 ? (
                popular.map((pop, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{pop._id}</span>
                    <span className="text-sm text-muted-foreground">{pop.count} uses</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No data available.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
