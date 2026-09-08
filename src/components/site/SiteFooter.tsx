import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="pt-10 pb-2">
      <div className="flex items-center justify-between text-[12.5px] text-foreground/40">
        <span className="font-medium text-foreground/55">Kümmer</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
      <p className="mt-3 max-w-[40ch] text-[12px] leading-relaxed text-foreground/35 text-pretty">
        Wir unterstützen dich bei der Kommunikation mit deinem Dienstleister. Kein automatisiertes
        Portal – sondern ein persönlicher Ansprechpartner. Wir bieten keine Rechtsberatung an.
      </p>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-foreground/45">
        <a href="tel:+4915770361963" className="hover:text-foreground/70">
          +49 157 70361963
        </a>
        <a href="mailto:ylt.servicesdortmund@gmail.com" className="hover:text-foreground/70">
          ylt.servicesdortmund@gmail.com
        </a>
      </div>
      <div className="mt-2 flex gap-4 text-[12px] text-foreground/45">
        <Link to="/impressum" className="hover:text-foreground/70">
          Impressum
        </Link>
        <Link to="/datenschutz" className="hover:text-foreground/70">
          Datenschutz
        </Link>
        <Link to="/so-funktionierts" className="hover:text-foreground/70">
          So funktioniert’s
        </Link>
      </div>
    </footer>
  );
}
