# 06 · Manipulación del DOM

Guía docente del proyecto 06 del curso **Full Stack 2 · Desarrollo Front End**.

Este proyecto enseña el puente entre JavaScript y lo que el usuario ve: cómo el navegador
convierte el HTML en un árbol de objetos, cómo encontrar cualquier pieza de ese árbol y cómo
leerla, modificarla, crearla, moverla o eliminarla. Termina con un proyecto práctico completo:
un generador de tarjetas de producto.

Es material pensado para **varias sesiones de clase**, no para una sola.

---

## 1. Temas cubiertos

**Fundamentos**
- Qué es el DOM: el árbol de nodos y la relación entre el HTML y el objeto `document`.
- Diferencia entre `window`, `document` y `Element`. Qué es un nodo y qué es `nodeType`.

**Selección de elementos**
- `getElementById`, `getElementsByClassName`, `getElementsByTagName`.
- `querySelector` y `querySelectorAll` con selectores CSS completos.
- `HTMLCollection` **viva** frente a `NodeList` **estática** (con un experimento en vivo).
- Conversión a array real con `Array.from()` y con el operador spread `[...]`.

**Contenido**
- `textContent` vs `innerText` vs `innerHTML`: qué devuelve cada uno y cuál cuesta más.
- El riesgo de XSS de `innerHTML`, demostrado con un botón que ejecuta código ajeno.

**Atributos**
- `getAttribute`, `setAttribute`, `removeAttribute`, `hasAttribute`.
- Propiedades directas (`id`, `href`, `value`) y en qué se diferencian del atributo.
- Atributos `data-*` y el objeto `dataset` (incluida la conversión de tipos).

**Clases y estilos**
- `classList`: `add`, `remove`, `toggle`, `contains`, `replace`.
- Por qué `className` es peligroso.
- `element.style`, `setProperty`, `removeProperty` y por qué es mejor trabajar con clases.
- `getComputedStyle` y la lectura y escritura de variables CSS desde JavaScript.

**Crear, eliminar, clonar**
- `createElement`, `createTextNode`.
- `appendChild`, `append`, `prepend`, `before`, `after`, `insertAdjacentHTML`,
  `insertAdjacentElement`.
- `remove`, `removeChild`, `replaceWith`, `replaceChildren`.
- `cloneNode(true)` y `cloneNode(false)`.
- `DocumentFragment` y **medición real de rendimiento** con `performance.now()`.

**Navegación por el árbol**
- `parentElement` / `parentNode`, `children` / `childNodes`.
- `firstElementChild`, `lastElementChild`, `nextElementSibling`, `previousElementSibling`.
- `closest()` y `matches()`.

**Aplicado**
- Delegación de eventos (un solo oyente para muchos botones).
- Proyecto: generador de tarjetas de producto con formulario, validación, grilla,
  destacado y eliminación.

---

## 2. Cómo abrir el proyecto

**Basta con hacer doble clic en `index.html`.**

El proyecto es 100 % autocontenido y funciona con el protocolo `file://`: no usa módulos ES,
ni `fetch`, ni librerías externas, ni Node. No hay nada que instalar.

Si se prefiere trabajar con un servidor local (recomendable si se va a editar mucho, porque
evita problemas de caché al recargar):

- **VS Code**: extensión *Live Server* → clic derecho sobre `index.html` → *Open with Live Server*.
- **Terminal**: situarse en la carpeta del proyecto y ejecutar `python3 -m http.server 8000`,
  después abrir `http://localhost:8000`.

> Consejo de clase: si se edita un archivo y el cambio no se ve, recargar forzando la caché
> con `Cmd + Shift + R` (Mac) o `Ctrl + F5` (Windows).

### Estructura

```
06-dom/
  index.html
  css/estilos.css
  js/00-utilidades.js            consola visual compartida
  js/01-seleccion.js             qué es el DOM + selección
  js/02-contenido-y-atributos.js textContent/innerHTML, atributos, dataset
  js/03-clases-y-estilos.js      classList, style, getComputedStyle
  js/04-crear-y-eliminar.js      crear, insertar, borrar, clonar, fragmentos
  js/05-navegar-el-arbol.js      padres, hijos, hermanos, closest, matches
  js/06-laboratorio.js           panel de demostración en vivo
  js/07-proyecto-tarjetas.js     proyecto práctico
  README.md
```

### La consola visual

Cada sección tiene un bloque `<pre class="consola">` donde el código escribe su salida.
Sirve para explicar en clase **sin depender de que DevTools esté abierto**, aunque todo se
imprime también en la consola real (F12). La función `imprimir()` está en `00-utilidades.js`.

**Nota técnica:** cada archivo JS está envuelto en una IIFE `(function () { ... })();`. Es
deliberado y conviene explicarlo el primer día: como los ocho archivos se cargan en la misma
página, sin la IIFE dos `const` con el mismo nombre en archivos distintos romperían la página
con `Identifier has already been declared`.

---

## 3. Orden sugerido para explicarlo en clase

Tiempo total estimado: **unas 6 horas**, repartidas en tres sesiones de dos horas.

### Sesión 1 — Entender y encontrar (120 min)

| Bloque | Contenido | Tiempo |
|---|---|---|
| 0 | Presentación del proyecto y de la consola visual. Explicar la IIFE. | 10 min |
| 1 | **¿Qué es el DOM?** El árbol de nodos. Abrir DevTools → pestaña *Elements* y enseñar que lo que se ve ahí **no** es el archivo HTML, sino el árbol vivo. | 25 min |
| 2 | `window` vs `document` vs `Element`. La analogía casa / plano / habitación. | 15 min |
| 3 | **Selección**: los cinco métodos, uno a uno. | 30 min |
| 4 | **Viva vs estática**. Ejecutar el experimento de la sección 2 y comentarlo. Es el concepto que más cuesta: dedicarle tiempo. | 25 min |
| 5 | `Array.from` y spread. Por qué una `HTMLCollection` no tiene `map()`. | 15 min |

*Cierre:* ejercicios 1 y 2 de `01-seleccion.js`.

### Sesión 2 — Leer y modificar (120 min)

| Bloque | Contenido | Tiempo |
|---|---|---|
| 1 | `textContent` vs `innerText` vs `innerHTML`. Enseñar la longitud distinta en la consola (94 vs 31 caracteres). | 25 min |
| 2 | **Demostración de XSS.** Pulsar los dos botones y comparar. Momento clave de la asignatura. | 20 min |
| 3 | Atributos y la trampa atributo/propiedad con `value`. | 20 min |
| 4 | `data-*` y `dataset`. Insistir en que **todo lo que sale de dataset es texto**. | 15 min |
| 5 | `classList` completo. Comparar con `className` y su duplicación de clases. | 25 min |
| 6 | `element.style`, la regla de oro y `getComputedStyle`. | 15 min |

*Cierre:* ejercicios 1 y 3 de `03-clases-y-estilos.js`.

### Sesión 3 — Construir (120 min)

| Bloque | Contenido | Tiempo |
|---|---|---|
| 1 | `createElement`: crear no es insertar. Enseñar `document.contains()` devolviendo `false`. | 20 min |
| 2 | Las cuatro posiciones de inserción. Que insertar un nodo existente lo **mueve**. | 20 min |
| 3 | `cloneNode`, `remove`, `replaceWith`. | 15 min |
| 4 | `DocumentFragment` y la **medición de rendimiento**. Ejecutar cada botón dos o tres veces. | 20 min |
| 5 | **Navegación**: `children` vs `childNodes`, hermanos, `closest`, `matches`. | 20 min |
| 6 | **Laboratorio en vivo**: recorrer el panel botón por botón. | 15 min |
| 7 | **Proyecto**: recorrer `crearTarjeta()` línea a línea y la delegación de eventos. | 10 min |

*Cierre:* ejercicios 1 y 2 de `07-proyecto-tarjetas.js` como tarea.

> El **laboratorio en vivo** (sección 7) también funciona muy bien como repaso suelto al
> principio de cualquier sesión: un botón, un concepto, treinta segundos cada uno.

---

## 4. Ejercicios propuestos

Están al final de cada archivo JS, en un bloque de comentarios. Recopilados aquí:

### `00-utilidades.js`
1. Añadir una función `aviso(texto)` que anteponga `[!] `.
2. Que cada línea empiece por la hora actual (`toLocaleTimeString`).
3. Función `contarNodos(elemento)` con `querySelectorAll('*')`.
4. Limpiar la consola automáticamente al superar 500 líneas.
5. **Reto:** botón que copie todas las consolas al portapapeles.

### `01-seleccion.js`
1. Seleccionar un `<h2>` de dos formas distintas.
2. Contar botones de toda la página frente a los del laboratorio.
3. Filtrar productos con nombre de más de 15 letras.
4. Repetir el experimento viva/estática eliminando en vez de añadir.
5. **Reto:** función `buscarEn(contenedor, selector)` que devuelva siempre un array.

### `02-contenido-y-atributos.js`
1. Cambiar el precio con `textContent` y explicar qué pasó con el `<strong>`.
2. Función `precioConIva(elemento)` leyendo `data-precio-base`.
3. Añadir y quitar `rel` y `target` con `setAttribute`.
4. Comprobar que `<script>` vía `innerHTML` **no** se ejecuta y razonar por qué `<img onerror>` sí.
5. **Reto:** `insertarSeguro()` que permita solo `<b>` e `<i>`.

### `03-clases-y-estilos.js`
1. Botones para destacar y quitar el destacado de todos los productos.
2. `alternarTema()` cambiando la variable CSS `--primario`.
3. `marcarSiEsLargo(elemento)` con `toggle(clase, condicion)`.
4. Comparar `style.display = 'none'` con una clase `.invisible`.
5. **Reto:** barra de progreso.

### `04-crear-y-eliminar.js`
1. Insertar tres elementos con tres métodos distintos.
2. `crearTarea(texto, completada)` + inserción con fragmento.
3. Leer `offsetHeight` dentro del bucle y volver a medir (*layout thrashing*).
4. Botón que duplique la última tarea con `cloneNode(true)`.
5. **Reto:** comparar tres formas de vaciar un contenedor midiendo tiempos.

### `05-navegar-el-arbol.js`
1. Llegar al `<h3>` usando solo navegación.
2. Función `hermanos(elemento)`.
3. Botón "Subir" que intercambie personas con `before()`.
4. Explicar la diferencia entre `childNodes.length` y `children.length`.
5. **Reto:** función `ruta(elemento)` que devuelva la ruta CSS completa.

### `06-laboratorio.js`
1. Añadir la operación `after()`.
2. Operación "contar".
3. Eliminar el primer clon en vez del último.
4. Operación "envolver" (aprovechando que insertar mueve).
5. **Reto:** eliminar un clon al pulsarlo, por delegación.

### `07-proyecto-tarjetas.js`
1. Campo "stock" con validación de entero.
2. Botón "Ordenar por precio".
3. Buscador que filtre tarjetas al escribir.
4. Suma total de precios que se recalcule sola.
5. Impedir nombres duplicados y resaltar el existente.
6. **Reto:** edición en línea del nombre con `replaceWith`.

---

## 5. Errores comunes que conviene advertir

Marcados en el código con `⚠️ ERROR COMÚN`. Los más importantes, por orden de frecuencia real:

1. **Usar un elemento que vale `null`.** Un id mal escrito devuelve `null` y a la primera
   propiedad que se toque salta `Cannot read properties of null`. Es el error número uno.
   Enseñar a leerlo: el mensaje dice exactamente qué línea y qué propiedad.

2. **Poner `#` o `.` en `getElementById` / `getElementsByClassName`.** Esas almohadillas son
   de CSS y de `querySelector`. Aquí sobran y hacen que no se encuentre nada.

3. **Olvidar `evento.preventDefault()` en un `submit`.** La página se recarga, la tarjeta
   aparece un instante y desaparece. No sale ningún error: por eso desespera tanto.

4. **Crear un elemento y no insertarlo.** El código es correcto pero no se ve nada. Falta el
   `append`. Comprobarlo con `document.contains(elemento)`.

5. **Creer que `dataset` devuelve números o booleanos.** Siempre devuelve texto.
   `dataset.precio + 10` concatena. Y ojo: `Boolean("false")` es `true`.

6. **Confundir el atributo `value` con la propiedad `.value`.** Para leer lo que escribió el
   usuario se usa **siempre** `.value`; `getAttribute('value')` devuelve el valor original del HTML.

7. **Sustituir todas las clases con `className`.** Explicar que `classList` existe precisamente
   para eso, y que el apaño de `className += ' otra'` acaba duplicando clases.

8. **Olvidar las unidades y el camelCase en `style`.** `style.width = 200` no hace nada;
   `style.background-color` es un error de sintaxis. Van `'200px'` y `backgroundColor`.

9. **Recorrer una colección viva mientras se eliminan elementos.** Al borrar el índice 0, el 1
   pasa a ser 0 y el bucle se salta la mitad. Convertir a array antes con `Array.from`.

10. **`cloneNode()` sin `true`.** El clon sale vacío. Y aunque se ponga `true`, el clon
    **duplica el id** (hay que cambiarlo) y **no copia los eventos**.

11. **Usar `firstChild` esperando el primer elemento.** Casi siempre devuelve un salto de línea.
    Se usa `firstElementChild`.

12. **`innerHTML +=` dentro de un bucle.** Reconstruye todo el subárbol en cada vuelta y
    destruye los eventos ya asignados. Alternativa: `insertAdjacentHTML` o, mejor, nodos.

13. **Guardar una referencia a un elemento que después se reemplaza.** La variable sigue siendo
    válida en JavaScript pero apunta a algo que ya no está en pantalla. Está explicado en
    `obtenerCaja()` del laboratorio.

### Dos avisos honestos para el docente

- **La medición de rendimiento no siempre impresiona.** En navegadores modernos la diferencia
  entre el bucle y el fragmento puede quedarse en pocos milisegundos, porque el motor agrupa
  el repintado. La diferencia se dispara cuando dentro del bucle se **leen** medidas
  (`offsetHeight`, `getBoundingClientRect`): es el *layout thrashing* del ejercicio 3 de ese
  archivo. Merece la pena ejecutar cada botón dos o tres veces: la primera medición siempre
  sale peor porque el motor todavía está "calentando".

- **La validación del precio con letras.** Si se escriben letras en el campo de precio aparece
  "Escribe un precio" en lugar de "El precio debe ser un número". No es un fallo: en un
  `<input type="number">` el navegador descarta lo que no sea numérico y `.value` devuelve
  cadena vacía. La comprobación con `Number.isNaN` sigue estando en el código porque será
  imprescindible cuando los datos vengan de un campo de texto o de una API.

### Demostración estrella

En el proyecto final, escribir como nombre de producto `<b>Oferta</b>` y enseñar que las
etiquetas se ven **como texto**. Ahí se entiende de golpe por qué la tarjeta se construye con
`createElement` y `textContent` en lugar de con `innerHTML`.
