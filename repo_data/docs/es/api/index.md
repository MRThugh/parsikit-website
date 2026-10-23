# Referencia de la API de ParsiKit

Resumen de los módulos de nivel superior disponibles en ParsiKit.

---

## Módulos Principales

### `parsikit.text`
- `clean_text(text: str) -> str`: Normaliza caracteres persas, unifica espacios y corrige ZWNJ.
- `to_persian_digits(text: str) -> str`: Convierte dígitos latinos y arábigos a dígitos persas estándar (۰۱۲۳۴۵۶۷۸۹).
- `to_latin_digits(text: str) -> str`: Convierte dígitos persas y arábigos a números estándar ASCII (0123456789).
- `remove_diacritics(text: str) -> str`: Elimina marcas de vocalización y اعراب.

### `parsikit.validators`
- `is_valid_national_code(code: str) -> bool`: Valida el código nacional de 10 dígitos usando el algoritmo de Módulo 11.
- `is_valid_card(card_number: str) -> bool`: Valida tarjetas de 16 dígitos con el algoritmo de Luhn.
- `is_valid_sheba(sheba_number: str) -> bool`: Valida el código IBAN de Irán (IR...) según la norma ISO 7064.
- `is_valid_postal_code(postal_code: str) -> bool`: Valida el código postal iraní de 10 dígitos.
- `is_valid_mobile(phone_number: str) -> bool`: Valida números móviles según los prefijos autorizados de operadores iraníes.

### `parsikit.datetime`
- `JalaliDate`: Clase que representa una fecha en el calendario Jalalí (Hégira Solar).
- `gregorian_to_jalali(year: int, month: int, day: int) -> tuple[int, int, int]`: Conversión a fecha solar.
- `jalali_to_gregorian(year: int, month: int, day: int) -> tuple[int, int, int]`: Conversión a fecha gregoriana.
- `is_jalali_leap(year: int) -> bool`: Determina si un año solar persa es bisiesto según el ciclo astronómico de 33 años.

### `parsikit.number_and_currency`
- `number_to_words(number: int | float) -> str`: Convierte cantidades numéricas a palabras en persa.
- `rial_to_toman(amount: int | float) -> int | float`: Convierte Riales a Tomanes dividiendo por 10.
- `toman_to_rial(amount: int | float) -> int | float`: Convierte Tomanes a Riales multiplicando por 10.
- `calculate_vat(amount: int | float, rate: float = 0.10) -> tuple[int | float, int | float]`: Calcula el importe del IVA y el total.

### `parsikit.security`
- `mask_card(card: str) -> str`: Enmascara dígitos centrales de una tarjeta bancaria.
- `mask_mobile(phone: str) -> str`: Enmascara dígitos intermedios de un número telefónico.
- `mask_national_code(code: str) -> str`: Enmascara los dígitos iniciales de un código nacional.
