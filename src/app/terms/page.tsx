"use client";

import { motion } from "framer-motion";
import { Scale, CheckCircle2, AlertCircle } from "lucide-react";

export default function TermsPage() {
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
            <div className="p-3 bg-secondary/10 rounded-full text-secondary">
              <Scale className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground">
            Please read these terms carefully before using our platform.
          </p>
        </motion.div>
      </section>

      {/* Content Section */}
      <section className="w-full py-4 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-slate max-w-none space-y-12">
            
            <div className="bg-muted/30 p-8 rounded-3xl border space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold">
                <CheckCircle2 className="h-5 w-5" />
                <span>Agreement to Terms</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using Universal File Converter, you agree to be bound by these terms. If you do not agree with any part of these terms, you may not use our services.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold">1. Use of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                You may use our service for personal or professional file conversion. You are solely responsible for the content of the files you upload. You agree not to use the service for any illegal purposes or to upload malicious content.
              </p>
              <div className="flex gap-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-800 text-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p>We reserve the right to block access to users who violate these terms or attempt to disrupt the service.</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold">2. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                You retain all rights to the files you upload. Universal File Converter does not claim any ownership over your content. The platform itself, including its code, design, and trademarks, is the property of Universal File Converter and is protected by intellectual property laws.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold">3. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                The service is provided &quot;as is&quot; without any warranties, express or implied. We do not guarantee that the service will be uninterrupted, error-free, or that the results of conversion will always meet your specific requirements.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold">4. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                Universal File Converter shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the service, including but not limited to loss of data or business interruption.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold">5. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update these terms from time to time. Your continued use of the platform after any changes signifies your acceptance of the updated terms.
              </p>
            </div>

            <div className="pt-8 border-t text-sm text-muted-foreground italic">
              Last Updated: June 2, 2026
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
