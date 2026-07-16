// Loads guest comments from the shared assets/data/bewertungen.json onto the
// homepage. The same file also feeds the guest map on /gaeste/ - edit it to
// add, remove or update entries, no code changes needed.
const REVIEWS_INITIAL_COUNT = 6;

document.addEventListener("DOMContentLoaded", async () => {
  const wrap = document.getElementById("reviews-wrap");
  if (!wrap) return;
  const moreWrap = document.getElementById("reviews-more");

  try {
    const res = await fetch("assets/data/bewertungen.json", { cache: "no-store" });
    const all = await res.json();
    const reviews = Array.isArray(all) ? all.filter((r) => r.text && r.text.trim()) : [];

    if (reviews.length === 0) {
      wrap.innerHTML = '<p class="reviews-note">Noch keine Bewertungen &ndash; schauen Sie bald wieder vorbei!</p>';
      return;
    }

    const renderCard = (r) => {
      const stars = "★".repeat(Math.max(0, Math.min(5, r.bewertung || 5)));
      const badge = r.beispiel ? '<span class="badge-beispiel">Beispiel</span>' : "";
      const herkunft = [r.land, r.ort].filter(Boolean).join(", ");
      return `
        <div class="review-card">
          ${badge}
          <div class="stars" aria-label="${stars.length} von 5 Sternen">${stars}</div>
          <p>&bdquo;${escapeHtml(r.text || "")}&ldquo;</p>
          <div class="meta">${escapeHtml(r.name || "")}${herkunft ? " &middot; " + escapeHtml(herkunft) : ""}</div>
        </div>`;
    };

    wrap.innerHTML = reviews.slice(0, REVIEWS_INITIAL_COUNT).map(renderCard).join("");

    if (reviews.length > REVIEWS_INITIAL_COUNT && moreWrap) {
      const remaining = reviews.slice(REVIEWS_INITIAL_COUNT);
      const btn = document.createElement("button");
      btn.className = "btn btn-outline";
      btn.style.color = "var(--c-dark)";
      btn.style.borderColor = "var(--c-dark)";
      btn.textContent = `${remaining.length} weitere Bewertungen anzeigen`;
      btn.addEventListener("click", () => {
        wrap.insertAdjacentHTML("beforeend", remaining.map(renderCard).join(""));
        btn.remove();
      });
      moreWrap.appendChild(btn);
    }
  } catch (e) {
    wrap.innerHTML = '<p class="reviews-note">Bewertungen konnten nicht geladen werden.</p>';
  }
});

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
