# ParsiKit Official Website & Multilingual Documentation Hub

> **Production-Grade Pure Python Persian Data Infrastructure**  
> **Author & Project Owner:** Ali Kamrani (علی کامرانی) — [@MRThugh](https://github.com/MRThugh)  
> **Official Repository:** [https://github.com/MRThugh/ParsiKit](https://github.com/MRThugh/ParsiKit)  
> **Library Version:** 3.3.1  
> **License:** MIT  

---

## 🌟 Overview

This repository hosts the official developer website and documentation portal for **ParsiKit**, a zero-dependency, high-performance Python infrastructure library for Persian text normalization, national checksum validations (National Code Modulo 11, Bank Card Luhn algorithm, Sheba IBANs), astronomical Jalali calendar transformations, currency computations, and sensitive PII masking.

The website is engineered as a static-first, repository-driven web platform with full support for **four official languages**, client-side search, an in-browser diagnostic studio, legacy Spanish 301 redirect migrations, automated CI/CD validation workflows, and 110 prerendered static HTML pages for premier technical SEO.

---

## 🌐 Supported Locales & Internationalization Architecture

ParsiKit strictly supports exactly four user-facing languages:

| Language | Internal Locale | URL Prefix | Direction | Script |
|---|---|---|---|---|
| **Persian (Iran)** | `fa-IR` | `/fa/` | RTL | Arabic/Persian |
| **English** | `en` | `/en/` | LTR | Latin |
| **Dari (Afghanistan)** | `prs-AF` | `/prs-af/` | RTL | Arabic/Dari |
| **Tajik (Tajikistan)** | `tg-TJ` | `/tg/` | LTR | Cyrillic |

### Features:
- **True Bidirectionality**: Dedicated RTL styling for Persian and Dari, and clean LTR layout for English and Tajik Cyrillic.
- **Font Stack**: Bundled local **Vazirmatn** webfonts (`.woff2`) declared via `@font-face` in `src/index.css` for instant, crisp Persian typography without CDN dependencies.
- **Documentation Parity**: Exactly 22 documentation files across all 4 languages (88 localized docs) + 6 engineering development docs = **94 total documents**.
- **Context-Preserving Language Switcher**: Retains the user's active topic when switching between languages and falls back gracefully if an equivalent topic does not exist.

---

## 🚀 Architectural Highlights

1. **Repository-Driven Content Pipeline**
   - Automatically synchronizes `repo_data/pyproject.toml` metadata (version, author, license, requirements) and `repo_data/CHANGELOG.md` into strongly typed TypeScript data manifests (`src/data/repoMetadata.ts`, `src/data/docsManifest.ts`, `src/data/changelogData.ts`).
   - Centralizes project constants to eliminate duplicate hardcoded versions and links.

2. **In-Browser Interactive Diagnostic Studio**
   - **Text Cleanser & ZWNJ**: Live Persian character normalization (e.g. Arabic Yeh/Kaf to Persian) and Zero-Width Non-Joiner formatting.
   - **National Code Modulo 11**: Weighted checksum validator with city/province code lookup.
   - **Bank Card Luhn Check**: 16-digit debit/credit card algorithm validation with issuing bank detection.
   - **Number to Words**: Bidirectional Rial/Toman conversion and verbal expansion.
   - **Astronomical Jalali Calendar**: Dual-calendar converter with 33-year astronomical leap cycle precision.
   - **PII Data Masking**: Telecom operator detector (MCI, Irancell, Rightel) and safe masking.
   - *Transparency disclosure*: All algorithms run client-side in the browser via zero-latency TypeScript implementations with zero remote backend dependencies.

3. **Technical SEO & Static Prerendering**
   - Clean, path-based routing: `/en`, `/fa`, `/prs-af`, `/tg`, `/en/docs/:slug`, `/fa/docs/:slug`, etc.
   - Prerendering pipeline (`scripts/prerender.ts`) generates **110 static `index.html` files** into `dist/` containing crawlable semantic HTML (`<header>`, `<nav>`, `<main>`, `<article>`, `<h1>`, `<p>`, code snippets).
   - Dynamic document head manager (`src/lib/seo.ts`) injecting canonical URLs, OpenGraph, Twitter cards, and reciprocal `rel="alternate"` `hreflang` tags (including `x-default` pointing to `/en`).
   - Schema.org JSON-LD structured data (`SoftwareApplication`, `TechArticle`, and `WebSite`).
   - Auto-generated `sitemap.xml` with Google-standard `<xhtml:link rel="alternate" .../>` annotations and `robots.txt`.

4. **Legacy Spanish Route Migration**
   - Complete 301 migration handling for all legacy `/es/*` URLs.
   - Generates 34 static HTML redirect stubs (`meta http-equiv="refresh"`, `<link rel="canonical">`, `window.location.replace`, and `<meta name="robots" content="noindex, follow">`).
   - Server-level rules declared in `public/_redirects`.
   - Spanish is completely removed from active locales, sitemaps, and navigation.

5. **Accessibility & Purposeful Motion**
   - WCAG 2.2 AA compliant contrast and minimum 44×44px touch targets.
   - Full `prefers-reduced-motion` compliance across all animations using Motion for React (`motion/react` v12).
   - Keyboard accessible modals (`Cmd+K` documentation search) with Arrow Key navigation.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Runtime & UI** | React 19, TypeScript |
| **Bundler** | Vite 8 |
| **CSS Framework** | Tailwind CSS 4 |
| **Motion & Animation** | Motion (`motion/react` v12) |
| **Icons** | Lucide React |
| **Test Runner** | Node.js built-in test runner (`tsx --test`) |
| **Prerender Engine** | Node.js / TypeScript custom static site generator |

---

## 💻 Development & Build Commands

```bash
# 1. Install dependencies
npm install

# 2. Start local development server (runs on port 3000)
npm run dev

# 3. Synchronize documentation & metadata from repository sources
npm run sync:docs

# 4. Run automated test suite (20 tests covering algorithms, i18n, routing, SEO, and parity)
npm test

# 5. Type-check codebase with strict TypeScript
npm run lint

# 6. Build production bundle, prerender all 110 static pages, generate redirects and sitemap, and validate
npm run build

# 7. Audit production build integrity
npm run validate

# 8. Preview production build locally
npm run preview
```

---

## 📄 License & Attribution

Distributed under the **MIT License**.  
Crafted with dedication for the Persian open-source developer ecosystem by **Ali Kamrani (علی کامرانی)**.  
Official Repository: [https://github.com/MRThugh/ParsiKit](https://github.com/MRThugh/ParsiKit)
