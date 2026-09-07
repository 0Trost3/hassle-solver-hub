import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum | Kümmer" },
      { name: "description", content: "Anbieterkennzeichnung nach § 5 DDG für Kümmer." },
      { property: "og:title", content: "Impressum | Kümmer" },
      { property: "og:description", content: "Anbieterkennzeichnung nach § 5 DDG für Kümmer." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ImpressumPage,
});

function ImpressumPage() {
  return (
    <div className="mx-auto max-w-[440px] px-5 pb-16 md:max-w-3xl">
      <SiteHeader />
      <h1 className="pt-6 text-[30px] font-semibold tracking-tight">Impressum</h1>

      <div className="panel mt-6 space-y-5 p-5 text-[14px] leading-relaxed text-foreground/70">
        <p className="rounded-xl bg-warning/12 px-4 py-3 text-[13px] text-warning ring-1 ring-warning/25">
          Platzhalter: Bitte ersetze die folgenden Angaben durch deine echten Unternehmensdaten,
          bevor die Seite online geht.
        </p>
        <section>
          <h2 className="text-[15px] font-semibold text-foreground">Angaben gemäß § 5 DDG</h2>
          <p className="mt-2">
            [Firmenname]
            <br />
            [Straße und Hausnummer]
            <br />
            [PLZ Ort]
          </p>
        </section>
        <section>
          <h2 className="text-[15px] font-semibold text-foreground">Kontakt</h2>
          <p className="mt-2">
            Telefon: [Telefonnummer]
            <br />
            E-Mail: [E-Mail-Adresse]
          </p>
        </section>
        <section>
          <h2 className="text-[15px] font-semibold text-foreground">Vertreten durch</h2>
          <p className="mt-2">[Name der vertretungsberechtigten Person]</p>
        </section>
        <section>
          <h2 className="text-[15px] font-semibold text-foreground">Registereintrag / USt-IdNr.</h2>
          <p className="mt-2">
            [Registergericht und Nummer, falls vorhanden]
            <br />
            [Umsatzsteuer-Identifikationsnummer, falls vorhanden]
          </p>
        </section>
        <section>
          <h2 className="text-[15px] font-semibold text-foreground">Hinweis zur Tätigkeit</h2>
          <p className="mt-2">
            Wir sind ein Kommunikations- und Problemlösungsdienstleister. Wir bieten keine
            Rechtsberatung an und erbringen keine Rechtsdienstleistungen im Sinne des RDG.
          </p>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
