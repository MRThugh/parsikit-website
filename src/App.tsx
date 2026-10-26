/**
 * ParsiKit Official Website & Documentation Hub
 * Project Owner & Creator: Ali Kamrani (MRThugh)
 * Official Repo: https://github.com/MRThugh/ParsiKit
 */

import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PillarsSection } from './components/PillarsSection';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';
import { Accordion } from './components/ui/Accordion';
import { Button } from './components/ui/Button';
import { HelpCircle, Loader2 } from 'lucide-react';
import { getTranslations } from './i18n/translations';

// Lazy-loaded route views for code splitting
const InteractivePlayground = lazy(() =>
  import('./components/InteractivePlayground').then((m) => ({ default: m.InteractivePlayground }))
);
const DocumentationView = lazy(() =>
  import('./components/DocumentationView').then((m) => ({ default: m.DocumentationView }))
);
const ArchitectureView = lazy(() =>
  import('./components/ArchitectureView').then((m) => ({ default: m.ArchitectureView }))
);
const ChangelogView = lazy(() =>
  import('./components/ChangelogView').then((m) => ({ default: m.ChangelogView }))
);
const NotFoundView = lazy(() =>
  import('./components/NotFoundView').then((m) => ({ default: m.NotFoundView }))
);

function ViewLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] text-stone-400">
      <Loader2 className="w-8 h-8 animate-spin text-[#126E68] dark:text-[#52C5BE]" />
    </div>
  );
}

function MainContent() {
  const { route, lang, navigateToDoc, isRtl } = useApp();
  const t = getTranslations(lang);

  const getFaqTitle = (idx: number) => {
    switch (idx) {
      case 0:
        return lang === 'fa'
          ? 'چرا به جای متدهای پیش‌فرض پایتون یا Regex از پارسی‌کیت استفاده کنیم؟'
          : lang === 'prs-af'
          ? 'چرا به جای میتودهای معمول پایتون یا رگولار اکسپریشن از پارسی‌کیت استفاده کنیم؟'
          : lang === 'tg'
          ? 'Чаро ба ҷои методҳои стандартии Python ё Regex аз ParsiKit истифода барем?'
          : 'Why use ParsiKit instead of standard Python string methods or regex?';
      case 1:
        return lang === 'fa'
          ? 'آیا پارسی‌کیت به وب‌سرویس ثبت احوال یا سیستم استعلام موجودی بانک‌ها متصل است؟'
          : lang === 'prs-af'
          ? 'آیا پارسی‌کیت به سیستم‌های آنلاین ادارات دولتی یا بانک‌ها وصل است؟'
          : lang === 'tg'
          ? 'Оё ParsiKit ба пойгоҳи додаҳои давлатӣ ё бонкӣ пайваст мешавад?'
          : 'Does ParsiKit verify identity with government civil registries or check bank account balances?';
      case 2:
        return lang === 'fa'
          ? 'آیا پارسی‌کیت با FastAPI، Django و Pydantic نسخه ۲ سازگار است؟'
          : lang === 'prs-af'
          ? 'آیا پارسی‌کیت با فریم‌ورک‌های FastAPI، Django و Pydantic هماهنگ است؟'
          : lang === 'tg'
          ? 'Оё ParsiKit бо FastAPI, Django ва Pydantic v2 мутобиқ аст?'
          : 'Is ParsiKit compatible with FastAPI, Django, and Pydantic v2?';
      case 3:
        return lang === 'fa'
          ? 'پیش‌نیازها و وابستگی‌های سیستمی پارسی‌کیت چیست؟'
          : lang === 'prs-af'
          ? 'شرایط لازم و پیش‌نیازهای تخنیکی سیستم چیست؟'
          : lang === 'tg'
          ? 'Талаботи техникӣ ва вобастагиҳои ParsiKit кадоманд?'
          : 'What are the system requirements and dependencies?';
      default:
        return '';
    }
  };

  const getFaqContent = (idx: number) => {
    switch (idx) {
      case 0:
        return lang === 'fa'
          ? 'متدهای استاندارد پایتون در تشخیص نیم‌فاصله‌ها، اصلاح کاراکترهای عربی «ي» و «ك» در جستجوهای دیتابیس، محاسبات سال کبیسه نجومی خورشیدی و تراز بصری متن‌ها در ترمینال دچار خطا می‌شوند. پارسی‌کیت یک موتور جامع و خالص پایتونی بدون هیچ وابستگی جانبی برای رفع تمام این چالش‌ها ارائه می‌دهد.'
          : lang === 'prs-af'
          ? 'میتودهای معمولی پایتون در تشخیص نیم‌فاصله‌های ZWNJ، اصلاح حروف عربی به حروف دری، و محاسبات دقیق سال‌های کبیسه تقویم هجری شمسی ناتوان هستند. پارسی‌کیت این نیازمندی‌ها را به صورت پایتون خالص حل می‌نماید.'
          : lang === 'tg'
          ? 'Методҳои стандартии Python дар шинохти нимафосилаҳо (ZWNJ), танзими ҳарфҳои арабӣ ва ҳисоботи нуҷумии соли кабисаи шамсӣ номувофиқ мебошанд. ParsiKit тамоми ин масъалаҳоро бо Python-и холис бе вобастагӣ ҳал мекунад.'
          : 'Standard regex and string methods in Python fail on Zero-Width Non-Joiners (ZWNJ, \\u200C), misidentify Arabic Yeh/Kaf variations in database searches, cannot handle astronomical Solar Hijri leap calculations, and misalign visual string widths in CLI formats. ParsiKit provides pure-Python, zero-dependency domain engines tailored specifically to the Persian language and domestic data standards.';
      case 1:
        return lang === 'fa'
          ? 'خیر. پارسی‌کیت الگوریتم‌های ریاضی چک‌سام (مبنای ۱۱ ثبت‌احوال، الگوریتم لان کارت بانکی و استاندارد ایزو ۷۰۶۴ شبا) را به صورت محلی و بسیار سریع بررسی می‌کند. این کتابخانه به وب‌سرویس‌های آنلاین ثبت‌احوال یا بانک‌ها متصل نیست.'
          : lang === 'prs-af'
          ? 'نخیر. پارسی‌کیت صحت محاسباتی چک‌سام‌ها (الگوریتم پیمانه ۱۱ و الگوریتم لون) را به شکل کاملاً آفلاین و محلی بدون نیاز به اتصال شبکه بررسی می‌نماید.'
          : lang === 'tg'
          ? 'Не. ParsiKit алгоритмҳои риёзии чексам (Модуло 11, Лун ва стандарти ISO 7064)-ро ба таври офлайн ва бидуни ниёз ба пайвастшавии шабака санҷиш мекунад.'
          : 'No. ParsiKit evaluates mathematical checksum algorithms (Modulo 11 for National Codes, Luhn Mod 10 for Bank Cards, ISO 7064 for Sheba IBANs) and verifies structural syntax and prefix identities offline. It does not perform privileged network requests against private governmental or banking databases.';
      case 2:
        return lang === 'fa'
          ? 'بله کاملاً! مدل‌های شیءگرای parsikit.models برای اعتبارسنجی خودکار، تولید داده‌های ماسک‌شده و ادغام در اسکیماهای Pydantic v2 و فرم‌های جنگو طراحی شده‌اند.'
          : lang === 'prs-af'
          ? 'کاملاً بلی! کلاس‌های داده‌ای موجود در parsikit.models قابلیت تعامل مکمل با اسکیماهای Pydantic v2 و فرم‌های جنگو را دارند.'
          : lang === 'tg'
          ? 'Бале, комилан! Моделҳои объектгаро дар parsikit.models бо схемаҳои Pydantic v2 ва шаклҳои Django пурра мутобиқ карда шудаанд.'
          : 'Yes! ParsiKit domain models in parsikit.models provide custom validator hooks and native serialize/deserialize patterns fully compatible with Pydantic v2 schemas and Django form cleaners.';
      case 3:
        return lang === 'fa'
          ? 'پارسی‌کیت به پایتون نسخه ۳.۱۰ یا بالاتر نیاز دارد و کاملاً صفر وابستگی (Zero Dependencies) است. این ویژگی باعث می‌شود روی هر سرور، کانتینر داکر یا سیستم بدون اینترنت به سرعت نصب و اجرا شود.'
          : lang === 'prs-af'
          ? 'پارسی‌کیت به پایتون نسخه ۳.۱۰ یا بالاتر ضرورت دارد و هیچ کتابخانه خارجی را وابسته نمی‌باشد، بنابراین در هر محیط داکر یا سرور به سادگی فعال می‌شود.'
          : lang === 'tg'
          ? 'ParsiKit ба Python 3.10+ ниёз дорад ва бе ҳеҷ гуна вобастагии беруна (Zero Dependencies) дар контейнерҳои Docker ва муҳити абрӣ зуд кор мекунад.'
          : 'ParsiKit requires Python 3.10+ (tested on Python 3.10, 3.11, 3.12, and 3.13). It has ZERO external runtime dependencies, ensuring zero-configuration deployment across Docker containers, AWS Lambda, Google Cloud Run, and offline server environments.';
      default:
        return '';
    }
  };

  const faqItems = [
    { title: getFaqTitle(0), content: getFaqContent(0) },
    { title: getFaqTitle(1), content: getFaqContent(1) },
    { title: getFaqTitle(2), content: getFaqContent(2) },
    { title: getFaqTitle(3), content: getFaqContent(3) },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <SearchModal />

      <main className="flex-1">
        {route === 'home' && (
          <>
            <Hero />
            <PillarsSection />
            <Suspense fallback={<ViewLoader />}>
              <InteractivePlayground />
            </Suspense>

            {/* Quickstart Callout Spotlight */}
            <section className="py-16 md:py-24 border-t border-[#DCD5C6]/80 dark:border-[#30443D]/80 bg-[#F7F4EC] dark:bg-[#0D1715]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#176B65] via-[#105650] to-[#1D3D63] text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10 max-w-2xl">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#D6B36A] font-bold block mb-2">
                      {isRtl ? 'آماده برای توسعه و سرورهای پروداکشن' : lang === 'tg' ? 'Омода барои истифодаи расмӣ' : 'Ready for Production'}
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
                      {isRtl
                        ? 'شروع کار با پارسی‌کیت در کمتر از ۵ دقیقه'
                        : lang === 'tg'
                        ? 'Оғози кор бо ParsiKit дар камтар аз 5 дақиқа'
                        : 'Get Started with ParsiKit in under 5 minutes'}
                    </h2>
                    <p className="text-sm sm:text-base text-stone-200 leading-relaxed mb-8">
                      {isRtl
                        ? 'راهنمای گام‌به‌گام را بخوانید، مثال‌های واقعی را در پروژه‌تان کپی کنید و نرم‌افزارهای استاندارد بسازید.'
                        : lang === 'tg'
                        ? 'Роҳнамои қадам ба қадамро хонда, намунаҳои амалиро ба лоиҳаи худ нусхабардорӣ намоед.'
                        : 'Explore the full quickstart guide with production-ready snippets for FastAPI, Django, or data cleaning scripts.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigateToDoc('quickstart')}
                        className="bg-white text-[#176B65] hover:bg-[#F7F4EC] font-bold"
                      >
                        {isRtl ? 'مطالعه راهنمای شروع سریع' : lang === 'tg' ? 'Хондани роҳнамои оғоз' : 'Read Quickstart Guide'}
                      </Button>
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => navigateToDoc('installation')}
                        className="bg-white/15 hover:bg-white/20 text-white font-medium border-white/20"
                      >
                        {isRtl ? 'دستورالعمل‌های نصب' : lang === 'tg' ? 'Дастурамали насб' : 'Installation Options'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Accordion Section */}
            <section className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#176B65] dark:text-[#69C5B7] uppercase tracking-wider mb-2 font-semibold">
                  <HelpCircle className="w-4 h-4" />
                  <span>{isRtl ? 'پرسش‌های متداول' : lang === 'tg' ? 'Саволҳои маъмул' : 'Frequently Asked Questions'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#202D29] dark:text-[#F0F3EC]">
                  {isRtl ? 'سوالات پرتکرار توسعه‌دهندگان' : lang === 'tg' ? 'Саволҳо ва посухҳои асосӣ' : 'Common Questions & Answers'}
                </h2>
              </div>

              <Accordion items={faqItems} defaultOpenIndex={0} />
            </section>
          </>
        )}

        <Suspense fallback={<ViewLoader />}>
          {route === 'playground' && <InteractivePlayground />}
          {route === 'docs' && <DocumentationView />}
          {route === 'architecture' && <ArchitectureView />}
          {route === 'changelog' && <ChangelogView />}
          {route === 'not-found' && <NotFoundView />}
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
