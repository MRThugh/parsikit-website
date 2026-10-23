# آموزش تثبیت اعتبار اسناد و کارت‌های بانکی

این آموزش به تشریح نحوه اعتبارسنجی شماره‌های تذکره الکترونیکی، کد ملی و کارت‌های بانکی می‌پردازد.

---

## ۱. تثبیت اعتبار با الگوریتم پیمانه ۱۱

الگوریتم پیمانه ۱۱ با ضرب وزن‌های نزولی در ارقام و محاسبه باقیمانده بر ۱۱ کار می‌کند:

```python
import parsikit

# بررسی شماره تذکره / کد ملی
valid = parsikit.is_valid_national_code("0010123458")
print(f"وضعیت اعتبار: {valid}")
```

---

## ۲. بررسی کارت بانکی با الگوریتم لون

```python
import parsikit

card = "6037991122334455"
if parsikit.is_valid_card_number(card):
    bank = parsikit.detect_bank_from_card(card)
    masked = parsikit.mask_card(card)
    print(f"بانک صادرکننده: {bank} | شماره ماسک‌شده: {masked}")
```
