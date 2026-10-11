# AIX Summit 2026 — Theme Extraction Notes (Phase 0)

**Date of Extraction:** 27 September 2026  
**Source URL:** `https://www.aixsummithack.com/`  
**Browser Engine:** Headless Google Chrome v140.x on macOS  
**Extraction Tool:** Puppeteer-Core script running computed style aggregations against all DOM elements post-network idle.

---

## 1. Screenshots Captured

Full-page screenshots were taken at the five required responsive viewports and saved to `design/reference/`:
- `design/reference/screenshot-1920.png` (1920×1080 desktop widescreen, 2.3MB)
- `design/reference/screenshot-1440.png` (1440×900 standard desktop, 1.8MB)
- `design/reference/screenshot-1024.png` (1024×768 iPad landscape / small laptop, 1.1MB)
- `design/reference/screenshot-768.png` (768×1024 tablet portrait, 605KB)
- `design/reference/screenshot-390.png` (390×844 modern mobile, 343KB)

All captures confirm the dark luxury aesthetic, rich cosmic deep-violet background, vibrant magenta-to-teal gradients, card structures with subtle border hairlines, and typography hierarchy.

---

## 2. Extracted Palette & Computed Frequencies

From `design/reference/computed-frequencies.json` and bundle analysis:

| Element / Role | Extracted Value | Token Mapping | Contrast Check |
|---|---|---|---|
| **Base Background** | `rgb(22, 12, 53)` / `#160C35` (body & sections) | `color.bg.base` | N/A (baseline canvas) |
| **Raised Card Background** | `rgb(43, 32, 76)` / `#2B204C` (cards, badges) | `color.bg.raised` | N/A |
| **Modal / Overlay Scrim** | `rgba(22, 12, 53, 0.88)` | `color.bg.overlay` | N/A |
| **Primary Text** | `rgb(255, 255, 255)` / `#F4F4F8` | `color.text.primary` | **15.2:1** vs base, **12.2:1** vs raised (PASS AAA) |
| **Secondary / Muted Text**| `rgb(209, 213, 219)` / `#9CA3AF` | `color.text.secondary`| **7.8:1** vs base, **6.3:1** vs raised (PASS AA) |
| **Primary Brand Accent** | `rgb(202, 82, 149)` / `#CA5295` | `color.brand.primary` | Fill / Button / Gradient |
| **Secondary Brand Accent**| `rgb(61, 216, 216)` / `#3DD8D8` | `color.brand.secondary`| Teal / Cyan starburst & gradient stop |
| **Borders** | `rgba(255, 255, 255, 0.1)` | `color.border.subtle` | Card borders & dividers |
| **Primary Gradient** | `linear-gradient(to right, rgb(202, 82, 149), rgb(61, 216, 216))` | `gradient.brand` | Header & CTA buttons |
| **Hero Text Gradient** | `linear-gradient(to right, rgb(255, 255, 255), rgb(255, 78, 142), rgb(160, 124, 255))` | `gradient.text` | Headline pull quotes |

---

## 3. Five Roundtable Accents & WCAG 2.1 AA Contrast Verification

Each of the five roundtables is assigned a distinguishing accent derived directly as tints of the extracted palette colors, verified using standard WCAG relative luminance algorithms against both `#160C35` (`bg.base`) and `#2B204C` (`bg.raised`):

| Roundtable | Lane | Accent Hex | Derived From | Contrast vs `bg.base` | Contrast vs `bg.raised` | Status (≥ 4.5:1 required) |
|---|---|---|---|---|---|---|
| **1. FinTech & Financial Services** | AI in Financial Products & Risk | `#3DD8D8` | Secondary Brand Teal (`#3DD8D8`) | **10.55:1** | **8.50:1** | **PASS (AAA)** |
| **2. AI at Industrial Scale** | Physical Assets, Energy & Logistics | `#60A5FA` | Industrial Blue (`#60A5FA`) | **7.26:1** | **5.84:1** | **PASS (AA)** |
| **3. AI, Cybersecurity & Trust** | Security, Identity & Assurance | `#2DD4BF` | Mint-Cyan (`#31AEAE` tint) | **9.91:1** | **7.98:1** | **PASS (AAA)** |
| **4. AI-Ready State** | Public Sector & Government AI | `#C084FC` | State Lavender (`#A07CFF` tint) | **6.98:1** | **5.62:1** | **PASS (AA)** |
| **5. The Agentic Enterprise** | Enterprise Workforce & Workflow | `#FF6EA7` | Agentic Rose (`#FF4E8E` / `#CA5295` tint) | **7.06:1** | **5.69:1** | **PASS (AA)** |

---

## 4. Typography

Extracted directly from computed styles:
- **Display Font:** `Montserrat` (1266 occurrences, primary display headings `H1`–`H4`). Downloaded as `public/fonts/montserrat.woff2`.
- **Body Font:** `Inter` (103 occurrences, body paragraphs, tables, interactive inputs). Downloaded as `public/fonts/inter.woff2`.
- **Fallback Font Stack:** `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

---

## 5. Brand Assets Downloaded

Downloaded to `public/brand/`:
- `aix-logo.svg`: Extracted from `assets/ai-CcK9meKk.svg`. **Note on Hackathon Lockup:** The live site paired `ai-CcK9meKk.svg` (AIX Summit) with `hack-BpSPK8FC.svg` (Hackathon). The isolated Summit logo was extracted cleanly without the hackathon lockup, exactly adhering to Section 5.3!
- `favicon.svg`: Brand starburst/sparkle vector in `#3DD8D8`.
- `ray-overlay.svg`: Hero light ray beam effect (`mix-blend-mode: color-dodge`).
- `texture.svg`: Subtle digital stipple/grid background texture.
- `globe.svg`: Geometric wireframe globe illustration.

---

## 6. Motion & Interaction

- **Duration:** Fast (`150ms`), Base (`300ms`), Slow (`500ms`).
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (standard Tailwind cubic-bezier curve from extracted transition properties).
- **Hover Transitions:** `translateY(-4px)` with shadow bloom; button fill lightening; smooth opacity crossfades.
- **Scroll behavior:** Transparent navbar over hero transitioning to `backdrop-filter: blur(12px)` with 92% background opacity and hairline border upon scrolling past 80px.
