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
import { ALL_DOCS, type DocEntry } from '../data/docsManifest';
import { getDeploymentBasePath } from '../config/site';

export type PageRoute = 'home' | 'docs' | 'playground' | 'architecture' | 'changelog' | 'not-found';
export type AppLang = LangPrefix;

export type DocResolutionStatus = 'exact' | 'fallback' | 'not-found';

export interface DocResolution {
  status: DocResolutionStatus;
  doc: DocEntry | null;
  requestedSlug: string;
  requestedLang: AppLang;
  resolvedLang?: AppLang;
  availableLangs: AppLang[];
  isDevelopmentOnly?: boolean;
}

export interface RouteState {
  lang: AppLang;
  route: PageRoute;
  docSlug?: string;
  isLegacyRedirect?: boolean;
  redirectTarget?: string;
  docResolution?: DocResolution;
  query?: string;
  hash?: string;
}

export const VALID_LANGS: AppLang[] = [...SUPPORTED_LANG_PREFIXES];

/**
 * Resolves document existence semantics:
 * - 'exact': Document exists in the requested locale
 * - 'fallback': Document exists only in another locale (e.g. English development docs)
 * - 'not-found': Document does not exist in any locale
 */
export function resolveDocument(requestedLang: AppLang, rawSlug: string): DocResolution {
  const cleanSlug = rawSlug.replace(/^\/+|\/+$/g, '').replace(/\.md$/, '') || 'index';

  // 1. Exact match in requested language
  const exactDoc = ALL_DOCS.find((d) => d.lang === requestedLang && d.slug === cleanSlug);
  if (exactDoc) {
    const availableLangs = ALL_DOCS.filter((d) => d.slug === cleanSlug).map((d) => d.lang);
    return {
      status: 'exact',
      doc: exactDoc,
      requestedSlug: cleanSlug,
      requestedLang,
      resolvedLang: requestedLang,
      availableLangs,
      isDevelopmentOnly: exactDoc.category === 'development',
    };
  }

  // 2. Check if doc exists in any other language
  const allMatchesForSlug = ALL_DOCS.filter((d) => d.slug === cleanSlug);
  if (allMatchesForSlug.length > 0) {
    const availableLangs = allMatchesForSlug.map((d) => d.lang);
    // Prefer English as primary technical fallback, otherwise first available
    const fallbackDoc = allMatchesForSlug.find((d) => d.lang === 'en') || allMatchesForSlug[0];
    return {
      status: 'fallback',
      doc: fallbackDoc,
      requestedSlug: cleanSlug,
      requestedLang,
      resolvedLang: fallbackDoc.lang,
      availableLangs,
      isDevelopmentOnly: fallbackDoc.category === 'development',
    };
  }

  // 3. Document does not exist in any locale
  return {
    status: 'not-found',
    doc: null,
    requestedSlug: cleanSlug,
    requestedLang,
    availableLangs: [],
    isDevelopmentOnly: false,
  };
}

/**
 * Checks if a pathname is a deprecated Spanish URL and returns the migrated URL.
 */
export function checkLegacyRedirect(pathname: string): string | null {
  const deploymentBase = getDeploymentBasePath();
  let cleanPathname = pathname;
  if (deploymentBase && (cleanPathname === deploymentBase || cleanPathname.startsWith(`${deploymentBase}/`))) {
    cleanPathname = cleanPathname.slice(deploymentBase.length) || '/';
  }

  // Strip query/hash before checking path
  const pathWithoutQuery = cleanPathname.split(/[?#]/)[0];
  const cleanPath = pathWithoutQuery.replace(/^\/|\/$/g, '');
  if (cleanPath === 'es') {
    return '/en';
  }
  if (cleanPath.startsWith('es/')) {
    const afterEs = cleanPath.slice(3); // e.g. "docs/installation" or "playground"
    return `/en/${afterEs}`;
  }
  return null;
}

export function parseRoutePath(rawInput: string, overrideBasePath?: string): RouteState {
  // Extract query and hash
  const hashIdx = rawInput.indexOf('#');
  const pathAndQuery = hashIdx !== -1 ? rawInput.slice(0, hashIdx) : rawInput;
  const hash = hashIdx !== -1 ? rawInput.slice(hashIdx + 1) : undefined;

  const queryIdx = pathAndQuery.indexOf('?');
  const pathname = queryIdx !== -1 ? pathAndQuery.slice(0, queryIdx) : pathAndQuery;
  const query = queryIdx !== -1 ? pathAndQuery.slice(queryIdx + 1) : undefined;

  const deploymentBase = overrideBasePath !== undefined ? overrideBasePath : getDeploymentBasePath();
  let normalizedPathname = pathname;
  if (deploymentBase && (normalizedPathname === deploymentBase || normalizedPathname.startsWith(`${deploymentBase}/`))) {
    normalizedPathname = normalizedPathname.slice(deploymentBase.length) || '/';
  }

  const legacyTarget = checkLegacyRedirect(normalizedPathname);
  if (legacyTarget) {
    const migratedState = parseRoutePath(legacyTarget + (query ? `?${query}` : '') + (hash ? `#${hash}` : ''));
    return {
      ...migratedState,
      isLegacyRedirect: true,
      redirectTarget: legacyTarget + (query ? `?${query}` : '') + (hash ? `#${hash}` : ''),
      query,
      hash,
    };
  }

  const path = normalizedPathname.replace(/^\/|\/$/g, '');
  if (!path) {
    return { lang: DEFAULT_LANG_PREFIX, route: 'home', query, hash };
  }

  const segments = path.split('/');
  const first = segments[0];

  // Case 1: First segment is one of the 4 supported languages
  if (VALID_LANGS.includes(first as AppLang)) {
    const lang = first as AppLang;
    const remaining = segments.slice(1);

    if (remaining.length === 0) {
      return { lang, route: 'home', query, hash };
    }

    const section = remaining[0];
    if (section === 'playground') {
      if (remaining.length > 1) return { lang, route: 'not-found', query, hash };
      return { lang, route: 'playground', query, hash };
    }
    if (section === 'architecture') {
      if (remaining.length > 1) return { lang, route: 'not-found', query, hash };
      return { lang, route: 'architecture', query, hash };
    }
    if (section === 'changelog') {
      if (remaining.length > 1) return { lang, route: 'not-found', query, hash };
      return { lang, route: 'changelog', query, hash };
    }
    if (section === 'docs') {
      const slug = remaining.slice(1).join('/') || 'index';
      const resolution = resolveDocument(lang, slug);
      if (resolution.status === 'not-found') {
        return { lang, route: 'not-found', docSlug: slug, docResolution: resolution, query, hash };
      }
      return { lang, route: 'docs', docSlug: slug, docResolution: resolution, query, hash };
    }
    if (section === '404') {
      return { lang, route: 'not-found', query, hash };
    }

    return { lang, route: 'not-found', query, hash };
  }

  // Case 2: First segment is NOT a supported language
  const defaultLang = DEFAULT_LANG_PREFIX;
  if (first === 'playground') {
    if (segments.length > 1) return { lang: defaultLang, route: 'not-found', query, hash };
    return { lang: defaultLang, route: 'playground', query, hash };
  }
  if (first === 'architecture') {
    if (segments.length > 1) return { lang: defaultLang, route: 'not-found', query, hash };
    return { lang: defaultLang, route: 'architecture', query, hash };
  }
  if (first === 'changelog') {
    if (segments.length > 1) return { lang: defaultLang, route: 'not-found', query, hash };
    return { lang: defaultLang, route: 'changelog', query, hash };
  }
  if (first === 'docs') {
    const slug = segments.slice(1).join('/') || 'index';
    const resolution = resolveDocument(defaultLang, slug);
    if (resolution.status === 'not-found') {
      return { lang: defaultLang, route: 'not-found', docSlug: slug, docResolution: resolution, query, hash };
    }
    return { lang: defaultLang, route: 'docs', docSlug: slug, docResolution: resolution, query, hash };
  }
  if (first === '404') {
    return { lang: defaultLang, route: 'not-found', query, hash };
  }

  // Any other route or unknown language prefix (e.g. /de, /fr, /random)
  return { lang: defaultLang, route: 'not-found', query, hash };
}

export function parseCurrentUrl(): RouteState {
  if (typeof window === 'undefined') {
    return { lang: DEFAULT_LANG_PREFIX, route: 'home' };
  }

  const fullUrl = window.location.pathname + window.location.search + window.location.hash;

  // 1. Check legacy hash (e.g. /#docs/api/validators or /#playground)
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash) {
    if (hash === 'playground') return { lang: 'en', route: 'playground' };
    if (hash === 'architecture') return { lang: 'en', route: 'architecture' };
    if (hash === 'changelog') return { lang: 'en', route: 'changelog' };
    if (hash.startsWith('docs/')) {
      const slug = hash.replace(/^docs\//, '');
      const resolution = resolveDocument('en', slug);
      if (resolution.status === 'not-found') {
        return { lang: 'en', route: 'not-found', docSlug: slug, docResolution: resolution };
      }
      return { lang: 'en', route: 'docs', docSlug: slug, docResolution: resolution };
    }
  }

  // 2. Check legacy Spanish redirect and update browser history cleanly
  const legacyTarget = checkLegacyRedirect(window.location.pathname);
  if (legacyTarget) {
    const deploymentBase = getDeploymentBasePath();
    const finalTarget = `${deploymentBase}${legacyTarget}${window.location.search}${window.location.hash}`;
    window.history.replaceState(null, '', finalTarget);
    return parseRoutePath(legacyTarget + window.location.search + window.location.hash);
  }

  // 3. Parse pathname
  const deploymentBase = getDeploymentBasePath();
  let cleanPath = window.location.pathname;
  if (deploymentBase && (cleanPath === deploymentBase || cleanPath.startsWith(`${deploymentBase}/`))) {
    cleanPath = cleanPath.slice(deploymentBase.length) || '/';
  }
  const path = cleanPath.replace(/^\/|\/$/g, '');
  if (!path) {
    const saved = localStorage.getItem('parsikit_lang') as AppLang | null;
    const initialLang = saved && VALID_LANGS.includes(saved) ? saved : DEFAULT_LANG_PREFIX;
    return { lang: initialLang, route: 'home' };
  }

  return parseRoutePath(fullUrl);
}

export function buildRoutePath(
  lang: AppLang,
  route: PageRoute,
  docSlug?: string,
  options?: { query?: string; hash?: string }
): string {
  let basePath = `/${lang}`;
  if (route === 'docs') {
    const cleanSlug = docSlug || 'index';
    basePath = `/${lang}/docs/${cleanSlug}`;
  } else if (route === 'not-found') {
    basePath = `/${lang}/404`;
  } else if (route !== 'home') {
    basePath = `/${lang}/${route}`;
  }

  const queryPart = options?.query ? `?${options.query.replace(/^\?/, '')}` : '';
  const hashPart = options?.hash ? `#${options.hash.replace(/^#/, '')}` : '';

  return `${basePath}${queryPart}${hashPart}`;
}
