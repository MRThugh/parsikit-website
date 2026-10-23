import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRoutePath } from './router';
import { computePageMetadata } from './seo';
import { ALL_DOCS } from '../data/docsManifest';

test('router: buildRoutePath generates clean localized URLs', () => {
  assert.equal(buildRoutePath('en', 'home'), '/en');
  assert.equal(buildRoutePath('fa', 'home'), '/fa');
  assert.equal(buildRoutePath('en', 'playground'), '/en/playground');
  assert.equal(buildRoutePath('fa', 'architecture'), '/fa/architecture');
  assert.equal(buildRoutePath('en', 'docs', 'api/validators'), '/en/docs/api/validators');
  assert.equal(buildRoutePath('fa', 'docs', 'api/validators'), '/fa/docs/api/validators');
});

test('seo: computePageMetadata generates canonical and hreflang URLs', () => {
  const homeMeta = computePageMetadata('en', 'home', null);
  assert.equal(homeMeta.canonicalUrl, 'https://parsikit.dev/en');
  assert.equal(homeMeta.alternateEnUrl, 'https://parsikit.dev/en');
  assert.equal(homeMeta.alternateFaUrl, 'https://parsikit.dev/fa');
  assert.ok(homeMeta.title.includes('ParsiKit'));

  const doc = ALL_DOCS.find((d) => d.slug === 'api/validators' && d.lang === 'en');
  assert.ok(doc);
  const docMeta = computePageMetadata('en', 'docs', doc || null);
  assert.equal(docMeta.canonicalUrl, 'https://parsikit.dev/en/docs/api/validators');
  assert.equal(docMeta.schemaType, 'TechArticle');
});
