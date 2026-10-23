# Омӯзиши тақвими нуҷумии ҳиҷрии шамсӣ

Тарзи табдили таърих ва муҳосибаи соли кабиса бо ParsiKit.

---

## 1. Табдили таърихи мелодӣ ба ҳиҷрии шамсӣ

```python
import parsikit

jy, jm, jd = parsikit.gregorian_to_jalali(2026, 10, 21)
print(f"Сана: {jy}/{jm:02d}/{jd:02d}")
# Натиҷа: 1405/07/29
```

---

## 2. Ҳисоби соли кабиса

```python
import parsikit

print("1403 кабиса аст?", parsikit.is_jalali_leap(1403))  # True
print("1404 кабиса аст?", parsikit.is_jalali_leap(1404))  # False
```
