"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setShowToast(true);
        setShowModal(true);
        setFormData({ name: "", email: "", message: "" });
        // Hide toast after 5 seconds
        setTimeout(() => setShowToast(false), 5000);
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Failed to connect to the server.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="flex flex-col items-center relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -100, x: "-50%" }}
            animate={{ opacity: 1, y: 20, x: "-50%" }}
            exit={{ opacity: 0, y: -100, x: "-50%" }}
            className="fixed top-0 left-1/2 z-[1000] w-full max-w-md px-4"
          >
            <div className="bg-emerald-500 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-400/50 backdrop-blur-md">
              <div className="bg-white/20 p-2 rounded-xl">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold">Message Forged Successfully!</p>
                <p className="text-sm text-emerald-50">We&apos;ll get back to you within 24 hours.</p>
              </div>
              <button onClick={() => setShowToast(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <AlertCircle className="h-5 w-5 rotate-45" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal Popup */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-card border rounded-[2.5rem] shadow-2xl p-10 text-center overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-emerald-400 to-secondary" />
              
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                    className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner"
                  >
                    <CheckCircle2 className="w-12 h-12" />
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold"
                  >
                    1
                  </motion.div>
                </div>
              </div>

              <h2 className="text-4xl font-black tracking-tight mb-4">Thank You!</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Your message has been received. We&apos;ve sent a <span className="text-primary font-bold underline decoration-primary/30">confirmation email</span> to you. 
                Our team will be back soon with a detailed response!
              </p>

              <div className="space-y-4">
                <Button 
                  onClick={() => setShowModal(false)}
                  className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
                >
                  Got it, thanks!
                </Button>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
                  FileForge Support Team
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="w-full py-8 px-4 bg-gradient-to-b from-primary/10 via-background to-background text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto space-y-3"
        >
          <div className="inline-block px-3 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider mb-1">
            Contact Support
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Have questions? Send us a message and we&apos;ll get back to you shortly.
          </p>
        </motion.div>
      </section>

      {/* Contact Content */}
      <section className="w-full py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-1 bg-gradient-to-br from-primary/10 via-background to-secondary/10 rounded-[2rem] shadow-xl"
            >
              <div className="bg-card rounded-[1.8rem] p-6 md:p-8 border shadow-inner">
                <motion.form 
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                      <Input 
                        id="name" 
                        required 
                        placeholder="John Doe" 
                        className="h-12 rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200 focus:bg-white transition-all" 
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                      <Input 
                        id="email" 
                        type="email" 
                        required 
                        placeholder="john@example.com" 
                        className="h-12 rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200 focus:bg-white transition-all" 
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Message</label>
                    <textarea 
                      id="message"
                      required
                      className="flex min-h-[120px] w-full rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-900/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:bg-white"
                      placeholder="How can we help?"
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  {status === "error" && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100 dark:border-red-900/30"
                    >
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      {errorMessage}
                    </motion.div>
                  )}

                  <Button 
                    disabled={status === "loading"}
                    className={cn(
                      "w-full h-14 rounded-xl gap-3 text-lg font-bold shadow-lg transition-all active:scale-[0.98]",
                      status === "success" ? "bg-emerald-500 hover:bg-emerald-600" : "shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                    )}
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin" /> Sending...
                      </>
                    ) : status === "success" ? (
                      <>
                        <CheckCircle2 className="h-6 w-6" /> Sent Successfully
                      </>
                    ) : (
                      <>
                        <Send className="h-6 w-6" /> Send Message
                      </>
                    )}
                  </Button>
                </motion.form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
