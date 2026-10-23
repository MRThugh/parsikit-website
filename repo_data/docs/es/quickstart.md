# Guía de Inicio Rápido

Comienza a utilizar ParsiKit en tu aplicación Python en menos de cinco minutos.

---

## 1. Normalización de Texto y Limpieza de ZWNJ

ParsiKit corrige inconsistencias tipográficas persas y caracteres arábigos comunes:

```python
import parsikit

# Normalización de caracteres y نیم‌فاصله (ZWNJ)
raw_text = "كتاب هاي آموزشي و خانه ها"
clean_text = parsikit.clean_text(raw_text)
print(clean_text)
# Salida: "کتاب‌های آموزشی و خانه‌ها"
```

---

## 2. Validación de Identificadores Nacionales y Bancarios

Valida identificadores del estándar iraní sin realizar peticiones de red:

```python
import parsikit

# Validación de Código Nacional (Módulo 11)
is_valid_national = parsikit.is_valid_national_code("0013581534")
print("Código Nacional válido:", is_valid_national)

# Validación de tarjeta bancaria (Algoritmo de Luhn) y detección de banco
card_number = "6037991199999999"
if parsikit.is_valid_card(card_number):
    bank_info = parsikit.get_bank_info(card_number)
    print("Banco emisor:", bank_info.name_fa)
```

---

## 3. Conversión de Calendario Jalalí a Gregoriano

Convierte fechas solares persas a fechas gregorianas con cálculo exacto de bisiestos:

```python
from parsikit import JalaliDate, gregorian_to_jalali, jalali_to_gregorian

# Convertir fecha actual a Jalalí
j_date = JalaliDate.today()
print(f"Hoy es: {j_date.year}/{j_date.month}/{j_date.day}")

# Conversión directa
g_year, g_month, g_day = jalali_to_gregorian(1403, 7, 15)
print(f"Fecha gregoriana: {g_year}-{g_month:02d}-{g_day:02d}")
```

---

## 4. Números a Palabras y Conversión de Divisas

```python
import parsikit

# Conversión de dígitos a palabras en persa
words = parsikit.number_to_words(1250000)
print(words)
# Salida: "یک میلیون و دویست و پنجاه هزار"

# Conversión de Riales a Tomanes
toman = parsikit.rial_to_toman(5000000)
print(f"{toman:,} تومان")
```

---

## 5. Enmascaramiento y Seguridad de Datos Personales

```python
import parsikit

# Enmascarar número de tarjeta bancaria
masked_card = parsikit.mask_card("6037997123456789")
print(masked_card)
# Salida: "6037-99**-****-6789"

# Enmascarar número de teléfono móvil
masked_phone = parsikit.mask_mobile("09123456789")
print(masked_phone)
# Salida: "0912***6789"
```
