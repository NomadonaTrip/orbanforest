# Tomos.app Credibility Signal — Design

## Context

Orban Forest Inc. is building client engagement "from scratch" (no CRM/email list currently exists). The first concrete piece of that effort is surfacing **Tomos.app** — an in-house AI receipt scanner, currently in internal testing — on the marketing site as proof that Orban Forest doesn't just consult on AI, it builds and ships AI products itself.

**Positioning / messaging angle (fixed):** "We don't just consult on AI — we build and ship our own AI products." This is a pure credibility signal, not a lead-gen mechanism for Tomos itself. Tomos already has its own waitlist with its own backend at `https://tomos.app/waitlist#waitlist` — the site only needs to link out to it, no new form/backend work.

**Asset status:** A Tomos logo/brand mark exists. The 3D illustration depicting what the app does is not yet created. This design specifies placement/sizing/treatment now; the real illustration file drops in later without layout changes.

## Scope

Four touchpoints across the existing static site (`/mnt/e/TOOLMAKER/WEB PROJECTS/orban_forest_3`, plain HTML/CSS/JS, no build step, no backend beyond the existing Google-Forms-as-backend trick used by the contact form):

1. Homepage hero teaser
2. Homepage full-reveal section
3. AI-automation page proof point
4. Dedicated case study page, plus a lightweight card in the homepage "Featured Projects" grid

## 1. Homepage hero teaser

`index.html`'s `<section class="hero" id="hero">` (lines 304-358) is `min-height: 100vh; overflow: hidden` (`assets/css/styles.css:346-353`) with no background image — two CSS radial gradients only. There's no room to let an image bleed past the viewport edge without fighting `overflow: hidden`, so the illustration is treated as one tall image shown in two crops instead of one continuous bleed:

- A small "peek" chip (~140-180px tall, rounded top corners, subtle drop shadow) anchored bottom-center of the hero, showing the top crop of the illustration (`object-fit: cover; object-position: top`, or `background-position: top` if implemented as a background-image div).
- It replaces/merges with the existing `.hero-scroll` cue (`index.html:347-357`, currently a plain scroll-down chevron with a `scrollIntoView` onclick) — same click-to-scroll interaction, but now visually a clickable product teaser instead of a bare chevron. Keep a small bounce/pulse animation so it still reads as "scroll for more," not just a static thumbnail.
- Click target changes from whatever the chevron currently scrolls to, to the new `#tomos` section (item 2 below).
- Sits within `.swarm-container`'s z-index stack but above `.swarm-fade` so it stays legible; must not visually collide with the hero's centered headline/CTA content.
- Placeholder: until the real illustration exists, use a flat-color/gradient block in the Tomos brand mark's palette sized to the same crop dimensions, so the swap-in later is a one-line asset change, not a layout change.

## 2. Homepage full-reveal section

New `<section id="tomos" class="section-light">` (or matching whatever the existing light-section pattern is) inserted immediately after `</section>` closing the hero (`index.html:358`) and before `.intro-section` (`index.html:360`). This is the payoff for the teaser click/scroll.

Contents:
- Eyebrow label: "Our Own Product"
- Headline: "We don't just consult on AI — we build and ship it."
- 2-3 sentences introducing Tomos as an in-house AI-powered receipt scanner, still in internal testing.
- Full illustration (same placeholder-now, real-asset-later approach as the teaser — same source image, different crop/size, so the two visually connect as one picture split by the fold).
- Tomos logo/brand mark.
- Two CTAs:
  - "See how we built it" → internal link to the new case study page (item 4).
  - "Join the waitlist" → external link to `https://tomos.app/waitlist#waitlist`, opens in a new tab (`target="_blank" rel="noopener"`).

## 3. AI-automation page proof point

New subsection in `ai-automation.html`, inserted before the "Why Work With a Local AI Automation Agency" `<h2>` (`ai-automation.html:427`), after "Industries We Work With" (`ai-automation.html:323`). Lighter treatment than the homepage — no large illustration, just:
- Tomos logo/brand mark (small)
- 2-3 sentences, same "we build our own AI products" framing, contextualized to this page's audience (people evaluating Orban Forest specifically for AI automation work).
- Same two links as the homepage section (case study + waitlist).

Rationale for placement: lands as social proof right before the page's closing persuasion pitch, without interrupting the FAQ/CTA close.

## 4. Dedicated case study page + Featured Projects card

**New file:** `tomos-app.html` (not `case-study-4.html` — this is an internal product, not client work, and the filename should reflect that distinction).

Reuses the existing case-study template shell/CSS classes (`cs-hero`, `cs-hero-image`, `cs-section`, `cs-section--inverted`, `cs-related`, `cs-cta` — see `case-study-1.html`) but the copy voice must shift from client-project framing ("when they came to us... their website...") to first-person-plural ("we built Tomos because...", "our approach was..."). The `cs-meta` field set also changes — the existing template's fields (Industry, Timeline, Client Website) assume an external client and don't fit:

| Existing field (client case studies) | Tomos replacement |
|---|---|
| Industry | Type: Internal Product |
| Timeline | Status: In Development (Internal Testing) |
| Website (client's live site) | Website: tomos.app |
| Services | Services: AI Automation |

Section content (using the `cs-section` / `cs-section--inverted` alternating pattern):
- Intro (`cs-hero`): what Tomos is, one line on why Orban Forest built it.
- "The Problem We Saw" — the receipt-scanning/expense-tracking pain point that motivated building it.
- "What We Built" — the product, the AI approach, current state (internal testing).
- "Where It's Headed" — status + waitlist CTA.
- `cs-cta` close: waitlist link + link back to the AI-automation service page.

**Featured Projects card:** a standard `.project-card` entry added to the `.projects-grid` (`index.html:406+`), matching the existing pattern (image/illustration thumbnail, `.project-tag` e.g. "AI Automation" or "In-House Product", project name "Tomos.app", short description, "Explore Project →" link). Unlike the other cards — which link out to external client sites with `target="_blank"` — this card links internally to `tomos-app.html` in the same tab, consistent with normal internal navigation.

## Out of scope

- Creating the actual 3D illustration (placeholder only).
- Any new email capture/waitlist mechanism — Tomos's existing waitlist at `tomos.app/waitlist#waitlist` is used as-is.
- The other three brainstormed sub-projects (prospect conversion funnel, client engagement infrastructure, web design/animation proof content) — separate specs.
- The previously-discussed removal of Digital Marketing / AR/VR service rows and Web Design → Web Development remap — on hold, unrelated to this spec.
