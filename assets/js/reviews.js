// Loads guest comments from the shared assets/data/bewertungen.json onto the
// homepage. The same file also feeds the guest map on /gaeste/ - edit it to
// add, remove or update entries, no code changes needed. UI strings switch
// based on <html lang>; review text itself is shown as originally submitted
// (not machine-translated) to keep quotes authentic.
const REVIEWS_INITIAL_COUNT = 6;
const REVIEWS_IS_EN = document.documentElement.lang === "en";
const REVIEWS_T = REVIEWS_IS_EN
  ? {
      empty: "No reviews yet &ndash; check back soon!",
      error: "Reviews could not be loaded.",
      example: "Example",
      stars: (n) => `${n} out of 5 stars`,
      more: (n) => `Show ${n} more reviews`,
    }
  : {
      empty: "Noch keine Bewertungen &ndash; schauen Sie bald wieder vorbei!",
      error: "Bewertungen konnten nicht geladen werden.",
      example: "Beispiel",
      stars: (n) => `${n} von 5 Sternen`,
      more: (n) => `${n} weitere Bewertungen anzeigen`,
    };

document.addEventListener("DOMContentLoaded", async () => {
  const wrap = document.getElementById("reviews-wrap");
  if (!wrap) return;
  const moreWrap = document.getElementById("reviews-more");
  const dataSrc = wrap.dataset.src || "assets/data/bewertungen.json";

  try {
    const res = await fetch(dataSrc, { cache: "no-store" });
    const all = await res.json();
    const reviews = Array.isArray(all) ? all.filter((r) => r.text && r.text.trim()) : [];

    if (reviews.length === 0) {
      wrap.innerHTML = `<p class="reviews-note">${REVIEWS_T.empty}</p>`;
      return;
    }

    const renderCard = (r) => {
      const stars = "★".repeat(Math.max(0, Math.min(5, r.bewertung || 5)));
      const badge = r.beispiel ? `<span class="badge-beispiel">${REVIEWS_T.example}</span>` : "";
      const herkunft = [r.land, r.ort].filter(Boolean).join(", ");
      return `
        <div class="review-card">
          ${badge}
          <div class="stars" aria-label="${REVIEWS_T.stars(stars.length)}">${stars}</div>
          <p>&bdquo;${escapeHtml(r.text || "")}&ldquo;</p>
          <div class="meta">${escapeHtml(r.name || "")}${herkunft ? " &middot; " + escapeHtml(herkunft) : ""}</div>
        </div>`;
    };

    wrap.innerHTML = reviews.slice(0, REVIEWS_INITIAL_COUNT).map(renderCard).join("");

    if (reviews.length > REVIEWS_INITIAL_COUNT && moreWrap) {
      const remaining = reviews.slice(REVIEWS_INITIAL_COUNT);
      const btn = document.createElement("button");
      btn.className = "btn btn-outline";
      btn.textContent = REVIEWS_T.more(remaining.length);
      btn.addEventListener("click", () => {
        wrap.insertAdjacentHTML("beforeend", remaining.map(renderCard).join(""));
        btn.remove();
      });
      moreWrap.appendChild(btn);
    }
  } catch (e) {
    wrap.innerHTML = `<p class="reviews-note">${REVIEWS_T.error}</p>`;
  }
});

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
