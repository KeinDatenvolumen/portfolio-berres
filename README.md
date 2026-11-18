<!-- Gruppenname: WI_A_Gruppe_1 -->
# WG-Held – Der digitale WG-Planer

Webprojekt für die Portfolioprüfung „Einführung Webtechnologien“, entwickelt als 4er-Gruppe (WI_A_Gruppe_1).
Umgesetzt mit reinem HTML, CSS und JavaScript – ohne Frameworks, externe Bibliotheken oder Inline-Styles.
Alle Daten werden im `localStorage` des Browsers gespeichert.

## Projektstruktur

| Datei | Zweck |
|---|---|
| `index.html` | Startseite / Dashboard |
| `putzplan.html` | Putzplan der WG |
| `finanzen.html` | WG-Finanzen & Ausgaben-Rechner |
| `mitbewohner.html` | Verwaltung der Mitbewohner |
| `css/style.css` | Gemeinsames Stylesheet aller Seiten |
| `js/storage.js` | Gemeinsames Speichermodul (`loadFromStorage`, `saveToStorage`, `getRoommates`, `STORAGE_KEYS`) |
| `js/finanzen.js` | Logik der Finanzseite |

## Die vier Seiten

### index.html – Startseite
Einstieg in die Anwendung mit Überblick über die Funktionen und Navigation zu den anderen Seiten.
- Neue Einkaufsartikel mit Name und Kategorie anlegen
- Einzelne Artikel als erledigt markieren oder vollständig löschen
- Einkaufsliste über eine Textsuche durchsuchen
- Einträge nach ihrer Kategorie filtern
- Einkaufsstatistik mit der Anzahl aller, offenen und erledigten Artikel anzeigen
- Einkaufsdaten dauerhaft im `localStorage` des Browsers speichern

### putzplan.html – Putzplan
Planung und Verwaltung der Haushaltsaufgaben der WG.
- Putzaufgaben mit Beschreibung, Raum, zuständiger Person und Fälligkeitsdatum anlegen
- Aufgaben nach Raum und zugewiesener Person filtern
- Aufgaben als erledigt markieren oder aus dem Putzplan löschen
- Fortschrittsbalken mit dem prozentualen Anteil der erledigten Aufgaben anzeigen
- Dynamische Wochenrotations-Tabelle für die Verteilung der Aufgaben darstellen
- Putzplandaten dauerhaft im `localStorage` des Browsers speichern

### finanzen.html – WG-Finanzen & Ausgaben-Rechner
- **Ausgaben erfassen:** Formular mit Verwendungszweck, Betrag in € (`step="0.01"`, `min="0.01"`), „Bezahlt von“, Kategorie (Lebensmittel, Haushalt, Freizeit, Sonstiges) und Datum.
- **Dynamische Mitbewohner:** Das Dropdown „Bezahlt von“ und der Personenfilter werden über `getRoommates()` befüllt – neu angelegte Mitbewohner erscheinen automatisch.
- **Validierung:** Beträge müssen eine Zahl größer als 0 sein; Pflichtfelder werden geprüft. Fehler erscheinen sichtbar im UI (`#finance-error`).
- **Ausgabenliste:** Einträge als Karten mit Betrag, Kategorie-Badge, Person und Datum, einzeln löschbar; sortiert nach Datum.
- **Filter:** Filterleiste nach Person und Kategorie.
- **Statistik-Kacheln:** Gesamtausgaben, Pro-Kopf-Anteil und Anzahl der Buchungen.
- **WG-Kassensturz:** Für jede Person (alle Mitbewohner plus Personen aus bestehenden Buchungen) wird berechnet, wie viel sie bezahlt hat und wie ihr Saldo zum Pro-Kopf-Durchschnitt aussieht – „bekommt +X,XX €“ (grün) oder „zahlt -X,XX €“ (rot).
- **Speicherung:** Dauerhaft im `localStorage` unter `STORAGE_KEYS.FINANCE`.

### mitbewohner.html – Mitbewohner-Verwaltung
Anlegen und Verwalten der WG-Mitglieder. Die Liste dient als gemeinsame Datenbasis für Putzplan und Finanzen.
- Mitbewohner mit Name, Zimmer und E-Mail-Adresse anlegen
- Bereits gespeicherte Mitbewohner anzeigen und entfernen
- Mitbewohner zentral im `localStorage` des Browsers verwalten
- Gespeicherte Mitbewohner als gemeinsame Datenbasis für Putzplan und WG-Finanzen bereitstellen

## Barrierefreiheit & Qualität
- Semantisches HTML (`header`, `nav`, `main`, `section`, `aside`), `aria-current` in der Navigation
- Jedes Formularfeld mit `<label for="...">`, Aktionen als echte `<button>`-Elemente
- Fehlermeldungen mit `role="alert"`
- Sprechende Funktionsnamen, kurze Funktionen, explizite Typumwandlung mit `Number(...)`

## Starten
Repository klonen und `index.html` im Browser öffnen (kein Build-Schritt nötig).

## Team| 
Teammitglied | Verantwortungsbereich | Dateien |
|---|---|---|
| Kai Spitzer | Layout, Design-System und Responsivität | `css/style.css`, `img/logo.svg` |
| Enrico | Einkaufsliste, Mitbewohner-Verwaltung und localStorage-Speichermodul | `index.html`, `js/einkauf.js`, `mitbewohner.html`, `js/mitbewohner.js`, `js/storage.js` |
| Finley | Wöchentlicher Putzplan, Raumrotation und Fortschrittsanzeige | `putzplan.html`, `js/putzplan.js` |
| Jonas Bieler | WG-Finanzen, Kassensturz-Saldenrechner und Dokumentation | `finanzen.html`, `js/finanzen.js`, `README.md` |