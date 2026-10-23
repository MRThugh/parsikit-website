# Маълумотномаи абзорҳои ташхис ва график (`parsikit.dev`, `parsikit.gui`, `parsikit.reshaper`)

Абзорҳои махсус барои ташхиси хатогиҳои матнӣ, баробарсозии визуалии сутунҳо дар ҷадвалҳо, сабти гузоришҳо (logging) ва намоиши дурусти матн дар интерфейсҳои графикӣ (GUI).

---

## 1. Қолаббандии баробари визуалӣ (`pformat` ва `persian_fstring`)

Аломатҳои бебар ба монанди нимафосила (`\u200C`) ва эъробҳо дарозии рамзӣ доранд, аммо дар намоиши экран ҷой намегиранд. Функсияҳои стандартии Python дар қолаббандии сутунии матнҳо ин хусусиятро ба назар намегиранд ва боиси каҷ шудани ҷадвалҳо мегарданд.

### `pformat(template: str, *args, **kwargs) -> str`
Матнро бо ба назар гирифтани бари воқеии визуалӣ (Visual Width)-и ҳарфҳо баробар сохта, сутунҳоро мураттаб мекунад. Аз пасванди `:fa` барои табдили ҳамзамони рақамҳо ва гузоштани вергули ҳазориҳо пуштибонӣ менамояд.

```python
from parsikit.dev import pformat

line = pformat("{:15} | {:>10:fa}", "Китобҳо", 15000)
print(line)  # 'Китобҳо         |     ۱۵،۰۰۰'
```

### `persian_fstring(template: str, **kwargs) -> str`
Монанди `pformat` барои ибораҳои қолабӣ бо пуштибонии мустақим аз номи тағйирёбандаҳо дар Python.

---

## 2. Абзорҳои ташхис ва санҷиш (`parsikit.dev`)

### `inspect_text(text: str) -> dict`
Сохтори дохилии матнро таҳлил намуда, шумораи нимафосилаҳо, вазъияти рақамҳо, эъробҳо ва ҳарфҳои арабиро гузориш медиҳад:

```python
from parsikit.dev import inspect_text

report = inspect_text("Намуна 123")
print(report)
# {'length': ..., 'has_arabic_chars': False, 'has_zwnj': False, 'has_persian_digits': True, ...}
```

### `debug_text(text: str) -> None`
Гузориши ранга, муфассал ва ташхисиро оид ба хусусиятҳои матн дар терминал чоп мекунад.

### `validate_batch(items: list, model_class, silent: bool = False) -> dict`
Маҷмӯаи додаҳоро ба таври дастаҷамъӣ санҷида, натиҷаҳои дуруст ва нодурустро ҳамроҳ бо сабаби хато ҷудо мекунад.

---

## 3. Тағйири шакли графикӣ ва пайвастшавӣ ба интерфейс (`parsikit.reshaper`, `parsikit.gui`)

### `reshape_for_graphics(text: str, reverse: bool = True) -> str`
Матнро барои муҳаррикҳои графикии бе дастгирии системаи HarfBuzz (монанди Pygame, Pillow, OpenCV ва ReportLab) пайваст ва самти онро танзим мекунад.

### `reshape_paragraph_for_graphics(text: str, max_chars_per_line: int, reverse: bool = True) -> list[str]`
Параграфҳои дарозро аз рӯи шумораи муайяни аломатҳо дар сатр тақсим карда, ҳар сатрро ба таври пайваст барои расмкашӣ омода месозад.

### `bind_persian_input(widget, input_type: str = "text") -> None`
Виҷети воридшавии матниро дар фреймворкҳои Tkinter ё CustomTkinter ба механизми танзими худкори ҳарфҳо ва ислоҳи рақамҳо пайваст менамояд.
