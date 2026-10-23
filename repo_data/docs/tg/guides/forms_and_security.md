# Роҳнамои амнияти додаҳо ва санҷиши шаклҳо

Усулҳои амнияти маълумот ва ниқоббандии додаҳои ҳассос.

---

## 1. Ниқоббандии кортҳо ва телефонҳо

```python
import parsikit

raw_card = "6037991122334455"
safe_card = parsikit.mask_card(raw_card)
print(f"Корти амн: {safe_card}")
```

---

## 2. Истифода дар FastAPI

```python
from parsikit.models import NationalCode
from parsikit.exceptions import InvalidNationalCodeError

def validate_user(code: str):
    try:
        nc = NationalCode(code)
        return nc.clean
    except InvalidNationalCodeError:
        raise ValueError("Рақами воридшуда беэътибор аст.")
```
