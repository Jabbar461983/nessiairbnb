// Fades/slides ".reveal" elements into view as they scroll into the
// viewport. Respects prefers-reduced-motion (reveals everything instantly).
document.addEventListener("DOMContentLoaded", () => {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  els.forEach((el) => io.observe(el));
});
