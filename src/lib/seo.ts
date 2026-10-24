/**
 * Technical SEO, Dynamic Document Head Manager & Multi-Language Alternate Generator
 * Supporting exactly four official languages: fa, en, prs-af, tg.
 * Author & Creator: Ali Kamrani (علی کامرانی)
 * Official Repo: https://github.com/MRThugh/ParsiKit
 */

import { type DocEntry } from '../data/docsManifest';
import { type AppLang, type PageRoute, buildRoutePath } from './router';
import { LOCALES } from '../i18n/config';
import {
  getVerifiedSiteUrl,
  getDeploymentBasePath,
  OFFICIAL_REPO_URL,
  OFFICIAL_AUTHOR,
} from '../config/site';

export { getVerifiedSiteUrl, getDeploymentBasePath, OFFICIAL_REPO_URL, OFFICIAL_AUTHOR };

/**
 * Returns the verified public origin/base URL or empty string if not configured.
 * NOTE: Never hardcodes an invented domain like parsikit.dev.
 */
export function getBaseSiteUrl(): string {
  return getVerifiedSiteUrl() || '';
}

// Deprecated export for backwards compatibility with existing imports
export const BASE_SITE_URL = getBaseSiteUrl();

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl?: string;
  alternateEnUrl?: string;
  alternateFaUrl?: string;
  alternatePrsUrl?: string;
  alternateTgUrl?: string;
  alternateXDefaultUrl?: string;
  ogUrl?: string;
  ogImage?: string;
  twitterImage?: string;
  schemaType: 'SoftwareApplication' | 'TechArticle' | 'WebSite';
  headline?: string;
  robots?: string;
}

export function computePageMetadata(
  lang: AppLang,
  route: PageRoute,
  activeDoc: DocEntry | null,
  overrideOrigin?: string
): SeoMetadata {
  const verifiedOrigin = overrideOrigin ?? getVerifiedSiteUrl();
  const basePath = getDeploymentBasePath();
  const path = buildRoutePath(lang, route, activeDoc?.slug);

  // Canonical and og:url are ONLY generated when a verified origin is configured
  const canonicalUrl = verifiedOrigin ? `${verifiedOrigin}${basePath}${path}` : undefined;
  const ogUrl = canonicalUrl;
  const ogImage = verifiedOrigin
    ? `${verifiedOrigin}${basePath}/parsikit-logo.png`
    : `${basePath || ''}/parsikit-logo.png`;
  const twitterImage = ogImage;

  let title = 'ParsiKit — Persian Data Infrastructure';
  let description =
    'Official website and documentation for ParsiKit, a production-grade pure Python library for Persian data infrastructure by Ali Kamrani.';
  let schemaType: SeoMetadata['schemaType'] = 'SoftwareApplication';

  // Base alternates for static non-doc routes (all 4 languages guaranteed)
  let alternateEnUrl: string | undefined = undefined;
  let alternateFaUrl: string | undefined = undefined;
  let alternatePrsUrl: string | undefined = undefined;
  let alternateTgUrl: string | undefined = undefined;
  let alternateXDefaultUrl: string | undefined = undefined;

  if (verifiedOrigin) {
    if (
      route === 'home' ||
      route === 'playground' ||
      route === 'architecture' ||
      route === 'changelog'
    ) {
      alternateEnUrl = `${verifiedOrigin}${basePath}${buildRoutePath('en', route)}`;
      alternateFaUrl = `${verifiedOrigin}${basePath}${buildRoutePath('fa', route)}`;
      alternatePrsUrl = `${verifiedOrigin}${basePath}${buildRoutePath('prs-af', route)}`;
      alternateTgUrl = `${verifiedOrigin}${basePath}${buildRoutePath('tg', route)}`;
      alternateXDefaultUrl = alternateEnUrl;
    }
  }

  if (route === 'home') {
    if (lang === 'fa') {
      title = 'پارسی‌کیت — زیرساخت داده‌های فارسی برای پایتون';
      description =
        'کتابخانه پایتونی بدون وابستگی برای پاکسازی متون فارسی، اعتبارسنجی کد ملی، کارت بانکی، تقویم نجومی جلالی، محاسبات مالی و حفظ امنیت داده‌های حساس.';
    } else if (lang === 'prs-af') {
      title = 'پارسی‌کیت — زیرساخت معیاری پایتون برای داده‌های فارسی دری';
      description =
        'کتابخانه بدون وابستگی‌های بیرونی برای تصفیه و اصلاح متون دری، نیم‌فاصله‌ها، تثبیت اعتبار نمبر تذکره الکترونیکی، کارت‌های بانکی و تقویم هجری شمسی.';
    } else if (lang === 'tg') {
      title = 'ParsiKit — Зерсохти додаҳои форсӣ ва тоҷикӣ барои Python';
      description =
        'Китобхонаи мустақил барои поксозии матн, танзими фосилаҳо, тафтиши дурустии рақамҳои миллӣ ва кортҳои бонкӣ, тақвими шамсӣ ва ҳисоботи молӣ.';
    } else {
      title = 'ParsiKit — Persian Data Infrastructure for Python';
      description =
        'Production-grade, zero-dependency Python library for Persian text normalization, national checksums, astronomical Jalali calendar, financial calculations, and sensitive data masking.';
    }
  } else if (route === 'playground') {
    if (lang === 'fa') {
      title = 'محیط آزمایشی زنده — پارسی‌کیت';
      description =
        'تست آنلاین الگوریتم‌های پارسی‌کیت در مرورگر: پاکسازی نیم‌فاصله، اعتبارسنجی کد ملی، کارت بانکی، تبدیل تاریخ و عدد به حروف.';
    } else if (lang === 'prs-af') {
      title = 'محیط آزمایشی و تشخیص آنلاین — پارسی‌کیت';
      description =
        'آزمایش مستقیم الگوریتم‌های تصفیه متن، تثبیت اعتبار نمبر تذکره و کارت بانکی، و تقویم هجری شمسی در براوزر.';
    } else if (lang === 'tg') {
      title = 'Озмоишгоҳи ташхиси интерактивӣ — ParsiKit';
      description =
        'Озмоиши мустақими алгоритмҳои ташхиси матн, тафтиши рақами миллӣ, корти бонкӣ ва тақвими шамсӣ дар браузер.';
    } else {
      title = 'Interactive Diagnostic Studio & Playground — ParsiKit';
      description =
        'Test ParsiKit algorithms directly in the browser: text normalization, national code validation, bank card Luhn check, Jalali calendar, and number to words.';
    }
  } else if (route === 'docs' && activeDoc) {
    schemaType = 'TechArticle';
    title = `${activeDoc.title} — ParsiKit`;
    description = activeDoc.summary || description;

    if (verifiedOrigin) {
      // Hreflang alternates: ONLY link to existing counterparts to prevent dead-end alternate links
      alternateEnUrl =
        activeDoc.lang === 'en'
          ? `${verifiedOrigin}${basePath}/en/docs/${activeDoc.slug}`
          : activeDoc.counterparts?.en
          ? `${verifiedOrigin}${basePath}/en/docs/${activeDoc.counterparts.en}`
          : undefined;

      alternateFaUrl =
        activeDoc.lang === 'fa'
          ? `${verifiedOrigin}${basePath}/fa/docs/${activeDoc.slug}`
          : activeDoc.counterparts?.fa
          ? `${verifiedOrigin}${basePath}/fa/docs/${activeDoc.counterparts.fa}`
          : undefined;

      alternatePrsUrl =
        activeDoc.lang === 'prs-af'
          ? `${verifiedOrigin}${basePath}/prs-af/docs/${activeDoc.slug}`
          : activeDoc.counterparts?.['prs-af']
          ? `${verifiedOrigin}${basePath}/prs-af/docs/${activeDoc.counterparts['prs-af']}`
          : undefined;

      alternateTgUrl =
        activeDoc.lang === 'tg'
          ? `${verifiedOrigin}${basePath}/tg/docs/${activeDoc.slug}`
          : activeDoc.counterparts?.tg
          ? `${verifiedOrigin}${basePath}/tg/docs/${activeDoc.counterparts.tg}`
          : undefined;

      alternateXDefaultUrl = alternateEnUrl || alternateFaUrl;
    }
  } else if (route === 'architecture') {
    if (lang === 'fa') {
      title = 'معماری فنی و طراحی لایه‌ای — پارسی‌کیت';
      description =
        'بررسی معماری فنی پارسی‌کیت: صفر وابستگی، سیستم کش چندنخی (Thread-safe LRU Cache) و طراحی مدل‌های شیءگرا.';
    } else if (lang === 'prs-af') {
      title = 'معماری تخنیکی و لایه‌بندی سیستم — پارسی‌کیت';
      description =
        'اصول انجنیری نرم‌افزار، امنیت پایدار و استانداردهای طراحی درون کتابخانه پارسی‌کیت.';
    } else if (lang === 'tg') {
      title = 'Меъмории фаннӣ ва тарҳи қабатҳо — ParsiKit';
      description =
        'Принсипҳои муҳандисии барномасозӣ, амнияти пойдор ва тарроҳии дарунӣ дар ParsiKit.';
    } else {
      title = 'Technical Architecture & Layer Design — ParsiKit';
      description =
        'Deep dive into ParsiKit architectural principles: zero dependencies, thread-safe in-memory caching, and domain-driven design.';
    }
  } else if (route === 'changelog') {
    if (lang === 'fa') {
      title = 'تاریخچه تغییرات و نسخه‌ها — پارسی‌کیت';
      description =
        'گزارش کامل تغییرات، اصلاحات امنیتی و قابلیت‌های جدید نسخه‌های مختلف کتابخانه پارسی‌کیت.';
    } else if (lang === 'prs-af') {
      title = 'یادداشت‌های نسخه و تاریخچه تغییرات — پارسی‌کیت';
      description =
        'ثبت منظم تمام نوآوری‌ها، ترمیم خطاهای امنیتی و اصلاحات بر اساس اصول Semantic Versioning.';
    } else if (lang === 'tg') {
      title = 'Таърихи нусхаҳо ва тағйирот — ParsiKit';
      description =
        'Сабти мунтазами ҳамаи нусхаҳо ва беҳбудиҳои амниятӣ бар асоси стандарти Semantic Versioning.';
    } else {
      title = 'Changelog & Release Notes — ParsiKit';
      description =
        'Full version history, security fixes, and feature additions across ParsiKit releases according to Semantic Versioning.';
    }
  } else if (route === 'not-found') {
    schemaType = 'WebSite';
    if (lang === 'fa') {
      title = '۴۰۴ — صفحه مورد نظر یافت نشد | پارسی‌کیت';
      description = 'متأسفانه صفحه یا سند مورد نظر شما در وب‌سایت پارسی‌کیت یافت نشد.';
    } else if (lang === 'prs-af') {
      title = '۴۰۴ — صفحه دریافت نشد | پارسی‌کیت';
      description = 'متأسفانه صفحه یا سند رهنمای مورد نظر شما در وبسایت پارسی‌کیت دریافت نگردید.';
    } else if (lang === 'tg') {
      title = '404 — Саҳифа ёфт нашуд | ParsiKit';
      description = 'Мутаассифона саҳифа ё ҳуҷҷати дархостшуда дар вебгоҳи ParsiKit ёфт нашуд.';
    } else {
      title = '404 — Page Not Found | ParsiKit';
      description = 'The requested documentation or page could not be found on ParsiKit.';
    }
  }

  const robots = route === 'not-found' ? 'noindex, follow' : undefined;

  return {
    title,
    description,
    canonicalUrl,
    alternateEnUrl,
    alternateFaUrl,
    alternatePrsUrl,
    alternateTgUrl,
    alternateXDefaultUrl,
    ogUrl,
    ogImage,
    twitterImage,
    schemaType,
    headline: activeDoc ? activeDoc.title : undefined,
    robots,
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

  // Meta robots
  let robotsTag = document.querySelector('meta[name="robots"]');
  if (meta.robots) {
    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.setAttribute('name', 'robots');
      document.head.appendChild(robotsTag);
    }
    robotsTag.setAttribute('content', meta.robots);
  } else if (robotsTag) {
    robotsTag.setAttribute('content', 'index, follow');
  }

  // Open Graph
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', meta.title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', meta.description);

  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (meta.ogUrl) {
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', meta.ogUrl);
  } else if (ogUrl) {
    ogUrl.remove();
  }

  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage && meta.ogImage) ogImage.setAttribute('content', meta.ogImage);

  const ogImageAlt = document.querySelector('meta[property="og:image:alt"]');
  if (ogImageAlt) ogImageAlt.setAttribute('content', meta.title);

  let ogLocale = document.querySelector('meta[property="og:locale"]');
  if (!ogLocale) {
    ogLocale = document.createElement('meta');
    ogLocale.setAttribute('property', 'og:locale');
    document.head.appendChild(ogLocale);
  }
  ogLocale.setAttribute('content', loc.ogLocale);

  // Twitter
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', meta.title);

  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute('content', meta.description);

  const twImage = document.querySelector('meta[name="twitter:image"]');
  if (twImage && meta.twitterImage) twImage.setAttribute('content', meta.twitterImage);

  const twImageAlt = document.querySelector('meta[name="twitter:image:alt"]');
  if (twImageAlt) twImageAlt.setAttribute('content', meta.title);

  // Canonical link: strictly ONLY set when a verified canonicalUrl is computed
  let canonicalTag = document.querySelector('link[rel="canonical"]');
  if (meta.canonicalUrl) {
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', meta.canonicalUrl);
  } else if (canonicalTag) {
    // Remove unverified canonical tag if present
    canonicalTag.remove();
  }

  // Helper for alternate links
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
