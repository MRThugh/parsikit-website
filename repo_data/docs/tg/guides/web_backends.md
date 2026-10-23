# Роҳнамои истифода дар веб-хидматҳо (FastAPI ва Django)

ParsiKit ба шарофати мутобиқати хуб бо Pydantic v2 яке аз беҳтарин интихобҳо барои санҷиш ва тозакунии додаҳо дар API-ҳои Python мебошад.

---

## 1. Истифода дар FastAPI бо Pydantic

Моделҳои ParsiKit мустақиман метавонанд ҳамчун намуди майдонҳо (field types) дар схемаҳои Pydantic истифода шаванд:

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import parsikit

app = FastAPI(title="Системаи пардохтҳои онлайнӣ")

class UserRegisterSchema(BaseModel):
    name: str
    national_code: parsikit.NationalCode
    mobile: parsikit.MobileNumber
    card: parsikit.BankCard

@app.post("/register")
def register_user(payload: UserRegisterSchema):
    # Ҳамаи майдонҳо дар вақти воридшавӣ пурра тафтиш шудаанд
    return {
        "status": "success",
        "clean_national_code": payload.national_code.clean,
        "masked_card": payload.card.masked,
        "bank_name": payload.card.bank["name"] if payload.card.bank else None,
        "mobile_international": payload.mobile.to_international(),
        "operator": payload.mobile.operator,
    }
```

Агар корбар маълумоти нодуруст ворид кунад, FastAPI ба таври худкор посухи хатогии HTTP 422 бармегардонад.

---

## 2. Истифода дар Django (Django Forms & Models)

Дар шаклҳои (forms) Django метавонед санҷишро дар методҳои `clean_<field>` даъват намоед:

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
            raise ValidationError("Рақами муаррифӣ нодуруст аст.")
        return parsikit.NationalCode(code).clean

    def clean_mobile(self):
        phone = self.cleaned_data["mobile"]
        if not parsikit.is_valid_mobile(phone):
            raise ValidationError("Рақами мобилӣ нодуруст аст.")
        return parsikit.normalize_mobile(phone, prefix="0")
```

---

## 3. Тозакунии матн пеш аз сабт дар пойгоҳи додаҳо

Қабл аз сабти шарҳҳо, номҳо ё суроғаҳо дар пойгоҳи додаҳо, истифодаи `clean_text` ҷустуҷӯи дақиқро кафолат медиҳад:

```python
cleaned_title = parsikit.clean_text(user_input_title)
```
Ин амал ҳарфҳои арабиро ба стандарти мувофиқ табдил дода, нимафосилаҳои дурустро ҷойгузин месозад.
