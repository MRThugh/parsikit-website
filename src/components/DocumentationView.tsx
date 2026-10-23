import React, { useState, useEffect } from 'react';
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
import { CodeBlock } from './CodeBlock';

export function DocumentationView() {
  const { lang, activeDocSlug, setActiveDocSlug, navigateToDoc, toggleLang } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  const isRtl = lang === 'fa';

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

  const categories = [
    {
      id: 'getting-started' as const,
      nameEn: 'Getting Started',
      nameFa: 'شروع کار و مبانی',
      icon: FileText,
    },
    {
      id: 'tutorials' as const,
      nameEn: 'Step-by-Step Tutorials',
      nameFa: 'آموزش‌های گام‌به‌گام',
      icon: BookOpen,
    },
    {
      id: 'guides' as const,
      nameEn: 'Practical Guides',
      nameFa: 'راهنماهای کاربردی',
      icon: Compass,
    },
    {
      id: 'api' as const,
      nameEn: 'API Reference',
      nameFa: 'مرجع کامل توابع (API)',
      icon: Code2,
    },
    {
      id: 'development' as const,
      nameEn: 'Architecture & Engineering',
      nameFa: 'معماری و توسعه',
      icon: Layers,
    },
  ];

  // Group docs by category for current language
  const docsForLang = ALL_DOCS.filter((d) => d.lang === lang || (d.category === 'development' && lang === 'fa'));

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

  // Safe and clean Markdown rendering
  const renderMarkdownContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = 'python';
    let codeBuffer: string[] = [];
    let listBuffer: string[] = [];

    const flushList = (key: number) => {
      if (listBuffer.length > 0) {
        elements.push(
          <ul key={`ul-${key}`} className="my-3 space-y-1.5 list-disc list-inside text-sm text-stone-700 dark:text-stone-300">
            {listBuffer.map((li, liIdx) => (
              <li key={liIdx} className="leading-relaxed">
                {li}
              </li>
            ))}
          </ul>
        );
        listBuffer = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code block start/end
      if (line.startsWith('```')) {
        flushList(i);
        if (inCodeBlock) {
          elements.push(
            <CodeBlock
              key={`code-${i}`}
              code={codeBuffer.join('\n')}
              language={codeLanguage}
            />
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          codeLanguage = line.replace(/^```/, '').trim() || 'python';
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Horizontal rule
      if (line.trim() === '---') {
        flushList(i);
        elements.push(<hr key={`hr-${i}`} className="my-6 border-stone-200 dark:border-white/10" />);
        continue;
      }

      // Headings
      if (line.startsWith('# ')) {
        flushList(i);
        const headingText = line.replace(/^#\s+/, '').trim();
        const id = headingText.toLowerCase().replace(/[^\w\u0600-\u06FF]+/g, '-');
        elements.push(
          <h1 key={`h1-${i}`} id={id} className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white mt-8 mb-4 tracking-tight">
            {headingText}
          </h1>
        );
        continue;
      }

      if (line.startsWith('## ')) {
        flushList(i);
        const headingText = line.replace(/^##\s+/, '').trim();
        const id = headingText.toLowerCase().replace(/[^\w\u0600-\u06FF]+/g, '-');
        elements.push(
          <h2 key={`h2-${i}`} id={id} className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mt-8 mb-3 tracking-tight border-b border-stone-200/60 dark:border-white/10 pb-2">
            {headingText}
          </h2>
        );
        continue;
      }

      if (line.startsWith('### ')) {
        flushList(i);
        const headingText = line.replace(/^###\s+/, '').trim();
        const id = headingText.toLowerCase().replace(/[^\w\u0600-\u06FF]+/g, '-');
        elements.push(
          <h3 key={`h3-${i}`} id={id} className="text-lg font-semibold text-stone-900 dark:text-white mt-6 mb-2">
            {headingText}
          </h3>
        );
        continue;
      }

      // Unordered list
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemText = line.trim().replace(/^[-*]\s+/, '');
        listBuffer.push(itemText);
        continue;
      }

      // Regular paragraph
      flushList(i);
      if (line.trim()) {
        elements.push(
          <p key={`p-${i}`} className="my-3 text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
            {line}
          </p>
        );
      }
    }

    flushList(lines.length);

    return elements;
  };

  return (
    <div className="relative min-h-screen">
      {/* Top Reading Progress Bar */}
      <div
        className="fixed top-16 left-0 right-0 h-1 bg-stone-200 dark:bg-stone-800 z-30"
        aria-hidden="true"
      >
        <div
          className="h-full bg-[#126E68] dark:bg-[#52C5BE] transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Sidebar Toggle Button */}
        <div className="lg:hidden flex items-center justify-between mb-4 pb-3 border-b border-stone-200 dark:border-white/10">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-stone-100 dark:bg-white/5 text-stone-800 dark:text-stone-200 cursor-pointer min-h-[44px]"
          >
            <Menu className="w-4 h-4 text-[#126E68]" />
            <span>{isRtl ? 'فهرست بخش‌های مستندات' : 'Documentation Menu'}</span>
          </button>
          <span className="text-xs text-stone-500 font-mono">
            {currentDoc.category} / {currentDoc.slug}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar (Hierarchy Navigation) */}
          <aside
            className={`lg:col-span-3 lg:sticky lg:top-24 lg:block overflow-y-auto max-h-[calc(100vh-7rem)] pr-2 ${
              mobileSidebarOpen
                ? 'fixed inset-x-4 top-24 bottom-6 z-40 bg-white dark:bg-[#141C1A] p-4 rounded-2xl border border-stone-200 dark:border-white/10 shadow-2xl block'
                : 'hidden'
            }`}
          >
            {mobileSidebarOpen && (
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200 dark:border-white/10 lg:hidden">
                <span className="font-bold text-sm text-stone-900 dark:text-white">
                  {isRtl ? 'مستندات پارسی‌کیت' : 'ParsiKit Docs'}
                </span>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-2 text-stone-400 min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <nav className="space-y-6" aria-label="Documentation Navigation">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const docsInCat = docsForLang.filter((d) => d.category === cat.id);
                if (docsInCat.length === 0) return null;

                return (
                  <div key={cat.id} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-stone-900 dark:text-stone-200 uppercase tracking-wider px-2">
                      <Icon className="w-3.5 h-3.5 text-[#126E68] dark:text-[#52C5BE]" />
                      <span>{isRtl ? cat.nameFa : cat.nameEn}</span>
                    </div>

                    <ul className="space-y-0.5 border-l-2 rtl:border-l-0 rtl:border-r-2 border-stone-200 dark:border-white/10 ml-2.5 rtl:ml-0 rtl:mr-2.5 pl-2 rtl:pl-0 rtl:pr-2">
                      {docsInCat.map((doc) => {
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
                {isRtl ? 'مستندات' : 'Docs'}
              </button>
              <ChevronRight className="w-3 h-3 rtl:rotate-180" />
              <span className="capitalize">{currentDoc.category}</span>
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
                      {isRtl ? 'مطالعه به زبان انگلیسی (Read in English)' : 'Read in Persian (فارسی)'}
                    </span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/5 text-xs flex items-center gap-1.5 cursor-pointer min-h-[44px]"
                  title={isRtl ? 'کپی لینک این صفحه' : 'Copy page link'}
                  aria-label={isRtl ? 'اشتراک‌گذاری آدرس سند' : 'Share document URL'}
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? (isRtl ? 'کپی شد' : 'Copied') : (isRtl ? 'اشتراک' : 'Share')}</span>
                </button>
              </div>
            </div>

            {/* Document Markdown Body */}
            <article className="prose prose-stone dark:prose-invert max-w-none">
              {renderMarkdownContent(currentDoc.content)}
            </article>

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
                    <span>{isRtl ? 'سند قبلی' : 'Previous Document'}</span>
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
                    <span>{isRtl ? 'سند بعدی' : 'Next Document'}</span>
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
              {isRtl ? 'در این صفحه' : 'On This Page'}
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
