import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Mail, Phone } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ContactForm } from "@/components/site/ContactForm";
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
    <div className="mx-auto max-w-[440px] px-5 pb-16 md:max-w-5xl md:px-8">
      <SiteHeader />

      <main>
      <section className="pt-8 pb-12 md:pt-16 md:pb-20">
        <p className="text-[12px] font-semibold tracking-[0.14em] text-success uppercase">
          Persönlich. Nicht an eine Hotline.
        </p>
        <h1 className="mt-5 max-w-[9ch] text-[40px] leading-[1.04] font-semibold tracking-tight text-balance md:max-w-[14ch] md:text-6xl">
          Handwerker meldet sich nicht? Wir kümmern uns darum.
        </h1>
        <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-foreground/65 text-pretty">
          Wenn die Kommunikation feststeckt, musst du nicht weiter hinterhertelefonieren. Beschreibe
          uns dein Problem — wir übernehmen das Gespräch.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a
            href="#kontakt"
            className="flex min-h-[54px] items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-semibold text-primary-foreground ring-1 ring-primary/60 transition-colors hover:bg-primary-deep"
          >
            Problem schildern <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <a
            href="#ablauf"
            className="flex min-h-[50px] items-center justify-center rounded-lg bg-surface px-6 text-base font-medium ring-1 ring-border transition-colors hover:bg-surface-strong"
          >
            So funktioniert’s
          </a>
        </div>
      </section>

      <section id="hilfe" className="scroll-mt-8 border-t border-hairline pt-12 md:pt-16">
        <h2 className="max-w-[20ch] text-[20px] font-semibold tracking-tight text-balance">
          Typische Situationen, in denen wir helfen
        </h2>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {SZENARIEN.map((s) => (
            <a
              key={s.title}
              href="#kontakt"
              className="panel-quiet flex min-h-36 flex-col justify-between px-4 py-4 transition-colors hover:bg-surface-strong"
            >
              <span>
                <span className="block text-[15px] font-medium text-foreground/90">{s.title}</span>
                <span className="mt-2 block text-[13px] leading-relaxed text-foreground/50">{s.text}</span>
              </span>
              <ArrowRight className="mt-4 size-4 text-primary" aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      <section id="ablauf" className="scroll-mt-8 pt-14 md:pt-20">
        <h2 className="text-[20px] font-semibold tracking-tight">So funktioniert’s</h2>
        <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-foreground/55">
          Ein klarer Ablauf, bei dem du jederzeit weißt, was als Nächstes passiert.
        </p>
        <ol className="mt-6 grid md:grid-cols-2 md:gap-x-10">
          {SCHRITTE.map((s, i) => (
            <li
              key={s.nr}
              className={`flex gap-4 py-4 ${i < SCHRITTE.length - 1 ? "border-b border-hairline md:border-b-0" : ""}`}
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

      <section id="persoenlich" className="scroll-mt-8 pt-14 md:pt-20">
        <div className="grid overflow-hidden border-y border-hairline md:grid-cols-[1.1fr_1fr]">
          <img
            src={gespraechBild}
            alt="Person am Schreibtisch telefoniert und macht sich Notizen"
            width={1024}
            height={768}
            loading="lazy"
            className="aspect-[16/10] h-full w-full object-cover"
          />
          <div className="py-6 md:p-10">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">YLT Services</p>
            <h2 className="mt-3 text-[24px] font-semibold tracking-tight text-balance">
              Ein echter Mensch kümmert sich darum.
            </h2>
            <p className="mt-2.5 text-[14px] leading-relaxed text-foreground/60 text-pretty">
              Wir hören zu, wir rufen an, wir bleiben dran. Kein Ticket in die Warteschleife —
              sondern ein persönliches Gespräch.
            </p>
            <div className="mt-5 space-y-3 text-[13.5px] text-foreground/75">
              <p className="flex items-center gap-2"><Check className="size-4 text-success" /> Rückmeldung in der Regel am selben Werktag</p>
              <p className="flex items-center gap-2"><Check className="size-4 text-success" /> Persönliche und klare Kommunikation</p>
              <p className="flex items-center gap-2"><Check className="size-4 text-success" /> Keine Rechtsberatung, keine falschen Versprechen</p>
            </div>
          </div>
        </div>
      </section>

      <section id="fragen" className="scroll-mt-8 pt-14 md:pt-20">
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

      <section id="kontakt" className="scroll-mt-8 pt-14 md:pt-20">
        <div className="border-t border-hairline pt-10 md:grid md:grid-cols-[0.8fr_1.2fr] md:gap-14">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">Kontakt</p>
            <h2 className="mt-3 max-w-[16ch] text-[28px] leading-[1.1] font-semibold tracking-tight text-balance">
              Endlich kümmert sich jemand darum.
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-foreground/55">
              Schreib uns, wo die Kommunikation feststeckt. Wir melden uns persönlich bei dir.
            </p>
            <div className="mt-6 space-y-3 text-[13px] text-foreground/60">
              <a className="flex items-center gap-2 hover:text-foreground" href="tel:+4915770361963"><Phone className="size-4 text-primary" /> +49 157 70361963</a>
              <a className="flex items-center gap-2 break-all hover:text-foreground" href="mailto:ylt.servicesdortmund@gmail.com"><Mail className="size-4 shrink-0 text-primary" /> ylt.servicesdortmund@gmail.com</a>
            </div>
          </div>
          <div className="mt-8 md:mt-0">
            <ContactForm />
          </div>
        </div>
      </section>
      </main>

      <SiteFooter />
    </div>
  );
}
