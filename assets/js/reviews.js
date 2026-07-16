// Loads guest comments from assets/data/reviews.json onto the homepage.
// Edit that JSON file to add, remove or update comments - no code changes needed.
document.addEventListener("DOMContentLoaded", async () => {
  const wrap = document.getElementById("reviews-wrap");
  if (!wrap) return;

  try {
    const res = await fetch("assets/data/reviews.json", { cache: "no-store" });
    const reviews = await res.json();

    if (!Array.isArray(reviews) || reviews.length === 0) {
      wrap.innerHTML = '<p class="reviews-note">Noch keine Bewertungen &ndash; schauen Sie bald wieder vorbei!</p>';
      return;
    }

    wrap.innerHTML = reviews
      .map((r) => {
        const stars = "★".repeat(Math.max(0, Math.min(5, r.bewertung || 5)));
        const badge = r.beispiel ? '<span class="badge-beispiel">Beispiel</span>' : "";
        return `
          <div class="review-card">
            ${badge}
            <div class="stars" aria-label="${stars.length} von 5 Sternen">${stars}</div>
            <p>&bdquo;${escapeHtml(r.text || "")}&ldquo;</p>
            <div class="meta">${escapeHtml(r.name || "")} &middot; ${escapeHtml(r.herkunft || "")}</div>
          </div>`;
      })
      .join("");
  } catch (e) {
    wrap.innerHTML = '<p class="reviews-note">Bewertungen konnten nicht geladen werden.</p>';
  }
});

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
