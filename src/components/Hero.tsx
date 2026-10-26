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
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { fadeUpVariants } from '../lib/motion';
import { REPO_METADATA } from '../data/repoMetadata';
import { getTranslations } from '../i18n/translations';
import { Button } from './ui/Button';

export function Hero() {
  const { lang, setRoute, isRtl } = useApp();
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'validation' | 'datetime' | 'currency' | 'models'>('text');

  const t = getTranslations(lang);

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

# Iranian / Afghan National Code & Identity validation (Modulo 11)
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

# Localized currency with proper digit grouping
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
    { id: 'text' as const, label: t.playground.tools.text.name, icon: Sparkles },
    { id: 'validation' as const, label: t.playground.tools.nationalCode.name, icon: ShieldCheck },
    { id: 'datetime' as const, label: t.playground.tools.calendar.name, icon: Calendar },
    { id: 'currency' as const, label: t.playground.tools.numberWords.name, icon: Coins },
    { id: 'models' as const, label: lang === 'en' ? 'Domain Models' : lang === 'tg' ? 'Моделҳои объектгаро' : 'مدل‌های شیءگرا', icon: Cpu },
  ];

  const activeSnippet = codeSnippets[activeTab];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Subtle Persian Girih lattice background */}
      <div className="absolute inset-0 bg-iranian-pattern opacity-60 pointer-events-none" />

      {/* Subtle Persian turquoise & lapis ambient illumination */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[360px] bg-gradient-to-tr from-[#176B65]/12 via-[#1D3D63]/10 to-[#B68A3D]/8 blur-3xl pointer-events-none rounded-full" />

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
            <div className="flex items-center flex-wrap gap-2 text-xs font-mono text-[#176B65] dark:text-[#69C5B7] mb-4">
              <span className="font-semibold">ParsiKit v{REPO_METADATA.version}</span>
              <span aria-hidden="true" className="text-[#DCD5C6] dark:text-[#30443D]">·</span>
              <span>Python {REPO_METADATA.pythonRequirement}</span>
              <span aria-hidden="true" className="text-[#DCD5C6] dark:text-[#30443D]">·</span>
              <span>Zero Dependencies</span>
              <span aria-hidden="true" className="text-[#DCD5C6] dark:text-[#30443D]">·</span>
              <span>{REPO_METADATA.license} License</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#202D29] dark:text-[#F0F3EC] leading-[1.18] mb-5">
              {t.hero.headlinePart1}
              <span className="text-[#176B65] dark:text-[#69C5B7] underline decoration-[#B68A3D]/60 decoration-wavy underline-offset-8">
                {t.hero.headlineHighlight}
              </span>
              {t.hero.headlinePart2}
            </h1>

            {/* Subtitle / Description */}
            <p className="text-base sm:text-lg text-[#596760] dark:text-[#B1C0B8] leading-relaxed mb-8 max-w-xl">
              {t.hero.description}
            </p>

            {/* Pip Install Widget */}
            <div className="w-full max-w-md mb-8">
              <div className="flex items-center justify-between p-2 pl-4 rtl:pl-2 rtl:pr-4 rounded-xl bg-[#101D1A] text-[#E6EFEA] border border-[#30443D] shadow-md font-mono text-sm">
                <div className="flex items-center gap-2 overflow-x-auto" dir="ltr">
                  <span className="text-[#69C5B7] select-none font-bold">$</span>
                  <span className="select-all">pip install parsikit</span>
                </div>
                <button
                  onClick={copyInstallCommand}
                  aria-label={copiedInstall ? t.hero.copied : t.hero.copyCmd}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans text-stone-300 hover:text-white bg-white/10 hover:bg-white/15 transition-colors cursor-pointer shrink-0 min-h-[36px]"
                >
                  {copiedInstall ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">{t.hero.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 opacity-80" />
                      <span>{t.hero.copyCmd}</span>
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
                <span>{t.hero.exploreDocs}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => setRoute('playground')}
              >
                <Terminal className="w-4 h-4 text-[#176B65] dark:text-[#69C5B7]" />
                <span>{t.hero.livePlayground}</span>
              </Button>
            </div>
          </motion.div>

          {/* Right Column: Code Showcase & Feature Tabs */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 w-full"
          >
            {/* Interactive Tab Bar */}
            <div className="flex items-center gap-1 p-1 bg-[#EFE9DB]/80 dark:bg-[#182A26] rounded-xl border border-[#DCD5C6] dark:border-[#30443D] mb-3 overflow-x-auto">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer min-h-[38px] ${
                      isActive
                        ? 'bg-white dark:bg-[#20352F] text-[#176B65] dark:text-[#69C5B7] shadow-sm font-semibold'
                        : 'text-[#596760] dark:text-[#B1C0B8] hover:text-[#202D29] dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Code Box */}
            <div className="rounded-2xl border border-[#DCD5C6] dark:border-[#30443D] bg-[#101D1A] text-[#E6EFEA] shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#0A1311] border-b border-[#30443D]/60 text-xs text-stone-400">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 opacity-60">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="font-mono text-stone-300 ml-2">{activeSnippet.title}</span>
                </div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#69C5B7]">Python 3.10+</span>
              </div>

              <pre dir="ltr" className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-left text-stone-200">
                <code>{activeSnippet.code}</code>
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
