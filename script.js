/* ==========================================================================
   ORION — Landing Page interactions
   ========================================================================== */
(function () {
  "use strict";

  /* --------------------------------------------------------------------
     Install links
     Edge Add-ons is live. Chrome Web Store is still in review — fill in
     CHROME_URL as soon as it's approved and everything below updates
     itself, no other changes needed.
     -------------------------------------------------------------------- */
  const EDGE_URL = "https://microsoftedge.microsoft.com/addons/detail/cjachpeklopkllnibifmblppinnhjaig";
  const CHROME_URL = ""; // ex.: "https://chromewebstore.google.com/detail/xxxxxxxx"

  const isEdge = /Edg\//.test(navigator.userAgent);
  const isChrome = !isEdge && /Chrome\//.test(navigator.userAgent);

  document.querySelectorAll("[data-install-link]").forEach((el) => {
    // Browser detected and its store link is ready → send straight there.
    if (isEdge && EDGE_URL) {
      el.setAttribute("href", EDGE_URL);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
      return;
    }
    if (isChrome && CHROME_URL) {
      el.setAttribute("href", CHROME_URL);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
      return;
    }
    // Chrome not published yet, but Edge is → offer the Edge link as the
    // best available option rather than a dead end.
    if (EDGE_URL) {
      el.setAttribute("href", EDGE_URL);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
      return;
    }
    // Neither link ready yet → send to Sugestões instead of a dead link.
    el.setAttribute("href", "#sugestoes");
    el.setAttribute("aria-disabled", "true");
    el.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("sugestoes")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* --------------------------------------------------------------------
     Store badges under the hero CTAs — shows availability per browser
     -------------------------------------------------------------------- */
  const storeStatus = document.getElementById("storeStatus");
  if (storeStatus) {
    const edgeState = EDGE_URL ? "ready" : "pending";
    const chromeState = CHROME_URL ? "ready" : "pending";
    storeStatus.innerHTML = `
      <span class="store-pill store-pill-${edgeState}">Edge Add-ons${EDGE_URL ? " · disponível" : " · em breve"}</span>
      <span class="store-pill store-pill-${chromeState}">Chrome Web Store${CHROME_URL ? " · disponível" : " · em análise"}</span>
    `;
  }

  /* --------------------------------------------------------------------
     Mobile navigation
     -------------------------------------------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");

  navToggle?.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  /* --------------------------------------------------------------------
     Scroll reveal
     -------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* --------------------------------------------------------------------
     Accordion (FAQ)
     -------------------------------------------------------------------- */
  document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const panel = trigger.nextElementSibling;
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      // Close all other panels (single-open accordion)
      document.querySelectorAll(".accordion-trigger").forEach((t) => {
        if (t !== trigger) {
          t.setAttribute("aria-expanded", "false");
          t.nextElementSibling.style.maxHeight = null;
        }
      });

      trigger.setAttribute("aria-expanded", String(!isOpen));
      panel.style.maxHeight = isOpen ? null : panel.scrollHeight + "px";
    });
  });

  /* --------------------------------------------------------------------
     Widget mode tabs
     -------------------------------------------------------------------- */
  const modeTabs = document.querySelectorAll(".mode-tab");
  const modeDescs = document.querySelectorAll("[data-mode-desc]");

  modeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      modeTabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");

      const mode = tab.dataset.mode;
      modeDescs.forEach((desc) => {
        desc.hidden = desc.dataset.modeDesc !== mode;
      });
    });
  });

  /* --------------------------------------------------------------------
     Hero widget mock — "Atualizar" spin + fake sync counter
     -------------------------------------------------------------------- */
  const wmRefresh = document.getElementById("wmRefresh");
  const syncSecondsEl = document.getElementById("syncSeconds");
  let syncSeconds = 3;

  wmRefresh?.addEventListener("click", () => {
    wmRefresh.classList.add("is-spinning");
    syncSeconds = 0;
    if (syncSecondsEl) syncSecondsEl.textContent = syncSeconds;
    setTimeout(() => wmRefresh.classList.remove("is-spinning"), 550);
  });

  if (syncSecondsEl) {
    setInterval(() => {
      syncSeconds = syncSeconds >= 15 ? 0 : syncSeconds + 1;
      syncSecondsEl.textContent = syncSeconds;
    }, 1000);
  }

  /* --------------------------------------------------------------------
     Suggestion form → mailto
     -------------------------------------------------------------------- */
  const suggestionForm = document.getElementById("suggestionForm");

  suggestionForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const subject = document.getElementById("suggestionSubject").value.trim();
    const message = document.getElementById("suggestionMessage").value.trim();

    const recipients = [
      "ruan.nascimento@linx.com.br",
      "ruan.nascimento@totvs.com.br",
    ].join(",");

    const mailSubject = encodeURIComponent(`[Orion] ${subject || "Sugestão"}`);
    const mailBody = encodeURIComponent(message);

    window.location.href = `mailto:${recipients}?subject=${mailSubject}&body=${mailBody}`;
  });

  /* --------------------------------------------------------------------
     Active nav link highlighting on scroll
     -------------------------------------------------------------------- */
  const sections = document.querySelectorAll("main section[id], header[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.style.color =
                link.getAttribute("href") === `#${id}` ? "var(--navy-950)" : "";
            });
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((s) => navObserver.observe(s));
  }
})();
