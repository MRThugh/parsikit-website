# Роҳнамои пайвастшавӣ ба интерфейсҳои графикӣ (GUI)

ParsiKit модули махсуси `parsikit.gui`-ро барои идора ва танзими ҳамзамони матн дар вақти навиштан дар барномаҳои мизи корӣ (ба мисли Tkinter, CustomTkinter, PyQt ва PySide) пешниҳод менамояд.

---

## 1. Истифода дар Tkinter ва CustomTkinter

Функсияи `bind_persian_input` ба ҳодисаи тугмаҳо (`<KeyRelease>`) пайваст шуда, матн ва рақамҳои воридшударо фавран ислоҳ менамояд:

```python
import tkinter as tk
import parsikit

root = tk.Tk()
root.title("Системаи воридоти ҳушманд")

label = tk.Label(root, text="Рақами муаррифӣ:")
label.pack()

entry_national_code = tk.Entry(root)
entry_national_code.pack()

# Танзими худкори формат (XXX-XXXXXX-X)
parsikit.bind_persian_input(entry_national_code, input_type="national_code")

card_label = tk.Label(root, text="Шумораи корти бонкӣ:")
card_label.pack()

entry_card = tk.Entry(root)
entry_card.pack()

# Танзими худкори 4-қисмаи корти бонкӣ (XXXX-XXXX-XXXX-XXXX)
parsikit.bind_persian_input(entry_card, input_type="card_number")

root.mainloop()
```

---

## 2. Истифода дар PyQt / PySide

Барои виҷетҳои `QLineEdit` дар PyQt:

```python
from PyQt5.QtWidgets import QApplication, QLineEdit, QVBoxLayout, QWidget
import parsikit

app = QApplication([])
window = QWidget()
layout = QVBoxLayout()

card_input = QLineEdit()
card_input.setPlaceholderText("Рақами 16-рақамаи корт...")
parsikit.bind_persian_input(card_input, input_type="card_number")

layout.addWidget(card_input)
window.setLayout(layout)
window.show()
app.exec_()
```

---

## Намудҳои майдонҳои дастгиришаванда дар `bind_persian_input`:
- `"text"`: Зебосозӣ ва баробар кардани фосилаҳо дар матн
- `"national_code"`: Формати 3-6-1-и рақами миллӣ
- `"card_number"`: Формати 4-қисмаи рақами корти бонкӣ
- `"postal_code"`: Формати 5-5-и индекси почта (`XXXXX-XXXXX`)
- `"sheba"`: Формати стандартии суратҳисоби бонкӣ бо фосилаҳои 4-рақамӣ
