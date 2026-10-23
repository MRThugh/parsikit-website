# Оғози зуд бо ParsiKit (Quickstart)

Дар ин бахш бо мисолҳои сода ва муҳимтарини коркарди ParsiKit шинос мешавем.

---

## 1. Поксозии матн ва нимафосилаҳо

```python
import parsikit

dirty_text = "ي كافيه كتاب ها رو برداري"
clean_text = parsikit.standardize_persian(dirty_text)

print(clean_text)
# Натиҷа: 'ی کافیه کتاب‌ها رو برداری'
```

---

## 2. Санҷиши рақами миллӣ (National Code)

```python
import parsikit

# Тарзи функсионалӣ:
is_ok = parsikit.is_valid_national_code("0010123458")
print(is_ok)  # True

# Тарзи объектгаро:
nc = parsikit.NationalCode("0010123458")
print(nc.formatted)  # '001-012345-8'
print(nc.masked)     # '001-****45-8'
```

---

## 3. Санҷиши корти бонкӣ бо алгоритми Лун

```python
import parsikit

card = "6037991122334455"
print(parsikit.is_valid_card_number(card))   # True
print(parsikit.detect_bank_from_card(card))  # 'بانک ملی ایران'
print(parsikit.mask_card(card))              # '6037-9911-****-4455'
```

---

## 4. Тақвими ҳиҷрии шамсӣ

```python
import parsikit

# Табдил додани таърихи мелодӣ ба ҳиҷрии шамсӣ
shamsi = parsikit.gregorian_to_jalali(2026, 10, 21)
print(shamsi)
# Натиҷа: (1405, 7, 29) -> 29 меҳри 1405

# Ҳисоби соли кабиса
print(parsikit.is_jalali_leap(1403))  # True
print(parsikit.is_jalali_leap(1404))  # False
```

---

## 5. Табдили рақамҳо ба калимаҳо

```python
import parsikit

amount = 3500000
words = parsikit.number_to_persian_words(amount)
print(words)
# Натиҷа: 'سه میلیون و پانصد هزار'
```
