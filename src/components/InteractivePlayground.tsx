import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CreditCard,
  Coins,
  Calendar,
  Smartphone,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  toPersianDigits,
  numberToWords,
  rialToToman,
  tomanToRial,
  formatPersianCurrency,
} from '../lib/persianNumber';
import {
  isValidNationalCode,
  isValidCardNumber,
  detectBank,
  detectMobileOperator,
  maskCard,
  maskMobile,
  maskNationalCode,
  cleanText,
} from '../lib/validation';
import {
  gregorianToJalali,
  isJalaliLeap,
  formatJalaliDate,
} from '../lib/jalali';

export function InteractivePlayground() {
  const { lang } = useApp();
  const isRtl = lang === 'fa';

  const [activeTool, setActiveTool] = useState<
    'text' | 'national_code' | 'bank_card' | 'number_words' | 'calendar' | 'mobile'
  >('text');

  // Tool 1: Text & ZWNJ
  const [textInput, setTextInput] = useState('می خواهم كتاب ها را باز كنم و بررسی كنم.');
  const textResult = cleanText(textInput);

  // Tool 2: National Code
  const [nationalCodeInput, setNationalCodeInput] = useState('0010123458');
  const isNationalCodeValid = isValidNationalCode(nationalCodeInput);

  // Tool 3: Bank Card
  const [cardInput, setCardInput] = useState('6037991122334455');
  const isCardValid = isValidCardNumber(cardInput);
  const detectedBank = detectBank(cardInput);

  // Tool 4: Number Words
  const [numberInput, setNumberInput] = useState('3500000');
  const numberWordsResult = numberToWords(numberInput);

  // Tool 5: Calendar
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(10);
  const [selectedDay, setSelectedDay] = useState(21);
  const jalaliDate = gregorianToJalali(selectedYear, selectedMonth, selectedDay);
  const jalaliIsLeap = isJalaliLeap(jalaliDate.jy);

  // Tool 6: Mobile
  const [mobileInput, setMobileInput] = useState('09121234567');
  const mobileOperator = detectMobileOperator(mobileInput);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyText = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const tools = [
    {
      id: 'text' as const,
      nameEn: 'Text & ZWNJ Cleansing',
      nameFa: 'پاکسازی متن و نیم‌فاصله',
      icon: Sparkles,
    },
    {
      id: 'national_code' as const,
      nameEn: 'National Code Validator',
      nameFa: 'اعتبارسنجی کد ملی',
      icon: ShieldCheck,
    },
    {
      id: 'bank_card' as const,
      nameEn: 'Bank Card & Luhn Check',
      nameFa: 'تشخیص بانک و الگوریتم لان',
      icon: CreditCard,
    },
    {
      id: 'number_words' as const,
      nameEn: 'Number to Words & Currency',
      nameFa: 'عدد به حروف و تبدیل ارز',
      icon: Coins,
    },
    {
      id: 'calendar' as const,
      nameEn: 'Astronomical Jalali Date',
      nameFa: 'تبدیل تقویم شمسی و کبیسه',
      icon: Calendar,
    },
    {
      id: 'mobile' as const,
      nameEn: 'Mobile Operator & Masking',
      nameFa: 'تشخیص اپراتور و ماسک شماره',
      icon: Smartphone,
    },
  ];

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="text-xs font-mono text-[#126E68] dark:text-[#52C5BE] uppercase tracking-wider mb-2">
          {isRtl ? 'آزمایشگاه محاسباتی زنده' : 'Interactive Diagnostic Studio'}
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 dark:text-white mb-3">
          {isRtl
            ? 'تست آنلاین الگوریتم‌های پارسی‌کیت در مرورگر'
            : 'Test ParsiKit Algorithms Directly in Your Browser'}
        </h2>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300">
          {isRtl
            ? 'الگوریتم‌های محاسباتی پارسی‌کیت را با مقادیر مختلف آزمایش کنید و نتایج استانداردسازی، چک‌سام و ماسک کردن داده‌ها را بررسی کنید.'
            : 'Experiment with ParsiKit computational models and validation checksums with real-time feedback and safe data transformations.'}
        </p>
      </div>

      {/* Tool Selector Buttons (Segmented Controls) */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-stone-100 dark:bg-black/30 border border-stone-200 dark:border-white/10 mb-8 overflow-x-auto">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer min-h-[44px] ${
                isActive
                  ? 'bg-white dark:bg-[#1A2422] text-[#126E68] dark:text-[#52C5BE] shadow-sm font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{isRtl ? tool.nameFa : tool.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Active Playground Surface */}
      <div className="rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#141C1A] shadow-lg p-6 sm:p-8">
        {/* Tool 1: Text Cleansing */}
        {activeTool === 'text' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <label htmlFor="raw-text-input" className="text-sm font-semibold text-stone-900 dark:text-white">
                {isRtl ? 'متن خام ورودی (حاوی حروف عربی، فاصله اضافی و نیم‌فاصله شکسته):' : 'Raw Input Text:'}
              </label>
              <textarea
                id="raw-text-input"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={5}
                className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#0F1514] text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-[#126E68] outline-none"
                placeholder={isRtl ? 'متن خود را اینجا تایپ کنید...' : 'Type or paste Persian text here...'}
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTextInput('می خواهم كتاب ها و نوشته هایم را با كیفیت بالا منتشر كنم.')}
                  className="text-xs text-[#126E68] dark:text-[#52C5BE] hover:underline cursor-pointer min-h-[36px] flex items-center"
                >
                  {isRtl ? 'بارگذاری نمونه ۱' : 'Load Sample 1'}
                </button>
                <span className="text-stone-300">·</span>
                <button
                  onClick={() => setTextInput('آن ها نمی توانند با سرعت بیش تر حركت كنند')}
                  className="text-xs text-[#126E68] dark:text-[#52C5BE] hover:underline cursor-pointer min-h-[36px] flex items-center"
                >
                  {isRtl ? 'بارگذاری نمونه ۲' : 'Load Sample 2'}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-stone-900 dark:text-white">
                  {isRtl ? 'خروجی استانداردسازی‌شده پارسی‌کیت:' : 'ParsiKit Standardized Output:'}
                </span>
                <button
                  onClick={() => copyText(textResult.cleaned, 'text')}
                  className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1.5 cursor-pointer min-h-[36px] px-2 py-1 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5"
                  aria-label={copiedKey === 'text' ? (isRtl ? 'کپی شد' : 'Copied') : (isRtl ? 'کپی متن استاندارد' : 'Copy cleaned text')}
                >
                  {copiedKey === 'text' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'text' ? (isRtl ? 'کپی شد' : 'Copied') : (isRtl ? 'کپی' : 'Copy')}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 dark:border-white/10 bg-[#FAF7F2] dark:bg-[#0F1514] text-stone-900 dark:text-stone-100 text-sm leading-relaxed min-h-[120px]">
                {textResult.cleaned || <span className="text-stone-400 italic">{isRtl ? 'متنی برای نمایش وجود ندارد' : 'No output'}</span>}
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-white/5 flex-wrap">
                <span>{isRtl ? `تعداد نیم‌فاصله‌های اعمال‌شده: ${toPersianDigits(textResult.zwnjCount)}` : `ZWNJs inserted: ${textResult.zwnjCount}`}</span>
                <span>·</span>
                <span>{isRtl ? `اصلاحات حروف عربی: ${toPersianDigits(textResult.replacements)}` : `Replaced glyphs: ${textResult.replacements}`}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tool 2: National Code Validator */}
        {activeTool === 'national_code' && (
          <div className="max-w-2xl mx-auto flex flex-col gap-6">
            <div>
              <label htmlFor="national-code-input" className="block text-sm font-semibold text-stone-900 dark:text-white mb-2">
                {isRtl ? 'کد ملی ۱۰ رقمی را وارد کنید:' : 'Enter 10-Digit Iranian National Code:'}
              </label>
              <input
                id="national-code-input"
                type="text"
                maxLength={10}
                value={nationalCodeInput}
                onChange={(e) => setNationalCodeInput(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#0F1514] text-stone-900 dark:text-stone-100 text-base font-mono tracking-wider focus:ring-2 focus:ring-[#126E68] outline-none min-h-[44px]"
                placeholder="0010123458"
              />

              <div className="mt-2 flex items-center gap-3 text-xs flex-wrap">
                <span className="text-stone-400">{isRtl ? 'کدهای نمونه:' : 'Sample codes:'}</span>
                <button
                  onClick={() => setNationalCodeInput('0010123458')}
                  className="text-[#126E68] dark:text-[#52C5BE] hover:underline cursor-pointer font-mono py-1"
                >
                  0010123458 ({isRtl ? 'معتبر' : 'Valid'})
                </button>
                <button
                  onClick={() => setNationalCodeInput('0010350829')}
                  className="text-[#126E68] dark:text-[#52C5BE] hover:underline cursor-pointer font-mono py-1"
                >
                  0010350829 ({isRtl ? 'معتبر' : 'Valid'})
                </button>
                <button
                  onClick={() => setNationalCodeInput('1111111111')}
                  className="text-rose-500 hover:underline cursor-pointer font-mono py-1"
                >
                  1111111111 ({isRtl ? 'نامعتبر' : 'Invalid'})
                </button>
              </div>
            </div>

            {/* Validation Feedback Box */}
            <div
              className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                isNationalCodeValid
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              }`}
            >
              {isNationalCodeValid ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="font-bold text-base">
                  {isNationalCodeValid
                    ? (isRtl ? 'کد ملی از نظر چک‌سام ریاضی (Modulo 11) معتبر است' : 'Valid Iranian National Code (Modulo-11 Checksum Passed)')
                    : (isRtl ? 'کد ملی نامعتبر است (الگوریتم چک‌سام یا تکرار ارقام رد شد)' : 'Invalid National Code (Checksum failed or repeated identical digits)')}
                </div>
                <div className="text-xs opacity-90 leading-relaxed font-sans">
                  {isNationalCodeValid
                    ? (isRtl
                        ? `نمای ماسک‌شده جهت امنیت لاگ‌ها: ${maskNationalCode(nationalCodeInput)}`
                        : `Masked safe logging representation: ${maskNationalCode(nationalCodeInput)}`)
                    : (isRtl
                        ? 'کد ملی باید دقیقا ۱۰ رقم بوده، تمام ارقام یکسان نباشد و باقیمانده ضرایب با رقم کنترل مطابقت داشته باشد.'
                        : 'Must be 10 digits, cannot contain 10 identical digits, and 10th digit must match weighted modulo 11.')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tool 3: Bank Card & Luhn Check */}
        {activeTool === 'bank_card' && (
          <div className="max-w-2xl mx-auto flex flex-col gap-6">
            <div>
              <label htmlFor="card-number-input" className="block text-sm font-semibold text-stone-900 dark:text-white mb-2">
                {isRtl ? 'شماره کارت ۱۶ رقمی شتاب را وارد کنید:' : 'Enter 16-Digit Iranian Bank Card:'}
              </label>
              <input
                id="card-number-input"
                type="text"
                maxLength={19}
                value={cardInput}
                onChange={(e) => setCardInput(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#0F1514] text-stone-900 dark:text-stone-100 text-base font-mono tracking-wider focus:ring-2 focus:ring-[#126E68] outline-none min-h-[44px]"
                placeholder="6037991122334455"
              />

              <div className="mt-2 flex items-center gap-3 text-xs flex-wrap">
                <span className="text-stone-400">{isRtl ? 'کارت‌های نمونه:' : 'Samples:'}</span>
                <button
                  onClick={() => setCardInput('6037991122334455')}
                  className="text-[#126E68] dark:text-[#52C5BE] hover:underline cursor-pointer font-mono py-1"
                >
                  بانک ملی (603799...)
                </button>
                <button
                  onClick={() => setCardInput('6104331234567890')}
                  className="text-[#126E68] dark:text-[#52C5BE] hover:underline cursor-pointer font-mono py-1"
                >
                  بانک ملت (610433...)
                </button>
                <button
                  onClick={() => setCardInput('6219861011121314')}
                  className="text-[#126E68] dark:text-[#52C5BE] hover:underline cursor-pointer font-mono py-1"
                >
                  بانک سامان (621986...)
                </button>
              </div>
            </div>

            {/* Bank Card Visual Card Representation */}
            <div className="p-6 rounded-2xl bg-gradient-to-tr from-[#1D3D63] via-[#126E68] to-[#142B47] text-white shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <span className="font-semibold text-sm tracking-wide">
                  {detectedBank ? (isRtl ? detectedBank.nameFa : detectedBank.nameEn) : (isRtl ? 'شبکه شتاب ایران' : 'Shetab Banking Network')}
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-amber-400/80" />
                  <div className="w-8 h-8 rounded-full bg-rose-500/80 -ml-4" />
                </div>
              </div>

              <div className="font-mono text-xl sm:text-2xl tracking-widest text-center mb-6 drop-shadow" dir="ltr">
                {cardInput.match(/.{1,4}/g)?.join('  ') || cardInput}
              </div>

              <div className="flex items-center justify-between text-xs text-stone-200 flex-wrap gap-2">
                <div>
                  <span className="block opacity-75">{isRtl ? 'ماسک امنیتی PII' : 'Safe Masked View'}</span>
                  <span className="font-mono font-medium" dir="ltr">{maskCard(cardInput)}</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  {isCardValid ? (
                    <span className="text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      {isRtl ? 'الگوریتم لان معتبر' : 'Luhn Valid'}
                    </span>
                  ) : (
                    <span className="text-rose-300 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      {isRtl ? 'نامعتبر' : 'Invalid'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tool 4: Number to Persian Words & Currency */}
        {activeTool === 'number_words' && (
          <div className="max-w-2xl mx-auto flex flex-col gap-6">
            <div>
              <label htmlFor="amount-number-input" className="block text-sm font-semibold text-stone-900 dark:text-white mb-2">
                {isRtl ? 'عدد یا مبلغ مورد نظر را وارد کنید:' : 'Enter Amount or Numerical Value:'}
              </label>
              <input
                id="amount-number-input"
                type="text"
                value={numberInput}
                onChange={(e) => setNumberInput(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#0F1514] text-stone-900 dark:text-stone-100 text-lg font-mono tracking-wider focus:ring-2 focus:ring-[#126E68] outline-none min-h-[44px]"
                placeholder="3500000"
              />

              <div className="mt-2 flex items-center gap-2 text-xs flex-wrap">
                <span className="text-stone-400">{isRtl ? 'مقادیر سریع:' : 'Quick samples:'}</span>
                {['12000', '350000', '12450000', '1000000000'].map((num) => (
                  <button
                    key={num}
                    onClick={() => setNumberInput(num)}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-white/5 hover:bg-[#126E68]/10 text-stone-700 dark:text-stone-300 font-mono transition-colors cursor-pointer min-h-[36px]"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50/70 dark:bg-[#0F1514] flex flex-col justify-between">
                <span className="text-xs text-stone-500 font-medium mb-1">
                  {isRtl ? 'عدد به حروف فارسی:' : 'Written in Persian Words:'}
                </span>
                <span className="text-base font-bold text-stone-900 dark:text-white leading-relaxed">
                  {numberWordsResult}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50/70 dark:bg-[#0F1514] flex flex-col justify-between">
                <span className="text-xs text-stone-500 font-medium mb-1">
                  {isRtl ? 'فرمت پولی فارسی (تومان):' : 'Formatted Currency (Toman):'}
                </span>
                <span className="text-base font-bold text-[#126E68] dark:text-[#52C5BE]">
                  {formatPersianCurrency(numberInput, 'تومان')}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50/70 dark:bg-[#0F1514] flex flex-col justify-between">
                <span className="text-xs text-stone-500 font-medium mb-1">
                  {isRtl ? 'تبدیل ریال به تومان (تقسیم بر ۱۰):' : 'Rial to Toman (÷ 10):'}
                </span>
                <span className="text-base font-mono font-bold text-stone-900 dark:text-white">
                  {toPersianDigits(rialToToman(numberInput).toLocaleString())} {isRtl ? 'تومان' : 'Toman'}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50/70 dark:bg-[#0F1514] flex flex-col justify-between">
                <span className="text-xs text-stone-500 font-medium mb-1">
                  {isRtl ? 'تبدیل تومان به ریال (ضرب‌در ۱۰):' : 'Toman to Rial (× 10):'}
                </span>
                <span className="text-base font-mono font-bold text-stone-900 dark:text-white">
                  {toPersianDigits(tomanToRial(numberInput).toLocaleString())} {isRtl ? 'ریال' : 'Rial'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tool 5: Astronomical Jalali Calendar */}
        {activeTool === 'calendar' && (
          <div className="max-w-2xl mx-auto flex flex-col gap-6">
            <div>
              <span className="block text-sm font-semibold text-stone-900 dark:text-white mb-2">
                {isRtl ? 'تاریخ میلادی را انتخاب کنید:' : 'Select Gregorian Date:'}
              </span>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="year-select" className="text-xs text-stone-500 block mb-1">{isRtl ? 'سال' : 'Year'}</label>
                  <input
                    id="year-select"
                    type="number"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#0F1514] font-mono text-center text-sm min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="month-select" className="text-xs text-stone-500 block mb-1">{isRtl ? 'ماه' : 'Month'}</label>
                  <input
                    id="month-select"
                    type="number"
                    min={1}
                    max={12}
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#0F1514] font-mono text-center text-sm min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="day-select" className="text-xs text-stone-500 block mb-1">{isRtl ? 'روز' : 'Day'}</label>
                  <input
                    id="day-select"
                    type="number"
                    min={1}
                    max={31}
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#0F1514] font-mono text-center text-sm min-h-[44px]"
                  />
                </div>
              </div>
            </div>

            {/* Converted Jalali Date Display */}
            <div className="p-6 rounded-2xl bg-[#FAF7F2] dark:bg-[#0F1514] border border-[#126E68]/20 dark:border-white/10 flex flex-col items-center justify-center text-center gap-3">
              <span className="text-xs font-mono text-[#D4A03D] uppercase tracking-wider">
                {isRtl ? 'تاریخ معادل در تقویم رسمی هجری خورشیدی (جلالی)' : 'Astronomical Solar Hijri Date'}
              </span>

              <div className="text-3xl sm:text-4xl font-extrabold text-[#126E68] dark:text-[#52C5BE]">
                {toPersianDigits(formatJalaliDate(jalaliDate.jy, jalaliDate.jm, jalaliDate.jd, 'fa'))}
              </div>

              <div className="text-xs font-mono text-stone-500">
                {formatJalaliDate(jalaliDate.jy, jalaliDate.jm, jalaliDate.jd, 'en')}
              </div>

              <div className="mt-2 pt-3 border-t border-stone-200 dark:border-white/10 w-full flex items-center justify-center gap-4 text-xs">
                <span>
                  {isRtl ? `سال ${toPersianDigits(jalaliDate.jy)}:` : `Year ${jalaliDate.jy}:`}
                </span>
                <span className={`font-semibold ${jalaliIsLeap ? 'text-emerald-600' : 'text-stone-500'}`}>
                  {jalaliIsLeap
                    ? (isRtl ? 'سال کبیسه نجومی (۳۶۶ روز)' : 'Astronomical Leap Year (366 days)')
                    : (isRtl ? 'سال عادی (۳۶۵ روز)' : 'Regular Year (365 days)')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tool 6: Mobile Operator & Masking */}
        {activeTool === 'mobile' && (
          <div className="max-w-2xl mx-auto flex flex-col gap-6">
            <div>
              <label htmlFor="mobile-number-input" className="block text-sm font-semibold text-stone-900 dark:text-white mb-2">
                {isRtl ? 'شماره موبایل را وارد کنید:' : 'Enter Iranian Mobile Phone Number:'}
              </label>
              <input
                id="mobile-number-input"
                type="text"
                value={mobileInput}
                onChange={(e) => setMobileInput(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#0F1514] text-stone-900 dark:text-stone-100 text-base font-mono tracking-wider focus:ring-2 focus:ring-[#126E68] outline-none min-h-[44px]"
                placeholder="09121234567"
              />

              <div className="mt-2 flex items-center gap-3 text-xs flex-wrap">
                <span className="text-stone-400">{isRtl ? 'پیش‌شماره‌ها:' : 'Prefix samples:'}</span>
                <button
                  onClick={() => setMobileInput('09121234567')}
                  className="text-[#126E68] dark:text-[#52C5BE] hover:underline cursor-pointer font-mono py-1"
                >
                  همراه اول (0912)
                </button>
                <button
                  onClick={() => setMobileInput('09351234567')}
                  className="text-[#D4A03D] hover:underline cursor-pointer font-mono py-1"
                >
                  ایرانسل (0935)
                </button>
                <button
                  onClick={() => setMobileInput('09211234567')}
                  className="text-fuchsia-600 hover:underline cursor-pointer font-mono py-1"
                >
                  رایتل (0921)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#0F1514]">
                <span className="text-xs text-stone-500 font-medium block mb-1">
                  {isRtl ? 'اپراتور مخابراتی تشخیص‌داده‌شده:' : 'Detected Telecom Operator:'}
                </span>
                <span className="text-base font-bold text-stone-900 dark:text-white">
                  {mobileOperator ? (isRtl ? mobileOperator.nameFa : mobileOperator.nameEn) : (isRtl ? 'نامشخص' : 'Unknown')}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#0F1514]">
                <span className="text-xs text-stone-500 font-medium block mb-1">
                  {isRtl ? 'ماسک امنیتی PII برای لاگ‌ها:' : 'Masked PII Log Output:'}
                </span>
                <span className="text-base font-mono font-bold text-[#126E68] dark:text-[#52C5BE]" dir="ltr">
                  {maskMobile(mobileInput)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
