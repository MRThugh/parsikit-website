import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRoutePath, parseRoutePath } from './router';
import { computePageMetadata } from './seo';
import { ALL_DOCS } from '../data/docsManifest';

test('router: buildRoutePath generates clean localized URLs for all 4 languages', () => {
  assert.equal(buildRoutePath('en', 'home'), '/en');
  assert.equal(buildRoutePath('fa', 'home'), '/fa');
  assert.equal(buildRoutePath('prs-af', 'home'), '/prs-af');
  assert.equal(buildRoutePath('tg', 'home'), '/tg');

  assert.equal(buildRoutePath('en', 'playground'), '/en/playground');
  assert.equal(buildRoutePath('prs-af', 'architecture'), '/prs-af/architecture');
  assert.equal(buildRoutePath('tg', 'changelog'), '/tg/changelog');

  assert.equal(buildRoutePath('en', 'docs', 'api/validators'), '/en/docs/api/validators');
  assert.equal(buildRoutePath('fa', 'docs', 'api/validators'), '/fa/docs/api/validators');
  assert.equal(buildRoutePath('prs-af', 'docs', 'installation'), '/prs-af/docs/installation');
  assert.equal(buildRoutePath('tg', 'docs', 'quickstart'), '/tg/docs/quickstart');
});

test('seo: computePageMetadata generates canonical and hreflang URLs for 4 languages', () => {
  const homeMeta = computePageMetadata('en', 'home', null);
  assert.equal(homeMeta.canonicalUrl, 'https://parsikit.dev/en');
  assert.equal(homeMeta.alternateEnUrl, 'https://parsikit.dev/en');
  assert.equal(homeMeta.alternateFaUrl, 'https://parsikit.dev/fa');
  assert.equal(homeMeta.alternatePrsUrl, 'https://parsikit.dev/prs-af');
  assert.equal(homeMeta.alternateTgUrl, 'https://parsikit.dev/tg');
  assert.equal(homeMeta.alternateXDefaultUrl, 'https://parsikit.dev/en');
  assert.ok(homeMeta.title.includes('ParsiKit'));

  const doc = ALL_DOCS.find((d) => d.slug === 'api/validators' && d.lang === 'en');
  assert.ok(doc);
  const docMeta = computePageMetadata('en', 'docs', doc || null);
  assert.equal(docMeta.canonicalUrl, 'https://parsikit.dev/en/docs/api/validators');
  assert.equal(docMeta.schemaType, 'TechArticle');
});
