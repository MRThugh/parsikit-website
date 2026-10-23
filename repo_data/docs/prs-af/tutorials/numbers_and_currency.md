# آموزش محاسبات ارقام و مبالغ مالی

آموزش تبدیل اعداد به نوشتار حروفی و قالب‌بندی ارقام.

---

## ۱. تبدیل اعداد به حروف

```python
import parsikit

num = 12450000
words = parsikit.number_to_persian_words(num)
print(words)
# خروجی: 'دوازده میلیون و چهارصد و پنجاه هزار'
```

---

## ۲. قالب‌بندی مبالغ پولی

```python
import parsikit

formatted = parsikit.format_currency(3500000, unit="افغانی")
print(formatted)
```
