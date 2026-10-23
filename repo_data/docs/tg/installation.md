# Роҳнамои насб ва бакорандозии ParsiKit

Китобхонаи ParsiKit комилан бо забони холиси Python (Pure Python) навишта шудааст ва ҳеҷ гуна вобастагӣ ба китобхонаҳои берунаи C надорад. Аз ин рӯ, он дар ҳама гуна системаи омил (Linux, macOS, Windows) дар як лаҳза насб мегардад.

---

## Талаботи система

- Забони Python **3.10** ё болотар (Python 3.10, 3.11, 3.12, 3.13)
- Бе ниёз ба компилятор ё абзорҳои изофӣ

---

## 1. Насби мустақим тавассути pip

Осонтарин роҳ барои насби нусхаи расмӣ аз PyPI:

```bash
pip install parsikit
```

Ё бо истифода аз абзорҳои муосир:

```bash
# Бо Poetry
poetry add parsikit

# Бо uv
uv add parsikit
```

---

## 2. Насб аз манбаи лоиҳа (GitHub)

Барои санҷиши нусхаи рушд аз GitHub:

```bash
git clone https://github.com/MRThugh/ParsiKit.git
cd ParsiKit
pip install .
```

---

## 3. Санҷиши насб дар Python

Барои итминон аз насби дуруст дар терминали худ санҷед:

```python
import parsikit

print(parsikit.__version__)
# Натиҷа бояд '3.3.1' бошад
```
