import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Languages,
  Code2,
  Compass,
  FileText,
  Layers,
  Share2,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ALL_DOCS } from '../data/docsManifest';
import { getTranslations } from '../i18n/translations';
import { renderMarkdownToHtml } from '../lib/markdown';

export function DocumentationView() {
  const { lang, activeDocSlug, setActiveDocSlug, navigateToDoc, toggleLang, isRtl } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  const t = getTranslations(lang);

  // Find active document for current language
  const currentDoc =
    ALL_DOCS.find((d) => d.lang === lang && d.slug === activeDocSlug) ||
    ALL_DOCS.find((d) => d.slug === activeDocSlug) ||
    ALL_DOCS.find((d) => d.lang === lang) ||
    ALL_DOCS[0];

  // Track reading progress & heading on scroll
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadingProgress(progress);
      }

      // Check headings
      const headingElements = document.querySelectorAll('h1[id], h2[id], h3[id]');
      let currentId = '';
      for (const el of headingElements) {
        const top = el.getBoundingClientRect().top;
        if (top <= 120) {
          currentId = el.id;
        }
      }
      if (currentId) setActiveHeadingId(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getCategoryTitle = (catId: string) => {
    switch (catId) {
      case 'getting-started':
        return lang === 'fa' ? 'شروع کار و مبانی' : lang === 'prs-af' ? 'آغاز کار و رهنمودها' : lang === 'tg' ? 'Оғози кор ва роҳнамоҳо' : 'Getting Started';
      case 'tutorials':
        return lang === 'fa' ? 'آموزش‌های گام‌به‌گام' : lang === 'prs-af' ? 'آموزش‌های عملی' : lang === 'tg' ? 'Омӯзишҳои амалӣ' : 'Step-by-Step Tutorials';
      case 'guides':
        return lang === 'fa' ? 'راهنماهای کاربردی' : lang === 'prs-af' ? 'رهنمودهای تخنیکی' : lang === 'tg' ? 'Роҳнамоҳои фаннӣ' : 'Practical Guides';
      case 'api':
        return lang === 'fa' ? 'مرجع کامل توابع (API)' : lang === 'prs-af' ? 'مرجع توابع و ماژول‌ها (API)' : lang === 'tg' ? 'Феҳристи тавобеъ (API)' : 'API Reference';
      case 'development':
        return lang === 'fa' ? 'معماری و توسعه' : lang === 'prs-af' ? 'معماری و انجنیری' : lang === 'tg' ? 'Меъморӣ ва таҳия' : 'Architecture & Engineering';
      default:
        return catId;
    }
  };

  const categories = [
    { id: 'getting-started' as const, name: getCategoryTitle('getting-started'), icon: FileText },
    { id: 'tutorials' as const, name: getCategoryTitle('tutorials'), icon: BookOpen },
    { id: 'guides' as const, name: getCategoryTitle('guides'), icon: Compass },
    { id: 'api' as const, name: getCategoryTitle('api'), icon: Code2 },
    { id: 'development' as const, name: getCategoryTitle('development'), icon: Layers },
  ];

  // Group docs by category for current language
  const docsForLang = ALL_DOCS.filter(
    (d) => d.lang === lang || (d.category === 'development' && d.lang === 'en')
  );

  // Calculate Previous and Next documents
  const allDocsInOrder = docsForLang;
  const currentIndex = allDocsInOrder.findIndex((d) => d.slug === currentDoc.slug);
  const prevDoc = currentIndex > 0 ? allDocsInOrder[currentIndex - 1] : null;
  const nextDoc = currentIndex < allDocsInOrder.length - 1 ? allDocsInOrder[currentIndex + 1] : null;

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  // Render markdown with complete GFM syntax, tables, and link transformations
  const renderedHtml = useMemo(
    () => renderMarkdownToHtml(currentDoc.content),
    [currentDoc.content]
  );

  const handleArticleClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = (e.target as HTMLElement).closest('a');
    if (!target) return;
    const href = target.getAttribute('href');
    if (!href) return;

    // External links or in-page anchor links use default browser behavior
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('#')) {
      return;
    }

    // Relative markdown link -> SPA navigation
    e.preventDefault();
    const cleanSlug = href
      .replace(/^\//, '')
      .replace(/^docs\//, '')
      .replace(/^(fa|en|prs-af|tg)\/docs\//, '')
      .replace(/\.md$/, '');
    navigateToDoc(cleanSlug);
  };

  return (
    <div className="relative min-h-screen">
      {/* Reading Progress Indicator */}
      <div className="fixed top-16 left-0 right-0 z-30 h-0.5 bg-stone-200 dark:bg-white/10">
        <div
          className="h-full bg-[#126E68] dark:bg-[#52C5BE] transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Mobile Sidebar Toggle Button */}
        <div className="lg:hidden mb-6 flex items-center justify-between p-3 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10">
          <div className="flex items-center gap-2 text-xs font-medium text-stone-700 dark:text-stone-300">
            <BookOpen className="w-4 h-4 text-[#126E68]" />
            <span className="truncate max-w-[200px]">{currentDoc.title}</span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-black/30 border border-stone-200 dark:border-white/10 cursor-pointer min-h-[36px]"
          >
            {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span>{t.docs.tableOfContents}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar: Doc Tree grouped by Category */}
          <aside
            className={`lg:col-span-3 lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto space-y-6 ${
              mobileSidebarOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <nav className="space-y-6 text-sm" aria-label="Documentation Navigation">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const catDocs = docsForLang.filter((d) => d.category === cat.id);
                if (catDocs.length === 0) return null;

                return (
                  <div key={cat.id} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-stone-900 dark:text-stone-200 px-2 py-1">
                      <Icon className="w-3.5 h-3.5 text-[#126E68] dark:text-[#52C5BE]" />
                      <span>{cat.name}</span>
                    </div>

                    <ul className="space-y-1">
                      {catDocs.map((doc) => {
                        const isActive = currentDoc.slug === doc.slug;
                        return (
                          <li key={doc.id}>
                            <button
                              onClick={() => {
                                setActiveDocSlug(doc.slug);
                                setMobileSidebarOpen(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className={`w-full text-left rtl:text-right px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer block truncate min-h-[38px] ${
                                isActive
                                  ? 'bg-[#126E68]/15 dark:bg-[#126E68]/25 text-[#126E68] dark:text-[#52C5BE] font-semibold'
                                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/70 dark:hover:bg-white/5'
                              }`}
                            >
                              {doc.title}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-6 xl:col-span-7 bg-white dark:bg-[#131B19] rounded-2xl border border-stone-200 dark:border-white/10 p-6 sm:p-10 shadow-sm">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-stone-400 dark:text-stone-500 mb-6 flex-wrap">
              <button
                onClick={() => setActiveDocSlug('index')}
                className="hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
              >
                {t.nav.docs}
              </button>
              <ChevronRight className="w-3 h-3 rtl:rotate-180" />
              <span className="capitalize">{getCategoryTitle(currentDoc.category)}</span>
              <ChevronRight className="w-3 h-3 rtl:rotate-180" />
              <span className="text-stone-700 dark:text-stone-300 font-medium">
                {currentDoc.title}
              </span>
            </div>

            {/* Language Counterpart & Actions Bar */}
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-stone-200 dark:border-white/10 flex-wrap gap-4">
              <div className="flex items-center gap-2">
                {currentDoc.counterpartSlug && (
                  <button
                    onClick={toggleLang}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-white/5 hover:bg-[#126E68]/10 transition-colors cursor-pointer min-h-[44px]"
                  >
                    <Languages className="w-3.5 h-3.5 text-[#126E68] dark:text-[#52C5BE]" />
                    <span>
                      {isRtl ? 'Read in English / Тоҷикӣ' : 'مطالعه به فارسی و دری'}
                    </span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/5 text-xs flex items-center gap-1.5 cursor-pointer min-h-[44px]"
                  title={t.docs.shareLink}
                  aria-label={t.docs.shareLink}
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? t.docs.linkCopied : t.docs.shareLink}</span>
                </button>
              </div>
            </div>

            {/* Document Markdown Body */}
            <article
              onClick={handleArticleClick}
              className="prose prose-stone dark:prose-invert max-w-none prose-headings:scroll-mt-24 markdown-body"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />

            {/* Next / Previous Document Navigation */}
            <div className="mt-12 pt-8 border-t border-stone-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevDoc ? (
                <button
                  onClick={() => {
                    setActiveDocSlug(prevDoc.slug);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-4 rounded-xl border border-stone-200 dark:border-white/10 hover:border-[#126E68]/40 dark:hover:border-[#52C5BE]/40 text-left rtl:text-right transition-all hover:bg-stone-50 dark:hover:bg-white/5 cursor-pointer flex flex-col justify-between min-h-[72px]"
                >
                  <span className="text-xs text-stone-400 mb-1 flex items-center gap-1">
                    {isRtl ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                    <span>{t.docs.prevDoc}</span>
                  </span>
                  <span className="text-sm font-semibold text-stone-900 dark:text-white">
                    {prevDoc.title}
                  </span>
                </button>
              ) : <div />}

              {nextDoc ? (
                <button
                  onClick={() => {
                    setActiveDocSlug(nextDoc.slug);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-4 rounded-xl border border-stone-200 dark:border-white/10 hover:border-[#126E68]/40 dark:hover:border-[#52C5BE]/40 text-right rtl:text-left transition-all hover:bg-stone-50 dark:hover:bg-white/5 cursor-pointer flex flex-col justify-between min-h-[72px]"
                >
                  <span className="text-xs text-stone-400 mb-1 flex items-center justify-end rtl:justify-start gap-1">
                    <span>{t.docs.nextDoc}</span>
                    {isRtl ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </span>
                  <span className="text-sm font-semibold text-stone-900 dark:text-white">
                    {nextDoc.title}
                  </span>
                </button>
              ) : <div />}
            </div>
          </main>

          {/* Desktop Right Sidebar (In-Page Table of Contents) */}
          <aside className="hidden lg:col-span-3 xl:col-span-2 lg:sticky lg:top-24 lg:block space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-300 block">
              {t.docs.onThisPage}
            </span>

            {currentDoc.headings.length === 0 ? (
              <span className="text-xs text-stone-400 italic">
                {isRtl ? 'سرتیتر دیگری موجود نیست' : 'No sections'}
              </span>
            ) : (
              <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400 border-l rtl:border-l-0 rtl:border-r border-stone-200 dark:border-white/10 pl-3 rtl:pl-0 rtl:pr-3">
                {currentDoc.headings.map((h) => {
                  const isActive = activeHeadingId === h.id;
                  return (
                    <li key={h.id} style={{ paddingLeft: `${(h.level - 1) * 8}px` }}>
                      <button
                        onClick={() => scrollToHeading(h.id)}
                        className={`text-left rtl:text-right hover:text-[#126E68] dark:hover:text-[#52C5BE] transition-colors cursor-pointer truncate max-w-full block py-1 ${
                          isActive
                            ? 'text-[#126E68] dark:text-[#52C5BE] font-semibold'
                            : ''
                        }`}
                      >
                        {h.text}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
