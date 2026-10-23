# Бартараф кардани хатогиҳо ва мушкилоти умумӣ

Роҳнамои кӯтоҳ барои ҳалли хатогиҳои маъмул ҳангоми истифодаи ParsiKit.

---

## 1. Хатогии `InvalidNationalCodeError`

Ин хато ҳангоми нодуруст будани чексами рақами миллӣ рух медиҳад:

- Рақами воридшуда бояд дақиқан 10 рақам бошад.
- Рақамҳо набояд 10 рақами якхела (масалан `1111111111`) бошанд.
- Аз блоки `try ... except` истифода баред:

```python
from parsikit.exceptions import InvalidNationalCodeError
from parsikit.models import NationalCode

try:
    code = NationalCode("1234567890")
except InvalidNationalCodeError as e:
    print(f"Хатои санҷиш: {e}")
```

---

## 2. Хатогии `InvalidCardNumberError`

Ин хато ҳангоми номутобиқатии рақами корти 16-рақама бо алгоритми Лун (Luhn) сар мезанад.
