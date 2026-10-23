/**
 * Technical SEO, Dynamic Document Head Manager & Multi-Language Alternate Generator
 * Supporting exactly four official languages: fa, en, prs-af, tg.
 */

import { ALL_DOCS, type DocEntry } from '../data/docsManifest';
import { type AppLang, type PageRoute, buildRoutePath } from './router';
import { LOCALES } from '../i18n/config';

export const BASE_SITE_URL = 'https://parsikit.dev';

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  alternateEnUrl?: string;
  alternateFaUrl?: string;
  alternatePrsUrl?: string;
  alternateTgUrl?: string;
  alternateXDefaultUrl?: string;
  schemaType: 'SoftwareApplication' | 'TechArticle' | 'WebSite';
  headline?: string;
}

export function computePageMetadata(
  lang: AppLang,
  route: PageRoute,
  activeDoc: DocEntry | null
): SeoMetadata {
  const path = buildRoutePath(lang, route, activeDoc?.slug);
  const canonicalUrl = `${BASE_SITE_URL}${path}`;

  let title = 'ParsiKit — Persian Data Infrastructure';
  let description = 'Official website and documentation for ParsiKit, a production-grade pure Python library for Persian data infrastructure by Ali Kamrani.';
  let schemaType: SeoMetadata['schemaType'] = 'SoftwareApplication';

  // Base alternates for static non-doc routes (all 4 languages guaranteed)
  let alternateEnUrl: string | undefined = undefined;
  let alternateFaUrl: string | undefined = undefined;
  let alternatePrsUrl: string | undefined = undefined;
  let alternateTgUrl: string | undefined = undefined;
  let alternateXDefaultUrl: string | undefined = undefined;

  if (route === 'home' || route === 'playground' || route === 'architecture' || route === 'changelog') {
    alternateEnUrl = `${BASE_SITE_URL}${buildRoutePath('en', route)}`;
    alternateFaUrl = `${BASE_SITE_URL}${buildRoutePath('fa', route)}`;
    alternatePrsUrl = `${BASE_SITE_URL}${buildRoutePath('prs-af', route)}`;
    alternateTgUrl = `${BASE_SITE_URL}${buildRoutePath('tg', route)}`;
    alternateXDefaultUrl = alternateEnUrl;
  }

  if (route === 'home') {
    if (lang === 'fa') {
      title = 'پارسی‌کیت — زیرساخت داده‌های فارسی برای پایتون';
      description = 'کتابخانه پایتونی بدون وابستگی برای پاکسازی متون فارسی، اعتبارسنجی کد ملی، کارت بانکی، تقویم نجومی جلالی، محاسبات مالی و حفظ امنیت داده‌های حساس.';
    } else if (lang === 'prs-af') {
      title = 'پارسی‌کیت — زیرساخت معیاری پایتون برای داده‌های فارسی دری';
      description = 'کتابخانه بدون وابستگی‌های بیرونی برای تصفیه و اصلاح متون دری، نیم‌فاصله‌ها، تثبیت اعتبار نمبر تذکره الکترونیکی، کارت‌های بانکی و تقویم هجری شمسی.';
    } else if (lang === 'tg') {
      title = 'ParsiKit — Зерсохти додаҳои форсӣ ва тоҷикӣ барои Python';
      description = 'Китобхонаи мустақил барои поксозии матн, танзими фосилаҳо, тафтиши дурустии рақамҳои миллӣ ва кортҳои бонкӣ, тақвими шамсӣ ва ҳисоботи молӣ.';
    } else {
      title = 'ParsiKit — Persian Data Infrastructure for Python';
      description = 'Production-grade, zero-dependency Python library for Persian text normalization, national checksums, astronomical Jalali calendar, financial calculations, and sensitive data masking.';
    }
  } else if (route === 'playground') {
    if (lang === 'fa') {
      title = 'محیط آزمایشی زنده — پارسی‌کیت';
      description = 'تست آنلاین الگوریتم‌های پارسی‌کیت در مرورگر: پاکسازی نیم‌فاصله، اعتبارسنجی کد ملی، کارت بانکی، تبدیل تاریخ و عدد به حروف.';
    } else if (lang === 'prs-af') {
      title = 'محیط آزمایشی و تشخیص آنلاین — پارسی‌کیت';
      description = 'آزمایش مستقیم الگوریتم‌های تصفیه متن، تثبیت اعتبار نمبر تذکره و کارت بانکی، و تقویم هجری شمسی در براوزر.';
    } else if (lang === 'tg') {
      title = 'Озмоишгоҳи ташхиси интерактивӣ — ParsiKit';
      description = 'Озмоиши мустақими алгоритмҳои ташхиси матн, тафтиши рақами миллӣ, корти бонкӣ ва тақвими шамсӣ дар браузер.';
    } else {
      title = 'Interactive Diagnostic Studio & Playground — ParsiKit';
      description = 'Test ParsiKit algorithms directly in the browser: text normalization, national code validation, bank card Luhn check, Jalali calendar, and number to words.';
    }
  } else if (route === 'docs' && activeDoc) {
    schemaType = 'TechArticle';
    title = `${activeDoc.title} — ParsiKit`;
    description = activeDoc.summary || description;

    // Hreflang alternates: ONLY link to existing counterparts to prevent dead-end alternate links
    alternateEnUrl = activeDoc.lang === 'en'
      ? `${BASE_SITE_URL}/en/docs/${activeDoc.slug}`
      : activeDoc.counterparts?.en
      ? `${BASE_SITE_URL}/en/docs/${activeDoc.counterparts.en}`
      : undefined;

    alternateFaUrl = activeDoc.lang === 'fa'
      ? `${BASE_SITE_URL}/fa/docs/${activeDoc.slug}`
      : activeDoc.counterparts?.fa
      ? `${BASE_SITE_URL}/fa/docs/${activeDoc.counterparts.fa}`
      : undefined;

    alternatePrsUrl = activeDoc.lang === 'prs-af'
      ? `${BASE_SITE_URL}/prs-af/docs/${activeDoc.slug}`
      : activeDoc.counterparts?.['prs-af']
      ? `${BASE_SITE_URL}/prs-af/docs/${activeDoc.counterparts['prs-af']}`
      : undefined;

    alternateTgUrl = activeDoc.lang === 'tg'
      ? `${BASE_SITE_URL}/tg/docs/${activeDoc.slug}`
      : activeDoc.counterparts?.tg
      ? `${BASE_SITE_URL}/tg/docs/${activeDoc.counterparts.tg}`
      : undefined;

    alternateXDefaultUrl = alternateEnUrl || alternateFaUrl;
  } else if (route === 'architecture') {
    if (lang === 'fa') {
      title = 'معماری فنی و طراحی لایه‌ای — پارسی‌کیت';
      description = 'بررسی معماری فنی پارسی‌کیت: صفر وابستگی، سیستم کش چندنخی (Thread-safe LRU Cache) و طراحی مدل‌های شیءگرا.';
    } else if (lang === 'prs-af') {
      title = 'معماری تخنیکی و لایه‌بندی سیستم — پارسی‌کیت';
      description = 'اصول انجنیری نرم‌افزار، امنیت پایدار و استانداردهای طراحی درون کتابخانه پارسی‌کیت.';
    } else if (lang === 'tg') {
      title = 'Меъмории фаннӣ ва тарҳи қабатҳо — ParsiKit';
      description = 'Принсипҳои муҳандисии барномасозӣ, амнияти пойдор ва тарроҳии дарунӣ дар ParsiKit.';
    } else {
      title = 'Technical Architecture & Layer Design — ParsiKit';
      description = 'Deep dive into ParsiKit architectural principles: zero dependencies, thread-safe in-memory caching, and domain-driven design.';
    }
  } else if (route === 'changelog') {
    if (lang === 'fa') {
      title = 'تاریخچه تغییرات و نسخه‌ها — پارسی‌کیت';
      description = 'گزارش کامل تغییرات، اصلاحات امنیتی و قابلیت‌های جدید نسخه‌های مختلف کتابخانه پارسی‌کیت.';
    } else if (lang === 'prs-af') {
      title = 'یادداشت‌های نسخه و تاریخچه تغییرات — پارسی‌کیت';
      description = 'ثبت منظم تمام نوآوری‌ها، ترمیم خطاهای امنیتی و اصلاحات بر اساس اصول Semantic Versioning.';
    } else if (lang === 'tg') {
      title = 'Таърихи нусхаҳо ва тағйирот — ParsiKit';
      description = 'Сабти мунтазами ҳамаи нусхаҳо ва беҳбудиҳои амниятӣ бар асоси стандарти Semantic Versioning.';
    } else {
      title = 'Changelog & Release Notes — ParsiKit';
      description = 'Full version history, security fixes, and feature additions across ParsiKit releases according to Semantic Versioning.';
    }
  }

  return {
    title,
    description,
    canonicalUrl,
    alternateEnUrl,
    alternateFaUrl,
    alternatePrsUrl,
    alternateTgUrl,
    alternateXDefaultUrl,
    schemaType,
    headline: activeDoc ? activeDoc.title : undefined,
  };
}

export function updateDocumentHead(meta: SeoMetadata, lang: AppLang) {
  if (typeof document === 'undefined') return;

  const loc = LOCALES[lang] || LOCALES.en;

  // Title
  document.title = meta.title;

  // Meta description
  let descTag = document.querySelector('meta[name="description"]');
  if (!descTag) {
    descTag = document.createElement('meta');
    descTag.setAttribute('name', 'description');
    document.head.appendChild(descTag);
  }
  descTag.setAttribute('content', meta.description);

  // Open Graph
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', meta.title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', meta.description);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', meta.canonicalUrl);

  // Canonical link
  let canonicalTag = document.querySelector('link[rel="canonical"]');
  if (!canonicalTag) {
    canonicalTag = document.createElement('link');
    canonicalTag.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalTag);
  }
  canonicalTag.setAttribute('href', meta.canonicalUrl);

  // Helper for alternate link
  const syncAlternateLink = (hreflang: string, url?: string) => {
    let tag = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`);
    if (url) {
      if (!tag) {
        tag = document.createElement('link');
        tag.setAttribute('rel', 'alternate');
        tag.setAttribute('hreflang', hreflang);
        document.head.appendChild(tag);
      }
      tag.setAttribute('href', url);
    } else if (tag) {
      tag.remove();
    }
  };

  syncAlternateLink('en', meta.alternateEnUrl);
  syncAlternateLink('fa-IR', meta.alternateFaUrl);
  syncAlternateLink('fa', meta.alternateFaUrl);
  syncAlternateLink('prs-AF', meta.alternatePrsUrl);
  syncAlternateLink('prs', meta.alternatePrsUrl);
  syncAlternateLink('tg-TJ', meta.alternateTgUrl);
  syncAlternateLink('tg', meta.alternateTgUrl);
  syncAlternateLink('x-default', meta.alternateXDefaultUrl);

  // Remove deprecated Spanish alternate if lingering in DOM
  const lingeringEs = document.querySelector('link[rel="alternate"][hreflang="es"]');
  if (lingeringEs) lingeringEs.remove();

  // Update html lang & dir
  document.documentElement.lang = loc.locale;
  document.documentElement.dir = loc.direction;
}
