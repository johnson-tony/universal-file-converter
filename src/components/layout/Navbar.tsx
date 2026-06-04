"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, FileText, ImageIcon, FileCode, Hammer, Menu, X, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CONVERTERS } from "@/config/converters";
import { cn } from "@/utils/cn";
import { usePathname, useRouter } from "next/navigation";

const CATEGORIES = [
  { id: "documents", name: "Documents", icon: FileText },
  { id: "images", name: "Images", icon: ImageIcon },
  { id: "data", name: "Data", icon: FileCode },
  { id: "tools", name: "Tools", icon: Hammer },
];

export function Navbar() {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAdminDashboard = pathname?.startsWith("/admin/dashboard");

  const sectionSummaries: Record<string, string> = {
    documents: "Format, export, and share travel-ready documents with confidence.",
    images: "Optimize imagery for itineraries, offers, and destination galleries.",
    data: "Transform spreadsheets and data feeds into actionable insights.",
    tools: "Fast utility workflows for compression, merging, and smart file handling.",
  };

  const groupedSections = CATEGORIES.map((category) => ({
    ...category,
    items: CONVERTERS.filter((converter) => converter.category.toLowerCase() === category.name.toLowerCase()),
    summary: sectionSummaries[category.id] ?? "",
    route: `/category/${category.id}`,
  }));

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    documents: true,
    images: false,
    data: false,
    tools: false,
  });

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const isActiveRoute = (href: string) => {
    if (!pathname) {
      return false;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isAdminDashboard) {
    return (
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-[100] transition-all duration-300">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-sm" />
            <span className="font-extrabold text-2xl tracking-tighter">
              <span className="text-[#1F2937]">File</span>
              <span className="text-[#2D6A6A]">Forge</span>
              <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-[10px] uppercase tracking-widest rounded-md border border-primary/20">Admin</span>
            </span>
          </Link>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all border border-red-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-[100] transition-all duration-300">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-sm" />
            <span className="font-extrabold text-2xl tracking-tighter">
              <span className="text-[#1F2937]">File</span>
              <span className="text-[#2D6A6A]">Forge</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {/* Tools Mega Menu Trigger */}
            <div 
              className="relative h-20 flex items-center"
              onMouseEnter={() => setIsToolsOpen(true)}
              onMouseLeave={() => setIsToolsOpen(false)}
            >
              <button className="flex items-center gap-1.5 text-sm font-semibold hover:text-primary transition-colors py-2 group cursor-pointer">
                Tools
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isToolsOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Mega Menu Dropdown */}
              <AnimatePresence>
                {isToolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[700px] bg-card border rounded-[2rem] shadow-2xl overflow-hidden p-8 backdrop-blur-xl bg-card/95 z-[110]"
                  >
                    <div className="grid grid-cols-4 gap-8">
                      {CATEGORIES.map((cat) => (
                        <div key={cat.id} className="space-y-4">
                          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest border-b border-primary/10 pb-2">
                            <cat.icon className="h-4 w-4" />
                            {cat.name}
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {CONVERTERS.filter(c => c.category.toLowerCase() === cat.id.toLowerCase())
                              .map(conv => (
                                <Link 
                                  key={conv.id} 
                                  href={`/converter/${conv.id}`}
                                  className="text-[13px] font-medium text-muted-foreground hover:text-primary hover:translate-x-1 transition-all flex items-center gap-2"
                                >
                                  <span className="h-1 w-1 bg-muted rounded-full" />
                                  {conv.title.replace(`${cat.name} to `, "").replace(`${cat.name} `, "")}
                                </Link>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/pricing" className="text-sm font-semibold hover:text-primary transition-colors">Pricing</Link>
            <Link href="/about" className="text-sm font-semibold hover:text-primary transition-colors">About</Link>
            <Link href="/contact" className="text-sm font-semibold hover:text-primary transition-colors">Contact</Link>
          </div>

          {/* User Icon */}
          <div className="hidden lg:flex items-center">
            <Link href="/admin/login" className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-primary">
              <User className="h-6 w-6" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link href="/admin/login" className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-primary">
              <User className="h-6 w-6" />
            </Link>
            <button 
              className="p-2 hover:bg-muted rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar - Moved Outside <nav> to fix Stacking Context */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="relative z-[9999]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-md lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed inset-y-0 right-0 w-full max-w-full sm:max-w-md overflow-y-auto bg-primary shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
                <div className="space-y-1">
                  <h2 className="text-md font-extrabold text-white tracking-tight">FileForge Tools</h2>
                </div>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 px-6 py-6">
                <div className="space-y-4">
                  {groupedSections.map((section) => (
                    <div key={section.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm shadow-sm">
                      <button
                        type="button"
                        onClick={() => toggleSection(section.id)}
                        aria-expanded={openSections[section.id]}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
                            <section.icon className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-sm font-bold text-white">{section.name}</p>
                            <p className="mt-0.5 text-[10px] font-medium text-white/60 uppercase tracking-wider">{section.items.length} converters</p>
                          </div>
                        </div>
                        <ChevronDown className={cn("h-4 w-4 text-white/40 transition-transform duration-300", openSections[section.id] ? "rotate-180" : "")} />
                      </button>

                      <AnimatePresence initial={false}>
                        {openSections[section.id] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-white/5 bg-white/5"
                          >
                            <div className="grid grid-cols-1 gap-1 p-3">
                              {section.items.map((item) => {
                                const href = `/converter/${item.id}`;
                                const active = isActiveRoute(href);
                                return (
                                  <Link
                                    key={item.id}
                                    href={href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                      "flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] transition-all",
                                      active
                                        ? "bg-white text-primary font-bold shadow-md"
                                        : "text-white/70 hover:bg-white/10 hover:text-white"
                                    )}
                                  >
                                    <div className={cn("w-1.5 h-1.5 rounded-full", active ? "bg-primary" : "bg-white/30")} />
                                    {item.title}
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Mobile Bottom Links */}
                <div className="grid grid-cols-1 gap-2 pt-4 border-t border-white/10">
                  <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-sm font-bold text-white/80 hover:text-white transition-colors">Pricing</Link>
                  <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-sm font-bold text-white/80 hover:text-white transition-colors">About</Link>
                  <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-sm font-bold text-white/80 hover:text-white transition-colors">Contact</Link>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
