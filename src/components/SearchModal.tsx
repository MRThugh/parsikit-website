import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, ChevronRight, FileText, Code2, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { searchDocumentation, type SearchResult } from '../lib/search';
import { modalOverlayVariants, modalPanelVariants } from '../lib/motion';

export function SearchModal() {
  const { isSearchOpen, closeSearch, navigateToDoc, lang } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const isRtl = lang === 'fa';

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }
    const res = searchDocumentation(query, lang);
    setResults(res);
    setSelectedIndex(0);
  }, [query, lang]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeSearch();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  const handleSelect = (item: SearchResult) => {
    navigateToDoc(item.doc.slug, item.doc.lang);
    closeSearch();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'api':
        return <Code2 className="w-4 h-4 text-[#126E68] dark:text-[#52C5BE]" />;
      case 'tutorials':
        return <BookOpen className="w-4 h-4 text-[#D4A03D]" />;
      case 'guides':
        return <Compass className="w-4 h-4 text-sky-500" />;
      default:
        return <FileText className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={isRtl ? 'جستجو در مستندات' : 'Search documentation'}
          variants={modalOverlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-start justify-center pt-12 md:pt-20 px-4 bg-black/60 backdrop-blur-sm"
          onClick={closeSearch}
        >
          <motion.div
            ref={dialogRef}
            variants={modalPanelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#151D1B] border border-stone-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-stone-200 dark:border-white/10 gap-3">
              <Search className="w-5 h-5 text-stone-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  isRtl
                    ? 'جستجوی مستندات، توابع، مثال‌ها (مثلاً کد ملی، ZWNJ، تومان)...'
                    : 'Search documentation, functions, guides (e.g. national code, ZWNJ, toman)...'
                }
                className="flex-1 bg-transparent text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 text-sm md:text-base outline-none min-h-[44px]"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-2 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={isRtl ? 'پاک کردن جستجو' : 'Clear search'}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-block px-2 py-1 text-[11px] font-mono rounded bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-500">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-2 divide-y divide-stone-100 dark:divide-white/5">
              {query.trim().length > 0 && results.length === 0 && (
                <div className="p-8 text-center text-stone-500 dark:text-stone-400 text-sm">
                  <p>{isRtl ? 'نتیجه‌ای برای این عبارت یافت نشد.' : 'No matching documentation found.'}</p>
                  <p className="mt-1 text-xs opacity-75">
                    {isRtl
                      ? 'کلمات دیگری مانند «کارت بانکی»، «کبیسه» یا «اعتبارسنجی» را امتحان کنید.'
                      : 'Try keywords like "validator", "card", "zwnj", or "jalali".'}
                  </p>
                </div>
              )}

              {results.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.doc.id + idx}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left rtl:text-right p-3.5 rounded-xl transition-all flex flex-col gap-1 cursor-pointer min-h-[44px] ${
                      isSelected
                        ? 'bg-[#126E68]/10 dark:bg-[#126E68]/20 border border-[#126E68]/30'
                        : 'hover:bg-stone-50 dark:hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(item.doc.category)}
                        <span className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                          {item.doc.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400 uppercase tracking-wider font-mono">
                        {item.doc.category}
                      </span>
                    </div>

                    {item.matchedHeading && (
                      <div className="text-xs text-[#126E68] dark:text-[#52C5BE] font-medium flex items-center gap-1">
                        <ChevronRight className="w-3 h-3 rtl:rotate-180" />
                        <span>{item.matchedHeading}</span>
                      </div>
                    )}

                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {item.snippet}
                    </p>
                  </button>
                );
              })}

              {!query.trim() && (
                <div className="p-6 text-center text-xs text-stone-400 space-y-3">
                  <p className="font-medium text-stone-500">{isRtl ? 'موضوعات پیشنهادی:' : 'Suggested topics:'}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {isRtl ? (
                      <>
                        {['کد ملی', 'نیم‌فاصله', 'کارت بانکی', 'تقویم جلالی', 'تبدیل به تومان', 'شیءگرایی'].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setQuery(tag)}
                            className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-white/5 hover:bg-[#126E68]/15 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer min-h-[36px]"
                          >
                            {tag}
                          </button>
                        ))}
                      </>
                    ) : (
                      <>
                        {['National Code', 'ZWNJ', 'Bank Card', 'Jalali Calendar', 'Toman Currency', 'Models'].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setQuery(tag)}
                            className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-white/5 hover:bg-[#126E68]/15 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer min-h-[36px]"
                          >
                            {tag}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer shortcuts */}
            <div className="px-4 py-2.5 border-t border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#111716] flex items-center justify-between text-[11px] text-stone-500">
              <div className="flex items-center gap-3">
                <span>↑↓ {isRtl ? 'حرکت' : 'Navigate'}</span>
                <span>↵ {isRtl ? 'انتخاب' : 'Select'}</span>
                <span>ESC {isRtl ? 'خروج' : 'Close'}</span>
              </div>
              <span className="font-mono">50 {isRtl ? 'سند رسمی' : 'Official Docs'}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
