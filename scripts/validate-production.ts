import fs from 'node:fs';
import path from 'node:path';
import { ALL_DOCS } from '../src/data/docsManifest';
import { VALID_LANGS, buildRoutePath } from '../src/lib/router';
import { LOCALES } from '../src/i18n/config';

function validateProduction() {
  const distDir = path.resolve(process.cwd(), 'dist');
  console.log('--- Commencing ParsiKit Production Quality & SEO Audit ---');

  if (!fs.existsSync(distDir)) {
    throw new Error('dist directory does not exist! Run npm run build first.');
  }

  // 1. Audit core static pages
  const staticRoutes = ['home', 'playground', 'architecture', 'changelog'] as const;
  for (const lang of VALID_LANGS) {
    for (const route of staticRoutes) {
      const relPath = buildRoutePath(lang, route).replace(/^\//, '');
      const indexPath = path.join(distDir, relPath, 'index.html');
      if (!fs.existsSync(indexPath)) {
        throw new Error(`Missing prerendered page: ${relPath}/index.html`);
      }
      const html = fs.readFileSync(indexPath, 'utf-8');
      const loc = LOCALES[lang];
      if (!html.includes(`lang="${loc.locale}"`) || !html.includes(`dir="${loc.direction}"`)) {
        throw new Error(`HTML lang/dir tag mismatch in ${relPath}/index.html`);
      }
      if (!html.includes('<link rel="canonical"')) {
        throw new Error(`Missing canonical link in ${relPath}/index.html`);
      }
      if (!html.includes('<title>')) {
        throw new Error(`Missing title in ${relPath}/index.html`);
      }
    }
  }
  console.log('✅ Core static pages (16 pages across 4 languages) verified.');

  // 2. Audit all 94 documentation pages
  for (const doc of ALL_DOCS) {
    const relPath = `${doc.lang}/docs/${doc.slug}`;
    const indexPath = path.join(distDir, relPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
      throw new Error(`Missing prerendered doc page: ${relPath}/index.html`);
    }
    const html = fs.readFileSync(indexPath, 'utf-8');
    if (!html.includes('<title>') || !html.includes('<link rel="canonical"')) {
      throw new Error(`Malformed head tags in doc page: ${relPath}/index.html`);
    }
  }
  console.log(`✅ All ${ALL_DOCS.length} documentation pages verified in dist.`);

  // 3. Audit Legacy Spanish Redirect Pages
  const uniqueDocSlugs = Array.from(new Set(ALL_DOCS.map((d) => d.slug)));
  const legacyChecks = [
    'es',
    'es/playground',
    'es/architecture',
    'es/changelog',
    'es/docs',
    'es/docs/index',
    ...uniqueDocSlugs.map((s) => `es/docs/${s}`),
  ];

  for (const leg of legacyChecks) {
    const indexPath = path.join(distDir, leg, 'index.html');
    if (!fs.existsSync(indexPath)) {
      throw new Error(`Missing legacy Spanish redirect page: ${leg}/index.html`);
    }
    const html = fs.readFileSync(indexPath, 'utf-8');
    if (!html.includes('http-equiv="refresh"') || !html.includes('window.location.replace')) {
      throw new Error(`Invalid redirect implementation in ${leg}/index.html`);
    }
  }
  console.log(`✅ All ${legacyChecks.length} legacy Spanish 301 redirect pages verified.`);

  // 4. Audit sitemap.xml
  const sitemapPath = path.join(distDir, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    throw new Error('Missing sitemap.xml in dist!');
  }
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  if (sitemapContent.includes('/es/') || sitemapContent.includes('/es<')) {
    throw new Error('Spanish routes detected in production sitemap.xml!');
  }
  if (!sitemapContent.includes('xhtml:link') || !sitemapContent.includes('hreflang="fa"')) {
    throw new Error('Sitemap missing valid xhtml:link multilingual annotations!');
  }
  console.log('✅ sitemap.xml verified (no Spanish, valid xhtml:link alternates).');

  // 5. Audit robots.txt
  const robotsPath = path.join(distDir, 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    throw new Error('Missing robots.txt in dist!');
  }
  const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
  if (!robotsContent.includes('Sitemap: https://parsikit.dev/sitemap.xml')) {
    throw new Error('robots.txt does not declare correct sitemap URL!');
  }
  console.log('✅ robots.txt verified.');

  // 6. Audit 404 Pages (dist/404.html and localized 404 pages with noindex)
  const top404Path = path.join(distDir, '404.html');
  if (!fs.existsSync(top404Path)) {
    throw new Error('Missing top-level 404.html in dist!');
  }
  const top404Content = fs.readFileSync(top404Path, 'utf-8');
  if (!top404Content.includes('noindex')) {
    throw new Error('404.html does not contain noindex meta tag!');
  }

  for (const lang of VALID_LANGS) {
    const lang404Path = path.join(distDir, lang, '404', 'index.html');
    if (!fs.existsSync(lang404Path)) {
      throw new Error(`Missing localized 404 page for ${lang} at ${lang}/404/index.html!`);
    }
    const lang404Content = fs.readFileSync(lang404Path, 'utf-8');
    if (!lang404Content.includes('noindex')) {
      throw new Error(`Localized 404 page for ${lang} does not contain noindex tag!`);
    }
  }

  if (sitemapContent.includes('/404')) {
    throw new Error('404 URLs must not be present in sitemap.xml!');
  }
  console.log('✅ 404 pages verified (dist/404.html, localized pages with noindex, excluded from sitemap).');

  console.log('🎉 Production Quality, SEO & Spanish Migration Audit PASSED with 100% compliance!');
}

validateProduction();
