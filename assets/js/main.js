/* ============================================================
   ORBAN FOREST INC. — Main JavaScript
   Theme toggle, scroll reveals, nav behavior, counter animation
   ============================================================ */

(function () {
  'use strict';

  // ── THEME TOGGLE ──────────────────────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  function getPreferredTheme() {
    const stored = localStorage.getItem('of-theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('of-theme', theme);
  }

  // Initialize theme
  setTheme(getPreferredTheme());

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    setTheme(current === 'light' ? 'dark' : 'light');
  });

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('of-theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ── HEADER SCROLL ─────────────────────────────────────────
  const header = document.getElementById('header');
  let lastScrollY = 0;

  function handleHeaderScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // ── MOBILE NAV ────────────────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !expanded);
    navLinks.classList.toggle('open');
    document.body.style.overflow = expanded ? '' : 'hidden';
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // ── SCROLL REVEAL ─────────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal-up');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ── COUNTER ANIMATION ─────────────────────────────────────
  const counters = document.querySelectorAll('.stat-number[data-count]');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => counterObserver.observe(el));

  // ── CARD SWARM ──────────────────────────────────────────────
  (function initSwarm() {
    const hero = document.getElementById('hero');
    const container = document.getElementById('swarmContainer');
    if (!hero || !container) return;

    // Skip animation on touch devices or reduced motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Card data: 6 services (primary) + 14 tech tags (secondary)
    const cards = [
      { label: '3D Animation', href: '#services', type: 'service' },
      { label: 'Web Applications', href: '#services', type: 'service' },
      { label: 'Websites', href: '#services', type: 'service' },
      { label: 'AR/VR Experiences', href: '#services', type: 'service' },
      { label: 'AI Automations', href: '#services', type: 'service' },
      { label: 'Branding & Design', href: '#services', type: 'service' },
      { label: 'Character Design', href: '#services', type: 'tech' },
      { label: 'Motion Graphics', href: '#services', type: 'tech' },
      { label: 'React', href: '#services', type: 'tech' },
      { label: 'Next.js', href: '#services', type: 'tech' },
      { label: 'Node.js', href: '#services', type: 'tech' },
      { label: 'Unity', href: '#services', type: 'tech' },
      { label: 'WebXR', href: '#services', type: 'tech' },
      { label: 'Machine Learning', href: '#services', type: 'tech' },
      { label: 'UI/UX Design', href: '#services', type: 'tech' },
      { label: 'WordPress', href: '#services', type: 'tech' },
      { label: 'Blender', href: '#services', type: 'tech' },
      { label: 'LLM Integration', href: '#services', type: 'tech' },
      { label: 'Spatial Computing', href: '#services', type: 'tech' },
      { label: 'E-Commerce', href: '#services', type: 'tech' },
    ];

    // Generate DOM elements
    const cardEls = cards.map(card => {
      const a = document.createElement('a');
      a.className = 'swarm-card';
      a.href = card.href;
      a.textContent = card.label;
      a.setAttribute('data-card-type', card.type);
      container.appendChild(a);
      return a;
    });

    // Skip physics on touch/reduced-motion (CSS handles static layout)
    if (isTouch || reducedMotion) return;

    // Physics state per card
    const state = cardEls.map(() => ({
      x: 0, y: 0, vx: 0, vy: 0, w: 0, h: 0,
    }));

    // Mouse state
    let mouse = { x: -9999, y: -9999, active: false };

    // Measure hero and card sizes
    function measure() {
      cardEls.forEach((el, i) => {
        state[i].w = el.offsetWidth;
        state[i].h = el.offsetHeight;
      });
    }

    // Scatter cards randomly within hero bounds
    function scatter() {
      const rect = hero.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      cardEls.forEach((el, i) => {
        state[i].x = Math.random() * (w - state[i].w);
        state[i].y = Math.random() * (h - state[i].h);
        state[i].vx = (Math.random() - 0.5) * 0.5;
        state[i].vy = (Math.random() - 0.5) * 0.5;
      });
    }

    // Mouse tracking
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });

    hero.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    // Physics constants
    const ATTRACTION = 0.0008;
    const SEPARATION_DIST = 120;
    const SEPARATION_FORCE = 0.8;
    const DAMPING = 0.92;
    const MAX_SPEED = 4;
    const EDGE_PUSH = 0.3;
    const ACTIVE_RADIUS = 80;

    let activeIndex = -1;
    let heroVisible = true;
    let animId = null;

    function updatePhysics() {
      const rect = hero.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      const n = state.length;

      // Clear active
      let closestDist = Infinity;
      let closestIdx = -1;

      for (let i = 0; i < n; i++) {
        const s = state[i];
        const cx = s.x + s.w / 2;
        const cy = s.y + s.h / 2;

        // Attraction toward cursor
        if (mouse.active) {
          const dx = mouse.x - cx;
          const dy = mouse.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const cappedDist = Math.max(dist, 50);
          s.vx += (dx / cappedDist) * ATTRACTION * cappedDist;
          s.vy += (dy / cappedDist) * ATTRACTION * cappedDist;

          // Track closest to cursor for active state
          if (dist < closestDist) {
            closestDist = dist;
            closestIdx = i;
          }
        }

        // Separation from other cards
        for (let j = i + 1; j < n; j++) {
          const o = state[j];
          const ocx = o.x + o.w / 2;
          const ocy = o.y + o.h / 2;
          const dx = cx - ocx;
          const dy = cy - ocy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < SEPARATION_DIST && dist > 0) {
            const force = (SEPARATION_DIST - dist) / SEPARATION_DIST * SEPARATION_FORCE;
            const nx = dx / dist;
            const ny = dy / dist;
            s.vx += nx * force;
            s.vy += ny * force;
            o.vx -= nx * force;
            o.vy -= ny * force;
          }
        }

        // Boundary containment (soft push)
        if (s.x < 0) s.vx += EDGE_PUSH;
        if (s.x + s.w > W) s.vx -= EDGE_PUSH;
        if (s.y < 0) s.vy += EDGE_PUSH;
        if (s.y + s.h > H) s.vy -= EDGE_PUSH;

        // Damping
        s.vx *= DAMPING;
        s.vy *= DAMPING;

        // Velocity cap
        const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        if (speed > MAX_SPEED) {
          s.vx = (s.vx / speed) * MAX_SPEED;
          s.vy = (s.vy / speed) * MAX_SPEED;
        }

        // Integrate position
        s.x += s.vx;
        s.y += s.vy;

        // Hard clamp to bounds
        s.x = Math.max(0, Math.min(W - s.w, s.x));
        s.y = Math.max(0, Math.min(H - s.h, s.y));
      }

      // Active card detection
      const newActive = (closestDist < ACTIVE_RADIUS) ? closestIdx : -1;
      if (newActive !== activeIndex) {
        if (activeIndex >= 0) cardEls[activeIndex].classList.remove('swarm-card--active');
        if (newActive >= 0) cardEls[newActive].classList.add('swarm-card--active');
        activeIndex = newActive;
      }

      // Batch render
      for (let i = 0; i < n; i++) {
        cardEls[i].style.transform = 'translate(' + state[i].x.toFixed(1) + 'px,' + state[i].y.toFixed(1) + 'px)';
      }
    }

    function loop() {
      if (!heroVisible) { animId = null; return; }
      updatePhysics();
      animId = requestAnimationFrame(loop);
    }

    // IntersectionObserver to pause when hero scrolls off-screen
    const visObs = new IntersectionObserver((entries) => {
      heroVisible = entries[0].isIntersecting;
      if (heroVisible && !animId) {
        animId = requestAnimationFrame(loop);
      }
    }, { threshold: 0 });
    visObs.observe(hero);

    // Resize handler
    window.addEventListener('resize', () => {
      measure();
      const rect = hero.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      state.forEach(s => {
        s.x = Math.min(s.x, W - s.w);
        s.y = Math.min(s.y, H - s.h);
      });
    });

    // Initialize after layout
    window.addEventListener('load', () => {
      measure();
      scatter();
      animId = requestAnimationFrame(loop);
    });
  })();

  // ── SERVICE CARD TILT (subtle, desktop only) ──────────────
  if (window.matchMedia('(min-width: 769px)').matches) {
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-4px) perspective(600px) rotateX(${y * -3}deg) rotateY(${x * 3}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

})();
