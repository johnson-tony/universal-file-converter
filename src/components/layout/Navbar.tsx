"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, FileText, ImageIcon, FileCode, Hammer, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CONVERTERS } from "@/config/converters";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { id: "documents", name: "Documents", icon: FileText },
  { id: "images", name: "Images", icon: ImageIcon },
  { id: "data", name: "Data", icon: FileCode },
  { id: "tools", name: "Tools", icon: Hammer },
];

export function Navbar() {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
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
                  className="absolute top-full left-1/2 -translate-x-1/2 w-[700px] bg-card border rounded-[2rem] shadow-2xl overflow-hidden p-8 backdrop-blur-xl bg-card/95"
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

        {/* Auth Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/admin/login" className="text-sm font-semibold hover:text-primary px-4 transition-colors">Login</Link>
          <Button className="rounded-full h-11 px-8 font-bold shadow-lg shadow-primary/20" asChild>
            <Link href="/category/documents">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 hover:bg-muted rounded-xl transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-20 bg-background z-40 lg:hidden p-6 overflow-y-auto"
          >
            <div className="flex flex-col gap-8">
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">Converter Tools</h3>
                <div className="grid grid-cols-1 gap-2">
                  {CATEGORIES.map((cat) => (
                    <Link 
                      key={cat.id} 
                      href={`/category/${cat.id}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 p-4 hover:bg-primary/5 rounded-2xl transition-all"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <cat.icon className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-lg">{cat.name} Tools</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t pt-8">
                <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold px-4 hover:text-primary">Pricing</Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold px-4 hover:text-primary">About</Link>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold px-4 hover:text-primary">Contact</Link>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button variant="outline" className="rounded-2xl h-14 font-bold" asChild>
                  <Link href="/admin/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                </Button>
                <Button className="rounded-2xl h-14 font-bold" asChild>
                  <Link href="/category/documents" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
