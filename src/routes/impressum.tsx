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
        <section>
          <h2 className="text-[15px] font-semibold text-foreground">Angaben gemäß § 5 DDG</h2>
          <p className="mt-2">
            YLT Services
            <br />
            Inhaber: Yannic Trost
            <br />
            Meitnerweg 4
            <br />
            44227 Dortmund
            <br />
            Deutschland
          </p>
        </section>
        <section>
          <h2 className="text-[15px] font-semibold text-foreground">Kontakt</h2>
          <p className="mt-2">
            Telefon:{" "}
            <a href="tel:+4915770361963" className="text-primary hover:underline">
              +49 157 70361963
            </a>
            <br />
            E-Mail:{" "}
            <a href="mailto:ylt.servicesdortmund@gmail.com" className="text-primary hover:underline">
              ylt.servicesdortmund@gmail.com
            </a>
          </p>
        </section>
        <section>
          <h2 className="text-[15px] font-semibold text-foreground">Vertreten durch</h2>
          <p className="mt-2">Yannic Trost (Inhaber)</p>
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
