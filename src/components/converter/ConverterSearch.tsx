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
    <section className="w-full py-8 px-4 max-w-4xl mx-auto">
      <div className="flex flex-col items-center space-y-4">
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-6 w-6" />
          <input 
            type="text" 
            placeholder="What do you want to convert today? (e.g., 'pdf', 'excel')..."
            className="w-full pl-12 pr-4 py-5 rounded-2xl border-2 border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all shadow-lg text-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        {/* Search Results - Names Only */}
        <AnimatePresence>
          {search.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full bg-card border-2 rounded-2xl shadow-xl overflow-hidden divide-y"
            >
              {filtered.length > 0 ? (
                filtered.map((converter) => (
                  <Link 
                    key={converter.id} 
                    href={`/converter/${converter.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-accent transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <converter.icon className="h-5 w-5" />
                      </div>
                      <span className="text-lg font-semibold text-foreground">{converter.title}</span>
                      <span className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 bg-muted rounded text-muted-foreground">
                        {converter.category}
                      </span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <p className="text-muted-foreground text-lg">No converters found matching &quot;{search}&quot;</p>
                  <button 
                    onClick={() => setSearch("")}
                    className="mt-2 text-primary font-semibold hover:underline"
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
