"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConverterSearch } from "@/components/converter/ConverterSearch";
import { ArrowRight, Zap, Shield, Cloud, Smartphone, UploadCloud, RefreshCw, Download, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Carousel } from "@/components/ui/Carousel";
import { CONVERTERS } from "@/config/converters";

const HOW_IT_WORKS = [
  { icon: UploadCloud, title: "1. Upload", description: "Select or drag & drop your file into the upload area." },
  { icon: RefreshCw, title: "2. Convert", description: "Choose your target format and let our servers do the heavy lifting." },
  { icon: Download, title: "3. Download", description: "Get your converted file instantly. Files are deleted after 24 hours." },
];

const FEATURES = [
  { icon: Zap, title: "Fast Conversion", description: "Lightning-fast processing powered by edge computing." },
  { icon: Shield, title: "Secure Processing", description: "Files are processed in memory and deleted immediately." },
  { icon: Cloud, title: "Cloud Storage", description: "Temporary secure download links generated instantly." },
  { icon: Download, title: "Instant Download", description: "No waiting queues. Download as soon as it's ready." },
  { icon: Smartphone, title: "Mobile Friendly", description: "Convert files on the go from any device." },
];

// Get popular converters
const POPULAR_CONVERTERS = CONVERTERS.filter(c => 
  ["excel-to-json", "json-to-excel", "json-to-pdf", "pdf-to-docx", "docx-to-pdf", "svg-to-png", "heic-to-jpg"].includes(c.id)
);

// Group all converters by category
const CATEGORIES = ["Data", "Documents", "Images", "Tools"] as const;

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
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="h-12 px-8" asChild>
              <Link href="/converter/excel-to-json">
                Start Converting <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8" asChild>
              <Link href="#popular">View All Formats</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Search Section */}
      <ConverterSearch />

      {/* How it Works */}
      <Carousel id="how-it-works" title="How It Works" description="Convert your files in three simple steps">
        {HOW_IT_WORKS.map((step, i) => (
          <div key={i} className="flex-none w-[280px] md:w-full snap-center flex flex-col items-center text-center p-8 space-y-4 bg-card border rounded-2xl shadow-sm">
            <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <step.icon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">{step.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
          </div>
        ))}
      </Carousel>

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

      {/* Category Wise Sections */}
      {CATEGORIES.map((category) => (
        <Carousel 
          key={category} 
          title={`${category} Converters`} 
          description={`High-quality ${category.toLowerCase()} transformation tools.`}
        >
          {CONVERTERS.filter(c => c.category === category).map((converter) => (
            <Link key={converter.id} href={`/converter/${converter.id}`} className="flex-none w-[280px] md:w-full snap-center">
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                    <converter.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg">{converter.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2">{converter.description}</p>
              </motion.div>
            </Link>
          ))}
        </Carousel>
      ))}

      {/* Features */}
      <Carousel id="features" title="Enterprise-Grade Features" description="Built for speed, reliability, and scale.">
        {FEATURES.map((feature, i) => (
          <div key={i} className="flex-none w-[280px] md:w-full snap-center flex gap-4 p-6 bg-card border rounded-2xl shadow-sm">
            <div className="flex-shrink-0 mt-1">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <feature.icon className="h-5 w-5" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
