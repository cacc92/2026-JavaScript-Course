# 01 · Fundamentos de JavaScript — Plantilla de clase

Versión **para escribir el JavaScript en vivo** delante de los estudiantes.
La maqueta (HTML + CSS) ya está terminada; lo único que falta es el código.

---

## 1. Para qué sirve esta carpeta

En una clase de fundamentos el tiempo se va en teclear `<div>` y reglas de CSS
que no son la materia del día. Esta plantilla resuelve eso:

- El **HTML está completo**: todas las secciones, la tabla `==` vs `===`,
  la consola visual, los botones y sus `id`. No hay que tocar nada.
- El **CSS está completo**: copia exacta del proyecto resuelto, más unas
  reglas para el cartel amarillo de *MODO CLASE*.
- Los **archivos `.js` están vacíos de código**: conservan la cabecera, los
  separadores de sección numerados, toda la explicación en prosa, los avisos
  ⚠️ ERROR COMÚN y ✅ BUENA PRÁCTICA y los ejercicios propuestos, pero el
  código ejecutable se ha sustituido por bloques `// TODO (en clase):` con
  instrucciones precisas: nombre de cada variable, `id` del elemento del DOM,
  salida esperada en pantalla y una estimación de líneas.

## 2. La página arranca vacía a propósito

Abre `plantilla-clase/index.html` en el navegador **antes de escribir nada**:

- la maqueta se ve completa,
- la caja negra de la consola visual muestra **una sola línea**:
  `[script interno] Esta linea la escribio un <script> dentro del HTML.`
  (la escribe el `<script>` de ejemplo que vive dentro del propio
  `index.html`, en la sección «Cómo incluir JavaScript»; no sale de la
  carpeta `js/`),
- y la consola de DevTools (`F12`) **no muestra ni un solo error**.

Eso es exactamente lo esperado. Cada línea que se escriba en clase irá
apareciendo debajo de esa primera al recargar con `F5`.

> Única excepción conocida: el botón *«Botón con onclick en línea (mal ejemplo)»*
> lanza un `ReferenceError` **al pulsarlo** mientras no se haya escrito la
> sección 7 de `js/04-interaccion.js`. No es un fallo de la plantilla: es el
> mejor momento para explicar por qué el JavaScript en línea es frágil.

## 3. Qué se escribe en vivo y qué ya viene hecho

| Ya viene escrito (no teclear) | Se escribe en vivo |
|---|---|
| `index.html` y `css/estilos.css` completos | Todo el contenido de los bloques `TODO (en clase)` |
| La `IIFE` `(function () { ... })();` de cada archivo y su `'use strict'` | El código de cada sección numerada |
| `imprimir()` y `titulo()` en `01-variables-y-tipos.js` | — |
| El rescate `const imprimir = window.imprimir \|\| ...` en los archivos 02, 03 y 04 | — |
| Datos de partida: el array `estudiantes`, la lista `listaFalsy`, el objeto `producto` | La lógica que los procesa |
| Toda la prosa, los avisos y los ejercicios propuestos | — |

## 4. Orden recomendado y minutos estimados

Los cuatro archivos se cargan con `defer` y en orden, así que hay que
respetar la secuencia: el archivo 01 crea `imprimir()`, que los otros tres usan.

### `js/01-variables-y-tipos.js` — ~55 min
| Sección | Contenido | Min. |
|---|---|---|
| 1 | Función `imprimir()` — **ya escrita**, solo explicarla | 5 |
| 2 | Comentarios de línea y de bloque | 3 |
| 3 | Métodos de `console` y `console.table()` | 7 |
| 4 | `var`, `let` y `const` | 8 |
| 5 | Ámbito: bloque vs función, y el bucle con `var`/`let` | 10 |
| 6 | Hoisting y zona muerta temporal (TDZ) | 5 |
| 7 | `const` con objetos y `Object.freeze` | 6 |
| 8 | Reglas y convenciones de nombres | 4 |
| 9 | Los 7 tipos primitivos | 8 |
| 10 | `typeof` y la rareza de `null` | 6 |
| 11 | Valor frente a referencia y copias con `...` | 12 |

### `js/02-operadores.js` — ~60 min
| Sección | Contenido | Min. |
|---|---|---|
| 1 | Reutilizar `imprimir()` — **ya escrito** | 3 |
| 2 | Aritméticos, `%` y `**` | 10 |
| 3 | El problema de los decimales (`0.1 + 0.2`) | 6 |
| 4 | Asignación compuesta | 7 |
| 5 | `i++` frente a `++i` | 6 |
| 6 | `==` frente a `===` y la tabla calculada | 12 |
| 7 | Relacionales con texto | 4 |
| 8 | Lógicos, cortocircuito, `??` y `?.` | 10 |
| 9 | Operador ternario | 7 |
| 10 | Precedencia | 6 |
| 11 | Truthy y falsy | 8 |

### `js/03-conversion-de-tipos.js` — ~50 min
| Sección | Contenido | Min. |
|---|---|---|
| 1 | `Number()`, `parseInt()`, `parseFloat()` | 12 |
| 2 | `String()` y `.toString()` | 5 |
| 3 | `Boolean()` | 4 |
| 4 | Coerción y los clásicos de internet | 12 |
| 5 | `NaN`, `isNaN()` vs `Number.isNaN()` | 10 |
| 6 | Template literals y HTML generado | 12 |

### `js/04-interaccion.js` — ~45 min
| Sección | Contenido | Min. |
|---|---|---|
| 1 | Por qué son bloqueantes (solo teoría) | 4 |
| 2 | `getElementById` de los 5 elementos | 5 |
| 3 | `alert()` + primer `addEventListener` | 8 |
| 4 | `prompt()`: texto, conversión y validación | 15 |
| 5 | `confirm()` y booleanos | 6 |
| 6 | Botón de limpiar la consola visual | 4 |
| 7 | El mal ejemplo: `onclick` en línea | 5 |
| 8 | Mensaje final | 2 |

**Total aproximado: 3 h 30 min de escritura efectiva**, que encaja con las
3 sesiones que anuncia la portada del proyecto.

## 5. Cómo comparar con la solución

La versión resuelta es **la carpeta padre**. Cada archivo tiene su gemelo:

| Plantilla | Solución |
|---|---|
| `plantilla-clase/js/01-variables-y-tipos.js` | `../js/01-variables-y-tipos.js` |
| `plantilla-clase/js/02-operadores.js` | `../js/02-operadores.js` |
| `plantilla-clase/js/03-conversion-de-tipos.js` | `../js/03-conversion-de-tipos.js` |
| `plantilla-clase/js/04-interaccion.js` | `../js/04-interaccion.js` |

Las secciones están **numeradas igual y en el mismo orden**, así que se pueden
tener los dos archivos abiertos en paralelo (en VS Code: clic derecho sobre la
pestaña → *Split Right*).

Para ver las dos páginas funcionando a la vez, abre en dos pestañas:

- resuelta: `01-fundamentos/index.html`
- plantilla: `01-fundamentos/plantilla-clase/index.html`

El enlace *«la carpeta del proyecto»* del cartel amarillo lleva a la resuelta.

## 6. Reglas de la sesión

1. **No se toca el HTML ni el CSS.** Si algo no se ve, el fallo está en el `.js`.
2. **`F5` después de cada bloque.** La consola visual se reconstruye entera en
   cada recarga; no hay estado que se pierda.
3. **`F12` siempre abierto.** Los colores de `console.warn` y `console.error`
   y las tablas de `console.table` solo se ven ahí.
4. Si algo se rompe, el botón **Limpiar consola** (una vez escrita la sección 6
   del archivo 04) deja la caja negra en blanco sin recargar.
5. La plantilla **no se modifica**: se escribe encima y, al terminar la clase,
   se restaura desde el repositorio para la siguiente sesión.
