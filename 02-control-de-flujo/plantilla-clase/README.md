# 02 · Control de flujo — Plantilla de clase

Versión de **modo clase** del proyecto 02. Está pensada para que el docente
escriba el JavaScript **en vivo delante de los estudiantes**, sin perder ni un
minuto en montar el HTML y el CSS.

La versión **resuelta** vive en la carpeta padre: `../` (misma maqueta, mismo
orden de secciones, con todo el código escrito).

---

## Qué viene ya hecho y qué se escribe en vivo

### Ya hecho (no se toca en clase)

- **`index.html`** — completo. Todos los elementos, `id` y clases del proyecto
  final: las seis secciones, las cuatro consolas visuales, los botones, el input
  de la nota y el desplegable de la tabla. Idéntico al resuelto salvo tres
  detalles: el enlace de vuelta apunta a `../../index.html`, el `<title>` lleva
  el sufijo "· Plantilla de clase" y arriba del todo hay un aviso de MODO CLASE.
- **`css/estilos.css`** — copia exacta del final, más un bloque comentado al
  final para el aviso `.aviso-modo-clase`.
- **En cada archivo `.js`:**
  - la **IIFE** `(function () { ... })();` que envuelve todo (los cuatro archivos
    definen una función `imprimir`, y sin la IIFE el navegador lanzaría
    `Identifier 'imprimir' has already been declared`);
  - el `'use strict';`;
  - las funciones auxiliares **`imprimir()`** y **`titulo()`**, que pintan a la
    vez en DevTools y en la consola visual de la página;
  - los **datos de partida** (arrays, objetos y valores fijos como
    `asignaturas`, `estudiante`, `temperaturas`, `frase`, `boletin`…). Teclear
    datos en clase es tiempo perdido: lo que se escribe en vivo es la lógica.

### Se escribe en vivo

Todo lo demás. Cada sección conserva su explicación en prosa, sus separadores
numerados y sus avisos ⚠️ ERROR COMÚN y ✅ BUENA PRÁCTICA, y en el hueco donde
iba el código hay un bloque así:

```js
// TODO (en clase):
//   1. Declara una constante llamada NOMBRE con el valor "Ana".
//   2. Intenta reasignarla y observa el TypeError en la consola.
//   3. Imprime el resultado con imprimir('...') para que se vea en pantalla.
//   Resultado esperado en pantalla: Nombre: Ana
//   (aprox. 6 líneas)
```

Las instrucciones dicen el **nombre exacto** de cada variable y función, el
**`id`** del elemento del DOM con el que hay que trabajar y la **salida
esperada**, para que lo escrito en la pizarra coincida línea a línea con la
solución. El `(aprox. N líneas)` final sirve para calcular el tiempo.

---

## La página arranca vacía: es lo esperado

Al abrir `index.html` sin haber escrito nada:

- **no debe aparecer ningún error en la consola del navegador** (F12);
- las cuatro consolas visuales negras están vacías;
- el clasificador de notas muestra su texto inicial y no reacciona al botón;
- la sección de la tabla de multiplicar está vacía y el desplegable no tiene
  opciones (las doce `<option>` las genera un bucle en la sección 10 del
  archivo 04).

Eso no es un fallo: los archivos `.js` son casi solo comentarios, y son
JavaScript válido. Cada sección que se escribe hace aparecer su parte.

---

## Orden recomendado y minutos por sección

El orden es el de carga de los `<script>` en el HTML, y coincide con el índice
de la página. Los tiempos incluyen explicación en pizarra, tecleo y preguntas.

### `js/01-condicionales.js` — unos 60 min

| Sección | Contenido | Min |
|---|---|---|
| 0 | Herramientas de salida (ya hecha, solo leerla) | 3 |
| 1 | El `if` más simple | 6 |
| 2 | `if / else` | 5 |
| 3 | Cadena `if / else if / else` (el orden importa) | 8 |
| 4 | Condicionales anidados y cómo aplanarlos | 8 |
| 5 | Truthy y falsy | 10 |
| 6 | Operadores lógicos `&&`, `||`, `!` y cortocircuito | 8 |
| 7 | Operador ternario | 5 |
| 8 | Ternarios anidados (y por qué evitarlos) | 4 |
| 9 | `==` frente a `===` | 6 |
| 10 | Botón de limpiar consola | 3 |

### `js/02-switch.js` — unos 55 min

| Sección | Contenido | Min |
|---|---|---|
| 1 | Anatomía de un `switch` | 8 |
| 2 | El `switch` compara con `===` | 6 |
| 3 | El peligro del fall-through | 8 |
| 4 | Fall-through útil: agrupar casos | 8 |
| 5 | `switch (true)` para rangos | 6 |
| 6 | `switch` frente a `if / else` | 7 |
| 7 | Ámbito de variables dentro de un `case` | 6 |
| 8 | `switch` con `return` (sin `break`) | 7 |
| 9 | Demostración de `alert()` con un botón | 5 |
| 10 | Botón de limpiar consola | 2 |

### `js/03-bucles.js` — unos 90 min (mejor en dos tramos, con descanso tras la 7)

| Sección | Contenido | Min |
|---|---|---|
| 1 | El `for` clásico y sus tres partes | 10 |
| 2 | Variantes del `for` | 8 |
| 3 | Recorrer un array con `for` clásico | 6 |
| 4 | El bucle `while` | 10 |
| 5 | El bucle `do...while` | 8 |
| 6 | `for...of` con arrays y `.entries()` | 7 |
| 7 | `for...of` con textos | 7 |
| 8 | `for...in` con objetos | 7 |
| 9 | Por qué NO usar `for...in` con arrays | 6 |
| 10 | `break` | 5 |
| 11 | `continue` | 6 |
| 12 | Bucles anidados | 8 |
| 13 | Bucles infinitos y la guarda de seguridad | 10 |
| 14 | Botón de limpiar consola | 2 |

### `js/04-ejercicios-clasicos.js` — unos 100 min (dos sesiones: 1-8 y 9-11)

| Sección | Contenido | Min |
|---|---|---|
| 1 | FizzBuzz (dos versiones) | 12 |
| 2 | Contar vocales | 10 |
| 3 | Números primos | 12 |
| 4 | Factorial y el límite de precisión | 12 |
| 5 | El mayor de una lista | 8 |
| 6 | Sumar pares e impares | 7 |
| 7 | Pirámide de asteriscos | 10 |
| 8 | Tabla de multiplicar en texto | 5 |
| 9 | Clasificador de notas interactivo (DOM) | 15 |
| 10 | Tabla de multiplicar renderizada en HTML | 15 |
| 11 | Botón de limpiar y mensaje final | 4 |

Total aproximado: **unas 5 horas de clase**, es decir, varias sesiones.

---

## Cómo comparar con la solución

La solución es **la carpeta padre**, con los mismos nombres de archivo y el
mismo número y orden de secciones:

| Plantilla | Solución |
|---|---|
| `plantilla-clase/js/01-condicionales.js` | `../js/01-condicionales.js` |
| `plantilla-clase/js/02-switch.js` | `../js/02-switch.js` |
| `plantilla-clase/js/03-bucles.js` | `../js/03-bucles.js` |
| `plantilla-clase/js/04-ejercicios-clasicos.js` | `../js/04-ejercicios-clasicos.js` |

Formas de trabajar:

1. **Dos ventanas del editor en paralelo** (solución a la izquierda, plantilla a
   la derecha). Como el número y el orden de secciones coincide, se avanza a la
   par.
2. **Dos pestañas del navegador**: `../index.html` con todo funcionando y
   `plantilla-clase/index.html` con lo que se lleva escrito. Comparar la consola
   visual de una y otra es la forma más rápida de ver si falta algo.
3. **Diferencias en terminal**, para revisar al final de la sesión:

   ```bash
   diff "js/03-bucles.js" "../js/03-bucles.js"
   ```

---

## Consejos para dictar la clase

- Empieza cada sección **leyendo el comentario en prosa** que hay encima del
  TODO: ya está escrito y es el guion de la explicación.
- Provoca los errores a propósito. Varios TODO lo piden explícitamente: quitar
  las llaves de un `case` (sección 7 del archivo 02) o cambiar el orden de las
  condiciones de FizzBuzz. Ver el error en consola vale más que describirlo.
- Recarga con **F5** después de cada sección: los scripts se ejecutan al cargar.
- Los botones "Limpiar consola" son la última sección de cada archivo. Hasta que
  no se escriban, no hacen nada: avísalo para que nadie lo tome por un fallo.
- Si algo deja de imprimirse de golpe, mira la consola del navegador: un error
  de sintaxis rompe el archivo **entero**, no solo la línea donde está.
- No hace falta Node, ni npm, ni ninguna librería. Se abre `index.html` con
  doble clic y ya está.
