# ClerQ Intelligence :  clerqintelligence.site
## Full Build Spec

---

## 1. Stack

- **Framework:** Antigravity (static multi-page)
- **Hosting/Deploy:** Netlify, deployed manually by Emmanuel
- **Forms:** Formspree (contact + partners expression-of-interest) :  no backend, no DB
- **3D/Interactive:** Three.js
- **No database.** No auth. No CMS. Everything is static content + client-side interaction.

---

## 2. Sitemap

| Route | Purpose |
|---|---|
| `/` | Landing :  hero, product snapshot, first principles, CTA to research/partners |
| `/research` | Sema (teased) + Rafiki, framed as living/ongoing work |
| `/about` | Team, story, why ClerQ exists |
| `/partners` | Open call for research collaborators + Nama Labs partnership |
| `/contact` | Form + socials + mailto |

Global nav on every page: CQ monogram (left, links home) + text links to the 5 pages (right). No dropdowns, no mega-menu.

---

## 3. Design Tokens

**Color**
- `--bg`: #FFFFFF (pure white, no off-white)
- `--ink`: #0A0A0A (near-black, not pure #000 for text :  reserve true black for logo/line work)
- `--line`: #E5E5E5 (hairline dividers, very light)
- `--muted`: #6B6B6B (secondary text)
- No accent color. This brand is monochrome by design :  the wave motif and negative space carry the personality, not color.

**Type**
- Display/headline: a geometric sans with true circular counters, to sit comfortably next to the CQ logo's geometry :  not Inter (too neutral/generic here). Recommend a Sohne/Söhne, Neue Haas Grotesk, or Founders Grotesk class typeface. If licensing is a constraint, **General Sans** or **General Sans + Switzer** (both free, geometric, circular-counter) are close substitutes.
- Body: same family, lighter weight :  do not introduce a second typeface. One family, multiple weights, per the logo's "Intelligence" wordmark treatment (heavy ClerQ + light Intelligence in the same face).
- No all-caps labels. No tracked-out eyebrow text above headings :  this was explicitly flagged as a generic AI-design tell and is banned across the site.
- Line length: body copy capped at ~70 characters per line.

**Layout**
- Left-aligned text blocks throughout (not centered), EXCEPT the landing hero, which centers on the logotype as the singular focal moment.
- Generous vertical whitespace between sections :  sections should feel like they're breathing, per Rams "as little design as possible."
- No cards, no rounded-corner boxes, no drop shadows anywhere on the site. Content sits directly on white, separated by whitespace and the occasional hairline rule or wave divider :  never a bordered container.

**The Wave Motif**
- The sinusoidal line from the CQ logo is the one recurring structural device, used as a section divider in place of a plain `<hr>`.
- It should be a thin, single-stroke SVG path, rendered in `--ink`, animating a subtle draw-on effect the first time it scrolls into view (once per page load, not on every scroll pass).
- Never use the wave decoratively/randomly :  only at genuine section boundaries, echoing its function in the logo (connecting two ideas).

**Motion**
- One orchestrated hero moment on `/` (see Three.js section below) :  this is where the site spends its "boldness."
- Everywhere else: motion only responds to user action (hover state changes, wave draw-on at first viewport entry, form submit confirmation). No scroll-triggered fade-up on every section :  flagged as a generic default, explicitly avoided per design system guidance.
- Respect `prefers-reduced-motion` :  all Three.js and SVG animation must degrade to a static frame.

---

## 4. Page-by-Page Spec

### `/` :  Landing

**Structure, top to bottom:**

1. **Hero**
   - Full viewport height.
   - Three.js scene: sparse, slow-orbiting geometric forms (thin wireframe spheres/torus knots referencing the logo's circular letterforms) :  subtle, background-layer, never competing with the logotype.
   - ClerQ Intelligence full logotype centered, large.
   - One sentence directly beneath: what ClerQ is, in plain language (no jargon, no "revolutionize/leverage/seamless" language :  see Copy Deck for exact line).
   - No buttons/CTA in the hero itself :  let it breathe as a pure statement.

2. **Product snapshot**
   - Left-aligned block. One tight paragraph on the Consumer Clinical Decision Support System: what it does, who it's for, grounded in Tanzania Standard Treatment Guidelines.
   - No screenshot mockups required for v1 (none currently available/finalized) :  text-led.

3. **First Principles :  the horizon solar system**
   - The centerpiece interactive moment of the page (this is the "spend your boldness in one place" element).
   - Three.js scene, black-and-white, viewed from a low horizon angle (not top-down) :  like standing on a dark plain looking up at a slice of a solar system, not looking down at an orrery diagram.
   - Each of the 7 first principles (Context, Ease, Integrability, Infrastructure, Auditability, Speed, Precision) is one orbiting body, at a different distance and orbital speed from the center.
   - On hover/tap of a body: it brightens, label + one-line definition appears in a plain text panel beside the scene (not a tooltip bubble/card).
   - This section replaces what would otherwise be a generic icon-grid feature list :  the orbit visually encodes "these principles operate together, continuously, not as a static checklist."

4. **CTA close**
   - Simple, plain-language close: two links, to `/research` and `/partners`. Text links, not buttons with arrows.

---

### `/research`

- Framed as: "what we're building, in the open" :  not a product marketing page, a lab notebook tone.
- **Sema section:** teased only, per instruction :  do not explain the anchor/lemma/affix mechanics on-site. One short paragraph establishing what problem it addresses (small models + Swahili) and that it was built with Nama Labs. Hard link out to the Medium piece ("The Boring Solution: How We Built Sema...") for anyone who wants the full technical read, and to the GitHub repos (main + lead-dev fork).
- **Rafiki section:** same tease-and-link treatment. One paragraph framing it as a digital twin training framework built in collaboration with Nama Labs, linking to `github.com/ClerQ-Intelligence-CQ/Rafiki`.
- No FedAI-TB mention anywhere on this page or site (explicitly deferred).
- Tone throughout: "here's live, ongoing work" :  avoid past-tense "we built X and it's done" framing where possible; these are active research threads.

---

### `/about`

- One paragraph, plain and human, on why ClerQ exists (the fragmentation-of-care / context problem :  not a mission-statement-generator paragraph).
- Team list, 5 people, name + role only, no photos (explicitly deferred until real photos exist):
  - Emmanuel Chesco :  Founder
  - Daudi Raphael :  Co-Investigator & Clinical Accuracy
  - Godson Madeha :  Chief of Policy & Regulations
  - Mikael Nsengi :  Chief Safety & Compliance Officer
  - Tunu Kassim :  Chief Financial & Marketing Officer
- Nama Labs credited as research partner, with a short line on the nature of the collaboration (Sema, Rafiki) and a link to their LinkedIn: `linkedin.com/in/nama-labs-07a475433`.

---

### `/partners`

- Open call framing: inviting researchers, clinicians, and health-system builders working in adjacent fields (edge AI, low-resource NLP, health informatics, clinical decision support) to connect.
- Nama Labs listed here too, as the current research partner :  this page should read as "here's who we already work with, and here's an invitation to join that list."
- One CTA: Formspree-backed short form (name, org/affiliation, area of interest, message) OR a direct mailto :  spec leaves this as Emmanuel's call at build time; both are zero-backend options.
- Link out to Nama Labs LinkedIn again here (partnership context, not duplicate of About).

---

### `/contact`

- Formspree-backed contact form: name, email, message. No file uploads, no multi-step.
- Below/beside the form: mailto fallback, Instagram (`@clerq_intelligence`), LinkedIn (`linkedin.com/company/clerq-intelligence`).
- No embedded map, no phone number (not provided).

---

## 5. Logo Usage

Two assets provided (see `/assets/logos/`):

- **`cq-monogram.png`** :  the CQ monogram, wave connecting the C's inner curve to the Q's tail. Use for: nav bar mark, favicon, any small/tight-space placement.
- **`clerq-logotype.png`** :  full "ClerQ Intelligence" lockup, heavy "ClerQ" + light "Intelligence" beneath, wave running through the crossbar of the e, behind the r, into the Q's tail. Use for: hero centerpiece, footer, any full-width brand moment.

Both are currently raster (PNG) exports. **Before build:** source or redraw as SVG :  the wave draw-on animation described in Section 3 requires a vector path, not a raster image. If original vector files exist (Illustrator/Figma), pull the wave path specifically as its own isolated SVG element so it can be reused as the standalone section-divider motif, independent of the logo itself.

---

## 6. Explicit Exclusions (confirmed in scope discussion)

- No FedAI-TB content anywhere on the current build.
- No team photos (none available yet :  placeholder text only, no silhouette/generic avatar icons either).
- No database, no user accounts, no CMS.
- No color accent :  monochrome only.
- No stock-photo-Africa imagery, no generic hospital/clinical stock photography (see `02-IMAGE-PROMPTS.md`).
- No card-grid layouts, no rounded-corner containers, no drop shadows.
- No tracked-out all-caps eyebrow labels above headings.
- Sema explained only at the tease level on-site :  full technical detail lives on Medium, linked out.

