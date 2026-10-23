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

4. **Missing-Translation & Locale Resolution Policy**
   - Core API, guides, tutorials, and getting-started documents exist in full 4-language parity (22 documents in each language).
   - Technical architecture and audit documents under `development/` are maintained exclusively in English.
   - When a document is requested in a locale where translation is not available (such as `development/*` in Persian, Dari, or Tajik):
     - The router marks the document with explicit `fallback` status.
     - The page renders with an accessible notice banner informing the user that official translation is unavailable in their requested language and displaying the original English content.
     - The content article strictly sets `dir="ltr"` and `lang="en-US"`, preserving correct punctuation, code layout, and typography without mislabeling English as RTL.
   - Unknown document slugs or unsupported locale prefixes immediately render a localized, accessible 404 page with `noindex` directives.

5. **Markdown Security & Link Resolution Architecture**
   - **Protocol Allowlist**: Links are verified against a strict protocol allowlist permitting only case-insensitive `http:`, `https:`, and `mailto:` (handling lowercase, uppercase, and mixed-case schemes such as `HTTPS://`, `MaIlTo:`), in-page anchors (`#`), and internal relative documentation paths. Dangerous schemes (`javascript:`, `data:`, `vbscript:`, `file:`, `blob:`, `intent:`) and entity-obfuscated or control-character bypasses (`\u0000-\u001F`, `&#x61;`, etc.) are strictly blocked and rendered as `[unsafe link blocked]`.
   - **Protocol-Relative URL Rejection**: Protocol-relative links (`//example.com`) are explicitly rejected as unsafe references to prevent protocol-downgrade and domain hijacking.
   - **HTML Sanitization**: All raw HTML tags within Markdown documents are escaped prior to DOM insertion, preventing XSS and attribute injection while preserving legitimate code snippets and inline code blocks.
   - **Directory-Relative Resolution**: Links in Markdown (e.g. `../tutorials/datetime.md?mode=basic#setup`) are resolved against the directory of the current document, preserving query parameters and anchors, while blocking path traversals that escape the documentation root namespace.

6. **Legacy Spanish Route Migration & Hosting Limitations**
   - 34 static HTML redirect stubs are generated in `dist/es/*` utilizing client-side `<meta http-equiv="refresh">` and `window.location.replace` while preserving URL query parameters and fragments.
   - Stubs declare `<link rel="canonical">` pointing to the canonical English counterpart and `<meta name="robots" content="noindex, follow">`.
   - **Hosting Platform Limitation**: The deployment target is GitHub Pages, which serves static assets and does not support server-side HTTP 301 headers. Consequently, redirect stubs are labeled as *verified client-side HTML redirect fallbacks*. Server-level rules (`public/_redirects`) are maintained for reverse-proxy and edge-compatible hosts (Cloudflare Pages, Netlify).
   - Spanish is completely removed from active locales, sitemaps, and navigation.

7. **Comprehensive Production Artifact Validator**
   - `scripts/validate-production.ts` performs a 100% comprehensive audit of all generated HTML files across `dist/` (rather than a sample), validating document metadata, lang/dir attributes, unique canonical tags matching expected origin and route, robots directives, and all asset and link references.
   - Strict custom XML parser (`parseXml`) audits `dist/sitemap.xml` for well-formedness, root `<urlset>` declaration, absolute URL consistency, uniqueness, absence of 404/Spanish routes, and matching generated files in `dist/`.
   - Validates reciprocal `hreflang` alternate links across all active pages.
   - Audits local assets (`<script src>`, `<link href>`, `<img src>`, media) and internal anchors (`<a href>`) with directory index resolution, URL decoding, and traversal protection outside `dist/`.
   - Accompanied by a 26-test regression and fixture suite covering 24 distinct positive and negative failure modes.

8. **Accessibility & Purposeful Motion**
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
# 1. Reproducible dependency installation (requires committed package-lock.json)
npm ci

# 2. Start local development server (runs on port 3000)
npm run dev

# 3. Synchronize documentation & metadata from repository sources
npm run sync:docs

# 4. Run automated test suite (59 unit, security, i18n, routing, and validator fixture tests)
npm test

# 5. Type-check codebase with strict TypeScript
npm run lint

# 6. Build production bundle, prerender all static pages, generate redirects and sitemap, and validate
npm run build

# 7. Audit production build integrity across all generated artifacts
npm run validate

# 8. Preview production build locally
npm run preview
```

---

## 📄 License & Attribution

Distributed under the **MIT License**.  
Crafted with dedication for the Persian open-source developer ecosystem by **Ali Kamrani (علی کامرانی)**.  
Official Repository: [https://github.com/MRThugh/ParsiKit](https://github.com/MRThugh/ParsiKit)
