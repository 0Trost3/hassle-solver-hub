# YLT Services als schlanke Einseiten-Website

## Ziel

Die bisherige Plattform wird zu einer klaren, persönlichen Unternehmenswebsite vereinfacht. Die Hauptseite enthält alle Informationen und ein Kontaktformular, das im E-Mail-Programm des Besuchers einen vorbereiteten Entwurf an `ylt.servicesdortmund@gmail.com` öffnet. Impressum und Datenschutz bleiben als separate Pflichtseiten erreichbar.

## Hauptseite

- Die bewährte Gestaltung „Quiet editorial warmth“ und die Marke YLT Services bleiben erhalten.
- Eine übersichtliche Navigation springt direkt zu den Bereichen der Hauptseite: Hilfe, Ablauf, persönlicher Service, Fragen und Kontakt.
- Bestehende Inhalte werden zu einem durchgängigen Seitenfluss zusammengeführt:
  - klares Leistungsversprechen
  - typische Situationen
  - Ablauf in vier Schritten
  - persönliche Betreuung mit vorhandenem Foto
  - häufige Fragen
  - Kontaktdaten und Kontaktformular
- Die bisherige beispielhafte Fall-/Statuskarte wird entfernt, weil es künftig kein Kundenportal und keine Fallverwaltung mehr gibt.
- Alle bisherigen Aufforderungen wie „Problem schildern“ führen zum Kontaktformular statt zu einem Fallformular oder Login.

## Kontakt per E-Mail-App

- Formularfelder: Name, E-Mail-Adresse, Telefonnummer optional, betroffener Dienstleister optional und Nachricht.
- Pflichtfelder, verständliche Fehlermeldungen und feste Längenbegrenzungen werden direkt im Browser geprüft.
- Nach erfolgreicher Prüfung öffnet sich das installierte E-Mail-Programm mit Empfänger, Betreff und allen Angaben als vorbereiteter Entwurf.
- Die Eingaben werden sicher URL-kodiert; die Website speichert oder überträgt keine Formulardaten.
- Ein sichtbarer direkter E-Mail-Link bleibt als Alternative erhalten, falls kein E-Mail-Programm eingerichtet ist.
- Auf der Seite wird klar erklärt, dass der Besucher die vorbereitete Nachricht in seiner E-Mail-App noch selbst absendet.

## Entfernen der bisherigen Plattform

- Anmeldung und Registrierung entfernen.
- Kundenbereich „Meine Fälle“ und internen Mitarbeiterbereich entfernen.
- Mehrstufiges Fallformular, Dokument-Uploads, Statusanzeige und Telefontermin-Buchung entfernen.
- Sämtliche Datenbank-, Benutzerkonto-, Rollen-, Speicher- und Termin-Anbindungen aus dem Website-Code entfernen.
- Nicht mehr benötigte Pakete, Hilfsdateien und Konfigurationen für diese Funktionen entfernen.
- Kopf- und Fußbereich von allen Links auf gelöschte Bereiche bereinigen.
- Nicht mehr benötigte öffentliche Unterseite „So funktioniert’s“ in die Hauptseite integrieren und entfernen.

## Rechtliche Seiten

- Impressum mit den vorhandenen Unternehmensdaten separat beibehalten.
- Datenschutz vollständig an die neue Website anpassen: keine Aussagen mehr über Konten, Falldaten, Dokument-Uploads oder internen Speicher.
- Transparent erklären, dass das Kontaktformular nur lokal einen E-Mail-Entwurf erzeugt und die eigentliche Verarbeitung erst über den E-Mail-Anbieter des Besuchers erfolgt.
- Impressum und Datenschutz bleiben dauerhaft im Fußbereich verlinkt.

## Qualität und Abschlussprüfung

- Jede verbleibende Seite erhält passende Seitentitel und Vorschautexte.
- Gelöschte Adressen zeigen eine saubere „Seite nicht gefunden“-Ansicht und es bleiben keine toten Links zurück.
- Darstellung und Formular werden auf Mobilgeräten und Desktop geprüft.
- Geprüft werden insbesondere Navigation, Sprungmarken, E-Mail-Entwurf, direkte Telefon-/E-Mail-Links sowie Impressum und Datenschutz.
- Abschließend werden Codeprüfung, Produktions-Build und Browser-Konsole auf Fehler kontrolliert.

## Technische Details

- TanStack Start bleibt als schlanker Seitenrahmen bestehen; damit wird kein neues System eingeführt.
- Lovable Cloud und die bisherige Datenbank werden von der Website nicht mehr angesprochen. Bestehende Cloud-Daten werden nicht automatisch gelöscht, damit keine gespeicherten Inhalte versehentlich verloren gehen; die Website ist davon vollständig entkoppelt.
- Das Kontaktformular nutzt ausschließlich clientseitige Schema-Prüfung und einen korrekt kodierten `mailto:`-Link. Es gibt keinen Server-Endpunkt und keinen automatischen Versand.
