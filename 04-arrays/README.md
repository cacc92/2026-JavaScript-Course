# 04 · Arrays y métodos funcionales

Guía docente del cuarto proyecto del curso **Full Stack 2 · Desarrollo Front End**.

Material pensado para explicarse **línea por línea proyectando la pantalla**, con la
página abierta al lado del editor. Cada sección teórica escribe sus resultados a la vez
en la consola del navegador (F12) y en un bloque visible dentro de la propia página,
para que la clase pueda seguir la salida sin abrir las herramientas de desarrollo.

---

## Contenido de la carpeta

```
04-arrays/
├── index.html                          Página del proyecto (4 secciones teóricas + proyecto práctico)
├── css/
│   └── estilos.css                     Estilos propios, comentados en español
├── js/
│   ├── 01-basicos-y-mutadores.js       Fundamentos, matrices, mutadores y no mutadores
│   ├── 02-busqueda-y-comprobacion.js   indexOf, find, some/every, forEach
│   ├── 03-map-filter-reduce.js         El trío funcional y el encadenamiento
│   ├── 04-ordenar-y-destructuring.js   sort, destructuring, spread, Array.from, Set
│   └── 05-analizador-calificaciones.js Proyecto práctico completo
└── README.md                           Este archivo
```

El proyecto es **100 % autocontenido**: no depende de ningún archivo de otras carpetas,
no usa librerías, ni CDN, ni frameworks, ni Node.js. Solo JavaScript puro.

---

## Temas cubiertos

**Fundamentos (archivo 01)**

- Qué es un array y cuándo se usa.
- Creación con literal `[]` y con `new Array()`; la ambigüedad de `new Array(3)`.
- Índices en base 0, `length` (leerlo **y escribirlo**), `at()` con índices negativos.
- Acceso y modificación de posiciones; qué ocurre al salirse del rango y qué son los *huecos*.
- Arrays multidimensionales (matrices) y recorrido con **bucles anidados**.
- Métodos que **mutan**: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`.
- Métodos que **no mutan**: `slice`, `concat`, `join`, `toString`, `flat`, `flatMap`.
- Las alternativas modernas sin mutación: `toSorted`, `toReversed`.

**Búsqueda e iteración (archivo 02)**

- Concepto de **función callback** y sus tres argumentos `(elemento, indice, array)`.
- Búsqueda de valores: `indexOf`, `lastIndexOf`, `includes` (y el caso `NaN`).
- Búsqueda por condición: `find`, `findIndex`, `findLast`, `findLastIndex`.
- Comprobación: `some` y `every`, incluida la "verdad vacua" del array vacío.
- Iteración con `forEach` y **por qué no admite `break`**.
- Alternativas para cortar un recorrido: `for...of`, `for` clásico, `entries()` y el truco de `some`.

**Transformación (archivo 03)**

- `map` para transformar; `filter` para seleccionar.
- `reduce` explicado paso a paso con **tabla de iteraciones** y su equivalente en `for`.
- Los cuatro usos clásicos de `reduce`: sumar, máximo/mínimo, **agrupar por categoría** y **contar ocurrencias**.
- `reduceRight` y cuándo importa el sentido del recorrido.
- **Encadenamiento** `filter + map + reduce` como tubería de datos, paso a paso.
- Nota sobre decimales binarios (`0.1 + 0.2`) y `toFixed`.

**Ordenación y copia (archivo 04)**

- Por qué `sort()` ordena mal los números y cómo se escribe el comparador (`a - b` / `b - a`).
- Ordenar objetos por propiedad, ascendente y descendente, y con **doble criterio de desempate**.
- Ordenar textos con acentos y mayúsculas usando `localeCompare` (`'es'`, `sensitivity`, `numeric`).
- Destructuring de arrays: valores por defecto, saltos, `rest` e **intercambio de variables**.
- Spread `...` para copiar y combinar; **copia superficial vs. copia profunda** (`structuredClone`).
- `Array.from` (incluido el truco `{ length: n }` y las `NodeList`) y `Array.of`.
- `Set` para eliminar duplicados, y cómo deduplicar **objetos** con `Map`.

**Proyecto práctico (archivo 05)**

- Analizador de calificaciones sobre un array de objetos `{ nombre, curso, nota, edad }`.
- Tabla HTML generada con `map` + `join` e insertada con `innerHTML`.
- Filtros (`filter`), ordenaciones (`sort`) y estadísticas (`reduce`) sobre el mismo estado.
- Patrón **datos → estado → cálculo → pintado** y delegación de eventos.

---

## Cómo abrir el proyecto

**Opción 1 (la normal): doble clic.**
Abre `index.html` con doble clic. Funciona directamente con el protocolo `file://` porque
no hay módulos ES ni `fetch`. Es la forma recomendada para la clase.

**Opción 2 (cómoda para editar): servidor local.**
Solo si quieres recarga automática al guardar:

- Extensión **Live Server** de VS Code: clic derecho sobre `index.html` → *Open with Live Server*.
- O bien, desde la terminal, dentro de la carpeta del proyecto:
  ```bash
  python3 -m http.server 8000
  ```
  y abrir `http://localhost:8000` en el navegador.

> Recomendación para clase: ten abiertas a la vez la página y la consola (**F12**).
> El proyecto práctico usa `console.table()`, que dibuja los datos como una tabla
> muy legible al proyectar.

---

## Orden sugerido para explicarlo en clase

Duración total aproximada: **5 h 30 min**, es decir, unas **tres sesiones de dos horas**
con sus descansos. Los tiempos incluyen las preguntas.

### Sesión 1 — Fundamentos y búsqueda (≈ 1 h 50 min)

| Bloque | Contenido | Tiempo |
|---|---|---|
| 0 | Presentación del proyecto: recorrer `index.html`, mostrar la consola visual y explicar por qué cada archivo va envuelto en una IIFE. | 10 min |
| 1 | **Archivo 01, secciones 1–3**: qué es un array, creación, índices, `length`, `at()`, huecos y matrices con bucles anidados. Dibuja la matriz en la pizarra antes de mostrar el código. | 40 min |
| 2 | **Archivo 01, secciones 4–5**: mutadores vs. no mutadores. Insiste en la tabla mental de "qué devuelve cada uno". | 30 min |
| 3 | **Archivo 02, secciones 1–3**: `indexOf`, `includes`, `find` y familia. Primera aparición de las callbacks: dedica tiempo a la sintaxis de la flecha. | 30 min |

### Sesión 2 — El trío funcional (≈ 1 h 55 min)

| Bloque | Contenido | Tiempo |
|---|---|---|
| 4 | **Archivo 02, secciones 4–5**: `some`, `every` y `forEach`. La demostración de por qué `break` no funciona merece hacerse en vivo, provocando el error en la consola. | 30 min |
| 5 | **Archivo 03, secciones 1–2**: `map` y `filter`. Ejecuta el ejemplo de `map(parseInt)`: sorprende y se recuerda. | 35 min |
| 6 | **Archivo 03, sección 3**: `reduce` paso a paso. **Copia la tabla de iteraciones en la pizarra** y ve rellenándola vuelta a vuelta antes de mostrar el código. Es el momento clave del proyecto. | 30 min |
| 7 | **Archivo 03, secciones 4–6**: los cuatro usos de `reduce`, `reduceRight` y el encadenamiento. | 30 min |

### Sesión 3 — Ordenación y proyecto (≈ 1 h 45 min)

| Bloque | Contenido | Tiempo |
|---|---|---|
| 8 | **Archivo 04, secciones 1–3**: `sort` y `localeCompare`. Empieza preguntando a la clase qué creen que devuelve `[10, 9, 100].sort()` **antes** de ejecutarlo. | 35 min |
| 9 | **Archivo 04, secciones 4–5**: destructuring y spread, con especial cuidado en la copia superficial vs. profunda. | 30 min |
| 10 | **Archivo 04, secciones 6–7**: `Array.from`, `Array.of` y `Set`. | 15 min |
| 11 | **Archivo 05**: el analizador. Recorre primero la interfaz pulsando los botones, y solo después abre el código siguiendo el orden datos → estado → cálculo → pintado. | 40 min |
| 12 | Cierre: repartir los ejercicios propuestos y resolver dudas. | 15 min |

---

## Ejercicios propuestos (recopilados)

Cada archivo `.js` termina con su propio bloque de ejercicios. Aquí están todos juntos
para poder repartirlos como tarea.

### Bloque 1 · Fundamentos y mutadores

1. Crea un array `materias` con cinco materias de tu carrera. Imprime la primera, la última (usando `at`) y la cantidad total.
2. Partiendo de `const inventario = ['Cuadernos', 'Lápices', 'Reglas']`: añade `'Borradores'` al final y `'Mochilas'` al principio; quita el elemento del medio con `splice`; imprime el resultado unido por `" > "`.
3. Escribe una matriz de 3 filas × 4 columnas con las ventas de una papelería (3 productos, 4 semanas). Con bucles anidados, calcula el total por producto y el total general.
4. Dado `const camino = [[1, 2], [3, [4, 5]], [[6]]]`, consigue `[1, 2, 3, 4, 5, 6]` con `flat` y explica en un comentario qué profundidad hizo falta y por qué.
5. Escribe `quitarPorNombre(lista, nombre)` que elimine un elemento **sin mutar** el original. Demuestra con `console.log` que el original no cambió.

### Bloque 2 · Búsqueda y comprobación

1. Con `materias`, escribe un mensaje distinto según si `'Química'` está o no, usando `includes`. Repítelo con `indexOf` comparando correctamente contra `-1`.
2. Sobre `inventario`, encuentra: el primer producto de la categoría `'Escritura'`; el índice del producto más caro (con `findIndex`); el último producto de menos de 2 euros (con `findLast`).
3. Escribe `hayStockSuficiente(inventario, minimo)` que devuelva `true` solo si **todos** los productos alcanzan ese mínimo. Pruébala con `1` y con `0`.
4. Recorre `inventario` con `forEach` imprimiendo `"Cuaderno A4 (Papelería): 3.50 EUR — 40 uds."`. Reescríbelo con `for...of` y razona en un comentario cuál prefieres.
5. **Reto:** implementa `buscarPrimero(lista, condicion)` a mano, con `for` y `break`, replicando el comportamiento de `find` (incluido el `undefined` cuando no hay coincidencias).

### Bloque 3 · map, filter y reduce

1. Con `ventas`, crea con `map` un array de textos con el formato `"Cuaderno A4: 42.00 EUR"`.
2. Filtra las ventas cuya categoría **no** sea `'Escritura'`. Después repítelo usando un array de categorías excluidas e `includes`.
3. Calcula con **un solo `reduce`** un objeto `{ unidades, importe, lineas }`.
4. Escribe una tubería que devuelva el nombre del producto más caro de `'Geometría'` usando `filter` + `reduce`, **sin ordenar**.
5. **Reto:** implementa tus propias `miMap`, `miFilter` y `miReduce` con bucles `for`, y comprueba que coinciden con las nativas.

### Bloque 4 · Ordenar, desestructurar y copiar

1. Dado `const temperaturas = [22, 5, 18, 30, 9]`: ordénalas de menor a mayor **sin mutar** el original; luego de mayor a menor; y explica qué devuelve `sort()` sin comparador y por qué.
2. Ordena `participantes` por edad ascendente y, en caso de empate, por puntos descendente. Imprime `"Ana Ruiz - 19 años - 88 pts"`.
3. Con destructuring y en una sola línea por apartado: saca el primer y el último elemento de un array de 5 nombres; intercambia dos variables; extrae dos valores de `[]` con `'Sin datos'` por defecto.
4. Crea `combinarListas(...listas)` que una cualquier número de arrays, elimine duplicados con `Set` y devuelva el resultado ordenado con `localeCompare`.
5. **Reto:** escribe `clonarProfundo(datos)` de dos formas (`structuredClone` y `map` + spread) y demuestra que modificar la copia nunca afecta al original.

### Bloque 5 · Proyecto: analizador de calificaciones

1. Añade dos ordenaciones nuevas: `"Nombre Z-A"` y `"Edad descendente"`. Basta con un `<button data-orden="...">` y una línea en el objeto `ORDENES`.
2. Añade una tarjeta de estadística con la **mediana** de las notas.
3. Añade un campo de búsqueda por nombre que filtre mientras se escribe (evento `input`).
4. Muestra el nombre del mejor y del peor estudiante bajo las estadísticas (ya vienen calculados en `datos.mejor` y `datos.peor`).
5. Añade una columna **"Posición"** con el puesto de cada estudiante en el ranking general por nota, independientemente del filtro aplicado.
6. **Reto final:** exporta la lista visible como CSV en la consola, con `map` + `join('\n')` y columnas separadas por punto y coma.

---

## Errores comunes que conviene advertir

Todos están marcados dentro del código con `⚠️ ERROR COMÚN`. Estos son los que más
cuesta desmontar en clase:

**Sobre los fundamentos**

1. **`typeof []` devuelve `"object"`.** No existe un tipo "array". Para comprobarlo se usa `Array.isArray()`.
2. **`new Array(3)` no es `[3]`**, sino un array de tres huecos. Por eso se prefiere el literal `[]`.
3. **`arr[-1]` no es el último elemento**: devuelve `undefined`. El último es `arr[arr.length - 1]` o `arr.at(-1)`.
4. **Leer una posición inexistente no da error**, da `undefined`. El error aparece después, al usar ese `undefined`.
5. **`const` no impide mutar un array.** Impide reasignar la variable, no cambiar su contenido.

**Sobre mutadores y no mutadores**

6. **`arr = arr.push(x)` destruye el array.** `push` devuelve la nueva longitud, no el array.
7. **`splice` y `slice` se parecen en el nombre y hacen lo contrario**: `splice` corta el original, `slice` copia un trozo.
8. **Llamar a un no mutador sin guardar el resultado.** `arr.slice(0, 2);` en una línea suelta no hace nada.
9. **`sort()` muta.** Si el orden original importa, hay que copiar antes: `[...arr].sort(...)`.

**Sobre las callbacks**

10. **Olvidar el `return` cuando la callback lleva llaves.** `map(n => { n * 2 })` devuelve un array lleno de `undefined`; `every(x => { x > 0 })` siempre da `false`.
11. **`map(parseInt)`** produce `[10, NaN, 2]` porque `parseInt` recibe el índice como base numérica. Se usa `map(Number)` o `map(t => parseInt(t, 10))`.
12. **Confundir `filter` con `find`.** `filter` devuelve siempre un array (aunque tenga un solo elemento); `find` devuelve el elemento suelto.
13. **`if (arr.filter(...))` siempre entra**, porque un array vacío es un valor verdadero. Hay que comprobar `.length === 0`.
14. **`if (arr.indexOf(x))` es incorrecto**, porque `-1` es verdadero. Se compara `=== -1` o se usa `includes`.
15. **Usar el resultado de `find` sin comprobar que existe** provoca el clásico *"cannot read properties of undefined"*.

**Sobre `forEach` y `reduce`**

16. **`break` dentro de `forEach` es un error de sintaxis**, y un `return` solo se salta ese elemento, no corta el recorrido. Para cortar: `for...of`.
17. **`reduce` sin valor inicial sobre un array vacío lanza `TypeError`.** Poner siempre el valor inicial evita este error y el de que el acumulador tome el tipo del primer elemento.
18. **Olvidar devolver el acumulador** en un `reduce` que construye un objeto: la vuelta siguiente recibe `undefined` y todo se rompe.

**Sobre ordenación y copia**

19. **`sort()` sin comparador ordena los números como si fueran texto**: `[10, 9, 100]` queda `[10, 100, 9]`.
20. **Un comparador booleano (`(a, b) => a > b`) está mal**: nunca devuelve un negativo. A veces "parece" funcionar con pocos elementos, y por eso engaña.
21. **El `sort()` por defecto coloca las minúsculas y las tildes detrás de la Z.** En español hay que usar `localeCompare(b, 'es')`.
22. **Spread y `slice` hacen copia superficial.** Si el array contiene objetos, modificar la copia modifica también el original. Es el error más difícil de detectar de todo el tema: dedícale tiempo y ejecuta la demostración en vivo.
23. **Los valores por defecto del destructuring solo se aplican con `undefined`**, nunca con `null`.
24. **`Set` no elimina objetos duplicados por contenido**, solo por referencia. Para eso hace falta una clave y un `Map`.

**Sobre los decimales**

25. **`0.1 + 0.2` no da exactamente `0.3`.** Aparecerá al sumar precios con `reduce`. Para mostrar importes se usa `toFixed(2)`; para cálculos serios, céntimos en números enteros.
