# 08 · Programación Orientada a Objetos — **Plantilla de clase**

Versión del proyecto 08 preparada para **escribir el JavaScript en vivo delante del grupo**.

La maqueta ya está hecha: el HTML y el CSS son **idénticos** a los de la versión resuelta (mismos
elementos, mismos `id`, mismas clases). Lo único que falta es el código de la carpeta `js/`, que es
justo lo que se explica y se teclea durante la sesión.

---

## 🧭 Qué hay hecho y qué se escribe en vivo

| Archivo | Estado | Comentario |
|---|---|---|
| `index.html` | ✅ Completo | Misma maqueta que la solución + el aviso «MODO CLASE». |
| `css/estilos.css` | ✅ Completo | Copia exacta del proyecto + las reglas de `.aviso-modo-clase`. |
| `js/01-objetos-y-constructores.js` | ✏️ Por escribir | Teoría y `TODO (en clase)`. |
| `js/02-prototipos.js` | ✏️ Por escribir | Teoría y `TODO (en clase)`. |
| `js/03-clases.js` | ✏️ Por escribir | Teoría y `TODO (en clase)`. |
| `js/04-herencia-y-polimorfismo.js` | ✏️ Por escribir | Teoría y `TODO (en clase)`. |
| `js/05-this-bind-call-apply.js` | ✏️ Por escribir | Teoría y `TODO (en clase)`. |
| `js/06-proyecto-biblioteca.js` | ✏️ Por escribir | Proyecto integrador. |

Dentro de cada archivo `.js` **sí viene ya escrito** (es andamiaje, no materia):

- La **IIFE** `(function () { ... })();` con su `'use strict'` y el comentario que explica por qué
  está ahí (seis archivos en la misma página, nombres que chocarían).
- Las funciones auxiliares **`imprimir()`** y **`titulo()`**, que escriben a la vez en la consola de
  DevTools y en la consola visual de la página. Sin ellas no se podría demostrar nada en pantalla
  desde el primer minuto.
- El manejador del botón **«Limpiar»** de cada consola visual.
- En el archivo 06, además, la utilidad **`escapar()`** (el antídoto contra el XSS), que se comenta
  de viva voz pero no se teclea.
- Los **datos de partida**: el array `pilares` del archivo 01 y el array `DATOS_INICIALES` con las
  seis publicaciones del catálogo en el archivo 06. Teclear datos en clase es tiempo perdido; lo que
  se escribe en vivo es la **lógica** que los procesa.

Todo lo demás son bloques con este aspecto, que indican variables, ids del DOM, salida esperada y
líneas aproximadas de la solución:

```js
// TODO (en clase):
//   1. titulo('3. GETTERS Y SETTERS').
//   2. Declara `class Temperatura` con el campo privado `#celsius = 0;`
//   ...
//   Resultado esperado en pantalla:
//        Celsius: 22 / Fahrenheit: 71.6 / Descripción: Agradable
//   (aprox. 34 lineas)
```

---

## ⚠️ La página arranca vacía **a propósito**

Al abrir `index.html` verás la maqueta completa, con su índice, sus tablas de teoría, su formulario
y sus consolas… **y todas las consolas visuales en blanco**. El panel «Estado del sistema» marcará
cinco ceros, la rejilla del catálogo estará vacía, el formulario de alta no dará de alta nada y los
tres botones de la sección 05 (`this` roto / bind / arrow) no responderán. **Eso es exactamente lo
esperado**: todavía no hay código.

Lo importante: la consola del navegador (`F12`) debe estar **limpia, sin un solo error**, incluso
antes de escribir la primera línea. Si aparece algún error rojo nada más abrir la página, no viene
de la plantilla: revisa lo que se acabe de teclear.

Dos consecuencias prácticas que conviene anunciar antes de empezar:

- **Hasta que no exista `pintar()`** (archivo 06, capa de interfaz), la rejilla de publicaciones no
  dibuja ni una tarjeta, por muchas clases que ya estén escritas.
- El archivo 06 se apoya en clases que se escriben **arriba del propio archivo**: si se salta la
  clase `Publicacion` y se va directo a la interfaz, aparecerá un `ReferenceError`. Es un buen
  momento para explicar por qué el orden importa.

---

## ⏱️ Orden recomendado y minutos por sección

Los tiempos incluyen explicar, teclear y probar en pantalla. Sesión completa: **unas 5 horas y
media**, o dos sesiones cortando después del archivo 03 (que es donde el temario pasa de «cómo
funciona por dentro» a «cómo se escribe hoy»).

### `js/01-objetos-y-constructores.js` · ~55 min
| Sección | Min | Idea que no se puede perder |
|---|---|---|
| 1. Los 4 pilares | 6 | El microondas: botones fuera, electrónica dentro. |
| 2. Objetos literales | 8 | Punto vs corchetes; `this` es quien llamó al método. |
| 3. La limitación del literal | 8 | `ana.promedio === luis.promedio` es **false**. |
| 4. Función fábrica | 7 | Arregla la repetición, **no** el gasto de memoria. |
| 5. Constructora + `new` | 10 | Mayúscula inicial; no se devuelve nada, se rellena `this`. |
| 6. Simular `new` a mano | 8 | Los cuatro pasos, escritos por nosotros. |
| 7. Errores clásicos | 4 | Olvidar `new` revienta; `new.target` lo blinda. |
| 8. Encapsulamiento con closures | 12 | `cuentaAna.creditos = 9999` no cambia nada. |

### `js/02-prototipos.js` · ~55 min
| Sección | Min | Idea que no se puede perder |
|---|---|---|
| 1. Todo objeto tiene prototipo | 8 | El post-it: «si no lo tengo, pregúntale a este». |
| 2. `prototype` vs `__proto__` | 8 | El que **da** vs el que **tiene**. La confusión nº 1. |
| 3. Métodos en el prototipo | 10 | Un reglamento en la pared, no una fotocopia por alumno. |
| 4. Propias, heredadas y sombreado | 8 | `delete` devuelve la visibilidad del método del padre. |
| 5. Recorrer la cadena | 8 | Verlo una vez vale más que diez explicaciones. |
| 6. `Object.create()` | 7 | Elegir el prototipo al crear; `Object.create(null)`. |
| 7. Herencia antes de ES6 | 12 | Tres pasos: `call`, `Object.create`, restaurar `constructor`. |
| 8. Avisos finales | 2 | Nunca tocar `Object.prototype`. |

### `js/03-clases.js` · ~70 min
| Sección | Min | Idea que no se puede perder |
|---|---|---|
| 1. `class` es azúcar sintáctico | 8 | `typeof Clase` sigue siendo `"function"`. |
| 2. Constructor, campos y métodos | 12 | Métodos **sin** `function` y **sin** comas entre ellos. |
| 3. Getters y setters | 18 | El termostato: validar al escribir, calcular al leer. |
| 4. Miembros `static` | 14 | Pertenecen a la clase; `m1.resumen` es `undefined`. |
| 5. Campos privados con `#` | 15 | Privacidad real vs el `_` que era solo un ruego. |
| 6. Detalles finos | 5 | `toString`, clase como expresión, TDZ, nombre calculado. |

### `js/04-herencia-y-polimorfismo.js` · ~65 min
| Sección | Min | Idea que no se puede perder |
|---|---|---|
| 1. `extends` y `super()` | 18 | `this` no existe hasta que `super()` se ejecuta. |
| 2. Polimorfismo | 10 | El `if` que **no** escribimos es la ganancia. |
| 3. `instanceof` y tipos | 10 | `typeof [1,2]` es `"object"`; duck typing como alternativa. |
| 4. Clases abstractas simuladas | 15 | `new.target` + métodos que lanzan error. |
| 5. Composición y mixins | 12 | ES UN → `extends`; TIENE UN → propiedad; SABE HACER → mixin. |

### `js/05-this-bind-call-apply.js` · ~55 min
| Sección | Min | Idea que no se puede perder |
|---|---|---|
| 1. La regla de oro de `this` | 10 | Mira qué hay **a la izquierda del punto**, no dónde se escribió. |
| 2. Pérdida de contexto | 20 | El fallo **silencioso** (`this` = window) es el peligroso. |
| 3. `call`, `apply` y `bind` | 15 | Call = Comas, Apply = Array, Bind = Bolsillo. |
| 4. Tabla resumen | 3 | Cinco líneas para fijar las soluciones. |
| 5. `this` en eventos del DOM | 7 | Los tres botones de la página lo demuestran solos. |

### `js/06-proyecto-biblioteca.js` · ~95 min
Se escribe **en el orden del archivo**: aquí, a diferencia del proyecto 07, cada bloque depende del
anterior (no se puede pintar lo que todavía no existe).

| Paso | Secciones | Min | Idea que no se puede perder |
|---|---|---|---|
| 1 | 2 · `Publicacion`: campos y constructor | 15 | `Publicacion.#ultimoId`, **nunca** `this.constructor.#ultimoId`. |
| 2 | 2 · Getters, setter y métodos públicos | 20 | `prestar()` devuelve `{ok, mensaje}`, no lanza error. |
| 3 | 3 · `Libro` y `Revista` | 12 | Misma orden «descríbete», dos respuestas distintas. |
| 4 | 4 · `Biblioteca` | 18 | Delega en la publicación; nunca devuelve el array interno. |
| 5 | 5 y 5.1 · Catálogo y demostración | 12 | Los cuatro pilares, uno por uno, en la consola visual. |
| 6 | 6 · Referencias, `pintar()` y tarjetas | 12 | Aquí la rejilla **por fin** se llena. |
| 7 | 6 · Delegación, buscador y filtros | 10 | Un solo listener para tarjetas que se repintan enteras. |
| 8 | 6 · Formulario y reinicio | 6 | `preventDefault()` + `try/catch` alrededor del `new`. |

**Momento estelar del proyecto:** en el paso 6, al escribir `crearTarjeta()`, se llama a
`publicacion.descripcion()` sin preguntar jamás si es un libro o una revista. Merece la pena pararse
ahí treinta segundos: eso es el polimorfismo, y es lo que permitiría añadir mañana una clase
`Audiolibro` sin tocar ni una línea de la interfaz.

---

## 🔍 Cómo comparar con la solución

La versión resuelta es **la carpeta padre**, un nivel por encima de esta:

```
08-poo/
├── index.html            ← solución (se abre y funciona)
├── css/estilos.css
├── js/                   ← solución de los seis archivos
└── plantilla-clase/      ← ESTA carpeta
    ├── index.html
    ├── css/estilos.css
    └── js/               ← los mismos seis archivos, por completar
```

- Cada archivo de la plantilla dice en su cabecera dónde está su solución
  (por ejemplo `../../js/03-clases.js`).
- **Los números de sección coinciden** en las dos versiones: la sección 5 de la plantilla es la
  sección 5 de la solución. Lo cómodo es tener los dos archivos abiertos en paralelo.
- El enlace «la carpeta del proyecto» del aviso amarillo abre la versión resuelta en el navegador,
  por si hay que enseñar el resultado final antes de escribirlo.

Para ver la diferencia exacta de un archivo, desde la carpeta del proyecto:

```bash
diff js/03-clases.js plantilla-clase/js/03-clases.js
```

---

## 📋 Consejos de uso

- **Abrir con doble clic basta** (protocolo `file://`). No hace falta servidor, Node ni npm.
- Los `TODO` indican **nombres exactos de clases, campos y métodos** y el **`id` del elemento** con
  el que hay que trabajar. Respetarlos hace que la plantilla acabe siendo idéntica a la solución, y
  es imprescindible en el archivo 06: la interfaz busca `metrica-total`, `rejilla-publicaciones`,
  `data-accion` y `data-filtro` con esos nombres y no con otros.
- El número entre paréntesis (`aprox. 12 lineas`) sirve para calcular el tiempo restante de un
  vistazo.
- Los avisos **⚠️ ERROR COMÚN** y **✅ BUENA PRÁCTICA** están intactos: son material de exposición,
  no relleno. En este tema hay tres que compensa **provocar en directo** antes de leerlos:
  1. Olvidar el `new` (archivo 01) y ver el `TypeError`.
  2. Escribir `this.celsius = valor` dentro de `set celsius` (archivo 03) y ver el
     «Maximum call stack size exceeded».
  3. Usar `this` antes de `super()` (archivo 04) y leer el mensaje del motor.
- Cuidado con los **campos privados en `eval()`**: en los archivos 03 y 06 hay un par de bloques que
  usan `eval('objeto.#campo')` dentro de un `try`. No es un capricho: escribir esa línea directamente
  sería un `SyntaxError` y **el archivo entero dejaría de ejecutarse**. Conviene explicarlo, porque
  es contraintuitivo.
- Los bloques **EJERCICIOS PROPUESTOS** del final de cada archivo se quedan tal cual: son el trabajo
  posterior del alumnado.
- Si algo se atasca en directo, se copia el bloque de la solución, se explica y se sigue: la
  plantilla está pensada para poder saltar de una versión a otra sin perder el hilo.

---

## 🔄 Volver al estado inicial

Este proyecto **no guarda nada** en el navegador: todo el estado vive en memoria. Para empezar de
cero basta con **recargar la página** (`F5`), y el catálogo vuelve a sus seis publicaciones con los
contadores estáticos a cero.

Durante la clase, para limpiar sin recargar:

- El botón **«Limpiar»** de cada consola visual vacía solo esa consola.
- El botón **«Devolver todo»** del proyecto devuelve las publicaciones prestadas y reinicia el
  filtro y el buscador, pero **no** borra el catálogo ni los contadores: la biblioteca no expone
  ningún método para vaciarse, y ese detalle es justamente lo que se quiere enseñar.
