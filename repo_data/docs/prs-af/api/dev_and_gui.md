# مرجع ابزارهای عیب‌یابی و گرافیک (`parsikit.dev`, `parsikit.gui`, `parsikit.reshaper`)

ابزارهای تخصصی برای تشخیص و عیب‌یابی متنی، هم‌ترازی بصری در جدول‌ها، لاگ‌گیری و نمایش معیاری متون زبان دری در رابط‌های گرافیکی (GUI).

---

## ۱. قالب‌بندی بصری هم‌تراز (`pformat` و `persian_fstring`)

کاراکترهای فاقد عرض مانند نیم‌فاصله‌های معیاری (`\u200C`) و حرکات اعراب در محاسبات معمولی پایتون دارای طول کاراکتری هستند، اما در نمایش هیچ فضایی را اشغال نمی‌نمایند. میتودهای معیاری پایتون در قالب‌بندی ستونی جداول خطاناپذیر نبوده و ساختار جدول‌ها را نامنظم می‌سازند.

### `pformat(template: str, *args, **kwargs) -> str`
متن را با در نظر گرفتن عرض واقعی نمایشی (Visual Width) کاراکترها تراز نموده و ستون‌بندی را دقیق می‌سازد. از پسوند `:fa` برای تبدیل هم‌زمان ارقام به ارقام فارسی/دری و درج کامای هزارگان پشتیبانی می‌کند.

```python
from parsikit.dev import pformat

line = pformat("{:15} | {:>10:fa}", "کتاب‌ها", 15000)
print(line)  # 'کتاب‌ها         |     ۱۵،۰۰۰'
```

### `persian_fstring(template: str, **kwargs) -> str`
کارکردی مشابه به `pformat` برای عبارات الگویی با پشتیبانی مستقیم از نام متغیرها در محیط پایتون.

---

## ۲. ابزارهای عیب‌یابی و آزمایش (`parsikit.dev`)

### `inspect_text(text: str) -> dict`
ساختار داخلی متن را کالبدشکافی کرده و تعداد نیم‌فاصله‌ها، وضعیت ارقام، اعراب و حروف عربی را گزارش می‌دهد:

```python
from parsikit.dev import inspect_text

report = inspect_text("نمونه ۱۲۳")
print(report)
# {'length': ..., 'has_arabic_chars': False, 'has_zwnj': False, 'has_persian_digits': True, ...}
```

### `debug_text(text: str) -> None`
گزارش رنگی، دقیق و تحلیلی از مشخصات متن را در ترمینال چاپ می‌نماید.

### `validate_batch(items: list, model_class, silent: bool = False) -> dict`
مجموعه‌ای از داده‌ها را به شکل دسته‌ای بررسی نموده و خلاصه موارد معتبر و نامعتبر را همراه با جزئیات خطا تفکیک می‌نماید.

---

## ۳. بازآرایی گرافیکی و اتصال به رابط کاربر (`parsikit.reshaper`, `parsikit.gui`)

### `reshape_for_graphics(text: str, reverse: bool = True) -> str`
متن دری/فارسی را برای موتورهای رندر گرافیکی فاقد سیستم HarfBuzz (مانند Pygame، Pillow، OpenCV و ReportLab) شکل‌دهی و دوجهته‌سازی می‌کند تا حروف چسبیده و بدون نقص نمایش یابند.

### `reshape_paragraph_for_graphics(text: str, max_chars_per_line: int, reverse: bool = True) -> list[str]`
پاراگراف‌های طویل را بر اساس حداکثر کاراکتر در هر سطر شکسته و هر خط را به شکل متصل و آماده رسم گرافیکی خروجی می‌دهد.

### `bind_persian_input(widget, input_type: str = "text") -> None`
یک ویجت ورودی متنی را در فریم‌ورک‌های Tkinter یا CustomTkinter به میکانیزم هوشمند اصلاح خودکار کلیدواژه‌ها (تبدیل «ي» و «ك» عربی و اصلاح اعداد) مجهز می‌سازد.
