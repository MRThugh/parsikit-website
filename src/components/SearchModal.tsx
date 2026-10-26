import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, ChevronRight, FileText, Code2, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { searchDocumentation, type SearchResult } from '../lib/search';
import { modalOverlayVariants, modalPanelVariants } from '../lib/motion';
import { getTranslations } from '../i18n/translations';
import { ALL_DOCS } from '../data/docsManifest';

export function SearchModal() {
  const { isSearchOpen, closeSearch, navigateToDoc, lang, isRtl } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const t = getTranslations(lang);

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
        return <Code2 className="w-4 h-4 text-[#176B65] dark:text-[#69C5B7]" />;
      case 'tutorials':
        return <BookOpen className="w-4 h-4 text-[#B68A3D] dark:text-[#D6B36A]" />;
      case 'guides':
        return <Compass className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      default:
        return <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  const totalDocsCount = ALL_DOCS.filter((d) => d.lang === lang).length;

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t.search.title}
          variants={modalOverlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-start justify-center pt-12 md:pt-20 px-4 bg-[#050A09]/65 backdrop-blur-sm"
          onClick={closeSearch}
        >
          <motion.div
            ref={dialogRef}
            variants={modalPanelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#182A26] border border-[#DCD5C6] dark:border-[#30443D] shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-[#DCD5C6] dark:border-[#30443D] gap-3">
              <Search className="w-5 h-5 text-[#596760] dark:text-[#B1C0B8] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.search.placeholder}
                className="flex-1 bg-transparent text-[#202D29] dark:text-[#F0F3EC] placeholder:text-[#7A8C85] dark:placeholder:text-[#788E84] text-sm md:text-base outline-none min-h-[44px]"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-2 rounded-lg text-[#596760] dark:text-[#B1C0B8] hover:text-[#202D29] dark:hover:text-white cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-block px-2 py-1 text-[11px] font-mono rounded bg-[#EFE9DB] dark:bg-[#20352F] border border-[#DCD5C6] dark:border-[#30443D] text-[#596760] dark:text-[#B1C0B8]">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-2 divide-y divide-[#DCD5C6]/40 dark:divide-[#30443D]/40">
              {query.trim().length > 0 && results.length === 0 && (
                <div className="p-8 text-center text-[#596760] dark:text-[#B1C0B8] text-sm">
                  <p>{t.search.noResults}</p>
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
                        ? 'bg-[#176B65]/10 dark:bg-[#69C5B7]/15 border border-[#176B65]/30 dark:border-[#69C5B7]/30'
                        : 'hover:bg-[#EFE9DB]/50 dark:hover:bg-[#20352F]/40 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(item.doc.category)}
                        <span className="font-semibold text-sm text-[#202D29] dark:text-[#F0F3EC]">
                          {item.doc.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#7A8C85] dark:text-[#788E84] uppercase tracking-wider font-mono">
                        {item.doc.category}
                      </span>
                    </div>

                    {item.matchedHeading && (
                      <div className="text-xs text-[#176B65] dark:text-[#69C5B7] font-medium flex items-center gap-1">
                        <ChevronRight className="w-3 h-3 rtl:rotate-180" />
                        <span>{item.matchedHeading}</span>
                      </div>
                    )}

                    <p className="text-xs text-[#596760] dark:text-[#B1C0B8] line-clamp-2 leading-relaxed">
                      {item.snippet}
                    </p>
                  </button>
                );
              })}

              {!query.trim() && (
                <div className="p-6 text-center text-xs text-[#7A8C85] dark:text-[#788E84] space-y-3">
                  <p className="font-medium text-[#596760] dark:text-[#B1C0B8]">{isRtl ? 'موضوعات پیشنهادی:' : 'Suggested topics:'}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {(isRtl
                      ? ['کد ملی', 'تذکره', 'نیم‌فاصله', 'کارت بانکی', 'تقویم جلالی', 'شماره تماس', 'تبدیل به تومان']
                      : ['National Code', 'ZWNJ', 'Bank Card', 'Jalali Calendar', 'Currency', 'Models', 'Тақвим']
                    ).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-3 py-1.5 rounded-lg bg-[#EFE9DB] dark:bg-[#20352F] hover:bg-[#176B65]/15 dark:hover:bg-[#69C5B7]/15 text-[#202D29] dark:text-[#F0F3EC] transition-colors cursor-pointer min-h-[36px]"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer shortcuts */}
            <div className="px-4 py-2.5 border-t border-[#DCD5C6] dark:border-[#30443D] bg-[#EFE9DB]/40 dark:bg-[#12211E] flex items-center justify-between text-[11px] text-[#596760] dark:text-[#B1C0B8]">
              <div className="flex items-center gap-3">
                <span>{isRtl ? 'پیمایش با کلیدهای جهت‌نما' : 'Navigate with arrow keys'}</span>
                <span>{isRtl ? 'انتخاب با اینتر' : 'Select with enter'}</span>
              </div>
              <span className="font-mono text-[10px]">
                {totalDocsCount} {isRtl ? 'سند در دسترس' : 'articles indexed'}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
