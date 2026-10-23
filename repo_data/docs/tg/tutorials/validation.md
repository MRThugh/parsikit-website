# Омӯзиши санҷиши эътибори рақамҳо ва кортҳо

Тарзи санҷиши рақамҳои миллӣ ва кортҳои бонкӣ.

---

## 1. Санҷиш бо алгоритми Модуло 11

```python
import parsikit

valid = parsikit.is_valid_national_code("0010123458")
print(f"Вазъияти эътибор: {valid}")
```

---

## 2. Санҷиши корти бонкӣ бо Лун

```python
import parsikit

card = "6037991122334455"
if parsikit.is_valid_card_number(card):
    bank = parsikit.detect_bank_from_card(card)
    masked = parsikit.mask_card(card)
    print(f"Бонк: {bank} | Корти амн: {masked}")
```
