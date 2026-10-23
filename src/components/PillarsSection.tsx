import React from 'react';
import {
  Zap,
  AlertTriangle,
  Boxes,
  Activity,
  Lock,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function PillarsSection() {
  const { lang, navigateToDoc } = useApp();
  const isRtl = lang === 'fa';

  const pillars = [
    {
      num: '01',
      titleEn: 'Thread-Safe LRU Cache & Central Configuration',
      titleFa: 'کش سریع درون‌حافظه‌ای و تنظیمات سراسری',
      module: 'parsikit.cache & parsikit.config',
      descEn:
        'Repetitive CPU-bound transformations (e.g. converting multi-digit numbers to Persian words or astronomical calendar math) are optimized with an internal thread-safe LRU cache. Global parameters like default VAT rates and currency units can be toggled dynamically.',
      descFa:
        'عملیات سنگین پردازشی (مانند تبدیل ارقام چندمیلیاردی به حروف فارسی یا محاسبات دقیق نجومی تقویم جلالی) با سیستم کش ایمن در چندنخی (Thread-safe) بهینه‌سازی می‌شوند. همچنین تنظیمات سراسری مالیات و ارز پیش‌فرض به آسانی قابل کنترل است.',
      icon: Zap,
      docSlug: 'api/cache',
    },
    {
      num: '02',
      titleEn: 'Structured Iranian Domain Exception Hierarchy',
      titleFa: 'سیستم خطای ساختاریافته ایرانی',
      module: 'parsikit.exceptions',
      descEn:
        'Never wrestle with generic ValueError or TypeError crashes. ParsiKit provides a structured, sanitized exception tree tailored to Iranian identity and financial standards (e.g. InvalidNationalCodeError, InvalidCardNumberError) designed for Clean Architecture and DDD.',
      descFa:
        'دیگر نیازی به سر و کله زدن با استثناهای کلی پایتون نیست. پارسی‌کیت سلسله‌مراتب خطای اختصاصی و استانداردی مانند InvalidNationalCodeError و InvalidCardNumberError فراهم کرده که برای معماری تمیز (Clean Architecture) و Domain-Driven Design ایده‌آل است.',
      icon: AlertTriangle,
      docSlug: 'api/models',
    },
    {
      num: '03',
      titleEn: 'Object-Oriented Domain Models & Pydantic v2',
      titleFa: 'مدل‌های شیءگرا و سازگاری با Pydantic',
      module: 'parsikit.models',
      descEn:
        'Wrap raw inputs in rich value objects like NationalCode, MobileNumber, BankCard, Sheba, or VehiclePlate. They validate on instantiation, extract rich metadata (province of issue, card issuer bank, operator), and serialize cleanly with FastAPI.',
      descFa:
        'رشته‌های خام ورودی را درون شیءهای باارزش مانند NationalCode، MobileNumber، BankCard و Sheba کپسوله کنید. این مدل‌ها به محض ساخته‌شدن ورودی را اعتبارسنجی می‌کنند، اپراتور سیم‌کارت یا بانک صادرکننده را استخراج کرده و با Pydantic هماهنگ هستند.',
      icon: Boxes,
      docSlug: 'tutorials/models',
    },
    {
      num: '04',
      titleEn: 'Developer Diagnostics & True Visual Width',
      titleFa: 'ابزارهای عیب‌یابی و تراز بصری فارسی',
      module: 'parsikit.dev',
      descEn:
        'Python formatters often miscalculate the length of strings containing Zero-Width Non-Joiners (ZWNJs) or Arabic diacritics. ParsiKit calculates true visual terminal width for flawless CLI tables and logs, alongside interactive text inspection.',
      descFa:
        'فرمت‌کننده‌های استاندارد پهنای متون حاوی نیم‌فاصله یا اعراب را اشتباه محاسبه می‌کنند و تراز جدول‌های ترمینال به هم می‌ریزد. پارسی‌کیت پهنای واقعی کاراکترها روی مانیتور را محاسبه کرده و امکان عیب‌یابی متون را میسر می‌سازد.',
      icon: Activity,
      docSlug: 'api/dev_and_gui',
    },
    {
      num: '05',
      titleEn: 'Security Suite & Sensitive PII Masking',
      titleFa: 'پکیج امنیت و ماسک داده‌های حساس کاربر',
      module: 'parsikit.validators & parsikit.text',
      descEn:
        'Sanitize logs, monitoring traces, and admin displays by safely masking the middle digits of Iranian mobiles, bank cards, national codes, and emails. Exceptions are sanitized so raw user PII is never exposed in stack traces.',
      descFa:
        'لاگ‌ها، ردیابی خطاها و پنل‌های مدیریتی را با ماسک کردن ارقام میانی شماره موبایل، کارت بانکی، کد ملی و ایمیل ایمن کنید. پیام‌های خطا به صورت خودکار پاکسازی می‌شوند تا داده‌های حساس کاربر هرگز نشت نکنند.',
      icon: Lock,
      docSlug: 'guides/forms_and_security',
    },
  ];

  return (
    <section className="py-20 md:py-28 border-t border-stone-200/80 dark:border-white/10 bg-[#F7F4ED]/60 dark:bg-[#0C1211]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono text-[#126E68] dark:text-[#52C5BE] uppercase tracking-wider mb-2">
            {isRtl ? 'معماری و قابلیت‌های نسخه ۳.۳.۱' : 'Engineering & Architecture Pillars'}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 dark:text-white leading-tight mb-4">
            {isRtl
              ? 'پنج ستون فنی برای توسعه حرفه‌ای با داده‌های فارسی'
              : 'Five Core Architectural Pillars Built for Production'}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
            {isRtl
              ? 'پارسی‌کیت از اسکریپت‌های ابتدایی عبور کرده و ساختاری استاندارد، ماژولار و امن برای استفاده در سرویس‌های مدرن پایتونی (FastAPI، Django، ربات‌ها و کارهای علم داده) ارائه می‌دهد.'
              : 'Engineered as an enterprise-ready foundation for Python backends (FastAPI, Django, async tasks, and data science pipelines) handling Iranian data structures.'}
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.num}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-[#151D1B] border border-stone-200/90 dark:border-white/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-[#D4A03D] font-bold">
                      {pillar.num}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#126E68]/10 dark:bg-[#126E68]/20 flex items-center justify-center text-[#126E68] dark:text-[#52C5BE]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 block mb-1">
                    {pillar.module}
                  </span>

                  <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-3 group-hover:text-[#126E68] dark:group-hover:text-[#52C5BE] transition-colors">
                    {isRtl ? pillar.titleFa : pillar.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    {isRtl ? pillar.descFa : pillar.descEn}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 dark:border-white/5">
                  <button
                    onClick={() => navigateToDoc(pillar.docSlug)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#126E68] dark:text-[#52C5BE] hover:underline cursor-pointer"
                  >
                    <span>{isRtl ? 'مطالعه مستندات مربوطه' : 'Read documentation'}</span>
                    {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
