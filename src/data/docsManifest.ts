/**
 * AUTO-GENERATED FROM REPOSITORY DOCS
 * Count: 84 documents
 */

export interface DocHeading {
  id: string;
  text: string;
  level: number;
}

export interface DocEntry {
  id: string;
  slug: string;
  lang: 'fa' | 'en' | 'prs-af' | 'tg';
  category: 'getting-started' | 'tutorials' | 'guides' | 'api' | 'development';
  title: string;
  summary: string;
  content: string;
  headings: DocHeading[];
  counterpartSlug?: string;
  counterparts?: Partial<Record<'fa' | 'en' | 'prs-af' | 'tg', string>>;
  filePath: string;
}

export const ALL_DOCS: DocEntry[] = [
  {
    "id": "fa-api-cache",
    "slug": "api/cache",
    "lang": "fa",
    "category": "api",
    "title": "مرجع ماژول کش (`parsikit.cache`)",
    "summary": "زیرساخت کشینگ حافظه‌ای با کارایی بالا و ایمن در برابر چندریسمانی (Thread-safe) برای محاسبات پرهزینه عددی و زبانی.",
    "content": "# مرجع ماژول کش (`parsikit.cache`)\n\nزیرساخت کشینگ حافظه‌ای با کارایی بالا و ایمن در برابر چندریسمانی (Thread-safe) برای محاسبات پرهزینه عددی و زبانی.\n\n---\n\n## ۱. معرفی و کاربرد\n\nماژول `parsikit.cache` سازوکار کشینگ مبتنی بر الگوریتم شبه-LRU را فراهم می‌کند که به صورت داخلی در توابعی با بار پردازشی تکراری نظیر تبدیل اعداد بسیار بزرگ به حروف (`parsikit.number.number_to_words`) مورد استفاده قرار می‌گیرد.\n\n> **نکته درباره پایداری ماژول:** این ماژول در درجه اول یک ماژول زیرساختی (Internal Infrastructure) برای خود کتابخانه است. با این حال کلاس‌ها و دکوراتورهای آن پایدار و در پروژه‌های شما نیز به صورت مستقل قابل استفاده هستند.\n\n---\n\n## ۲. کلاس‌ها\n\n### `ThreadSafeLRUCache`\n\n```python\nclass ThreadSafeLRUCache:\n    def __init__(self, maxsize: int = 1024) -> None\n```\n\nکش سبک و محافظت‌شده با قفل بازگشتی `threading.RLock` در حافظه رم جهت جلوگیری از بن‌بست در فراخوانی‌های تو در تو و بازگشتی.\n\n#### اعتبارسنجی ظرفیت:\n- آرگومان `maxsize` باید عدد صحیح (`int`) باشد. مقادیر غیرصحیح خطای `TypeError` تولید می‌کنند.\n- مقدار `maxsize` باید بزرگتر یا مساوی صفر باشد (`maxsize >= 0`). اعداد منفی خطای `ValueError` ایجاد می‌کنند.\n- مقدار `maxsize = 0` به عنوان **حالت بدون ذخیره‌سازی (no-storage)** عمل کرده و هیچ مقداری را ذخیره نمی‌کند.\n\n#### متدها و ویژگی‌ها:\n- **`get(key: Any, default: Any = None) -> Any`**: مقدار کلید را بازمی‌گرداند و جایگاه کلید را در لیست دسترسی‌های اخیر به عنوان تازه‌ترین (MRU) به‌روزرسانی می‌کند. در صورت عدم وجود، مقدار `default` را می‌دهد.\n- **`set(key: Any, value: Any) -> None`**: مقدار را ذخیره یا به‌روزرسانی می‌کند. در صورتی که کلید از قبل موجود باشد، بدون حذف آیتم‌های دیگر، مقدار آن به‌روز شده و به تازه‌ترین جایگاه منتقل می‌شود. در صورت تکمیل ظرفیت، قدیمی‌ترین آیتم بدون استفاده (LRU) حذف می‌گردد.\n- **`clear() -> None`**: کل مقادیر کش را پاکسازی کرده و آمارهای Hit و Miss را صفر می‌کند.\n- **`pop(key: Any, default: Any = ...) -> Any`**: کلید مشخص‌شده را حذف و مقدار آن را برمی‌گرداند. در صورت عدم وجود کلید و عدم ارسال پیش‌فرض، `KeyError` صادر می‌کند.\n- **`keys_order`**: فهرستی از کلیدهای ذخیره‌شده را به ترتیب از قدیمی‌ترین (LRU) تا تازه‌ترین (MRU) برمی‌گرداند.\n- **`__len__()` و `__contains__(key)`**: پشتیبانی از پروتکل‌های استاندارد پایتونی نظیر `len(cache)` و `key in cache`.\n\n---\n\n## ۳. دکوراتورها\n\n### دکوراتور `@memoize`\n\n```python\nfrom parsikit.cache import memoize\n\n@memoize(maxsize=1024)\ndef my_func(a, b):\n    ...\n```\n\nدکوراتور پایتونی برای به خاطر سپردن (Memoization) خروجی توابع خالص به ازای ورودی‌های مشخص.\n\n#### قابلیت‌های کلیدی:\n1. **هماهنگی با پیکربندی سراسری:** وضعیت `parsikit.config.enable_cache` را بررسی می‌کند. اگر روی `False` باشد، کش را دور می‌زند و مستقیماً تابع اصلی را فراخوانی می‌کند.\n2. **ایمنی در محیط‌های چندنخی و توابع بازگشتی:** با استفاده از `threading.RLock` تضمین می‌کند که دسترسی‌های همزمان چند ریسمان و همچنین توابع بازگشتی بدون خطر بن‌بست (Deadlock) اجرا شوند.\n3. **تفکیک دقیق مقادیر None و مقادیر تهی:** با استفاده از نگه‌دارنده درونی (Sentinel)، تمایز کامل میان مقدار بازگشتی `None` یا مقادیر Falsey با خطای Cache Miss تضمین می‌شود.\n4. **رفتار هوشمند در برابر آرگومان‌های Unhashable:** چنانچه آرگومان‌های تابع شامل لیست، دیکشنری، مجموعه یا ساختارهای غیرقابل هش باشند، به جای ایجاد خطای `TypeError`، کش به صورت خودکار دور زده شده و تابع با موفقیت اجرا می‌شود.\n5. **حفظ هویت شیء (Object Identity):** اشیای کش‌شده بدون کپی عمیق غیرضروری و به صورت ارجاع بازگردانده می‌شوند.\n6. **ابزارهای بازرسی و مدیریت:** تابع دکوریت‌شده خصوصیات زیر را در اختیار برنامه‌نویس قرار می‌دهد:\n   - `func.cache`: ارجاع به نمونه `ThreadSafeLRUCache`.\n   - `func.cache_clear()`: پاکسازی کش و ریست کردن آمار.\n   - `func.cache_info()`: گزارش وضعیت شامل hits، misses، maxsize و currsize.\n\n#### مثال کاربردی:\n\n```python\nimport parsikit\nfrom parsikit.cache import memoize\n\n@memoize(maxsize=256)\ndef calculate_vat_report(invoice_id: int, rate: float = 0.10) -> dict:\n    # محاسبات سنگین دیتابیسی یا ریاضی\n    return {\"id\": invoice_id, \"tax\": 150000}\n\n# فراخوانی اول تابع را اجرا کرده و خروجی را کش می‌کند\nresult1 = calculate_vat_report(1024)\n\n# فراخوانی دوم بلافاصله از حافظه رم برگردانده می‌شود\nresult2 = calculate_vat_report(1024)\nassert result1 is result2\n\n# مشاهده آمار کش\ninfo = calculate_vat_report.cache_info()\nprint(f\"Hits: {info.hits}, Misses: {info.misses}\")\n\n# پاکسازی کش\ncalculate_vat_report.cache_clear()\n\n# خاموش کردن موقت کش\nparsikit.config.enable_cache = False\nresult3 = calculate_vat_report(1024)  # تابع مجدداً اجرا می‌شود\nparsikit.config.reset_defaults()\n```\n\n---\n\n## ۴. نکات و محدودیت‌ها\n\n- **آرگومان‌های غیرقابل هش (Unhashable):** ارسال لیست یا دیکشنری باعث پرتاب خطای `TypeError` نمی‌شود، بلکه تابع به صورت مستقیم اجرا شده و کش دور زده می‌شود.\n- **نتایج تغییرپذیر (Mutable):** از آنجا که اشیاء با ارجاع کش می‌شوند، تغییر در خروجی دریافتی (مانند تغییر مقدار درون دیکشنری بازگشتی) در نسخه‌های بعدی فراخوانی نیز منعکس می‌گردد مگر اینکه مصرف‌کننده از آن کپی تهیه کند.\n- **ایزولاسیون پردازه‌ها:** کش در سطح حافظه رم یک پردازه عمل می‌کند و در مدل چندپردازه‌ای (مانند چندین Worker در Gunicorn) هر پردازه کش مستقل خود را دارد.\n",
    "headings": [
      {
        "id": "مرجع-ماژول-کش-parsikit-cache",
        "text": "مرجع ماژول کش (`parsikit.cache`)",
        "level": 1
      },
      {
        "id": "۱-معرفی-و-کاربرد",
        "text": "۱. معرفی و کاربرد",
        "level": 2
      },
      {
        "id": "۲-کلاس-ها",
        "text": "۲. کلاس‌ها",
        "level": 2
      },
      {
        "id": "threadsafelrucache",
        "text": "`ThreadSafeLRUCache`",
        "level": 3
      },
      {
        "id": "۳-دکوراتورها",
        "text": "۳. دکوراتورها",
        "level": 2
      },
      {
        "id": "دکوراتور-memoize",
        "text": "دکوراتور `@memoize`",
        "level": 3
      },
      {
        "id": "محاسبات-سنگین-دیتابیسی-یا-ریاضی",
        "text": "محاسبات سنگین دیتابیسی یا ریاضی",
        "level": 1
      },
      {
        "id": "فراخوانی-اول-تابع-را-اجرا-کرده-و-خروجی-را-کش-می-کند",
        "text": "فراخوانی اول تابع را اجرا کرده و خروجی را کش می‌کند",
        "level": 1
      },
      {
        "id": "فراخوانی-دوم-بلافاصله-از-حافظه-رم-برگردانده-می-شود",
        "text": "فراخوانی دوم بلافاصله از حافظه رم برگردانده می‌شود",
        "level": 1
      },
      {
        "id": "مشاهده-آمار-کش",
        "text": "مشاهده آمار کش",
        "level": 1
      },
      {
        "id": "پاکسازی-کش",
        "text": "پاکسازی کش",
        "level": 1
      },
      {
        "id": "خاموش-کردن-موقت-کش",
        "text": "خاموش کردن موقت کش",
        "level": 1
      },
      {
        "id": "۴-نکات-و-محدودیت-ها",
        "text": "۴. نکات و محدودیت‌ها",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/fa/api/cache.md",
    "counterparts": {
      "en": "api/cache",
      "prs-af": "api/cache",
      "tg": "api/cache"
    },
    "counterpartSlug": "api/cache"
  },
  {
    "id": "fa-api-datetime",
    "slug": "api/datetime",
    "lang": "fa",
    "category": "api",
    "title": "مرجع توابع تاریخ جلالی و زمان نسبی (`parsikit.datetime`)",
    "summary": "ماژول parsikit.datetime ابزارهای دقیق محاسبات تقویم هجری شمسی (جلالی) و تبدیل آن به گاه‌شماری میلادی را بدون نیاز به وابستگی خارجی فراهم می‌سازد.",
    "content": "# مرجع توابع تاریخ جلالی و زمان نسبی (`parsikit.datetime`)\n\nماژول `parsikit.datetime` ابزارهای دقیق محاسبات تقویم هجری شمسی (جلالی) و تبدیل آن به گاه‌شماری میلادی را بدون نیاز به وابستگی خارجی فراهم می‌سازد.\n\n---\n\n## ۱. تبدیل تقویم‌ها\n\n### `gregorian_to_jalali(gy: int, gm: int, gd: int) -> tuple[int, int, int]`\nتاریخ میلادی (سال، ماه، روز) را با دقت بالا به تاریخ هجری شمسی (سال، ماه، روز) تبدیل می‌کند.\n\n```python\nimport parsikit\n\njy, jm, jd = parsikit.gregorian_to_jalali(2026, 7, 6)\nprint(jy, jm, jd)  # (1405, 4, 15)\n```\n\n### `jalali_to_gregorian(jy: int, jm: int, jd: int) -> tuple[int, int, int]`\nتاریخ هجری شمسی را به تاریخ میلادی متناظر تبدیل می‌کند.\n\n```python\ngy, gm, gd = parsikit.jalali_to_gregorian(1405, 4, 15)\nprint(gy, gm, gd)  # (2026, 7, 6)\n```\n\n---\n\n## ۲. بررسی سال کبیسه و اسامی ماه‌ها\n\n### `is_jalali_leap(jy: int) -> bool`\nبررسی می‌کند که آیا سال شمسی مشخص‌شده کبیسه (۳۶۶ روزه با ۳۰ روز در ماه اسفند) است یا خیر. محاسبات منطبق بر دوره‌های سال‌شماری خورشیدی است.\n\n```python\nprint(parsikit.is_jalali_leap(1399))  # True\nprint(parsikit.is_jalali_leap(1400))  # False\nprint(parsikit.is_jalali_leap(1403))  # True\n```\n\n### `get_jalali_month_name(month: int) -> str`\nنام فارسی ماه شمسی را برمی‌گرداند (۱: فروردین، ...، ۱۲: اسفند).\n\n### `format_jalali(jy: int, jm: int, jd: int, pattern: str = \"YYYY/MM/DD\") -> str`\nتاریخ شمسی را در قالب رشته‌ای با الگوی مورد نظر فرمت می‌کند.\n\n---\n\n## ۳. نمایش زمان نسبی فارسی (`humanize_relative_time`)\n\n### `humanize_relative_time(dt_or_seconds, reference=None) -> str`\nیک شیء زمان (`datetime`) یا فاصله زمانی بر حسب ثانیه را به عبارت خوانا و محاوره‌ای فارسی تبدیل می‌کند (با اعداد فارسی):\n\n- `هم‌اکنون`\n- `۱۵ دقیقه پیش` / `در ۱۵ دقیقه آینده`\n- `۳ ساعت پیش` / `در ۳ ساعت آینده`\n- `دیروز` / `فردا`\n- `۵ روز پیش`\n- `۲ ماه پیش`\n- `۳ سال پیش`\n",
    "headings": [
      {
        "id": "مرجع-توابع-تاریخ-جلالی-و-زمان-نسبی-parsikit-datetime",
        "text": "مرجع توابع تاریخ جلالی و زمان نسبی (`parsikit.datetime`)",
        "level": 1
      },
      {
        "id": "۱-تبدیل-تقویم-ها",
        "text": "۱. تبدیل تقویم‌ها",
        "level": 2
      },
      {
        "id": "gregorian_to_jalali-gy-int-gm-int-gd-int-tuple-int-int-int",
        "text": "`gregorian_to_jalali(gy: int, gm: int, gd: int) -> tuple[int, int, int]`",
        "level": 3
      },
      {
        "id": "jalali_to_gregorian-jy-int-jm-int-jd-int-tuple-int-int-int",
        "text": "`jalali_to_gregorian(jy: int, jm: int, jd: int) -> tuple[int, int, int]`",
        "level": 3
      },
      {
        "id": "۲-بررسی-سال-کبیسه-و-اسامی-ماه-ها",
        "text": "۲. بررسی سال کبیسه و اسامی ماه‌ها",
        "level": 2
      },
      {
        "id": "is_jalali_leap-jy-int-bool",
        "text": "`is_jalali_leap(jy: int) -> bool`",
        "level": 3
      },
      {
        "id": "get_jalali_month_name-month-int-str",
        "text": "`get_jalali_month_name(month: int) -> str`",
        "level": 3
      },
      {
        "id": "format_jalali-jy-int-jm-int-jd-int-pattern-str-yyyy-mm-dd-str",
        "text": "`format_jalali(jy: int, jm: int, jd: int, pattern: str = \"YYYY/MM/DD\") -> str`",
        "level": 3
      },
      {
        "id": "۳-نمایش-زمان-نسبی-فارسی-humanize_relative_time",
        "text": "۳. نمایش زمان نسبی فارسی (`humanize_relative_time`)",
        "level": 2
      },
      {
        "id": "humanize_relative_time-dt_or_seconds-reference-none-str",
        "text": "`humanize_relative_time(dt_or_seconds, reference=None) -> str`",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/fa/api/datetime.md",
    "counterparts": {
      "en": "api/datetime",
      "prs-af": "api/datetime",
      "tg": "api/datetime"
    },
    "counterpartSlug": "api/datetime"
  },
  {
    "id": "fa-api-dev_and_gui",
    "slug": "api/dev_and_gui",
    "lang": "fa",
    "category": "api",
    "title": "مرجع ابزارهای توسعه و گرافیک (`parsikit.dev`, `parsikit.gui`, `parsikit.reshaper`)",
    "summary": "ابزارهای ویژه برای عیب‌یابی متنی، هم‌ترازی بصری در جدول‌ها، لاگ‌گیری و نمایش صحیح متن فارسی در رابط‌های گرافیکی (GUI).",
    "content": "# مرجع ابزارهای توسعه و گرافیک (`parsikit.dev`, `parsikit.gui`, `parsikit.reshaper`)\n\nابزارهای ویژه برای عیب‌یابی متنی، هم‌ترازی بصری در جدول‌ها، لاگ‌گیری و نمایش صحیح متن فارسی در رابط‌های گرافیکی (GUI).\n\n---\n\n## ۱. قالب‌بندی بصری هم‌تراز (`pformat` و `persian_fstring`)\n\nکاراکترهای صفر-عرض مانند نیم‌فاصله (`\\u200C`) و اعراب‌ها طول کاراکتری دارند اما عرض نمایشی ندارند؛ توابع استاندارد پایتون در قالب‌بندی ستونی متون فارسی این تفاوت را لحاظ نکرده و جداول را کج می‌کنند.\n\n### `pformat(template: str, *args, **kwargs) -> str`\nمتن را با در نظر گرفتن عرض واقعی بصری (Visual Width) کاراکترها مرتب کرده و فاصله‌گذاری‌ها را هم‌تراز می‌کند. پشتیبانی از پیشوند `:fa` برای تبدیل هم‌زمان ارقام و ویرگول‌های هزارگان.\n\n```python\nfrom parsikit.dev import pformat\n\nline = pformat(\"{:15} | {:>10:fa}\", \"کتاب‌ها\", 15000)\nprint(line)  # 'کتاب‌ها         |     ۱۵،۰۰۰'\n```\n\n### `persian_fstring(template: str, **kwargs) -> str`\nمانند `pformat` برای عبارات الگویی با پشتیبانی از نام متغیرها.\n\n---\n\n## ۲. ابزارهای عیب‌یابی و آزمایش (`parsikit.dev`)\n\n### `inspect_text(text: str) -> dict`\nساختار متن را کالبدشکافی کرده و وضعیت نیم‌فاصله‌ها، ارقام، اعراب و نویسه‌های عربی را گزارش می‌دهد:\n```python\nfrom parsikit.dev import inspect_text\n\nreport = inspect_text(\"نمونه ۱۲۳\")\nprint(report)\n# {'length': ..., 'has_arabic_chars': False, 'has_zwnj': False, 'has_persian_digits': True, ...}\n```\n\n### `debug_text(text: str) -> None`\nگزارش رنگی خوانا و تشخیصی از ویژگی‌های متن را در ترمینال چاپ می‌کند.\n\n### `validate_batch(items: list, model_class, silent: bool = False) -> dict`\nمجموعه‌ای از داده‌ها را به صورت دسته‌ای ارزیابی کرده و تعداد موارد معتبر و نامعتبر را به همراه خطاها تفکیک می‌کند.\n\n---\n\n## ۳. بازآرایی گرافیکی و اتصال به رابط کاربر (`parsikit.reshaper`, `parsikit.gui`)\n\n### `reshape_for_graphics(text: str, reverse: bool = True) -> str`\nمتن فارسی را برای موتورهای رندر فاقد موتور HarfBuzz (مانند Pygame، Pillow، OpenCV و ReportLab) شکل‌دهی و دوجهته‌سازی می‌کند.\n\n### `reshape_paragraph_for_graphics(text: str, max_chars_per_line: int, reverse: bool = True) -> str`\nپاراگراف چندخطی را شکسته و هر سطر را به صورت متصل و آینه‌ای آماده رسم می‌کند.\n\n### `bind_persian_input(widget, input_type: str = \"text\") -> None`\nیک ویجت ورودی متنی در فریم‌ورک‌های Tkinter یا CustomTkinter را مجهز به دستیار تایپ فارسی خودکار (تبدیل «ي» و «ك» و اصلاح اعداد) می‌نماید.\n",
    "headings": [
      {
        "id": "مرجع-ابزارهای-توسعه-و-گرافیک-parsikit-dev-parsikit-gui-parsikit-reshaper",
        "text": "مرجع ابزارهای توسعه و گرافیک (`parsikit.dev`, `parsikit.gui`, `parsikit.reshaper`)",
        "level": 1
      },
      {
        "id": "۱-قالب-بندی-بصری-هم-تراز-pformat-و-persian_fstring",
        "text": "۱. قالب‌بندی بصری هم‌تراز (`pformat` و `persian_fstring`)",
        "level": 2
      },
      {
        "id": "pformat-template-str-args-kwargs-str",
        "text": "`pformat(template: str, *args, **kwargs) -> str`",
        "level": 3
      },
      {
        "id": "persian_fstring-template-str-kwargs-str",
        "text": "`persian_fstring(template: str, **kwargs) -> str`",
        "level": 3
      },
      {
        "id": "۲-ابزارهای-عیب-یابی-و-آزمایش-parsikit-dev",
        "text": "۲. ابزارهای عیب‌یابی و آزمایش (`parsikit.dev`)",
        "level": 2
      },
      {
        "id": "inspect_text-text-str-dict",
        "text": "`inspect_text(text: str) -> dict`",
        "level": 3
      },
      {
        "id": "length-has_arabic_chars-false-has_zwnj-false-has_persian_digits-true",
        "text": "{'length': ..., 'has_arabic_chars': False, 'has_zwnj': False, 'has_persian_digits': True, ...}",
        "level": 1
      },
      {
        "id": "debug_text-text-str-none",
        "text": "`debug_text(text: str) -> None`",
        "level": 3
      },
      {
        "id": "validate_batch-items-list-model_class-silent-bool-false-dict",
        "text": "`validate_batch(items: list, model_class, silent: bool = False) -> dict`",
        "level": 3
      },
      {
        "id": "۳-بازآرایی-گرافیکی-و-اتصال-به-رابط-کاربر-parsikit-reshaper-parsikit-gui",
        "text": "۳. بازآرایی گرافیکی و اتصال به رابط کاربر (`parsikit.reshaper`, `parsikit.gui`)",
        "level": 2
      },
      {
        "id": "reshape_for_graphics-text-str-reverse-bool-true-str",
        "text": "`reshape_for_graphics(text: str, reverse: bool = True) -> str`",
        "level": 3
      },
      {
        "id": "reshape_paragraph_for_graphics-text-str-max_chars_per_line-int-reverse-bool-true-str",
        "text": "`reshape_paragraph_for_graphics(text: str, max_chars_per_line: int, reverse: bool = True) -> str`",
        "level": 3
      },
      {
        "id": "bind_persian_input-widget-input_type-str-text-none",
        "text": "`bind_persian_input(widget, input_type: str = \"text\") -> None`",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/fa/api/dev_and_gui.md",
    "counterparts": {
      "en": "api/dev_and_gui"
    },
    "counterpartSlug": "api/dev_and_gui"
  },
  {
    "id": "fa-api-index",
    "slug": "api/index",
    "lang": "fa",
    "category": "api",
    "title": "مرجع کامل توابع و ماژول‌های پارسی‌کیت (API Reference)",
    "summary": "کتابخانه پارسی‌کیت (ParsiKit) از ماژول‌های زیر تشکیل شده است:",
    "content": "# مرجع کامل توابع و ماژول‌های پارسی‌کیت (API Reference)\n\nکتابخانه **پارسی‌کیت (ParsiKit)** از ماژول‌های زیر تشکیل شده است:\n\n| ماژول | توضیح مختصر | مستندات تفصیلی |\n|---|---|---|\n| `parsikit.text` | استانداردسازی نویسه‌ها، اصلاح نیم‌فاصله‌ها، حذف اعراب، استخراج اطلاعات و ماسک‌گذاری | [مستندات متنی](text.md) |\n| `parsikit.validators` | اعتبارسنجی کد ملی، شماره موبایل، تلفن ثابت، شماره کارت، شبا، شناسه قبض و پلاک | [مستندات اعتبارسنجی](validators.md) |\n| `parsikit.models` | مدل‌های شیءگرای غنی برای داده‌های هویتی، مالی و متنی (پشتیبانی از Pydantic) | [مستندات مدل‌ها](models.md) |\n| `parsikit.datetime` | تبدیل تاریخ جلالی به میلادی و برعکس، محاسبه سال‌های کبیسه، اسامی ماه‌ها و زمان نسبی | [مستندات تاریخ و زمان](datetime.md) |\n| `parsikit.number` و `parsikit.currency` | تبدیل ارقام فارسی و انگلیسی، عدد به حروف، تبدیل ریال و تومان، ارزش افزوده و اقساط | [مستندات اعداد و ارز](number_and_currency.md) |\n| `parsikit.dev` و `parsikit.gui` | قالب‌بندی متنی هم‌تراز با فونت فارسی، عیب‌یابی متن و فرم‌های تعاملی گرافیکی | [مستندات ابزارهای توسعه و GUI](dev_and_gui.md) |\n| `parsikit.reshaper` | چسباندن حروف متصل فارسی و معکوس‌سازی جهت متن برای موتورهای گرافیکی | [مستندات بازآرایی گرافیکی](reshaper.md) |\n| `parsikit.cache` | زیرساخت کشینگ چندریسمانی با کارایی بالا در حافظه رم | [مستندات کشینگ](cache.md) |\n| `parsikit.config` و `parsikit.exceptions` | تنظیمات سراسری پکیج و درخت استثناهای ساختاریافته اعتبارسنجی | [توضیحات استثناها و تنظیمات](#تنظیمات-و-استثناها) |\n\n---\n\n## تنظیمات و استثناها\n\n### ۱. تنظیمات سراسری (`parsikit.config`)\n- `default_tax_rate`: نرخ پیش‌فرض مالیات بر ارزش افزوده (پیش‌فرض: `0.10`).\n- `default_currency`: واحد پول پیش‌فرض سیستم، `\"toman\"` یا `\"rial\"` (پیش‌فرض: `\"toman\"`).\n- `enable_cache`: فعال یا غیرفعال‌سازی کش پرسرعت برای تبدیل اعداد و کلمات (پیش‌فرض: `True`).\n\n### ۲. سلسله‌مراتب خطاهای اعتبارسنجی (`parsikit.exceptions`)\nتمام خطاهای پارسی‌کیت از `ParsiKitError` و `ValidationError` ارث‌بری می‌کنند:\n- `InvalidNationalCodeError`\n- `InvalidMobileError`\n- `InvalidCardNumberError`\n- `InvalidShebaError`\n- `InvalidPostalCodeError`\n- `InvalidPlateError`\n- `InvalidBillError`\n",
    "headings": [
      {
        "id": "مرجع-کامل-توابع-و-ماژول-های-پارسی-کیت-api-reference",
        "text": "مرجع کامل توابع و ماژول‌های پارسی‌کیت (API Reference)",
        "level": 1
      },
      {
        "id": "تنظیمات-و-استثناها",
        "text": "تنظیمات و استثناها",
        "level": 2
      },
      {
        "id": "۱-تنظیمات-سراسری-parsikit-config",
        "text": "۱. تنظیمات سراسری (`parsikit.config`)",
        "level": 3
      },
      {
        "id": "۲-سلسله-مراتب-خطاهای-اعتبارسنجی-parsikit-exceptions",
        "text": "۲. سلسله‌مراتب خطاهای اعتبارسنجی (`parsikit.exceptions`)",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/fa/api/index.md",
    "counterparts": {
      "en": "api/index",
      "prs-af": "api/index",
      "tg": "api/index"
    },
    "counterpartSlug": "api/index"
  },
  {
    "id": "fa-api-models",
    "slug": "api/models",
    "lang": "fa",
    "category": "api",
    "title": "مرجع مدل‌های شیءگرا (`parsikit.models`)",
    "summary": "ماژول parsikit.models اشیای دامنه (Domain Value Objects) را به روش شیءگرای ناب پیاده‌سازی می‌کند. تمام این مدل‌ها ویژگی‌های زیر را دارا هستند:",
    "content": "# مرجع مدل‌های شیءگرا (`parsikit.models`)\n\nماژول `parsikit.models` اشیای دامنه (Domain Value Objects) را به روش شیءگرای ناب پیاده‌سازی می‌کند. تمام این مدل‌ها ویژگی‌های زیر را دارا هستند:\n- اعتبارسنجی خودکار در هنگام ساخت شیء (Instant Validation).\n- پرتاب استثنای مشخص در صورت نامعتبر بودن ورودی.\n- سازگاری کامل با Pydantic v2 و FastAPI جهت استفاده در فیلدهای Schema.\n- محافظت از اطلاعات حساس با صفت `.masked`.\n\n---\n\n## ۱. مدل `PersianText`\nمدل کپسوله‌کننده متن فارسی با عملگرهای پردازشی زنجیره‌ای:\n```python\nfrom parsikit import PersianText\n\ntext = PersianText(\"  متن نمونه با ارقام ۱۲۳ و كتاب ها  \")\nprint(text.standardized)    # متن استاندارد با نیم‌فاصله\nprint(text.word_count)      # تعداد کلمات\nprint(text.has_persian)     # True\nprint(text.slug)            # اسلاگ سئو فینگلیش\n```\n\n---\n\n## ۲. مدل `NationalCode`\nمدل کپسوله‌کننده کد ملی ایران:\n```python\nfrom parsikit import NationalCode\n\nnc = NationalCode(\"0010123458\")\nprint(nc.formatted)         # '001-012345-8'\nprint(nc.masked)            # '001-****45-8' (ایمن برای لاگ‌ها)\nprint(nc.location)          # {'province': 'تهران', 'city': 'تهران مرکزی'}\nprint(nc.is_valid)          # True\n```\n\n---\n\n## ۳. مدل `MobileNumber`\nمدل شماره تلفن همراه ایران:\n```python\nfrom parsikit import MobileNumber\n\nm = MobileNumber(\"+989123456789\")\nprint(m.national)           # '09123456789'\nprint(m.international)      # '+989123456789'\nprint(m.masked)             # '0912***6789'\nprint(m.operator)           # 'MCI'\n```\n\n---\n\n## ۴. مدل `BankCard`\nمدل شماره کارت بانکی ۱۶ رقمی شتاب:\n```python\nfrom parsikit import BankCard\n\ncard = BankCard(\"6037991122334455\")\nprint(card.formatted)       # '6037-9911-2233-4455'\nprint(card.masked)          # '6037-99**-****-4455'\nprint(card.bank_name)       # 'بانک ملی ایران'\n```\n\n---\n\n## ۵. مدل `Sheba`\nمدل شماره شبای بانکی ایران:\n```python\nfrom parsikit import Sheba\n\ns = Sheba(\"IR120170000000123456789012\")\nprint(s.formatted)          # 'IR12 0170 0000 0012 3456 7890 12'\nprint(s.bank_name)          # 'بانک ملی ایران'\nprint(s.account_number)     # شماره حساب پالایش‌شده درونی\n```\n\n---\n\n## ۶. مدل `VehiclePlate`\nمدل پلاک خودروی ایرانی:\n```python\nfrom parsikit import VehiclePlate\n\np = VehiclePlate(\"۱۲ ب ۳۴۵ ایران ۶۸\")\nprint(p.formatted)          # '12-B-345-68'\nprint(p.category)           # 'شخصی' (یا 'تاکسی', 'عمومی')\nprint(p.details)            # اطلاعات تفکیک‌شده پلاک\n```\n",
    "headings": [
      {
        "id": "مرجع-مدل-های-شیءگرا-parsikit-models",
        "text": "مرجع مدل‌های شیءگرا (`parsikit.models`)",
        "level": 1
      },
      {
        "id": "۱-مدل-persiantext",
        "text": "۱. مدل `PersianText`",
        "level": 2
      },
      {
        "id": "۲-مدل-nationalcode",
        "text": "۲. مدل `NationalCode`",
        "level": 2
      },
      {
        "id": "۳-مدل-mobilenumber",
        "text": "۳. مدل `MobileNumber`",
        "level": 2
      },
      {
        "id": "۴-مدل-bankcard",
        "text": "۴. مدل `BankCard`",
        "level": 2
      },
      {
        "id": "۵-مدل-sheba",
        "text": "۵. مدل `Sheba`",
        "level": 2
      },
      {
        "id": "۶-مدل-vehicleplate",
        "text": "۶. مدل `VehiclePlate`",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/fa/api/models.md",
    "counterparts": {
      "en": "api/models",
      "prs-af": "api/models",
      "tg": "api/models"
    },
    "counterpartSlug": "api/models"
  },
  {
    "id": "fa-api-number_and_currency",
    "slug": "api/number_and_currency",
    "lang": "fa",
    "category": "api",
    "title": "مرجع توابع اعداد و محاسبات ارزی (`parsikit.number`, `parsikit.currency`)",
    "summary": "این ماژول‌ها امکان تبدیل ارقام، نوشتن اعداد به حروف، تبدیل واحدهای ریال و تومان، مالیات ارزش افزوده و محاسبات بانکی را در اختیار قرار می‌دهند.",
    "content": "# مرجع توابع اعداد و محاسبات ارزی (`parsikit.number`, `parsikit.currency`)\n\nاین ماژول‌ها امکان تبدیل ارقام، نوشتن اعداد به حروف، تبدیل واحدهای ریال و تومان، مالیات ارزش افزوده و محاسبات بانکی را در اختیار قرار می‌دهند.\n\n---\n\n## ۱. تبدیل ارقام و عدد به حروف (`parsikit.number`)\n\n### `english_to_persian(text: str) -> str`\nتمامی ارقام انگلیسی موجود در متن (`0-9`) را به ارقام متناظر فارسی (`۰-۹`) تبدیل می‌کند.\n\n### `persian_to_english(text: str) -> str`\nارقام فارسی (`۰-۹`) و عربی (`٠-٩`) را به ارقام استاندارد انگلیسی (`0-9`) تبدیل می‌نماید.\n\n### `number_to_words(number: int | float) -> str`\nاعداد بزرگ (تا مقیاس سپتیلیون) را به نوشتار حروفی فارسی برمی‌گرداند. مجهز به سیستم کش LRU داخلی برای بیشترین کارایی.\n\n```python\nimport parsikit\n\nprint(parsikit.number_to_words(1250000))\n# 'یک میلیون و دویست و پنجاه هزار'\n```\n\n---\n\n## ۲. امور مالی و واحدهای پولی (`parsikit.currency`)\n\n### `rial_to_toman(amount: int | float) -> int | float`\nمبلغ را از ریال به تومان تقسیم بر ۱۰ تبدیل می‌کند.\n\n### `toman_to_rial(amount: int | float) -> int | float`\nمبلغ را از تومان به ریال ضربدر ۱۰ تبدیل می‌کند.\n\n### `format_currency(amount, currency=\"toman\", *, persian_digits=False) -> str`\nمبلغ را با جداساز سه‌رقمی هزارگان (با ویرگول فارسی یا انگلیسی) و پسوند واحد پولی قالب‌بندی می‌کند.\n\n```python\nprint(parsikit.format_currency(1500000, \"toman\", persian_digits=True))\n# '۱،۵۰۰،۰۰۰ تومان'\n```\n\n### `format_currency_to_words(amount, currency=\"toman\") -> str`\nمبلغ عددی را همراه با نام واحد پول به صورت حروفی کامل توصیف می‌کند.\n\n### `add_tax_and_toll(amount, tax_rate=None) -> dict`\nمبلغ مالیات بر ارزش افزوده و مبلغ نهایی فاکتور را محاسبه می‌کند:\n```python\ninv = parsikit.add_tax_and_toll(10000000)\nprint(inv)\n# {'original_amount': 10000000, 'tax_rate': 0.1, 'tax_amount': 1000000.0, 'total_amount': 11000000.0}\n```\n\n### `calculate_installments(principal, annual_interest_rate, months) -> dict`\nمحاسبه اقساط ماهانه تسهیلات بانکی، سود کل و مجموع بازپرداخت بر اساس فرمول بانک مرکزی.\n",
    "headings": [
      {
        "id": "مرجع-توابع-اعداد-و-محاسبات-ارزی-parsikit-number-parsikit-currency",
        "text": "مرجع توابع اعداد و محاسبات ارزی (`parsikit.number`, `parsikit.currency`)",
        "level": 1
      },
      {
        "id": "۱-تبدیل-ارقام-و-عدد-به-حروف-parsikit-number",
        "text": "۱. تبدیل ارقام و عدد به حروف (`parsikit.number`)",
        "level": 2
      },
      {
        "id": "english_to_persian-text-str-str",
        "text": "`english_to_persian(text: str) -> str`",
        "level": 3
      },
      {
        "id": "persian_to_english-text-str-str",
        "text": "`persian_to_english(text: str) -> str`",
        "level": 3
      },
      {
        "id": "number_to_words-number-int-float-str",
        "text": "`number_to_words(number: int | float) -> str`",
        "level": 3
      },
      {
        "id": "یک-میلیون-و-دویست-و-پنجاه-هزار",
        "text": "'یک میلیون و دویست و پنجاه هزار'",
        "level": 1
      },
      {
        "id": "۲-امور-مالی-و-واحدهای-پولی-parsikit-currency",
        "text": "۲. امور مالی و واحدهای پولی (`parsikit.currency`)",
        "level": 2
      },
      {
        "id": "rial_to_toman-amount-int-float-int-float",
        "text": "`rial_to_toman(amount: int | float) -> int | float`",
        "level": 3
      },
      {
        "id": "toman_to_rial-amount-int-float-int-float",
        "text": "`toman_to_rial(amount: int | float) -> int | float`",
        "level": 3
      },
      {
        "id": "format_currency-amount-currency-toman-persian_digits-false-str",
        "text": "`format_currency(amount, currency=\"toman\", *, persian_digits=False) -> str`",
        "level": 3
      },
      {
        "id": "۱،۵۰۰،۰۰۰-تومان",
        "text": "'۱،۵۰۰،۰۰۰ تومان'",
        "level": 1
      },
      {
        "id": "format_currency_to_words-amount-currency-toman-str",
        "text": "`format_currency_to_words(amount, currency=\"toman\") -> str`",
        "level": 3
      },
      {
        "id": "add_tax_and_toll-amount-tax_rate-none-dict",
        "text": "`add_tax_and_toll(amount, tax_rate=None) -> dict`",
        "level": 3
      },
      {
        "id": "original_amount-10000000-tax_rate-0-1-tax_amount-1000000-0-total_amount-11000000-0",
        "text": "{'original_amount': 10000000, 'tax_rate': 0.1, 'tax_amount': 1000000.0, 'total_amount': 11000000.0}",
        "level": 1
      },
      {
        "id": "calculate_installments-principal-annual_interest_rate-months-dict",
        "text": "`calculate_installments(principal, annual_interest_rate, months) -> dict`",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/fa/api/number_and_currency.md",
    "counterparts": {
      "en": "api/number_and_currency",
      "prs-af": "api/number_and_currency",
      "tg": "api/number_and_currency"
    },
    "counterpartSlug": "api/number_and_currency"
  },
  {
    "id": "fa-api-reshaper",
    "slug": "api/reshaper",
    "lang": "fa",
    "category": "api",
    "title": "مرجع ماژول بازآرایی گرافیکی (`parsikit.reshaper`)",
    "summary": "ابزار سبک و بدون وابستگی برای چسباندن حروف فارسی (Shaping) و معکوس‌سازی جهت متن (BiDi) جهت نمایش صحیح در موتورهای گرافیکی و بازی‌ها.",
    "content": "# مرجع ماژول بازآرایی گرافیکی (`parsikit.reshaper`)\n\nابزار سبک و بدون وابستگی برای چسباندن حروف فارسی (Shaping) و معکوس‌سازی جهت متن (BiDi) جهت نمایش صحیح در موتورهای گرافیکی و بازی‌ها.\n\n---\n\n## ۱. معرفی و کاربرد\n\nاکثر موتورهای گرافیکی در پایتون (نظیر Pygame ،OpenCV ،Pillow بدون libraqm، کتابخانه‌های ساخت PDF و موتورهای بازی‌سازی) متون را بر اساس الفبای چپ‌به‌راست لاتین چاپ می‌کنند. در نتیجه حروف فارسی به صورت ناپیوسته و وارونه (مثلاً `س ل ا م` به جای `سلام`) نمایش داده می‌شوند.\n\nماژول `parsikit.reshaper` با تبدیل حروف به فرم‌های متنی یونیکد (آغازی، میانی، پایانی و جدا) و بازآرایی بلوک‌های متنی، مشکل رسم فونت فارسی را بدون نیاز به هیچ کتابخانه جانبی حل می‌کند.\n\n---\n\n## ۲. توابع عمومی\n\n### تابع `reshape_for_graphics(text: str, reverse: bool = True) -> str`\n\nحروف فارسی را به یکدیگر می‌چسباند و در صورت نیاز جهت متن را برای موتورهای چپ‌به‌راست برعکس می‌کند.\n\n#### پارامترها:\n- **`text`** (`str`): متن فارسی یا متن دوزبانه (فارسی و انگلیسی) ورودی.\n- **`reverse`** (`bool`، پیش‌فرض `True`): در صورتی که `True` باشد، حروف فارسی را برای رسم چپ‌به‌راست معکوس می‌کند. کلمات و اعداد انگلیسی درون متن به درستی حفظ می‌شوند و برعکس نمی‌شوند.\n\n#### خروجی:\n- `str`: متن بازآرایی‌شده آماده ارسال به موتور گرافیکی یا ابزار ترسیم عکس.\n\n#### مفاهیم جهت و معکوس‌سازی (Direction & Reversal Semantics):\n- **`reverse=True` (پیش‌فرض):** ویژه موتورهای گرافیکی ساده (نظیر Pygame ،OpenCV ،Pillow پایه و Matplotlib) که حروف را صرفاً از چپ به راست رسم می‌کنند. ترتیب حروف فارسی معکوس می‌شود تا از راست به چپ خوانده شوند، در حالی که بلوک‌های چپ‌به‌راست (کلمات لاتین، نشانی‌های وب، ایمیل‌ها، تاریخ‌ها و اعداد) به درستی در جهت طبیعی حفظ می‌شوند.\n- **`reverse=False`:** ویژه موتورهایی که خود دارای مدیریت مکان‌نما و جریان دوجهته هستند، اما توانایی چسباندن فونت فارسی (اتصال حروف آغازی، میانی، پایانی و جدا) را ندارند. در این حالت تنها تبدیل حروف به اشکال متنی Presentation Forms انجام شده و ترتیب ترتیبی کاراکترها دست‌نخورده می‌ماند.\n\n#### قابلیت‌های فنی:\n- نگاشت کامل تمام حروف الفبای فارسی و کاراکترهای عربی متداول (از جمله `ۀ`، `ك`، `ي` و حرف «ە» کردی).\n- ترکیب خودکار حروف «لا» (Lam-Alef Ligature) در حالات چسبیده و جدا (`لا`، `لآ`، `لأ`، `لإ`).\n- نادیده‌گرفتن اعراب حین اتصال حروف و حفظ پیوستگی حرکات با کاراکتر پایه هنگام معکوس‌سازی جهت.\n- تفکیک هوشمند عبارات انگلیسی، لینک‌های اینترنتی، ایمیل‌ها و اعداد فارسی/لاتین برای جلوگیری از وارونه شدن ترتیب خوانش ارقام.\n\n#### محدودیت‌ها و دامنه عملکرد:\nماژول `parsikit.reshaper` یک ابزار سبک و بدون وابستگی جانبی برای رفع مشکلات متداول فونت است و ادعای پیاده‌سازی کامل الگوریتم استاندارد دوجهته یونیکد (Unicode Bidirectional Algorithm - UAX #9) را ندارد. این ماژول متون دوزبانه تک‌سطحی و بلوک‌های پیوسته را به خوبی تفکیک می‌کند؛ اما برای متون پیچیده با تودرتویی چندلایه دوجهته (مانند عبارت عربی داخل جمله انگلیسی درون پاراگراف فارسی با علائم خنثی متقاطع)، استفاده از موتورهای سطح سیستمی کامل نظیر HarfBuzz و Raqm/FriBidi توصیه می‌شود.\n\n#### مثال کاربردی:\n\n```python\nimport parsikit\n\nraw_text = \"سلام دنیا (نسخه 3.3.1)\"\n\n# آماده‌سازی جهت رندر روی Pygame یا OpenCV:\ndisplay_text = parsikit.reshape_for_graphics(raw_text)\n\n# فقط چسباندن حروف بدون وارونه‌سازی:\nconnected_only = parsikit.reshape_for_graphics(raw_text, reverse=False)\n```\n\n---\n\n### تابع `reshape_paragraph_for_graphics(text: str, max_chars_per_line: int, reverse: bool = True) -> list[str]`\n\nیک پاراگراف طولانی را بر اساس حداکثر طول هر سطر می‌شکند و تمام خطوط را برای چاپ گرافیکی بازآرایی می‌کند.\n\n#### پارامترها:\n- **`text`** (`str`): متن پاراگراف.\n- **`max_chars_per_line`** (`int`): حداکثر تعداد کاراکتر مجاز در هر خط.\n- **`reverse`** (`bool`، پیش‌فرض `True`): فعال بودن معکوس‌سازی جهت چاپ روی بوم چپ‌به‌راست.\n\n#### خروجی:\n- `list[str]`: آرایه‌ای از سطرهای بازآرایی‌شده.\n\n#### مثال کاربردی:\n\n```python\nimport parsikit\n\ntext = \"پارسی‌کیت ابزاری سریع و مستقل برای پردازش داده‌های فارسی در زبان پایتون است.\"\nlines = parsikit.reshape_paragraph_for_graphics(text, max_chars_per_line=30)\nfor line in lines:\n    print(line)\n```\n\n---\n\n## ۳. ارتباط با سایر ماژول‌ها\n\n- توصیه می‌شود قبل از ارسال متن به `reshape_for_graphics`، آن را با تابع `parsikit.text.standardize_persian` استاندارد کنید.\n- برای فرم‌های ورود اطلاعات زنده در Tkinter یا PyQt از ماژول `parsikit.gui.bind_persian_input` استفاده کنید.\n",
    "headings": [
      {
        "id": "مرجع-ماژول-بازآرایی-گرافیکی-parsikit-reshaper",
        "text": "مرجع ماژول بازآرایی گرافیکی (`parsikit.reshaper`)",
        "level": 1
      },
      {
        "id": "۱-معرفی-و-کاربرد",
        "text": "۱. معرفی و کاربرد",
        "level": 2
      },
      {
        "id": "۲-توابع-عمومی",
        "text": "۲. توابع عمومی",
        "level": 2
      },
      {
        "id": "تابع-reshape_for_graphics-text-str-reverse-bool-true-str",
        "text": "تابع `reshape_for_graphics(text: str, reverse: bool = True) -> str`",
        "level": 3
      },
      {
        "id": "آماده-سازی-جهت-رندر-روی-pygame-یا-opencv",
        "text": "آماده‌سازی جهت رندر روی Pygame یا OpenCV:",
        "level": 1
      },
      {
        "id": "فقط-چسباندن-حروف-بدون-وارونه-سازی",
        "text": "فقط چسباندن حروف بدون وارونه‌سازی:",
        "level": 1
      },
      {
        "id": "تابع-reshape_paragraph_for_graphics-text-str-max_chars_per_line-int-reverse-bool-true-list-str",
        "text": "تابع `reshape_paragraph_for_graphics(text: str, max_chars_per_line: int, reverse: bool = True) -> list[str]`",
        "level": 3
      },
      {
        "id": "۳-ارتباط-با-سایر-ماژول-ها",
        "text": "۳. ارتباط با سایر ماژول‌ها",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/fa/api/reshaper.md",
    "counterparts": {
      "en": "api/reshaper"
    },
    "counterpartSlug": "api/reshaper"
  },
  {
    "id": "fa-api-text",
    "slug": "api/text",
    "lang": "fa",
    "category": "api",
    "title": "مرجع توابع پردازش متن (`parsikit.text`)",
    "summary": "ماژول parsikit.text هسته اصلی ابزارهای استانداردسازی، پالایش، اصلاح نیم‌فاصله، تصحیح کیبورد و مرتب‌سازی متنی در پارسی‌کیت است.",
    "content": "# مرجع توابع پردازش متن (`parsikit.text`)\n\nماژول `parsikit.text` هسته اصلی ابزارهای استانداردسازی، پالایش، اصلاح نیم‌فاصله، تصحیح کیبورد و مرتب‌سازی متنی در پارسی‌کیت است.\n\n---\n\n## ۱. استانداردسازی و پالایش متنی\n\n### `standardize_persian(text: str, *, strip_diacritics_opt: bool = False, preserve_arabic: bool = False) -> str`\nمتن ورودی را بر اساس اصول استاندارد یونیکد و دستور خط فارسی یکسان‌سازی می‌کند:\n- **دامنه کاربرد و پشتیبانی چندزبانه:**\n  - در حالت پیش‌فرض (`preserve_arabic=False`)، متن در بافت رسم‌الخط فارسی استانداردسازی شده و نویسه‌های وامی عربی به معادل‌های فارسی تبدیل می‌شوند:\n    - تبدیل «ي» عربی (`\\u064A`) و «ى» مقصوره (`\\u0649`) به «ی» فارسی (`\\u06CC`).\n    - تبدیل «ك» عربی (`\\u0643`) به «ک» فارسی (`\\u06A9`).\n    - تبدیل «ة» عربی (`\\u0629`) در واژگان دخیل به «ه» فارسی (`\\u0647`) (مانند `دایرة المعارف` به `دایره المعارف`).\n    - تبدیل ارقام عربی (`٠١٢٣٤٥٦٧٨٩`) به ارقام فارسی (`۰۱۲۳۴۵۶۷۸۹`).\n    - تبدیل «ۀ» (`\\u06C0`) به ترکیب استاندارد «هٔ» (`\\u0647\\u0654`).\n  - در صورت تنظیم `preserve_arabic=True`، حروف ویژه زبان عربی (نظیر «ة» و «ي») بدون تغییر حفظ شده و متون عربی (مانند `\"هذه لغة عربية جميلة\"`) دستخوش دگرگونی ناخواسته نمی‌شوند.\n  - حروف ویژه کردی از جمله حرف «ە» کردی (`\\u06D5`) **هرگز** به «ه» تبدیل نشده و همواره دست‌نخورده باقی می‌مانند (مانند `\"لە کوردی\"`).\n  - واژگان انگلیسی و لاتین بدون کوچک‌ترین تغییری حفظ می‌شوند.\n- **نرمال‌سازی کانونی یونیکد (NFC):** تبدیل کاراکترهای ترکیبی شکسته (مانند «آ» به صورت ترکیب الف و مد کلاهی) به فرم‌های استاندارد و یکپارچه.\n- **موتور پردازش نیم‌فاصله (ZWNJ):**\n  - تنظیم خودکار نیم‌فاصله برای پیشوندهای «می»، «نمی» و «بی» و پسوندهای «ها»، «های»، «ترین»، «تر»، «ای» و ضمایر متصل.\n  - رعایت مرز واژگان مستقل: وجود فاصله در دو سوی نیم‌فاصله میان دو واژه مستقل (مانند `\"الف \\u200c ب\"`) به یک فاصله معمولی تبدیل شده (`\"الف ب\"`) و از ادغام اشتباهی کلمات مستقل جلوگیری می‌شود.\n  - پاکسازی فاصله‌های یک‌طرفه مجاور نیم‌فاصله (مانند تبدیل `\"دانش \\u200cآموز\"` به `\"دانش\\u200cآموز\"`).\n  - حذف نیم‌فاصله‌های زاید مجاور علائم نگارشی (مانند نقطه، ویرگول، پرانتز و گیومه).\n  - تجمیع نیم‌فاصله‌های متوالی تکراری (`\\u200C{2,}`) به یک نیم‌فاصله منفرد.\n  - پیراستن (Trim) نیم‌فاصله‌های ابتدا و انتهای خطوط.\n- **خاصیت تکرارپذیری (Idempotence):** اجرای مکرر تابع خروجی کاملاً پایدار تولید می‌کند: `standardize(standardize(x)) == standardize(x)`.\n- **حفظ شکستگی خطوط:** فاصله‌های اضافی پیوسته ادغام شده اما ساختار خطوط و پاراگراف‌ها حفظ می‌گردد.\n- **حذف اعراب:** در صورت تنظیم `strip_diacritics_opt=True`، تمامی حرکات و اعراب‌ها به صورت خودکار حذف می‌شوند.\n\n### `strip_diacritics(text: str) -> str`\nاعراب‌های زبان عربی و فارسی (حرکات مانند فَتحه، ضَمّه، کَسره، تنوین‌ها، تشدید و سکون) را با استفاده از الگوهای کامپایل‌شده سریع حذف می‌کند.\n\n### `is_persian(text: str) -> bool`\nبررسی می‌کند که آیا در رشته ارسالی کاراکترهای الفبای فارسی یا عربی وجود دارد یا خیر.\n\n### `clean_text(text: str, *, preserve_arabic: bool = False) -> str`\nپالایشگر جامع متنی چندخطی با حفاظت کامل از نشانه‌های فنی:\n1. **محافظت از توکن‌ها:** استخراج و ایمن‌سازی نشانی‌های وب (URLs)، ایمیل‌ها، شناسه‌های فنی و شماره نسخه‌ها در برابر تغییر ارقام یا دستکاری نشانه‌ها.\n2. **استانداردسازی رسم‌الخط:** استانداردسازی حروف و نیم‌فاصله‌ها با `standardize_persian(..., preserve_arabic=preserve_arabic)`.\n3. **تبدیل اعداد:** تبدیل اعداد درون متن‌های عادی به ارقام فارسی، در حالی که نشانی‌های وب، نسخه‌ها و شناسه‌های فنی با ارقام انگلیسی دست‌نخورده می‌مانند.\n4. **تنظیم فاصله‌گذاری:** زیباسازی فاصله‌گذاری پیرامون علائم نگارشی با `beautify_persian_spacing`.\n5. **حذف کاراکترهای نامرئی:** حذف نویسه‌های نامرئی کنترلی و دوجهته (`\\u200B`، `\\uFEFF`، `\\u200E-\\u200F`، `\\u202A-\\u202E`) با حفظ قطعی نیم‌فاصله (`\\u200C`).\n6. **اصلاح پاراگراف‌ها:** حذف شکستگی‌های مکرر خطوط (حداکثر ۱ خط خالی بین بندها) و پیراستن فاصله‌های ابتدا و انتهای هر سطر.\n7. **بازیابی توکن‌ها:** بازگرداندن داده‌های محافظت‌شده به شکل دقیق اولیه.\n\n### `normalize_whitespace(text: str, keep_paragraphs: bool = True) -> str`\nفاصله‌های نامتعارف یونیکد (تب‌ها، فاصله‌های نشکن `\\u00A0`، فاصله‌های باریک) را به فاصله استاندارد تبدیل می‌کند.\n- اگر `keep_paragraphs=True` باشد (پیش‌فرض)، ساختار پاراگراف‌ها حفظ شده و خطوط خالی اضافی حذف می‌شوند.\n- اگر `keep_paragraphs=False` باشد، متن در قالب یک خط ممتد و بدون شکستگی ادغام می‌گردد.\n\n### `beautify_persian_spacing(text: str) -> str`\nفاصله‌گذاری پیرامون علائم نگارشی فارسی و لاتین را با ایمنی داده‌ها تنظیم می‌کند:\n- اصلاح ویرگول فارسی («،») و نقطه-ویرگول فارسی («؛»).\n- حذف فاصله‌های اضافی قبل از نشانه‌ها (`.`، `،`، `؛`، `؟`، `!`، `:`، `)`).\n- ایجاد تک‌فاصله بعد از علائم نگارشی فارسی.\n- تنظیم هوشمند پرانتزها، قلاب‌ها و گیومه‌ها بدون ایجاد فاصله غیرمجاز پیش از علائم نگارشی انتهای جمله.\n- عدم تغییر ارقام عددی.\n- **محافظت هوشمند از ساختار داده‌ها:**\n  - **نشانی‌های وب (URLs):** حفظ کامل آدرس‌ها، پارامترهای کوئری (`?x=1&y=2`)، پورت‌ها (`:8080`)، قطعات (`#section`) و کاراکترهای درصد-کدگذاری شده (`%20`) بدون درج فاصله اضافی پس از علامت سوال یا دونقطه.\n  - **نشانه‌های نگارشی بعد از آدرس:** نقطه یا ویرگول فارسی پس از نشانی وب به درستی در متن قرار گرفته و جذب آدرس نمی‌شود.\n  - **ایمیل‌ها:** حفظ کامل آدرس‌های ایمیل (مانند `user.name+tag@example.co.uk`).\n  - **شناسه‌های فنی و نگارش‌ها:** حفظ عبارات کلید-مقدار (مانند `version=v2.0.1`)، نگارش نرم‌افزارها (مانند `Python 3.13.3`) و کدهای شناسایی (مانند `ID-2026-0042`).\n  - **اعداد اعشاری و زمان:** حفظ اعداد اعشاری (`3.14` و `۱۲.۵`) و فرمت ساعت (`12:30` و `۱۴:۴۵`).\n  - **نام فایل‌ها و کدها:** حفظ پسوندهای فایلی (مانند `test.py` و `script.min.js`).\n  - **سه‌نقطه پیوسته (`...`):** حفظ اتصال نقاط.\n\n---\n\n## ۲. چینش کیبورد و مرتب‌سازی فارسی\n\n### `correct_keyboard_layout(text: str) -> str`\nمتونی که به اشتباه با کیبورد انگلیسی تایپ شده‌اند را به فارسی تبدیل می‌کند (مثلاً `\"sghl\"` به `\"سلام\"`).\n\n### `persian_sort_key(s: str) -> tuple[int, ...]`\nتولید کلید مرتب‌سازی تیوپل پرسرعت بر اساس ترتیب الفبای فارسی (`آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی`) با نگاشت همسنگ حروف هم‌خانواده (`أ`, `إ`, `ٱ`, `ؤ`, `ئ`) و رعایت اولویت ارقام و نیم‌فاصله.\n\n### `persian_sorted(iterable: Iterable[T], *, reverse: bool = False) -> list[T]`\nلیستی از رشته‌ها را بر اساس الفبای استاندارد فارسی با کارایی بسیار بالا مرتب می‌کند.\n\n---\n\n## ۳. استخراج و تبدیل\n\n### `words_to_number(text: str) -> int`\nتبدیل‌گر پرسرعت عبارات عددی حروفی فارسی به عدد صحیح (مثلاً `\"سی و دو هزار و پانصد\"` به `32500`). پشتیبانی از اعداد منفی، مقیاس‌های مرکب (مانند `\"هزار میلیارد\"` به `1000000000000`) و مقادیر بزرگ تا سپتیلیون.\n\n### `convert_numbers(text: str, to: Literal[\"persian\", \"english\"] = \"persian\") -> str`\nتبدیل ارقام داخل متن بین رسم‌الخط فارسی (`۰-۹`) و انگلیسی (`0-9`).\n\n### `slugify(text: str, separator: str = \"-\") -> str`\nتولید پیوند یکتای سئو-محور فینگلیش با پشتیبانی از کلمات رایج، حروف اضافه و واژگان فنی (`پایتون` → `python`، `وردپرس` → `wordpress`، `در` → `dar`).\n\n### `extract_mobiles(text: str) -> list[str]`\nاستخراج و اعتبارسنجی شماره‌های تلفن همراه معتبر ایرانی از متون خام.\n\n### `extract_national_codes(text: str) -> list[str]`\nاستخراج و اعتبارسنجی کدهای ملی ۱۰ رقمی با رعایت الگوریتم رسمی چک‌سام ثبت‌احوال.\n\n---\n\n## ۴. ماسک کردن اطلاعات حساس (`mask_*`)\n\n### `mask_mobile(phone: str, mask_char: str = \"*\") -> str`\nماسک کردن ارقام میانی شماره موبایل (مثال: `0912***6789`).\n\n### `mask_card(card: str, mask_char: str = \"*\") -> str`\nماسک کردن ارقام میانی شماره کارت بانکی ۱۶ رقمی (مثال: `6037-99**-****-4455`).\n\n### `mask_national_code(code: str, mask_char: str = \"*\") -> str`\nماسک کردن ارقام میانی کد ملی ۱۰ رقمی (مثال: `773-****45-2`).\n\n### `mask_email(email: str, mask_char: str = \"*\") -> str`\nماسک کردن کاراکترهای میانی نام کاربری ایمیل (مثال: `ka********e@gmail.com`).\n\n",
    "headings": [
      {
        "id": "مرجع-توابع-پردازش-متن-parsikit-text",
        "text": "مرجع توابع پردازش متن (`parsikit.text`)",
        "level": 1
      },
      {
        "id": "۱-استانداردسازی-و-پالایش-متنی",
        "text": "۱. استانداردسازی و پالایش متنی",
        "level": 2
      },
      {
        "id": "standardize_persian-text-str-strip_diacritics_opt-bool-false-preserve_arabic-bool-false-str",
        "text": "`standardize_persian(text: str, *, strip_diacritics_opt: bool = False, preserve_arabic: bool = False) -> str`",
        "level": 3
      },
      {
        "id": "strip_diacritics-text-str-str",
        "text": "`strip_diacritics(text: str) -> str`",
        "level": 3
      },
      {
        "id": "is_persian-text-str-bool",
        "text": "`is_persian(text: str) -> bool`",
        "level": 3
      },
      {
        "id": "clean_text-text-str-preserve_arabic-bool-false-str",
        "text": "`clean_text(text: str, *, preserve_arabic: bool = False) -> str`",
        "level": 3
      },
      {
        "id": "normalize_whitespace-text-str-keep_paragraphs-bool-true-str",
        "text": "`normalize_whitespace(text: str, keep_paragraphs: bool = True) -> str`",
        "level": 3
      },
      {
        "id": "beautify_persian_spacing-text-str-str",
        "text": "`beautify_persian_spacing(text: str) -> str`",
        "level": 3
      },
      {
        "id": "۲-چینش-کیبورد-و-مرتب-سازی-فارسی",
        "text": "۲. چینش کیبورد و مرتب‌سازی فارسی",
        "level": 2
      },
      {
        "id": "correct_keyboard_layout-text-str-str",
        "text": "`correct_keyboard_layout(text: str) -> str`",
        "level": 3
      },
      {
        "id": "persian_sort_key-s-str-tuple-int",
        "text": "`persian_sort_key(s: str) -> tuple[int, ...]`",
        "level": 3
      },
      {
        "id": "persian_sorted-iterable-iterable-t-reverse-bool-false-list-t",
        "text": "`persian_sorted(iterable: Iterable[T], *, reverse: bool = False) -> list[T]`",
        "level": 3
      },
      {
        "id": "۳-استخراج-و-تبدیل",
        "text": "۳. استخراج و تبدیل",
        "level": 2
      },
      {
        "id": "words_to_number-text-str-int",
        "text": "`words_to_number(text: str) -> int`",
        "level": 3
      },
      {
        "id": "convert_numbers-text-str-to-literal-persian-english-persian-str",
        "text": "`convert_numbers(text: str, to: Literal[\"persian\", \"english\"] = \"persian\") -> str`",
        "level": 3
      },
      {
        "id": "slugify-text-str-separator-str-str",
        "text": "`slugify(text: str, separator: str = \"-\") -> str`",
        "level": 3
      },
      {
        "id": "extract_mobiles-text-str-list-str",
        "text": "`extract_mobiles(text: str) -> list[str]`",
        "level": 3
      },
      {
        "id": "extract_national_codes-text-str-list-str",
        "text": "`extract_national_codes(text: str) -> list[str]`",
        "level": 3
      },
      {
        "id": "۴-ماسک-کردن-اطلاعات-حساس-mask_",
        "text": "۴. ماسک کردن اطلاعات حساس (`mask_*`)",
        "level": 2
      },
      {
        "id": "mask_mobile-phone-str-mask_char-str-str",
        "text": "`mask_mobile(phone: str, mask_char: str = \"*\") -> str`",
        "level": 3
      },
      {
        "id": "mask_card-card-str-mask_char-str-str",
        "text": "`mask_card(card: str, mask_char: str = \"*\") -> str`",
        "level": 3
      },
      {
        "id": "mask_national_code-code-str-mask_char-str-str",
        "text": "`mask_national_code(code: str, mask_char: str = \"*\") -> str`",
        "level": 3
      },
      {
        "id": "mask_email-email-str-mask_char-str-str",
        "text": "`mask_email(email: str, mask_char: str = \"*\") -> str`",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/fa/api/text.md",
    "counterparts": {
      "en": "api/text",
      "prs-af": "api/text",
      "tg": "api/text"
    },
    "counterpartSlug": "api/text"
  },
  {
    "id": "fa-api-validators",
    "slug": "api/validators",
    "lang": "fa",
    "category": "api",
    "title": "مرجع توابع اعتبارسنجی و تطبیق الگو (`parsikit.validators`)",
    "summary": "ماژول parsikit.validators موتور اعتبارسنجی قوانین و استانداردهای هویتی، پستی، مخابراتی، بانکی و خودرویی کشور ایران است.",
    "content": "# مرجع توابع اعتبارسنجی و تطبیق الگو (`parsikit.validators`)\n\nماژول `parsikit.validators` موتور اعتبارسنجی قوانین و استانداردهای هویتی، پستی، مخابراتی، بانکی و خودرویی کشور ایران است.\n\n---\n\n## ۱. کد ملی (National Code)\n\n### `is_valid_national_code(code: str, strict: bool = True) -> bool`\nاعتبار کد ملی ۱۰ رقمی را با الگوریتم کنترل رقم پایانی (مبنای ۱۱) بررسی می‌کند. در حالت `strict=True`، کدهای با ده رقم یکسان نامعتبر تلقی می‌شوند. ارقام فارسی و عربی به صورت خودکار پشتیبانی می‌شوند.\n\n### `format_national_code(code: str) -> str`\nکد ملی را در قالب استاندارد ۳-۶-۱ با خط تیره مرتب می‌کند (مثال: `001-012345-8`).\n\n### `detect_national_code_location(code: str) -> dict | None`\nبر اساس ۳ رقم ابتدایی کد ملی، استان و شهر صادرکننده را به صورت دیکشنری `{\"province\": ..., \"city\": ...}` برمی‌گرداند.\n\n---\n\n## ۲. تلفن همراه و ثابت (Phone Numbers)\n\n### `is_valid_mobile(phone: str) -> bool`\nبررسی می‌کند که آیا شماره تلفن همراه ۱۱ رقمی با فرمت 09xx و متعلق به اپراتورهای فعال کشور است یا خیر.\n\n### `normalize_mobile(phone: str, prefix: str = \"0\") -> str`\nشماره همراه را در قالب استاندارد ملی (`0912...`) یا بین‌المللی (`+98912...`) یکدست می‌کند.\n\n### `detect_mobile_operator(phone: str) -> str | None`\nنام اپراتور سرویس‌دهنده (مانند همراه اول - `MCI`، ایرانسل - `MTN`، رایتل - `Rightel` و غیره) را شناسایی می‌کند.\n\n### `is_valid_landline(phone: str) -> bool`\nاعتبار شماره تلفن ثابت استانی با پیش‌شماره معتبر را بررسی می‌کند.\n\n### `detect_landline_province(phone: str) -> str | None`\nاستان مربوط به پیش‌شماره تلفن ثابت را تشخیص می‌دهد (مثلاً `021` تهران).\n\n---\n\n## ۳. کارت بانکی و شماره شبا (Banking)\n\n### `is_valid_card_number(card: str) -> bool`\nاعتبار ۱۶ رقم کارت بانکی عضو شتاب را با الگوریتم لان (Luhn) بررسی می‌کند.\n\n### `format_card_number(card: str, separator: str = \"-\") -> str`\nشماره کارت را در بلوک‌های ۴ رقمی گروه‌بندی می‌کند (`6037-9911-2233-4455`).\n\n### `detect_bank_from_card(card: str) -> str | None`\nنام بانک صادرکننده کارت شتاب را از روی ۶ رقم اول استخراج می‌کند.\n\n### `is_valid_sheba(sheba: str) -> bool`\nاعتبار ۲۴ یا ۲۶ نویسه شماره شبای بانکی ایران (IR) را بر اساس الگوریتم مود ۹۷ ایزو ۷۰۶۴ بررسی می‌کند.\n\n### `format_sheba(sheba: str, chunk_size: int = 4) -> str`\nشماره شبا را برای خوانایی به بلوک‌های ۴ کاراکتری با فاصله تقسیم می‌کند.\n\n### `detect_bank_from_sheba(sheba: str) -> str | None`\nنام بانک مرتبط با شناسه بانکی موجود در شماره شبا را مشخص می‌سازد.\n\n---\n\n## ۴. کد پستی، شناسه ملی حقوقی، قبوض و پلاک خودرو\n\n### `is_valid_postal_code(code: str) -> bool`\nاعتبار کد پستی ۱۰ رقمی ایران را بررسی می‌کند (شامل منع استفاده از اعداد ۵ و ۲ در موقعیت‌های خاص طبق ضوابط شرکت ملی پست).\n\n### `format_postal_code(code: str) -> str`\nکد پستی را به فرمت استاندارد ۵-۵ (`XXXXX-XXXXX`) با خط تیره قالب‌بندی می‌کند.\n\n### `is_valid_corporate_id(corp_id: str) -> bool`\nشناسه ملی ۱۱ رقمی اشخاص حقوقی و شرکت‌ها را با الگوریتم کنترلی رسمی شرکت‌ها ارزیابی می‌کند.\n\n### `is_valid_bill_and_payment(bill_id: str, pay_id: str) -> bool`\nصحت شناسه قبض و شناسه پرداخت سازمان‌های خدماتی (برق، آب، گاز و تلفن) را به همراه رقم کنترل بررسی می‌کند.\n\n### `extract_bill_details(bill_id: str, pay_id: str) -> dict`\nنوع قبض، مبلغ ریالی و دوره صدور را از روی شناسه‌های پرداخت استخراج می‌نماید.\n\n### `is_valid_plate(plate: str) -> bool`\nقالب پلاک ملی خودروهای سواری، عمومی، تاکسی، دولتی و معلولین را ارزیابی می‌کند.\n\n### `parse_plate(plate: str) -> dict`\nاجزای پلاک شامل عدد دو رقمی اول، حرف میانی، عدد سه رقمی و کد استان (ایران XX) را تفکیک می‌کند.\n\n### `detect(text: str) -> str | None`\nتشخیص خودکار نوع داده ورودی (کد ملی، موبایل، شبا، کارت، ایمیل، آدرس وب، یا آی‌پی).\n",
    "headings": [
      {
        "id": "مرجع-توابع-اعتبارسنجی-و-تطبیق-الگو-parsikit-validators",
        "text": "مرجع توابع اعتبارسنجی و تطبیق الگو (`parsikit.validators`)",
        "level": 1
      },
      {
        "id": "۱-کد-ملی-national-code",
        "text": "۱. کد ملی (National Code)",
        "level": 2
      },
      {
        "id": "is_valid_national_code-code-str-strict-bool-true-bool",
        "text": "`is_valid_national_code(code: str, strict: bool = True) -> bool`",
        "level": 3
      },
      {
        "id": "format_national_code-code-str-str",
        "text": "`format_national_code(code: str) -> str`",
        "level": 3
      },
      {
        "id": "detect_national_code_location-code-str-dict-none",
        "text": "`detect_national_code_location(code: str) -> dict | None`",
        "level": 3
      },
      {
        "id": "۲-تلفن-همراه-و-ثابت-phone-numbers",
        "text": "۲. تلفن همراه و ثابت (Phone Numbers)",
        "level": 2
      },
      {
        "id": "is_valid_mobile-phone-str-bool",
        "text": "`is_valid_mobile(phone: str) -> bool`",
        "level": 3
      },
      {
        "id": "normalize_mobile-phone-str-prefix-str-0-str",
        "text": "`normalize_mobile(phone: str, prefix: str = \"0\") -> str`",
        "level": 3
      },
      {
        "id": "detect_mobile_operator-phone-str-str-none",
        "text": "`detect_mobile_operator(phone: str) -> str | None`",
        "level": 3
      },
      {
        "id": "is_valid_landline-phone-str-bool",
        "text": "`is_valid_landline(phone: str) -> bool`",
        "level": 3
      },
      {
        "id": "detect_landline_province-phone-str-str-none",
        "text": "`detect_landline_province(phone: str) -> str | None`",
        "level": 3
      },
      {
        "id": "۳-کارت-بانکی-و-شماره-شبا-banking",
        "text": "۳. کارت بانکی و شماره شبا (Banking)",
        "level": 2
      },
      {
        "id": "is_valid_card_number-card-str-bool",
        "text": "`is_valid_card_number(card: str) -> bool`",
        "level": 3
      },
      {
        "id": "format_card_number-card-str-separator-str-str",
        "text": "`format_card_number(card: str, separator: str = \"-\") -> str`",
        "level": 3
      },
      {
        "id": "detect_bank_from_card-card-str-str-none",
        "text": "`detect_bank_from_card(card: str) -> str | None`",
        "level": 3
      },
      {
        "id": "is_valid_sheba-sheba-str-bool",
        "text": "`is_valid_sheba(sheba: str) -> bool`",
        "level": 3
      },
      {
        "id": "format_sheba-sheba-str-chunk_size-int-4-str",
        "text": "`format_sheba(sheba: str, chunk_size: int = 4) -> str`",
        "level": 3
      },
      {
        "id": "detect_bank_from_sheba-sheba-str-str-none",
        "text": "`detect_bank_from_sheba(sheba: str) -> str | None`",
        "level": 3
      },
      {
        "id": "۴-کد-پستی،-شناسه-ملی-حقوقی،-قبوض-و-پلاک-خودرو",
        "text": "۴. کد پستی، شناسه ملی حقوقی، قبوض و پلاک خودرو",
        "level": 2
      },
      {
        "id": "is_valid_postal_code-code-str-bool",
        "text": "`is_valid_postal_code(code: str) -> bool`",
        "level": 3
      },
      {
        "id": "format_postal_code-code-str-str",
        "text": "`format_postal_code(code: str) -> str`",
        "level": 3
      },
      {
        "id": "is_valid_corporate_id-corp_id-str-bool",
        "text": "`is_valid_corporate_id(corp_id: str) -> bool`",
        "level": 3
      },
      {
        "id": "is_valid_bill_and_payment-bill_id-str-pay_id-str-bool",
        "text": "`is_valid_bill_and_payment(bill_id: str, pay_id: str) -> bool`",
        "level": 3
      },
      {
        "id": "extract_bill_details-bill_id-str-pay_id-str-dict",
        "text": "`extract_bill_details(bill_id: str, pay_id: str) -> dict`",
        "level": 3
      },
      {
        "id": "is_valid_plate-plate-str-bool",
        "text": "`is_valid_plate(plate: str) -> bool`",
        "level": 3
      },
      {
        "id": "parse_plate-plate-str-dict",
        "text": "`parse_plate(plate: str) -> dict`",
        "level": 3
      },
      {
        "id": "detect-text-str-str-none",
        "text": "`detect(text: str) -> str | None`",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/fa/api/validators.md",
    "counterparts": {
      "en": "api/validators",
      "prs-af": "api/validators",
      "tg": "api/validators"
    },
    "counterpartSlug": "api/validators"
  },
  {
    "id": "fa-faq",
    "slug": "faq",
    "lang": "fa",
    "category": "getting-started",
    "title": "پرسش‌های متداول (FAQ) — پارسی‌کیت",
    "summary": "پاسخ به سوالات پرتکرار پیرامون کتابخانه پارسی‌کیت (ParsiKit).",
    "content": "# پرسش‌های متداول (FAQ) — پارسی‌کیت\n\nپاسخ به سوالات پرتکرار پیرامون کتابخانه **پارسی‌کیت (ParsiKit)**.\n\n---\n\n### ۱. پارسی‌کیت از چه نسخه‌هایی از پایتون پشتیبانی می‌کند؟\nپارسی‌کیت با پایتون **۳.۱۰ و بالاتر** سازگار است (شامل ۳.۱۰، ۳.۱۱، ۳.۱۲ و ۳.۱۳). تمامی آزمون‌ها در این نسخه‌ها به طور کامل اجرا و تایید شده‌اند.\n\n---\n\n### ۲. آیا پارسی‌کیت وابستگی خارجی (External Dependency) دارد؟\nخیر. پارسی‌کیت کاملاً **Pure Python** است و هیچ وابستگی اضافه مانند کتابخانه‌های کامپایل‌شده C، باینری یا پکیج‌های حجیم ندارد. این ویژگی باعث می‌شود که نصب آن بسیار سریع باشد و در محیط‌های سبک مانند Docker، AWS Lambda، Cloud Run و محیط‌های بدون اینترنت با کمترین حجم اجرا شود.\n\n---\n\n### ۳. تفاوت پارسی‌کیت با ابزارهایی مثل Hazm یا PersianJS چیست؟\n- **Hazm**: بیشتر بر روی پردازش زبان طبیعی (NLP)، ریشه‌یابی لغات (Stemming/Lemmatization)، تقطیع گرامری و تحلیل صرفی تمرکز دارد.\n- **ParsiKit**: یک زیرساخت نرم‌افزاری جامع (Data Infrastructure) برای سامانه‌های وب، حسابداری، بانکداری و فرم‌های ایرانی است. علاوه بر استانداردسازی متن و نیم‌فاصله‌ها، شامل اعتبارسنجی الگوریتم‌های رسمی بانکی و هویتی ایران، محاسبات مالی و مالیاتی، تقویم جلالی، مدل‌های شیءگرای سازگار با Pydantic و ابزارهای امنیتی ماسک‌گذاری داده‌ها است.\n\n---\n\n### ۴. آیا پارسی‌کیت متغیرهای حساس را لاگ می‌کند یا در خطاها نمایش می‌دهد؟\nخیر. در نسخه ۳.۳.۱ استانداردهای امنیتی تشدید شده‌اند:\n- خطاهای اعتبارسنجی مانند `InvalidCardNumberError` و `InvalidNationalCodeError` دیگر شماره کارت یا کد ملی خام را در پیام خطا چاپ نمی‌کنند.\n- اشیای دامنه مانند `BankCard`, `MobileNumber` و `NationalCode` دارای ویژگی `.masked` برای نمایش ایمن در گزارش‌ها و صفحات مدیریت هستند.\n\n---\n\n### ۵. آیا توابع پارسی‌کیت Thread-Safe هستند؟\nبله. مدیریت تنظیمات سراسری (`parsikit.config`) و سیستم کش درونی (`parsikit.cache`) با استفاده از قفل‌های بازگشتی پایتون (`threading.RLock`) در محیط‌های چندنخی (مانند Gunicorn و Uvicorn با چندین worker یا thread) کاملاً امن و پایدار هستند.\n\n---\n\n### ۶. چطور می‌توانم در توسعه پارسی‌کیت مشارکت کنم؟\nبه فایل `docs/development/contributing.md` مراجعه کنید. تمامی پیشنهادات، گزارش باگ‌ها و پول‌ریکوئست‌ها با رعایت استانداردهای تست و مستندسازی با آغوش باز پذیرفته می‌شوند.\n\n---\n\n### ۷. مجوز استفاده از پارسی‌کیت چیست؟\nپارسی‌کیت تحت مجوز آزاد و متن‌باز **MIT License** منتشر شده است. شما می‌توانید آزادانه از آن در پروژه‌های تجاری، استارتاپی، پژوهشی و متن‌باز استفاده نمایید.\n",
    "headings": [
      {
        "id": "پرسش-های-متداول-faq-پارسی-کیت",
        "text": "پرسش‌های متداول (FAQ) — پارسی‌کیت",
        "level": 1
      },
      {
        "id": "۱-پارسی-کیت-از-چه-نسخه-هایی-از-پایتون-پشتیبانی-می-کند؟",
        "text": "۱. پارسی‌کیت از چه نسخه‌هایی از پایتون پشتیبانی می‌کند؟",
        "level": 3
      },
      {
        "id": "۲-آیا-پارسی-کیت-وابستگی-خارجی-external-dependency-دارد؟",
        "text": "۲. آیا پارسی‌کیت وابستگی خارجی (External Dependency) دارد؟",
        "level": 3
      },
      {
        "id": "۳-تفاوت-پارسی-کیت-با-ابزارهایی-مثل-hazm-یا-persianjs-چیست؟",
        "text": "۳. تفاوت پارسی‌کیت با ابزارهایی مثل Hazm یا PersianJS چیست؟",
        "level": 3
      },
      {
        "id": "۴-آیا-پارسی-کیت-متغیرهای-حساس-را-لاگ-می-کند-یا-در-خطاها-نمایش-می-دهد؟",
        "text": "۴. آیا پارسی‌کیت متغیرهای حساس را لاگ می‌کند یا در خطاها نمایش می‌دهد؟",
        "level": 3
      },
      {
        "id": "۵-آیا-توابع-پارسی-کیت-thread-safe-هستند؟",
        "text": "۵. آیا توابع پارسی‌کیت Thread-Safe هستند؟",
        "level": 3
      },
      {
        "id": "۶-چطور-می-توانم-در-توسعه-پارسی-کیت-مشارکت-کنم؟",
        "text": "۶. چطور می‌توانم در توسعه پارسی‌کیت مشارکت کنم؟",
        "level": 3
      },
      {
        "id": "۷-مجوز-استفاده-از-پارسی-کیت-چیست؟",
        "text": "۷. مجوز استفاده از پارسی‌کیت چیست؟",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/fa/faq.md",
    "counterparts": {
      "en": "faq",
      "prs-af": "faq",
      "tg": "faq"
    },
    "counterpartSlug": "faq"
  },
  {
    "id": "fa-guides-forms_and_security",
    "slug": "guides/forms_and_security",
    "lang": "fa",
    "category": "guides",
    "title": "راهنمای امنیت، حریم خصوصی و مدیریت داده‌های حساس",
    "summary": "هنگام کار با اطلاعات هویتی و مالی کاربران (کد ملی، شماره کارت، شماره شبا و شماره موبایل)، رعایت نکات امنیتی از نان شب واجب‌تر است!",
    "content": "# راهنمای امنیت، حریم خصوصی و مدیریت داده‌های حساس\n\nهنگام کار با اطلاعات هویتی و مالی کاربران (کد ملی، شماره کارت، شماره شبا و شماره موبایل)، رعایت نکات امنیتی از نان شب واجب‌تر است!\n\n---\n\n## ۱. تفاوت مهم: بررسی چک‌سام در مقابل استعلام مالکیت\n\nخیلی از توسعه‌دهندگان به اشتباه فکر می‌کنند تایید فرمت ورودی معادل احراز هویت است. باید مرزهای زیر را به درستی تفکیک کنید:\n\n| مفهوم | مسئولیت پارسی‌کیت | آیا هویت را تایید می‌کند؟ |\n|---|---|---|\n| **بررسی ساختار (Syntax)** | چک کردن طول ۱۰ رقم برای کد ملی یا ۱۶ رقم برای کارت بانکی | خیر |\n| **بررسی چک‌سام (Checksum)** | اجرای فرمول ریاضی Modulo 11 کد ملی یا الگوریتم Luhn کارت | خیر |\n| **استعلام هویت (Identity Verification)** | اتصال به سامانه شاهکار (تطابق کدملی و موبایل) یا ثبت احوال | **خیر - نیازمند وب‌سرویس دولتی است** |\n| **احراز مالکیت کارت (Banking Ownership)** | استعلام نام دارنده حساب یا کارت از سوئیچ بانکی (شاپرک) | **خیر - نیازمند درگاه بانکی است** |\n\n> **نتیجه:** هرگز تنها به دلیل اینکه تابع `is_valid_national_code` مقدار `True` برمی‌گرداند، فرض نکنید کاربر هویت واقعی خود را ارائه داده است.\n\n---\n\n## ۲. محافظت از داده‌ها در لاگ‌ها و پیام‌ها با ماسک کردن\n\nهرگز شماره کارت بانکی یا کد ملی کامل کاربر را در لاگ‌های سیستمی چاپ نکنید. پارسی‌کیت ابزارهای ماسک کردن استاندارد را در اختیارتان می‌گذارد:\n\n```python\nimport logging\nimport parsikit\n\ncard = parsikit.BankCard(\"6037991122334455\")\n\n# در لاگ‌ها از پروپرتی .masked استفاده کنید:\nlogging.info(f\"Payment received from card {card.masked}\")\n# نتیجه لاگ: Payment received from card 6037-99**-****-4455\n```\n\n---\n\n## ۳. پیام‌های خطای ایمن (Safe Exceptions)\n\nدر نسخه ۳.۳.۱ پارسی‌کیت، پرتاب خطای `InvalidCardNumberError` و `InvalidNationalCodeError` دیگر شماره کارت کامل را در پیام خطا افشا نمی‌کند و مقدار نامعتبر را به صورت ماسک‌شده در متن خطا قرار می‌دهد.\n",
    "headings": [
      {
        "id": "راهنمای-امنیت،-حریم-خصوصی-و-مدیریت-داده-های-حساس",
        "text": "راهنمای امنیت، حریم خصوصی و مدیریت داده‌های حساس",
        "level": 1
      },
      {
        "id": "۱-تفاوت-مهم-بررسی-چک-سام-در-مقابل-استعلام-مالکیت",
        "text": "۱. تفاوت مهم: بررسی چک‌سام در مقابل استعلام مالکیت",
        "level": 2
      },
      {
        "id": "۲-محافظت-از-داده-ها-در-لاگ-ها-و-پیام-ها-با-ماسک-کردن",
        "text": "۲. محافظت از داده‌ها در لاگ‌ها و پیام‌ها با ماسک کردن",
        "level": 2
      },
      {
        "id": "در-لاگ-ها-از-پروپرتی-masked-استفاده-کنید",
        "text": "در لاگ‌ها از پروپرتی .masked استفاده کنید:",
        "level": 1
      },
      {
        "id": "نتیجه-لاگ-payment-received-from-card-6037-99-4455",
        "text": "نتیجه لاگ: Payment received from card 6037-99**-****-4455",
        "level": 1
      },
      {
        "id": "۳-پیام-های-خطای-ایمن-safe-exceptions",
        "text": "۳. پیام‌های خطای ایمن (Safe Exceptions)",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/fa/guides/forms_and_security.md",
    "counterparts": {
      "en": "guides/forms_and_security",
      "prs-af": "guides/forms_and_security",
      "tg": "guides/forms_and_security"
    },
    "counterpartSlug": "guides/forms_and_security"
  },
  {
    "id": "fa-guides-gui_integration",
    "slug": "guides/gui_integration",
    "lang": "fa",
    "category": "guides",
    "title": "راهنمای اتصال پارسی‌کیت به رابط‌های گرافیکی (GUI)",
    "summary": "پارسی‌کیت ماژول اختصاصی parsikit.gui را برای قالب‌بندی همزمان هنگام تایپ در فریم‌ورک‌های رابط کاربری دسکتاپ (مانند Tkinter، CustomTkinter، PyQt و PySide) ارائه می‌دهد.",
    "content": "# راهنمای اتصال پارسی‌کیت به رابط‌های گرافیکی (GUI)\n\nپارسی‌کیت ماژول اختصاصی `parsikit.gui` را برای قالب‌بندی همزمان هنگام تایپ در فریم‌ورک‌های رابط کاربری دسکتاپ (مانند Tkinter، CustomTkinter، PyQt و PySide) ارائه می‌دهد.\n\n---\n\n## ۱. استفاده در Tkinter و CustomTkinter\n\nتابع `bind_persian_input` به رویداد رها کردن کلید (`<KeyRelease>`) متصل شده و فرمت ورودی را بلادرنگ اصلاح می‌کند:\n\n```python\nimport tkinter as tk\nimport parsikit\n\nroot = tk.Tk()\nroot.title(\"سامانه فرمت‌بندی هوشمند\")\n\nlabel = tk.Label(root, text=\"کد ملی:\")\nlabel.pack()\n\nentry_national_code = tk.Entry(root)\nentry_national_code.pack()\n\n# اتصال فرمت خودکار کد ملی (XXX-XXXXXX-X)\nparsikit.bind_persian_input(entry_national_code, input_type=\"national_code\")\n\ncard_label = tk.Label(root, text=\"شماره کارت بانکی:\")\ncard_label.pack()\n\nentry_card = tk.Entry(root)\nentry_card.pack()\n\n# اتصال فرمت خودکار ۴ تکه شماره کارت (XXXX-XXXX-XXXX-XXXX)\nparsikit.bind_persian_input(entry_card, input_type=\"card_number\")\n\nroot.mainloop()\n```\n\n---\n\n## ۲. استفاده در PyQt / PySide\n\nبرای ویجت‌های `QLineEdit` در کیوت:\n\n```python\nfrom PyQt5.QtWidgets import QApplication, QLineEdit, QVBoxLayout, QWidget\nimport parsikit\n\napp = QApplication([])\nwindow = QWidget()\nlayout = QVBoxLayout()\n\ncard_input = QLineEdit()\ncard_input.setPlaceholderText(\"شماره کارت ۱۶ رقمی...\")\nparsikit.bind_persian_input(card_input, input_type=\"card_number\")\n\nlayout.addWidget(card_input)\nwindow.setLayout(layout)\nwindow.show()\napp.exec_()\n```\n\n---\n\n## انواع فیلدهای پشتیبانی شده در `bind_persian_input`:\n- `\"text\"`: زیباسازی و استانداردسازی فاصله‌های متن فارسی\n- `\"national_code\"`: قالب ۳-۶-۱ کد ملی\n- `\"card_number\"`: قالب ۴ تکه‌ای شماره کارت بانکی\n- `\"postal_code\"`: قالب ۵-۵ کد پستی (`XXXXX-XXXXX`)\n- `\"sheba\"`: قالب استاندارد شماره شبا با پیشوند `IR` و فواصل ۴ تایی\n",
    "headings": [
      {
        "id": "راهنمای-اتصال-پارسی-کیت-به-رابط-های-گرافیکی-gui",
        "text": "راهنمای اتصال پارسی‌کیت به رابط‌های گرافیکی (GUI)",
        "level": 1
      },
      {
        "id": "۱-استفاده-در-tkinter-و-customtkinter",
        "text": "۱. استفاده در Tkinter و CustomTkinter",
        "level": 2
      },
      {
        "id": "اتصال-فرمت-خودکار-کد-ملی-xxx-xxxxxx-x",
        "text": "اتصال فرمت خودکار کد ملی (XXX-XXXXXX-X)",
        "level": 1
      },
      {
        "id": "اتصال-فرمت-خودکار-۴-تکه-شماره-کارت-xxxx-xxxx-xxxx-xxxx",
        "text": "اتصال فرمت خودکار ۴ تکه شماره کارت (XXXX-XXXX-XXXX-XXXX)",
        "level": 1
      },
      {
        "id": "۲-استفاده-در-pyqt-pyside",
        "text": "۲. استفاده در PyQt / PySide",
        "level": 2
      },
      {
        "id": "انواع-فیلدهای-پشتیبانی-شده-در-bind_persian_input",
        "text": "انواع فیلدهای پشتیبانی شده در `bind_persian_input`:",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/fa/guides/gui_integration.md",
    "counterparts": {
      "en": "guides/gui_integration"
    },
    "counterpartSlug": "guides/gui_integration"
  },
  {
    "id": "fa-guides-web_backends",
    "slug": "guides/web_backends",
    "lang": "fa",
    "category": "guides",
    "title": "راهنمای استفاده از پارسی‌کیت در وب‌سرویس‌ها (FastAPI و Django)",
    "summary": "پارسی‌کیت به لطف قابلیت duck-typing و پشتیبانی بومی از Pydantic، بهترین گزینه برای تمیزکاری و اعتبارسنجی ورودی‌ها در APIهای پایتونی است.",
    "content": "# راهنمای استفاده از پارسی‌کیت در وب‌سرویس‌ها (FastAPI و Django)\n\nپارسی‌کیت به لطف قابلیت duck-typing و پشتیبانی بومی از Pydantic، بهترین گزینه برای تمیزکاری و اعتبارسنجی ورودی‌ها در APIهای پایتونی است.\n\n---\n\n## ۱. استفاده در FastAPI با Pydantic\n\nمدل‌های پارسی‌کیت مستقیماً به عنوان نوع داده در فیلدهای Pydantic کار می‌کنند:\n\n```python\nfrom fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\nimport parsikit\n\napp = FastAPI(title=\"سامانه پرداخت ایرانی\")\n\nclass UserRegisterSchema(BaseModel):\n    name: str\n    national_code: parsikit.NationalCode\n    mobile: parsikit.MobileNumber\n    card: parsikit.BankCard\n\n@app.post(\"/register\")\ndef register_user(payload: UserRegisterSchema):\n    # تمام فیلدها در لحظه ورود اعتبارسنجی شده‌اند\n    return {\n        \"status\": \"success\",\n        \"clean_national_code\": payload.national_code.clean,\n        \"masked_card\": payload.card.masked,\n        \"bank_name\": payload.card.bank[\"name\"] if payload.card.bank else None,\n        \"mobile_international\": payload.mobile.to_international(),\n        \"operator\": payload.mobile.operator,\n    }\n```\n\nاگر کاربر کد ملی نامعتبر بفرستد، FastAPI خودکار خطای اعتبارسنجی HTTP 422 برمی‌گرداند.\n\n---\n\n## ۲. استفاده در جنگو (Django Forms & Serializers)\n\nدر فرم‌های جنگو می‌توانید در متدهای `clean_<field>` اعتبارسنجی را صدا بزنید:\n\n```python\nfrom django import forms\nfrom django.core.exceptions import ValidationError\nimport parsikit\n\nclass IranianUserProfileForm(forms.Form):\n    national_code = forms.CharField(max_length=10)\n    mobile = forms.CharField(max_length=15)\n\n    def clean_national_code(self):\n        code = self.cleaned_data[\"national_code\"]\n        if not parsikit.is_valid_national_code(code):\n            raise ValidationError(\"کد ملی وارد شده نامعتبر است.\")\n        return parsikit.NationalCode(code).clean\n\n    def clean_mobile(self):\n        phone = self.cleaned_data[\"mobile\"]\n        if not parsikit.is_valid_mobile(phone):\n            raise ValidationError(\"شماره موبایل نامعتبر است.\")\n        return parsikit.normalize_mobile(phone, prefix=\"0\")\n```\n\n---\n\n## ۳. تمیزکاری دیتای متنی قبل از ذخیره در دیتابیس\n\nقبل از ذخیره توضیحات، بیو یا نام کاربران، اجرای `clean_text` جستجوی دیتابیس را تضمین می‌کند:\n\n```python\ncleaned_title = parsikit.clean_text(user_input_title)\n```\nاین کار تمام حروف عربی «ي» و «ك» را پاکسازی کرده و نیم‌فاصله‌های استاندارد تولید می‌کند.\n",
    "headings": [
      {
        "id": "راهنمای-استفاده-از-پارسی-کیت-در-وب-سرویس-ها-fastapi-و-django",
        "text": "راهنمای استفاده از پارسی‌کیت در وب‌سرویس‌ها (FastAPI و Django)",
        "level": 1
      },
      {
        "id": "۱-استفاده-در-fastapi-با-pydantic",
        "text": "۱. استفاده در FastAPI با Pydantic",
        "level": 2
      },
      {
        "id": "تمام-فیلدها-در-لحظه-ورود-اعتبارسنجی-شده-اند",
        "text": "تمام فیلدها در لحظه ورود اعتبارسنجی شده‌اند",
        "level": 1
      },
      {
        "id": "۲-استفاده-در-جنگو-django-forms-serializers",
        "text": "۲. استفاده در جنگو (Django Forms & Serializers)",
        "level": 2
      },
      {
        "id": "۳-تمیزکاری-دیتای-متنی-قبل-از-ذخیره-در-دیتابیس",
        "text": "۳. تمیزکاری دیتای متنی قبل از ذخیره در دیتابیس",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/fa/guides/web_backends.md",
    "counterparts": {
      "en": "guides/web_backends"
    },
    "counterpartSlug": "guides/web_backends"
  },
  {
    "id": "fa-index",
    "slug": "index",
    "lang": "fa",
    "category": "getting-started",
    "title": "مستندات رسمی پارسی‌کیت (ParsiKit) نسخه ۳.۳.۱",
    "summary": "سلام توسعه‌دهنده عزیز! به مستندات رسمی کتابخانه پارسی‌کیت (ParsiKit) خوش اومدی.",
    "content": "# مستندات رسمی پارسی‌کیت (ParsiKit) نسخه ۳.۳.۱\n\nسلام توسعه‌دهنده عزیز! به مستندات رسمی کتابخانه **پارسی‌کیت (ParsiKit)** خوش اومدی.  \nاین پروژه توسط **علی کامرانی (MRThugh)** با عشق به زبان فارسی و با هدف ساخت یک ابزار استاندارد، سریع، پایدار و بدون وابستگی اضافی برای پایتون توسعه داده شده.\n\n---\n\n## پارسی‌کیت دقیقاً چیه و به چه دردی می‌خوره؟\n\nاگه تا حالا توی پایتون با دیتای فارسی سر و کله زده باشی، حتماً با این درسرها روبه‌رو شدی:\n- کاربران حرف «ي» عربی یا «ك» عربی تایپ می‌کنن و سرچ دیتابیس قفل می‌کنه.\n- نیم‌فاصله‌ها ریخته به هم، پیشوندهای «می» و پسوندهای «ها» با فاصله معمولی نوشته شدن.\n- اعداد انگلیسی و فارسی با هم قاطی شدن (مثلاً توی فاکتور یکی زده `12000` یکی زده `۱۲۰۰۰`).\n- نیاز داری فرمت شماره کارت بانکی، کد ملی، شماره شبا یا پلاک خودرو رو چک کنی و پیش‌شماره‌ها رو بشناسی.\n- میخوای تاریخ میلادی رو با دقت نجومی به تاریخ شمسی تبدیل کنی و بدونی فلان سال کبیسه هست یا نه.\n- میخوای مبالغ رو به تومان و ریال نشون بدی، ارزش افزوده حساب کنی، یا اعداد رو به حروف بنویسی («سیصد و پنجاه هزار تومان»).\n\n**پارسی‌کیت** اومده تا همه این نیازها رو توی یک بسته سبک و خالص پایتونی (Pure Python) با صفر وابستگی خارجی حل کنه.\n\n---\n\n## پارسی‌کیت چه کارهایی انجام نمی‌ده؟\n\nخیلی مهمه که بدونی محدوده کار پارسی‌کیت کجاست:\n1. **بررسی صحت ساختار و چک‌سام است، نه استعلام هویت:**  \n   وقتی تابع `is_valid_national_code` می‌گه `True`، یعنی کد ملی از نظر طول و الگوریتم ریاضی مبنای ۱۱ ثبت احوال معتبره؛ اما پارسی‌کیت وصل به وب‌سرویس ثبت‌احوال نیست که بگه این کد ملی متعلق به چه شخصیه یا آیا صاحبش در قید حیاته یا نه.\n2. **بررسی شماره کارت بانکی بر اساس الگوریتم لان (Luhn) است:**  \n   پارسی‌کیت تایید می‌کنه شماره کارت ۱۶ رقمیه، الگوریتم لان رو پاس می‌کنه و بر اساس ۶ رقم اول تشخیص می‌ده متعلق به کدوم بانکه (مثلاً بانک ملی)؛ ولی اعتبار موجودی یا مسدود بودن کارت رو بررسی نمی‌کنه.\n\n---\n\n## مسیر یادگیری مستندات\n\n- 🚀 **[راهنمای نصب (Installation)](installation.md)** — روش‌های نصب با pip یا از روی سورس.\n- ⚡ **[شروع سریع (Quickstart)](quickstart.md)** — اولین کدهای کاربردی در کمتر از ۵ دقیقه.\n- 📚 **آموزش‌های گام‌به‌گام (Tutorials):**\n  - [پردازش متن و نیم‌فاصله‌ها](tutorials/text_processing.md)\n  - [اعتبارسنجی کد ملی، موبایل، کارت و شبا](tutorials/validation.md)\n  - [کار با اعداد، مبالغ، تومان و ریال](tutorials/numbers_and_currency.md)\n  - [تاریخ شمسی، سال کبیسه و زمان نسبی](tutorials/datetime.md)\n  - [مدل‌های شیءگرا و کار با Pydantic](tutorials/models.md)\n- 🛠 **راهنماهای کاربردی (Guides):**\n  - [استفاده در بک‌اند وب (FastAPI و Django)](guides/web_backends.md)\n  - [امنیت فرم‌ها و ماسک کردن داده‌های حساس](guides/forms_and_security.md)\n  - [اتصال به رابط‌های گرافیکی (GUI)](guides/gui_integration.md)\n- 📖 **[مرجع کامل توابع (API Reference)](api/index.md)**\n- ❓ **[عیب‌یابی و سوالات متداول](faq.md)**\n",
    "headings": [
      {
        "id": "مستندات-رسمی-پارسی-کیت-parsikit-نسخه-۳-۳-۱",
        "text": "مستندات رسمی پارسی‌کیت (ParsiKit) نسخه ۳.۳.۱",
        "level": 1
      },
      {
        "id": "پارسی-کیت-دقیقاً-چیه-و-به-چه-دردی-می-خوره؟",
        "text": "پارسی‌کیت دقیقاً چیه و به چه دردی می‌خوره؟",
        "level": 2
      },
      {
        "id": "پارسی-کیت-چه-کارهایی-انجام-نمی-ده؟",
        "text": "پارسی‌کیت چه کارهایی انجام نمی‌ده؟",
        "level": 2
      },
      {
        "id": "مسیر-یادگیری-مستندات",
        "text": "مسیر یادگیری مستندات",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/fa/index.md",
    "counterparts": {
      "en": "index",
      "prs-af": "index",
      "tg": "index"
    },
    "counterpartSlug": "index"
  },
  {
    "id": "fa-installation",
    "slug": "installation",
    "lang": "fa",
    "category": "getting-started",
    "title": "راهنمای نصب و راه‌اندازی پارسی‌کیت",
    "summary": "پارسی‌کیت کاملاً با زبان پایتون خالص (Pure Python) نوشته شده و هیچ وابستگی به کتابخانه‌های سنگین خارجی مانند C-extensions ندارد. بنابراین روی هر سیستم‌عاملی (لینوکس، ویندوز، مک‌او‌اس) به راحتی و در کس",
    "content": "# راهنمای نصب و راه‌اندازی پارسی‌کیت\n\nپارسی‌کیت کاملاً با زبان پایتون خالص (Pure Python) نوشته شده و هیچ وابستگی به کتابخانه‌های سنگین خارجی مانند C-extensions ندارد. بنابراین روی هر سیستم‌عاملی (لینوکس، ویندوز، مک‌او‌اس) به راحتی و در کسری از ثانیه نصب می‌شود.\n\n---\n\n## نیازمندی‌های سیستم\n\n- پایتون **۳.۱۰** یا بالاتر (پشتیبانی رسمی از Python 3.10, 3.11, 3.12, 3.13)\n- بدون نیاز به کامپایلر C یا ابزارهای جانبی\n\n---\n\n## ۱. نصب مستقیم با pip\n\nساده‌ترین راه برای نصب آخرین نسخه پایدار از مخزن PyPI:\n\n```bash\npip install parsikit\n```\n\nیا اگر از ابزارهایی مثل Poetry یا uv استفاده می‌کنی:\n\n```bash\n# با استفاده از poetry\npoetry add parsikit\n\n# با استفاده از uv\nuv add parsikit\n```\n\n---\n\n## ۲. نصب از سورس پروژه (GitHub)\n\nاگر می‌خواهی آخرین تغییرات توسعه یا نسخه مخزن را نصب کنی:\n\n```bash\ngit clone https://github.com/MRThugh/ParsiKit.git\ncd ParsiKit\npip install .\n```\n\nبرای نصب در حالت توسعه و ادیت همزمان (Editable Mode):\n\n```bash\npip install -e .\n```\n\n---\n\n## تست نصب در پایتون\n\nبرای اطمینان از اینکه پارسی‌کیت درست نصب شده، ترمینال یا محیط تعاملی پایتون رو باز کن و این دو خط رو اجرا کن:\n\n```python\nimport parsikit\n\nprint(parsikit.__version__)\n# خروجی باید 3.3.1 باشد\n```\n\nاگر بدون خطا نسخه چاپ شد، تبریک می‌گیم! پارسی‌کیت آماده استفاده در پروژه‌هاته.\nحالا می‌تونی به سراغ [راهنمای شروع سریع (Quickstart)](quickstart.md) بری.\n",
    "headings": [
      {
        "id": "راهنمای-نصب-و-راه-اندازی-پارسی-کیت",
        "text": "راهنمای نصب و راه‌اندازی پارسی‌کیت",
        "level": 1
      },
      {
        "id": "نیازمندی-های-سیستم",
        "text": "نیازمندی‌های سیستم",
        "level": 2
      },
      {
        "id": "۱-نصب-مستقیم-با-pip",
        "text": "۱. نصب مستقیم با pip",
        "level": 2
      },
      {
        "id": "با-استفاده-از-poetry",
        "text": "با استفاده از poetry",
        "level": 1
      },
      {
        "id": "با-استفاده-از-uv",
        "text": "با استفاده از uv",
        "level": 1
      },
      {
        "id": "۲-نصب-از-سورس-پروژه-github",
        "text": "۲. نصب از سورس پروژه (GitHub)",
        "level": 2
      },
      {
        "id": "تست-نصب-در-پایتون",
        "text": "تست نصب در پایتون",
        "level": 2
      },
      {
        "id": "خروجی-باید-3-3-1-باشد",
        "text": "خروجی باید 3.3.1 باشد",
        "level": 1
      }
    ],
    "filePath": "/app/applet/repo_data/docs/fa/installation.md",
    "counterparts": {
      "en": "installation",
      "prs-af": "installation",
      "tg": "installation"
    },
    "counterpartSlug": "installation"
  },
  {
    "id": "fa-quickstart",
    "slug": "quickstart",
    "lang": "fa",
    "category": "getting-started",
    "title": "شروع سریع با پارسی‌کیت (Quickstart)",
    "summary": "بیا با چند مثال ساده و پرکاربرد شروع کنیم تا ببینی پارسی‌کیت چقدر کارهای روزمره پایتون رو راحت‌تر می‌کنه!",
    "content": "# شروع سریع با پارسی‌کیت (Quickstart)\n\nبیا با چند مثال ساده و پرکاربرد شروع کنیم تا ببینی پارسی‌کیت چقدر کارهای روزمره پایتون رو راحت‌تر می‌کنه!\n\n---\n\n## ۱. تمیزکاری و استانداردسازی متن فارسی\n\nیکی از رایج‌ترین مشکلات، کاراکترهای عربی («ي» و «ك») و نبود نیم‌فاصله است:\n\n```python\nimport parsikit\n\ndirty_text = \"ي كافيه كتاب ها رو برداري و بيايي\"\nclean_text = parsikit.standardize_persian(dirty_text)\n\nprint(clean_text)\n# خروجی: ی کافیه کتاب‌ها رو برداری و بیایی\n```\n\nدیدید؟ هم حروف «ی» و «ک» استاندارد فارسی شدند و هم نیم‌فاصله‌های «کتاب‌ها» و «بیایی» به درستی اصلاح شدند!\n\n---\n\n## ۲. اعتبارسنجی و فرمت‌بندی کد ملی\n\nمی‌تونی از تابع سریع یا از کلاس شیءگرای `NationalCode` استفاده کنی:\n\n```python\nimport parsikit\n\n# روش تابعی:\nis_ok = parsikit.is_valid_national_code(\"7730123452\")\nprint(is_ok)  # True\n\n# روش شیءگرا:\nnc = parsikit.NationalCode(\"7730123452\")\nprint(nc.formatted)  # '773-012345-2'\nprint(nc.masked)     # '773-****45-2'\nprint(nc.clean)      # '7730123452'\n```\n\nحواست باشه اگه کد ملی نامعتبر باشه (مثلاً رقم کنترلیش نخونه یا ارقام تکراری باشه)، خطای `InvalidNationalCodeError` پرتاب می‌کنه.\n\n---\n\n## ۳. تبدیل عدد به حروف و نمایش مبالغ\n\nنمایش قیمت به تومان یا ریال با ارقام فارسی:\n\n```python\nimport parsikit\n\namount = 1250000  # تومان\n\n# تبدیل به حروف فارسی\nwords = parsikit.number_to_words(amount)\nprint(words)  # 'یک میلیون و دویست و پنجاه هزار'\n\n# فرمت مالی با ارقام فارسی\nformatted = parsikit.format_currency(amount, currency=\"toman\", persian_digits=True)\nprint(formatted)  # '۱،۲۵۰،۰۰۰ تومان'\n```\n\n---\n\n## ۴. تبدیل تاریخ میلادی به شمسی\n\n```python\nimport parsikit\n\n# تبدیل تاریخ ۶ ژوئیه ۲۰۲۶\njy, jm, jd = parsikit.gregorian_to_jalali(2026, 7, 6)\nprint(f\"{jy}/{jm}/{jd}\")  # 1405/4/15\n\n# نام ماه و سال کبیسه\nprint(parsikit.get_jalali_month_name(jm))  # 'تیر'\nprint(\"کبیسه است؟\", parsikit.is_jalali_leap(jy))  # False\n```\n\n---\n\n## ۵. زمان نسبی به زبان فارسی (Humanize)\n\n```python\nimport datetime\nimport parsikit\n\nnow = datetime.datetime.now()\npast_time = now - datetime.timedelta(minutes=5)\n\nprint(parsikit.humanize_relative_time(past_time, reference=now))\n# خروجی: '۵ دقیقه پیش'\n```\n\n---\n\n## گام بعدی چیه؟\n\nحالا که دست‌گرمی داشتی، می‌تونی آموزش‌های عمیق‌تر هر بخش رو بخونی:\n- [آموزش پردازش پیشرفته متن](tutorials/text_processing.md)\n- [آموزش کامل اعتبارسنجی‌ها (کارت بانکی، شبا، پلاک و...)](tutorials/validation.md)\n",
    "headings": [
      {
        "id": "شروع-سریع-با-پارسی-کیت-quickstart",
        "text": "شروع سریع با پارسی‌کیت (Quickstart)",
        "level": 1
      },
      {
        "id": "۱-تمیزکاری-و-استانداردسازی-متن-فارسی",
        "text": "۱. تمیزکاری و استانداردسازی متن فارسی",
        "level": 2
      },
      {
        "id": "خروجی-ی-کافیه-کتاب-ها-رو-برداری-و-بیایی",
        "text": "خروجی: ی کافیه کتاب‌ها رو برداری و بیایی",
        "level": 1
      },
      {
        "id": "۲-اعتبارسنجی-و-فرمت-بندی-کد-ملی",
        "text": "۲. اعتبارسنجی و فرمت‌بندی کد ملی",
        "level": 2
      },
      {
        "id": "روش-تابعی",
        "text": "روش تابعی:",
        "level": 1
      },
      {
        "id": "روش-شیءگرا",
        "text": "روش شیءگرا:",
        "level": 1
      },
      {
        "id": "۳-تبدیل-عدد-به-حروف-و-نمایش-مبالغ",
        "text": "۳. تبدیل عدد به حروف و نمایش مبالغ",
        "level": 2
      },
      {
        "id": "تبدیل-به-حروف-فارسی",
        "text": "تبدیل به حروف فارسی",
        "level": 1
      },
      {
        "id": "فرمت-مالی-با-ارقام-فارسی",
        "text": "فرمت مالی با ارقام فارسی",
        "level": 1
      },
      {
        "id": "۴-تبدیل-تاریخ-میلادی-به-شمسی",
        "text": "۴. تبدیل تاریخ میلادی به شمسی",
        "level": 2
      },
      {
        "id": "تبدیل-تاریخ-۶-ژوئیه-۲۰۲۶",
        "text": "تبدیل تاریخ ۶ ژوئیه ۲۰۲۶",
        "level": 1
      },
      {
        "id": "نام-ماه-و-سال-کبیسه",
        "text": "نام ماه و سال کبیسه",
        "level": 1
      },
      {
        "id": "۵-زمان-نسبی-به-زبان-فارسی-humanize",
        "text": "۵. زمان نسبی به زبان فارسی (Humanize)",
        "level": 2
      },
      {
        "id": "خروجی-۵-دقیقه-پیش",
        "text": "خروجی: '۵ دقیقه پیش'",
        "level": 1
      },
      {
        "id": "گام-بعدی-چیه؟",
        "text": "گام بعدی چیه؟",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/fa/quickstart.md",
    "counterparts": {
      "en": "quickstart",
      "prs-af": "quickstart",
      "tg": "quickstart"
    },
    "counterpartSlug": "quickstart"
  },
  {
    "id": "fa-troubleshooting",
    "slug": "troubleshooting",
    "lang": "fa",
    "category": "getting-started",
    "title": "راهنمای عیب‌یابی (Troubleshooting) پارسی‌کیت",
    "summary": "این راهنما رایج‌ترین پرسش‌ها و خطاهایی که توسعه‌دهندگان ممکن است هنگام کار با کتابخانه پارسی‌کیت با آن‌ها مواجه شوند را به همراه راه‌حل‌های قطعی توضیح می‌دهد.",
    "content": "# راهنمای عیب‌یابی (Troubleshooting) پارسی‌کیت\n\nاین راهنما رایج‌ترین پرسش‌ها و خطاهایی که توسعه‌دهندگان ممکن است هنگام کار با کتابخانه پارسی‌کیت با آن‌ها مواجه شوند را به همراه راه‌حل‌های قطعی توضیح می‌دهد.\n\n---\n\n## ۱. خطای `SyntaxError` هنگام اجرا در پایتون ۳.۱۰ یا ۳.۱۱\n\n### علت\nدر نسخه‌های پایتون قبل از ۳.۱۲، استفاده از بک‌اسلش (`\\`) درون بخش عبارات f-string غیرمجاز بود (طبق مشخصه PEP 701 که در پایتون ۳.۱۲ اضافه شد). در نسخه v3.3.0 پارسی‌کیت یک مورد در `parsikit.dev.debug_text` وجود داشت که باعث می‌شد پایتون‌های ۳.۱۰ و ۳.۱۱ نتوانند پکیج را ایمپورت کنند.\n\n### راه‌حل در نسخه ۳.۳.۱\nاین مشکل در نسخه ۳.۳.۱ به طور کامل رفع شده است. برای حل مشکل، پارسی‌کیت را به نسخه ۳.۳.۱ ارتقا دهید:\n```bash\npip install --upgrade parsikit\n```\n\n---\n\n## ۲. اعداد در خروجی یا ترمینال به شکل علامت سوال یا کاراکترهای عجیب نمایش داده می‌شوند\n\n### علت\nترمینال یا شبیه‌ساز کنسول شما از کدگذاری UTF-8 پشتیبانی نمی‌کند یا متغیر محیطی `PYTHONIOENCODING` به صورت پیش‌فرض روی `ascii` تنظیم شده است (به‌خصوص در ویندوزهای قدیمی).\n\n### راه‌حل\nمتغیر محیطی UTF-8 را در ابتدای اجرای اسکریپت یا در تنظیمات محیط تنظیم کنید:\n\nدر لینوکس/مک:\n```bash\nexport PYTHONIOENCODING=utf-8\n```\n\nدر پاورشل ویندوز:\n```powershell\n$env:PYTHONIOENCODING=\"utf-8\"\n[Console]::OutputEncoding = [System.Text.Encoding]::UTF8\n```\n\nدر ابتدای کد پایتون:\n```python\nimport sys\nif sys.stdout.encoding != \"utf-8\":\n    import io\n    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding=\"utf-8\")\n```\n\n---\n\n## ۳. خطای `InvalidNationalCodeError` برای کدهایی که ۱۰ رقم دارند\n\n### علت\nصرف ۱۰ رقمی بودن برای معتبر بودن کد ملی کافی نیست. کدهای ملی ایران دارای شرایط زیر هستند:\n1. ارقام تکراری پشت سر هم نامعتبرند (مثل `1111111111` یا `0000000000`).\n2. رقم دهم باید با الگوریتم باقیمانده مجموع حاصل‌ضرب ضرایب ارقام بر ۱۱ (چک‌سام ثبت احوال) مطابقت داشته باشد.\n\n### مثال و بررسی\n```python\nimport parsikit\n\n# کد تستی با رقم کنترل نادرست خطا می‌دهد:\ntry:\n    nc = parsikit.NationalCode(\"0010123451\")\nexcept parsikit.InvalidNationalCodeError as e:\n    print(f\"کد نامعتبر است: {e}\")\n\n# اما اگر کد کنترل صحیح باشد (برای پیش‌شماره 001012345 رقم کنترل 8 است):\nnc = parsikit.NationalCode(\"0010123458\")\nprint(nc.is_valid)  # True\nprint(nc.location)  # {'province': 'تهران', 'city': 'تهران مرکزی'}\n```\n\n---\n\n## ۴. به‌هم‌ریختگی نیم‌فاصله‌ها در رندر گرافیکی (PIL / OpenCV / ReportLab / Matplotlib)\n\n### علت\nموتورهای گرافیکی پایتون به صورت پیش‌فرض از الگوریتم دوجهته یونیکد (BiDi) و شکل‌گیری حروف متصل عربی/فارسی پشتیبانی نمی‌کنند؛ در نتیجه حروف فارسی به صورت جدا از هم و از چپ به راست رسم می‌شوند.\n\n### راه‌حل\nاز ماژول بازآرایی (`parsikit.reshaper`) استفاده کنید:\n```python\nimport parsikit\n\nraw_text = \"پردازش متن فارسی\"\nreshaped_text = parsikit.reshape_for_graphics(raw_text)\n\n# اکنون متن آماده ارسال به موتور رسم تصویر یا PDF است:\n# draw.text((x, y), reshaped_text, font=font)\n```\n\nاگر متن شما چندخطی است، از `reshape_paragraph_for_graphics` با تعیین حداکثر طول سطر استفاده کنید.\n\n---\n\n## ۵. اختلاف یک روز در تاریخ اسفند یا سال‌های کبیسه جلالی\n\n### علت\nدر تقویم هجری شمسی، سال‌های کبیسه بر اساس دوره‌های نجومی ۳۳ ساله و ۲۸ ساله تعیین می‌شوند و سال ۳۶۶ روزه است (روز ۳۰ اسفند معتبر است). در نسخه‌های پیش از ۳.۳.۱ فرمول کبیسه در برخی سال‌ها جابه‌جا محاسبه می‌شد.\n\n### راه‌حل در نسخه ۳.۳.۱\nدر نسخه ۳.۳.۱ تابع `is_jalali_leap` با محاسبات تقویم نجومی و الگوریتم خورشیدی هماهنگ شده است:\n```python\nimport parsikit\n\nprint(parsikit.is_jalali_leap(1399))  # True (کبیسه)\nprint(parsikit.is_jalali_leap(1400))  # False (۳۶۵ روزه)\nprint(parsikit.is_jalali_leap(1403))  # True (کبیسه)\nprint(parsikit.is_jalali_leap(1404))  # False (۳۶۵ روزه)\n```\n\n---\n\n## ۶. ماسک کردن مقادیر بسیار کوتاه یا نامعتبر\n\n### سوال\nاگر رشته ورودی به توابع `mask_mobile` یا `mask_card` کمتر از طول استاندارد باشد، چه اتفاقی می‌افتد؟\n\n### پاسخ\nدر نسخه ۳.۳.۱، توابع ماسک‌گذاری به شکل ایمن عمل می‌کنند؛ اگر ورودی کوتاه‌تر از آن باشد که بخش میانی آن ماسک شود، مقدار به شکل ستاره‌دار برگردانده می‌شود تا هیچ داده حساسی در لاگ‌ها افشا نگردد.\n\n```python\nimport parsikit\n\nprint(parsikit.mask_mobile(\"0912\"))  # '****'\nprint(parsikit.mask_card(\"6037\"))    # '****'\n```\n",
    "headings": [
      {
        "id": "راهنمای-عیب-یابی-troubleshooting-پارسی-کیت",
        "text": "راهنمای عیب‌یابی (Troubleshooting) پارسی‌کیت",
        "level": 1
      },
      {
        "id": "۱-خطای-syntaxerror-هنگام-اجرا-در-پایتون-۳-۱۰-یا-۳-۱۱",
        "text": "۱. خطای `SyntaxError` هنگام اجرا در پایتون ۳.۱۰ یا ۳.۱۱",
        "level": 2
      },
      {
        "id": "علت",
        "text": "علت",
        "level": 3
      },
      {
        "id": "راه-حل-در-نسخه-۳-۳-۱",
        "text": "راه‌حل در نسخه ۳.۳.۱",
        "level": 3
      },
      {
        "id": "۲-اعداد-در-خروجی-یا-ترمینال-به-شکل-علامت-سوال-یا-کاراکترهای-عجیب-نمایش-داده-می-شوند",
        "text": "۲. اعداد در خروجی یا ترمینال به شکل علامت سوال یا کاراکترهای عجیب نمایش داده می‌شوند",
        "level": 2
      },
      {
        "id": "علت",
        "text": "علت",
        "level": 3
      },
      {
        "id": "راه-حل",
        "text": "راه‌حل",
        "level": 3
      },
      {
        "id": "۳-خطای-invalidnationalcodeerror-برای-کدهایی-که-۱۰-رقم-دارند",
        "text": "۳. خطای `InvalidNationalCodeError` برای کدهایی که ۱۰ رقم دارند",
        "level": 2
      },
      {
        "id": "علت",
        "text": "علت",
        "level": 3
      },
      {
        "id": "مثال-و-بررسی",
        "text": "مثال و بررسی",
        "level": 3
      },
      {
        "id": "کد-تستی-با-رقم-کنترل-نادرست-خطا-می-دهد",
        "text": "کد تستی با رقم کنترل نادرست خطا می‌دهد:",
        "level": 1
      },
      {
        "id": "اما-اگر-کد-کنترل-صحیح-باشد-برای-پیش-شماره-001012345-رقم-کنترل-8-است",
        "text": "اما اگر کد کنترل صحیح باشد (برای پیش‌شماره 001012345 رقم کنترل 8 است):",
        "level": 1
      },
      {
        "id": "۴-به-هم-ریختگی-نیم-فاصله-ها-در-رندر-گرافیکی-pil-opencv-reportlab-matplotlib",
        "text": "۴. به‌هم‌ریختگی نیم‌فاصله‌ها در رندر گرافیکی (PIL / OpenCV / ReportLab / Matplotlib)",
        "level": 2
      },
      {
        "id": "علت",
        "text": "علت",
        "level": 3
      },
      {
        "id": "راه-حل",
        "text": "راه‌حل",
        "level": 3
      },
      {
        "id": "اکنون-متن-آماده-ارسال-به-موتور-رسم-تصویر-یا-pdf-است",
        "text": "اکنون متن آماده ارسال به موتور رسم تصویر یا PDF است:",
        "level": 1
      },
      {
        "id": "draw-text-x-y-reshaped_text-font-font",
        "text": "draw.text((x, y), reshaped_text, font=font)",
        "level": 1
      },
      {
        "id": "۵-اختلاف-یک-روز-در-تاریخ-اسفند-یا-سال-های-کبیسه-جلالی",
        "text": "۵. اختلاف یک روز در تاریخ اسفند یا سال‌های کبیسه جلالی",
        "level": 2
      },
      {
        "id": "علت",
        "text": "علت",
        "level": 3
      },
      {
        "id": "راه-حل-در-نسخه-۳-۳-۱",
        "text": "راه‌حل در نسخه ۳.۳.۱",
        "level": 3
      },
      {
        "id": "۶-ماسک-کردن-مقادیر-بسیار-کوتاه-یا-نامعتبر",
        "text": "۶. ماسک کردن مقادیر بسیار کوتاه یا نامعتبر",
        "level": 2
      },
      {
        "id": "سوال",
        "text": "سوال",
        "level": 3
      },
      {
        "id": "پاسخ",
        "text": "پاسخ",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/fa/troubleshooting.md",
    "counterparts": {
      "en": "troubleshooting",
      "prs-af": "troubleshooting",
      "tg": "troubleshooting"
    },
    "counterpartSlug": "troubleshooting"
  },
  {
    "id": "fa-tutorials-datetime",
    "slug": "tutorials/datetime",
    "lang": "fa",
    "category": "tutorials",
    "title": "آموزش تقویم شمسی (جلالی) و زمان نسبی در پارسی‌کیت",
    "summary": "ماژول parsikit.datetime تبدیل تاریخ میلادی و شمسی را بدون نیاز به هیچ پکیج سنگینی به صورت صفر-وابستگی (Zero-Dependency) با الگوریتم دقیق ۳۳ ساله جلالی در اختیارت قرار می‌ده.",
    "content": "# آموزش تقویم شمسی (جلالی) و زمان نسبی در پارسی‌کیت\n\nماژول `parsikit.datetime` تبدیل تاریخ میلادی و شمسی را بدون نیاز به هیچ پکیج سنگینی به صورت صفر-وابستگی (Zero-Dependency) با الگوریتم دقیق ۳۳ ساله جلالی در اختیارت قرار می‌ده.\n\n---\n\n## ۱. تبدیل میلادی به شمسی (`gregorian_to_jalali`)\n\nورودی: سال، ماه، روز میلادی.  \nخروجی: تاپل سه‌تایی `(jy, jm, jd)` سال، ماه و روز شمسی.\n\n```python\nimport parsikit\n\njy, jm, jd = parsikit.gregorian_to_jalali(2026, 7, 6)\nprint(f\"تاریخ شمسی: {jy}/{jm}/{jd}\")\n# خروجی: 1405/4/15\n```\n\n---\n\n## ۲. تبدیل شمسی به میلادی (`jalali_to_gregorian`)\n\n```python\ngy, gm, gd = parsikit.jalali_to_gregorian(1405, 4, 15)\nprint(f\"تاریخ میلادی: {gy}-{gm:02d}-{gd:02d}\")\n# خروجی: 2026-07-06\n```\n\nتمام تبدیلات در بازه بیش از ۱۰۰ سال تست شده و کاملاً با تقویم رسمی مطابقت دارد.\n\n---\n\n## ۳. فرمت‌بندی تاریخ شمسی (`format_jalali`)\n\nمی‌تونی الگوهای مختلفی مثل `YYYY/MM/DD` یا `YYYY-MM-DD` بسازی:\n\n```python\n# الگوهای مختلف\nprint(parsikit.format_jalali(1403, 1, 5, pattern=\"YYYY/MM/DD\"))  # '1403/01/05'\nprint(parsikit.format_jalali(1403, 1, 5, pattern=\"YYYY-MM-DD\"))  # '1403-01-05'\nprint(parsikit.format_jalali(1403, 12, 29, pattern=\"DD/MM/YYYY\")) # '29/12/1403'\n```\n\n---\n\n## ۴. نام ماه‌های شمسی (`get_jalali_month_name`)\n\n```python\nprint(parsikit.get_jalali_month_name(1))   # 'فروردین'\nprint(parsikit.get_jalali_month_name(7))   # 'مهر'\nprint(parsikit.get_jalali_month_name(12))  # 'اسفند'\n```\n\n---\n\n## ۵. تشخیص سال کبیسه جلالی (`is_jalali_leap`)\n\nسال کبیسه سالی است که اسفند ۳۰ روزه بوده و طول کل سال ۳۶۶ روز است:\n\n```python\nprint(parsikit.is_jalali_leap(1399))  # True\nprint(parsikit.is_jalali_leap(1400))  # False\nprint(parsikit.is_jalali_leap(1403))  # True\nprint(parsikit.is_jalali_leap(1404))  # False\nprint(parsikit.is_jalali_leap(1408))  # True\n```\n\n---\n\n## ۶. زمان نسبی به زبان فارسی (`humanize_relative_time`)\n\nنمایش اختلاف زمان شبیه شبکه‌های اجتماعی («هم‌اکنون»، «۵ دقیقه پیش»، «دیروز»، «۱ سال قبل»):\n\n```python\nimport datetime\n\nnow = datetime.datetime.now()\n\n# ۵ ثانیه قبل\nprint(parsikit.humanize_relative_time(now - datetime.timedelta(seconds=5), reference=now))\n# 'هم‌اکنون'\n\n# ۵ دقیقه قبل (با ارقام فارسی)\nprint(parsikit.humanize_relative_time(now - datetime.timedelta(minutes=5), reference=now))\n# '۵ دقیقه پیش'\n\n# ۳ ساعت قبل\nprint(parsikit.humanize_relative_time(now - datetime.timedelta(hours=3), reference=now))\n# '۳ ساعت پیش'\n\n# دیروز\nprint(parsikit.humanize_relative_time(now - datetime.timedelta(days=1), reference=now))\n# 'دیروز'\n\n# ۵ روز قبل\nprint(parsikit.humanize_relative_time(now - datetime.timedelta(days=5), reference=now))\n# '۵ روز پیش'\n```\nاگر پارامتر `reference` را پاس ندهی، به صورت پیش‌فرض از `datetime.datetime.now()` استفاده می‌شود.\n",
    "headings": [
      {
        "id": "آموزش-تقویم-شمسی-جلالی-و-زمان-نسبی-در-پارسی-کیت",
        "text": "آموزش تقویم شمسی (جلالی) و زمان نسبی در پارسی‌کیت",
        "level": 1
      },
      {
        "id": "۱-تبدیل-میلادی-به-شمسی-gregorian_to_jalali",
        "text": "۱. تبدیل میلادی به شمسی (`gregorian_to_jalali`)",
        "level": 2
      },
      {
        "id": "خروجی-1405-4-15",
        "text": "خروجی: 1405/4/15",
        "level": 1
      },
      {
        "id": "۲-تبدیل-شمسی-به-میلادی-jalali_to_gregorian",
        "text": "۲. تبدیل شمسی به میلادی (`jalali_to_gregorian`)",
        "level": 2
      },
      {
        "id": "خروجی-2026-07-06",
        "text": "خروجی: 2026-07-06",
        "level": 1
      },
      {
        "id": "۳-فرمت-بندی-تاریخ-شمسی-format_jalali",
        "text": "۳. فرمت‌بندی تاریخ شمسی (`format_jalali`)",
        "level": 2
      },
      {
        "id": "الگوهای-مختلف",
        "text": "الگوهای مختلف",
        "level": 1
      },
      {
        "id": "۴-نام-ماه-های-شمسی-get_jalali_month_name",
        "text": "۴. نام ماه‌های شمسی (`get_jalali_month_name`)",
        "level": 2
      },
      {
        "id": "۵-تشخیص-سال-کبیسه-جلالی-is_jalali_leap",
        "text": "۵. تشخیص سال کبیسه جلالی (`is_jalali_leap`)",
        "level": 2
      },
      {
        "id": "۶-زمان-نسبی-به-زبان-فارسی-humanize_relative_time",
        "text": "۶. زمان نسبی به زبان فارسی (`humanize_relative_time`)",
        "level": 2
      },
      {
        "id": "۵-ثانیه-قبل",
        "text": "۵ ثانیه قبل",
        "level": 1
      },
      {
        "id": "هم-اکنون",
        "text": "'هم‌اکنون'",
        "level": 1
      },
      {
        "id": "۵-دقیقه-قبل-با-ارقام-فارسی",
        "text": "۵ دقیقه قبل (با ارقام فارسی)",
        "level": 1
      },
      {
        "id": "۵-دقیقه-پیش",
        "text": "'۵ دقیقه پیش'",
        "level": 1
      },
      {
        "id": "۳-ساعت-قبل",
        "text": "۳ ساعت قبل",
        "level": 1
      },
      {
        "id": "۳-ساعت-پیش",
        "text": "'۳ ساعت پیش'",
        "level": 1
      },
      {
        "id": "دیروز",
        "text": "دیروز",
        "level": 1
      },
      {
        "id": "دیروز",
        "text": "'دیروز'",
        "level": 1
      },
      {
        "id": "۵-روز-قبل",
        "text": "۵ روز قبل",
        "level": 1
      },
      {
        "id": "۵-روز-پیش",
        "text": "'۵ روز پیش'",
        "level": 1
      }
    ],
    "filePath": "/app/applet/repo_data/docs/fa/tutorials/datetime.md",
    "counterparts": {
      "en": "tutorials/datetime",
      "prs-af": "tutorials/datetime",
      "tg": "tutorials/datetime"
    },
    "counterpartSlug": "tutorials/datetime"
  },
  {
    "id": "fa-tutorials-models",
    "slug": "tutorials/models",
    "lang": "fa",
    "category": "tutorials",
    "title": "آموزش مدل‌های شیءگرا در پارسی‌کیت (Domain Models)",
    "summary": "در کنار توابع مستقل، پارسی‌کیت مجموعه‌ای از کلاس‌های غنی شیءگرا (OOP Domain Models) در ماژول parsikit.models فراهم کرده تا توسعه‌دهنده‌ها بتونن با موجودیت‌های دیتایی به راحتی کار کنند.",
    "content": "# آموزش مدل‌های شیءگرا در پارسی‌کیت (Domain Models)\n\nدر کنار توابع مستقل، پارسی‌کیت مجموعه‌ای از کلاس‌های غنی شیءگرا (OOP Domain Models) در ماژول `parsikit.models` فراهم کرده تا توسعه‌دهنده‌ها بتونن با موجودیت‌های دیتایی به راحتی کار کنند.\n\n---\n\n## ویژگی‌های مشترک تمام مدل‌ها\n\nهمه مدل‌های پارسی‌کیت از دو Mixin قدرتمند ارث‌بری می‌کنند:\n1. **`StringLikeMixin` (شبه‌رشته):**  \n   می‌تونی با شیء درست مثل یک رشته پایتون رفتار کنی (`len(obj)`، برش با اسلایس `obj[:3]`، چک کردن برابری با استرینگ `obj == \"...\"` و استفاده به عنوان کلید دیکشنری).\n2. **`PydanticValidationMixin`:**  \n   بدون هیچ کار اضافی، می‌تونی از این مدل‌ها به عنوان نوع فیلد در اسکیماهای Pydantic v2 (مثلاً در FastAPI) استفاده کنی.\n3. **متد `to_dict()`:**  \n   تمام اطلاعات و فراداده‌های مدل را به صورت یک دیکشنری ساخت‌یافته خروجی می‌دهد.\n\n---\n\n## ۱. مدل متن فارسی (`PersianText`)\n\nیک رشته متن فارسی که متدهای زنجیره‌ای (Chained Methods) برای پاک‌سازی روی خودش دارد:\n\n```python\nimport parsikit\n\ntext = parsikit.PersianText(\"ي كافيه كتاب ها رو برداري\")\nclean = text.standardize().beautify()\nprint(clean)\n# 'ی کافیه کتاب‌ها رو برداری'\n\n# اتصال به رشته‌های دیگر\ncombined = text + \" و جهان\"\nprint(type(combined))  # <class 'parsikit.models.PersianText'>\n\n# تبدیل متن عددی به عدد\nprice_text = parsikit.PersianText(\"سه میلیارد و پانصد میلیون\")\nprint(price_text.to_number())  # 3500000000\n```\n\n---\n\n## ۲. مدل کد ملی (`NationalCode`)\n\n```python\nimport parsikit\n\n# ساخت شیء با اعتبارسنجی پیش‌فرض (strict=True)\nnc = parsikit.NationalCode(\"7730123452\")\n\nprint(nc.clean)      # '7730123452'\nprint(nc.formatted)  # '773-012345-2'\nprint(nc.masked)     # '773-****45-2'\nprint(nc.is_valid)   # True\nprint(len(nc))       # 10\nprint(nc.location)   # {'province': 'فارس', 'city': ...}\n\n# رفتار دقیقاً شبیه رشته پایتون\nprint(nc == \"7730123452\")  # True\n\n# خروجی دیکشنری\nprint(nc.to_dict())\n```\n\nاگر کد ملی نامعتبر باشد و `strict=True` باشد، خطای `InvalidNationalCodeError` پرتاب می‌شود. با `strict=False` می‌توانید خطای اعتبارسنجی را بدون Exception ثبت کنید:\n```python\nnc_loose = parsikit.NationalCode(\"1111111111\", strict=False)\nprint(nc_loose.is_valid)  # False\n```\n\n---\n\n## ۳. مدل شماره موبایل (`MobileNumber`)\n\n```python\nmob = parsikit.MobileNumber(\"+98۹۱۲۳۴۵۶۷۸۹\")\n\nprint(mob.to_national())       # '09123456789'\nprint(mob.to_international())  # '+989123456789'\nprint(mob.operator)            # 'MCI'\nprint(mob.masked)              # '0912***6789'\n```\n\n---\n\n## ۴. مدل تلفن ثابت (`FixedLine`)\n\n```python\nfixed = parsikit.FixedLine(\"02188888888\")\n\nprint(fixed.province)   # 'تهران'\nprint(fixed.area_code)  # '021'\nprint(fixed.to_national())  # '02188888888'\n```\n\n---\n\n## ۵. مدل کارت بانکی (`BankCard`)\n\n```python\ncard = parsikit.BankCard(\"6037991122334455\")\n\nprint(card.formatted)  # '6037-9911-2233-4455'\nprint(card.masked)     # '6037-99**-****-4455'\nprint(card.bank)       # {'name': 'بانک ملی ایران', 'code': 'melli'}\n```\n\n---\n\n## ۶. مدل شبا (`Sheba`)\n\n```python\nsheba = parsikit.Sheba(\"IR050170000000123456789012\")\n\nprint(sheba.formatted)       # 'IR05 0170 0000 0012 3456 7890 12'\nprint(sheba.bank)            # {'name': 'بانک ملی ایران', 'code': 'melli'}\nprint(sheba.account_number)  # '123456789012'\n```\n\n---\n\n## ۷. مدل پلاک ملی خودرو (`VehiclePlate`)\n\n```python\nplate = parsikit.VehiclePlate(\"۱۲ ب ۳۴۵ ایران ۶۸\")\n\nprint(plate.province)       # 'البرز'\nprint(plate.province_code)  # '۶۸'\nprint(plate.category)       # 'شخصی'\nprint(plate.formatted)      # '۱۲ ب ۳۴۵ - ایران ۶۸'\n```\n",
    "headings": [
      {
        "id": "آموزش-مدل-های-شیءگرا-در-پارسی-کیت-domain-models",
        "text": "آموزش مدل‌های شیءگرا در پارسی‌کیت (Domain Models)",
        "level": 1
      },
      {
        "id": "ویژگی-های-مشترک-تمام-مدل-ها",
        "text": "ویژگی‌های مشترک تمام مدل‌ها",
        "level": 2
      },
      {
        "id": "۱-مدل-متن-فارسی-persiantext",
        "text": "۱. مدل متن فارسی (`PersianText`)",
        "level": 2
      },
      {
        "id": "ی-کافیه-کتاب-ها-رو-برداری",
        "text": "'ی کافیه کتاب‌ها رو برداری'",
        "level": 1
      },
      {
        "id": "اتصال-به-رشته-های-دیگر",
        "text": "اتصال به رشته‌های دیگر",
        "level": 1
      },
      {
        "id": "تبدیل-متن-عددی-به-عدد",
        "text": "تبدیل متن عددی به عدد",
        "level": 1
      },
      {
        "id": "۲-مدل-کد-ملی-nationalcode",
        "text": "۲. مدل کد ملی (`NationalCode`)",
        "level": 2
      },
      {
        "id": "ساخت-شیء-با-اعتبارسنجی-پیش-فرض-strict-true",
        "text": "ساخت شیء با اعتبارسنجی پیش‌فرض (strict=True)",
        "level": 1
      },
      {
        "id": "رفتار-دقیقاً-شبیه-رشته-پایتون",
        "text": "رفتار دقیقاً شبیه رشته پایتون",
        "level": 1
      },
      {
        "id": "خروجی-دیکشنری",
        "text": "خروجی دیکشنری",
        "level": 1
      },
      {
        "id": "۳-مدل-شماره-موبایل-mobilenumber",
        "text": "۳. مدل شماره موبایل (`MobileNumber`)",
        "level": 2
      },
      {
        "id": "۴-مدل-تلفن-ثابت-fixedline",
        "text": "۴. مدل تلفن ثابت (`FixedLine`)",
        "level": 2
      },
      {
        "id": "۵-مدل-کارت-بانکی-bankcard",
        "text": "۵. مدل کارت بانکی (`BankCard`)",
        "level": 2
      },
      {
        "id": "۶-مدل-شبا-sheba",
        "text": "۶. مدل شبا (`Sheba`)",
        "level": 2
      },
      {
        "id": "۷-مدل-پلاک-ملی-خودرو-vehicleplate",
        "text": "۷. مدل پلاک ملی خودرو (`VehiclePlate`)",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/fa/tutorials/models.md",
    "counterparts": {
      "en": "tutorials/models"
    },
    "counterpartSlug": "tutorials/models"
  },
  {
    "id": "fa-tutorials-numbers_and_currency",
    "slug": "tutorials/numbers_and_currency",
    "lang": "fa",
    "category": "tutorials",
    "title": "آموزش کار با اعداد، مبالغ مالی، تومان و ریال در پارسی‌کیت",
    "summary": "یکی از جذاب‌ترین بخش‌های پارسی‌کیت، ابزارهای مالی و تبدیل ارقام و کلمات است.",
    "content": "# آموزش کار با اعداد، مبالغ مالی، تومان و ریال در پارسی‌کیت\n\nیکی از جذاب‌ترین بخش‌های پارسی‌کیت، ابزارهای مالی و تبدیل ارقام و کلمات است.\n\n---\n\n## ۱. تبدیل ارقام انگلیسی، فارسی و عربی\n\nبرای تبدیل ارقام در هر دو جهت:\n\n```python\nimport parsikit\n\n# انگلیسی یا عربی به فارسی\nprint(parsikit.english_to_persian(\"Price: 12500 USD\"))  # 'Price: ۱۲۵۰۰ USD'\n\n# فارسی یا عربی به انگلیسی\nprint(parsikit.persian_to_english(\"قیمت: ۱۲۵۰۰ ریال\"))   # 'قیمت: 12500 ریال'\n\n# تابع دوطرفه convert_numbers\nprint(parsikit.convert_numbers(\"کد 123\", to=\"persian\"))  # 'کد ۱۲۳'\nprint(parsikit.convert_numbers(\"کد ۱۲۳\", to=\"english\"))  # 'کد 123'\n```\n\n---\n\n## ۲. تبدیل عدد به حروف فارسی (`number_to_words`)\n\nپارسی‌کیت از اعداد منفی تا مقادیر نجومی (تا ۹۹۹ سپتیلیون) را به نوشتار سلیس فارسی تبدیل می‌کند:\n\n```python\nprint(parsikit.number_to_words(0))           # 'صفر'\nprint(parsikit.number_to_words(14))          # 'چهارده'\nprint(parsikit.number_to_words(12500))       # 'دوازده هزار و پانصد'\nprint(parsikit.number_to_words(1500000000))  # 'یک میلیارد و پانصد میلیون'\nprint(parsikit.number_to_words(-45))         # 'منفی چهل و پنج'\n```\n\n---\n\n## ۳. تبدیل حروف فارسی به عدد (`words_to_number`)\n\nکاربر تایپ کرده «سی و دو هزار و پانصد» و می‌خواهی آن را به عدد `32500` در دیتابیس ذخیره کنی:\n\n```python\nnum = parsikit.words_to_number(\"سی و دو هزار و پانصد\")\nprint(num)  # 32500\n\nnum2 = parsikit.words_to_number(\"یک میلیون و دویست هزار\")\nprint(num2)  # 1200000\n\nneg = parsikit.words_to_number(\"منفی پانزده\")\nprint(neg)  # -15\n```\n\n---\n\n## ۴. کار با ارزهای تومان و ریال\n\n### تبدیل تومان و ریال\n```python\ntoman = 50000\nrial = parsikit.toman_to_rial(toman)\nprint(rial)  # 500000\n\nback_to_toman = parsikit.rial_to_toman(rial)\nprint(back_to_toman)  # 50000\n```\n\n### فرمت‌بندی مبالغ (`format_currency`)\n```python\nprice = 12500000\n\n# با ارقام انگلیسی و لیبل تومان\nprint(parsikit.format_currency(price, \"toman\"))\n# '12,500,000 تومان'\n\n# با ارقام و جداکننده هزارگان فارسی (،)\nprint(parsikit.format_currency(price, \"toman\", persian_digits=True))\n# '۱۲،۵۰۰،۰۰۰ تومان'\n\n# با ریال\nprint(parsikit.format_currency(parsikit.toman_to_rial(price), \"rial\", persian_digits=True))\n# '۱۲۵،۰۰۰،۰۰۰ ریال'\n```\n\n### تبدیل مبلغ به حروف با نام ارز (`format_currency_to_words`)\n```python\nprint(parsikit.format_currency_to_words(1250000, \"toman\"))\n# 'یک میلیون و دویست و پنجاه هزار تومان'\n```\n\n---\n\n## ۵. محاسبات مالی (مالیات بر ارزش افزوده و اقساط وام)\n\n### محاسبه مالیات و عوارض (VAT)\nبه طور پیش‌فرض نرخ مالیات ۱۰٪ در نظر گرفته می‌شود:\n```python\ntotal = parsikit.add_tax_and_toll(100000)\nprint(total)  # 110000\n\n# با نرخ دلخواه (مثلاً ۹٪)\ntotal_custom = parsikit.add_tax_and_toll(100000, tax_rate=0.09)\nprint(total_custom)  # 109000\n```\n\n### محاسبه قسط وام (`calculate_installments`)\nفرمول استهلاک استاندارد بانکی برای محاسبه قسط ماهانه:\n```python\nprincipal = 100_000_000   # اصل مبلغ وام: ۱۰۰ میلیون تومان\nannual_rate = 18.0        # سود سالانه: ۱۸ درصد\nmonths = 12               # مدت بازپرداخت: ۱۲ ماه\n\ninstallment = parsikit.calculate_installments(principal, annual_rate, months)\nprint(f\"قسط ماهانه: {parsikit.format_currency(installment, 'toman', persian_digits=True)}\")\n```\n",
    "headings": [
      {
        "id": "آموزش-کار-با-اعداد،-مبالغ-مالی،-تومان-و-ریال-در-پارسی-کیت",
        "text": "آموزش کار با اعداد، مبالغ مالی، تومان و ریال در پارسی‌کیت",
        "level": 1
      },
      {
        "id": "۱-تبدیل-ارقام-انگلیسی،-فارسی-و-عربی",
        "text": "۱. تبدیل ارقام انگلیسی، فارسی و عربی",
        "level": 2
      },
      {
        "id": "انگلیسی-یا-عربی-به-فارسی",
        "text": "انگلیسی یا عربی به فارسی",
        "level": 1
      },
      {
        "id": "فارسی-یا-عربی-به-انگلیسی",
        "text": "فارسی یا عربی به انگلیسی",
        "level": 1
      },
      {
        "id": "تابع-دوطرفه-convert_numbers",
        "text": "تابع دوطرفه convert_numbers",
        "level": 1
      },
      {
        "id": "۲-تبدیل-عدد-به-حروف-فارسی-number_to_words",
        "text": "۲. تبدیل عدد به حروف فارسی (`number_to_words`)",
        "level": 2
      },
      {
        "id": "۳-تبدیل-حروف-فارسی-به-عدد-words_to_number",
        "text": "۳. تبدیل حروف فارسی به عدد (`words_to_number`)",
        "level": 2
      },
      {
        "id": "۴-کار-با-ارزهای-تومان-و-ریال",
        "text": "۴. کار با ارزهای تومان و ریال",
        "level": 2
      },
      {
        "id": "تبدیل-تومان-و-ریال",
        "text": "تبدیل تومان و ریال",
        "level": 3
      },
      {
        "id": "فرمت-بندی-مبالغ-format_currency",
        "text": "فرمت‌بندی مبالغ (`format_currency`)",
        "level": 3
      },
      {
        "id": "با-ارقام-انگلیسی-و-لیبل-تومان",
        "text": "با ارقام انگلیسی و لیبل تومان",
        "level": 1
      },
      {
        "id": "12-500-000-تومان",
        "text": "'12,500,000 تومان'",
        "level": 1
      },
      {
        "id": "با-ارقام-و-جداکننده-هزارگان-فارسی-،",
        "text": "با ارقام و جداکننده هزارگان فارسی (،)",
        "level": 1
      },
      {
        "id": "۱۲،۵۰۰،۰۰۰-تومان",
        "text": "'۱۲،۵۰۰،۰۰۰ تومان'",
        "level": 1
      },
      {
        "id": "با-ریال",
        "text": "با ریال",
        "level": 1
      },
      {
        "id": "۱۲۵،۰۰۰،۰۰۰-ریال",
        "text": "'۱۲۵،۰۰۰،۰۰۰ ریال'",
        "level": 1
      },
      {
        "id": "تبدیل-مبلغ-به-حروف-با-نام-ارز-format_currency_to_words",
        "text": "تبدیل مبلغ به حروف با نام ارز (`format_currency_to_words`)",
        "level": 3
      },
      {
        "id": "یک-میلیون-و-دویست-و-پنجاه-هزار-تومان",
        "text": "'یک میلیون و دویست و پنجاه هزار تومان'",
        "level": 1
      },
      {
        "id": "۵-محاسبات-مالی-مالیات-بر-ارزش-افزوده-و-اقساط-وام",
        "text": "۵. محاسبات مالی (مالیات بر ارزش افزوده و اقساط وام)",
        "level": 2
      },
      {
        "id": "محاسبه-مالیات-و-عوارض-vat",
        "text": "محاسبه مالیات و عوارض (VAT)",
        "level": 3
      },
      {
        "id": "با-نرخ-دلخواه-مثلاً-۹٪",
        "text": "با نرخ دلخواه (مثلاً ۹٪)",
        "level": 1
      },
      {
        "id": "محاسبه-قسط-وام-calculate_installments",
        "text": "محاسبه قسط وام (`calculate_installments`)",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/fa/tutorials/numbers_and_currency.md",
    "counterparts": {
      "en": "tutorials/numbers_and_currency",
      "prs-af": "tutorials/numbers_and_currency",
      "tg": "tutorials/numbers_and_currency"
    },
    "counterpartSlug": "tutorials/numbers_and_currency"
  },
  {
    "id": "fa-tutorials-text_processing",
    "slug": "tutorials/text_processing",
    "lang": "fa",
    "category": "tutorials",
    "title": "آموزش جامع پردازش و تمیزکاری متن فارسی در پارسی‌کیت",
    "summary": "پردازش متن فارسی چالش‌های منحصر‌به‌فردی داره: اعراب‌ها، حروف کیبورد عربی، نیم‌فاصله‌ها و نگارش انگلیسی در کیبورد فارسی. پارسی‌کیت مجموعه‌ای از توابع کارآمد برای حل این دغدغه‌ها در اختیارت می‌ذاره.",
    "content": "# آموزش جامع پردازش و تمیزکاری متن فارسی در پارسی‌کیت\n\nپردازش متن فارسی چالش‌های منحصر‌به‌فردی داره: اعراب‌ها، حروف کیبورد عربی، نیم‌فاصله‌ها و نگارش انگلیسی در کیبورد فارسی. پارسی‌کیت مجموعه‌ای از توابع کارآمد برای حل این دغدغه‌ها در اختیارت می‌ذاره.\n\n---\n\n## ۱. استانداردسازی حروف (`standardize_persian`)\n\nاین تابع نویسه‌های عربی رو به معادل رسمی فارسی تبدیل می‌کنه:\n- «ي» و «ى» به «ی»\n- «ك» به «ک»\n- «ة» به «ه»\n- اصلاح نیم‌فاصله‌های پیشوندهای «می»، «نمی»، «بی» و پسوندهای «ها»، «تر»، «ترین»\n- حذف نیم‌فاصله‌های پشت سر هم و تکراری\n\n```python\nimport parsikit\n\nraw = \"مشتري ها ميباشد كه كتاب ها را ميخوانند\"\nclean = parsikit.standardize_persian(raw)\nprint(clean)\n# 'مشتری‌ها میباشد که کتاب‌ها را می‌خوانند'\n```\n\nهمچنین اگر خواستی اعراب‌ها (فتحه، کسره، ضمه، تنوین و...) همزمان حذف بشن:\n```python\nclean_no_vowel = parsikit.standardize_persian(\"کِتاب‌هایِ ما\", strip_diacritics_opt=True)\nprint(clean_no_vowel)  # 'کتاب‌های ما'\n```\n\n---\n\n## ۲. حذف اعراب (`strip_diacritics`)\n\nاگر فقط می‌خواهی تنوین، تشدید و حرکات رو حذف کنی بدون اینکه تغییری در بقیه متن داده بشه:\n\n```python\nclean = parsikit.strip_diacritics(\"سَلامٌ عَلَيْكُمْ وَ رَحْمَةُ اللهِ\")\nprint(clean)\n# 'سلام علیکم و رحمة الله'\n```\n\n---\n\n## ۳. اصلاح چینش اشتباه کیبورد (`correct_keyboard_layout`)\n\nحتماً تا حالا برات پیش اومده که به جای «سلام» اشتباهاً کیبورد انگلیسی بوده و نوشتی «sghl»:\n\n```python\nfixed = parsikit.correct_keyboard_layout(\"sghl nhka[,dhk uvdoc!\")\nprint(fixed)\n# 'سلام دانشجویان عزیز!'\n```\n\n---\n\n## ۴. مرتب‌سازی الفبایی فارسی (`persian_sorted` و `persian_sort_key`)\n\nپایتون به طور پیش‌فرض مرتب‌سازی رو بر اساس کد اسکی کاراکترها انجام می‌ده که باعث می‌شه حروفی مثل «گ، چ، پ، ژ» در جای اشتباهی از لیست قرار بگیرن. پارسی‌کیت وزن الفبای رسمی فارسی رو اعمال می‌کنه:\n\n```python\nwords = [\"سیب\", \"انار\", \"به\", \"پرتقال\", \"آلو\", \"چای\"]\n\n# مرتب‌سازی اشتباه پایتون پیش‌فرض:\nprint(sorted(words))\n\n# مرتب‌سازی استاندارد با پارسی‌کیت:\nsorted_words = parsikit.persian_sorted(words)\nprint(sorted_words)\n# ['آلو', 'انار', 'به', 'پرتقال', 'چای', 'سیب']\n```\n\n---\n\n## ۵. زیباسازی فاصله‌ها و علائم نگارشی (`beautify_persian_spacing`)\n\nعلامت‌های نگارشی فارسی نباید قبل خودشون فاصله داشته باشن، اما بعدشون باید دقیقاً یک فاصله باشه. این تابع پرانتزها، ویرگول، نقطه و علامت سوال رو استاندارد می‌کنه:\n\n```python\ntext = \"این یک متن است ,که با عجله تایپ شده ( بدون توجه به فاصله ) .\"\nbeautified = parsikit.beautify_persian_spacing(text)\nprint(beautified)\n# 'این یک متن است، که با عجله تایپ شده (بدون توجه به فاصله).'\n```\n\n---\n\n## ۶. تبدیل متن به نامک انگلیسی/فینگلیش (`slugify`)\n\nبرای ساختن آدرس URL تمیز در وب‌سایت‌ها:\n\n```python\nslug = parsikit.slugify(\"آموزش جامع وردپرس نسخه 6\")\nprint(slug)\n# 'amoozesh-wordpress-neskheh-6'\n```\n\nکلمات پرکاربرد مانند «آموزش»، «سایت»، «مقاله»، «نسخه» و «وردپرس» از دیکشنری هوشمند فینگلیش ترجمه می‌شن و بقیه حروف کاراکتر به کاراکتر نگاشت می‌شن.\n\n---\n\n## ۷. ماسک کردن اطلاعات حساس\n\nبرای محافظت از حریم خصوصی در لاگ‌ها یا پیامک‌ها:\n\n```python\n# ماسک کردن موبایل (نمایش ۴ رقم اول و ۴ رقم آخر)\nprint(parsikit.mask_mobile(\"09123456789\"))  # '0912***6789'\n\n# ماسک کردن کارت بانکی (حفظ ۶ رقم اول پیش‌شماره بانک و ۴ رقم آخر)\nprint(parsikit.mask_card(\"6037991122334455\"))  # '6037-99**-****-4455'\n\n# ماسک کردن کد ملی\nprint(parsikit.mask_national_code(\"7730123452\"))  # '773-****45-2'\n\n# ماسک کردن ایمیل\nprint(parsikit.mask_email(\"kamrani.exe@gmail.com\"))  # 'ka********e@gmail.com'\n```\n",
    "headings": [
      {
        "id": "آموزش-جامع-پردازش-و-تمیزکاری-متن-فارسی-در-پارسی-کیت",
        "text": "آموزش جامع پردازش و تمیزکاری متن فارسی در پارسی‌کیت",
        "level": 1
      },
      {
        "id": "۱-استانداردسازی-حروف-standardize_persian",
        "text": "۱. استانداردسازی حروف (`standardize_persian`)",
        "level": 2
      },
      {
        "id": "مشتری-ها-میباشد-که-کتاب-ها-را-می-خوانند",
        "text": "'مشتری‌ها میباشد که کتاب‌ها را می‌خوانند'",
        "level": 1
      },
      {
        "id": "۲-حذف-اعراب-strip_diacritics",
        "text": "۲. حذف اعراب (`strip_diacritics`)",
        "level": 2
      },
      {
        "id": "سلام-علیکم-و-رحمة-الله",
        "text": "'سلام علیکم و رحمة الله'",
        "level": 1
      },
      {
        "id": "۳-اصلاح-چینش-اشتباه-کیبورد-correct_keyboard_layout",
        "text": "۳. اصلاح چینش اشتباه کیبورد (`correct_keyboard_layout`)",
        "level": 2
      },
      {
        "id": "سلام-دانشجویان-عزیز",
        "text": "'سلام دانشجویان عزیز!'",
        "level": 1
      },
      {
        "id": "۴-مرتب-سازی-الفبایی-فارسی-persian_sorted-و-persian_sort_key",
        "text": "۴. مرتب‌سازی الفبایی فارسی (`persian_sorted` و `persian_sort_key`)",
        "level": 2
      },
      {
        "id": "مرتب-سازی-اشتباه-پایتون-پیش-فرض",
        "text": "مرتب‌سازی اشتباه پایتون پیش‌فرض:",
        "level": 1
      },
      {
        "id": "مرتب-سازی-استاندارد-با-پارسی-کیت",
        "text": "مرتب‌سازی استاندارد با پارسی‌کیت:",
        "level": 1
      },
      {
        "id": "آلو-انار-به-پرتقال-چای-سیب",
        "text": "['آلو', 'انار', 'به', 'پرتقال', 'چای', 'سیب']",
        "level": 1
      },
      {
        "id": "۵-زیباسازی-فاصله-ها-و-علائم-نگارشی-beautify_persian_spacing",
        "text": "۵. زیباسازی فاصله‌ها و علائم نگارشی (`beautify_persian_spacing`)",
        "level": 2
      },
      {
        "id": "این-یک-متن-است،-که-با-عجله-تایپ-شده-بدون-توجه-به-فاصله",
        "text": "'این یک متن است، که با عجله تایپ شده (بدون توجه به فاصله).'",
        "level": 1
      },
      {
        "id": "۶-تبدیل-متن-به-نامک-انگلیسی-فینگلیش-slugify",
        "text": "۶. تبدیل متن به نامک انگلیسی/فینگلیش (`slugify`)",
        "level": 2
      },
      {
        "id": "amoozesh-wordpress-neskheh-6",
        "text": "'amoozesh-wordpress-neskheh-6'",
        "level": 1
      },
      {
        "id": "۷-ماسک-کردن-اطلاعات-حساس",
        "text": "۷. ماسک کردن اطلاعات حساس",
        "level": 2
      },
      {
        "id": "ماسک-کردن-موبایل-نمایش-۴-رقم-اول-و-۴-رقم-آخر",
        "text": "ماسک کردن موبایل (نمایش ۴ رقم اول و ۴ رقم آخر)",
        "level": 1
      },
      {
        "id": "ماسک-کردن-کارت-بانکی-حفظ-۶-رقم-اول-پیش-شماره-بانک-و-۴-رقم-آخر",
        "text": "ماسک کردن کارت بانکی (حفظ ۶ رقم اول پیش‌شماره بانک و ۴ رقم آخر)",
        "level": 1
      },
      {
        "id": "ماسک-کردن-کد-ملی",
        "text": "ماسک کردن کد ملی",
        "level": 1
      },
      {
        "id": "ماسک-کردن-ایمیل",
        "text": "ماسک کردن ایمیل",
        "level": 1
      }
    ],
    "filePath": "/app/applet/repo_data/docs/fa/tutorials/text_processing.md",
    "counterparts": {
      "en": "tutorials/text_processing",
      "prs-af": "tutorials/text_processing",
      "tg": "tutorials/text_processing"
    },
    "counterpartSlug": "tutorials/text_processing"
  },
  {
    "id": "fa-tutorials-validation",
    "slug": "tutorials/validation",
    "lang": "fa",
    "category": "tutorials",
    "title": "آموزش اعتبارسنجی داده‌های هویتی، بانکی و ارتباطی ایران",
    "summary": "توی هر سامانه‌ای که توی ایران کار می‌کنه، اعتبارسنجی ورودی‌های کاربر (مثل کد ملی، کارت بانکی، شماره شبا، موبایل و پلاک) پای ثابت توسعه است. پارسی‌کیت الگوریتم‌های رسمی تمام این موارد رو به صورت پیش‌فر",
    "content": "# آموزش اعتبارسنجی داده‌های هویتی، بانکی و ارتباطی ایران\n\nتوی هر سامانه‌ای که توی ایران کار می‌کنه، اعتبارسنجی ورودی‌های کاربر (مثل کد ملی، کارت بانکی، شماره شبا، موبایل و پلاک) پای ثابت توسعه است. پارسی‌کیت الگوریتم‌های رسمی تمام این موارد رو به صورت پیش‌فرض درون خودش داره.\n\n---\n\n## ۱. اعتبارسنجی کد ملی ایران\n\nکد ملی ایران یک رشته ۱۰ رقمیه که رقم دهم، رقم کنترلی حاصل از فرمول پیمانه ۱۱ (Modulo 11) ۹ رقم اوله.\n\n```python\nimport parsikit\n\n# ۱. اعتبارسنجی ساده (True / False)\nprint(parsikit.is_valid_national_code(\"7730123452\"))  # True\nprint(parsikit.is_valid_national_code(\"1111111111\"))  # False (ارقام تکراری نامعتبر است)\n\n# ۲. فرمت‌بندی با خط تیره\nprint(parsikit.format_national_code(\"7730123452\"))    # '773-012345-2'\n\n# ۳. تشخیص شهر و استان صدور از روی ۳ رقم اول\nlocation = parsikit.detect_national_code_location(\"0010123458\")\nprint(location)\n# {'province': 'تهران', 'city': 'تهران مرکزی'}\n```\n\n> **نکته امنیتی:** پارسی‌کیت الگوریتم ریاضی کد ملی را بررسی می‌کند؛ صحت زنده بودن شخص یا تطابق نام و کد ملی نیازمند اتصال به ثبت احوال کشور است.\n\n---\n\n## ۲. شماره موبایل و اپراتورها\n\nپشتیبانی از فرمت‌های مختلف ورودی (`09...`، `+989...`، `00989...` و ارقام فارسی):\n\n```python\n# اعتبارسنجی\nprint(parsikit.is_valid_mobile(\"09123456789\"))     # True\nprint(parsikit.is_valid_mobile(\"+98۹۱۲۳۴۵۶۷۸۹\"))   # True\n\n# یکسان‌سازی فرمت\nprint(parsikit.normalize_mobile(\"09123456789\", prefix=\"0\"))    # '09123456789'\nprint(parsikit.normalize_mobile(\"09123456789\", prefix=\"+98\"))  # '+989123456789'\n\n# تشخیص اپراتور\nprint(parsikit.detect_mobile_operator(\"09123456789\"))  # 'MCI' (همراه اول)\nprint(parsikit.detect_mobile_operator(\"09351234567\"))  # 'Irancell' (ایرانسل)\nprint(parsikit.detect_mobile_operator(\"09201234567\"))  # 'RighTel' (رایتل)\n```\n\n---\n\n## ۳. کارت بانکی و تشخیص بانک\n\nبررسی الگوریتم لان (Luhn Checksum) و تفکیک بانک از روی ۶ رقم اول (BIN):\n\n```python\ncard = \"6037991122334455\"\n\nprint(parsikit.is_valid_card_number(card))  # True\nprint(parsikit.format_card_number(card))    # '6037-9911-2233-4455'\n\nbank = parsikit.detect_bank_from_card(card)\nprint(bank)\n# {'name': 'بانک ملی ایران', 'code': 'melli'}\n```\n\n---\n\n## ۴. شماره شبا (IBAN ایران)\n\nشماره شبا در ایران با ۲ حرف `IR` و سپس ۲۴ رقم تشکیل می‌شود (مجموعاً ۲۶ کاراکتر) و از فرمول Modulo 97 استاندارد بین‌المللی استفاده می‌کند:\n\n```python\nsheba = \"IR050170000000123456789012\"\n\nprint(parsikit.is_valid_sheba(sheba))  # True\nprint(parsikit.format_sheba(sheba, format_type=\"spaced\"))\n# 'IR05 0170 0000 0012 3456 7890 12'\n\n# استخراج تمیز شماره حساب داخلی\nacc = parsikit.extract_account_number_from_sheba(sheba)\nprint(acc)  # '123456789012'\n\n# تشخیص بانک صادرکننده شبا\nbank = parsikit.detect_bank_from_sheba(sheba)\nprint(bank)\n# {'name': 'بانک ملی ایران', 'code': 'melli'}\n```\n\n---\n\n## ۵. پلاک وسایل نقلیه (پلاک ملی)\n\nتجزیه و تحلیل پلاک‌های خودروهای ایران:\n\n```python\nplate_text = \"۱۲ ب ۳۴۵ ایران ۶۸\"\n\nprint(parsikit.is_valid_plate(plate_text))  # True\n\ndetails = parsikit.parse_plate(plate_text)\nprint(details)\n# {\n#   'part1': '۱۲',\n#   'letter': 'ب',\n#   'part2': '۳۴۵',\n#   'province_code': '۶۸',\n#   'province': 'البرز',\n#   'category': 'شخصی'\n# }\n```\n\n---\n\n## ۶. کد پستی ۱۰ رقمی\n\n```python\npostal = \"1345678912\"\nprint(parsikit.is_valid_postal_code(postal))  # True\nprint(parsikit.format_postal_code(postal))    # '13456-78912'\n```\n\n---\n\n## ۷. تشخیص خودکار نوع داده (`detect`)\n\nاگر نمی‌دونی متنی که کاربر فرستاده چیه (موبایل، کارت، شبا، ایمیل یا آی‌پی)، تابع `detect` نوع اون رو حدس می‌زنه:\n\n```python\nprint(parsikit.detect(\"09123456789\"))                  # 'mobile_number'\nprint(parsikit.detect(\"6037-9911-2233-4455\"))          # 'bank_card'\nprint(parsikit.detect(\"IR050170000000123456789012\"))   # 'sheba'\nprint(parsikit.detect(\"test@example.com\"))              # 'email'\nprint(parsikit.detect(\"192.168.1.1\"))                  # 'ip'\nprint(parsikit.detect(\"متن عادی\"))                     # None\n```\n",
    "headings": [
      {
        "id": "آموزش-اعتبارسنجی-داده-های-هویتی،-بانکی-و-ارتباطی-ایران",
        "text": "آموزش اعتبارسنجی داده‌های هویتی، بانکی و ارتباطی ایران",
        "level": 1
      },
      {
        "id": "۱-اعتبارسنجی-کد-ملی-ایران",
        "text": "۱. اعتبارسنجی کد ملی ایران",
        "level": 2
      },
      {
        "id": "۱-اعتبارسنجی-ساده-true-false",
        "text": "۱. اعتبارسنجی ساده (True / False)",
        "level": 1
      },
      {
        "id": "۲-فرمت-بندی-با-خط-تیره",
        "text": "۲. فرمت‌بندی با خط تیره",
        "level": 1
      },
      {
        "id": "۳-تشخیص-شهر-و-استان-صدور-از-روی-۳-رقم-اول",
        "text": "۳. تشخیص شهر و استان صدور از روی ۳ رقم اول",
        "level": 1
      },
      {
        "id": "province-تهران-city-تهران-مرکزی",
        "text": "{'province': 'تهران', 'city': 'تهران مرکزی'}",
        "level": 1
      },
      {
        "id": "۲-شماره-موبایل-و-اپراتورها",
        "text": "۲. شماره موبایل و اپراتورها",
        "level": 2
      },
      {
        "id": "اعتبارسنجی",
        "text": "اعتبارسنجی",
        "level": 1
      },
      {
        "id": "یکسان-سازی-فرمت",
        "text": "یکسان‌سازی فرمت",
        "level": 1
      },
      {
        "id": "تشخیص-اپراتور",
        "text": "تشخیص اپراتور",
        "level": 1
      },
      {
        "id": "۳-کارت-بانکی-و-تشخیص-بانک",
        "text": "۳. کارت بانکی و تشخیص بانک",
        "level": 2
      },
      {
        "id": "name-بانک-ملی-ایران-code-melli",
        "text": "{'name': 'بانک ملی ایران', 'code': 'melli'}",
        "level": 1
      },
      {
        "id": "۴-شماره-شبا-iban-ایران",
        "text": "۴. شماره شبا (IBAN ایران)",
        "level": 2
      },
      {
        "id": "ir05-0170-0000-0012-3456-7890-12",
        "text": "'IR05 0170 0000 0012 3456 7890 12'",
        "level": 1
      },
      {
        "id": "استخراج-تمیز-شماره-حساب-داخلی",
        "text": "استخراج تمیز شماره حساب داخلی",
        "level": 1
      },
      {
        "id": "تشخیص-بانک-صادرکننده-شبا",
        "text": "تشخیص بانک صادرکننده شبا",
        "level": 1
      },
      {
        "id": "name-بانک-ملی-ایران-code-melli",
        "text": "{'name': 'بانک ملی ایران', 'code': 'melli'}",
        "level": 1
      },
      {
        "id": "۵-پلاک-وسایل-نقلیه-پلاک-ملی",
        "text": "۵. پلاک وسایل نقلیه (پلاک ملی)",
        "level": 2
      },
      {
        "id": "heading-18",
        "text": "{",
        "level": 1
      },
      {
        "id": "part1-۱۲",
        "text": "'part1': '۱۲',",
        "level": 1
      },
      {
        "id": "letter-ب",
        "text": "'letter': 'ب',",
        "level": 1
      },
      {
        "id": "part2-۳۴۵",
        "text": "'part2': '۳۴۵',",
        "level": 1
      },
      {
        "id": "province_code-۶۸",
        "text": "'province_code': '۶۸',",
        "level": 1
      },
      {
        "id": "province-البرز",
        "text": "'province': 'البرز',",
        "level": 1
      },
      {
        "id": "category-شخصی",
        "text": "'category': 'شخصی'",
        "level": 1
      },
      {
        "id": "heading-25",
        "text": "}",
        "level": 1
      },
      {
        "id": "۶-کد-پستی-۱۰-رقمی",
        "text": "۶. کد پستی ۱۰ رقمی",
        "level": 2
      },
      {
        "id": "۷-تشخیص-خودکار-نوع-داده-detect",
        "text": "۷. تشخیص خودکار نوع داده (`detect`)",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/fa/tutorials/validation.md",
    "counterparts": {
      "en": "tutorials/validation",
      "prs-af": "tutorials/validation",
      "tg": "tutorials/validation"
    },
    "counterpartSlug": "tutorials/validation"
  },
  {
    "id": "en-api-cache",
    "slug": "api/cache",
    "lang": "en",
    "category": "api",
    "title": "Cache API (`parsikit.cache`)",
    "summary": "High-performance, thread-safe caching infrastructure for expensive mathematical, linguistic, and calendar computations.",
    "content": "# Cache API (`parsikit.cache`)\n\nHigh-performance, thread-safe caching infrastructure for expensive mathematical, linguistic, and calendar computations.\n\n---\n\n## Overview\n\nThe `parsikit.cache` module provides in-memory thread-safe LRU-like caching mechanisms utilized internally by compute-intensive functions such as `parsikit.number.number_to_words`.\n\n> **Note on API Stability**: While `ThreadSafeLRUCache` and `@memoize` are fully functional and tested, `parsikit.cache` serves primarily as an internal infrastructure module for ParsiKit. Its public surface is stable for standard caching tasks, but future major versions may introduce specialized cache backends.\n\n---\n\n## Classes\n\n### `ThreadSafeLRUCache`\n\n```python\nclass ThreadSafeLRUCache:\n    def __init__(self, maxsize: int = 1024) -> None\n```\n\nA lightweight in-memory LRU cache guarded by `threading.RLock` to provide safe concurrent access and re-entrant recursion without deadlocks.\n\n#### Capacity Rules\n- `maxsize` must be an integer (`int`). Non-integer types raise `TypeError`.\n- `maxsize >= 0`. Negative integers raise `ValueError`.\n- `maxsize == 0`: Operates in **no-storage mode** where entries are not stored and lookups return the default value.\n\n#### Methods & Properties\n\n- **`get(key: Any, default: Any = None) -> Any`**:\n  Retrieves a value from the cache. If found, refreshes the key's position to mark it as most recently used (MRU) and increments hits. Returns `default` on cache miss.\n- **`set(key: Any, value: Any) -> None`**:\n  Inserts or updates a value. If the key exists, updates its value and marks it as MRU without eviction. When capacity is exceeded, evicts the least recently used (LRU) entry.\n- **`clear() -> None`**:\n  Evicts all entries and resets hit and miss counters.\n- **`pop(key: Any, default: Any = ...) -> Any`**:\n  Removes and returns an entry from the cache. Raises `KeyError` if key is not found and no default is provided.\n- **`keys_order`**:\n  Property returning a snapshot list of cached keys ordered from oldest (LRU) to newest (MRU).\n- **`__len__()` & `__contains__(key)`**:\n  Provides standard dictionary-like container inspection under lock.\n\n---\n\n## Decorators\n\n### `@memoize`\n\n```python\ndef memoize(maxsize: int = 1024) -> Callable[[Callable[..., _T]], Callable[..., _T]]\n```\n\nDecorator that caches function return values using a dedicated `ThreadSafeLRUCache` instance.\n\n#### Features\n- **Dynamic Configuration Toggle**: Respects `parsikit.config.enable_cache`. When set to `False`, the wrapper bypasses the cache entirely and calls the underlying function directly.\n- **Thread Safety & Reentrancy**: Protected by `threading.RLock`, ensuring safe multi-threaded operation and recursion without deadlocks.\n- **Sentinel-Based Cache Misses**: Uses an internal sentinel to distinguish missing entries from cached values of `None`, `False`, `0`, or empty containers.\n- **Unhashable Argument Graceful Fallback**: When unhashable arguments (such as `list`, `dict`, `set`, or nested unhashable structures) are supplied, caching is gracefully bypassed and the target function executes normally without raising `TypeError`.\n- **Object Identity**: Returns cached objects by reference (`res1 is res2`). Callers requiring isolated mutable results should copy them explicitly.\n- **Inspection & Control**: The wrapped function exposes:\n  - `func.cache`: Direct reference to the underlying `ThreadSafeLRUCache`.\n  - `func.cache_clear()`: Clears cached entries and resets statistics.\n  - `func.cache_info()`: Returns a `CacheInfo(hits, misses, maxsize, currsize)` tuple.\n\n#### Usage Example\n\n```python\nimport parsikit\nfrom parsikit.cache import memoize\n\n@memoize(maxsize=512)\ndef compute_complex_tax(base_amount: int, tier: str = \"standard\") -> int:\n    # Expensive financial calculation\n    return base_amount * 2\n\n# First call calculates and stores in cache\nres1 = compute_complex_tax(1000000, tier=\"A\")\n\n# Subsequent calls with identical arguments hit the cache immediately\nres2 = compute_complex_tax(1000000, tier=\"A\")\nassert res1 == res2\n\n# Introspect cache statistics\ninfo = compute_complex_tax.cache_info()\nprint(f\"Hits: {info.hits}, Misses: {info.misses}, Size: {info.currsize}\")\n\n# Clear cache when needed\ncompute_complex_tax.cache_clear()\n\n# Disable cache dynamically if needed\nparsikit.config.enable_cache = False\nres3 = compute_complex_tax(1000000, tier=\"A\")  # executes underlying function\nparsikit.config.reset_defaults()\n```\n\n---\n\n## Edge Cases & Limitations\n\n1. **Unhashable Arguments**: Functions called with unhashable arguments will execute normally without raising `TypeError`, bypassing the cache for that specific invocation.\n2. **Mutable Return Values**: Because objects are cached by reference, mutating a returned mutable object (e.g. `list.append()`) alters the cached instance.\n3. **Process Isolation**: The cache is purely in-memory within the Python process. Multi-process architectures (e.g. `gunicorn -w 4`) maintain independent caches per worker process.\n",
    "headings": [
      {
        "id": "cache-api-parsikit-cache",
        "text": "Cache API (`parsikit.cache`)",
        "level": 1
      },
      {
        "id": "overview",
        "text": "Overview",
        "level": 2
      },
      {
        "id": "classes",
        "text": "Classes",
        "level": 2
      },
      {
        "id": "threadsafelrucache",
        "text": "`ThreadSafeLRUCache`",
        "level": 3
      },
      {
        "id": "decorators",
        "text": "Decorators",
        "level": 2
      },
      {
        "id": "memoize",
        "text": "`@memoize`",
        "level": 3
      },
      {
        "id": "expensive-financial-calculation",
        "text": "Expensive financial calculation",
        "level": 1
      },
      {
        "id": "first-call-calculates-and-stores-in-cache",
        "text": "First call calculates and stores in cache",
        "level": 1
      },
      {
        "id": "subsequent-calls-with-identical-arguments-hit-the-cache-immediately",
        "text": "Subsequent calls with identical arguments hit the cache immediately",
        "level": 1
      },
      {
        "id": "introspect-cache-statistics",
        "text": "Introspect cache statistics",
        "level": 1
      },
      {
        "id": "clear-cache-when-needed",
        "text": "Clear cache when needed",
        "level": 1
      },
      {
        "id": "disable-cache-dynamically-if-needed",
        "text": "Disable cache dynamically if needed",
        "level": 1
      },
      {
        "id": "edge-cases-limitations",
        "text": "Edge Cases & Limitations",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/en/api/cache.md",
    "counterparts": {
      "fa": "api/cache",
      "prs-af": "api/cache",
      "tg": "api/cache"
    },
    "counterpartSlug": "api/cache"
  },
  {
    "id": "en-api-datetime",
    "slug": "api/datetime",
    "lang": "en",
    "category": "api",
    "title": "Datetime API (`parsikit.datetime`)",
    "summary": "Converts a Gregorian date (year, month, day) to the astronomical Solar Hijri (Jalali) date.",
    "content": "# Datetime API (`parsikit.datetime`)\n\n## Functions\n\n### `gregorian_to_jalali(gy: int, gm: int, gd: int) -> tuple[int, int, int]`\nConverts a Gregorian date (year, month, day) to the astronomical Solar Hijri (Jalali) date.\n\n### `jalali_to_gregorian(jy: int, jm: int, jd: int) -> tuple[int, int, int]`\nConverts a Jalali date (year, month, day) to the corresponding Gregorian date.\n\n### `is_jalali_leap(jy: int) -> bool`\nDetermines whether a Jalali year is a 366-day leap year using the astronomical solar cycle.\n\n### `get_jalali_month_name(month: int) -> str`\nReturns the Persian name of the month (1 = فروردین, ..., 12 = اسفند).\n\n### `format_jalali(jy: int, jm: int, jd: int, pattern: str = \"YYYY/MM/DD\") -> str`\nFormats a Jalali date using the given pattern.\n\n### `humanize_relative_time(dt_or_seconds, reference=None) -> str`\nTranslates a `datetime` object or time difference into natural Persian words with Persian digits (e.g. `'هم‌اکنون'`, `'۱۵ دقیقه پیش'`, `'دیروز'`, `'در ۲ ساعت آینده'`).\n",
    "headings": [
      {
        "id": "datetime-api-parsikit-datetime",
        "text": "Datetime API (`parsikit.datetime`)",
        "level": 1
      },
      {
        "id": "functions",
        "text": "Functions",
        "level": 2
      },
      {
        "id": "gregorian_to_jalali-gy-int-gm-int-gd-int-tuple-int-int-int",
        "text": "`gregorian_to_jalali(gy: int, gm: int, gd: int) -> tuple[int, int, int]`",
        "level": 3
      },
      {
        "id": "jalali_to_gregorian-jy-int-jm-int-jd-int-tuple-int-int-int",
        "text": "`jalali_to_gregorian(jy: int, jm: int, jd: int) -> tuple[int, int, int]`",
        "level": 3
      },
      {
        "id": "is_jalali_leap-jy-int-bool",
        "text": "`is_jalali_leap(jy: int) -> bool`",
        "level": 3
      },
      {
        "id": "get_jalali_month_name-month-int-str",
        "text": "`get_jalali_month_name(month: int) -> str`",
        "level": 3
      },
      {
        "id": "format_jalali-jy-int-jm-int-jd-int-pattern-str-yyyy-mm-dd-str",
        "text": "`format_jalali(jy: int, jm: int, jd: int, pattern: str = \"YYYY/MM/DD\") -> str`",
        "level": 3
      },
      {
        "id": "humanize_relative_time-dt_or_seconds-reference-none-str",
        "text": "`humanize_relative_time(dt_or_seconds, reference=None) -> str`",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/en/api/datetime.md",
    "counterparts": {
      "fa": "api/datetime",
      "prs-af": "api/datetime",
      "tg": "api/datetime"
    },
    "counterpartSlug": "api/datetime"
  },
  {
    "id": "en-api-dev_and_gui",
    "slug": "api/dev_and_gui",
    "lang": "en",
    "category": "api",
    "title": "Developer Diagnostics & GUI API (`parsikit.dev`, `parsikit.gui`, `parsikit.reshaper`)",
    "summary": "Persian-aware string formatter that accounts for Zero-Width Non-Joiner (ZWNJ) characters and diacritics when calculating visual padding. Supports :fa / :p format specifiers.",
    "content": "# Developer Diagnostics & GUI API (`parsikit.dev`, `parsikit.gui`, `parsikit.reshaper`)\n\n## Visual Alignment & Diagnostics (`parsikit.dev`)\n\n### `pformat(template: str, *args, **kwargs) -> str`\nPersian-aware string formatter that accounts for Zero-Width Non-Joiner (ZWNJ) characters and diacritics when calculating visual padding. Supports `:fa` / `:p` format specifiers.\n\n### `persian_fstring(template: str, **kwargs) -> str`\nFormatted string evaluation with automatic visual alignment and Persian digit conversion.\n\n### `inspect_text(text: str) -> dict`\nAnalyzes string structure and reports character counts, ZWNJ count, Arabic characters, and digit scripts.\n\n### `debug_text(text: str) -> None`\nPrints a formatted diagnostic report to stdout.\n\n### `validate_batch(items: list, model_class, silent: bool = False) -> dict`\nValidates a list of raw inputs against a ParsiKit model class and returns valid/invalid summaries.\n\n---\n\n## Graphical Reshaping & Input Binding (`parsikit.reshaper`, `parsikit.gui`)\n\n### `reshape_for_graphics(text: str, reverse: bool = True) -> str`\nReshapes cursive Persian text and reverses character order for 2D graphics renderers without HarfBuzz support (PIL, OpenCV, Pygame).\n\n### `reshape_paragraph_for_graphics(text: str, max_chars_per_line: int, reverse: bool = True) -> str`\nSplits and reshapes multi-line text blocks.\n\n### `bind_persian_input(widget, input_type: str = \"text\") -> None`\nAttaches live keystroke normalization to Tkinter and CustomTkinter input entries.\n",
    "headings": [
      {
        "id": "developer-diagnostics-gui-api-parsikit-dev-parsikit-gui-parsikit-reshaper",
        "text": "Developer Diagnostics & GUI API (`parsikit.dev`, `parsikit.gui`, `parsikit.reshaper`)",
        "level": 1
      },
      {
        "id": "visual-alignment-diagnostics-parsikit-dev",
        "text": "Visual Alignment & Diagnostics (`parsikit.dev`)",
        "level": 2
      },
      {
        "id": "pformat-template-str-args-kwargs-str",
        "text": "`pformat(template: str, *args, **kwargs) -> str`",
        "level": 3
      },
      {
        "id": "persian_fstring-template-str-kwargs-str",
        "text": "`persian_fstring(template: str, **kwargs) -> str`",
        "level": 3
      },
      {
        "id": "inspect_text-text-str-dict",
        "text": "`inspect_text(text: str) -> dict`",
        "level": 3
      },
      {
        "id": "debug_text-text-str-none",
        "text": "`debug_text(text: str) -> None`",
        "level": 3
      },
      {
        "id": "validate_batch-items-list-model_class-silent-bool-false-dict",
        "text": "`validate_batch(items: list, model_class, silent: bool = False) -> dict`",
        "level": 3
      },
      {
        "id": "graphical-reshaping-input-binding-parsikit-reshaper-parsikit-gui",
        "text": "Graphical Reshaping & Input Binding (`parsikit.reshaper`, `parsikit.gui`)",
        "level": 2
      },
      {
        "id": "reshape_for_graphics-text-str-reverse-bool-true-str",
        "text": "`reshape_for_graphics(text: str, reverse: bool = True) -> str`",
        "level": 3
      },
      {
        "id": "reshape_paragraph_for_graphics-text-str-max_chars_per_line-int-reverse-bool-true-str",
        "text": "`reshape_paragraph_for_graphics(text: str, max_chars_per_line: int, reverse: bool = True) -> str`",
        "level": 3
      },
      {
        "id": "bind_persian_input-widget-input_type-str-text-none",
        "text": "`bind_persian_input(widget, input_type: str = \"text\") -> None`",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/en/api/dev_and_gui.md",
    "counterparts": {
      "fa": "api/dev_and_gui"
    },
    "counterpartSlug": "api/dev_and_gui"
  },
  {
    "id": "en-api-index",
    "slug": "api/index",
    "lang": "en",
    "category": "api",
    "title": "ParsiKit API Reference (English)",
    "summary": "Complete reference for all public modules and functions in ParsiKit:",
    "content": "# ParsiKit API Reference (English)\n\nComplete reference for all public modules and functions in **ParsiKit**:\n\n| Module | Description | Documentation |\n|---|---|---|\n| `parsikit.text` | Character standardization, ZWNJ, diacritics stripping, entity extraction, and masking | [Text Reference](text.md) |\n| `parsikit.validators` | National Code, mobile, landline, card, Sheba, bill, and plate validators | [Validators Reference](validators.md) |\n| `parsikit.models` | Rich domain models for identity and financial types (with Pydantic support) | [Models Reference](models.md) |\n| `parsikit.datetime` | Jalali-Gregorian conversions, leap years, month names, and relative time | [Datetime Reference](datetime.md) |\n| `parsikit.number` & `parsikit.currency` | Numeral script conversions, words-to-numbers, Rial/Toman, VAT, installments | [Numbers & Currency](number_and_currency.md) |\n| `parsikit.dev` & `parsikit.gui` | Visual width alignment, terminal diagnostics, and live typing helpers | [Dev & GUI Reference](dev_and_gui.md) |\n| `parsikit.reshaper` | Persian cursive letter reshaping and Bidirectional reordering for graphics | [Reshaper Reference](reshaper.md) |\n| `parsikit.cache` | High-performance thread-safe LRU-like caching infrastructure | [Cache Reference](cache.md) |\n| `parsikit.config` & `parsikit.exceptions` | Global configuration and structured exception classes | [Config & Exceptions](#configuration--exceptions) |\n\n---\n\n## Configuration & Exceptions\n\n### Configuration (`parsikit.config`)\n- `default_tax_rate: float`: Default VAT rate (default: `0.10`).\n- `default_currency: str`: System currency default, `\"toman\"` or `\"rial\"` (default: `\"toman\"`).\n- `enable_cache: bool`: Thread-safe LRU caching toggle for number-to-words conversions (default: `True`).\n\n### Exceptions (`parsikit.exceptions`)\nAll custom exceptions inherit from `ParsiKitError` and `ValidationError` (subclass of `ValueError`):\n- `InvalidNationalCodeError`\n- `InvalidMobileError`\n- `InvalidCardNumberError`\n- `InvalidShebaError`\n- `InvalidPostalCodeError`\n- `InvalidPlateError`\n- `InvalidBillError`\n",
    "headings": [
      {
        "id": "parsikit-api-reference-english",
        "text": "ParsiKit API Reference (English)",
        "level": 1
      },
      {
        "id": "configuration-exceptions",
        "text": "Configuration & Exceptions",
        "level": 2
      },
      {
        "id": "configuration-parsikit-config",
        "text": "Configuration (`parsikit.config`)",
        "level": 3
      },
      {
        "id": "exceptions-parsikit-exceptions",
        "text": "Exceptions (`parsikit.exceptions`)",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/en/api/index.md",
    "counterparts": {
      "fa": "api/index",
      "prs-af": "api/index",
      "tg": "api/index"
    },
    "counterpartSlug": "api/index"
  },
  {
    "id": "en-api-models",
    "slug": "api/models",
    "lang": "en",
    "category": "api",
    "title": "Domain Models API (`parsikit.models`)",
    "summary": "Object-Oriented Domain Models (Value Objects) that perform instant validation upon creation and offer structured attributes, masked representations, and native Pydantic v2 support.",
    "content": "# Domain Models API (`parsikit.models`)\n\nObject-Oriented Domain Models (Value Objects) that perform instant validation upon creation and offer structured attributes, masked representations, and native Pydantic v2 support.\n\n---\n\n## 1. `NationalCode(code: str, strict: bool = True)`\n- `.is_valid: bool`\n- `.formatted: str` (e.g. `'001-012345-8'`)\n- `.masked: str` (e.g. `'001-****45-8'`)\n- `.location: dict | None` (`{\"province\": ..., \"city\": ...}`)\n- Raises: `InvalidNationalCodeError`\n\n---\n\n## 2. `MobileNumber(phone: str)`\n- `.is_valid: bool`\n- `.national: str` (e.g. `'09123456789'`)\n- `.international: str` (e.g. `'+989123456789'`)\n- `.masked: str` (e.g. `'0912***6789'`)\n- `.operator: str | None` (e.g. `'MCI'`)\n- Raises: `InvalidMobileError`\n\n---\n\n## 3. `BankCard(card_number: str)`\n- `.is_valid: bool`\n- `.formatted: str` (e.g. `'6037-9911-2233-4455'`)\n- `.masked: str` (e.g. `'6037-99**-****-4455'`)\n- `.bank_name: str | None` (e.g. `'بانک ملی ایران'`)\n- Raises: `InvalidCardNumberError`\n\n---\n\n## 4. `Sheba(sheba_code: str)`\n- `.is_valid: bool`\n- `.formatted: str` (e.g. `'IR12 0170 0000 0012 3456 7890 12'`)\n- `.bank_name: str | None`\n- `.account_number: str`\n- Raises: `InvalidShebaError`\n\n---\n\n## 5. `VehiclePlate(plate_text: str)`\n- `.is_valid: bool`\n- `.formatted: str` (e.g. `'12-B-345-68'`)\n- `.category: str` (e.g. `'شخصی'`, `'تاکسی'`)\n- `.details: dict`\n- Raises: `InvalidPlateError`\n\n---\n\n## 6. `FixedLine(phone: str)`\n- `.is_valid: bool`\n- `.formatted: str`\n- `.province: str | None`\n- Raises: `ValidationError`\n\n---\n\n## 7. `PersianText(text: str)`\n- `.standardized: str`\n- `.stripped: str`\n- `.word_count: int`\n- `.has_persian: bool`\n- `.slug: str`\n",
    "headings": [
      {
        "id": "domain-models-api-parsikit-models",
        "text": "Domain Models API (`parsikit.models`)",
        "level": 1
      },
      {
        "id": "1-nationalcode-code-str-strict-bool-true",
        "text": "1. `NationalCode(code: str, strict: bool = True)`",
        "level": 2
      },
      {
        "id": "2-mobilenumber-phone-str",
        "text": "2. `MobileNumber(phone: str)`",
        "level": 2
      },
      {
        "id": "3-bankcard-card_number-str",
        "text": "3. `BankCard(card_number: str)`",
        "level": 2
      },
      {
        "id": "4-sheba-sheba_code-str",
        "text": "4. `Sheba(sheba_code: str)`",
        "level": 2
      },
      {
        "id": "5-vehicleplate-plate_text-str",
        "text": "5. `VehiclePlate(plate_text: str)`",
        "level": 2
      },
      {
        "id": "6-fixedline-phone-str",
        "text": "6. `FixedLine(phone: str)`",
        "level": 2
      },
      {
        "id": "7-persiantext-text-str",
        "text": "7. `PersianText(text: str)`",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/en/api/models.md",
    "counterparts": {
      "fa": "api/models",
      "prs-af": "api/models",
      "tg": "api/models"
    },
    "counterpartSlug": "api/models"
  },
  {
    "id": "en-api-number_and_currency",
    "slug": "api/number_and_currency",
    "lang": "en",
    "category": "api",
    "title": "Numbers & Currency API (`parsikit.number`, `parsikit.currency`)",
    "summary": "Replaces English digits (0-9) with Persian digits (۰-۹).",
    "content": "# Numbers & Currency API (`parsikit.number`, `parsikit.currency`)\n\n## Numbers (`parsikit.number`)\n\n### `english_to_persian(text: str) -> str`\nReplaces English digits (`0-9`) with Persian digits (`۰-۹`).\n\n### `persian_to_english(text: str) -> str`\nReplaces Persian and Arabic digits with English ASCII digits.\n\n### `number_to_words(number: int | float) -> str`\nTranslates integers up to 999 septillion into written Persian words.\n\n---\n\n## Currency (`parsikit.currency`)\n\n### `rial_to_toman(amount: int | float) -> int | float`\nConverts Rial to Toman by dividing by 10.\n\n### `toman_to_rial(amount: int | float) -> int | float`\nConverts Toman to Rial by multiplying by 10.\n\n### `format_currency(amount, currency=\"toman\", *, persian_digits=False) -> str`\nFormats a numeric amount with thousand separators and currency symbol.\n\n### `format_currency_to_words(amount, currency=\"toman\") -> str`\nExpresses an amount in written Persian words with the currency label.\n\n### `add_tax_and_toll(amount, tax_rate=None) -> dict`\nCalculates Value-Added Tax (VAT) and the total price.\n\n### `calculate_installments(principal, annual_interest_rate, months) -> dict`\nCalculates loan amortization schedule according to the Central Bank of Iran formula.\n",
    "headings": [
      {
        "id": "numbers-currency-api-parsikit-number-parsikit-currency",
        "text": "Numbers & Currency API (`parsikit.number`, `parsikit.currency`)",
        "level": 1
      },
      {
        "id": "numbers-parsikit-number",
        "text": "Numbers (`parsikit.number`)",
        "level": 2
      },
      {
        "id": "english_to_persian-text-str-str",
        "text": "`english_to_persian(text: str) -> str`",
        "level": 3
      },
      {
        "id": "persian_to_english-text-str-str",
        "text": "`persian_to_english(text: str) -> str`",
        "level": 3
      },
      {
        "id": "number_to_words-number-int-float-str",
        "text": "`number_to_words(number: int | float) -> str`",
        "level": 3
      },
      {
        "id": "currency-parsikit-currency",
        "text": "Currency (`parsikit.currency`)",
        "level": 2
      },
      {
        "id": "rial_to_toman-amount-int-float-int-float",
        "text": "`rial_to_toman(amount: int | float) -> int | float`",
        "level": 3
      },
      {
        "id": "toman_to_rial-amount-int-float-int-float",
        "text": "`toman_to_rial(amount: int | float) -> int | float`",
        "level": 3
      },
      {
        "id": "format_currency-amount-currency-toman-persian_digits-false-str",
        "text": "`format_currency(amount, currency=\"toman\", *, persian_digits=False) -> str`",
        "level": 3
      },
      {
        "id": "format_currency_to_words-amount-currency-toman-str",
        "text": "`format_currency_to_words(amount, currency=\"toman\") -> str`",
        "level": 3
      },
      {
        "id": "add_tax_and_toll-amount-tax_rate-none-dict",
        "text": "`add_tax_and_toll(amount, tax_rate=None) -> dict`",
        "level": 3
      },
      {
        "id": "calculate_installments-principal-annual_interest_rate-months-dict",
        "text": "`calculate_installments(principal, annual_interest_rate, months) -> dict`",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/en/api/number_and_currency.md",
    "counterparts": {
      "fa": "api/number_and_currency",
      "prs-af": "api/number_and_currency",
      "tg": "api/number_and_currency"
    },
    "counterpartSlug": "api/number_and_currency"
  },
  {
    "id": "en-api-reshaper",
    "slug": "api/reshaper",
    "lang": "en",
    "category": "api",
    "title": "Reshaper API (`parsikit.reshaper`)",
    "summary": "Lightweight, zero-dependency Persian letter connection shaper and Bidirectional (BiDi) layout reorganizer for graphic engines, image generation libraries, and games.",
    "content": "# Reshaper API (`parsikit.reshaper`)\n\nLightweight, zero-dependency Persian letter connection shaper and Bidirectional (BiDi) layout reorganizer for graphic engines, image generation libraries, and games.\n\n---\n\n## Overview\n\nMost graphic engines (such as Pygame, OpenCV, Pillow without `raqm`, Matplotlib, OpenGL, and PDF generators) assume left-to-right Latin typography. When rendering Persian text without a shaping engine, letters appear disconnected, disjointed, and backwards (e.g. `س ل ا م` instead of `سلام`).\n\n`parsikit.reshaper` converts standard Persian Unicode characters into their contextual contextual presentation forms (Isolated, Initial, Medial, Final) and reorders glyphs for naive LTR renderers.\n\n---\n\n## Public Functions\n\n### `reshape_for_graphics(text: str, reverse: bool = True) -> str`\n\nConnects cursive Persian characters into appropriate presentation glyphs and manages bidirectional text blocks.\n\n#### Parameters:\n- **`text`** (`str`): The Persian or mixed Persian-Latin string to reshape.\n- **`reverse`** (`bool`, default `True`): If `True`, reverses RTL character order for graphics engines that draw from left to right. Embedded Latin words and digits are preserved in correct left-to-right order.\n\n#### Returns:\n- `str`: Shaped Unicode presentation string ready for graphic blitting.\n\n#### Direction & Reversal Semantics:\n- **`reverse=True` (Default)**: Intended for naive graphic rendering environments (such as basic Pygame, OpenCV, Matplotlib, or simple Canvas) that draw characters strictly from left to right. RTL character runs are inverted so they draw correctly from right to left, while embedded LTR runs (Latin words, URLs, emails, dates, and numbers) remain in forward left-to-right reading order.\n- **`reverse=False`**: Intended for engines that already handle BiDi cursor positioning or text flow, but lack font cursive shaping support. Only glyph shaping (Initial, Medial, Final, Isolated) and Lam-Alef ligatures are performed, preserving original logical character order.\n\n#### Supported Features:\n- Complete Persian and Arabic alphabet presentation mapping (including `ۀ`, `ك`, `ي`, and Kurdish `ە`).\n- Standard **Lam-Alef ligatures** (`لا`, `لآ`, `لأ`, `لإ`) in isolated and final positions.\n- **Diacritics & Combining Graphemes**: Ignores short vowels during connectivity checks and preserves combining diacritics attached to base letters upon reversal.\n- **BiDi Block & Numeral Preservation**: Preserves Latin words, URLs, emails, dates, and numbers (both ASCII and Persian/Arabic digits) in standard LTR order without inversion.\n\n#### Limitations & Boundary Scope:\n`parsikit.reshaper` is a lightweight, zero-dependency layout helper. It is **not** a complete implementation of the Unicode Bidirectional Algorithm (UAX #9). While it correctly segments sequential RTL and LTR blocks (including embedded Latin phrases, numbers, and URLs), deeply nested bidirectional text (e.g., an Arabic clause embedded within an English phrase inside a Persian sentence with complex punctuation neutrals) requires a specialized full-layout engine such as HarfBuzz with Raqm/FriBidi.\n\n#### Usage Example:\n\n```python\nimport parsikit\n\nraw_text = \"سلام دنیا (نسخه 3.3.1)\"\n# Shaped and reversed for Pygame or Pillow:\nready_text = parsikit.reshape_for_graphics(raw_text)\n\n# Shaped without reversing (for engines with native BiDi but lacking font shaping):\nshaped_only = parsikit.reshape_for_graphics(raw_text, reverse=False)\n```\n\n---\n\n### `reshape_paragraph_for_graphics(text: str, max_chars_per_line: int, reverse: bool = True) -> list[str]`\n\nAutomatically word-wraps a long paragraph of Persian text and reshapes each line for graphical drawing.\n\n#### Parameters:\n- **`text`** (`str`): Paragraph text to wrap and shape.\n- **`max_chars_per_line`** (`int`): Maximum character width per line.\n- **`reverse`** (`bool`, default `True`): Whether to reverse RTL blocks for LTR canvas drawing.\n\n#### Returns:\n- `list[str]`: A list of shaped line strings.\n\n#### Usage Example:\n\n```python\nimport parsikit\n\nparagraph = \"پارسی‌کیت یک کتابخانه استاندارد پایتونی برای پردازش اطلاعات فارسی، تقویم شمسی و اعتبارسنجی است.\"\nlines = parsikit.reshape_paragraph_for_graphics(paragraph, max_chars_per_line=30)\nfor line in lines:\n    print(line)\n```\n\n---\n\n## Relationship to Other Modules\n\n- **`parsikit.text.standardize_persian`**: Recommended before shaping to unify Arabic characters and fix zero-width non-joiners.\n- **`parsikit.gui.bind_persian_input`**: Integrates live typing assistance for GUI frameworks (Tkinter, CustomTkinter, Qt).\n\n",
    "headings": [
      {
        "id": "reshaper-api-parsikit-reshaper",
        "text": "Reshaper API (`parsikit.reshaper`)",
        "level": 1
      },
      {
        "id": "overview",
        "text": "Overview",
        "level": 2
      },
      {
        "id": "public-functions",
        "text": "Public Functions",
        "level": 2
      },
      {
        "id": "reshape_for_graphics-text-str-reverse-bool-true-str",
        "text": "`reshape_for_graphics(text: str, reverse: bool = True) -> str`",
        "level": 3
      },
      {
        "id": "shaped-and-reversed-for-pygame-or-pillow",
        "text": "Shaped and reversed for Pygame or Pillow:",
        "level": 1
      },
      {
        "id": "shaped-without-reversing-for-engines-with-native-bidi-but-lacking-font-shaping",
        "text": "Shaped without reversing (for engines with native BiDi but lacking font shaping):",
        "level": 1
      },
      {
        "id": "reshape_paragraph_for_graphics-text-str-max_chars_per_line-int-reverse-bool-true-list-str",
        "text": "`reshape_paragraph_for_graphics(text: str, max_chars_per_line: int, reverse: bool = True) -> list[str]`",
        "level": 3
      },
      {
        "id": "relationship-to-other-modules",
        "text": "Relationship to Other Modules",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/en/api/reshaper.md",
    "counterparts": {
      "fa": "api/reshaper"
    },
    "counterpartSlug": "api/reshaper"
  },
  {
    "id": "en-api-text",
    "slug": "api/text",
    "lang": "en",
    "category": "api",
    "title": "Text Processing API (`parsikit.text`)",
    "summary": "High-performance, Unicode-aware Persian text standardization, normalization, and keyboard utilities.",
    "content": "# Text Processing API (`parsikit.text`)\n\nHigh-performance, Unicode-aware Persian text standardization, normalization, and keyboard utilities.\n\n---\n\n## Standardization & Normalization\n\n### `standardize_persian(text: str, *, strip_diacritics_opt: bool = False, preserve_arabic: bool = False) -> str`\nNormalizes raw Persian and mixed-language text according to standard orthographic rules:\n- **Scope & Multilingual Support**:\n  - By default (`preserve_arabic=False`), standardizes text within a Persian orthographic context, mapping Arabic loanword variants to standard Persian letters:\n    - Arabic Yeh (`ي` / `\\u064A` and `ى` / `\\u0649`) → Persian Yeh (`ی` / `\\u06CC`)\n    - Arabic Kaf (`ك` / `\\u0643`) → Persian Keheh (`ک` / `\\u06A9`)\n    - Arabic Ta Marbuta (`ة` / `\\u0629`) → Persian Heh (`ه` / `\\u0647`) in loanwords (e.g. `دایرة المعارف` → `دایره المعارف`)\n    - Arabic digits (`٠١٢٣٤٥٦٧٨٩`) → Persian digits (`۰۱۲۳۴۵۶۷۸۹`)\n    - Heh with Yeh Above (`ۀ` / `\\u06C0`) → `هٔ` (`\\u0647\\u0654`)\n  - When `preserve_arabic=True`, Arabic-specific characters (`ة`, `ي`, `ى`) are strictly preserved, preventing unwanted alteration of Arabic text (e.g. `\"هذه لغة عربية جميلة\"`).\n  - Kurdish characters such as Kurdish Ae (`ە` / `\\u06D5`) are **never** converted to `ه` and remain completely preserved.\n  - English and other Latin-script words remain unmodified.\n- **Unicode Canonical Normalization**: Applies standard Unicode canonical composition (`NFC`), ensuring decomposed sequences (such as decomposed `آ`) match precomposed Persian characters.\n- **Zero-Width Non-Joiner (ZWNJ) Engine**:\n  - Automatically adjusts half-spaces for standard prefixes (`می‌`, `نمی‌`, `بی‌`) and suffixes (`‌ها`, `‌های`, `‌ترین`, `‌تر`, `‌ای`, etc.).\n  - Preserves word boundaries: spaces surrounding ZWNJ between independent words (e.g. `\"الف \\u200c ب\"`) collapse into a standard space (`\"الف ب\"`), ensuring separate words are not unintentionally conjoined.\n  - Cleans up single-sided space-adjacent ZWNJ (e.g. `\"دانش \\u200cآموز\"` → `\"دانش\\u200cآموز\"`), preserving meaningful Persian half-spaces.\n  - Removes redundant ZWNJs adjacent to punctuation marks (`.`, `،`, `؛`, `؟`, `!`, `:`, `()`, `[]`, `{}`, `«»`).\n  - Collapses duplicate consecutive ZWNJs (`\\u200C{2,}`) into a single `\\u200C`.\n  - Trims leading and trailing ZWNJs from text boundaries.\n- **Idempotence**: Strictly satisfies `standardize_persian(standardize_persian(x)) == standardize_persian(x)`.\n- **Whitespace & Line Breaks**: Collapses redundant spaces into a single space and trims edge margins while preserving line breaks and paragraph structure.\n- **Optional Diacritics Removal**: When `strip_diacritics_opt=True`, strips vowel diacritics via `strip_diacritics`.\n\n### `strip_diacritics(text: str) -> str`\nRemoves Persian and Arabic vowel diacritic marks (Fatha, Damma, Kasra, Tanwin, Tashdid, Sukun) via precompiled regular expressions.\n\n### `is_persian(text: str) -> bool`\nReturns `True` if the string contains at least one character in the Persian/Arabic Unicode blocks (including Presentation Forms).\n\n### `clean_text(text: str, *, preserve_arabic: bool = False) -> str`\nSanitizes raw or multi-line strings through a comprehensive pipeline:\n1. **Token Protection**: Shields URLs, email addresses, key-value configurations, semantic versions, and technical IDs from digit conversions and spacing modifications.\n2. **Standardization**: Normalizes characters and ZWNJ layout via `standardize_persian(..., preserve_arabic=preserve_arabic)`.\n3. **Digit Conversion**: Converts prose ASCII and Arabic numbers to Persian numerals via `english_to_persian`, while strictly keeping technical identifiers and URLs in ASCII.\n4. **Spacing Beautification**: Optimizes punctuation spacing via `beautify_persian_spacing`.\n5. **Control Character Stripping**: Strips invisible zero-width and bidirectional control characters (`\\u200B`, `\\uFEFF`, `\\u200E-\\u200F`, `\\u202A-\\u202E`), strictly preserving intentional ZWNJ (`\\u200C`).\n6. **Paragraph Clean-up**: Collapses redundant blank lines (allowing at most 1 empty line between paragraphs) and trims margins per line.\n7. **Token Restoration**: Restores protected URLs, emails, and technical strings to their exact original forms.\n\n### `normalize_whitespace(text: str, keep_paragraphs: bool = True) -> str`\nNormalizes non-standard Unicode spaces (tabs, non-breaking spaces `\\u00A0`, thin spaces, narrow spaces) to standard spaces.\n- If `keep_paragraphs=True` (default), preserves paragraph separations while clipping redundant blank lines.\n- If `keep_paragraphs=False`, flattens all text into a single continuous line.\n\n### `beautify_persian_spacing(text: str) -> str`\nOptimizes spacing around Persian and Latin punctuation marks with strict content protection:\n- Standardizes Persian commas (`،`) and semicolons (`؛`).\n- Removes redundant spaces before punctuation marks (`.`, `،`, `؛`, `؟`, `!`, `:`, `)`).\n- Inserts a single space after Persian punctuation (`،`, `؛`, `؟`, `!`).\n- Adjusts spacing around parentheses, brackets, and Persian quotation marks (`«»`), ensuring closing brackets followed by sentence punctuation (`.`, `،`) do not gain unwanted spaces.\n- Does NOT alter digits.\n- **Safety Protection**:\n  - **URLs**: Preserves web addresses, query strings (`?x=1&y=2`), paths, ports (`:8080`), fragments (`#section`), and percent-encoding (`%20`) without inserting spaces after question marks, colons, or slashes.\n  - **Trailing Sentence Punctuation**: Punctuation following a URL or closing parenthesis is formatted cleanly without being absorbed into the URL or separated by redundant spaces.\n  - **Emails**: Preserves email addresses (e.g. `user.name+tag@example.co.uk`) without corrupting usernames or domains.\n  - **Decimal Numbers**: Preserves floating-point numbers in ASCII and Persian scripts (e.g. `3.14`, `۱۲.۵`).\n  - **Timestamps**: Preserves clock times (e.g. `12:30`, `۱۴:۴۵`).\n  - **Technical Tokens**: Preserves version strings (e.g. `version=v2.0.1`, `Python 3.13.3`) and technical IDs (e.g. `ID-2026-0042`).\n  - **Code & Filenames**: Preserves technical file extensions (e.g. `test.py`, `script.min.js`).\n  - **Ellipses**: Preserves consecutive dots (`...`).\n\n---\n\n## Keyboard Layout & Collation\n\n### `correct_keyboard_layout(text: str) -> str`\nTranslates Persian text accidentally typed while the system keyboard was set to English QWERTY into proper Persian characters (e.g. `\"sghl\"` → `\"سلام\"`).\n\n### `persian_sort_key(s: str) -> tuple[int, ...]`\nGenerates a precomputed sorting key tuple respecting the official Persian alphabet collation order (`آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی`), normalizing Arabic variants (`أ`, `إ`, `ٱ`, `ؤ`, `ئ`) into base Persian letters, placing ZWNJ before space, and ordering numbers before letters.\n\n### `persian_sorted(iterable: Iterable[T], *, reverse: bool = False) -> list[T]`\nSorts an iterable of strings using the optimized Persian collation key.\n\n---\n\n## Extraction & Conversion\n\n### `words_to_number(text: str) -> int`\nHigh-performance parser converting Persian textual number expressions (e.g. `\"سی و دو هزار و پانصد\"`) into exact integers (`32500`). Supports negative numbers (`\"منفی پنجاه\"` → `-50`), compound scale multipliers (e.g. `\"هزار میلیارد\"` → `1000000000000`), and large magnitudes up to septillions.\n\n### `convert_numbers(text: str, to: Literal[\"persian\", \"english\"] = \"persian\") -> str`\nConverts numeric digits within arbitrary text between Persian (`۰-۹`) and English (`0-9`) numeral representations.\n\n### `slugify(text: str, separator: str = \"-\") -> str`\nGenerates clean, SEO-optimized URL slugs from Persian text with dictionary-backed transliteration:\n- Transliterates common words, prepositions, and technical terms (`پایتون` → `python`, `وردپرس` → `wordpress`, `در` → `dar`, `کتاب` → `ketab`).\n- Converts digits to ASCII.\n- Filters out special characters and collapses repeated separators.\n\n### `extract_mobiles(text: str) -> list[str]`\nExtracts and validates all unique Iranian mobile phone numbers found in unformatted text.\n\n### `extract_national_codes(text: str) -> list[str]`\nExtracts and validates all 10-digit Iranian National Codes satisfying the official civil registration checksum.\n\n---\n\n## Sensitive Data Masking\n\n### `mask_mobile(phone: str, mask_char: str = \"*\") -> str`\nMasks the middle digits of an Iranian mobile number (e.g. `\"09123456789\"` → `\"0912***6789\"`).\n\n### `mask_card(card: str, mask_char: str = \"*\") -> str`\nMasks the middle digits of a 16-digit debit/credit card number (e.g. `\"6037991122334455\"` → `\"6037-99**-****-4455\"`).\n\n### `mask_national_code(code: str, mask_char: str = \"*\") -> str`\nMasks the middle digits of a 10-digit National Code (e.g. `\"7730123452\"` → `\"773-****45-2\"`).\n\n### `mask_email(email: str, mask_char: str = \"*\") -> str`\nMasks username characters in an email address (e.g. `\"kamrani.exe@gmail.com\"` → `\"ka********e@gmail.com\"`).\n\n",
    "headings": [
      {
        "id": "text-processing-api-parsikit-text",
        "text": "Text Processing API (`parsikit.text`)",
        "level": 1
      },
      {
        "id": "standardization-normalization",
        "text": "Standardization & Normalization",
        "level": 2
      },
      {
        "id": "standardize_persian-text-str-strip_diacritics_opt-bool-false-preserve_arabic-bool-false-str",
        "text": "`standardize_persian(text: str, *, strip_diacritics_opt: bool = False, preserve_arabic: bool = False) -> str`",
        "level": 3
      },
      {
        "id": "strip_diacritics-text-str-str",
        "text": "`strip_diacritics(text: str) -> str`",
        "level": 3
      },
      {
        "id": "is_persian-text-str-bool",
        "text": "`is_persian(text: str) -> bool`",
        "level": 3
      },
      {
        "id": "clean_text-text-str-preserve_arabic-bool-false-str",
        "text": "`clean_text(text: str, *, preserve_arabic: bool = False) -> str`",
        "level": 3
      },
      {
        "id": "normalize_whitespace-text-str-keep_paragraphs-bool-true-str",
        "text": "`normalize_whitespace(text: str, keep_paragraphs: bool = True) -> str`",
        "level": 3
      },
      {
        "id": "beautify_persian_spacing-text-str-str",
        "text": "`beautify_persian_spacing(text: str) -> str`",
        "level": 3
      },
      {
        "id": "keyboard-layout-collation",
        "text": "Keyboard Layout & Collation",
        "level": 2
      },
      {
        "id": "correct_keyboard_layout-text-str-str",
        "text": "`correct_keyboard_layout(text: str) -> str`",
        "level": 3
      },
      {
        "id": "persian_sort_key-s-str-tuple-int",
        "text": "`persian_sort_key(s: str) -> tuple[int, ...]`",
        "level": 3
      },
      {
        "id": "persian_sorted-iterable-iterable-t-reverse-bool-false-list-t",
        "text": "`persian_sorted(iterable: Iterable[T], *, reverse: bool = False) -> list[T]`",
        "level": 3
      },
      {
        "id": "extraction-conversion",
        "text": "Extraction & Conversion",
        "level": 2
      },
      {
        "id": "words_to_number-text-str-int",
        "text": "`words_to_number(text: str) -> int`",
        "level": 3
      },
      {
        "id": "convert_numbers-text-str-to-literal-persian-english-persian-str",
        "text": "`convert_numbers(text: str, to: Literal[\"persian\", \"english\"] = \"persian\") -> str`",
        "level": 3
      },
      {
        "id": "slugify-text-str-separator-str-str",
        "text": "`slugify(text: str, separator: str = \"-\") -> str`",
        "level": 3
      },
      {
        "id": "extract_mobiles-text-str-list-str",
        "text": "`extract_mobiles(text: str) -> list[str]`",
        "level": 3
      },
      {
        "id": "extract_national_codes-text-str-list-str",
        "text": "`extract_national_codes(text: str) -> list[str]`",
        "level": 3
      },
      {
        "id": "sensitive-data-masking",
        "text": "Sensitive Data Masking",
        "level": 2
      },
      {
        "id": "mask_mobile-phone-str-mask_char-str-str",
        "text": "`mask_mobile(phone: str, mask_char: str = \"*\") -> str`",
        "level": 3
      },
      {
        "id": "mask_card-card-str-mask_char-str-str",
        "text": "`mask_card(card: str, mask_char: str = \"*\") -> str`",
        "level": 3
      },
      {
        "id": "mask_national_code-code-str-mask_char-str-str",
        "text": "`mask_national_code(code: str, mask_char: str = \"*\") -> str`",
        "level": 3
      },
      {
        "id": "mask_email-email-str-mask_char-str-str",
        "text": "`mask_email(email: str, mask_char: str = \"*\") -> str`",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/en/api/text.md",
    "counterparts": {
      "fa": "api/text",
      "prs-af": "api/text",
      "tg": "api/text"
    },
    "counterpartSlug": "api/text"
  },
  {
    "id": "en-api-validators",
    "slug": "api/validators",
    "lang": "en",
    "category": "api",
    "title": "Validators API (`parsikit.validators`)",
    "summary": "Validates a 10-digit Iranian National Code using the official modulo-11 checksum formula. Rejects sequences of 10 identical digits when strict=True.",
    "content": "# Validators API (`parsikit.validators`)\n\n## Functions\n\n### `is_valid_national_code(code: str, strict: bool = True) -> bool`\nValidates a 10-digit Iranian National Code using the official modulo-11 checksum formula. Rejects sequences of 10 identical digits when `strict=True`.\n\n### `format_national_code(code: str) -> str`\nFormats a national code in the standard 3-6-1 format (`XXX-XXXXXX-X`).\n\n### `detect_national_code_location(code: str) -> dict | None`\nDetects the issuing province and city based on the first three digits of the national code.\n\n### `is_valid_mobile(phone: str) -> bool`\nValidates an Iranian mobile phone number across all licensed operators.\n\n### `normalize_mobile(phone: str, prefix: str = \"0\") -> str`\nNormalizes mobile numbers into standard national format (`09...`) or international format (`+989...`).\n\n### `detect_mobile_operator(phone: str) -> str | None`\nIdentifies the carrier operator name (`MCI`, `MTN`, `Rightel`, etc.).\n\n### `is_valid_landline(phone: str) -> bool`\nValidates Iranian landline numbers against official provincial area codes.\n\n### `detect_landline_province(phone: str) -> str | None`\nIdentifies the province of an Iranian landline phone number.\n\n### `is_valid_card_number(card: str) -> bool`\nValidates 16-digit bank card numbers using the Luhn algorithm.\n\n### `format_card_number(card: str, separator: str = \"-\") -> str`\nFormats a 16-digit card into four 4-digit groups.\n\n### `detect_bank_from_card(card: str) -> str | None`\nIdentifies the issuing bank based on the first 6 digits (IIN / BIN).\n\n### `is_valid_sheba(sheba: str) -> bool`\nValidates an Iranian IBAN (Sheba) using the ISO 7064 Mod 97-10 checksum algorithm.\n\n### `format_sheba(sheba: str, chunk_size: int = 4) -> str`\nFormats a Sheba string into readable 4-character blocks.\n\n### `detect_bank_from_sheba(sheba: str) -> str | None`\nDetects the bank name from the bank identifier code in the Sheba string.\n\n### `is_valid_postal_code(code: str) -> bool`\nValidates 10-digit Iranian postal codes.\n\n### `format_postal_code(code: str) -> str`\nFormats a postal code into the standard 5-5 layout (`XXXXX-XXXXX`).\n\n### `is_valid_corporate_id(corp_id: str) -> bool`\nValidates 11-digit legal entity corporate registration numbers.\n\n### `is_valid_bill_and_payment(bill_id: str, pay_id: str) -> bool`\nValidates utility bill IDs and payment IDs.\n\n### `extract_bill_details(bill_id: str, pay_id: str) -> dict`\nExtracts bill type, amount in Rials, and billing period.\n\n### `is_valid_plate(plate: str) -> bool`\nValidates Iranian vehicle license plate formats.\n\n### `parse_plate(plate: str) -> dict`\nParses license plate digits, middle letter, and provincial Iran code.\n\n### `detect(text: str) -> str | None`\nAutomatically detects the data type of the input string (`national_code`, `mobile`, `card`, `sheba`, `email`, `url`, `ip`).\n",
    "headings": [
      {
        "id": "validators-api-parsikit-validators",
        "text": "Validators API (`parsikit.validators`)",
        "level": 1
      },
      {
        "id": "functions",
        "text": "Functions",
        "level": 2
      },
      {
        "id": "is_valid_national_code-code-str-strict-bool-true-bool",
        "text": "`is_valid_national_code(code: str, strict: bool = True) -> bool`",
        "level": 3
      },
      {
        "id": "format_national_code-code-str-str",
        "text": "`format_national_code(code: str) -> str`",
        "level": 3
      },
      {
        "id": "detect_national_code_location-code-str-dict-none",
        "text": "`detect_national_code_location(code: str) -> dict | None`",
        "level": 3
      },
      {
        "id": "is_valid_mobile-phone-str-bool",
        "text": "`is_valid_mobile(phone: str) -> bool`",
        "level": 3
      },
      {
        "id": "normalize_mobile-phone-str-prefix-str-0-str",
        "text": "`normalize_mobile(phone: str, prefix: str = \"0\") -> str`",
        "level": 3
      },
      {
        "id": "detect_mobile_operator-phone-str-str-none",
        "text": "`detect_mobile_operator(phone: str) -> str | None`",
        "level": 3
      },
      {
        "id": "is_valid_landline-phone-str-bool",
        "text": "`is_valid_landline(phone: str) -> bool`",
        "level": 3
      },
      {
        "id": "detect_landline_province-phone-str-str-none",
        "text": "`detect_landline_province(phone: str) -> str | None`",
        "level": 3
      },
      {
        "id": "is_valid_card_number-card-str-bool",
        "text": "`is_valid_card_number(card: str) -> bool`",
        "level": 3
      },
      {
        "id": "format_card_number-card-str-separator-str-str",
        "text": "`format_card_number(card: str, separator: str = \"-\") -> str`",
        "level": 3
      },
      {
        "id": "detect_bank_from_card-card-str-str-none",
        "text": "`detect_bank_from_card(card: str) -> str | None`",
        "level": 3
      },
      {
        "id": "is_valid_sheba-sheba-str-bool",
        "text": "`is_valid_sheba(sheba: str) -> bool`",
        "level": 3
      },
      {
        "id": "format_sheba-sheba-str-chunk_size-int-4-str",
        "text": "`format_sheba(sheba: str, chunk_size: int = 4) -> str`",
        "level": 3
      },
      {
        "id": "detect_bank_from_sheba-sheba-str-str-none",
        "text": "`detect_bank_from_sheba(sheba: str) -> str | None`",
        "level": 3
      },
      {
        "id": "is_valid_postal_code-code-str-bool",
        "text": "`is_valid_postal_code(code: str) -> bool`",
        "level": 3
      },
      {
        "id": "format_postal_code-code-str-str",
        "text": "`format_postal_code(code: str) -> str`",
        "level": 3
      },
      {
        "id": "is_valid_corporate_id-corp_id-str-bool",
        "text": "`is_valid_corporate_id(corp_id: str) -> bool`",
        "level": 3
      },
      {
        "id": "is_valid_bill_and_payment-bill_id-str-pay_id-str-bool",
        "text": "`is_valid_bill_and_payment(bill_id: str, pay_id: str) -> bool`",
        "level": 3
      },
      {
        "id": "extract_bill_details-bill_id-str-pay_id-str-dict",
        "text": "`extract_bill_details(bill_id: str, pay_id: str) -> dict`",
        "level": 3
      },
      {
        "id": "is_valid_plate-plate-str-bool",
        "text": "`is_valid_plate(plate: str) -> bool`",
        "level": 3
      },
      {
        "id": "parse_plate-plate-str-dict",
        "text": "`parse_plate(plate: str) -> dict`",
        "level": 3
      },
      {
        "id": "detect-text-str-str-none",
        "text": "`detect(text: str) -> str | None`",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/en/api/validators.md",
    "counterparts": {
      "fa": "api/validators",
      "prs-af": "api/validators",
      "tg": "api/validators"
    },
    "counterpartSlug": "api/validators"
  },
  {
    "id": "en-faq",
    "slug": "faq",
    "lang": "en",
    "category": "getting-started",
    "title": "Frequently Asked Questions (FAQ)",
    "summary": "ParsiKit supports Python 3.10 and newer (including 3.10, 3.11, 3.12, and 3.13).",
    "content": "# Frequently Asked Questions (FAQ)\n\n### 1. Which Python versions does ParsiKit support?\nParsiKit supports Python **3.10 and newer** (including 3.10, 3.11, 3.12, and 3.13).\n\n---\n\n### 2. Does ParsiKit have external dependencies?\nNo. ParsiKit is 100% pure Python with zero external runtime dependencies. It installs instantly and has minimal overhead.\n\n---\n\n### 3. How does ParsiKit differ from Hazm or PersianJS?\n- **Hazm** is focused on Natural Language Processing (NLP), part-of-speech tagging, and morphological analysis.\n- **ParsiKit** is a full software infrastructure library for real-world web applications, financial software, database normalization, national ID validation, and secure PII handling.\n\n---\n\n### 4. Is ParsiKit thread-safe?\nYes. Global configurations and the internal cache use Python's re-entrant locks (`threading.RLock`) to guarantee thread safety in multi-threaded application servers like Gunicorn and Uvicorn.\n\n---\n\n### 5. Does ParsiKit expose sensitive customer data in logs?\nNo. In v3.3.1, exceptions like `InvalidCardNumberError` sanitize messages, and all domain models provide a `.masked` property for safe logging and administration dashboards.\n\n---\n\n### 6. What is the software license?\nParsiKit is licensed under the permissive **MIT License**. You are free to use it in commercial, open-source, and private projects.\n",
    "headings": [
      {
        "id": "frequently-asked-questions-faq",
        "text": "Frequently Asked Questions (FAQ)",
        "level": 1
      },
      {
        "id": "1-which-python-versions-does-parsikit-support",
        "text": "1. Which Python versions does ParsiKit support?",
        "level": 3
      },
      {
        "id": "2-does-parsikit-have-external-dependencies",
        "text": "2. Does ParsiKit have external dependencies?",
        "level": 3
      },
      {
        "id": "3-how-does-parsikit-differ-from-hazm-or-persianjs",
        "text": "3. How does ParsiKit differ from Hazm or PersianJS?",
        "level": 3
      },
      {
        "id": "4-is-parsikit-thread-safe",
        "text": "4. Is ParsiKit thread-safe?",
        "level": 3
      },
      {
        "id": "5-does-parsikit-expose-sensitive-customer-data-in-logs",
        "text": "5. Does ParsiKit expose sensitive customer data in logs?",
        "level": 3
      },
      {
        "id": "6-what-is-the-software-license",
        "text": "6. What is the software license?",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/en/faq.md",
    "counterparts": {
      "fa": "faq",
      "prs-af": "faq",
      "tg": "faq"
    },
    "counterpartSlug": "faq"
  },
  {
    "id": "en-guides-forms_and_security",
    "slug": "guides/forms_and_security",
    "lang": "en",
    "category": "guides",
    "title": "Guide: Form Validation & Sensitive Data Security",
    "summary": "Handling Personally Identifiable Information (PII) such as national identification numbers, credit card numbers, and phone numbers requires strict security controls to prevent exposure in application ",
    "content": "# Guide: Form Validation & Sensitive Data Security\n\nHandling Personally Identifiable Information (PII) such as national identification numbers, credit card numbers, and phone numbers requires strict security controls to prevent exposure in application logs, APM systems, and customer service dashboards.\n\n---\n\n## 1. Input Sanitization Before Storage\n\nAlways sanitize text input from web forms before storing it in databases:\n\n```python\nimport parsikit\n\ndef sanitize_user_input(raw_full_name: str, raw_address: str):\n    return {\n        \"full_name\": parsikit.clean_text(raw_full_name),\n        \"address\": parsikit.beautify_persian_spacing(parsikit.clean_text(raw_address)),\n    }\n```\n\n---\n\n## 2. Preventing PII Leakage in Logs\n\nWhen logging user transactions, NEVER log raw card numbers or national codes. Use the `.masked` property or `mask_*` functions:\n\n```python\nimport logging\nimport parsikit\n\nlogger = logging.getLogger(\"payment\")\n\ndef process_payment(card_number_raw: str, national_code_raw: str):\n    card = parsikit.BankCard(card_number_raw)\n    nc = parsikit.NationalCode(national_code_raw)\n\n    # SECURE: Log only masked representations\n    logger.info(\n        \"Initiating payment for user (National Code: %s) using Card: %s (%s)\",\n        nc.masked,\n        card.masked,\n        card.bank_name,\n    )\n```\n\n---\n\n## 3. Safe Exception Handling\n\nIn ParsiKit v3.3.1, exceptions like `InvalidCardNumberError` and `InvalidNationalCodeError` are sanitized by default so they do not print the raw secret card number into stack traces or Sentry events.\n\n```python\nimport parsikit\n\ntry:\n    card = parsikit.BankCard(\"6037991122339999\")  # Invalid Luhn\nexcept parsikit.InvalidCardNumberError as exc:\n    # exc message is safe and contains no sensitive PII\n    logger.warning(\"Payment validation failed: %s\", exc)\n```\n",
    "headings": [
      {
        "id": "guide-form-validation-sensitive-data-security",
        "text": "Guide: Form Validation & Sensitive Data Security",
        "level": 1
      },
      {
        "id": "1-input-sanitization-before-storage",
        "text": "1. Input Sanitization Before Storage",
        "level": 2
      },
      {
        "id": "2-preventing-pii-leakage-in-logs",
        "text": "2. Preventing PII Leakage in Logs",
        "level": 2
      },
      {
        "id": "secure-log-only-masked-representations",
        "text": "SECURE: Log only masked representations",
        "level": 1
      },
      {
        "id": "3-safe-exception-handling",
        "text": "3. Safe Exception Handling",
        "level": 2
      },
      {
        "id": "exc-message-is-safe-and-contains-no-sensitive-pii",
        "text": "exc message is safe and contains no sensitive PII",
        "level": 1
      }
    ],
    "filePath": "/app/applet/repo_data/docs/en/guides/forms_and_security.md",
    "counterparts": {
      "fa": "guides/forms_and_security",
      "prs-af": "guides/forms_and_security",
      "tg": "guides/forms_and_security"
    },
    "counterpartSlug": "guides/forms_and_security"
  },
  {
    "id": "en-guides-gui_integration",
    "slug": "guides/gui_integration",
    "lang": "en",
    "category": "guides",
    "title": "Guide: Desktop GUI & Graphics Integration",
    "summary": "Rendering Persian text in desktop applications (Tkinter, PyQt, PySide, CustomTkinter) or graphics pipelines (Pillow / PIL, OpenCV, ReportLab) requires specific adaptations for cursive shaping and righ",
    "content": "# Guide: Desktop GUI & Graphics Integration\n\nRendering Persian text in desktop applications (Tkinter, PyQt, PySide, CustomTkinter) or graphics pipelines (Pillow / PIL, OpenCV, ReportLab) requires specific adaptations for cursive shaping and right-to-left bidirectional (BiDi) display.\n\n---\n\n## 1. Graphics Engines & Image Generation (Pillow / OpenCV)\n\nWithout shaping, Persian letters render disconnected from left-to-right. Use `reshape_for_graphics`:\n\n```python\nfrom PIL import Image, ImageDraw, ImageFont\nimport parsikit\n\n# Create a blank image\nimage = Image.new(\"RGB\", (600, 200), color=(255, 255, 255))\ndraw = ImageDraw.Draw(image)\n\n# Reshape Persian text (BiDi and cursive glyph joining)\ntext = \"سامانه هوشمند مدیریت اسناد پارسی\"\nreshaped = parsikit.reshape_for_graphics(text)\n\n# Render to canvas\n# font = ImageFont.truetype(\"Vazirmatn-Bold.ttf\", 32)\n# draw.text((50, 80), reshaped, font=font, fill=(0, 0, 0))\n```\n\n---\n\n## 2. Multi-Line Paragraphs (`reshape_paragraph_for_graphics`)\n\nFor multi-line text boxes in graphics rendering, wrap each line with consistent width:\n\n```python\nimport parsikit\n\nparagraph = (\n    \"کتابخانه پارسی‌کیت مجموعه‌ای از ابزارهای استانداردسازی و \"\n    \"اعتبارسنجی داده‌های فارسی برای توسعه‌دهندگان پایتون است.\"\n)\n\nwrapped = parsikit.reshape_paragraph_for_graphics(paragraph, max_chars_per_line=30)\n# Returns formatted lines ready for drawing\n```\n\n---\n\n## 3. Real-Time Typing Helper in Tkinter / CustomTkinter\n\nAutomatically normalize Persian text as the user types:\n\n```python\nimport tkinter as tk\nimport parsikit\n\nroot = tk.Tk()\nentry = tk.Entry(root, font=(\"Vazirmatn\", 14))\nentry.pack(padx=20, pady=20)\n\n# Bind automated Persian keyboard conversion & character fixing\nparsikit.bind_persian_input(entry)\n\nroot.mainloop()\n```\n",
    "headings": [
      {
        "id": "guide-desktop-gui-graphics-integration",
        "text": "Guide: Desktop GUI & Graphics Integration",
        "level": 1
      },
      {
        "id": "1-graphics-engines-image-generation-pillow-opencv",
        "text": "1. Graphics Engines & Image Generation (Pillow / OpenCV)",
        "level": 2
      },
      {
        "id": "create-a-blank-image",
        "text": "Create a blank image",
        "level": 1
      },
      {
        "id": "reshape-persian-text-bidi-and-cursive-glyph-joining",
        "text": "Reshape Persian text (BiDi and cursive glyph joining)",
        "level": 1
      },
      {
        "id": "render-to-canvas",
        "text": "Render to canvas",
        "level": 1
      },
      {
        "id": "font-imagefont-truetype-vazirmatn-bold-ttf-32",
        "text": "font = ImageFont.truetype(\"Vazirmatn-Bold.ttf\", 32)",
        "level": 1
      },
      {
        "id": "draw-text-50-80-reshaped-font-font-fill-0-0-0",
        "text": "draw.text((50, 80), reshaped, font=font, fill=(0, 0, 0))",
        "level": 1
      },
      {
        "id": "2-multi-line-paragraphs-reshape_paragraph_for_graphics",
        "text": "2. Multi-Line Paragraphs (`reshape_paragraph_for_graphics`)",
        "level": 2
      },
      {
        "id": "returns-formatted-lines-ready-for-drawing",
        "text": "Returns formatted lines ready for drawing",
        "level": 1
      },
      {
        "id": "3-real-time-typing-helper-in-tkinter-customtkinter",
        "text": "3. Real-Time Typing Helper in Tkinter / CustomTkinter",
        "level": 2
      },
      {
        "id": "bind-automated-persian-keyboard-conversion-character-fixing",
        "text": "Bind automated Persian keyboard conversion & character fixing",
        "level": 1
      }
    ],
    "filePath": "/app/applet/repo_data/docs/en/guides/gui_integration.md",
    "counterparts": {
      "fa": "guides/gui_integration"
    },
    "counterpartSlug": "guides/gui_integration"
  },
  {
    "id": "en-guides-web_backends",
    "slug": "guides/web_backends",
    "lang": "en",
    "category": "guides",
    "title": "Guide: Web Backends (FastAPI & Django Integration)",
    "summary": "This guide shows how to integrate ParsiKit into production web backends.",
    "content": "# Guide: Web Backends (FastAPI & Django Integration)\n\nThis guide shows how to integrate ParsiKit into production web backends.\n\n---\n\n## 1. FastAPI Integration\n\nBecause ParsiKit domain models natively support Pydantic v2 core schemas, you can declare them directly as request body or query parameter types.\n\n```python\nfrom fastapi import FastAPI, HTTPException\nimport parsikit\n\napp = FastAPI(title=\"Iranian E-Commerce API\")\n\nfrom pydantic import BaseModel\n\nclass CheckoutRequest(BaseModel):\n    customer_name: str\n    national_code: parsikit.NationalCode\n    mobile: parsikit.MobileNumber\n    sheba: parsikit.Sheba\n\n@app.post(\"/api/checkout\")\ndef checkout(payload: CheckoutRequest):\n    # Data is already guaranteed valid when execution reaches here!\n    return {\n        \"status\": \"success\",\n        \"customer\": parsikit.standardize_persian(payload.customer_name),\n        \"national_code_masked\": payload.national_code.masked,\n        \"mobile\": payload.mobile.national,\n        \"bank\": payload.sheba.bank_name,\n    }\n```\n\n---\n\n## 2. Django Model & Form Validation\n\nIn Django, use ParsiKit validators inside clean methods or custom model fields:\n\n```python\nfrom django.core.exceptions import ValidationError\nfrom django.db import models\nimport parsikit\n\nclass IranianNationalCodeField(models.CharField):\n    description = \"Iranian 10-digit National Code\"\n\n    def __init__(self, *args, **kwargs):\n        kwargs['max_length'] = 10\n        super().__init__(*args, **kwargs)\n\n    def validate(self, value, model_instance):\n        super().validate(value, model_instance)\n        if not parsikit.is_valid_national_code(value):\n            raise ValidationError(\n                f\"کد ملی وارد شده معتبر نمی‌باشد.\",\n                code=\"invalid_national_code\"\n            )\n```\n\n---\n\n## 3. Database Query Normalization Middleware\n\nTo ensure search queries match records in PostgreSQL or MySQL regardless of whether the user typed Arabic Yeh (`ي`) or Persian Yeh (`ی`):\n\n```python\ndef normalize_search_query(user_query: str) -> str:\n    clean = parsikit.standardize_persian(user_query, strip_diacritics_opt=True)\n    return clean\n```\n",
    "headings": [
      {
        "id": "guide-web-backends-fastapi-django-integration",
        "text": "Guide: Web Backends (FastAPI & Django Integration)",
        "level": 1
      },
      {
        "id": "1-fastapi-integration",
        "text": "1. FastAPI Integration",
        "level": 2
      },
      {
        "id": "data-is-already-guaranteed-valid-when-execution-reaches-here",
        "text": "Data is already guaranteed valid when execution reaches here!",
        "level": 1
      },
      {
        "id": "2-django-model-form-validation",
        "text": "2. Django Model & Form Validation",
        "level": 2
      },
      {
        "id": "3-database-query-normalization-middleware",
        "text": "3. Database Query Normalization Middleware",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/en/guides/web_backends.md",
    "counterparts": {
      "fa": "guides/web_backends"
    },
    "counterpartSlug": "guides/web_backends"
  },
  {
    "id": "en-index",
    "slug": "index",
    "lang": "en",
    "category": "getting-started",
    "title": "ParsiKit Official Documentation (v3.3.1)",
    "summary": "Welcome to the official documentation for ParsiKit!",
    "content": "# ParsiKit Official Documentation (v3.3.1)\n\nWelcome to the official documentation for **ParsiKit**!  \nCreated and maintained by **Ali Kamrani (MRThugh)**, ParsiKit is a pure Python software infrastructure library designed for Persian data standardization, validation algorithms, financial computations, astronomical Jalali calendar transformations, graphical font reshaping, developer diagnostics, and sensitive data protection.\n\n---\n\n## What is ParsiKit?\n\nParsiKit solves standard challenges encountered when handling Persian text and Iranian data in Python:\n- **Text & Typography Standardization**: Converts Arabic letters (ي/ك/ة) to standard Persian glyphs, correctly positions Zero-Width Non-Joiners (ZWNJ) for prefixes (`می‌`) and suffixes (`‌ها`), eliminates redundant whitespace, and strips diacritics.\n- **Official National Validations**: Checks mathematical checksum algorithms for Iranian National Codes (modulo 11), 16-digit debit/credit card numbers (Luhn check), Sheba IBANs (ISO 7064 Mod 97-10), mobile phones, fixed landlines, corporate IDs, postal codes, bills, and vehicle plates.\n- **Numbers & Currencies**: Translates numerals between Persian, Arabic, and Latin scripts, converts huge numbers into Persian words, performs Rial and Toman conversions, computes VAT, and calculates loan installments.\n- **Astronomical Jalali Dates**: Bidirectional date conversions between Gregorian and Jalali calendars with leap year validation and relative-time humanization.\n- **Object-Oriented Domain Models**: Rich value objects (`PersianText`, `NationalCode`, `MobileNumber`, `BankCard`, `Sheba`, `VehiclePlate`) with instant validation, masked views, and native Pydantic v2 support.\n- **Security & Privacy**: Masking helpers (`mask_card`, `mask_mobile`, `mask_national_code`, `mask_email`) and sanitized exceptions to prevent PII exposure in logs and metrics.\n- **Zero External Dependencies**: Pure Python, zero compile steps, minimal memory footprint.\n\n---\n\n## What ParsiKit Does NOT Do\n\n1. **Identity Inquiries (Registration Office / Civil Registry)**:  \n   `is_valid_national_code` mathematically verifies length and checksum against the official algorithm. It does not call an online governmental web service to verify the person's identity or living status.\n2. **Bank Balance or Live Account Status**:  \n   `BankCard` and `Sheba` verify format, check digits, and issuer bank identity. They do not connect to banking APIs to check available balance or card blocking status.\n\n---\n\n## Documentation Navigation\n\n- 🚀 **[Installation](installation.md)** — Install via pip or from source.\n- ⚡ **[Quickstart](quickstart.md)** — Practical examples in 5 minutes.\n- 📚 **Step-by-Step Tutorials:**\n  - [Text Processing & ZWNJ](tutorials/text_processing.md)\n  - [Validation & Checksums](tutorials/validation.md)\n  - [Numbers & Financial Operations](tutorials/numbers_and_currency.md)\n  - [Jalali Calendar & Humanized Time](tutorials/datetime.md)\n  - [Object-Oriented Models & Pydantic](tutorials/models.md)\n- 🛠 **Guides:**\n  - [Web Backends (FastAPI & Django)](guides/web_backends.md)\n  - [Forms & Security Best Practices](guides/forms_and_security.md)\n  - [GUI Integration (Tkinter, CustomTkinter, Graphics)](guides/gui_integration.md)\n- 📖 **[API Reference](api/index.md)** — Complete module and function reference.\n- 🔧 **[Troubleshooting](troubleshooting.md)** — Solutions to common issues.\n- ❓ **[FAQ](faq.md)** — Frequently Asked Questions.\n",
    "headings": [
      {
        "id": "parsikit-official-documentation-v3-3-1",
        "text": "ParsiKit Official Documentation (v3.3.1)",
        "level": 1
      },
      {
        "id": "what-is-parsikit",
        "text": "What is ParsiKit?",
        "level": 2
      },
      {
        "id": "what-parsikit-does-not-do",
        "text": "What ParsiKit Does NOT Do",
        "level": 2
      },
      {
        "id": "documentation-navigation",
        "text": "Documentation Navigation",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/en/index.md",
    "counterparts": {
      "fa": "index",
      "prs-af": "index",
      "tg": "index"
    },
    "counterpartSlug": "index"
  },
  {
    "id": "en-installation",
    "slug": "installation",
    "lang": "en",
    "category": "getting-started",
    "title": "Installation Guide",
    "summary": "ParsiKit requires Python 3.10 or higher. It has no external dependencies.",
    "content": "# Installation Guide\n\nParsiKit requires Python **3.10** or higher. It has no external dependencies.\n\n---\n\n## 1. Install via PyPI\n\n```bash\npip install parsikit\n```\n\nTo upgrade to the latest stable release:\n```bash\npip install --upgrade parsikit\n```\n\n---\n\n## 2. Install in Virtual Environments\n\n### Using `venv`\n```bash\npython3 -m venv .venv\nsource .venv/bin/activate  # On Windows: .venv\\Scripts\\activate\npip install parsikit\n```\n\n### Using Poetry\n```bash\npoetry add parsikit\n```\n\n### Using uv\n```bash\nuv pip install parsikit\n```\n\n---\n\n## 3. Install from Source\n\n```bash\ngit clone https://github.com/MRThugh/ParsiKit.git\ncd ParsiKit\npip install -e .\n```\n\n---\n\n## 4. Verification\n\nRun the following command to verify installation:\n\n```bash\npython3 -c \"import parsikit; print('ParsiKit version:', parsikit.__version__)\"\n```\n",
    "headings": [
      {
        "id": "installation-guide",
        "text": "Installation Guide",
        "level": 1
      },
      {
        "id": "1-install-via-pypi",
        "text": "1. Install via PyPI",
        "level": 2
      },
      {
        "id": "2-install-in-virtual-environments",
        "text": "2. Install in Virtual Environments",
        "level": 2
      },
      {
        "id": "using-venv",
        "text": "Using `venv`",
        "level": 3
      },
      {
        "id": "using-poetry",
        "text": "Using Poetry",
        "level": 3
      },
      {
        "id": "using-uv",
        "text": "Using uv",
        "level": 3
      },
      {
        "id": "3-install-from-source",
        "text": "3. Install from Source",
        "level": 2
      },
      {
        "id": "4-verification",
        "text": "4. Verification",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/en/installation.md",
    "counterparts": {
      "fa": "installation",
      "prs-af": "installation",
      "tg": "installation"
    },
    "counterpartSlug": "installation"
  },
  {
    "id": "en-quickstart",
    "slug": "quickstart",
    "lang": "en",
    "category": "getting-started",
    "title": "ParsiKit Quickstart Guide",
    "summary": "Get up and running with ParsiKit in less than 5 minutes.",
    "content": "# ParsiKit Quickstart Guide\n\nGet up and running with ParsiKit in less than 5 minutes.\n\n---\n\n## 1. Text Normalization & Standardization\n\n```python\nimport parsikit\n\n# Fix Arabic letters and irregular spacing\nraw_text = \"ي كافيه كتاب ها رو برداري و بري\"\nclean_text = parsikit.standardize_persian(raw_text)\n\nprint(clean_text)\n# Output: ی کافیه کتاب‌ها رو برداری و بری\n```\n\n---\n\n## 2. Iranian National Code (کد ملی)\n\n```python\nimport parsikit\n\ncode = \"0010123458\"\nnc = parsikit.NationalCode(code)\n\nprint(nc.is_valid)   # True\nprint(nc.formatted)  # '001-012345-8'\nprint(nc.masked)     # '001-****45-8'\nprint(nc.location)   # {'province': 'تهران', 'city': 'تهران مرکزی'}\n```\n\n---\n\n## 3. Numbers & Currency\n\n```python\nimport parsikit\n\namount = 1500000\n\n# Format with Persian digits and separator\nformatted = parsikit.format_currency(amount, \"toman\", persian_digits=True)\nprint(formatted)\n# Output: ۱،۵۰۰،۰۰۰ تومان\n\n# Convert to written words\nwords = parsikit.number_to_words(amount)\nprint(f\"{words} تومان\")\n# Output: یک میلیون و پانصد هزار تومان\n```\n\n---\n\n## 4. Jalali Astronomical Dates\n\n```python\nimport parsikit\n\n# Convert Gregorian to Jalali\njy, jm, jd = parsikit.gregorian_to_jalali(2026, 7, 6)\nmonth_name = parsikit.get_jalali_month_name(jm)\nprint(f\"{jd} {month_name} {jy}\")\n# Output: 15 تیر 1405\n\n# Humanize relative time\nprint(parsikit.humanize_relative_time(-300))\n# Output: ۵ دقیقه پیش\n```\n\n---\n\n## 5. Mobile Numbers & Bank Cards\n\n```python\nimport parsikit\n\n# Mobile number\nmobile = parsikit.MobileNumber(\"09123456789\")\nprint(mobile.international)  # '+989123456789'\nprint(mobile.operator)       # 'MCI'\nprint(mobile.masked)         # '0912***6789'\n\n# Bank card\ncard = parsikit.BankCard(\"6037991122334455\")\nprint(card.bank_name)        # 'بانک ملی ایران'\nprint(card.formatted)        # '6037-9911-2233-4455'\nprint(card.masked)           # '6037-99**-****-4455'\n```\n",
    "headings": [
      {
        "id": "parsikit-quickstart-guide",
        "text": "ParsiKit Quickstart Guide",
        "level": 1
      },
      {
        "id": "1-text-normalization-standardization",
        "text": "1. Text Normalization & Standardization",
        "level": 2
      },
      {
        "id": "fix-arabic-letters-and-irregular-spacing",
        "text": "Fix Arabic letters and irregular spacing",
        "level": 1
      },
      {
        "id": "output-ی-کافیه-کتاب-ها-رو-برداری-و-بری",
        "text": "Output: ی کافیه کتاب‌ها رو برداری و بری",
        "level": 1
      },
      {
        "id": "2-iranian-national-code-کد-ملی",
        "text": "2. Iranian National Code (کد ملی)",
        "level": 2
      },
      {
        "id": "3-numbers-currency",
        "text": "3. Numbers & Currency",
        "level": 2
      },
      {
        "id": "format-with-persian-digits-and-separator",
        "text": "Format with Persian digits and separator",
        "level": 1
      },
      {
        "id": "output-۱،۵۰۰،۰۰۰-تومان",
        "text": "Output: ۱،۵۰۰،۰۰۰ تومان",
        "level": 1
      },
      {
        "id": "convert-to-written-words",
        "text": "Convert to written words",
        "level": 1
      },
      {
        "id": "output-یک-میلیون-و-پانصد-هزار-تومان",
        "text": "Output: یک میلیون و پانصد هزار تومان",
        "level": 1
      },
      {
        "id": "4-jalali-astronomical-dates",
        "text": "4. Jalali Astronomical Dates",
        "level": 2
      },
      {
        "id": "convert-gregorian-to-jalali",
        "text": "Convert Gregorian to Jalali",
        "level": 1
      },
      {
        "id": "output-15-تیر-1405",
        "text": "Output: 15 تیر 1405",
        "level": 1
      },
      {
        "id": "humanize-relative-time",
        "text": "Humanize relative time",
        "level": 1
      },
      {
        "id": "output-۵-دقیقه-پیش",
        "text": "Output: ۵ دقیقه پیش",
        "level": 1
      },
      {
        "id": "5-mobile-numbers-bank-cards",
        "text": "5. Mobile Numbers & Bank Cards",
        "level": 2
      },
      {
        "id": "mobile-number",
        "text": "Mobile number",
        "level": 1
      },
      {
        "id": "bank-card",
        "text": "Bank card",
        "level": 1
      }
    ],
    "filePath": "/app/applet/repo_data/docs/en/quickstart.md",
    "counterparts": {
      "fa": "quickstart",
      "prs-af": "quickstart",
      "tg": "quickstart"
    },
    "counterpartSlug": "quickstart"
  },
  {
    "id": "en-troubleshooting",
    "slug": "troubleshooting",
    "lang": "en",
    "category": "getting-started",
    "title": "Troubleshooting Guide (English)",
    "summary": "Solutions to common issues encountered when using ParsiKit.",
    "content": "# Troubleshooting Guide (English)\n\nSolutions to common issues encountered when using ParsiKit.\n\n---\n\n## 1. SyntaxError in Python 3.10 / 3.11\n\n### Problem\nPrior to Python 3.12, backslashes inside f-string expressions were prohibited by the Python grammar (PEP 701). In ParsiKit v3.3.0, a line in `parsikit.dev.debug_text` triggered this syntax error on Python 3.10 and 3.11.\n\n### Solution\nThis issue is fixed in ParsiKit v3.3.1. Upgrade to v3.3.1:\n```bash\npip install --upgrade parsikit\n```\n\n---\n\n## 2. Garbled Characters in Console or Terminal\n\n### Problem\nTerminal does not default to UTF-8 output encoding, causing Persian characters to render as question marks or mojibake.\n\n### Solution\nEnsure UTF-8 encoding is enabled in your environment:\n\nLinux/macOS:\n```bash\nexport PYTHONIOENCODING=utf-8\n```\n\nWindows PowerShell:\n```powershell\n$env:PYTHONIOENCODING=\"utf-8\"\n[Console]::OutputEncoding = [System.Text.Encoding]::UTF8\n```\n\n---\n\n## 3. Disconnected or Reversed Persian in Pillow / OpenCV\n\n### Problem\n2D rendering engines render Persian characters disconnected from left-to-right because they lack cursive Arabic text shaping and Unicode Bidirectional (BiDi) algorithm support.\n\n### Solution\nUse `parsikit.reshape_for_graphics`:\n```python\nimport parsikit\n\nraw = \"پردازش تصویر\"\nreshaped = parsikit.reshape_for_graphics(raw)\n# Pass reshaped to draw.text(...)\n```\n\n---\n\n## 4. `InvalidNationalCodeError` on 10-Digit Inputs\n\n### Problem\nA 10-digit number may still be rejected if:\n1. It consists of 10 identical digits (e.g. `1111111111`).\n2. Its 10th digit does not match the modulo-11 checksum calculated from the first 9 digits.\n\n### Solution\nEnsure test fixtures use mathematically valid check digits (e.g. for prefix `001012345`, the valid check digit is `8`: `0010123458`).\n",
    "headings": [
      {
        "id": "troubleshooting-guide-english",
        "text": "Troubleshooting Guide (English)",
        "level": 1
      },
      {
        "id": "1-syntaxerror-in-python-3-10-3-11",
        "text": "1. SyntaxError in Python 3.10 / 3.11",
        "level": 2
      },
      {
        "id": "problem",
        "text": "Problem",
        "level": 3
      },
      {
        "id": "solution",
        "text": "Solution",
        "level": 3
      },
      {
        "id": "2-garbled-characters-in-console-or-terminal",
        "text": "2. Garbled Characters in Console or Terminal",
        "level": 2
      },
      {
        "id": "problem",
        "text": "Problem",
        "level": 3
      },
      {
        "id": "solution",
        "text": "Solution",
        "level": 3
      },
      {
        "id": "3-disconnected-or-reversed-persian-in-pillow-opencv",
        "text": "3. Disconnected or Reversed Persian in Pillow / OpenCV",
        "level": 2
      },
      {
        "id": "problem",
        "text": "Problem",
        "level": 3
      },
      {
        "id": "solution",
        "text": "Solution",
        "level": 3
      },
      {
        "id": "pass-reshaped-to-draw-text",
        "text": "Pass reshaped to draw.text(...)",
        "level": 1
      },
      {
        "id": "4-invalidnationalcodeerror-on-10-digit-inputs",
        "text": "4. `InvalidNationalCodeError` on 10-Digit Inputs",
        "level": 2
      },
      {
        "id": "problem",
        "text": "Problem",
        "level": 3
      },
      {
        "id": "solution",
        "text": "Solution",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/en/troubleshooting.md",
    "counterparts": {
      "fa": "troubleshooting",
      "prs-af": "troubleshooting",
      "tg": "troubleshooting"
    },
    "counterpartSlug": "troubleshooting"
  },
  {
    "id": "en-tutorials-datetime",
    "slug": "tutorials/datetime",
    "lang": "en",
    "category": "tutorials",
    "title": "Tutorial: Jalali (Solar Hijri) Dates & Relative Time",
    "summary": "The Jalali calendar is the official solar astronomical calendar used in Iran and Afghanistan. ParsiKit provides pure-Python astronomical conversion algorithms with zero dependencies.",
    "content": "# Tutorial: Jalali (Solar Hijri) Dates & Relative Time\n\nThe Jalali calendar is the official solar astronomical calendar used in Iran and Afghanistan. ParsiKit provides pure-Python astronomical conversion algorithms with zero dependencies.\n\n---\n\n## 1. Gregorian to Jalali Conversion\n\n```python\nimport parsikit\n\n# Convert Gregorian date (Year, Month, Day)\njy, jm, jd = parsikit.gregorian_to_jalali(2026, 7, 6)\nprint(f\"Jalali date: {jy}/{jm:02d}/{jd:02d}\")\n# Output: Jalali date: 1405/04/15\n\n# Persian month name\nmonth_name = parsikit.get_jalali_month_name(jm)\nprint(f\"{jd} {month_name} {jy}\")\n# Output: 15 تیر 1405\n```\n\n---\n\n## 2. Jalali to Gregorian Conversion\n\n```python\nimport parsikit\n\n# Convert Jalali date back to Gregorian\ngy, gm, gd = parsikit.jalali_to_gregorian(1405, 4, 15)\nprint(f\"Gregorian date: {gy}-{gm:02d}-{gd:02d}\")\n# Output: Gregorian date: 2026-07-06\n```\n\n---\n\n## 3. Jalali Leap Years (سال کبیسه)\n\nIn the Jalali calendar, a normal year has 365 days (months 1-6 have 31 days, 7-11 have 30 days, and month 12 has 29 days). A leap year has 366 days, with month 12 (Esfand) having 30 days.\n\n```python\nimport parsikit\n\n# Check astronomical leap years\nprint(parsikit.is_jalali_leap(1399))  # True\nprint(parsikit.is_jalali_leap(1400))  # False\nprint(parsikit.is_jalali_leap(1403))  # True\nprint(parsikit.is_jalali_leap(1404))  # False\n```\n\n---\n\n## 4. Humanized Relative Time\n\nTurn timestamps or second offsets into natural Persian strings:\n\n```python\nimport datetime\nimport parsikit\n\nnow = datetime.datetime.now()\n\n# 5 minutes ago\nprint(parsikit.humanize_relative_time(-300))\n# Output: ۵ دقیقه پیش\n\n# 3 hours ago\nprint(parsikit.humanize_relative_time(-10800))\n# Output: ۴ ساعت پیش\n\n# In 2 days\nprint(parsikit.humanize_relative_time(2 * 86400))\n# Output: پس‌فردا\n```\n",
    "headings": [
      {
        "id": "tutorial-jalali-solar-hijri-dates-relative-time",
        "text": "Tutorial: Jalali (Solar Hijri) Dates & Relative Time",
        "level": 1
      },
      {
        "id": "1-gregorian-to-jalali-conversion",
        "text": "1. Gregorian to Jalali Conversion",
        "level": 2
      },
      {
        "id": "convert-gregorian-date-year-month-day",
        "text": "Convert Gregorian date (Year, Month, Day)",
        "level": 1
      },
      {
        "id": "output-jalali-date-1405-04-15",
        "text": "Output: Jalali date: 1405/04/15",
        "level": 1
      },
      {
        "id": "persian-month-name",
        "text": "Persian month name",
        "level": 1
      },
      {
        "id": "output-15-تیر-1405",
        "text": "Output: 15 تیر 1405",
        "level": 1
      },
      {
        "id": "2-jalali-to-gregorian-conversion",
        "text": "2. Jalali to Gregorian Conversion",
        "level": 2
      },
      {
        "id": "convert-jalali-date-back-to-gregorian",
        "text": "Convert Jalali date back to Gregorian",
        "level": 1
      },
      {
        "id": "output-gregorian-date-2026-07-06",
        "text": "Output: Gregorian date: 2026-07-06",
        "level": 1
      },
      {
        "id": "3-jalali-leap-years-سال-کبیسه",
        "text": "3. Jalali Leap Years (سال کبیسه)",
        "level": 2
      },
      {
        "id": "check-astronomical-leap-years",
        "text": "Check astronomical leap years",
        "level": 1
      },
      {
        "id": "4-humanized-relative-time",
        "text": "4. Humanized Relative Time",
        "level": 2
      },
      {
        "id": "5-minutes-ago",
        "text": "5 minutes ago",
        "level": 1
      },
      {
        "id": "output-۵-دقیقه-پیش",
        "text": "Output: ۵ دقیقه پیش",
        "level": 1
      },
      {
        "id": "3-hours-ago",
        "text": "3 hours ago",
        "level": 1
      },
      {
        "id": "output-۴-ساعت-پیش",
        "text": "Output: ۴ ساعت پیش",
        "level": 1
      },
      {
        "id": "in-2-days",
        "text": "In 2 days",
        "level": 1
      },
      {
        "id": "output-پس-فردا",
        "text": "Output: پس‌فردا",
        "level": 1
      }
    ],
    "filePath": "/app/applet/repo_data/docs/en/tutorials/datetime.md",
    "counterparts": {
      "fa": "tutorials/datetime",
      "prs-af": "tutorials/datetime",
      "tg": "tutorials/datetime"
    },
    "counterpartSlug": "tutorials/datetime"
  },
  {
    "id": "en-tutorials-models",
    "slug": "tutorials/models",
    "lang": "en",
    "category": "tutorials",
    "title": "Tutorial: Object-Oriented Domain Models",
    "summary": "ParsiKit provides rich domain value objects that wrap raw strings into structured, validated Python objects.",
    "content": "# Tutorial: Object-Oriented Domain Models\n\nParsiKit provides rich domain value objects that wrap raw strings into structured, validated Python objects.\n\n---\n\n## 1. Domain Models Overview\n\nEach model validates input on initialization and raises a structured exception if invalid:\n\n| Model | Target Data | Exception on Invalid Input |\n|---|---|---|\n| `NationalCode` | Iranian National Code (10 digits) | `InvalidNationalCodeError` |\n| `MobileNumber` | Iranian mobile phone numbers | `InvalidMobileError` |\n| `FixedLine` | Landline phones with province detection | `ValidationError` |\n| `BankCard` | 16-digit debit/credit card numbers | `InvalidCardNumberError` |\n| `Sheba` | Iranian IBAN numbers (24 digits + IR) | `InvalidShebaError` |\n| `VehiclePlate` | Automobile license plates | `InvalidPlateError` |\n| `PersianText` | Rich text with fluent transformations | `ValidationError` |\n\n---\n\n## 2. Using NationalCode\n\n```python\nimport parsikit\n\nnc = parsikit.NationalCode(\"0010123458\")\n\n# String representation and duck typing\nprint(str(nc))        # '0010123458'\nprint(nc.formatted)   # '001-012345-8'\nprint(nc.masked)      # '001-****45-8' (safe for logs)\nprint(nc.location)    # {'province': 'تهران', 'city': 'تهران مرکزی'}\n```\n\n---\n\n## 3. Using MobileNumber\n\n```python\nimport parsikit\n\nm = parsikit.MobileNumber(\"+989123456789\")\n\nprint(m.national)       # '09123456789'\nprint(m.international)  # '+989123456789'\nprint(m.operator)       # 'MCI'\nprint(m.masked)         # '0912***6789'\n```\n\n---\n\n## 4. Using BankCard\n\n```python\nimport parsikit\n\ncard = parsikit.BankCard(\"6037991122334455\")\n\nprint(card.bank_name)  # 'بانک ملی ایران'\nprint(card.formatted)  # '6037-9911-2233-4455'\nprint(card.masked)     # '6037-99**-****-4455'\n```\n\n---\n\n## 5. Native Integration with Pydantic v2 & FastAPI\n\nParsiKit models implement `__get_pydantic_core_schema__`, allowing them to be used directly as field types in Pydantic schemas:\n\n```python\nfrom pydantic import BaseModel\nimport parsikit\n\nclass UserProfileSchema(BaseModel):\n    name: str\n    national_code: parsikit.NationalCode\n    phone: parsikit.MobileNumber\n    card: parsikit.BankCard\n\n# Automatic parsing and validation\nprofile = UserProfileSchema(\n    name=\"Ali Kamrani\",\n    national_code=\"0010123458\",\n    phone=\"09123456789\",\n    card=\"6037991122334455\",\n)\n\nprint(profile.model_dump())\n# All fields serialize cleanly to standard validated strings!\n```\n",
    "headings": [
      {
        "id": "tutorial-object-oriented-domain-models",
        "text": "Tutorial: Object-Oriented Domain Models",
        "level": 1
      },
      {
        "id": "1-domain-models-overview",
        "text": "1. Domain Models Overview",
        "level": 2
      },
      {
        "id": "2-using-nationalcode",
        "text": "2. Using NationalCode",
        "level": 2
      },
      {
        "id": "string-representation-and-duck-typing",
        "text": "String representation and duck typing",
        "level": 1
      },
      {
        "id": "3-using-mobilenumber",
        "text": "3. Using MobileNumber",
        "level": 2
      },
      {
        "id": "4-using-bankcard",
        "text": "4. Using BankCard",
        "level": 2
      },
      {
        "id": "5-native-integration-with-pydantic-v2-fastapi",
        "text": "5. Native Integration with Pydantic v2 & FastAPI",
        "level": 2
      },
      {
        "id": "automatic-parsing-and-validation",
        "text": "Automatic parsing and validation",
        "level": 1
      },
      {
        "id": "all-fields-serialize-cleanly-to-standard-validated-strings",
        "text": "All fields serialize cleanly to standard validated strings!",
        "level": 1
      }
    ],
    "filePath": "/app/applet/repo_data/docs/en/tutorials/models.md",
    "counterparts": {
      "fa": "tutorials/models"
    },
    "counterpartSlug": "tutorials/models"
  },
  {
    "id": "en-tutorials-numbers_and_currency",
    "slug": "tutorials/numbers_and_currency",
    "lang": "en",
    "category": "tutorials",
    "title": "Tutorial: Persian Numbers & Financial Calculations",
    "summary": "This tutorial demonstrates script digit conversion, writing numbers in Persian words, currency formatting, and loan calculations.",
    "content": "# Tutorial: Persian Numbers & Financial Calculations\n\nThis tutorial demonstrates script digit conversion, writing numbers in Persian words, currency formatting, and loan calculations.\n\n---\n\n## 1. Digit Script Conversions\n\nConvert numbers between Persian (`۰-۹`), Arabic (`٠-٩`), and English/Latin (`0-9`):\n\n```python\nimport parsikit\n\n# English to Persian\nprint(parsikit.english_to_persian(\"User ID: 1042\"))\n# 'User ID: ۱۰۴۲'\n\n# Persian/Arabic to English\nprint(parsikit.persian_to_english(\"مبلغ: ۲۵۰۰۰ ریال\"))\n# 'مبلغ: 25000 ریال'\n```\n\n---\n\n## 2. Converting Numbers to Written Words\n\nTurn numbers into natural Persian words with high performance (cached):\n\n```python\nimport parsikit\n\nprint(parsikit.number_to_words(0))\n# 'صفر'\n\nprint(parsikit.number_to_words(1250000))\n# 'یک میلیون و دویست و پنجاه هزار'\n\nprint(parsikit.number_to_words(-42))\n# 'منفی چهل و دو'\n```\n\n---\n\n## 3. Currency Transformations (Rial & Toman)\n\n```python\nimport parsikit\n\n# Rial to Toman (divide by 10)\nprint(parsikit.rial_to_toman(500000))  # 50000\n\n# Toman to Rial (multiply by 10)\nprint(parsikit.toman_to_rial(50000))   # 500000\n\n# Formatted currency string\nprint(parsikit.format_currency(12500000, \"toman\", persian_digits=True))\n# '۱۲،۵۰۰،۰۰۰ تومان'\n\n# Full written currency\nprint(parsikit.format_currency_to_words(12500000, \"toman\"))\n# 'دوازده میلیون و پانصد هزار تومان'\n```\n\n---\n\n## 4. Invoicing & VAT (ارزش افزوده)\n\nCalculate VAT according to the configured tax rate (default: 10%):\n\n```python\nimport parsikit\n\ninvoice = parsikit.add_tax_and_toll(10000000)\nprint(f\"Base: {invoice['original_amount']:,}\")\nprint(f\"VAT ({invoice['tax_rate']*100}%): {invoice['tax_amount']:,}\")\nprint(f\"Total: {invoice['total_amount']:,}\")\n```\n\n---\n\n## 5. Loan Installments (محاسبه اقساط)\n\nCalculate monthly installment payments and total interest using the official Central Bank formula:\n\n```python\nimport parsikit\n\n# 100,000,000 Toman loan at 23% interest for 24 months\nloan = parsikit.calculate_installments(100_000_000, 23.0, 24)\n\nprint(\"Monthly installment:\", loan['monthly_installment'])\nprint(\"Total payment:\", loan['total_payment'])\nprint(\"Total interest:\", loan['total_interest'])\n```\n",
    "headings": [
      {
        "id": "tutorial-persian-numbers-financial-calculations",
        "text": "Tutorial: Persian Numbers & Financial Calculations",
        "level": 1
      },
      {
        "id": "1-digit-script-conversions",
        "text": "1. Digit Script Conversions",
        "level": 2
      },
      {
        "id": "english-to-persian",
        "text": "English to Persian",
        "level": 1
      },
      {
        "id": "user-id-۱۰۴۲",
        "text": "'User ID: ۱۰۴۲'",
        "level": 1
      },
      {
        "id": "persian-arabic-to-english",
        "text": "Persian/Arabic to English",
        "level": 1
      },
      {
        "id": "مبلغ-25000-ریال",
        "text": "'مبلغ: 25000 ریال'",
        "level": 1
      },
      {
        "id": "2-converting-numbers-to-written-words",
        "text": "2. Converting Numbers to Written Words",
        "level": 2
      },
      {
        "id": "صفر",
        "text": "'صفر'",
        "level": 1
      },
      {
        "id": "یک-میلیون-و-دویست-و-پنجاه-هزار",
        "text": "'یک میلیون و دویست و پنجاه هزار'",
        "level": 1
      },
      {
        "id": "منفی-چهل-و-دو",
        "text": "'منفی چهل و دو'",
        "level": 1
      },
      {
        "id": "3-currency-transformations-rial-toman",
        "text": "3. Currency Transformations (Rial & Toman)",
        "level": 2
      },
      {
        "id": "rial-to-toman-divide-by-10",
        "text": "Rial to Toman (divide by 10)",
        "level": 1
      },
      {
        "id": "toman-to-rial-multiply-by-10",
        "text": "Toman to Rial (multiply by 10)",
        "level": 1
      },
      {
        "id": "formatted-currency-string",
        "text": "Formatted currency string",
        "level": 1
      },
      {
        "id": "۱۲،۵۰۰،۰۰۰-تومان",
        "text": "'۱۲،۵۰۰،۰۰۰ تومان'",
        "level": 1
      },
      {
        "id": "full-written-currency",
        "text": "Full written currency",
        "level": 1
      },
      {
        "id": "دوازده-میلیون-و-پانصد-هزار-تومان",
        "text": "'دوازده میلیون و پانصد هزار تومان'",
        "level": 1
      },
      {
        "id": "4-invoicing-vat-ارزش-افزوده",
        "text": "4. Invoicing & VAT (ارزش افزوده)",
        "level": 2
      },
      {
        "id": "5-loan-installments-محاسبه-اقساط",
        "text": "5. Loan Installments (محاسبه اقساط)",
        "level": 2
      },
      {
        "id": "100-000-000-toman-loan-at-23-interest-for-24-months",
        "text": "100,000,000 Toman loan at 23% interest for 24 months",
        "level": 1
      }
    ],
    "filePath": "/app/applet/repo_data/docs/en/tutorials/numbers_and_currency.md",
    "counterparts": {
      "fa": "tutorials/numbers_and_currency",
      "prs-af": "tutorials/numbers_and_currency",
      "tg": "tutorials/numbers_and_currency"
    },
    "counterpartSlug": "tutorials/numbers_and_currency"
  },
  {
    "id": "en-tutorials-text_processing",
    "slug": "tutorials/text_processing",
    "lang": "en",
    "category": "tutorials",
    "title": "Tutorial: Persian Text Processing & Standardization",
    "summary": "Handling Persian text in software requires handling distinct Unicode quirks: Arabic character substitution, Zero-Width Non-Joiner (ZWNJ) boundaries, diacritic marks, and mixed digit scripts.",
    "content": "# Tutorial: Persian Text Processing & Standardization\n\nHandling Persian text in software requires handling distinct Unicode quirks: Arabic character substitution, Zero-Width Non-Joiner (ZWNJ) boundaries, diacritic marks, and mixed digit scripts.\n\n---\n\n## 1. Character Standardization\n\nUsers frequently enter Arabic letterforms from mismatched keyboard layouts:\n- Arabic Yeh (`ي` / `\\u064A`) instead of Persian Yeh (`ی` / `\\u06CC`)\n- Arabic Kaf (`ك` / `\\u0643`) instead of Persian Keheh (`ک` / `\\u06A9`)\n- Arabic Teh Marbuta (`ة` / `\\u0629`)\n\n`standardize_persian` unifies these into canonical Persian characters:\n\n```python\nimport parsikit\n\ndirty = \"اين يك متن پيچيده با كدملي است.\"\nclean = parsikit.standardize_persian(dirty)\nprint(clean)\n# 'این یک متن پیچیده با کدملي است.'\n```\n\n---\n\n## 2. Zero-Width Non-Joiner (ZWNJ / نیم‌فاصله)\n\nIn Persian grammar, verbal prefixes (`می‌`, `نمی‌`) and grammatical suffixes (`‌ها`, `‌ترین`, `‌مند`) require a half-space (ZWNJ, `\\u200C`) rather than a full ASCII space.\n\n```python\nimport parsikit\n\nraw = \"کتاب ها می روند و بر می گردند\"\nclean = parsikit.standardize_persian(raw)\nprint(clean)\n# 'کتاب‌ها می‌روند و برمی‌گردند'\n```\n\n---\n\n## 3. Stripping Diacritics (اعراب‌زدایی)\n\nDiacritics (َ ِ ُ ً ٍ ٌ ّ ْ) can interfere with database searching and full-text index lookups:\n\n```python\nimport parsikit\n\nvowelized = \"سَلامٌ عَلَیکُم وَ رَحمَةُ الله\"\nclean = parsikit.strip_diacritics(vowelized)\nprint(clean)\n# 'سلام علیکم و رحمة الله'\n```\n\n---\n\n## 4. Converting Mistyped English Keyboards\n\nWhen a user types on an English keyboard layout while intending to type Persian:\n\n```python\nimport parsikit\n\nmistyped = \"sghl phgaj,k ],ji?\"\npersian = parsikit.correct_keyboard_layout(mistyped)\nprint(persian)\n# 'سلام حالتون چطوره؟'\n```\n\n---\n\n## 5. SEO URL Slug Generation (`slugify`)\n\nParsiKit includes an intelligent Persian transliteration dictionary to turn Persian article titles into readable Finglish slugs:\n\n```python\nimport parsikit\n\ntitle = \"معرفی نسخه جدید پارسی کیت\"\nslug = parsikit.slugify(title)\nprint(slug)\n# 'moarefi-neskheh-jadid-parsi-kit'\n```\n",
    "headings": [
      {
        "id": "tutorial-persian-text-processing-standardization",
        "text": "Tutorial: Persian Text Processing & Standardization",
        "level": 1
      },
      {
        "id": "1-character-standardization",
        "text": "1. Character Standardization",
        "level": 2
      },
      {
        "id": "این-یک-متن-پیچیده-با-کدملي-است",
        "text": "'این یک متن پیچیده با کدملي است.'",
        "level": 1
      },
      {
        "id": "2-zero-width-non-joiner-zwnj-نیم-فاصله",
        "text": "2. Zero-Width Non-Joiner (ZWNJ / نیم‌فاصله)",
        "level": 2
      },
      {
        "id": "کتاب-ها-می-روند-و-برمی-گردند",
        "text": "'کتاب‌ها می‌روند و برمی‌گردند'",
        "level": 1
      },
      {
        "id": "3-stripping-diacritics-اعراب-زدایی",
        "text": "3. Stripping Diacritics (اعراب‌زدایی)",
        "level": 2
      },
      {
        "id": "سلام-علیکم-و-رحمة-الله",
        "text": "'سلام علیکم و رحمة الله'",
        "level": 1
      },
      {
        "id": "4-converting-mistyped-english-keyboards",
        "text": "4. Converting Mistyped English Keyboards",
        "level": 2
      },
      {
        "id": "سلام-حالتون-چطوره؟",
        "text": "'سلام حالتون چطوره؟'",
        "level": 1
      },
      {
        "id": "5-seo-url-slug-generation-slugify",
        "text": "5. SEO URL Slug Generation (`slugify`)",
        "level": 2
      },
      {
        "id": "moarefi-neskheh-jadid-parsi-kit",
        "text": "'moarefi-neskheh-jadid-parsi-kit'",
        "level": 1
      }
    ],
    "filePath": "/app/applet/repo_data/docs/en/tutorials/text_processing.md",
    "counterparts": {
      "fa": "tutorials/text_processing",
      "prs-af": "tutorials/text_processing",
      "tg": "tutorials/text_processing"
    },
    "counterpartSlug": "tutorials/text_processing"
  },
  {
    "id": "en-tutorials-validation",
    "slug": "tutorials/validation",
    "lang": "en",
    "category": "tutorials",
    "title": "Tutorial: National Identifiers & Format Validation",
    "summary": "ParsiKit provides validation engines for all major Iranian public identification standards.",
    "content": "# Tutorial: National Identifiers & Format Validation\n\nParsiKit provides validation engines for all major Iranian public identification standards.\n\n---\n\n## 1. Iranian National Code (کد ملی)\n\nThe Iranian National Code is a 10-digit number where the 10th digit is a checksum computed modulo 11 with weights from 10 down to 2.\n\n```python\nimport parsikit\n\n# Verification\nprint(parsikit.is_valid_national_code(\"0010123458\"))  # True\nprint(parsikit.is_valid_national_code(\"1111111111\"))  # False (repeated digits)\nprint(parsikit.is_valid_national_code(\"0010123451\"))  # False (invalid checksum)\n\n# Formatting\nprint(parsikit.format_national_code(\"0010123458\"))    # '001-012345-8'\n\n# Origin detection\nprint(parsikit.detect_national_code_location(\"0010123458\"))\n# {'province': 'تهران', 'city': 'تهران مرکزی'}\n```\n\n---\n\n## 2. Iranian Mobile Numbers (شماره موبایل)\n\nSupports standard 11-digit Iranian mobile numbers across MCI (Hamrah-e Aval), Irancell (MTN), Rightel, Shatel Mobile, and enterprise virtual operators:\n\n```python\nimport parsikit\n\nphone = \"+989123456789\"\nprint(parsikit.is_valid_mobile(phone))           # True\nprint(parsikit.normalize_mobile(phone, \"0\"))     # '09123456789'\nprint(parsikit.detect_mobile_operator(phone))    # 'MCI'\n```\n\n---\n\n## 3. Bank Cards & Sheba IBANs\n\n### 16-Digit Debit Cards (کارت بانکی شتاب)\nUses the Luhn algorithm (mod-10 double-add-double) and matches issuer bank codes:\n\n```python\nimport parsikit\n\ncard = \"6037991122334455\"\nprint(parsikit.is_valid_card_number(card))       # True\nprint(parsikit.format_card_number(card))         # '6037-9911-2233-4455'\nprint(parsikit.detect_bank_from_card(card))      # 'بانک ملی ایران'\n```\n\n### Sheba (شناسه بانکی ایران - IBAN)\nEvaluates 24-digit Iranian IBAN numbers according to ISO 7064 Mod 97-10:\n\n```python\nimport parsikit\n\nsheba = \"IR120170000000123456789012\"\nprint(parsikit.is_valid_sheba(sheba))             # True\nprint(parsikit.detect_bank_from_sheba(sheba))     # 'بانک ملی ایران'\n```\n\n---\n\n## 4. Postal Codes & Utility Bills\n\n### Postal Code (کد پستی)\nValidates 10-digit codes against postal layout rules (no 0 or 2 in certain positions) and formats as 5-5:\n\n```python\nimport parsikit\n\nprint(parsikit.is_valid_postal_code(\"1417466191\"))  # True\nprint(parsikit.format_postal_code(\"1417466191\"))    # '14174-66191'\n```\n\n### Utility Bills (شناسه قبض و پرداخت)\nChecks electricity, water, gas, and telephone bills and calculates payable amounts:\n\n```python\nimport parsikit\n\nbill_id = \"982765410123\"\npay_id = \"12500345\"\n# Verifies check digits and parses bill metadata\n```\n",
    "headings": [
      {
        "id": "tutorial-national-identifiers-format-validation",
        "text": "Tutorial: National Identifiers & Format Validation",
        "level": 1
      },
      {
        "id": "1-iranian-national-code-کد-ملی",
        "text": "1. Iranian National Code (کد ملی)",
        "level": 2
      },
      {
        "id": "verification",
        "text": "Verification",
        "level": 1
      },
      {
        "id": "formatting",
        "text": "Formatting",
        "level": 1
      },
      {
        "id": "origin-detection",
        "text": "Origin detection",
        "level": 1
      },
      {
        "id": "province-تهران-city-تهران-مرکزی",
        "text": "{'province': 'تهران', 'city': 'تهران مرکزی'}",
        "level": 1
      },
      {
        "id": "2-iranian-mobile-numbers-شماره-موبایل",
        "text": "2. Iranian Mobile Numbers (شماره موبایل)",
        "level": 2
      },
      {
        "id": "3-bank-cards-sheba-ibans",
        "text": "3. Bank Cards & Sheba IBANs",
        "level": 2
      },
      {
        "id": "16-digit-debit-cards-کارت-بانکی-شتاب",
        "text": "16-Digit Debit Cards (کارت بانکی شتاب)",
        "level": 3
      },
      {
        "id": "sheba-شناسه-بانکی-ایران-iban",
        "text": "Sheba (شناسه بانکی ایران - IBAN)",
        "level": 3
      },
      {
        "id": "4-postal-codes-utility-bills",
        "text": "4. Postal Codes & Utility Bills",
        "level": 2
      },
      {
        "id": "postal-code-کد-پستی",
        "text": "Postal Code (کد پستی)",
        "level": 3
      },
      {
        "id": "utility-bills-شناسه-قبض-و-پرداخت",
        "text": "Utility Bills (شناسه قبض و پرداخت)",
        "level": 3
      },
      {
        "id": "verifies-check-digits-and-parses-bill-metadata",
        "text": "Verifies check digits and parses bill metadata",
        "level": 1
      }
    ],
    "filePath": "/app/applet/repo_data/docs/en/tutorials/validation.md",
    "counterparts": {
      "fa": "tutorials/validation",
      "prs-af": "tutorials/validation",
      "tg": "tutorials/validation"
    },
    "counterpartSlug": "tutorials/validation"
  },
  {
    "id": "prs-af-api-cache",
    "slug": "api/cache",
    "lang": "prs-af",
    "category": "api",
    "title": "سیستم کش چندنخی (parsikit.cache)",
    "summary": "ماژول parsikit.cache یک سیستم حافظه موقت امن در محیط‌های چندنخی (Thread-safe LRU Cache) فراهم می‌کند تا تبدیل‌های محاسباتی سنگین تکراری بدون افت عملکرد انجام شوند.",
    "content": "# سیستم کش چندنخی (parsikit.cache)\n\nماژول `parsikit.cache` یک سیستم حافظه موقت امن در محیط‌های چندنخی (Thread-safe LRU Cache) فراهم می‌کند تا تبدیل‌های محاسباتی سنگین تکراری بدون افت عملکرد انجام شوند.\n\n---\n\n## ویژگی‌ها\n\n- پیاده‌سازی با کلاس‌های استاندارد پایتون بدون نیاز به کتابخانه‌های سنگین\n- بهره‌مندی از قفل انحصاری `threading.Lock` برای جلوگیری از Race Condition در سرورهای وب چندنخی (FastAPI، Django، Flask)\n- محدودیت اندازه قابل تنظیم (maxsize پیش‌فرض: ۱۰۲۴ مورد)\n",
    "headings": [
      {
        "id": "سیستم-کش-چندنخی-parsikit-cache",
        "text": "سیستم کش چندنخی (parsikit.cache)",
        "level": 1
      },
      {
        "id": "ویژگی-ها",
        "text": "ویژگی‌ها",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/prs-af/api/cache.md",
    "counterparts": {
      "fa": "api/cache",
      "en": "api/cache",
      "tg": "api/cache"
    },
    "counterpartSlug": "api/cache"
  },
  {
    "id": "prs-af-api-datetime",
    "slug": "api/datetime",
    "lang": "prs-af",
    "category": "api",
    "title": "ماژول تقویم و زمان (parsikit.datetime)",
    "summary": "ماژول parsikit.datetime محاسبات دقیق و تبدیل‌های زمانی میان تقویم میلادی (Gregorian) و هجری شمسی (Solar Hijri / Jalali) را ارائه می‌دهد.",
    "content": "# ماژول تقویم و زمان (parsikit.datetime)\n\nماژول `parsikit.datetime` محاسبات دقیق و تبدیل‌های زمانی میان تقویم میلادی (Gregorian) و هجری شمسی (Solar Hijri / Jalali) را ارائه می‌دهد.\n\n---\n\n## توابع اصلی\n\n### `gregorian_to_jalali(gy: int, gm: int, gd: int) -> Tuple[int, int, int]`\nتبدیل سال، ماه و روز میلادی به تاریخ معادل هجری شمسی.\n\n### `jalali_to_gregorian(jy: int, jm: int, jd: int) -> Tuple[int, int, int]`\nتبدیل تاریخ هجری شمسی به تاریخ معادل میلادی.\n\n### `is_jalali_leap(year: int) -> bool`\nمحاسبه وضعیت سال کبیسه در تقویم هجری شمسی بر مبنای چرخه ۳۳ ساله نجومی.\n\n### `humanize_relative_time(minutes_ago: int) -> str`\nنمایش زمان به صورت متنی و انسانی در زبان فارسی دری (مانند: «۱۵ دقیقه پیش»).\n",
    "headings": [
      {
        "id": "ماژول-تقویم-و-زمان-parsikit-datetime",
        "text": "ماژول تقویم و زمان (parsikit.datetime)",
        "level": 1
      },
      {
        "id": "توابع-اصلی",
        "text": "توابع اصلی",
        "level": 2
      },
      {
        "id": "gregorian_to_jalali-gy-int-gm-int-gd-int-tuple-int-int-int",
        "text": "`gregorian_to_jalali(gy: int, gm: int, gd: int) -> Tuple[int, int, int]`",
        "level": 3
      },
      {
        "id": "jalali_to_gregorian-jy-int-jm-int-jd-int-tuple-int-int-int",
        "text": "`jalali_to_gregorian(jy: int, jm: int, jd: int) -> Tuple[int, int, int]`",
        "level": 3
      },
      {
        "id": "is_jalali_leap-year-int-bool",
        "text": "`is_jalali_leap(year: int) -> bool`",
        "level": 3
      },
      {
        "id": "humanize_relative_time-minutes_ago-int-str",
        "text": "`humanize_relative_time(minutes_ago: int) -> str`",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/prs-af/api/datetime.md",
    "counterparts": {
      "fa": "api/datetime",
      "en": "api/datetime",
      "tg": "api/datetime"
    },
    "counterpartSlug": "api/datetime"
  },
  {
    "id": "prs-af-api-index",
    "slug": "api/index",
    "lang": "prs-af",
    "category": "api",
    "title": "مرجع کامل توابع و کلاس‌های پارسی‌کیت (API)",
    "summary": "این مستند فهرست جامع تمام ماژول‌ها، کلاس‌ها و توابع موجود در کتابخانه پارسی‌کیت را معرفی می‌نماید.",
    "content": "# مرجع کامل توابع و کلاس‌های پارسی‌کیت (API)\n\nاین مستند فهرست جامع تمام ماژول‌ها، کلاس‌ها و توابع موجود در کتابخانه پارسی‌کیت را معرفی می‌نماید.\n\n---\n\n## ساختار ماژول‌ها\n\n| ماژول | توضیح و کاربرد اصلی |\n| :--- | :--- |\n| `parsikit.text` | تصفیه متون، تنظیم نیم‌فاصله‌ها، حذف اعراب و معیارسازی حروف |\n| `parsikit.validators` | اعتبارسنجی تذکره، کارت‌های بانکی، شبا، شناسه ملی و موبایل |\n| `parsikit.datetime` | تقویم نجومی هجری شمسی، تبدیل تاریخ و محاسبه سال کبیسه |\n| `parsikit.currency` | تبدیل ارقام به حروف، قالب‌بندی مالی و محاسبات ارزی |\n| `parsikit.models` | مدل‌های داده‌ای شیءگرا با سازگاری Pydantic v2 |\n| `parsikit.cache` | سیستم کش چندنخی (Thread-safe LRU Cache) |\n| `parsikit.exceptions` | سلسله‌مراتب خطاهای اختصاصی و استاندارد |\n| `parsikit.dev` | ابزارهای عیب‌یابی و محاسبه طول واقعی متون فارسی |\n",
    "headings": [
      {
        "id": "مرجع-کامل-توابع-و-کلاس-های-پارسی-کیت-api",
        "text": "مرجع کامل توابع و کلاس‌های پارسی‌کیت (API)",
        "level": 1
      },
      {
        "id": "ساختار-ماژول-ها",
        "text": "ساختار ماژول‌ها",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/prs-af/api/index.md",
    "counterparts": {
      "fa": "api/index",
      "en": "api/index",
      "tg": "api/index"
    },
    "counterpartSlug": "api/index"
  },
  {
    "id": "prs-af-api-models",
    "slug": "api/models",
    "lang": "prs-af",
    "category": "api",
    "title": "مدل‌های شیءگرا (parsikit.models)",
    "summary": "ماژول parsikit.models کلاس‌های داده‌ای غنی (Domain Models) را برای کپسوله‌سازی و اعتبارسنجی خودکار مقادیر فراهم می‌آورد.",
    "content": "# مدل‌های شیءگرا (parsikit.models)\n\nماژول `parsikit.models` کلاس‌های داده‌ای غنی (Domain Models) را برای کپسوله‌سازی و اعتبارسنجی خودکار مقادیر فراهم می‌آورد.\n\n---\n\n## کلاس‌های موجود\n\n### `NationalCode`\nکلاس نگه‌دارنده شماره هویت و تذکره همراه با بررسی صحت خودکار در زمان ساخته‌شدن شیء:\n- `nc.formatted`: فرمت تفکیک‌شده با خط تیره\n- `nc.masked`: فرمت امن با ستاره\n- `nc.clean`: رشته ارقام خالص\n- `nc.province`: نام استان یا ولایت صادرکننده\n\n### `BankCard`\nکلاس داده‌ای کارت بانکی:\n- `card.is_valid`: وضعیت درستی شماره با الگوریتم لون\n- `card.bank_name`: نام بانک عامل صادرکننده\n- `card.masked`: شماره ماسک‌شده امن\n\n### `MobileNumber`\nکلاس شماره تلفن همراه:\n- `m.operator`: نام اپراتور شبکه مخابراتی\n- `m.international`: فرمت بین‌المللی با کد کشور (+98 / +93)\n",
    "headings": [
      {
        "id": "مدل-های-شیءگرا-parsikit-models",
        "text": "مدل‌های شیءگرا (parsikit.models)",
        "level": 1
      },
      {
        "id": "کلاس-های-موجود",
        "text": "کلاس‌های موجود",
        "level": 2
      },
      {
        "id": "nationalcode",
        "text": "`NationalCode`",
        "level": 3
      },
      {
        "id": "bankcard",
        "text": "`BankCard`",
        "level": 3
      },
      {
        "id": "mobilenumber",
        "text": "`MobileNumber`",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/prs-af/api/models.md",
    "counterparts": {
      "fa": "api/models",
      "en": "api/models",
      "tg": "api/models"
    },
    "counterpartSlug": "api/models"
  },
  {
    "id": "prs-af-api-number_and_currency",
    "slug": "api/number_and_currency",
    "lang": "prs-af",
    "category": "api",
    "title": "ماژول اعداد و ارز (parsikit.currency)",
    "summary": "ماژول parsikit.currency و توابع مربوطه، تبدیل ارقام به نوشتار حروفی و محاسبات پولی را مدیریت می‌نمایند.",
    "content": "# ماژول اعداد و ارز (parsikit.currency)\n\nماژول `parsikit.currency` و توابع مربوطه، تبدیل ارقام به نوشتار حروفی و محاسبات پولی را مدیریت می‌نمایند.\n\n---\n\n## توابع پرکاربرد\n\n### `number_to_persian_words(num: int) -> str`\nتبدیل اعداد صحیح تا ۹۹۹ سپتیلیون به حروف روان و طبیعی.\n\n### `format_currency(amount: int, unit: str = \"toman\") -> str`\nقالب‌بندی مبالغ با جداسازی ۳ رقمی ارقام و ذکر واحد پولی.\n\n### `to_persian_digits(text: str) -> str`\nتبدیل ارقام انگلیسی یا عربی به اعداد فارسی.\n",
    "headings": [
      {
        "id": "ماژول-اعداد-و-ارز-parsikit-currency",
        "text": "ماژول اعداد و ارز (parsikit.currency)",
        "level": 1
      },
      {
        "id": "توابع-پرکاربرد",
        "text": "توابع پرکاربرد",
        "level": 2
      },
      {
        "id": "number_to_persian_words-num-int-str",
        "text": "`number_to_persian_words(num: int) -> str`",
        "level": 3
      },
      {
        "id": "format_currency-amount-int-unit-str-toman-str",
        "text": "`format_currency(amount: int, unit: str = \"toman\") -> str`",
        "level": 3
      },
      {
        "id": "to_persian_digits-text-str-str",
        "text": "`to_persian_digits(text: str) -> str`",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/prs-af/api/number_and_currency.md",
    "counterparts": {
      "fa": "api/number_and_currency",
      "en": "api/number_and_currency",
      "tg": "api/number_and_currency"
    },
    "counterpartSlug": "api/number_and_currency"
  },
  {
    "id": "prs-af-api-text",
    "slug": "api/text",
    "lang": "prs-af",
    "category": "api",
    "title": "ماژول پردازش متن (parsikit.text)",
    "summary": "ماژول parsikit.text مجموعه‌ای از توابع کارآمد را برای پاکسازی و یکنواخت‌سازی متون زبان فارسی دری فراهم می‌آورد.",
    "content": "# ماژول پردازش متن (parsikit.text)\n\nماژول `parsikit.text` مجموعه‌ای از توابع کارآمد را برای پاکسازی و یکنواخت‌سازی متون زبان فارسی دری فراهم می‌آورد.\n\n---\n\n## توابع اصلی\n\n### `standardize_persian(text: str) -> str`\nکاراکترهای عربی مانند «ي» و «ك» را به حروف معیاری دری تبدیل کرده و فواصل نامناسب را فشرده می‌سازد.\n\n### `clean_text(text: str) -> str`\nپاکسازی همه‌جانبه شامل حذف اعراب غیرضروری، کنترل نیم‌فاصله‌ها و حذف کاراکترهای مخفی.\n\n### `slugify(text: str) -> str`\nتولید پیوندهای یکتا (URL Slug) با نویسه‌گردانی دقیق حروف به حروف لاتین (Pinglish).\n",
    "headings": [
      {
        "id": "ماژول-پردازش-متن-parsikit-text",
        "text": "ماژول پردازش متن (parsikit.text)",
        "level": 1
      },
      {
        "id": "توابع-اصلی",
        "text": "توابع اصلی",
        "level": 2
      },
      {
        "id": "standardize_persian-text-str-str",
        "text": "`standardize_persian(text: str) -> str`",
        "level": 3
      },
      {
        "id": "clean_text-text-str-str",
        "text": "`clean_text(text: str) -> str`",
        "level": 3
      },
      {
        "id": "slugify-text-str-str",
        "text": "`slugify(text: str) -> str`",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/prs-af/api/text.md",
    "counterparts": {
      "fa": "api/text",
      "en": "api/text",
      "tg": "api/text"
    },
    "counterpartSlug": "api/text"
  },
  {
    "id": "prs-af-api-validators",
    "slug": "api/validators",
    "lang": "prs-af",
    "category": "api",
    "title": "ماژول اعتبارسنجی (parsikit.validators)",
    "summary": "ماژول parsikit.validators الگوریتم‌های رسمی برای بررسی صحت داده‌های هویتی، مالی و مخابراتی را فراهم می‌سازد.",
    "content": "# ماژول اعتبارسنجی (parsikit.validators)\n\nماژول `parsikit.validators` الگوریتم‌های رسمی برای بررسی صحت داده‌های هویتی، مالی و مخابراتی را فراهم می‌سازد.\n\n---\n\n## توابع اعتبارسنجی\n\n### `is_valid_national_code(code: str) -> bool`\nبررسی صحت شماره هویت با الگوریتم پیمانه ۱۱.\n\n### `is_valid_card_number(card: str) -> bool`\nبررسی صحت شماره ۱۶ رقمی کارت بانکی با الگوریتم لان (Luhn Algorithm).\n\n### `detect_bank_from_card(card: str) -> Optional[str]`\nشناسایی خودکار بانک عامل صادرکننده کارت بانکی بر اساس ۶ رقم نخست.\n\n### `mask_card(card: str) -> str`\nماسک‌کردن امن شماره کارت به فرمت استاندارد (مثال: `6037-9911-****-4455`).\n\n### `mask_mobile(mobile: str) -> str`\nمخفی‌سازی ارقام میانی شماره تماس به منظور رعایت حریم خصوصی.\n",
    "headings": [
      {
        "id": "ماژول-اعتبارسنجی-parsikit-validators",
        "text": "ماژول اعتبارسنجی (parsikit.validators)",
        "level": 1
      },
      {
        "id": "توابع-اعتبارسنجی",
        "text": "توابع اعتبارسنجی",
        "level": 2
      },
      {
        "id": "is_valid_national_code-code-str-bool",
        "text": "`is_valid_national_code(code: str) -> bool`",
        "level": 3
      },
      {
        "id": "is_valid_card_number-card-str-bool",
        "text": "`is_valid_card_number(card: str) -> bool`",
        "level": 3
      },
      {
        "id": "detect_bank_from_card-card-str-optional-str",
        "text": "`detect_bank_from_card(card: str) -> Optional[str]`",
        "level": 3
      },
      {
        "id": "mask_card-card-str-str",
        "text": "`mask_card(card: str) -> str`",
        "level": 3
      },
      {
        "id": "mask_mobile-mobile-str-str",
        "text": "`mask_mobile(mobile: str) -> str`",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/prs-af/api/validators.md",
    "counterparts": {
      "fa": "api/validators",
      "en": "api/validators",
      "tg": "api/validators"
    },
    "counterpartSlug": "api/validators"
  },
  {
    "id": "prs-af-faq",
    "slug": "faq",
    "lang": "prs-af",
    "category": "getting-started",
    "title": "پرسش‌های مکرر (FAQ)",
    "summary": "در این بخش به پرسش‌های رایج پیرامون کتابخانه پارسی‌کیت پاسخ داده شده است.",
    "content": "# پرسش‌های مکرر (FAQ)\n\nدر این بخش به پرسش‌های رایج پیرامون کتابخانه پارسی‌کیت پاسخ داده شده است.\n\n---\n\n## ۱. آیا پارسی‌کیت نیاز به نصب کتابخانه‌های خارجی دارد؟\n\nخیر. پارسی‌کیت بر اساس فلسفه **صفر وابستگی (Zero Dependencies)** ساخته شده است و صد در صد با پایتون خالص (Pure Python) اجرا می‌شود. هیچ نیازی به ابزارهای جانبی یا کامپایلر نیست.\n\n---\n\n## ۲. پارسی‌کیت با کدام نسخه‌های پایتون سازگار است؟\n\nپارسی‌کیت از پایتون نسخه ۳.۱۰ و بالاتر (Python 3.10، 3.11، 3.12 و 3.13) به طور کامل پشتیبانی می‌کند.\n\n---\n\n## ۳. آیا از الگوریتم‌های تذکره و اسناد هویت پشتیبانی می‌شود؟\n\nبلی. الگوریتم رسمی پیمانه ۱۱ و قواعد کنترل چک‌سام در کتابخانه تعبیه شده است و همچنین شماره‌های تماس و کارت‌های بانکی با الگوریتم لون بررسی می‌گردند.\n\n---\n\n## ۴. محاسبات تقویم هجری شمسی بر چه مبنایی استوار است؟\n\nمحاسبات تقویم بر پایه چرخه ۳۳ ساله نجومی تقویم جلالی/هجری شمسی استوار است که دقیق‌ترین مدل محاسباتی بدون انحراف زمانی به شمار می‌رود.\n",
    "headings": [
      {
        "id": "پرسش-های-مکرر-faq",
        "text": "پرسش‌های مکرر (FAQ)",
        "level": 1
      },
      {
        "id": "۱-آیا-پارسی-کیت-نیاز-به-نصب-کتابخانه-های-خارجی-دارد؟",
        "text": "۱. آیا پارسی‌کیت نیاز به نصب کتابخانه‌های خارجی دارد؟",
        "level": 2
      },
      {
        "id": "۲-پارسی-کیت-با-کدام-نسخه-های-پایتون-سازگار-است؟",
        "text": "۲. پارسی‌کیت با کدام نسخه‌های پایتون سازگار است؟",
        "level": 2
      },
      {
        "id": "۳-آیا-از-الگوریتم-های-تذکره-و-اسناد-هویت-پشتیبانی-می-شود؟",
        "text": "۳. آیا از الگوریتم‌های تذکره و اسناد هویت پشتیبانی می‌شود؟",
        "level": 2
      },
      {
        "id": "۴-محاسبات-تقویم-هجری-شمسی-بر-چه-مبنایی-استوار-است؟",
        "text": "۴. محاسبات تقویم هجری شمسی بر چه مبنایی استوار است؟",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/prs-af/faq.md",
    "counterparts": {
      "fa": "faq",
      "en": "faq",
      "tg": "faq"
    },
    "counterpartSlug": "faq"
  },
  {
    "id": "prs-af-guides-forms_and_security",
    "slug": "guides/forms_and_security",
    "lang": "prs-af",
    "category": "guides",
    "title": "راهنمای امنیت داده‌ها و اعتبارسنجی فرم‌ها",
    "summary": "این راهنما شیوه پیاده‌سازی اعتبارسنجی امن و جلوگیری از نشت اطلاعات حساس (PII) را بیان می‌کند.",
    "content": "# راهنمای امنیت داده‌ها و اعتبارسنجی فرم‌ها\n\nاین راهنما شیوه پیاده‌سازی اعتبارسنجی امن و جلوگیری از نشت اطلاعات حساس (PII) را بیان می‌کند.\n\n---\n\n## ۱. ماسک‌کردن شماره کارت و شماره تماس در لاگ‌ها\n\nهرگز اطلاعات هویتی و شماره‌های بانکی کاربران را به صورت خام در فایل‌های لاگ یا پاسخ‌های API ذخیره نکنید:\n\n```python\nimport parsikit\n\nraw_card = \"6037991122334455\"\nraw_mobile = \"09123456789\"\n\nsafe_card = parsikit.mask_card(raw_card)\nsafe_mobile = parsikit.mask_mobile(raw_mobile)\n\nprint(f\"Log: payment attempt for card={safe_card}, user={safe_mobile}\")\n```\n\n---\n\n## ۲. استفاده از استثناهای ساختاریافته در FastAPI\n\n```python\nfrom parsikit.models import NationalCode\nfrom parsikit.exceptions import InvalidNationalCodeError\n\ndef validate_user_input(code_str: str):\n    try:\n        nc = NationalCode(code_str)\n        return nc.clean\n    except InvalidNationalCodeError:\n        raise ValueError(\"شماره هویت نامعتبر است.\")\n```\n",
    "headings": [
      {
        "id": "راهنمای-امنیت-داده-ها-و-اعتبارسنجی-فرم-ها",
        "text": "راهنمای امنیت داده‌ها و اعتبارسنجی فرم‌ها",
        "level": 1
      },
      {
        "id": "۱-ماسک-کردن-شماره-کارت-و-شماره-تماس-در-لاگ-ها",
        "text": "۱. ماسک‌کردن شماره کارت و شماره تماس در لاگ‌ها",
        "level": 2
      },
      {
        "id": "۲-استفاده-از-استثناهای-ساختاریافته-در-fastapi",
        "text": "۲. استفاده از استثناهای ساختاریافته در FastAPI",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/prs-af/guides/forms_and_security.md",
    "counterparts": {
      "fa": "guides/forms_and_security",
      "en": "guides/forms_and_security",
      "tg": "guides/forms_and_security"
    },
    "counterpartSlug": "guides/forms_and_security"
  },
  {
    "id": "prs-af-index",
    "slug": "index",
    "lang": "prs-af",
    "category": "getting-started",
    "title": "رهنمودهای جامع کتابخانه پارسی‌کیت (ParsiKit)",
    "summary": "به مرکز اسناد و رهنمودهای رسمی کتابخانه پارسی‌کیت (ParsiKit) خوش آمدید.",
    "content": "# رهنمودهای جامع کتابخانه پارسی‌کیت (ParsiKit)\n\nبه مرکز اسناد و رهنمودهای رسمی کتابخانه **پارسی‌کیت (ParsiKit)** خوش آمدید.\n\nپارسی‌کیت یک کتابخانه معیاری، سریع و سبک در زبان پایتون (Python 3.10+) است که بدون هرگونه وابستگی بیرونی (Zero Dependencies)، ابزارهای همه‌جانبه‌ای را برای تصفیه متون زبان فارسی دری، تثبیت اعتبار شماره‌های هویت و تذکره، کارت‌های بانکی، تقویم هجری شمسی و محاسبات پولی در اختیار توسعه‌دهندگان نرم‌افزار قرار می‌دهد.\n\n---\n\n## بخش‌های اصلی رهنمود\n\n- [رهنمود نصب و راه‌اندازی](installation.md) — طریقه نصب با pip، poetry و uv\n- [آغاز سریع در ۵ دقیقه](quickstart.md) — آشنایی با مثال‌های پرکاربرد و روزمره\n- [پرسش‌های مکرر (FAQ)](faq.md) — پاسخ به سوالات اساسی پیرامون لایسنس و کارکردها\n- [عیب‌یابی و حل مشکلات](troubleshooting.md) — راهکارهای حل خطاهای رایج در پروژه‌ها\n\n---\n\n## آموزش‌های گام‌به‌گام\n\n- [تصفیه متن و نیم‌فاصله‌های معیاری](tutorials/text_processing.md) — معیارسازی حروف و فواصل\n- [تثبیت اعتبار اسناد و کارت‌ها](tutorials/validation.md) — الگوریتم پیمانه ۱۱ و الگوریتم لون\n- [تقویم نجومی هجری شمسی](tutorials/datetime.md) — تبدیلات دقیق تقویم و محاسبه سال‌های کبیسه\n- [محاسبات ارقام و مبالغ مالی](tutorials/numbers_and_currency.md) — تبدیل اعداد به حروف و مدیریت مبالغ\n\n---\n\n## فهرست توابع و ماژول‌ها (API Reference)\n\n- [مرجع جامع API](api/index.md) — فهرست تمام کلاس‌ها و توابع در دسترس\n- [ماژول پردازش متن (parsikit.text)](api/text.md) — توابع پاکسازی و آماده‌سازی متن\n- [ماژول تثبیت اعتبار (parsikit.validators)](api/validators.md) — توابع چک‌سام و بررسی صحت\n- [ماژول تقویم و زمان (parsikit.datetime)](api/datetime.md) — تبدیل تاریخ میلادی و شمسی\n- [مدل‌های شیءگرا (parsikit.models)](api/models.md) — کلاس‌های داده‌ای با اعتبارسنجی خودکار\n\n---\n\n## مشخصات فنی\n\n- **نسخه کنونی:** 3.3.1\n- **نیازمندی پایتون:** Python >= 3.10\n- **مجوز نرم‌افزاری:** MIT License\n- **مولف و مهندس ناظر:** علی کامرانی (MRThugh)\n",
    "headings": [
      {
        "id": "رهنمودهای-جامع-کتابخانه-پارسی-کیت-parsikit",
        "text": "رهنمودهای جامع کتابخانه پارسی‌کیت (ParsiKit)",
        "level": 1
      },
      {
        "id": "بخش-های-اصلی-رهنمود",
        "text": "بخش‌های اصلی رهنمود",
        "level": 2
      },
      {
        "id": "آموزش-های-گام-به-گام",
        "text": "آموزش‌های گام‌به‌گام",
        "level": 2
      },
      {
        "id": "فهرست-توابع-و-ماژول-ها-api-reference",
        "text": "فهرست توابع و ماژول‌ها (API Reference)",
        "level": 2
      },
      {
        "id": "مشخصات-فنی",
        "text": "مشخصات فنی",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/prs-af/index.md",
    "counterparts": {
      "fa": "index",
      "en": "index",
      "tg": "index"
    },
    "counterpartSlug": "index"
  },
  {
    "id": "prs-af-installation",
    "slug": "installation",
    "lang": "prs-af",
    "category": "getting-started",
    "title": "رهنمود نصب و راه‌اندازی پارسی‌کیت",
    "summary": "کتابخانه پارسی‌کیت کاملاً با پایتون خالص (Pure Python) نوشته شده و هیچ وابستگی به پکیج‌های خارجی یا کتابخانه‌های باینری ندارد. بنابراین در تمام سیستم‌های عامل (لینوکس، ویندوز و مک‌او‌اس) به سرعت و بدو",
    "content": "# رهنمود نصب و راه‌اندازی پارسی‌کیت\n\nکتابخانه پارسی‌کیت کاملاً با پایتون خالص (Pure Python) نوشته شده و هیچ وابستگی به پکیج‌های خارجی یا کتابخانه‌های باینری ندارد. بنابراین در تمام سیستم‌های عامل (لینوکس، ویندوز و مک‌او‌اس) به سرعت و بدون مشکل نصب می‌شود.\n\n---\n\n## نیازمندی‌های سیستم\n\n- پایتون نسخه **۳.۱۰** یا بالاتر (پشتیبانی مکمل از Python 3.10، 3.11، 3.12 و 3.13)\n- بدون ضرورت به کامپایلر یا برنامه‌های جانبی\n\n---\n\n## ۱. نصب مستقیم از طریق pip\n\nساده‌ترین شیوه برای نصب آخرین نسخه پایدار از مخزن PyPI:\n\n```bash\npip install parsikit\n```\n\nاگر از پکیج منیجرهای معاصر مانند Poetry یا uv استفاده می‌نمایید:\n\n```bash\n# نصب با Poetry\npoetry add parsikit\n\n# نصب با uv\nuv add parsikit\n```\n\n---\n\n## ۲. نصب مستقیم از سورس کد (GitHub)\n\nبرای نصب آخرین تغییرات از شاخه توسعه در گیت‌هاب:\n\n```bash\ngit clone https://github.com/MRThugh/ParsiKit.git\ncd ParsiKit\npip install .\n```\n\nبرای نصب در حالت ویرایش همزمان (Editable Mode):\n\n```bash\npip install -e .\n```\n\n---\n\n## ۳. آزمایش نصب در محیط پایتون\n\nبرای اطمینان از صحت نصب، پایتون را در ترمینال باز نموده و دستورات ذیل را اجرا فرمایید:\n\n```python\nimport parsikit\n\nprint(parsikit.__version__)\n# خروجی باید '3.3.1' باشد\n```\n",
    "headings": [
      {
        "id": "رهنمود-نصب-و-راه-اندازی-پارسی-کیت",
        "text": "رهنمود نصب و راه‌اندازی پارسی‌کیت",
        "level": 1
      },
      {
        "id": "نیازمندی-های-سیستم",
        "text": "نیازمندی‌های سیستم",
        "level": 2
      },
      {
        "id": "۱-نصب-مستقیم-از-طریق-pip",
        "text": "۱. نصب مستقیم از طریق pip",
        "level": 2
      },
      {
        "id": "نصب-با-poetry",
        "text": "نصب با Poetry",
        "level": 1
      },
      {
        "id": "نصب-با-uv",
        "text": "نصب با uv",
        "level": 1
      },
      {
        "id": "۲-نصب-مستقیم-از-سورس-کد-github",
        "text": "۲. نصب مستقیم از سورس کد (GitHub)",
        "level": 2
      },
      {
        "id": "۳-آزمایش-نصب-در-محیط-پایتون",
        "text": "۳. آزمایش نصب در محیط پایتون",
        "level": 2
      },
      {
        "id": "خروجی-باید-3-3-1-باشد",
        "text": "خروجی باید '3.3.1' باشد",
        "level": 1
      }
    ],
    "filePath": "/app/applet/repo_data/docs/prs-af/installation.md",
    "counterparts": {
      "fa": "installation",
      "en": "installation",
      "tg": "installation"
    },
    "counterpartSlug": "installation"
  },
  {
    "id": "prs-af-quickstart",
    "slug": "quickstart",
    "lang": "prs-af",
    "category": "getting-started",
    "title": "آغاز سریع با پارسی‌کیت (Quickstart)",
    "summary": "در این بخش با چند مثال کاربردی و روزمره با قابلیت‌های اساسی پارسی‌کیت آشنا می‌شویم.",
    "content": "# آغاز سریع با پارسی‌کیت (Quickstart)\n\nدر این بخش با چند مثال کاربردی و روزمره با قابلیت‌های اساسی پارسی‌کیت آشنا می‌شویم.\n\n---\n\n## ۱. تصفیه متن و معیارسازی حروف و نیم‌فاصله‌ها\n\nیکی از چالش‌های رایج در متون دری، اختلاط حروف عربی («ي» و «ك») و نبود نیم‌فاصله معیاری در کلمات مرکب است:\n\n```python\nimport parsikit\n\nraw_text = \"ي كافيه كتاب ها را جمع آوري كنم\"\ncleaned = parsikit.standardize_persian(raw_text)\n\nprint(cleaned)\n# خروجی: 'ی کافیه کتاب‌ها را جمع‌آوری کنم'\n```\n\nحروف «ی» و «ک» اصلاح شده و نیم‌فاصله‌های استاندارد به درستی جاگذاری گردیدند.\n\n---\n\n## ۲. تثبیت اعتبار شماره هویت و تذکره الکترونیکی\n\nشما می‌توانید از تابع مستقیم یا کلاس شیءگرای `NationalCode` استفاده فرمایید:\n\n```python\nimport parsikit\n\n# بررسی تابعی:\nis_valid = parsikit.is_valid_national_code(\"0010123458\")\nprint(is_valid)  # خروجی: True\n\n# بررسی شیءگرا:\nnc = parsikit.NationalCode(\"0010123458\")\nprint(nc.formatted)  # '001-012345-8'\nprint(nc.masked)     # '001-****45-8'\nprint(nc.clean)      # '0010123458'\n```\n\nدر صورت نامعتبر بودن شماره یا عدم تطابق الگوریتم پیمانه ۱۱، خطای ساختاریافته `InvalidNationalCodeError` صادر خواهد شد.\n\n---\n\n## ۳. تثبیت کارت بانکی با الگوریتم لون\n\n```python\nimport parsikit\n\ncard_number = \"6037991122334455\"\n\n# بررسی صحت شماره کارت\nprint(parsikit.is_valid_card_number(card_number))  # True\n\n# تشخیص خودکار بانک صادرکننده\nprint(parsikit.detect_bank_from_card(card_number))  # 'بانک ملی ایران'\n\n# ماسک‌کردن امن جهت حفظ محرمانگی\nprint(parsikit.mask_card(card_number))  # '6037-9911-****-4455'\n```\n\n---\n\n## ۴. تقویم هجری شمسی و سال کبیسه\n\n```python\nimport parsikit\n\n# تبدیل تاریخ میلادی به هجری شمسی\nshamsi = parsikit.gregorian_to_jalali(2026, 10, 21)\nprint(shamsi)\n# خروجی: (1405, 7, 29) -> ۲۹ میزان (مهر) ۱۴۰۵\n\n# محاسبه دقیق سال کبیسه در چرخه ۳۳ ساله نجومی\nprint(parsikit.is_jalali_leap(1403))  # True\nprint(parsikit.is_jalali_leap(1404))  # False\n```\n\n---\n\n## ۵. تبدیل ارقام و مبالغ به حروف\n\n```python\nimport parsikit\n\namount = 3500000\nwords = parsikit.number_to_persian_words(amount)\nprint(words)\n# خروجی: 'سه میلیون و پانصد هزار'\n```\n",
    "headings": [
      {
        "id": "آغاز-سریع-با-پارسی-کیت-quickstart",
        "text": "آغاز سریع با پارسی‌کیت (Quickstart)",
        "level": 1
      },
      {
        "id": "۱-تصفیه-متن-و-معیارسازی-حروف-و-نیم-فاصله-ها",
        "text": "۱. تصفیه متن و معیارسازی حروف و نیم‌فاصله‌ها",
        "level": 2
      },
      {
        "id": "خروجی-ی-کافیه-کتاب-ها-را-جمع-آوری-کنم",
        "text": "خروجی: 'ی کافیه کتاب‌ها را جمع‌آوری کنم'",
        "level": 1
      },
      {
        "id": "۲-تثبیت-اعتبار-شماره-هویت-و-تذکره-الکترونیکی",
        "text": "۲. تثبیت اعتبار شماره هویت و تذکره الکترونیکی",
        "level": 2
      },
      {
        "id": "بررسی-تابعی",
        "text": "بررسی تابعی:",
        "level": 1
      },
      {
        "id": "بررسی-شیءگرا",
        "text": "بررسی شیءگرا:",
        "level": 1
      },
      {
        "id": "۳-تثبیت-کارت-بانکی-با-الگوریتم-لون",
        "text": "۳. تثبیت کارت بانکی با الگوریتم لون",
        "level": 2
      },
      {
        "id": "بررسی-صحت-شماره-کارت",
        "text": "بررسی صحت شماره کارت",
        "level": 1
      },
      {
        "id": "تشخیص-خودکار-بانک-صادرکننده",
        "text": "تشخیص خودکار بانک صادرکننده",
        "level": 1
      },
      {
        "id": "ماسک-کردن-امن-جهت-حفظ-محرمانگی",
        "text": "ماسک‌کردن امن جهت حفظ محرمانگی",
        "level": 1
      },
      {
        "id": "۴-تقویم-هجری-شمسی-و-سال-کبیسه",
        "text": "۴. تقویم هجری شمسی و سال کبیسه",
        "level": 2
      },
      {
        "id": "تبدیل-تاریخ-میلادی-به-هجری-شمسی",
        "text": "تبدیل تاریخ میلادی به هجری شمسی",
        "level": 1
      },
      {
        "id": "خروجی-1405-7-29-۲۹-میزان-مهر-۱۴۰۵",
        "text": "خروجی: (1405, 7, 29) -> ۲۹ میزان (مهر) ۱۴۰۵",
        "level": 1
      },
      {
        "id": "محاسبه-دقیق-سال-کبیسه-در-چرخه-۳۳-ساله-نجومی",
        "text": "محاسبه دقیق سال کبیسه در چرخه ۳۳ ساله نجومی",
        "level": 1
      },
      {
        "id": "۵-تبدیل-ارقام-و-مبالغ-به-حروف",
        "text": "۵. تبدیل ارقام و مبالغ به حروف",
        "level": 2
      },
      {
        "id": "خروجی-سه-میلیون-و-پانصد-هزار",
        "text": "خروجی: 'سه میلیون و پانصد هزار'",
        "level": 1
      }
    ],
    "filePath": "/app/applet/repo_data/docs/prs-af/quickstart.md",
    "counterparts": {
      "fa": "quickstart",
      "en": "quickstart",
      "tg": "quickstart"
    },
    "counterpartSlug": "quickstart"
  },
  {
    "id": "prs-af-troubleshooting",
    "slug": "troubleshooting",
    "lang": "prs-af",
    "category": "getting-started",
    "title": "عیب‌یابی و رفع اشکالات متداول",
    "summary": "راهکارهای حل اشکالاتی که ممکن است در جریان استفاده از پارسی‌کیت با آنها روبرو شوید.",
    "content": "# عیب‌یابی و رفع اشکالات متداول\n\nراهکارهای حل اشکالاتی که ممکن است در جریان استفاده از پارسی‌کیت با آنها روبرو شوید.\n\n---\n\n## ۱. خطای `InvalidNationalCodeError`\n\nاین استثنا زمانی رخ می‌دهد که ورودی با استانداردهای چک‌سام پیمانه ۱۱ همخوانی نداشته باشد:\n\n- اطمینان حاصل کنید که ارقام ورودی دقیقاً ۱۰ رقم باشند.\n- ورودی نباید از ۱۰ رقم تکراری یکسان (مانند `1111111111`) تشکیل شده باشد.\n- با استفاده از بلوک `try ... except` این خطا را به درستی مدیریت نمایید:\n\n```python\nfrom parsikit.exceptions import InvalidNationalCodeError\nfrom parsikit.models import NationalCode\n\ntry:\n    code = NationalCode(\"1234567890\")\nexcept InvalidNationalCodeError as e:\n    print(f\"شماره هویت نامعتبر است: {e}\")\n```\n\n---\n\n## ۲. خطای `InvalidCardNumberError`\n\nاین خطا ناشی از عدم تطابق شماره کارت با الگوریتم لون (Luhn Checksum) است:\n\n- شماره کارت باید ۱۶ رقم باشد.\n- فواصل و خط فاصله‌ها به صورت خودکار توسط متدها حذف می‌شوند.\n\n---\n\n## ۳. عدم نمایش صحیح متون دارای نیم‌فاصله در ترمینال\n\nبعضی از ترمینال‌های قدیمی کاراکتر نیم‌فاصله (ZWNJ) را به شکل نامرئی یا با فاصله نادرست ترسیم می‌کنند. برای نمایش دقیق در کنسول می‌توانید از متدهای موجود در ماژول `parsikit.dev` جهت تراز بصری متن‌ها استفاده کنید.\n",
    "headings": [
      {
        "id": "عیب-یابی-و-رفع-اشکالات-متداول",
        "text": "عیب‌یابی و رفع اشکالات متداول",
        "level": 1
      },
      {
        "id": "۱-خطای-invalidnationalcodeerror",
        "text": "۱. خطای `InvalidNationalCodeError`",
        "level": 2
      },
      {
        "id": "۲-خطای-invalidcardnumbererror",
        "text": "۲. خطای `InvalidCardNumberError`",
        "level": 2
      },
      {
        "id": "۳-عدم-نمایش-صحیح-متون-دارای-نیم-فاصله-در-ترمینال",
        "text": "۳. عدم نمایش صحیح متون دارای نیم‌فاصله در ترمینال",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/prs-af/troubleshooting.md",
    "counterparts": {
      "fa": "troubleshooting",
      "en": "troubleshooting",
      "tg": "troubleshooting"
    },
    "counterpartSlug": "troubleshooting"
  },
  {
    "id": "prs-af-tutorials-datetime",
    "slug": "tutorials/datetime",
    "lang": "prs-af",
    "category": "tutorials",
    "title": "آموزش تقویم نجومی هجری شمسی",
    "summary": "نحوه تبدیل تاریخ‌ها و مدیریت محاسبات تقویم خورشیدی در پروژه‌های پایتون.",
    "content": "# آموزش تقویم نجومی هجری شمسی\n\nنحوه تبدیل تاریخ‌ها و مدیریت محاسبات تقویم خورشیدی در پروژه‌های پایتون.\n\n---\n\n## ۱. تبدیل تاریخ میلادی به هجری شمسی\n\n```python\nimport parsikit\n\nyear, month, day = 2026, 10, 21\njy, jm, jd = parsikit.gregorian_to_jalali(year, month, day)\n\nprint(f\"تاریخ هجری شمسی: {jy}/{jm:02d}/{jd:02d}\")\n# خروجی: 1405/07/29\n```\n\n---\n\n## ۲. بررسی سال کبیسه در چرخه ۳۳ ساله\n\n```python\nimport parsikit\n\nprint(\"1403 کبیسه است؟\", parsikit.is_jalali_leap(1403))  # True\nprint(\"1404 کبیسه است؟\", parsikit.is_jalali_leap(1404))  # False\n```\n",
    "headings": [
      {
        "id": "آموزش-تقویم-نجومی-هجری-شمسی",
        "text": "آموزش تقویم نجومی هجری شمسی",
        "level": 1
      },
      {
        "id": "۱-تبدیل-تاریخ-میلادی-به-هجری-شمسی",
        "text": "۱. تبدیل تاریخ میلادی به هجری شمسی",
        "level": 2
      },
      {
        "id": "خروجی-1405-07-29",
        "text": "خروجی: 1405/07/29",
        "level": 1
      },
      {
        "id": "۲-بررسی-سال-کبیسه-در-چرخه-۳۳-ساله",
        "text": "۲. بررسی سال کبیسه در چرخه ۳۳ ساله",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/prs-af/tutorials/datetime.md",
    "counterparts": {
      "fa": "tutorials/datetime",
      "en": "tutorials/datetime",
      "tg": "tutorials/datetime"
    },
    "counterpartSlug": "tutorials/datetime"
  },
  {
    "id": "prs-af-tutorials-numbers_and_currency",
    "slug": "tutorials/numbers_and_currency",
    "lang": "prs-af",
    "category": "tutorials",
    "title": "آموزش محاسبات ارقام و مبالغ مالی",
    "summary": "آموزش تبدیل اعداد به نوشتار حروفی و قالب‌بندی ارقام.",
    "content": "# آموزش محاسبات ارقام و مبالغ مالی\n\nآموزش تبدیل اعداد به نوشتار حروفی و قالب‌بندی ارقام.\n\n---\n\n## ۱. تبدیل اعداد به حروف\n\n```python\nimport parsikit\n\nnum = 12450000\nwords = parsikit.number_to_persian_words(num)\nprint(words)\n# خروجی: 'دوازده میلیون و چهارصد و پنجاه هزار'\n```\n\n---\n\n## ۲. قالب‌بندی مبالغ پولی\n\n```python\nimport parsikit\n\nformatted = parsikit.format_currency(3500000, unit=\"افغانی\")\nprint(formatted)\n```\n",
    "headings": [
      {
        "id": "آموزش-محاسبات-ارقام-و-مبالغ-مالی",
        "text": "آموزش محاسبات ارقام و مبالغ مالی",
        "level": 1
      },
      {
        "id": "۱-تبدیل-اعداد-به-حروف",
        "text": "۱. تبدیل اعداد به حروف",
        "level": 2
      },
      {
        "id": "خروجی-دوازده-میلیون-و-چهارصد-و-پنجاه-هزار",
        "text": "خروجی: 'دوازده میلیون و چهارصد و پنجاه هزار'",
        "level": 1
      },
      {
        "id": "۲-قالب-بندی-مبالغ-پولی",
        "text": "۲. قالب‌بندی مبالغ پولی",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/prs-af/tutorials/numbers_and_currency.md",
    "counterparts": {
      "fa": "tutorials/numbers_and_currency",
      "en": "tutorials/numbers_and_currency",
      "tg": "tutorials/numbers_and_currency"
    },
    "counterpartSlug": "tutorials/numbers_and_currency"
  },
  {
    "id": "prs-af-tutorials-text_processing",
    "slug": "tutorials/text_processing",
    "lang": "prs-af",
    "category": "tutorials",
    "title": "آموزش تصفیه متن و نیم‌فاصله‌ها در زبان دری",
    "summary": "در این آموزش گام‌به‌گام با نحوه استفاده از ابزارهای تصفیه متن و نیم‌فاصله‌ها در پارسی‌کیت آشنا می‌شوید.",
    "content": "# آموزش تصفیه متن و نیم‌فاصله‌ها در زبان دری\n\nدر این آموزش گام‌به‌گام با نحوه استفاده از ابزارهای تصفیه متن و نیم‌فاصله‌ها در پارسی‌کیت آشنا می‌شوید.\n\n---\n\n## ۱. حذف کاراکترهای عربی ناخواسته\n\nمتون فارسی و دری که از کیبوردهای متفرقه یا پایگاه‌های داده وب جمع‌آوری می‌شوند اغلب دارای کاراکترهای عربی مانند «ي» با دو نقطه یا «ك» با همزه هستند:\n\n```python\nimport parsikit\n\ndirty = \"اين يك متن آزمايشي است\"\nclean = parsikit.standardize_persian(dirty)\nprint(clean)\n# خروجی: 'این یک متن آزمایشی است'\n```\n\n---\n\n## ۲. تصحیح نیم‌فاصله‌های پیشوندی و پسوندی\n\nکلمات دارای پسوند جمع («ها») یا پیشوند استمرار («می») نیازمند نیم‌فاصله (ZWNJ) هستند تا به درستی نگارش شوند:\n\n```python\nimport parsikit\n\ntext = \"کتاب ها را می خوانم\"\ncorrected = parsikit.clean_text(text)\nprint(corrected)\n# خروجی: 'کتاب‌ها را می‌خوانم'\n```\n",
    "headings": [
      {
        "id": "آموزش-تصفیه-متن-و-نیم-فاصله-ها-در-زبان-دری",
        "text": "آموزش تصفیه متن و نیم‌فاصله‌ها در زبان دری",
        "level": 1
      },
      {
        "id": "۱-حذف-کاراکترهای-عربی-ناخواسته",
        "text": "۱. حذف کاراکترهای عربی ناخواسته",
        "level": 2
      },
      {
        "id": "خروجی-این-یک-متن-آزمایشی-است",
        "text": "خروجی: 'این یک متن آزمایشی است'",
        "level": 1
      },
      {
        "id": "۲-تصحیح-نیم-فاصله-های-پیشوندی-و-پسوندی",
        "text": "۲. تصحیح نیم‌فاصله‌های پیشوندی و پسوندی",
        "level": 2
      },
      {
        "id": "خروجی-کتاب-ها-را-می-خوانم",
        "text": "خروجی: 'کتاب‌ها را می‌خوانم'",
        "level": 1
      }
    ],
    "filePath": "/app/applet/repo_data/docs/prs-af/tutorials/text_processing.md",
    "counterparts": {
      "fa": "tutorials/text_processing",
      "en": "tutorials/text_processing",
      "tg": "tutorials/text_processing"
    },
    "counterpartSlug": "tutorials/text_processing"
  },
  {
    "id": "prs-af-tutorials-validation",
    "slug": "tutorials/validation",
    "lang": "prs-af",
    "category": "tutorials",
    "title": "آموزش تثبیت اعتبار اسناد و کارت‌های بانکی",
    "summary": "این آموزش به تشریح نحوه اعتبارسنجی شماره‌های تذکره الکترونیکی، کد ملی و کارت‌های بانکی می‌پردازد.",
    "content": "# آموزش تثبیت اعتبار اسناد و کارت‌های بانکی\n\nاین آموزش به تشریح نحوه اعتبارسنجی شماره‌های تذکره الکترونیکی، کد ملی و کارت‌های بانکی می‌پردازد.\n\n---\n\n## ۱. تثبیت اعتبار با الگوریتم پیمانه ۱۱\n\nالگوریتم پیمانه ۱۱ با ضرب وزن‌های نزولی در ارقام و محاسبه باقیمانده بر ۱۱ کار می‌کند:\n\n```python\nimport parsikit\n\n# بررسی شماره تذکره / کد ملی\nvalid = parsikit.is_valid_national_code(\"0010123458\")\nprint(f\"وضعیت اعتبار: {valid}\")\n```\n\n---\n\n## ۲. بررسی کارت بانکی با الگوریتم لون\n\n```python\nimport parsikit\n\ncard = \"6037991122334455\"\nif parsikit.is_valid_card_number(card):\n    bank = parsikit.detect_bank_from_card(card)\n    masked = parsikit.mask_card(card)\n    print(f\"بانک صادرکننده: {bank} | شماره ماسک‌شده: {masked}\")\n```\n",
    "headings": [
      {
        "id": "آموزش-تثبیت-اعتبار-اسناد-و-کارت-های-بانکی",
        "text": "آموزش تثبیت اعتبار اسناد و کارت‌های بانکی",
        "level": 1
      },
      {
        "id": "۱-تثبیت-اعتبار-با-الگوریتم-پیمانه-۱۱",
        "text": "۱. تثبیت اعتبار با الگوریتم پیمانه ۱۱",
        "level": 2
      },
      {
        "id": "بررسی-شماره-تذکره-کد-ملی",
        "text": "بررسی شماره تذکره / کد ملی",
        "level": 1
      },
      {
        "id": "۲-بررسی-کارت-بانکی-با-الگوریتم-لون",
        "text": "۲. بررسی کارت بانکی با الگوریتم لون",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/prs-af/tutorials/validation.md",
    "counterparts": {
      "fa": "tutorials/validation",
      "en": "tutorials/validation",
      "tg": "tutorials/validation"
    },
    "counterpartSlug": "tutorials/validation"
  },
  {
    "id": "tg-api-cache",
    "slug": "api/cache",
    "lang": "tg",
    "category": "api",
    "title": "Модули кеши сареъ (parsikit.cache)",
    "summary": "Модули parsikit.cache механизми кешкунии бисёрриштагӣ (Thread-safe LRU Cache)-ро таъмин менамояд.",
    "content": "# Модули кеши сареъ (parsikit.cache)\n\nМодули `parsikit.cache` механизми кешкунии бисёрриштагӣ (Thread-safe LRU Cache)-ро таъмин менамояд.\n\n---\n\n## Хусусиятҳо\n\n- Истифода аз модулҳои стандартии Python бе ниёз ба китобхонаҳои беруна\n- Қулфбандии `threading.Lock` барои ҳифзи амнияти риштаҳо дар сервери веб\n- Андозаи танзимшаванда (андозаи пешфарз: 1024)\n",
    "headings": [
      {
        "id": "модули-кеши-сареъ-parsikit-cache",
        "text": "Модули кеши сареъ (parsikit.cache)",
        "level": 1
      },
      {
        "id": "хусусиятҳо",
        "text": "Хусусиятҳо",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/tg/api/cache.md",
    "counterparts": {
      "fa": "api/cache",
      "en": "api/cache",
      "prs-af": "api/cache"
    },
    "counterpartSlug": "api/cache"
  },
  {
    "id": "tg-api-datetime",
    "slug": "api/datetime",
    "lang": "tg",
    "category": "api",
    "title": "Модули тақвим ва замон (parsikit.datetime)",
    "summary": "Табдили дақиқи таърихҳои мелодӣ ва ҳиҷрии шамсӣ (Jalali).",
    "content": "# Модули тақвим ва замон (parsikit.datetime)\n\nТабдили дақиқи таърихҳои мелодӣ ва ҳиҷрии шамсӣ (Jalali).\n\n---\n\n## Тавобеи асосӣ\n\n### `gregorian_to_jalali(gy: int, gm: int, gd: int) -> Tuple[int, int, int]`\nТабдили санаи мелодӣ ба санаи муодили ҳиҷрии шамсӣ.\n\n### `jalali_to_gregorian(jy: int, jm: int, jd: int) -> Tuple[int, int, int]`\nТабдили санаи ҳиҷрии шамсӣ ба санаи мелодӣ.\n\n### `is_jalali_leap(year: int) -> bool`\nҲисоби соли кабиса дар даври 33-солаи нуҷумӣ.\n",
    "headings": [
      {
        "id": "модули-тақвим-ва-замон-parsikit-datetime",
        "text": "Модули тақвим ва замон (parsikit.datetime)",
        "level": 1
      },
      {
        "id": "тавобеи-асосӣ",
        "text": "Тавобеи асосӣ",
        "level": 2
      },
      {
        "id": "gregorian_to_jalali-gy-int-gm-int-gd-int-tuple-int-int-int",
        "text": "`gregorian_to_jalali(gy: int, gm: int, gd: int) -> Tuple[int, int, int]`",
        "level": 3
      },
      {
        "id": "jalali_to_gregorian-jy-int-jm-int-jd-int-tuple-int-int-int",
        "text": "`jalali_to_gregorian(jy: int, jm: int, jd: int) -> Tuple[int, int, int]`",
        "level": 3
      },
      {
        "id": "is_jalali_leap-year-int-bool",
        "text": "`is_jalali_leap(year: int) -> bool`",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/tg/api/datetime.md",
    "counterparts": {
      "fa": "api/datetime",
      "en": "api/datetime",
      "prs-af": "api/datetime"
    },
    "counterpartSlug": "api/datetime"
  },
  {
    "id": "tg-api-index",
    "slug": "api/index",
    "lang": "tg",
    "category": "api",
    "title": "Мундариҷаи расмии API (ParsiKit)",
    "summary": "Ин саҳифа тамоми модулҳо, тавобеъ ва классҳои китобхонаи ParsiKit-ро дар бар мегирад.",
    "content": "# Мундариҷаи расмии API (ParsiKit)\n\nИн саҳифа тамоми модулҳо, тавобеъ ва классҳои китобхонаи ParsiKit-ро дар бар мегирад.\n\n---\n\n## Модулҳо\n\n| Модул | Вазифа ва шарҳ |\n| :--- | :--- |\n| `parsikit.text` | Поксозии матн, танзими нимафосилаҳо ва мутобиқсозии ҳарфҳо |\n| `parsikit.validators` | Санҷиши чексам ва эътибори рақами миллӣ ва кортҳои бонкӣ |\n| `parsikit.datetime` | Тақвими нуҷумии ҳиҷрии шамсӣ ва ҳисоби соли кабиса |\n| `parsikit.currency` | Табдили ададҳо ба калимаҳо ва ҳисобҳои воҳидҳои пулӣ |\n| `parsikit.models` | Моделҳои объектгаро бо санҷиши худкор |\n| `parsikit.cache` | Кеши сареъ барои муҳити бисёрриштагӣ (Thread-safe LRU Cache) |\n",
    "headings": [
      {
        "id": "мундариҷаи-расмии-api-parsikit",
        "text": "Мундариҷаи расмии API (ParsiKit)",
        "level": 1
      },
      {
        "id": "модулҳо",
        "text": "Модулҳо",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/tg/api/index.md",
    "counterparts": {
      "fa": "api/index",
      "en": "api/index",
      "prs-af": "api/index"
    },
    "counterpartSlug": "api/index"
  },
  {
    "id": "tg-api-models",
    "slug": "api/models",
    "lang": "tg",
    "category": "api",
    "title": "Моделҳои объектгаро (parsikit.models)",
    "summary": "Классҳои моделӣ барои нигоҳдорӣ ва санҷиши худкори додаҳо.",
    "content": "# Моделҳои объектгаро (parsikit.models)\n\nКлассҳои моделӣ барои нигоҳдорӣ ва санҷиши худкори додаҳо.\n\n---\n\n## Классҳо\n\n### `NationalCode`\nМодели нигоҳдорандаи рақами миллӣ:\n- `nc.formatted`: шакли ҷудошуда бо тире\n- `nc.masked`: шакли амн бо ситорачаҳо\n- `nc.clean`: сатри холиси рақамҳо\n\n### `BankCard`\nМодели корти бонкӣ:\n- `card.is_valid`: вазъияти эътибор бо Лун\n- `card.bank_name`: номи бонки интишоркунанда\n- `card.masked`: рақами амни ниқоббаста\n",
    "headings": [
      {
        "id": "моделҳои-объектгаро-parsikit-models",
        "text": "Моделҳои объектгаро (parsikit.models)",
        "level": 1
      },
      {
        "id": "классҳо",
        "text": "Классҳо",
        "level": 2
      },
      {
        "id": "nationalcode",
        "text": "`NationalCode`",
        "level": 3
      },
      {
        "id": "bankcard",
        "text": "`BankCard`",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/tg/api/models.md",
    "counterparts": {
      "fa": "api/models",
      "en": "api/models",
      "prs-af": "api/models"
    },
    "counterpartSlug": "api/models"
  },
  {
    "id": "tg-api-number_and_currency",
    "slug": "api/number_and_currency",
    "lang": "tg",
    "category": "api",
    "title": "Модули ҳисобҳои молӣ ва калимаҳо (parsikit.currency)",
    "summary": "Табдили ададҳо ба калимаҳои хоно ва ҳисобҳои воҳидҳои пулӣ.",
    "content": "# Модули ҳисобҳои молӣ ва калимаҳо (parsikit.currency)\n\nТабдили ададҳо ба калимаҳои хоно ва ҳисобҳои воҳидҳои пулӣ.\n\n---\n\n## Тавобеъ\n\n### `number_to_persian_words(num: int) -> str`\nТабдили ададҳо то 999 септиллион ба шакли лафзӣ.\n\n### `format_currency(amount: int, unit: str = \"toman\") -> str`\nТартибдиҳии ададҳо бо ҷудокунии 3-рақама ва номи воҳиди пул.\n",
    "headings": [
      {
        "id": "модули-ҳисобҳои-молӣ-ва-калимаҳо-parsikit-currency",
        "text": "Модули ҳисобҳои молӣ ва калимаҳо (parsikit.currency)",
        "level": 1
      },
      {
        "id": "тавобеъ",
        "text": "Тавобеъ",
        "level": 2
      },
      {
        "id": "number_to_persian_words-num-int-str",
        "text": "`number_to_persian_words(num: int) -> str`",
        "level": 3
      },
      {
        "id": "format_currency-amount-int-unit-str-toman-str",
        "text": "`format_currency(amount: int, unit: str = \"toman\") -> str`",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/tg/api/number_and_currency.md",
    "counterparts": {
      "fa": "api/number_and_currency",
      "en": "api/number_and_currency",
      "prs-af": "api/number_and_currency"
    },
    "counterpartSlug": "api/number_and_currency"
  },
  {
    "id": "tg-api-text",
    "slug": "api/text",
    "lang": "tg",
    "category": "api",
    "title": "Модули коркарди матн (parsikit.text)",
    "summary": "Тавобеи ин модул барои яксонсозии матн ва ислоҳи нимафосилаҳо мусоидат мекунанд.",
    "content": "# Модули коркарди матн (parsikit.text)\n\nТавобеи ин модул барои яксонсозии матн ва ислоҳи нимафосилаҳо мусоидат мекунанд.\n\n---\n\n## Тавобеи муҳим\n\n### `standardize_persian(text: str) -> str`\nҲарфҳои арабиро ба ҳуруфи стандартӣ табдил дода, фосилаҳои зиёдатиро ихтисор мекунад.\n\n### `clean_text(text: str) -> str`\nПоксозии куллӣ ва ҷойгузинии нимафосилаҳо дар пешвандҳо ва пасвандҳо.\n\n### `slugify(text: str) -> str`\nСохтани URL slug бо тарҷумаи овоӣ ба алифбои лотинӣ.\n",
    "headings": [
      {
        "id": "модули-коркарди-матн-parsikit-text",
        "text": "Модули коркарди матн (parsikit.text)",
        "level": 1
      },
      {
        "id": "тавобеи-муҳим",
        "text": "Тавобеи муҳим",
        "level": 2
      },
      {
        "id": "standardize_persian-text-str-str",
        "text": "`standardize_persian(text: str) -> str`",
        "level": 3
      },
      {
        "id": "clean_text-text-str-str",
        "text": "`clean_text(text: str) -> str`",
        "level": 3
      },
      {
        "id": "slugify-text-str-str",
        "text": "`slugify(text: str) -> str`",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/tg/api/text.md",
    "counterparts": {
      "fa": "api/text",
      "en": "api/text",
      "prs-af": "api/text"
    },
    "counterpartSlug": "api/text"
  },
  {
    "id": "tg-api-validators",
    "slug": "api/validators",
    "lang": "tg",
    "category": "api",
    "title": "Модули санҷиши эътибор (parsikit.validators)",
    "summary": "Алгоритмҳои расмии тафтиши чексам ва шинохти додаҳои ҳувиятӣ.",
    "content": "# Модули санҷиши эътибор (parsikit.validators)\n\nАлгоритмҳои расмии тафтиши чексам ва шинохти додаҳои ҳувиятӣ.\n\n---\n\n## Тавобеъ\n\n### `is_valid_national_code(code: str) -> bool`\nСанҷиши дурустии рақами миллӣ бар асоси алгоритми расмии Модуло 11.\n\n### `is_valid_card_number(card: str) -> bool`\nСанҷиши эътибори корти бонкии 16-рақама бо алгоритми Лун (Luhn).\n\n### `detect_bank_from_card(card: str) -> Optional[str]`\nМуайян кардани номи бонки интишоркунанда аз рӯи 6 рақами аввал.\n\n### `mask_card(card: str) -> str`\nНиқоббандии амни корти бонкӣ (мисол: `6037-9911-****-4455`).\n",
    "headings": [
      {
        "id": "модули-санҷиши-эътибор-parsikit-validators",
        "text": "Модули санҷиши эътибор (parsikit.validators)",
        "level": 1
      },
      {
        "id": "тавобеъ",
        "text": "Тавобеъ",
        "level": 2
      },
      {
        "id": "is_valid_national_code-code-str-bool",
        "text": "`is_valid_national_code(code: str) -> bool`",
        "level": 3
      },
      {
        "id": "is_valid_card_number-card-str-bool",
        "text": "`is_valid_card_number(card: str) -> bool`",
        "level": 3
      },
      {
        "id": "detect_bank_from_card-card-str-optional-str",
        "text": "`detect_bank_from_card(card: str) -> Optional[str]`",
        "level": 3
      },
      {
        "id": "mask_card-card-str-str",
        "text": "`mask_card(card: str) -> str`",
        "level": 3
      }
    ],
    "filePath": "/app/applet/repo_data/docs/tg/api/validators.md",
    "counterparts": {
      "fa": "api/validators",
      "en": "api/validators",
      "prs-af": "api/validators"
    },
    "counterpartSlug": "api/validators"
  },
  {
    "id": "tg-faq",
    "slug": "faq",
    "lang": "tg",
    "category": "getting-started",
    "title": "Саволҳои маъмул (FAQ)",
    "summary": "Дар ин саҳифа посух ба саволҳои асосӣ пешниҳод мегардад.",
    "content": "# Саволҳои маъмул (FAQ)\n\nДар ин саҳифа посух ба саволҳои асосӣ пешниҳод мегардад.\n\n---\n\n## 1. Оё ParsiKit ба китобхонаҳои беруна ниёз дорад?\n\nНе. ParsiKit бар пояи принсипи **бе вобастагӣ (Zero Dependencies)** сохта шудааст ва 100% бо Python-и холис кор мекунад.\n\n---\n\n## 2. Бо кадом нусхаҳои Python мутобиқ аст?\n\nАз Python 3.10 ва нусхаҳои навтар (3.11, 3.12, 3.13) комилан пуштибонӣ мешавад.\n\n---\n\n## 3. Тақвими шамсӣ чӣ тавр ҳисоб карда мешавад?\n\nҲисоботҳо бар асоси даври 33-солаи нуҷумии ҳиҷрии шамсӣ анҷом дода мешаванд, ки дақиқтарин модели тақвимӣ мебошад.\n",
    "headings": [
      {
        "id": "саволҳои-маъмул-faq",
        "text": "Саволҳои маъмул (FAQ)",
        "level": 1
      },
      {
        "id": "1-оё-parsikit-ба-китобхонаҳои-беруна-ниёз-дорад",
        "text": "1. Оё ParsiKit ба китобхонаҳои беруна ниёз дорад?",
        "level": 2
      },
      {
        "id": "2-бо-кадом-нусхаҳои-python-мутобиқ-аст",
        "text": "2. Бо кадом нусхаҳои Python мутобиқ аст?",
        "level": 2
      },
      {
        "id": "3-тақвими-шамсӣ-чӣ-тавр-ҳисоб-карда-мешавад",
        "text": "3. Тақвими шамсӣ чӣ тавр ҳисоб карда мешавад?",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/tg/faq.md",
    "counterparts": {
      "fa": "faq",
      "en": "faq",
      "prs-af": "faq"
    },
    "counterpartSlug": "faq"
  },
  {
    "id": "tg-guides-forms_and_security",
    "slug": "guides/forms_and_security",
    "lang": "tg",
    "category": "guides",
    "title": "Роҳнамои амнияти додаҳо ва санҷиши шаклҳо",
    "summary": "Усулҳои амнияти маълумот ва ниқоббандии додаҳои ҳассос.",
    "content": "# Роҳнамои амнияти додаҳо ва санҷиши шаклҳо\n\nУсулҳои амнияти маълумот ва ниқоббандии додаҳои ҳассос.\n\n---\n\n## 1. Ниқоббандии кортҳо ва телефонҳо\n\n```python\nimport parsikit\n\nraw_card = \"6037991122334455\"\nsafe_card = parsikit.mask_card(raw_card)\nprint(f\"Корти амн: {safe_card}\")\n```\n\n---\n\n## 2. Истифода дар FastAPI\n\n```python\nfrom parsikit.models import NationalCode\nfrom parsikit.exceptions import InvalidNationalCodeError\n\ndef validate_user(code: str):\n    try:\n        nc = NationalCode(code)\n        return nc.clean\n    except InvalidNationalCodeError:\n        raise ValueError(\"Рақами воридшуда беэътибор аст.\")\n```\n",
    "headings": [
      {
        "id": "роҳнамои-амнияти-додаҳо-ва-санҷиши-шаклҳо",
        "text": "Роҳнамои амнияти додаҳо ва санҷиши шаклҳо",
        "level": 1
      },
      {
        "id": "1-ниқоббандии-кортҳо-ва-телефонҳо",
        "text": "1. Ниқоббандии кортҳо ва телефонҳо",
        "level": 2
      },
      {
        "id": "2-истифода-дар-fastapi",
        "text": "2. Истифода дар FastAPI",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/tg/guides/forms_and_security.md",
    "counterparts": {
      "fa": "guides/forms_and_security",
      "en": "guides/forms_and_security",
      "prs-af": "guides/forms_and_security"
    },
    "counterpartSlug": "guides/forms_and_security"
  },
  {
    "id": "tg-index",
    "slug": "index",
    "lang": "tg",
    "category": "getting-started",
    "title": "Роҳнамои расмии китобхонаи ParsiKit",
    "summary": "Ба маркази ҳуҷҷатгузорӣ ва роҳнамоҳои китобхонаи ParsiKit хуш омадед.",
    "content": "# Роҳнамои расмии китобхонаи ParsiKit\n\nБа маркази ҳуҷҷатгузорӣ ва роҳнамоҳои китобхонаи **ParsiKit** хуш омадед.\n\nParsiKit як китобхонаи мустақил, боэътимод ва сабук дар забони Python (3.10+) мебошад, ки бидуни ниёз ба вобастагиҳои беруна (Zero Dependencies), маҷмӯаи васеи абзорҳоро барои коркард ва поксозии матн, санҷиши рақамҳои миллӣ ва кортҳои бонкӣ, тақвими шамсӣ ва ҳисоботи молӣ пешниҳод менамояд.\n\n---\n\n## Бахшҳои асосии ҳуҷҷатҳо\n\n- [Роҳнамои насб ва омодасозӣ](installation.md) — тарзи насб бо pip, poetry ва uv\n- [Оғози зуд дар 5 дақиқа](quickstart.md) — мисолҳои амалӣ ва оғоз бо функсияҳои асосӣ\n- [Саволҳои маъмул (FAQ)](faq.md) — ҷавоб ба саволҳо оид ба иҷозатнома ва имкониятҳо\n- [Бартараф кардани хатогиҳо](troubleshooting.md) — ҳалли мушкилоти эҳтимолӣ\n\n---\n\n## Омӯзишҳои қадам ба қадам\n\n- [Поксозии матн ва нимафосилаҳо](tutorials/text_processing.md) — стандартикунонии ҳуруф ва фосилаҳо\n- [Санҷиши эътибори рақамҳо ва кортҳо](tutorials/validation.md) — алгоритми Модуло 11 ва алгоритми Лун\n- [Тақвими нуҷумии ҳиҷрии шамсӣ](tutorials/datetime.md) — табдили дақиқи санаҳо ва ҳисоби соли кабиса\n- [Табдили ададҳо ба калимаҳо](tutorials/numbers_and_currency.md) — хониши лафзии рақамҳо ва ҳисобҳои молӣ\n\n---\n\n## Феҳристи тавобеъ ва модулҳо (API Reference)\n\n- [Мундариҷаи куллии API](api/index.md) — феҳристи тамоми модулҳо ва классҳо\n- [Модули коркарди матн (parsikit.text)](api/text.md) — тавобеи поксозӣ ва омодасозии матн\n- [Модули тафтиши эътибор (parsikit.validators)](api/validators.md) — санҷиши чексам ва чеки рақамҳо\n- [Модули тақвим ва замон (parsikit.datetime)](api/datetime.md) — табдили санаҳои мелодӣ ва шамсӣ\n- [Моделҳои объектгаро (parsikit.models)](api/models.md) — моделҳои маълумотӣ бо санҷиши худкор\n\n---\n\n## Мушаххасоти техникӣ\n\n- **Нусхаи ҷорӣ:** 3.3.1\n- **Талаботи Python:** Python >= 3.10\n- **Иҷозатнома:** MIT License\n- **Муаллиф ва роҳбари лоиҳа:** Алӣ Комронӣ (MRThugh)\n",
    "headings": [
      {
        "id": "роҳнамои-расмии-китобхонаи-parsikit",
        "text": "Роҳнамои расмии китобхонаи ParsiKit",
        "level": 1
      },
      {
        "id": "бахшҳои-асосии-ҳуҷҷатҳо",
        "text": "Бахшҳои асосии ҳуҷҷатҳо",
        "level": 2
      },
      {
        "id": "омӯзишҳои-қадам-ба-қадам",
        "text": "Омӯзишҳои қадам ба қадам",
        "level": 2
      },
      {
        "id": "феҳристи-тавобеъ-ва-модулҳо-api-reference",
        "text": "Феҳристи тавобеъ ва модулҳо (API Reference)",
        "level": 2
      },
      {
        "id": "мушаххасоти-техникӣ",
        "text": "Мушаххасоти техникӣ",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/tg/index.md",
    "counterparts": {
      "fa": "index",
      "en": "index",
      "prs-af": "index"
    },
    "counterpartSlug": "index"
  },
  {
    "id": "tg-installation",
    "slug": "installation",
    "lang": "tg",
    "category": "getting-started",
    "title": "Роҳнамои насб ва бакорандозии ParsiKit",
    "summary": "Китобхонаи ParsiKit комилан бо забони холиси Python (Pure Python) навишта шудааст ва ҳеҷ гуна вобастагӣ ба китобхонаҳои берунаи C надорад. Аз ин рӯ, он дар ҳама гуна системаи омил (Linux, macOS, Windo",
    "content": "# Роҳнамои насб ва бакорандозии ParsiKit\n\nКитобхонаи ParsiKit комилан бо забони холиси Python (Pure Python) навишта шудааст ва ҳеҷ гуна вобастагӣ ба китобхонаҳои берунаи C надорад. Аз ин рӯ, он дар ҳама гуна системаи омил (Linux, macOS, Windows) дар як лаҳза насб мегардад.\n\n---\n\n## Талаботи система\n\n- Забони Python **3.10** ё болотар (Python 3.10, 3.11, 3.12, 3.13)\n- Бе ниёз ба компилятор ё абзорҳои изофӣ\n\n---\n\n## 1. Насби мустақим тавассути pip\n\nОсонтарин роҳ барои насби нусхаи расмӣ аз PyPI:\n\n```bash\npip install parsikit\n```\n\nЁ бо истифода аз абзорҳои муосир:\n\n```bash\n# Бо Poetry\npoetry add parsikit\n\n# Бо uv\nuv add parsikit\n```\n\n---\n\n## 2. Насб аз манбаи лоиҳа (GitHub)\n\nБарои санҷиши нусхаи рушд аз GitHub:\n\n```bash\ngit clone https://github.com/MRThugh/ParsiKit.git\ncd ParsiKit\npip install .\n```\n\n---\n\n## 3. Санҷиши насб дар Python\n\nБарои итминон аз насби дуруст дар терминали худ санҷед:\n\n```python\nimport parsikit\n\nprint(parsikit.__version__)\n# Натиҷа бояд '3.3.1' бошад\n```\n",
    "headings": [
      {
        "id": "роҳнамои-насб-ва-бакорандозии-parsikit",
        "text": "Роҳнамои насб ва бакорандозии ParsiKit",
        "level": 1
      },
      {
        "id": "талаботи-система",
        "text": "Талаботи система",
        "level": 2
      },
      {
        "id": "1-насби-мустақим-тавассути-pip",
        "text": "1. Насби мустақим тавассути pip",
        "level": 2
      },
      {
        "id": "бо-poetry",
        "text": "Бо Poetry",
        "level": 1
      },
      {
        "id": "бо-uv",
        "text": "Бо uv",
        "level": 1
      },
      {
        "id": "2-насб-аз-манбаи-лоиҳа-github",
        "text": "2. Насб аз манбаи лоиҳа (GitHub)",
        "level": 2
      },
      {
        "id": "3-санҷиши-насб-дар-python",
        "text": "3. Санҷиши насб дар Python",
        "level": 2
      },
      {
        "id": "натиҷа-бояд-3-3-1-бошад",
        "text": "Натиҷа бояд '3.3.1' бошад",
        "level": 1
      }
    ],
    "filePath": "/app/applet/repo_data/docs/tg/installation.md",
    "counterparts": {
      "fa": "installation",
      "en": "installation",
      "prs-af": "installation"
    },
    "counterpartSlug": "installation"
  },
  {
    "id": "tg-quickstart",
    "slug": "quickstart",
    "lang": "tg",
    "category": "getting-started",
    "title": "Оғози зуд бо ParsiKit (Quickstart)",
    "summary": "Дар ин бахш бо мисолҳои сода ва муҳимтарини коркарди ParsiKit шинос мешавем.",
    "content": "# Оғози зуд бо ParsiKit (Quickstart)\n\nДар ин бахш бо мисолҳои сода ва муҳимтарини коркарди ParsiKit шинос мешавем.\n\n---\n\n## 1. Поксозии матн ва нимафосилаҳо\n\n```python\nimport parsikit\n\ndirty_text = \"ي كافيه كتاب ها رو برداري\"\nclean_text = parsikit.standardize_persian(dirty_text)\n\nprint(clean_text)\n# Натиҷа: 'ی کافیه کتاب‌ها رو برداری'\n```\n\n---\n\n## 2. Санҷиши рақами миллӣ (National Code)\n\n```python\nimport parsikit\n\n# Тарзи функсионалӣ:\nis_ok = parsikit.is_valid_national_code(\"0010123458\")\nprint(is_ok)  # True\n\n# Тарзи объектгаро:\nnc = parsikit.NationalCode(\"0010123458\")\nprint(nc.formatted)  # '001-012345-8'\nprint(nc.masked)     # '001-****45-8'\n```\n\n---\n\n## 3. Санҷиши корти бонкӣ бо алгоритми Лун\n\n```python\nimport parsikit\n\ncard = \"6037991122334455\"\nprint(parsikit.is_valid_card_number(card))   # True\nprint(parsikit.detect_bank_from_card(card))  # 'بانک ملی ایران'\nprint(parsikit.mask_card(card))              # '6037-9911-****-4455'\n```\n\n---\n\n## 4. Тақвими ҳиҷрии шамсӣ\n\n```python\nimport parsikit\n\n# Табдил додани таърихи мелодӣ ба ҳиҷрии шамсӣ\nshamsi = parsikit.gregorian_to_jalali(2026, 10, 21)\nprint(shamsi)\n# Натиҷа: (1405, 7, 29) -> 29 меҳри 1405\n\n# Ҳисоби соли кабиса\nprint(parsikit.is_jalali_leap(1403))  # True\nprint(parsikit.is_jalali_leap(1404))  # False\n```\n\n---\n\n## 5. Табдили рақамҳо ба калимаҳо\n\n```python\nimport parsikit\n\namount = 3500000\nwords = parsikit.number_to_persian_words(amount)\nprint(words)\n# Натиҷа: 'سه میلیون و پانصد هزار'\n```\n",
    "headings": [
      {
        "id": "оғози-зуд-бо-parsikit-quickstart",
        "text": "Оғози зуд бо ParsiKit (Quickstart)",
        "level": 1
      },
      {
        "id": "1-поксозии-матн-ва-нимафосилаҳо",
        "text": "1. Поксозии матн ва нимафосилаҳо",
        "level": 2
      },
      {
        "id": "натиҷа-ی-کافیه-کتاب-ها-رو-برداری",
        "text": "Натиҷа: 'ی کافیه کتاب‌ها رو برداری'",
        "level": 1
      },
      {
        "id": "2-санҷиши-рақами-миллӣ-national-code",
        "text": "2. Санҷиши рақами миллӣ (National Code)",
        "level": 2
      },
      {
        "id": "тарзи-функсионалӣ",
        "text": "Тарзи функсионалӣ:",
        "level": 1
      },
      {
        "id": "тарзи-объектгаро",
        "text": "Тарзи объектгаро:",
        "level": 1
      },
      {
        "id": "3-санҷиши-корти-бонкӣ-бо-алгоритми-лун",
        "text": "3. Санҷиши корти бонкӣ бо алгоритми Лун",
        "level": 2
      },
      {
        "id": "4-тақвими-ҳиҷрии-шамсӣ",
        "text": "4. Тақвими ҳиҷрии шамсӣ",
        "level": 2
      },
      {
        "id": "табдил-додани-таърихи-мелодӣ-ба-ҳиҷрии-шамсӣ",
        "text": "Табдил додани таърихи мелодӣ ба ҳиҷрии шамсӣ",
        "level": 1
      },
      {
        "id": "натиҷа-1405-7-29-29-меҳри-1405",
        "text": "Натиҷа: (1405, 7, 29) -> 29 меҳри 1405",
        "level": 1
      },
      {
        "id": "ҳисоби-соли-кабиса",
        "text": "Ҳисоби соли кабиса",
        "level": 1
      },
      {
        "id": "5-табдили-рақамҳо-ба-калимаҳо",
        "text": "5. Табдили рақамҳо ба калимаҳо",
        "level": 2
      },
      {
        "id": "натиҷа-سه-میلیون-و-پانصد-هزار",
        "text": "Натиҷа: 'سه میلیون و پانصد هزار'",
        "level": 1
      }
    ],
    "filePath": "/app/applet/repo_data/docs/tg/quickstart.md",
    "counterparts": {
      "fa": "quickstart",
      "en": "quickstart",
      "prs-af": "quickstart"
    },
    "counterpartSlug": "quickstart"
  },
  {
    "id": "tg-troubleshooting",
    "slug": "troubleshooting",
    "lang": "tg",
    "category": "getting-started",
    "title": "Бартараф кардани хатогиҳо ва мушкилоти умумӣ",
    "summary": "Роҳнамои кӯтоҳ барои ҳалли хатогиҳои маъмул ҳангоми истифодаи ParsiKit.",
    "content": "# Бартараф кардани хатогиҳо ва мушкилоти умумӣ\n\nРоҳнамои кӯтоҳ барои ҳалли хатогиҳои маъмул ҳангоми истифодаи ParsiKit.\n\n---\n\n## 1. Хатогии `InvalidNationalCodeError`\n\nИн хато ҳангоми нодуруст будани чексами рақами миллӣ рух медиҳад:\n\n- Рақами воридшуда бояд дақиқан 10 рақам бошад.\n- Рақамҳо набояд 10 рақами якхела (масалан `1111111111`) бошанд.\n- Аз блоки `try ... except` истифода баред:\n\n```python\nfrom parsikit.exceptions import InvalidNationalCodeError\nfrom parsikit.models import NationalCode\n\ntry:\n    code = NationalCode(\"1234567890\")\nexcept InvalidNationalCodeError as e:\n    print(f\"Хатои санҷиш: {e}\")\n```\n\n---\n\n## 2. Хатогии `InvalidCardNumberError`\n\nИн хато ҳангоми номутобиқатии рақами корти 16-рақама бо алгоритми Лун (Luhn) сар мезанад.\n",
    "headings": [
      {
        "id": "бартараф-кардани-хатогиҳо-ва-мушкилоти-умумӣ",
        "text": "Бартараф кардани хатогиҳо ва мушкилоти умумӣ",
        "level": 1
      },
      {
        "id": "1-хатогии-invalidnationalcodeerror",
        "text": "1. Хатогии `InvalidNationalCodeError`",
        "level": 2
      },
      {
        "id": "2-хатогии-invalidcardnumbererror",
        "text": "2. Хатогии `InvalidCardNumberError`",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/tg/troubleshooting.md",
    "counterparts": {
      "fa": "troubleshooting",
      "en": "troubleshooting",
      "prs-af": "troubleshooting"
    },
    "counterpartSlug": "troubleshooting"
  },
  {
    "id": "tg-tutorials-datetime",
    "slug": "tutorials/datetime",
    "lang": "tg",
    "category": "tutorials",
    "title": "Омӯзиши тақвими нуҷумии ҳиҷрии шамсӣ",
    "summary": "Тарзи табдили таърих ва муҳосибаи соли кабиса бо ParsiKit.",
    "content": "# Омӯзиши тақвими нуҷумии ҳиҷрии шамсӣ\n\nТарзи табдили таърих ва муҳосибаи соли кабиса бо ParsiKit.\n\n---\n\n## 1. Табдили таърихи мелодӣ ба ҳиҷрии шамсӣ\n\n```python\nimport parsikit\n\njy, jm, jd = parsikit.gregorian_to_jalali(2026, 10, 21)\nprint(f\"Сана: {jy}/{jm:02d}/{jd:02d}\")\n# Натиҷа: 1405/07/29\n```\n\n---\n\n## 2. Ҳисоби соли кабиса\n\n```python\nimport parsikit\n\nprint(\"1403 кабиса аст?\", parsikit.is_jalali_leap(1403))  # True\nprint(\"1404 кабиса аст?\", parsikit.is_jalali_leap(1404))  # False\n```\n",
    "headings": [
      {
        "id": "омӯзиши-тақвими-нуҷумии-ҳиҷрии-шамсӣ",
        "text": "Омӯзиши тақвими нуҷумии ҳиҷрии шамсӣ",
        "level": 1
      },
      {
        "id": "1-табдили-таърихи-мелодӣ-ба-ҳиҷрии-шамсӣ",
        "text": "1. Табдили таърихи мелодӣ ба ҳиҷрии шамсӣ",
        "level": 2
      },
      {
        "id": "натиҷа-1405-07-29",
        "text": "Натиҷа: 1405/07/29",
        "level": 1
      },
      {
        "id": "2-ҳисоби-соли-кабиса",
        "text": "2. Ҳисоби соли кабиса",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/tg/tutorials/datetime.md",
    "counterparts": {
      "fa": "tutorials/datetime",
      "en": "tutorials/datetime",
      "prs-af": "tutorials/datetime"
    },
    "counterpartSlug": "tutorials/datetime"
  },
  {
    "id": "tg-tutorials-numbers_and_currency",
    "slug": "tutorials/numbers_and_currency",
    "lang": "tg",
    "category": "tutorials",
    "title": "Омӯзиши табдили ададҳо ба калимаҳо",
    "summary": "Табдили рақамҳо ба калимаҳои хоно ва муҳосибаи воҳидҳои пулӣ.",
    "content": "# Омӯзиши табдили ададҳо ба калимаҳо\n\nТабдили рақамҳо ба калимаҳои хоно ва муҳосибаи воҳидҳои пулӣ.\n\n---\n\n## 1. Ададҳо ба калимаҳо\n\n```python\nimport parsikit\n\nwords = parsikit.number_to_persian_words(12450000)\nprint(words)\n# Натиҷа: 'دوازده میلیون و چهارصد و پنجاه هزار'\n```\n\n---\n\n## 2. Тартибдиҳии пулӣ\n\n```python\nimport parsikit\n\nformatted = parsikit.format_currency(3500000, unit=\"сомонӣ\")\nprint(formatted)\n```\n",
    "headings": [
      {
        "id": "омӯзиши-табдили-ададҳо-ба-калимаҳо",
        "text": "Омӯзиши табдили ададҳо ба калимаҳо",
        "level": 1
      },
      {
        "id": "1-ададҳо-ба-калимаҳо",
        "text": "1. Ададҳо ба калимаҳо",
        "level": 2
      },
      {
        "id": "натиҷа-دوازده-میلیون-و-چهارصد-و-پنجاه-هزار",
        "text": "Натиҷа: 'دوازده میلیون و چهارصد و پنجاه هزار'",
        "level": 1
      },
      {
        "id": "2-тартибдиҳии-пулӣ",
        "text": "2. Тартибдиҳии пулӣ",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/tg/tutorials/numbers_and_currency.md",
    "counterparts": {
      "fa": "tutorials/numbers_and_currency",
      "en": "tutorials/numbers_and_currency",
      "prs-af": "tutorials/numbers_and_currency"
    },
    "counterpartSlug": "tutorials/numbers_and_currency"
  },
  {
    "id": "tg-tutorials-text_processing",
    "slug": "tutorials/text_processing",
    "lang": "tg",
    "category": "tutorials",
    "title": "Омӯзиши поксозии матн ва нимафосилаҳо",
    "summary": "Роҳнамои амалии стандартисозии матнҳо бо ParsiKit.",
    "content": "# Омӯзиши поксозии матн ва нимафосилаҳо\n\nРоҳнамои амалии стандартисозии матнҳо бо ParsiKit.\n\n---\n\n## 1. Ислоҳи ҳарфҳо\n\n```python\nimport parsikit\n\ndirty = \"اين يك متن аст\"\nclean = parsikit.standardize_persian(dirty)\nprint(clean)\n# Натиҷа: 'این یک متن است'\n```\n\n---\n\n## 2. Ислоҳи нимафосилаҳо\n\n```python\nimport parsikit\n\ntext = \"کتاب ها را می خوانم\"\ncorrected = parsikit.clean_text(text)\nprint(corrected)\n# Натиҷа: 'کتاب‌ها را می‌خوانم'\n```\n",
    "headings": [
      {
        "id": "омӯзиши-поксозии-матн-ва-нимафосилаҳо",
        "text": "Омӯзиши поксозии матн ва нимафосилаҳо",
        "level": 1
      },
      {
        "id": "1-ислоҳи-ҳарфҳо",
        "text": "1. Ислоҳи ҳарфҳо",
        "level": 2
      },
      {
        "id": "натиҷа-این-یک-متن-است",
        "text": "Натиҷа: 'این یک متن است'",
        "level": 1
      },
      {
        "id": "2-ислоҳи-нимафосилаҳо",
        "text": "2. Ислоҳи нимафосилаҳо",
        "level": 2
      },
      {
        "id": "натиҷа-کتاب-ها-را-می-خوانم",
        "text": "Натиҷа: 'کتاب‌ها را می‌خوانم'",
        "level": 1
      }
    ],
    "filePath": "/app/applet/repo_data/docs/tg/tutorials/text_processing.md",
    "counterparts": {
      "fa": "tutorials/text_processing",
      "en": "tutorials/text_processing",
      "prs-af": "tutorials/text_processing"
    },
    "counterpartSlug": "tutorials/text_processing"
  },
  {
    "id": "tg-tutorials-validation",
    "slug": "tutorials/validation",
    "lang": "tg",
    "category": "tutorials",
    "title": "Омӯзиши санҷиши эътибори рақамҳо ва кортҳо",
    "summary": "Тарзи санҷиши рақамҳои миллӣ ва кортҳои бонкӣ.",
    "content": "# Омӯзиши санҷиши эътибори рақамҳо ва кортҳо\n\nТарзи санҷиши рақамҳои миллӣ ва кортҳои бонкӣ.\n\n---\n\n## 1. Санҷиш бо алгоритми Модуло 11\n\n```python\nimport parsikit\n\nvalid = parsikit.is_valid_national_code(\"0010123458\")\nprint(f\"Вазъияти эътибор: {valid}\")\n```\n\n---\n\n## 2. Санҷиши корти бонкӣ бо Лун\n\n```python\nimport parsikit\n\ncard = \"6037991122334455\"\nif parsikit.is_valid_card_number(card):\n    bank = parsikit.detect_bank_from_card(card)\n    masked = parsikit.mask_card(card)\n    print(f\"Бонк: {bank} | Корти амн: {masked}\")\n```\n",
    "headings": [
      {
        "id": "омӯзиши-санҷиши-эътибори-рақамҳо-ва-кортҳо",
        "text": "Омӯзиши санҷиши эътибори рақамҳо ва кортҳо",
        "level": 1
      },
      {
        "id": "1-санҷиш-бо-алгоритми-модуло-11",
        "text": "1. Санҷиш бо алгоритми Модуло 11",
        "level": 2
      },
      {
        "id": "2-санҷиши-корти-бонкӣ-бо-лун",
        "text": "2. Санҷиши корти бонкӣ бо Лун",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/tg/tutorials/validation.md",
    "counterparts": {
      "fa": "tutorials/validation",
      "en": "tutorials/validation",
      "prs-af": "tutorials/validation"
    },
    "counterpartSlug": "tutorials/validation"
  },
  {
    "id": "en-development-architecture",
    "slug": "development/architecture",
    "lang": "en",
    "category": "development",
    "title": "ParsiKit Architecture & Technical Design",
    "summary": "Project Owner: Ali Kamrani (MRThugh)",
    "content": "# ParsiKit Architecture & Technical Design\n\n**Project Owner:** Ali Kamrani (MRThugh)  \n**Version:** 3.3.1  \n**Target Platform:** Pure Python >= 3.10  \n\n---\n\n## 1. Architectural Philosophy\n\nParsiKit is built as a **zero-dependency, lightweight, high-performance infrastructure library** for Persian language computing and Iranian domestic data structures.\n\nCore architectural principles:\n1. **Zero External Runtime Dependencies:** Standard Python library only (`re`, `datetime`, `math`, `typing`, `logging`, `string`, `ipaddress`). Optional integrations (GUI widgets, Pydantic) use duck-typing and dynamic inspection.\n2. **Layered Separation of Concerns:** Pure transformation algorithms live in functional modules (`text`, `number`, `datetime`, `validators`), while rich object-oriented wrappers live in `models`.\n3. **Thread-Safe In-Memory Caching:** Computationally intensive astronomical date calculations and written number generation are cached using thread-safe LRU primitives (`parsikit.cache`).\n4. **Defensive Validation & Safe Masking:** Differentiate strictly between checksum/syntax validation and authoritative identity verification.\n\n---\n\n## 2. Package Layering\n\n```text\n┌────────────────────────────────────────────────────────┐\n│             Developer Tools & UI Helpers               │\n│         (parsikit.dev, parsikit.gui, parsikit.config)  │\n├────────────────────────────────────────────────────────┤\n│             Object-Oriented Domain Models              │\n│                  (parsikit.models)                     │\n├────────────────────────────────────────────────────────┤\n│           Domain Algorithms & Formatters               │\n│ (parsikit.text, parsikit.validators, parsikit.currency │\n│          parsikit.datetime, parsikit.reshaper)         │\n├────────────────────────────────────────────────────────┤\n│               Low-Level Infrastructure                 │\n│         (parsikit.cache, parsikit.exceptions)          │\n└────────────────────────────────────────────────────────┘\n```\n\n### Module Responsibilities\n\n| Module | Primary Responsibility |\n|---|---|\n| `parsikit.text` | Text normalization, Arabic-to-Persian character mapping, typography, ZWNJ fixing, sensitive data masking, Pinglish slugification. |\n| `parsikit.number` | Digit script translation (Latin <-> Persian <-> Arabic) and written number words up to 999 septillion. |\n| `parsikit.currency` | Rial/Toman conversions, currency formatting, VAT calculations, and loan installment amortization. |\n| `parsikit.datetime` | Gregorian <-> Jalali astronomical conversions, leap year calculations, relative time humanization. |\n| `parsikit.validators` | Checksum verification for National Codes, Card Numbers (Luhn), Sheba (IBAN Modulo-97), Plates, Postal Codes, and Bills. |\n| `parsikit.models` | OOP wrappers (`PersianText`, `NationalCode`, `MobileNumber`, `BankCard`, `Sheba`, `VehiclePlate`, `FixedLine`) with duck-typing. |\n| `parsikit.reshaper` | Unicode presentation forms shaper and BiDi text reversal for graphics engines without RTL support. |\n| `parsikit.gui` | Widget event binder for real-time input formatting in Tkinter and PyQt/PySide. |\n| `parsikit.dev` | Development tools: `inspect_text`, `debug_text`, `persian_repr`, `pformat`, `persian_fstring`, `validate_batch`. |\n| `parsikit.cache` | Thread-safe in-memory LRU cache decorator. |\n| `parsikit.config` | Global configuration options (`default_tax_rate`, `default_currency`, `enable_cache`). |\n| `parsikit.exceptions` | Hierarchy of domain exceptions inheriting from `ValidationError` and `ParsiKitError`. |\n\n---\n\n## 3. Backward Compatibility Contract\n\n- **Public Exports:** All symbols exported in `parsikit/__init__.__all__` are guaranteed stable across patch releases.\n- **Duck-Typing:** Domain models inherit from `StringLikeMixin` and behave seamlessly as Python strings in equality, length, slicing, and dictionary keys.\n- **Pydantic Compatibility:** Models include `PydanticValidationMixin` to enable automatic coercion in Pydantic schemas without hard dependencies.\n",
    "headings": [
      {
        "id": "parsikit-architecture-technical-design",
        "text": "ParsiKit Architecture & Technical Design",
        "level": 1
      },
      {
        "id": "1-architectural-philosophy",
        "text": "1. Architectural Philosophy",
        "level": 2
      },
      {
        "id": "2-package-layering",
        "text": "2. Package Layering",
        "level": 2
      },
      {
        "id": "module-responsibilities",
        "text": "Module Responsibilities",
        "level": 3
      },
      {
        "id": "3-backward-compatibility-contract",
        "text": "3. Backward Compatibility Contract",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/development/architecture.md",
    "counterparts": {}
  },
  {
    "id": "en-development-audit-3.3.1",
    "slug": "development/audit-3.3.1",
    "lang": "en",
    "category": "development",
    "title": "ParsiKit v3.3.1 — Phase Zero Baseline Audit Report",
    "summary": "Author & Project Owner: Ali Kamrani (MRThugh)",
    "content": "# ParsiKit v3.3.1 — Phase Zero Baseline Audit Report\n\n**Author & Project Owner:** Ali Kamrani (MRThugh)  \n**Auditor:** ParsiKit QA & Release Engineering Team  \n**Audit Date:** 2026-10-10  \n**Environment:** Linux (x86_64), Python 3.10.12 (GCC 11.4.0)  \n**Target Release:** v3.3.1 (Patch Release from v3.3.0)\n\n---\n\n## 1. Executive Summary\n\nThis audit report documents the baseline state of the **ParsiKit** repository immediately following import.\nParsiKit is a pure Python library providing Persian data infrastructure: text standardization, typography, national validation algorithms (National Code, Mobile, Sheba, Bank Card, License Plates, Postal Codes, Bills), Jalali astronomical date utilities, currency calculations, rich domain models, and developer tools.\n\nDuring the Phase Zero baseline inspection, several critical findings were discovered:\n1. **Import Failure on Supported Python Versions (Python 3.10 / 3.11):**\n   `pyproject.toml` and `setup.py` both claim `requires-python = \">=3.10\"`. However, importing `parsikit` on Python 3.10 failed with a fatal `SyntaxError` in `parsikit/dev.py` line 366 due to backslash usage inside an f-string expression (PEP 701, only supported in Python >=3.12).\n2. **Initial Test Suite Failures (7 Failures, 2 Errors):**\n   Once the syntax error was addressed, executing the existing test suite (`test.py`) revealed 9 test issues:\n   - **National code checksum mismatch in test fixture:** Test used `0010123451` as a sample valid code, but mathematically its modulo-11 check digit is `8` (`0010123458`). This caused 2 errors (`test_national_code_model`, `test_string_like_behavior_and_duck_typing`) and 1 failure (`test_validate_batch`).\n   - **Visual alignment and zero-width non-joiner (ZWNJ):** Test input `\"کتاب‌‌ها\"` contained accidental duplicate ZWNJs (`\\u200C\\u200C`), causing visual length calculation discrepancies in `pformat`.\n   - **Thousand grouping separator with Persian digits:** `PersianFormatter` formatted thousand-separated numbers with ASCII commas (e.g. `۱۵,۰۰۰`) instead of standard Persian commas (`۱۵،۰۰۰`), failing `test_persian_fstring_capturing`.\n   - **Pinglish dictionary omission:** The word `\"نسخه\"` (\"neskheh\") was missing from `_COMMON_WORDS_PINGLISH`, causing fallback to character-by-character transliteration `nskhh` and failing `test_slugify`.\n   - **Relative time formatting numerals:** `humanize_relative_time` used ASCII numerals in several branches (e.g. `5 دقیقه پیش`) rather than Persian numerals (`۵ دقیقه پیش`), failing `test_humanize_relative_time`.\n   - **Email masking discrepancy:** `mask_email(\"kamrani.exe@gmail.com\")` produced 8 asterisks (`ka********e@gmail.com`) due to 1-to-1 character masking of the 8 middle characters (`mrani.ex`), while the test expected 6 asterisks (`ka******e@gmail.com`) due to an eyeballed fixture count.\n   - **Numeral detection in text inspection:** `test_inspect_text` asserted `has_english_digits` on `\"ي كافيه ك کتاب ها ميباشد ۱۲۳\"`, which contained Persian numerals (`۱۲۳`) rather than English numerals (`123`).\n3. **Subtle Algorithmic and Structural Defects Found:**\n   - **Jalali Leap Year Calculation Off-by-One:** `is_jalali_leap()` returned `False` for real astronomical leap years (e.g. 1399, 1403) and `True` for non-leap years (1400, 1404), while `jalali_to_gregorian` handled leap days correctly.\n   - **Postal Code Formatting Copy-Paste Bug:** `format_postal_code` formatted 10-digit postal codes as `XXX-XXXXXX-X` (the 3-6-1 national code layout) rather than `XXXXX-XXXXX` (5-5 layout) as described in its docstring and Iranian postal specifications.\n4. **Packaging and Build Environment:**\n   No build/packaging tools were pre-installed in the bare Python environment.\n\n---\n\n## 2. Environment and Baseline Test Run\n\n### Command\n```bash\npython3 test.py\n```\n\n### Initial Run Output (Prior to Fixes)\n```text\nTraceback (most recent call last):\n  File \"/app/applet/test.py\", line 8, in <module>\n    import parsikit\n  File \"/app/applet/parsikit/__init__.py\", line 47, in <module>\n    from .dev import (\n  File \"/app/applet/parsikit/dev.py\", line 366\n    print(f\"  Raw Text: {colored(f'\\\"{text}\\\"', COLOR_GREEN)}\")\n                                                              ^\nSyntaxError: f-string expression part cannot include a backslash\n```\n\n### Secondary Run Output (After dev.py syntax fix, running original test.py)\n```text\nRan 23 tests in 0.019s\nFAILED (failures=7, errors=2)\nPassed: 14 / 23\n```\n\nDetailed failure breakdown:\n| Test Name | Status | Root Cause |\n|---|---|---|\n| `test_string_like_behavior_and_duck_typing` | ERROR | Fixture `0010123451` has invalid check digit (expected `8`) |\n| `test_national_code_model` | ERROR | Same invalid fixture `0010123451` |\n| `test_validate_batch` | FAIL | Batch expects 2 valid codes, but fixture `0010123451` failed validation |\n| `test_inspect_text` | FAIL | Text had Persian digits `۱۲۳`, test asserted `has_english_digits` |\n| `test_mask_utilities` | FAIL | `mask_email` 8 masked chars vs test expecting 6 stars |\n| `test_persian_fstring_capturing` | FAIL | ASCII comma `,` instead of Persian comma `،` in `:,fa` spec |\n| `test_pformat_and_persian_aware_alignment` | FAIL | Accidental double ZWNJ `\\u200C\\u200C` in `\"کتاب‌‌ها\"` |\n| `test_slugify` | FAIL | `\"نسخه\"` missing in Pinglish dictionary, producing `nskhh` |\n| `test_humanize_relative_time` | FAIL | Format string used raw int instead of `english_to_persian` |\n\n---\n\n## 3. Inventory of Public Modules and APIs\n\nThe public API is exposed from `parsikit/__init__.py` and defined in 11 core modules:\n\n### 1. Configuration & Exceptions\n- `parsikit.config`: `ParsiKitConfig` instance managing `default_tax_rate`, `default_currency`, `enable_cache`.\n- `parsikit.exceptions`: `ParsiKitError`, `ValidationError`, `InvalidNationalCodeError`, `InvalidMobileError`, `InvalidCardNumberError`, `InvalidShebaError`, `InvalidPostalCodeError`, `InvalidPlateError`, `InvalidBillError`.\n\n### 2. Domain Models (`parsikit.models`)\n- `PersianText`: Rich text model supporting standardization, diacritic stripping, keyboard layout correction, entity extraction, and word-to-number parsing.\n- `NationalCode`: Value object with loose/strict validation, formatting (`XXX-XXXXXX-X`), and location detection.\n- `MobileNumber`: Iranian mobile representation with national (`09...`) and international (`+989...`) formatting and operator detection.\n- `FixedLine`: Fixed landline telephone model with province and area code detection.\n- `BankCard`: 16-digit debit/credit card model with Luhn check, bank identification, and chunk formatting.\n- `Sheba`: IBAN representation with check digit validation, bank identification, and clean account extraction.\n- `VehiclePlate`: Iranian vehicle plate model with category and province parsing.\n\n### 3. Text Processing (`parsikit.text`)\n- `standardize_persian(text, *, strip_diacritics_opt=False)`: Standardizes Arabic characters (ي/ك/ة), ZWNJ prefixes/suffixes, and redundant whitespace.\n- `strip_diacritics(text)`: Removes Arabic/Persian diacritics.\n- `is_persian(text)`: Checks if string contains Persian/Arabic characters.\n- `correct_keyboard_layout(text)`: Converts mistyped English layout text to Persian.\n- `persian_sort_key(s)`: Alphabetical sorting key matching Persian collation.\n- `persian_sorted(iterable, *, reverse=False)`: Persian alphabetical sort.\n- `beautify_persian_spacing(text)`: Punctuation spacing and parenthesis balancing.\n- `extract_mobiles(text)`: Regex extraction and validation of mobile numbers.\n- `extract_national_codes(text)`: Regex extraction and checksum validation of national codes.\n- `words_to_number(text)`: Parses written Persian words (e.g. \"سی و دو هزار\") into integers.\n- `slugify(text, separator=\"-\")`: Generates SEO-friendly Finglish URL slugs.\n- `clean_text(text)`: Comprehensive text cleaner.\n- `normalize_whitespace(text, keep_paragraphs=True)`: Standardizes spacing and newlines.\n- `convert_numbers(text, to=\"persian\")`: Bidirectional digit script translation.\n- `mask_mobile(phone, mask_char=\"*\")`: Masks mobile numbers (`0912***6789`).\n- `mask_card(card, mask_char=\"*\")`: Masks card numbers (`6037-99**-****-4455`).\n- `mask_national_code(code, mask_char=\"*\")`: Masks national codes (`773-****45-2`).\n- `mask_email(email, mask_char=\"*\")`: Masks email usernames.\n\n### 4. Numbers & Currency (`parsikit.number`, `parsikit.currency`)\n- `english_to_persian(text)`, `persian_to_english(text)`: Digit translation tables.\n- `number_to_words(number)`: Converts integers up to 999 septillion into written Persian words.\n- `format_currency(amount, currency=None, *, persian_digits=False)`: Formats amounts with labels (تومان / ریال).\n- `rial_to_toman(amount)`, `toman_to_rial(amount)`: Rial <-> Toman conversion.\n- `format_currency_to_words(amount, currency=None)`: Written Persian currency strings.\n- `add_tax_and_toll(amount, tax_rate=None)`: VAT calculation.\n- `calculate_installments(principal, annual_interest_rate, months)`: Monthly loan amortization.\n\n### 5. Validation & Parsing (`parsikit.validators`)\n- `is_valid_national_code`, `format_national_code`, `detect_national_code_location`\n- `is_valid_mobile`, `normalize_mobile`, `detect_mobile_operator`\n- `is_valid_landline`, `normalize_landline`, `detect_landline_province`\n- `is_valid_card_number`, `format_card_number`, `detect_bank_from_card`\n- `is_valid_sheba`, `format_sheba`, `detect_bank_from_sheba`, `extract_account_number_from_sheba`\n- `is_valid_corporate_id`: 11-digit legal entity validation.\n- `is_valid_postal_code`, `format_postal_code`\n- `is_valid_bill_and_payment`, `extract_bill_details`\n- `is_valid_plate`, `parse_plate`, `format_plate`\n- `detect(text)`: Auto-detection of data type.\n\n### 6. Datetime (`parsikit.datetime`)\n- `gregorian_to_jalali(gy, gm, gd)`: Gregorian to Jalali astronomical date conversion.\n- `jalali_to_gregorian(jy, jm, jd)`: Jalali to Gregorian date conversion.\n- `format_jalali(jy, jm, jd, pattern=\"YYYY/MM/DD\")`: Jalali string formatting.\n- `get_jalali_month_name(month)`: Persian month name.\n- `is_jalali_leap(jy)`: Jalali leap year check.\n- `humanize_relative_time(dt_or_seconds, reference=None)`: Friendly relative time in Persian.\n\n### 7. Reshaping & GUI (`parsikit.reshaper`, `parsikit.gui`)\n- `reshape_for_graphics(text, reverse=True)`: Persian letter shaping & BiDi reversal for graphics engines.\n- `reshape_paragraph_for_graphics(text, max_chars_per_line, reverse=True)`: Multi-line wrapped shaping.\n- `bind_persian_input(widget, input_type=\"text\")`: Live typing assistant for Tkinter/CustomTkinter/Qt.\n\n### 8. Developer Tools (`parsikit.dev`)\n- `inspect_text(text)`: Structural layout and typography diagnostics.\n- `debug_text(text)`: Colored terminal diagnostics report.\n- `validate_batch(items, model_class, silent=False)`: Batch evaluation of domain models.\n- `persian_repr(obj)`: Unicode-preserving string representation.\n- `setup_logging(level=\"INFO\")`: Configures Persian-friendly stream logger.\n- `pformat(template, *args, **kwargs)`: Visual alignment and `:fa`/`:p` format specifier.\n- `persian_fstring(template, **kwargs)`: Context-capturing Persian f-string.\n\n---\n\n## 4. Remediation Plan for v3.3.1\n\n1. **Bug Fixes:**\n   - Fix f-string syntax in `parsikit/dev.py` for Python 3.10 and 3.11 compatibility.\n   - Fix `is_jalali_leap` calculation to match the astronomical calendar and `jalali_to_gregorian`.\n   - Fix `format_postal_code` in `parsikit/validators.py` to format as `XXXXX-XXXXX`.\n   - Fix `PersianFormatter` in `parsikit/dev.py` to convert `,` to Persian comma `،` when formatting with `fa`/`p`.\n   - Add `\"نسخه\": \"neskheh\"` to `_COMMON_WORDS_PINGLISH` in `parsikit/text.py`.\n   - Convert numeric values in `humanize_relative_time` in `parsikit/datetime.py` to Persian numerals.\n   - Clarify `mask_email` docstring and test expectation (1-to-1 character masking).\n   - Add `has_persian_digits` detection to `inspect_text`.\n2. **Security Hardening:**\n   - Add `.masked` property to `BankCard`, `MobileNumber`, and `NationalCode` models.\n   - Mask sensitive values in `InvalidCardNumberError` and `InvalidNationalCodeError` exception messages.\n   - Ensure safe fallbacks for short inputs in all masking utilities.\n3. **Test Reorganization:**\n   - Establish `tests/unit/`, `tests/integration/`, `tests/regression/`, `tests/security/`, and `tests/fixtures/`.\n   - Add regression tests for all fixed bugs.\n   - Provide shared synthetic fixtures (no real PII or bank cards).\n4. **Documentation:**\n   - Write comprehensive Persian and English documentation covering every public API.\n   - Provide runnable examples.\n5. **Packaging:**\n   - Ensure version consistency across `__init__.py`, `pyproject.toml`, and `setup.py`.\n",
    "headings": [
      {
        "id": "parsikit-v3-3-1-phase-zero-baseline-audit-report",
        "text": "ParsiKit v3.3.1 — Phase Zero Baseline Audit Report",
        "level": 1
      },
      {
        "id": "1-executive-summary",
        "text": "1. Executive Summary",
        "level": 2
      },
      {
        "id": "2-environment-and-baseline-test-run",
        "text": "2. Environment and Baseline Test Run",
        "level": 2
      },
      {
        "id": "command",
        "text": "Command",
        "level": 3
      },
      {
        "id": "initial-run-output-prior-to-fixes",
        "text": "Initial Run Output (Prior to Fixes)",
        "level": 3
      },
      {
        "id": "secondary-run-output-after-dev-py-syntax-fix-running-original-test-py",
        "text": "Secondary Run Output (After dev.py syntax fix, running original test.py)",
        "level": 3
      },
      {
        "id": "3-inventory-of-public-modules-and-apis",
        "text": "3. Inventory of Public Modules and APIs",
        "level": 2
      },
      {
        "id": "1-configuration-exceptions",
        "text": "1. Configuration & Exceptions",
        "level": 3
      },
      {
        "id": "2-domain-models-parsikit-models",
        "text": "2. Domain Models (`parsikit.models`)",
        "level": 3
      },
      {
        "id": "3-text-processing-parsikit-text",
        "text": "3. Text Processing (`parsikit.text`)",
        "level": 3
      },
      {
        "id": "4-numbers-currency-parsikit-number-parsikit-currency",
        "text": "4. Numbers & Currency (`parsikit.number`, `parsikit.currency`)",
        "level": 3
      },
      {
        "id": "5-validation-parsing-parsikit-validators",
        "text": "5. Validation & Parsing (`parsikit.validators`)",
        "level": 3
      },
      {
        "id": "6-datetime-parsikit-datetime",
        "text": "6. Datetime (`parsikit.datetime`)",
        "level": 3
      },
      {
        "id": "7-reshaping-gui-parsikit-reshaper-parsikit-gui",
        "text": "7. Reshaping & GUI (`parsikit.reshaper`, `parsikit.gui`)",
        "level": 3
      },
      {
        "id": "8-developer-tools-parsikit-dev",
        "text": "8. Developer Tools (`parsikit.dev`)",
        "level": 3
      },
      {
        "id": "4-remediation-plan-for-v3-3-1",
        "text": "4. Remediation Plan for v3.3.1",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/development/audit-3.3.1.md",
    "counterparts": {}
  },
  {
    "id": "en-development-contributing",
    "slug": "development/contributing",
    "lang": "en",
    "category": "development",
    "title": "Contributing to ParsiKit",
    "summary": "Project Owner: Ali Kamrani (MRThugh)",
    "content": "# Contributing to ParsiKit\n\n**Project Owner:** Ali Kamrani (MRThugh)  \n**License:** MIT License  \n\nWe welcome contributions from developers interested in improving Persian computational linguistics, typography, and data infrastructure in Python!\n\n---\n\n## 1. Development Principles\n\n1. **Zero Runtime Dependencies:** ParsiKit must always remain pure Python without mandatory external runtime dependencies.\n2. **Conservative & Evidence-Driven:** Every bug fix must include a reproducing regression test.\n3. **Persian Typography Excellence:** Respect standard zero-width non-joiners (نیم‌فاصله), standard Persian characters (ی instead of ي, ک instead of ك), and correct numeral handling.\n4. **Security & Privacy:** Never commit real national codes, phone numbers, credentials, or bank card numbers. Use fictitious fixtures only.\n\n---\n\n## 2. Setting Up Local Environment\n\nClone the repository and install development dependencies in editable mode:\n\n```bash\ngit clone https://github.com/MRThugh/ParsiKit.git\ncd ParsiKit\npython3 -m venv .venv\nsource .venv/bin/activate\npip install -e .\n```\n\n---\n\n## 3. Running the Test Suite\n\nRun the full automated test suite:\n\n```bash\npython3 -m unittest discover -s tests -v\n```\n\nOr run the root test suite:\n\n```bash\npython3 test.py\n```\n\n---\n\n## 4. Submitting a Pull Request\n\n1. Create a feature branch: `git checkout -b fix/your-bug-fix`\n2. Write unit and regression tests in `tests/`.\n3. Verify that all existing and new tests pass: `python3 -m unittest discover -s tests`.\n4. Update documentation in both `docs/fa/` and `docs/en/` if public behavior is affected.\n5. Record changes in `CHANGELOG.md`.\n6. Submit a clean Pull Request with a clear rationale.\n",
    "headings": [
      {
        "id": "contributing-to-parsikit",
        "text": "Contributing to ParsiKit",
        "level": 1
      },
      {
        "id": "1-development-principles",
        "text": "1. Development Principles",
        "level": 2
      },
      {
        "id": "2-setting-up-local-environment",
        "text": "2. Setting Up Local Environment",
        "level": 2
      },
      {
        "id": "3-running-the-test-suite",
        "text": "3. Running the Test Suite",
        "level": 2
      },
      {
        "id": "4-submitting-a-pull-request",
        "text": "4. Submitting a Pull Request",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/development/contributing.md",
    "counterparts": {}
  },
  {
    "id": "en-development-final-release-audit-3.3.1",
    "slug": "development/final-release-audit-3.3.1",
    "lang": "en",
    "category": "development",
    "title": "ParsiKit v3.3.1 — Final Release Audit, Packaging & Quality Report",
    "summary": "Package Name: parsikit",
    "content": "# ParsiKit v3.3.1 — Final Release Audit, Packaging & Quality Report\n\n**Package Name:** `parsikit`  \n**Target Version:** `3.3.1`  \n**Author & Maintainer:** Ali Kamrani (`MRThugh`)  \n**Audit Date:** 2026-10-10  \n**Environment:** Linux x86_64, Python 3.10.12 & Python 3.11.2, Node.js v22.23.2  \n**Final Verdict:** **APPROVED FOR PRODUCTION RELEASE (RELEASE-READY)**\n\n---\n\n## 1. Executive Summary\n\nThis final release audit documents the stabilization, quality hardening, security review, documentation completion, and packaging verification of **ParsiKit v3.3.1**.\n\nAll planned audit phases have been completed without breaking backwards compatibility or altering the established public API:\n1. **Automated Test Integrity**: 100% of all unit, integration, regression, and security tests pass across both Python 3.10 and Python 3.11.\n2. **Secret Hygiene**: Zero hardcoded credentials or API keys exist in the codebase. Safe template `.env.example` created. Distributable packages strictly exclude local environment files.\n3. **Artifact Hygiene**: All `__pycache__` directories and `.pyc` files have been purged and excluded via `.gitignore` and `MANIFEST.in`. Redundant files (`README-fa.md`, `docs/examples/`) were consolidated into canonical sources.\n4. **Documentation**: All 74 internal Markdown documentation links have been validated (0 broken links). Standalone bilingual API reference pages have been authored for `parsikit.cache` and `parsikit.reshaper`. Stale version references to 3.3.0 have been updated to 3.3.1.\n5. **Distribution Packaging**: Both binary wheel (`.whl`) and source distribution (`.tar.gz`) were built, inspected, and verified. The wheel was installed into a clean, isolated environment and verified to import exclusively from site-packages.\n6. **Executable Examples**: All 4 canonical examples in `examples/` were executed against the isolated installed package with exit code 0.\n\n---\n\n## 2. Test Execution & Verification\n\n### Initial Test Results\n- Discovery in `tests/`: 95 passed, 0 failed, 0 skipped.\n- Legacy regression suite (`test.py`): 23 passed, 0 failed, 0 skipped.\n\n### Final Test Results\n- **Modular Test Suite (`pytest -v tests`)**:\n  - Total tests executed: 95\n  - Passed: 95\n  - Failed: 0\n  - Skipped: 0\n  - Execution time: 0.22s\n- **Legacy Regression Suite (`python3 test.py`)**:\n  - Total tests executed: 23\n  - Passed: 23\n  - Failed: 0\n  - Skipped: 0\n  - Execution time: 0.01s\n- **Combined Test Count**: 118 tests executed with 100% success rate.\n\n### Test Categories Covered\n- `tests/unit/test_text.py`: Standardization, diacritics, ZWNJ, sort keys, slugify, masking, words-to-number.\n- `tests/unit/test_validators.py`: National code, mobile, landline, card Luhn, Sheba, postal code, bills, plates, detector.\n- `tests/unit/test_models.py`: Domain models (`PersianText`, `NationalCode`, `MobileNumber`, `FixedLine`, `BankCard`, `Sheba`, `VehiclePlate`).\n- `tests/unit/test_number.py`: Digit translations, number-to-words for negative, small, and multi-billion values.\n- `tests/unit/test_currency.py`: Rial/Toman conversions, VAT calculations, loan installment amortization.\n- `tests/unit/test_datetime.py`: Gregorian-Jalali conversions, astronomical leap years, month names, relative time.\n- `tests/unit/test_reshaper.py`: Persian cursive letter shaping, Lam-Alef ligatures, BiDi block preservation.\n- `tests/unit/test_cache.py`: `ThreadSafeLRUCache` operations and `@memoize` decorator.\n- `tests/unit/test_dev.py`: `pformat` visual alignment, `inspect_text`, `validate_batch`, `persian_repr`.\n- `tests/unit/test_gui.py`: GUI event bindings and live input formatters.\n- `tests/integration/test_batch_validation.py`: High-volume data validation pipelines.\n- `tests/integration/test_oop_workflow.py`: End-to-end domain model instantiation and serialization.\n- `tests/regression/test_v331_regressions.py`: Protection against all v3.3.1 identified regressions.\n- `tests/security/test_security.py`: PII masking, exception sanitization, and checksum verification bounds.\n\n---\n\n## 3. Secret Hygiene & Security Review\n\n### Audit Findings\n- An automated recursive credential search was performed across all source files, test fixtures, documentation, examples, and configuration.\n- No active API keys, secrets, or credentials were found committed to the source tree.\n- The supplied development archive contained references to local environment variables.\n\n### Remediation Actions Taken\n1. **Repository Containment**:\n   - Created `/.gitignore` explicitly ignoring `.env`, `.env.*`, `*.env`, and `.env.local`.\n   - Created `/MANIFEST.in` explicitly excluding `exclude .env*`.\n   - Verified that neither the binary wheel nor the source distribution includes any `.env` file.\n2. **Safe Placeholder Configuration**:\n   - Authored `/.env.example` containing only generic placeholders:\n     ```env\n     PARSIKIT_ENV=development\n     PARSIKIT_DEFAULT_TAX_RATE=0.10\n     PARSIKIT_DEFAULT_CURRENCY=toman\n     PARSIKIT_ENABLE_CACHE=true\n     GEMINI_API_KEY=your_gemini_api_key_here\n     ```\n3. **Sensitive Data Protection within Library**:\n   - `BankCard`, `MobileNumber`, and `NationalCode` expose a `.masked` property for safe display.\n   - Exception messages in `InvalidCardNumberError` and `InvalidNationalCodeError` sanitize raw inputs to prevent leaking PII into application error logs.\n4. **Maintainer Notice Regarding Credentials**:\n   - *Security advisory for repository owner (Ali Kamrani)*: Any API key or secret that was previously stored in local development archives or past git commits must be revoked or rotated immediately through the service provider's console (e.g., Google AI Studio / Google Cloud Console). Deleting a local file does not invalidate an active key.\n\n---\n\n## 4. Project Structure & Artifact Cleanup\n\n### Consolidated Duplicates\n1. **Persian README**:\n   - `README-fa.md` and `README.fa.md` were compared and confirmed byte-for-byte identical.\n   - `README.fa.md` is the canonical file referenced by `README.md`.\n   - `README-fa.md` was removed to eliminate redundant maintenance overhead.\n2. **Examples Directory**:\n   - `docs/examples/` and `examples/` contained identical scripts with minor relative import differences.\n   - `examples/` was established as the single canonical directory for runnable examples (consistent with CI workflows).\n   - Redundant directory `docs/examples/` was removed.\n3. **Caches and Build Residue**:\n   - Purged all `__pycache__/` directories and `.pyc` bytecode files.\n   - Added ignore rules to prevent future tracking.\n\n---\n\n## 5. Documentation & Link Validation\n\n### Markdown Link Validation\nAn automated script scanned all Markdown files in the repository:\n- **Total internal links checked**: 74\n- **Broken links before remediation**: 3\n  - `docs/README.md` -> `fa/api/overview.md`\n  - `docs/README.md` -> `en/api/overview.md`\n  - `docs/fa/index.md` -> `api/overview.md`\n- **Broken links after remediation**: 0 (100% valid)\n\n### New & Improved API Documentation\n1. **`parsikit.cache`**:\n   - Created `docs/en/api/cache.md` and `docs/fa/api/cache.md`.\n   - Fully documents `ThreadSafeLRUCache`, `@memoize`, thread-safety guarantees, cache invalidation, and integration with `parsikit.config.enable_cache`.\n2. **`parsikit.reshaper`**:\n   - Created `docs/en/api/reshaper.md` and `docs/fa/api/reshaper.md`.\n   - Documents `reshape_for_graphics`, `reshape_paragraph_for_graphics`, Lam-Alef ligatures, diacritics handling, and Bidirectional (BiDi) block preservation for graphic engines.\n3. **API Indexes**:\n   - Updated `docs/en/api/index.md` and `docs/fa/api/index.md` to reference both modules.\n4. **Version Alignment**:\n   - Updated stale references in `test.py`, `README.md`, and `README.fa.md` from `3.3.0` to `3.3.1`.\n\n---\n\n## 6. Distribution Artifacts & Build Verification\n\nThe distribution packages were built using `python3 -m build` (setuptools build backend):\n\n### 1. Binary Wheel (`dist/parsikit-3.3.1-py3-none-any.whl`)\n- **Uncompressed Size:** 154,049 bytes\n- **File Count:** 18 files\n- **Contents Verification (`unzip -l`):**\n  - `parsikit/__init__.py`\n  - `parsikit/cache.py`\n  - `parsikit/config.py`\n  - `parsikit/currency.py`\n  - `parsikit/datetime.py`\n  - `parsikit/dev.py`\n  - `parsikit/exceptions.py`\n  - `parsikit/gui.py`\n  - `parsikit/models.py`\n  - `parsikit/number.py`\n  - `parsikit/reshaper.py`\n  - `parsikit/text.py`\n  - `parsikit/validators.py`\n  - `parsikit-3.3.1.dist-info/licenses/LICENSE`\n  - `parsikit-3.3.1.dist-info/METADATA`\n  - `parsikit-3.3.1.dist-info/WHEEL`\n  - `parsikit-3.3.1.dist-info/top_level.txt`\n  - `parsikit-3.3.1.dist-info/RECORD`\n- **Exclusion Check:** Strictly excludes tests, documentation, examples, environment files, `.pyc`, and dev tooling.\n\n### 2. Source Distribution (`dist/parsikit-3.3.1.tar.gz`)\n- **Compressed Size:** ~60 KB\n- **Contents Verification (`tar -ztvf`):**\n  - Contains only root project metadata (`CHANGELOG.md`, `LICENSE`, `MANIFEST.in`, `README.fa.md`, `README.md`, `pyproject.toml`, `setup.py`) and runtime package `parsikit/`.\n\n### 3. Isolated Wheel Installation & Smoke Testing\n- Installed the wheel into a completely isolated environment (`/tmp/test-parsikit-env`) with `--no-index`.\n- Verified import from outside the repository directory:\n  ```text\n  Imported parsikit from: /tmp/test-parsikit-env/lib/python3.11/site-packages/parsikit/__init__.py\n  Version: 3.3.1\n  Confirmed: Loaded exclusively from isolated site-packages!\n  ```\n- Tested all core modules (text standardization, national code, mobile operator, bank card Luhn check, number to words, Jalali astronomical calendar, font reshaper). All returned accurate outputs.\n\n---\n\n## 7. Example Script Executions\n\nAll scripts in `examples/` were executed against the isolated installed wheel:\n| Script | Description | Result | Exit Code |\n|---|---|---|---|\n| `examples/quickstart_demo.py` | Basic text, validation, currency, and date demonstration | PASS | `0` |\n| `examples/form_validation_demo.py` | User registration pipeline with NationalCode, Mobile, and Card | PASS | `0` |\n| `examples/invoice_currency_demo.py` | Financial invoicing, VAT, and words-to-number transformation | PASS | `0` |\n| `examples/datetime_humanize_demo.py` | Jalali calendar formatting and relative-time humanization | PASS | `0` |\n\n---\n\n## 8. Python Version Compatibility & CI Configuration\n\n### Locally Verified Environments\n- **Python 3.10.12 (GCC 11.4.0)**: 100% of tests passed.\n- **Python 3.11.2**: 100% of tests passed.\n\n### Continuous Integration (`.github/workflows/ci.yml`)\nUpdated GitHub Actions workflow to run across:\n- **Matrix**: Python `3.10`, `3.11`, `3.12`, `3.13`\n- **Pipeline Steps**:\n  1. `actions/checkout@v4` & `actions/setup-python@v5`\n  2. Install build tools, pytest, and package\n  3. Execute legacy regression suite (`python test.py`)\n  4. Execute comprehensive test suite (`pytest -v tests`)\n  5. Execute discovery unit tests (`python -m unittest discover -s tests`)\n  6. Execute runnable examples (`examples/*.py`)\n  7. Build source distribution and wheel (`python -m build`)\n  8. Force reinstall from built wheel and verify package version\n  9. Run automated Markdown link validation\n\n---\n\n## 9. Remaining Risks and Limitations\n\n1. **Python 3.12 and 3.13 Local Testing**: The local testing environment contained Python 3.10.12 and 3.11.2. Python 3.12 and 3.13 will be tested automatically by GitHub Actions CI upon push.\n2. **External Key Rotation**: The maintainer must verify and rotate any third-party credentials that may have been present in pre-import archives or local `.env` files outside this repository.\n\n---\n\n## 10. Release Verdict\n\n**VERDICT: APPROVED FOR PRODUCTION RELEASE (v3.3.1)**\n\nParsiKit v3.3.1 satisfies all release engineering requirements:\n- Clean and consistent versioning across all package metadata files.\n- Zero broken documentation links across both Persian and English docs.\n- 100% pass rate across all 118 automated tests.\n- High-quality, clean distribution wheel and source tarball containing zero unintended artifacts.\n- Safe secret hygiene and verified privacy masking utilities.\n",
    "headings": [
      {
        "id": "parsikit-v3-3-1-final-release-audit-packaging-quality-report",
        "text": "ParsiKit v3.3.1 — Final Release Audit, Packaging & Quality Report",
        "level": 1
      },
      {
        "id": "1-executive-summary",
        "text": "1. Executive Summary",
        "level": 2
      },
      {
        "id": "2-test-execution-verification",
        "text": "2. Test Execution & Verification",
        "level": 2
      },
      {
        "id": "initial-test-results",
        "text": "Initial Test Results",
        "level": 3
      },
      {
        "id": "final-test-results",
        "text": "Final Test Results",
        "level": 3
      },
      {
        "id": "test-categories-covered",
        "text": "Test Categories Covered",
        "level": 3
      },
      {
        "id": "3-secret-hygiene-security-review",
        "text": "3. Secret Hygiene & Security Review",
        "level": 2
      },
      {
        "id": "audit-findings",
        "text": "Audit Findings",
        "level": 3
      },
      {
        "id": "remediation-actions-taken",
        "text": "Remediation Actions Taken",
        "level": 3
      },
      {
        "id": "4-project-structure-artifact-cleanup",
        "text": "4. Project Structure & Artifact Cleanup",
        "level": 2
      },
      {
        "id": "consolidated-duplicates",
        "text": "Consolidated Duplicates",
        "level": 3
      },
      {
        "id": "5-documentation-link-validation",
        "text": "5. Documentation & Link Validation",
        "level": 2
      },
      {
        "id": "markdown-link-validation",
        "text": "Markdown Link Validation",
        "level": 3
      },
      {
        "id": "new-improved-api-documentation",
        "text": "New & Improved API Documentation",
        "level": 3
      },
      {
        "id": "6-distribution-artifacts-build-verification",
        "text": "6. Distribution Artifacts & Build Verification",
        "level": 2
      },
      {
        "id": "1-binary-wheel-dist-parsikit-3-3-1-py3-none-any-whl",
        "text": "1. Binary Wheel (`dist/parsikit-3.3.1-py3-none-any.whl`)",
        "level": 3
      },
      {
        "id": "2-source-distribution-dist-parsikit-3-3-1-tar-gz",
        "text": "2. Source Distribution (`dist/parsikit-3.3.1.tar.gz`)",
        "level": 3
      },
      {
        "id": "3-isolated-wheel-installation-smoke-testing",
        "text": "3. Isolated Wheel Installation & Smoke Testing",
        "level": 3
      },
      {
        "id": "7-example-script-executions",
        "text": "7. Example Script Executions",
        "level": 2
      },
      {
        "id": "8-python-version-compatibility-ci-configuration",
        "text": "8. Python Version Compatibility & CI Configuration",
        "level": 2
      },
      {
        "id": "locally-verified-environments",
        "text": "Locally Verified Environments",
        "level": 3
      },
      {
        "id": "continuous-integration-github-workflows-ci-yml",
        "text": "Continuous Integration (`.github/workflows/ci.yml`)",
        "level": 3
      },
      {
        "id": "9-remaining-risks-and-limitations",
        "text": "9. Remaining Risks and Limitations",
        "level": 2
      },
      {
        "id": "10-release-verdict",
        "text": "10. Release Verdict",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/development/final-release-audit-3.3.1.md",
    "counterparts": {}
  },
  {
    "id": "en-development-release-process",
    "slug": "development/release-process",
    "lang": "en",
    "category": "development",
    "title": "ParsiKit Release Process",
    "summary": "Author & Maintainer: Ali Kamrani (MRThugh)",
    "content": "# ParsiKit Release Process\n\n**Author & Maintainer:** Ali Kamrani (MRThugh)  \n**Target Version:** 3.3.1  \n\n---\n\n## 1. Release Checklist\n\nBefore tagging or distributing a new patch release:\n\n1. **Verify Baseline Tests:**\n   Run `python3 -m unittest discover -s tests -v` and `python3 test.py`. All tests must pass with 0 failures and 0 errors.\n2. **Version Synchronization:**\n   Ensure the target version (e.g. `3.3.1`) matches across:\n   - `parsikit/__init__.py` (`__version__`)\n   - `pyproject.toml` (`version`)\n   - `setup.py` (`version`)\n   - `CHANGELOG.md`\n3. **Distribution Construction:**\n   Build both source distribution (`sdist`) and binary wheel (`bdist_wheel`):\n   ```bash\n   python3 setup.py sdist bdist_wheel\n   ```\n4. **Inspect Artifact Contents:**\n   Inspect the wheel contents using `unzip -l dist/*.whl` to confirm:\n   - Only `parsikit/` is packaged.\n   - `tests/` and scratch files are strictly excluded.\n   - `LICENSE` and metadata are included.\n5. **Clean Installation Test:**\n   Install the built wheel in a clean virtual environment and verify import:\n   ```bash\n   pip install dist/parsikit-*.whl\n   python3 -c \"import parsikit; print(parsikit.__version__)\"\n   ```\n6. **Documentation Synchronization:**\n   Verify that Persian (`docs/fa/`) and English (`docs/en/`) documentation and examples are synchronized with current behavior.\n7. **Authorization & Publishing:**\n   Never publish or tag without explicit maintainer authorization.\n",
    "headings": [
      {
        "id": "parsikit-release-process",
        "text": "ParsiKit Release Process",
        "level": 1
      },
      {
        "id": "1-release-checklist",
        "text": "1. Release Checklist",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/development/release-process.md",
    "counterparts": {}
  },
  {
    "id": "en-development-testing",
    "slug": "development/testing",
    "lang": "en",
    "category": "development",
    "title": "ParsiKit Testing Guide",
    "summary": "Target Version: 3.3.1",
    "content": "# ParsiKit Testing Guide\n\n**Target Version:** 3.3.1  \n**Test Runner:** `unittest` (Standard Library) / `pytest` Compatible  \n\n---\n\n## 1. Test Suite Architecture\n\nThe test suite is organized into distinct categories under the `tests/` directory:\n\n```text\ntests/\n├── unit/            # Isolated tests for individual functions and classes\n├── integration/     # End-to-end workflows connecting multiple modules\n├── regression/      # Verified tests for previously reported bug fixes\n├── security/        # Privacy, masking, sensitive data, and boundary tests\n├── fixtures/        # Shared synthetic, non-sensitive fixtures\n├── conftest.py      # Shared pytest configuration and state reset\n└── __init__.py\n```\n\n---\n\n## 2. Test Execution Commands\n\n### Run all tests with standard library unittest:\n```bash\npython3 -m unittest discover -s tests -v\n```\n\n### Run specific test suites:\n```bash\npython3 -m unittest discover -s tests/unit -v\npython3 -m unittest discover -s tests/integration -v\npython3 -m unittest discover -s tests/regression -v\npython3 -m unittest discover -s tests/security -v\n```\n\n### Run baseline test entrypoint:\n```bash\npython3 test.py\n```\n\n---\n\n## 3. Test Standards & Guidelines\n\n1. **Deterministic:** Tests must not depend on network access, current system clock (use explicit `reference` arguments in date humanization), or specific OS environments.\n2. **Synthetic Data Only:** Real personal identifiers (کد ملی), bank cards, or phone numbers must NEVER appear in test fixtures or assertions.\n3. **Descriptive Names:** Test methods should clearly describe what property is being evaluated.\n4. **Regression Guarantee:** When fixing a defect, add a corresponding test method in `tests/regression/test_v331_regressions.py`.\n",
    "headings": [
      {
        "id": "parsikit-testing-guide",
        "text": "ParsiKit Testing Guide",
        "level": 1
      },
      {
        "id": "1-test-suite-architecture",
        "text": "1. Test Suite Architecture",
        "level": 2
      },
      {
        "id": "2-test-execution-commands",
        "text": "2. Test Execution Commands",
        "level": 2
      },
      {
        "id": "run-all-tests-with-standard-library-unittest",
        "text": "Run all tests with standard library unittest:",
        "level": 3
      },
      {
        "id": "run-specific-test-suites",
        "text": "Run specific test suites:",
        "level": 3
      },
      {
        "id": "run-baseline-test-entrypoint",
        "text": "Run baseline test entrypoint:",
        "level": 3
      },
      {
        "id": "3-test-standards-guidelines",
        "text": "3. Test Standards & Guidelines",
        "level": 2
      }
    ],
    "filePath": "/app/applet/repo_data/docs/development/testing.md",
    "counterparts": {}
  }
];
