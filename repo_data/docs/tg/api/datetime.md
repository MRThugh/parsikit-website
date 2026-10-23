# Модули тақвим ва замон (parsikit.datetime)

Табдили дақиқи таърихҳои мелодӣ ва ҳиҷрии шамсӣ (Jalali).

---

## Тавобеи асосӣ

### `gregorian_to_jalali(gy: int, gm: int, gd: int) -> Tuple[int, int, int]`
Табдили санаи мелодӣ ба санаи муодили ҳиҷрии шамсӣ.

### `jalali_to_gregorian(jy: int, jm: int, jd: int) -> Tuple[int, int, int]`
Табдили санаи ҳиҷрии шамсӣ ба санаи мелодӣ.

### `is_jalali_leap(year: int) -> bool`
Ҳисоби соли кабиса дар даври 33-солаи нуҷумӣ.
