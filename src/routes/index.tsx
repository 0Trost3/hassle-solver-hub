import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ToneBadge } from "@/components/StatusBadge";
import gespraechBild from "@/assets/persoenliches-gespraech.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Handwerker meldet sich nicht? Wir kümmern uns darum. | YLT Services" },
      {
        name: "description",
        content:
          "Wenn die Kommunikation mit deinem Handwerker feststeckt: Schildere dein Problem, wir übernehmen persönlich das Gespräch mit dem Dienstleister.",
      },
      { property: "og:title", content: "Handwerker meldet sich nicht? Wir kümmern uns darum." },
      {
        property: "og:description",
        content:
          "Du musst nicht weiter hinterhertelefonieren. Wir übernehmen das Gespräch mit deinem Dienstleister – persönlich und mit klarer Frist.",
      },
    ],
  }),
  component: Landing,
});

const SZENARIEN = [
  {
    title: "Der Handwerker meldet sich nicht mehr",
    text: "Seit Tagen keine Antwort auf Anruf oder Nachricht.",
  },
  {
    title: "Der vereinbarte Termin wurde nicht eingehalten",
    text: "Verzögerung, ohne dass du eine verbindliche Aussage bekommst.",
  },
  {
    title: "Die Arbeit wurde nicht fertiggestellt",
    text: "Bereits gezahlt, aber die Arbeit steht nicht.",
  },
];

const SCHRITTE = [
  { nr: "01", title: "Problem schildern", text: "Du erzählst uns kurz, was passiert ist." },
  {
    nr: "02",
    title: "Persönlich sprechen",
    text: "Wir besprechen deinen Fall gemeinsam am Telefon.",
  },
  { nr: "03", title: "Wir übernehmen", text: "Wir kontaktieren den Dienstleister für dich." },
  {
    nr: "04",
    title: "Wir finden eine Lösung",
    text: "Innerhalb von bis zu 2 Werktagen versuchen wir eine verbindliche Vereinbarung.",
  },
];

const FRAGEN = [
  {
    q: "Wie schnell meldet ihr euch?",
    a: "Nach deinem Fall melden wir uns persönlich – in der Regel noch am selben Werktag. Nach der Übernahme versuchen wir innerhalb von bis zu 2 Werktagen, den Dienstleister zu erreichen.",
  },
  {
    q: "Für welche Probleme kann ich eure Hilfe nutzen?",
    a: "Immer dann, wenn die Kommunikation feststeckt: keine Rückmeldung, verzögerte Aufträge, nicht eingehaltene Termine oder unklare Absprachen mit Handwerkern und Dienstleistern.",
  },
  {
    q: "Was, wenn der Dienstleister nicht reagiert?",
    a: "Wir dokumentieren jeden Kontaktversuch und versuchen es über verschiedene Wege. Kommt keine Reaktion, besprechen wir mit dir offen, welche Möglichkeiten dir bleiben.",
  },
  {
    q: "Übernehmt ihr auch rechtliche Fälle?",
    a: "Nein. Wir unterstützen dich bei der Kommunikation. Bei rechtlich komplexen Sachverhalten verweisen wir dich gezielt an geeignete Fachstellen weiter.",
  },
];

function Landing() {
  return (
    <div className="mx-auto max-w-[440px] px-5 pb-16 md:max-w-3xl">
      <SiteHeader />

      {/* Hero */}
      <section className="pt-4 pb-8">
        <ToneBadge tone="positive" pulse className="bg-surface ring-border">
          <span className="font-medium text-foreground/70">Persönlich. Nicht an eine Hotline.</span>
        </ToneBadge>
        <h1 className="mt-5 max-w-[9ch] text-[40px] leading-[1.04] font-semibold tracking-tight text-balance md:max-w-[14ch] md:text-6xl">
          Handwerker meldet sich nicht? Wir kümmern uns darum.
        </h1>
        <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-foreground/65 text-pretty">
          Wenn die Kommunikation feststeckt, musst du nicht weiter hinterhertelefonieren. Beschreibe
          uns dein Problem — wir übernehmen das Gespräch.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/fall-erstellen"
            className="flex min-h-[54px] items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground ring-1 ring-primary/60 transition-colors hover:bg-primary-deep"
          >
            Problem schildern <span className="text-lg leading-none">→</span>
          </Link>
          <Link
            to="/so-funktionierts"
            className="flex min-h-[50px] items-center justify-center rounded-xl bg-surface px-6 text-base font-medium ring-1 ring-border transition-colors hover:bg-surface-strong"
          >
            So funktioniert’s
          </Link>
        </div>
      </section>

      {/* Beispiel-Fallkarte */}
      <section className="fade-up">
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium tracking-[0.14em] text-foreground/45 uppercase">
              Beispiel eines Falls
            </span>
            <span className="font-mono text-[12px] font-medium text-foreground/55 tabular-nums">
              #WK-2026-00482
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <ToneBadge tone="progress" pulse>
              Wird geprüft
            </ToneBadge>
            <span className="text-[12px] text-foreground/45">Erstellt 07.09.2026</span>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
            {[
              ["Dienstleister", "Muster Sanitär GmbH"],
              ["Problem", "Keine Rückmeldung"],
              ["Fertigstellung", "15.08.2026"],
              ["Vereinbarter Preis", "4.800 €"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[11px] text-foreground/45">{k}</dt>
                <dd className="mt-0.5 text-[14px] font-medium text-foreground/90">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 flex items-start gap-3 rounded-[14px] bg-primary/12 px-4 py-3 ring-1 ring-primary/25">
            <span className="mt-0.5 shrink-0 text-base leading-none text-primary">→</span>
            <p className="text-[13px] leading-snug text-foreground/85">
              <span className="font-semibold text-foreground">Nächster Schritt:</span> Wir prüfen
              deinen Fall und melden uns persönlich bei dir.
            </p>
          </div>
        </div>
      </section>

      {/* Problem-Szenarien */}
      <section className="fade-up pt-12">
        <h2 className="max-w-[20ch] text-[20px] font-semibold tracking-tight text-balance">
          Typische Situationen, in denen wir helfen
        </h2>
        <div className="mt-5 flex flex-col gap-2.5">
          {SZENARIEN.map((s) => (
            <Link
              key={s.title}
              to="/fall-erstellen"
              className="panel-quiet flex items-center justify-between px-4 py-4 transition-colors hover:bg-surface-strong"
            >
              <span>
                <span className="block text-[15px] font-medium text-foreground/90">{s.title}</span>
                <span className="mt-0.5 block text-[13px] text-foreground/50">{s.text}</span>
              </span>
              <span className="shrink-0 pl-3 text-lg text-foreground/30">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* So funktioniert es */}
      <section className="fade-up pt-12">
        <h2 className="text-[20px] font-semibold tracking-tight">So funktioniert’s</h2>
        <ol className="mt-5 flex flex-col">
          {SCHRITTE.map((s, i) => (
            <li
              key={s.nr}
              className={`flex gap-4 py-4 ${i < SCHRITTE.length - 1 ? "border-b border-hairline" : ""}`}
            >
              <span className="shrink-0 pt-0.5 text-[13px] font-semibold text-primary tabular-nums">
                {s.nr}
              </span>
              <div>
                <p className="text-[15px] font-medium text-foreground/90">{s.title}</p>
                <p className="mt-0.5 text-[13px] leading-snug text-foreground/50">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Persönlicher Service */}
      <section className="pt-12">
        <div className="panel overflow-hidden">
          <img
            src={gespraechBild}
            alt="Person am Schreibtisch telefoniert und macht sich Notizen"
            width={1024}
            height={768}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover"
          />
          <div className="p-5">
            <h2 className="text-[19px] font-semibold tracking-tight text-balance">
              Ein echter Mensch kümmert sich darum.
            </h2>
            <p className="mt-2.5 text-[14px] leading-relaxed text-foreground/60 text-pretty">
              Wir hören zu, wir rufen an, wir bleiben dran. Kein Ticket in die Warteschleife —
              sondern ein persönliches Gespräch.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="panel-quiet px-3 py-2.5">
                <div className="text-[12px] text-foreground/45">Bearbeitung</div>
                <div className="text-[13.5px] font-medium text-foreground/90">
                  bis zu 2 Werktage
                </div>
              </div>
              <div className="panel-quiet px-3 py-2.5">
                <div className="text-[12px] text-foreground/45">Kontakt</div>
                <div className="text-[13.5px] font-medium text-foreground/90">
                  persönlich &amp; sicher
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pt-12">
        <h2 className="text-[20px] font-semibold tracking-tight">Häufige Fragen</h2>
        <div className="mt-4 flex flex-col gap-2.5">
          {FRAGEN.map((f) => (
            <details key={f.q} className="panel-quiet group px-4 py-4">
              <summary className="flex cursor-pointer items-center justify-between list-none">
                <span className="text-[14.5px] font-medium text-foreground/90">{f.q}</span>
                <span className="ml-4 shrink-0 text-lg text-foreground/30 group-open:hidden">+</span>
                <span className="ml-4 hidden shrink-0 text-lg text-foreground/30 group-open:inline">
                  –
                </span>
              </summary>
              <p className="mt-2 text-[13.5px] leading-relaxed text-foreground/55">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Abschluss-CTA */}
      <section className="pt-12">
        <div className="rounded-[22px] bg-primary/15 p-6 ring-1 ring-primary/30">
          <h2 className="max-w-[16ch] text-[22px] leading-[1.1] font-semibold tracking-tight text-balance">
            Endlich kümmert sich jemand darum.
          </h2>
          <Link
            to="/fall-erstellen"
            className="mt-5 flex min-h-[54px] items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-primary-foreground ring-1 ring-primary/60 transition-colors hover:bg-primary-deep"
          >
            Problem schildern <span className="text-lg leading-none">→</span>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
