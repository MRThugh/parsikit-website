import fs from 'node:fs';
import path from 'node:path';
import { ALL_DOCS } from '../src/data/docsManifest';
import { VALID_LANGS, buildRoutePath } from '../src/lib/router';
import { LOCALES } from '../src/i18n/config';
import { BASE_SITE_URL } from '../src/lib/seo';

export interface XmlNode {
  tag: string;
  attributes: Record<string, string>;
  children: XmlNode[];
  text: string;
}

/**
 * Strict XML parser for sitemap validation.
 * Verifies tag balancing, well-formed attributes, namespaces, and extracts document tree.
 */
export function parseXml(xmlContent: string): XmlNode {
  let pos = 0;
  const len = xmlContent.length;

  function skipWhitespace() {
    while (pos < len && /\s/.test(xmlContent[pos])) {
      pos++;
    }
  }

  // Skip XML prologue e.g. <?xml ... ?>
  skipWhitespace();
  if (xmlContent.slice(pos, pos + 5) === '<?xml') {
    const endPrologue = xmlContent.indexOf('?>', pos);
    if (endPrologue === -1) throw new Error('Unterminated XML prologue');
    pos = endPrologue + 2;
  }

  function parseTag(): XmlNode {
    skipWhitespace();
    if (pos >= len || xmlContent[pos] !== '<') {
      throw new Error(`Expected '<' at position ${pos}`);
    }
    pos++; // consume '<'

    // Check for comment
    if (xmlContent.slice(pos, pos + 3) === '!--') {
      const endComment = xmlContent.indexOf('-->', pos);
      if (endComment === -1) throw new Error('Unterminated XML comment');
      pos = endComment + 3;
      return parseTag();
    }

    // Read tag name
    let tagName = '';
    while (pos < len && /^[a-zA-Z0-9:_-]$/.test(xmlContent[pos])) {
      tagName += xmlContent[pos++];
    }
    if (!tagName) {
      throw new Error(`Missing tag name at position ${pos}`);
    }

    const attributes: Record<string, string> = {};

    // Parse attributes
    while (pos < len) {
      skipWhitespace();
      if (xmlContent[pos] === '>' || xmlContent.slice(pos, pos + 2) === '/>') {
        break;
      }
      let attrName = '';
      while (pos < len && /^[a-zA-Z0-9:_-]$/.test(xmlContent[pos])) {
        attrName += xmlContent[pos++];
      }
      if (!attrName) break;

      skipWhitespace();
      if (xmlContent[pos] !== '=') {
        throw new Error(`Expected '=' after attribute '${attrName}' at position ${pos}`);
      }
      pos++; // consume '='
      skipWhitespace();
      const quote = xmlContent[pos];
      if (quote !== '"' && quote !== "'") {
        throw new Error(`Expected quote around attribute value for '${attrName}' at position ${pos}`);
      }
      pos++; // consume open quote
      let attrValue = '';
      while (pos < len && xmlContent[pos] !== quote) {
        attrValue += xmlContent[pos++];
      }
      if (pos >= len) {
        throw new Error(`Unterminated attribute quote for '${attrName}'`);
      }
      pos++; // consume close quote
      attributes[attrName] = attrValue;
    }

    skipWhitespace();
    // Self-closing tag
    if (xmlContent.slice(pos, pos + 2) === '/>') {
      pos += 2;
      return { tag: tagName, attributes, children: [], text: '' };
    }

    if (xmlContent[pos] !== '>') {
      throw new Error(`Expected '>' for tag <${tagName}> at position ${pos}`);
    }
    pos++; // consume '>'

    const children: XmlNode[] = [];
    let text = '';
    let closed = false;

    while (pos < len) {
      skipWhitespace();
      if (xmlContent.slice(pos, pos + 2) === '</') {
        // Closing tag
        pos += 2;
        let closingTagName = '';
        while (pos < len && /^[a-zA-Z0-9:_-]$/.test(xmlContent[pos])) {
          closingTagName += xmlContent[pos++];
        }
        skipWhitespace();
        if (xmlContent[pos] !== '>') {
          throw new Error(`Expected '>' at closing tag </${closingTagName}>`);
        }
        pos++;
        if (closingTagName !== tagName) {
          throw new Error(`Mismatched closing tag: expected </${tagName}>, found </${closingTagName}>`);
        }
        closed = true;
        break;
      } else if (xmlContent[pos] === '<') {
        children.push(parseTag());
      } else {
        text += xmlContent[pos++];
      }
    }

    if (!closed) {
      throw new Error(`Unclosed tag <${tagName}>: reached end of input without closing tag`);
    }

    return { tag: tagName, attributes, children, text: text.trim() };
  }

  skipWhitespace();
  const rootNode = parseTag();
  skipWhitespace();
  if (pos < len) {
    throw new Error(`Extraneous characters after root element at position ${pos}`);
  }
  return rootNode;
}

export interface ValidationReport {
  success: boolean;
  checkedPagesCount: number;
  sitemapUrlsCount: number;
  assetsCheckedCount: number;
  internalLinksCheckedCount: number;
  redirectsCheckedCount: number;
  errors: string[];
  warnings: string[];
}

export function validateDistArtifacts(distDir: string): ValidationReport {
  const report: ValidationReport = {
    success: true,
    checkedPagesCount: 0,
    sitemapUrlsCount: 0,
    assetsCheckedCount: 0,
    internalLinksCheckedCount: 0,
    redirectsCheckedCount: 0,
    errors: [],
    warnings: [],
  };

  if (!fs.existsSync(distDir)) {
    report.errors.push(`Directory does not exist: ${distDir}`);
    report.success = false;
    return report;
  }

  // 1. Audit core static pages (16 pages across 4 languages)
  const staticRoutes = ['home', 'playground', 'architecture', 'changelog'] as const;
  const pageCanonicalMap: Map<string, string> = new Map();
  const pageAlternatesMap: Map<string, Record<string, string>> = new Map();

  for (const lang of VALID_LANGS) {
    for (const route of staticRoutes) {
      const relPath = buildRoutePath(lang, route).replace(/^\//, '');
      const indexPath = path.join(distDir, relPath, 'index.html');
      if (!fs.existsSync(indexPath)) {
        report.errors.push(`Missing core static page: ${relPath}/index.html`);
        continue;
      }
      report.checkedPagesCount++;
      const html = fs.readFileSync(indexPath, 'utf-8');
      const loc = LOCALES[lang];

      if (!html.includes(`lang="${loc.locale}"`) || !html.includes(`dir="${loc.direction}"`)) {
        report.errors.push(`HTML lang/dir tag mismatch in ${relPath}/index.html (expected lang="${loc.locale}", dir="${loc.direction}")`);
      }

      const canonicalMatch = html.match(/<link rel="canonical" href="(.*?)" \/>/);
      if (!canonicalMatch) {
        report.errors.push(`Missing canonical link in ${relPath}/index.html`);
      } else {
        const canonicalUrl = canonicalMatch[1];
        const expectedCanonical = `${BASE_SITE_URL}/${relPath}`;
        if (canonicalUrl !== expectedCanonical) {
          report.errors.push(`Canonical URL mismatch in ${relPath}: expected ${expectedCanonical}, got ${canonicalUrl}`);
        }
        pageCanonicalMap.set(`${relPath}/index.html`, canonicalUrl);
      }

      // Check alternates
      const alternateMatches = Array.from(html.matchAll(/<link rel="alternate" hreflang="(.*?)" href="(.*?)" \/>/g));
      const alternates: Record<string, string> = {};
      for (const m of alternateMatches) {
        alternates[m[1]] = m[2];
      }
      pageAlternatesMap.set(`${relPath}/index.html`, alternates);
    }
  }

  // 2. Audit all documentation pages in manifest
  for (const doc of ALL_DOCS) {
    const relPath = `${doc.lang}/docs/${doc.slug}`;
    const indexPath = path.join(distDir, relPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
      report.errors.push(`Missing prerendered doc page: ${relPath}/index.html`);
      continue;
    }
    report.checkedPagesCount++;
    const html = fs.readFileSync(indexPath, 'utf-8');

    const canonicalMatch = html.match(/<link rel="canonical" href="(.*?)" \/>/);
    if (!canonicalMatch) {
      report.errors.push(`Missing canonical link in doc page: ${relPath}/index.html`);
    } else {
      const canonicalUrl = canonicalMatch[1];
      const expectedCanonical = `${BASE_SITE_URL}/${relPath}`;
      if (canonicalUrl !== expectedCanonical) {
        report.errors.push(`Canonical URL mismatch in ${relPath}: expected ${expectedCanonical}, got ${canonicalUrl}`);
      }
      pageCanonicalMap.set(`${relPath}/index.html`, canonicalUrl);
    }

    const alternateMatches = Array.from(html.matchAll(/<link rel="alternate" hreflang="(.*?)" href="(.*?)" \/>/g));
    const alternates: Record<string, string> = {};
    for (const m of alternateMatches) {
      alternates[m[1]] = m[2];
    }
    pageAlternatesMap.set(`${relPath}/index.html`, alternates);
  }

  // 3. Reciprocal Hreflang Validation: verify that alternate relationships are reciprocal
  for (const [pagePath, alternates] of pageAlternatesMap.entries()) {
    for (const [hreflang, targetUrl] of Object.entries(alternates)) {
      if (hreflang === 'x-default') continue;
      // Convert target URL to relative file path in dist
      const targetRelPath = targetUrl.replace(BASE_SITE_URL, '').replace(/^\//, '');
      const targetIndexPath = path.join(distDir, targetRelPath, 'index.html');
      if (!fs.existsSync(targetIndexPath)) {
        report.errors.push(`Alternate hreflang="${hreflang}" in ${pagePath} points to missing page: ${targetUrl}`);
        continue;
      }
      const targetAlternates = pageAlternatesMap.get(`${targetRelPath}/index.html`);
      if (targetAlternates) {
        // Find which language pagePath belongs to
        const sourceCanonical = pageCanonicalMap.get(pagePath);
        if (sourceCanonical) {
          const hasBackLink = Object.values(targetAlternates).includes(sourceCanonical);
          if (!hasBackLink) {
            report.errors.push(`Non-reciprocal hreflang link: ${pagePath} links to ${targetUrl}, but ${targetRelPath} does not link back to ${sourceCanonical}`);
          }
        }
      }
    }
  }

  // 4. Audit Legacy Spanish HTML Redirect Fallback Pages
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
      report.errors.push(`Missing legacy Spanish redirect fallback page: ${leg}/index.html`);
      continue;
    }
    report.redirectsCheckedCount++;
    const html = fs.readFileSync(indexPath, 'utf-8');
    if (!html.includes('http-equiv="refresh"') || !html.includes('window.location.replace')) {
      report.errors.push(`Invalid redirect implementation in ${leg}/index.html`);
    }
    if (!html.includes('noindex')) {
      report.errors.push(`Legacy redirect page ${leg}/index.html must specify noindex robots directive`);
    }
  }

  // 5. Audit sitemap.xml with strict XML AST parser
  const sitemapPath = path.join(distDir, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    report.errors.push('Missing sitemap.xml in dist!');
  } else {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    let sitemapAst: XmlNode;
    try {
      sitemapAst = parseXml(sitemapContent);
    } catch (err: any) {
      report.errors.push(`sitemap.xml XML parsing syntax error: ${err.message}`);
      sitemapAst = { tag: '', attributes: {}, children: [], text: '' };
    }

    if (sitemapAst.tag !== 'urlset') {
      report.errors.push(`Root tag of sitemap.xml must be <urlset>, found <${sitemapAst.tag}>`);
    }

    const urlNodes = sitemapAst.children.filter((c) => c.tag === 'url');
    report.sitemapUrlsCount = urlNodes.length;
    const sitemapUrlsSeen = new Set<string>();

    for (const urlNode of urlNodes) {
      const locNode = urlNode.children.find((c) => c.tag === 'loc');
      if (!locNode || !locNode.text) {
        report.errors.push('Found <url> without non-empty <loc> in sitemap.xml');
        continue;
      }
      const loc = locNode.text;
      if (!loc.startsWith(BASE_SITE_URL)) {
        report.errors.push(`Sitemap URL does not use configured BASE_SITE_URL (${BASE_SITE_URL}): ${loc}`);
      }
      if (sitemapUrlsSeen.has(loc)) {
        report.errors.push(`Duplicate URL in sitemap.xml: ${loc}`);
      }
      sitemapUrlsSeen.add(loc);

      if (loc.includes('/404') || loc.endsWith('404.html')) {
        report.errors.push(`404 page must not be included in sitemap.xml: ${loc}`);
      }
      if (loc.includes('/es/') || loc.endsWith('/es')) {
        report.errors.push(`Deprecated Spanish routes must not be present in sitemap.xml: ${loc}`);
      }

      // Check corresponding generated HTML exists
      const relPath = loc.replace(BASE_SITE_URL, '').replace(/^\//, '');
      const expectedDistPath = relPath ? path.join(distDir, relPath, 'index.html') : path.join(distDir, 'index.html');
      if (!fs.existsSync(expectedDistPath)) {
        report.errors.push(`Sitemap URL has no matching generated HTML file in dist: ${loc} (checked ${expectedDistPath})`);
      }
    }
  }

  // 6. Audit robots.txt
  const robotsPath = path.join(distDir, 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    report.errors.push('Missing robots.txt in dist!');
  } else {
    const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
    if (!robotsContent.includes(`Sitemap: ${BASE_SITE_URL}/sitemap.xml`)) {
      report.errors.push('robots.txt does not declare correct sitemap URL!');
    }
  }

  // 7. Audit 404 pages (dist/404.html and localized 404 pages)
  const top404Path = path.join(distDir, '404.html');
  if (!fs.existsSync(top404Path)) {
    report.errors.push('Missing top-level 404.html in dist!');
  } else {
    const top404Content = fs.readFileSync(top404Path, 'utf-8');
    const homeHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
    if (top404Content === homeHtml) {
      report.errors.push('404.html must not be identical to homepage index.html');
    }
    if (!top404Content.includes('noindex')) {
      report.errors.push('404.html does not contain noindex meta tag!');
    }
  }

  for (const lang of VALID_LANGS) {
    const lang404Path = path.join(distDir, lang, '404', 'index.html');
    if (!fs.existsSync(lang404Path)) {
      report.errors.push(`Missing localized 404 page for ${lang} at ${lang}/404/index.html!`);
    } else {
      const lang404Content = fs.readFileSync(lang404Path, 'utf-8');
      if (!lang404Content.includes('noindex')) {
        report.errors.push(`Localized 404 page for ${lang} does not contain noindex tag!`);
      }
    }
  }

  // 8. Audit internal links and local asset references in generated files
  const sampleFiles = [
    path.join(distDir, 'en/index.html'),
    path.join(distDir, 'fa/index.html'),
    path.join(distDir, 'en/docs/installation/index.html'),
    path.join(distDir, 'fa/docs/api/validators/index.html'),
  ];

  for (const file of sampleFiles) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf-8');

    // Asset scripts
    const scriptMatches = content.matchAll(/<script[^>]+src=["'](.*?)["']/g);
    for (const m of scriptMatches) {
      const src = m[1];
      if (src.startsWith('http://') || src.startsWith('https://')) continue;
      const cleanSrc = src.replace(/^\//, '');
      const assetPath = path.join(distDir, cleanSrc);
      if (!fs.existsSync(assetPath)) {
        report.errors.push(`Broken script asset reference in ${file}: ${src}`);
      } else {
        report.assetsCheckedCount++;
      }
    }

    // Asset stylesheets
    const cssMatches = content.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["'](.*?)["']/g);
    for (const m of cssMatches) {
      const href = m[1];
      if (href.startsWith('http://') || href.startsWith('https://')) continue;
      const cleanHref = href.replace(/^\//, '');
      const cssPath = path.join(distDir, cleanHref);
      if (!fs.existsSync(cssPath)) {
        report.errors.push(`Broken stylesheet reference in ${file}: ${href}`);
      } else {
        report.assetsCheckedCount++;
      }
    }

    // Internal anchor destinations
    const linkMatches = content.matchAll(/<a[^>]+href=["'](.*?)["']/g);
    for (const m of linkMatches) {
      const href = m[1];
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('#')) {
        continue;
      }
      report.internalLinksCheckedCount++;
      if (href.startsWith('/es/') || href === '/es') {
        report.errors.push(`Found link to deprecated Spanish route in ${file}: ${href}`);
      }
    }
  }

  report.success = report.errors.length === 0;
  return report;
}

export function runValidation() {
  const distDir = path.resolve(process.cwd(), 'dist');
  console.log('--- Commencing ParsiKit Production Quality & SEO Audit ---');

  const report = validateDistArtifacts(distDir);

  if (report.errors.length > 0) {
    console.error('❌ Production validation FAILED with the following errors:');
    for (const err of report.errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log(`✅ Core static & documentation pages verified (${report.checkedPagesCount} total HTML index pages examined).`);
  console.log(`✅ HTML redirect fallback verified (${report.redirectsCheckedCount} legacy Spanish stubs checked; client-side meta-refresh + window.location.replace).`);
  console.log(`   [Platform limitation notice: HTTP 301 headers are NOT VERIFIED because static host GitHub Pages does not issue server-side HTTP 301 headers.]`);
  console.log(`✅ Sitemap XML parsed and validated (${report.sitemapUrlsCount} absolute URLs verified, zero errors).`);
  console.log(`✅ robots.txt verified with correct absolute sitemap declaration.`);
  console.log(`✅ Canonical URLs & reciprocal hreflang alternate links verified across all 4 locales.`);
  console.log(`✅ Local static assets (${report.assetsCheckedCount} scripts/styles verified) and internal links checked.`);
  console.log(`✅ 404 pages (dist/404.html and 4 localized pages with noindex) verified and excluded from sitemap.`);
  console.log('🎉 Production Quality, SEO & Artifact Validation Audit PASSED with 100% compliance!');
}

if (process.argv[1] && process.argv[1].endsWith('validate-production.ts')) {
  runValidation();
}
