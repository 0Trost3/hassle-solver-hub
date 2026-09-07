import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/so-funktionierts")({
  head: () => ({
    meta: [
      { title: "So funktioniert’s – vom Fall bis zur Lösung | Kümmer" },
      {
        name: "description",
        content:
          "In vier Schritten zur Lösung: Problem schildern, persönlich sprechen, wir übernehmen das Gespräch, wir suchen eine verbindliche Vereinbarung.",
      },
      { property: "og:title", content: "So funktioniert’s – vom Fall bis zur Lösung" },
      {
        property: "og:description",
        content:
          "Vier Schritte, ein persönlicher Ansprechpartner und eine klare Bearbeitungsfrist von bis zu 2 Werktagen.",
      },
    ],
  }),
  component: SoFunktioniertsPage,
});

const SCHRITTE = [
  {
    nr: "01",
    title: "Problem schildern",
    text: "Du beschreibst uns in wenigen Schritten, worum es geht: um welchen Dienstleister, was vereinbart war und was nicht funktioniert. Dokumente kannst du direkt vom Handy hochladen.",
  },
  {
    nr: "02",
    title: "Persönlich sprechen",
    text: "Du wählst einen Telefontermin. Im Gespräch klären wir gemeinsam, was passiert ist, was dir wichtig ist und was für dich eine gute Lösung wäre.",
  },
  {
    nr: "03",
    title: "Wir übernehmen",
    text: "Wir kontaktieren den Dienstleister für dich und dokumentieren jeden Kontaktversuch. Du siehst jederzeit, wo dein Fall steht.",
  },
  {
    nr: "04",
    title: "Wir finden eine Lösung",
    text: "Innerhalb von bis zu 2 Werktagen versuchen wir eine verbindliche Vereinbarung zu erreichen. Klappt das nicht, sagen wir dir offen, welche Wege dir bleiben.",
  },
];

function SoFunktioniertsPage() {
  return (
    <div className="mx-auto max-w-[440px] px-5 pb-16 md:max-w-3xl">
      <SiteHeader />

      <section className="pt-6">
        <h1 className="max-w-[14ch] text-[34px] leading-[1.06] font-semibold tracking-tight text-balance">
          So funktioniert’s
        </h1>
        <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-foreground/65 text-pretty">
          Du musst dich nicht darum kümmern. Wir kümmern uns – Schritt für Schritt und mit klaren
          Ansagen, was als Nächstes passiert.
        </p>
      </section>

      <section className="mt-9 flex flex-col gap-3">
        {SCHRITTE.map((s) => (
          <article key={s.nr} className="panel p-5">
            <span className="text-[13px] font-semibold text-primary tabular-nums">{s.nr}</span>
            <h2 className="mt-2 text-[17px] font-semibold tracking-tight">{s.title}</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-foreground/60">{s.text}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-[22px] bg-primary/15 p-6 ring-1 ring-primary/30">
        <h2 className="max-w-[18ch] text-[20px] leading-[1.15] font-semibold tracking-tight text-balance">
          Erzähl uns kurz, was passiert ist.
        </h2>
        <Link
          to="/fall-erstellen"
          className="mt-5 flex min-h-[54px] items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-primary-foreground ring-1 ring-primary/60 transition-colors hover:bg-primary-deep"
        >
          Problem schildern <span className="text-lg leading-none">→</span>
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
