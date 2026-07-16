// Unlisted guest review intake form. Submissions are sent directly in the
// background via Web3Forms (https://web3forms.com) - the guest never sees
// the email body, only a short confirmation on this page. The message
// delivered to the host contains a human-readable summary plus two
// ready-to-paste JSON snippets for assets/data/reviews.json and
// assets/data/guests.json; the host reviews and pastes them in manually,
// so guest text never publishes unmoderated.
const WEB3FORMS_ACCESS_KEY = "YOUR_ACCESS_KEY_HERE";

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
  const submitBtn = form.querySelector('button[type="submit"]');

  // Best-effort city lookup via OpenStreetMap Nominatim (free, no API key).
  // Falls back to the country's centroid if the city can't be resolved.
  async function geocodeOrt(ort, land) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(`${ort}, ${land}`)}`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), precise: true };
      }
    } catch (e) {
      console.warn("Ortssuche fehlgeschlagen, verwende Landeszentrum", e);
    }
    return null;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const vorname = document.getElementById("vorname").value.trim();
    const nachname = document.getElementById("nachname").value.trim();
    const ort = document.getElementById("ort").value.trim();
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

    status.className = "form-status";
    submitBtn.disabled = true;
    submitBtn.textContent = "Wird gesendet...";

    const countryMatch = countries.find((c) => c.name === landName);
    let coords = countryMatch ? { lat: countryMatch.lat, lng: countryMatch.lng, precise: false } : { lat: null, lng: null, precise: false };
    if (ort) {
      const precise = await geocodeOrt(ort, landName);
      if (precise) coords = precise;
    }

    const publicName = `${vorname} ${nachname.charAt(0).toUpperCase()}.`;
    const herkunftDisplay = ort ? `${landName}, ${ort}` : landName;
    const today = new Date();
    const datum = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    const id = `gast-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 900 + 100)}`;

    const reviewSnippet = {
      id,
      name: publicName,
      herkunft: herkunftDisplay,
      datum,
      bewertung: Number(sterne),
      text: freitext,
      beispiel: false,
    };

    const guestSnippet = {
      id: `land-${id}`,
      land: landName,
      ort: ort || "",
      lat: coords.lat,
      lng: coords.lng,
      anzahl: Number(anzahl),
      beispiel: false,
    };

    const lines = [
      "Neue Gästebewertung über /bewertungen/",
      "",
      `Vorname: ${vorname}`,
      `Nachname: ${nachname}`,
      `Land: ${landName}`,
      `Ort: ${ort || "(nicht angegeben)"}`,
      `Anzahl Gäste: ${anzahl}`,
      `Sterne: ${sterne}/5`,
      `Text: ${freitext}`,
      "",
      coords.precise ? "Koordinaten: Ort gefunden (präzise)" : "Koordinaten: Landeszentrum (Ort nicht gefunden oder leer gelassen)",
      "",
      "--- Zum Einfügen in assets/data/reviews.json ---",
      JSON.stringify(reviewSnippet, null, 2) + ",",
      "",
      "--- Zum Einfügen in assets/data/guests.json ---",
      "(Falls für dieses Land/diesen Ort bereits ein Eintrag existiert: einfach dessen \"anzahl\" erhöhen statt neu einzufügen.)",
      JSON.stringify(guestSnippet, null, 2) + ",",
    ];

    const messageBody = lines.join("\n");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Neue Gästebewertung: ${publicName}`,
          from_name: "NessiAirBnB Website",
          email: "ch.nessier@gmx.ch",
          message: messageBody,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error("web3forms-failed");

      status.textContent = "Vielen Dank für Ihre Bewertung! Sie wurde an uns übermittelt.";
      status.className = "form-status show ok";
      form.reset();
      otherWrap.style.display = "none";
    } catch (err) {
      status.innerHTML =
        "Die Bewertung konnte nicht automatisch gesendet werden. Bitte schreiben Sie uns direkt an " +
        '<a href="mailto:ch.nessier@gmx.ch">ch.nessier@gmx.ch</a>.';
      status.classList.add("show", "err");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Bewertung senden";
    }
  });
});
