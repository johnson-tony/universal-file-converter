"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Activity, Server, Database, Globe } from "lucide-react";

const SYSTEMS = [
  { name: "Conversion Engine", status: "Operational", icon: Activity, uptime: "99.99%" },
  { name: "API Gateway", status: "Operational", icon: Server, uptime: "99.95%" },
  { name: "Database Cluster", status: "Operational", icon: Database, uptime: "100%" },
  { name: "Global Edge Network", status: "Operational", icon: Globe, uptime: "99.98%" },
];

export default function StatusPage() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-4 px-4 bg-background text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-bold text-sm uppercase tracking-wider animate-pulse">
            <CheckCircle2 className="h-4 w-4" />
            All Systems Operational
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            System Status
          </h1>
          <p className="text-xl text-muted-foreground">
            Real-time status updates for all Universal File Converter services.
          </p>
        </motion.div>
      </section>

      {/* Status Grid */}
      <section className="w-full py-4 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid gap-6">
            {SYSTEMS.map((system, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-6 bg-card border rounded-3xl shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/5 rounded-2xl text-primary">
                    <system.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{system.name}</h3>
                    <p className="text-sm text-muted-foreground">Uptime: {system.uptime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-sm font-bold border border-emerald-100">
                  <span className="h-2 w-2 bg-emerald-600 rounded-full"></span>
                  {system.status}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Past Incidents */}
          <div className="mt-20 space-y-8">
            <h2 className="text-2xl font-bold border-b pb-4">Incident History</h2>
            <div className="space-y-6">
              <div className="relative pl-8 border-l-2 border-muted py-2">
                <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 bg-muted-foreground rounded-full border-4 border-background"></div>
                <h4 className="font-bold text-lg">June 1, 2026</h4>
                <p className="text-muted-foreground mt-1">No incidents reported.</p>
              </div>
              <div className="relative pl-8 border-l-2 border-muted py-2">
                <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 bg-muted-foreground rounded-full border-4 border-background"></div>
                <h4 className="font-bold text-lg">May 31, 2026</h4>
                <p className="text-muted-foreground mt-1">No incidents reported.</p>
              </div>
              <div className="relative pl-8 border-l-2 border-muted py-2">
                <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 bg-muted-foreground rounded-full border-4 border-background"></div>
                <h4 className="font-bold text-lg text-amber-600">May 30, 2026 - Scheduled Maintenance</h4>
                <p className="text-muted-foreground mt-1">Completed routine database maintenance. Services were partially unavailable for 5 minutes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
