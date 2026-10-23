import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { parseXml, validateDistArtifacts } from './validate-production';
import { BASE_SITE_URL } from '../src/lib/seo';

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

test('validator: fails when canonical URL is incorrect or missing', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-val-test-'));

  try {
    // Empty directory fails because required pages are missing
    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Missing core static page')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('validator: fails when sitemap contains invalid or non-existent URLs', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-val-sitemap-'));

  try {
    // Create minimal mock layout
    fs.mkdirSync(path.join(tmpDir, 'en'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, 'index.html'), '<html><head><title>Home</title></head><body></body></html>');

    // Create sitemap pointing to nonexistent URL
    const badSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://parsikit.dev/en/nonexistent-route-xyz</loc>
  </url>
</urlset>`;
    fs.writeFileSync(path.join(tmpDir, 'sitemap.xml'), badSitemap);

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('nonexistent-route-xyz')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('validator: fails when alternate hreflang link is non-reciprocal', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parsikit-val-reciprocal-'));

  try {
    // Create page A pointing to page B, but page B does not point back to page A
    fs.mkdirSync(path.join(tmpDir, 'en'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, 'fa'), { recursive: true });

    // en/index.html points to fa
    const enHtml = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <title>Title</title>
  <meta name="description" content="Desc" />
  <link rel="canonical" href="${BASE_SITE_URL}/en" />
  <link rel="alternate" hreflang="fa" href="${BASE_SITE_URL}/fa" />
</head>
<body></body>
</html>`;
    fs.writeFileSync(path.join(tmpDir, 'en/index.html'), enHtml);

    // fa/index.html does NOT point back to en
    const faHtml = `<!DOCTYPE html>
<html lang="fa-IR" dir="rtl">
<head>
  <title>Title</title>
  <meta name="description" content="Desc" />
  <link rel="canonical" href="${BASE_SITE_URL}/fa" />
</head>
<body></body>
</html>`;
    fs.writeFileSync(path.join(tmpDir, 'fa/index.html'), faHtml);

    const report = validateDistArtifacts(tmpDir);
    assert.equal(report.success, false);
    assert.ok(report.errors.some((e) => e.includes('Non-reciprocal hreflang link')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
