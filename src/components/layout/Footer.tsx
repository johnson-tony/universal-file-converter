import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-background border-t py-4">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Image src="/logo.png" alt="Logo" width={24} height={24} className="rounded-sm" />
            <span className="font-bold text-lg">Universal File Converter</span>
          </Link>
          <p className="text-muted-foreground text-sm">
            The fastest, most secure way to convert files online. No authentication required.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4">Converters</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/converter/excel-to-json" className="hover:text-primary">Excel to JSON</Link></li>
            <li><Link href="/converter/json-to-excel" className="hover:text-primary">JSON to Excel</Link></li>
            <li><Link href="/converter/pdf-to-docx" className="hover:text-primary">PDF to DOCX</Link></li>
            <li><Link href="/converter/svg-to-png" className="hover:text-primary">SVG to PNG</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-primary">About</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
            <li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
            <li><Link href="/status" className="hover:text-primary">System Status</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Universal File Converter. All rights reserved.
      </div>
    </footer>
  );
}
