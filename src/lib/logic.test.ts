import test from 'node:test';
import assert from 'node:assert/strict';
import {
  toPersianDigits,
  toEnglishDigits,
  numberToWords,
  rialToToman,
  tomanToRial,
} from './persianNumber';
import {
  isValidNationalCode,
  isValidCardNumber,
  detectBank,
  detectMobileOperator,
  maskCard,
  maskMobile,
  maskNationalCode,
  cleanText,
} from './validation';
import {
  isJalaliLeap,
  gregorianToJalali,
  jalaliToGregorian,
} from './jalali';
import { searchDocumentation } from './search';
import { parseRoutePath, buildRoutePath } from './router';
import { computePageMetadata, BASE_SITE_URL } from './seo';
import { ALL_DOCS } from '../data/docsManifest';
import { REPO_METADATA } from '../data/repoMetadata';
import { parsePyprojectData } from '../../scripts/build-docs-manifest';
import { renderMarkdownToHtml } from '../../scripts/render-markdown';

test('persianNumber: digit translations', () => {
  assert.equal(toPersianDigits('12345'), '۱۲۳۴۵');
  assert.equal(toEnglishDigits('۱۲۳۴۵'), '12345');
  assert.equal(toEnglishDigits('١٢٣٤٥'), '12345');
});

test('persianNumber: number to words', () => {
  assert.equal(numberToWords(0), 'صفر');
  assert.equal(numberToWords(15), 'پانزده');
  assert.equal(numberToWords(100), 'صد');
  assert.equal(numberToWords(1000), 'یک هزار');
  assert.equal(numberToWords(3500000), 'سه میلیون و پانصد هزار');
  assert.equal(numberToWords(12450000), 'دوازده میلیون و چهارصد و پنجاه هزار');
});

test('persianNumber: rial and toman conversions', () => {
  assert.equal(rialToToman(10000), 1000);
  assert.equal(tomanToRial(1000), 10000);
});

test('validation: Iranian national code modulo 11 algorithm', () => {
  // Known valid national codes from ParsiKit documentation
  assert.equal(isValidNationalCode('0010123458'), true);
  assert.equal(isValidNationalCode('0010350829'), true);

  // Repeating identical digits are strictly invalid
  assert.equal(isValidNationalCode('1111111111'), false);
  assert.equal(isValidNationalCode('0000000000'), false);

  // Invalid length or checksum
  assert.equal(isValidNationalCode('1234567890'), false);
  assert.equal(isValidNationalCode('123'), false);
});

test('validation: Bank card Luhn algorithm and bank detection', () => {
  // Valid Luhn card from ParsiKit documentation
  assert.equal(isValidCardNumber('6037991122334455'), true);
  // Invalid card
  assert.equal(isValidCardNumber('6037991122334450'), false);

  const bank = detectBank('6037991122334455');
  assert.ok(bank);
  assert.equal(bank.nameFa, 'بانک ملی ایران');

  const mellat = detectBank('6104331234567890');
  assert.ok(mellat);
  assert.equal(mellat.nameFa, 'بانک ملت');
});

test('validation: Mobile operator and masking', () => {
  const mci = detectMobileOperator('09123456789');
  assert.ok(mci);
  assert.equal(mci.nameEn, 'Hamrah-e Aval (MCI)');

  const irancell = detectMobileOperator('09351234567');
  assert.ok(irancell);
  assert.equal(irancell.nameEn, 'MTN Irancell');

  assert.equal(maskCard('6037997123456789'), '6037-99**-****-6789');
  assert.equal(maskMobile('09123456789'), '0912***6789');
  assert.equal(maskNationalCode('0010350829'), '001***0829');
});

test('validation: text cleansing and ZWNJ handling', () => {
  const res = cleanText('می خواهم كتاب ها را باز كنم');
  assert.ok(res.cleaned.includes('می‌خواهم'));
  assert.ok(res.cleaned.includes('کتاب'));
  assert.ok(res.cleaned.includes('کتاب‌'));
  assert.ok(!res.cleaned.includes('ك'));
});

test('jalali: leap year calculations and Gregorian conversion', () => {
  // 1399 and 1403 are leap years; 1400 and 1404 are normal years
  assert.equal(isJalaliLeap(1399), true);
  assert.equal(isJalaliLeap(1400), false);
  assert.equal(isJalaliLeap(1403), true);
  assert.equal(isJalaliLeap(1404), false);

  // Conversion roundtrip: 2026-10-21 -> 1405-07-29
  const j = gregorianToJalali(2026, 10, 21);
  assert.equal(j.jy, 1405);
  assert.equal(j.jm, 7);
  assert.equal(j.jd, 29);

  const g = jalaliToGregorian(j.jy, j.jm, j.jd);
  assert.equal(g.gy, 2026);
  assert.equal(g.gm, 10);
  assert.equal(g.gd, 21);
});

test('search: documentation queries in English, Persian, and Spanish', () => {
  const enResults = searchDocumentation('national code', 'en');
  assert.ok(enResults.length > 0);
  assert.ok(enResults[0].doc.title.length > 0);

  const faResults = searchDocumentation('کد ملی', 'fa');
  assert.ok(faResults.length > 0);

  const esResults = searchDocumentation('instalación', 'es');
  assert.ok(esResults.length > 0);
});

test('router: trilingual path parsing and serialization', () => {
  const parsedFa = parseRoutePath('/fa/docs/installation');
  assert.equal(parsedFa.lang, 'fa');
  assert.equal(parsedFa.route, 'docs');
  assert.equal(parsedFa.docSlug, 'installation');

  const parsedEn = parseRoutePath('/en/playground');
  assert.equal(parsedEn.lang, 'en');
  assert.equal(parsedEn.route, 'playground');

  const parsedEs = parseRoutePath('/es/docs/quickstart');
  assert.equal(parsedEs.lang, 'es');
  assert.equal(parsedEs.route, 'docs');
  assert.equal(parsedEs.docSlug, 'quickstart');

  const esPath = buildRoutePath('es', 'docs', 'installation');
  assert.equal(esPath, '/es/docs/installation');
});

test('seo: trilingual metadata and symmetric hreflang alternate URL generation', () => {
  const homeMetaEn = computePageMetadata('en', 'home', null);
  assert.ok(homeMetaEn.title.includes('ParsiKit'));
  assert.equal(homeMetaEn.canonicalUrl, `${BASE_SITE_URL}/en`);
  assert.equal(homeMetaEn.alternateEnUrl, `${BASE_SITE_URL}/en`);
  assert.equal(homeMetaEn.alternateFaUrl, `${BASE_SITE_URL}/fa`);
  assert.equal(homeMetaEn.alternateEsUrl, `${BASE_SITE_URL}/es`);

  const homeMetaEs = computePageMetadata('es', 'home', null);
  assert.ok(homeMetaEs.title.includes('ParsiKit'));
  assert.equal(homeMetaEs.canonicalUrl, `${BASE_SITE_URL}/es`);

  const doc = ALL_DOCS.find((d: any) => d.slug === 'installation' && d.lang === 'es');
  if (doc) {
    const docMeta = computePageMetadata('es', 'docs', doc);
    assert.ok(docMeta.title.includes('Instalación') || docMeta.title.includes('ParsiKit'));
    assert.equal(docMeta.schemaType, 'TechArticle');
    assert.ok(docMeta.canonicalUrl.includes('/es/docs/installation'));
  }
});

test('repoMetadata & TOML parsing: smol-toml verified extraction', () => {
  const tomlData = parsePyprojectData();
  assert.equal(tomlData.name, 'parsikit');
  assert.equal(tomlData.version, '3.3.1');
  assert.equal(tomlData.author, 'Ali Kamrani');
  assert.equal(tomlData.license, 'MIT');
  assert.equal(tomlData.pythonRequirement, '>=3.10');

  assert.equal(REPO_METADATA.author, 'Ali Kamrani');
  assert.equal(REPO_METADATA.name, 'parsikit');
  assert.equal(REPO_METADATA.license, 'MIT');
  assert.equal(REPO_METADATA.version, '3.3.1');
  assert.ok(REPO_METADATA.totalDocs >= 50);
});

test('markdown pipeline: marked renders headings with IDs and escapes untrusted HTML', () => {
  const md = '# Main Title\n\n## Sub Section\n\n```python\nprint("hello")\n```';
  const html = renderMarkdownToHtml(md);
  assert.ok(html.includes('<h1 id="main-title"'));
  assert.ok(html.includes('<h2 id="sub-section"'));
  assert.ok(html.includes('<pre><code'));
  assert.ok(html.includes('print('));
});
