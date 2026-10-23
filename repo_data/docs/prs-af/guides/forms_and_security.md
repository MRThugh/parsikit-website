# راهنمای امنیت داده‌ها و اعتبارسنجی فرم‌ها

این راهنما شیوه پیاده‌سازی اعتبارسنجی امن و جلوگیری از نشت اطلاعات حساس (PII) را بیان می‌کند.

---

## ۱. ماسک‌کردن شماره کارت و شماره تماس در لاگ‌ها

هرگز اطلاعات هویتی و شماره‌های بانکی کاربران را به صورت خام در فایل‌های لاگ یا پاسخ‌های API ذخیره نکنید:

```python
import parsikit

raw_card = "6037991122334455"
raw_mobile = "09123456789"

safe_card = parsikit.mask_card(raw_card)
safe_mobile = parsikit.mask_mobile(raw_mobile)

print(f"Log: payment attempt for card={safe_card}, user={safe_mobile}")
```

---

## ۲. استفاده از استثناهای ساختاریافته در FastAPI

```python
from parsikit.models import NationalCode
from parsikit.exceptions import InvalidNationalCodeError

def validate_user_input(code_str: str):
    try:
        nc = NationalCode(code_str)
        return nc.clean
    except InvalidNationalCodeError:
        raise ValueError("شماره هویت نامعتبر است.")
```
