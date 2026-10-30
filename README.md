# ClerQ Intelligence — Website Staging & Specification Handoff

Public handoff and staging repository for the **ClerQ Intelligence** web ecosystem:

- **Live Production Domain:** `https://clerqintelligence.site`
- **Handoff & Architecture Specs:** See [`HANDOFF_INSTRUCTIONS.md`](./HANDOFF_INSTRUCTIONS.md)
- **Clinical Decision Support App:** Nia (ClerQ CDS v1.47.2, build 1360)
- **Operations Console:** ClerQ HQ (React 18 + Vite + Supabase RPCs)

---

## Repository Contents

| Directory / File | Description |
|---|---|
| [`HANDOFF_INSTRUCTIONS.md`](./HANDOFF_INSTRUCTIONS.md) | **Read First:** Comprehensive brief, user rules, aesthetic guidelines, and workflow specifications. |
| [`index.html`](./index.html) | Homepage with Three.js geometric hero, architecture pillars, and bilingual EN/SW toggle. |
| [`product/index.html`](./product/index.html) | Interactive 3D WebGL Product Stall, multi-product switcher, and Clinical Beta intake modal. |
| [`blog/index.html`](./blog/index.html) | Engineering dispatches and articles on on-device LLMs, Swahili NLP, and non-identifiable privacy. |
| [`research/index.html`](./research/index.html) | Technical briefings on Sema Speech Engine, Rafiki Triage, and Hakiki Verification. |
| [`about/index.html`](./about/index.html) | Company background, medical leadership, and engineering partnership with Nama Labs. |
| [`partners/index.html`](./partners/index.html) | Healthcare network collaborations across Tanzania regional referral and district hospitals. |
| [`contact/index.html`](./contact/index.html) | Direct inquiry form and Dar es Salaam HQ facility details. |
| [`hq/index.html`](./hq/index.html) | Hidden operator doorway to ClerQ HQ Console on port 3000. |
| [`css/main.css`](./css/main.css) | Master Ramsian monochrome design tokens and responsive layouts. |
| [`js/`](./js/) | Three.js scenes (`product-scene.js`, `principles-scene.js`, `hero-scene.js`) and navigation logic (`main.js`). |
| [`assets/`](./assets/) | Vector logos, circle-framed CQ favicons, and photography assets. |

---

## Core Aesthetic & Implementation Rules

1. **Dominant Theme:** Crisp, pure white (`#FFFFFF`) with subtle off-white backgrounds (`#F8F9FA`) and hairline borders (`#E5E5E5`). **Never invert into dark mode.**
2. **Icons & Glyphs:** Vector icons only (Lucide/SVG). **Zero emojis anywhere.**
3. **Typography:** `General Sans` (Fontshare) and `JetBrains Mono` for telemetry and version identifiers.
4. **Data Integrity:** Absolutely **no fake stubs or mock arrays**. Pure live database rows from Supabase or honest empty states.
5. **Favicon:** The CQ monogram must always appear inside a **circular frame** on browser tabs (`favicon.svg?v=3`).
