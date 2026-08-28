# 06 · Manipulación del DOM — Plantilla de clase

Versión de este proyecto pensada para **escribir el JavaScript en vivo delante de los
estudiantes**, con la maqueta ya montada para no perder ni un minuto en HTML ni en CSS.

---

## Para qué sirve

El proyecto resuelto (la carpeta de arriba, `../`) es la solución de referencia: está
completo y muy comentado. Esta subcarpeta es **el mismo proyecto sin el código de los
archivos `js/`**: en su lugar hay instrucciones `TODO (en clase)` que dicen, paso a paso,
qué hay que teclear para llegar exactamente al mismo resultado.

La idea es tener **las dos carpetas abiertas en paralelo**: a la izquierda la plantilla,
donde se escribe; a la derecha la solución, por si hay que consultar una línea exacta.

---

## Qué ya viene hecho y qué se escribe en vivo

| Archivo | Estado | Comentario |
|---|---|---|
| `index.html` | **Completo** | Idéntico al del proyecto resuelto: mismos ids, mismas clases, mismos textos de teoría. Solo cambia el `<title>`, el enlace de vuelta al índice y el aviso de MODO CLASE. |
| `css/estilos.css` | **Completo** | Copia exacta del proyecto, más unas reglas al final para el cartel de MODO CLASE. |
| `js/00-utilidades.js` | **Completo** | Es **andamiaje, no materia**. Contiene `imprimir()`, `titulo()` y `limpiar()`, es decir, la consola visual de la página. Sin él no se puede demostrar nada en pantalla desde el primer minuto. |
| `js/01` … `js/07` | **Por completar** | Toda la prosa, los separadores de sección numerados, los avisos ⚠️ ERROR COMÚN / ✅ BUENA PRÁCTICA y los EJERCICIOS PROPUESTOS están en su sitio. Falta el código. |

Dentro de los archivos por completar **sí vienen ya escritos**:

- La **IIFE** que envuelve cada archivo, con su comentario explicando por qué está ahí
  (evita que las variables de ocho archivos distintos choquen entre sí).
- La línea `const consola = window.Consola.crear('id-del-pre');` de cada archivo.
- Los **datos de partida**: la paleta `colores` del laboratorio (archivo 06) y el array
  `productosDeEjemplo` del proyecto final (archivo 07). Teclear datos en clase es tiempo
  perdido; lo que se escribe en vivo es la lógica que los procesa.

---

## ⚠️ La página arranca vacía, y es lo correcto

Al abrir `index.html` de esta carpeta con doble clic:

- Se ve la maqueta completa, con todas sus secciones y sus cajas de demostración.
- Las consolas visuales (`<pre class="consola">`) están **vacías**.
- La lista de tareas y la grilla de productos están **vacías**.
- Los botones **no hacen nada**.
- Y, muy importante: **la consola del navegador (F12) no muestra ni un solo error.**

Eso es exactamente el punto de partida. Cada bloque que se escriba en clase va llenando
un trozo de la página. Si aparece un error rojo en la consola, es del código recién
escrito, no de la plantilla.

---

## Orden recomendado y tiempos

Los archivos se cargan con `defer` y en orden numérico, así que hay que respetarlo: el 00
publica `window.Consola` y todos los demás lo usan.

| # | Archivo | Secciones | Minutos | Contenido |
|---|---|---|---|---|
| 00 | `00-utilidades.js` | 4 | **5** | No se escribe: se **lee en voz alta**. IIFE, patrón fábrica y `window.Consola`. |
| 01 | `01-seleccion.js` | 10 | **35** | Teoría del DOM (secc. 1-2, ~8 min) y los cinco métodos de selección (secc. 3-10). El experimento de la sección 6, colección viva vs lista estática, es el momento clave: no correr. |
| 02 | `02-contenido-y-atributos.js` | 9 | **40** | `textContent` / `innerText` / `innerHTML` (secc. 1-5, ~15 min), la demo de XSS con los dos botones (secc. 6, ~10 min) y atributos + `dataset` (secc. 7-9, ~15 min). |
| 03 | `03-clases-y-estilos.js` | 9 | **30** | `classList` completo (secc. 1-6, ~18 min) y `style` + `getComputedStyle` (secc. 7-9, ~12 min). |
| 04 | `04-crear-y-eliminar.js` | 11 | **45** | Crear e insertar (secc. 1-6, ~20 min), clonar y eliminar (secc. 7-9, ~10 min) y `DocumentFragment` con la medición de rendimiento (secc. 10-11, ~15 min). |
| 05 | `05-navegar-el-arbol.js` | 7 | **30** | Nodos vs elementos, subir, bajar y hermanos (secc. 1-4, ~18 min); `matches()` y `closest()` (secc. 5-6, ~10 min); el recorrido recursivo (secc. 7, ~5 min). |
| 06 | `06-laboratorio.js` | 4 | **35** | Las nueve operaciones del objeto `operaciones` (secc. 2, ~25 min) y la delegación de eventos (secc. 3, ~8 min). |
| 07 | `07-proyecto-tarjetas.js` | 9 | **50** | Proyecto final. Referencias y apoyos (secc. 1-2, ~8 min), `crearTarjeta` (secc. 3, ~12 min), validación del formulario (secc. 5, ~15 min), delegación en la grilla (secc. 6, ~10 min) y los botones auxiliares (secc. 7-9, ~8 min). |

**Total aproximado: 4 h 30 min de escritura en vivo.** Con pausas y preguntas, tres
sesiones de dos horas. Un corte natural: sesión 1 = archivos 01-02, sesión 2 = 03-05,
sesión 3 = 06-07.

Cada bloque `TODO` termina con una estimación del tipo `(aprox. 12 líneas)`. Sirve para
calcular sobre la marcha si da tiempo a terminar la sección antes de la pausa.

---

## Cómo comparar con la solución

La solución es **la carpeta padre**, no otro repositorio:

```
06-dom/
├── index.html              <- versión resuelta
├── css/estilos.css
├── js/01-seleccion.js      <- la solución del archivo 01
├── ...
└── plantilla-clase/        <- ESTA carpeta
    ├── index.html
    ├── css/estilos.css
    ├── js/01-seleccion.js  <- el mismo archivo, sin código
    └── README.md
```

Formas cómodas de trabajar:

1. **Dos ventanas del editor.** A la izquierda `plantilla-clase/js/01-seleccion.js`, a la
   derecha `js/01-seleccion.js`. Las secciones numeradas son las mismas y van en el mismo
   orden, así que las dos ventanas avanzan a la par.
2. **Dos pestañas del navegador.** `plantilla-clase/index.html` y `../index.html`. La
   segunda enseña "cómo debería quedar" cuando algo no sale.
3. **Diferencia por terminal**, para ver de un vistazo qué falta por escribir:
   ```
   diff js/01-seleccion.js plantilla-clase/js/01-seleccion.js
   ```

El aviso de MODO CLASE que aparece arriba de la página ya lleva un enlace directo a la
versión resuelta.

---

## Reglas de la casa

- **No hay Node, ni npm, ni librerías, ni CDNs.** Se abre `index.html` con doble clic y ya.
- **No se toca el HTML ni el CSS durante la clase.** Si algo no se ve, el fallo está en el
  JavaScript.
- **Nada de `type="module"`.** Los ocho archivos se cargan con `defer`, que garantiza el
  orden y que el DOM ya esté construido cuando se ejecutan (por eso no hace falta
  `DOMContentLoaded`).
- **Los ids del HTML son sagrados.** Los bloques `TODO` los nombran uno a uno; si se
  cambia un id, el código de la solución deja de encajar.
- Si en clase se rompe algo sin remedio: recargar la página. Todos los cambios del DOM son
  en memoria y desaparecen al recargar.
