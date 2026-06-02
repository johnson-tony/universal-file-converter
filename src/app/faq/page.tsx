"use client";

import { motion } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQS = [
  {
    question: "Is Universal File Converter free to use?",
    answer: "Yes, our platform is completely free for all users. We don't require any subscription or credit card information."
  },
  {
    question: "How long are my files stored on your servers?",
    answer: "To ensure your privacy, all uploaded and converted files are automatically deleted from our servers after 24 hours. You can also delete them manually after conversion."
  },
  {
    question: "Is there a limit on the file size I can upload?",
    answer: "Currently, we support files up to 50MB for most conversion types. Some specialized tools may have different limits which are displayed on their respective pages."
  },
  {
    question: "Are my files secure during conversion?",
    answer: "Absolutely. We use industry-standard encryption for file transfers and process all files in secure, isolated environments. Your data is never shared with third parties."
  },
  {
    question: "Which file formats do you support?",
    answer: "We support a wide range of formats including PDF, DOCX, XLSX, JPG, PNG, SVG, JSON, CSV, XML, and more. We are constantly adding new formats to our platform."
  },
  {
    question: "Can I use the converter on my mobile phone?",
    answer: "Yes, Universal File Converter is fully responsive and works perfectly on smartphones and tablets without needing to install any app."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-4 px-4 bg-gradient-to-b from-primary/10 to-background text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about our platform and services.
          </p>
        </motion.div>
      </section>

      {/* FAQ Accordion */}
      <section className="w-full py-4 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-2xl overflow-hidden bg-card transition-all"
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    <span className="font-bold text-lg">{faq.question}</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`} />
                </button>
                
                {openIndex === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-6 pb-6"
                  >
                    <div className="pt-2 text-muted-foreground leading-relaxed border-t border-dashed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-primary/5 rounded-3xl border border-primary/10 text-center space-y-4">
            <h3 className="text-xl font-bold">Still have questions?</h3>
            <p className="text-muted-foreground">
              If you couldn&apos;t find what you were looking for, feel free to contact our support team.
            </p>
            <div className="pt-2">
              <a href="/contact" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
