# Características de ParsiKit

ParsiKit fue diseñado para resolver problemas endémicos del procesamiento computacional del idioma persa en entornos de producción.

---

## 1. Arquitectura en Python Puro

Muchas herramientas anteriores de procesamiento de texto persa dependen de extensiones compiladas en C++, paquetes desactualizados o llamadas a binarios externos. ParsiKit es 100% Python puro sin ninguna dependencia externa, lo que garantiza portabilidad total en Linux, macOS, Windows, WebAssembly (Pyodide), AWS Lambda y contenedores Docker mínimos.

---

## 2. Sistema de Caché Seguro para Hilos (`parsikit.cache`)

Las conversiones frecuentes de números a palabras y los cálculos de fechas astronómicas pueden generar sobrecarga en aplicaciones con alta concurrencia. ParsiKit incluye un sistema de caché LRU optimizado y seguro para hilos (`thread-safe`), configurable a través de `parsikit.config`.

---

## 3. Modelo de Dominio Orientado a Objetos (`parsikit.models`)

Además de las funciones procedimentales directas, ParsiKit proporciona clases de dominio enriquecidas:
- `NationalCode`: Valida, formatea e inspecciona la localidad de emisión del código nacional.
- `BankCard`: Valida mediante el algoritmo de Luhn y extrae la información del banco emisor a partir del BIN/IIN.
- `MobileNumber`: Valida la estructura del operador móvil iraní (MCI, MTN Irancell, RighTel, Shatel).
- `Sheba`: Valida el código IBAN estándar de Irán mediante ISO 7064 Mod 97-10.

---

## 4. Tipografía y Reshaping Gráfico (`parsikit.reshaper`)

En entornos de renderizado gráfico sin soporte nativo de texto bidireccional (Bidi), como bibliotecas de gráficos en consola o generación de imágenes, el persa suele mostrarse desconectado o invertido. ParsiKit incluye un conformador de glifos que une correctamente las letras persas y aplica las formas inicial, medial, final y aislada correspondientes.
