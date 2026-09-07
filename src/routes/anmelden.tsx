import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

const searchSchema = z.object({
  weiter: z.string().optional(),
});

export const Route = createFileRoute("/anmelden")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Anmelden – deinen Fall verfolgen | Kümmer" },
      {
        name: "description",
        content:
          "Melde dich an, um den Stand deines Falls zu sehen, Nachrichten zu lesen und Dokumente hochzuladen.",
      },
      { property: "og:title", content: "Anmelden – deinen Fall verfolgen | Kümmer" },
      {
        property: "og:description",
        content: "Sieh jederzeit, wo dein Fall steht und was als Nächstes passiert.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AnmeldenPage,
});

const credentials = z.object({
  email: z.string().trim().email({ message: "Bitte gib eine gültige E-Mail-Adresse ein." }).max(255),
  password: z.string().min(8, { message: "Das Passwort braucht mindestens 8 Zeichen." }).max(72),
});

function safePath(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

function AnmeldenPage() {
  const { user, isStaff, loading } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: "/anmelden" });
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    const target = safePath(search.weiter) ?? (isStaff ? "/intern" : "/meine-faelle");
    navigate({ to: target, replace: true });
  }, [loading, user, isStaff, navigate, search.weiter]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = credentials.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Bitte prüfe deine Eingaben.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Konto erstellt. Du bist angemeldet.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unbekannter Fehler";
      toast.error(
        message.includes("Invalid login")
          ? "E-Mail oder Passwort stimmen nicht."
          : "Das hat nicht geklappt: " + message,
      );
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const { lovable } = await import("@/integrations/lovable/index");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google-Anmeldung nicht möglich.");
      return;
    }
  }

  return (
    <div className="mx-auto max-w-[440px] px-5 pb-16">
      <SiteHeader />
      <section className="pt-6">
        <h1 className="text-[30px] leading-[1.1] font-semibold tracking-tight text-balance">
          {mode === "login" ? "Willkommen zurück" : "Konto erstellen"}
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-foreground/60">
          {mode === "login"
            ? "Melde dich an, um den Stand deines Falls zu sehen."
            : "Mit einem Konto kannst du deinen Fall jederzeit verfolgen."}
        </p>
      </section>

      <form onSubmit={submit} className="panel mt-6 space-y-4 p-5">
        <div>
          <label htmlFor="email" className="text-[13px] font-medium text-foreground/70">
            E-Mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
            className="mt-1.5 min-h-[50px] w-full rounded-xl bg-surface px-4 text-[15px] ring-1 ring-border outline-none focus:ring-primary/60"
            placeholder="du@beispiel.de"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-[13px] font-medium text-foreground/70">
            Passwort
          </label>
          <input
            id="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={72}
            className="mt-1.5 min-h-[50px] w-full rounded-xl bg-surface px-4 text-[15px] ring-1 ring-border outline-none focus:ring-primary/60"
            placeholder="Mindestens 8 Zeichen"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="flex min-h-[52px] w-full items-center justify-center rounded-xl bg-primary text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-deep disabled:opacity-60"
        >
          {busy ? "Einen Moment …" : mode === "login" ? "Anmelden" : "Konto erstellen"}
        </button>

        <div className="flex items-center gap-3 text-[12px] text-foreground/35">
          <span className="h-px flex-1 bg-hairline" />
          oder
          <span className="h-px flex-1 bg-hairline" />
        </div>

        <button
          type="button"
          onClick={google}
          className="flex min-h-[50px] w-full items-center justify-center rounded-xl bg-surface text-[15px] font-medium ring-1 ring-border transition-colors hover:bg-surface-strong"
        >
          Mit Google anmelden
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="w-full pt-1 text-[13px] text-foreground/55 hover:text-foreground/80"
        >
          {mode === "login" ? "Noch kein Konto? Jetzt erstellen" : "Ich habe schon ein Konto"}
        </button>
      </form>

      <p className="mt-5 text-center text-[13px] text-foreground/50">
        Noch keinen Fall?{" "}
        <Link to="/fall-erstellen" className="font-medium text-primary hover:underline">
          Problem schildern
        </Link>
      </p>

      <SiteFooter />
    </div>
  );
}
