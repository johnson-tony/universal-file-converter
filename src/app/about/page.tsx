"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Shield, Zap, Globe, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 px-4 bg-gradient-to-b from-primary/10 to-background text-center flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl space-y-6"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full text-primary">
              <Image src="/logo.png" alt="Logo" width={48} height={48} />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            About <span className="text-[#1F2937]">File</span><span className="text-[#4F46E5]">Forge</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Making file conversion fast, easy, and accessible for everyone.
          </p>
        </motion.div>
      </section>

      {/* Content Section */}
      <section className="w-full py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none text-center space-y-8">
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
              <span className="font-bold text-[#1F2937]">File</span><span className="font-bold text-[#4F46E5]">Forge</span> was built with a simple goal: to make file conversion fast, easy, and accessible for everyone. 
              Whether you need to convert documents, images, spreadsheets, or data files, our platform provides a clean and reliable 
              experience without requiring software installation or technical knowledge.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 py-12">
              <div className="flex flex-col items-center p-8 bg-card border rounded-3xl shadow-sm space-y-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Simplicity & Speed</h3>
                <p className="text-muted-foreground text-sm">
                  We focus on simplicity and convenience, helping users convert files in just a few clicks from any device.
                </p>
              </div>
              <div className="flex flex-col items-center p-8 bg-card border rounded-3xl shadow-sm space-y-4">
                <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
                  <Globe className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Our Mission</h3>
                <p className="text-muted-foreground text-sm">
                  To provide a growing collection of useful tools that save time for students, professionals, and developers.
                </p>
              </div>
            </div>

            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
              Our mission is to provide a growing collection of useful file conversion tools that save time and improve 
              productivity for students, professionals, developers, businesses, and everyday users.
            </p>

            <div className="pt-12">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <Heart className="h-5 w-5 fill-white" />
                Upload. Convert. Download.
              </div>
              <p className="mt-4 text-sm font-medium text-primary">It&apos;s that simple.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
