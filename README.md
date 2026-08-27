# Curso de JavaScript — Full Stack 2 (Desarrollo Front End)

Material didáctico completo: **11 proyectos progresivos**, de lo más básico a lo más complejo.
Todo el código está **comentado línea por línea en español** para poder explicarlo en clase y para
que el estudiante pueda releerlo solo en casa.

> **Punto de entrada:** abre `index.html` (en esta misma carpeta) para ver el índice visual del curso.

---

## Filosofía del material

| Principio | Cómo se aplica |
|---|---|
| **Sin dependencias** | JavaScript puro. Ni npm, ni frameworks, ni CDNs. Nada que instalar. |
| **Todo se ve en pantalla** | Cada proyecto incluye una *consola visual* en la página, para que el resultado se proyecte sin abrir DevTools. |
| **Comentar el concepto, no el código** | Los comentarios explican *por qué*, con analogías, no repiten lo que la línea ya dice. |
| **Errores comunes marcados** | `// ⚠️ ERROR COMÚN:` señala el fallo que el estudiante va a cometer en ese punto exacto. |
| **Teoría + práctica en la misma página** | Cada proyecto cierra con una mini-aplicación que usa los temas de esa sesión. |
| **Autonomía** | Cada carpeta es independiente: se puede repartir, copiar o subir suelta sin que se rompa. |

---

## Temario y proyectos

### Nivel 1 — Bases del lenguaje

| # | Proyecto | Contenidos |
|---|---|---|
| 01 | [Fundamentos](01-fundamentos/) | Formas de incluir JS, `console`, `var`/`let`/`const`, tipos primitivos, `typeof`, valor vs referencia, conversión y coerción, `NaN`, todos los operadores, `==` vs `===`, ternario, cortocircuito, template literals, truthy/falsy |
| 02 | [Control de flujo](02-control-de-flujo/) | `if`/`else if`/`else`, `switch` y el *fall-through*, `for`, `while`, `do...while`, `for...of`, `for...in`, `break`/`continue`, bucles anidados, bucles infinitos |
| 03 | [Funciones](03-funciones/) | Declaración vs expresión, *hoisting*, arrow functions, parámetros por defecto, `rest`/`spread`, ámbito, *shadowing*, **closures**, callbacks, funciones de orden superior, recursión, IIFE, funciones puras |

### Nivel 2 — Estructuras de datos

| # | Proyecto | Contenidos |
|---|---|---|
| 04 | [Arrays](04-arrays/) | Métodos mutadores vs no mutadores, búsqueda, `some`/`every`, **`map`/`filter`/`reduce`**, encadenamiento, `sort` con comparador, destructuring, `Array.from`, `Set` para duplicados |
| 05 | [Objetos](05-objetos/) | Propiedades y métodos, `this`, `Object.keys/values/entries`, `freeze`, destructuring avanzado, copia superficial vs profunda, `?.`, `??`, **JSON**, `Map` y `Set` |

### Nivel 3 — JavaScript en el navegador

| # | Proyecto | Contenidos |
|---|---|---|
| 06 | [DOM](06-dom/) | El árbol de nodos, selectores, `textContent` vs `innerHTML` (y XSS), atributos y `dataset`, `classList`, estilos, crear/insertar/eliminar nodos, navegación del árbol, `DocumentFragment` |
| 07 | [Eventos y formularios](07-eventos-y-formularios/) | `addEventListener`, objeto `event`, `target` vs `currentTarget`, `preventDefault`, propagación y **delegación**, teclado y ratón, `submit`/`input`/`change`, validación, `localStorage` |

### Nivel 4 — JavaScript avanzado

| # | Proyecto | Contenidos |
|---|---|---|
| 08 | [POO](08-poo/) | Los 4 pilares, funciones constructoras y `new`, **prototipos**, `class`, getters/setters, `static`, campos privados `#`, `extends`/`super`, polimorfismo, composición, `this` perdido, `call`/`apply`/`bind` |
| 09 | [Asincronía](09-asincronia/) | Hilo único, **event loop**, micro vs macrotareas, `setTimeout`, *callback hell*, **promesas**, `then`/`catch`/`finally`, **`async`/`await`**, `Promise.all`/`allSettled`/`race`/`any`, **`fetch`**, estados de UI |
| 10 | [JS moderno y módulos](10-javascript-moderno-y-modulos/) | TDZ, tagged templates, destructuring avanzado, `??=`/`\|\|=`/`&&=`, métodos modernos, iterables, **generadores**, **`import`/`export`**, `import()` dinámico |

### Cierre

| # | Proyecto | Contenidos |
|---|---|---|
| 11 | [Proyecto final: TechStore](11-proyecto-final/) | Integra todo: catálogo, carga asíncrona simulada, buscador en vivo, filtros y ordenamiento, carrito con clases, control de stock, checkout validado, `localStorage`, `Intl.NumberFormat` |

---

## Cómo abrir los proyectos

**Proyectos 01–08 y 11** → doble clic en su `index.html`. Funcionan directamente con `file://`.

**Proyectos 09 y 10** → necesitan un **servidor local**:

- Con VS Code: instala la extensión **Live Server**, clic derecho sobre `index.html` → *Open with Live Server*.
- Sin VS Code, desde la terminal y dentro de la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

y abre `http://localhost:8000`.

> El proyecto 10 usa `<script type="module">`, y los módulos ES están bloqueados por la política CORS
> cuando se abren con `file://`. El proyecto 09 funciona con `file://`, pero `fetch` caerá a su modo
> de datos simulados; con servidor local consume la API real.

---

## Estructura de cada proyecto

Cada proyecto viene **por duplicado**: la versión resuelta y la plantilla para desarrollar en clase.

```
NN-nombre-del-proyecto/
├── index.html              VERSIÓN RESUELTA · página con teoría + práctica
├── css/
│   └── estilos.css         estilos comentados
├── js/
│   ├── 01-tema.js          un archivo por tema, en orden de explicación
│   ├── 02-tema.js
│   └── ...
├── README.md               guía docente: temas, tiempos, ejercicios, errores comunes
│
└── plantilla-clase/        PARA DICTAR LA CLASE
    ├── index.html          COMPLETO — misma maqueta, mismos ids y clases
    ├── css/estilos.css     COMPLETO — copia exacta del resuelto
    ├── js/
    │   ├── 01-tema.js      POR COMPLETAR — teoría intacta, código como TODO
    │   └── ...
    └── README.md           orden de los archivos y minutos por sección
```

### Las dos versiones

| | Versión resuelta (raíz) | Plantilla de clase |
|---|---|---|
| HTML | Completo | **Completo** — idéntico, con un aviso "MODO CLASE" |
| CSS | Completo | **Completo** — copia exacta |
| JavaScript | Completo y comentado | **Por escribir** — secciones y explicaciones intactas, código como `// TODO (en clase):` |
| Para qué sirve | Referencia mientras explicas y solución para entregar | Escribir el código en vivo delante de los estudiantes |

Los `TODO` son instrucciones de pizarra, no enunciados vagos: indican el nombre exacto de la variable,
el id del elemento del DOM con el que trabajar, la salida esperada en pantalla y cuántas líneas ocupa
en la solución, para que puedas calcular el tiempo de cada bloque.

```js
// ============================================================
// 3. OPERADORES DE COMPARACIÓN:  ==  vs  ===
// ============================================================
// == compara valores convirtiendo tipos antes (coerción).
// === compara valor Y tipo, sin convertir nada.

// TODO (en clase):
//   1. Compara 5 == '5' y 5 === '5', guardando cada resultado.
//   2. Imprime ambos con imprimir() para que se vean en pantalla.
//   Resultado esperado:  5 == '5'  ->  true   |   5 === '5'  ->  false
//   (aprox. 4 líneas)
```

Se dejan **ya escritos** en la plantilla: la función `imprimir()` de la consola visual, las IIFE de
envoltura y los arrays de datos de partida. Teclear eso en clase es tiempo perdido; lo que se escribe
en vivo es la lógica.

La plantilla **arranca con la página vacía y sin ningún error de consola**: eso es lo esperado, se va
llenando conforme escribes el código.

---

## Convenciones de comentarios

```js
// ============================================================
// 3. OPERADORES DE COMPARACIÓN
// ============================================================
// Bloque en prosa que explica el concepto antes del código.

console.log(2 + '2');   // "22"  -> el + con string CONCATENA, no suma

// ⚠️ ERROR COMÚN: usar == en lugar de === produce comparaciones sorprendentes.
// ✅ BUENA PRÁCTICA: usa siempre === salvo que necesites la conversión a propósito.
```

Al final de cada archivo hay un bloque **EJERCICIOS PROPUESTOS** con retos de dificultad creciente
(solo el enunciado, sin la solución) para dejar como práctica.

---

## Planificación sugerida

| Sesión | Proyectos | Enfoque |
|---|---|---|
| 1–2 | 01, 02 | Sintaxis y lógica. Mucha práctica en la consola. |
| 3 | 03 | Funciones. Insistir en *scope* y *closures*. |
| 4–5 | 04, 05 | Datos. `map`/`filter`/`reduce` necesitan tiempo extra. |
| 6–7 | 06, 07 | La parte que "se ve". Aquí sube la motivación del grupo. |
| 8 | 08 | POO. Prototipos primero, `class` después. |
| 9–10 | 09 | Asincronía. El event loop merece una sesión propia. |
| 11 | 10 | Módulos y sintaxis moderna. Preparación para frameworks. |
| 12+ | 11 | Proyecto final guiado y luego autónomo. |

Cada `README.md` de proyecto incluye su propio desglose de tiempos por bloque.
