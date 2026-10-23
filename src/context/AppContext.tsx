import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { ALL_DOCS, type DocEntry } from '../data/docsManifest';
import {
  type PageRoute,
  type AppLang,
  parseCurrentUrl,
  buildRoutePath,
  VALID_LANGS,
} from '../lib/router';
import { computePageMetadata, updateDocumentHead } from '../lib/seo';

interface AppContextType {
  lang: AppLang;
  setLang: (lang: AppLang) => void;
  toggleLang: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  route: PageRoute;
  setRoute: (route: PageRoute) => void;
  activeDocSlug: string;
  setActiveDocSlug: (slug: string) => void;
  activeDoc: DocEntry | null;
  navigateToDoc: (slug: string, targetLang?: AppLang) => void;
  navigate: (route: PageRoute, docSlug?: string, targetLang?: AppLang) => void;
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

  // Active doc lookup with multilingual fallbacks
  const activeDoc = useMemo(() => {
    const exactMatch = ALL_DOCS.find((d) => d.lang === lang && d.slug === activeDocSlug);
    if (exactMatch) return exactMatch;

    // Check if another lang has this slug and has a counterpart
    const otherLangDoc = ALL_DOCS.find((d) => d.slug === activeDocSlug);
    if (otherLangDoc?.counterpartSlug) {
      const counterpart = ALL_DOCS.find((d) => d.lang === lang && d.slug === otherLangDoc.counterpartSlug);
      if (counterpart) return counterpart;
    }

    // Fallback to first doc in current lang or global first
    return ALL_DOCS.find((d) => d.lang === lang) || ALL_DOCS[0] || null;
  }, [lang, activeDocSlug]);

  // Sync document head and SEO metadata
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

  // Programmatic navigation
  const navigate = (newRoute: PageRoute, docSlug?: string, targetLang?: AppLang) => {
    const effectiveLang = targetLang || lang;
    const newPath = buildRoutePath(effectiveLang, newRoute, docSlug);

    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }

    if (targetLang && targetLang !== lang) {
      setLangState(targetLang);
    }
    setRouteState(newRoute);
    if (docSlug) {
      setActiveDocSlugState(docSlug);
    }
  };

  const setRoute = (newRoute: PageRoute) => {
    navigate(newRoute, activeDocSlug, lang);
  };

  const setActiveDocSlug = (slug: string) => {
    navigate('docs', slug, lang);
  };

  const navigateToDoc = (slug: string, targetLang?: AppLang) => {
    navigate('docs', slug, targetLang || lang);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setLang = (newLang: AppLang) => {
    if (newLang === lang) return;
    let targetDocSlug = activeDocSlug;
    if (route === 'docs' && activeDoc?.counterpartSlug) {
      targetDocSlug = activeDoc.counterpartSlug;
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
        theme,
        setTheme,
        toggleTheme,
        route,
        setRoute,
        activeDocSlug,
        setActiveDocSlug,
        activeDoc,
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
