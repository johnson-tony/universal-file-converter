"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConverterSearch } from "@/components/converter/ConverterSearch";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Carousel } from "@/components/ui/Carousel";
import { CONVERTERS } from "@/config/converters";

// Get popular converters
const POPULAR_CONVERTERS = CONVERTERS.filter(c => 
  ["excel-to-json", "json-to-excel", "json-to-pdf", "pdf-to-docx", "docx-to-pdf", "svg-to-png", "heic-to-jpg"].includes(c.id)
).slice(0, 3);

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-4 px-4 bg-gradient-to-b from-primary/10 to-background text-center flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl space-y-6"
        >
          <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Universal File Conversion
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Fast, secure, and hassle-free file conversion for everyone. 
            No sign-up required.
          </p>
        </motion.div>
      </section>

      {/* Search Section */}
      <ConverterSearch />

      {/* Popular Converters */}
      <Carousel id="popular" title="Popular Converters" description="Our most frequently used conversion tools.">
        {POPULAR_CONVERTERS.map((converter) => (
          <Link key={converter.id} href={`/converter/${converter.id}`} className="flex-none w-[280px] md:w-full snap-center">
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <converter.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg">{converter.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm line-clamp-2">{converter.description}</p>
            </motion.div>
          </Link>
        ))}
      </Carousel>
    </div>
  );
}
