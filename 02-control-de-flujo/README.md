# 02 · Control de flujo: condicionales y bucles

Guía docente del segundo proyecto de la serie de JavaScript del curso
**Full Stack 2 · Desarrollo Front End**.

Este proyecto enseña a que un programa **tome decisiones** (`if`, `else`, ternario,
`switch`) y a que **repita trabajo** (`for`, `while`, `do...while`, `for...of`,
`for...in`), y cierra aplicando ambas cosas a los ejercicios clásicos de clase.

Es material para **varias sesiones**: hay unas 2.700 líneas de JavaScript
comentado, 25 ejercicios propuestos y dos zonas interactivas para practicar en vivo.

---

## 📚 Temas cubiertos

### Condicionales (`js/01-condicionales.js`)

- `if` simple: qué es exactamente una condición.
- `if / else`: el camino alternativo.
- Cadena `if / else if / else` y por qué **el orden de las condiciones importa**.
- Condicionales anidados, "código flecha" y cómo aplanarlo.
- Cláusulas de guarda (salida temprana con `return`).
- Valores **truthy** y **falsy**: los ocho falsy de JavaScript y las sorpresas
  (`"0"`, `[]`, `{}` son truthy).
- Operadores lógicos `&&`, `||`, `!` y el **cortocircuito**.
- Valor por defecto con `||` frente al operador `??` (fusión de nulos).
- Operador **ternario** y ternarios anidados (y por qué evitarlos).
- `==` frente a `===` dentro de condiciones.

### Switch (`js/02-switch.js`)

- Anatomía: `switch`, `case`, `break`, `default`.
- El switch compara con `===` (problema típico del `<input>` que devuelve texto).
- El **peligro del fall-through** al olvidar un `break`.
- El **fall-through útil**: agrupar casos apilando `case`.
- `switch (true)` para trabajar con rangos.
- **Comparación switch frente a if/else**: cuándo usar cada uno.
- Ámbito de las variables dentro de un `switch` y por qué hacen falta llaves.
- `switch` con `return` dentro de una función (sin `break`).
- Uso responsable de `alert()` (solo bajo demanda, con un botón).

### Bucles (`js/03-bucles.js`)

- El `for` clásico y **sus tres partes** explicadas una a una, con el orden real
  de ejecución.
- Variantes: cuenta atrás, saltos de dos en dos, multiplicación, dos contadores.
- Recorrer arrays con `for` clásico (índices, `.length`, el error del `<=`).
- `while` y en qué se diferencia del `for`.
- `do...while` y el caso real donde de verdad hace falta.
- `for...of` con arrays, con textos y con `.entries()` para obtener el índice.
- `for...in` con objetos.
- **Por qué NO se usa `for...in` con arrays** (demostrado en pantalla).
- `break` y `continue`.
- **Bucles anidados** y su coste multiplicativo.
- **Bucles infinitos**: las cuatro causas más frecuentes y cómo protegerse con
  una guarda de seguridad.

### Ejercicios clásicos (`js/04-ejercicios-clasicos.js`)

- **FizzBuzz** (dos versiones: cadena de `if` y por acumulación).
- **Contar vocales** de una frase, con desglose por vocal.
- **Detectar números primos**, con la optimización de la raíz cuadrada.
- **Factorial** con bucle acumulador, y el límite de `MAX_SAFE_INTEGER`.
- **El mayor de una lista** (estrategia del campeón) y el atajo `Math.max`.
- **Sumar pares e impares** por separado.
- **Pirámide de asteriscos** (con `.repeat()` y con bucles anidados), más
  triángulos y rombo.
- **Tabla de multiplicar** en texto y renderizada en HTML.
- **Clasificador de notas interactivo**, resuelto dos veces: `if/else` y
  `switch (true)`.
- **Rejilla completa 12 × 12** generada con bucles anidados (144 celdas).

---

## ▶️ Cómo abrir el proyecto

**Doble clic en `index.html`.** Ya está.

Este proyecto **no necesita servidor local**: no usa módulos ES (`import` /
`export`) ni `fetch`, así que funciona perfectamente con el protocolo `file://`.
Los scripts se cargan con `<script src="..." defer>`, que no tiene restricciones
de CORS.

Si aun así prefieres servirlo por HTTP (recomendable si vas a proyectar y quieres
recarga automática):

- **Live Server** (extensión de VS Code): clic derecho sobre `index.html` →
  *Open with Live Server*.
- **Python**, desde la carpeta del proyecto:

  ```bash
  python3 -m http.server 8000
  ```

  y abre `http://localhost:8000/index.html` en el navegador.

> 💡 Recuerda abrir la consola del navegador con **F12** para enseñar que
> `console.log` y la consola visual de la página muestran exactamente lo mismo.

### Estructura de archivos

```
02-control-de-flujo/
├── index.html                      Página del proyecto
├── css/
│   └── estilos.css                 Estilos propios (comentados)
├── js/
│   ├── 01-condicionales.js         if, else, truthy/falsy, ternario
│   ├── 02-switch.js                switch, break, fall-through
│   ├── 03-bucles.js                for, while, do...while, for...of/in
│   └── 04-ejercicios-clasicos.js   Ejercicios + zonas interactivas
└── README.md                       Esta guía
```

> ⚙️ **Nota técnica para el docente:** los cuatro archivos JS definen una función
> llamada `imprimir()`. Para que no choquen entre sí (el navegador lanzaría
> `Identifier 'imprimir' has already been declared`), cada archivo va envuelto en
> una **IIFE**: `(function () { ... })();`. Merece la pena dedicar dos minutos a
> explicarlo: es la primera vez que los estudiantes ven el concepto de ámbito
> global frente a ámbito de función, y volverá en el tema de módulos.

---

## 🕐 Orden sugerido para explicarlo en clase

El proyecto está pensado para **tres sesiones de unos 90–110 minutos**. Los
tiempos incluyen las pausas para preguntas, pero **no** el tiempo de resolver los
ejercicios propuestos (que conviene dejar como trabajo de casa o de taller).

### Sesión 1 · Condicionales (≈ 105 min)

| Bloque | Contenido | Tiempo |
| --- | --- | --- |
| 1 | Presentación del proyecto y del patrón "consola visual". Abrir F12 y comparar. | 10 min |
| 2 | Secciones 1–3: `if`, `if/else`, cadena `if/else if/else`. Insistir en el orden. | 25 min |
| 3 | Sección 4: anidados, código flecha y cláusulas de guarda. | 20 min |
| 4 | Sección 5: truthy y falsy. Recorrer la tabla de valores en pantalla. | 20 min |
| 5 | Sección 6: `&&`, `||`, `!` y cortocircuito. Valor por defecto y `??`. | 15 min |
| 6 | Secciones 7–8: ternario y ternarios anidados. Debate: ¿cuál es más legible? | 15 min |

> La sección 9 (`==` frente a `===`) es un repaso del proyecto 01. Si ya se dio,
> basta con enseñar la salida en pantalla y seguir (3 min).

### Sesión 2 · Switch y primeros bucles (≈ 100 min)

| Bloque | Contenido | Tiempo |
| --- | --- | --- |
| 1 | Repaso rápido de la sesión anterior. | 5 min |
| 2 | `02-switch.js` secciones 1–2: anatomía y comparación estricta. | 20 min |
| 3 | Secciones 3–4: fall-through peligroso y fall-through útil. **Clave del tema.** | 25 min |
| 4 | Sección 5: `switch (true)`. Enlazar con la cadena `if/else if`. | 15 min |
| 5 | Sección 6: switch frente a if/else. Poner ejemplos entre todos. | 15 min |
| 6 | Secciones 7–8: ámbito de variables y `switch` con `return`. | 20 min |

> El botón "Ver un alert() de ejemplo" (sección 9) sirve para explicar por qué
> `alert()` nunca se llama al cargar la página. Un minuto, pero se recuerda.

### Sesión 3 · Bucles y ejercicios clásicos (≈ 110 min)

| Bloque | Contenido | Tiempo |
| --- | --- | --- |
| 1 | `03-bucles.js` sección 1: las tres partes del `for`, en la pizarra. | 20 min |
| 2 | Secciones 2–3: variantes y recorrido de arrays. | 15 min |
| 3 | Secciones 4–5: `while` y `do...while`. Enseñar el ejemplo del dado. | 20 min |
| 4 | Secciones 6–7: `for...of` con arrays y con textos. | 15 min |
| 5 | Secciones 8–9: `for...in` con objetos y **por qué no con arrays**. | 15 min |
| 6 | Secciones 10–12: `break`, `continue` y bucles anidados. | 20 min |
| 7 | Sección 13: bucles infinitos. Pulsar el botón de la guarda de seguridad. | 10 min |

### Sesión 4 (opcional) · Taller de ejercicios clásicos (≈ 90 min)

Recomendación: **no explicar `04-ejercicios-clasicos.js` de corrido**. Funciona
mucho mejor pedir a los estudiantes que intenten cada ejercicio primero y
después abrir el archivo para comparar soluciones.

| Bloque | Contenido | Tiempo |
| --- | --- | --- |
| 1 | FizzBuzz: intento propio (10 min) + solución comentada (10 min). | 20 min |
| 2 | Contar vocales y sumar pares/impares. | 15 min |
| 3 | Primos y factorial. Hablar de eficiencia y de `MAX_SAFE_INTEGER`. | 20 min |
| 4 | Pirámide de asteriscos: la fórmula de espacios y asteriscos en la pizarra. | 15 min |
| 5 | Clasificador de notas y tabla dinámica: primer contacto con el DOM. | 20 min |

---

## ✏️ Ejercicios propuestos (recopilados)

Los enunciados completos están al final de cada archivo JS, dentro de un bloque
de comentarios. Aquí van recogidos para poder repartirlos como tarea.

### De `01-condicionales.js`

1. **Descuento por volumen** (fácil) — Calcular el descuento por número de
   unidades con `if / else if / else`.
2. **El mismo problema, en ternario** (fácil) — Reescribirlo con ternarios
   anidados y argumentar cuál se mantiene mejor.
3. **Validador de formulario** (intermedio) — Validar nombre, edad y correo,
   indicando **qué campo concreto** falla.
4. **Caza de falsy** (intermedio) — Recorrer un array mixto y contar truthy y falsy.
5. **Precio de la entrada al museo** (avanzado) — Función con reglas encadenadas,
   resuelta con salidas tempranas.

### De `02-switch.js`

6. **Menú de la cafetería** (fácil) — Precio de cada producto con `switch` y `default`.
7. **Agrupar con fall-through** (fácil) — Vocal o consonante apilando `case`.
8. **Conversor de nota a letra** (intermedio) — `switch (true)` con `return`, más validación.
9. **Calculadora con switch** (intermedio) — Cinco operadores y control de la
   división entre cero.
10. **Días del mes** (avanzado) — Fall-through agrupado y cálculo de año bisiesto.

### De `03-bucles.js`

11. **Cuenta atrás personalizada** (fácil) — De 20 a 0 de tres en tres, con `for` y con `while`.
12. **Inventario de la tienda** (fácil) — `for...of` con `.entries()`.
13. **Ficha de producto** (intermedio) — `for...in` marcando los valores numéricos.
14. **Buscador con break** (intermedio) — Contar comprobaciones con y sin `break`.
15. **Filtro de carrito con continue** (intermedio) — Sumar solo lo disponible.
16. **Damero de ajedrez** (avanzado) — Tablero 8 × 8 con bucles anidados.
17. **Detective de bucles infinitos** (avanzado) — Escribir las cuatro causas y
    sus versiones corregidas.

### De `04-ejercicios-clasicos.js`

18. **FizzBuzz ampliado** (fácil) — Añadir la regla del 7 ("Boom") hasta 50.
19. **Contador de palabras** (fácil) — Contar espacios con cuidado de los dobles.
20. **Palíndromo** (intermedio) — Comparar extremos con dos contadores en el mismo `for`.
21. **Criba de primos** (intermedio) — Primos hasta 200 en filas de diez.
22. **Tabla de multiplicar a medida** (intermedio) — Rango "desde/hasta" con validación.
23. **Pirámide numérica** (avanzado) — Sin `.repeat()`, con bucles anidados.
24. **Estadísticas de clase** (avanzado) — Media, mejor, peor, aprobados y
    suspensos en **un solo recorrido**, mostrado en una tabla HTML generada.
25. **Clasificador con más niveles** (avanzado) — Añadir "Matrícula de honor" y
    "Suspenso alto" en las dos versiones.

---

## ⚠️ Errores comunes que el docente debe advertir

Estos son los fallos que aparecen **todos los años**. Están marcados en el código
con `// ⚠️ ERROR COMÚN:` para poder localizarlos rápido durante la clase.

### En condicionales

1. **`=` en vez de `==` / `===`.** `if (nota = 10)` asigna y devuelve 10, que es
   truthy, así que **siempre entra**. Es el error número uno del tema.
2. **Punto y coma después del `if`.** `if (x > 5); { ... }` cierra el `if` con
   cuerpo vacío y el bloque se ejecuta siempre. Muy difícil de ver a simple vista.
3. **Orden de la cadena al revés.** Preguntar por `nota >= 5` antes que por
   `nota >= 9` deja el caso "Excelente" **inalcanzable**. Se demuestra en pantalla.
4. **`else` con condición.** `else (algo) { }` es un error de sintaxis; lo que
   quieren es `else if`.
5. **Confiar en el truthy con números que pueden valer 0.** `if (errores)` no
   distingue "cero errores" de "no hay dato". Hay que comparar explícitamente.
6. **`||` para valores por defecto cuando el 0 es legítimo.** `puntos || 10`
   convierte un 0 válido en 10. Ahí toca `??`.
7. **Ternarios anidados sin formatear.** Funcionan, pero se vuelven ilegibles.
   Regla del curso: si no se entiende de un vistazo, `if/else`.

### En switch

8. **Olvidar el `break`.** Provoca fall-through: se ejecutan también los `case`
   siguientes. Error silencioso, no da ningún aviso.
9. **Comparar texto con número.** El `switch` usa `===`, así que un `<input>` que
   devuelve `"3"` **nunca** entra en `case 3`. Convertir con `Number()` antes.
10. **Escribir `switch (variable)` en vez de `switch (true)`** al trabajar con
    rangos: siempre cae en el `default`.
11. **Declarar `let` / `const` con el mismo nombre en dos `case`.** Da
    `SyntaxError` y **rompe el archivo entero**, no solo el switch. Se arregla
    poniendo llaves `{ }` en cada `case`.
12. **Olvidar el `default`.** Los valores inesperados pasan en silencio.

### En bucles

13. **El error del `<=`.** `for (let i = 0; i <= 5; i++)` da **seis** vueltas, no
    cinco. Regla: si empiezas en 0, usa `<`; si empiezas en 1, usa `<=`.
14. **Salirse del array.** `i <= array.length` accede a un índice que no existe y
    devuelve `undefined`.
15. **Usar `for...in` con arrays.** Los índices llegan como **texto**, aparecen
    propiedades que no son elementos y el orden no está garantizado.
16. **Usar el punto en vez de corchetes en `for...in`.** `objeto.clave` busca una
    propiedad literalmente llamada "clave"; hay que escribir `objeto[clave]`.
17. **`continue` dentro de un `while` con la actualización debajo.** El contador
    no avanza en las vueltas saltadas → **bucle infinito**. En un `for` no ocurre.
18. **Olvidar el punto y coma final del `do...while`.** `} while (...);` lo lleva
    obligatoriamente.
19. **Creer que `break` rompe todos los bucles anidados.** Solo rompe el interno.
20. **Comparar decimales con `!==`.** `while (x !== 1)` con `x += 0.1` no termina
    nunca: sumar 0.1 diez veces da `0.9999999999999999`. Usar `<` en vez de `!==`.

### En los ejercicios clásicos

21. **FizzBuzz con el orden equivocado.** Hay que preguntar primero por el caso
    doble (múltiplo de 3 **y** de 5); si no, el 15 sale como "Fizz".
22. **Acumulador de producto inicializado en 0.** En el factorial, el acumulador
    empieza en **1**; en una suma, en 0.
23. **Buscar el mayor partiendo de 0.** Si todos los números son negativos,
    devolvería 0, que ni siquiera está en la lista. Hay que partir del primer
    elemento.
24. **Detectar impares con `n % 2 === 1`.** Falla con los negativos: `-3 % 2` da
    `-1`, no `1`. Comprobar el par con `=== 0` y usar `else`.
25. **Olvidar vaciar el contenedor antes de repintar.** Sin
    `contenedor.textContent = ''`, las tablas se acumulan una debajo de otra en
    cada cambio del desplegable.

---

## 🎯 Zonas interactivas de la página

Dos secciones están pensadas para practicar **en vivo** delante de la clase:

- **Clasificador de notas** (sección 05): escribe una nota y compara el resultado
  de la versión `if/else` con la de `switch (true)`. Valida campo vacío, texto no
  numérico y rango fuera de 0–10. También responde a la tecla **Enter**.
- **Tabla de multiplicar** (sección 06): el desplegable del 1 al 12 redibuja la
  tabla con un `for`, y el botón "Ver rejilla completa" genera 144 celdas con dos
  bucles anidados. Es el ejemplo perfecto para cerrar el tema de la anidación.

Ambas secciones son, además, el **primer contacto real con el DOM** del curso
(`getElementById`, `createElement`, `appendChild`, `addEventListener`), que se
desarrollará a fondo en proyectos posteriores.

---

## ✅ Qué debe saber hacer el estudiante al terminar

- Elegir entre `if/else`, ternario y `switch` justificando la decisión.
- Predecir si un valor cualquiera es truthy o falsy.
- Escribir un `for`, un `while` y un `do...while` equivalentes y explicar cuándo
  usar cada uno.
- Recorrer un array con `for...of` y un objeto con `for...in`, sin confundirlos.
- Usar `break` y `continue` con criterio.
- Detectar un bucle infinito **leyendo el código**, antes de ejecutarlo.
- Resolver FizzBuzz y la pirámide de asteriscos sin ayuda.
