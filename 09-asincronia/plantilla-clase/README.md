# 09 · Asincronía — Plantilla de clase

Esta carpeta es la versión **para escribir en vivo** del proyecto 09. Sirve para dar la clase
tecleando el JavaScript delante de los estudiantes sin perder ni un minuto en HTML ni en CSS.

La versión **resuelta** está en la carpeta padre: `../index.html` y `../js/`.

---

## Qué viene hecho y qué se escribe en vivo

| Archivo | Estado |
|---|---|
| `index.html` | **Completo.** Misma maqueta que la solución: mismos textos, mismos `id`, mismas clases. |
| `css/estilos.css` | **Completo.** Copia exacta del proyecto, más una sección 18 para el aviso de modo clase. |
| `js/01-event-loop.js` | Explicaciones completas, **código por escribir**. |
| `js/02-callbacks.js` | Explicaciones completas + `BASE_DE_DATOS` ya escrita, **lógica por escribir**. |
| `js/03-promesas.js` | Explicaciones completas, **código por escribir**. |
| `js/04-async-await.js` | Explicaciones completas + array `INFORMES` ya escrito, **lógica por escribir**. |
| `js/05-fetch.js` | Explicaciones completas + configuración y `USUARIOS_SIMULADOS` ya escritos, **lógica por escribir**. |

En los cinco archivos vienen ya escritos y funcionando:

- la **IIFE** que envuelve cada archivo (con su comentario explicando por qué está ahí),
- el `'use strict'`,
- las funciones **`imprimir()`**, **`titulo()`** y **`limpiar()`** de la consola visual,
- los **datos de partida** (base de datos del instituto, lista de informes, usuarios simulados,
  URLs de la API).

Todo lo demás aparece como bloques con este formato:

```js
// TODO (en clase):
//   1. Declara una constante llamada NOMBRE con el valor "Ana".
//   2. Intenta reasignarla y observa el TypeError en la consola.
//   Resultado esperado en pantalla: Nombre: Ana
//   (aprox. 6 lineas)
```

El número de líneas aproximado sirve para calcular el tiempo sobre la marcha.

---

## La página arranca vacía: es lo esperado

Al abrir `index.html` de esta carpeta **no pasa nada** y **no hay ni un solo error en la consola**
del navegador (F12). Se ve la maqueta completa, las consolas oscuras vacías y los botones sin
efecto. Es exactamente lo correcto: los archivos `.js` son JavaScript válido compuesto casi por
completo de comentarios.

Si aparece un error rojo en la consola antes de escribir nada, algo se ha tocado por error.

---

## Orden recomendado y minutos por sección

### Sesión 1 — el event loop y los callbacks (≈ 100 min)

**`js/01-event-loop.js`** (≈ 55 min)

| Sección | Contenido | Minutos |
|---|---|---|
| 1 | Mensaje de bienvenida en la consola general | 3 |
| 2 | `bloquearHilo()` y la pila de llamadas | 7 |
| 3 | `demoOrdenDeEjecucion()`, `explicarOrden()`, `demoBloqueo()` | 25 |
| 4 | `setTimeout` / `clearTimeout` | 10 |
| 5 | `setInterval` / `clearInterval` y la cuenta atrás | 10 |
| 6 | `alPulsar()` y los ocho botones | 5 |

> Truco de clase: antes de pulsar el botón «Ejecutar demo de orden», pide a la clase que escriba
> en un papel el orden de los cuatro mensajes. Se acuerdan del resultado para siempre.

**`js/02-callbacks.js`** (≈ 45 min)

| Sección | Contenido | Minutos |
|---|---|---|
| 2 | Callback síncrono vs asíncrono | 8 |
| 3 | Las cuatro funciones error-first + `demoErrorFirst()` | 15 |
| 4 | `demoCallbackHell()` (la pirámide) | 12 |
| 5 | `promisificar()` y `demoSinPiramide()` | 10 |

### Sesión 2 — promesas (≈ 90 min)

**`js/03-promesas.js`**

| Sección | Contenido | Minutos |
|---|---|---|
| 0 | `cronometro()` | 3 |
| 2 | `cocinarPedido()`, `esperar()`, `fallarTras()` | 12 |
| 3 | `then` / `catch` / `finally` y los tres estados | 15 |
| 4 | `demoEncadenar()` | 12 |
| 5 | Olvidar el `return` dentro de un `then` | 12 |
| 6 | El `catch` que no captura | 15 |
| 7 | `all`, `allSettled`, `race`, `any` | 20 |

### Sesión 3 — async/await y fetch (≈ 130 min)

**`js/04-async-await.js`** (≈ 50 min)

| Sección | Contenido | Minutos |
|---|---|---|
| 1 | `esperar()`, `descargarInforme()`, `cronometro()` | 6 |
| 2 | `conThen()` vs `conAwait()` | 12 |
| 3 | Una `async` siempre devuelve promesa | 10 |
| 4 | `try` / `catch` / `finally` | 10 |
| 5 | Secuencial vs paralelo y el medidor de barras | 12 |

**`js/05-fetch.js`** (≈ 80 min)

| Sección | Contenido | Minutos |
|---|---|---|
| 3 | `pedirJSON()` y `pedirJSONConLimite()` | 12 |
| 4 | `obtenerUsuarios()` con respaldo simulado | 12 |
| 5 | Los cuatro estados de la interfaz | 20 |
| 6 | `cargarUsuarios()`, `aplicarFiltro()`, `vaciarLista()` | 15 |
| 7 | GET, el 404 silencioso y POST | 15 |
| 8 | `AbortController` | 6 |

Las secciones 9 y 10 (conectar botones y estado inicial) se escriben al vuelo, en 2-3 minutos
cada archivo.

---

## Cómo comparar con la solución

La solución es la **carpeta padre**, archivo por archivo y sección por sección: los números de
sección y el orden coinciden exactamente.

```
09-asincronia/
├── js/01-event-loop.js          <- solución
└── plantilla-clase/
    └── js/01-event-loop.js      <- lo que se escribe en clase
```

Recomendación: ten los dos archivos abiertos en paralelo en el editor (en VS Code, clic derecho
sobre la pestaña → «Split right»). El enlace **«la carpeta del proyecto»** del aviso amarillo de
la página abre la versión resuelta en el navegador.

---

## Antes de empezar la clase

1. Abre esta carpeta con **Live Server** (clic derecho en `index.html` → *Open with Live Server*).
   Sin Live Server el `fetch` real falla y el proyecto entra en modo simulado; funciona igual,
   pero no se ve la petición de verdad.
2. Abre DevTools con **F12** y déjalo visible: todo lo que imprime `imprimir()` sale a la vez en
   la consola del navegador y en los bloques oscuros de la página.
3. Comprueba que la consola está **limpia**. Si lo está, la plantilla está intacta.

Cada sección tiene su botón «Limpiar consola» para no arrastrar la salida de una demo a la
siguiente.
