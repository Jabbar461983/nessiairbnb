// Renders the "Unsere Gäste" world map from the shared assets/data/bewertungen.json
// using Leaflet. The same file also feeds the review cards on the homepage -
// only entries with lat/lng get a pin here. To update: edit that JSON file
// and push - the map picks up changes automatically, no code changes needed.
document.addEventListener("DOMContentLoaded", async () => {
  const mapEl = document.getElementById("guests-map");
  if (!mapEl || typeof L === "undefined") return;

  const map = L.map(mapEl, { scrollWheelZoom: false }).setView([30, 10], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(map);

  const pinIcon = (color) =>
    L.divIcon({
      className: "",
      html: `<div style="width:16px;height:16px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 16],
    });

  try {
    const res = await fetch("../assets/data/bewertungen.json", { cache: "no-store" });
    const all = await res.json();
    const guests = Array.isArray(all) ? all.filter((g) => g.lat != null && g.lng != null) : [];

    let totalGuests = 0;
    const countries = new Set();

    guests.forEach((g) => {
      totalGuests += g.anzahl || 0;
      countries.add(g.land);
      const color = g.beispiel ? "#8a9a9d" : "#c08a45";
      const marker = L.marker([g.lat, g.lng], { icon: pinIcon(color) }).addTo(map);
      const badge = g.beispiel ? " <em>(Beispiel)</em>" : "";
      const who = g.name ? `${escapeHtml(g.name)} &middot; ` : "";
      const stars = g.bewertung ? "★".repeat(g.bewertung) : "";
      marker.bindPopup(
        `${who}<strong>${escapeHtml(g.land)}</strong>${g.ort ? " – " + escapeHtml(g.ort) : ""}<br>${g.anzahl || 0} Gast/Gäste ${stars}${badge}`
      );
    });

    const statGuests = document.getElementById("stat-guests");
    const statCountries = document.getElementById("stat-countries");
    if (statGuests) statGuests.textContent = totalGuests;
    if (statCountries) statCountries.textContent = countries.size;
  } catch (e) {
    console.error("Gästekarte konnte nicht geladen werden", e);
  }
});

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}
