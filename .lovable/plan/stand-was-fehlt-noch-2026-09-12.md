# Stand: Was fehlt noch?

## Technische Prüfung (gerade durchgeführt)

- Alle öffentlichen Seiten (Start, So funktioniert's, Fall erstellen, Impressum, Datenschutz, Anmelden) antworten fehlerfrei.
- Der letzte Build ist fehlerfrei ("build OK"), die Code-Prüfung meldet keine Fehler.
- Keine Laufzeit- oder Konsolenfehler in der Vorschau.
- Sicherheitsprüfung der Datenbank: nur noch 3 Hinweise der Stufe "Warnung" zu den internen Rollenfunktionen (`has_role`, `is_staff`, `booked_slots`). Diese müssen für angemeldete Nutzer ausführbar sein, damit die Zugriffsregeln überhaupt funktionieren – bewusst so belassen, kein echtes Risiko.

Fazit: Die Website funktioniert ohne Probleme.

## Was inhaltlich noch fehlt

1. **Automatische E-Mails** – bisher nicht eingerichtet. Weder du bekommst eine Nachricht bei einem neuen Fall, noch der Kunde eine Bestätigung.
2. **Veröffentlichung** – die Seite ist noch nicht live.
3. Optional: eigene Domain statt der Lovable-Adresse.

## Vorschlag: nächste Schritte

### Schritt 1 – Automatische E-Mails einrichten
- E-Mail an dich (ylt.servicesdortmund@gmail.com) bei jedem neuen Fall, mit Ticketnummer, Kundendaten, Problem und gebuchtem Telefontermin.
- Eingangsbestätigung an den Kunden nach dem Absenden, inklusive Termin-Info.
- Benachrichtigung an den Kunden bei jeder Statusänderung.
- Bestätigung an beide, wenn ein Telefontermin gebucht, geändert oder abgesagt wird.

Zum Versand wird eine Absenderadresse benötigt. Ohne eigene Domain wird über eine neutrale Lovable-Absenderadresse verschickt; mit eigener Domain kommen die Mails von deiner Adresse und landen seltener im Spam.

### Schritt 2 – Testlauf
Einen Testfall anlegen, Termin buchen, Status ändern und prüfen, dass alle Mails korrekt ankommen.

### Schritt 3 – Veröffentlichen
Ein Klick, danach ist die Seite live. Eigene Domain auf Wunsch direkt danach verbinden.

## Technische Details

- Versand über die Transaktionsmail-Funktion von Lovable Cloud; Auslöser als Server-Funktionen bzw. Datenbank-Trigger bei `cases`-Insert, Statuswechsel und `appointments`-Änderungen.
- Datenbank-Hinweise des Linters: `authenticated_security_definer_function_executable` für `has_role`, `is_staff`, `booked_slots` – notwendig für die RLS-Regeln, daher akzeptiert.
