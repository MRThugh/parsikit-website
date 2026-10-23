import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/Button';
import { Home, BookOpen, Search, HelpCircle, Compass, FileQuestion } from 'lucide-react';
import { SUPPORTED_LANG_PREFIXES, LOCALES } from '../i18n/config';

export function NotFoundView() {
  const { lang, setLang, navigate, navigateToDoc, openSearch, isRtl, activeDocSlug } = useApp();

  const isTg = lang === 'tg';
  const isPrs = lang === 'prs-af';

  const headingText = isRtl
    ? isPrs
      ? 'صفحه مورد نظر دریافت نشد'
      : 'صفحه مورد نظر یافت نشد'
    : isTg
    ? 'Саҳифаи дархостшуда ёфт нашуд'
    : 'Page Not Found';

  const descriptionText = isRtl
    ? isPrs
      ? 'آدرس یا سند رهنمایی که به دنبال آن بودید تغییر مکان داده، حذف شده یا اصلاً وجود ندارد.'
      : 'صفحه یا مستنداتی که به دنبال آن بودید تغییر کرده، جابجا شده یا وجود ندارد.'
    : isTg
    ? 'Саҳифа ё ҳуҷҷати дастурамале, ки ҷустуҷӯ доред, интиқол ёфтааст ё вуҷуд надорад.'
    : 'The page or documentation article you are looking for might have been moved, renamed, or does not exist.';

  const homeBtnText = isRtl
    ? 'صفحه اصلی'
    : isTg
    ? 'Саҳифаи асосӣ'
    : 'Return Home';

  const docsBtnText = isRtl
    ? 'مستندات و راهنما'
    : isTg
    ? 'Дастурамал'
    : 'Browse Documentation';

  const searchBtnText = isRtl
    ? 'جستجو در مستندات'
    : isTg
    ? 'Ҷустуҷӯи ҳуҷҷатҳо'
    : 'Search Documentation';

  const popularLinksTitle = isRtl
    ? 'مسیرهای پرکاربرد:'
    : isTg
    ? 'Саҳифаҳои маъмул:'
    : 'Helpful Destinations:';

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* Visual Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-6 border border-amber-500/20 shadow-inner">
          <FileQuestion className="w-10 h-10" />
        </div>

        {/* 404 Code */}
        <div className="font-mono text-5xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-[#126E68] via-emerald-600 to-[#1D3D63] dark:from-[#52C5BE] dark:via-emerald-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
          404
        </div>

        {/* Heading & Details */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-white mb-4 tracking-tight">
          {headingText}
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-base sm:text-lg mb-6 leading-relaxed max-w-lg mx-auto">
          {descriptionText}
        </p>

        {activeDocSlug && activeDocSlug !== 'index' && (
          <div className="inline-block px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-mono text-xs mb-8 border border-stone-200 dark:border-white/10" dir="ltr">
            Requested: /docs/{activeDocSlug}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('home')}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>{homeBtnText}</span>
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => navigateToDoc('installation')}
            className="flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>{docsBtnText}</span>
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={openSearch}
            className="flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>{searchBtnText}</span>
          </Button>
        </div>

        {/* Popular Quick Links */}
        <div className="border-t border-stone-200 dark:border-white/10 pt-8 max-w-lg mx-auto">
          <h2 className="text-xs font-mono uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-4 font-bold">
            {popularLinksTitle}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-medium">
            <button
              onClick={() => navigateToDoc('installation')}
              className="p-2.5 rounded-xl border border-stone-200/80 dark:border-white/10 bg-white/50 dark:bg-stone-900/40 hover:border-[#126E68] dark:hover:border-[#52C5BE] transition-colors text-stone-700 dark:text-stone-200"
            >
              {isRtl ? 'نصب و راه‌اندازی' : isTg ? 'Дастури насб' : 'Installation'}
            </button>
            <button
              onClick={() => navigateToDoc('quickstart')}
              className="p-2.5 rounded-xl border border-stone-200/80 dark:border-white/10 bg-white/50 dark:bg-stone-900/40 hover:border-[#126E68] dark:hover:border-[#52C5BE] transition-colors text-stone-700 dark:text-stone-200"
            >
              {isRtl ? 'شروع سریع' : isTg ? 'Оғози зуд' : 'Quickstart'}
            </button>
            <button
              onClick={() => navigateToDoc('api/validators')}
              className="p-2.5 rounded-xl border border-stone-200/80 dark:border-white/10 bg-white/50 dark:bg-stone-900/40 hover:border-[#126E68] dark:hover:border-[#52C5BE] transition-colors text-stone-700 dark:text-stone-200"
            >
              {isRtl ? 'اعتبارسنج‌ها' : isTg ? 'Тафтишгарҳо' : 'Validators'}
            </button>
            <button
              onClick={() => navigate('playground')}
              className="p-2.5 rounded-xl border border-stone-200/80 dark:border-white/10 bg-white/50 dark:bg-stone-900/40 hover:border-[#126E68] dark:hover:border-[#52C5BE] transition-colors text-stone-700 dark:text-stone-200"
            >
              {isRtl ? 'محیط آزمایشی' : isTg ? 'Озмоишгоҳ' : 'Playground'}
            </button>
          </div>
        </div>

        {/* Multi-language Switcher in 404 */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {SUPPORTED_LANG_PREFIXES.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                lang === l
                  ? 'bg-[#126E68] text-white'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 bg-stone-100 dark:bg-stone-800'
              }`}
            >
              {LOCALES[l].nameNative}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
