// Opens the visitor's own email program with a pre-filled message to
// ch.nessier@gmx.ch - no third-party service, no backend involved.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = document.getElementById("form-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const anreise = form.querySelector("#anreise").value;
    const abreise = form.querySelector("#abreise").value;
    const gaeste = form.querySelector("#gaeste").value;
    const telefon = form.querySelector("#telefon").value.trim();
    const nachricht = form.querySelector("#nachricht").value.trim();

    if (!name || !email || !nachricht) {
      status.textContent = "Bitte füllen Sie Name, E-Mail und Nachricht aus.";
      status.className = "form-status show err";
      return;
    }

    const bodyLines = [
      `Name: ${name}`,
      `E-Mail: ${email}`,
      telefon ? `Telefon: ${telefon}` : null,
      anreise ? `Anreise: ${anreise}` : null,
      abreise ? `Abreise: ${abreise}` : null,
      gaeste ? `Anzahl Gäste: ${gaeste}` : null,
      "",
      "Nachricht:",
      nachricht,
    ].filter((line) => line !== null);

    const subject = encodeURIComponent("Anfrage über NessiAirBnB.ch");
    const body = encodeURIComponent(bodyLines.join("\n"));

    window.location.href = `mailto:ch.nessier@gmx.ch?subject=${subject}&body=${body}`;

    status.textContent = "Ihr E-Mail-Programm sollte sich jetzt öffnen. Falls nicht, schreiben Sie uns direkt an ch.nessier@gmx.ch.";
    status.className = "form-status show ok";
  });
});
