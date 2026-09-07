import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  CONTACT_CHANNELS,
  PROBLEM_TYPES,
  addBusinessDays,
  parseEuroToCents,
  type ContactChannel,
  type ProblemType,
} from "@/lib/case-meta";

export const Route = createFileRoute("/fall-erstellen")({
  head: () => ({
    meta: [
      { title: "Problem schildern – wir übernehmen das Gespräch | Kümmer" },
      {
        name: "description",
        content:
          "Erzähl uns in wenigen Schritten, was mit deinem Handwerker schiefläuft. Wir melden uns persönlich und übernehmen die Kommunikation.",
      },
      { property: "og:title", content: "Problem schildern – wir übernehmen das Gespräch" },
      {
        property: "og:description",
        content: "In wenigen Schritten erklärt – den Rest übernehmen wir persönlich.",
      },
    ],
  }),
  component: FallErstellen,
});

const SCHRITTE = ["Du", "Dienstleister", "Auftrag", "Problem", "Unterlagen", "Übersicht"];

const stepSchemas = [
  z.object({
    firstName: z.string().trim().min(2, "Bitte gib deinen Vornamen an.").max(80),
    lastName: z.string().trim().min(2, "Bitte gib deinen Nachnamen an.").max(80),
    phone: z.string().trim().min(5, "Bitte gib eine Telefonnummer an.").max(40),
  }),
  z.object({
    providerCompany: z.string().trim().min(2, "Bitte nenne den Dienstleister.").max(160),
  }),
  z.object({}),
  z.object({
    problemDescription: z
      .string()
      .trim()
      .min(20, "Beschreibe kurz, was passiert ist (mind. 20 Zeichen).")
      .max(4000),
  }),
  z.object({}),
  z.object({}),
];

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  preferredContact: ContactChannel;
  providerCompany: string;
  providerContactPerson: string;
  providerPhone: string;
  providerEmail: string;
  serviceType: string;
  orderDate: string;
  agreedEnd: string;
  agreedPrice: string;
  paid: string;
  problemTypes: ProblemType[];
  problemSince: string;
  problemDescription: string;
  desiredOutcome: string;
};

const initial: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  preferredContact: "phone",
  providerCompany: "",
  providerContactPerson: "",
  providerPhone: "",
  providerEmail: "",
  serviceType: "",
  orderDate: "",
  agreedEnd: "",
  agreedPrice: "",
  paid: "",
  problemTypes: [],
  problemSince: "",
  problemDescription: "",
  desiredOutcome: "",
};

const inputClass =
  "mt-1.5 min-h-[50px] w-full rounded-xl bg-surface px-4 text-[15px] ring-1 ring-border outline-none focus:ring-primary/60";
const labelClass = "text-[13px] font-medium text-foreground/70";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function FallErstellen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function next() {
    const schema = stepSchemas[step];
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Bitte prüfe deine Angaben.");
      return;
    }
    if (step === 3 && form.problemTypes.length === 0) {
      toast.error("Bitte wähle mindestens eine Problemart.");
      return;
    }
    setStep((s) => Math.min(s + 1, SCHRITTE.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    if (!user) {
      navigate({ to: "/anmelden", search: { weiter: "/fall-erstellen" } });
      toast.message("Bitte melde dich kurz an, damit wir deinen Fall sicher speichern.");
      return;
    }
    setBusy(true);
    try {
      await supabase.from("profiles").upsert({
        id: user.id,
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        email: user.email ?? null,
        preferred_contact: form.preferredContact,
      });

      const { data: created, error } = await supabase
        .from("cases")
        .insert({
          customer_id: user.id,
          provider_company: form.providerCompany,
          provider_contact_person: form.providerContactPerson || null,
          provider_phone: form.providerPhone || null,
          provider_email: form.providerEmail || null,
          service_type: form.serviceType || null,
          order_date: form.orderDate || null,
          agreed_end: form.agreedEnd || null,
          agreed_price_cents: parseEuroToCents(form.agreedPrice),
          paid_cents: parseEuroToCents(form.paid),
          problem_types: form.problemTypes,
          problem_since: form.problemSince || null,
          problem_description: form.problemDescription,
          desired_outcome: form.desiredOutcome || null,
          status: "created",
          deadline_at: addBusinessDays(new Date(), 2).toISOString(),
        })
        .select("id")
        .single();
      if (error) throw error;

      for (const file of files) {
        const path = `${created.id}/${crypto.randomUUID()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("case-documents")
          .upload(path, file);
        if (uploadError) continue;
        await supabase.from("case_documents").insert({
          case_id: created.id,
          file_name: file.name,
          storage_path: path,
          mime_type: file.type || null,
          size_bytes: file.size,
          uploaded_by: user.id,
        });
      }

      toast.success("Dein Fall ist bei uns. Wir melden uns persönlich.");
      navigate({ to: "/meine-faelle/$caseId", params: { caseId: created.id } });
    } catch (err) {
      console.error(err);
      toast.error("Dein Fall konnte nicht gespeichert werden. Bitte versuche es erneut.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-[440px] px-5 pb-16 md:max-w-2xl">
      <SiteHeader />

      <section className="pt-4">
        <p className="text-[12px] font-medium tracking-[0.14em] text-foreground/45 uppercase">
          Schritt {step + 1} von {SCHRITTE.length} · {SCHRITTE[step]}
        </p>
        <div className="mt-3 flex gap-1.5">
          {SCHRITTE.map((s, i) => (
            <span
              key={s}
              className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-foreground/12"}`}
            />
          ))}
        </div>
      </section>

      <div className="panel mt-6 space-y-4 p-5">
        {step === 0 && (
          <>
            <h1 className="text-[21px] font-semibold tracking-tight">Wie erreichen wir dich?</h1>
            <p className="text-[13.5px] text-foreground/55">
              Wir rufen dich persönlich an – kein automatisierter Verteiler.
            </p>
            <Field label="Vorname">
              <input
                className={inputClass}
                value={form.firstName}
                maxLength={80}
                onChange={(e) => set("firstName", e.target.value)}
              />
            </Field>
            <Field label="Nachname">
              <input
                className={inputClass}
                value={form.lastName}
                maxLength={80}
                onChange={(e) => set("lastName", e.target.value)}
              />
            </Field>
            <Field label="Telefonnummer">
              <input
                className={inputClass}
                value={form.phone}
                maxLength={40}
                inputMode="tel"
                onChange={(e) => set("phone", e.target.value)}
              />
            </Field>
            <Field label="So möchtest du kontaktiert werden">
              <select
                className={inputClass}
                value={form.preferredContact}
                onChange={(e) => set("preferredContact", e.target.value as ContactChannel)}
              >
                {CONTACT_CHANNELS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="text-[21px] font-semibold tracking-tight">Um wen geht es?</h1>
            <Field label="Firma des Dienstleisters">
              <input
                className={inputClass}
                value={form.providerCompany}
                maxLength={160}
                onChange={(e) => set("providerCompany", e.target.value)}
              />
            </Field>
            <Field label="Ansprechpartner (optional)">
              <input
                className={inputClass}
                value={form.providerContactPerson}
                maxLength={120}
                onChange={(e) => set("providerContactPerson", e.target.value)}
              />
            </Field>
            <Field label="Telefonnummer (optional)">
              <input
                className={inputClass}
                value={form.providerPhone}
                maxLength={40}
                onChange={(e) => set("providerPhone", e.target.value)}
              />
            </Field>
            <Field label="E-Mail (optional)">
              <input
                className={inputClass}
                type="email"
                value={form.providerEmail}
                maxLength={255}
                onChange={(e) => set("providerEmail", e.target.value)}
              />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-[21px] font-semibold tracking-tight">Was war vereinbart?</h1>
            <Field label="Art der Leistung">
              <input
                className={inputClass}
                value={form.serviceType}
                maxLength={120}
                placeholder="z. B. Badsanierung"
                onChange={(e) => set("serviceType", e.target.value)}
              />
            </Field>
            <Field label="Auftragsdatum">
              <input
                className={inputClass}
                type="date"
                value={form.orderDate}
                onChange={(e) => set("orderDate", e.target.value)}
              />
            </Field>
            <Field label="Vereinbarte Fertigstellung">
              <input
                className={inputClass}
                type="date"
                value={form.agreedEnd}
                onChange={(e) => set("agreedEnd", e.target.value)}
              />
            </Field>
            <Field label="Vereinbarter Preis (€)">
              <input
                className={inputClass}
                inputMode="decimal"
                value={form.agreedPrice}
                maxLength={16}
                placeholder="4800"
                onChange={(e) => set("agreedPrice", e.target.value)}
              />
            </Field>
            <Field label="Bereits gezahlt (€)">
              <input
                className={inputClass}
                inputMode="decimal"
                value={form.paid}
                maxLength={16}
                onChange={(e) => set("paid", e.target.value)}
              />
            </Field>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-[21px] font-semibold tracking-tight">Was läuft schief?</h1>
            <div className="flex flex-wrap gap-2">
              {PROBLEM_TYPES.map((p) => {
                const active = form.problemTypes.includes(p.value);
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() =>
                      set(
                        "problemTypes",
                        active
                          ? form.problemTypes.filter((v) => v !== p.value)
                          : [...form.problemTypes, p.value],
                      )
                    }
                    className={`min-h-[44px] rounded-xl px-4 text-[13.5px] font-medium ring-1 transition-colors ${
                      active
                        ? "bg-primary/20 text-foreground ring-primary/45"
                        : "bg-surface text-foreground/70 ring-border"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
            <Field label="Seit wann besteht das Problem?">
              <input
                className={inputClass}
                type="date"
                value={form.problemSince}
                onChange={(e) => set("problemSince", e.target.value)}
              />
            </Field>
            <Field label="Was ist passiert?">
              <textarea
                rows={5}
                maxLength={4000}
                className="mt-1.5 w-full resize-none rounded-xl bg-surface px-4 py-3 text-[15px] ring-1 ring-border outline-none focus:ring-primary/60"
                value={form.problemDescription}
                onChange={(e) => set("problemDescription", e.target.value)}
                placeholder="Erzähl es so, wie du es einem Bekannten erzählen würdest."
              />
            </Field>
            <Field label="Was wäre für dich eine gute Lösung? (optional)">
              <textarea
                rows={3}
                maxLength={1000}
                className="mt-1.5 w-full resize-none rounded-xl bg-surface px-4 py-3 text-[15px] ring-1 ring-border outline-none focus:ring-primary/60"
                value={form.desiredOutcome}
                onChange={(e) => set("desiredOutcome", e.target.value)}
              />
            </Field>
          </>
        )}

        {step === 4 && (
          <>
            <h1 className="text-[21px] font-semibold tracking-tight">Unterlagen (optional)</h1>
            <p className="text-[13.5px] text-foreground/55">
              Angebot, Rechnung, Nachrichtenverlauf – alles, was hilft. Maximal 15 MB pro Datei.
            </p>
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              className="w-full rounded-xl bg-surface px-4 py-3 text-[13.5px] ring-1 ring-border file:mr-3 file:rounded-lg file:border-0 file:bg-primary/20 file:px-3 file:py-1.5 file:text-[13px] file:text-foreground"
            />
            {files.length > 0 && (
              <ul className="space-y-1.5 text-[13px] text-foreground/60">
                {files.map((f) => (
                  <li key={f.name}>{f.name}</li>
                ))}
              </ul>
            )}
          </>
        )}

        {step === 5 && (
          <>
            <h1 className="text-[21px] font-semibold tracking-tight">Passt das so?</h1>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
              {[
                ["Name", `${form.firstName} ${form.lastName}`.trim() || "–"],
                ["Telefon", form.phone || "–"],
                ["Dienstleister", form.providerCompany || "–"],
                ["Leistung", form.serviceType || "–"],
                [
                  "Problem",
                  form.problemTypes
                    .map((t) => PROBLEM_TYPES.find((p) => p.value === t)?.label)
                    .join(", ") || "–",
                ],
                ["Unterlagen", files.length ? `${files.length} Datei(en)` : "keine"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[11px] text-foreground/45">{k}</dt>
                  <dd className="mt-0.5 text-[14px] font-medium text-foreground/90">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="rounded-xl bg-primary/12 px-4 py-3 text-[13px] leading-snug text-foreground/80 ring-1 ring-primary/25">
              Nach dem Absenden prüfen wir deinen Fall und melden uns persönlich – in der Regel
              innerhalb von 2 Werktagen.
            </p>
            {!user && (
              <p className="text-[13px] text-foreground/55">
                Zum Speichern brauchst du ein kurzes Konto – damit nur du deinen Fall sehen kannst.
              </p>
            )}
          </>
        )}

        <div className="flex gap-2 pt-2">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="min-h-[50px] flex-1 rounded-xl bg-surface text-[14.5px] font-medium ring-1 ring-border"
            >
              Zurück
            </button>
          )}
          {step < SCHRITTE.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="min-h-[52px] flex-[2] rounded-xl bg-primary text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
            >
              Weiter
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={busy}
              className="min-h-[52px] flex-[2] rounded-xl bg-primary text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-deep disabled:opacity-60"
            >
              {busy ? "Wird gesendet …" : "Fall absenden"}
            </button>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
