# 05 · Objetos, JSON, Map y Set

Material de clase para **Full Stack 2 · Desarrollo Front End**.
Proyecto autocontenido, sin dependencias, sin Node y sin librerías externas: solo HTML, CSS y JavaScript puro.

> Este proyecto es la bisagra del curso: hasta aquí trabajamos con datos sueltos; a partir de aquí trabajamos con **estructuras de datos**, que es como llegan de verdad los datos desde un servidor.

---

## Temas cubiertos

### 1. Objetos (js/01-objetos-basicos.js)
- Objeto literal: pares clave-valor.
- Acceso con punto y con corchetes. Cuándo el corchete es **obligatorio**.
- Añadir, modificar y eliminar propiedades con `delete`.
- Objetos anidados y arrays de objetos.
- Métodos de objeto y la palabra clave `this`.
- El error de usar una arrow function como método.
- Pérdida de `this` al extraer un método, y solución con `bind()`.
- Shorthand de propiedades y de métodos.
- Propiedades computadas `{ [clave]: valor }`.

### 2. Recorrer y copiar (js/02-recorrer-y-copiar.js)
- `for...in` y su trampa: las propiedades heredadas del prototipo.
- `Object.keys()`, `Object.values()`, `Object.entries()`, `Object.fromEntries()`.
- Combinaciones con `map`, `forEach`, `filter`, `reduce` y `sort`.
- `Object.assign()` para fusionar objetos.
- Spread `{ ...obj }` para clonar y fusionar; la importancia del orden.
- Copia **superficial** vs copia **profunda**.
- `structuredClone()` y el truco clásico `JSON.parse(JSON.stringify(obj))`.
- `Object.freeze()` y `Object.seal()`; congelado profundo con recursión.
- Comprobar existencia: `in`, `hasOwnProperty()`, `Object.hasOwn()`.

### 3. Destructuring y datos que faltan (js/03-destructuring-y-opcional.js)
- Destructuring de objetos: básico, con renombrado y con valores por defecto.
- Por qué el valor por defecto solo se activa con `undefined` (no con `null`, `0`, `""`).
- Destructuring anidado y la defensa `= {}` en los niveles intermedios.
- Destructuring en los **parámetros** de una función y el patrón "objeto de opciones".
- Operador `rest` (`...resto`) dentro del destructuring.
- Encadenamiento opcional `?.`, `?.[ ]` y `?.()`.
- Fusión nula `??` frente a `||`, y el atajo `??=`.

### 4. JSON (js/04-json.js)
- Qué es JSON y en qué se diferencia de un objeto de JavaScript.
- `JSON.stringify()` con indentación, con replacer en forma de array y de función.
- El método `toJSON()` personalizado.
- Qué se pierde al serializar: `undefined`, funciones, `Date`, `NaN`, `Infinity`, `Map`, `Set`.
- El caso aparte de `BigInt`: no se pierde, **lanza `TypeError`** y rompe todo el `stringify`.
- `JSON.parse()` y el **reviver** para reconstruir fechas.
- Errores típicos y la función `parsearSeguro()` con `try/catch`.
- Caso real: guardar y recuperar datos en `localStorage`.

### 5. Map y Set (js/05-map-y-set.js)
- `Map`: seis diferencias reales frente al objeto plano.
- `set`, `get`, `has`, `delete`, `size`, `clear` y encadenamiento de `set`.
- Iteración con `for...of`, `forEach`, `keys()`, `values()`, `entries()`.
- Conversiones: `Object.fromEntries(map)` y `new Map(Object.entries(obj))`.
- Casos reales: contar frecuencias, hacer un ranking y agrupar objetos.
- `Set`: valores únicos, `add`, `has`, `delete`, eliminación de duplicados.
- Unión, intersección, diferencia y diferencia simétrica.
- `WeakMap` y `WeakSet`: para qué existen (mención breve).

### 6. Proyecto práctico (js/06-proyecto-fichas.js)
- Array de objetos con datos anidados **incompletos** (como en la vida real).
- Función `crearTarjeta()` con destructuring en los parámetros y valores por defecto anidados.
- Encadenamiento opcional para GitHub, teléfono, dirección y notas.
- Renderizado con `map()` + `join('')` + `innerHTML`, y escapado de HTML.
- Estadísticas con `filter`, `map`, `reduce` y un `Set` para las ciudades.
- Botón "Ver el JSON formateado" y botón "Volver a parsear el JSON".

---

## Cómo abrir el proyecto

**Opción A (la más simple):** doble clic en `index.html`.
Todo funciona con el protocolo `file://` porque no se usan módulos ES ni `fetch`.
Única salvedad: algunos navegadores bloquean `localStorage` en `file://`; el código está protegido con `try/catch` y mostrará un aviso en lugar de fallar.

**Opción B (recomendada para clase):** servidor local.
- Extensión **Live Server** de VS Code: clic derecho sobre `index.html` → *Open with Live Server*.
- O bien, desde la terminal, dentro de la carpeta del proyecto:
  ```
  python3 -m http.server 5500
  ```
  y abrir `http://localhost:5500` en el navegador.

**No hace falta Node.js, ni npm, ni instalar nada.**

Toda la salida se ve **dentro de la propia página** (bloques "consola visual") y también en la consola del navegador (**F12** → pestaña *Console*).

---

## Estructura de archivos

```
05-objetos/
├── index.html                        Página con las 6 secciones y el proyecto
├── css/
│   └── estilos.css                   Tema oscuro, tarjetas y consola visual
├── js/
│   ├── 00-utilidades.js              imprimir(), titulo(), formatear(), escaparHTML()
│   ├── 01-objetos-basicos.js         Objetos, acceso, delete, this, shorthand
│   ├── 02-recorrer-y-copiar.js       for...in, Object.*, spread, freeze, hasOwn
│   ├── 03-destructuring-y-opcional.js Destructuring, rest, ?. y ??
│   ├── 04-json.js                    stringify, parse, replacer, reviver, errores
│   ├── 05-map-y-set.js               Map, Set, conjuntos, WeakMap y WeakSet
│   └── 06-proyecto-fichas.js         Proyecto práctico "Fichas de estudiantes"
└── README.md                         Esta guía
```

Cada archivo JS envuelve su contenido en una **IIFE** `(function () { ... })();`.
Esto es obligatorio aquí: como el mismo `index.html` carga siete scripts, sin la IIFE dos archivos que declaren `const estudiante` provocarían el error `Identifier 'estudiante' has already been declared` y **la página dejaría de funcionar entera**.

---

## Orden sugerido para la clase (con tiempos)

Pensado para **dos sesiones de 3 horas** (o cuatro de 90 minutos).

### Sesión 1 — Objetos y sus operaciones

| Bloque | Contenido | Tiempo |
|---|---|---|
| 0 | Presentación: por qué los objetos son el centro de todo en front end. Mostrar el proyecto final funcionando. | 10 min |
| 1 | **Archivo 01, secciones 1-4**: literal, punto vs corchetes, `delete`, anidados y arrays de objetos. | 35 min |
| 2 | **Archivo 01, sección 5**: métodos y `this`. Insistir en la arrow function y en la pérdida de `this`. | 25 min |
| 3 | **Archivo 01, secciones 6-7**: shorthand y propiedades computadas. Ejemplo de conteo por ciudad. | 20 min |
| — | *Descanso* | 10 min |
| 4 | **Archivo 02, secciones 1-3**: `for...in`, `keys/values/entries` y su combinación con métodos de array. | 35 min |
| 5 | **Archivo 02, secciones 4-6**: `assign`, spread y **copia superficial vs profunda**. Es el punto más importante del día. | 30 min |
| 6 | **Archivo 02, secciones 7-8**: `freeze`, `seal`, `in`, `hasOwn`. | 15 min |
| 7 | Ejercicios de los archivos 01 y 02 en el aula. | 20 min |

### Sesión 2 — Datos que faltan, JSON y estructuras

| Bloque | Contenido | Tiempo |
|---|---|---|
| 8 | **Archivo 03, secciones 1-4**: destructuring, renombrado, defaults y anidado. | 35 min |
| 9 | **Archivo 03, secciones 5-6**: destructuring en parámetros y `rest`. Es lo que más van a usar. | 25 min |
| 10 | **Archivo 03, secciones 7-8**: `?.` y `??` vs `||`. Mostrar el ejemplo de la nota 0. | 25 min |
| — | *Descanso* | 10 min |
| 11 | **Archivo 04 completo**: JSON, stringify, parse, replacer, reviver y errores. | 40 min |
| 12 | **Archivo 05, secciones 1-4**: `Map` y sus casos reales. | 30 min |
| 13 | **Archivo 05, secciones 5-7**: `Set`, operaciones de conjuntos y mención de `WeakMap`. | 25 min |
| 14 | **Proyecto (archivo 06)**: leer `crearTarjeta` línea por línea y pulsar los dos botones. | 30 min |
| 15 | Cierre: tabla mental objeto / Map / Set. Reparto de ejercicios. | 10 min |

> Consejo para el aula: usar el botón **Limpiar** de cada consola visual antes de volver a explicar un bloque, y comentar/descomentar líneas en vivo para que se vea el cambio al recargar.

---

## Ejercicios propuestos (recopilados)

### Archivo 01 — Objetos básicos
1. Crear un objeto `libro` con `titulo`, `autor`, `anio`, `disponible` y una clave con espacio `"codigo interno"`. Imprimir cada valor con la notación adecuada.
2. Añadir `editorial`, cambiar `anio`, eliminar `disponible` con `delete` y comprobarlo con `in`.
3. Crear `biblioteca` con `nombre`, `direccion` (objeto) y `libros` (array de 3 objetos). Imprimir la ciudad y el título del segundo libro.
4. Añadir el método `cantidadDeLibros()` usando `this`, y repetirlo con una arrow function explicando por qué falla.
5. Escribir `agruparPorAutor(libros)` usando propiedades computadas.

### Archivo 02 — Recorrer y copiar
1. Dado `{ manzana: 3, pera: 0, banana: 7, kiwi: 2 }`, imprimir solo las frutas con stock, con `entries` + `filter`.
2. Escribir `invertir(objeto)` que intercambie claves y valores.
3. Demostrar el problema de la copia superficial con un objeto anidado y arreglarlo con `structuredClone`.
4. Escribir `fusionarConfiguracion(porDefecto, usuario)` sin mutar y devolviendo el resultado congelado.
5. Escribir `contarPropiedadesProfundas(objeto)` con recursión.

### Archivo 03 — Destructuring y datos opcionales
1. Extraer en una sola sentencia `titulo`, `anio` renombrado a `estreno`, el nombre del director renombrado y un `genero` por defecto.
2. Escribir `mostrarProducto({ nombre, precio, descuento = 0, stock })` y probarla con `stock: 0`.
3. Escribir `quitarDatosSensibles(usuario)` con `rest`.
4. Construir con `map` un array de emails usando `?.` y `??`.
5. Escribir `obtenerValor(objeto, 'contacto.redes.github')` con `split` y `reduce`.

### Archivo 04 — JSON
1. Imprimir un objeto anidado con `JSON.stringify(obj, null, 2)`.
2. Usar un replacer en forma de array como lista blanca de claves.
3. Escribir un replacer en forma de función que sustituya datos sensibles por `"***"`.
4. Escribir `parsearSeguro(texto, respaldo)` y probarla con cinco cadenas mal formadas.
5. Añadir un método `toJSON()` propio y comprobar que `stringify` lo respeta.
6. (Reto) Escribir `guardarEnLocal()` y `leerDeLocal()` con control de errores.

### Archivo 05 — Map y Set
1. Crear un `Map` de precios, recorrerlo y subir todos los precios un 10 %.
2. Escribir `contarLetras(texto)` que devuelva un `Map` de frecuencias.
3. Escribir `agruparPor(array, propiedad)` que devuelva un `Map`.
4. Calcular unión, intersección y diferencia de dos listas de nombres.
5. Escribir `sinDuplicadosPor(array, clave)`.
6. (Reto) Escribir `serializarMap()` y `deserializarMap()` para `localStorage`.

### Proyecto — Fichas de estudiantes
1. Mostrar el país con `?.` y `??`.
2. Botón "Solo activos" que vuelva a renderizar filtrando.
3. Botón "Ordenar por promedio" sin mutar el array original.
4. `resumenPorCiudad(estudiantes)` devolviendo un `Map`.
5. Añadir un estudiante sin `nombre` y proteger la función.
6. (Reto) Persistir el array en `localStorage` con un reviver para las fechas.

---

## Errores comunes que conviene advertir en clase

1. **`const` no congela el objeto.** Protege la variable, no su contenido. Para el contenido está `Object.freeze()`.
2. **`objeto.variable` vs `objeto[variable]`.** Con el punto se busca literalmente una clave con ese nombre. Si la clave está en una variable, van corchetes sí o sí.
3. **Pedir una propiedad inexistente devuelve `undefined`, no un error.** El error llega al intentar bajar un nivel más (`Cannot read properties of undefined`).
4. **Arrow function como método.** No tiene su propio `this`. Regla: métodos con función normal, callbacks internos con arrow.
5. **Extraer un método pierde el `this`.** Solución: `bind()`, o llamarlo siempre a través del objeto.
6. **`delete` en arrays** deja huecos y no cambia el `length`. Usar `splice()` o `filter()`.
7. **`obj.clave = undefined` no es `delete obj.clave`.** La clave sigue existiendo.
8. **`for...in` recorre también lo heredado**, y sobre arrays devuelve índices como texto. Filtrar con `Object.hasOwn()`.
9. **Spread y `Object.assign` son copias superficiales.** El segundo nivel se sigue compartiendo. Este es el error que más se repite.
10. **`Object.freeze` es superficial y falla en silencio** fuera del modo estricto. Dentro de un módulo ES lanza `TypeError`.
11. **Comprobar con `if (obj.clave)`** falla con `0`, `""` y `false`. Usar `Object.hasOwn()` o `in`.
12. **El valor por defecto del destructuring no se activa con `null`.** Solo con `undefined`.
13. **Destructurar un nivel anidado inexistente rompe igual.** Hay que poner `= {}` en el nivel intermedio.
14. **Olvidar el `= {}` final** en los parámetros desestructurados: la función deja de poder llamarse sin argumentos.
15. **`rest` debe ir siempre al final** del destructuring.
16. **`?.` no sirve para asignar** (`obj?.a = 1` es un `SyntaxError`) y solo protege el eslabón donde se escribe.
17. **`||` frente a `??`.** Con una nota de 0 o un comentario vacío, `||` da el resultado equivocado.
18. **Mezclar `??` con `||` o `&&` sin paréntesis** es un `SyntaxError`.
19. **"Un JSON" no es un objeto.** JSON es texto. Comillas dobles siempre, sin comentarios y sin coma final.
20. **`JSON.parse` sin `try/catch`** rompe la aplicación entera cuando el servidor devuelve HTML de error o una cadena vacía.
21. **Las fechas no sobreviven al viaje por JSON**: vuelven como texto y hay que reconstruirlas con `new Date()`.
22. **`JSON.stringify` de un `Map` o un `Set` devuelve `{}`.** Convertir antes con `Object.fromEntries()` o con el spread. Y un `BigInt` no se convierte: lanza `TypeError`.
23. **Usar corchetes con un `Map`** (`map['clave']`) no guarda nada en el `Map`: crea una propiedad suelta que `.size` ni cuenta.
24. **Un `Set` no deduplica objetos por contenido**, sino por referencia. Para eso, un `Map` con una clave identificadora.
25. **Declarar el mismo nombre global en dos archivos JS** de la misma página rompe todo. De ahí la IIFE en cada archivo.
