# Proyecto 11 · TechStore — Plantilla de clase

Versión **para escribir el JavaScript en vivo** delante de los estudiantes.

La maqueta ya está terminada: el HTML, el CSS, los ids, las clases y todos los
textos de teoría son idénticos a los de la versión resuelta. Lo único que falta
es el código de la carpeta `js/`, que se teclea durante la clase siguiendo los
bloques `// TODO (en clase):`.

---

## Cómo se usa

1. Abre `plantilla-clase/index.html` con doble clic (no hace falta servidor,
   ni Node, ni npm, ni conexión a internet).
2. Abre también el proyecto resuelto de la carpeta padre en otra pestaña: es la
   solución de referencia.
3. Ten los dos archivos abiertos en paralelo en el editor: el de la plantilla y
   el mismo archivo de `../js/`. Las secciones están numeradas igual y en el
   mismo orden, así que se pueden comparar línea a línea.

### La página arranca vacía. Es lo correcto.

Al abrir la plantilla verás la maqueta completa (cabecera, barra de la tienda,
buscador, select de orden, botones del laboratorio, bitácora) pero **sin
productos**: la rejilla está vacía y el resumen dice "Cargando catálogo...".

La consola del navegador (F12) debe estar **limpia, sin un solo error rojo**.
Lo único que aparece en la bitácora son cinco líneas de confirmación:

```
01-utilidades.js cargado (PLANTILLA). ...
02-datos.js cargado (PLANTILLA). 16 productos escritos; ...
03-clases.js cargado (PLANTILLA). ...
04-ui.js cargado (PLANTILLA). ...
05-app.js cargado (PLANTILLA). ...
```

Si aparece un error rojo, es que algo se ha escrito a medias: revisa el último
bloque tecleado antes de seguir.

---

## Qué viene hecho y qué se escribe en vivo

| Pieza | Estado |
|---|---|
| `index.html` | **Hecho.** Idéntico al resuelto (salvo el aviso de modo clase y el `<title>`). |
| `css/estilos.css` | **Hecho.** Copia exacta + las reglas de `.aviso-modo-clase`. |
| `js/01-utilidades.js` · sección 2 | **Hecho.** `imprimir()`, `titulo()` y `limpiarConsola()`. Es andamiaje: sin ellas no se puede demostrar nada en pantalla desde el primer minuto. |
| `js/02-datos.js` · secciones 1 y 2 | **Hecho.** La configuración (IVA, clave de localStorage, retardo) y los 16 productos del catálogo. Teclear dieciséis objetos en clase es tiempo perdido. |
| Las cinco IIFE y los `window.TIENDA = window.TIENDA \|\| {}` | **Hecho.** Es el cableado entre archivos; su comentario explica por qué está ahí. |
| Todo lo demás | **Por escribir en vivo.** |

En dos sitios la publicación en el espacio de nombres viene ya escrita a medias
(`TIENDA.utiles` con las tres funciones de consola y `TIENDA.datos` con los
datos). No es un descuido: sin ellas, los archivos siguientes no encontrarían
nada al cargar y la página arrancaría con un error. Cada uno lleva su TODO con
la lista exacta de claves que hay que ir añadiendo.

---

## Orden recomendado y tiempos

El orden es el de los propios archivos, y no se puede alterar: cada uno usa lo
que publicó el anterior. Los minutos incluyen escribir, explicar y probar en
pantalla.

### `01-utilidades.js` — 35 min
| Sección | Contenido | Min |
|---|---|---|
| 3 | `Intl.NumberFormat`, `formatearPrecio`, `formatearNumero`, `porcentaje` | 12 |
| 4 | `escaparHTML` (XSS), `normalizarTexto` (tildes), `recortar`, `estrellas` | 12 |
| 5 | `limitar`, `redondearDinero` (el clásico `0.1 + 0.2`) | 5 |
| 6 | `esperar()`: envolver `setTimeout` en una promesa | 3 |
| 7 y 8 | `generarNumeroPedido`, `fechaLegible`, `hora` y completar `TIENDA.utiles` | 3 |

### `02-datos.js` — 25 min
| Sección | Contenido | Min |
|---|---|---|
| 2 | Los dos `Object.freeze` y por qué el congelado es superficial | 5 |
| 3 | `obtenerCategorias()` con `map` + `Set` + spread + `localeCompare` | 6 |
| 4 | `cargarCatalogo()`: `new Promise`, `resolve`, `reject`, copia con spread | 12 |
| 5 | `buscarPorId()` y completar `TIENDA.datos` | 2 |

### `03-clases.js` — 70 min (es el archivo más denso)
| Sección | Contenido | Min |
|---|---|---|
| 1 | Clase `Producto`: campos privados, constructor con destructuring, 7 getters, `toString`, `static desdeLista` | 22 |
| 2 | Clase `LineaCarrito`: getters calculados y `toJSON()` | 8 |
| 3a | Clase `Carrito`: campos privados y getters de totales con `reduce` | 15 |
| 3b | `agregar`, `cambiarCantidad`, `quitar`, `vaciar` (control de stock) | 15 |
| 3c | `suscribir` / `#notificar` (patrón observador) y `desdeDatos` | 8 |
| 4 y 5 | Clase `Almacen` (localStorage con try/catch) y publicación | 12 |

### `04-ui.js` — 60 min
| Sección | Contenido | Min |
|---|---|---|
| 1 | El objeto `el` con las 25 referencias al DOM (+ `ocultar()`, al final del archivo, se escribe la primera) | 8 |
| 2 | `toast()`: `createElement`, `appendChild`, ciclo de vida y `remove()` | 8 |
| 3 | Esqueletos, `plantillaProducto`, `pintarCatalogo`, resumen y filtros | 22 |
| 4 | `plantillaLinea`, `pintarCarrito`, contador, abrir y cerrar el panel | 14 |
| 5 | Modal: resumen del pedido, abrir, cerrar y confirmación | 12 |
| 6 y 7 | Validación visual de campos y publicación de `TIENDA.ui` | 6 |

### `05-app.js` — 75 min
| Sección | Contenido | Min |
|---|---|---|
| — y 1 | Recoger lo publicado por los cuatro archivos y crear el `estado` | 6 |
| 2 | `cargar()` con `async/await` y `try/catch/finally`; restaurar y conectar el carrito | 15 |
| 3 y 4 | `productosVisibles()` (filtro + búsqueda + `switch` de orden) y `renderizar()` | 15 |
| 5, 6 y 7 | Persistencia y los listeners con **delegación de eventos** | 15 |
| 8 y 9 | Escape y capa oscura; regex, validadores y `submit` del checkout | 20 |
| 10 y 11 | Botones del laboratorio y arranque con `cargar()` | 8 |

**Total aproximado: 4 h 25 min de tecleo y explicación**, sin contar pausas ni
preguntas. Se reparte cómodamente en cuatro o cinco sesiones.

---

## Cómo comparar con la solución

La versión resuelta está en la **carpeta padre**:

```
11-proyecto-final/
├── index.html          <- solución (doble clic para verla funcionando)
├── css/estilos.css
├── js/01-utilidades.js … 05-app.js   <- solución, archivo por archivo
└── plantilla-clase/    <- esto que estás usando
    ├── index.html
    ├── css/estilos.css
    └── js/01-utilidades.js … 05-app.js
```

- Desde la plantilla, el aviso naranja de la parte superior enlaza directamente
  con la versión resuelta.
- En el editor: abre `plantilla-clase/js/03-clases.js` y `js/03-clases.js` en
  dos paneles. Los separadores de sección numerados son idénticos, así que la
  sección 3 de uno está frente a la sección 3 del otro.
- Cada TODO indica el nombre exacto de las variables y funciones, el id del
  elemento del DOM con el que hay que trabajar y el resultado esperado en
  pantalla. Si lo que sale no coincide, la solución está a un panel de
  distancia.

## Consejos de clase

- **Sube `RETARDO_CARGA` a 3000** en `02-datos.js` el día que expliques
  promesas: los esqueletos de carga se ven con calma.
- **`btn-estado`** (🔬 Ver el estado interno) es la mejor herramienta de
  depuración de la clase: vuelca el estado y el carrito en la bitácora sin
  tocar DevTools.
- **`btn-llenar-formulario`** ahorra teclear los cinco campos del checkout cada
  vez que quieras demostrar la validación.
- Si el carrito guardado molesta entre pruebas, usa **🧹 Borrar el carrito
  guardado**.
- No toques la carpeta padre: es la solución de referencia.
