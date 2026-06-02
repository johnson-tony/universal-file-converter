"use client";

import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CONVERTERS } from "@/config/converters";
import { motion, AnimatePresence } from "framer-motion";

export function ConverterSearch() {
  const [search, setSearch] = useState("");
  
  const filtered = CONVERTERS.filter(c => {
    return c.title.toLowerCase().includes(search.toLowerCase()) || 
           c.category.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <section className="w-full py-2 md:py-4  px-4 max-w-2xl mx-auto">
      <div className="flex flex-col items-center space-y-2">
        {/* Search Input */}
        <div className="relative w-full group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search converters (e.g., 'pdf')..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all shadow-md text-base md:text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        {/* Search Results - More Compact */}
        <AnimatePresence>
          {search.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="w-full bg-card border-2 rounded-xl shadow-lg overflow-hidden divide-y max-h-[400px] overflow-y-auto"
            >
              {filtered.length > 0 ? (
                filtered.map((converter) => (
                  <Link 
                    key={converter.id} 
                    href={`/converter/${converter.id}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-accent transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <converter.icon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3">
                        <span className="text-sm md:text-base font-semibold text-foreground">{converter.title}</span>
                        <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 bg-muted rounded text-muted-foreground w-fit">
                          {converter.category}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                ))
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-muted-foreground text-sm">No converters found matching &quot;{search}&quot;</p>
                  <button 
                    onClick={() => setSearch("")}
                    className="mt-1 text-primary text-xs font-semibold hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
