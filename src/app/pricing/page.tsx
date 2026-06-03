"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Shield, Star, Rocket, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PricingPage() {
  const futurePlans = [
    {
      name: "Free",
      price: "$0",
      description: "For individuals and occasional conversions.",
      features: [
        "Up to 50MB file size",
        "10 conversions per day",
        "Standard processing speed",
        "Community support",
      ],
      buttonText: "Current Plan",
      highlight: false,
    },
    {
      name: "Pro",
      price: "Coming Soon",
      description: "For power users who need more speed and power.",
      features: [
        "Up to 2GB file size",
        "Unlimited conversions",
        "Priority forging speed",
        "Cloud storage integration",
        "Advanced API access",
        "24/7 Priority support",
      ],
      buttonText: "Join Waitlist",
      highlight: true,
    },
  ];

  return (
    <div className="flex flex-col items-center pb-20">
      {/* Hero Section */}
      <section className="w-full py-20 px-4 bg-gradient-to-b from-primary/10 via-background to-background text-center overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto space-y-6 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold uppercase tracking-widest mb-4">
            <Clock className="w-4 h-4" /> Something Big is Forging
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tight text-foreground leading-tight">
            Simple, Transparent <br />
            <span className="text-primary font-outline-2">Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            FileForge is currently **100% Free** while we develop our premium features. 
            Join the waitlist to be the first to know when we launch our Pro plans!
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="w-full px-4 -mt-12 relative z-20">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {futurePlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-1 rounded-[2.5rem] shadow-2xl transition-transform hover:scale-[1.02] duration-300 ${
                  plan.highlight 
                  ? "bg-gradient-to-br from-primary via-primary/50 to-secondary" 
                  : "bg-slate-200 dark:bg-slate-800"
                }`}
              >
                <div className="bg-card dark:bg-slate-900 rounded-[2.3rem] p-8 md:p-10 h-full flex flex-col">
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5">
                      <Star className="w-3 h-3 fill-white" /> Recommended
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-4xl md:text-5xl font-black tracking-tight">{plan.price}</span>
                      {plan.price !== "Coming Soon" && <span className="text-muted-foreground font-medium">/month</span>}
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">{plan.description}</p>
                  </div>

                  <div className="space-y-4 mb-10 flex-1">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.highlight ? "bg-primary/20 text-primary" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                          <Check className="w-3 h-3 stroke-[3px]" />
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    variant={plan.highlight ? "default" : "outline"} 
                    className={`w-full h-14 rounded-2xl text-lg font-bold transition-all shadow-lg ${
                      plan.highlight 
                      ? "shadow-primary/25 hover:shadow-primary/40" 
                      : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                    asChild={plan.name === "Free"}
                  >
                    {plan.name === "Free" ? (
                      <Link href="/">Try Now</Link>
                    ) : (
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => (document.getElementById('waitlist') as HTMLElement)?.scrollIntoView({behavior: 'smooth'})}>
                         <Rocket className="w-5 h-5" /> {plan.buttonText}
                      </div>
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="w-full mt-32 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            viewport={{ once: true }}
            className="p-1 bg-gradient-to-r from-primary/20 via-primary/5 to-secondary/20 rounded-[3rem] shadow-xl"
          >
            <div className="bg-card dark:bg-slate-900 rounded-[2.8rem] p-8 md:p-16 text-center space-y-8 border shadow-inner">
              <div className="p-4 bg-primary/10 rounded-3xl w-fit mx-auto text-primary">
                <Sparkles className="w-10 h-10" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight">Join the Forgers Waitlist</h2>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed font-medium">
                  Be the first to get access to Pro features, early-bird discounts, and exclusive updates.
                </p>
              </div>
              
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-1 h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 outline-none focus:border-primary transition-all font-medium"
                />
                <Button className="h-14 px-8 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20">
                  Join Now
                </Button>
              </form>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                No spam. Ever. Just forge updates.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="w-full mt-32 px-4 container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          {[
            { icon: Zap, title: "Speed", desc: "Our forge is optimized for near-instant results." },
            { icon: Shield, title: "Security", desc: "Your files are encrypted and auto-deleted after 1 hour." },
            { icon: Star, title: "Quality", desc: "Lossless conversion maintaining every single pixel." }
          ].map((item, idx) => (
            <div key={idx} className="space-y-4 group">
              <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border shadow-sm w-fit mx-auto transition-transform group-hover:-translate-y-2">
                <item.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-muted-foreground text-sm font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
