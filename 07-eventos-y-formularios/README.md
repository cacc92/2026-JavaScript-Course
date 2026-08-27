# 07 · Eventos, formularios y almacenamiento

Guía docente del séptimo proyecto del curso **Full Stack 2 · Desarrollo Front End**.

Aquí la página deja de ser un folleto y pasa a ser una **aplicación**: escucha lo que hace la
persona que la usa, comprueba que los datos tienen sentido y recuerda la información aunque se
cierre el navegador.

---

## 🎯 Temas cubiertos

**Eventos: fundamentos**
- Qué es un evento, qué es un manejador y quién dispara qué.
- Las tres formas de asignar un manejador: atributo `onclick` en el HTML, propiedad `.onclick`
  y `addEventListener()`. Por qué la tercera es la correcta.
- `removeEventListener()` y por qué exige una función **con nombre** guardada en una variable.
- El objeto `event`: `type`, `target`, `currentTarget`, `timeStamp`, `eventPhase`.
- **Diferencia clave entre `target` y `currentTarget`.**
- `preventDefault()`: cancelar el comportamiento de fábrica del navegador.

**Propagación y delegación**
- Las tres fases del viaje de un evento: **captura**, **objetivo** y **burbujeo**.
- El tercer parámetro de `addEventListener` y la opción `capture` demostrada en vivo.
- `stopPropagation()` y `stopImmediatePropagation()`.
- **Delegación de eventos**: qué es, por qué ahorra memoria y por qué es la única forma
  cómoda de trabajar con listas que cambian. Implementada con `closest()`.
- Las opciones `once` y `passive`.

**Ratón y teclado**
- `click`, `dblclick` y la secuencia real click-click-dblclick.
- `mouseenter` / `mouseleave` **frente a** `mouseover` / `mouseout`.
- `mousemove` y las coordenadas `clientX`, `offsetX`.
- `contextmenu`: sustituir el menú del clic derecho por uno propio.
- `keydown` y `keyup`; **`event.key` frente a `event.code`**.
- Atajos de teclado con `ctrlKey`, `shiftKey`, `altKey` y `metaKey`.

**Formularios y validación**
- `submit` (y por qué siempre lleva `preventDefault()`), `input`, `change`, `focus`, `blur`.
- **La diferencia entre `input` y `change`**, y entre `blur` y `focusout`.
- Lectura de datos: `.value`, `.checked`, `.selected`, `selectedOptions`, radios con `:checked`.
- `FormData` + `Object.fromEntries()` para leer el formulario entero de una vez.
- Validación escrita a mano con mensajes de error personalizados.
- Validación nativa HTML5: `required`, `pattern`, `min`, `max`, `step`, `novalidate`,
  `checkValidity()`, `reportValidity()`, `setCustomValidity()` y el objeto `validity`.

**Carga y almacenamiento**
- `DOMContentLoaded` frente a `load`, y por qué `defer` resuelve el problema de raíz.
- `localStorage` y `sessionStorage`: `setItem`, `getItem`, `removeItem`, `clear`, `length`, `key()`.
- Por qué **todo se guarda como texto** y hay que serializar con `JSON.stringify` / `JSON.parse`.
- `try` / `catch` alrededor del almacenamiento (modo privado, cuota llena).
- El evento `storage` para comunicar pestañas.

**Proyecto integrador**
- Lista de tareas (To-Do) completa: alta con validación, marcar como completada, edición en
  línea, borrado con delegación, filtros, contador de pendientes, borrar completadas y
  **persistencia total en `localStorage`**.

---

## 📁 Archivos del proyecto

```
07-eventos-y-formularios/
├── index.html                        Página con las 6 secciones y el proyecto
├── css/
│   └── estilos.css                   Tema oscuro, tarjetas, consolas y estilos del To-Do
├── js/
│   ├── 01-eventos-basicos.js         Qué es un evento, las 3 formas, event, preventDefault
│   ├── 02-propagacion-y-delegacion.js Captura/burbujeo, stopPropagation, closest, once, passive
│   ├── 03-teclado-y-raton.js         Ratón, menú contextual, teclado, atajos
│   ├── 04-formularios-y-validacion.js Eventos de formulario, FormData, validación manual y HTML5
│   ├── 05-almacenamiento.js          DOMContentLoaded/load, localStorage, sessionStorage
│   └── 06-proyecto-todo.js           Proyecto integrador con persistencia
└── README.md                         Esta guía
```

Cada archivo JavaScript está envuelto en una **IIFE** — `(function () { ... })();` — porque el
mismo `index.html` carga seis archivos y, sin ese aislamiento, dos variables con el mismo nombre
declaradas en archivos distintos romperían la página con
`Identifier 'x' has already been declared`. Merece la pena dedicarle dos minutos en clase: es la
primera vez que el alumnado se topa con un problema real de **ámbito global**.

---

## 🚀 Cómo abrir el proyecto

**Opción A · doble clic (la normal).** Abre `index.html` con doble clic. No hace falta Node, ni
instalar nada, ni conexión a internet: todo el proyecto es JavaScript puro.

**Opción B · servidor local (recomendada para la sección 5 y el proyecto).** Algunos navegadores
—Safari en particular, y el modo privado de otros— **bloquean `localStorage` cuando la página se
abre con el protocolo `file://`**. El código está preparado con `try/catch` y no se rompe, pero
las tareas no se guardarán al recargar, que es justo lo que queremos demostrar. Con un servidor
local funciona en todos los navegadores:

- **Con VS Code:** instala la extensión *Live Server*, clic derecho sobre `index.html` →
  *Open with Live Server*.
- **Sin extensiones**, desde la Terminal, situándote en la carpeta del proyecto:

  ```bash
  cd "07-eventos-y-formularios"
  python3 -m http.server 8000
  ```

  y abre `http://localhost:8000` en el navegador. Para detenerlo, `Ctrl + C`.

> 💡 **Consejo para clase:** ten abierta la consola del navegador (`F12`) en la pantalla
> proyectada, aunque cada sección imprime también en su **consola visual** dentro de la propia
> página. Así se ve el resultado sin cambiar de ventana.

---

## 🗓️ Orden sugerido para explicarlo en clase

Material pensado para **tres sesiones de dos horas** (unos 325 minutos de explicación efectiva,
sin contar las pausas ni el tiempo de ejercicios en el aula).

### Sesión 1 — Los cimientos (≈ 95 min)

| Bloque | Contenido | Tiempo |
|---|---|---|
| **1** | **Eventos básicos** (`js/01`). Qué es un evento con la analogía del timbre. Las tres formas de asignar un manejador, mostrándolas **en este orden** para que se vea la evolución histórica. Insistir en que la propiedad `.onclick` se pisa a sí misma: pulsar el botón y comprobar que el manejador A nunca aparece. | 25 min |
| **2** | **`removeEventListener`** (`js/01`, §5). El punto importante es la **identidad de la función**: quitar un manejador anónimo es imposible. Enseñar el botón que lo intenta y falla en silencio. | 15 min |
| **3** | **El objeto `event`** (`js/01`, §6). Dedicar tiempo real a `target` vs `currentTarget` con la analogía del micrófono en la puerta del aula. Es el concepto que más se atraganta y el que sostiene toda la delegación. | 20 min |
| **4** | **`preventDefault()`** (`js/01`, §7). Enlace que no navega y checkbox que no se marca. | 10 min |
| **5** | **Propagación** (`js/02`, §1-2). Pulsar el cuadro *hijo* y leer los seis mensajes en voz alta. Activar el checkbox de `stopPropagation` y volver a pulsar: preguntar a la clase **antes** qué números van a desaparecer. | 25 min |

### Sesión 2 — Interacción de verdad (≈ 110 min)

| Bloque | Contenido | Tiempo |
|---|---|---|
| **6** | **Delegación de eventos** (`js/02`, §3). Empezar planteando el problema (500 filas, 1000 manejadores) antes de dar la solución. Añadir un producto nuevo y comprobar que sus botones funcionan sin haber registrado nada: **ese es el momento "ajá" del tema**. | 30 min |
| **7** | **`once` y `passive`** (`js/02`, §4). Breve pero útil: `once` se entiende solo, y `passive` da pie a hablar de rendimiento. | 10 min |
| **8** | **Eventos de ratón** (`js/03`, §1-4). El contraste `mouseenter` vs `mouseover` se ve mejor con los dos contadores en pantalla: mover el ratón entrando y saliendo del recuadro interior. Terminar con el menú contextual propio. | 30 min |
| **9** | **Eventos de teclado** (`js/03`, §5-7). Escribir en el campo y observar `key` y `code`. Probar con la `ñ`, con `Shift+a` y con las flechas. Explicar la regla: *letra → `key`; posición física → `code`*. Atajo `Ctrl/Cmd + Shift + L` y el tablero con las flechas (aprovechar para hablar de `tabindex` y del foco). | 25 min |
| **10** | **`input` vs `change` y `focus`/`blur`** (`js/04`, §1-2). Escribir en los dos campos de la izquierda y la derecha y comparar la consola. | 15 min |

### Sesión 3 — Datos, persistencia y proyecto (≈ 120 min)

| Bloque | Contenido | Tiempo |
|---|---|---|
| **11** | **Leer los datos de un formulario** (`js/04`, §3-4). Campo a campo primero (para que duela un poco) y después `FormData` + `Object.fromEntries`. Enseñar los dos avisos: hace falta `name`, y `getAll()` para valores repetidos. | 25 min |
| **12** | **Validación manual** (`js/04`, §5). Enviar el formulario vacío y ver los cinco mensajes. Recalcar que validar en el navegador es **ayudar al usuario**, nunca proteger la aplicación: el servidor siempre revalida. | 25 min |
| **13** | **Validación nativa HTML5** (`js/04`, §6). `required`, `pattern`, `min`/`max`, `checkValidity()`, `reportValidity()` y `setCustomValidity()`. Dedicar un minuto entero al error de no limpiar el mensaje personalizado. | 20 min |
| **14** | **`DOMContentLoaded` vs `load` y almacenamiento** (`js/05`). Guardar preferencias, recargar con `F5` y ver que siguen ahí. Enseñar en DevTools → *Application* → *Local Storage* el texto real almacenado. Comparar con `sessionStorage` abriendo una pestaña nueva. | 30 min |
| **15** | **Proyecto To-Do** (`js/06`). Ver primero la aplicación funcionando, después abrir el código por el diagrama `estado → render → evento → estado`. Recorrer las funciones en este orden: `render()`, el `submit` de alta, la delegación de `click`/`change`, `iniciarEdicion()` y el bloque de arranque. | 20 min |

> Si vas corto de tiempo, los bloques que **no** se pueden recortar son el **3** (`target` vs
> `currentTarget`), el **6** (delegación) y el **14** (serializar con JSON). Todo lo demás se
> puede dejar como lectura guiada.

---

## ✏️ Ejercicios propuestos

Están también al final de cada archivo `.js`, junto al código que necesitan. Aquí van recopilados
para poder repartirlos como boletín.

### Archivo 01 · Eventos básicos
1. Añade un botón con `id="btn-color"` y regístrale con `addEventListener` un manejador que cambie
   el color de fondo de `#caja-evento`.
2. Crea un botón que registre y otro que elimine un manejador que imprima la hora actual. *Pista:
   necesitas guardar la función en una variable con nombre.*
3. Modifica el manejador de `#caja-evento` para que muestre cuántos hijos directos tiene el
   `currentTarget`. *Pista: `evento.currentTarget.children.length`.*
4. Haz que `#chk-bloqueado` solo se pueda marcar si se mantiene pulsada la tecla Shift.
   *Pista: `evento.shiftKey`.*
5. **(Reto)** Contador de clics que se reinicie a cero si pasan más de 2 segundos entre uno y otro.
   *Pista: guarda el `timeStamp` anterior.*

### Archivo 02 · Propagación y delegación
1. Añade un manejador de clic al `<body>` y explica por qué se dispara con cualquier clic.
2. Con `stopPropagation` activo, anota qué números de la secuencia desaparecen y **por qué siguen
   apareciendo los de captura**.
3. Añade un tercer botón "Duplicar" (`data-accion="duplicar"`) que copie la fila, **sin registrar
   ningún listener nuevo**. *Pista: `fila.cloneNode(true)` y `fila.after(copia)`.*
4. Al pulsar el nombre de un producto (no los botones), muestra cuántas letras tiene.
5. **(Reto)** Convierte la demo de fases en un semáforo visual: que cada caja se ilumine 400 ms
   cuando el evento pasa por ella, para *ver* el recorrido.

### Archivo 03 · Ratón y teclado
1. Que el cuadrado del tablero cambie de color al chocar con un borde.
2. Añade control con las teclas W, A, S, D usando `event.code`, y razona por qué en un juego es
   mejor `code` que `key`.
3. Crea un atajo `Ctrl/Cmd + K` que lleve el foco a `#input-teclas`.
4. Haz que el color del pad dependa de la posición horizontal del puntero.
   *Pista: `'hsl(' + grados + ', 70%, 45%)'`.*
5. **(Reto)** Contador de "clics por segundo" sobre la caja de la sección 3.1.

### Archivo 04 · Formularios y validación
1. Añade "Repite la contraseña" y valida que ambas coincidan.
2. Contador de caracteres en vivo bajo el campo de nombre (`12 / 40`).
3. Pon atributo `name` a los campos de `#form-nativo` y comprueba que ahora sí aparecen en
   `FormData`.
4. Deshabilita el botón "Registrarme" mientras el formulario no sea válido.
   *Pista: `input` sí burbujea, escúchalo en el formulario entero.*
5. **(Reto)** Validador de DNI español: 8 dígitos y la letra correcta, obtenida con
   `"TRWAGMYFPDXBNJZSQVHLCKE"[numero % 23]`.

### Archivo 05 · Almacenamiento
1. Guarda también si el usuario prefiere las consolas expandidas y restáuralo al cargar.
2. Botón "Exportar preferencias" que muestre el JSON con formato. *Pista: `JSON.stringify(obj, null, 2)`.*
3. Sustituye `clear()` por un borrado que elimine solo las claves que empiecen por `fs2-07-`.
   *Pista: `Object.keys(localStorage)`, `filter` y `startsWith`.*
4. Guarda la posición del scroll en `sessionStorage` y restáurala al recargar.
5. **(Reto)** Escribe `guardar(clave, valor)` y `leer(clave, porDefecto)` genéricas que hagan el
   `stringify`/`parse` y el `try/catch`, y reescribe la sección usándolas.

### Archivo 06 · Proyecto To-Do
1. Muestra la fecha de creación de cada tarea (ya está guardada en `creadaEn`).
   *Pista: `new Date(t.creadaEn).toLocaleDateString('es-ES')`.*
2. Botón "Marcar todas" que complete todas las tareas (y las desmarque si ya lo estaban).
3. Campo de búsqueda que filtre por texto en vivo, combinándose con los filtros existentes.
4. Añade prioridad (alta/media/baja), píntala con un color de borde y permite ordenar por ella.
5. **(Reto)** Reordenar tareas arrastrando con `dragstart`, `dragover` y `drop`, guardando el orden.
6. **(Reto avanzado)** Botón "Deshacer" que recupere la última tarea eliminada.

---

## ⚠️ Errores comunes que conviene advertir

**Sobre los manejadores**
- `btn.onclick = miFuncion();` **con paréntesis**: ejecuta la función en ese momento y guarda su
  resultado (normalmente `undefined`). Se pasa la función *sin* paréntesis: se entrega la receta,
  no el plato ya servido.
- Asignar dos veces `.onclick` al mismo elemento y no entender por qué solo funciona el segundo.
- Intentar quitar con `removeEventListener` un manejador anónimo o una *arrow function* escrita
  dentro del propio `addEventListener`. **No da error y no hace nada**, que es lo peor de todo.
- Escribir `evento.preventDefault` sin paréntesis, o usar `return false` con `addEventListener`
  (eso solo funcionaba con el atributo `onclick` antiguo).

**Sobre el objeto `event`**
- Usar `event.target` creyendo que siempre es el elemento donde se puso el listener. En cuanto ese
  elemento tenga un icono o un `<span>` dentro, `target` será el hijo. Para el elemento que
  escucha, `currentTarget`; para lo que el usuario pulsó de verdad, `target`.
- Olvidar declarar el parámetro: `function () { console.log(evento.type); }` da
  `evento is not defined`.

**Sobre la propagación**
- Creer que el manejador del padre solo se dispara al pulsar el padre. Si se pulsa un hijo, el
  evento **sube** y también lo dispara. No es un fallo: es lo que hace posible la delegación.
- Abusar de `stopPropagation()` "por si acaso": rompe la delegación de otras partes de la
  aplicación y provoca fallos dificilísimos de localizar.
- Confundir `preventDefault()` (cancelar la acción de fábrica) con `stopPropagation()` (cortar el
  viaje del evento). Son cosas distintas y no se sustituyen entre sí.

**Sobre los formularios**
- **Olvidar `preventDefault()` en el `submit`.** La página se recarga, todo se pierde y el
  alumnado concluye que "el código no funciona" cuando en realidad se ejecutó perfectamente… antes
  de que la página se reiniciara. Es, con diferencia, el error número uno de este tema.
- Leer un checkbox con `.value` (devuelve `"on"` esté marcado o no) en lugar de `.checked`.
- Sumar valores de inputs sin convertirlos: `"2" + "3"` es `"23"`, no `5`. Hace falta `Number()`.
- Esperar que `FormData` recoja campos que **no tienen atributo `name`**: el `id` no le sirve.
  El formulario `#form-nativo` está preparado a propósito para que este fallo se vea en clase.
- Usar `change` para un buscador en vivo: no pasa nada hasta que el campo pierde el foco.
  Para eso está `input`.
- Poner un mensaje con `setCustomValidity('...')` y **no limpiarlo nunca** con
  `setCustomValidity('')`. El campo se queda inválido para siempre y el formulario no se envía
  jamás, sin ninguna pista de por qué.
- Confiar en la validación del navegador como medida de seguridad. Es una ayuda a la usabilidad;
  cualquiera puede saltársela. **El servidor siempre revalida.**

**Sobre el almacenamiento**
- Guardar un objeto sin `JSON.stringify`: se almacena la cadena inútil `"[object Object]"`.
- Recuperar un número y operar con él sin `Number()`: `getItem('edad') + 1` da `"301"`.
- No proteger `JSON.parse` con `try/catch`: un dato corrupto tumba la aplicación entera al cargar.
- Usar `clear()` alegremente: borra **todas** las claves del sitio, incluidas las de otras
  aplicaciones del mismo dominio.
- Guardar contraseñas o datos personales en `localStorage`: cualquier script de la página los lee.
- Esperar que `sessionStorage` se comparta entre pestañas. No: cada pestaña tiene el suyo.

**Sobre la carga de la página**
- Poner `<script>` en el `<head>` **sin `defer`** y sin esperar a `DOMContentLoaded`:
  `getElementById` devuelve `null` y aparece el clásico
  `Cannot read properties of null (reading 'addEventListener')`.
- Declarar la misma variable global en dos archivos `.js` cargados en la misma página:
  `Identifier 'x' has already been declared` y la página deja de funcionar entera. De ahí las IIFE.

**Sobre la arquitectura del proyecto**
- Modificar el DOM directamente en cada manejador en lugar de cambiar el estado y repintar. Al
  principio funciona; en cuanto aparecen filtros y contadores, la pantalla y los datos dejan de
  coincidir. La regla del proyecto es innegociable:
  **el manejador cambia el array, guarda y llama a `render()`**.
- Meter texto escrito por el usuario con `innerHTML`. Si escribe etiquetas HTML, se insertan de
  verdad. Con `textContent` siempre se trata como texto plano.

---

## ✅ Comprobado

El proyecto se ha verificado en el navegador: los seis archivos se cargan sin errores en consola,
el orden de captura/burbujeo se imprime como está documentado, la delegación funciona sobre
elementos creados después, las validaciones (manual y nativa) devuelven los mensajes esperados y
la lista de tareas conserva tareas, filtro y preferencias tras recargar la página.
