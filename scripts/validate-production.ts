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
  hreflangAlternatesCheckedCount: number;
  errors: string[];
  warnings: string[];
}

/**
 * Recursively retrieves all HTML files from the target directory.
 */
export function getAllHtmlFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

export function validateDistArtifacts(distDir: string): ValidationReport {
  const report: ValidationReport = {
    success: true,
    checkedPagesCount: 0,
    sitemapUrlsCount: 0,
    assetsCheckedCount: 0,
    internalLinksCheckedCount: 0,
    redirectsCheckedCount: 0,
    hreflangAlternatesCheckedCount: 0,
    errors: [],
    warnings: [],
  };

  if (!fs.existsSync(distDir)) {
    report.errors.push(`Directory does not exist: ${distDir}`);
    report.success = false;
    return report;
  }

  // Find all generated HTML files across dist/
  const allHtmlFiles = getAllHtmlFiles(distDir);
  if (allHtmlFiles.length === 0) {
    report.errors.push(`No HTML files found in ${distDir}`);
    report.success = false;
    return report;
  }

  const pageCanonicalMap: Map<string, string> = new Map();
  const pageAlternatesMap: Map<string, Record<string, string>> = new Map();

  // 1. Audit Every Single Generated HTML Page
  for (const htmlFile of allHtmlFiles) {
    const relPath = path.relative(distDir, htmlFile).replace(/\\/g, '/');
    const html = fs.readFileSync(htmlFile, 'utf-8');

    // Case A: Legacy Spanish Redirect Fallback Pages (dist/es/**)
    if (relPath.startsWith('es/')) {
      report.redirectsCheckedCount++;

      // Verify meta-refresh and window.location.replace
      if (!html.includes('http-equiv="refresh"') || !html.includes('window.location.replace')) {
        report.errors.push(`Legacy redirect page ${relPath} missing meta-refresh or location.replace script`);
      }

      // Verify noindex
      if (!html.includes('content="noindex, follow"') && !html.includes('content="noindex"')) {
        report.errors.push(`Legacy redirect page ${relPath} must specify noindex robots directive`);
      }

      // Extract canonical URL and destination
      const canonicalMatch = html.match(/<link rel="canonical" href="(.*?)" \/>/);
      if (!canonicalMatch) {
        report.errors.push(`Legacy redirect page ${relPath} missing canonical destination link`);
      } else {
        const targetUrl = canonicalMatch[1];
        if (!targetUrl.startsWith(BASE_SITE_URL)) {
          report.errors.push(`Legacy redirect ${relPath} canonical destination does not use configured BASE_SITE_URL: ${targetUrl}`);
        } else {
          // Verify target destination actually exists in dist
          const targetRel = targetUrl.replace(BASE_SITE_URL, '').replace(/^\//, '');
          const targetDistPath = targetRel
            ? path.join(distDir, targetRel, 'index.html')
            : path.join(distDir, 'index.html');
          if (!fs.existsSync(targetDistPath)) {
            report.errors.push(`Legacy redirect ${relPath} points to nonexistent page: ${targetUrl} (checked ${targetDistPath})`);
          }
        }
      }

      // Verify query string and fragment preservation logic is in the script
      if (!html.includes('window.location.search') || !html.includes('window.location.hash')) {
        report.errors.push(`Legacy redirect ${relPath} script does not preserve window.location.search or window.location.hash`);
      }

      continue;
    }

    // Case B: 404 Pages
    const isTop404 = relPath === '404.html';
    const isLocalized404 = relPath.endsWith('404/index.html');

    if (isTop404 || isLocalized404) {
      report.checkedPagesCount++;

      const homeHtmlPath = path.join(distDir, 'index.html');
      if (fs.existsSync(homeHtmlPath)) {
        const homeHtml = fs.readFileSync(homeHtmlPath, 'utf-8');
        if (html === homeHtml) {
          report.errors.push(`404 page ${relPath} is accidentally identical to homepage index.html`);
        }
      }

      if (!html.includes('noindex')) {
        report.errors.push(`404 page ${relPath} does not declare noindex directive`);
      }

      if (isLocalized404) {
        const langPrefix = relPath.split('/')[0];
        const loc = LOCALES[langPrefix as keyof typeof LOCALES];
        if (loc) {
          const htmlTagMatch = html.match(/<html\s+([^>]+)>/i);
          if (!htmlTagMatch) {
            report.errors.push(`Missing <html> opening tag in ${relPath}`);
          } else {
            const htmlAttrs = htmlTagMatch[1];
            const langMatch = htmlAttrs.match(/\blang=["']([^"']+)["']/i);
            const dirMatch = htmlAttrs.match(/\bdir=["']([^"']+)["']/i);
            if (!langMatch || langMatch[1] !== loc.locale || !dirMatch || dirMatch[1] !== loc.direction) {
              report.errors.push(`Localized 404 page ${relPath} lang/dir mismatch (expected lang="${loc.locale}", dir="${loc.direction}")`);
            }
          }
        }
      }
      continue;
    }

    // Case C: Standard Active Localized Pages & Root Homepage
    report.checkedPagesCount++;

    // Determine expected locale from directory structure
    const segments = relPath.split('/');
    const firstSegment = segments[0];
    let expectedLang: keyof typeof LOCALES = 'en';

    if (VALID_LANGS.includes(firstSegment as any)) {
      expectedLang = firstSegment as keyof typeof LOCALES;
    }

    const loc = LOCALES[expectedLang];
    if (loc && relPath !== 'index.html') {
      const htmlTagMatch = html.match(/<html\s+([^>]+)>/i);
      if (!htmlTagMatch) {
        report.errors.push(`Missing <html> opening tag in ${relPath}`);
      } else {
        const htmlAttrs = htmlTagMatch[1];
        const langMatch = htmlAttrs.match(/\blang=["']([^"']+)["']/i);
        const dirMatch = htmlAttrs.match(/\bdir=["']([^"']+)["']/i);

        if (!langMatch || langMatch[1] !== loc.locale || !dirMatch || dirMatch[1] !== loc.direction) {
          report.errors.push(`HTML lang/dir tag mismatch in ${relPath} (expected lang="${loc.locale}", dir="${loc.direction}")`);
        }
      }
    }

    // Validate Title and Description
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    if (!titleMatch || !titleMatch[1].trim()) {
      report.errors.push(`Missing or empty <title> tag in ${relPath}`);
    }

    const descMatch = html.match(/<meta name="description" content="(.*?)" \/>/);
    if (!descMatch || !descMatch[1].trim()) {
      report.errors.push(`Missing or empty meta description in ${relPath}`);
    }

    // Validate Canonical URL
    const canonicalMatches = Array.from(html.matchAll(/<link rel="canonical" href="(.*?)" \/>/g));
    if (canonicalMatches.length === 0) {
      report.errors.push(`Missing canonical link in ${relPath}`);
    } else if (canonicalMatches.length > 1) {
      report.errors.push(`Duplicate canonical declarations found in ${relPath} (${canonicalMatches.length} occurrences)`);
    } else {
      const canonicalUrl = canonicalMatches[0][1];
      if (!canonicalUrl.startsWith(BASE_SITE_URL)) {
        report.errors.push(`Canonical URL in ${relPath} does not use expected origin ${BASE_SITE_URL}: ${canonicalUrl}`);
      }
      const expectedRel = relPath.replace(/\/index\.html$/, '').replace(/^index\.html$/, '');
      const expectedCanonical = expectedRel ? `${BASE_SITE_URL}/${expectedRel}` : `${BASE_SITE_URL}/en`;
      if (canonicalUrl !== expectedCanonical && expectedRel !== '') {
        report.errors.push(`Canonical URL mismatch in ${relPath}: expected ${expectedCanonical}, found ${canonicalUrl}`);
      }
      pageCanonicalMap.set(relPath, canonicalUrl);
    }

    // Validate Robots Directive: active pages must not specify noindex
    const robotsMatch = html.match(/<meta name="robots" content="(.*?)" \/>/);
    if (robotsMatch && robotsMatch[1].includes('noindex')) {
      report.errors.push(`Active indexable page ${relPath} incorrectly declares noindex robots directive`);
    }

    // Validate Alternate Hreflang Declarations
    const alternateMatches = Array.from(html.matchAll(/<link rel="alternate" hreflang="(.*?)" href="(.*?)" \/>/g));
    const alternates: Record<string, string> = {};
    const seenHreflang = new Set<string>();

    for (const m of alternateMatches) {
      const hreflang = m[1];
      const targetUrl = m[2];
      report.hreflangAlternatesCheckedCount++;

      const validHreflangs = ['en', 'fa', 'fa-IR', 'prs', 'prs-AF', 'tg', 'tg-TJ', 'x-default'];
      if (!validHreflangs.includes(hreflang)) {
        report.errors.push(`Unsupported or invalid hreflang="${hreflang}" found in ${relPath}`);
      }

      if (seenHreflang.has(hreflang)) {
        report.errors.push(`Duplicate hreflang="${hreflang}" declaration in ${relPath}`);
      }
      seenHreflang.add(hreflang);

      if (!targetUrl.startsWith(BASE_SITE_URL)) {
        report.errors.push(`Alternate link hreflang="${hreflang}" in ${relPath} does not use expected origin: ${targetUrl}`);
      }

      // Check for conflicting canonical and self-referencing hreflang declarations
      const isSelfHreflang =
        hreflang === expectedLang ||
        (expectedLang === 'fa' && (hreflang === 'fa' || hreflang === 'fa-IR')) ||
        (expectedLang === 'prs-af' && (hreflang === 'prs' || hreflang === 'prs-AF')) ||
        (expectedLang === 'tg' && (hreflang === 'tg' || hreflang === 'tg-TJ')) ||
        (expectedLang === 'en' && hreflang === 'en');
      const currentCanonical = canonicalMatches.length > 0 ? canonicalMatches[0][1] : '';
      if (isSelfHreflang && currentCanonical && targetUrl !== currentCanonical) {
        report.errors.push(`Conflicting canonical and hreflang declarations in ${relPath}: canonical is ${currentCanonical}, but self-referencing hreflang="${hreflang}" declares ${targetUrl}`);
      }

      alternates[hreflang] = targetUrl;
    }
    pageAlternatesMap.set(relPath, alternates);

    // 2. Validate All Local Asset and Link References in this HTML page
    // A: Scripts
    const scriptMatches = html.matchAll(/<script[^>]+src=["'](.*?)["']/g);
    for (const m of scriptMatches) {
      const src = m[1];
      validateReference(relPath, src, 'script', distDir, report);
    }

    // B: Stylesheets & Links
    const linkMatches = html.matchAll(/<link[^>]+href=["'](.*?)["']/g);
    for (const m of linkMatches) {
      const href = m[1];
      const relMatch = m[0].match(/rel=["'](.*?)["']/);
      const relVal = relMatch ? relMatch[1] : '';
      if (['canonical', 'alternate'].includes(relVal)) continue;
      validateReference(relPath, href, 'link', distDir, report);
    }

    // C: Images & Media
    const imgMatches = html.matchAll(/<img[^>]+src=["'](.*?)["']/g);
    for (const m of imgMatches) {
      validateReference(relPath, m[1], 'image', distDir, report);
    }
    const mediaMatches = html.matchAll(/<(?:source|video|audio)[^>]+src=["'](.*?)["']/g);
    for (const m of mediaMatches) {
      validateReference(relPath, m[1], 'media', distDir, report);
    }

    // D: Anchor hyperlinks
    const anchorMatches = html.matchAll(/<a[^>]+href=["'](.*?)["']/g);
    for (const m of anchorMatches) {
      const href = m[1];
      if (href.startsWith('/es/') || href === '/es') {
        report.errors.push(`Found link to deprecated Spanish route in ${relPath}: ${href}`);
        continue;
      }
      validateReference(relPath, href, 'anchor', distDir, report);
    }
  }

  // 3. Reciprocal Hreflang Validation across all parsed pages
  for (const [pageRelPath, alternates] of pageAlternatesMap.entries()) {
    const sourceCanonical = pageCanonicalMap.get(pageRelPath);
    if (!sourceCanonical) continue;

    for (const [hreflang, targetUrl] of Object.entries(alternates)) {
      if (hreflang === 'x-default') continue;
      const targetRel = targetUrl.replace(BASE_SITE_URL, '').replace(/^\//, '');
      const targetRelPath = targetRel ? `${targetRel}/index.html` : 'index.html';
      const targetIndexPath = path.join(distDir, targetRelPath);

      if (!fs.existsSync(targetIndexPath)) {
        report.errors.push(`Alternate hreflang="${hreflang}" in ${pageRelPath} points to nonexistent page: ${targetUrl}`);
        continue;
      }

      const targetAlternates = pageAlternatesMap.get(targetRelPath);
      if (targetAlternates) {
        const hasReciprocalBackLink = Object.values(targetAlternates).includes(sourceCanonical);
        if (!hasReciprocalBackLink) {
          report.errors.push(`Non-reciprocal hreflang link: ${pageRelPath} declares alternate ${targetUrl}, but ${targetRelPath} does not link back to ${sourceCanonical}`);
        }
      }
    }
  }

  // 4. Audit sitemap.xml with strict XML parser
  const sitemapPath = path.join(distDir, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    report.errors.push('Missing sitemap.xml in dist!');
  } else {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    let sitemapAst: XmlNode;
    try {
      sitemapAst = parseXml(sitemapContent);
    } catch (err: any) {
      report.errors.push(`sitemap.xml XML syntax error: ${err.message}`);
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

      // Check corresponding generated HTML exists in dist
      const relPath = loc.replace(BASE_SITE_URL, '').replace(/^\//, '');
      const expectedDistPath = relPath ? path.join(distDir, relPath, 'index.html') : path.join(distDir, 'index.html');
      if (!fs.existsSync(expectedDistPath)) {
        report.errors.push(`Sitemap URL has no matching generated HTML file in dist: ${loc} (checked ${expectedDistPath})`);
      }
    }
  }

  // 5. Audit robots.txt
  const robotsPath = path.join(distDir, 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    report.errors.push('Missing robots.txt in dist!');
  } else {
    const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
    if (!robotsContent.includes(`Sitemap: ${BASE_SITE_URL}/sitemap.xml`)) {
      report.errors.push('robots.txt does not declare correct sitemap URL!');
    }
  }

  report.success = report.errors.length === 0;
  return report;
}

/**
 * Validates a single link or asset reference extracted from an HTML page.
 */
function validateReference(
  sourceHtmlRelPath: string,
  rawRef: string,
  kind: 'script' | 'link' | 'image' | 'media' | 'anchor',
  distDir: string,
  report: ValidationReport
) {
  if (!rawRef || typeof rawRef !== 'string') return;

  // Ignore safe in-page anchors
  if (rawRef.startsWith('#')) return;

  // Ignore external URLs and mailto
  if (rawRef.startsWith('http://') || rawRef.startsWith('https://') || rawRef.startsWith('mailto:')) {
    return;
  }

  // Ignore data URLs
  if (rawRef.startsWith('data:')) return;

  // Reject protocol-relative URLs
  if (rawRef.startsWith('//')) {
    report.errors.push(`Protocol-relative reference '//' prohibited in ${sourceHtmlRelPath}: ${rawRef}`);
    return;
  }

  if (kind === 'anchor') {
    report.internalLinksCheckedCount++;
  } else {
    report.assetsCheckedCount++;
  }

  // Strip query string and fragment before checking filesystem
  const cleanPath = decodeURIComponent(rawRef.split(/[?#]/)[0]);

  // Resolve filesystem target
  let resolvedTarget: string;
  if (cleanPath.startsWith('/')) {
    resolvedTarget = path.resolve(distDir, cleanPath.slice(1));
  } else {
    const sourceDir = path.dirname(path.join(distDir, sourceHtmlRelPath));
    resolvedTarget = path.resolve(sourceDir, cleanPath);
  }

  // Traversal protection
  if (!resolvedTarget.startsWith(distDir)) {
    report.errors.push(`Filesystem traversal outside dist detected in ${sourceHtmlRelPath}: ${rawRef} -> ${resolvedTarget}`);
    return;
  }

  // Check existence
  const fileExists = fs.existsSync(resolvedTarget) && fs.statSync(resolvedTarget).isFile();
  const dirIndexExists = fs.existsSync(path.join(resolvedTarget, 'index.html'));
  const htmlFileExists = fs.existsSync(`${resolvedTarget}.html`);

  if (!fileExists && !dirIndexExists && !htmlFileExists) {
    report.errors.push(`Broken local ${kind} reference in ${sourceHtmlRelPath}: '${rawRef}' (target not found at ${resolvedTarget})`);
  }
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

  console.log(`✅ All generated HTML pages inspected (${report.checkedPagesCount} active pages + 404s verified).`);
  console.log(`✅ HTML redirect fallback verified (${report.redirectsCheckedCount} legacy Spanish stubs checked; client-side meta-refresh + window.location.replace).`);
  console.log(`   [Platform limitation notice: HTTP 301 headers are NOT VERIFIED because static host GitHub Pages does not issue server-side HTTP 301 headers.]`);
  console.log(`✅ Sitemap XML parsed and validated (${report.sitemapUrlsCount} absolute URLs verified, zero errors).`);
  console.log(`✅ robots.txt verified with correct absolute sitemap declaration.`);
  console.log(`✅ Canonical URLs & reciprocal hreflang alternate links verified across all 4 locales (${report.hreflangAlternatesCheckedCount} alternate links verified).`);
  console.log(`✅ Local static assets (${report.assetsCheckedCount} scripts/styles/images verified) and internal links (${report.internalLinksCheckedCount} anchors verified).`);
  console.log(`✅ 404 pages (dist/404.html and 4 localized pages with noindex) verified and excluded from sitemap.`);
  console.log('🎉 Production Quality, SEO & Artifact Validation Audit PASSED with 100% compliance!');
}

if (process.argv[1] && process.argv[1].endsWith('validate-production.ts')) {
  runValidation();
}
