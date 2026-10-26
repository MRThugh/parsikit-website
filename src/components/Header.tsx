import React, { useState, useEffect, useRef } from 'react';
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
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { type PageRoute, type AppLang } from '../lib/router';
import { LOCALES } from '../i18n/config';
import { getTranslations } from '../i18n/translations';
import { REPO_METADATA } from '../data/repoMetadata';

export function Header() {
  const { lang, setLang, theme, toggleTheme, route, setRoute, openSearch, isRtl } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const langButtonRef = useRef<HTMLButtonElement>(null);

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
    { code: 'fa', label: LOCALES.fa.nameNative, short: LOCALES.fa.shortCode, scriptHint: 'Perso-Arabic (فارسی)' },
    { code: 'en', label: LOCALES.en.nameNative, short: LOCALES.en.shortCode, scriptHint: 'Latin (English)' },
    { code: 'prs-af', label: LOCALES['prs-af'].nameNative, short: LOCALES['prs-af'].shortCode, scriptHint: 'Perso-Arabic (دری)' },
    { code: 'tg', label: LOCALES.tg.nameNative, short: LOCALES.tg.shortCode, scriptHint: 'Cyrillic (Тоҷикӣ)' },
  ];

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && langMenuOpen) {
        setLangMenuOpen(false);
        langButtonRef.current?.focus();
      }
    };

    if (langMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [langMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#F7F4EC]/92 dark:bg-[#0D1715]/92 border-b border-[#DCD5C6]/80 dark:border-[#30443D]/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-2.5 text-left rtl:text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176B65] dark:focus-visible:ring-[#69C5B7] rounded-xl p-1 transition-opacity hover:opacity-90 cursor-pointer min-h-[44px]"
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
                <span className="font-bold text-base sm:text-lg tracking-tight text-[#202D29] dark:text-[#F0F3EC]">
                  ParsiKit
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-[#176B65] dark:text-[#69C5B7] font-semibold">
                  v{REPO_METADATA.version}
                </span>
              </div>
              <span className="hidden sm:inline-block text-[10px] text-[#596760] dark:text-[#B1C0B8] font-medium leading-none">
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
                className={`text-sm font-medium transition-colors py-2 relative cursor-pointer min-h-[44px] flex items-center whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-[#176B65] dark:text-[#69C5B7] font-semibold'
                    : 'text-[#596760] dark:text-[#B1C0B8] hover:text-[#202D29] dark:hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#176B65] dark:bg-[#69C5B7] rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions Cluster: Search, Animated Language Switcher, Theme Toggle, GitHub, Mobile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={openSearch}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs text-[#596760] dark:text-[#B1C0B8] bg-[#EFE9DB]/70 dark:bg-[#182A26] hover:bg-[#E5DEC9] dark:hover:bg-[#20352F] border border-[#DCD5C6] dark:border-[#30443D] transition-colors cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176B65] dark:focus-visible:ring-[#69C5B7]"
            aria-label={t.nav.searchDocs}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline-block whitespace-nowrap">
              {t.nav.searchDocs}
            </span>
            <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-[#101D1A] border border-[#DCD5C6] dark:border-[#30443D] text-[#7A8C85] dark:text-[#788E84]">
              ⌘K
            </kbd>
          </button>

          {/* Animated 4-Language Selector Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button
              ref={langButtonRef}
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-[#202D29] dark:text-[#F0F3EC] bg-white/60 dark:bg-[#182A26] hover:bg-[#EFE9DB] dark:hover:bg-[#20352F] border border-[#DCD5C6] dark:border-[#30443D] transition-colors cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176B65] dark:focus-visible:ring-[#69C5B7]"
              aria-label="Select Language"
              aria-haspopup="listbox"
              aria-expanded={langMenuOpen}
            >
              <Languages className="w-3.5 h-3.5 text-[#176B65] dark:text-[#69C5B7]" />
              <span className="font-semibold uppercase tracking-wider">{LOCALES[lang]?.shortCode || lang}</span>
            </button>

            <AnimatePresence>
              {langMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  role="listbox"
                  aria-label="Select Language"
                  className="absolute top-full mt-2 end-0 w-52 rounded-xl border border-[#DCD5C6] dark:border-[#30443D] bg-[#FFFFFF] dark:bg-[#182A26] shadow-xl p-1.5 z-50 text-xs"
                >
                  <div className="px-2 py-1 text-[10px] font-mono text-[#7A8C85] dark:text-[#788E84] uppercase tracking-wider border-b border-[#DCD5C6]/60 dark:border-[#30443D] mb-1">
                    {t.nav.language}
                  </div>
                  {languagesList.map((l) => {
                    const isSelected = lang === l.code;
                    return (
                      <button
                        key={l.code}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setLang(l.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-start px-2.5 py-2 rounded-lg font-medium transition-colors flex items-center justify-between cursor-pointer min-h-[40px] ${
                          isSelected
                            ? 'bg-[#176B65]/10 text-[#176B65] dark:bg-[#69C5B7]/15 dark:text-[#69C5B7] font-bold'
                            : 'text-[#202D29] dark:text-[#F0F3EC] hover:bg-[#EFE9DB] dark:hover:bg-[#20352F]'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold">{l.label}</span>
                          <span className="text-[10px] text-[#596760] dark:text-[#B1C0B8]">{l.scriptHint}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#176B65] dark:text-[#69C5B7]" />}
                          <span className="text-[10px] uppercase font-mono px-1 py-0.5 rounded bg-[#EFE9DB] dark:bg-[#20352F] text-[#596760] dark:text-[#B1C0B8]">
                            {l.short}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[#596760] dark:text-[#B1C0B8] bg-white/60 dark:bg-[#182A26] hover:bg-[#EFE9DB] dark:hover:bg-[#20352F] border border-[#DCD5C6] dark:border-[#30443D] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176B65] dark:focus-visible:ring-[#69C5B7]"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#D6B36A]" />
            ) : (
              <Moon className="w-4 h-4 text-[#1D3D63]" />
            )}
          </button>

          {/* GitHub Repository Link */}
          <a
            href="https://github.com/MRThugh/ParsiKit"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 p-2 rounded-xl text-[#202D29] dark:text-[#F0F3EC] bg-white/60 dark:bg-[#182A26] hover:bg-[#EFE9DB] dark:hover:bg-[#20352F] border border-[#DCD5C6] dark:border-[#30443D] transition-colors min-h-[44px] min-w-[44px] justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176B65] dark:focus-visible:ring-[#69C5B7]"
            aria-label="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#202D29] dark:text-[#F0F3EC] bg-white/60 dark:bg-[#182A26] hover:bg-[#EFE9DB] dark:hover:bg-[#20352F] border border-[#DCD5C6] dark:border-[#30443D] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176B65] dark:focus-visible:ring-[#69C5B7]"
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
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-[#DCD5C6] dark:border-[#30443D] bg-[#F7F4EC] dark:bg-[#0D1715] px-4 pt-3 pb-5 space-y-1 shadow-lg overflow-hidden"
          >
            {navItems.map((item) => {
              const isActive = route === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer min-h-[44px] ${
                    isActive
                      ? 'bg-[#176B65]/10 text-[#176B65] dark:bg-[#69C5B7]/15 dark:text-[#69C5B7] font-bold'
                      : 'text-[#202D29] dark:text-[#F0F3EC] hover:bg-[#EFE9DB] dark:hover:bg-[#182A26]'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Mobile language options for all 4 languages */}
            <div className="pt-3 border-t border-[#DCD5C6] dark:border-[#30443D]">
              <span className="text-xs text-[#596760] dark:text-[#B1C0B8] block mb-2 font-mono uppercase tracking-wider">{t.nav.language}</span>
              <div className="grid grid-cols-2 gap-2">
                {languagesList.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between min-h-[44px] transition-colors cursor-pointer ${
                      lang === l.code
                        ? 'bg-[#176B65] text-white dark:bg-[#69C5B7] dark:text-[#0D1715] shadow-sm'
                        : 'bg-[#EFE9DB] dark:bg-[#182A26] text-[#202D29] dark:text-[#F0F3EC] border border-[#DCD5C6] dark:border-[#30443D]'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-[10px] opacity-75 font-mono">{l.short}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#DCD5C6] dark:border-[#30443D] flex items-center justify-between text-xs text-[#596760] dark:text-[#B1C0B8]">
              <a
                href="https://github.com/MRThugh/ParsiKit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 py-1 text-[#202D29] dark:text-[#F0F3EC] min-h-[44px]"
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
