# 05 · Objetos, JSON, Map y Set — Plantilla de clase

Esta carpeta es la **versión para dictar la clase escribiendo el JavaScript en vivo**, delante de
los estudiantes. La maqueta ya está montada para no perder tiempo en HTML y CSS.

La **solución de referencia** es la carpeta padre: `../` (mismo proyecto, con todo el código escrito).

---

## Qué viene hecho y qué se escribe en vivo

| Archivo | Estado |
|---|---|
| `index.html` | **Completo.** Misma estructura, mismos `id` y mismas clases que la versión resuelta. |
| `css/estilos.css` | **Completo.** Copia exacta del final, más unas reglas para el aviso de modo clase. |
| `js/00-utilidades.js` | **Completo y funcionando.** Es andamiaje, no materia. |
| `js/01` … `js/06` | **Por completar.** Toda la teoría en prosa está, el código no: hay bloques `TODO (en clase)`. |

Dentro de los archivos `01` a `06` **sí vienen escritos**:

- La **IIFE** `(function () { ... })();` que envuelve cada archivo (con su comentario explicando por
  qué está ahí: evita que dos archivos que declaren `const estudiante` choquen entre sí).
- La línea que crea la **consola visual**: `const { imprimir, titulo } = window.Utilidades.crearConsola('salida-0X');`
- Los **datos de partida**: el objeto `producto` (02), la ficha `estudiante` (03), los objetos y
  textos JSON de ejemplo (04), los arrays `asistencias`, `trabajos` y `registros` (05) y el array
  completo `estudiantes` (06). Teclear datos en clase es tiempo perdido; lo que se escribe en vivo
  es la lógica que los procesa.

---

## La página arranca VACÍA a propósito

Abre `index.html` (con Live Server o con doble clic) **antes de escribir una sola línea**:

- Las seis consolas visuales aparecen **vacías**.
- El contenedor de fichas del proyecto 06 aparece **vacío**.
- La consola del navegador (**F12**) no muestra **ningún error**.

Eso es exactamente lo esperado. Los archivos `.js` son JavaScript válido compuesto casi por
completo de comentarios. A medida que se escribe cada bloque `TODO`, la salida va apareciendo.

---

## Orden recomendado y minutos estimados

| # | Archivo | Secciones | Minutos |
|---|---|---|---|
| 0 | `00-utilidades.js` | Se explica de palabra, no se escribe | 3 |
| 1 | `01-objetos-basicos.js` | 7 secciones: literal, acceso, add/delete, anidados, `this`, shorthand, computadas | 45 |
| 2 | `02-recorrer-y-copiar.js` | 8 secciones: `for...in`, keys/values/entries, entries + array, `assign`, spread, copia profunda, `freeze`/`seal`, `in`/`hasOwn` | 55 |
| 3 | `03-destructuring-y-opcional.js` | 8 secciones: básico, renombrar, defectos, anidado, parámetros, rest, `?.`, `??` | 50 |
| 4 | `04-json.js` | 6 secciones: qué es JSON, `stringify`, lo que se pierde, `parse`, errores típicos, `localStorage` | 45 |
| 5 | `05-map-y-set.js` | 7 secciones: Map, métodos, recorrer, contar/agrupar, Set, conjuntos, Weak* | 45 |
| 6 | `06-proyecto-fichas.js` | 7 bloques: datos, auxiliares, `crearTarjeta`, render, estadísticas, botón JSON, botón parse | 60 |

Reparto por sección aproximado: **5 a 8 minutos** cada bloque `TODO`. Cada `TODO` termina indicando
cuántas líneas ocupa en la solución (`aprox. N lineas`) para calcular el ritmo sobre la marcha.

Si hay que recortar: las secciones que mejor aguantan quedarse fuera son `WeakMap`/`WeakSet` (05.7)
y `Object.seal` (02.7, segunda mitad). El proyecto 06 conviene no partirlo.

---

## Cómo comparar con la solución

Ten los dos archivos abiertos en paralelo, en dos pestañas del editor:

```
05-objetos/plantilla-clase/js/03-destructuring-y-opcional.js   <- la plantilla
05-objetos/js/03-destructuring-y-opcional.js                   <- la solución
```

- **Las secciones numeradas coinciden una a una**, en el mismo orden y con los mismos títulos.
- Cada `TODO (en clase)` corresponde al bloque de código que va justo debajo de ese mismo separador
  en la solución.
- Los `TODO` dicen el **nombre exacto** de cada variable y función, el **id del elemento del DOM**
  con el que hay que trabajar y la **salida esperada**, para que lo escrito en vivo dé exactamente
  el mismo resultado que la versión resuelta.
- Para ver el resultado final funcionando, abre `../index.html` (también está enlazado desde el
  aviso amarillo de la parte superior de la página).

---

## Reglas de la casa

- Sin Node, sin npm, sin librerías, sin CDNs. Solo el navegador.
- No se toca la carpeta padre: es la solución de referencia.
- Si algo se rompe en clase, se recarga la página y se sigue desde el siguiente `TODO`: cada bloque
  es independiente del anterior salvo donde el propio comentario avisa de que una variable se
  reutiliza más abajo.
