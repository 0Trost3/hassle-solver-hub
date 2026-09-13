import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";

/** Bewusst minimale Navigation: Marke links, ein einziger Einstieg rechts. */
export function SiteHeader() {
  return (
    <header className="flex items-center justify-between py-5">
      <Link to="/" className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-[9px] bg-primary/20 ring-1 ring-primary/40">
          <span className="text-[15px] font-bold text-primary">Y</span>
        </span>
        <span className="text-[17px] font-semibold tracking-tight">YLT Services</span>
      </Link>
      <a
        href="/#kontakt"
        className="flex min-h-11 items-center gap-2 px-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
      >
        <Mail className="size-4" aria-hidden="true" /> Kontakt
      </a>
    </header>
  );
}
