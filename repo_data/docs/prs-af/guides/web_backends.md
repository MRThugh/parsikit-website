# رهنمود استفاده از پارسی‌کیت در سیستم‌های ویب و بک‌اند (FastAPI و Django)

کتابخانه پارسی‌کیت به دلیل برخورداری از ساختار Duck-Typing و سازگاری بومی با اسکیماهای Pydantic v2، گزینه‌ای ایده‌آل برای تصفیه داده‌ها و اعتبارسنجی ورودی‌ها در سرویس‌های پایتون محسوب می‌شود.

---

## ۱. ادغام در فریمورک FastAPI با Pydantic

مدل‌های دامنه‌ای پارسی‌کیت مستقیماً به حیث نوع فیلدها در اسکیماهای Pydantic قابل استفاده هستند:

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import parsikit

app = FastAPI(title="سیستم تادیات و خدمات آنلاین")

class UserRegisterSchema(BaseModel):
    name: str
    national_code: parsikit.NationalCode
    mobile: parsikit.MobileNumber
    card: parsikit.BankCard

@app.post("/register")
def register_user(payload: UserRegisterSchema):
    # صحت تمام معلومات در لحظه دریافت تضمین شده است
    return {
        "status": "success",
        "clean_national_code": payload.national_code.clean,
        "masked_card": payload.card.masked,
        "bank_name": payload.card.bank["name"] if payload.card.bank else None,
        "mobile_international": payload.mobile.to_international(),
        "operator": payload.mobile.operator,
    }
```

در صورت ارسال معلومات غیرمعیاری، FastAPI به شکل خودکار پاسخ خطای اعتبارسنجی HTTP 422 بازمی‌گرداند.

---

## ۲. استفاده در فریمورک جنگو (Django Forms & Models)

در فارم‌های جنگو می‌توانید توابع بررسی صحت را در میتودهای `clean_<field>` فراخوانی نمایید:

```python
from django import forms
from django.core.exceptions import ValidationError
import parsikit

class UserProfileForm(forms.Form):
    national_code = forms.CharField(max_length=10)
    mobile = forms.CharField(max_length=15)

    def clean_national_code(self):
        code = self.cleaned_data["national_code"]
        if not parsikit.is_valid_national_code(code):
            raise ValidationError("نمبر هویت یا تذکره وارد شده معتبر نمی‌باشد.")
        return parsikit.NationalCode(code).clean

    def clean_mobile(self):
        phone = self.cleaned_data["mobile"]
        if not parsikit.is_valid_mobile(phone):
            raise ValidationError("شماره موبایل وارد شده صحیح نیست.")
        return parsikit.normalize_mobile(phone, prefix="0")
```

---

## ۳. تصفیه متون پیش از ذخیره‌سازی در پایگاه داده

قبل از ثبت توضیحات، نام‌ها یا آدرس‌ها در دیتابیس، استفاده از تابع `clean_text` جستجوی دقیق و بدون نقص را تضمین می‌کند:

```python
cleaned_title = parsikit.clean_text(user_input_title)
```
این پروسه حروف عربی «ي» و «ك» را پاکسازی نموده و نیم‌فاصله‌های معیاری را در متن جایگزین می‌سازد.
