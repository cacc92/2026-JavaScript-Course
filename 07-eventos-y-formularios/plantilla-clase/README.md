# 07 · Eventos, formularios y almacenamiento — **Plantilla de clase**

Versión del proyecto 07 preparada para **escribir el JavaScript en vivo delante del grupo**.

La maqueta ya está hecha: el HTML y el CSS son **idénticos** a los de la versión resuelta (mismos
elementos, mismos `id`, mismas clases). Lo único que falta es el código de la carpeta `js/`, que es
justo lo que se explica y se teclea durante la sesión.

---

## 🧭 Qué hay hecho y qué se escribe en vivo

| Archivo | Estado | Comentario |
|---|---|---|
| `index.html` | ✅ Completo | Misma maqueta que la solución + el aviso «MODO CLASE». |
| `css/estilos.css` | ✅ Completo | Copia exacta del proyecto + las reglas de `.aviso-modo-clase`. |
| `js/01-eventos-basicos.js` | ✏️ Por escribir | Teoría y `TODO (en clase)`. |
| `js/02-propagacion-y-delegacion.js` | ✏️ Por escribir | Teoría y `TODO (en clase)`. |
| `js/03-teclado-y-raton.js` | ✏️ Por escribir | Teoría y `TODO (en clase)`. |
| `js/04-formularios-y-validacion.js` | ✏️ Por escribir | Teoría y `TODO (en clase)`. |
| `js/05-almacenamiento.js` | ✏️ Por escribir | Teoría y `TODO (en clase)`. |
| `js/06-proyecto-todo.js` | ✏️ Por escribir | Proyecto integrador. |

Dentro de cada archivo `.js` **sí viene ya escrito** (es andamiaje, no materia):

- La **IIFE** `(function () { ... })();` con su `'use strict'` y el comentario que explica por qué
  está ahí (seis archivos en la misma página, nombres que chocarían).
- Las funciones auxiliares **`imprimir()`** y **`titulo()`**, que escriben a la vez en la consola de
  DevTools y en la consola visual de la página. Sin ellas no se podría demostrar nada en pantalla
  desde el primer minuto.
- El manejador del botón **«Limpiar»** de cada consola visual.
- Los **datos de partida**: `CLAVE_PREFERENCIAS`, `CLAVE_VISITAS`, `CLAVE_TAREAS`, `CLAVE_FILTRO`,
  los límites `MINIMO`/`MAXIMO` y el array `TAREAS_DE_EJEMPLO`. Teclear datos en clase es tiempo
  perdido; lo que se escribe en vivo es la **lógica** que los procesa.

Todo lo demás son bloques con este aspecto, que indican variables, ids del DOM, salida esperada y
líneas aproximadas de la solución:

```js
// TODO (en clase):
//   1. const btnListener = document.getElementById('btn-listener');
//   2. Regístrale TRES manejadores del evento 'click' sobre el MISMO botón...
//   Resultado esperado al pulsar "Forma 3": los TRES mensajes seguidos.
//   (aprox. 10 lineas)
```

---

## ⚠️ La página arranca vacía **a propósito**

Al abrir `index.html` verás la maqueta completa, con sus tarjetas, formularios y consolas… **y todas
las consolas visuales en blanco**. Los botones no responderán, la lista de tareas estará vacía y el
tablero no se moverá. **Eso es exactamente lo esperado**: todavía no hay código.

Lo importante: la consola del navegador (`F12`) debe estar **limpia, sin un solo error**, incluso
antes de escribir la primera línea. Si aparece algún error rojo nada más abrir la página, no viene
de la plantilla: revisa lo que se acabe de teclear.

Y una consecuencia práctica del apartado 5 del archivo 06: **hasta que no exista `render()`, la lista
de tareas no pinta nada**. Conviene avisarlo antes de empezar el proyecto para que nadie piense que
se ha roto algo.

---

## ⏱️ Orden recomendado y minutos por sección

Los tiempos incluyen explicar, teclear y probar en pantalla. Sesión completa: **unas 5 horas**, o
dos sesiones cortando después del archivo 03.

### `js/01-eventos-basicos.js` · ~35 min
| Sección | Min | Idea que no se puede perder |
|---|---|---|
| 1. ¿Qué es un evento? | 3 | Evento = aviso; manejador = tu reacción. |
| 2. Atributo `onclick` | 5 | Se enseña para reconocerlo, **no** para usarlo. |
| 3. Propiedad `.onclick` | 5 | El manejador A **desaparece**: solo cabe uno. |
| 4. `addEventListener` | 6 | Tres manejadores conviven y se ejecutan en orden. |
| 5. `removeEventListener` | 8 | Sin función **con nombre** no se puede quitar nada. |
| 6. El objeto `event` | 5 | `target` (quién estornudó) vs `currentTarget` (tu micrófono). |
| 7. `preventDefault()` | 3 | Cancelar la acción de fábrica del navegador. |

### `js/02-propagacion-y-delegacion.js` · ~40 min
| Sección | Min | Idea que no se puede perder |
|---|---|---|
| 1. Captura, objetivo y burbujeo | 12 | Se pulsa el hijo y salen las **seis** líneas 1→6. |
| 2. `stopPropagation()` | 5 | Parar el ascensor ≠ anular lo que ibas a hacer. |
| 3. Delegación con `closest()` | 18 | El producto añadido **ya funciona** sin registrar nada. |
| 4. `once` y `passive` | 5 | Bajas automáticas y scroll fluido. |

### `js/03-teclado-y-raton.js` · ~45 min
| Sección | Min | Idea que no se puede perder |
|---|---|---|
| 1. `click` y `dblclick` | 5 | La secuencia real es click, click, dblclick. |
| 2. `mouseenter` vs `mouseover` | 8 | Los dos contadores de la pantalla no coinciden. |
| 3. `mousemove` y coordenadas | 6 | Imprimir 1 de cada 25: introducción al *throttling*. |
| 4. `contextmenu` propio | 10 | `preventDefault()` + posicionar con `getBoundingClientRect()`. |
| 5. `key` vs `code` | 8 | Escribir «ñ» y una «A» con Shift lo demuestra solo. |
| 6. Atajos con modificadores | 4 | No pisar `Ctrl+T`, `Ctrl+W`… |
| 7. Mover con las flechas | 8 | `tabindex="0"` para que un `div` reciba el foco. |

### `js/04-formularios-y-validacion.js` · ~55 min
| Sección | Min | Idea que no se puede perder |
|---|---|---|
| 1. `input` vs `change` | 6 | Mirar por encima del hombro vs entregar el papel. |
| 2. `focus` y `blur` | 4 | No burbujean: para delegar, `focusin`/`focusout`. |
| 3. Leer datos a mano | 10 | `.checked` para checkbox, `:checked` para radios. |
| 4. `FormData` | 8 | Sin `name` no existe; para repetidos, `getAll()`. |
| 5. Validación a mano | 18 | Una función por campo que devuelve mensaje o `''`. |
| 6. Validación nativa HTML5 | 12 | `setCustomValidity('')` **siempre** al principio. |

### `js/05-almacenamiento.js` · ~40 min
| Sección | Min | Idea que no se puede perder |
|---|---|---|
| 1. `DOMContentLoaded` vs `load` | 8 | Los tres momentos salen siempre en el mismo orden. |
| 3. `stringify` / `parse` + preferencias | 20 | `typeof` string al leer, object tras `JSON.parse`. |
| 4. `sessionStorage` | 5 | Otra pestaña = otro almacén. |
| 5. `clear()` | 4 | Se lleva por delante las tareas del proyecto. |
| 6. Evento `storage` | 3 | Con dos pestañas abiertas se ve al instante. |

### `js/06-proyecto-todo.js` · ~85 min
Se escribe **en este orden**, que no es el orden del archivo:

| Paso | Secciones | Min | Idea que no se puede perder |
|---|---|---|---|
| 1 | 1 y 2 · Referencias y estado | 10 | Una única fuente de verdad: el array `tareas`. |
| 2 | 5 · `render()` | 20 | Estado → pintar. El DOM no se toca a mano. |
| 3 | 6 · Alta con validación | 12 | `preventDefault()` + salida temprana. |
| 4 | 3 · Persistencia | 12 | `try`/`catch` incluso al **leer** (`file://`). |
| 5 | 7 · Delegación | 12 | Los `<li>` de ahora no son los de hace un segundo. |
| 6 | 10 y 11 · Filtros y limpieza | 8 | El filtro también se recuerda al recargar. |
| 7 | 8 y 9 · Animación y edición | 15 | El «cerrojo» que evita ejecutar dos veces. |
| 8 | 12 · Arranque | 6 | Leer del disco **antes** del primer `render()`. |

---

## 🔍 Cómo comparar con la solución

La versión resuelta es **la carpeta padre**, un nivel por encima de esta:

```
07-eventos-y-formularios/
├── index.html            ← solución (se abre y funciona)
├── css/estilos.css
├── js/                   ← solución de los seis archivos
└── plantilla-clase/      ← ESTA carpeta
    ├── index.html
    ├── css/estilos.css
    └── js/               ← los mismos seis archivos, por completar
```

- Cada archivo de la plantilla dice en su cabecera dónde está su solución
  (por ejemplo `../../js/04-formularios-y-validacion.js`).
- **Los números de sección coinciden** en las dos versiones: la sección 5 de la plantilla es la
  sección 5 de la solución. Lo cómodo es tener los dos archivos abiertos en paralelo.
- El enlace «la carpeta del proyecto» del aviso amarillo abre la versión resuelta en el navegador,
  por si hay que enseñar el resultado final antes de escribirlo.

Para ver la diferencia exacta de un archivo, desde la carpeta del proyecto:

```bash
diff js/01-eventos-basicos.js plantilla-clase/js/01-eventos-basicos.js
```

---

## 📋 Consejos de uso

- **Abrir con doble clic basta** (protocolo `file://`). No hace falta servidor, Node ni npm.
  Aun así, `localStorage` puede estar bloqueado en Safari con `file://`: el código lo tiene
  previsto con `try`/`catch` y la aplicación sigue funcionando sin persistencia.
- Los `TODO` indican **nombres exactos de variables y funciones** y el **`id` del elemento** con el
  que hay que trabajar. Respetarlos hace que la plantilla acabe siendo idéntica a la solución.
- El número entre paréntesis (`aprox. 12 lineas`) sirve para calcular el tiempo restante de un
  vistazo.
- Los avisos **⚠️ ERROR COMÚN** y **✅ BUENA PRÁCTICA** están intactos: son material de exposición,
  no relleno. Merece la pena provocar el error en directo antes de leer el aviso.
- Los bloques **EJERCICIOS PROPUESTOS** del final de cada archivo se quedan tal cual: son el trabajo
  posterior del alumnado.
- Si algo se atasca en directo, se copia el bloque de la solución, se explica y se sigue: la
  plantilla está pensada para poder saltar de una versión a otra sin perder el hilo.

---

## 🔄 Volver al estado inicial

El proyecto guarda cosas en el navegador. Para empezar una clase desde cero, en la consola (`F12`):

```js
Object.keys(localStorage)
  .filter((clave) => clave.startsWith('fs2-07-'))
  .forEach((clave) => localStorage.removeItem(clave));
location.reload();
```

Así vuelven a aparecer las tres tareas de ejemplo y desaparecen las preferencias guardadas.
