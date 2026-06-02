import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileUp, Menu } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <FileUp className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Universal File Converter</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
          <Link href="/#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How it Works</Link>
          <Button asChild>
            <Link href="/converter/excel-to-json">Get Started</Link>
          </Button>
        </div>

        <button className="md:hidden p-2">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </nav>
  );
}
