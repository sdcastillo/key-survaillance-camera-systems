(() => {
  const doc = document.getElementById("doc");
  const toc = document.getElementById("toc");
  const progress = document.getElementById("progress");
  const searchInput = document.getElementById("search");
  const searchPanel = document.getElementById("search-panel");
  const searchResults = document.getElementById("search-results");
  const searchMeta = document.getElementById("search-meta");
  const tocToggle = document.getElementById("toc-toggle");
  const sidebarClose = document.getElementById("sidebar-close");
  const backdrop = document.getElementById("backdrop");
  const siteHeader = document.querySelector(".site-header");
  const siteMenuToggle = document.getElementById("site-menu-toggle");

  function syncChromeOffset() {
    if (!siteHeader) return;
    const h = Math.round(siteHeader.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--site-nav-h", `${h}px`);
  }

  syncChromeOffset();
  window.addEventListener("resize", syncChromeOffset, { passive: true });

  if (siteMenuToggle && siteHeader) {
    siteMenuToggle.addEventListener("click", () => {
      const open = siteHeader.classList.toggle("site-nav-open");
      siteMenuToggle.setAttribute("aria-expanded", String(open));
      syncChromeOffset();
    });
  }

  if (!doc || !toc) return;

  const headings = [...doc.querySelectorAll("h1[id], h2[id]")].filter(
    (h) => h.id !== "welcome"
  );

  const fragment = document.createDocumentFragment();
  headings.forEach((heading) => {
    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent.trim();
    link.className = heading.tagName === "H1" ? "level-1" : "level-2";
    link.dataset.target = heading.id;
    fragment.appendChild(link);
  });
  toc.appendChild(fragment);

  const tocLinks = [...toc.querySelectorAll("a")];
  const mobileQuery = window.matchMedia("(max-width: 960px)");

  function setOpen(open) {
    document.body.classList.toggle("nav-open", open);
    tocToggle?.setAttribute("aria-expanded", String(open));
    if (backdrop) backdrop.hidden = !open;
  }

  tocToggle?.addEventListener("click", () => {
    setOpen(!document.body.classList.contains("nav-open"));
  });
  sidebarClose?.addEventListener("click", () => setOpen(false));
  backdrop?.addEventListener("click", () => setOpen(false));
  toc.addEventListener("click", (event) => {
    if (event.target.closest("a") && mobileQuery.matches) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (document.body.classList.contains("nav-open")) setOpen(false);
    if (siteHeader?.classList.contains("site-nav-open")) {
      siteHeader.classList.remove("site-nav-open");
      siteMenuToggle?.setAttribute("aria-expanded", "false");
      syncChromeOffset();
    }
  });

  function updateProgress() {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = height > 0 ? Math.min(1, scrollTop / height) : 0;
    if (progress) progress.style.width = `${ratio * 100}%`;
  }

  function updateActive() {
    const offset = window.scrollY + 140;
    let current = headings[0]?.id;
    for (const heading of headings) {
      if (heading.offsetTop <= offset) current = heading.id;
      else break;
    }
    tocLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.target === current);
    });
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateProgress();
        updateActive();
        ticking = false;
      });
    },
    { passive: true }
  );
  updateProgress();
  updateActive();

  const index = headings.map((heading) => {
    let node = heading.nextElementSibling;
    const bits = [];
    while (node && !/^H[12]$/.test(node.tagName)) {
      bits.push(node.textContent || "");
      node = node.nextElementSibling;
    }
    return {
      id: heading.id,
      title: heading.textContent.trim(),
      text: bits.join(" ").replace(/\s+/g, " ").trim().slice(0, 1200),
    };
  });

  function closeSearch() {
    if (searchPanel) searchPanel.hidden = true;
    if (searchResults) searchResults.innerHTML = "";
  }

  function renderSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      closeSearch();
      return;
    }

    const hits = index
      .map((item) => {
        const hay = `${item.title} ${item.text}`.toLowerCase();
        const score =
          (item.title.toLowerCase().includes(q) ? 5 : 0) +
          (hay.includes(q) ? 1 : 0);
        if (!score) return null;
        const idx = item.text.toLowerCase().indexOf(q);
        const start = Math.max(0, idx - 40);
        const snippet =
          idx >= 0
            ? `${start > 0 ? "…" : ""}${item.text.slice(start, start + 110)}${
                start + 110 < item.text.length ? "…" : ""
              }`
            : item.text.slice(0, 110);
        return { ...item, score, snippet };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);

    if (!searchPanel || !searchResults || !searchMeta) return;
    searchPanel.hidden = false;
    searchMeta.textContent =
      hits.length === 0
        ? `No matches for “${query.trim()}”`
        : `${hits.length} match${hits.length === 1 ? "" : "es"}`;

    searchResults.innerHTML = "";
    hits.forEach((hit) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${hit.id}`;
      a.innerHTML = `<strong></strong><span></span>`;
      a.querySelector("strong").textContent = hit.title;
      a.querySelector("span").textContent = hit.snippet;
      a.addEventListener("click", () => {
        closeSearch();
        if (mobileQuery.matches) setOpen(false);
      });
      li.appendChild(a);
      searchResults.appendChild(li);
    });
  }

  let searchTimer;
  searchInput?.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => renderSearch(searchInput.value), 120);
  });

  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      searchInput.value = "";
      closeSearch();
      searchInput.blur();
    }
  });

  document.addEventListener("click", (event) => {
    if (!searchPanel || searchPanel.hidden) return;
    if (event.target === searchInput || searchPanel.contains(event.target)) {
      return;
    }
    closeSearch();
  });
})();
