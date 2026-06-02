"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CONVERTERS, Category } from "@/config/converters";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES: (Category | "All")[] = ["All", "Documents", "Data", "Images", "Tools"];

export function ConverterSearch() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  
  const filtered = CONVERTERS.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="w-full py-2 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col items-center mb-12 space-y-8">
        {/* Search Input */}
        <div className="relative max-w-xl w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input 
            type="text" 
            placeholder="Search for a converter (e.g., 'pdf', 'csv')..."
            className="w-full pl-10 pr-4 py-4 rounded-2xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all shadow-md text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              className="rounded-full px-6 transition-all"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((converter) => (
            <motion.div
              key={converter.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Link href={`/converter/${converter.id}`}>
                <Card className="hover:border-primary/50 transition-all cursor-pointer group h-full shadow-sm hover:shadow-xl border-2">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <converter.icon className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-muted rounded-md text-muted-foreground">
                        {converter.category}
                      </span>
                    </div>
                    <CardTitle className="mt-4 text-xl">{converter.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {converter.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 flex justify-end">
                    <div className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
                      Open Converter <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {filtered.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-muted-foreground text-xl">No converters found matching your criteria.</p>
          <Button 
            variant="link" 
            className="mt-2 text-primary"
            onClick={() => { setSearch(""); setActiveCategory("All"); }}
          >
            Clear all filters
          </Button>
        </motion.div>
      )}
    </section>
  );
}
