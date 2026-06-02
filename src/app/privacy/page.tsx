"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Eye, Lock, FileX } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-4 px-4 bg-gradient-to-b from-primary/10 to-background text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto space-y-4"
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <ShieldCheck className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground">
            Your privacy is our top priority. Learn how we protect your data.
          </p>
        </motion.div>
      </section>

      {/* Content Section */}
      <section className="w-full py-4 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid gap-12">
            {/* Core Principles */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-card border rounded-2xl space-y-3">
                <div className="p-2 bg-primary/10 rounded-lg w-fit text-primary">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="font-bold">Fully Secure</h3>
                <p className="text-sm text-muted-foreground">End-to-end encryption for all file transfers.</p>
              </div>
              <div className="p-6 bg-card border rounded-2xl space-y-3">
                <div className="p-2 bg-secondary/10 rounded-lg w-fit text-secondary">
                  <FileX className="h-5 w-5" />
                </div>
                <h3 className="font-bold">Auto-Delete</h3>
                <p className="text-sm text-muted-foreground">Files are permanently deleted after 24 hours.</p>
              </div>
              <div className="p-6 bg-card border rounded-2xl space-y-3">
                <div className="p-2 bg-primary/10 rounded-lg w-fit text-primary">
                  <Eye className="h-5 w-5" />
                </div>
                <h3 className="font-bold">No Inspection</h3>
                <p className="text-sm text-muted-foreground">We never look at or share your file content.</p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">1. Data Collection</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Universal File Converter does not require user registration. We do not collect personal information such as names, addresses, or phone numbers. We may collect non-personal data like browser type and conversion statistics to improve our service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. File Handling</h2>
                <p className="text-muted-foreground leading-relaxed">
                  When you upload a file, it is stored temporarily on our secure servers solely for the purpose of conversion. We use HTTPS to ensure your files are encrypted during transit. Our automated system removes all original and converted files within 24 hours of the conversion process.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use essential cookies to maintain your session and remember your conversion preferences. We also use third-party analytics cookies to understand how our site is used, which helps us provide a better experience for everyone.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Third-Party Services</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use trusted third-party providers for cloud storage and analytics. These providers are bound by strict confidentiality agreements and are not permitted to use your data for any other purpose than providing services to Universal File Converter.
                </p>
              </div>

              <div className="pt-8 border-t text-sm text-muted-foreground italic">
                Last Updated: June 2, 2026
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
