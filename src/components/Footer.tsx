import React from 'react';
import { Github, ArrowUp } from 'lucide-react';
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
    <footer className="relative border-t border-[#DCD5C6]/80 dark:border-[#30443D]/80 bg-[#F7F4EC] dark:bg-[#0D1715] text-[#596760] dark:text-[#B1C0B8] transition-colors">
      {/* Persian decorative hairline header bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#176B65] via-[#B68A3D] to-[#1D3D63]" />

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
                <span className="font-extrabold text-lg text-[#202D29] dark:text-[#F0F3EC]">
                  ParsiKit
                </span>
                <span className="text-xs text-[#596760] dark:text-[#B1C0B8] font-mono">
                  v{REPO_METADATA.version} · {REPO_METADATA.license} License
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#596760] dark:text-[#B1C0B8] leading-relaxed max-w-sm">
              {t.footer.description}
            </p>

            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <a
                href={REPO_METADATA.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-[#EFE9DB] dark:bg-[#182A26] hover:bg-[#E5DEC9] dark:hover:bg-[#20352F] text-[#202D29] dark:text-[#F0F3EC] border border-[#DCD5C6] dark:border-[#30443D] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href={REPO_METADATA.pyPiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#EFE9DB] dark:bg-[#182A26] hover:bg-[#E5DEC9] dark:hover:bg-[#20352F] text-xs font-mono text-[#202D29] dark:text-[#F0F3EC] border border-[#DCD5C6] dark:border-[#30443D] transition-colors min-h-[40px] flex items-center"
              >
                PyPI: parsikit
              </a>

              <button
                onClick={toggleLang}
                className="px-3 py-1.5 rounded-xl bg-[#EFE9DB] dark:bg-[#182A26] hover:bg-[#E5DEC9] dark:hover:bg-[#20352F] text-xs font-medium text-[#202D29] dark:text-[#F0F3EC] border border-[#DCD5C6] dark:border-[#30443D] transition-colors cursor-pointer min-h-[40px] flex items-center"
              >
                {LOCALES[lang]?.nameNative} ⇄
              </button>
            </div>
          </div>

          {/* Column 1: Core Navigation */}
          <div className="space-y-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#202D29] dark:text-[#F0F3EC] block">
              {t.footer.navHeading}
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-[#596760] dark:text-[#B1C0B8]">
              <li>
                <button
                  onClick={() => setRoute('home')}
                  className="hover:text-[#176B65] dark:hover:text-[#69C5B7] transition-colors cursor-pointer"
                >
                  {t.footer.overview}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('playground')}
                  className="hover:text-[#176B65] dark:hover:text-[#69C5B7] transition-colors cursor-pointer"
                >
                  {t.footer.playground}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('docs')}
                  className="hover:text-[#176B65] dark:hover:text-[#69C5B7] transition-colors cursor-pointer"
                >
                  {t.footer.docsHub}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('architecture')}
                  className="hover:text-[#176B65] dark:hover:text-[#69C5B7] transition-colors cursor-pointer"
                >
                  {t.footer.architecture}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('changelog')}
                  className="hover:text-[#176B65] dark:hover:text-[#69C5B7] transition-colors cursor-pointer"
                >
                  {t.footer.changelog}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Documentation Highlights */}
          <div className="space-y-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#202D29] dark:text-[#F0F3EC] block">
              {t.footer.docsHeading}
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-[#596760] dark:text-[#B1C0B8]">
              <li>
                <button
                  onClick={() => navigateToDoc('installation')}
                  className="hover:text-[#176B65] dark:hover:text-[#69C5B7] transition-colors cursor-pointer"
                >
                  {t.footer.installGuide}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToDoc('quickstart')}
                  className="hover:text-[#176B65] dark:hover:text-[#69C5B7] transition-colors cursor-pointer"
                >
                  {t.footer.quickstart}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToDoc('tutorials/text_processing')}
                  className="hover:text-[#176B65] dark:hover:text-[#69C5B7] transition-colors cursor-pointer"
                >
                  {t.footer.textTutorial}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToDoc('tutorials/validation')}
                  className="hover:text-[#176B65] dark:hover:text-[#69C5B7] transition-colors cursor-pointer"
                >
                  {t.footer.validationTutorial}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToDoc('tutorials/datetime')}
                  className="hover:text-[#176B65] dark:hover:text-[#69C5B7] transition-colors cursor-pointer"
                >
                  {t.footer.datetimeTutorial}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToDoc('api/index')}
                  className="hover:text-[#176B65] dark:hover:text-[#69C5B7] transition-colors cursor-pointer"
                >
                  {t.footer.apiReference}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Project & Developer */}
          <div className="space-y-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#202D29] dark:text-[#F0F3EC] block">
              {t.footer.projectHeading}
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-[#596760] dark:text-[#B1C0B8]">
              <li>
                <a
                  href="https://github.com/MRThugh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#176B65] dark:hover:text-[#69C5B7] transition-colors"
                >
                  Ali Kamrani (MRThugh)
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/MRThugh/ParsiKit/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#176B65] dark:hover:text-[#69C5B7] transition-colors"
                >
                  {t.footer.issues}
                </a>
              </li>
              <li>
                <button
                  onClick={() => navigateToDoc('development/contributing')}
                  className="hover:text-[#176B65] dark:hover:text-[#69C5B7] transition-colors cursor-pointer"
                >
                  {t.footer.contributing}
                </button>
              </li>
              <li>
                <a
                  href="https://opensource.org/licenses/MIT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#176B65] dark:hover:text-[#69C5B7] transition-colors"
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
                    className="hover:text-[#176B65] dark:hover:text-[#69C5B7] transition-colors font-mono text-xs"
                  >
                    sitemap.xml
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#DCD5C6]/60 dark:border-[#30443D]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#596760] dark:text-[#B1C0B8]">
          <div>
            <span>© {new Date().getFullYear()} ParsiKit. {t.footer.copyright}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono">Python &gt;= 3.10</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[#202D29] dark:text-[#F0F3EC] hover:text-[#176B65] dark:hover:text-[#69C5B7] transition-colors cursor-pointer min-h-[36px]"
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
