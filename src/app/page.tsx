"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConverterSearch } from "@/components/converter/ConverterSearch";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { CONVERTERS } from "@/config/converters";

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
    </div>
  );
}
