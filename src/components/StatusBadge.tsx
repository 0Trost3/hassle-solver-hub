import { CASE_STATUS, type CaseStatus, type StatusTone } from "@/lib/case-meta";
import { cn } from "@/lib/utils";

const TONE_CLASS: Record<StatusTone, string> = {
  neutral: "bg-surface text-foreground/75 ring-border",
  progress: "bg-warning/12 text-warning ring-warning/30",
  positive: "bg-success/14 text-success ring-success/35",
  attention: "bg-destructive/14 text-destructive ring-destructive/35",
};

const DOT_CLASS: Record<StatusTone, string> = {
  neutral: "bg-foreground/40",
  progress: "bg-warning",
  positive: "bg-success",
  attention: "bg-destructive",
};

export function ToneBadge({
  tone,
  children,
  className,
  pulse = false,
}: {
  tone: StatusTone;
  children: React.ReactNode;
  className?: string;
  pulse?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12.5px] font-semibold ring-1",
        TONE_CLASS[tone],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", DOT_CLASS[tone], pulse && "live-dot")} />
      {children}
    </span>
  );
}

export function StatusBadge({ status, className }: { status: CaseStatus; className?: string }) {
  const meta = CASE_STATUS[status];
  return (
    <ToneBadge tone={meta.tone} {...(className ? { className } : {})} pulse={meta.tone === "progress"}>
      {meta.label}
    </ToneBadge>
  );
}
