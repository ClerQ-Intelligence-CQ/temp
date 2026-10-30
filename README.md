# ClerQ Intelligence — Website Staging & Handoff Repository

> **Repository:** `ClerQ-Intelligence-CQ/temp`  
> **Production Target:** `https://clerqintelligence.site`  
> **Primary Purpose:** Handoff brief, website files, 3D WebGL assets, database schemas, and end-to-end beta pipeline documentation for design iteration and aesthetic overhaul.

---

## What is in This Repository

1. **Complete Website Source (`HTML5 / Vanilla CSS / Vanilla JS`):**
   - Pure high-performance static website (zero build tool requirement, runs via `python3 -m http.server 8085`).
   - `index.html`: Homepage with Three.js 3D hero wireframe and 3D Horizon principles model.
   - `product/index.html`: 3D WebGL Product Stall (Nia CDS, Sema Voice, Rafiki Triage, Hakiki Verification), 3-step clinical beta enrollment intake modal, persistent save link generation, and verified APK download portal.
   - `research/index.html`: Deep-dive briefings on Swahili NLP (Sema), Frontline Triage (Rafiki), and Protocol Verification (Hakiki).
   - `about/index.html`: Mission, executive board, clinical philosophy, and partnership with Nama Labs.
   - `blog/index.html`: Engineering dispatches and clinical whitepapers.
   - `contact/index.html`: Facility inquiries and Dar es Salaam HQ contacts.
   - `hq/index.html`: Surgical white doorway to ClerQ HQ Operations Console.
2. **Design Assets & Favicons:**
   - Vector CQ monogram in an optical circular frame (`favicon.svg?v=3`, multi-resolution PNGs, and `favicon.ico`).
   - SVG logos for ClerQ Intelligence, Sema, Rafiki, and Hakiki.
3. **Database Schema & Pipeline (`schema/`):**
   - `0001_cq_core.sql` through `0004_beta_pipeline.sql`: Full PostgreSQL DDL and security-definer RPCs for public application submission (`cq_submit_beta_application`), status verification (`cq_check_beta_status`), single-use key validation (`cq_verify_beta_key`), and HQ operator vetting (`cq_hq_list_applications`, `cq_hq_review_application`).
4. **ClerQ HQ Console (`hq-console/`):**
   - React 18 + Vite + TypeScript application for the ClerQ HQ Operations Console.
   - `pages/Clinicians.tsx`: Live Credential Verification Queue for incoming applicants, dossier inspection, and cryptographic key issuance.
   - `pages/Overview.tsx`: Real-time system telemetry and live RPC analytics.
   - `pages/ProductStudio.tsx`: Remote control gate for Nia model weights and remote feature locking.
   - `pages/RuleGraph.tsx`: 21 live Tanzanian STG clinical syndrome rule graphs.
   - `pages/Notices.tsx`: Point-of-care clinical advisory broadcast network.
5. **Handoff Specifications:**
   - [HANDOFF_INSTRUCTIONS.md](HANDOFF_INSTRUCTIONS.md): In-depth guide detailing user design guidelines, the Dieter Rams white minimalism mandate, 3D product stall specifications, and the end-to-end beta sequence diagram.

---

## Quick Start (Running Locally)

### 1. Website
```bash
python3 -m http.server 8085
# Open http://localhost:8085/
```

### 2. ClerQ HQ Console
```bash
cd hq-console/
npm install
npm run dev -- --port 3000
# Open http://localhost:3000/
# Master credentials: clerqafrica@gmail.com / curamqualitas
```

---

## Critical User Rules & Design Constraints

1. **Dominant Theme MUST BE PURE SURGICAL WHITE (`#FFFFFF`), NOT DARK:**
   - The user explicitly corrected: *"the dominant theme is white not dark brooo"*.
   - Never invert into dark mode. Maintain pure Ramsian white backgrounds, subtle borders, and crisp black typography.
2. **ZERO EMOJIS ANYWHERE:**
   - Strictly forbidden in UI, headings, buttons, and copy. Use clean geometric SVGs or Lucide icons.
3. **ZERO FAKE DATA / STUBS:**
   - Real database rows or honest empty states only. Never hardcode mock numbers or fake arrays.
4. **FAVICON IN CIRCULAR FRAME:**
   - Must use the circle-framed CQ monogram with cache-busting query strings on all `<link rel="icon">` tags.
5. **COPYWRITING:**
   - "Offline-capable" (not "offline-native"). Assistive bedside guidance grounded in Tanzania STG 2026.
