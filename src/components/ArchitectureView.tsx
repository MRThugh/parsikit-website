import React from 'react';
import { Database, Zap, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CodeBlock } from './CodeBlock';
import { Button } from './ui/Button';
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
      badgeColor: 'text-sky-600 dark:text-sky-400',
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
      badgeColor: 'text-[var(--primary)]',
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
      badgeColor: 'text-[var(--accent)]',
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
      badgeColor: 'text-rose-600 dark:text-rose-400',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Header */}
      <div className="mb-12">
        <div className="text-xs font-mono font-semibold text-[var(--primary)] uppercase tracking-wider mb-2">
          {t.architecture.principlesTitle}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-4">
          {t.architecture.title}
        </h1>
        <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-3xl">
          {t.architecture.subtitle}
        </p>
      </div>

      {/* Layer Diagram */}
      <div className="space-y-4 mb-16">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
          {t.architecture.layersTitle}
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {layers.map((layer) => (
            <div
              key={layer.level}
              className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[var(--primary)]/40"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`font-mono text-xs font-bold ${layer.badgeColor}`}>
                    {layer.level}
                  </span>
                  <span className="text-[var(--text-muted)]">·</span>
                  <span className="font-semibold text-sm text-[var(--text-primary)]">
                    {layer.name}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {layer.desc}
                </p>
              </div>

              <div
                className="font-mono text-xs text-[var(--primary)] shrink-0 bg-[var(--primary-surface)] border border-[var(--primary)]/15 px-3 py-1.5 rounded-lg"
                dir="ltr"
              >
                {layer.modules}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deep-Dive Technical Sections */}
      <div className="space-y-8">
        {/* Pillar 1: Zero External Dependencies */}
        <section className="p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary-surface)] border border-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                {isRtl ? '۱. فلسفه صفر وابستگی (Zero Dependencies)' : '1. Zero External Dependencies Philosophy'}
              </h3>
              <span className="text-xs text-[var(--text-muted)]">
                {isRtl ? 'اجرا تنها با کتابخانه استاندارد پایتون (re, math, datetime, typing)' : 'Powered strictly by Python Standard Library'}
              </span>
            </div>
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {isRtl
              ? 'کتابخانه‌های متفرقه معمولا با نیاز به نصب صدها مگابایت پکیج‌های C/Rust یا کامپایلرهای خارجی، ساخت ایمیج‌های داکر را کند می‌کنند. پارسی‌کیت تمام منطق پردازش حروف یونیکد، تقویم جلالی و محاسبات ریاضی را خالص در پایتون ۳.۱۰+ پیاده‌سازی کرده است.'
              : 'Many localization packages require native C extensions, large binary wheels, or heavy regex engines that complicate lightweight Docker builds. ParsiKit guarantees instant cold starts and minimal container footprint without any external wheel dependencies.'}
          </p>
        </section>

        {/* Pillar 2: Thread-Safe Caching */}
        <section className="p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-surface)] border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                {isRtl ? '۲. سیستم کش چندنخی (Thread-Safe LRU Cache)' : '2. Thread-Safe In-Memory LRU Cache'}
              </h3>
              <span className="text-xs text-[var(--text-muted)]">
                {isRtl ? 'بهینه‌سازی محاسبات سنگین ریاضی و تاریخی در سرورهای همزمان' : 'Sub-millisecond latency for repetitive transformations'}
              </span>
            </div>
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
            {isRtl
              ? 'برای سرویس‌هایی با ترافیک بالا (مانند درگاه‌های پرداخت، فاکتورهای بانکی و فرم‌های ثبت‌نام)، تبدیل مکرر ارقام به حروف و تقویم با قفل اختصاصی پایتون کش می‌شوند تا هیچ پردازش تکراری روی پردازنده تحمیل نشود.'
              : 'High-throughput APIs (such as payment gateways and accounting microservices) benefit from atomic in-memory caching that eliminates redundant date parsing and integer decomposition.'}
          </p>
          <div dir="ltr">
            <CodeBlock code={cacheSnippet} language="python" title="parsikit/cache.py" />
          </div>
        </section>

        {/* Pillar 3: Defensive Security & PII Protection */}
        <section className="p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                {isRtl ? '۳. حفظ امنیت و محرمانگی داده‌ها (PII Protection)' : '3. Defensive PII Security & Safe Exception Logging'}
              </h3>
              <span className="text-xs text-[var(--text-muted)]">
                {isRtl ? 'عدم افشای کدهای ملی و شماره کارت‌ها در لاگ‌ها و ردیابی ارورها' : 'Zero credential exposure in stack traces'}
              </span>
            </div>
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {isRtl
              ? 'در نسخه ۳.۳.۱، پیام‌های خطای InvalidCardNumberError و InvalidNationalCodeError به صورت کامل پاکسازی شده‌اند تا اگر استثنایی رخ داد و در سیستم‌هایی مانند Sentry لاگ شد، اطلاعات هویتی و مالی کاربر نشت پیدا نکند.'
              : 'In v3.3.1, exception constructors for InvalidCardNumberError and InvalidNationalCodeError sanitize all payload inputs. Raw 16-digit PANs and 10-digit national codes are never exposed to central log aggregators or APM monitoring tools.'}
          </p>
        </section>
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigateToDoc('development/architecture')}
          className="inline-flex items-center gap-2"
        >
          <span>{t.architecture.viewInDocs}</span>
          {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
