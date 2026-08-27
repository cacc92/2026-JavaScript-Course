# 01 · Fundamentos de JavaScript

Guía docente del primer proyecto del curso **Full Stack 2 · Desarrollo Front End**.

Proyecto autocontenido en JavaScript puro (sin librerías, sin CDN, sin Node.js).
Todo el material está pensado para explicarse **línea por línea proyectando la pantalla**.

---

## 1. Qué aprenden los estudiantes

Al terminar este proyecto, un estudiante debe ser capaz de:

- Explicar qué es JavaScript, dónde se ejecuta y en qué se diferencia de HTML y CSS.
- Incluir JavaScript en una página de la forma correcta y justificar por qué.
- Declarar variables con criterio y nombrarlas siguiendo las convenciones del lenguaje.
- Identificar el tipo de cualquier dato y anticipar cómo se comportará al operar con él.
- Leer una expresión con varios operadores y predecir su resultado exacto.
- Convertir tipos de forma explícita y reconocer cuándo el motor convierte por su cuenta.
- Pedir datos a la persona usuaria y validarlos antes de usarlos.

---

## 2. Temas cubiertos

| # | Tema | Dónde se explica |
|---|------|------------------|
| 1 | Qué es JavaScript y dónde se ejecuta | `index.html` (sección 2) |
| 2 | Las 3 formas de incluir JS: inline, interno y externo con `defer` | `index.html` (sección 3) + demo real en la página |
| 3 | Comentarios de una línea y de bloque | `js/01-variables-y-tipos.js` |
| 4 | `console.log`, `info`, `warn`, `error` y `table` | `js/01-variables-y-tipos.js` |
| 5 | Variables: `var`, `let` y `const` (ámbito, reasignación, redeclaración) | `js/01-variables-y-tipos.js` + tabla en el HTML |
| 6 | Hoisting y zona muerta temporal (TDZ) | `js/01-variables-y-tipos.js` |
| 7 | Reglas y convenciones de nombres (camelCase) | `js/01-variables-y-tipos.js` |
| 8 | Los 7 tipos primitivos: string, number, boolean, undefined, null, symbol, bigint | `js/01-variables-y-tipos.js` |
| 9 | `typeof` y la rareza `typeof null === "object"` | `js/01-variables-y-tipos.js` |
| 10 | Valor frente a referencia, copia superficial y profunda | `js/01-variables-y-tipos.js` |
| 11 | Operadores aritméticos, incluidos `%` y `**` | `js/02-operadores.js` |
| 12 | Precisión de los decimales (`0.1 + 0.2`) | `js/02-operadores.js` |
| 13 | Operadores de asignación `+= -= *= /= %= **=` | `js/02-operadores.js` |
| 14 | Incremento y decremento: `i++` frente a `++i` | `js/02-operadores.js` |
| 15 | Comparación `==` frente a `===` (tabla comparativa) | `js/02-operadores.js` + tabla en el HTML |
| 16 | Operadores lógicos `&& || !`, cortocircuito, `??` y `?.` | `js/02-operadores.js` |
| 17 | Operador ternario | `js/02-operadores.js` |
| 18 | Precedencia de operadores | `js/02-operadores.js` |
| 19 | Valores truthy y falsy (los 8 falsy) | `js/02-operadores.js` |
| 20 | Conversión explícita: `Number`, `String`, `Boolean`, `parseInt`, `parseFloat` | `js/03-conversion-de-tipos.js` |
| 21 | Coerción implícita: `'5' * 2`, `'5' + 2`, `[] + {}` | `js/03-conversion-de-tipos.js` |
| 22 | `NaN`, `isNaN()` frente a `Number.isNaN()` | `js/03-conversion-de-tipos.js` |
| 23 | Template literals: interpolación y multilínea | `js/03-conversion-de-tipos.js` |
| 24 | `alert`, `prompt` y `confirm` dentro de botones | `js/04-interaccion.js` |

---

## 3. Estructura del proyecto

```
01-fundamentos/
├── index.html                     Página del proyecto (teoría + consola visual + botones)
├── css/
│   └── estilos.css                Estilos comentados, tema oscuro para proyección
├── js/
│   ├── 01-variables-y-tipos.js    Comentarios, console, variables, tipos, typeof, referencias
│   ├── 02-operadores.js           Aritméticos, asignación, comparación, lógicos, ternario, precedencia
│   ├── 03-conversion-de-tipos.js  Conversión explícita, coerción, NaN, template literals
│   └── 04-interaccion.js          alert, prompt, confirm y limpieza de la consola visual
└── README.md                      Esta guía
```

---

## 4. Cómo abrir el proyecto

**No hace falta instalar nada.** Este proyecto no usa módulos ES ni `fetch`, así que funciona
directamente con el protocolo `file://`.

1. Abre la carpeta `01-fundamentos`.
2. Doble clic en `index.html`.
3. Pulsa <kbd>F12</kbd> para abrir DevTools y ver la consola real del navegador.

Todo lo que imprimen los archivos JS aparece además en la **consola visual** de la propia página
(el bloque negro de la sección 1), para poder explicarlo sin depender de DevTools.

> Opcional: si se prefiere trabajar con un servidor local, sirve la extensión **Live Server**
> de VS Code o el comando `python3 -m http.server 8000` dentro de la carpeta del curso.
> Para este proyecto **no es necesario**.

---

## 5. Orden sugerido para explicarlo en clase

Material previsto para **tres sesiones de unos 90 minutos**.
Los tiempos son orientativos e incluyen las preguntas de los estudiantes.

### Sesión 1 — Presentación, variables y tipos (90 min)

| Bloque | Contenido | Tiempo |
|--------|-----------|--------|
| 1 | Recorrido por la página y por la consola visual. Qué es JavaScript y dónde se ejecuta. | 10 min |
| 2 | Las 3 formas de incluir JS. Mostrar en vivo el botón `onclick` (mal ejemplo) y los `<script defer>`. | 15 min |
| 3 | Comentarios y métodos de `console`. Enseñar `console.table` en DevTools. | 10 min |
| 4 | `var`, `let` y `const`. Repasar la tabla comparativa del HTML. | 20 min |
| 5 | Ámbito, hoisting y TDZ. Demostrar el bucle con `var` y con `let`. | 15 min |
| 6 | Reglas y convenciones de nombres. Renombrar en directo variables mal nombradas. | 10 min |
| 7 | Cierre y planteamiento de los ejercicios 1 y 2 del archivo 01. | 10 min |

### Sesión 2 — Tipos, referencias y operadores (90 min)

| Bloque | Contenido | Tiempo |
|--------|-----------|--------|
| 1 | Repaso rápido y corrección de los ejercicios de la sesión anterior. | 10 min |
| 2 | Los 7 tipos primitivos. `symbol` y `bigint` solo como cultura general. | 15 min |
| 3 | `typeof` y la rareza de `null`. Contar la anécdota histórica. | 10 min |
| 4 | Valor frente a referencia. Es el punto más difícil: dibujar cajas y flechas en la pizarra. | 20 min |
| 5 | Operadores aritméticos, `%`, `**` y el problema de `0.1 + 0.2`. | 15 min |
| 6 | Asignación compuesta e `i++` frente a `++i`. | 10 min |
| 7 | Ejercicios 3 y 4 del archivo 01 y ejercicio 1 del archivo 02. | 10 min |

### Sesión 3 — Comparación, conversión e interacción (90 min)

| Bloque | Contenido | Tiempo |
|--------|-----------|--------|
| 1 | `==` frente a `===`. Recorrer la tabla del HTML fila por fila. | 20 min |
| 2 | Lógicos, cortocircuito, `??` y ternario. | 15 min |
| 3 | Precedencia y truthy/falsy. Los 8 valores falsy de memoria. | 15 min |
| 4 | Conversión explícita e implícita. Los clásicos `'5' + 2` y `[] + {}`. | 15 min |
| 5 | `NaN`, `isNaN` frente a `Number.isNaN`. | 10 min |
| 6 | Template literals y los tres botones de interacción. Probarlos en vivo. | 10 min |
| 7 | Cierre del proyecto y reparto de los retos finales. | 5 min |

---

## 6. Ejercicios propuestos (recopilados)

### Archivo 01 — Variables y tipos
1. Declara tres constantes con tus datos (nombre, edad y si estudias o no) usando el tipo correcto en cada una, e imprímelas indicando su `typeof`.
2. Crea una variable con `var` dentro de un bloque `if` y otra con `let` en el mismo bloque. Intenta leerlas fuera del bloque y explica qué ocurre con cada una.
3. Escribe una lista de 4 productos (objetos con nombre, precio y stock) y muéstrala con `console.table()`. Después imprime solo los nombres separados por comas.
4. Crea un objeto `tarea = { titulo: 'Estudiar', hecha: false }`. Haz una copia con el operador `...`, cambia `hecha` a `true` en la copia y demuestra que el original no se modificó.
5. **Reto:** escribe una función `sonIguales(a, b)` que devuelva `true` solo si `a` y `b` son del mismo tipo y tienen el mismo valor. Debe funcionar con `null` y con `NaN`.

### Archivo 02 — Operadores
1. Calcula el precio final de un producto de 250 con un descuento del 15% y un IVA del 21%. Imprime el resultado con dos decimales.
2. Con el operador `%`, escribe un bucle del 1 al 20 que imprima cada número indicando si es PAR o IMPAR (usando un ternario).
3. Predice en un comentario el resultado de `'' == false`, `[] === []`, `2 + 2 + '2'` y `true + true + true`; después compruébalo.
4. Escribe una función `precioConDescuento(precio, descuento)` donde el descuento sea opcional y valga 0 por defecto, pero que siga funcionando si alguien pasa un descuento de 0.
5. **Reto:** escribe `clasificarEdad(edad)` devolviendo `'Menor'`, `'Adulto'` o `'Jubilado'` solo con ternarios y después con `if/else`. Compara la legibilidad.

### Archivo 03 — Conversión de tipos
1. Convierte a número `'15'`, `'15.5'`, `'15 euros'` y `''`, mostrando resultado y `typeof`. Explica por qué el último da 0.
2. Escribe `sumarSeguro(a, b)`, que convierta ambos argumentos antes de sumar y devuelva `'Datos no validos'` si alguno no es un número real.
3. Predice el resultado de `'10' - 5`, `'10' + 5`, `10 + true` y `'10' * null`.
4. Con un template literal multilínea, imprime una factura con tres productos, sus precios y el total calculado dentro de la propia plantilla.
5. **Reto:** escribe `aNumeroONulo(valor)` que devuelva el número si la conversión es válida y `null` si no. La cadena vacía y la cadena de espacios deben considerarse NO válidas.

### Archivo 04 — Interacción
1. Añade un cuarto botón que pida el nombre con `prompt()` y salude con un `alert()` usando un template literal. Si la persona cancela, no debe mostrarse ningún saludo.
2. Crea un botón "Calculadora rápida" que pida dos números, los convierta y muestre suma, resta, multiplicación, división y resto en la consola visual.
3. Usa `confirm()` para pedir confirmación antes de limpiar la consola.
4. Escribe `pedirNumero(mensaje)` que repita el `prompt()` hasta recibir un número válido o hasta que se pulse Cancelar.
5. **Reto:** crea un cuestionario de tres preguntas con `confirm()`, cuenta los aciertos y muestra la puntuación y el porcentaje con un solo template literal multilínea.

---

## 7. Errores comunes que conviene advertir

| Error del estudiante | Qué decir en clase |
|----------------------|--------------------|
| Creer que `const` hace el objeto inmutable | `const` bloquea la caja, no el contenido. Se puede mutar un objeto declarado con `const`. |
| Usar `var` porque "aparece en los tutoriales antiguos" | Se enseña para poder leer código viejo, no para escribirlo. |
| Leer una variable `let` antes de declararla | Da `ReferenceError` por la TDZ, no `undefined` como con `var`. |
| Pensar que `objeto2 = objeto1` copia el objeto | Copia la dirección: los dos nombres apuntan al mismo objeto. |
| Creer que el operador `...` copia también lo anidado | Es una copia superficial. Para copia profunda, `structuredClone()`. |
| Comparar con `==` | Genera bugs invisibles. Siempre `===`, salvo `valor == null`. |
| Sumar lo que llega de un `input` o un `prompt` sin convertir | Todo llega como texto: `'2' + 3` da `'23'`. |
| Suponer que `Number('')` es `NaN` | Vale `0`, y así un campo vacío se cuela como cero válido. |
| Usar `isNaN()` para validar | Convierte antes de preguntar y miente. Usar `Number.isNaN()` o `Number.isFinite()`. |
| Comprobar `NaN === NaN` | Siempre `false`: es el único valor distinto de sí mismo. |
| Usar `if (arreglo)` para ver si tiene datos | Un arreglo vacío es truthy. Comprobar `arreglo.length > 0`. |
| Usar `||` para valores por defecto con `0` o `''` válidos | El `||` los descarta por falsy. Para eso está `??`. |
| Confundir `%` con porcentaje | Es el resto de la división entera. |
| Escribir `-3 ** 2` | Es un `SyntaxError` a propósito. Hay que escribir `(-3) ** 2`. |
| Llamar a `alert` o `prompt` al cargar la página | Bloquean el navegador. Siempre dentro de un botón. |
| Poner JavaScript en `onclick` dentro del HTML | Mezcla estructura y comportamiento y obliga a crear funciones globales. |

---

## 8. Notas técnicas para el docente

- Cada archivo JS está envuelto en una **IIFE** (`(function () { ... })();`) para que las
  constantes de un archivo no choquen con las de otro. Si se quita la IIFE y dos archivos
  declaran el mismo nombre, el navegador lanza
  `SyntaxError: Identifier 'x' has already been declared` y **la página deja de funcionar**.
- El archivo `01-variables-y-tipos.js` expone `window.imprimir` y `window.titulo`; los archivos
  02, 03 y 04 las reutilizan. Si se reordenan los `<script>` del HTML, se pierde esa salida
  (hay un plan B que escribe solo en DevTools, pero la consola visual quedaría vacía).
- Todos los archivos usan `'use strict'`. Por eso el ejemplo de `Object.freeze` está dentro de
  un `try/catch`: en modo estricto, modificar un objeto congelado lanza `TypeError`.
- El enlace **← Volver al índice del curso** apunta a `../index.html`, que es el índice
  general del curso (ya existe en la carpeta raíz). Si se mueve esta carpeta de sitio,
  hay que revisar esa ruta relativa.
- La página funciona sin conexión a internet y sin ningún archivo externo.
