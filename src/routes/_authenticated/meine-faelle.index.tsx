import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { StatusBadge } from "@/components/StatusBadge";
import { CASE_STATUS, formatDate, type CaseStatus } from "@/lib/case-meta";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/meine-faelle/")({
  head: () => ({
    meta: [
      { title: "Meine Fälle | YLT Services" },
      { name: "description", content: "Der aktuelle Stand deiner Fälle auf einen Blick." },
      { property: "og:title", content: "Meine Fälle | YLT Services" },
      { property: "og:description", content: "Der aktuelle Stand deiner Fälle auf einen Blick." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MeineFaelle,
});

function MeineFaelle() {
  const { signOut } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["meine-faelle"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("id, ticket_number, status, provider_company, created_at, next_step")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="mx-auto max-w-[440px] px-5 pb-16 md:max-w-3xl">
      <SiteHeader />
      <section className="flex items-start justify-between pt-6">
        <div>
          <h1 className="text-[30px] leading-[1.1] font-semibold tracking-tight">Meine Fälle</h1>
          <p className="mt-2 text-[14px] text-foreground/60">
            Hier siehst du, wo dein Anliegen gerade steht.
          </p>
        </div>
        <button
          onClick={() => signOut()}
          className="mt-2 text-[13px] text-foreground/45 hover:text-foreground/70"
        >
          Abmelden
        </button>
      </section>

      <div className="mt-6 flex flex-col gap-3">
        {isLoading && <div className="panel-quiet px-4 py-6 text-[14px] text-foreground/50">Wird geladen …</div>}
        {error && (
          <div className="panel-quiet px-4 py-6 text-[14px] text-destructive">
            Die Fälle konnten gerade nicht geladen werden. Bitte lade die Seite neu.
          </div>
        )}
        {data?.length === 0 && (
          <div className="panel p-5">
            <p className="text-[15px] font-medium">Du hast noch keinen Fall angelegt.</p>
            <p className="mt-1.5 text-[13.5px] text-foreground/55">
              Erzähl uns kurz, was passiert ist – wir übernehmen den Rest.
            </p>
            <Link
              to="/fall-erstellen"
              className="mt-4 flex min-h-[50px] items-center justify-center rounded-xl bg-primary text-[15px] font-semibold text-primary-foreground"
            >
              Problem schildern
            </Link>
          </div>
        )}
        {data?.map((c) => (
          <Link
            key={c.id}
            to="/meine-faelle/$caseId"
            params={{ caseId: c.id }}
            className="panel p-5 transition-colors hover:bg-surface-strong"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] text-foreground/50 tabular-nums">
                #{c.ticket_number}
              </span>
              <span className="text-[12px] text-foreground/40">{formatDate(c.created_at)}</span>
            </div>
            <p className="mt-2.5 text-[16px] font-medium">{c.provider_company}</p>
            <div className="mt-3">
              <StatusBadge status={c.status as CaseStatus} />
            </div>
            <p className="mt-3 text-[13px] leading-snug text-foreground/55">
              {c.next_step ?? CASE_STATUS[c.status as CaseStatus].customerHint}
            </p>
          </Link>
        ))}
      </div>

      <SiteFooter />
    </div>
  );
}
