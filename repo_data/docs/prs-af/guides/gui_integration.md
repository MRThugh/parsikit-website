# رهنمود اتصال پارسی‌کیت به واسط‌های گرافیکی کاربر (GUI)

پارسی‌کیت ماژول اختصاصی `parsikit.gui` را برای مدیریت و قالب‌بندی همزمان هنگام تایپ در فریمورک‌های دسکتاپ (مانند Tkinter، CustomTkinter، PyQt و PySide) ارائه می‌دهد.

---

## ۱. استفاده در Tkinter و CustomTkinter

تابع `bind_persian_input` با نظارت بر رویداد کلید (`<KeyRelease>`)، متون و ارقام ورودی کاربر را به شکل آنی تنظیم می‌نماید:

```python
import tkinter as tk
import parsikit

root = tk.Tk()
root.title("سامانه فرمت‌بندی هوشمند")

label = tk.Label(root, text="نمبر تذکره / هویت:")
label.pack()

entry_national_code = tk.Entry(root)
entry_national_code.pack()

# اتصال فرمت خودکار (XXX-XXXXXX-X)
parsikit.bind_persian_input(entry_national_code, input_type="national_code")

card_label = tk.Label(root, text="نمبر کارت بانکی:")
card_label.pack()

entry_card = tk.Entry(root)
entry_card.pack()

# اتصال فرمت خودکار ۴ بخشی کارت (XXXX-XXXX-XXXX-XXXX)
parsikit.bind_persian_input(entry_card, input_type="card_number")

root.mainloop()
```

---

## ۲. استفاده در PyQt / PySide

برای ویجت‌های ورودی `QLineEdit` در کیوت:

```python
from PyQt5.QtWidgets import QApplication, QLineEdit, QVBoxLayout, QWidget
import parsikit

app = QApplication([])
window = QWidget()
layout = QVBoxLayout()

card_input = QLineEdit()
card_input.setPlaceholderText("نمبر کارت ۱۶ رقمی...")
parsikit.bind_persian_input(card_input, input_type="card_number")

layout.addWidget(card_input)
window.setLayout(layout)
window.show()
app.exec_()
```

---

## انواع فیلدهای پشتیبانی شده در `bind_persian_input`:
- `"text"`: زیباسازی، تصفیه و اصلاح فواصل متن
- `"national_code"`: قالب ۳-۶-۱ شماره ملی / تذکره
- `"card_number"`: قالب ۴ تکه‌ای شماره کارت بانکی
- `"postal_code"`: قالب ۵-۵ کود پستی (`XXXXX-XXXXX`)
- `"sheba"`: قالب معیاری شماره شبا / حساب بانکی بین‌المللی با فواصل ۴ تایی
