# Омӯзиши поксозии матн ва нимафосилаҳо

Роҳнамои амалии стандартисозии матнҳо бо ParsiKit.

---

## 1. Ислоҳи ҳарфҳо

```python
import parsikit

dirty = "اين يك متن аст"
clean = parsikit.standardize_persian(dirty)
print(clean)
# Натиҷа: 'این یک متن است'
```

---

## 2. Ислоҳи нимафосилаҳо

```python
import parsikit

text = "کتاب ها را می خوانم"
corrected = parsikit.clean_text(text)
print(corrected)
# Натиҷа: 'کتاب‌ها را می‌خوانم'
```
