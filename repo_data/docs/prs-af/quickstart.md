# آغاز سریع با پارسی‌کیت (Quickstart)

در این بخش با چند مثال کاربردی و روزمره با قابلیت‌های اساسی پارسی‌کیت آشنا می‌شویم.

---

## ۱. تصفیه متن و معیارسازی حروف و نیم‌فاصله‌ها

یکی از چالش‌های رایج در متون دری، اختلاط حروف عربی («ي» و «ك») و نبود نیم‌فاصله معیاری در کلمات مرکب است:

```python
import parsikit

raw_text = "ي كافيه كتاب ها را جمع آوري كنم"
cleaned = parsikit.standardize_persian(raw_text)

print(cleaned)
# خروجی: 'ی کافیه کتاب‌ها را جمع‌آوری کنم'
```

حروف «ی» و «ک» اصلاح شده و نیم‌فاصله‌های استاندارد به درستی جاگذاری گردیدند.

---

## ۲. تثبیت اعتبار شماره هویت و تذکره الکترونیکی

شما می‌توانید از تابع مستقیم یا کلاس شیءگرای `NationalCode` استفاده فرمایید:

```python
import parsikit

# بررسی تابعی:
is_valid = parsikit.is_valid_national_code("0010123458")
print(is_valid)  # خروجی: True

# بررسی شیءگرا:
nc = parsikit.NationalCode("0010123458")
print(nc.formatted)  # '001-012345-8'
print(nc.masked)     # '001-****45-8'
print(nc.clean)      # '0010123458'
```

در صورت نامعتبر بودن شماره یا عدم تطابق الگوریتم پیمانه ۱۱، خطای ساختاریافته `InvalidNationalCodeError` صادر خواهد شد.

---

## ۳. تثبیت کارت بانکی با الگوریتم لون

```python
import parsikit

card_number = "6037991122334455"

# بررسی صحت شماره کارت
print(parsikit.is_valid_card_number(card_number))  # True

# تشخیص خودکار بانک صادرکننده
print(parsikit.detect_bank_from_card(card_number))  # 'بانک ملی ایران'

# ماسک‌کردن امن جهت حفظ محرمانگی
print(parsikit.mask_card(card_number))  # '6037-9911-****-4455'
```

---

## ۴. تقویم هجری شمسی و سال کبیسه

```python
import parsikit

# تبدیل تاریخ میلادی به هجری شمسی
shamsi = parsikit.gregorian_to_jalali(2026, 10, 21)
print(shamsi)
# خروجی: (1405, 7, 29) -> ۲۹ میزان (مهر) ۱۴۰۵

# محاسبه دقیق سال کبیسه در چرخه ۳۳ ساله نجومی
print(parsikit.is_jalali_leap(1403))  # True
print(parsikit.is_jalali_leap(1404))  # False
```

---

## ۵. تبدیل ارقام و مبالغ به حروف

```python
import parsikit

amount = 3500000
words = parsikit.number_to_persian_words(amount)
print(words)
# خروجی: 'سه میلیون و پانصد هزار'
```
