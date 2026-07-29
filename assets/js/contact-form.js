// Opens the visitor's own email program with a pre-filled message to
// ch.nessier@gmx.ch - no third-party service, no backend involved.
const CONTACT_LANG = document.documentElement.lang || "de";
const CONTACT_STRINGS = {
  de: {
    required: "Bitte füllen Sie Name, E-Mail und Nachricht aus.",
    subject: "Anfrage über NessiAirBnB.ch",
    labels: { name: "Name", email: "E-Mail", phone: "Telefon", checkin: "Anreise", checkout: "Abreise", guests: "Anzahl Gäste", message: "Nachricht" },
    sent: "Ihr E-Mail-Programm sollte sich jetzt öffnen. Falls nicht, schreiben Sie uns direkt an ch.nessier@gmx.ch.",
  },
  en: {
    required: "Please fill in name, email and message.",
    subject: "Inquiry via NessiAirBnB.ch",
    labels: { name: "Name", email: "Email", phone: "Phone", checkin: "Check-in", checkout: "Check-out", guests: "Number of guests", message: "Message" },
    sent: "Your email program should open now. If not, please write to us directly at ch.nessier@gmx.ch.",
  },
  fr: {
    required: "Veuillez indiquer votre nom, e-mail et message.",
    subject: "Demande via NessiAirBnB.ch",
    labels: { name: "Nom", email: "E-mail", phone: "Téléphone", checkin: "Arrivée", checkout: "Départ", guests: "Nombre de personnes", message: "Message" },
    sent: "Votre programme de messagerie devrait s'ouvrir maintenant. Sinon, écrivez-nous directement à ch.nessier@gmx.ch.",
  },
};
const CONTACT_T = CONTACT_STRINGS[CONTACT_LANG] || CONTACT_STRINGS.de;

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
      status.textContent = CONTACT_T.required;
      status.className = "form-status show err";
      return;
    }

    const L = CONTACT_T.labels;
    const bodyLines = [
      `${L.name}: ${name}`,
      `${L.email}: ${email}`,
      telefon ? `${L.phone}: ${telefon}` : null,
      anreise ? `${L.checkin}: ${anreise}` : null,
      abreise ? `${L.checkout}: ${abreise}` : null,
      gaeste ? `${L.guests}: ${gaeste}` : null,
      "",
      `${L.message}:`,
      nachricht,
    ].filter((line) => line !== null);

    const subject = encodeURIComponent(CONTACT_T.subject);
    const body = encodeURIComponent(bodyLines.join("\n"));

    window.location.href = `mailto:ch.nessier@gmx.ch?subject=${subject}&body=${body}`;

    status.textContent = CONTACT_T.sent;
    status.className = "form-status show ok";
  });
});
