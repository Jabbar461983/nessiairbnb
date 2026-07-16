// Unlisted guest review intake form. There is no backend on this static
// site, so submissions are never published automatically: this script
// emails the host (ch.nessier@gmx.ch) a human-readable summary plus two
// ready-to-paste JSON snippets for assets/data/reviews.json and
// assets/data/guests.json. The host reviews and pastes them in manually -
// that is intentional moderation, not a missing feature.
document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("bewertung-form");
  if (!form) return;

  const select = document.getElementById("herkunft");
  let countries = [];
  try {
    const res = await fetch("../assets/data/countries.json", { cache: "no-store" });
    countries = await res.json();
    countries.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.name;
      opt.textContent = c.name;
      select.appendChild(opt);
    });
    const other = document.createElement("option");
    other.value = "__other__";
    other.textContent = "Anderes Land (unten angeben)";
    select.appendChild(other);
  } catch (e) {
    console.error("Länderliste konnte nicht geladen werden", e);
  }

  const otherWrap = document.getElementById("herkunft-other-wrap");
  select.addEventListener("change", () => {
    otherWrap.style.display = select.value === "__other__" ? "block" : "none";
  });

  const status = document.getElementById("form-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const vorname = document.getElementById("vorname").value.trim();
    const nachname = document.getElementById("nachname").value.trim();
    const anzahl = document.getElementById("anzahl").value || "1";
    const freitext = document.getElementById("freitext").value.trim();
    const sterneEl = form.querySelector('input[name="sterne"]:checked');
    const sterne = sterneEl ? sterneEl.value : "";
    const otherLand = document.getElementById("herkunft-other").value.trim();
    const landName = select.value === "__other__" ? otherLand : select.value;

    if (!vorname || !nachname || !landName || !sterne || !freitext) {
      status.textContent = "Bitte füllen Sie alle Felder aus und wählen Sie eine Sternebewertung.";
      status.className = "form-status show err";
      return;
    }

    const match = countries.find((c) => c.name === landName);
    const publicName = `${vorname} ${nachname.charAt(0).toUpperCase()}.`;
    const today = new Date();
    const datum = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    const id = `gast-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 900 + 100)}`;

    const reviewSnippet = {
      id,
      name: publicName,
      herkunft: landName,
      datum,
      bewertung: Number(sterne),
      text: freitext,
      beispiel: false,
    };

    const guestSnippet = {
      id: `land-${id}`,
      land: landName,
      ort: "",
      lat: match ? match.lat : null,
      lng: match ? match.lng : null,
      anzahl: Number(anzahl),
      beispiel: false,
    };

    const lines = [
      "Neue Gästebewertung über /bewertungen/",
      "",
      `Vorname: ${vorname}`,
      `Nachname: ${nachname}`,
      `Herkunft: ${landName}`,
      `Anzahl Gäste: ${anzahl}`,
      `Sterne: ${sterne}/5`,
      `Text: ${freitext}`,
      "",
      "--- Zum Einfügen in assets/data/reviews.json ---",
      JSON.stringify(reviewSnippet, null, 2) + ",",
      "",
      "--- Zum Einfügen in assets/data/guests.json ---",
      "(Falls für dieses Land bereits ein Eintrag existiert: einfach dessen \"anzahl\" erhöhen statt neu einzufügen.)",
      JSON.stringify(guestSnippet, null, 2) + ",",
    ];

    if (!match) {
      lines.push("", "Hinweis: Land nicht in der Liste gefunden - lat/lng bitte manuell ergänzen.");
    }

    const subject = encodeURIComponent(`Neue Gästebewertung: ${publicName}`);
    const body = encodeURIComponent(lines.join("\n"));

    window.location.href = `mailto:ch.nessier@gmx.ch?subject=${subject}&body=${body}`;

    status.textContent = "Vielen Dank! Ihr E-Mail-Programm sollte sich jetzt öffnen - bitte die Mail einfach absenden.";
    status.className = "form-status show ok";
  });
});
