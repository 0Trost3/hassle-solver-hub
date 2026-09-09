# Telefontermin nach dem Absenden eines Falls

Kunden können nach dem Einreichen ihres Falls direkt einen 30-minütigen Telefontermin wählen. Die Auswahl ist optional und lässt sich später jederzeit im Fall nachholen oder ändern.

## Regeln für die Terminauswahl

- Montag bis Samstag, 8:00–20:00 Uhr
- 30-Minuten-Termine (8:00, 8:30, 9:00 … 19:30)
- Frühester Termin: 2 Stunden nach dem Absenden des Falls
- Buchbar bis 14 Tage im Voraus
- Sonntags keine Termine
- Bereits vergebene Zeiten werden ausgegraut und sind nicht wählbar

## Was der Kunde sieht

1. **Direkt nach dem Absenden** wird statt der sofortigen Weiterleitung ein neuer, siebter Schritt „Telefontermin“ angezeigt: eine Tagesleiste (nächste 14 Tage, Sonntage ohne Slots) und darunter die freien Uhrzeiten als antippbare Kacheln.
2. Buttons: „Termin bestätigen“ und „Später auswählen“ – beide führen zur Fallseite.
3. **Auf der Fallseite** („Meine Fälle“ → Fall) erscheint ein Terminbereich:
   - Ohne Termin: Hinweis „Noch kein Telefontermin“ mit Button „Termin wählen“.
   - Mit Termin: Datum und Uhrzeit, dazu „Termin ändern“ und „Termin absagen“.
4. **Im internen Bereich** wird bei jedem Fall der gebuchte Telefontermin angezeigt, damit du deinen Tag planen kannst.

## Technische Umsetzung

Die vorhandene Tabelle `appointments` (Felder `case_id`, `customer_id`, `scheduled_at`, `status`, `note`) wird genutzt – kein neues Datenmodell nötig. Die bestehenden Zugriffsregeln erlauben Kunden bereits, eigene Termine anzulegen und zu ändern.

Eine Migration ergänzt:
- `public.available_slot_check` – eine `security definer`-Funktion, die für einen Zeitraum nur die belegten Startzeiten zurückgibt (ohne fremde Falldaten), damit freie Slots angezeigt werden können; ausführbar für `authenticated`.
- Einen eindeutigen Index auf `scheduled_at` für nicht stornierte Termine, damit derselbe Slot nicht doppelt vergeben werden kann.

Frontend:
- Neue Komponente `src/components/booking/SlotPicker.tsx` mit Slot-Berechnung in `src/lib/slots.ts` (Zeitfenster, 30-Minuten-Raster, 2-Stunden-Vorlauf, Sonntagsausschluss).
- `src/routes/fall-erstellen.tsx`: nach erfolgreichem Speichern Schritt „Telefontermin“ statt direkter Weiterleitung.
- `src/routes/_authenticated/meine-faelle.$caseId.tsx`: Terminbereich mit Buchen/Ändern/Absagen.
- `src/routes/_authenticated/intern.tsx`: Termin je Fall in der Liste.
- Fehler beim Buchen (Slot inzwischen vergeben) werden abgefangen und die Liste neu geladen.

## Nicht enthalten

- Keine E-Mail- oder Kalender-Erinnerung (E-Mail-Versand ist noch nicht eingerichtet)
- Keine Verwaltung individueller Urlaubs- oder Sperrzeiten – bei Bedarf später ergänzbar
