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

## Kontaktformular aktivieren

Das Formular auf `/kontakt/` sendet über [Formspree](https://formspree.io) an **ch.nessier@gmx.ch**, ganz ohne eigenen Server.

Bei der **ersten** Einsendung schickt Formspree eine Bestätigungs-E-Mail an ch.nessier@gmx.ch &ndash; der Link darin muss einmalig angeklickt werden, danach werden alle weiteren Formular-Anfragen automatisch zugestellt. Für höhere Versandmengen oder mehr Kontrolle lohnt sich ein kostenloses Formspree-Konto mit eigener Formular-ID (dann `action` in `kontakt/index.html` auf `https://formspree.io/f/<form-id>` anpassen).

## Lageplan

Der Kartenausschnitt auf `/lageplan/` ist eine kostenlose Google-Maps-Einbettung (kein API-Key nötig) für **Stegmattweg 8b, 3315 Kräiligen**.

## Design

Die Farben orientieren sich am NessiAirBnB-Logo:

- Dunkelgrün/Schwarz `#0d1e1c`
- Schiefergrau `#5a6d71`
- Warmes Gold als Akzentfarbe `#c08a45`
- Warmes Off-White als Hintergrund `#f7f5f1`
