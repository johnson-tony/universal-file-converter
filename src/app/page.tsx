"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConverterSearch } from "@/components/converter/ConverterSearch";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { CONVERTERS } from "@/config/converters";

import { HeroAnimation } from "@/components/ui/HeroAnimation";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 px-4 bg-gradient-to-b from-primary/10 via-background to-background overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-center lg:text-left"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
              ✨ Free & Secure File Conversion
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Forge Your Files <br />
              <span className="text-primary">Into Any Format</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Fast, secure, and hassle-free file conversion for everyone. 
              PDFs, Images, Data, and more — processed instantly in your browser.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Button size="lg" className="rounded-full px-8 gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
              <Link href="/faq">
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  How it works
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <HeroAnimation />
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="w-full max-w-4xl px-4 -mt-12 mb-12 relative z-20">
        <div className="p-1 bg-gradient-to-r from-primary/50 via-primary/20 to-primary/50 rounded-2xl shadow-2xl">
          <div className="bg-background rounded-[14px] overflow-hidden">
             <ConverterSearch />
          </div>
        </div>
      </section>
    </div>
  );
}
