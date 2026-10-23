/**
 * Technical SEO, Dynamic Document Head Manager & Multi-Language Alternate Generator
 */

import { ALL_DOCS, type DocEntry } from '../data/docsManifest';
import { type AppLang, type PageRoute, buildRoutePath } from './router';

export const BASE_SITE_URL = 'https://parsikit.dev';

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  alternateEnUrl?: string;
  alternateFaUrl?: string;
  alternateEsUrl?: string;
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

  // Base alternates for static non-doc routes
  let alternateEnUrl: string | undefined = `${BASE_SITE_URL}${buildRoutePath('en', route)}`;
  let alternateFaUrl: string | undefined = `${BASE_SITE_URL}${buildRoutePath('fa', route)}`;
  let alternateEsUrl: string | undefined = `${BASE_SITE_URL}${buildRoutePath('es', route)}`;

  if (route === 'home') {
    if (lang === 'fa') {
      title = 'پارسی‌کیت — زیرساخت داده‌های فارسی برای پایتون';
      description = 'کتابخانه پایتونی بدون وابستگی برای پاکسازی متون فارسی، اعتبارسنجی کد ملی، کارت بانکی، تقویم نجومی جلالی، محاسبات مالی و حفظ امنیت داده‌های حساس.';
    } else if (lang === 'es') {
      title = 'ParsiKit — Infraestructura de Datos en Persa para Python';
      description = 'Biblioteca pura de Python sin dependencias para normalización de texto persa, validación de códigos nacionales y tarjetas bancarias, calendario Jalalí y seguridad de datos.';
    } else {
      title = 'ParsiKit — Persian Data Infrastructure for Python';
      description = 'Production-grade, zero-dependency Python library for Persian text normalization, national checksums, astronomical Jalali calendar, financial calculations, and sensitive data masking.';
    }
  } else if (route === 'playground') {
    if (lang === 'fa') {
      title = 'محیط آزمایشی زنده — پارسی‌کیت';
      description = 'تست آنلاین الگوریتم‌های پارسی‌کیت در مرورگر: پاکسازی نیم‌فاصله، اعتبارسنجی کد ملی، کارت بانکی، تبدیل تاریخ و عدد به حروف.';
    } else if (lang === 'es') {
      title = 'Estudio de Diagnóstico y Pruebas — ParsiKit';
      description = 'Prueba en vivo los algoritmos de ParsiKit en tu navegador: normalización de texto persa, verificación Luhn de tarjeta bancaria, calendario Jalalí y números a palabras.';
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

    alternateEsUrl = activeDoc.lang === 'es'
      ? `${BASE_SITE_URL}/es/docs/${activeDoc.slug}`
      : activeDoc.counterparts?.es
      ? `${BASE_SITE_URL}/es/docs/${activeDoc.counterparts.es}`
      : undefined;
  } else if (route === 'architecture') {
    if (lang === 'fa') {
      title = 'معماری فنی و طراحی لایه‌ای — پارسی‌کیت';
      description = 'بررسی معماری فنی پارسی‌کیت: صفر وابستگی، سیستم کش چندنخی (Thread-safe LRU Cache) و طراحی مدل‌های شیءگرا.';
    } else if (lang === 'es') {
      title = 'Arquitectura Técnica y Diseño de Capas — ParsiKit';
      description = 'Análisis detallado de los principios de diseño de ParsiKit: cero dependencias externas, caché LRU seguro para hilos y modelos de dominio.';
    } else {
      title = 'Technical Architecture & Layer Design — ParsiKit';
      description = 'Deep dive into ParsiKit architectural principles: zero dependencies, thread-safe in-memory caching, and domain-driven design.';
    }
  } else if (route === 'changelog') {
    if (lang === 'fa') {
      title = 'تاریخچه تغییرات و نسخه‌ها — پارسی‌کیت';
      description = 'گزارش کامل تغییرات، اصلاحات امنیتی و قابلیت‌های جدید نسخه‌های مختلف کتابخانه پارسی‌کیت.';
    } else if (lang === 'es') {
      title = 'Historial de Cambios y Versiones — ParsiKit';
      description = 'Historial completo de versiones, parches de seguridad y mejoras continuas de ParsiKit según Versionado Semántico.';
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
    alternateEsUrl,
    schemaType,
    headline: activeDoc ? activeDoc.title : undefined,
  };
}

export function updateDocumentHead(meta: SeoMetadata, lang: AppLang) {
  if (typeof document === 'undefined') return;

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

  // Hreflang alternates: En
  let hreflangEn = document.querySelector('link[rel="alternate"][hreflang="en"]');
  if (meta.alternateEnUrl) {
    if (!hreflangEn) {
      hreflangEn = document.createElement('link');
      hreflangEn.setAttribute('rel', 'alternate');
      hreflangEn.setAttribute('hreflang', 'en');
      document.head.appendChild(hreflangEn);
    }
    hreflangEn.setAttribute('href', meta.alternateEnUrl);
  } else if (hreflangEn) {
    hreflangEn.remove();
  }

  // Hreflang alternates: Fa
  let hreflangFa = document.querySelector('link[rel="alternate"][hreflang="fa"]');
  if (meta.alternateFaUrl) {
    if (!hreflangFa) {
      hreflangFa = document.createElement('link');
      hreflangFa.setAttribute('rel', 'alternate');
      hreflangFa.setAttribute('hreflang', 'fa');
      document.head.appendChild(hreflangFa);
    }
    hreflangFa.setAttribute('href', meta.alternateFaUrl);
  } else if (hreflangFa) {
    hreflangFa.remove();
  }

  // Hreflang alternates: Es
  let hreflangEs = document.querySelector('link[rel="alternate"][hreflang="es"]');
  if (meta.alternateEsUrl) {
    if (!hreflangEs) {
      hreflangEs = document.createElement('link');
      hreflangEs.setAttribute('rel', 'alternate');
      hreflangEs.setAttribute('hreflang', 'es');
      document.head.appendChild(hreflangEs);
    }
    hreflangEs.setAttribute('href', meta.alternateEsUrl);
  } else if (hreflangEs) {
    hreflangEs.remove();
  }

  // Update html lang & dir
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
}
