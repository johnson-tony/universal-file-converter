"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConverterSearch } from "@/components/converter/ConverterSearch";
import { ArrowRight, FileText, Zap, Shield, Cloud, Smartphone, UploadCloud, RefreshCw, Download } from "lucide-react";
import { motion } from "framer-motion";

const POPULAR_CONVERTERS = [
  { id: "excel-to-json", title: "Excel to JSON", description: "Convert spreadsheet data to JSON format instantly." },
  { id: "json-to-excel", title: "JSON to Excel", description: "Generate Excel files from JSON arrays." },
  { id: "json-to-pdf", title: "JSON to PDF", description: "Create formatted PDF documents from JSON data." },
  { id: "pdf-to-docx", title: "PDF to DOCX", description: "Convert PDF files into editable Word documents." },
  { id: "docx-to-pdf", title: "DOCX to PDF", description: "Securely convert Word documents to PDF." },
  { id: "svg-to-png", title: "SVG to PNG", description: "Rasterize vector graphics to transparent PNGs." },
];

const FEATURES = [
  { icon: Zap, title: "Fast Conversion", description: "Lightning-fast processing powered by edge computing." },
  { icon: Shield, title: "Secure Processing", description: "Files are processed in memory and deleted immediately." },
  { icon: Cloud, title: "Cloud Storage", description: "Temporary secure download links generated instantly." },
  { icon: Download, title: "Instant Download", description: "No waiting queues. Download as soon as it's ready." },
  { icon: Smartphone, title: "Mobile Friendly", description: "Convert files on the go from any device." },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-16 px-4 bg-gradient-to-b from-primary/10 to-background text-center flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl space-y-6"
        >
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
            Universal File Conversion
          </h1>
          <p className="text-xl text-muted-foreground">
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
      <section id="how-it-works" className="w-full py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">Convert your files in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <UploadCloud className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">1. Upload</h3>
              <p className="text-muted-foreground">Select or drag & drop your file into the upload area.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <RefreshCw className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">2. Convert</h3>
              <p className="text-muted-foreground">Choose your target format and let our servers do the heavy lifting.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <Download className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">3. Download</h3>
              <p className="text-muted-foreground">Get your converted file instantly. Files are deleted after 24 hours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Converters */}
      <section id="popular" className="w-full py-16 bg-muted/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Popular Converters</h2>
              <p className="text-muted-foreground">Our most frequently used conversion tools.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {POPULAR_CONVERTERS.map((converter) => (
              <Link key={converter.id} href={`/converter/${converter.id}`}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg">{converter.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">{converter.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="w-full py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Enterprise-Grade Features</h2>
            <p className="text-muted-foreground">Built for speed, reliability, and scale.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <div key={i} className="flex gap-4 p-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
