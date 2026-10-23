/**
 * Strongly typed UI translation strings for all 4 supported languages.
 */

import { type LangPrefix } from './config';

export interface TranslationSchema {
  nav: {
    home: string;
    playground: string;
    docs: string;
    architecture: string;
    changelog: string;
    searchDocs: string;
    searchPlaceholder: string;
    tagline: string;
    language: string;
  };
  hero: {
    badge: string;
    headlinePart1: string;
    headlineHighlight: string;
    headlinePart2: string;
    description: string;
    copyCmd: string;
    copied: string;
    exploreDocs: string;
    livePlayground: string;
    purePythonNote: string;
    runInBrowser: string;
    createdBy: string;
  };
  playground: {
    title: string;
    subtitle: string;
    runOnline: string;
    tools: {
      text: { name: string; desc: string; inputLabel: string; outputLabel: string };
      nationalCode: { name: string; desc: string; inputLabel: string; validMsg: string; invalidMsg: string };
      bankCard: { name: string; desc: string; inputLabel: string; validMsg: string; invalidMsg: string; bankLabel: string };
      numberWords: { name: string; desc: string; inputLabel: string; wordsLabel: string };
      calendar: { name: string; desc: string; yearLabel: string; monthLabel: string; dayLabel: string; jalaliResult: string; leapLabel: string };
      mobile: { name: string; desc: string; inputLabel: string; operatorLabel: string; maskedLabel: string };
    };
  };
  architecture: {
    title: string;
    subtitle: string;
    principlesTitle: string;
    layersTitle: string;
    viewInDocs: string;
  };
  changelog: {
    title: string;
    subtitle: string;
    latestBadge: string;
    fixed: string;
    added: string;
    changed: string;
  };
  docs: {
    tableOfContents: string;
    onThisPage: string;
    shareLink: string;
    linkCopied: string;
    nextDoc: string;
    prevDoc: string;
    versionBadge: string;
  };
  footer: {
    description: string;
    navHeading: string;
    docsHeading: string;
    projectHeading: string;
    overview: string;
    playground: string;
    docsHub: string;
    architecture: string;
    changelog: string;
    installGuide: string;
    quickstart: string;
    textTutorial: string;
    validationTutorial: string;
    datetimeTutorial: string;
    apiReference: string;
    issues: string;
    contributing: string;
    backToTop: string;
    copyright: string;
  };
  search: {
    title: string;
    placeholder: string;
    noResults: string;
    navigateHint: string;
    selectHint: string;
    closeHint: string;
  };
}

export const TRANSLATIONS: Record<LangPrefix, TranslationSchema> = {
  // 1. Persian (Iran) — fa-IR
  fa: {
    nav: {
      home: 'معرفی',
      playground: 'محیط آزمایشی',
      docs: 'مستندات',
      architecture: 'معماری فنی',
      changelog: 'تغییرات نسخه',
      searchDocs: 'جستجو در مستندات...',
      searchPlaceholder: 'جستجو در مستندات و توابع...',
      tagline: 'زیرساخت داده‌های فارسی',
      language: 'زبان',
    },
    hero: {
      badge: 'پایتون ۳.۱۰+ • خالص بدون وابستگی • مجوز MIT',
      headlinePart1: 'زیرساخت خالص پایتونی برای ',
      headlineHighlight: 'داده‌های فارسی',
      headlinePart2: '',
      description: 'کتابخانه‌ای بدون وابستگی خارجی برای پاکسازی متون فارسی و نیم‌فاصله‌ها، اعتبارسنجی الگوریتم‌های ملی و بانکی (کد ملی، کارت، شبا)، تقویم شمسی نجومی، محاسبات مالی و حفظ محرمانگی داده‌ها.',
      copyCmd: 'کپی',
      copied: 'کپی شد!',
      exploreDocs: 'مشاهده مستندات جامع',
      livePlayground: 'محیط آزمایشی زنده',
      purePythonNote: 'پایتون خالص • بدون وابستگی به باینری‌های C/Rust',
      runInBrowser: 'تست آنلاین در مرورگر',
      createdBy: 'توسعه‌داده شده توسط',
    },
    playground: {
      title: 'محیط آزمایشی زنده الگوریتم‌ها',
      subtitle: 'الگوریتم‌های محاسباتی و اعتبارسنجی پارسی‌کیت را مستقیماً در مرورگر خود ارزیابی و بررسی کنید.',
      runOnline: 'ابزارهای آزمایشی آنلاین',
      tools: {
        text: {
          name: 'پاکسازی متن و نیم‌فاصله',
          desc: 'اصلاح خودکار گلیف‌های عربی به فارسی، فشرده‌سازی فواصل و اصلاح نیم‌فاصله‌های پنهان.',
          inputLabel: 'متن ورودی خام:',
          outputLabel: 'متن پاکسازی‌شده و استاندارد:',
        },
        nationalCode: {
          name: 'اعتبارسنجی کد ملی',
          desc: 'محاسبه چک‌سام رسمی بر اساس الگوریتم پیمانه ۱۱ و کنترل ارقام یکسان نامعتبر.',
          inputLabel: 'کد ملی ۱۰ رقمی:',
          validMsg: 'کد ملی معتبر است (الگوریتم پیمانه ۱۱ تأیید شد)',
          invalidMsg: 'کد ملی نامعتبر است (کنترل چک‌سام ناموفق)',
        },
        bankCard: {
          name: 'کارت بانکی و الگوریتم لان',
          desc: 'بررسی صحت شماره ۱۶ رقمی کارت بانکی با الگوریتم Luhn و تشخیص خودکار بانک عامل.',
          inputLabel: 'شماره ۱۶ رقمی کارت بانکی:',
          validMsg: 'شماره کارت معتبر است (الگوریتم Luhn تأیید شد)',
          invalidMsg: 'شماره کارت نامعتبر است',
          bankLabel: 'بانک صادرکننده:',
        },
        numberWords: {
          name: 'تبدیل عدد به حروف و مبالغ',
          desc: 'تبدیل اعداد تا ۹۹۹ سپتیلیون به حروف روان فارسی همراه با محاسبات ریال به تومان.',
          inputLabel: 'عدد یا مبلغ ریالی:',
          wordsLabel: 'خوانش به حروف فارسی:',
        },
        calendar: {
          name: 'تقویم نجومی جلالی',
          desc: 'تبدیل دقیق میلادی به هجری خورشیدی و محاسبه سال کبیسه در چرخه ۳۳ ساله نجومی.',
          yearLabel: 'سال میلادی:',
          monthLabel: 'ماه:',
          dayLabel: 'روز:',
          jalaliResult: 'تاریخ هجری خورشیدی:',
          leapLabel: 'وضعیت کبیسه:',
        },
        mobile: {
          name: 'شناسایی اپراتور موبایل و ماسک',
          desc: 'تشخیص همراه اول، ایرانسل و رایتل، قالب‌بندی بین‌المللی و ماسک‌کردن داده‌های حساس.',
          inputLabel: 'شماره تلفن همراه:',
          operatorLabel: 'اپراتور مخابراتی:',
          maskedLabel: 'شماره امن (ماسک‌شده):',
        },
      },
    },
    architecture: {
      title: 'معماری فنی و طراحی لایه‌ای',
      subtitle: 'اصول مهندسی نرم‌افزار، امنیت پایدار و استانداردهای طراحی درون کتابخانه پارسی‌کیت.',
      principlesTitle: 'اصول بنیادی معماری',
      layersTitle: 'پشته معماری لایه‌ای',
      viewInDocs: 'مشاهده مستندات معماری',
    },
    changelog: {
      title: 'تاریخچه تغییرات و نسخه‌ها',
      subtitle: 'تمام تغییرات مهم، اصلاحات امنیتی و قابلیت‌های جدید طبق استاندارد Semantic Versioning.',
      latestBadge: 'آخرین نسخه پایدار',
      fixed: 'اصلاحات (Fixed)',
      added: 'امکانات جدید (Added)',
      changed: 'تغییرات (Changed)',
    },
    docs: {
      tableOfContents: 'فهرست بخش‌های مستندات',
      onThisPage: 'فهرست این صفحه',
      shareLink: 'اشتراک‌گذاری',
      linkCopied: 'پیوند کپی شد!',
      nextDoc: 'مستند بعدی',
      prevDoc: 'مستند قبلی',
      versionBadge: 'نسخه رسمی',
    },
    footer: {
      description: 'زیرساخت خالص پایتونی، سبک و بدون وابستگی جانبی برای پردازش، اعتبارسنجی و محاسبات داده‌های زبان فارسی در محیط‌های توسعه نرم‌افزار.',
      navHeading: 'پیمایش سایت',
      docsHeading: 'مستندات و آموزش‌ها',
      projectHeading: 'پروژه و سازنده',
      overview: 'صفحه اصلی (معرفی)',
      playground: 'محیط آزمایشی زنده',
      docsHub: 'مرکز مستندات',
      architecture: 'معماری فنی',
      changelog: 'تاریخچه نسخه‌ها',
      installGuide: 'راهنمای نصب',
      quickstart: 'شروع سریع در ۵ دقیقه',
      textTutorial: 'آموزش نیم‌فاصله‌ها و متن',
      validationTutorial: 'اعتبارسنجی کد ملی و کارت',
      datetimeTutorial: 'تقویم شمسی و سال کبیسه',
      apiReference: 'فهرست کامل توابع API',
      issues: 'گزارش اشکال و پیشنهادها',
      contributing: 'راهنمای مشارکت در پروژه',
      backToTop: 'بازگشت به بالا',
      copyright: 'طراحی و توسعه‌یافته برای زیرساخت زبان فارسی توسط علی کامرانی.',
    },
    search: {
      title: 'جستجو در مستندات',
      placeholder: 'توابع، ماژول‌ها یا کلیدواژه‌ها را جستجو کنید...',
      noResults: 'نتیجه‌ای برای این عبارت یافت نشد.',
      navigateHint: 'برای پیمایش',
      selectHint: 'برای انتخاب',
      closeHint: 'برای خروج',
    },
  },

  // 2. English — en
  en: {
    nav: {
      home: 'Overview',
      playground: 'Playground',
      docs: 'Documentation',
      architecture: 'Architecture',
      changelog: 'Changelog',
      searchDocs: 'Search documentation...',
      searchPlaceholder: 'Search documentation, APIs, and guides...',
      tagline: 'Persian Data Infrastructure',
      language: 'Language',
    },
    hero: {
      badge: 'Python 3.10+ • Pure Python Zero-Deps • MIT License',
      headlinePart1: 'Production-Grade Python Infrastructure for ',
      headlineHighlight: 'Persian Data',
      headlinePart2: '',
      description: 'A zero-dependency library for Persian text standardization and ZWNJ handling, official national checksums (national code, card Luhn, Sheba), astronomical Jalali dates, financial computations, and sensitive data protection.',
      copyCmd: 'Copy',
      copied: 'Copied!',
      exploreDocs: 'Explore Documentation',
      livePlayground: 'Live Playground',
      purePythonNote: 'Pure Python • Zero external C/Rust binary dependencies',
      runInBrowser: 'Run live in browser',
      createdBy: 'Architected & maintained by',
    },
    playground: {
      title: 'Interactive Diagnostic Studio & Playground',
      subtitle: 'Test and inspect ParsiKit algorithms directly inside your browser with live inputs.',
      runOnline: 'Interactive Diagnostic Tools',
      tools: {
        text: {
          name: 'Text & ZWNJ Cleansing',
          desc: 'Arabic-to-Persian glyph normalization, whitespace collapsing, and intelligent ZWNJ placement.',
          inputLabel: 'Raw input text:',
          outputLabel: 'Standardized clean output:',
        },
        nationalCode: {
          name: 'National Code Validator',
          desc: 'Official Modulo 11 checksum verification and repeated identical digit rejection.',
          inputLabel: '10-digit National Code:',
          validMsg: 'National Code is valid (Modulo 11 verified)',
          invalidMsg: 'National Code is invalid (Checksum mismatch)',
        },
        bankCard: {
          name: 'Bank Card & Luhn Check',
          desc: '16-digit debit/credit card Luhn algorithm validation and issuer bank identification.',
          inputLabel: '16-digit bank card number:',
          validMsg: 'Card number is valid (Luhn checksum passed)',
          invalidMsg: 'Invalid card number checksum',
          bankLabel: 'Issuing bank:',
        },
        numberWords: {
          name: 'Number to Persian Words',
          desc: 'Convert integers up to 999 septillion into fluent Persian words with Rial-Toman helpers.',
          inputLabel: 'Numeric amount or number:',
          wordsLabel: 'Persian written words:',
        },
        calendar: {
          name: 'Astronomical Jalali Calendar',
          desc: 'Gregorian to Solar Hijri astronomical conversions with precise 33-year leap cycle.',
          yearLabel: 'Gregorian Year:',
          monthLabel: 'Month:',
          dayLabel: 'Day:',
          jalaliResult: 'Solar Hijri (Jalali) date:',
          leapLabel: 'Leap Year status:',
        },
        mobile: {
          name: 'Mobile Operator & PII Masking',
          desc: 'Identify mobile operators, international formatting, and sanitize sensitive information.',
          inputLabel: 'Mobile phone number:',
          operatorLabel: 'Network operator:',
          maskedLabel: 'Sanitized masked format:',
        },
      },
    },
    architecture: {
      title: 'Technical Architecture & Layer Design',
      subtitle: 'Engineering principles, security boundaries, and domain-driven design inside ParsiKit.',
      principlesTitle: 'Core Architectural Pillars',
      layersTitle: 'Layered Architecture Stack',
      viewInDocs: 'Read Architecture Docs',
    },
    changelog: {
      title: 'Version History & Release Notes',
      subtitle: 'All notable releases, security patches, and enhancements adhering to Semantic Versioning.',
      latestBadge: 'Latest Stable Release',
      fixed: 'Fixed',
      added: 'Added',
      changed: 'Changed',
    },
    docs: {
      tableOfContents: 'Documentation Index',
      onThisPage: 'On this page',
      shareLink: 'Share link',
      linkCopied: 'Link copied to clipboard!',
      nextDoc: 'Next document',
      prevDoc: 'Previous document',
      versionBadge: 'Official Version',
    },
    footer: {
      description: 'A production-grade pure Python library for Persian data infrastructure, text cleansing, national validations, astronomical Jalali dates, and sensitive PII masking.',
      navHeading: 'Navigation',
      docsHeading: 'Documentation',
      projectHeading: 'Project & Creator',
      overview: 'Overview',
      playground: 'Interactive Playground',
      docsHub: 'Documentation Hub',
      architecture: 'Architecture Design',
      changelog: 'Changelog',
      installGuide: 'Installation Guide',
      quickstart: '5-Minute Quickstart',
      textTutorial: 'Text & ZWNJ Tutorial',
      validationTutorial: 'National ID & Card Check',
      datetimeTutorial: 'Astronomical Jalali Dates',
      apiReference: 'Full API Reference',
      issues: 'Issue Tracker',
      contributing: 'Contribution Guidelines',
      backToTop: 'Back to top',
      copyright: 'Crafted for Persian data infrastructure by Ali Kamrani.',
    },
    search: {
      title: 'Search Documentation',
      placeholder: 'Search functions, modules, guides, or concepts...',
      noResults: 'No documentation matching your search.',
      navigateHint: 'to navigate',
      selectHint: 'to select',
      closeHint: 'to close',
    },
  },

  // 3. Dari (Afghanistan) — prs-AF (Authentic Dari Vocabulary)
  'prs-af': {
    nav: {
      home: 'معرفی عمومی',
      playground: 'محیط آزمایشی',
      docs: 'رهنمودها و اسناد',
      architecture: 'معماری فنی',
      changelog: 'یادداشت‌های نسخه',
      searchDocs: 'جستجو در رهنمودها...',
      searchPlaceholder: 'جستجو در اسناد و توابع کتابخانه...',
      tagline: 'زیرساخت داده‌های زبان فارسی دری',
      language: 'زبان',
    },
    hero: {
      badge: 'پایتون ۳.۱۰+ • خالص بدون وابستگی • جوازنامه MIT',
      headlinePart1: 'زیرساخت معیاری پایتون برای ',
      headlineHighlight: 'داده‌ها و زبان دری',
      headlinePart2: '',
      description: 'کتابخانه بدون وابستگی‌های بیرونی برای تصفیه و اصلاح متون دری، نیم‌فاصله‌ها، تثبیت اعتبار شماره‌های تذکره الکترونیکی و کارت‌های بانکی، تقویم هجری شمسی، و محاسبات پولی با رعایت امنیت داده‌های حساس.',
      copyCmd: 'کاپی',
      copied: 'کاپی شد!',
      exploreDocs: 'مطالعه رهنمودهای مکمل',
      livePlayground: 'محیط آزمایشی آنلاین',
      purePythonNote: 'پایتون خالص • بدون نیاز به کتابخانه‌های خارجی C یا Rust',
      runInBrowser: 'آزمایش مستقیم در براوزر',
      createdBy: 'مهندسی و توسعه توسط',
    },
    playground: {
      title: 'محیط آزمایشی و تشخیص آنلاین',
      subtitle: 'الگوریتم‌های تصفیه متن، تثبیت اعتبار اسناد و تقویم را مستقیماً در براوزر خود آزمایش نمایید.',
      runOnline: 'ابزارهای آزمایشی آنلاین',
      tools: {
        text: {
          name: 'تصفیه متن و نیم‌فاصله',
          desc: 'معیارسازی کاراکترهای عربی به حروف دری، رفع فواصل اضافی و تنظیم نیم‌فاصله‌های استاندارد.',
          inputLabel: 'متن اولیه:',
          outputLabel: 'متن اصلاح‌شده و پاکیزه:',
        },
        nationalCode: {
          name: 'تثبیت اعتبار نمبر تذکره / کد ملی',
          desc: 'بررسی صحت نمبر هویت با الگوریتم پیمانه ۱۱ و تشخیص ارقام تکراری غیرمجاز.',
          inputLabel: 'نمبر تذکره یا شناسه:',
          validMsg: 'نمبر شناسه معتبر است (تأییدشده با الگوریتم پیمانه ۱۱)',
          invalidMsg: 'نمبر شناسه نامعتبر می‌باشد',
        },
        bankCard: {
          name: 'کارت بانکی و الگوریتم لون',
          desc: 'تثبیت صحت نمبر کارت بانکی ۱۶ رقمی با الگوریتم Luhn و تشخیص خودکار بانک صادرکننده.',
          inputLabel: 'نمبر ۱۶ رقمی کارت بانکی:',
          validMsg: 'نمبر کارت صحیح است (تأیید الگوریتم لون)',
          invalidMsg: 'نمبر کارت نادرست است',
          bankLabel: 'بانک صادرکننده کارت:',
        },
        numberWords: {
          name: 'تبدیل ارقام به حروف و مقادیر مالی',
          desc: 'تبدیل اعداد تا ۹۹۹ سپتیلیون به حروف روان و خوانا همراه با محاسبات واحدهای پولی.',
          inputLabel: 'مقدار عددی یا مبلغ:',
          wordsLabel: 'نگارش به حروف:',
        },
        calendar: {
          name: 'تقویم نجومی هجری شمسی',
          desc: 'تبدیل دقیق تقویم میلادی به هجری شمسی (جلالی) و محاسبه سال کبیسه در چرخه ۳۳ ساله.',
          yearLabel: 'سال عیسوی (میلادی):',
          monthLabel: 'ماه:',
          dayLabel: 'روز:',
          jalaliResult: 'تاریخ هجری شمسی:',
          leapLabel: 'حالت سال کبیسه:',
        },
        mobile: {
          name: 'شماره تماس و پوشش‌دهی امن',
          desc: 'تشخیص شبکه‌های مخابراتی، تنظیم فرمت بین‌المللی و مخفی‌سازی شماره‌های تماس.',
          inputLabel: 'شماره تماس (موبایل):',
          operatorLabel: 'شبکه مخابراتی:',
          maskedLabel: 'شماره امن‌شده:',
        },
      },
    },
    architecture: {
      title: 'معماری تخنیکی و لایه‌بندی سیستم',
      subtitle: 'اصول انجنیری نرم‌افزار، امنیت پایدار و استانداردهای طراحی درون کتابخانه پارسی‌کیت.',
      principlesTitle: 'ستون‌های اساسی معماری',
      layersTitle: 'لایه‌های معماری نرم‌افزار',
      viewInDocs: 'مشاهده اسناد معماری',
    },
    changelog: {
      title: 'یادداشت‌های نسخه و تاریخچه تغییرات',
      subtitle: 'ثبت منظم تمام نوآوری‌ها، ترمیم خطاهای امنیتی و اصلاحات بر اساس اصول Semantic Versioning.',
      latestBadge: 'جدیدترین نسخه پایدار',
      fixed: 'اصلاحات (Fixed)',
      added: 'امکانات جدید (Added)',
      changed: 'تغییرات (Changed)',
    },
    docs: {
      tableOfContents: 'فهرست رهنمودها و اسناد',
      onThisPage: 'مندرجات این صفحه',
      shareLink: 'اشتراک پیوند',
      linkCopied: 'پیوند کاپی شد!',
      nextDoc: 'سند بعدی',
      prevDoc: 'سند قبلی',
      versionBadge: 'نسخه رسمی',
    },
    footer: {
      description: 'زیرساخت خالص پایتونی، سبک و بدون وابستگی برای تصفیه متن، تثبیت اعتبار اسناد، تقویم هجری شمسی و محاسبات مالی در زبان فارسی دری.',
      navHeading: 'رهنمودهای وب‌سایت',
      docsHeading: 'اسناد و آموزش‌ها',
      projectHeading: 'پروژه و سازنده',
      overview: 'معرفی عمومی',
      playground: 'محیط آزمایشی آنلاین',
      docsHub: 'مرکز اسناد و رهنمودها',
      architecture: 'معماری فنی',
      changelog: 'یادداشت‌های نسخه',
      installGuide: 'رهنمود نصب و راه‌اندازی',
      quickstart: 'آغاز سریع در ۵ دقیقه',
      textTutorial: 'آموزش تصفیه متن و نیم‌فاصله',
      validationTutorial: 'تثبیت اعتبار تذکره و کارت بانکی',
      datetimeTutorial: 'تقویم هجری شمسی و سال‌های کبیسه',
      apiReference: 'فهرست کامل توابع API',
      issues: 'گزارش مشکلات در GitHub',
      contributing: 'رهنمود همکاری در توسعه',
      backToTop: 'برگشت به بالا',
      copyright: 'طراحی‌شده با کمال احترام به حوزه تمدنی زبان فارسی و دری توسط علی کامرانی.',
    },
    search: {
      title: 'جستجو در اسناد و رهنمودها',
      placeholder: 'جستجوی توابع، ماژول‌ها و موضوعات...',
      noResults: 'هیچ موردی مطابق با جستجوی شما یافت نشد.',
      navigateHint: 'برای حرکت',
      selectHint: 'برای انتخاب',
      closeHint: 'برای بستن',
    },
  },

  // 4. Tajik (Tajikistan) — tg-TJ (Cyrillic Script)
  tg: {
    nav: {
      home: 'Муаррифӣ',
      playground: 'Озмоишгоҳ',
      docs: 'Ҳуҷҷатгузорӣ',
      architecture: 'Меъмории фаннӣ',
      changelog: 'Таърихи нусхаҳо',
      searchDocs: 'Ҷустуҷӯ дар ҳуҷҷатҳо...',
      searchPlaceholder: 'Ҷустуҷӯи тавобеъ ва роҳнамоҳо...',
      tagline: 'Зерсохти додаҳо барои забони тоҷикӣ ва форсӣ',
      language: 'Забон',
    },
    hero: {
      badge: 'Python 3.10+ • Забони холис • Иҷозатномаи MIT',
      headlinePart1: 'Зерсохти мукаммали барномасозӣ барои ',
      headlineHighlight: 'додаҳои забони форсӣ ва тоҷикӣ',
      headlinePart2: '',
      description: 'Китобхонаи мустақил барои поксозии матн, танзими фосилаҳо, тафтиши дурустии рақамҳои миллӣ ва кортҳои бонкӣ, тақвими шамсӣ ва ҳисоботи молӣ бо ҳифзи амнияти додаҳо.',
      copyCmd: 'Нусхабардорӣ',
      copied: 'Нусхабардорӣ шуд!',
      exploreDocs: 'Мутолиаи ҳуҷҷатҳо',
      livePlayground: 'Озмоишгоҳи зинда',
      purePythonNote: 'Python-и холис • Бе ниёз ба вобастагиҳои берунии C ё Rust',
      runInBrowser: 'Озмоиши онлайн дар браузер',
      createdBy: 'Муҳандисӣ ва таҳия аз ҷониби',
    },
    playground: {
      title: 'Озмоишгоҳи ташхиси интерактивӣ',
      subtitle: 'Алгоритмҳои китобхонаи ParsiKit-ро мустақиман дар браузери худ тафтиш ва озмоиш намоед.',
      runOnline: 'Воситаҳои ташхиси онлайн',
      tools: {
        text: {
          name: 'Поксозии матн ва нимафосилаҳо',
          desc: 'Мутобиқсозии ҳарфҳои арабӣ, танзими фосилаҳо ва ҷойгузинии нимафосилаҳои пинҳон.',
          inputLabel: 'Матни аввалия:',
          outputLabel: 'Матни покиза ва стандартӣ:',
        },
        nationalCode: {
          name: 'Тафтиши рақами шиноснома / Рақами миллӣ',
          desc: 'Муҳосибаи чексам бо алгоритми Модуло 11 ва муайян кардани рақамҳои якхелаи беэътибор.',
          inputLabel: 'Рақами миллии 10-рақама:',
          validMsg: 'Рақам эътибор дорад (бо алгоритми Модуло 11 тасдиқ шуд)',
          invalidMsg: 'Рақам беэътибор аст (номутобиқатии чексам)',
        },
        bankCard: {
          name: 'Корти бонкӣ ва алгоритми Лун',
          desc: 'Тафтиши эътибори корти 16-рақама бо алгоритми Luhn ва шинохти худкори бонки интишоркунанда.',
          inputLabel: 'Рақами 16-рақамаи корт:',
          validMsg: 'Рақами корт дуруст аст (тасдиқи Лун)',
          invalidMsg: 'Рақами корт нодуруст мебошад',
          bankLabel: 'Бонки интишоркунанда:',
        },
        numberWords: {
          name: 'Табдили рақам ба калимаҳо ва ҳисоби молӣ',
          desc: 'Табдили ададҳо то 999 септиллион ба калимаҳои равон бо ҳисобҳои воҳидҳои пулӣ.',
          inputLabel: 'Адад ё маблағ:',
          wordsLabel: 'Ба калимаҳо:',
        },
        calendar: {
          name: 'Тақвими нуҷумии ҳиҷрии шамсӣ',
          desc: 'Табдили дақиқи санаҳои мелодӣ ба шамсӣ ва муҳосибаи соли кабиса дар гардиши 33-сола.',
          yearLabel: 'Соли мелодӣ:',
          monthLabel: 'Моҳ:',
          dayLabel: 'Рӯз:',
          jalaliResult: 'Санаи ҳиҷрии шамсӣ:',
          leapLabel: 'Ҳолати соли кабиса:',
        },
        mobile: {
          name: 'Шинохти оператори мобилӣ ва ниқоббандӣ',
          desc: 'Муайян кардани оператори шабака, формати байналмилалӣ ва пинҳонсозии додаҳои ҳассос.',
          inputLabel: 'Рақами телефон:',
          operatorLabel: 'Оператори алоқа:',
          maskedLabel: 'Рақами амншуда:',
        },
      },
    },
    architecture: {
      title: 'Меъмории фаннӣ ва тарҳи қабатҳо',
      subtitle: 'Принсипҳои муҳандисии барномасозӣ, амнияти пойдор ва тарроҳии дарунӣ дар ParsiKit.',
      principlesTitle: 'Сутунҳои асосии меъморӣ',
      layersTitle: 'Силсилаи қабатҳои меъморӣ',
      viewInDocs: 'Хондани ҳуҷҷатҳои меъморӣ',
    },
    changelog: {
      title: 'Таърихи нусхаҳо ва тағйирот',
      subtitle: 'Сабти мунтазами ҳамаи нусхаҳо ва беҳбудиҳои амниятӣ бар асоси стандарти Semantic Versioning.',
      latestBadge: 'Охирин нусхаи устувор',
      fixed: 'Ислоҳшуда (Fixed)',
      added: 'Иловашуда (Added)',
      changed: 'Тағйирёфта (Changed)',
    },
    docs: {
      tableOfContents: 'Мундариҷаи ҳуҷҷатҳо',
      onThisPage: 'Дар ин саҳифа',
      shareLink: 'Ирсоли пайванд',
      linkCopied: 'Пайванд нусхабардорӣ шуд!',
      nextDoc: 'Ҳуҷҷати навбатӣ',
      prevDoc: 'Ҳуҷҷати қаблӣ',
      versionBadge: 'Нусхаи расмӣ',
    },
    footer: {
      description: 'Китобхонаи мустақили Python барои коркард ва санҷиши додаҳо, тақвими шамсӣ ва ҳисоботи молӣ бо ҳифзи додаҳои ҳассос.',
      navHeading: 'Навигатсия',
      docsHeading: 'Ҳуҷҷатгузорӣ ва роҳнамоҳо',
      projectHeading: 'Лоиҳа ва Муаллиф',
      overview: 'Муаррифӣ',
      playground: 'Озмоишгоҳи зинда',
      docsHub: 'Маркази ҳуҷҷатҳо',
      architecture: 'Меъмории фаннӣ',
      changelog: 'Таърихи нусхаҳо',
      installGuide: 'Роҳнамои насб',
      quickstart: 'Оғози зуд дар 5 дақиқа',
      textTutorial: 'Омӯзиши матн ва нимафосилаҳо',
      validationTutorial: 'Тафтиши рақами миллӣ ва корт',
      datetimeTutorial: 'Тақвими шамсӣ ва соли кабиса',
      apiReference: 'Феҳристи мукаммали API',
      issues: 'Сабти хатоҳо дар GitHub',
      contributing: 'Роҳнамои ҳамкорӣ',
      backToTop: 'Бозгашт ба боло',
      copyright: 'Тарҳрезӣ ва сохташуда аз ҷониби Алӣ Комронӣ (Ali Kamrani).',
    },
    search: {
      title: 'Ҷустуҷӯ дар ҳуҷҷатҳо',
      placeholder: 'Ҷустуҷӯи тавобеъ, модулҳо ва мақолаҳо...',
      noResults: 'Ҳеҷ натиҷае ёфт нашуд.',
      navigateHint: 'барои ҳаракат',
      selectHint: 'барои интихоб',
      closeHint: 'барои пӯшидан',
    },
  },
};

export function getTranslations(lang: LangPrefix): TranslationSchema {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
