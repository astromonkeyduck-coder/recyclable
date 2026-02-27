import Link from "next/link";
import { Recycle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <div className="flex items-center gap-2">
            <Recycle className="h-4 w-4" />
            <span>&copy; {new Date().getFullYear()} isthisrecyclable.com</span>
          </div>
          <span className="text-xs text-muted-foreground/70">
            Made by Richard, an AP Enviro lover
          </span>
        </div>
        <nav className="flex gap-4">
          <Link href="/about" className="hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/faq" className="hover:text-foreground transition-colors">
            FAQ
          </Link>
          <Link href="/rules" className="hover:text-foreground transition-colors">
            Rules
          </Link>
          <Link href="/providers" className="hover:text-foreground transition-colors">
            Providers
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
