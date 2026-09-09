import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { StatusBadge, ToneBadge } from "@/components/StatusBadge";
import { CASE_STATUS, deadlineState, formatDate, type CaseStatus } from "@/lib/case-meta";
import { formatSlotFull } from "@/lib/slots";

export const Route = createFileRoute("/_authenticated/intern")({
  head: () => ({
    meta: [
      { title: "Interner Bereich | YLT Services" },
      { name: "description", content: "Fallübersicht und Bearbeitung für das Team." },
      { property: "og:title", content: "Interner Bereich | YLT Services" },
      { property: "og:description", content: "Fallübersicht und Bearbeitung für das Team." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: InternPage,
});

const FILTER: { key: "offen" | "alle" | "frist"; label: string }[] = [
  { key: "offen", label: "Offen" },
  { key: "frist", label: "Frist kritisch" },
  { key: "alle", label: "Alle" },
];

function InternPage() {
  const { isStaff, loading, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"offen" | "alle" | "frist">("offen");

  const { data, isLoading } = useQuery({
    queryKey: ["intern-faelle"],
    enabled: isStaff,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cases")
        .select(
          "id, ticket_number, status, priority, provider_company, created_at, deadline_at, next_step, customer_id",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const terminQuery = useQuery({
    queryKey: ["intern-termine"],
    enabled: isStaff,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("case_id, scheduled_at, status")
        .neq("status", "cancelled")
        .order("scheduled_at", { ascending: true });
      if (error) throw error;
      const map: Record<string, string> = {};
      for (const a of data ?? []) if (!map[a.case_id]) map[a.case_id] = a.scheduled_at;
      return map;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: CaseStatus }) => {
      const { error } = await supabase.from("cases").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["intern-faelle"] });
      toast.success("Status aktualisiert.");
    },
    onError: () => toast.error("Status konnte nicht geändert werden."),
  });

  if (loading) {
    return (
      <div className="mx-auto max-w-[440px] px-5">
        <SiteHeader />
        <p className="pt-10 text-[14px] text-foreground/50">Wird geladen …</p>
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="mx-auto max-w-[440px] px-5 pb-16">
        <SiteHeader />
        <div className="panel mt-8 p-5">
          <h1 className="text-[20px] font-semibold tracking-tight">Kein Zugriff</h1>
          <p className="mt-2 text-[14px] text-foreground/60">
            Dieser Bereich ist dem Team vorbehalten.
          </p>
          <Link to="/meine-faelle" className="mt-4 inline-block text-[14px] font-medium text-primary">
            Zu meinen Fällen
          </Link>
        </div>
      </div>
    );
  }

  const closed: CaseStatus[] = ["closed", "no_agreement"];
  const list = (data ?? []).filter((c) => {
    if (filter === "alle") return true;
    if (filter === "offen") return !closed.includes(c.status as CaseStatus);
    const state = deadlineState(c.deadline_at);
    return state?.tone === "attention" || state?.tone === "progress";
  });

  return (
    <div className="mx-auto max-w-[440px] px-5 pb-16 md:max-w-4xl">
      <SiteHeader />

      <section className="flex items-start justify-between pt-6">
        <div>
          <h1 className="text-[28px] leading-[1.1] font-semibold tracking-tight">
            Interner Bereich
          </h1>
          <p className="mt-2 text-[14px] text-foreground/60">
            {data?.length ?? 0} Fälle insgesamt · {list.length} in dieser Ansicht
          </p>
        </div>
        <button
          onClick={() => signOut()}
          className="mt-2 text-[13px] text-foreground/45 hover:text-foreground/70"
        >
          Abmelden
        </button>
      </section>

      <div className="mt-5 flex gap-2">
        {FILTER.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`min-h-[42px] rounded-xl px-4 text-[13.5px] font-medium ring-1 ${
              filter === f.key
                ? "bg-primary/20 text-foreground ring-primary/45"
                : "bg-surface text-foreground/65 ring-border"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {isLoading && (
          <div className="panel-quiet px-4 py-6 text-[14px] text-foreground/50">Wird geladen …</div>
        )}
        {!isLoading && list.length === 0 && (
          <div className="panel-quiet px-4 py-6 text-[14px] text-foreground/50">
            Keine Fälle in dieser Ansicht.
          </div>
        )}
        {list.map((c) => {
          const frist = deadlineState(c.deadline_at);
          return (
            <article key={c.id} className="panel p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] text-foreground/50 tabular-nums">
                  #{c.ticket_number}
                </span>
                <span className="text-[12px] text-foreground/40">{formatDate(c.created_at)}</span>
              </div>
              <p className="mt-2 text-[16px] font-medium">{c.provider_company}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusBadge status={c.status as CaseStatus} />
                {frist && <ToneBadge tone={frist.tone}>{frist.label}</ToneBadge>}
              </div>
              <p className="mt-3 text-[13px] text-foreground/55">
                {c.next_step ?? CASE_STATUS[c.status as CaseStatus].customerHint}
              </p>
              <p className="mt-2 text-[13px] text-foreground/70">
                <span className="text-foreground/45">Telefontermin: </span>
                {terminQuery.data?.[c.id]
                  ? formatSlotFull(terminQuery.data[c.id])
                  : "noch nicht gebucht"}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <select
                  value={c.status}
                  onChange={(e) =>
                    updateStatus.mutate({ id: c.id, status: e.target.value as CaseStatus })
                  }
                  className="min-h-[44px] flex-1 rounded-xl bg-surface px-3 text-[13.5px] ring-1 ring-border outline-none focus:ring-primary/60"
                >
                  {(Object.keys(CASE_STATUS) as CaseStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {CASE_STATUS[s].label}
                    </option>
                  ))}
                </select>
                <Link
                  to="/meine-faelle/$caseId"
                  params={{ caseId: c.id }}
                  className="flex min-h-[44px] items-center rounded-xl bg-surface px-4 text-[13.5px] font-medium ring-1 ring-border hover:bg-surface-strong"
                >
                  Fall öffnen
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <SiteFooter />
    </div>
  );
}
