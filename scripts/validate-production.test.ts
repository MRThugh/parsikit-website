import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { parseXml, validateDistArtifacts } from './validate-production';
import { BASE_SITE_URL } from '../src/lib/seo';

/**
 * Creates a minimal valid dist/ fixture directory structure.
 * Clean, passes all validation checks with zero errors.
 */
function createBaseValidDist(dir: string) {
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
  <link rel="canonical" href="${BASE_SITE_URL}/en" />
  <link rel="alternate" hreflang="en" href="${BASE_SITE_URL}/en" />
  <link rel="alternate" hreflang="fa" href="${BASE_SITE_URL}/fa" />
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
  <link rel="canonical" href="${BASE_SITE_URL}/en" />
  <link rel="alternate" hreflang="en" href="${BASE_SITE_URL}/en" />
  <link rel="alternate" hreflang="fa" href="${BASE_SITE_URL}/fa" />
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
  <link rel="canonical" href="${BASE_SITE_URL}/fa" />
  <link rel="alternate" hreflang="en" href="${BASE_SITE_URL}/en" />
  <link rel="alternate" hreflang="fa" href="${BASE_SITE_URL}/fa" />
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
Sitemap: ${BASE_SITE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(dir, 'robots.txt'), robotsTxt);

  // sitemap.xml
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_SITE_URL}/en</loc>
  </url>
  <url>
    <loc>${BASE_SITE_URL}/fa</loc>
  </url>
</urlset>`;
  fs.writeFileSync(path.join(dir, 'sitemap.xml'), sitemapXml);
}

// ==========================================
// Unit tests for strict XML parser
// ==========================================

test('validator XML parser: parses valid XML sitemap correctly', () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://parsikit.dev/en</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://parsikit.dev/en"/>
    <xhtml:link rel="alternate" hreflang="fa" href="https://parsikit.dev/fa"/>
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
  assert.equal(locNode.text, 'https://parsikit.dev/en');
  const links = urlNode.children.filter((c) => c.tag === 'xhtml:link');
  assert.equal(links.length, 2);
  assert.equal(links[0].attributes.hreflang, 'en');
  assert.equal(links[1].attributes.hreflang, 'fa');
});

test('validator XML parser: rejects malformed XML fixtures', () => {
  // 1. Mismatched closing tag
  assert.throws(
    () => parseXml('<urlset><url><loc>https://parsikit.dev/en</wrong></url></urlset>'),
    /Mismatched closing tag/
  );

  // 2. Unclosed tag
  assert.throws(
    () => parseXml('<urlset><url><loc>https://parsikit.dev/en</loc></url>'),
    /Unclosed tag|Mismatched closing tag/
  );

  // 3. Unquoted attribute
  assert.throws(
    () => parseXml('<link rel=alternate href="https://parsikit.dev" />'),
    /Expected quote around attribute value/
  );
});

// ==========================================
// Production Validator 24 Specific Scenarios
// ==========================================

// Scenario 1: Valid localized HTML
test('validator scenario 1: valid localized HTML passes with zero errors', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc1-'));
  try {
    createBaseValidDist(tmpDir);
    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, true);
    assert.equal(report.errors.length, 0);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 2: Incorrect lang
test('validator scenario 2: rejects incorrect lang attribute', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc2-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('lang="en"', 'lang="fa-IR"');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('HTML lang/dir tag mismatch in en/index.html')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 3: Incorrect dir
test('validator scenario 3: rejects incorrect dir attribute', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc3-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'fa/index.html'), 'utf-8')
      .replace('dir="rtl"', 'dir="ltr"');
    fs.writeFileSync(path.join(tmpDir, 'fa/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('HTML lang/dir tag mismatch in fa/index.html')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 4: Missing canonical
test('validator scenario 4: rejects page with missing canonical link', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc4-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace(/<link rel="canonical"[^>]*\/>/, '');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Missing canonical link in en/index.html')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 5: Incorrect canonical
test('validator scenario 5: rejects incorrect canonical URL path or origin', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc5-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace(`${BASE_SITE_URL}/en`, `${BASE_SITE_URL}/wrong-route`);
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Canonical URL mismatch in en/index.html')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 6: Duplicate canonical declarations
test('validator scenario 6: rejects duplicate canonical declarations', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc6-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('</head>', `  <link rel="canonical" href="${BASE_SITE_URL}/en" />\n</head>`);
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Duplicate canonical declarations found in en/index.html')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 7: Missing local JavaScript
test('validator scenario 7: rejects broken local script src reference', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc7-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('</body>', '<script src="/assets/nonexistent-bundle.js"></script></body>');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes("Broken local script reference in en/index.html: '/assets/nonexistent-bundle.js'")));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 8: Missing stylesheet
test('validator scenario 8: rejects broken local stylesheet link reference', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc8-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('</head>', '<link rel="stylesheet" href="/assets/missing-theme.css" /></head>');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes("Broken local link reference in en/index.html: '/assets/missing-theme.css'")));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 9: Missing image
test('validator scenario 9: rejects broken local image src reference', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc9-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('</body>', '<img src="/assets/missing-diagram.png" alt="Diagram" /></body>');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes("Broken local image reference in en/index.html: '/assets/missing-diagram.png'")));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 10: Broken internal documentation link
test('validator scenario 10: rejects broken internal anchor href link', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc10-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('</body>', '<a href="/en/docs/nonexistent-feature">Read Doc</a></body>');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes("Broken local anchor reference in en/index.html: '/en/docs/nonexistent-feature'")));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 11: Internal link containing query string and fragment
test('validator scenario 11: resolves internal link containing query and fragment when target exists', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc11-'));
  try {
    createBaseValidDist(tmpDir);
    // Link points to existing en/index.html with query and fragment
    const htmlWithQuery = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('</body>', '<a href="/en?version=3.3.1#quickstart">Version Info</a></body>');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), htmlWithQuery);

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, true);
    assert.equal(report.errors.length, 0);

    // Now test broken link with query and fragment
    const htmlWithBrokenQuery = htmlWithQuery
      .replace('/en?version=3.3.1#quickstart', '/en/missing?tab=1#sec');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), htmlWithBrokenQuery);

    const badReport = validateDistArtifacts(tmpDir);
    assert.equal(badReport.success, false);
    assert.ok(badReport.errors.some((e) => e.includes("Broken local anchor reference in en/index.html: '/en/missing?tab=1#sec'")));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 12: Encoded paths
test('validator scenario 12: correctly decodes URL-encoded paths (%20) and validates existence', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc12-'));
  try {
    createBaseValidDist(tmpDir);
    // Create directory with space in name
    fs.mkdirSync(path.join(tmpDir, 'assets/special path'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, 'assets/special path/data.json'), '{}');

    // Link using URL-encoded %20
    const html = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('</body>', '<a href="/assets/special%20path/data.json">Data</a></body>');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), html);

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, true);

    // Missing encoded path should fail
    const badHtml = html.replace('data.json', 'missing%20file.json');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);
    const badReport = validateDistArtifacts(tmpDir);
    assert.equal(badReport.success, false);
    assert.ok(badReport.errors.some((e) => e.includes('Broken local anchor reference')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 13: Filesystem traversal attempts
test('validator scenario 13: rejects references attempting path traversal outside dist', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc13-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace('</body>', '<a href="../../etc/passwd">Leak</a></body>');
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir);
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
    fs.writeFileSync(path.join(tmpDir, 'sitemap.xml'), '<urlset><url><loc>https://parsikit.dev/en</url>');

    const report = validateDistArtifacts(tmpDir);
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
  <url><loc>${BASE_SITE_URL}/en</loc></url>
  <url><loc>${BASE_SITE_URL}/en</loc></url>
</urlset>`;
    fs.writeFileSync(path.join(tmpDir, 'sitemap.xml'), dupSitemap);

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes(`Duplicate URL in sitemap.xml: ${BASE_SITE_URL}/en`)));
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
  <url><loc>${BASE_SITE_URL}/en</loc></url>
  <url><loc>${BASE_SITE_URL}/en/nonexistent-feature-xyz</loc></url>
</urlset>`;
    fs.writeFileSync(path.join(tmpDir, 'sitemap.xml'), badSitemap);

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Sitemap URL has no matching generated HTML file in dist: https://parsikit.dev/en/nonexistent-feature-xyz')));
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

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes(`Sitemap URL does not use configured BASE_SITE_URL (${BASE_SITE_URL}): https://external-origin.com/en`)));
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
      .replace('</head>', `  <link rel="alternate" hreflang="de" href="${BASE_SITE_URL}/de" />\n</head>`);
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir);
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
    // fa/index.html loses alternate link back to en
    const faHtmlNoEn = fs.readFileSync(path.join(tmpDir, 'fa/index.html'), 'utf-8')
      .replace(`<link rel="alternate" hreflang="en" href="${BASE_SITE_URL}/en" />`, '');
    fs.writeFileSync(path.join(tmpDir, 'fa/index.html'), faHtmlNoEn);

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Non-reciprocal hreflang link: en/index.html declares alternate https://parsikit.dev/fa')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 20: Hreflang pointing to a nonexistent page
test('validator scenario 20: rejects hreflang pointing to a nonexistent HTML target', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc20-'));
  try {
    createBaseValidDist(tmpDir);
    const badHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace(`href="${BASE_SITE_URL}/fa"`, `href="${BASE_SITE_URL}/fa/missing-doc"`);
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), badHtml);

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('points to nonexistent page: https://parsikit.dev/fa/missing-doc')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 21: Conflicting canonical and hreflang declarations
test('validator scenario 21: rejects conflicting canonical and self-referencing hreflang URL', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc21-'));
  try {
    createBaseValidDist(tmpDir);
    // en/index.html has canonical /en, but self hreflang="en" points to /en/conflict
    const conflictHtml = fs.readFileSync(path.join(tmpDir, 'en/index.html'), 'utf-8')
      .replace(`<link rel="alternate" hreflang="en" href="${BASE_SITE_URL}/en" />`, `<link rel="alternate" hreflang="en" href="${BASE_SITE_URL}/en/conflict" />`);
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), conflictHtml);

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Conflicting canonical and hreflang declarations in en/index.html')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 22: Invalid localized 404 page (missing noindex or wrong lang)
test('validator scenario 22: rejects localized 404 page missing noindex or having wrong lang/dir', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc22-'));
  try {
    createBaseValidDist(tmpDir);
    // Test missing noindex
    const noIndex404 = fs.readFileSync(path.join(tmpDir, 'fa/404/index.html'), 'utf-8')
      .replace('<meta name="robots" content="noindex, follow" />', '');
    fs.writeFileSync(path.join(tmpDir, 'fa/404/index.html'), noIndex404);

    let report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('404 page fa/404/index.html does not declare noindex directive')));

    // Test wrong lang/dir
    const wrongLang404 = noIndex404
      .replace('<head>', '<head><meta name="robots" content="noindex" />')
      .replace('lang="fa-IR" dir="rtl"', 'lang="en" dir="ltr"');
    fs.writeFileSync(path.join(tmpDir, 'fa/404/index.html'), wrongLang404);

    report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Localized 404 page fa/404/index.html lang/dir mismatch')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 23: Invalid legacy redirect destination
test('validator scenario 23: detects invalid or nonexistent legacy redirect destination', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc23-'));
  try {
    createBaseValidDist(tmpDir);
    fs.mkdirSync(path.join(tmpDir, 'es/docs/quickstart'), { recursive: true });

    // Legacy redirect points to nonexistent target en/docs/quickstart
    const legacyRedirectHtml = `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0; url=${BASE_SITE_URL}/en/docs/quickstart" />
  <meta name="robots" content="noindex, follow" />
  <link rel="canonical" href="${BASE_SITE_URL}/en/docs/quickstart" />
  <script>
    window.location.replace('${BASE_SITE_URL}/en/docs/quickstart' + window.location.search + window.location.hash);
  </script>
</head>
<body>Redirecting...</body>
</html>`;
    fs.writeFileSync(path.join(tmpDir, 'es/docs/quickstart/index.html'), legacyRedirectHtml);

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Legacy redirect es/docs/quickstart/index.html points to nonexistent page: https://parsikit.dev/en/docs/quickstart')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Scenario 24: A valid page not included in previously hard-coded sample
test('validator scenario 24: dynamically discovers and audits deep pages without hardcoded route lists', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-sc24-'));
  try {
    createBaseValidDist(tmpDir);

    // Create a new, deep valid tutorial page that was not in any hardcoded sample list
    fs.mkdirSync(path.join(tmpDir, 'en/tutorials/advanced-security'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, 'fa/tutorials/advanced-security'), { recursive: true });

    const enTutorialHtml = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <title>Advanced Security Tutorial — ParsiKit</title>
  <meta name="description" content="In-depth guide to cryptographic data handling with ParsiKit" />
  <link rel="canonical" href="${BASE_SITE_URL}/en/tutorials/advanced-security" />
  <link rel="alternate" hreflang="en" href="${BASE_SITE_URL}/en/tutorials/advanced-security" />
  <link rel="alternate" hreflang="fa" href="${BASE_SITE_URL}/fa/tutorials/advanced-security" />
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
  <link rel="canonical" href="${BASE_SITE_URL}/fa/tutorials/advanced-security" />
  <link rel="alternate" hreflang="en" href="${BASE_SITE_URL}/en/tutorials/advanced-security" />
  <link rel="alternate" hreflang="fa" href="${BASE_SITE_URL}/fa/tutorials/advanced-security" />
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
  <url><loc>${BASE_SITE_URL}/en</loc></url>
  <url><loc>${BASE_SITE_URL}/fa</loc></url>
  <url><loc>${BASE_SITE_URL}/en/tutorials/advanced-security</loc></url>
  <url><loc>${BASE_SITE_URL}/fa/tutorials/advanced-security</loc></url>
</urlset>`;
    fs.writeFileSync(path.join(tmpDir, 'sitemap.xml'), updatedSitemap);

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, true);
    assert.equal(report.errors.length, 0);
    // Verify that the new pages were indeed discovered and checked
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
  <link rel="canonical" href="${BASE_SITE_URL}/en" />
  <link rel="alternate" hreflang="en" href="${BASE_SITE_URL}/en" />
  <link rel="alternate" hreflang="fa" href="${BASE_SITE_URL}/fa" />
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite"}</script>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"SoftwareApplication"}</script>
</head>
<body><h1>Test</h1></body>
</html>`;
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), dupJsonLdHtml);

    const report = validateDistArtifacts(tmpDir);
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
  <url><loc>${BASE_SITE_URL}/</loc></url>
  <url><loc>${BASE_SITE_URL}/en</loc></url>
  <url><loc>${BASE_SITE_URL}/fa</loc></url>
</urlset>`;
    fs.writeFileSync(path.join(tmpDir, 'sitemap.xml'), sitemapWithNonCanonical);

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes(`Non-canonical URL in sitemap.xml: ${BASE_SITE_URL}/ points to page whose canonical is declared as ${BASE_SITE_URL}/en`)));
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

    const report = validateDistArtifacts(tmpDir);
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

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('site.webmanifest icon not found in dist: /missing-icon-999.png')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

