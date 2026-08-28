# Proyecto 04 · Arrays y métodos funcionales — Plantilla de clase

Versión del proyecto 04 preparada para **escribir el JavaScript en vivo** delante de los
estudiantes, sin perder tiempo montando el HTML ni el CSS.

Abre `index.html` directamente en el navegador (doble clic). No hace falta servidor,
ni Node, ni npm, ni ninguna librería.

---

## 1. Para qué sirve esta carpeta

La carpeta padre (`../`) contiene el proyecto **resuelto**: es la solución de referencia y
no se toca. Esta subcarpeta es la misma página con el JavaScript vaciado.

| Parte | Estado en la plantilla |
|---|---|
| `index.html` | **Hecho.** Misma maqueta, mismos ids y clases que la solución. |
| `css/estilos.css` | **Hecho.** Copia exacta del final + el estilo del cartel "MODO CLASE". |
| `js/*.js` | **Por escribir.** Teoría y comentarios intactos; el código es un `TODO`. |

Dentro de los `.js` **sí vienen ya escritos**, porque son andamiaje y no materia:

- `formatear()`, `imprimir()` y `titulo()` — la "consola visual" de cada sección.
  Sin ellas no se puede demostrar nada en pantalla desde el primer minuto.
- La **IIFE** `(function () { ... })();` que envuelve cada archivo, con su comentario.
  Es lo que evita el `Identifier 'notas' has already been declared` entre los cinco archivos.
- Los **datos de partida**: `materias` e `inventario` (02), `ventas` y `notasParciales` (03),
  `participantes` (04), y `ESTUDIANTES` con las constantes `NOTA_APROBACION` /
  `NOTA_DESTACADA` (05). Teclear datos en clase es tiempo perdido; lo que se escribe
  en vivo es la lógica que los procesa.

---

## 2. La página arranca VACÍA a propósito

Al abrir la plantilla verás la maqueta completa, los bloques oscuros de consola sin
una sola línea y la sección 5 con el texto *"Cargando datos..."*, el desplegable de cursos
vacío y sin tabla.

**Eso es exactamente lo esperado.** No es un fallo.

La regla de oro de esta plantilla es que se abre **sin ningún error en la consola del
navegador** aunque no se haya escrito todavía nada: los archivos `.js` son JavaScript
válido compuesto casi por completo de comentarios. Merece la pena abrir <kbd>F12</kbd>
delante de la clase el primer minuto para enseñar la consola limpia, y volver a mirarla
según se va escribiendo.

---

## 3. Cómo se lee un bloque TODO

Cada trozo de código sustituido tiene esta forma:

```js
// TODO (en clase):
//   1. Declara const notas = [7, 9, 5, 10, 6].
//   2. Imprime notas.at(-1) y notas.at(-2) para comparar legibilidad.
//   Resultado esperado en pantalla:
//     notas.at(-1) -> 6   /   notas.at(-2) -> 10
//   (aprox. 12 líneas)
```

- Los pasos numerados dicen el **nombre exacto** de variables y funciones, y el **id**
  del elemento del DOM cuando hay que tocar la página. Sirven de guion de pizarra.
- *Resultado esperado* es lo que debe aparecer en el bloque oscuro. Si no coincide,
  algo se escribió distinto.
- *(aprox. N líneas)* es lo que ocupa en la solución: úsalo para calcular el tiempo.

---

## 4. Orden recomendado y minutos por sección

Los cinco archivos se cargan con `defer` y en orden, así que conviene seguirlo.

### `js/01-basicos-y-mutadores.js` — ~45 min

| Sección | Contenido | Min. |
|---|---|---|
| 1 | Qué es un array, literal vs `new Array`, `Array.isArray` | 8 |
| 2 | Índices desde 0, `length`, `at()`, huecos | 8 |
| 3 | Matrices y bucles anidados | 10 |
| 4 | Mutadores: `push`/`pop`, `shift`/`unshift`, `splice`, `reverse`, `fill`, `sort` | 12 |
| 5 | No mutadores: `slice`, `concat`, `join`, `flat`, `flatMap`, `toReversed` | 12 |

### `js/02-busqueda-y-comprobacion.js` — ~40 min

| Sección | Contenido | Min. |
|---|---|---|
| 1-2 | `indexOf`, `lastIndexOf`, `includes` y el error del `if` sin `=== -1` | 10 |
| 3 | `find`, `findIndex`, `findLast`, `findLastIndex` y el `?.` | 10 |
| 4 | `some` / `every`, la verdad vacua y el `return` olvidado | 8 |
| 5 | `forEach`, por qué no admite `break`, y las tres alternativas | 14 |

### `js/03-map-filter-reduce.js` — ~60 min (el corazón del tema)

| Sección | Contenido | Min. |
|---|---|---|
| 1 | `map`: transformar, extraer propiedades, `map` + `join` | 12 |
| 2 | `filter`: seleccionar, `filter(Boolean)`, `filter` vs `find` | 10 |
| 3 | `reduce` paso a paso **con la tabla de iteraciones en la pizarra** | 15 |
| 4 | Los cuatro usos clásicos: sumar, máximo, agrupar, contar | 15 |
| 5-6 | `reduceRight` y el encadenamiento como tubería de datos | 10 |

### `js/04-ordenar-y-destructuring.js` — ~50 min

| Sección | Contenido | Min. |
|---|---|---|
| 1 | `sort` sin comparador y el comparador `a - b` / `b - a` | 12 |
| 2 | Ordenar objetos y el desempate por dos criterios | 8 |
| 3 | `localeCompare` con acentos, `sensitivity` y `numeric` | 8 |
| 4 | Destructuring: saltos, defaults, rest, intercambio | 10 |
| 5 | Spread y **copia superficial vs profunda** | 8 |
| 6-7 | `Array.from` / `Array.of` y `Set` para duplicados | 8 |

### `js/05-analizador-calificaciones.js` — ~60-75 min (proyecto)

| Sección | Contenido | Min. |
|---|---|---|
| 1.b-1.d | Estado, catálogo de `FILTROS` y de `ORDENES` | 10 |
| 2-3 | Referencias al DOM con su red de seguridad, `escaparHtml`, `estaAprobado` | 10 |
| 4 | `obtenerListaVisible()` y `calcularEstadisticas()` | 20 |
| 5 | `construirTabla`, `construirEstadisticas`, `construirPanelCursos`, `actualizarVista` | 25 |
| 6 | `poblarSelectorCursos`, delegación de eventos y arranque | 15 |

Consejo: si el tiempo aprieta, la sección 5 admite un corte natural. Escribe hasta
`actualizarVista()` con la tabla funcionando y deja las tarjetas de estadísticas y el
panel de cursos como trabajo guiado.

---

## 5. Cómo comparar con la solución

La versión resuelta está en la **carpeta padre**, con los mismos nombres de archivo y
las mismas secciones numeradas en el mismo orden. Lo cómodo es tener los dos abiertos
en paralelo en el editor:

```
04-arrays/js/03-map-filter-reduce.js                  <- solución
04-arrays/plantilla-clase/js/03-map-filter-reduce.js  <- lo que se escribe en vivo
```

Desde la propia página, el cartel **MODO CLASE** de arriba enlaza a la versión resuelta.

Para ver las diferencias desde la terminal:

```sh
cd "04-arrays"
diff js/03-map-filter-reduce.js plantilla-clase/js/03-map-filter-reduce.js
```

---

## 6. Recordatorios para el aula

- Abre <kbd>F12</kbd> desde el principio: todo lo que se imprime en los bloques oscuros
  va también a la consola, y en la sección 5 se usa `console.table()`.
- Cada archivo escribe en **su propio** `<pre>`: `salida-1` … `salida-4`. Si no aparece
  nada en un bloque, probablemente se está imprimiendo desde el archivo equivocado.
- Los errores que se demuestran a propósito (el `TypeError` de `reduce` sobre array
  vacío, `Math.max(array)` dando `NaN`, `map(parseInt)`) están controlados con
  `try/catch` o son valores inofensivos: no rompen la página.
- Si algo se rompe a mitad de clase, recarga con <kbd>Ctrl</kbd>+<kbd>F5</kbd>: la página
  no guarda estado en ningún sitio.
