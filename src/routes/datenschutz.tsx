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
          "Wie wir mit deinen Daten umgehen: Zweck, Speicherung, Zugriff, Löschung und deine Rechte nach DSGVO.",
      },
      { property: "og:title", content: "Datenschutz | YLT Services" },
      {
        property: "og:description",
        content: "Zweck, Speicherung, Zugriff, Löschung und deine Rechte nach DSGVO.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DatenschutzPage,
});

const ABSCHNITTE = [
  {
    title: "Welche Daten wir verarbeiten",
    text: "Für die Bearbeitung deines Falls verarbeiten wir deine Kontaktdaten, die Angaben zum Dienstleister und zum Auftrag, deine Problembeschreibung, die dokumentierten Kontaktversuche sowie die von dir hochgeladenen Dokumente.",
  },
  {
    title: "Zweck und Rechtsgrundlage",
    text: "Wir verarbeiten diese Daten ausschließlich, um die Kommunikation mit deinem Dienstleister in deinem Auftrag zu übernehmen (Art. 6 Abs. 1 lit. b DSGVO – Vertragserfüllung).",
  },
  {
    title: "Zugriff",
    text: "Deine Falldaten sind technisch so abgesichert, dass ausschließlich du selbst und autorisierte Mitarbeitende darauf zugreifen können. Interne Notizen sind für dich nicht sichtbar und werden auch nicht über die Kundenschnittstelle ausgeliefert.",
  },
  {
    title: "Dokumente",
    text: "Hochgeladene Dateien liegen in einem nicht öffentlichen Speicher. Zugriff ist nur über kurzlebige, persönlich signierte Links möglich.",
  },
  {
    title: "Speicherdauer und Löschung",
    text: "Wir speichern Falldaten nur so lange, wie es für die Bearbeitung und gesetzliche Aufbewahrungsfristen nötig ist. Auf Wunsch löschen wir deinen Fall.",
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
