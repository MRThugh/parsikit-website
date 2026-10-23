import React from 'react';
import { Github, ArrowUp, Heart, BookOpen, Terminal, Layers, History, Code2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { REPO_METADATA } from '../data/repoMetadata';

export function Footer() {
  const { lang, setRoute, navigateToDoc, toggleLang } = useApp();
  const isRtl = lang === 'fa';

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
                src="/parsikit-logo.png"
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
              {isRtl
                ? 'زیرساخت خالص پایتونی، سبک و بدون وابستگی جانبی برای پردازش، اعتبارسنجی و محاسبات داده‌های زبان فارسی در محیط‌های توسعه نرم‌افزار.'
                : 'A production-grade pure Python library for Persian data infrastructure, text cleansing, national validations, astronomical Jalali dates, and sensitive PII masking.'}
            </p>

            <div className="pt-2 flex items-center gap-3">
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
                {isRtl ? 'English' : 'فارسی'}
              </button>
            </div>
          </div>

          {/* Column 1: Core Navigation */}
          <div className="space-y-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-stone-900 dark:text-white block">
              {isRtl ? 'پیمایش سایت' : 'Navigation'}
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              <li>
                <button
                  onClick={() => setRoute('home')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {isRtl ? 'صفحه اصلی (معرفی)' : 'Overview'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('playground')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {isRtl ? 'محیط آزمایشی زنده' : 'Interactive Playground'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('docs')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {isRtl ? 'مرکز مستندات' : 'Documentation Hub'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('architecture')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {isRtl ? 'معماری فنی' : 'Architecture Design'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('changelog')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {isRtl ? 'تاریخچه نسخه‌ها' : 'Changelog'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Documentation Highlights */}
          <div className="space-y-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-stone-900 dark:text-white block">
              {isRtl ? 'مستندات و آموزش‌ها' : 'Documentation'}
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              <li>
                <button
                  onClick={() => navigateToDoc('installation')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {isRtl ? 'راهنمای نصب' : 'Installation'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToDoc('quickstart')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {isRtl ? 'شروع سریع در ۵ دقیقه' : 'Quickstart Guide'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToDoc('tutorials/text_processing')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {isRtl ? 'آموزش نیم‌فاصله‌ها و متن' : 'Text & ZWNJ Tutorial'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToDoc('tutorials/validation')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {isRtl ? 'اعتبارسنجی کد ملی و کارت' : 'National ID & Card Check'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToDoc('tutorials/datetime')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {isRtl ? 'تقویم شمسی و سال کبیسه' : 'Astronomical Jalali Dates'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToDoc('api/index')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {isRtl ? 'فهرست کامل API' : 'Full API Reference'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Project & Developer */}
          <div className="space-y-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-stone-900 dark:text-white block">
              {isRtl ? 'پروژه و سازنده' : 'Project & Creator'}
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
                  {isRtl ? 'گزارش باگ و ایشوها' : 'Issue Tracker'}
                </a>
              </li>
              <li>
                <button
                  onClick={() => navigateToDoc('development/contributing')}
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
                >
                  {isRtl ? 'راهنمای مشارکت در پروژه' : 'Contribution Guidelines'}
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
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors font-mono text-xs"
                >
                  sitemap.xml
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            <span>© {new Date().getFullYear()} ParsiKit. {isRtl ? 'توسعه‌یافته با احترام به زبان فارسی توسط علی کامرانی.' : 'Crafted for the Persian language by Ali Kamrani.'}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono">Python &gt;= 3.10</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-stone-600 dark:text-stone-300 hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer"
              aria-label={isRtl ? 'بازگشت به ابتدای صفحه' : 'Back to top'}
            >
              <span>{isRtl ? 'بازگشت به بالا' : 'Back to top'}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
