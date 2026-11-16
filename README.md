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
<!-- TODO Person 1: Beschreibung an die tatsächlich umgesetzten Funktionen anpassen -->

### putzplan.html – Putzplan
Planung und Verwaltung der Haushaltsaufgaben der WG.
<!-- TODO Person 2/3: Funktionen (Aufgaben anlegen, zuweisen, erledigen, löschen …) ergänzen -->

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
<!-- TODO Person 3: Funktionen (hinzufügen, löschen, Validierung …) ergänzen -->

## Barrierefreiheit & Qualität
- Semantisches HTML (`header`, `nav`, `main`, `section`, `aside`), `aria-current` in der Navigation
- Jedes Formularfeld mit `<label for="...">`, Aktionen als echte `<button>`-Elemente
- Fehlermeldungen mit `role="alert"`
- Sprechende Funktionsnamen, kurze Funktionen, explizite Typumwandlung mit `Number(...)`

## Starten
Repository klonen und `index.html` im Browser öffnen (kein Build-Schritt nötig).

## Team
| Person | Verantwortung |
|---|---|
| Person 1–3 | Siehe Modulbeschreibungen oben (bitte Namen ergänzen) |
| Person 4 | Finanzen (`finanzen.html`, `js/finanzen.js`) und Dokumentation (`README.md`) |