(function () {
  "use strict";

  // ── THEME TOGGLE ──────────────────────────────────────
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;
  function getPreferredTheme() {
    const stored = localStorage.getItem("of-theme");
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("of-theme", theme);
  }
  setTheme(getPreferredTheme());
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme");
      setTheme(current === "light" ? "dark" : "light");
    });
  }
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("of-theme"))
        setTheme(e.matches ? "dark" : "light");
    });

  // ── HEADER SCROLL ─────────────────────────────────────
  const header = document.getElementById("header");
  window.addEventListener(
    "scroll",
    () => {
      header.classList.toggle("scrolled", window.scrollY > 50);
    },
    { passive: true },
  );

  // ── MOBILE NAV ────────────────────────────────────────
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", !expanded);
    navLinks.classList.toggle("open");
    document.body.style.overflow = expanded ? "" : "hidden";
  });
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  // ── SMOOTH SCROLL ─────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPos =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          20;
        window.scrollTo({ top: targetPos, behavior: "smooth" });
      }
    });
  });

  // ── SCROLL REVEAL ─────────────────────────────────────
  const revealElements = document.querySelectorAll(".reveal-up");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // ── COUNTER ANIMATION ─────────────────────────────────
  const counters = document.querySelectorAll(".stat-number[data-count]");
  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );
  counters.forEach((el) => counterObserver.observe(el));

  // ── CARD SWARM (preserved from original) ──────────────
  (function initSwarm() {
    const hero = document.getElementById("hero");
    const container = document.getElementById("swarmContainer");
    if (!hero || !container) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const serviceCards = document.querySelectorAll(".service-row");
    const cards = [];

    serviceCards.forEach((row) => {
      const id = row.id;
      const href = "#" + id;
      const titleEl = row.querySelector(".service-title-text");
      const title = titleEl ? titleEl.textContent.trim() : null;

      if (title && id) {
        cards.push({ label: title, href, type: "service" });
      }

      row.querySelectorAll(".service-tag-link").forEach((tag) => {
        cards.push({ label: tag.textContent.trim(), href, type: "tech" });
      });
    });

    const cardEls = cards.map((card) => {
      const a = document.createElement("a");
      a.className = "swarm-card";
      a.href = card.href;
      a.textContent = card.label;
      a.setAttribute("data-card-type", card.type);
      container.appendChild(a);
      return a;
    });

    cardEls.forEach((a) => {
      a.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerHeight = header.offsetHeight;
          const targetPos =
            target.getBoundingClientRect().top +
            window.scrollY -
            headerHeight -
            20;
          window.scrollTo({ top: targetPos, behavior: "smooth" });
        }
      });
    });

    if (isTouch || reducedMotion) return;

    const state = cardEls.map(() => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      w: 0,
      h: 0,
    }));
    let mouse = { x: -9999, y: -9999, active: false };

    function measure() {
      cardEls.forEach((el, i) => {
        state[i].w = el.offsetWidth;
        state[i].h = el.offsetHeight;
      });
    }

    function scatter() {
      const rect = hero.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const vertPad = h * 0.06;
      cardEls.forEach((el, i) => {
        state[i].x = Math.random() * (w - state[i].w);
        state[i].y =
          vertPad + Math.random() * (h - 2 * vertPad - state[i].h);
        state[i].vx = (Math.random() - 0.5) * 0.5;
        state[i].vy = (Math.random() - 0.5) * 0.5;
      });
    }

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    hero.addEventListener("mouseleave", () => {
      mouse.active = false;
    });

    const ATTRACTION = 0.11;
    const ATTRACT_RANGE = 550;
    const SEPARATION_DIST = 90;
    const SEPARATION_FORCE = 0.5;
    const DAMPING = 0.92;
    const MAX_SPEED = 4;
    const EDGE_PUSH = 0.3;
    const ACTIVE_RADIUS = 80;
    const SCALE_RANGE = 250;
    const MAX_SCALE = 1.25;

    let activeIndex = -1;
    let heroVisible = true;
    let animId = null;

    function updatePhysics() {
      const rect = hero.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      const n = state.length;
      let closestDist = Infinity;
      let closestIdx = -1;

      for (let i = 0; i < n; i++) {
        const s = state[i];
        const cx = s.x + s.w / 2;
        const cy = s.y + s.h / 2;

        if (mouse.active) {
          const dx = mouse.x - cx;
          const dy = mouse.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < ATTRACT_RANGE && dist > 1) {
            const t = 1 - dist / ATTRACT_RANGE;
            const strength = ATTRACTION * t * t;
            s.vx += (dx / dist) * strength;
            s.vy += (dy / dist) * strength;
          }
          if (dist < closestDist) {
            closestDist = dist;
            closestIdx = i;
          }
        }

        for (let j = i + 1; j < n; j++) {
          const o = state[j];
          const ocx = o.x + o.w / 2;
          const ocy = o.y + o.h / 2;
          const dx = cx - ocx;
          const dy = cy - ocy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < SEPARATION_DIST && dist > 0) {
            const force =
              ((SEPARATION_DIST - dist) / SEPARATION_DIST) *
              SEPARATION_FORCE;
            const nx = dx / dist;
            const ny = dy / dist;
            s.vx += nx * force;
            s.vy += ny * force;
            o.vx -= nx * force;
            o.vy -= ny * force;
          }
        }

        if (s.x < 0) s.vx += EDGE_PUSH;
        if (s.x + s.w > W) s.vx -= EDGE_PUSH;
        if (s.y < 0) s.vy += EDGE_PUSH;
        if (s.y + s.h > H) s.vy -= EDGE_PUSH;

        s.vx *= DAMPING;
        s.vy *= DAMPING;
        const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        if (speed > MAX_SPEED) {
          s.vx = (s.vx / speed) * MAX_SPEED;
          s.vy = (s.vy / speed) * MAX_SPEED;
        }
        s.x += s.vx;
        s.y += s.vy;
        s.x = Math.max(0, Math.min(W - s.w, s.x));
        s.y = Math.max(0, Math.min(H - s.h, s.y));
      }

      const newActive = closestDist < ACTIVE_RADIUS ? closestIdx : -1;
      if (newActive !== activeIndex) {
        if (activeIndex >= 0)
          cardEls[activeIndex].classList.remove("swarm-card--active");
        if (newActive >= 0)
          cardEls[newActive].classList.add("swarm-card--active");
        activeIndex = newActive;
      }

      for (let i = 0; i < n; i++) {
        let scale = 1;
        if (mouse.active) {
          const cx = state[i].x + state[i].w / 2;
          const cy = state[i].y + state[i].h / 2;
          const dx = mouse.x - cx;
          const dy = mouse.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < SCALE_RANGE) {
            const t = 1 - dist / SCALE_RANGE;
            scale = 1 + (MAX_SCALE - 1) * t * t;
          }
        }
        cardEls[i].style.transform =
          "translate(" +
          state[i].x.toFixed(1) +
          "px," +
          state[i].y.toFixed(1) +
          "px) scale(" +
          scale.toFixed(3) +
          ")";
      }
    }

    function loop() {
      if (!heroVisible) {
        animId = null;
        return;
      }
      updatePhysics();
      animId = requestAnimationFrame(loop);
    }

    const visObs = new IntersectionObserver(
      (entries) => {
        heroVisible = entries[0].isIntersecting;
        if (heroVisible && !animId) animId = requestAnimationFrame(loop);
      },
      { threshold: 0 },
    );
    visObs.observe(hero);

    window.addEventListener("resize", () => {
      measure();
      const rect = hero.getBoundingClientRect();
      state.forEach((s) => {
        s.x = Math.max(0, Math.min(rect.width - s.w, s.x));
        s.y = Math.max(0, Math.min(rect.height - s.h, s.y));
      });
    });

    window.addEventListener("load", () => {
      measure();
      scatter();
      animId = requestAnimationFrame(loop);
    });
  })();

  // ── COOKIE CONSENT BANNER (opt-out) ───────────────────
  (function () {
    var STORAGE_KEY = "of-cookie-consent";
    var GA_ID = "G-CBGMEPXECR";

    // Don't show if user already made a choice
    if (localStorage.getItem(STORAGE_KEY)) return;

    // Inject banner HTML
    var banner = document.createElement("div");
    banner.id = "cookieBanner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie consent");
    banner.innerHTML =
      '<div class="cb-inner">' +
      '<p class="cb-text">We use cookies (Google Analytics) to understand how visitors use this site. ' +
      'By continuing to browse, you accept this. <a href="/privacy-policy" class="cb-link">Privacy Policy</a></p>' +
      '<div class="cb-actions">' +
      '<button class="cb-btn cb-accept" id="cbAccept">Got it</button>' +
      '<button class="cb-btn cb-decline" id="cbDecline">Opt out</button>' +
      "</div>" +
      "</div>";

    // Inject styles
    var style = document.createElement("style");
    style.textContent =
      "#cookieBanner{position:fixed;bottom:0;left:0;right:0;z-index:9999;" +
      "background:var(--bg-dark-elevated,#1a1a1a);border-top:1px solid var(--border-light,#2a2a2a);" +
      "padding:1rem 1.5rem;font-family:var(--font-sans,sans-serif);font-size:0.88rem;" +
      "color:var(--text-white-muted,#999);transform:translateY(100%);opacity:0;" +
      "transition:transform 0.4s cubic-bezier(0.16,1,0.3,1),opacity 0.4s ease}" +
      "#cookieBanner.cb-visible{transform:translateY(0);opacity:1}" +
      ".cb-inner{max-width:1060px;margin:0 auto;display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap}" +
      ".cb-text{flex:1;min-width:280px;line-height:1.6;margin:0}" +
      ".cb-link{color:var(--accent,#a855f7);text-decoration:underline}" +
      ".cb-actions{display:flex;gap:0.5rem;flex-shrink:0}" +
      ".cb-btn{font-family:inherit;font-size:0.85rem;font-weight:500;padding:0.5rem 1.25rem;" +
      "border-radius:100px;cursor:pointer;border:none;transition:background 0.2s,color 0.2s}" +
      ".cb-accept{background:var(--accent,#a855f7);color:#0a0a0a}" +
      ".cb-accept:hover{background:var(--accent-hover,#9333ea)}" +
      ".cb-decline{background:transparent;color:var(--text-white-muted,#999);" +
      "border:1px solid var(--border-light,#2a2a2a)}" +
      ".cb-decline:hover{border-color:var(--accent,#a855f7);color:var(--accent,#a855f7)}" +
      "@media(max-width:600px){.cb-inner{flex-direction:column;text-align:center}" +
      ".cb-actions{justify-content:center}}";

    document.head.appendChild(style);
    document.body.appendChild(banner);

    // Animate in after a short delay
    setTimeout(function () {
      banner.classList.add("cb-visible");
    }, 800);

    function dismiss(choice) {
      localStorage.setItem(STORAGE_KEY, choice);
      banner.classList.remove("cb-visible");
      setTimeout(function () {
        banner.remove();
      }, 500);

      if (choice === "declined") {
        // Disable GA and clear cookies
        window["ga-disable-" + GA_ID] = true;
        document.cookie = "_ga=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.orbanforest.ca";
        document.cookie = "_ga_CBGMEPXECR=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.orbanforest.ca";
        document.cookie = "_gid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.orbanforest.ca";
      }
    }

    document.getElementById("cbAccept").addEventListener("click", function () {
      dismiss("accepted");
    });
    document.getElementById("cbDecline").addEventListener("click", function () {
      dismiss("declined");
    });
  })();
})();
