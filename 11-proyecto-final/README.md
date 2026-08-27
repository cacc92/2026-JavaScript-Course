# 11 · Proyecto final integrador: tienda con carrito (TechStore)

Material de clase para **Full Stack 2 · Desarrollo Front End**.
Proyecto autocontenido, sin dependencias, sin Node y sin librerías externas: solo HTML, CSS y JavaScript puro.

> Este es el proyecto **capstone** del curso. No introduce ningún concepto nuevo: reúne los diez proyectos anteriores en una sola aplicación real y funcional. El objetivo pedagógico no es aprender una API más, sino **ver cómo encajan entre sí** las piezas que hasta ahora se estudiaron por separado.

---

## Qué construimos

**TechStore**, una tienda de tecnología con:

- Catálogo de 16 productos que llega desde una promesa (servidor simulado) con esqueletos de carga.
- Buscador en vivo que ignora tildes y mayúsculas.
- Filtro por categoría (los botones se generan solos a partir de los datos).
- Ordenamiento por precio, valoración y nombre.
- Carrito construido con una clase, con getters calculados para subtotal, IVA y total.
- Control de stock real: no se puede añadir más de lo que hay.
- Panel lateral deslizante con delegación de eventos.
- Persistencia del carrito en `localStorage` entre recargas.
- Checkout en modal con validación campo a campo y expresiones regulares.
- Avisos emergentes (toasts) en lugar de `alert()`.
- Precios formateados con `Intl.NumberFormat`.

---

## Temas cubiertos y de dónde vienen

| Unidad del curso | Qué aporta a TechStore | Archivo donde se ve |
|---|---|---|
| **01** Fundamentos | Tipos, `const`/`let`, conversión numérica, plantillas con backticks, precisión decimal | `js/01-utilidades.js` |
| **02** Control de flujo | `if`/`else`, `switch` del ordenamiento, ternarios, salidas tempranas | `js/05-app.js` |
| **03** Funciones | Funciones puras, parámetros por defecto, parámetros rest, callbacks, closures | `js/01-utilidades.js`, `js/03-clases.js` |
| **04** Arrays | `map` para pintar, `filter` para buscar y filtrar, `sort` para ordenar, `reduce` para los totales, `Set` para las categorías | `js/02-datos.js`, `js/03-clases.js`, `js/05-app.js` |
| **05** Objetos | Array de objetos, destructuring, spread, `Object.keys/entries/fromEntries`, `JSON` | todos |
| **06** DOM | `getElementById`, `querySelector`, `innerHTML`, `textContent`, `createElement`, `classList`, `dataset` | `js/04-ui.js` |
| **07** Eventos y formularios | `input`, `change`, `click`, `submit`, `keydown`, `focusout`, `preventDefault`, **delegación**, validación, `localStorage` | `js/05-app.js` |
| **08** POO | Clases `Producto`, `LineaCarrito`, `Carrito` y `Almacen`; campos privados `#`, getters, métodos estáticos, `instanceof` | `js/03-clases.js` |
| **09** Asincronía | `new Promise`, `setTimeout`, `resolve`/`reject`, `async`/`await`, `try`/`catch`/`finally` | `js/02-datos.js`, `js/05-app.js` |
| **10** JavaScript moderno | Encadenamiento opcional `?.`, fusión nula `??`, spread, plantillas, patrón *namespace* como sustituto de los módulos | todos |

### Conceptos de arquitectura (lo verdaderamente nuevo)

Estos tres no son "temas" sueltos, son la razón de ser del proyecto final:

1. **Separación de responsabilidades.** Los datos no pintan, la interfaz no calcula y las clases no saben que existe el DOM.
2. **Renderizado a partir del estado.** Un evento nunca toca el DOM directamente: cambia el estado y llama a `renderizar()`. Es la idea que hay detrás de React, Vue y Angular, hecha a mano y en 20 líneas.
3. **Patrón observador.** El carrito avisa a quien se haya suscrito; no sabe quién le escucha ni qué hará con el aviso.

---

## Estructura de archivos

```
11-proyecto-final/
├── index.html              La página: teoría, tienda, panel, modal y bitácora
├── css/
│   └── estilos.css         La hoja más elaborada del curso, comentada regla a regla
├── js/
│   ├── 01-utilidades.js    Consola visual, Intl.NumberFormat, escapado, esperar()
│   ├── 02-datos.js         Catálogo y la promesa que simula el servidor
│   ├── 03-clases.js        Producto, LineaCarrito, Carrito y Almacen
│   ├── 04-ui.js            Todo lo que dibuja en el DOM (y solo eso)
│   └── 05-app.js           Estado, eventos, validación y arranque
└── README.md               Esta guía
```

Los cinco archivos JavaScript comparten un único objeto global, `TIENDA`, y cada uno cuelga su parte de él. Todos van envueltos en una IIFE para no chocar entre sí.

---

## Cómo abrir el proyecto

**Opción A (la más simple):** doble clic en `index.html`.
Funciona con el protocolo `file://` porque **no** se usan módulos ES ni `fetch`.

> ⚠️ Aviso sobre `localStorage` en `file://`: Chrome lo permite; Safari y Firefox pueden bloquearlo según su configuración. El código está protegido con `try/catch` y, si no puede guardar, muestra un aviso en lugar de romperse. Para que la persistencia funcione con seguridad en clase, usa la opción B.

**Opción B (recomendada para clase):** servidor local.

- Extensión **Live Server** de VS Code: clic derecho sobre `index.html` → *Open with Live Server*.
- O bien, desde la terminal, dentro de la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

y abrir `http://localhost:8000`.

Ten abierta la consola del navegador con `F12`: todos los mensajes de la bitácora se escriben también ahí.

---

## Orden sugerido para explicarlo en clase

El proyecto da para **tres sesiones de dos horas**. Los tiempos son orientativos e incluyen las pausas para preguntas.

### Sesión 1 · Arquitectura, datos y catálogo (120 min)

| Bloque | Tiempo | Contenido |
|---|---|---|
| 1. Demostración | 10 min | Abrir la tienda terminada y usarla delante de la clase: buscar, filtrar, añadir, recargar la página y ver que el carrito sigue ahí. Nadie escribe código todavía. |
| 2. El plano | 15 min | Sección "Mapa" de la página. Recorrer la tabla que conecta cada unidad del curso con su parte del proyecto. Explicar la separación datos / lógica / interfaz. |
| 3. El patrón *namespace* y las IIFE | 15 min | `js/01-utilidades.js`, cabecera. Por qué `window.TIENDA = window.TIENDA \|\| {}`, qué problema resuelve la IIFE y en qué se parece a `export`. |
| 4. Utilidades | 25 min | `imprimir()`, `Intl.NumberFormat` (cambiar moneda en vivo), `escaparHTML()` y el porqué, `normalizarTexto()` con el truco de las tildes, `esperar()` como promesa. |
| 5. Los datos | 20 min | `js/02-datos.js`: el array de objetos, por qué el precio es un número y no un texto, `Object.freeze`, las categorías deducidas con `Set`. |
| 6. La promesa de carga | 25 min | `cargarCatalogo()` línea a línea. Subir `RETARDO_CARGA` a 3000 y pulsar "Recargar el catálogo". Después pulsar "Simular un error de red" y ver el `catch`. |
| 7. Cierre | 10 min | Ejercicios 1 y 2 de `02-datos.js`: añadir productos y una categoría nueva. |

### Sesión 2 · Clases, DOM y eventos (120 min)

| Bloque | Tiempo | Contenido |
|---|---|---|
| 1. Repaso | 10 min | Revisar los productos que añadió la clase y comprobar que el filtro apareció solo. |
| 2. Clase `Producto` | 20 min | Campos privados, validación en el constructor, getters (`estadoStock`, `textoStock`, `degradado`), método estático `desdeLista()`. |
| 3. Clase `Carrito` | 35 min | **El bloque más importante del curso.** Por qué los totales son getters y no propiedades. `reduce` en `subtotal` y `cantidadTotal`. Control de stock en `agregar()`. Por qué los métodos devuelven `{ ok, tipo, mensaje }` en lugar de mostrar avisos. |
| 4. Capa de interfaz | 25 min | `js/04-ui.js`: el objeto `el` con las referencias, el patrón `map + join('') + innerHTML`, los atributos `data-*` sembrados en las plantillas. |
| 5. Delegación de eventos | 25 min | `js/05-app.js`, secciones 6 y 7. Un solo listener para 16 botones "Agregar" y otro para todos los botones del carrito. Demostrar en vivo por qué un listener por botón se rompería al repintar. |
| 6. Cierre | 5 min | Pulsar "Ver el estado interno" y leer la bitácora completa. |

### Sesión 3 · Formularios, asincronía y cierre (120 min)

| Bloque | Tiempo | Contenido |
|---|---|---|
| 1. Estado y renderizado | 20 min | El objeto `estado`, `productosVisibles()` con la cadena filtro → búsqueda → orden, y el `switch` de los comparadores de `sort`. |
| 2. Persistencia | 20 min | Clase `Almacen`, `toJSON()`, `Carrito.desdeDatos()`. Añadir productos, recargar, y después pulsar "Borrar el carrito guardado". Mostrar el contenido real en `Application → Local Storage`. |
| 3. Validación | 30 min | Los cuatro validadores, las expresiones regulares pieza a pieza, `focusout` frente a `input`, el `preventDefault()` del `submit`. Rellenar el formulario con el botón del laboratorio, estropear un campo y enviar. |
| 4. El pedido | 15 min | `FormData` + `Object.fromEntries`, el orden correcto (leer el pedido **antes** de vaciar el carrito), la pantalla de confirmación. |
| 5. El CSS | 20 min | Recorrer `css/estilos.css`: `grid` responsive con `auto-fill`/`minmax`, el panel deslizante con `translateX`, los esqueletos animados con `@keyframes`, y la accesibilidad (`focus-visible`, `prefers-reduced-motion`). |
| 6. Cierre del curso | 15 min | Repartir los ejercicios finales y proponer el proyecto de evaluación. |

---

## Ejercicios propuestos (recopilación)

Cada archivo `.js` termina con sus propios ejercicios. Aquí están todos juntos para poder repartirlos.

### Globales (sección "Ejercicios" de la página)

1. Añadir tres productos de una categoría nueva y comprobar que el botón de filtro aparece solo.
2. Cambiar el IVA y la moneda al del propio país y verificar que todos los precios cambian a la vez.
3. Añadir una opción de orden "Solo disponibles primero".
4. Mostrar una etiqueta "Últimas unidades" cuando el stock sea 3 o menos.
5. Lista de favoritos con su propio botón y su propia clave en `localStorage`.
6. Campo de cupón: `ESTUDIANTE10` aplica un 10 % de descuento antes del IVA.
7. Historial de pedidos confirmados, guardado y mostrado en una tabla.
8. Sustituir el catálogo local por un `productos.json` cargado con `fetch()`.

### `01-utilidades.js`

1. Cambiar idioma y moneda del formateador. 2. Utilidad `mayusculaInicial()`. 3. `formatearPrecioSinDecimales()`. 4. Medias estrellas en `estrellas()`. 5. Implementar `debounce()`.

### `02-datos.js`

1. Categoría nueva. 2. Jugar con `RETARDO_CARGA`. 3. `productosPorCategoria()` con `reduce`. 4. Fallo aleatorio de red. 5. Segunda promesa y `Promise.all()`. 6. Migrar a `fetch()` con un JSON externo.

### `03-clases.js`

1. Getter `esCaro`. 2. Getter `numeroDeLineas`. 3. `aplicarCupon()` respetando el orden descuento → IVA. 4. Subclase `ProductoDigital` (polimorfismo). 5. Historial privado y `deshacer()`. 6. Caducidad de 24 horas en `Almacen`.

### `04-ui.js`

1. Número de esqueletos. 2. Etiqueta "Top ventas". 3. Reescribir una plantilla con `createElement`. 4. Toast que se cierra al pulsarlo. 5. Trampa de foco en el modal. 6. Animación del contador.

### `05-app.js`

1. Orden "Nombre (Z-A)". 2. Atajo de teclado `/` para el buscador. 3. Persistir filtro y orden. 4. Botón "Limpiar filtros". 5. Contador de resultados en cada categoría. 6. `debounce` en el buscador. 7. Descontar stock al confirmar el pedido. 8. Vista "Mis pedidos".

---

## Errores comunes que conviene advertir

Están marcados en el código con `// ⚠️ ERROR COMÚN`. Estos son los que más se repiten en clase:

### Estructura y carga

1. **Poner los `<script>` en el `<head>` sin `defer`.** El JavaScript se ejecuta antes de que exista el HTML y todos los `getElementById()` devuelven `null`.
2. **Declarar la misma variable global en dos archivos.** Rompe con `Identifier has already been declared` y la página entera deja de funcionar. Solución: IIFE.

### Datos y arrays

3. **Guardar el precio como texto** (`"89,90 €"`). Después no se puede sumar. Los precios se guardan como números y se formatean solo al mostrarlos.
4. **Olvidar el `join('')`** tras un `map` que devuelve HTML: aparecen comas sueltas por toda la página.
5. **Olvidar el valor inicial de `reduce`.** Con el array vacío lanza *"Reduce of empty array with no initial value"*.
6. **`sort()` muta el array original.** Hay que ordenar siempre sobre una copia.
7. **Ordenar textos con `>` o `<`** en lugar de `localeCompare`: la Ñ acaba detrás de la Z.

### Objetos y clases

8. **Guardar el total como propiedad** y actualizarlo a mano en cada método. Tarde o temprano se desincroniza. Con un getter es imposible.
9. **Devolver el array privado tal cual** desde un getter: quien lo reciba puede hacerle `push` y saltarse todas las validaciones.
10. **Que la clase muestre mensajes al usuario.** Rompe la separación de responsabilidades: la clase devuelve un resultado, la interfaz decide cómo mostrarlo.

### DOM y eventos

11. **Un listener por cada botón generado dinámicamente.** Al repintar desaparecen y hay que volver a registrarlos. Solución: delegación con `closest()`.
12. **Usar `change` en un campo de texto** para un buscador en vivo: solo se dispara al perder el foco y parece que no funciona. Es `input`.
13. **Olvidar `preventDefault()` en el `submit`.** La página se recarga y se pierde todo. Es el error número uno con formularios.
14. **Usar el DOM como almacén de datos** (leer la cantidad del texto de un `<span>`). El DOM es la foto del estado, nunca el estado.
15. **Insertar datos en `innerHTML` sin escaparlos.** Es la puerta de entrada del XSS. Aquí todo pasa por `escaparHTML()`.

### Asincronía y almacenamiento

16. **El `catch` vacío.** El error desaparece y luego se pierden horas buscándolo.
17. **Dar por hecho que `localStorage` siempre funciona.** Falla en modo incógnito, con la cuota llena o con `file://` en algunos navegadores. Siempre `try/catch`.
18. **Confiar en la validación del navegador** (`required`, `type="email"`) como si fuera seguridad. Se quita desde el inspector en dos clics: la validación real es la del servidor.
19. **Vaciar el carrito antes de leer los datos del pedido**, y descubrir que el resumen sale en cero.
20. **Sumar decimales sin redondear**: `0.1 + 0.2` es `0.30000000000000004`. En dinero se nota.

---

## Comprobación rápida antes de clase

1. Abrir `index.html` y ver los esqueletos de carga durante un instante.
2. Escribir `raton` (sin tilde) en el buscador: debe encontrar el "Ratón inalámbrico".
3. Intentar añadir el "Monitor portátil Viaje 15\"": su botón debe estar deshabilitado y decir *Agotado*.
4. Añadir tres veces el "Portátil Taller 16\"" (stock 2): al tercer intento aparece el aviso de stock.
5. Recargar la página: el carrito debe seguir ahí.
6. Pulsar "Finalizar compra" y enviar el formulario vacío: deben aparecer cuatro errores.
7. Pulsar "Rellenar el formulario con datos válidos" y confirmar: pantalla de pedido y carrito a cero.

---

Material didáctico · Full Stack 2 — Desarrollo Front End · JavaScript sin librerías ni dependencias.
