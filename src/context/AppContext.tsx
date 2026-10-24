import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { ALL_DOCS, type DocEntry } from '../data/docsManifest';
import {
  type PageRoute,
  type AppLang,
  type DocResolution,
  parseCurrentUrl,
  buildRoutePath,
  resolveDocument,
  VALID_LANGS,
} from '../lib/router';
import { computePageMetadata, updateDocumentHead, getDeploymentBasePath } from '../lib/seo';
import { LOCALES, isRtlPrefix } from '../i18n/config';

interface AppContextType {
  lang: AppLang;
  setLang: (lang: AppLang) => void;
  toggleLang: () => void;
  isRtl: boolean;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  route: PageRoute;
  setRoute: (route: PageRoute) => void;
  activeDocSlug: string;
  setActiveDocSlug: (slug: string) => void;
  activeDoc: DocEntry | null;
  docResolution: DocResolution | null;
  navigateToDoc: (slug: string, targetLang?: AppLang, options?: { query?: string; hash?: string }) => void;
  navigate: (route: PageRoute, docSlug?: string, targetLang?: AppLang, options?: { query?: string; hash?: string }) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  openSearch: () => void;
  closeSearch: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // Initial URL parsing
  const initial = useMemo(() => parseCurrentUrl(), []);

  const [lang, setLangState] = useState<AppLang>(initial.lang);
  const [route, setRouteState] = useState<PageRoute>(initial.route);
  const [activeDocSlug, setActiveDocSlugState] = useState<string>(initial.docSlug || 'index');

  // Theme state: read safely from localStorage or system preference
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('parsikit_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isRtl = useMemo(() => isRtlPrefix(lang), [lang]);

  // Active doc lookup with explicit existence and missing-translation semantics
  const docResolution = useMemo<DocResolution | null>(() => {
    if (route !== 'docs') return null;
    return resolveDocument(lang, activeDocSlug);
  }, [lang, activeDocSlug, route]);

  const activeDoc = useMemo<DocEntry | null>(() => {
    if (route !== 'docs') return null;
    return docResolution?.doc || null;
  }, [route, docResolution]);

  // Sync document head, html dir, and SEO metadata
  useEffect(() => {
    const meta = computePageMetadata(lang, route, activeDoc);
    updateDocumentHead(meta, lang);
    localStorage.setItem('parsikit_lang', lang);
  }, [lang, route, activeDoc]);

  // Sync theme without clobbering body classes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('parsikit_theme', theme);
    }
  }, [theme]);

  // Listen to popstate (browser back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseCurrentUrl();
      setLangState(parsed.lang);
      setRouteState(parsed.route);
      if (parsed.docSlug) {
        setActiveDocSlugState(parsed.docSlug);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Programmatic navigation with query string & hash support
  const navigate = (
    newRoute: PageRoute,
    docSlug?: string,
    targetLang?: AppLang,
    options?: { query?: string; hash?: string }
  ) => {
    const effectiveLang = targetLang || lang;
    const effectiveSlug = docSlug || (newRoute === 'docs' ? activeDocSlug : undefined);

    // Validate doc existence if navigating to docs
    let finalRoute = newRoute;
    if (newRoute === 'docs' && effectiveSlug) {
      const res = resolveDocument(effectiveLang, effectiveSlug);
      if (res.status === 'not-found') {
        finalRoute = 'not-found';
      }
    }

    const newPath = buildRoutePath(effectiveLang, finalRoute, effectiveSlug, options);
    const fullBrowserPath = `${getDeploymentBasePath()}${newPath}`;

    if (
      typeof window !== 'undefined' &&
      window.location.pathname + window.location.search + window.location.hash !== fullBrowserPath
    ) {
      window.history.pushState(null, '', fullBrowserPath);
    }

    if (targetLang && targetLang !== lang) {
      setLangState(targetLang);
    }
    setRouteState(finalRoute);
    if (effectiveSlug) {
      setActiveDocSlugState(effectiveSlug);
    }
  };

  const setRoute = (newRoute: PageRoute) => {
    navigate(newRoute, activeDocSlug, lang);
  };

  const setActiveDocSlug = (slug: string) => {
    navigate('docs', slug, lang);
  };

  const navigateToDoc = (slug: string, targetLang?: AppLang, options?: { query?: string; hash?: string }) => {
    navigate('docs', slug, targetLang || lang, options);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const setLang = (newLang: AppLang) => {
    if (newLang === lang) return;
    let targetDocSlug = activeDocSlug;
    if (route === 'docs') {
      if (activeDoc?.counterparts?.[newLang]) {
        targetDocSlug = activeDoc.counterparts[newLang]!;
      } else {
        // Translation not available in newLang; preserve slug so user sees the fallback banner
        targetDocSlug = activeDocSlug;
      }
    }
    navigate(route, targetDocSlug, newLang);
  };

  const toggleLang = () => {
    const nextIdx = (VALID_LANGS.indexOf(lang) + 1) % VALID_LANGS.length;
    setLang(VALID_LANGS[nextIdx]);
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  // Global keyboard shortcut: Cmd+K / Ctrl+K or / to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        isRtl,
        theme,
        setTheme,
        toggleTheme,
        route,
        setRoute,
        activeDocSlug,
        setActiveDocSlug,
        activeDoc,
        docResolution,
        navigateToDoc,
        navigate,
        isSearchOpen,
        setIsSearchOpen,
        openSearch,
        closeSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
