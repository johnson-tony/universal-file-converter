"use client";

import React, { useRef } from "react";
import { ArrowRightCircle, ArrowLeftCircle } from "lucide-react";
import { cn } from "@/utils/cn";

interface CarouselProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  id?: string;
  gridCols?: string;
}

export function Carousel({ children, title, description, id, gridCols = "md:grid-cols-3" }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full py-4 scroll-mt-20" id={id}>
      <div className="container mx-auto px-4 max-w-6xl">
        {(title || description) && (
          <div className="mb-4 px-2">
            {title && <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>}
            {description && <p className="text-sm md:text-base text-muted-foreground">{description}</p>}
          </div>
        )}
        
        <div className="relative group">
          {/* Mobile: Scroll, Desktop: Grid */}
          <div
            ref={scrollRef}
            className={cn(
              "flex md:grid overflow-x-auto md:overflow-x-visible snap-x snap-mandatory gap-6 pb-6 md:pb-0 scrollbar-hide",
              gridCols
            )}
          >
            {children}
          </div>
          
          {/* Mobile-only Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 p-1 md:hidden text-primary transition-all"
            aria-label="Scroll left"
          >
            <ArrowLeftCircle className="h-10 w-10 fill-background" />
          </button>
          
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 p-1 md:hidden text-primary transition-all"
            aria-label="Scroll right"
          >
            <ArrowRightCircle className="h-10 w-10 fill-background" />
          </button>
        </div>
      </div>
    </div>
  );
}
