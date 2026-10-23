import React, { useState } from 'react';
import {
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Terminal,
  ShieldCheck,
  Calendar,
  Sparkles,
  Coins,
  Cpu,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { fadeUpVariants, MOTION_TRANSITIONS } from '../lib/motion';
import { REPO_METADATA } from '../data/repoMetadata';
import { Button } from './ui/Button';

export function Hero() {
  const { lang, setRoute } = useApp();
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'validation' | 'datetime' | 'currency' | 'models'>('text');

  const isRtl = lang === 'fa';

  const copyInstallCommand = async () => {
    try {
      await navigator.clipboard.writeText('pip install parsikit');
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } catch {
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    }
  };

  const codeSnippets = {
    text: {
      title: 'text_processing.py',
      code: `import parsikit

# Master text cleansing: normalizes Arabic letters, collapses spaces, and fixes ZWNJ
raw = "می خواهم كتاب ها را باز كنم"
clean = parsikit.clean_text(raw)
print(clean)
# Output: 'می‌خواهم کتاب‌ها را باز کنم'

# SEO Pinglish slugification with built-in transliteration dictionary
slug = parsikit.slugify("راهنمای سریع نسخه ۳.۳.۱")
print(slug)
# Output: 'rahnamaye-sarie-neskheh-3-3-1'`,
    },
    validation: {
      title: 'validation_algorithms.py',
      code: `import parsikit

# Iranian National Code (Modulo 11 with weight coefficients)
is_valid = parsikit.is_valid_national_code("0010123458")
print(is_valid)  # Output: True

# Bank Card Luhn algorithm & Issuer Bank detection
card = "6037991122334455"
print(parsikit.is_valid_card_number(card))   # Output: True
print(parsikit.detect_bank_from_card(card))  # Output: 'بانک ملی ایران'

# Safe Sensitive PII Data Masking
print(parsikit.mask_card(card))              # Output: '6037-9911-****-4455'
print(parsikit.mask_mobile("09123456789"))   # Output: '0912***6789'`,
    },
    datetime: {
      title: 'jalali_astronomical.py',
      code: `import parsikit

# Convert Gregorian date to Astronomical Solar Hijri (Jalali)
jalali = parsikit.gregorian_to_jalali(2026, 10, 21)
print(jalali)
# Output: (1405, 7, 29) -> '۲۹ مهر ۱۴۰۵'

# True astronomical 33-year cycle leap year calculation
print(parsikit.is_jalali_leap(1403))  # Output: True
print(parsikit.is_jalali_leap(1404))  # Output: False

# Relative humanized time in Persian
print(parsikit.humanize_relative_time(minutes_ago=15))
# Output: '۱۵ دقیقه پیش'`,
    },
    currency: {
      title: 'financial_currency.py',
      code: `import parsikit

# Rial <-> Toman bidirectional transformation
toman = parsikit.rial_to_toman(35000000)
print(toman)  # Output: 3500000

# Number to Persian written words (up to 999 septillion)
words = parsikit.number_to_persian_words(3500000)
print(words)
# Output: 'سه میلیون و پانصد هزار تومان'

# Persian localized currency with proper grouping
formatted = parsikit.format_currency(3500000, unit="toman")
print(formatted)
# Output: '۳،۵۰۰،۰۰۰ تومان'`,
    },
    models: {
      title: 'domain_models.py',
      code: `from parsikit.models import NationalCode, BankCard, MobileNumber

# Rich object-oriented value objects with instant validation
national_id = NationalCode("0010123458")
print(national_id.masked)    # Output: '001***3458'
print(national_id.province)  # Output: 'تهران'

mobile = MobileNumber("09121234567")
print(mobile.operator)       # Output: 'Hamrah-e Aval (MCI)'
print(mobile.international)  # Output: '+989121234567'

# Native Pydantic v2 compatible fields for FastAPI & Django`,
    },
  };

  const tabs = [
    { id: 'text' as const, labelEn: 'Text & ZWNJ', labelFa: 'پردازش متن و نیم‌فاصله', icon: Sparkles },
    { id: 'validation' as const, labelEn: 'Validations', labelFa: 'اعتبارسنجی ملی و بانکی', icon: ShieldCheck },
    { id: 'datetime' as const, labelEn: 'Jalali Dates', labelFa: 'تقویم نجومی جلالی', icon: Calendar },
    { id: 'currency' as const, labelEn: 'Financial', labelFa: 'محاسبات مالی و ارز', icon: Coins },
    { id: 'models' as const, labelEn: 'Domain Models', labelFa: 'مدل‌های شیءگرا', icon: Cpu },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Iranian geometric lattice subtle backdrop */}
      <div className="absolute inset-0 bg-iranian-pattern opacity-40 pointer-events-none" />

      {/* Subtle Persian turquoise & lapis ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#126E68]/15 via-[#1D3D63]/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading, Pitch, Pip Install, CTAs */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 flex flex-col items-start text-left rtl:text-right"
          >
            {/* Unboxed Metadata (Zero-Pill Discipline) */}
            <div className="flex items-center flex-wrap gap-2 text-xs font-mono text-[#126E68] dark:text-[#52C5BE] mb-4">
              <span>ParsiKit v{REPO_METADATA.version}</span>
              <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
              <span>Python {REPO_METADATA.pythonRequirement}</span>
              <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
              <span>Zero Dependencies</span>
              <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
              <span>{REPO_METADATA.license} License</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-white leading-[1.18] mb-5">
              {isRtl ? (
                <>
                  زیرساخت خالص پایتونی برای{' '}
                  <span className="text-[#126E68] dark:text-[#52C5BE] underline decoration-[#D4A03D]/60 decoration-wavy underline-offset-8">
                    داده‌های فارسی
                  </span>
                </>
              ) : (
                <>
                  Production-Grade Python Infrastructure for{' '}
                  <span className="text-[#126E68] dark:text-[#52C5BE] underline decoration-[#D4A03D]/60 decoration-wavy underline-offset-8">
                    Persian Data
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle / Description */}
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed mb-8 max-w-xl">
              {isRtl
                ? 'کتابخانه‌ای بدون وابستگی برای پاکسازی متون فارسی و نیم‌فاصله‌ها، اعتبارسنجی الگوریتم‌های ملی و بانکی (کد ملی، کارت، شبا)، تقویم شمسی نجومی، تبدیل مبالغ و اعداد به حروف و حفظ محرمانگی داده‌ها.'
                : 'A zero-dependency library for Persian text standardization and ZWNJ handling, official national checksums (national code, card Luhn, Sheba), astronomical Jalali dates, financial computations, and sensitive data protection.'}
            </p>

            {/* Pip Install Widget */}
            <div className="w-full max-w-md mb-8">
              <div className="flex items-center justify-between p-2 pl-4 rtl:pl-2 rtl:pr-4 rounded-xl bg-stone-900 text-stone-100 border border-stone-800 shadow-md font-mono text-sm">
                <div className="flex items-center gap-2 overflow-x-auto" dir="ltr">
                  <span className="text-[#52C5BE] select-none">$</span>
                  <span className="select-all">pip install parsikit</span>
                </div>
                <button
                  onClick={copyInstallCommand}
                  aria-label={copiedInstall ? (isRtl ? 'کپی شد' : 'Copied') : (isRtl ? 'کپی دستور' : 'Copy command')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans text-stone-300 hover:text-white bg-white/10 hover:bg-white/15 transition-colors cursor-pointer shrink-0 min-h-[36px]"
                >
                  {copiedInstall ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">{isRtl ? 'کپی شد' : 'Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 opacity-80" />
                      <span>{isRtl ? 'کپی' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                onClick={() => setRoute('docs')}
              >
                <span>{isRtl ? 'مشاهده مستندات جامع' : 'Explore Documentation'}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => setRoute('playground')}
              >
                <Terminal className="w-4 h-4 text-[#126E68] dark:text-[#52C5BE]" />
                <span>{isRtl ? 'محیط آزمایشی زنده' : 'Live Playground'}</span>
              </Button>

              <a
                href="https://github.com/MRThugh/ParsiKit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors text-sm min-h-[44px]"
              >
                <span>GitHub</span>
                <span className="text-xs opacity-60">↗</span>
              </a>
            </div>

            {/* Project Creator Credit */}
            <div className="mt-8 text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <span>{isRtl ? 'توسعه‌داده شده توسط' : 'Architected & maintained by'}</span>
              <a
                href="https://github.com/MRThugh"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-stone-800 dark:text-stone-200 hover:text-[#126E68] dark:hover:text-[#52C5BE] underline underline-offset-2"
              >
                Ali Kamrani (MRThugh)
              </a>
            </div>
          </motion.div>

          {/* Right Column: Interactive Code Showcase with Tab Switcher */}
          <div className="lg:col-span-6 w-full">
            <div className="rounded-2xl border border-stone-200/90 dark:border-white/10 bg-white/70 dark:bg-[#121917]/90 backdrop-blur-xl shadow-xl overflow-hidden">
              {/* Tab Bar (Interactive Filter Controls) */}
              <div className="flex items-center gap-1 p-2 bg-stone-100/80 dark:bg-black/30 border-b border-stone-200 dark:border-white/10 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer min-h-[40px] ${
                        isActive
                          ? 'bg-white dark:bg-[#1A2422] text-[#126E68] dark:text-[#52C5BE] shadow-sm font-semibold'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{isRtl ? tab.labelFa : tab.labelEn}</span>
                    </button>
                  );
                })}
              </div>

              {/* Code Surface */}
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3 text-xs text-stone-500 dark:text-stone-400">
                  <span className="font-mono text-stone-700 dark:text-stone-300 font-medium">
                    {codeSnippets[activeTab].title}
                  </span>
                  <span className="text-[11px] font-mono text-[#D4A03D]">
                    Python 3.10+
                  </span>
                </div>

                <div className="rounded-xl overflow-hidden border border-stone-900/10 dark:border-white/5 bg-[#141B19] text-[#E2E8E7]">
                  <pre
                    dir="ltr"
                    className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-left"
                  >
                    <code>{codeSnippets[activeTab].code}</code>
                  </pre>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span>
                    {isRtl ? 'بدون وابستگی جانبی • اجرای محلی' : 'Pure Python • Zero external C/Rust dependencies'}
                  </span>
                  <button
                    onClick={() => setRoute('playground')}
                    className="text-[#126E68] dark:text-[#52C5BE] font-medium hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isRtl ? 'تست آنلاین در مرورگر' : 'Run live in browser'}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
