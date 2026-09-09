/**
 * Auswahl eines 30-minütigen Telefontermins.
 * Belegte Zeiten kommen aus der Datenbankfunktion `booked_slots`,
 * die nur Startzeiten zurückgibt – keine fremden Falldaten.
 */
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  bookableDays,
  bookingRange,
  formatDayLabel,
  formatTimeLabel,
  slotsForDay,
} from "@/lib/slots";

type Props = {
  caseId: string;
  /** Bestehender Termin, der beim Buchen ersetzt wird. */
  existingAppointmentId?: string | null;
  onBooked?: () => void;
  onSkip?: () => void;
  skipLabel?: string;
};

export function SlotPicker({ caseId, existingAppointmentId, onBooked, onSkip, skipLabel }: Props) {
  const queryClient = useQueryClient();
  const days = useMemo(() => bookableDays(), []);
  const [dayIndex, setDayIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const range = useMemo(() => bookingRange(), []);

  const bookedQuery = useQuery({
    queryKey: ["belegte-termine", range.start.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("booked_slots", {
        _from: range.start.toISOString(),
        _to: range.end.toISOString(),
      });
      if (error) throw error;
      return (data ?? []).map((row: { scheduled_at: string }) =>
        new Date(row.scheduled_at).getTime(),
      );
    },
  });

  const booked = new Set(bookedQuery.data ?? []);
  const activeDay = days[dayIndex];
  const slots = activeDay ? slotsForDay(activeDay) : [];

  const book = useMutation({
    mutationFn: async (iso: string) => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Nicht angemeldet");
      if (existingAppointmentId) {
        const { error } = await supabase
          .from("appointments")
          .update({ status: "cancelled" })
          .eq("id", existingAppointmentId);
        if (error) throw error;
      }
      const { error } = await supabase.from("appointments").insert({
        case_id: caseId,
        customer_id: auth.user.id,
        scheduled_at: iso,
        status: "requested",
        note: "Telefongespräch, 30 Minuten",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Dein Telefontermin steht. Wir rufen dich an.");
      queryClient.invalidateQueries({ queryKey: ["belegte-termine"] });
      queryClient.invalidateQueries({ queryKey: ["fall-termin", caseId] });
      onBooked?.();
    },
    onError: () => {
      toast.error("Dieser Termin ist leider gerade vergeben worden. Bitte wähle einen anderen.");
      setSelected(null);
      queryClient.invalidateQueries({ queryKey: ["belegte-termine"] });
    },
  });

  return (
    <div>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {days.map((d, i) => (
          <button
            key={d.toISOString()}
            type="button"
            onClick={() => {
              setDayIndex(i);
              setSelected(null);
            }}
            className={`min-h-[44px] shrink-0 rounded-xl px-3.5 text-[13px] font-medium ring-1 transition-colors ${
              i === dayIndex
                ? "bg-primary/20 text-foreground ring-primary/45"
                : "bg-surface text-foreground/65 ring-border"
            }`}
          >
            {formatDayLabel(d)}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {slots.map((s) => {
          const iso = s.toISOString();
          const taken = booked.has(s.getTime());
          const active = selected === iso;
          return (
            <button
              key={iso}
              type="button"
              disabled={taken}
              onClick={() => setSelected(iso)}
              className={`min-h-[44px] rounded-xl text-[13.5px] font-medium ring-1 transition-colors ${
                taken
                  ? "cursor-not-allowed bg-surface/50 text-foreground/25 ring-border/60 line-through"
                  : active
                    ? "bg-primary text-primary-foreground ring-primary/60"
                    : "bg-surface text-foreground/80 ring-border hover:bg-surface-strong"
              }`}
            >
              {formatTimeLabel(s)}
            </button>
          );
        })}
      </div>

      {slots.length === 0 && (
        <p className="mt-4 text-[13.5px] text-foreground/50">
          An diesem Tag sind keine Zeiten mehr frei. Wähl bitte einen anderen Tag.
        </p>
      )}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={!selected || book.isPending}
          onClick={() => selected && book.mutate(selected)}
          className="min-h-[50px] flex-1 rounded-xl bg-primary text-[14.5px] font-semibold text-primary-foreground disabled:opacity-50"
        >
          Termin bestätigen
        </button>
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="min-h-[50px] flex-1 rounded-xl bg-surface text-[14.5px] font-medium ring-1 ring-border"
          >
            {skipLabel ?? "Später auswählen"}
          </button>
        )}
      </div>
    </div>
  );
}
