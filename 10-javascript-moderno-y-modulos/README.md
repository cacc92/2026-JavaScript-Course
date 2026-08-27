# Proyecto 10 · JavaScript moderno (ES6+) y módulos

Guía docente del décimo proyecto del curso **Full Stack 2 · Desarrollo Front End**.

Este proyecto cierra el bloque de JavaScript puro: repasa a fondo todo lo que el lenguaje incorporó
desde ES2015 y da el salto definitivo a la organización profesional del código con **módulos ES
nativos** (`import` / `export`), sin bundlers, sin Node y sin una sola librería externa.

> ⚠️ **Este proyecto NO se abre con doble clic.** Necesita un servidor local.
> Es la única excepción del curso, y precisamente ese es uno de los contenidos que enseña.
> Lee la sección [Cómo abrir el proyecto](#cómo-abrir-el-proyecto).

---

## Temas cubiertos

### Repaso avanzado de ES6+

- **Declaraciones**: `let`, `const`, `var`, *hoisting*, **zona muerta temporal (TDZ)**, ámbito de
  bloque frente a ámbito de función, el clásico bucle con funciones, `const` no es inmutable,
  `Object.freeze()`.
- **Template literals**: interpolación de expresiones, cadenas multilínea, plantillas anidadas y
  **tagged templates** (plantillas etiquetadas), incluido `String.raw` y una etiqueta que escapa
  HTML para prevenir XSS.
- **Destructuring avanzado**: arrays (huecos, defectos, rest, intercambio de variables), objetos
  (renombrado, defectos, rest), anidamiento, **arrays dentro de objetos**, destructuring en los
  parámetros de una función con valores por defecto y en `for...of`, red de seguridad con `?? {}`.
- **Spread y rest** en todos sus contextos: arrays, objetos, llamadas a funciones, parámetros rest,
  rest en destructuring, iterables (`Set`, strings, `NodeList`) y el aviso clave sobre la **copia
  superficial**.
- **Parámetros por defecto evaluados en tiempo de llamada**: `undefined` sí los activa y `null` no,
  cada llamada obtiene una estructura nueva, un defecto puede depender de parámetros anteriores
  (pero no de los posteriores: hay TDZ también en los parámetros), y `funcion.length`.
- **Encadenamiento opcional `?.`** en sus tres formas (`?.propiedad`, `?.[clave]`, `?.()`) y el
  cortocircuito total.
- **Fusión nula `??`** frente a `||`, con tabla comparativa de valores *falsy* y *nullish*.
- **Operadores lógicos de asignación** `||=`, `&&=`, `??=`, y el detalle del cortocircuito
  (la asignación ni se intenta, lo que importa con *setters*).

### Métodos modernos

`Array.prototype.at`, `findLast`, `findLastIndex`, `flat`, `flatMap`, `toSorted`, `toReversed`,
`with`, `Array.from`, `Object.entries`, `Object.values`, `Object.fromEntries`, `Object.groupBy`
(con comprobación de soporte y plan B con `reduce`), `Object.hasOwn`, `String.replaceAll`,
`trimStart`, `trimEnd`, `padStart`, `padEnd`, `String.at`, `Number.isInteger`, `Number.isFinite`,
`Number.isNaN` frente a los globales antiguos, y `structuredClone()`.

### Iteradores y generadores

- Protocolo **iterable** y protocolo **iterador** (`next()` → `{ value, done }`).
- `Symbol.iterator` implementado **a mano** en un objeto literal y como método generador en una clase.
- Funciones generadoras `function*` y `yield`: **generador de identificadores** y **generador
  infinito de Fibonacci**.
- Delegación con `yield*`, envío de valores con `next(valor)`, cierre anticipado con `return()`,
  evaluación perezosa y un generador recursivo que recorre el temario del curso.

### Números

Separadores numéricos con guion bajo (`1_000_000`, `0b1010_0001`, `0xff_38_bd`, `6.626_070_15e-34`),
`BigInt`, `Number.MAX_SAFE_INTEGER` y el clásico `0.1 + 0.2`.

### Módulos ES (núcleo del proyecto)

- `export` nombrado en línea y en lista final, con renombrado (`export { interno as publico }`).
- `export default` (una sola por archivo) conviviendo con exportaciones nombradas.
- `import { a, b }`, `import { a as otroNombre }`, `import porDefecto`, `import * as espacio`.
- **Importaciones dinámicas** con `import()`, que devuelve una promesa: *code splitting*.
- Diferencias con los scripts clásicos: **ámbito propio**, **modo estricto automático**,
  **carga diferida**, **evaluación única (singleton)** y **enlaces vivos de solo lectura**.
- Declaración en el HTML con `<script type="module">`.
- **Por qué los módulos no funcionan con `file://`** (política CORS) y cómo resolverlo.

---

## Estructura de archivos

```
10-javascript-moderno-y-modulos/
├── index.html                          Página del proyecto (carga js/main.js como módulo)
├── css/
│   └── estilos.css                     Tema oscuro, tokens compartidos, consolas visuales
├── js/
│   ├── main.js                         Punto de entrada (type="module")
│   ├── modulos/
│   │   ├── consola.js                  Consola visual · exportaciones nombradas
│   │   ├── matematicas.js              Estadísticas · export en línea y lista final con `as`
│   │   ├── formato.js                  Moneda, fechas y texto · export default + nombradas
│   │   ├── validaciones.js             Correo y contraseña · un módulo importando a otro
│   │   └── almacen.js                  Estado compartido · patrón singleton
│   └── extras/
│       ├── sintaxis-moderna.js         Temas 1 a 7 y 12
│       ├── metodos-modernos.js         Métodos de Array, Object, String, Number, structuredClone
│       ├── iteradores-y-generadores.js Symbol.iterator, function*, yield
│       └── reporte-avanzado.js         Se carga BAJO DEMANDA con import()
└── README.md                           Este archivo
```

Cada archivo `.js` termina con su propio bloque de **ejercicios propuestos**.

---

## Cómo abrir el proyecto

Los módulos ES están sujetos a la política **CORS** del navegador, que solo admite orígenes
`http://` o `https://`. Con el protocolo `file://` el navegador bloquea todos los `import` y la
página se queda sin contenido dinámico. La propia página detecta esta situación y muestra un aviso
rojo con las instrucciones (ese aviso lo pinta un script **clásico**, no un módulo, precisamente
para que funcione aunque los módulos estén bloqueados).

### Opción A · Live Server en Visual Studio Code (recomendada en clase)

1. Instala la extensión **Live Server** (Ritwick Dey) desde el panel de extensiones.
2. Abre la carpeta `10-javascript-moderno-y-modulos` en VS Code.
3. Clic derecho sobre `index.html` → **Open with Live Server**.
4. El navegador se abre en `http://127.0.0.1:5500/index.html`.

### Opción B · Servidor de Python (sin instalar nada en macOS y Linux)

```bash
cd "10-javascript-moderno-y-modulos"
python3 -m http.server 8000
```

Después abre `http://localhost:8000` en el navegador. Para detenerlo, `Ctrl + C` en la terminal.

### Cómo se ve que funcionó

- El aviso de la parte superior pasa de **rojo** («Los módulos ES todavía no se han cargado») a
  **verde** («Módulos ES cargados correctamente»).
- Todas las consolas visuales aparecen llenas de resultados.
- En la consola del navegador (F12) se leen los mensajes `[nombre.js] Módulo evaluado.`

---

## Orden sugerido para explicarlo en clase

Material pensado para **tres sesiones de 90 minutos**. Los tiempos incluyen la explicación del
docente y la práctica guiada, pero no los ejercicios individuales.

### Sesión 1 · Repaso avanzado de la sintaxis (90 min)

| Bloque | Sección de la página | Tiempo | Notas para el docente |
|---|---|---|---|
| Presentación del proyecto y arranque del servidor local | — | **10 min** | Levanta Live Server delante de la clase y muestra a propósito qué pasa al abrir con doble clic. Ese fracaso controlado enseña más que cualquier explicación. |
| `let`, `const` y la TDZ | 01 | **20 min** | El punto fuerte es el bucle con funciones (`var` da `[3,3,3]`, `let` da `[0,1,2]`). Insiste en que `const` fija la etiqueta, no la caja. |
| Template literals y tagged templates | 02 | **15 min** | Empieza por la interpolación (ya conocida) y dedica el tiempo real a las etiquetas. La demostración de `seguroHTML` conecta con seguridad web. |
| Destructuring avanzado | 03 | **25 min** | El bloque más denso. Ve despacio en «arrays dentro de objetos»: es el patrón que verán al consumir APIs. |
| Spread y rest | 04 | **20 min** | Fija la regla: rest empaqueta, spread desempaqueta. Reserva 5 minutos completos para la copia superficial. |

### Sesión 2 · Operadores modernos, métodos y generadores (90 min)

| Bloque | Sección de la página | Tiempo | Notas para el docente |
|---|---|---|---|
| Repaso rápido de la sesión anterior | 01–04 | **5 min** | Pulsa «Ejecutar todas las demostraciones» y recorre las consolas. |
| Parámetros por defecto | 05 | **10 min** | La idea clave: se evalúan en cada llamada. Compara con Python si algún estudiante lo conoce. |
| `?.` y `??` | 06 | **15 min** | Proyecta la tabla comparativa `\|\|` frente a `??`. El ejemplo del descuento 0 se les queda grabado. |
| `\|\|=`, `&&=`, `??=` | 07 | **10 min** | Cierra con el caso real de agrupar con `??=`: es el que van a usar de verdad. |
| Métodos de Array y Object | 08 | **20 min** | `flatMap` como `filter` + `map` y la pareja `entries` / `fromEntries` son lo más rentable. |
| String, Number y `structuredClone` | 09 | **10 min** | `padStart`/`padEnd` con el menú de la cafetería se entiende de inmediato. |
| Iterables y `Symbol.iterator` | 10 | **10 min** | Ejecuta el iterador a mano con `next()` antes de mostrar `for...of`. |
| Generadores | 11 | **10 min** | El Fibonacci infinito que no cuelga el navegador es el momento «wow» de la unidad. |

### Sesión 3 · Módulos ES (90 min)

| Bloque | Sección de la página | Tiempo | Notas para el docente |
|---|---|---|---|
| Separadores numéricos | 12 | **5 min** | Bloque corto, sirve de calentamiento. |
| Qué es un módulo y cómo se declara | 13 | **20 min** | Recorre la tabla comparativa entera. Enlázalo con las IIFE de los proyectos anteriores: ahora sobran. |
| Las cinco formas de importar y exportar | 13 | **20 min** | Abre los cinco archivos de `js/modulos/` en pestañas y señala cada forma en su archivo real. |
| El módulo como singleton | 14 | **15 min** | Abre F12 y muestra que `[almacen.js] Módulo evaluado 1 vez` aparece una sola vez. Después pulsa «Ver el estado del almacén». |
| `import()` dinámico y *code splitting* | 15 | **15 min** | Con la pestaña **Red** de F12 abierta: recarga (no aparece el archivo), pulsa el botón (aparece), vuelve a pulsar (ya no aparece). |
| Caja de herramientas | 16 | **10 min** | Recorre las cuatro herramientas señalando de qué módulo viene cada resultado. |
| Cierre y ejercicios | 17 | **5 min** | Reparte los seis retos integradores. |

---

## Ejercicios propuestos

### Retos integradores (sección 17 de la página)

1. **Módulo de conversiones.** Crear `js/modulos/conversiones.js` con exportaciones nombradas
   (kilómetros a millas, Celsius a Fahrenheit, kilos a libras) y una exportación por defecto que
   convierta según una unidad recibida. Añadirlo como quinta herramienta de la caja.
2. **Generador de paginación.** `function* paginar(lista, tamano)` que entregue bloques de N
   elementos, con un botón «siguiente página».
3. **Iterable propio.** Hacer iterable el almacén implementando `[Symbol.iterator]` para recorrer
   sus eventos del más reciente al más antiguo.
4. **Carga dinámica por selección.** Un `<select>` y un botón que ejecuten
   `await import(\`./extras/${elegido}.js\`)`. Discutir el riesgo de construir rutas de importación
   con datos del usuario.
5. **Informe con tagged template.** La etiqueta `informe` que formatee números como moneda, fechas
   con `formatearFecha` y arrays con `join(', ')`.
6. **Refactor completo.** Convertir un proyecto anterior del curso (scripts clásicos con IIFE) a
   módulos ES y documentar qué IIFE dejaron de ser necesarias y por qué.

### Ejercicios por archivo

- **`js/modulos/consola.js`** — `imprimirTabla()` con `padEnd`; `contarLineas()`; resumen de arrays
  largos en `describir()`; modo con marca de tiempo; convertir la API en `export default`.
- **`js/modulos/matematicas.js`** — `moda()`; `notasSobre()` con `findLast`; `aplicarCurva()` sin
  mutar; constante `ESCALAS` y `convertirEscala()`; `percentil()` por interpolación lineal.
- **`js/modulos/formato.js`** — `formatearLista()` con `Intl.ListFormat`; etiqueta `mayusculas`;
  `tiempoDeLectura()`; estilo `'iso'` en `formatearFecha`; etiqueta `tabla` con anchos calculados.
- **`js/modulos/validaciones.js`** — `validarTelefono()`; puntos extra por variedad de caracteres;
  `validarConfirmacion()`; validar un objeto de matrícula completo; validadores currificados.
- **`js/modulos/almacen.js`** — `resumenPorTipo()` con `reduce` y con `Object.groupBy`; comprobar el
  singleton con un `import()` dinámico; `exportarJSON()`; `Object.freeze()`; sistema de suscripciones.
- **`js/extras/sintaxis-moderna.js`** — `resumirPedido()` solo con destructuring; etiqueta `notas`;
  folio con año; `obtenerValor(objeto, ruta, porDefecto)` con `reduce` y `?.`; `Object.groupBy`
  frente a `??=` medido con `performance.now()`.
- **`js/extras/metodos-modernos.js`** — pares `[estudiante, asignatura]` con `flatMap`;
  `resumenDeInventario()`; `formatearRecibo()`; comparar `structuredClone` con el truco del JSON;
  `aplanarProfundo()` recursivo.
- **`js/extras/iteradores-y-generadores.js`** — `contarAtras()`; `zip()`;
  `crearRangoDescendente()` como generador; `numerosPrimos()` infinito; `porGrupos(tamano)`.
- **`js/extras/reporte-avanzado.js`** — tiempo medio entre eventos; `exportarReporteComoTexto()`;
  cargar el módulo desde la consola con `await import()`; segundo módulo dinámico anidado;
  medir la diferencia entre el primer y el segundo `import()`.
- **`js/main.js`** — quinta herramienta; cambiar `import * as` por importaciones nombradas;
  recordar la moneda en `localStorage`; carga dinámica según un `<select>`; `iniciar()` asíncrona
  con `Promise.all`.

---

## Errores comunes que el docente debe advertir

### Sobre módulos (los más caros)

| Error | Qué pasa | Solución |
|---|---|---|
| Abrir `index.html` con doble clic | Los `import` fallan por CORS y la página no hace nada | Servidor local (Live Server o `python3 -m http.server`) |
| `import { x } from './modulos/almacen'` | Error 404: falta la extensión | En el navegador la extensión **`.js` es obligatoria** |
| `import { x } from 'modulos/almacen.js'` | El navegador lo lee como nombre de paquete y falla | Empezar siempre por `./` o `../` |
| Olvidar `type="module"` en el `<script>` | `SyntaxError: Cannot use import statement outside a module` | `<script type="module" src="js/main.js"></script>` |
| Dos `export default` en un archivo | Error de sintaxis | Solo puede haber **una** exportación por defecto |
| `import { formatearMoneda }` cuando es `export default` | El import es `undefined` | Sin llaves para la exportación por defecto |
| Esperar que `import()` devuelva la función directamente | Devuelve el espacio de nombres | Hay que escribir `modulo.default` de forma explícita |
| Envolver el código en `DOMContentLoaded` «por si acaso» | Innecesario, y el evento puede haberse disparado ya | Los módulos ya se cargan diferidos |
| Seguir usando IIFE | Ruido inútil | Los módulos ya tienen ámbito propio |
| Creer que el módulo se ejecuta una vez por cada `import` | Se evalúa **una sola vez** y se cachea | Es la base del patrón singleton |

### Sobre la sintaxis moderna

| Error | Qué pasa | Solución |
|---|---|---|
| Leer una `const` antes de declararla | `ReferenceError` (TDZ), no `undefined` | Declarar arriba; la TDZ existe también en los parámetros |
| Creer que `typeof` «nunca falla» | Dentro de la TDZ **sí lanza** `ReferenceError` | Solo es seguro con variables no declaradas |
| Creer que `const` congela el objeto | El contenido sí se puede modificar | `Object.freeze()` (y solo un nivel) |
| Usar `\|\|` para valores por defecto | Un `0` o un `''` válidos se pierden | Usar `??`, que solo salta con `null`/`undefined` |
| Mezclar `??` con `\|\|` o `&&` sin paréntesis | `SyntaxError` | Poner paréntesis explícitos |
| Creer que `?.` protege de variables no declaradas | Lanza `ReferenceError` igual | `?.` protege del valor `null`/`undefined`, no de la declaración |
| Creer que el spread copia en profundidad | Los objetos anidados se comparten | `structuredClone()` |
| Pasar `null` esperando el valor por defecto | Solo `undefined` activa el defecto | Comprobar con `??` dentro de la función |
| `notas[-1]` para el último elemento | Devuelve `undefined` | `notas.at(-1)` |
| `sort()` sin comparador | Ordena como texto: `[10, 100, 9]` | `sort((a, b) => a - b)`, y sobre una copia |
| `replace()` esperando cambiar todas | Solo cambia la primera | `replaceAll()` |
| `replaceAll()` con regex sin `/g` | `TypeError` | Añadir la bandera global |
| `toFixed()` esperando un número | Devuelve un **string** | `Number(valor.toFixed(2))` |
| `isNaN('hola')` | Convierte tipos y confunde | `Number.isNaN()`, `Number.isFinite()`, `Number.isInteger()` |
| `[...fibonacci()]` | Cuelga la pestaña: el generador es infinito | Usar un ayudante `tomar(iterable, n)` |
| Reutilizar un generador agotado | Devuelve un array vacío | Llamar de nuevo a la función generadora |
| Enviar un valor en el **primer** `next()` | Se pierde: ese `next()` solo arranca el generador | Enviar valores a partir del segundo |
| `for...of` sobre un objeto plano | `TypeError`: no es iterable | `Object.entries(objeto)` |
| `Math.max(arrayDeNotas)` | Devuelve `NaN` | `Math.max(...arrayDeNotas)` |
| `new Date('2026-03-15')` | Se interpreta como UTC y puede mostrar el día anterior | `new Date(anio, mes - 1, dia)` |
| Usar `Object.groupBy` sin comprobar soporte | Falla en navegadores anteriores a 2024 | Comprobar y tener plan B con `reduce` |
| `structuredClone()` con funciones dentro | `DataCloneError` | No clona funciones, nodos del DOM ni símbolos |

---

## Comprobaciones rápidas antes de clase

1. El servidor local está levantado y `http://localhost:8000` responde.
2. El aviso superior está en **verde**.
3. La consola del navegador (F12) no muestra ningún error en rojo.
4. `[almacen.js] Módulo evaluado 1 vez` aparece **una sola vez**.
5. La pestaña **Red** no incluye `reporte-avanzado.js` hasta pulsar el botón de la sección 15.
