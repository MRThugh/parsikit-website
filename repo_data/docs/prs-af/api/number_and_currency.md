# ماژول اعداد و ارز (parsikit.currency)

ماژول `parsikit.currency` و توابع مربوطه، تبدیل ارقام به نوشتار حروفی و محاسبات پولی را مدیریت می‌نمایند.

---

## توابع پرکاربرد

### `number_to_persian_words(num: int) -> str`
تبدیل اعداد صحیح تا ۹۹۹ سپتیلیون به حروف روان و طبیعی.

### `format_currency(amount: int, unit: str = "toman") -> str`
قالب‌بندی مبالغ با جداسازی ۳ رقمی ارقام و ذکر واحد پولی.

### `to_persian_digits(text: str) -> str`
تبدیل ارقام انگلیسی یا عربی به اعداد فارسی.
