import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

/** Bewusst minimale Navigation: Marke links, ein einziger Einstieg rechts. */
export function SiteHeader() {
  const { user, isStaff } = useAuth();

  return (
    <header className="flex items-center justify-between py-5">
      <Link to="/" className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-[9px] bg-primary/20 ring-1 ring-primary/40">
          <span className="text-[15px] font-bold text-primary">K</span>
        </span>
        <span className="text-[17px] font-semibold tracking-tight">YLT Services</span>
      </Link>
      {user ? (
        <Link
          to={isStaff ? "/intern" : "/meine-faelle"}
          className="px-2 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
        >
          {isStaff ? "Interner Bereich" : "Meine Fälle"}
        </Link>
      ) : (
        <Link
          to="/anmelden"
          className="px-2 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
        >
          Fall ansehen
        </Link>
      )}
    </header>
  );
}
