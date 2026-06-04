"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, FileJson, ImageIcon, FileCode, ArrowRight } from "lucide-react";

export const HeroAnimation = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const icons = [
    { icon: FileText, color: "text-blue-500", delay: 0 },
    { icon: ImageIcon, color: "text-purple-500", delay: 2 },
    { icon: FileJson, color: "text-orange-500", delay: 4 },
    { icon: FileCode, color: "text-green-500", delay: 6 },
  ];

  return (
    <div className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden">
      {/* Central "Forge" Core */}
      <div className="relative z-10">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-24 h-24 md:w-32 md:h-32 bg-primary/20 rounded-3xl backdrop-blur-xl border border-primary/30 flex items-center justify-center shadow-[0_0_50px_-12px_rgba(var(--primary),0.5)]"
        >
          <div className="relative">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-primary blur-2xl rounded-full"
            />
            <div className="relative z-10 p-4 bg-background/80 rounded-2xl border border-primary/50">
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                <motion.div
                   animate={{ rotate: 360 }}
                   transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                   <ArrowRight className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Glow Rings */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 0.2, 0], 
              scale: [0.8, 1.5 + i * 0.2, 2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-primary/30 rounded-full"
          />
        ))}
      </div>

      {/* Floating Icons */}
      {icons.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ x: -200, opacity: 0, scale: 0.5 }}
          animate={{
            x: [ -200, 0, 200 ],
            opacity: [ 0, 1, 1, 0 ],
            scale: [ 0.5, 1.2, 0.5 ],
            y: [ 0, -20, 20, 0 ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
          className={`absolute z-20 p-3 bg-background border rounded-xl shadow-lg ${item.color}`}
        >
          <item.icon className="w-6 h-6 md:w-8 md:h-8" />
        </motion.div>
      ))}

      {/* Background Particles - Only rendered on client to avoid hydration mismatch */}
      {isMounted && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 400 - 200, 
                y: Math.random() * 400 - 200,
                opacity: 0 
              }}
              animate={{ 
                y: [null, Math.random() * -100 - 50],
                opacity: [0, 0.3, 0] 
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              className="absolute w-1 h-1 bg-primary rounded-full"
              style={{ 
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%` 
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
