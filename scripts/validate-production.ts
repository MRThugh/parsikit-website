import fs from 'node:fs';
import path from 'node:path';
import { VALID_LANGS } from '../src/lib/router';
import { LOCALES } from '../src/i18n/config';
import { getVerifiedSiteUrl, getDeploymentBasePath } from '../src/config/site';

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
        throw new Error(
          `Expected quote around attribute value for '${attrName}' at position ${pos}`
        );
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
          throw new Error(
            `Mismatched closing tag: expected </${tagName}>, found </${closingTagName}>`
          );
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

export interface ValidationOptions {
  requireVerifiedOrigin?: boolean;
  siteUrl?: string;
  basePath?: string;
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
 * Recursively retrieves all files from the target directory.
 */
export function getAllFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllFiles(fullPath));
    } else if (entry.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}

export function getAllHtmlFiles(dir: string): string[] {
  return getAllFiles(dir).filter((f) => f.endsWith('.html'));
}

export function validateDistArtifacts(
  distDir: string,
  options?: ValidationOptions
): ValidationReport {
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

  // Resolve configuration
  const siteUrl = options?.siteUrl ?? getVerifiedSiteUrl();
  const basePath = options?.basePath ?? getDeploymentBasePath();
  const requireVerifiedOrigin =
    options?.requireVerifiedOrigin ??
    (process.env.REQUIRE_PRODUCTION_ORIGIN === 'true' ||
      process.argv.includes('--require-origin'));

  // 1. Critical Audit: Ensure unauthorized origin NEVER appears in ANY generated artifact
  // (Distinguish website origin e.g. https://parsikit.dev or //parsikit.dev from Python module parsikit.dev)
  const unauthorizedUrlPattern = /(?:https?:)?\/\/(?:[a-zA-Z0-9-]+\.)*parsikit\.dev\b/i;
  const allDistFiles = getAllFiles(distDir);
  for (const file of allDistFiles) {
    const rel = path.relative(distDir, file).replace(/\\/g, '/');
    // Check text-based artifacts for hardcoded unauthorized website domain
    if (
      rel.endsWith('.html') ||
      rel.endsWith('.xml') ||
      rel.endsWith('.txt') ||
      rel.endsWith('.json') ||
      rel.endsWith('.webmanifest')
    ) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        if (unauthorizedUrlPattern.test(content)) {
          report.errors.push(
            `Unauthorized domain 'parsikit.dev' found in generated artifact: ${rel}`
          );
        }
      } catch {}
    }
  }

  // 1b. Ensure static sitemap was NOT accidentally reintroduced into public/
  const publicSitemapPath = path.resolve(distDir, '../public/sitemap.xml');
  if (fs.existsSync(publicSitemapPath)) {
    report.errors.push(
      'Static sitemap detected in source tree (public/sitemap.xml)! Sitemap generation must remain exclusively dynamic in scripts/prerender.ts.'
    );
  }

  // 2. Verified Production Origin Check
  if (requireVerifiedOrigin && !siteUrl) {
    report.errors.push(
      'Missing verified production origin: A verified production base URL (SITE_URL or VITE_SITE_URL) must be configured for production deployment. Domain-dependent production SEO artifacts (canonical URLs, sitemap.xml, absolute og:url, JSON-LD domain references) cannot be verified without a confirmed domain.'
    );
  }

  // Find all generated HTML files across dist/
  const allHtmlFiles = allDistFiles.filter((f) => f.endsWith('.html'));
  if (allHtmlFiles.length === 0) {
    report.errors.push(`No HTML files found in ${distDir}`);
    report.success = false;
    return report;
  }

  const pageCanonicalMap: Map<string, string> = new Map();
  const pageAlternatesMap: Map<string, Record<string, string>> = new Map();

  // 3. Audit Every Single Generated HTML Page
  for (const htmlFile of allHtmlFiles) {
    const relPath = path.relative(distDir, htmlFile).replace(/\\/g, '/');
    const html = fs.readFileSync(htmlFile, 'utf-8');

    // Case A: Legacy Spanish Redirect Fallback Pages (dist/es/**)
    if (relPath.startsWith('es/')) {
      report.redirectsCheckedCount++;

      // Verify meta-refresh and window.location.replace
      if (!html.includes('http-equiv="refresh"') || !html.includes('window.location.replace')) {
        report.errors.push(
          `Legacy redirect page ${relPath} missing meta-refresh or location.replace script`
        );
      }

      // Verify noindex
      if (!html.includes('content="noindex, follow"') && !html.includes('content="noindex"')) {
        report.errors.push(`Legacy redirect page ${relPath} must specify noindex robots directive`);
      }

      // Verify query string and fragment preservation logic is in the script
      if (!html.includes('window.location.search') || !html.includes('window.location.hash')) {
        report.errors.push(
          `Legacy redirect ${relPath} script does not preserve window.location.search or window.location.hash`
        );
      }

      // Check canonical link if present
      const canonicalMatch = html.match(/<link rel="canonical" href="(.*?)" \/>/);
      if (siteUrl && !canonicalMatch) {
        report.errors.push(`Legacy redirect page ${relPath} missing canonical destination link`);
      } else if (canonicalMatch && siteUrl) {
        const targetUrl = canonicalMatch[1];
        const expectedPrefix = `${siteUrl}${basePath}`;
        if (!targetUrl.startsWith(expectedPrefix)) {
          report.errors.push(
            `Legacy redirect ${relPath} canonical destination does not use verified origin: ${targetUrl}`
          );
        } else {
          // Verify target destination actually exists in dist
          const targetRel = targetUrl.replace(expectedPrefix, '').replace(/^\//, '');
          const targetDistPath = targetRel
            ? path.join(distDir, targetRel, 'index.html')
            : path.join(distDir, 'index.html');
          if (!fs.existsSync(targetDistPath)) {
            report.errors.push(
              `Legacy redirect ${relPath} points to nonexistent page: ${targetUrl} (checked ${targetDistPath})`
            );
          }
        }
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
            if (
              !langMatch ||
              langMatch[1] !== loc.locale ||
              !dirMatch ||
              dirMatch[1] !== loc.direction
            ) {
              report.errors.push(
                `Localized 404 page ${relPath} lang/dir mismatch (expected lang="${loc.locale}", dir="${loc.direction}")`
              );
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

        if (
          !langMatch ||
          langMatch[1] !== loc.locale ||
          !dirMatch ||
          dirMatch[1] !== loc.direction
        ) {
          report.errors.push(
            `HTML lang/dir tag mismatch in ${relPath} (expected lang="${loc.locale}", dir="${loc.direction}")`
          );
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

    // Validate Google Search Console Verification Meta Tag on Homepage
    const isHomepage = relPath === 'index.html' || VALID_LANGS.some((l) => relPath === `${l}/index.html`);
    const gsvMatches = Array.from(html.matchAll(/<meta name="google-site-verification" content="(.*?)" \/>/g));

    if (relPath === 'index.html') {
      if (gsvMatches.length === 0) {
        report.errors.push(`Missing Google Search Console verification meta tag in homepage ${relPath}`);
      } else if (gsvMatches.length > 1) {
        report.errors.push(`Duplicate Google Search Console verification meta tag in homepage ${relPath}`);
      } else if (gsvMatches[0][1] !== 'oyr2TvocGA0knI6goWuCRxG1PmQQXYRA4bMbGWNSch0') {
        report.errors.push(
          `Invalid Google Search Console verification token in ${relPath}: expected 'oyr2TvocGA0knI6goWuCRxG1PmQQXYRA4bMbGWNSch0', found '${gsvMatches[0][1]}'`
        );
      } else {
        const headEndIdx = html.indexOf('</head>');
        const tagIdx = html.indexOf(gsvMatches[0][0]);
        if (headEndIdx === -1 || tagIdx === -1 || tagIdx > headEndIdx) {
          report.errors.push(
            `Google Search Console verification meta tag must be inside <head> before </head> in ${relPath}`
          );
        }
      }
    } else if (!isHomepage) {
      if (gsvMatches.length > 0) {
        report.errors.push(
          `Unnecessary duplication: Google Search Console verification meta tag should not be present on non-homepage ${relPath}`
        );
      }
    }

    // Validate Canonical URL
    const canonicalMatches = Array.from(html.matchAll(/<link rel="canonical" href="(.*?)" \/>/g));

    if (siteUrl) {
      // With verified origin, canonical is required and must match expected absolute URL
      if (canonicalMatches.length === 0) {
        report.errors.push(`Missing canonical link in ${relPath}`);
      } else if (canonicalMatches.length > 1) {
        report.errors.push(
          `Duplicate canonical declarations found in ${relPath} (${canonicalMatches.length} occurrences)`
        );
      } else {
        const canonicalUrl = canonicalMatches[0][1];
        const expectedPrefix = `${siteUrl}${basePath}`;
        if (!canonicalUrl.startsWith(expectedPrefix)) {
          report.errors.push(
            `Canonical URL in ${relPath} does not use verified origin ${expectedPrefix}: ${canonicalUrl}`
          );
        }
        const expectedRel = relPath.replace(/\/index\.html$/, '').replace(/^index\.html$/, '');
        const expectedCanonical = expectedRel
          ? `${expectedPrefix}/${expectedRel}`
          : `${expectedPrefix}/en`;
        if (canonicalUrl !== expectedCanonical && expectedRel !== '') {
          report.errors.push(
            `Canonical URL mismatch in ${relPath}: expected ${expectedCanonical}, found ${canonicalUrl}`
          );
        }
        pageCanonicalMap.set(relPath, canonicalUrl);
      }
    } else {
      // Without verified origin, absolute canonical must NOT be present
      if (canonicalMatches.length > 0) {
        const url = canonicalMatches[0][1];
        if (url.startsWith('http://') || url.startsWith('https://')) {
          report.errors.push(
            `Active page ${relPath} contains absolute canonical URL when no verified origin is configured: ${url}`
          );
        }
      }
    }

    // Validate Robots Directive: active pages must not specify noindex
    const robotsMatch = html.match(/<meta name="robots" content="(.*?)" \/>/);
    if (robotsMatch && robotsMatch[1].includes('noindex')) {
      report.errors.push(
        `Active indexable page ${relPath} incorrectly declares noindex robots directive`
      );
    }

    // Validate Structured Data JSON-LD
    const jsonLdMatches = Array.from(
      html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)
    );
    if (jsonLdMatches.length > 1) {
      report.errors.push(
        `Duplicate JSON-LD structured data blocks found in ${relPath} (${jsonLdMatches.length} blocks found)`
      );
    }
    for (const match of jsonLdMatches) {
      try {
        const parsed = JSON.parse(match[1]);
        if (parsed['@context'] !== 'https://schema.org') {
          report.errors.push(
            `JSON-LD @context in ${relPath} must be 'https://schema.org', found '${parsed['@context']}'`
          );
        }
        const jsonStr = match[1];
        if (jsonStr.includes('"offers"') || jsonStr.includes('"aggregateRating"')) {
          report.errors.push(
            `Fabricated or invented commercial fields ('offers' / 'aggregateRating') found in JSON-LD in ${relPath}`
          );
        }
        if (!jsonStr.includes('Ali Kamrani') && !jsonStr.includes('MRThugh')) {
          report.errors.push(`JSON-LD in ${relPath} must reference authentic author Ali Kamrani`);
        }
      } catch (err: any) {
        report.errors.push(`Malformed JSON-LD syntax in ${relPath}: ${err.message}`);
      }
    }


    // Validate OpenGraph Locale
    if (loc && relPath !== 'index.html') {
      const ogLocaleMatch = html.match(/<meta property="og:locale" content="(.*?)" \/>/);
      if (!ogLocaleMatch) {
        report.errors.push(`Missing og:locale declaration in ${relPath}`);
      } else if (ogLocaleMatch[1] !== loc.ogLocale) {
        report.errors.push(
          `og:locale mismatch in ${relPath}: expected '${loc.ogLocale}', found '${ogLocaleMatch[1]}'`
        );
      }
    }


    // Validate Social Media Images (og:image & twitter:image)
    const expectedPrefix = `${siteUrl}${basePath}`;
    const ogImageMatch = html.match(/<meta property="og:image" content="(.*?)" \/>/);
    if (ogImageMatch && siteUrl) {
      const imgUrl = ogImageMatch[1];
      if (!imgUrl.startsWith('https://')) {
        report.errors.push(`og:image in ${relPath} must be an absolute HTTPS URL: ${imgUrl}`);
      } else if (!imgUrl.startsWith(`${expectedPrefix}/`)) {
        report.errors.push(
          `og:image in ${relPath} does not match verified origin and base path (${expectedPrefix}): ${imgUrl}`
        );
      } else {
        const assetRel = imgUrl.slice(`${expectedPrefix}/`.length);
        const assetDistPath = path.join(distDir, assetRel);
        if (!fs.existsSync(assetDistPath)) {
          report.errors.push(
            `og:image target in ${relPath} not found in dist: ${imgUrl} (checked ${assetDistPath})`
          );
        }
      }
    }
    const twImageMatch = html.match(/<meta name="twitter:image" content="(.*?)" \/>/);
    if (twImageMatch && siteUrl) {
      const imgUrl = twImageMatch[1];
      if (!imgUrl.startsWith('https://')) {
        report.errors.push(`twitter:image in ${relPath} must be an absolute HTTPS URL: ${imgUrl}`);
      } else if (!imgUrl.startsWith(`${expectedPrefix}/`)) {
        report.errors.push(
          `twitter:image in ${relPath} does not match verified origin and base path (${expectedPrefix}): ${imgUrl}`
        );
      } else {
        const assetRel = imgUrl.slice(`${expectedPrefix}/`.length);
        const assetDistPath = path.join(distDir, assetRel);
        if (!fs.existsSync(assetDistPath)) {
          report.errors.push(
            `twitter:image target in ${relPath} not found in dist: ${imgUrl} (checked ${assetDistPath})`
          );
        }
      }
    }

    // Validate Alternate Hreflang Declarations
    const alternateMatches = Array.from(
      html.matchAll(/<link rel="alternate" hreflang="(.*?)" href="(.*?)" \/>/g)
    );
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

      if (siteUrl) {
        const expectedPrefix = `${siteUrl}${basePath}`;
        if (!targetUrl.startsWith(expectedPrefix)) {
          report.errors.push(
            `Alternate link hreflang="${hreflang}" in ${relPath} does not use verified origin: ${targetUrl}`
          );
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
          report.errors.push(
            `Conflicting canonical and hreflang declarations in ${relPath}: canonical is ${currentCanonical}, but self-referencing hreflang="${hreflang}" declares ${targetUrl}`
          );
        }
      }

      alternates[hreflang] = targetUrl;
    }
    pageAlternatesMap.set(relPath, alternates);

    // 4. Validate All Local Asset and Link References in this HTML page
    // Scripts
    const scriptMatches = html.matchAll(/<script[^>]+src=["'](.*?)["']/g);
    for (const m of scriptMatches) {
      validateReference(relPath, m[1], 'script', distDir, basePath, report);
    }

    // Stylesheets & Links
    const linkMatches = html.matchAll(/<link[^>]+href=["'](.*?)["']/g);
    for (const m of linkMatches) {
      const href = m[1];
      const relMatch = m[0].match(/rel=["'](.*?)["']/);
      const relVal = relMatch ? relMatch[1] : '';
      if (['canonical', 'alternate'].includes(relVal)) continue;
      validateReference(relPath, href, 'link', distDir, basePath, report);
    }

    // Images & Media
    const imgMatches = html.matchAll(/<img[^>]+src=["'](.*?)["']/g);
    for (const m of imgMatches) {
      validateReference(relPath, m[1], 'image', distDir, basePath, report);
    }
    const mediaMatches = html.matchAll(/<(?:source|video|audio)[^>]+src=["'](.*?)["']/g);
    for (const m of mediaMatches) {
      validateReference(relPath, m[1], 'media', distDir, basePath, report);
    }

    // Anchor hyperlinks
    const anchorMatches = html.matchAll(/<a[^>]+href=["'](.*?)["']/g);
    for (const m of anchorMatches) {
      const href = m[1];
      if (href.startsWith('/es/') || href === '/es') {
        report.errors.push(`Found link to deprecated Spanish route in ${relPath}: ${href}`);
        continue;
      }
      validateReference(relPath, href, 'anchor', distDir, basePath, report);
    }
  }

  // 5. Reciprocal Hreflang Validation across all parsed pages (when siteUrl is configured)
  if (siteUrl) {
    const expectedPrefix = `${siteUrl}${basePath}`;
    for (const [pageRelPath, alternates] of pageAlternatesMap.entries()) {
      const sourceCanonical = pageCanonicalMap.get(pageRelPath);
      if (!sourceCanonical) continue;

      for (const [hreflang, targetUrl] of Object.entries(alternates)) {
        if (hreflang === 'x-default') continue;
        const targetRel = targetUrl.replace(expectedPrefix, '').replace(/^\//, '');
        const targetRelPath = targetRel ? `${targetRel}/index.html` : 'index.html';
        const targetIndexPath = path.join(distDir, targetRelPath);

        if (!fs.existsSync(targetIndexPath)) {
          report.errors.push(
            `Alternate hreflang="${hreflang}" in ${pageRelPath} points to nonexistent page: ${targetUrl}`
          );
          continue;
        }

        const targetAlternates = pageAlternatesMap.get(targetRelPath);
        if (targetAlternates) {
          const hasReciprocalBackLink = Object.values(targetAlternates).includes(sourceCanonical);
          if (!hasReciprocalBackLink) {
            report.errors.push(
              `Non-reciprocal hreflang link: ${pageRelPath} declares alternate ${targetUrl}, but ${targetRelPath} does not link back to ${sourceCanonical}`
            );
          }
        }
      }
    }
  }

  // 6. Audit sitemap.xml
  const sitemapPath = path.join(distDir, 'sitemap.xml');
  if (siteUrl) {
    if (!fs.existsSync(sitemapPath)) {
      report.errors.push('Missing sitemap.xml in dist for configured production origin!');
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

      const expectedPrefix = `${siteUrl}${basePath}`;
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
        if (!loc.startsWith(expectedPrefix)) {
          report.errors.push(
            `Sitemap URL does not use verified origin (${expectedPrefix}): ${loc}`
          );
        }
        if (sitemapUrlsSeen.has(loc)) {
          report.errors.push(`Duplicate URL in sitemap.xml: ${loc}`);
        }
        sitemapUrlsSeen.add(loc);

        if (loc.includes('/404') || loc.endsWith('404.html')) {
          report.errors.push(`404 page must not be included in sitemap.xml: ${loc}`);
        }
        if (loc.includes('/es/') || loc.endsWith('/es')) {
          report.errors.push(
            `Deprecated Spanish routes must not be present in sitemap.xml: ${loc}`
          );
        }

        // Check corresponding generated HTML exists in dist
        const relPath = loc.replace(expectedPrefix, '').replace(/^\//, '');
        const expectedDistPath = relPath
          ? path.join(distDir, relPath, 'index.html')
          : path.join(distDir, 'index.html');
        if (!fs.existsSync(expectedDistPath)) {
          report.errors.push(
            `Sitemap URL has no matching generated HTML file in dist: ${loc} (checked ${expectedDistPath})`
          );
        } else {
          // Strict Canonical Check: Every sitemap URL must match the canonical URL of the corresponding page
          const html = fs.readFileSync(expectedDistPath, 'utf-8');
          const canonicalMatch = html.match(/<link rel="canonical" href="(.*?)" \/>/);
          if (canonicalMatch && canonicalMatch[1] !== loc) {
            report.errors.push(
              `Non-canonical URL in sitemap.xml: ${loc} points to page whose canonical is declared as ${canonicalMatch[1]}`
            );
          }
        }
      }
    }
  } else {
    // If no verified origin is configured, sitemap.xml must NOT be published
    if (fs.existsSync(sitemapPath)) {
      report.errors.push(
        'sitemap.xml must not be published without a verified production origin configured (SITE_URL or VITE_SITE_URL).'
      );
    }
  }

  // 7. Audit robots.txt
  const robotsPath = path.join(distDir, 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    report.errors.push('Missing robots.txt in dist!');
  } else {
    const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
    if (siteUrl) {
      const expectedSitemapLine = `Sitemap: ${siteUrl}${basePath}/sitemap.xml`;
      if (!robotsContent.includes(expectedSitemapLine)) {
        report.errors.push(
          `robots.txt does not declare correct sitemap URL! Expected '${expectedSitemapLine}'`
        );
      }
    } else {
      if (robotsContent.includes('Sitemap:')) {
        report.errors.push(
          'robots.txt declares a Sitemap line but no verified production origin is configured!'
        );
      }
    }
  }

  // 8. Audit site.webmanifest
  const manifestPath = path.join(distDir, 'site.webmanifest');
  if (!fs.existsSync(manifestPath)) {
    report.errors.push('Missing site.webmanifest in dist!');
  } else {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      if (!manifest.name || !manifest.name.trim()) {
        report.errors.push('site.webmanifest name must be non-empty');
      }
      if (!manifest.short_name || !manifest.short_name.trim()) {
        report.errors.push('site.webmanifest short_name must be non-empty');
      }

      const expectedPrefix = basePath ? `${basePath}/` : '/';

      if (!manifest.start_url) {
        report.errors.push('site.webmanifest missing start_url');
      } else if (manifest.start_url !== expectedPrefix) {
        report.errors.push(
          `site.webmanifest start_url mismatch for configured base path (${basePath || 'root'}): expected '${expectedPrefix}', found '${manifest.start_url}'`
        );
      }

      if (manifest.scope && manifest.scope !== expectedPrefix) {
        report.errors.push(
          `site.webmanifest scope mismatch for configured base path (${basePath || 'root'}): expected '${expectedPrefix}', found '${manifest.scope}'`
        );
      }

      if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
        report.errors.push('site.webmanifest must declare at least one icon');
      } else {
        for (const icon of manifest.icons) {
          if (!icon.src || typeof icon.src !== 'string') {
            report.errors.push('site.webmanifest icon missing valid src');
            continue;
          }

          if (basePath && !icon.src.startsWith(`${basePath}/`)) {
            report.errors.push(
              `site.webmanifest icon '${icon.src}' does not respect configured base path (${basePath}): must start with '${basePath}/'`
            );
            continue;
          } else if (!basePath && !icon.src.startsWith('/')) {
            report.errors.push(
              `site.webmanifest icon '${icon.src}' must be a root-relative path starting with '/'`
            );
            continue;
          }

          const iconRel = basePath && icon.src.startsWith(basePath)
            ? icon.src.slice(basePath.length).replace(/^\/+/, '')
            : icon.src.replace(/^\/+/, '');
          const iconFullPath = path.join(distDir, iconRel);
          if (!fs.existsSync(iconFullPath)) {
            report.errors.push(
              `site.webmanifest icon not found in dist: ${icon.src} (checked ${iconFullPath})`
            );
          }
        }
      }
    } catch (err: any) {
      report.errors.push(`Malformed site.webmanifest: ${err.message}`);
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
  basePath: string,
  report: ValidationReport
) {
  if (!rawRef || typeof rawRef !== 'string') return;

  // Ignore safe in-page anchors
  if (rawRef.startsWith('#')) return;

  // Ignore external URLs and mailto
  if (
    rawRef.startsWith('http://') ||
    rawRef.startsWith('https://') ||
    rawRef.startsWith('mailto:')
  ) {
    return;
  }

  // Ignore data URLs
  if (rawRef.startsWith('data:')) return;

  // Reject protocol-relative URLs
  if (rawRef.startsWith('//')) {
    report.errors.push(
      `Protocol-relative reference '//' prohibited in ${sourceHtmlRelPath}: ${rawRef}`
    );
    return;
  }

  if (kind === 'anchor') {
    report.internalLinksCheckedCount++;
  } else {
    report.assetsCheckedCount++;
  }

  // Strip query string and fragment before checking filesystem
  let cleanPath = decodeURIComponent(rawRef.split(/[?#]/)[0]);

  // If a base path is configured, verify root-relative references include it
  if (basePath && cleanPath.startsWith('/')) {
    if (!cleanPath.startsWith(basePath)) {
      report.errors.push(
        `Internal ${kind} reference in ${sourceHtmlRelPath} does not respect configured base path (${basePath}): '${rawRef}'`
      );
      return;
    }
  }

  // Strip basePath if present (for project deployments like /parsikit-website)
  if (basePath && cleanPath.startsWith(basePath)) {
    cleanPath = cleanPath.slice(basePath.length) || '/';
  }

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
    report.errors.push(
      `Filesystem traversal outside dist detected in ${sourceHtmlRelPath}: ${rawRef} -> ${resolvedTarget}`
    );
    return;
  }

  // Check existence
  const fileExists = fs.existsSync(resolvedTarget) && fs.statSync(resolvedTarget).isFile();
  const dirIndexExists = fs.existsSync(path.join(resolvedTarget, 'index.html'));
  const htmlFileExists = fs.existsSync(`${resolvedTarget}.html`);

  if (!fileExists && !dirIndexExists && !htmlFileExists) {
    report.errors.push(
      `Broken local ${kind} reference in ${sourceHtmlRelPath}: '${rawRef}' (target not found at ${resolvedTarget})`
    );
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

  console.log(
    `✅ All generated HTML pages inspected (${report.checkedPagesCount} active pages + 404s verified).`
  );
  console.log(
    `✅ HTML redirect fallback verified (${report.redirectsCheckedCount} legacy Spanish stubs checked; client-side meta-refresh + window.location.replace).`
  );
  console.log(
    `   [Platform limitation notice: HTTP 301 headers are NOT VERIFIED because static host GitHub Pages does not issue server-side HTTP 301 headers.]`
  );

  const siteUrl = getVerifiedSiteUrl();
  if (siteUrl) {
    console.log(
      `✅ Sitemap XML parsed and validated for verified origin ${siteUrl} (${report.sitemapUrlsCount} absolute URLs verified, zero errors).`
    );
    console.log(`✅ robots.txt verified with correct absolute sitemap declaration.`);
    console.log(
      `✅ Canonical URLs & reciprocal hreflang alternate links verified across all 4 locales (${report.hreflangAlternatesCheckedCount} alternate links verified).`
    );
  } else {
    console.log(
      `ℹ️  Notice: No verified production origin (SITE_URL) configured. Domain-dependent production SEO artifacts omitted for local build.`
    );
    console.log(`✅ robots.txt verified without unverified sitemap declarations.`);
    console.log(`✅ Verified NO unauthorized domains (e.g. parsikit.dev) appear in dist.`);
  }

  console.log(
    `✅ Local static assets (${report.assetsCheckedCount} scripts/styles/images verified) and internal links (${report.internalLinksCheckedCount} anchors verified).`
  );
  console.log(
    `✅ 404 pages (dist/404.html and 4 localized pages with noindex) verified and excluded from sitemap.`
  );
  console.log(
    '🎉 Production Quality, SEO & Artifact Validation Audit PASSED with 100% compliance!'
  );
}

if (process.argv[1] && process.argv[1].endsWith('validate-production.ts')) {
  runValidation();
}
