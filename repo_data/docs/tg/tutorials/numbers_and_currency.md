# Омӯзиши табдили ададҳо ба калимаҳо

Табдили рақамҳо ба калимаҳои хоно ва муҳосибаи воҳидҳои пулӣ.

---

## 1. Ададҳо ба калимаҳо

```python
import parsikit

words = parsikit.number_to_persian_words(12450000)
print(words)
# Натиҷа: 'دوازده میلیون و چهارصد و پنجاه هزار'
```

---

## 2. Тартибдиҳии пулӣ

```python
import parsikit

formatted = parsikit.format_currency(3500000, unit="сомонӣ")
print(formatted)
```
