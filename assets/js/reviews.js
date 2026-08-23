// Loads guest comments from the shared assets/data/bewertungen.json.
// Two render modes, chosen via data-mode on #reviews-wrap:
//  - default: a grid showing the first few reviews with a "show more" button
//    (used on /gaeste/).
//  - "carousel": a swipeable, auto-advancing horizontal carousel with
//    arrow + dot controls (used on the homepage for a livelier feel).
// UI strings switch based on <html lang>; review text itself is shown as
// originally submitted (not machine-translated) to keep quotes authentic.
const REVIEWS_INITIAL_COUNT = 6;
const REVIEWS_CAROUSEL_MAX = 12;
const REVIEWS_AUTOPLAY_MS = 4500;
const REVIEWS_LANG = document.documentElement.lang || "de";
const REVIEWS_STRINGS = {
  de: {
    empty: "Noch keine Bewertungen &ndash; schauen Sie bald wieder vorbei!",
    error: "Bewertungen konnten nicht geladen werden.",
    example: "Beispiel",
    stars: (n) => `${n} von 5 Sternen`,
    more: (n) => `${n} weitere Bewertungen anzeigen`,
    prev: "Vorherige Bewertung",
    next: "Nächste Bewertung",
    goTo: (n) => `Zu Bewertung ${n} springen`,
  },
  en: {
    empty: "No reviews yet &ndash; check back soon!",
    error: "Reviews could not be loaded.",
    example: "Example",
    stars: (n) => `${n} out of 5 stars`,
    more: (n) => `Show ${n} more reviews`,
    prev: "Previous review",
    next: "Next review",
    goTo: (n) => `Jump to review ${n}`,
  },
  fr: {
    empty: "Pas encore d'avis &ndash; revenez bientôt !",
    error: "Les avis n'ont pas pu être chargés.",
    example: "Exemple",
    stars: (n) => `${n} sur 5 étoiles`,
    more: (n) => `Afficher ${n} avis supplémentaires`,
    prev: "Avis précédent",
    next: "Avis suivant",
    goTo: (n) => `Aller à l'avis ${n}`,
  },
};
const REVIEWS_T = REVIEWS_STRINGS[REVIEWS_LANG] || REVIEWS_STRINGS.de;

document.addEventListener("DOMContentLoaded", async () => {
  const wrap = document.getElementById("reviews-wrap");
  if (!wrap) return;
  const moreWrap = document.getElementById("reviews-more");
  const dataSrc = wrap.dataset.src || "assets/data/bewertungen.json";
  const isCarousel = wrap.dataset.mode === "carousel";

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

    if (isCarousel) {
      const shown = reviews.slice(0, REVIEWS_CAROUSEL_MAX);
      wrap.classList.add("carousel-mode");
      wrap.setAttribute("role", "region");
      wrap.innerHTML = shown.map(renderCard).join("");
      if (shown.length > 1 && moreWrap) initCarousel(wrap, moreWrap, shown.length);
      return;
    }

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

function initCarousel(track, controlsHost, count) {
  const cards = () => Array.from(track.children);

  const controls = document.createElement("div");
  controls.className = "carousel-controls";

  const prevBtn = document.createElement("button");
  prevBtn.className = "carousel-btn";
  prevBtn.setAttribute("aria-label", REVIEWS_T.prev);
  prevBtn.innerHTML = "&#8249;";

  const dots = document.createElement("div");
  dots.className = "carousel-dots";
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("button");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", REVIEWS_T.goTo(i + 1));
    dot.addEventListener("click", () => {
      scrollToIndex(i);
      resetAutoplay();
    });
    dots.appendChild(dot);
  }

  const nextBtn = document.createElement("button");
  nextBtn.className = "carousel-btn";
  nextBtn.setAttribute("aria-label", REVIEWS_T.next);
  nextBtn.innerHTML = "&#8250;";

  controls.append(prevBtn, dots, nextBtn);
  controlsHost.appendChild(controls);

  function step() {
    const els = cards();
    if (els.length < 2) return els[0] ? els[0].getBoundingClientRect().width : 0;
    return els[1].offsetLeft - els[0].offsetLeft;
  }

  function currentIndex() {
    const s = step();
    return s ? Math.round(track.scrollLeft / s) : 0;
  }

  function scrollToIndex(i) {
    const els = cards();
    const clamped = Math.max(0, Math.min(els.length - 1, i));
    if (els[clamped]) track.scrollTo({ left: els[clamped].offsetLeft, behavior: "smooth" });
  }

  function updateDots() {
    const idx = Math.max(0, Math.min(count - 1, currentIndex()));
    Array.from(dots.children).forEach((d, i) => d.classList.toggle("active", i === idx));
  }

  let scrollTimer;
  track.addEventListener("scroll", () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(updateDots, 100);
  });

  prevBtn.addEventListener("click", () => {
    scrollToIndex(currentIndex() - 1);
    resetAutoplay();
  });
  nextBtn.addEventListener("click", () => {
    scrollToIndex(currentIndex() + 1 >= count ? 0 : currentIndex() + 1);
    resetAutoplay();
  });

  let autoplayTimer;
  function tick() {
    const next = currentIndex() + 1 >= count ? 0 : currentIndex() + 1;
    scrollToIndex(next);
  }
  function startAutoplay() {
    autoplayTimer = setInterval(tick, REVIEWS_AUTOPLAY_MS);
  }
  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }
  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  track.addEventListener("pointerenter", stopAutoplay);
  track.addEventListener("pointerleave", startAutoplay);
  track.addEventListener("touchstart", stopAutoplay, { passive: true });
  track.addEventListener("touchend", () => setTimeout(startAutoplay, 2000), { passive: true });
  controls.addEventListener("pointerenter", stopAutoplay);
  controls.addEventListener("pointerleave", startAutoplay);

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) startAutoplay();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
