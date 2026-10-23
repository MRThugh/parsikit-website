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
  const { lang, navigateToDoc, isRtl } = useApp();

  const getPillarTitle = (num: string) => {
    switch (num) {
      case '01':
        return lang === 'fa' ? 'کش سریع درون‌حافظه‌ای و تنظیمات سراسری'
          : lang === 'prs-af' ? 'سیستم کش سریع درون‌حافظه‌ای و تنظیمات عمومی'
          : lang === 'tg' ? 'Кеши сареъи дохилихотиравӣ ва танзимоти куллӣ'
          : 'Thread-Safe LRU Cache & Central Configuration';
      case '02':
        return lang === 'fa' ? 'سیستم خطای ساختاریافته ایرانی'
          : lang === 'prs-af' ? 'سلسله‌مراتب استثناهای ساختاریافته'
          : lang === 'tg' ? 'Силсилаи сохторбандишудаи хатоҳо'
          : 'Structured Domain Exception Hierarchy';
      case '03':
        return lang === 'fa' ? 'مدل‌های شیءگرا و سازگاری با Pydantic'
          : lang === 'prs-af' ? 'مدل‌های شیءگرا و هماهنگی با Pydantic'
          : lang === 'tg' ? 'Моделҳои объектгаро ва ҳамоҳангӣ бо Pydantic'
          : 'Object-Oriented Domain Models & Pydantic v2';
      case '04':
        return lang === 'fa' ? 'ابزارهای عیب‌یابی و تراز بصری فارسی'
          : lang === 'prs-af' ? 'ابزارهای عیب‌یابی و تراز بصری متون'
          : lang === 'tg' ? 'Абзорҳои ташхиси хато ва танзими матн'
          : 'Developer Diagnostics & True Visual Width';
      case '05':
        return lang === 'fa' ? 'پکیج امنیت و ماسک داده‌های حساس کاربر'
          : lang === 'prs-af' ? 'بسته امنیتی و مخفی‌سازی داده‌های حساس'
          : lang === 'tg' ? 'Маҷмӯаи амният ва ниқоббандии додаҳои ҳассос'
          : 'Security Suite & Sensitive PII Masking';
      default:
        return '';
    }
  };

  const getPillarDesc = (num: string) => {
    switch (num) {
      case '01':
        return lang === 'fa'
          ? 'عملیات سنگین پردازشی (مانند تبدیل ارقام چندمیلیاردی به حروف فارسی یا محاسبات دقیق نجومی تقویم جلالی) با سیستم کش ایمن در چندنخی (Thread-safe) بهینه‌سازی می‌شوند.'
          : lang === 'prs-af'
          ? 'عملیات سنگین پردازشی (همچون تبدیل ارقام به حروف یا تبدیلات تقویم هجری شمسی) با سیستم کش چندنخی بهینه‌سازی شده‌اند.'
          : lang === 'tg'
          ? 'Амалиёти вазнини ҳисоботӣ (ба монанди табдили рақамҳо ба калимаҳо ё тақвими шамсӣ) бо механизми кешкунӣ суръат бахшида мешаванд.'
          : 'Repetitive CPU-bound transformations (e.g. converting multi-digit numbers to words or astronomical calendar math) are optimized with an internal thread-safe LRU cache.';
      case '02':
        return lang === 'fa'
          ? 'سلسله‌مراتب خطای اختصاصی و استانداردی مانند InvalidNationalCodeError و InvalidCardNumberError فراهم شده که برای معماری تمیز (Clean Architecture) ایده‌آل است.'
          : lang === 'prs-af'
          ? 'سلسله‌مراتب استثناهای اختصاصی مانند InvalidNationalCodeError و InvalidCardNumberError برای مهندسی پاک فراهم شده است.'
          : lang === 'tg'
          ? 'Силсилаи хатоҳои хоси ParsiKit барои сохтори мустаҳками меъмории нармафзор.'
          : 'Never wrestle with generic ValueError crashes. ParsiKit provides a structured, sanitized exception tree tailored to identity and financial standards.';
      case '03':
        return lang === 'fa'
          ? 'رشته‌های خام ورودی را درون شیءهای باارزش مانند NationalCode، MobileNumber، BankCard و Sheba کپسوله کنید که با Pydantic هماهنگ هستند.'
          : lang === 'prs-af'
          ? 'کپسوله‌سازی مقادیر خام درون کلاس‌های NationalCode، BankCard و MobileNumber همراه با اعتبارسنجی خودکار.'
          : lang === 'tg'
          ? 'Қолаббандии сатрҳои хом дар дохили классҳои NationalCode ва BankCard бо тафтиши фаврӣ.'
          : 'Wrap raw inputs in rich value objects like NationalCode, MobileNumber, BankCard, or Sheba that validate instantly and serialize with Pydantic v2.';
      case '04':
        return lang === 'fa'
          ? 'پارسی‌کیت پهنای واقعی کاراکترها روی مانیتور را محاسبه کرده و امکان عیب‌یابی متون را میسر می‌سازد.'
          : lang === 'prs-af'
          ? 'محاسبه پهنای واقعی کاراکترهای دارای نیم‌فاصله در خروجی کنسول و جدول‌های ترمینال.'
          : lang === 'tg'
          ? 'Ҳисоби паҳнои воқеии аломатҳо ва нимафосилаҳо дар намоиши терминал.'
          : 'Calculate true visual terminal width for flawless CLI tables and logs, alongside interactive text inspection.';
      case '05':
        return lang === 'fa'
          ? 'لاگ‌ها، ردیابی خطاها و پنل‌های مدیریتی را با ماسک کردن ارقام میانی شماره موبایل، کارت بانکی، کد ملی و ایمیل ایمن کنید.'
          : lang === 'prs-af'
          ? 'حفظ محرمانگی اطلاعات با ماسک‌کردن ارقام میانی شماره‌های تماس، کارت بانکی و تذکره.'
          : lang === 'tg'
          ? 'Ҳифзи махфияти маълумот бо ниқоббандии рақами кортҳо ва телефонҳо дар сабтҳои системавӣ.'
          : 'Sanitize logs and admin displays by safely masking the middle digits of mobiles, bank cards, national codes, and emails.';
      default:
        return '';
    }
  };

  const pillars = [
    {
      num: '01',
      title: getPillarTitle('01'),
      module: 'parsikit.cache & parsikit.config',
      desc: getPillarDesc('01'),
      icon: Zap,
      docSlug: 'api/cache',
    },
    {
      num: '02',
      title: getPillarTitle('02'),
      module: 'parsikit.exceptions',
      desc: getPillarDesc('02'),
      icon: AlertTriangle,
      docSlug: 'api/models',
    },
    {
      num: '03',
      title: getPillarTitle('03'),
      module: 'parsikit.models',
      desc: getPillarDesc('03'),
      icon: Boxes,
      docSlug: 'tutorials/models',
    },
    {
      num: '04',
      title: getPillarTitle('04'),
      module: 'parsikit.dev',
      desc: getPillarDesc('04'),
      icon: Activity,
      docSlug: 'api/text',
    },
    {
      num: '05',
      title: getPillarTitle('05'),
      module: 'parsikit.validators & parsikit.text',
      desc: getPillarDesc('05'),
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
              ? 'پنج ستون فنی برای توسعه حرفه‌ای با داده‌های زبان فارسی'
              : 'Five Core Architectural Pillars Built for Production'}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
            {isRtl
              ? 'پارسی‌کیت از اسکریپت‌های ابتدایی عبور کرده و ساختاری استاندارد، ماژولار و امن برای استفاده در سرویس‌های مدرن پایتونی ارائه می‌دهد.'
              : 'Engineered as an enterprise-ready foundation for Python backends (FastAPI, Django, async tasks, and data science pipelines) handling domestic data structures.'}
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

                  <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 block mb-1" dir="ltr">
                    {pillar.module}
                  </span>

                  <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-3 group-hover:text-[#126E68] dark:group-hover:text-[#52C5BE] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    {pillar.desc}
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
