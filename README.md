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

- **Gästekommentare (Hauptseite):** `assets/data/reviews.json` bearbeiten. Jeder Eintrag ist ein Objekt mit `name`, `herkunft`, `datum`, `bewertung` (1&ndash;5) und `text`. Einträge mit `"beispiel": true` sind Platzhalter und sollten durch echte Bewertungen ersetzt werden.
- **Gästekarte (Unsere Gäste):** `assets/data/guests.json` bearbeiten. Jeder Eintrag enthält `land`, `ort`, `lat`, `lng` (Koordinaten) und `anzahl`. Auch hier markiert `"beispiel": true` Platzhalterdaten.
- **Zimmerfotos:** Dateien in `assets/img/zimmer/` austauschen (gleicher Dateiname behalten oder die `<img>`-Pfade in `zimmer/index.html` anpassen). Aktuell liegen dort gestaltete Platzhaltergrafiken.

## Bewertungen von Gästen (nicht öffentlich verlinkte Seite)

`/bewertungen/` ist eine eigenständige Seite mit einem Formular für Gäste (Vorname, Nachname, Herkunftsland, Anzahl Gäste, Sternebewertung, Freitext). Sie ist **nirgends in der Navigation verlinkt** und trägt `<meta name="robots" content="noindex, nofollow">` sowie einen Eintrag in `robots.txt` &ndash; das hält sie aus Suchmaschinen heraus, ist aber **kein Zugriffsschutz**: Wer die URL kennt, kann die Seite trotzdem öffnen. Für echten Zugriffsschutz wäre ein Login/Passwort nötig, was auf einer rein statischen Website ohne Server nicht sauber umsetzbar ist.

Da die Website keinen Server/keine Datenbank hat, werden Einsendungen **nicht automatisch veröffentlicht**: Das Formular öffnet eine E-Mail an ch.nessier@gmx.ch mit einer Zusammenfassung und zwei fertig formatierten JSON-Blöcken &ndash; einer zum Einfügen in `assets/data/reviews.json`, einer für `assets/data/guests.json`. Nach kurzer Prüfung genügt Copy-Paste, um die Bewertung freizuschalten. Auf der Website erscheint dabei nur Vorname + erster Buchstabe des Nachnamens (z.&nbsp;B. „Julia M.“); der volle Name bleibt in der E-Mail privat.

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
