/**
 * Fachliche Metadaten rund um Fälle: Status, Problemarten, Kanäle,
 * Formatierung und Fristberechnung. Eine einzige Quelle der Wahrheit,
 * damit Kundenbereich und internes Dashboard identisch benennen.
 */
import type { Database } from "@/integrations/supabase/types";

export type CaseStatus = Database["public"]["Enums"]["case_status"];
export type CasePriority = Database["public"]["Enums"]["case_priority"];
export type ProblemType = Database["public"]["Enums"]["problem_type"];
export type ContactChannel = Database["public"]["Enums"]["contact_channel"];
export type CaseRow = Database["public"]["Tables"]["cases"]["Row"];

export type StatusTone = "neutral" | "progress" | "positive" | "attention";

export const CASE_STATUS: Record<
  CaseStatus,
  { label: string; tone: StatusTone; customerHint: string }
> = {
  created: {
    label: "Ticket erstellt",
    tone: "neutral",
    customerHint: "Dein Fall ist bei uns eingegangen.",
  },
  reviewing: {
    label: "Informationen werden geprüft",
    tone: "progress",
    customerHint: "Wir prüfen deine Angaben und melden uns persönlich bei dir.",
  },
  call_pending: {
    label: "Persönliches Gespräch ausstehend",
    tone: "progress",
    customerHint: "Wir sprechen gemeinsam über deinen Fall.",
  },
  accepted: {
    label: "Fall angenommen",
    tone: "progress",
    customerHint: "Wir haben deinen Fall übernommen.",
  },
  contacting_provider: {
    label: "Dienstleister wird kontaktiert",
    tone: "progress",
    customerHint: "Wir nehmen Kontakt zum Dienstleister auf.",
  },
  awaiting_provider: {
    label: "Rückmeldung ausstehend",
    tone: "progress",
    customerHint: "Wir warten auf die Rückmeldung des Dienstleisters und bleiben dran.",
  },
  negotiating: {
    label: "Lösung wird verhandelt",
    tone: "progress",
    customerHint: "Wir stimmen eine Lösung ab.",
  },
  agreement_reached: {
    label: "Vereinbarung erzielt",
    tone: "positive",
    customerHint: "Es gibt eine verbindliche Vereinbarung.",
  },
  closed: {
    label: "Fall abgeschlossen",
    tone: "positive",
    customerHint: "Dein Fall ist abgeschlossen.",
  },
  no_agreement: {
    label: "Keine Einigung erzielt",
    tone: "attention",
    customerHint: "Wir konnten keine Einigung erreichen und besprechen die nächsten Schritte.",
  },
  escalated: {
    label: "Weitere Unterstützung erforderlich",
    tone: "attention",
    customerHint: "Wir schauen gemeinsam, welche Stelle dir weiterhelfen kann.",
  },
};

/** Reihenfolge für die Fortschrittsanzeige im Kundenbereich. */
export const STATUS_FLOW: CaseStatus[] = [
  "created",
  "reviewing",
  "call_pending",
  "accepted",
  "contacting_provider",
  "awaiting_provider",
  "negotiating",
  "agreement_reached",
  "closed",
];

export const PROBLEM_TYPES: { value: ProblemType; label: string }[] = [
  { value: "no_response", label: "Handwerker meldet sich nicht" },
  { value: "unreachable", label: "Dienstleister nicht erreichbar" },
  { value: "delayed", label: "Auftrag verzögert" },
  { value: "unfinished", label: "Arbeit nicht fertig" },
  { value: "missed_appointment", label: "Termin nicht eingehalten" },
  { value: "other", label: "Sonstiges" },
];

export const CONTACT_CHANNELS: { value: ContactChannel; label: string }[] = [
  { value: "phone", label: "Telefonat" },
  { value: "email", label: "E-Mail" },
  { value: "sms", label: "SMS" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "in_person", label: "Persönliches Gespräch" },
  { value: "letter", label: "Brief" },
  { value: "other", label: "Sonstiges" },
];

export const PRIORITIES: { value: CasePriority; label: string }[] = [
  { value: "low", label: "Niedrig" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "Hoch" },
  { value: "urgent", label: "Dringend" },
];

export function problemTypeLabel(value: ProblemType): string {
  return PROBLEM_TYPES.find((p) => p.value === value)?.label ?? value;
}

export function channelLabel(value: ContactChannel): string {
  return CONTACT_CHANNELS.find((c) => c.value === value)?.label ?? value;
}

export function formatEuro(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "–";
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function parseEuroToCents(input: string): number | null {
  const clean = input.replace(/\s|€|\./g, "").replace(",", ".");
  if (!clean) return null;
  const value = Number(clean);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "–";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "–";
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "–";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "–";
  return d.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Werktage addieren – Samstag und Sonntag werden übersprungen. */
export function addBusinessDays(from: Date, days: number): Date {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6) added += 1;
  }
  return d;
}

/** Verbleibende Werktage bis zu einer Frist (negativ = überschritten). */
export function businessDaysLeft(deadline: string | null | undefined): number | null {
  if (!deadline) return null;
  const end = new Date(deadline);
  if (Number.isNaN(end.getTime())) return null;
  const start = new Date();
  const sign = end >= start ? 1 : -1;
  const a = sign > 0 ? start : end;
  const b = sign > 0 ? end : start;
  let count = 0;
  const cursor = new Date(a);
  cursor.setHours(0, 0, 0, 0);
  const target = new Date(b);
  target.setHours(0, 0, 0, 0);
  while (cursor < target) {
    cursor.setDate(cursor.getDate() + 1);
    const wd = cursor.getDay();
    if (wd !== 0 && wd !== 6) count += 1;
  }
  return sign * count;
}

export function deadlineState(deadline: string | null | undefined): {
  label: string;
  tone: StatusTone;
} | null {
  const left = businessDaysLeft(deadline);
  if (left === null) return null;
  if (left < 0) return { label: "Frist überschritten", tone: "attention" };
  if (left === 0) return { label: "Frist endet heute", tone: "progress" };
  if (left === 1) return { label: "Noch 1 Werktag", tone: "positive" };
  return { label: `Noch ${left} Werktage`, tone: "positive" };
}
