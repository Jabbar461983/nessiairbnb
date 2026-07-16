// Sends the contact form via Formspree (no backend needed) to ch.nessier@gmx.ch.
// On first-ever submission Formspree emails a one-time confirmation link to that
// address; once confirmed, every future submission is delivered automatically.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = document.getElementById("form-status");
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = "form-status";
    submitBtn.disabled = true;
    submitBtn.textContent = "Wird gesendet...";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        status.textContent = "Vielen Dank! Ihre Nachricht wurde versendet. Wir melden uns so bald wie möglich.";
        status.classList.add("show", "ok");
        form.reset();
      } else {
        throw new Error("send-failed");
      }
    } catch (err) {
      status.innerHTML =
        'Die Nachricht konnte nicht automatisch gesendet werden. Bitte schreiben Sie uns direkt an ' +
        '<a href="mailto:ch.nessier@gmx.ch">ch.nessier@gmx.ch</a>.';
      status.classList.add("show", "err");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Nachricht senden";
    }
  });
});
