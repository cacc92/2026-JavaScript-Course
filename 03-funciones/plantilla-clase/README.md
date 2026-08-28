# 03 · Funciones a fondo — Plantilla de clase

Versión del proyecto **preparada para escribir el JavaScript en vivo** delante de los
estudiantes. La maqueta ya está montada; lo único que falta es el código, y ese es
justamente el material de la clase.

La versión **resuelta** está en la carpeta padre: `../index.html`.

---

## 1. Para qué sirve esta carpeta

Explicar funciones tecleando también el HTML y el CSS consume la mitad de la sesión y
distrae del tema. Aquí el reparto es claro:

| Ya viene hecho | Se escribe en vivo |
|---|---|
| `index.html` completo: todos los elementos, ids y clases | El cuerpo de cada archivo de `js/` |
| `css/estilos.css` completo | — |
| Toda la teoría en prosa dentro de los `.js` | — |
| Los avisos ⚠️ ERROR COMÚN y ✅ BUENA PRÁCTICA | — |
| Los separadores de sección numerados | — |
| `js/00-utilidades.js` entero (`imprimir`, `titulo`) | — |
| Los datos de partida (notas, catálogo de productos, árbol de categorías) | — |
| La IIFE que envuelve cada archivo | — |
| Los bloques de EJERCICIOS PROPUESTOS | — |

En el sitio del código hay instrucciones con este formato:

```js
// TODO (en clase):
//   1. Escribe function calcularPromedio(notas) ...
//   Resultado esperado en pantalla: Promedio de Ana: 8.17
//   (aprox. 14 líneas)
```

Cada TODO dice **el nombre exacto** de las variables y funciones, **el id** del elemento
del DOM con el que hay que trabajar y **la salida esperada**, para que lo escrito en
directo coincida línea por línea con la solución. El número de líneas aproximado sirve
para calcular el tiempo sobre la marcha.

---

## 2. La página arranca vacía a propósito

Abre `index.html` con doble clic. Verás la maqueta completa, el aviso amarillo de MODO
CLASE, y **todas las consolas negras vacías**. Eso es lo correcto: todavía no se ha
escrito nada.

Comprobación importante antes de empezar: pulsa **F12** y mira la pestaña *Console*.
**No debe haber ni un solo error.** Los archivos `.js` son JavaScript válido aunque estén
compuestos casi por completo de comentarios. Si aparece un error rojo antes de escribir
nada, algo se ha tocado por accidente.

Lo único que ya funciona desde el minuto cero es el andamiaje de
`js/00-utilidades.js`: en cuanto escribas la primera línea con `imprimir('hola')`,
aparecerá en la consola visual de esa sección.

---

## 3. Orden recomendado y minutos por sección

Tres sesiones de unos 100 minutos, más una de refuerzo. Los tiempos incluyen escribir el
código en directo y la práctica guiada.

### Sesión A — Fundamentos de la función (100 min)

| Min | Archivo · sección | Qué se escribe |
|---|---|---|
| 10 | `01` · 1 | El cálculo repetido tres veces. Preguntar qué pasa si mañana cambia la fórmula |
| 10 | `01` · 1b | `calcularPromedio(notas)`: la misma lógica, un solo sitio |
| 15 | `01` · 2 | Declaración de función. Llamarla ANTES de escribirla: hoisting |
| 15 | `01` · 3 | Expresión de función. Provocar el `ReferenceError` en directo |
| 10 | `01` · 4 | `return`, salida temprana y funciones que devuelven `undefined` |
| 20 | `01` · 5 | Flechas: los tres pasos de la forma larga a la corta, y las trampas |
| 15 | `01` · 6-7 | Array y objeto de funciones. Enlazar con la calculadora de la sección 7 |

### Sesión B — Datos que entran y ámbito (100 min)

| Min | Archivo · sección | Qué se escribe |
|---|---|---|
| 10 | `02` · 1-2 | `matricular()` y `matricularSeguro()`. Faltan y sobran argumentos |
| 15 | `02` · 3 | `generarCarnet()`. Insistir en que `null` no activa el defecto |
| 20 | `02` · 4-5 | `sumarTodo(...numeros)` y spread. El truco "definición agrupa, llamada reparte" |
| 10 | `02` · 6 | `arguments` como pieza de museo, y la flecha confundida |
| 10 | `02` · 7-8 | `crearProducto({...})` y el carrito que se modifica solo |
| 25 | `03` · 1-3 | Ámbito global, de función y de bloque. **El bucle clásico con `var`** |
| 10 | `03` · 4-5 | Cadena de ámbitos y shadowing (escuela / aula / pupitre) |

### Sesión C — Closures, orden superior y recursión (110 min)

| Min | Archivo · sección | Qué se escribe |
|---|---|---|
| 25 | `03` · 6-6b | **Closures.** `crearContador()` y `crearMultiplicador()`. No correr aquí |
| 10 | `03` · 6c | Cuenta bancaria privada, memoización y patrón "una sola vez" |
| 10 | `03` · 7 | IIFE y `ModuloEstudiantes`. Conectar con la IIFE de todos los archivos |
| 20 | `04` · 1-3 | `miMap`, `miFilter` y `miReduce` en la pizarra antes que en el teclado |
| 10 | `04` · 4-6 | Validadores a medida, `componer()` y el `setTimeout` que sorprende |
| 20 | `05` · 2-4, 7 | Conteo regresivo, factorial, Fibonacci y la demo interactiva |
| 15 | `07` | Calculadora y contador. Pulsar "Intentar espiar la variable" |

### Sesión de refuerzo opcional (45 min)

| Min | Archivo · sección | Qué se escribe |
|---|---|---|
| 25 | `06` · 1-3 | `this` en función normal vs flecha, y el callback que lo pierde |
| 20 | `06` · 4-6 | Funciones puras, efectos secundarios e inmutabilidad |

> **Consejo de ritmo:** los closures y `this` son los dos temas que más se atragantan.
> Si hay que recortar, recorta en `arguments` (`02` · 6) y en composición (`04` · 5),
> nunca en closures.

Las secciones 5 y 6 de `05-recursion.js` (desbordamiento de pila y árbol de categorías)
son un buen extra si la sesión va sobrada: la del árbol se escribe en cinco minutos
porque los datos ya están puestos.

---

## 4. Cómo comparar con la solución

Ten los dos archivos abiertos en paralelo, en dos pestañas del editor:

```
03-funciones/js/01-declaracion-y-tipos.js                  <- solución
03-funciones/plantilla-clase/js/01-declaracion-y-tipos.js  <- lo que se escribe en clase
```

Las **secciones están numeradas igual y en el mismo orden** en los dos archivos, así que
saltar de uno a otro es inmediato. Cada `// TODO (en clase):` de la plantilla sustituye
exactamente al código que hay en ese punto de la solución.

Para abrir la página resuelta desde el navegador, el aviso amarillo de MODO CLASE tiene
un enlace directo a `../index.html`.

Si algo no sale, la comparación rápida desde la terminal es:

```
diff "js/01-declaracion-y-tipos.js" "plantilla-clase/js/01-declaracion-y-tipos.js"
```

---

## 5. Estructura de esta carpeta

```
plantilla-clase/
├── index.html                        Maqueta COMPLETA (idéntica a la solución)
├── README.md                         Esta guía
├── css/
│   └── estilos.css                   COMPLETO + reglas del aviso de modo clase
└── js/
    ├── 00-utilidades.js              COMPLETO: imprimir() y titulo() ya funcionan
    ├── 01-declaracion-y-tipos.js     TODOs: DRY, declaración, expresión, hoisting, flechas
    ├── 02-parametros.js              TODOs: defecto, rest, spread, arguments, objetos
    ├── 03-scope-y-closures.js        TODOs: scope, shadowing, closures, IIFE, módulo
    ├── 04-callbacks-y-orden-superior.js  TODOs: callbacks, map/filter/reduce, composición
    ├── 05-recursion.js               TODOs: factorial, Fibonacci, árboles, demo
    ├── 06-this-y-pureza.js           TODOs: this, call/apply/bind, funciones puras
    └── 07-demos-interactivas.js      TODOs: calculadora y contador con closure
```

Sin Node, sin npm, sin librerías, sin CDNs y sin conexión a internet. Doble clic y listo.

---

## 6. Recordatorios para el docente

- **No se toca el HTML ni el CSS durante la clase.** Si algo no aparece en pantalla, el
  fallo está en el JavaScript, no en la maqueta.
- **Los ids ya existen.** Cuando un TODO dice `#calc-operador`, ese elemento está en el
  HTML esperando. El `<select>` está vacío a propósito: lo rellena `rellenarSelector()`.
- **Escribe los TODO en orden dentro de cada archivo.** Algunas secciones reutilizan lo
  anterior: `sumarTodo()` de la sección 4 de `02` se usa en la 5; `fibonacci()` y
  `crearFibonacciMemoizado()` de `05` los usa la demo interactiva de ese mismo archivo.
- **Deja los ejercicios propuestos donde están.** Son la práctica del final y ya vienen
  escritos.
- **Si te quedas sin tiempo**, borra el TODO a medias antes de guardar: un bloque de
  código incompleto sí rompe la página, mientras que un comentario nunca lo hace.
