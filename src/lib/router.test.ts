import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRoutePath, parseRoutePath, resolveDocument, checkLegacyRedirect } from './router';
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

test('router: query strings and fragments are preserved in buildRoutePath and parseRoutePath', () => {
  const url = buildRoutePath('fa', 'docs', 'api/validators', { query: 'mode=advanced&tab=rules', hash: 'luhn' });
  assert.equal(url, '/fa/docs/api/validators?mode=advanced&tab=rules#luhn');

  const parsed = parseRoutePath('/prs-af/docs/tutorials/datetime?mode=basic#setup');
  assert.equal(parsed.lang, 'prs-af');
  assert.equal(parsed.route, 'docs');
  assert.equal(parsed.docSlug, 'tutorials/datetime');
  assert.equal(parsed.query, 'mode=basic');
  assert.equal(parsed.hash, 'setup');
});

test('locale resolution 1: document existing in the requested locale', () => {
  const resFa = resolveDocument('fa', 'api/validators');
  assert.equal(resFa.status, 'exact');
  assert.equal(resFa.resolvedLang, 'fa');
  assert.equal(resFa.doc?.slug, 'api/validators');
  assert.ok(resFa.availableLangs.includes('fa'));

  const parsed = parseRoutePath('/fa/docs/api/validators');
  assert.equal(parsed.route, 'docs');
  assert.equal(parsed.docResolution?.status, 'exact');
});

test('locale resolution 2: document existing only in English while requested locale is Persian', () => {
  // Development architecture doc exists in English only
  const res = resolveDocument('fa', 'development/architecture');
  assert.equal(res.status, 'fallback');
  assert.equal(res.requestedLang, 'fa');
  assert.equal(res.resolvedLang, 'en');
  assert.ok(res.doc);
  assert.equal(res.doc?.category, 'development');
  assert.equal(res.isDevelopmentOnly, true);
  assert.ok(res.availableLangs.includes('en'));
  assert.ok(!res.availableLangs.includes('fa'));

  const parsed = parseRoutePath('/fa/docs/development/architecture');
  assert.equal(parsed.route, 'docs');
  assert.equal(parsed.docResolution?.status, 'fallback');
  assert.equal(parsed.docResolution?.resolvedLang, 'en');
});

test('locale resolution 3: document existing in Dari or Tajik', () => {
  const resPrs = resolveDocument('prs-af', 'installation');
  assert.equal(resPrs.status, 'exact');
  assert.equal(resPrs.resolvedLang, 'prs-af');
  assert.ok(resPrs.availableLangs.includes('prs-af'));

  const resTg = resolveDocument('tg', 'tutorials/numbers_and_currency');
  assert.equal(resTg.status, 'exact');
  assert.equal(resTg.resolvedLang, 'tg');
  assert.ok(resTg.availableLangs.includes('tg'));
});

test('locale resolution 4: nonexistent document in every locale', () => {
  const res = resolveDocument('fa', 'nonexistent-module-xyz');
  assert.equal(res.status, 'not-found');
  assert.equal(res.doc, null);
  assert.equal(res.availableLangs.length, 0);

  const parsed = parseRoutePath('/tg/docs/completely-unknown-slug');
  assert.equal(parsed.route, 'not-found');
  assert.equal(parsed.docSlug, 'completely-unknown-slug');
  assert.equal(parsed.docResolution?.status, 'not-found');
});

test('locale resolution 5: unsupported locale prefix', () => {
  const parsedDe = parseRoutePath('/de/docs/installation');
  assert.equal(parsedDe.route, 'not-found');

  const parsedFr = parseRoutePath('/fr/playground');
  assert.equal(parsedFr.route, 'not-found');

  const parsedUnknown = parseRoutePath('/random-prefix/nested/route');
  assert.equal(parsedUnknown.route, 'not-found');
});

test('locale resolution 6: valid translated equivalent during language switching', () => {
  const faDoc = ALL_DOCS.find((d) => d.lang === 'fa' && d.slug === 'api/validators');
  assert.ok(faDoc);
  assert.equal(faDoc.counterparts?.en, 'api/validators');
  assert.equal(faDoc.counterparts?.['prs-af'], 'api/validators');
  assert.equal(faDoc.counterparts?.tg, 'api/validators');

  // Verify switching produces equivalent valid route
  const targetEnUrl = buildRoutePath('en', 'docs', faDoc.counterparts?.en);
  assert.equal(targetEnUrl, '/en/docs/api/validators');
});

test('locale resolution 7: missing equivalent during language switching preserves slug for fallback notice', () => {
  const devDoc = ALL_DOCS.find((d) => d.slug === 'development/testing');
  assert.ok(devDoc);
  // Development docs have no counterparts in fa, prs-af, tg
  assert.equal(devDoc.counterparts?.fa, undefined);

  // Switching to fa preserves slug so router resolves it with fallback notice
  const targetFaUrl = buildRoutePath('fa', 'docs', devDoc.slug);
  assert.equal(targetFaUrl, '/fa/docs/development/testing');

  const parsedFa = parseRoutePath(targetFaUrl);
  assert.equal(parsedFa.route, 'docs');
  assert.equal(parsedFa.docResolution?.status, 'fallback');
  assert.equal(parsedFa.docResolution?.resolvedLang, 'en');
});

test('router: legacy Spanish redirects preserve query strings and fragments', () => {
  assert.equal(checkLegacyRedirect('/es'), '/en');
  assert.equal(checkLegacyRedirect('/es/playground?tab=demo#text'), '/en/playground');

  const parsed = parseRoutePath('/es/docs/installation?version=3.3#docker');
  assert.equal(parsed.isLegacyRedirect, true);
  assert.equal(parsed.redirectTarget, '/en/docs/installation?version=3.3#docker');
  assert.equal(parsed.query, 'version=3.3');
  assert.equal(parsed.hash, 'docker');
});

test('seo: computePageMetadata without verified origin omits canonical and alternates', () => {
  const homeMeta = computePageMetadata('en', 'home', null);
  // Without verified origin, no misleading canonical or alternate tags are emitted
  assert.equal(homeMeta.canonicalUrl, undefined);
  assert.equal(homeMeta.alternateEnUrl, undefined);
  assert.equal(homeMeta.alternateFaUrl, undefined);
  assert.equal(homeMeta.alternatePrsUrl, undefined);
  assert.equal(homeMeta.alternateTgUrl, undefined);
  assert.equal(homeMeta.alternateXDefaultUrl, undefined);
  assert.equal(homeMeta.ogUrl, undefined);
  assert.ok(homeMeta.title.includes('ParsiKit'));

  const doc = ALL_DOCS.find((d) => d.slug === 'api/validators' && d.lang === 'en');
  assert.ok(doc);
  const docMeta = computePageMetadata('en', 'docs', doc || null);
  assert.equal(docMeta.canonicalUrl, undefined);
  assert.equal(docMeta.schemaType, 'TechArticle');
});

test('seo: computePageMetadata with verified origin generates verified canonical and hreflang URLs', () => {
  const verifiedTestOrigin = 'https://verified-domain.example.org';
  const homeMeta = computePageMetadata('en', 'home', null, verifiedTestOrigin);
  assert.equal(homeMeta.canonicalUrl, 'https://verified-domain.example.org/en');
  assert.equal(homeMeta.alternateEnUrl, 'https://verified-domain.example.org/en');
  assert.equal(homeMeta.alternateFaUrl, 'https://verified-domain.example.org/fa');
  assert.equal(homeMeta.alternatePrsUrl, 'https://verified-domain.example.org/prs-af');
  assert.equal(homeMeta.alternateTgUrl, 'https://verified-domain.example.org/tg');
  assert.equal(homeMeta.alternateXDefaultUrl, 'https://verified-domain.example.org/en');
  assert.equal(homeMeta.ogUrl, 'https://verified-domain.example.org/en');

  const doc = ALL_DOCS.find((d) => d.slug === 'api/validators' && d.lang === 'en');
  assert.ok(doc);
  const docMeta = computePageMetadata('en', 'docs', doc || null, verifiedTestOrigin);
  assert.equal(docMeta.canonicalUrl, 'https://verified-domain.example.org/en/docs/api/validators');
  assert.equal(docMeta.schemaType, 'TechArticle');
});

test('router: 404 not-found route handling and URL generation', () => {
  assert.equal(buildRoutePath('en', 'not-found'), '/en/404');
  assert.equal(buildRoutePath('fa', 'not-found'), '/fa/404');
  assert.equal(buildRoutePath('prs-af', 'not-found'), '/prs-af/404');
  assert.equal(buildRoutePath('tg', 'not-found'), '/tg/404');

  const parsed404 = parseRoutePath('/fa/404');
  assert.equal(parsed404.route, 'not-found');
  assert.equal(parsed404.lang, 'fa');

  const parsedUnknown = parseRoutePath('/fa/random-invalid-route');
  assert.equal(parsedUnknown.route, 'not-found');
  assert.equal(parsedUnknown.lang, 'fa');

  const parsedMissingDoc = parseRoutePath('/tg/docs/missing-doc-xyz');
  assert.equal(parsedMissingDoc.route, 'not-found');
  assert.equal(parsedMissingDoc.lang, 'tg');
  assert.equal(parsedMissingDoc.docSlug, 'missing-doc-xyz');
});
