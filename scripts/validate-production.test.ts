import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { parseXml, validateDistArtifacts } from './validate-production';
import { getVerifiedSiteUrl } from '../src/config/site';

const TEST_VERIFIED_ORIGIN = 'https://verified.example.org';

/**
 * Creates a minimal valid dist/ fixture directory structure.
 * Clean, passes all validation checks with zero errors under TEST_VERIFIED_ORIGIN.
 */
function createBaseValidDist(dir: string, origin: string = TEST_VERIFIED_ORIGIN) {
  // Directories
  fs.mkdirSync(path.join(dir, 'en'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'fa'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'en/404'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'fa/404'), { recursive: true });

  // Root index.html
  const rootHtml = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <title>ParsiKit — Persian Data Infrastructure</title>
  <meta name="description" content="Official website and documentation for ParsiKit" />
  <link rel="canonical" href="${origin}/en" />
  <link rel="alternate" hreflang="en" href="${origin}/en" />
  <link rel="alternate" hreflang="fa" href="${origin}/fa" />
</head>
<body><h1>ParsiKit</h1></body>
</html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), rootHtml);

  // en/index.html
  const enHtml = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <title>ParsiKit — Persian Data Infrastructure</title>
  <meta name="description" content="Official website and documentation for ParsiKit" />
  <link rel="canonical" href="${origin}/en" />
  <link rel="alternate" hreflang="en" href="${origin}/en" />
  <link rel="alternate" hreflang="fa" href="${origin}/fa" />
</head>
<body><h1>English Documentation</h1></body>
</html>`;
  fs.writeFileSync(path.join(dir, 'en/index.html'), enHtml);

  // fa/index.html
  const faHtml = `<!DOCTYPE html>
<html lang="fa-IR" dir="rtl">
<head>
  <title>پارسی‌کیت — زیرساخت داده‌های فارسی</title>
  <meta name="description" content="مستندات و وبگاه رسمی پارسی‌کیت" />
  <link rel="canonical" href="${origin}/fa" />
  <link rel="alternate" hreflang="en" href="${origin}/en" />
  <link rel="alternate" hreflang="fa" href="${origin}/fa" />
</head>
<body><h1>مستندات فارسی</h1></body>
</html>`;
  fs.writeFileSync(path.join(dir, 'fa/index.html'), faHtml);

  // 404.html
  const top404Html = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <title>Page Not Found — ParsiKit</title>
  <meta name="robots" content="noindex, follow" />
</head>
<body><h1>404 Not Found</h1></body>
</html>`;
  fs.writeFileSync(path.join(dir, '404.html'), top404Html);

  // en/404/index.html
  const en404Html = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <title>Page Not Found</title>
  <meta name="robots" content="noindex, follow" />
</head>
<body><h1>404</h1></body>
</html>`;
  fs.writeFileSync(path.join(dir, 'en/404/index.html'), en404Html);

  // fa/404/index.html
  const fa404Html = `<!DOCTYPE html>
<html lang="fa-IR" dir="rtl">
<head>
  <title>صفحه یافت نشد</title>
  <meta name="robots" content="noindex, follow" />
</head>
<body><h1>۴۰۴</h1></body>
</html>`;
  fs.writeFileSync(path.join(dir, 'fa/404/index.html'), fa404Html);

  // robots.txt
  const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${origin}/sitemap.xml
`;
  fs.writeFileSync(path.join(dir, 'robots.txt'), robotsTxt);

  // sitemap.xml
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/en</loc>
  </url>
  <url>
    <loc>${origin}/fa</loc>
  </url>
</urlset>`;
  fs.writeFileSync(path.join(dir, 'sitemap.xml'), sitemapXml);

  // site.webmanifest
  const manifest = {
    name: 'ParsiKit — Persian Data Infrastructure',
    short_name: 'ParsiKit',
    icons: [],
  };
  fs.writeFileSync(path.join(dir, 'site.webmanifest'), JSON.stringify(manifest));
}

// ==========================================
// Unit tests for strict XML parser
// ==========================================

test('validator XML parser: parses valid XML sitemap correctly', () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${TEST_VERIFIED_ORIGIN}/en</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${TEST_VERIFIED_ORIGIN}/en"/>
    <xhtml:link rel="alternate" hreflang="fa" href="${TEST_VERIFIED_ORIGIN}/fa"/>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

  const ast = parseXml(xml);
  assert.equal(ast.tag, 'urlset');
  assert.equal(ast.children.length, 1);
  const urlNode = ast.children[0];
  assert.equal(urlNode.tag, 'url');
  const locNode = urlNode.children.find((c) => c.tag === 'loc');
  assert.ok(locNode);
  assert.equal(locNode.text, `${TEST_VERIFIED_ORIGIN}/en`);
  const links = urlNode.children.filter((c) => c.tag === 'xhtml:link');
  assert.equal(links.length, 2);
  assert.equal(links[0].attributes.hreflang, 'en');
  assert.equal(links[1].attributes.hreflang, 'fa');
});

test('validator XML parser: rejects malformed XML fixtures', () => {
  // 1. Mismatched closing tag
  assert.throws(
    () => parseXml(`<urlset><url><loc>${TEST_VERIFIED_ORIGIN}/en</wrong></url></urlset>`),
    /Mismatched closing tag/
  );

  // 2. Unclosed tag
  assert.throws(
    () => parseXml(`<urlset><url><loc>${TEST_VERIFIED_ORIGIN}/en</loc></url>`),
    /Unclosed tag|Mismatched closing tag/
  );

  // 3. Unquoted attribute
  assert.throws(
    () => parseXml(`<link rel=alternate href="${TEST_VERIFIED_ORIGIN}" />`),
    /Expected quote around attribute value/
  );
});

// ==========================================
// Integration tests for validateDistArtifacts
// ==========================================

// Baseline: valid dist passes with zero errors
test('validator scenario 0: clean base dist fixture passes validation', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc0-'));
  try {
    createBaseValidDist(tmpDir);
    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, true);
    assert.equal(report.errors.length, 0);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 1: Broken local script tag
test('validator scenario 1: detects broken local script src', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc1-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('</body>', '<script src="/assets/nonexistent-bundle.js"></script></body>');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Broken local script reference in en/index.html')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 2: Broken stylesheet link
test('validator scenario 2: detects broken stylesheet link href', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc2-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('</head>', '<link rel="stylesheet" href="/assets/missing-style.css" /></head>');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Broken local link reference in en/index.html')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 3: Broken image src
test('validator scenario 3: detects broken image src', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc3-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('</body>', '<img src="/images/nonexistent-screenshot.png" alt="Test" /></body>');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Broken local image reference in en/index.html')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 4: Broken anchor href pointing to nonexistent local route
test('validator scenario 4: detects broken internal anchor href', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc4-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('</body>', '<a href="/en/docs/nonexistent-guide">Invalid Link</a></body>');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Broken local anchor reference in en/index.html')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 5: Protocol-relative URLs (//)
test('validator scenario 5: rejects protocol-relative URL references', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc5-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('</body>', '<script src="//cdn.example.com/analytics.js"></script></body>');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes("Protocol-relative reference '//' prohibited in en/index.html")));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 6: Broken font preload
test('validator scenario 6: detects broken font preload link', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc6-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('</head>', '<link rel="preload" href="/fonts/MissingFont.woff2" as="font" /></head>');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Broken local link reference in en/index.html')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 7: Broken favicon declaration
test('validator scenario 7: detects broken favicon link href', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc7-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('</head>', '<link rel="icon" href="/favicon-missing.ico" /></head>');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Broken local link reference in en/index.html')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 8: Broken open graph / twitter social image
test('validator scenario 8: rejects relative or invalid og:image URL in production', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc8-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('</head>', '<meta property="og:image" content="http://insecure-cdn.com/logo.png" /></head>');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('og:image in en/index.html must be an absolute HTTPS URL')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 9: Missing <title> tag
test('validator scenario 9: detects missing or empty <title> tag', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc9-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace(/<title>.*?<\/title>/, '<title>   </title>');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Missing or empty <title> tag in en/index.html')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 10: Missing meta description
test('validator scenario 10: detects missing meta description tag', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc10-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace(/<meta name="description".*?\/>/, '');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Missing or empty meta description in en/index.html')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 11: Missing or duplicate canonical declaration
test('validator scenario 11: detects missing or duplicate canonical link declarations', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc11-'));
  try {
    createBaseValidDist(tmpDir);
    // Duplicate canonical
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('</head>', `  <link rel="canonical" href="${TEST_VERIFIED_ORIGIN}/en" />\n</head>`);
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Duplicate canonical declarations found in en/index.html')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 12: Active page declaring noindex
test('validator scenario 12: detects active page incorrectly declaring noindex', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc12-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('</head>', '  <meta name="robots" content="noindex, nofollow" />\n</head>');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Active indexable page en/index.html incorrectly declares noindex robots directive')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 13: Filesystem traversal link
test('validator scenario 13: detects filesystem traversal attempt in reference', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc13-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('</body>', '<a href="../../etc/passwd">Leak</a></body>');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Filesystem traversal outside dist detected in en/index.html')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 14: Malformed sitemap XML
test('validator scenario 14: detects malformed sitemap XML syntax', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc14-'));
  try {
    createBaseValidDist(tmpDir);
    fs.writeFileSync(path.join(tmpDir, 'sitemap.xml'), `<urlset><url><loc>${TEST_VERIFIED_ORIGIN}/en</url>`);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('sitemap.xml XML syntax error:')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 15: Duplicate sitemap URLs
test('validator scenario 15: detects duplicate loc entries in sitemap.xml', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc15-'));
  try {
    createBaseValidDist(tmpDir);
    const dupSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${TEST_VERIFIED_ORIGIN}/en</loc></url>
  <url><loc>${TEST_VERIFIED_ORIGIN}/en</loc></url>
</urlset>`;
    fs.writeFileSync(path.join(tmpDir, 'sitemap.xml'), dupSitemap);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes(`Duplicate URL in sitemap.xml: ${TEST_VERIFIED_ORIGIN}/en`)));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 16: Sitemap URL pointing to a nonexistent page
test('validator scenario 16: detects sitemap URL without matching generated HTML in dist', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc16-'));
  try {
    createBaseValidDist(tmpDir);
    const badSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${TEST_VERIFIED_ORIGIN}/en</loc></url>
  <url><loc>${TEST_VERIFIED_ORIGIN}/en/nonexistent-feature-xyz</loc></url>
</urlset>`;
    fs.writeFileSync(path.join(tmpDir, 'sitemap.xml'), badSitemap);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes(`Sitemap URL has no matching generated HTML file in dist: ${TEST_VERIFIED_ORIGIN}/en/nonexistent-feature-xyz`)));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 17: Sitemap URL using an unexpected origin
test('validator scenario 17: rejects sitemap URL using unexpected origin', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc17-'));
  try {
    createBaseValidDist(tmpDir);
    const badSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://external-origin.com/en</loc></url>
</urlset>`;
    fs.writeFileSync(path.join(tmpDir, 'sitemap.xml'), badSitemap);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes(`Sitemap URL does not use verified origin (${TEST_VERIFIED_ORIGIN}): https://external-origin.com/en`)));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 18: Unsupported hreflang locale
test('validator scenario 18: rejects unsupported or invalid hreflang code', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc18-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('</head>', `  <link rel="alternate" hreflang="de" href="${TEST_VERIFIED_ORIGIN}/de" />\n</head>`);
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Unsupported or invalid hreflang="de" found in en/index.html')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 19: Non-reciprocal hreflang links
test('validator scenario 19: detects non-reciprocal hreflang link declaration', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc19-'));
  try {
    createBaseValidDist(tmpDir);
    // fa/index.html removes alternate to en
    const faHtmlBroken = `<!DOCTYPE html>
<html lang="fa-IR" dir="rtl">
<head>
  <title>پارسی‌کیت</title>
  <meta name="description" content="تست" />
  <link rel="canonical" href="${TEST_VERIFIED_ORIGIN}/fa" />
  <link rel="alternate" hreflang="fa" href="${TEST_VERIFIED_ORIGIN}/fa" />
</head>
<body><h1>مستندات فارسی</h1></body>
</html>`;
    fs.writeFileSync(path.join(tmpDir, 'fa/index.html'), faHtmlBroken);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes(`Non-reciprocal hreflang link: en/index.html declares alternate ${TEST_VERIFIED_ORIGIN}/fa`)));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 20: Dead-end alternate links pointing to 404
test('validator scenario 20: rejects alternate hreflang link pointing to nonexistent page', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc20-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('</head>', `  <link rel="alternate" hreflang="fa" href="${TEST_VERIFIED_ORIGIN}/fa/missing-doc" />\n</head>`);
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes(`points to nonexistent page: ${TEST_VERIFIED_ORIGIN}/fa/missing-doc`)));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 21: Conflicting canonical and self-referencing hreflang
test('validator scenario 21: rejects conflicting canonical and self-referencing hreflang URL', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc21-'));
  try {
    createBaseValidDist(tmpDir);
    const conflictingHtml = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <title>ParsiKit</title>
  <meta name="description" content="Test" />
  <link rel="canonical" href="${TEST_VERIFIED_ORIGIN}/en" />
  <link rel="alternate" hreflang="en" href="${TEST_VERIFIED_ORIGIN}/en-us-conflicting" />
</head>
<body><h1>Conflict</h1></body>
</html>`;
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), conflictingHtml);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Conflicting canonical and hreflang declarations in en/index.html')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 22: Localized 404 page missing noindex or having wrong lang/dir
test('validator scenario 22: rejects localized 404 page missing noindex or having wrong lang/dir', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc22-'));
  try {
    createBaseValidDist(tmpDir);
    // fa 404 without noindex and wrong dir
    const badFa404 = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head><title>404</title></head>
<body><h1>404</h1></body>
</html>`;
    fs.writeFileSync(path.join(tmpDir, 'fa/404/index.html'), badFa404);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('404 page fa/404/index.html does not declare noindex directive')));
    assert.ok(report.errors.some((e) => e.includes('Localized 404 page fa/404/index.html lang/dir mismatch')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 23: Invalid or nonexistent legacy redirect destination
test('validator scenario 23: detects invalid or nonexistent legacy redirect destination', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc23-'));
  try {
    createBaseValidDist(tmpDir);
    fs.mkdirSync(path.join(tmpDir, 'es/docs/quickstart'), { recursive: true });
    const badRedirectHtml = `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0; url=${TEST_VERIFIED_ORIGIN}/en/docs/quickstart" />
  <link rel="canonical" href="${TEST_VERIFIED_ORIGIN}/en/docs/quickstart" />
  <meta name="robots" content="noindex, follow" />
  <script>
    var target = "${TEST_VERIFIED_ORIGIN}/en/docs/quickstart";
    var search = window.location.search || "";
    var hash = window.location.hash || "";
    window.location.replace(target + search + hash);
  </script>
</head>
<body>Redirecting...</body>
</html>`;
    fs.writeFileSync(path.join(tmpDir, 'es/docs/quickstart/index.html'), badRedirectHtml);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes(`Legacy redirect es/docs/quickstart/index.html points to nonexistent page: ${TEST_VERIFIED_ORIGIN}/en/docs/quickstart`)));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 24: A valid page not included in previously hard-coded sample
test('validator scenario 24: dynamically discovers and audits deep pages without hardcoded route lists', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc24-'));
  try {
    createBaseValidDist(tmpDir);

    fs.mkdirSync(path.join(tmpDir, 'en/tutorials/advanced-security'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, 'fa/tutorials/advanced-security'), { recursive: true });

    const enTutorialHtml = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <title>Advanced Security Tutorial — ParsiKit</title>
  <meta name="description" content="In-depth guide to cryptographic data handling with ParsiKit" />
  <link rel="canonical" href="${TEST_VERIFIED_ORIGIN}/en/tutorials/advanced-security" />
  <link rel="alternate" hreflang="en" href="${TEST_VERIFIED_ORIGIN}/en/tutorials/advanced-security" />
  <link rel="alternate" hreflang="fa" href="${TEST_VERIFIED_ORIGIN}/fa/tutorials/advanced-security" />
</head>
<body>
  <h1>Security Tutorial</h1>
  <a href="/en">Return to Home</a>
</body>
</html>`;
    fs.writeFileSync(path.join(tmpDir, 'en/tutorials/advanced-security/index.html'), enTutorialHtml);

    const faTutorialHtml = `<!DOCTYPE html>
<html lang="fa-IR" dir="rtl">
<head>
  <title>آموزش پیشرفته امنیت — پارسی‌کیت</title>
  <meta name="description" content="راهنمای جامع امنیت داده‌ها در پارسی‌کیت" />
  <link rel="canonical" href="${TEST_VERIFIED_ORIGIN}/fa/tutorials/advanced-security" />
  <link rel="alternate" hreflang="en" href="${TEST_VERIFIED_ORIGIN}/en/tutorials/advanced-security" />
  <link rel="alternate" hreflang="fa" href="${TEST_VERIFIED_ORIGIN}/fa/tutorials/advanced-security" />
</head>
<body>
  <h1>آموزش امنیت</h1>
  <a href="/fa">بازگشت به خانه</a>
</body>
</html>`;
    fs.writeFileSync(path.join(tmpDir, 'fa/tutorials/advanced-security/index.html'), faTutorialHtml);

    // Update sitemap to include both new valid pages
    const updatedSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${TEST_VERIFIED_ORIGIN}/en</loc></url>
  <url><loc>${TEST_VERIFIED_ORIGIN}/fa</loc></url>
  <url><loc>${TEST_VERIFIED_ORIGIN}/en/tutorials/advanced-security</loc></url>
  <url><loc>${TEST_VERIFIED_ORIGIN}/fa/tutorials/advanced-security</loc></url>
</urlset>`;
    fs.writeFileSync(path.join(tmpDir, 'sitemap.xml'), updatedSitemap);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, true);
    assert.equal(report.errors.length, 0);
    assert.ok(report.checkedPagesCount >= 5);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 25: Duplicate JSON-LD blocks in HTML
test('validator scenario 25: detects duplicate JSON-LD structured data blocks', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc25-'));
  try {
    createBaseValidDist(tmpDir);
    const dupJsonLdHtml = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <title>ParsiKit — Test</title>
  <meta name="description" content="Test" />
  <link rel="canonical" href="${TEST_VERIFIED_ORIGIN}/en" />
  <link rel="alternate" hreflang="en" href="${TEST_VERIFIED_ORIGIN}/en" />
  <link rel="alternate" hreflang="fa" href="${TEST_VERIFIED_ORIGIN}/fa" />
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite"}</script>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"SoftwareApplication"}</script>
</head>
<body><h1>Test</h1></body>
</html>`;
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), dupJsonLdHtml);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Duplicate JSON-LD structured data blocks found in en/index.html')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 26: Non-canonical URL in sitemap.xml
test('validator scenario 26: detects non-canonical URL in sitemap.xml', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc26-'));
  try {
    createBaseValidDist(tmpDir);
    // Add a non-canonical root entry whose page points to /en
    const sitemapWithNonCanonical = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${TEST_VERIFIED_ORIGIN}/</loc></url>
  <url><loc>${TEST_VERIFIED_ORIGIN}/en</loc></url>
  <url><loc>${TEST_VERIFIED_ORIGIN}/fa</loc></url>
</urlset>`;
    fs.writeFileSync(path.join(tmpDir, 'sitemap.xml'), sitemapWithNonCanonical);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes(`Non-canonical URL in sitemap.xml: ${TEST_VERIFIED_ORIGIN}/ points to page whose canonical is declared as ${TEST_VERIFIED_ORIGIN}/en`)));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 27: Web manifest name or short_name empty
test('validator scenario 27: detects empty name in site.webmanifest', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc27-'));
  try {
    createBaseValidDist(tmpDir);
    fs.writeFileSync(path.join(tmpDir, 'site.webmanifest'), JSON.stringify({ name: '', short_name: '' }));

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('site.webmanifest name must be non-empty')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 28: Web manifest icon missing from dist
test('validator scenario 28: detects missing icon declared in site.webmanifest', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc28-'));
  try {
    createBaseValidDist(tmpDir);
    fs.writeFileSync(
      path.join(tmpDir, 'site.webmanifest'),
      JSON.stringify({
        name: 'ParsiKit',
        short_name: 'ParsiKit',
        icons: [{ src: '/missing-icon-999.png', sizes: '192x192' }],
      })
    );

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('site.webmanifest icon not found in dist: /missing-icon-999.png')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 29: Rejects unauthorized domain parsikit.dev found anywhere in generated artifacts
test('validator scenario 29: rejects unauthorized domain parsikit.dev in any generated artifact', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc29-'));
  try {
    createBaseValidDist(tmpDir);
    // Inject unauthorized origin into en/index.html
    const contaminatedHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('</head>', '<meta property="og:url" content="https://parsikit.dev/en" /></head>');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), contaminatedHtml);

    const report = validateDistArtifacts(tmpDir, { siteUrl: TEST_VERIFIED_ORIGIN });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes("Unauthorized domain 'parsikit.dev' found in generated artifact")));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 30: Production validation clearly reports missing origin when required
test('validator scenario 30: reports actionable error when requireVerifiedOrigin is true but no origin is configured', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc30-'));
  try {
    createBaseValidDist(tmpDir, '');
    const report = validateDistArtifacts(tmpDir, { requireVerifiedOrigin: true, siteUrl: undefined });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Missing verified production origin: A verified production base URL')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 31: Local development build passes without needing a fake production domain
test('validator scenario 31: local development dist without domain passes local validation', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc31-'));
  try {
    // Directories
    fs.mkdirSync(path.join(tmpDir, 'en'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, 'fa'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, 'en/404'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, 'fa/404'), { recursive: true });

    // Local build HTML has no absolute canonicals or fake domains
    const localHtml = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <title>ParsiKit — Persian Data Infrastructure</title>
  <meta name="description" content="Official website" />
</head>
<body><h1>ParsiKit</h1></body>
</html>`;
    fs.writeFileSync(path.join(tmpDir, 'index.html'), localHtml);
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), localHtml);

    const localFaHtml = `<!DOCTYPE html>
<html lang="fa-IR" dir="rtl">
<head>
  <title>پارسی‌کیت</title>
  <meta name="description" content="مستندات" />
</head>
<body><h1>پارسی‌کیت</h1></body>
</html>`;
    fs.writeFileSync(path.join(tmpDir, 'fa/index.html'), localFaHtml);

    const top404Html = `<!DOCTYPE html><html lang="en" dir="ltr"><head><title>404</title><meta name="robots" content="noindex" /></head><body>404</body></html>`;
    fs.writeFileSync(path.join(tmpDir, '404.html'), top404Html);
    fs.writeFileSync(path.join(tmpDir, 'en/404/index.html'), top404Html);
    const fa404 = `<!DOCTYPE html><html lang="fa-IR" dir="rtl"><head><title>404</title><meta name="robots" content="noindex" /></head><body>404</body></html>`;
    fs.writeFileSync(path.join(tmpDir, 'fa/404/index.html'), fa404);

    fs.writeFileSync(path.join(tmpDir, 'robots.txt'), 'User-agent: *\nAllow: /\n');
    fs.writeFileSync(path.join(tmpDir, 'site.webmanifest'), JSON.stringify({ name: 'ParsiKit', short_name: 'ParsiKit' }));

    const report = validateDistArtifacts(tmpDir, { requireVerifiedOrigin: false, siteUrl: undefined });
    assert.equal(report.success, true);
    assert.equal(report.errors.length, 0);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 32: Detects unverified sitemap in local build
test('validator scenario 32: rejects sitemap.xml in local build when origin is not configured', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc32-'));
  try {
    createBaseValidDist(tmpDir);
    // When no origin is configured, having a sitemap.xml in dist is an error
    const report = validateDistArtifacts(tmpDir, { requireVerifiedOrigin: false, siteUrl: undefined });
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('sitemap.xml must not be published without a verified production origin configured')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 33: getVerifiedSiteUrl rejects parsikit.dev, localhost, and preview URLs
test('validator scenario 33: getVerifiedSiteUrl rejects unverified and temporary URLs', () => {
  // Test rejection logic
  const originalEnv = process.env.SITE_URL;
  try {
    process.env.SITE_URL = 'https://parsikit.dev';
    assert.equal(getVerifiedSiteUrl(), undefined);

    process.env.SITE_URL = 'http://localhost:3000';
    assert.equal(getVerifiedSiteUrl(), undefined);

    process.env.SITE_URL = 'https://preview-123.run.app';
    assert.equal(getVerifiedSiteUrl(), undefined);

    process.env.SITE_URL = 'https://github.com/MRThugh/ParsiKit';
    assert.equal(getVerifiedSiteUrl(), undefined);

    process.env.SITE_URL = 'https://my-real-custom-domain.org';
    assert.equal(getVerifiedSiteUrl(), 'https://my-real-custom-domain.org');
  } finally {
    process.env.SITE_URL = originalEnv;
  }
});
