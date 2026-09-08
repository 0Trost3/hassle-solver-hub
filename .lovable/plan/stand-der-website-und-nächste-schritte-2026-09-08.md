# Stand der Website und nächste Schritte

## Wie weit ist die Website wirklich?

Technisch ist die Website zu etwa 85–90 % fertig und der Build läuft fehlerfrei:

**Fertig und funktionsfähig:**
- Startseite, „So funktioniert's", Impressum, Datenschutz (Optik & Texte stehen)
- Mehrstufiges Fallformular mit Upload von Dokumenten (privater Speicher, 15 MB)
- Anmeldung per E-Mail und Google
- Kundenbereich: Fallübersicht, Statusverlauf, Dokumente, Nachrichten an dich
- Interner Bereich für dich/dein Team: alle Fälle, Filter, Status ändern
- Datenbank mit Rollenmodell, Zugriffsrechten (Kunden sehen nur eigene Fälle) und automatischen Ticketnummern

**Was noch fehlt, bevor du online gehen kannst:**
1. **Echte Unternehmensdaten** – Impressum und Datenschutz enthalten aktuell deutlich markierte Platzhalter. Ohne echte Angaben darf die Seite rechtlich nicht live.
2. **Kontaktdaten** – Es gibt noch keine echte Telefonnummer/E-Mail-Adresse auf der Seite.
3. **Drei Sicherheitshinweise der Datenbank** beheben (kleine technische Nachbesserungen, ca. 15 Minuten Arbeit).
4. **Veröffentlichen** – mit einem Klick, sobald 1–3 erledigt sind.

## Vorschlag: nächste Schritte in dieser Reihenfolge

### Schritt 1 – Sicherheitshinweise beheben (mache ich sofort)
- `search_path` für Datenbankfunktionen fest setzen
- Ausführrechte der internen Hilfsfunktionen einschränken (nur noch über die Zugriffsregeln nutzbar)
- Danach erneuter Scan zur Bestätigung

### Schritt 2 – Deine echten Angaben einbauen (brauche ich von dir)
Dazu brauche ich von dir:
- Firmenname, Adresse, Name der vertretungsberechtigten Person
- Telefonnummer und E-Mail-Adresse für den Kundenkontakt
- Optional: Registergericht/Nummer, USt-IdNr.

Ich baue sie dann in Impressum, Datenschutz und an sinnvollen Kontaktstellen ein.

### Schritt 3 – E-Mail-Benachrichtigungen (empfohlen, optional)
Aktuell erfährst du von neuen Fällen nur, wenn du in den internen Bereich schaust – und Kunden bekommen keine Bestätigung. Ich kann einrichten:
- E-Mail an dich bei neuem Fall
- E-Mail an den Kunden bei Eingang und bei Statusänderung

### Schritt 4 – Veröffentlichen
Ein Klick auf „Publish". Auf Wunsch eigene Domain verbinden.

## Was bewusst NICHT fehlt
- Keine Zahlungsabwicklung (passt zum persönlichen Modell – Abrechnung machst du direkt)
- Keine automatisierte Handwerker-Anschreiben-Funktion – Kommunikation läuft über dich persönlich, wie im Konzept vorgesehen

## Technische Details
- 3 aktive Warnstufen-Fundstellen im Sicherheitsscan (alle niedrig, alle in der Datenbankschicht behebbar): `function_search_path_mutable`, `anon_security_definer_function_executable`, `authenticated_security_definer_function_executable`
- Behebung per SQL-Migration: `SET search_path = public` auf den Funktionen, `REVOKE EXECUTE` für `anon`/`authenticated` wo nicht nötig
- E-Mail-Versand über Transaktionsmail-Templates von Lovable Cloud (kein externer Dienst nötig)
