# Guía de Instalación

ParsiKit requiere **Python 3.10** o superior. Es una biblioteca pura en Python sin dependencias externas de tiempo de ejecución.

---

## 1. Instalación mediante PyPI

Para instalar la última versión estable oficial desde el Python Package Index:

```bash
pip install parsikit
```

Para actualizar una instalación existente a la última versión:

```bash
pip install --upgrade parsikit
```

---

## 2. Entornos Virtuales y Gestores de Paquetes

### Uso con `venv` (Módulo estándar de Python)
```bash
python3 -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate
pip install parsikit
```

### Uso con Poetry
```bash
poetry add parsikit
```

### Uso con uv
```bash
uv pip install parsikit
```

---

## 3. Instalación desde el Código Fuente de GitHub

Si deseas compilar directamente desde el repositorio oficial:

```bash
git clone https://github.com/MRThugh/ParsiKit.git
cd ParsiKit
pip install -e .
```

---

## 4. Verificación de la Instalación

Comprueba que ParsiKit se ha instalado correctamente ejecutando este comando en la terminal:

```bash
python3 -c "import parsikit; print('Versión de ParsiKit instalada:', parsikit.__version__)"
```

Debería mostrar la versión instalada (por ejemplo, `3.3.1`).
