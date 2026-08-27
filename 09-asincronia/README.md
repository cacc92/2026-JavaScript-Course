# 09 · Asincronía: callbacks, promesas, async/await y fetch

Guía docente del proyecto 09 del curso **Full Stack 2 · Desarrollo Front End**.

Este proyecto explica cómo JavaScript, teniendo **un solo hilo**, consigue esperar
sin bloquearse: el event loop, los temporizadores, los callbacks, las promesas,
`async/await` y `fetch`. Termina con una mini aplicación real que descarga una lista
de usuarios y gestiona los cuatro estados de interfaz (cargando, éxito, error y vacío).

Es material pensado para **tres sesiones de clase**, no para un ejemplo suelto.

---

## 1. Temas cubiertos

### Bloque 1 — Síncrono, asíncrono y el event loop (`js/01-event-loop.js`)
- Analogía de la fila del banco: síncrono vs asíncrono.
- JavaScript es de un solo hilo. Qué es la **pila de llamadas** (call stack).
- Quién ejecuta realmente los temporizadores: las **Web APIs** del navegador.
- La **cola de tareas** y el **event loop**, paso a paso.
- **Microtareas vs macrotareas**: el ejemplo de orden de ejecución con
  `console.log` + `setTimeout(0)` + `Promise.resolve().then()` y su respuesta razonada.
- Demostración real de bloqueo del hilo (la página se congela a propósito).
- `setTimeout` / `clearTimeout` y `setInterval` / `clearInterval`.

### Bloque 2 — Callbacks (`js/02-callbacks.js`)
- Qué es un callback. Callback **síncrono** (`filter`) vs **asíncrono** (`setTimeout`).
- La convención **error-first**: `callback(error, datos)`.
- **Callback hell**: la pirámide de la perdición con un caso real de cuatro niveles
  (estudiante → notas → tutor → envío del boletín).
- La misma lógica aplanada con promesas y la técnica de **promisificar**.

### Bloque 3 — Promesas (`js/03-promesas.js`)
- Los **tres estados**: `pending`, `fulfilled`, `rejected`. Solo se cambia una vez.
- Crear promesas con `new Promise((resolve, reject) => ...)`.
- Consumirlas con `.then()`, `.catch()` y `.finally()`.
- **Encadenar** `then` devolviendo valores y devolviendo promesas (el "aplanado").
- Error clásico 1: **olvidar el `return`** dentro de un `then` (fallo silencioso).
- Error clásico 2: **el `catch` que no captura** (mal colocado, y el `throw` dentro
  de un `setTimeout`, que ningún `catch` puede ver).
- Combinadores: `Promise.all`, `Promise.allSettled`, `Promise.race`, `Promise.any`,
  con tabla comparativa y demos cronometradas de cuándo usar cada uno.

### Bloque 4 — async / await (`js/04-async-await.js`)
- Cómo transforma el código: el mismo ejemplo con `.then()` y con `await`.
- Una función `async` **siempre** devuelve una promesa (aunque devuelva `42`).
- Manejo de errores con `try` / `catch` / `finally`.
- **`await` en bucle (secuencial) vs `Promise.all` (paralelo)**, con la diferencia de
  tiempo medida en milisegundos y mostrada en barras.
- El matiz importante: cuándo el secuencial es lo correcto (tareas dependientes).

### Bloque 5 — fetch (`js/05-fetch.js`)
- La petición, el objeto `Response`, `response.ok`, `response.status`, `headers`.
- Las **dos promesas**: `fetch()` y `response.json()`.
- Por qué **fetch NO rechaza en un 404** y hay que comprobar `ok` a mano.
- El cuerpo solo se puede leer una vez (`body stream already read`).
- Método **POST** con cabeceras y `body: JSON.stringify(...)`.
- **AbortController** para cancelar una petición en curso, y por qué un
  `AbortError` no debe pintarse como pantalla de error.
- Los **cuatro estados de interfaz**: cargando (spinner), éxito, error (con botón de
  reintentar) y vacío.
- Delegación de eventos para el botón "Reintentar", que se crea y se destruye.

---

## 2. Estructura de archivos

```
09-asincronia/
├─ index.html               Página del proyecto, con índice de anclas
├─ css/
│  └─ estilos.css           Tema oscuro, spinner, tarjetas, consolas visuales
├─ js/
│  ├─ 01-event-loop.js      Síncrono/asíncrono, event loop, temporizadores
│  ├─ 02-callbacks.js       Callbacks, error-first, callback hell
│  ├─ 03-promesas.js        Estados, then/catch/finally, combinadores
│  ├─ 04-async-await.js     async/await, try/catch, secuencial vs paralelo
│  └─ 05-fetch.js           fetch, POST, AbortController, la app de usuarios
└─ README.md                Este archivo
```

Cada archivo `.js` está envuelto en una **IIFE** — `(function () { ... })();` — porque
los cinco se cargan en el mismo `index.html`. Sin la IIFE, las cinco funciones
`imprimir()` chocarían y el navegador daría el error
`Identifier 'imprimir' has already been declared`. Merece la pena explicar esto en
clase: es un patrón que verán en muchísimo código real.

---

## 3. Cómo abrir el proyecto

### Opción A — Doble clic (rápida, pero fetch irá en modo simulado)

Haz doble clic en `index.html`. Todo el proyecto funciona: las cinco secciones, el
event loop, las promesas, `async/await` y la lista de usuarios.

Lo único que **no** funcionará es el `fetch` real: al abrir con el protocolo
`file://` el navegador bloquea las peticiones a otros orígenes. La aplicación lo
detecta, lo dice en la consola visual y **pasa automáticamente al modo simulado**
(ver apartado 4). La insignia de la página lo indica en amarillo.

### Opción B — Live Server de VS Code (recomendada, con fetch real)

1. En VS Code, instala la extensión **Live Server** (autor: Ritwick Dey).
2. Abre la carpeta del curso en VS Code.
3. Clic derecho sobre `09-asincronia/index.html` → **Open with Live Server**.
4. Se abrirá algo como `http://127.0.0.1:5500/09-asincronia/index.html`.

Ahora el `fetch` a `https://jsonplaceholder.typicode.com/users` funciona de verdad y
la insignia se pondrá en verde: **"datos de la API real (10)"**.

### Opción C — Servidor de Python (sin instalar nada más)

En macOS y Linux, Python 3 ya viene instalado. Desde la carpeta del curso:

```bash
cd "/Users/ccarrascocarre/Documents/workspace/2026 - FULLSTACK 2/Java Script"
python3 -m http.server 8000
```

Y abre en el navegador: `http://localhost:8000/09-asincronia/index.html`
(para detener el servidor, `Ctrl + C` en la terminal).

> **No se necesita Node.js, ni npm, ni ninguna librería externa.** Todo el proyecto es
> JavaScript puro (vanilla) y no descarga nada de ningún CDN.

---

## 4. El modo simulado (léelo antes de dar la clase)

Un `fetch` a una API pública falla si no hay internet, si la red del centro la bloquea,
si la API está caída o si abrimos el HTML con `file://`. Para que la clase **no dependa
de eso**, la función `obtenerUsuarios()` de `js/05-fetch.js` hace lo siguiente:

1. Intenta un `fetch` real a `https://jsonplaceholder.typicode.com/users`, con un
   límite de 6 segundos impuesto con `AbortController`.
2. Comprueba `response.ok` y que lo recibido sea realmente un array con datos.
3. Si **cualquier** cosa falla, entra en el `catch` y devuelve un array de
   **usuarios simulados** definido en el propio archivo, tras un retraso artificial
   con una promesa y `setTimeout` (para que el spinner de carga se vea igual).
4. En los dos casos devuelve el mismo objeto: `{ origen, usuarios, motivo }`.

La página muestra siempre una **insignia** con el origen de los datos:

| Insignia | Significado |
|---|---|
| verde — "datos de la API real (10)" | el `fetch` funcionó |
| amarilla — "modo simulado (10)" | el `fetch` falló y se usó el plan B |
| roja — "error al cargar" | error deliberado del botón de demostración |

Los datos simulados tienen **exactamente la misma forma** que los de la API real
(`name`, `email`, `address.city`, `company.name`), así que el código que pinta las
tarjetas es idéntico en los dos casos. Es un buen momento para hablar de contratos de
datos y de por qué los datos de prueba deben imitar la forma de los reales.

---

## 5. Orden sugerido para explicarlo en clase

Total aproximado: **3 sesiones de 90 minutos**. Los tiempos incluyen la práctica.

### Sesión 1 — Los cimientos (90 min)

| Tiempo | Bloque | Qué hacer |
|---|---|---|
| 10 min | Presentación | Analogía de la fila del banco. ¿Por qué se congela una web? |
| 20 min | 1.1 · Orden de ejecución | **Antes de pulsar el botón**, que la clase prediga el orden en un papel. Luego "Ejecutar demo de orden" y después "Explicar el resultado". Es el momento clave del día. |
| 15 min | 1.1 ter · Bloqueo del hilo | Pulsar "Bloquear el hilo 2 segundos" y que intenten pulsar otro botón. Ver que no responde. |
| 20 min | 1.2 y 1.3 · Temporizadores | `setTimeout`/`clearTimeout` y `setInterval`/`clearInterval`. Insistir en el `clearInterval`. |
| 20 min | Práctica | Ejercicios 1 y 2 de `01-event-loop.js` (predecir el orden, cronómetro). |
| 5 min | Cierre | Repetir la regla de oro: síncrono → microtareas → macrotareas. |

### Sesión 2 — De los callbacks a las promesas (90 min)

| Tiempo | Bloque | Qué hacer |
|---|---|---|
| 10 min | Repaso | Volver a lanzar la demo de orden de ejecución. Preguntar el porqué. |
| 15 min | 2.1 y 2.2 · Callbacks | Callback síncrono vs asíncrono. Convención error-first. |
| 15 min | 2.3 · Callback hell | Proyectar el código de `demoCallbackHell()` y **contar los `if (error)`** en voz alta. Que sufran un poco. |
| 10 min | 2.4 · La misma lógica plana | Enseñar el contraste inmediato. Un solo `.catch()`. |
| 20 min | 3.1 a 3.4 · Promesas | Los 3 estados, `new Promise`, `then/catch/finally`, encadenar. |
| 15 min | 3.5 y 3.6 · Errores clásicos | Olvidar el `return` y el `catch` mal colocado. Avisar de que el error rojo del caso B es intencionado. |
| 5 min | Cierre | Encargar los ejercicios 1 y 2 de `03-promesas.js`. |

### Sesión 3 — async/await y fetch (90 min)

| Tiempo | Bloque | Qué hacer |
|---|---|---|
| 15 min | 3.7 a 3.10 · Combinadores | Repasar la tabla de la página y lanzar las cuatro demos. Insistir en `allSettled` para informes. |
| 15 min | 4.1 a 4.3 · async/await | El mismo código en los dos estilos. "Una `async` siempre devuelve promesa". `try/catch/finally`. |
| 15 min | 4.4 a 4.6 · Rendimiento | **"Comparar los dos y medir"**. Ver las barras. Es el momento más rentable de la sesión. Recordar el matiz de las tareas dependientes. |
| 20 min | 5.1 a 5.3 · fetch | `Response`, el 404 silencioso, POST con JSON. Hacerlo con Live Server para que sea real. |
| 10 min | 5.4 · AbortController | Iniciar la petición lenta y cancelarla. `error.name === 'AbortError'`. |
| 10 min | 6 · Proyecto práctico | Recorrer los cuatro estados: cargar, filtrar sin resultados, provocar error, reintentar. |
| 5 min | Cierre | Encargar el ejercicio 5 de `05-fetch.js` como trabajo largo. |

---

## 6. Ejercicios propuestos (recopilados)

Los enunciados completos están al final de cada archivo `.js`, en un bloque de
comentarios titulado `EJERCICIOS PROPUESTOS`.

### `01-event-loop.js`
1. *(fácil)* **Predecir sin ejecutar** — ordenar cinco mensajes con `setTimeout` y `Promise.resolve` y justificar el resultado.
2. *(fácil)* **Cronómetro visible** — botones de iniciar y parar, sin permitir intervalos duplicados.
3. *(medio)* **Semáforo automático** — tres colores con un único `setInterval` y tiempos distintos por fase.
4. *(medio)* **Antirrebote (debounce)** — función que devuelve otra función y cancela el temporizador anterior.
5. *(difícil)* **Trocear un cálculo pesado** — sumar 50 millones sin congelar la página, cediendo el hilo con `setTimeout(..., 0)`.

### `02-callbacks.js`
1. *(fácil)* **Tu primer callback asíncrono** — `saludarDespues(nombre, ms, callback)`.
2. *(fácil)* **Error-first bien hecho** — `buscarMatricula(id, callback)` con los dos casos.
3. *(medio)* **Ampliar la pirámide** — añadir un quinto nivel y cronometrar cuánto cuesta.
4. *(medio)* **Callback hell con datos que faltan** — comprobar que cada error se captura en su nivel.
5. *(difícil)* **Promisificar de verdad** — reescribir el flujo con `.then()` y luego con `async/await`.

### `03-promesas.js`
1. *(fácil)* **Tu primera promesa** — `lanzarDado()` que se cumple o se rechaza.
2. *(fácil)* **La cadena del carrito** — tres `then` encadenados: suma, IVA, formato.
3. *(medio)* **Reintentos automáticos** — `reintentar(crearPromesa, intentos)` con recursión en el `catch`.
4. *(medio)* **Timeout reutilizable** — `conLimite(promesa, ms)` usando `Promise.race`.
5. *(difícil)* **Panel de estado de servicios** — cinco servicios con `Promise.allSettled` y resultado en tarjetas.

### `04-async-await.js`
1. *(fácil)* **Traducir de `then` a `await`** — sin mirar la solución del archivo.
2. *(fácil)* **Contar hasta cinco despacio** — comprobar que la página sigue respondiendo.
3. *(medio)* **Paralelizar de verdad** — cronometrar con 3, 6 y 12 tareas.
4. *(medio)* **Paralelo con límite de concurrencia** — `enTandas(tareas, tamanoDeTanda)`.
5. *(difícil)* **Cadena con dependencias y reintentos** — mezclar secuencial y paralelo en un mismo flujo.

### `05-fetch.js`
1. *(fácil)* **Otro recurso de la misma API** — `/posts/1`, comprobando `response.ok`.
2. *(fácil)* **Contador de estados** — cuántas veces se entra en cargando, éxito, error y vacío.
3. *(medio)* **Detalle del usuario** — panel lateral con su propio estado de carga y delegación de eventos.
4. *(medio)* **Usuarios y publicaciones en paralelo** — `Promise.all` sobre `/users` y `/posts`.
5. *(difícil)* **Buscador con antirrebote y cancelación** — búsqueda contra el servidor, `AbortController` y control de respuestas obsoletas.

---

## 7. Errores comunes que el docente debe advertir

Todos están marcados en el código con `// ERROR COMUN:` y `// BUENA PRACTICA:`.

### Sobre el event loop y los temporizadores
1. **Creer que `setTimeout(fn, 0)` ejecuta `fn` "ahora mismo".** El `0` es un *mínimo*
   de espera, no una garantía de inmediatez. La tarea se encola.
2. **Pasar la función con paréntesis:** `setTimeout(miFuncion(), 1000)` la ejecuta al
   instante y le pasa a `setTimeout` el resultado (normalmente `undefined`).
3. **Olvidar `clearInterval`.** El intervalo sigue corriendo aunque el elemento haya
   desaparecido. Es una fuga de memoria clásica.
4. **No guardar el identificador del temporizador**, y quedarse sin poder cancelarlo.
5. **Hacer cálculos pesados en el hilo principal** y congelar toda la interfaz.

> **Matiz que casi siempre se explica mal:** `fetch` no es "una macrotarea" a secas.
> La *llegada* de la respuesta desde la red la programa el navegador como macrotarea,
> pero el `.then()` (o la línea siguiente al `await`) es una **microtarea**, porque lo
> que `fetch` devuelve es una promesa. Frase para la pizarra:
> *espera como macrotarea, continúa como microtarea*.

### Sobre callbacks
6. **Usar el resultado en la línea siguiente** a la llamada asíncrona. Todavía no existe;
   solo existe dentro del callback.
7. **Olvidar el `return` después de llamar al callback con error**, y acabar llamándolo
   dos veces.
8. **Pensar que el callback hell es solo un problema estético.** El problema real es
   que el manejo de errores se repite y no se puede centralizar.

### Sobre promesas
9. **Olvidar el `return` dentro de un `then`.** No da ningún error: simplemente el
   siguiente `then` recibe `undefined` y se ejecuta antes de tiempo. Fallo silencioso,
   media hora perdida.
10. **Colocar el `.catch()` en medio de la cadena.** Solo cubre lo que está por encima
    de él. El `catch` va al final.
11. **Lanzar (`throw`) dentro de un `setTimeout` que está dentro del ejecutor.** Ese
    error no lo captura nadie y la promesa queda pendiente para siempre. Hay que usar
    `reject()`.
12. **Rechazar con un texto en vez de con un `Error`.** Se pierden el nombre y la traza.
13. **Confundir `Promise.race` con `Promise.any`.** `race` termina con la primera que
    cambie de estado (aunque sea un fallo); `any` espera a la primera que se *cumpla*.
14. **Creer que un `Promise.all` que falla cancela las demás promesas.** No las cancela:
    siguen corriendo, simplemente su resultado ya no le importa a nadie.

### Sobre async/await
15. **Usar el resultado de una función `async` sin `await`.** Se obtiene la promesa,
    no el valor: `"[object Promise]10"`.
16. **Poner el `await` fuera del `try`.** Si la promesa se rechaza, el error se escapa
    como `Uncaught (in promise)`.
17. **`catch (e) { }` vacío.** El fallo desaparece y nadie se entera. O se informa al
    usuario, o se relanza con `throw`.
18. **`await` dentro de un bucle con tareas independientes.** Multiplica el tiempo por el
    número de tareas. Pero ojo con el extremo contrario: **paralelizar tareas que sí
    dependen unas de otras** produce datos incompletos o errores.

### Sobre fetch
19. **Suponer que un 404 o un 500 rechazan la promesa. NO LO HACEN.** Hay que comprobar
    `response.ok` y lanzar el error a mano. Es, con diferencia, el error número uno.
20. **Olvidar el `await` de `response.json()`** y trabajar con una promesa como si fuera
    un objeto.
21. **Leer el cuerpo dos veces.** `body stream already read`. Se guarda en una variable.
22. **Enviar un objeto directamente en `body`** en lugar de `JSON.stringify(objeto)`, o
    no poner la cabecera `Content-Type: application/json`.
23. **Pintar una pantalla de error cuando el usuario ha cancelado la petición.** Hay que
    distinguirlo con `error.name === 'AbortError'`.
24. **Diseñar solo el estado de éxito.** Sin estado de carga la app parece rota; sin
    estado de error el usuario no sabe qué pasó; sin estado vacío se confunde "no hay
    resultados" con "algo falló".
25. **Usar `innerHTML` con datos que vienen del servidor.** Si el texto contiene
    etiquetas HTML, se ejecutan: eso es un XSS. En este proyecto todo se pinta con
    `createElement` y `textContent`.

---

## 8. Notas técnicas

- **Sin dependencias.** JavaScript puro, sin CDN, sin bundler, sin Node.js.
- **Nada se ejecuta al cargar la página** salvo un mensaje de bienvenida en la consola
  general. Todas las demos esperan a que se pulse un botón, para que el docente controle
  el ritmo.
- **No se usa `alert()` ni `prompt()`** en ningún momento.
- **Consolas visuales independientes** por sección (`#salida-eventloop`,
  `#salida-callbacks`, `#salida-promesas`, `#salida-async`, `#salida-fetch`), además de
  la consola general `#salida`. Todo lo que aparece en ellas se imprime también con
  `console.log`, así que DevTools muestra exactamente lo mismo.
- **Dos errores rojos en DevTools son intencionados** y forman parte de la explicación:
  el `throw` dentro de `setTimeout` (sección 3.6) y el 404 de la sección 5.2. Conviene
  avisarlo antes de que alguien levante la mano.
- **Accesibilidad:** las consolas y la zona de usuarios llevan `aria-live="polite"`, el
  foco de teclado es visible y la animación del spinner se ralentiza si el sistema pide
  `prefers-reduced-motion`.
- **Responsive:** una sola media query a 640 px; el resto del diseño usa `grid` con
  `auto-fit` y `minmax`, así que se adapta solo.
