import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutz | YLT Services" },
      {
        name: "description",
        content:
          "Datenschutzhinweise zur Website und zur Kontaktaufnahme mit YLT Services.",
      },
      { property: "og:title", content: "Datenschutz | YLT Services" },
      {
        property: "og:description", content: "Datenschutzhinweise zur Website und Kontaktaufnahme.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DatenschutzPage,
});

const ABSCHNITTE = [
  {
    title: "Kontaktaufnahme per E-Mail",
    text: "Das Kontaktformular speichert und überträgt keine Eingaben. Es erstellt ausschließlich auf deinem Gerät einen vorbereiteten Entwurf in deinem E-Mail-Programm. Erst wenn du diesen Entwurf selbst absendest, erhalten wir deine Nachricht.",
  },
  {
    title: "Zweck und Rechtsgrundlage",
    text: "Daten aus einer von dir gesendeten E-Mail verarbeiten wir zur Bearbeitung deiner Anfrage und zur Durchführung vorvertraglicher oder vertraglicher Maßnahmen nach Art. 6 Abs. 1 lit. b DSGVO.",
  },
  {
    title: "E-Mail-Anbieter",
    text: "Beim Versand gelten zusätzlich die Datenschutzbestimmungen deines E-Mail-Anbieters. Die Website selbst versendet keine Nachricht und gibt deine Formulareingaben nicht an einen eigenen Server oder eine Datenbank weiter.",
  },
  {
    title: "Speicherdauer und Löschung",
    text: "E-Mail-Nachrichten und die darin enthaltenen Daten speichern wir nur so lange, wie es für die Bearbeitung deiner Anfrage und gesetzliche Aufbewahrungspflichten erforderlich ist.",
  },
  {
    title: "Deine Rechte",
    text: "Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Eine kurze Nachricht an uns genügt.",
  },
  {
    title: "Tracking",
    text: "Wir setzen kein Werbe-Tracking und keine Marketing-Cookies ein. Es werden nur technisch notwendige Daten verarbeitet.",
  },
];

function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-[440px] px-5 pb-16 md:max-w-3xl">
      <SiteHeader />
      <h1 className="pt-6 text-[30px] font-semibold tracking-tight">Datenschutz</h1>
      <p className="mt-3 max-w-[46ch] text-[14px] leading-relaxed text-foreground/60">
        Wir verarbeiten so wenig Daten wie möglich – und nur die, die wir brauchen, um deinen Fall
        zu bearbeiten.
      </p>

      <div className="panel mt-6 space-y-5 p-5">
        <section>
          <h2 className="text-[15px] font-semibold text-foreground">Verantwortlicher</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-foreground/65">
            YLT Services, Inhaber: Yannic Trost, Meitnerweg 4, 44227 Dortmund, Deutschland.
            <br />
            Telefon: +49 157 70361963 · E-Mail: ylt.servicesdortmund@gmail.com
          </p>
        </section>
        {ABSCHNITTE.map((a) => (
          <section key={a.title}>
            <h2 className="text-[15px] font-semibold text-foreground">{a.title}</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-foreground/65">{a.text}</p>
          </section>
        ))}
      </div>

      <SiteFooter />
    </div>
  );
}
