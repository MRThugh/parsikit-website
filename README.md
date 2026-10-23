# ParsiKit Official Website & Documentation Hub

> **Production-Grade Pure Python Persian Data Infrastructure**  
> **Author & Project Owner:** Ali Kamrani (علی کامرانی) — [@MRThugh](https://github.com/MRThugh)  
> **Official Repository:** [https://github.com/MRThugh/ParsiKit](https://github.com/MRThugh/ParsiKit)  
> **Library Version:** 3.3.1  
> **License:** MIT  

---

## 🌟 Overview

This repository hosts the official developer website and documentation portal for **ParsiKit**, a zero-dependency, high-performance Python infrastructure library for Persian text normalization, national checksum validations (National Code Modulo 11, Bank Card Luhn algorithm, Sheba IBANs), astronomical Jalali calendar transformations, currency computations, and sensitive PII masking.

The website is engineered as a static-first, repository-driven web platform with full bilingual support (English LTR and Persian RTL), client-side search, an interactive diagnostic studio, automated CI/CD validation workflows, and 58 prerendered static HTML pages for superior technical SEO.

---

## 🚀 Architectural Highlights

1. **Bilingual Bidirectionality (Persian & English)**
   - True RTL layout for Persian (`dir="rtl"`, `lang="fa"`) and LTR for English (`dir="ltr"`, `lang="en"`).
   - Bundled local **Vazirmatn** webfonts (`.woff2`) declared via `@font-face` in `src/index.css`, guaranteeing instant, crisp Persian typography without CDN dependencies.
   - Intelligent language switcher that retains the user's active documentation topic across English and Persian counterparts.

2. **Repository-Driven Content Pipeline**
   - Extracts and indexes 50 authentic Markdown documentation files directly from `repo_data/docs/` (`en/`, `fa/`, and `development/`).
   - Automatically synchronizes `pyproject.toml` metadata (version, author, license, requirements) and `CHANGELOG.md` into strongly typed TypeScript data manifests (`src/data/repoMetadata.ts`, `src/data/docsManifest.ts`, `src/data/changelogData.ts`).
   - Centralizes project constants to eliminate duplicate hardcoded versions and links.

3. **Live Interactive Diagnostic Studio (Browser Playground)**
   - **Text Cleanser & ZWNJ**: Live Persian character normalization (e.g. Arabic Yeh/Kaf to Persian) and Zero-Width Non-Joiner formatting.
   - **National Code Modulo 11**: Weighted checksum validator with city/province code lookup.
   - **Bank Card Luhn Check**: 16-digit debit/credit card algorithm validation with issuing bank detection.
   - **Number to Words**: Bidirectional Rial/Toman conversion and verbal expansion up to 999 septillion.
   - **Astronomical Jalali Calendar**: Dual-calendar converter with 33-year astronomical leap cycle precision.
   - **PII Data Masking**: Telecom operator detector (MCI, Irancell, Rightel) and safe masking.

4. **Technical SEO & Static Prerendering**
   - Clean, path-based routing: `/en`, `/fa`, `/en/docs/:slug`, `/fa/docs/:slug`, `/en/playground`, etc.
   - Prerendering pipeline (`scripts/prerender.ts`) generates **58 static `index.html` files** into `dist/` containing crawlable semantic HTML (`<header>`, `<nav>`, `<main>`, `<article>`, `<h1>`, `<p>`, code snippets).
   - Dynamic document head manager (`src/lib/seo.ts`) injecting canonical URLs, OpenGraph, Twitter cards, and bidirectional `rel="alternate"` `hreflang` tags.
   - Schema.org JSON-LD structured data (`SoftwareApplication` and `TechArticle`).
   - Auto-generated `sitemap.xml` and `robots.txt`.

5. **Accessibility & Purposeful Motion**
   - WCAG 2.2 AA compliant contrast and minimum 44×44px mobile touch targets.
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

# 2. Start local development server (runs at http://localhost:3000)
npm run dev

# 3. Synchronize documentation & metadata from repository sources
npm run sync:docs

# 4. Run unit test suite (12 tests covering algorithms, routing, SEO, and metadata)
npm test

# 5. Type-check and lint codebase with strict TypeScript
npm run lint

# 6. Build production bundle and prerender all 58 static HTML pages
npm run build

# 7. Preview production build locally
npm run preview
```

---

## 🤖 CI/CD Workflows (GitHub Actions)

Located in `.github/workflows/`:

1. **`deploy.yml` (Production Deployment to GitHub Pages)**
   - Triggers on push to `main` branch when code or documentation changes.
   - Installs dependencies (`npm ci`), runs strict linting (`npm run lint`), executes unit tests (`npm test`), and builds the prerendered static distribution (`npm run build`).
   - Uses GitHub Pages deployment actions (`actions/deploy-pages@v4`) with least-privilege token permissions (`pages: write`, `id-token: write`).

2. **`sync-and-validate.yml` (Integrity & Repository Drift Check)**
   - Triggers on pull requests, scheduled cron (`0 0 * * *`), or manual dispatch.
   - Validates that generated manifests match `repo_data/`, checks for manifest drift, ensures unit tests pass, and verifies that `dist/sitemap.xml`, `dist/robots.txt`, and prerendered static pages exist.

---

## 📂 Project Structure

```text
├── .github/
│   └── workflows/
│       ├── deploy.yml            # Automated GitHub Pages CI/CD deployment
│       └── sync-and-validate.yml # Pull request validation and manifest drift check
├── public/                       # Static assets, webfonts, official favicons
│   ├── fonts/                    # Bundled Vazirmatn woff2 fonts (Regular & Bold)
│   ├── parsikit-logo.png         # Official ParsiKit emblem
│   ├── sitemap.xml               # XML sitemap (auto-updated by build)
│   └── robots.txt                # Robots directives
├── repo_data/                    # Authoritative repository source files
│   ├── docs/                     # 50 Persian & English documentation markdown files
│   ├── pyproject.toml            # Official Python project metadata (v3.3.1)
│   └── CHANGELOG.md              # Semantic release notes and changelog
├── scripts/
│   ├── build-docs-manifest.ts    # Extracts markdown docs and metadata into typed data
│   └── prerender.ts              # Generates static HTML pages and XML sitemaps
├── src/
│   ├── components/               # Production UI components
│   │   ├── ui/                   # Reusable primitives (Button, Accordion)
│   │   ├── Header.tsx            # Sticky header with motion active indicator & drawer
│   │   ├── Hero.tsx              # Hero with pip widget, code switcher, and unboxed metadata
│   │   ├── PillarsSection.tsx    # Five core architectural pillars of v3.3.1
│   │   ├── InteractivePlayground.tsx # Browser diagnostic studio (6 live tools)
│   │   ├── DocumentationView.tsx # Categorized docs browser with TOC & search
│   │   ├── ArchitectureView.tsx  # Four-layer package hierarchy deep dive
│   │   ├── ChangelogView.tsx     # Semantic version release timeline
│   │   ├── SearchModal.tsx       # Cmd+K client-side search engine
│   │   └── Footer.tsx            # Persian geometric footer & creator attribution
│   ├── context/                  # AppContext (routing, language, theme)
│   ├── data/                     # Auto-generated manifests from repo_data
│   │   ├── docsManifest.ts       # 50 indexed documents with headings
│   │   ├── repoMetadata.ts       # Central project constants (version, author, license)
│   │   └── changelogData.ts      # Parsed release entries
│   ├── lib/                      # Decoupled algorithmic primitives & unit tests
│   │   ├── persianNumber.ts      # Numbers to Persian words, Rial/Toman conversions
│   │   ├── validation.ts         # National Code Modulo 11, Bank Card Luhn, PII masking
│   │   ├── jalali.ts             # Astronomical Jalali <-> Gregorian conversions
│   │   ├── search.ts             # Full-text tokenized search engine
│   │   ├── router.ts             # Path-based routing and serialization
│   │   ├── seo.ts                # Dynamic metadata engine (canonical, hreflang, OG)
│   │   ├── motion.ts             # Motion animation presets
│   │   └── logic.test.ts         # Automated unit test suite (12 tests)
│   ├── index.css                 # Tailwind CSS 4 directives & @font-face declarations
│   └── main.tsx                  # Client hydration entry point
├── index.html                    # Root HTML template with preconnect and JSON-LD
├── package.json                  # Dependencies and npm scripts
├── tsconfig.json                 # TypeScript compiler configuration
└── vite.config.ts                # Vite 8 bundler configuration
```

---

## 🚢 Deployment Guide

### GitHub Pages (Recommended)
1. Fork or push this repository to GitHub.
2. In the repository settings, navigate to **Pages** (`Settings -> Pages`).
3. Set **Source** to **GitHub Actions**.
4. Push to the `main` branch. The `.github/workflows/deploy.yml` workflow will automatically test, build, and deploy the prerendered site.
5. If using a custom domain (e.g. `parsikit.dev`), add a `CNAME` file or configure it in repository settings.

### Static Host (Cloudflare Pages, Vercel, Netlify, AWS S3)
1. Build command: `npm run build`
2. Output directory: `dist/`
3. All 58 routes have physical `index.html` files, with `dist/404.html` provided as the SPA fallback.

---

## 📄 License & Attribution

Distributed under the **MIT License**.  
Crafted with dedication for the Persian open-source developer ecosystem by **Ali Kamrani (علی کامرانی)**.  
Official Repository: [https://github.com/MRThugh/ParsiKit](https://github.com/MRThugh/ParsiKit)
