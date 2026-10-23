# آموزش تقویم نجومی هجری شمسی

نحوه تبدیل تاریخ‌ها و مدیریت محاسبات تقویم خورشیدی در پروژه‌های پایتون.

---

## ۱. تبدیل تاریخ میلادی به هجری شمسی

```python
import parsikit

year, month, day = 2026, 10, 21
jy, jm, jd = parsikit.gregorian_to_jalali(year, month, day)

print(f"تاریخ هجری شمسی: {jy}/{jm:02d}/{jd:02d}")
# خروجی: 1405/07/29
```

---

## ۲. بررسی سال کبیسه در چرخه ۳۳ ساله

```python
import parsikit

print("1403 کبیسه است؟", parsikit.is_jalali_leap(1403))  # True
print("1404 کبیسه است؟", parsikit.is_jalali_leap(1404))  # False
```
