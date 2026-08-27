# 03 · Funciones a fondo

Guía docente del tercer proyecto del curso **Full Stack 2 — Desarrollo Front End**.

Material pensado para explicarse en clase, línea por línea, proyectando la pantalla.
Todo el código está comentado en español neutro, con analogías, errores comunes marcados
con ⚠️ y buenas prácticas marcadas con ✅.

---

## 1. Temas cubiertos

| Bloque | Contenido |
|---|---|
| Qué es una función | Encapsular lógica, principio DRY, nombrar con verbos |
| Formas de declararla | Declaración vs expresión de función |
| Hoisting | Por qué una se puede llamar antes y la otra lanza `ReferenceError` |
| Parámetros y argumentos | Diferencia exacta, qué pasa si faltan o sobran |
| `return` | Salida temprana, código inalcanzable, funciones que devuelven `undefined` |
| Funciones flecha | Sintaxis completa, retorno implícito, paréntesis con un solo parámetro |
| Diferencias de las flechas | No tienen `this` propio ni `arguments` |
| Parámetros por defecto | Solo se activan con `undefined`; pueden usar parámetros anteriores |
| Parámetro rest | `...args` recoge muchos argumentos en un array real |
| Operador spread | Repartir un array en argumentos sueltos al invocar |
| Objeto `arguments` | Legado, array-like, cómo convertirlo y por qué ya no se usa |
| Ámbito (scope) | Global, de función y de bloque; `var` vs `let`/`const` |
| Cadena de ámbitos | La búsqueda va siempre de dentro hacia fuera |
| Shadowing | Una variable que tapa a otra del mismo nombre |
| Closures | Contador, fábrica de funciones y usos reales |
| Orden superior | Funciones que reciben funciones (callbacks) y que devuelven funciones |
| `map`, `filter`, `reduce` | Escritos a mano antes de usar los nativos |
| Recursión | Caso base y caso recursivo; factorial, Fibonacci, conteo regresivo |
| Memoización | Caché guardada en un closure; comparación de rendimiento medible |
| IIFE y patrón módulo | Ámbito privado y separación entre parte pública y privada |
| `this` | Función normal vs flecha; `call`, `apply`, `bind`, el truco de `self` |
| Pureza | Funciones puras vs impuras, efectos secundarios, inmutabilidad |

---

## 2. Cómo abrir el proyecto

**Doble clic en `index.html`.** No hace falta nada más: ni Node, ni npm, ni servidor,
ni conexión a internet. El proyecto es 100 % autocontenido y funciona con el protocolo
`file://`, en cualquier navegador moderno.

Conviene abrir también la consola del navegador con **F12** (pestaña *Console*), aunque
no es imprescindible: cada sección de la página tiene su propia **consola visual**, un
bloque oscuro que muestra exactamente la misma salida. Así se ve desde el fondo del aula
sin necesidad de abrir las herramientas de desarrollo.

### Estructura de archivos

```
03-funciones/
├── index.html                        Página del proyecto
├── README.md                         Esta guía
├── css/
│   └── estilos.css                   Estilos propios, comentados
└── js/
    ├── 00-utilidades.js              Consola visual (imprimir / titulo)
    ├── 01-declaracion-y-tipos.js     DRY, declaración, expresión, hoisting, flechas
    ├── 02-parametros.js              Parámetros, defecto, rest, spread, arguments
    ├── 03-scope-y-closures.js        Scope, shadowing, closures, IIFE, módulo
    ├── 04-callbacks-y-orden-superior.js  Callbacks, map/filter/reduce, composición
    ├── 05-recursion.js               Factorial, Fibonacci, árboles, demo interactiva
    ├── 06-this-y-pureza.js           this, call/apply/bind, funciones puras
    └── 07-demos-interactivas.js      Calculadora y contador con closure
```

Cada archivo `.js` envuelve su contenido en una **IIFE** para que sus variables no
choquen con las de los demás. Es importante explicarlo el primer día: si dos archivos
declarasen `const notas` en el ámbito global, el navegador rompería la página entera con
`Identifier 'notas' has already been declared`.

---

## 3. Orden sugerido para explicarlo en clase

Repartido en **tres sesiones de unos 100 minutos**. Los tiempos son orientativos e
incluyen la práctica guiada.

### Sesión A — Fundamentos de la función (100 min)

| Tiempo | Bloque | Archivo |
|---|---|---|
| 10 min | Repaso y motivación: enseñar el código repetido de la sección 1 y preguntar qué pasa si mañana cambia la fórmula | `01`, sección 1 |
| 15 min | Declaración de función. Hoisting: llamar antes de declarar y ver que funciona | `01`, sección 2 |
| 15 min | Expresión de función. Provocar el `ReferenceError` en directo y leerlo juntos | `01`, sección 3 |
| 10 min | `return`, salida temprana y funciones que devuelven `undefined` | `01`, sección 4 |
| 20 min | Funciones flecha: recorrer los tres pasos de la forma larga a la corta | `01`, sección 5 |
| 15 min | Las funciones son valores: array y objeto de funciones. Enlazar con la calculadora de la sección 7 de la página | `01`, sección 6 |
| 15 min | Práctica: ejercicios 1 a 3 del archivo `01` | — |

### Sesión B — Datos que entran y ámbito (100 min)

| Tiempo | Bloque | Archivo |
|---|---|---|
| 10 min | Parámetro vs argumento. Faltan y sobran argumentos | `02`, secciones 1-2 |
| 15 min | Parámetros por defecto. Insistir en que `null` no los activa | `02`, sección 3 |
| 20 min | Rest y spread. Usar el truco "en la definición agrupa, en la llamada reparte" | `02`, secciones 4-5 |
| 10 min | `arguments` como pieza de museo, y por qué se sustituye por rest | `02`, sección 6 |
| 10 min | Objeto como parámetro y desestructuración | `02`, secciones 7-8 |
| 25 min | Ámbito global, de función y de bloque. El bucle clásico con `var` | `03`, secciones 1-3 |
| 10 min | Cadena de ámbitos y shadowing con la analogía escuela/aula/pupitre | `03`, secciones 4-5 |

### Sesión C — Closures, orden superior y recursión (110 min)

| Tiempo | Bloque | Archivo |
|---|---|---|
| 25 min | **Closures.** El contador y la fábrica de funciones. Es el punto clave del proyecto: no correr | `03`, sección 6 |
| 10 min | Closures útiles: cuenta bancaria privada, memoización, patrón "una sola vez" | `03`, sección 6c |
| 10 min | IIFE y patrón módulo. Conectar con el porqué de las IIFE de todos los archivos | `03`, sección 7 |
| 20 min | Callbacks y orden superior. Escribir `miMap` y `miFilter` en la pizarra antes de mirar el archivo | `04`, secciones 1-3 |
| 10 min | Funciones que devuelven funciones y composición | `04`, secciones 4-5 |
| 20 min | Recursión: conteo regresivo, factorial y Fibonacci con la demo interactiva | `05` |
| 15 min | Demo en vivo: calculadora y contador. Pulsar "Intentar espiar la variable" | `07` |

### Sesión de refuerzo opcional (45 min)

| Tiempo | Bloque | Archivo |
|---|---|---|
| 25 min | `this` en función normal vs flecha, y el callback que pierde el `this` | `06`, secciones 1-3 |
| 20 min | Funciones puras, efectos secundarios e inmutabilidad | `06`, secciones 4-6 |

> **Consejo de ritmo:** los closures y `this` son los dos temas que más se atragantan.
> Si hay que recortar, recorta en `arguments` y en composición de funciones, nunca en
> closures.

---

## 4. Momentos de la clase que funcionan especialmente bien

- **Provocar el error en directo.** En la sección 3 del archivo `01`, borrar el
  `try/catch` y recargar para que el error aparezca en rojo en la consola real.
- **El bucle con `var`.** Preguntar antes de ejecutar: "¿qué creéis que va a imprimir?".
  Casi toda la clase responde 0, 1, 2. Ver el 3, 3, 3 fija el concepto para siempre.
- **El botón "Intentar espiar la variable".** Demuestra en tres líneas que la privacidad
  del closure no es una convención, sino algo que el lenguaje impone.
- **La demo de Fibonacci.** Pedir que prueben 10, 20 y 30 seguidos y observen cómo el
  número de llamadas se dispara mientras la versión con caché apenas se mueve.
- **La calculadora sin un solo `if`.** Añadir en vivo una operación nueva al objeto
  `operaciones` y recargar: aparece sola en el desplegable.

---

## 5. Ejercicios propuestos (recopilados)

Cada archivo termina con su bloque de ejercicios. Aquí están todos juntos para poder
repartirlos como práctica o como examen.

### De `01-declaracion-y-tipos.js`
1. *(Fácil)* Declaración `calcularAreaRectangulo(base, altura)`. Llamarla antes y después de escribirla.
2. *(Fácil)* Reescribirla como expresión de función y como flecha con retorno implícito.
3. *(Media)* `precioConIva(precio)` con un 21 % y dos decimales.
4. *(Media)* Añadir `invertir(texto)` al objeto `conversores`.
5. *(Difícil)* Array `validadores` con tres funciones flecha, recorrido con `for...of` mostrando `.name`.

### De `02-parametros.js`
1. *(Fácil)* `saludar(nombre, saludo = 'Hola')`.
2. *(Fácil)* `contarArgumentos(...datos)`: cuántos llegaron y de qué tipo es el primero.
3. *(Media)* `mayorDeTodos(...numeros)` sin usar `Math.max`.
4. *(Media)* `aplicarDescuento({ precio, porcentaje = 10 })` con validación de rango.
5. *(Difícil)* `fusionarAlumnos(base, ...actualizaciones)` sin modificar los originales.

### De `03-scope-y-closures.js`
1. *(Fácil)* Shadowing con una variable `etiqueta` en dos niveles.
2. *(Fácil)* `crearContadorRegresivo(inicio)` que se detenga en 0.
3. *(Media)* `crearAcumulador()` con `sumar`, `restar` y `total` privados.
4. *(Media)* Reescribir el bucle con `var` usando una IIFE para obtener 0, 1, 2.
5. *(Difícil)* `limitarLlamadas(funcion, maximo)`.

### De `04-callbacks-y-orden-superior.js`
1. *(Fácil)* `repetirAccion(veces, callback)`.
2. *(Fácil)* Con `map`, lista de textos "NOMBRE: PRECIO euros".
3. *(Media)* `miFind(array, condicion)` y comparación con `.find()`.
4. *(Media)* `crearFiltroDePrecio(maximo)`.
5. *(Difícil)* `agruparPor(array, obtenerClave)` con `reduce`.

### De `05-recursion.js`
1. *(Fácil)* `sumarHasta(n)` recursiva.
2. *(Fácil)* `contarHaciaArriba(desde, hasta)` sin bucles.
3. *(Media)* `invertirTexto(texto)` recursiva.
4. *(Media)* `esPalindromo(texto)` recursiva.
5. *(Difícil)* `buscarCategoria(nodo, nombre)` a cualquier profundidad.
6. *(Difícil)* `aplanarArray(array)` sin usar `.flat()`.

### De `06-this-y-pureza.js`
1. *(Fácil)* Objeto `libro` con método `ficha()`; sacarlo del objeto y explicar el error.
2. *(Fácil)* Repetirlo con función flecha y razonar el resultado.
3. *(Media)* Convertir en pura una función que depende de un `iva` externo.
4. *(Media)* `eliminarProducto(lista, nombre)` de forma pura.
5. *(Difícil)* Objeto `cronometro` con `setInterval`, flecha vs función normal.

### De `07-demos-interactivas.js`
1. *(Fácil)* Añadir la operación `'max'` al objeto `operaciones`.
2. *(Fácil)* Añadir la operación `'raiz'` (`a ** (1 / b)`).
3. *(Media)* Añadir un `limite` al contador.
4. *(Media)* Un segundo contador independiente en la página.
5. *(Difícil)* Método `deshacer()` con historial privado.
6. *(Difícil)* Sustituir `alert`/`prompt` por una modal con callback.

---

## 6. Errores comunes que conviene advertir

Ordenados por frecuencia real en clase.

1. **Confundir `saludar` con `saludar()`.** Sin paréntesis es la función; con paréntesis
   es el resultado. Es la causa número uno de callbacks que no funcionan:
   `addEventListener('click', calcular())` ejecuta la función al instante y registra
   `undefined` como oyente.

2. **Llamar a una expresión de función antes de declararla.** El hoisting de las
   declaraciones engaña: `const f = function...` no se puede usar antes de su línea.
   Error: `Cannot access 'f' before initialization`.

3. **Confundir mostrar con devolver.** Una función que hace `console.log()` devuelve
   `undefined`. Si el dato hace falta después, tiene que haber un `return`.

4. **Flecha con llaves y sin `return`.** `(a, b) => { a + b }` devuelve `undefined`.
   Con llaves, el `return` es obligatorio.

5. **Devolver un objeto desde una flecha sin paréntesis.** `x => { nombre: x }` no
   devuelve un objeto: hay que escribir `x => ({ nombre: x })`.

6. **`return` con el valor en la línea siguiente.** El punto y coma automático convierte
   la función en un `return undefined`. Advertirlo aunque parezca improbable: cuesta
   horas encontrarlo.

7. **Creer que el parámetro por defecto cubre a `null`.** Solo se activa con
   `undefined`. `null`, `0`, `''` y `false` son valores válidos y lo desactivan.

8. **Colocar el parámetro rest en medio.** Debe ser siempre el último, y solo puede
   haber uno. Es un `SyntaxError` que rompe el archivo entero.

9. **Pasar un array donde se esperan argumentos sueltos.** `Math.max(notas)` devuelve
   `NaN`; hace falta `Math.max(...notas)`.

10. **Usar `arguments` dentro de una flecha.** No da error inmediato: devuelve el
    `arguments` de la función normal que la contenga, con datos que no corresponden.
    Silencioso y confuso. Usar siempre `...rest`.

11. **`var` dentro de un bucle que crea funciones.** Todas comparten la misma variable.
    Con `let` cada vuelta tiene la suya.

12. **Shadowing accidental.** Volver a declarar con `let`/`const` una variable que se
    quería modificar. Para cambiar la de fuera, se asigna sin declarar.

13. **Recursión sin caso base, o con un caso base inalcanzable.** Provoca
    `RangeError: Maximum call stack size exceeded`. Preguntar siempre dos cosas:
    ¿cuándo paro? y ¿el problema se hace más pequeño en cada llamada?

14. **Usar Fibonacci ingenuo con números grandes.** Con `n = 45` el navegador se
    bloquea varios segundos. Por eso la demo limita la entrada a 30.

15. **Usar una flecha como método de un objeto.** No tiene `this` propio, así que
    `this.nombre` no apunta al objeto. Regla: función normal para métodos, flecha para
    los callbacks de dentro.

16. **Perder el `this` al sacar un método del objeto.** En modo estricto pasa a ser
    `undefined` y salta `TypeError: Cannot read properties of undefined`. Se arregla con
    `.bind()`.

17. **Modificar el array o el objeto recibido como parámetro.** Los objetos se pasan por
    referencia: `lista.push(x)` dentro de una función altera el original de quien la
    llamó. Devolver copias con `spread`.

18. **Creer que "impura" significa "mal escrita".** Sin efectos secundarios nadie vería
    el resultado. Lo correcto es aislarlos y nombrarlos con claridad.

19. **Olvidar que el valor de un `input` siempre es texto.** Aunque sea
    `type="number"`, hay que convertirlo con `Number()`. Y ojo: `Number('')` vale `0`.

20. **Poner `alert()` o `prompt()` en la carga de la página.** Bloquean el navegador. En
    este proyecto están siempre detrás de un botón.

---

## 7. Notas técnicas para el docente

- **Sin dependencias.** JavaScript puro. Ni librerías, ni CDN, ni Node, ni npm.
- **`defer` en todos los scripts.** Garantiza dos cosas: que el DOM ya existe cuando se
  ejecutan (por eso `getElementById` funciona sin envolver nada en `DOMContentLoaded`) y
  que se ejecutan en el orden en que están escritos, de modo que `00-utilidades.js`
  siempre va primero.
- **`'use strict'` en todos los archivos.** Es lo que hace que `this` valga `undefined`
  en una función suelta, un comportamiento que la sección 6 aprovecha para explicar.
- **Errores mostrados con `try/catch`.** Todos los errores que se enseñan están
  capturados a propósito para que la página no se rompa. Si se quiere ver el error real
  en rojo, basta con quitar el `try/catch` en clase.
- **Recursión infinita y Safari.** Los dos ejemplos sin caso base guardan el resultado en
  una variable antes de devolverlo. Es intencionado: si la llamada quedase en posición
  final, Safari (el único navegador que optimiza las llamadas finales) entraría en un
  bucle infinito y colgaría la pestaña en lugar de lanzar el `RangeError`.
- **Una sola variable global.** El proyecto expone `window.Utilidades` y, con fines
  didácticos, `window.NOMBRE_DEL_CURSO` en la sección de ámbito global.
- **Comprobado en navegador.** Las siete consolas de la página se rellenan sin un solo
  error, y todas las demos interactivas (calculadora, contador, espiar, Fibonacci,
  saludo) responden correctamente.
