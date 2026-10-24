import React, { useState } from 'react';
import {
  Search,
  Github,
  Sun,
  Moon,
  Menu,
  X,
  BookOpen,
  Terminal,
  Layers,
  History,
  Languages,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { type PageRoute, type AppLang } from '../lib/router';
import { LOCALES } from '../i18n/config';
import { getTranslations } from '../i18n/translations';
import { MOTION_TRANSITIONS } from '../lib/motion';
import { REPO_METADATA } from '../data/repoMetadata';

export function Header() {
  const { lang, setLang, theme, toggleTheme, route, setRoute, openSearch, isRtl } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const t = getTranslations(lang);

  const navItems: {
    id: PageRoute;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'home',
      label: t.nav.home,
    },
    {
      id: 'playground',
      label: t.nav.playground,
      icon: Terminal,
    },
    {
      id: 'docs',
      label: t.nav.docs,
      icon: BookOpen,
    },
    {
      id: 'architecture',
      label: t.nav.architecture,
      icon: Layers,
    },
    {
      id: 'changelog',
      label: t.nav.changelog,
      icon: History,
    },
  ];

  const handleNavClick = (targetRoute: PageRoute) => {
    setRoute(targetRoute);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const languagesList: { code: AppLang; label: string; short: string; scriptHint: string }[] = [
    { code: 'fa', label: LOCALES.fa.nameNative, short: LOCALES.fa.shortCode, scriptHint: 'Perso-Arabic' },
    { code: 'en', label: LOCALES.en.nameNative, short: LOCALES.en.shortCode, scriptHint: 'Latin' },
    { code: 'prs-af', label: LOCALES['prs-af'].nameNative, short: LOCALES['prs-af'].shortCode, scriptHint: 'Perso-Arabic (Dari)' },
    { code: 'tg', label: LOCALES.tg.nameNative, short: LOCALES.tg.shortCode, scriptHint: 'Cyrillic (Тоҷикӣ)' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FAF7F2]/90 dark:bg-[#0E1413]/90 border-b border-stone-200/80 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-2.5 text-left rtl:text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#126E68] rounded-xl p-1 transition-opacity hover:opacity-90 cursor-pointer min-h-[44px]"
            aria-label="ParsiKit Home"
          >
            <img
              src={`${import.meta.env.BASE_URL}parsikit-logo.png`}
              alt="ParsiKit Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-sm"
              width="36"
              height="36"
            />
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-base sm:text-lg tracking-tight text-stone-900 dark:text-white">
                  ParsiKit
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-[#126E68] dark:text-[#52C5BE]">
                  v{REPO_METADATA.version}
                </span>
              </div>
              <span className="hidden sm:inline-block text-[10px] text-stone-500 dark:text-stone-400 font-medium leading-none">
                {t.nav.tagline}
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = route === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition-colors py-2 relative cursor-pointer min-h-[44px] flex items-center ${
                  isActive
                    ? 'text-[#126E68] dark:text-[#52C5BE] font-semibold'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#126E68] dark:bg-[#52C5BE] rounded-full"
                    transition={MOTION_TRANSITIONS.spring}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions Cluster: Search, Language Switcher, Theme Toggle, GitHub, Mobile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={openSearch}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-white/5 hover:bg-stone-200/70 dark:hover:bg-white/10 border border-stone-200 dark:border-white/5 transition-colors cursor-pointer min-h-[44px]"
            aria-label={t.nav.searchDocs}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline-block">
              {t.nav.searchDocs}
            </span>
            <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-black/30 border border-stone-200 dark:border-white/10 text-stone-400">
              ⌘K
            </kbd>
          </button>

          {/* 4-Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/5 border border-stone-200 dark:border-white/10 transition-colors cursor-pointer min-h-[44px]"
              aria-label="Select Language"
              aria-expanded={langMenuOpen}
            >
              <Languages className="w-3.5 h-3.5 text-[#126E68] dark:text-[#52C5BE]" />
              <span className="font-semibold uppercase">{LOCALES[lang]?.shortCode || lang}</span>
            </button>

            {langMenuOpen && (
              <div
                className="absolute top-full mt-2 end-0 w-48 rounded-xl border border-stone-200 dark:border-white/10 bg-[#FAF7F2] dark:bg-[#141B19] shadow-xl p-1.5 z-50 text-xs"
                onMouseLeave={() => setLangMenuOpen(false)}
              >
                <div className="px-2 py-1 text-[10px] font-mono text-stone-400 uppercase tracking-wider border-b border-stone-200/60 dark:border-white/5 mb-1">
                  {t.nav.language}
                </div>
                {languagesList.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-start px-2.5 py-2 rounded-lg font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      lang === l.code
                        ? 'bg-[#126E68]/10 text-[#126E68] dark:text-[#52C5BE] font-bold'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold">{l.label}</span>
                      <span className="text-[10px] opacity-60 font-sans">{l.scriptHint}</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-1 py-0.5 rounded bg-stone-200/60 dark:bg-white/10">
                      {l.short}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5 border border-stone-200 dark:border-white/10 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#D4A03D]" />
            ) : (
              <Moon className="w-4 h-4 text-[#1D3D63]" />
            )}
          </button>

          {/* GitHub Repository Link */}
          <a
            href="https://github.com/MRThugh/ParsiKit"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 p-2 rounded-xl text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/5 border border-stone-200 dark:border-white/10 transition-colors min-h-[44px] min-w-[44px] justify-center"
            aria-label="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/5 border border-stone-200 dark:border-white/10 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-expanded={mobileMenuOpen}
            aria-label={isRtl ? 'منوی اصلی' : 'Toggle main menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer with Motion */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={MOTION_TRANSITIONS.fast}
            className="md:hidden border-t border-stone-200 dark:border-white/10 bg-[#FAF7F2] dark:bg-[#0E1413] px-4 pt-3 pb-5 space-y-1 shadow-lg overflow-hidden"
          >
            {navItems.map((item) => {
              const isActive = route === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer min-h-[44px] ${
                    isActive
                      ? 'bg-[#126E68]/10 text-[#126E68] dark:text-[#52C5BE] font-bold'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Mobile language options for all 4 languages */}
            <div className="pt-3 border-t border-stone-200 dark:border-white/10">
              <span className="text-xs text-stone-500 block mb-2">{t.nav.language}</span>
              <div className="grid grid-cols-2 gap-2">
                {languagesList.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between min-h-[44px] ${
                      lang === l.code
                        ? 'bg-[#126E68] text-white shadow-sm'
                        : 'bg-stone-200/70 dark:bg-white/10 text-stone-700 dark:text-stone-200'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-[10px] opacity-75 font-mono">{l.short}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 dark:border-white/10 flex items-center justify-between text-xs text-stone-500">
              <a
                href="https://github.com/MRThugh/ParsiKit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 py-1 text-stone-700 dark:text-stone-300 min-h-[44px]"
              >
                <Github className="w-4 h-4" />
                <span>MRThugh / ParsiKit</span>
              </a>
              <span className="font-mono">v{REPO_METADATA.version}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
