/**
 * Path-Based Client Router for ParsiKit
 * Supports:
 * - /en, /fa, and /es (Home)
 * - /en/playground, /fa/playground, /es/playground
 * - /en/docs/:slug, /fa/docs/:slug, /es/docs/:slug
 * - /en/architecture, /fa/architecture, /es/architecture
 * - /en/changelog, /fa/changelog, /es/changelog
 * - Legacy hash fallback (/#docs/... -> /en/docs/...)
 */

export type PageRoute = 'home' | 'docs' | 'playground' | 'architecture' | 'changelog';
export type AppLang = 'en' | 'fa' | 'es';

export interface RouteState {
  lang: AppLang;
  route: PageRoute;
  docSlug?: string;
}

export const VALID_LANGS: AppLang[] = ['en', 'fa', 'es'];

export function parseRoutePath(pathname: string): RouteState {
  const path = pathname.replace(/^\/|\/$/g, '');
  if (!path) {
    return { lang: 'en', route: 'home' };
  }

  const segments = path.split('/');
  const first = segments[0];

  let lang: AppLang = 'en';
  if (first === 'fa') lang = 'fa';
  else if (first === 'es') lang = 'es';
  else lang = 'en';

  const remaining = (first === 'en' || first === 'fa' || first === 'es') ? segments.slice(1) : segments;

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
    return { lang: 'en', route: 'home' };
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

  // 2. Parse pathname
  const path = window.location.pathname.replace(/^\/|\/$/g, '');
  if (!path) {
    const saved = localStorage.getItem('parsikit_lang') as AppLang | null;
    const initialLang = saved && VALID_LANGS.includes(saved) ? saved : 'en';
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
