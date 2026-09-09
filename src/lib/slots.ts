/**
 * Terminlogik für Telefongespräche:
 * Mo–Sa, 8:00–20:00 Uhr, 30-Minuten-Raster, frühestens 2 Stunden im Voraus,
 * buchbar bis 14 Tage in die Zukunft. Sonntag ist frei.
 */

export const SLOT_MINUTES = 30;
export const DAY_START_HOUR = 8;
export const DAY_END_HOUR = 20;
export const LEAD_TIME_HOURS = 2;
export const BOOKING_WINDOW_DAYS = 14;

/** Liefert die buchbaren Tage (ohne Sonntage) als Datum um Mitternacht. */
export function bookableDays(from: Date = new Date()): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < BOOKING_WINDOW_DAYS; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    if (d.getDay() === 0) continue; // Sonntag
    days.push(d);
  }
  return days;
}

/** Alle Startzeiten eines Tages, die noch weit genug in der Zukunft liegen. */
export function slotsForDay(day: Date, now: Date = new Date()): Date[] {
  if (day.getDay() === 0) return [];
  const earliest = new Date(now.getTime() + LEAD_TIME_HOURS * 60 * 60 * 1000);
  const slots: Date[] = [];
  for (let h = DAY_START_HOUR; h < DAY_END_HOUR; h++) {
    for (let m = 0; m < 60; m += SLOT_MINUTES) {
      const slot = new Date(day);
      slot.setHours(h, m, 0, 0);
      if (slot.getTime() >= earliest.getTime()) slots.push(slot);
    }
  }
  return slots;
}

export function bookingRange(from: Date = new Date()): { start: Date; end: Date } {
  const start = new Date(from);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + BOOKING_WINDOW_DAYS + 1);
  return { start, end };
}

export function formatDayLabel(day: Date): string {
  return new Intl.DateTimeFormat("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" }).format(
    day,
  );
}

export function formatTimeLabel(slot: Date): string {
  return new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit" }).format(slot);
}

export function formatSlotFull(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
