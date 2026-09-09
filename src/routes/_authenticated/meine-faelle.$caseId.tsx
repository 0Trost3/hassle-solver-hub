import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { StatusBadge, ToneBadge } from "@/components/StatusBadge";
import { SlotPicker } from "@/components/booking/SlotPicker";
import { formatSlotFull } from "@/lib/slots";
import {
  CASE_STATUS,
  STATUS_FLOW,
  channelLabel,
  deadlineState,
  formatDate,
  formatDateTime,
  formatEuro,
  problemTypeLabel,
  type CaseStatus,
  type ContactChannel,
  type ProblemType,
} from "@/lib/case-meta";

export const Route = createFileRoute("/_authenticated/meine-faelle/$caseId")({
  head: () => ({
    meta: [
      { title: "Fallstatus | YLT Services" },
      { name: "description", content: "Aktueller Stand, Verlauf und Nachrichten zu deinem Fall." },
      { property: "og:title", content: "Fallstatus | YLT Services" },
      {
        property: "og:description",
        content: "Aktueller Stand, Verlauf und Nachrichten zu deinem Fall.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FallDetail,
});

function FallDetail() {
  const { caseId } = useParams({ from: "/_authenticated/meine-faelle/$caseId" });
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const caseQuery = useQuery({
    queryKey: ["fall", caseId],
    queryFn: async () => {
      const { data, error } = await supabase.from("cases").select("*").eq("id", caseId).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const contactsQuery = useQuery({
    queryKey: ["fall-kontakte", caseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_contacts")
        .select("id, channel, occurred_at, note, outcome, author")
        .eq("case_id", caseId)
        .order("occurred_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const messagesQuery = useQuery({
    queryKey: ["fall-nachrichten", caseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_messages")
        .select("id, body, from_staff, created_at")
        .eq("case_id", caseId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const documentsQuery = useQuery({
    queryKey: ["fall-dokumente", caseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_documents")
        .select("id, file_name, storage_path, created_at")
        .eq("case_id", caseId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const appointmentQuery = useQuery({
    queryKey: ["fall-termin", caseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("id, scheduled_at, status")
        .eq("case_id", caseId)
        .neq("status", "cancelled")
        .order("scheduled_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const cancelAppointment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fall-termin", caseId] });
      queryClient.invalidateQueries({ queryKey: ["belegte-termine"] });
      toast.success("Termin abgesagt.");
    },
    onError: () => toast.error("Der Termin konnte nicht abgesagt werden."),
  });

  const sendMessage = useMutation({
    mutationFn: async (body: string) => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Nicht angemeldet");
      const { error } = await supabase
        .from("case_messages")
        .insert({ case_id: caseId, body, sender_id: auth.user.id, from_staff: false });
      if (error) throw error;
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["fall-nachrichten", caseId] });
      toast.success("Nachricht gesendet. Wir melden uns.");
    },
    onError: () => toast.error("Die Nachricht konnte nicht gesendet werden."),
  });

  async function openDocument(path: string) {
    const { data, error } = await supabase.storage
      .from("case-documents")
      .createSignedUrl(path, 60);
    if (error || !data) {
      toast.error("Das Dokument konnte nicht geöffnet werden.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  const fall = caseQuery.data;

  if (caseQuery.isLoading) {
    return (
      <div className="mx-auto max-w-[440px] px-5 pb-16">
        <SiteHeader />
        <p className="pt-10 text-[14px] text-foreground/50">Wird geladen …</p>
      </div>
    );
  }

  if (!fall) {
    return (
      <div className="mx-auto max-w-[440px] px-5 pb-16">
        <SiteHeader />
        <p className="pt-10 text-[15px]">Diesen Fall konnten wir nicht finden.</p>
        <Link to="/meine-faelle" className="mt-4 inline-block text-[14px] font-medium text-primary">
          Zurück zu meinen Fällen
        </Link>
      </div>
    );
  }

  const status = fall.status as CaseStatus;
  const flowIndex = STATUS_FLOW.indexOf(status);
  const frist = deadlineState(fall.deadline_at);

  return (
    <div className="mx-auto max-w-[440px] px-5 pb-16 md:max-w-3xl">
      <SiteHeader />

      <Link
        to="/meine-faelle"
        className="mt-2 inline-block text-[13px] text-foreground/45 hover:text-foreground/70"
      >
        ← Meine Fälle
      </Link>

      <section className="panel mt-4 p-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[12px] text-foreground/50 tabular-nums">
            #{fall.ticket_number}
          </span>
          <span className="text-[12px] text-foreground/40">{formatDate(fall.created_at)}</span>
        </div>
        <h1 className="mt-2.5 text-[22px] leading-tight font-semibold tracking-tight">
          {fall.provider_company}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge status={status} />
          {frist && <ToneBadge tone={frist.tone}>{frist.label}</ToneBadge>}
        </div>
        <div className="mt-5 flex items-start gap-3 rounded-[14px] bg-primary/12 px-4 py-3 ring-1 ring-primary/25">
          <span className="mt-0.5 shrink-0 text-base leading-none text-primary">→</span>
          <p className="text-[13px] leading-snug text-foreground/85">
            <span className="font-semibold text-foreground">Nächster Schritt:</span>{" "}
            {fall.next_step ?? CASE_STATUS[status].customerHint}
          </p>
        </div>
      </section>

      {/* Fortschritt */}
      {flowIndex >= 0 && (
        <section className="panel-quiet mt-3 p-5">
          <h2 className="text-[13px] font-medium tracking-[0.12em] text-foreground/45 uppercase">
            Fortschritt
          </h2>
          <ol className="mt-4 space-y-3">
            {STATUS_FLOW.map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span
                  className={`size-2 shrink-0 rounded-full ${
                    i < flowIndex ? "bg-primary/60" : i === flowIndex ? "bg-primary" : "bg-foreground/15"
                  }`}
                />
                <span
                  className={`text-[13.5px] ${
                    i <= flowIndex ? "text-foreground/85" : "text-foreground/35"
                  }`}
                >
                  {CASE_STATUS[s].label}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Telefontermin */}
      <section className="panel mt-3 p-5">
        <h2 className="text-[13px] font-medium tracking-[0.12em] text-foreground/45 uppercase">
          Telefontermin
        </h2>
        {appointmentQuery.data && !showPicker ? (
          <>
            <p className="mt-3 text-[15px] font-medium text-foreground/90">
              {formatSlotFull(appointmentQuery.data.scheduled_at)}
            </p>
            <p className="mt-1 text-[13px] text-foreground/50">
              30 Minuten – wir rufen dich an.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowPicker(true)}
                className="min-h-[48px] flex-1 rounded-xl bg-surface text-[14px] font-medium ring-1 ring-border"
              >
                Termin ändern
              </button>
              <button
                type="button"
                onClick={() => cancelAppointment.mutate(appointmentQuery.data!.id)}
                disabled={cancelAppointment.isPending}
                className="min-h-[48px] flex-1 rounded-xl bg-surface text-[14px] font-medium text-foreground/70 ring-1 ring-border disabled:opacity-60"
              >
                Termin absagen
              </button>
            </div>
          </>
        ) : showPicker ? (
          <div className="mt-4">
            <SlotPicker
              caseId={caseId}
              existingAppointmentId={appointmentQuery.data?.id ?? null}
              onBooked={() => setShowPicker(false)}
              onSkip={() => setShowPicker(false)}
              skipLabel="Abbrechen"
            />
          </div>
        ) : (
          <>
            <p className="mt-3 text-[13.5px] text-foreground/50">
              Noch kein Telefontermin. Such dir eine Zeit aus – Mo–Sa, 8 bis 20 Uhr.
            </p>
            <button
              type="button"
              onClick={() => setShowPicker(true)}
              className="mt-4 min-h-[48px] w-full rounded-xl bg-primary text-[14.5px] font-semibold text-primary-foreground"
            >
              Termin wählen
            </button>
          </>
        )}
      </section>

      {/* Falldaten */}
      <section className="panel mt-3 p-5">
        <h2 className="text-[13px] font-medium tracking-[0.12em] text-foreground/45 uppercase">
          Falldaten
        </h2>
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
          {[
            ["Leistung", fall.service_type ?? "–"],
            ["Auftragsdatum", formatDate(fall.order_date)],
            ["Fertigstellung", formatDate(fall.agreed_end)],
            ["Vereinbarter Preis", formatEuro(fall.agreed_price_cents)],
            ["Bereits gezahlt", formatEuro(fall.paid_cents)],
            [
              "Problem",
              (fall.problem_types as ProblemType[] | null)?.map(problemTypeLabel).join(", ") || "–",
            ],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[11px] text-foreground/45">{k}</dt>
              <dd className="mt-0.5 text-[14px] font-medium text-foreground/90">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-[13.5px] leading-relaxed text-foreground/60">
          {fall.problem_description}
        </p>
      </section>

      {/* Kommunikationsverlauf */}
      <section className="panel-quiet mt-3 p-5">
        <h2 className="text-[13px] font-medium tracking-[0.12em] text-foreground/45 uppercase">
          Was bisher passiert ist
        </h2>
        {contactsQuery.data?.length ? (
          <ul className="mt-4 space-y-4">
            {contactsQuery.data.map((c) => (
              <li key={c.id} className="border-l border-hairline pl-4">
                <div className="flex flex-wrap items-center gap-2 text-[12px] text-foreground/45">
                  <span>{formatDateTime(c.occurred_at)}</span>
                  <span>·</span>
                  <span>{channelLabel(c.channel as ContactChannel)}</span>
                  <span>·</span>
                  <span>{c.author === "staff" ? "YLT Services" : "Du"}</span>
                </div>
                <p className="mt-1 text-[13.5px] leading-snug text-foreground/80">{c.outcome ?? c.note}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-[13.5px] text-foreground/45">
            Sobald wir Kontakt aufnehmen, siehst du hier jeden Schritt.
          </p>
        )}
      </section>

      {/* Dokumente */}
      <section className="panel-quiet mt-3 p-5">
        <h2 className="text-[13px] font-medium tracking-[0.12em] text-foreground/45 uppercase">
          Dokumente
        </h2>
        {documentsQuery.data?.length ? (
          <ul className="mt-3 space-y-2">
            {documentsQuery.data.map((d) => (
              <li key={d.id}>
                <button
                  onClick={() => openDocument(d.storage_path)}
                  className="w-full rounded-xl bg-surface px-4 py-3 text-left text-[13.5px] font-medium ring-1 ring-border hover:bg-surface-strong"
                >
                  {d.file_name}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-[13.5px] text-foreground/45">Noch keine Dokumente hinterlegt.</p>
        )}
      </section>

      {/* Nachrichten */}
      <section className="panel mt-3 p-5">
        <h2 className="text-[13px] font-medium tracking-[0.12em] text-foreground/45 uppercase">
          Nachrichten
        </h2>
        <div className="mt-4 space-y-3">
          {messagesQuery.data?.map((m) => (
            <div
              key={m.id}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13.5px] leading-snug ${
                m.from_staff
                  ? "bg-surface text-foreground/85 ring-1 ring-border"
                  : "ml-auto bg-primary/18 text-foreground ring-1 ring-primary/25"
              }`}
            >
              <p>{m.body}</p>
              <p className="mt-1.5 text-[11px] text-foreground/40">{formatDateTime(m.created_at)}</p>
            </div>
          ))}
          {messagesQuery.data?.length === 0 && (
            <p className="text-[13.5px] text-foreground/45">
              Schreib uns hier, wenn dir noch etwas einfällt.
            </p>
          )}
        </div>
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            const body = message.trim();
            if (!body) return;
            if (body.length > 2000) {
              toast.error("Die Nachricht ist zu lang (max. 2000 Zeichen).");
              return;
            }
            sendMessage.mutate(body);
          }}
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="Deine Nachricht an uns"
            className="w-full resize-none rounded-xl bg-surface px-4 py-3 text-[14px] ring-1 ring-border outline-none focus:ring-primary/60"
          />
          <button
            type="submit"
            disabled={sendMessage.isPending}
            className="mt-2 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-primary text-[14.5px] font-semibold text-primary-foreground disabled:opacity-60"
          >
            Nachricht senden
          </button>
        </form>
      </section>

      <SiteFooter />
    </div>
  );
}
