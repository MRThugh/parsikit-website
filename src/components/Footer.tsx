import React from 'react';
import { Github, ArrowUp, BookOpen, Terminal, Layers, History, Code2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { REPO_METADATA } from '../data/repoMetadata';
import { getTranslations } from '../i18n/translations';
import { LOCALES } from '../i18n/config';
import { hasVerifiedSiteUrl } from '../config/site';

export function Footer() {
  const { lang, setRoute, navigateToDoc, toggleLang, isRtl } = useApp();
  const t = getTranslations(lang);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-stone-200 dark:border-white/10 bg-[#FAF7F2] dark:bg-[#0A0F0E] text-stone-700 dark:text-stone-300 transition-colors">
      {/* Iranian geometric top decorative bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#126E68] via-[#D4A03D] to-[#1D3D63]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-18">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={`${import.meta.env.BASE_URL}parsikit-logo.png`}
                alt="ParsiKit Logo"
                className="w-10 h-10 object-contain"
                width="40"
                height="40"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-stone-900 dark:text-white">
                  ParsiKit
                </span>
                <span className="text-xs text-stone-500 font-mono">
                  v{REPO_METADATA.version} · {REPO_METADATA.license} License
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-sm">
              {t.footer.description}
            </p>

            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <a
                href={REPO_METADATA.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 text-stone-700 dark:text-stone-200 transition-colors"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href={REPO_METADATA.pyPiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 text-xs font-mono text-stone-700 dark:text-stone-200 transition-colors"
              >
                PyPI: parsikit
              </a>

              <button
                onClick={toggleLang}
                className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 text-xs font-medium text-stone-700 dark:text-stone-200 transition-colors cursor-pointer"
              >
                {LOCALES[lang]?.nameNative} ⇄
              </button>
            </div>
          </div>

          {/* Column 1: Core Navigation */}
          <div className="space-y-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-stone-900 dark:text-white block">
              {t.footer.navHeading}
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              <li>
                <button
                  onClick={() => setRoute('home')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {t.footer.overview}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('playground')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {t.footer.playground}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('docs')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {t.footer.docsHub}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('architecture')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {t.footer.architecture}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('changelog')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {t.footer.changelog}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Documentation Highlights */}
          <div className="space-y-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-stone-900 dark:text-white block">
              {t.footer.docsHeading}
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              <li>
                <button
                  onClick={() => navigateToDoc('installation')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {t.footer.installGuide}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToDoc('quickstart')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {t.footer.quickstart}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToDoc('tutorials/text_processing')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {t.footer.textTutorial}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToDoc('tutorials/validation')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {t.footer.validationTutorial}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToDoc('tutorials/datetime')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {t.footer.datetimeTutorial}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToDoc('api/index')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {t.footer.apiReference}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Project & Developer */}
          <div className="space-y-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-stone-900 dark:text-white block">
              {t.footer.projectHeading}
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              <li>
                <a
                  href="https://github.com/MRThugh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors"
                >
                  Ali Kamrani (MRThugh)
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/MRThugh/ParsiKit/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors"
                >
                  {t.footer.issues}
                </a>
              </li>
              <li>
                <button
                  onClick={() => navigateToDoc('development/contributing')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {t.footer.contributing}
                </button>
              </li>
              <li>
                <a
                  href="https://opensource.org/licenses/MIT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors"
                >
                  MIT License
                </a>
              </li>
              {hasVerifiedSiteUrl() && (
                <li>
                  <a
                    href={`${import.meta.env.BASE_URL}sitemap.xml`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors font-mono text-xs"
                  >
                    sitemap.xml
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            <span>© {new Date().getFullYear()} ParsiKit. {t.footer.copyright}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono">Python &gt;= 3.10</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-stone-600 dark:text-stone-300 hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
              aria-label={t.footer.backToTop}
            >
              <span>{t.footer.backToTop}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
