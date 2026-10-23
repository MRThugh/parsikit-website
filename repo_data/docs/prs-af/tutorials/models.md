# آموزش مدل‌های شیءگرا در پارسی‌کیت (OOP Domain Models)

در کنار توابع مستقل، پارسی‌کیت مجموعه‌ای از کلاس‌های غنی شیءگرا در ماژول `parsikit.models` فراهم آورده تا توسعه‌دهندگان بتوانند با داده‌ها و موجودیت‌ها به آسانی کار کنند.

---

## خصوصیات مشترک تمام مدل‌ها

همه مدل‌های پارسی‌کیت از دو میکسین (Mixin) کاربردی ارث‌بری می‌نمایند:
1. **`StringLikeMixin` (شبه‌رشته):** امکان تعامل مشابه با یک استرینگ معمولی پایتون (`len(obj)`، دسترسی با اسلایس `obj[:3]` و سنجش برابری با استرینگ `obj == "..."`).
2. **`PydanticValidationMixin`:** امکان استفاده مستقیم به حیث نوع فیلد در اسکیماهای Pydantic v2 (مانند فریمورک FastAPI).
3. **متد `to_dict()`:** صدور اطلاعات و تحلیل‌های مربوطه در قالب دیکشنری پایتون.

---

## ۱. مدل متن (`PersianText`)

یک شیء متنی همراه با متدهای زنجیره‌ای (Chained Methods) برای تصفیه داده‌ها:

```python
import parsikit

text = parsikit.PersianText("ي كافيه كتاب ها رو برداري")
clean = text.standardize().beautify()
print(clean)
# 'ی کافیه کتاب‌ها رو برداری'

# اتصال به رشته‌های دیگر
combined = text + " و جهان"
print(type(combined))  # <class 'parsikit.models.PersianText'>

# تبدیل متن عددی به رقم
price_text = parsikit.PersianText("سه میلیارد و پانصد میلیون")
print(price_text.to_number())  # 3500000000
```

---

## ۲. مدل نمبر هویت (`NationalCode`)

```python
import parsikit

# ساخت شیء با اعتبارسنجی پیش‌فرض (strict=True)
nc = parsikit.NationalCode("7730123452")

print(nc.clean)      # '7730123452'
print(nc.formatted)  # '773-012345-2'
print(nc.masked)     # '773-****45-2'
print(nc.is_valid)   # True
print(len(nc))       # 10
print(nc.location)   # {'province': 'فارس', 'city': ...}

# رفتار مشابه به استرینگ
print(nc == "7730123452")  # True

# صدور دیکشنری
print(nc.to_dict())
```

در صورت نامعتبر بودن و فعال بودن حالت سخت‌گیرانه (`strict=True`)، خطای `InvalidNationalCodeError` ایجاد می‌شود.

---

## ۳. مدل شماره موبایل (`MobileNumber`)

```python
mob = parsikit.MobileNumber("+98۹۱۲۳۴۵۶۷۸۹")

print(mob.to_national())       # '09123456789'
print(mob.to_international())  # '+989123456789'
print(mob.operator)            # 'MCI'
print(mob.masked)              # '0912***6789'
```

---

## ۴. مدل کارت بانکی (`BankCard`)

```python
card = parsikit.BankCard("6037991122334455")

print(card.formatted)  # '6037-9911-2233-4455'
print(card.masked)     # '6037-99**-****-4455'
print(card.bank)       # {'name': 'بانک ملی ایران', 'code': 'melli'}
```

---

## ۵. مدل شبا یا حساب بین‌المللی (`Sheba`)

```python
sheba = parsikit.Sheba("IR050170000000123456789012")

print(sheba.formatted)       # 'IR05 0170 0000 0012 3456 7890 12'
print(sheba.bank)            # {'name': 'بانک ملی ایران', 'code': 'melli'}
print(sheba.account_number)  # '123456789012'
```
