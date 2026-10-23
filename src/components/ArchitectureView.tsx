import React from 'react';
import { Database, Zap, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CodeBlock } from './CodeBlock';
import { getTranslations } from '../i18n/translations';

export function ArchitectureView() {
  const { lang, navigateToDoc, isRtl } = useApp();
  const t = getTranslations(lang);

  const cacheSnippet = `import threading
from collections import OrderedDict
from typing import Any, Optional

class ThreadSafeLRUCache:
    """Thread-safe bounded in-memory cache for CPU-intensive transformations."""
    def __init__(self, maxsize: int = 1024):
        self._maxsize = maxsize
        self._cache: OrderedDict[str, Any] = OrderedDict()
        self._lock = threading.Lock()

    def get(self, key: str) -> Optional[Any]:
        with self._lock:
            if key not in self._cache:
                return None
            self._cache.move_to_end(key)
            return self._cache[key]

    def set(self, key: str, value: Any) -> None:
        with self._lock:
            if key in self._cache:
                self._cache.move_to_end(key)
            self._cache[key] = value
            if len(self._cache) > self._maxsize:
                self._cache.popitem(last=False)`;

  const layers = [
    {
      level: 'Layer 4',
      name: lang === 'fa' ? 'ابزارهای توسعه‌دهنده و رابط کاربری' : lang === 'prs-af' ? 'ابزارهای انجنیری و رابط کاربری' : lang === 'tg' ? 'Абзорҳои таҳиякунанда ва интерфейс' : 'Developer Tools & UI Integrations',
      modules: 'parsikit.dev · parsikit.gui · parsikit.config',
      desc: lang === 'fa'
        ? 'تراز بصری متن‌ها در ترمینال، عیب‌یابی متن، اتصال به ابزارهای گرافیکی و تنظیمات سراسری.'
        : lang === 'prs-af'
        ? 'تراز بصری متون در کنسول، عیب‌یابی متن، اتصال به ابزارهای گرافیکی و تنظیمات عمومی سیستم.'
        : lang === 'tg'
        ? 'Танзими визуалии матнҳо дар терминал, ташхиси хатогиҳо ва пайвастшавӣ ба абзорҳои графикӣ.'
        : 'Visual terminal alignment (pformat), text debugging, GUI font reshaping, global settings.',
      color: 'border-l-sky-500',
    },
    {
      level: 'Layer 3',
      name: lang === 'fa' ? 'مدل‌های شیءگرا و اعتبارسنجی دامنه' : lang === 'prs-af' ? 'مدل‌های شیءگرا و اعتبارسنجی هویت' : lang === 'tg' ? 'Моделҳои объектгаро ва тасдиқи додаҳо' : 'Object-Oriented Domain Models',
      modules: 'parsikit.models',
      desc: lang === 'fa'
        ? 'کپسوله‌سازی مقادیر با اعتبارسنجی خودکار، متدهای استخراج استان و اپراتور، و پشتیبانی از Pydantic v2.'
        : lang === 'prs-af'
        ? 'کپسوله‌سازی مقادیر با بررسی خودکار صحت، استخراج ولایت و اپراتور، و هماهنگی کامل با Pydantic.'
        : lang === 'tg'
        ? 'Моделҳои маълумотӣ бо санҷиши худкор, муайянсозии оператор ва мутобиқат бо Pydantic.'
        : 'Rich value objects (NationalCode, BankCard, MobileNumber, Sheba) with native Pydantic v2 support.',
      color: 'border-l-[#126E68]',
    },
    {
      level: 'Layer 2',
      name: lang === 'fa' ? 'الگوریتم‌های محاسباتی و تبدیل فرمت' : lang === 'prs-af' ? 'الگوریتم‌های محاسباتی و تبدیلات زمانی' : lang === 'tg' ? 'Алгоритмҳои муҳосибавӣ ва тақвимӣ' : 'Domain Algorithms & Formatters',
      modules: 'parsikit.text · parsikit.validators · parsikit.currency · parsikit.datetime',
      desc: lang === 'fa'
        ? 'الگوریتم‌های خالص پایتونی بدون هیچ وابستگی: چک‌سام کد ملی، الگوریتم لان، تقویم جلالی و تبدیل اعداد به حروف.'
        : lang === 'prs-af'
        ? 'الگوریتم‌های پایتونی خالص بدون وابستگی: چک‌سام تذکره، الگوریتم لون، تقویم هجری شمسی و ارقام به حروف.'
        : lang === 'tg'
        ? 'Алгоритмҳои холиси Python: чексами рақами миллӣ, алгоритми Лун, тақвими шамсӣ ва ададҳо ба калимаҳо.'
        : 'Pure algorithmic transformations: Modulo 11, Luhn, astronomical Jalali calendar, written numbers.',
      color: 'border-l-[#D4A03D]',
    },
    {
      level: 'Layer 1',
      name: lang === 'fa' ? 'زیرساخت پایه و مدیریت خطاها' : lang === 'prs-af' ? 'زیرساخت اساسی و مدیریت استثناها' : lang === 'tg' ? 'Зерсохти аслӣ ва идораи хатоҳо' : 'Core Infrastructure Primitives',
      modules: 'parsikit.cache · parsikit.exceptions',
      desc: lang === 'fa'
        ? 'کش سریع و امن در چندنخی و درخت خطاهای اختصاصی پاکسازی‌شده بدون نشت اطلاعات کاربر.'
        : lang === 'prs-af'
        ? 'سیستم کش سریع و محفوظ در چندنخی و درخت خطاهای اختصاصی بدون افشای اطلاعات حساس کاربران.'
        : lang === 'tg'
        ? 'Кеши сареъ барои муҳити бисёрриштагӣ ва идораи хатоҳо бидуни ифшои додаҳои ҳассос.'
        : 'Thread-safe in-memory caching and sanitized Iranian domain exception tree.',
      color: 'border-l-rose-500',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Header */}
      <div className="mb-12">
        <div className="text-xs font-mono text-[#126E68] dark:text-[#52C5BE] uppercase tracking-wider mb-2">
          {t.architecture.principlesTitle}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-4">
          {t.architecture.title}
        </h1>
        <p className="text-base text-stone-600 dark:text-stone-300 leading-relaxed max-w-3xl">
          {t.architecture.subtitle}
        </p>
      </div>

      {/* Layer Diagram */}
      <div className="space-y-4 mb-16">
        <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-4">
          {t.architecture.layersTitle}
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {layers.map((layer) => (
            <div
              key={layer.level}
              className="p-5 rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#141C1A] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#D4A03D]">
                    {layer.level}
                  </span>
                  <span className="text-stone-300 dark:text-stone-700">·</span>
                  <span className="font-semibold text-sm text-stone-900 dark:text-white">
                    {layer.name}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  {layer.desc}
                </p>
              </div>

              <div className="font-mono text-xs text-[#126E68] dark:text-[#52C5BE] shrink-0 bg-[#126E68]/10 dark:bg-[#126E68]/20 px-3 py-1.5 rounded-lg" dir="ltr">
                {layer.modules}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deep-Dive Technical Sections */}
      <div className="space-y-12">
        {/* Pillar 1: Zero External Dependencies */}
        <section className="p-6 sm:p-8 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#141C1A]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#126E68]/10 dark:bg-[#126E68]/20 flex items-center justify-center text-[#126E68] dark:text-[#52C5BE]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                {isRtl ? '۱. فلسفه صفر وابستگی (Zero Dependencies)' : '1. Zero External Dependencies Philosophy'}
              </h3>
              <span className="text-xs text-stone-400">
                {isRtl ? 'اجرا تنها با کتابخانه استاندارد پایتون (re, math, datetime, typing)' : 'Powered strictly by Python Standard Library'}
              </span>
            </div>
          </div>
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
            {isRtl
              ? 'کتابخانه‌های متفرقه معمولا با نیاز به نصب صدها مگابایت پکیج‌های C/Rust یا کامپایلرهای خارجی، ساخت ایمیج‌های داکر را کند می‌کنند. پارسی‌کیت تمام منطق پردازش حروف یونیکد، تقویم جلالی و محاسبات ریاضی را خالص در پایتون ۳.۱۰+ پیاده‌سازی کرده است.'
              : 'Many localization packages require native C extensions, large binary wheels, or heavy regex engines that complicate lightweight Docker builds. ParsiKit guarantees instant cold starts and minimal container footprint without any external wheel dependencies.'}
          </p>
        </section>

        {/* Pillar 2: Thread-Safe Caching */}
        <section className="p-6 sm:p-8 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#141C1A]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#D4A03D]/10 dark:bg-[#D4A03D]/20 flex items-center justify-center text-[#D4A03D]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                {isRtl ? '۲. سیستم کش چندنخی (Thread-Safe LRU Cache)' : '2. Thread-Safe In-Memory LRU Cache'}
              </h3>
              <span className="text-xs text-stone-400">
                {isRtl ? 'بهینه‌سازی محاسبات سنگین ریاضی و تاریخی در سرورهای همزمان' : 'Sub-millisecond latency for repetitive transformations'}
              </span>
            </div>
          </div>
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
            {isRtl
              ? 'برای سرویس‌هایی با ترافیک بالا (مانند درگاه‌های پرداخت، فاکتورهای بانکی و فرم‌های ثبت‌نام)، تبدیل مکرر ارقام به حروف و تقویم با قفل اختصاصی پایتون کش می‌شوند تا هیچ پردازش تکراری روی پردازنده تحمیل نشود.'
              : 'High-throughput APIs (such as payment gateways and accounting microservices) benefit from atomic in-memory caching that eliminates redundant date parsing and integer decomposition.'}
          </p>
          <div dir="ltr">
            <CodeBlock code={cacheSnippet} language="python" title="parsikit/cache.py" />
          </div>
        </section>

        {/* Pillar 3: Defensive Security & PII Protection */}
        <section className="p-6 sm:p-8 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#141C1A]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                {isRtl ? '۳. حفظ امنیت و محرمانگی داده‌ها (PII Protection)' : '3. Defensive PII Security & Safe Exception Logging'}
              </h3>
              <span className="text-xs text-stone-400">
                {isRtl ? 'عدم افشای کدهای ملی و شماره کارت‌ها در لاگ‌ها و ردیابی ارورها' : 'Zero credential exposure in stack traces'}
              </span>
            </div>
          </div>
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {isRtl
              ? 'در نسخه ۳.۳.۱، پیام‌های خطای InvalidCardNumberError و InvalidNationalCodeError به صورت کامل پاکسازی شده‌اند تا اگر استثنایی رخ داد و در سیستم‌هایی مانند Sentry لاگ شد، اطلاعات هویتی و مالی کاربر نشت پیدا نکند.'
              : 'In v3.3.1, exception constructors for InvalidCardNumberError and InvalidNationalCodeError sanitize all payload inputs. Raw 16-digit PANs and 10-digit national codes are never exposed to central log aggregators or APM monitoring tools.'}
          </p>
        </section>
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <button
          onClick={() => navigateToDoc('development/architecture')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#126E68] text-white font-medium hover:bg-[#0D544F] transition-colors cursor-pointer text-sm"
        >
          <span>{t.architecture.viewInDocs}</span>
          {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
