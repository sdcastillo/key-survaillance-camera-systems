/* =====================================================================
 * Key Surveillance Camera Systems — full field guide offer
 *
 * PRICE CONFIG: this object is the ONLY place prices live.
 *   - Change `amount` (whole US dollars) to change a price.
 *   - Add, remove or reorder tiers freely.
 *   - Each button links to https://cash.app/$<cashtag>/<amount>.
 * Payment is Cash App only. Delivery is manual: the buyer puts their
 * email in the Cash App note and Sam emails the PDF (or sets up the
 * consult) after he sees the payment.
 * ===================================================================== */
const FIELD_GUIDE_OFFER = {
  cashtag: "samiamcastillo",
  contactEmail: "ExamPATutor@gmail.com",
  tiers: [
    {
      id: "pdf",
      name: "Full field guide (PDF)",
      amount: 19, // USD
      blurb: "The complete manual as a 50+ page PDF: every chapter, diagram and table, ready for the truck or the office.",
      cta: "Pay with Cash App",
    },
    {
      id: "consult",
      name: "Field guide + remote setup consult",
      amount: 149, // USD
      blurb: "The PDF plus a one-on-one remote session to walk through your camera, NVR or access-control setup.",
      cta: "Pay with Cash App",
    },
  ],
};

(() => {
  const o = FIELD_GUIDE_OFFER;
  const fmt = (n) => "$" + Number(n).toLocaleString("en-US");
  const link = (n) => `https://cash.app/$${o.cashtag}/${n}`;
  document.querySelectorAll("[data-fg-tiers]").forEach((host) => {
    host.innerHTML = "";
    o.tiers.forEach((t) => {
      const card = document.createElement("div");
      card.className = "fg-tier";
      card.innerHTML =
        `<p class="fg-tier-name"></p><p class="fg-tier-price"></p><p class="fg-tier-blurb"></p>` +
        `<a class="btn btn-primary fg-pay" target="_blank" rel="noopener noreferrer"></a>`;
      card.querySelector(".fg-tier-name").textContent = t.name;
      card.querySelector(".fg-tier-price").textContent = fmt(t.amount);
      card.querySelector(".fg-tier-blurb").textContent = t.blurb;
      const a = card.querySelector(".fg-pay");
      a.href = link(t.amount);
      a.textContent = `${t.cta} · ${fmt(t.amount)}`;
      host.appendChild(card);
    });
  });
  document.querySelectorAll("[data-fg-cashtag]").forEach((el) => (el.textContent = "$" + o.cashtag));
  document.querySelectorAll("[data-fg-email]").forEach((el) => {
    el.textContent = o.contactEmail;
    if (el.tagName === "A") el.href = "mailto:" + o.contactEmail;
  });
})();
