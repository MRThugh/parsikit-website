# ماژول تقویم و زمان (parsikit.datetime)

ماژول `parsikit.datetime` محاسبات دقیق و تبدیل‌های زمانی میان تقویم میلادی (Gregorian) و هجری شمسی (Solar Hijri / Jalali) را ارائه می‌دهد.

---

## توابع اصلی

### `gregorian_to_jalali(gy: int, gm: int, gd: int) -> Tuple[int, int, int]`
تبدیل سال، ماه و روز میلادی به تاریخ معادل هجری شمسی.

### `jalali_to_gregorian(jy: int, jm: int, jd: int) -> Tuple[int, int, int]`
تبدیل تاریخ هجری شمسی به تاریخ معادل میلادی.

### `is_jalali_leap(year: int) -> bool`
محاسبه وضعیت سال کبیسه در تقویم هجری شمسی بر مبنای چرخه ۳۳ ساله نجومی.

### `humanize_relative_time(minutes_ago: int) -> str`
نمایش زمان به صورت متنی و انسانی در زبان فارسی دری (مانند: «۱۵ دقیقه پیش»).
