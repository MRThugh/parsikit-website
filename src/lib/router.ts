/**
 * Path-Based Client Router for ParsiKit
 * Supports exactly four official languages:
 * - /fa (Persian - Iran)
 * - /en (English)
 * - /prs-af (Dari - Afghanistan)
 * - /tg (Tajik - Tajikistan)
 *
 * Implements strict migration/redirect handling for deprecated legacy /es/* URLs.
 */

import { type LangPrefix, SUPPORTED_LANG_PREFIXES, DEFAULT_LANG_PREFIX } from '../i18n/config';
import { ALL_DOCS } from '../data/docsManifest';

export type PageRoute = 'home' | 'docs' | 'playground' | 'architecture' | 'changelog' | 'not-found';
export type AppLang = LangPrefix;

export interface RouteState {
  lang: AppLang;
  route: PageRoute;
  docSlug?: string;
  isLegacyRedirect?: boolean;
  redirectTarget?: string;
}

export const VALID_LANGS: AppLang[] = [...SUPPORTED_LANG_PREFIXES];

/**
 * Checks if a pathname is a deprecated Spanish URL and returns the migrated URL.
 */
export function checkLegacyRedirect(pathname: string): string | null {
  const cleanPath = pathname.replace(/^\/|\/$/g, '');
  if (cleanPath === 'es') {
    return '/en';
  }
  if (cleanPath.startsWith('es/')) {
    const afterEs = cleanPath.slice(3); // e.g. "docs/installation" or "playground"
    return `/en/${afterEs}`;
  }
  return null;
}

export function parseRoutePath(pathname: string): RouteState {
  const legacyTarget = checkLegacyRedirect(pathname);
  if (legacyTarget) {
    const migratedState = parseRoutePath(legacyTarget);
    return {
      ...migratedState,
      isLegacyRedirect: true,
      redirectTarget: legacyTarget,
    };
  }

  const path = pathname.replace(/^\/|\/$/g, '');
  if (!path) {
    return { lang: DEFAULT_LANG_PREFIX, route: 'home' };
  }

  const segments = path.split('/');
  const first = segments[0];

  // Case 1: First segment is one of the 4 supported languages
  if (VALID_LANGS.includes(first as AppLang)) {
    const lang = first as AppLang;
    const remaining = segments.slice(1);

    if (remaining.length === 0) {
      return { lang, route: 'home' };
    }

    const section = remaining[0];
    if (section === 'playground') {
      if (remaining.length > 1) return { lang, route: 'not-found' };
      return { lang, route: 'playground' };
    }
    if (section === 'architecture') {
      if (remaining.length > 1) return { lang, route: 'not-found' };
      return { lang, route: 'architecture' };
    }
    if (section === 'changelog') {
      if (remaining.length > 1) return { lang, route: 'not-found' };
      return { lang, route: 'changelog' };
    }
    if (section === 'docs') {
      const slug = remaining.slice(1).join('/') || 'index';
      const docExists = ALL_DOCS.some((d) => d.slug === slug);
      if (!docExists) {
        return { lang, route: 'not-found', docSlug: slug };
      }
      return { lang, route: 'docs', docSlug: slug };
    }
    if (section === '404') {
      return { lang, route: 'not-found' };
    }

    return { lang, route: 'not-found' };
  }

  // Case 2: First segment is NOT a supported language
  const defaultLang = DEFAULT_LANG_PREFIX;
  if (first === 'playground') {
    if (segments.length > 1) return { lang: defaultLang, route: 'not-found' };
    return { lang: defaultLang, route: 'playground' };
  }
  if (first === 'architecture') {
    if (segments.length > 1) return { lang: defaultLang, route: 'not-found' };
    return { lang: defaultLang, route: 'architecture' };
  }
  if (first === 'changelog') {
    if (segments.length > 1) return { lang: defaultLang, route: 'not-found' };
    return { lang: defaultLang, route: 'changelog' };
  }
  if (first === 'docs') {
    const slug = segments.slice(1).join('/') || 'index';
    const docExists = ALL_DOCS.some((d) => d.slug === slug);
    if (!docExists) {
      return { lang: defaultLang, route: 'not-found', docSlug: slug };
    }
    return { lang: defaultLang, route: 'docs', docSlug: slug };
  }
  if (first === '404') {
    return { lang: defaultLang, route: 'not-found' };
  }

  // Any other route or unknown language prefix (e.g. /de, /fr, /random)
  return { lang: defaultLang, route: 'not-found' };
}

export function parseCurrentUrl(): RouteState {
  if (typeof window === 'undefined') {
    return { lang: DEFAULT_LANG_PREFIX, route: 'home' };
  }

  // 1. Check legacy hash (e.g. /#docs/api/validators or /#playground)
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash) {
    if (hash === 'playground') return { lang: 'en', route: 'playground' };
    if (hash === 'architecture') return { lang: 'en', route: 'architecture' };
    if (hash === 'changelog') return { lang: 'en', route: 'changelog' };
    if (hash.startsWith('docs/')) {
      const slug = hash.replace(/^docs\//, '');
      const docExists = ALL_DOCS.some((d) => d.slug === slug);
      if (!docExists) {
        return { lang: 'en', route: 'not-found', docSlug: slug };
      }
      return { lang: 'en', route: 'docs', docSlug: slug };
    }
  }

  // 2. Check legacy Spanish redirect and update browser history cleanly
  const legacyTarget = checkLegacyRedirect(window.location.pathname);
  if (legacyTarget) {
    window.history.replaceState(null, '', legacyTarget);
    return parseRoutePath(legacyTarget);
  }

  // 3. Parse pathname
  const path = window.location.pathname.replace(/^\/|\/$/g, '');
  if (!path) {
    const saved = localStorage.getItem('parsikit_lang') as AppLang | null;
    const initialLang = saved && VALID_LANGS.includes(saved) ? saved : DEFAULT_LANG_PREFIX;
    return { lang: initialLang, route: 'home' };
  }

  return parseRoutePath(window.location.pathname);
}

export function buildRoutePath(lang: AppLang, route: PageRoute, docSlug?: string): string {
  if (route === 'home') {
    return `/${lang}`;
  }
  if (route === 'docs') {
    const cleanSlug = docSlug || 'index';
    return `/${lang}/docs/${cleanSlug}`;
  }
  if (route === 'not-found') {
    return `/${lang}/404`;
  }
  return `/${lang}/${route}`;
}
