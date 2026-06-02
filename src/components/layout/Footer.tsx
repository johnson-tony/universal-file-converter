"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const isAdminDashboard = pathname?.startsWith("/admin/dashboard");

  if (isAdminDashboard) return null;

  return (
    <footer className="w-full bg-background border-t">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <Image src="/logo.png" alt="FileForge Logo" width={32} height={32} className="group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-black text-2xl tracking-tighter">
                <span className="text-[#1F2937]">File</span><span className="text-[#2D6A6A]">Forge</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Fast, secure, and reliable file conversion. Forging your data into the perfect format.
            </p>
          </div>
          
          {/* Column 2: Resources */}
          <div className="grid grid-cols-2 gap-8 md:col-span-1">
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-widest text-foreground/50">Company</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-widest text-foreground/50">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 3: Status / Newsletter Placeholder (Clean) */}
          <div className="flex flex-col md:items-end justify-start space-y-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
              All systems operational
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-4 pt-4 border-t text-center gap-4 text-[13px] text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FileForge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
