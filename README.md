# NessiAirBnB &ndash; Website

Statische, mehrseitige Website für das Familienzimmer in Kräiligen. Kein Build-Schritt nötig &ndash; reines HTML/CSS/JS, bereit für GitHub Pages.

## Seiten

| Seite | Adresse |
|---|---|
| Hauptseite | `/` |
| Wer sind wir | `/wersindwir/` |
| Lageplan | `/lageplan/` |
| Das Zimmer | `/zimmer/` |
| Unsere Gäste | `/gaeste/` |
| Kontakt | `/kontakt/` |

## GitHub Pages aktivieren

1. Repository-Einstellungen &rarr; **Pages**
2. Source: **Deploy from a branch**
3. Branch: den veröffentlichten Branch wählen, Ordner `/ (root)`
4. Speichern &ndash; die Seite ist danach unter `https://<benutzername>.github.io/<repo>/` erreichbar

## Inhalte pflegen (kein Programmieren nötig)

- **Bewertungen & Gästekarte (eine gemeinsame Datei):** `assets/data/bewertungen.json` bearbeiten. Jeder Eintrag ist ein Objekt mit `name`, `land`, `ort`, `lat`/`lng` (Koordinaten, `null` falls unbekannt), `datum`, `bewertung` (1&ndash;5), `text`, `anzahl` und `mitKindern`. Ein Eintrag erscheint automatisch als Bewertungskarte auf der Startseite, sobald `text` gesetzt ist, und automatisch als Pin auf der Gästekarte (`/gaeste/`), sobald `lat`/`lng` gesetzt sind &ndash; beides kann unabhängig voneinander der Fall sein. Einträge mit `"beispiel": true` sind Platzhalter.
- **Zimmerfotos:** Dateien in `assets/img/zimmer/` austauschen (gleicher Dateiname behalten oder die `<img>`-Pfade in `zimmer/index.html` anpassen). Aktuell liegen dort gestaltete Platzhaltergrafiken.

## Bewertungen von Gästen (nicht öffentlich verlinkte Seite)

`/bewertungen/` ist eine eigenständige Seite mit einem Formular für Gäste (Vorname, Nachname, Land, Stadt/Ort, Anzahl Gäste, Sternebewertung, Freitext). Sie ist **nirgends in der Navigation verlinkt** und trägt `<meta name="robots" content="noindex, nofollow">` sowie einen Eintrag in `robots.txt` &ndash; das hält sie aus Suchmaschinen heraus, ist aber **kein Zugriffsschutz**: Wer die URL kennt, kann die Seite trotzdem öffnen. Für echten Zugriffsschutz wäre ein Login/Passwort nötig, was auf einer rein statischen Website ohne Server nicht sauber umsetzbar ist.

Da die Website keinen eigenen Server/keine Datenbank hat, werden Einsendungen **nicht automatisch veröffentlicht**: Das Formular sendet die Angaben über [Web3Forms](https://web3forms.com) direkt im Hintergrund an ch.nessier@gmx.ch &ndash; der Gast sieht dabei nie den E-Mail-Inhalt, nur eine Bestätigung auf der Seite. Die eingehende Nachricht enthält eine Zusammenfassung sowie einen fertig formatierten JSON-Block zum Einfügen in `assets/data/bewertungen.json`. Nach kurzer Prüfung genügt Copy-Paste, um die Bewertung freizuschalten. Auf der Website erscheint dabei nur Vorname + erster Buchstabe des Nachnamens (z.&nbsp;B. „Julia M.“); der volle Name bleibt privat.

Für die Ortsangabe wird bei Eingabe einer Stadt automatisch versucht, über die freie OpenStreetMap-Nominatim-Geokodierung präzise Koordinaten zu ermitteln (statt nur das Landeszentrum zu verwenden); gelingt das nicht, liefert die Nachricht einen Hinweis, dass die Koordinaten im Landeszentrum liegen.

**Einrichtung:** In `assets/js/bewertung-form.js` muss einmalig `WEB3FORMS_ACCESS_KEY` mit dem eigenen, kostenlosen Access Key von web3forms.com ersetzt werden.

## Kontaktformular

Das Formular auf `/kontakt/` nutzt keinen Drittanbieter und keinen eigenen Server: Beim Absenden öffnet sich per `mailto:`-Link direkt das E-Mail-Programm des Besuchers mit einer vorausgefüllten Nachricht an **ch.nessier@gmx.ch**. Der Besuch muss die E-Mail in seinem Programm nur noch abschicken. Die Logik dazu steckt in `assets/js/contact-form.js`.

## Lageplan

Der Kartenausschnitt auf `/lageplan/` ist eine kostenlose Google-Maps-Einbettung (kein API-Key nötig) für **Stegmattweg 8b, 3315 Kräiligen**.

## Design

Die Farben orientieren sich am NessiAirBnB-Logo:

- Dunkelgrün/Schwarz `#0d1e1c`
- Schiefergrau `#5a6d71`
- Warmes Gold als Akzentfarbe `#c08a45`
- Warmes Off-White als Hintergrund `#f7f5f1`
