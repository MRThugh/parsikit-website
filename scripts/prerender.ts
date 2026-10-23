import fs from 'node:fs';
import path from 'node:path';
import { ALL_DOCS, type DocEntry } from '../src/data/docsManifest';
import { RELEASES_DATA } from '../src/data/changelogData';
import { REPO_METADATA } from '../src/data/repoMetadata';
import { computePageMetadata, BASE_SITE_URL } from '../src/lib/seo';
import { type PageRoute, type AppLang, buildRoutePath, VALID_LANGS } from '../src/lib/router';
import { renderMarkdownToHtml } from './render-markdown';

function renderHtmlTemplate(
  baseHtml: string,
  lang: AppLang,
  route: PageRoute,
  docSlug?: string
): string {
  const activeDoc = docSlug
    ? ALL_DOCS.find((d) => d.lang === lang && d.slug === docSlug) || null
    : null;

  const meta = computePageMetadata(lang, route, activeDoc);
  const isRtl = lang === 'fa';

  let html = baseHtml;

  // Replace html tag attributes
  html = html.replace(/<html[^>]*>/, `<html lang="${lang}" dir="${isRtl ? 'rtl' : 'ltr'}">`);

  // Replace title
  html = html.replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`);

  // Replace meta description
  html = html.replace(
    /<meta name="description" content=".*?" \/>/,
    `<meta name="description" content="${meta.description.replace(/"/g, '&quot;')}" />`
  );

  // Canonical & Alternates
  const canonicalTag = `<link rel="canonical" href="${meta.canonicalUrl}" />`;
  const alternateEnTag = meta.alternateEnUrl
    ? `<link rel="alternate" hreflang="en" href="${meta.alternateEnUrl}" />`
    : '';
  const alternateFaTag = meta.alternateFaUrl
    ? `<link rel="alternate" hreflang="fa" href="${meta.alternateFaUrl}" />`
    : '';
  const alternateEsTag = meta.alternateEsUrl
    ? `<link rel="alternate" hreflang="es" href="${meta.alternateEsUrl}" />`
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
  html = html.replace(
    /<meta name="twitter:title" content=".*?" \/>/,
    `<meta name="twitter:title" content="${meta.title.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content=".*?" \/>/,
    `<meta name="twitter:description" content="${meta.description.replace(/"/g, '&quot;')}" />`
  );

  // Dynamic Schema.org JSON-LD
  let schemaGraph: any[] = [];
  if (meta.schemaType === 'TechArticle' && activeDoc) {
    schemaGraph = [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'headline': meta.title,
        'description': meta.description,
        'inLanguage': lang,
        'author': {
          '@type': 'Person',
          'name': 'Ali Kamrani',
          'url': 'https://github.com/MRThugh'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'ParsiKit',
          'url': BASE_SITE_URL
        },
        'mainEntityOfPage': meta.canonicalUrl
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': `${BASE_SITE_URL}/${lang}`
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Docs',
            'item': `${BASE_SITE_URL}/${lang}/docs/installation`
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': activeDoc.title,
            'item': meta.canonicalUrl
          }
        ]
      }
    ];
  } else {
    schemaGraph = [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'ParsiKit',
        'description': meta.description,
        'applicationCategory': 'DeveloperApplication',
        'operatingSystem': 'Cross-platform',
        'softwareVersion': REPO_METADATA.version,
        'license': 'https://opensource.org/licenses/MIT',
        'author': {
          '@type': 'Person',
          'name': 'Ali Kamrani',
          'url': 'https://github.com/MRThugh'
        },
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'ParsiKit Official Website',
        'url': BASE_SITE_URL,
        'publisher': {
          '@type': 'Person',
          'name': 'Ali Kamrani',
          'url': 'https://github.com/MRThugh'
        }
      }
    ];
  }

  const structuredDataTag = `<script type="application/ld+json">\n    ${JSON.stringify({ '@context': 'https://schema.org', '@graph': schemaGraph }, null, 2)}\n    </script>`;

  const headInjections = [
    canonicalTag,
    alternateEnTag,
    alternateFaTag,
    alternateEsTag,
    structuredDataTag,
  ].filter(Boolean).join('\n    ');

  html = html.replace('</head>', `    ${headInjections}\n  </head>`);

  // Localized Navigation Links
  const navLinks = {
    docs: lang === 'fa' ? 'مستندات' : lang === 'es' ? 'Documentación' : 'Documentation',
    playground: lang === 'fa' ? 'محیط آزمایشی' : lang === 'es' ? 'Pruebas' : 'Playground',
    architecture: lang === 'fa' ? 'معماری فنی' : lang === 'es' ? 'Arquitectura' : 'Architecture',
    changelog: lang === 'fa' ? 'تغییرات' : lang === 'es' ? 'Historial' : 'Changelog',
  };

  // Generate semantic HTML inside #root
  let rootContent = '';
  if (activeDoc) {
    const renderedBody = renderMarkdownToHtml(activeDoc.content);
    
    // Sidebar items for current language
    const currentLangDocs = ALL_DOCS.filter((d) => d.lang === lang);
    const sidebarHtml = currentLangDocs
      .map((d) => {
        const isCurrent = d.slug === activeDoc.slug;
        return `<li><a href="/${lang}/docs/${d.slug}" class="${isCurrent ? 'font-bold text-[#126E68] dark:text-[#52C5BE]' : 'hover:underline'}">${d.title}</a></li>`;
      })
      .join('\n');

    // In-page Table of Contents
    const tocHtml = activeDoc.headings.length > 0
      ? `<aside class="hidden lg:block w-64 shrink-0 text-sm">
          <div class="sticky top-24 p-4 rounded-xl border border-stone-200 dark:border-white/10 bg-white/50 dark:bg-stone-900/40">
            <h3 class="font-bold text-xs uppercase tracking-wider text-stone-500 mb-3">${lang === 'fa' ? 'فهرست بخش‌ها' : lang === 'es' ? 'En esta página' : 'On this page'}</h3>
            <ul class="space-y-1.5 text-stone-600 dark:text-stone-300">
              ${activeDoc.headings.map(h => `<li class="${h.level === 3 ? (isRtl ? 'pr-4' : 'pl-4') : ''}"><a href="#${h.id}" class="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors">${h.text}</a></li>`).join('\n')}
            </ul>
          </div>
        </aside>`
      : '';

    rootContent = `
      <div class="min-h-screen flex flex-col">
        <header class="sticky top-0 z-40 w-full border-b border-stone-200/80 dark:border-white/10 bg-[#FAF7F2]/80 dark:bg-[#0E1413]/80 backdrop-blur-md">
          <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/${lang}" class="font-bold text-lg flex items-center gap-2 text-stone-900 dark:text-white">
              <span class="w-8 h-8 rounded-lg bg-[#126E68] text-white flex items-center justify-center font-bold">P</span>
              <span>ParsiKit</span>
            </a>
            <nav class="flex items-center gap-6 text-sm font-medium">
              <a href="/${lang}/docs/installation" class="text-[#126E68] dark:text-[#52C5BE]">${navLinks.docs}</a>
              <a href="/${lang}/playground" class="hover:text-[#126E68] dark:hover:text-[#52C5BE]">${navLinks.playground}</a>
              <a href="/${lang}/architecture" class="hover:text-[#126E68] dark:hover:text-[#52C5BE]">${navLinks.architecture}</a>
              <a href="/${lang}/changelog" class="hover:text-[#126E68] dark:hover:text-[#52C5BE]">${navLinks.changelog}</a>
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
    const isEs = lang === 'es';
    rootContent = `
      <div class="min-h-screen flex flex-col">
        <header class="p-6 border-b border-stone-200 dark:border-white/10">
          <nav class="max-w-7xl mx-auto flex items-center justify-between">
            <a href="/${lang}" class="font-bold text-xl text-stone-900 dark:text-white">ParsiKit</a>
            <div class="flex gap-6 text-sm font-medium">
              <a href="/${lang}/docs/installation">${navLinks.docs}</a>
              <a href="/${lang}/playground">${navLinks.playground}</a>
              <a href="/${lang}/architecture">${navLinks.architecture}</a>
              <a href="/${lang}/changelog">${navLinks.changelog}</a>
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
            <div class="inline-flex items-center gap-3 p-4 bg-stone-900 text-stone-100 dark:bg-black/60 rounded-xl font-mono text-sm shadow-lg border border-stone-800">
              <span class="text-amber-400">$</span>
              <span>pip install parsikit</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
            <div class="p-6 rounded-2xl border border-stone-200 dark:border-white/10 bg-white/60 dark:bg-stone-900/40">
              <h2 class="font-bold text-xl mb-3 text-stone-900 dark:text-white">
                ${isRtl ? 'پاکسازی متن و نیم‌فاصله' : isEs ? 'Normalización de Texto y ZWNJ' : 'Text & ZWNJ Normalization'}
              </h2>
              <p class="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
                ${isRtl ? 'استانداردسازی کاراکترهای عربی به فارسی، اصلاح نیم‌فاصله‌های پنهان و پاکسازی اعراب.' : isEs ? 'Conversión de glifos árabes a persas, corrección de ZWNJ y limpieza de diacríticos.' : 'Arabic to Persian glyph normalization, ZWNJ correction, and text cleaning.'}
              </p>
            </div>
            <div class="p-6 rounded-2xl border border-stone-200 dark:border-white/10 bg-white/60 dark:bg-stone-900/40">
              <h2 class="font-bold text-xl mb-3 text-stone-900 dark:text-white">
                ${isRtl ? 'اعتبارسنجی ملی و بانکی' : isEs ? 'Validación Nacional y Bancaria' : 'National & Banking Validation'}
              </h2>
              <p class="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
                ${isRtl ? 'الگوریتم پیمانه ۱۱ کد ملی، الگوریتم لون کارت بانکی و اعتبارسنجی شناسه شبا.' : isEs ? 'Módulo 11 para Código Nacional, algoritmo de Luhn para tarjetas y verificación IBAN Sheba.' : 'Modulo 11 National Code, Luhn bank card algorithm, and ISO 7064 Sheba verification.'}
              </p>
            </div>
            <div class="p-6 rounded-2xl border border-stone-200 dark:border-white/10 bg-white/60 dark:bg-stone-900/40">
              <h2 class="font-bold text-xl mb-3 text-stone-900 dark:text-white">
                ${isRtl ? 'تقویم نجومی جلالی' : isEs ? 'Calendario Astronómico Jalalí' : 'Astronomical Jalali Calendar'}
              </h2>
              <p class="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
                ${isRtl ? 'تبدیل تاریخ‌های میلادی و جلالی با محاسبات دقیق چرخه ۳۳ ساله کبیسه.' : isEs ? 'Conversión de fechas solares y gregorianas con ciclo bisiesto de 33 años.' : 'Gregorian to Solar Hijri date conversions with accurate 33-year leap cycle support.'}
              </p>
            </div>
          </div>
        </main>

        <footer class="p-8 border-t border-stone-200 dark:border-white/10 text-center text-sm text-stone-500">
          <p>ParsiKit — Built by Ali Kamrani (<a href="https://github.com/MRThugh" class="underline">@MRThugh</a>). MIT License.</p>
        </footer>
      </div>`;
  } else if (route === 'playground') {
    const isEs = lang === 'es';
    rootContent = `
      <div class="min-h-screen flex flex-col">
        <header class="p-6 border-b border-stone-200 dark:border-white/10">
          <nav class="max-w-7xl mx-auto flex items-center justify-between">
            <a href="/${lang}" class="font-bold text-xl text-stone-900 dark:text-white">ParsiKit</a>
            <div class="flex gap-6 text-sm font-medium">
              <a href="/${lang}/docs/installation">${navLinks.docs}</a>
              <a href="/${lang}/playground" class="text-[#126E68]">${navLinks.playground}</a>
              <a href="/${lang}/architecture">${navLinks.architecture}</a>
              <a href="/${lang}/changelog">${navLinks.changelog}</a>
            </div>
          </nav>
        </header>

        <main class="max-w-5xl mx-auto px-4 py-12 flex-1">
          <h1 class="text-3xl font-extrabold mb-4 text-stone-900 dark:text-white">${meta.title}</h1>
          <p class="text-stone-600 dark:text-stone-300 mb-8">${meta.description}</p>
          <div class="p-8 rounded-2xl border border-stone-200 dark:border-white/10 bg-white/60 dark:bg-stone-900/40">
            <h2 class="text-xl font-bold mb-4">${isRtl ? 'ابزارهای آزمایشی آنلاین' : isEs ? 'Herramientas de Diagnóstico Interactivas' : 'Interactive Diagnostic Tools'}</h2>
            <ul class="list-disc ps-6 space-y-2 text-stone-600 dark:text-stone-300 text-sm">
              <li>${isRtl ? 'پاکسازی نیم‌فاصله و تبدیل کاراکترهای عربی به فارسی' : isEs ? 'Limpieza de ZWNJ y normalización de glifos árabes' : 'ZWNJ text cleansing and Arabic to Persian normalization'}</li>
              <li>${isRtl ? 'محاسبه چک‌سام کد ملی و تشخیص استان صادرکننده' : isEs ? 'Verificación de Código Nacional y provincia de emisión' : 'National Code Modulo 11 check and province detection'}</li>
              <li>${isRtl ? 'الگوریتم لان کارت بانکی و تشخیص بانک عامل' : isEs ? 'Algoritmo de Luhn y reconocimiento del banco emisor' : 'Bank card Luhn verification and issuing bank detection'}</li>
              <li>${isRtl ? 'تبدیل تاریخ میلادی به هجری خورشیدی و محاسبه کبیسه' : isEs ? 'Conversión de fechas solares Jalalí y cálculo de bisiestos' : 'Gregorian to Jalali date conversion and leap year calculation'}</li>
              <li>${isRtl ? 'تبدیل اعداد و مبالغ ریال به حروف و تومان' : isEs ? 'Conversión de números a palabras en persa y cálculo de divisas' : 'Number to Persian words and Rial to Toman calculation'}</li>
            </ul>
          </div>
        </main>

        <footer class="p-6 border-t border-stone-200 dark:border-white/10 text-center text-sm text-stone-500">
          <p>ParsiKit — Built by Ali Kamrani (<a href="https://github.com/MRThugh" class="underline">@MRThugh</a>). MIT License.</p>
        </footer>
      </div>`;
  } else if (route === 'architecture') {
    const isEs = lang === 'es';
    rootContent = `
      <div class="min-h-screen flex flex-col">
        <header class="p-6 border-b border-stone-200 dark:border-white/10">
          <nav class="max-w-7xl mx-auto flex items-center justify-between">
            <a href="/${lang}" class="font-bold text-xl text-stone-900 dark:text-white">ParsiKit</a>
            <div class="flex gap-6 text-sm font-medium">
              <a href="/${lang}/docs/installation">${navLinks.docs}</a>
              <a href="/${lang}/playground">${navLinks.playground}</a>
              <a href="/${lang}/architecture" class="text-[#126E68]">${navLinks.architecture}</a>
              <a href="/${lang}/changelog">${navLinks.changelog}</a>
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
          <p>ParsiKit — Built by Ali Kamrani (<a href="https://github.com/MRThugh" class="underline">@MRThugh</a>). MIT License.</p>
        </footer>
      </div>`;
  } else if (route === 'changelog') {
    const isEs = lang === 'es';
    const releaseListHtml = RELEASES_DATA.map(r => `
      <div class="p-6 rounded-2xl border border-stone-200 dark:border-white/10 bg-white/60 dark:bg-stone-900/40 mb-6">
        <div class="flex items-center justify-between mb-4">
          <span class="text-lg font-bold text-stone-900 dark:text-white">v${r.version}</span>
          <time class="text-xs font-mono text-stone-500">${r.date}</time>
        </div>
        ${r.fixed.length > 0 ? `<h3 class="font-bold text-xs uppercase text-amber-600 mb-2">Fixed</h3><ul class="list-disc ps-5 text-sm space-y-1 mb-4">${r.fixed.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}
        ${r.added.length > 0 ? `<h3 class="font-bold text-xs uppercase text-emerald-600 mb-2">Added</h3><ul class="list-disc ps-5 text-sm space-y-1 mb-4">${r.added.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}
        ${r.changed.length > 0 ? `<h3 class="font-bold text-xs uppercase text-blue-600 mb-2">Changed</h3><ul class="list-disc ps-5 text-sm space-y-1">${r.changed.map(c => `<li>${c}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('\n');

    rootContent = `
      <div class="min-h-screen flex flex-col">
        <header class="p-6 border-b border-stone-200 dark:border-white/10">
          <nav class="max-w-7xl mx-auto flex items-center justify-between">
            <a href="/${lang}" class="font-bold text-xl text-stone-900 dark:text-white">ParsiKit</a>
            <div class="flex gap-6 text-sm font-medium">
              <a href="/${lang}/docs/installation">${navLinks.docs}</a>
              <a href="/${lang}/playground">${navLinks.playground}</a>
              <a href="/${lang}/architecture">${navLinks.architecture}</a>
              <a href="/${lang}/changelog" class="text-[#126E68]">${navLinks.changelog}</a>
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
          <p>ParsiKit — Built by Ali Kamrani (<a href="https://github.com/MRThugh" class="underline">@MRThugh</a>). MIT License.</p>
        </footer>
      </div>`;
  }

  if (rootContent) {
    html = html.replace('<div id="root"></div>', `<div id="root">${rootContent}</div>`);
  }

  return html;
}

function prerender() {
  const distDir = path.resolve(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    console.error('dist directory does not exist! Run vite build first.');
    return;
  }

  const baseHtmlPath = path.join(distDir, 'index.html');
  const baseHtml = fs.readFileSync(baseHtmlPath, 'utf-8');

  // Static routes to prerender in all 3 languages
  const routesToPrerender: { lang: AppLang; route: PageRoute; docSlug?: string }[] = [];

  for (const lang of VALID_LANGS) {
    routesToPrerender.push(
      { lang, route: 'home' },
      { lang, route: 'playground' },
      { lang, route: 'architecture' },
      { lang, route: 'changelog' }
    );
  }

  // Add all documentation files
  for (const doc of ALL_DOCS) {
    routesToPrerender.push({
      lang: doc.lang,
      route: 'docs',
      docSlug: doc.slug,
    });
  }

  const allUrls: string[] = [`${BASE_SITE_URL}/`];

  for (const r of routesToPrerender) {
    const routePath = buildRoutePath(r.lang, r.route, r.docSlug);
    const targetDir = path.join(distDir, routePath.replace(/^\//, ''));
    fs.mkdirSync(targetDir, { recursive: true });

    const renderedHtml = renderHtmlTemplate(baseHtml, r.lang, r.route, r.docSlug);
    fs.writeFileSync(path.join(targetDir, 'index.html'), renderedHtml);

    allUrls.push(`${BASE_SITE_URL}${routePath}`);
  }

  // Prerender 404.html
  const notFoundHtml = renderHtmlTemplate(baseHtml, 'en', 'home');
  fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml);

  // Generate verified sitemap.xml
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url.includes('/docs/') ? '0.8' : '1.0'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml);
  fs.writeFileSync(path.resolve(process.cwd(), 'public/sitemap.xml'), sitemapXml);

  const robotsTxt = `# ParsiKit robots.txt
User-agent: *
Allow: /
Sitemap: ${BASE_SITE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt);
  fs.writeFileSync(path.resolve(process.cwd(), 'public/robots.txt'), robotsTxt);

  console.log(`Prerender complete: generated ${routesToPrerender.length} static index.html pages and sitemap!`);
}

prerender();
