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

export type PageRoute = 'home' | 'docs' | 'playground' | 'architecture' | 'changelog';
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

  let lang: AppLang = DEFAULT_LANG_PREFIX;
  if (VALID_LANGS.includes(first as AppLang)) {
    lang = first as AppLang;
  }

  const remaining = VALID_LANGS.includes(first as AppLang) ? segments.slice(1) : segments;

  if (remaining.length === 0) {
    return { lang, route: 'home' };
  }

  const section = remaining[0];
  if (section === 'playground') {
    return { lang, route: 'playground' };
  }
  if (section === 'architecture') {
    return { lang, route: 'architecture' };
  }
  if (section === 'changelog') {
    return { lang, route: 'changelog' };
  }
  if (section === 'docs') {
    const slug = remaining.slice(1).join('/') || 'index';
    return { lang, route: 'docs', docSlug: slug };
  }

  return { lang, route: 'home' };
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
  return `/${lang}/${route}`;
}
