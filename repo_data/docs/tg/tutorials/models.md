# Омӯзиши моделҳои объектгаро дар ParsiKit (Domain Models)

Дар баробари функсияҳои мустақил, ParsiKit маҷмӯаи синфҳои объектгароро дар модули `parsikit.models` пешниҳод кардааст, то барномасозон тавонанд бо додаҳо ба осонӣ кор кунанд.

---

## Хусусиятҳои умумии ҳамаи моделҳо

Ҳамаи моделҳои ParsiKit аз ду Mixin-и қудратманд баҳра мебаранд:
1. **`StringLikeMixin` (монанди сатр):** Имкони рафтор ба мисли як сатри оддии Python (`len(obj)`, истифодаи слайсҳо `obj[:3]` ва муқоиса бо сатр `obj == "..."`).
2. **`PydanticValidationMixin`:** Имкони истифодаи мустақим ҳамчун намуди майдон дар схемаҳои Pydantic v2 (барои мисол дар FastAPI).
3. **Методи `to_dict()`:** Баровардани тамоми маълумот ва тафсилот дар шакли луғати Python (dictionary).

---

## 1. Модели матн (`PersianText`)

Сатри матние, ки дорои методҳои пайдарпай (Chained Methods) барои поксозӣ мебошад:

```python
import parsikit

text = parsikit.PersianText("ي كافيه كتاب ها رو برداري")
clean = text.standardize().beautify()
print(clean)
# 'ی کافیه کتاب‌ها رو برداری'

# Пайваст кардан бо дигар сатрҳо
combined = text + " ва ҷаҳон"
print(type(combined))  # <class 'parsikit.models.PersianText'>

# Табдили адади лафзӣ ба рақам
price_text = parsikit.PersianText("се миллиард ва панҷсад миллион")
print(price_text.to_number())  # 3500000000
```

---

## 2. Модели рақами муаррифӣ (`NationalCode`)

```python
import parsikit

# Сохтани объект бо санҷиши пешфарз (strict=True)
nc = parsikit.NationalCode("7730123452")

print(nc.clean)      # '7730123452'
print(nc.formatted)  # '773-012345-2'
print(nc.masked)     # '773-****45-2'
print(nc.is_valid)   # True
print(len(nc))       # 10
print(nc.location)   # {'province': 'Форс', 'city': ...}

# Муқоиса ба мисли сатри оддӣ
print(nc == "7730123452")  # True

# Натиҷа ҳамчун луғат
print(nc.to_dict())
```

Дар сурати нодуруст будани рақам ва фаъол будани `strict=True`, хатогии `InvalidNationalCodeError` рух медиҳад.

---

## 3. Модели рақами мобилӣ (`MobileNumber`)

```python
mob = parsikit.MobileNumber("+989123456789")

print(mob.to_national())       # '09123456789'
print(mob.to_international())  # '+989123456789'
print(mob.operator)            # 'MCI'
print(mob.masked)              # '0912***6789'
```

---

## 4. Модели корти бонкӣ (`BankCard`)

```python
card = parsikit.BankCard("6037991122334455")

print(card.formatted)  # '6037-9911-2233-4455'
print(card.masked)     # '6037-99**-****-4455'
print(card.bank)       # {'name': 'Бонки Миллӣ', 'code': 'melli'}
```

---

## 5. Модели суратҳисоби бонкӣ (`Sheba`)

```python
sheba = parsikit.Sheba("IR050170000000123456789012")

print(sheba.formatted)       # 'IR05 0170 0000 0012 3456 7890 12'
print(sheba.bank)            # {'name': 'Бонки Миллӣ', 'code': 'melli'}
print(sheba.account_number)  # '123456789012'
```
