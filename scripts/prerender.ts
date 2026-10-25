import fs from 'node:fs';
import path from 'node:path';
import { ALL_DOCS, type DocEntry } from '../src/data/docsManifest';
import { RELEASES_DATA } from '../src/data/changelogData';
import { REPO_METADATA } from '../src/data/repoMetadata';
import { computePageMetadata } from '../src/lib/seo';
import { type PageRoute, type AppLang, buildRoutePath, VALID_LANGS } from '../src/lib/router';
import { LOCALES } from '../src/i18n/config';
import { getTranslations } from '../src/i18n/translations';
import { renderMarkdownToHtml } from './render-markdown';
import {
  getVerifiedSiteUrl,
  getDeploymentBasePath,
  OFFICIAL_REPO_URL,
  OFFICIAL_AUTHOR,
} from '../src/config/site';
import { buildWebManifest } from '../src/lib/manifest';

export function renderHtmlTemplate(
  baseHtml: string,
  lang: AppLang,
  route: PageRoute,
  docSlug?: string
): string {
  const activeDoc = docSlug
    ? ALL_DOCS.find((d) => d.lang === lang && d.slug === docSlug) || null
    : null;

  const siteUrl = getVerifiedSiteUrl();
  const basePath = getDeploymentBasePath();
  const meta = computePageMetadata(lang, route, activeDoc);
  const loc = LOCALES[lang] || LOCALES.en;
  const isRtl = loc.direction === 'rtl';
  const t = getTranslations(lang);

  let html = baseHtml;

  // Replace html tag attributes
  html = html.replace(/<html[^>]*>/, `<html lang="${loc.locale}" dir="${loc.direction}">`);

  // Replace title
  html = html.replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`);

  // Replace meta description
  html = html.replace(
    /<meta name="description" content=".*?" \/>/,
    `<meta name="description" content="${meta.description.replace(/"/g, '&quot;')}" />`
  );

  // Google Search Console Verification Meta Tag: Strictly rendered on homepage
  html = html.replace(/<meta name="google-site-verification"[^>]*\/>\s*/g, '');
  const googleVerificationTag = meta.googleSiteVerification
    ? `<meta name="google-site-verification" content="${meta.googleSiteVerification}" />`
    : '';

  // Canonical Tag: Strictly ONLY rendered if a verified origin is configured
  let canonicalTag = '';
  if (meta.canonicalUrl) {
    canonicalTag = `<link rel="canonical" href="${meta.canonicalUrl}" />`;
    if (html.includes('<link rel="canonical"')) {
      html = html.replace(/<link rel="canonical" href=".*?" \/>/, canonicalTag);
    }
  } else {
    // Strip any unverified canonical tag that might exist in baseHtml
    html = html.replace(/<link rel="canonical"[^>]*\/>\s*/g, '');
  }

  // Alternate Hreflang Tags: Strictly ONLY rendered if a verified origin is configured
  const alternateEnTag = meta.alternateEnUrl
    ? `<link rel="alternate" hreflang="en" href="${meta.alternateEnUrl}" />`
    : '';
  const alternateFaTag = meta.alternateFaUrl
    ? `<link rel="alternate" hreflang="fa-IR" href="${meta.alternateFaUrl}" />\n    <link rel="alternate" hreflang="fa" href="${meta.alternateFaUrl}" />`
    : '';
  const alternatePrsTag = meta.alternatePrsUrl
    ? `<link rel="alternate" hreflang="prs-AF" href="${meta.alternatePrsUrl}" />\n    <link rel="alternate" hreflang="prs" href="${meta.alternatePrsUrl}" />`
    : '';
  const alternateTgTag = meta.alternateTgUrl
    ? `<link rel="alternate" hreflang="tg-TJ" href="${meta.alternateTgUrl}" />\n    <link rel="alternate" hreflang="tg" href="${meta.alternateTgUrl}" />`
    : '';
  const alternateXDefaultTag = meta.alternateXDefaultUrl
    ? `<link rel="alternate" hreflang="x-default" href="${meta.alternateXDefaultUrl}" />`
    : '';

  // Open Graph & Twitter
  html = html.replace(
    /<meta property="og:title" content=".*?" \/>/,
    `<meta property="og:title" content="${meta.title.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta property="og:description" content=".*?" \/>/,
    `<meta property="og:description" content="${meta.description.replace(/"/g, '&quot;')}" />`
  );

  // og:url is strictly ONLY set if a verified canonicalUrl is present
  if (meta.ogUrl) {
    if (html.includes('<meta property="og:url"')) {
      html = html.replace(
        /<meta property="og:url" content=".*?" \/>/,
        `<meta property="og:url" content="${meta.ogUrl}" />`
      );
    } else {
      html = html.replace('</head>', `    <meta property="og:url" content="${meta.ogUrl}" />\n  </head>`);
    }
  } else {
    html = html.replace(/<meta property="og:url"[^>]*\/>\s*/g, '');
  }

  const logoImgSrc = meta.ogImage || `${basePath}/parsikit-logo.png`;
  html = html.replace(
    /<meta property="og:image" content=".*?" \/>/,
    `<meta property="og:image" content="${logoImgSrc}" />`
  );
  html = html.replace(
    /<meta property="og:image:alt" content=".*?" \/>/,
    `<meta property="og:image:alt" content="${meta.title.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta property="og:locale" content=".*?" \/>/,
    `<meta property="og:locale" content="${loc.ogLocale}" />`
  );
  html = html.replace(
    /<meta name="twitter:title" content=".*?" \/>/,
    `<meta name="twitter:title" content="${meta.title.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content=".*?" \/>/,
    `<meta name="twitter:description" content="${meta.description.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta name="twitter:image" content=".*?" \/>/,
    `<meta name="twitter:image" content="${logoImgSrc}" />`
  );
  html = html.replace(
    /<meta name="twitter:image:alt" content=".*?" \/>/,
    `<meta name="twitter:image:alt" content="${meta.title.replace(/"/g, '&quot;')}" />`
  );

  // Dynamic Schema.org JSON-LD (clean, authentic open-source library metadata)
  let schemaGraph: any[] = [];
  if (meta.schemaType === 'TechArticle' && activeDoc) {
    const articleNode: Record<string, any> = {
      '@type': 'TechArticle',
      headline: meta.title,
      description: meta.description,
      inLanguage: loc.locale,
      author: {
        '@type': 'Person',
        name: OFFICIAL_AUTHOR,
        url: 'https://github.com/MRThugh',
      },
      publisher: {
        '@type': 'Organization',
        name: 'ParsiKit',
        url: OFFICIAL_REPO_URL,
      },
    };

    if (siteUrl && meta.canonicalUrl) {
      articleNode.publisher.url = siteUrl;
      articleNode.mainEntityOfPage = meta.canonicalUrl;
      schemaGraph.push(articleNode);
      schemaGraph.push({
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${siteUrl}${basePath}/${lang}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Docs',
            item: `${siteUrl}${basePath}/${lang}/docs/installation`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: activeDoc.title,
            item: meta.canonicalUrl,
          },
        ],
      });
    } else {
      schemaGraph.push(articleNode);
    }
  } else {
    const appNode: Record<string, any> = {
      '@type': 'SoftwareApplication',
      '@id': `${OFFICIAL_REPO_URL}#software`,
      name: 'ParsiKit',
      description: meta.description,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Cross-platform',
      programmingLanguage: 'Python',
      codeRepository: OFFICIAL_REPO_URL,
      softwareVersion: REPO_METADATA.version,
      license: 'https://opensource.org/licenses/MIT',
      author: {
        '@type': 'Person',
        name: OFFICIAL_AUTHOR,
        url: 'https://github.com/MRThugh',
      },
    };
    schemaGraph.push(appNode);

    if (siteUrl) {
      schemaGraph.push({
        '@type': 'WebSite',
        name: 'ParsiKit Official Website',
        url: `${siteUrl}${basePath}`,
        publisher: {
          '@type': 'Person',
          name: OFFICIAL_AUTHOR,
          url: 'https://github.com/MRThugh',
        },
      });
    }
  }


  // Remove any existing JSON-LD from baseHtml to prevent duplicate structured data blocks
  html = html.replace(
    /<!-- Structured Data \(JSON-LD\) -->\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    ''
  );
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '');

  const structuredDataTag = `<script type="application/ld+json">\n    ${JSON.stringify({ '@context': 'https://schema.org', '@graph': schemaGraph }, null, 2)}\n    </script>`;
  const robotsTag = meta.robots ? `<meta name="robots" content="${meta.robots}" />` : '';

  const headInjections = [
    googleVerificationTag,
    meta.canonicalUrl && !html.includes('<link rel="canonical"') ? canonicalTag : '',
    robotsTag,
    alternateEnTag,
    alternateFaTag,
    alternatePrsTag,
    alternateTgTag,
    alternateXDefaultTag,
    structuredDataTag,
  ]
    .filter(Boolean)
    .join('\n    ');

  html = html.replace('</head>', `    ${headInjections}\n  </head>`);

  // Localized Navigation Links
  const navLinks = {
    docs: t.nav.docs,
    playground: t.nav.playground,
    architecture: t.nav.architecture,
    changelog: t.nav.changelog,
  };

  // Generate semantic HTML inside #root
  let rootContent = '';
  if (activeDoc) {
    const renderedBody = renderMarkdownToHtml(activeDoc.content, activeDoc.slug, lang);

    // Sidebar items for current language
    const currentLangDocs = ALL_DOCS.filter((d) => d.lang === lang);
    const sidebarHtml = currentLangDocs
      .map((d) => {
        const isCurrent = d.slug === activeDoc.slug;
        return `<li><a href="${basePath}/${lang}/docs/${d.slug}" class="${isCurrent ? 'font-bold text-[#126E68] dark:text-[#52C5BE]' : 'hover:underline'}">${d.title}</a></li>`;
      })
      .join('\n');

    // In-page Table of Contents
    const tocHtml =
      activeDoc.headings.length > 0
        ? `<aside class="hidden lg:block w-64 shrink-0 text-sm">
            <div class="sticky top-24 p-4 rounded-xl border border-stone-200 dark:border-white/10 bg-white/50 dark:bg-stone-900/40">
              <h3 class="font-bold text-xs uppercase tracking-wider text-stone-500 mb-3">${t.docs.onThisPage}</h3>
              <ul class="space-y-1.5 text-stone-600 dark:text-stone-300">
                ${activeDoc.headings.map((h) => `<li class="${h.level === 3 ? (isRtl ? 'pr-4' : 'pl-4') : ''}"><a href="#${h.id}" class="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors">${h.text}</a></li>`).join('\n')}
              </ul>
            </div>
          </aside>`
        : '';

    rootContent = `
      <div class="min-h-screen flex flex-col">
        <header class="sticky top-0 z-40 w-full border-b border-stone-200/80 dark:border-white/10 bg-[#FAF7F2]/80 dark:bg-[#0E1413]/80 backdrop-blur-md">
          <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="${basePath}/${lang}" class="font-bold text-lg flex items-center gap-2 text-stone-900 dark:text-white">
              <span class="w-8 h-8 rounded-lg bg-[#126E68] text-white flex items-center justify-center font-bold">P</span>
              <span>ParsiKit</span>
            </a>
            <nav class="flex items-center gap-6 text-sm font-medium">
              <a href="${basePath}/${lang}/docs/installation" class="text-[#126E68] dark:text-[#52C5BE]">${navLinks.docs}</a>
              <a href="${basePath}/${lang}/playground" class="hover:text-[#126E68] dark:hover:text-[#52C5BE]">${navLinks.playground}</a>
              <a href="${basePath}/${lang}/architecture" class="hover:text-[#126E68] dark:hover:text-[#52C5BE]">${navLinks.architecture}</a>
              <a href="${basePath}/${lang}/changelog" class="hover:text-[#126E68] dark:hover:text-[#52C5BE]">${navLinks.changelog}</a>
              <a href="${REPO_METADATA.repository}" target="_blank" rel="noopener noreferrer" class="hover:text-[#126E68]">GitHub</a>
            </nav>
          </div>
        </header>

        <div class="max-w-7xl mx-auto px-4 py-8 flex gap-8 flex-1 w-full">
          <!-- Sidebar Navigation -->
          <nav class="hidden md:block w-64 shrink-0 text-sm border-e border-stone-200 dark:border-white/10 pe-6">
            <h2 class="font-bold text-xs uppercase tracking-wider text-stone-500 mb-4">${navLinks.docs}</h2>
            <ul class="space-y-2">
              ${sidebarHtml}
            </ul>
          </nav>

          <!-- Main Rendered Markdown Article -->
          <main class="flex-1 min-w-0">
            <article class="prose dark:prose-invert max-w-none">
              <div class="mb-6 pb-6 border-b border-stone-200 dark:border-white/10">
                <span class="text-xs font-mono uppercase tracking-widest text-[#126E68] dark:text-[#52C5BE] font-bold">
                  v${REPO_METADATA.version} • ${activeDoc.category}
                </span>
                <p class="text-stone-600 dark:text-stone-300 mt-2 text-base leading-relaxed">${activeDoc.summary}</p>
              </div>
              <div class="markdown-body">
                ${renderedBody}
              </div>
            </article>
          </main>

          <!-- Table of Contents -->
          ${tocHtml}
        </div>

        <footer class="p-6 border-t border-stone-200 dark:border-white/10 text-center text-sm text-stone-500 dark:text-stone-400">
          <p>ParsiKit — Built by Ali Kamrani (<a href="https://github.com/MRThugh" class="underline">@MRThugh</a>). MIT License.</p>
        </footer>
      </div>`;
  } else if (route === 'home') {
    rootContent = `
      <div class="min-h-screen flex flex-col">
        <header class="p-6 border-b border-stone-200 dark:border-white/10">
          <nav class="max-w-7xl mx-auto flex items-center justify-between">
            <a href="${basePath}/${lang}" class="font-bold text-xl text-stone-900 dark:text-white">ParsiKit</a>
            <div class="flex gap-6 text-sm font-medium">
              <a href="${basePath}/${lang}/docs/installation">${navLinks.docs}</a>
              <a href="${basePath}/${lang}/playground">${navLinks.playground}</a>
              <a href="${basePath}/${lang}/architecture">${navLinks.architecture}</a>
              <a href="${basePath}/${lang}/changelog">${navLinks.changelog}</a>
              <a href="${REPO_METADATA.repository}" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </nav>
        </header>

        <main class="flex-1 max-w-6xl mx-auto px-4 py-16">
          <div class="text-center mb-16">
            <span class="px-3 py-1 rounded-full text-xs font-mono bg-[#126E68]/10 text-[#126E68] dark:bg-[#126E68]/30 dark:text-[#52C5BE] font-bold">
              v${REPO_METADATA.version} • Pure Python 3.10+ • Zero Dependencies
            </span>
            <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight mt-6 mb-6 text-stone-900 dark:text-white leading-tight">
              ${meta.title}
            </h1>
            <p class="text-lg sm:text-xl text-stone-600 dark:text-stone-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              ${meta.description}
            </p>
            <div class="inline-flex items-center gap-3 p-4 bg-stone-900 text-stone-100 dark:bg-black/60 rounded-xl font-mono text-sm shadow-lg border border-stone-800" dir="ltr">
              <span class="text-amber-400">$</span>
              <span>pip install parsikit</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
            <div class="p-6 rounded-2xl border border-stone-200 dark:border-white/10 bg-white/60 dark:bg-stone-900/40">
              <h2 class="font-bold text-xl mb-3 text-stone-900 dark:text-white">
                ${t.playground.tools.text.name}
              </h2>
              <p class="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
                ${t.playground.tools.text.desc}
              </p>
            </div>
            <div class="p-6 rounded-2xl border border-stone-200 dark:border-white/10 bg-white/60 dark:bg-stone-900/40">
              <h2 class="font-bold text-xl mb-3 text-stone-900 dark:text-white">
                ${t.playground.tools.nationalCode.name}
              </h2>
              <p class="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
                ${t.playground.tools.nationalCode.desc}
              </p>
            </div>
            <div class="p-6 rounded-2xl border border-stone-200 dark:border-white/10 bg-white/60 dark:bg-stone-900/40">
              <h2 class="font-bold text-xl mb-3 text-stone-900 dark:text-white">
                ${t.playground.tools.calendar.name}
              </h2>
              <p class="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
                ${t.playground.tools.calendar.desc}
              </p>
            </div>
          </div>
        </main>

        <footer class="p-8 border-t border-stone-200 dark:border-white/10 text-center text-sm text-stone-500">
          <p>${t.footer.copyright}</p>
        </footer>
      </div>`;
  } else if (route === 'playground') {
    rootContent = `
      <div class="min-h-screen flex flex-col">
        <header class="p-6 border-b border-stone-200 dark:border-white/10">
          <nav class="max-w-7xl mx-auto flex items-center justify-between">
            <a href="${basePath}/${lang}" class="font-bold text-xl text-stone-900 dark:text-white">ParsiKit</a>
            <div class="flex gap-6 text-sm font-medium">
              <a href="${basePath}/${lang}/docs/installation">${navLinks.docs}</a>
              <a href="${basePath}/${lang}/playground" class="text-[#126E68]">${navLinks.playground}</a>
              <a href="${basePath}/${lang}/architecture">${navLinks.architecture}</a>
              <a href="${basePath}/${lang}/changelog">${navLinks.changelog}</a>
            </div>
          </nav>
        </header>

        <main class="max-w-5xl mx-auto px-4 py-12 flex-1">
          <h1 class="text-3xl font-extrabold mb-4 text-stone-900 dark:text-white">${meta.title}</h1>
          <p class="text-stone-600 dark:text-stone-300 mb-8">${meta.description}</p>
          <div class="p-8 rounded-2xl border border-stone-200 dark:border-white/10 bg-white/60 dark:bg-stone-900/40">
            <h2 class="text-xl font-bold mb-4">${t.playground.runOnline}</h2>
            <ul class="list-disc ps-6 space-y-2 text-stone-600 dark:text-stone-300 text-sm">
              <li>${t.playground.tools.text.name} — ${t.playground.tools.text.desc}</li>
              <li>${t.playground.tools.nationalCode.name} — ${t.playground.tools.nationalCode.desc}</li>
              <li>${t.playground.tools.bankCard.name} — ${t.playground.tools.bankCard.desc}</li>
              <li>${t.playground.tools.calendar.name} — ${t.playground.tools.calendar.desc}</li>
              <li>${t.playground.tools.numberWords.name} — ${t.playground.tools.numberWords.desc}</li>
            </ul>
          </div>
        </main>

        <footer class="p-6 border-t border-stone-200 dark:border-white/10 text-center text-sm text-stone-500">
          <p>${t.footer.copyright}</p>
        </footer>
      </div>`;
  } else if (route === 'architecture') {
    rootContent = `
      <div class="min-h-screen flex flex-col">
        <header class="p-6 border-b border-stone-200 dark:border-white/10">
          <nav class="max-w-7xl mx-auto flex items-center justify-between">
            <a href="${basePath}/${lang}" class="font-bold text-xl text-stone-900 dark:text-white">ParsiKit</a>
            <div class="flex gap-6 text-sm font-medium">
              <a href="${basePath}/${lang}/docs/installation">${navLinks.docs}</a>
              <a href="${basePath}/${lang}/playground">${navLinks.playground}</a>
              <a href="${basePath}/${lang}/architecture" class="text-[#126E68]">${navLinks.architecture}</a>
              <a href="${basePath}/${lang}/changelog">${navLinks.changelog}</a>
            </div>
          </nav>
        </header>

        <main class="max-w-4xl mx-auto px-4 py-12 flex-1">
          <h1 class="text-3xl font-extrabold mb-4 text-stone-900 dark:text-white">${meta.title}</h1>
          <p class="text-stone-600 dark:text-stone-300 mb-8">${meta.description}</p>
          <div class="space-y-6 text-stone-700 dark:text-stone-300">
            <div class="p-6 rounded-2xl border border-stone-200 dark:border-white/10 bg-white/60 dark:bg-stone-900/40">
              <h2 class="text-xl font-bold mb-2 text-stone-900 dark:text-white">1. Zero External Runtime Dependencies</h2>
              <p class="text-sm">ParsiKit is built exclusively with Python standard library capabilities, preventing dependency hell and supply chain vulnerabilities.</p>
            </div>
            <div class="p-6 rounded-2xl border border-stone-200 dark:border-white/10 bg-white/60 dark:bg-stone-900/40">
              <h2 class="text-xl font-bold mb-2 text-stone-900 dark:text-white">2. Thread-Safe In-Memory Cache</h2>
              <p class="text-sm">High-frequency calculations such as number-to-words and astronomical calculations are backed by an internal thread-safe LRU cache.</p>
            </div>
            <div class="p-6 rounded-2xl border border-stone-200 dark:border-white/10 bg-white/60 dark:bg-stone-900/40">
              <h2 class="text-xl font-bold mb-2 text-stone-900 dark:text-white">3. Object-Oriented Domain Models</h2>
              <p class="text-sm">Domain entities in <code>parsikit.models</code> integrate directly with Pydantic v2, FastAPI, and Django form validation pipelines.</p>
            </div>
          </div>
        </main>

        <footer class="p-6 border-t border-stone-200 dark:border-white/10 text-center text-sm text-stone-500">
          <p>${t.footer.copyright}</p>
        </footer>
      </div>`;
  } else if (route === 'changelog') {
    const releaseListHtml = RELEASES_DATA.map(
      (r) => `
      <div class="p-6 rounded-2xl border border-stone-200 dark:border-white/10 bg-white/60 dark:bg-stone-900/40 mb-6">
        <div class="flex items-center justify-between mb-4">
          <span class="text-lg font-bold text-stone-900 dark:text-white">v${r.version}</span>
          <time class="text-xs font-mono text-stone-500">${r.date}</time>
        </div>
        ${r.fixed.length > 0 ? `<h3 class="font-bold text-xs uppercase text-amber-600 mb-2">${t.changelog.fixed}</h3><ul class="list-disc ps-5 text-sm space-y-1 mb-4">${r.fixed.map((f) => `<li>${f}</li>`).join('')}</ul>` : ''}
        ${r.added.length > 0 ? `<h3 class="font-bold text-xs uppercase text-emerald-600 mb-2">${t.changelog.added}</h3><ul class="list-disc ps-5 text-sm space-y-1 mb-4">${r.added.map((a) => `<li>${a}</li>`).join('')}</ul>` : ''}
        ${r.changed.length > 0 ? `<h3 class="font-bold text-xs uppercase text-blue-600 mb-2">${t.changelog.changed}</h3><ul class="list-disc ps-5 text-sm space-y-1">${r.changed.map((c) => `<li>${c}</li>`).join('')}</ul>` : ''}
      </div>
    `
    ).join('\n');

    rootContent = `
      <div class="min-h-screen flex flex-col">
        <header class="p-6 border-b border-stone-200 dark:border-white/10">
          <nav class="max-w-7xl mx-auto flex items-center justify-between">
            <a href="${basePath}/${lang}" class="font-bold text-xl text-stone-900 dark:text-white">ParsiKit</a>
            <div class="flex gap-6 text-sm font-medium">
              <a href="${basePath}/${lang}/docs/installation">${navLinks.docs}</a>
              <a href="${basePath}/${lang}/playground">${navLinks.playground}</a>
              <a href="${basePath}/${lang}/architecture">${navLinks.architecture}</a>
              <a href="${basePath}/${lang}/changelog" class="text-[#126E68]">${navLinks.changelog}</a>
            </div>
          </nav>
        </header>

        <main class="max-w-4xl mx-auto px-4 py-12 flex-1">
          <h1 class="text-3xl font-extrabold mb-4 text-stone-900 dark:text-white">${meta.title}</h1>
          <p class="text-stone-600 dark:text-stone-300 mb-8">${meta.description}</p>
          <div class="space-y-6">
            ${releaseListHtml}
          </div>
        </main>

        <footer class="p-6 border-t border-stone-200 dark:border-white/10 text-center text-sm text-stone-500">
          <p>${t.footer.copyright}</p>
        </footer>
      </div>`;
  } else if (route === 'not-found') {
    rootContent = `
      <div class="min-h-screen flex flex-col">
        <header class="p-6 border-b border-stone-200 dark:border-white/10">
          <nav class="max-w-7xl mx-auto flex items-center justify-between">
            <a href="${basePath}/${lang}" class="font-bold text-xl text-stone-900 dark:text-white">ParsiKit</a>
            <div class="flex gap-6 text-sm font-medium">
              <a href="${basePath}/${lang}/docs/installation">${navLinks.docs}</a>
              <a href="${basePath}/${lang}/playground">${navLinks.playground}</a>
              <a href="${basePath}/${lang}/architecture">${navLinks.architecture}</a>
              <a href="${basePath}/${lang}/changelog">${navLinks.changelog}</a>
            </div>
          </nav>
        </header>

        <main class="max-w-xl mx-auto px-4 py-20 flex-1 flex flex-col items-center justify-center text-center">
          <span class="font-mono text-7xl font-extrabold text-[#126E68] dark:text-[#52C5BE] mb-4">404</span>
          <h1 class="text-3xl font-extrabold text-stone-900 dark:text-white mb-4">${meta.title}</h1>
          <p class="text-stone-600 dark:text-stone-300 text-base mb-8">${meta.description}</p>
          <div class="flex flex-wrap gap-4 justify-center">
            <a href="${basePath}/${lang}" class="px-6 py-3 rounded-xl bg-[#126E68] text-white font-medium hover:bg-[#0E5853] transition-colors">Return Home</a>
            <a href="${basePath}/${lang}/docs/installation" class="px-6 py-3 rounded-xl border border-stone-300 dark:border-white/20 font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">Browse Documentation</a>
          </div>
        </main>

        <footer class="p-6 border-t border-stone-200 dark:border-white/10 text-center text-sm text-stone-500">
          <p>${t.footer.copyright}</p>
        </footer>
      </div>`;
  }

  if (rootContent) {
    html = html.replace('<div id="root"></div>', `<div id="root">${rootContent}</div>`);
  }

  return html;
}

/**
 * Generates an SEO HTML fallback redirect page for legacy Spanish routes.
 * Uses client-side meta http-equiv="refresh" and window.location.replace while preserving query and hash.
 */
function renderLegacyRedirectHtml(baseHtml: string, targetPath: string): string {
  const siteUrl = getVerifiedSiteUrl();
  const basePath = getDeploymentBasePath();
  const fullTargetUrl = siteUrl ? `${siteUrl}${basePath}${targetPath}` : `${basePath}${targetPath}`;
  const canonicalTag = siteUrl ? `<link rel="canonical" href="${fullTargetUrl}" />` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0; url=${fullTargetUrl}" />
  ${canonicalTag}
  <title>ParsiKit — Page Relocated</title>
  <meta name="robots" content="noindex, follow" />
  <script>
    (function() {
      var target = "${fullTargetUrl}";
      var search = window.location.search || "";
      var hash = window.location.hash || "";
      window.location.replace(target + search + hash);
    })();
  </script>
</head>
<body style="font-family: system-ui, sans-serif; padding: 40px; text-align: center;">
  <h1>Page Relocated</h1>
  <p>The requested page has been relocated to <a href="${fullTargetUrl}">${fullTargetUrl}</a>.</p>
  <p style="font-size: 0.85em; color: #666;">HTML redirect fallback verified (client-side meta-refresh + window.location.replace). Hosting platform limitation: GitHub Pages does not support native server-side HTTP 301 headers.</p>
</body>
</html>`;
}

function prerender() {
  const distDir = path.resolve(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    console.error('dist directory does not exist! Run vite build first.');
    return;
  }

  const siteUrl = getVerifiedSiteUrl();
  const basePath = getDeploymentBasePath();

  const baseHtmlPath = path.join(distDir, 'index.html');
  const baseHtml = fs.readFileSync(baseHtmlPath, 'utf-8');

  // Static routes to prerender across all 4 languages
  const routesToPrerender: { lang: AppLang; route: PageRoute; docSlug?: string }[] = [];

  for (const lang of VALID_LANGS) {
    routesToPrerender.push(
      { lang, route: 'home' },
      { lang, route: 'playground' },
      { lang, route: 'architecture' },
      { lang, route: 'changelog' }
    );
  }

  // Add all documentation files (94 total)
  for (const doc of ALL_DOCS) {
    routesToPrerender.push({
      lang: doc.lang,
      route: 'docs',
      docSlug: doc.slug,
    });
  }

  for (const r of routesToPrerender) {
    const routePath = buildRoutePath(r.lang, r.route, r.docSlug);
    const targetDir = path.join(distDir, routePath.replace(/^\//, ''));
    fs.mkdirSync(targetDir, { recursive: true });

    const renderedHtml = renderHtmlTemplate(baseHtml, r.lang, r.route, r.docSlug);
    fs.writeFileSync(path.join(targetDir, 'index.html'), renderedHtml);
  }

  // Pre-render root index.html with localized content to /en
  const rootIndexHtml = renderHtmlTemplate(baseHtml, 'en', 'home');
  fs.writeFileSync(path.join(distDir, 'index.html'), rootIndexHtml);

  // Pre-render explicit migration redirect pages for legacy Spanish routes
  const legacySpanishRoutes: { source: string; target: string }[] = [
    { source: 'es', target: '/en' },
    { source: 'es/playground', target: '/en/playground' },
    { source: 'es/architecture', target: '/en/architecture' },
    { source: 'es/changelog', target: '/en/changelog' },
    { source: 'es/docs', target: '/en/docs/installation' },
    { source: 'es/docs/index', target: '/en/docs/index' },
  ];

  // Include every single unique doc slug across ALL_DOCS (all 28 unique slugs)
  const uniqueDocSlugs = Array.from(new Set(ALL_DOCS.map((d) => d.slug)));
  for (const slug of uniqueDocSlugs) {
    legacySpanishRoutes.push({
      source: `es/docs/${slug}`,
      target: `/en/docs/${slug}`,
    });
  }

  for (const leg of legacySpanishRoutes) {
    const legDir = path.join(distDir, leg.source);
    fs.mkdirSync(legDir, { recursive: true });
    const redirHtml = renderLegacyRedirectHtml(baseHtml, leg.target);
    fs.writeFileSync(path.join(legDir, 'index.html'), redirHtml);
  }

  // Prerender semantic 404.html for GitHub Pages fallback
  const notFoundHtml = renderHtmlTemplate(baseHtml, 'en', 'not-found');
  fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml);

  // Prerender localized 404 pages for each supported language
  for (const lang of VALID_LANGS) {
    const lang404Dir = path.join(distDir, lang, '404');
    fs.mkdirSync(lang404Dir, { recursive: true });
    const lang404Html = renderHtmlTemplate(baseHtml, lang, 'not-found');
    fs.writeFileSync(path.join(lang404Dir, 'index.html'), lang404Html);
  }

  // Generate sitemap.xml ONLY if verified production origin is configured
  if (siteUrl) {
    const sitemapEntries = routesToPrerender.map((r) => {
      const activeDoc = r.docSlug
        ? ALL_DOCS.find((d) => d.lang === r.lang && d.slug === r.docSlug) || null
        : null;
      const meta = computePageMetadata(r.lang, r.route, activeDoc);
      const alternates: string[] = [];

      if (meta.alternateEnUrl) {
        alternates.push(
          `    <xhtml:link rel="alternate" hreflang="en" href="${meta.alternateEnUrl}"/>`
        );
      }
      if (meta.alternateFaUrl) {
        alternates.push(
          `    <xhtml:link rel="alternate" hreflang="fa" href="${meta.alternateFaUrl}"/>`
        );
        alternates.push(
          `    <xhtml:link rel="alternate" hreflang="fa-IR" href="${meta.alternateFaUrl}"/>`
        );
      }
      if (meta.alternatePrsUrl) {
        alternates.push(
          `    <xhtml:link rel="alternate" hreflang="prs" href="${meta.alternatePrsUrl}"/>`
        );
        alternates.push(
          `    <xhtml:link rel="alternate" hreflang="prs-AF" href="${meta.alternatePrsUrl}"/>`
        );
      }
      if (meta.alternateTgUrl) {
        alternates.push(
          `    <xhtml:link rel="alternate" hreflang="tg" href="${meta.alternateTgUrl}"/>`
        );
        alternates.push(
          `    <xhtml:link rel="alternate" hreflang="tg-TJ" href="${meta.alternateTgUrl}"/>`
        );
      }
      if (meta.alternateXDefaultUrl) {
        alternates.push(
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${meta.alternateXDefaultUrl}"/>`
        );
      }

      return `  <url>
    <loc>${meta.canonicalUrl}</loc>
${alternates.join('\n')}
    <changefreq>weekly</changefreq>
    <priority>${r.route === 'docs' ? '0.8' : '1.0'}</priority>
  </url>`;
    });

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries.join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml);

    const robotsTxt = `# ParsiKit robots.txt
User-agent: *
Allow: /
Sitemap: ${siteUrl}${basePath}/sitemap.xml
`;
    fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt);
    console.log(`Prerender complete: generated sitemap.xml for verified origin ${siteUrl}${basePath}`);
  } else {
    // Clean up dist/sitemap.xml if it exists to prevent publishing an unverified sitemap
    const distSitemap = path.join(distDir, 'sitemap.xml');
    if (fs.existsSync(distSitemap)) {
      fs.unlinkSync(distSitemap);
    }

    const robotsTxt = `# ParsiKit robots.txt
User-agent: *
Allow: /
`;
    fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt);
    console.log('Notice: Verified production origin not configured. Domain-dependent production SEO artifacts (sitemap.xml, absolute canonicals) omitted.');
  }

  // Generate base-path aware site.webmanifest in dist/
  const manifest = buildWebManifest(basePath);
  fs.writeFileSync(path.join(distDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`Prerender complete: generated base-path aware site.webmanifest (start_url: "${manifest.start_url}")`);

  console.log(
    `Prerender complete: generated ${routesToPrerender.length} static index.html pages, ${legacySpanishRoutes.length} legacy Spanish HTML fallback redirect stubs (client-side meta-refresh + window.location.replace)!`
  );
}

if (process.argv[1] && process.argv[1].endsWith('prerender.ts')) {
  prerender();
}

export { prerender };
