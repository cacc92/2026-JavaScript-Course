# 08 · Programación Orientada a Objetos

Material didáctico del curso **Full Stack 2 · Desarrollo Front End**.

Proyecto autocontenido en JavaScript puro (sin librerías, sin Node, sin bundlers)
que recorre la Programación Orientada a Objetos desde el objeto literal hasta un
sistema de biblioteca completo con clases, herencia y campos privados.

---

## Qué se aprende

Al terminar este proyecto el estudiante es capaz de:

- Explicar con sus palabras los cuatro pilares de la POO y reconocerlos en código.
- Crear objetos con literales, funciones fábrica, funciones constructoras y clases,
  y **justificar cuál conviene en cada caso**.
- Describir qué hace `new` paso a paso y qué es la cadena de prototipos.
- Escribir clases modernas con getters, setters validados, miembros estáticos y
  campos privados.
- Construir jerarquías con `extends` y `super`, y saber **cuándo no heredar**.
- Diagnosticar y arreglar la pérdida de contexto de `this` en callbacks.

---

## Temas cubiertos

**Fundamentos**
- Los 4 pilares en lenguaje sencillo: abstracción, encapsulamiento, herencia y polimorfismo.
- Objetos literales como punto de partida y su limitación (repetición de código).
- Funciones fábrica (factory functions).
- Funciones constructoras y el operador `new`.
- Qué hace `new` paso a paso (simulado a mano con `Object.create` + `apply`).
- Encapsulamiento clásico con closures (variables realmente privadas).

**Prototipos**
- `__proto__` frente a `Object.getPrototypeOf()`.
- La propiedad `prototype` de las funciones constructoras.
- Métodos en el prototipo y por qué ahorran memoria.
- Propiedades propias vs heredadas: `Object.hasOwn`, `hasOwnProperty`, `in`, sombreado.
- La cadena de prototipos recorrida con un bucle, eslabón a eslabón.
- `Object.create()`, descriptores de propiedad y `Object.create(null)`.
- Herencia prototípica pre-ES6 en sus tres pasos obligatorios.

**Clases ES6**
- `class` como azúcar sintáctico (con las tres pruebas de que sigue siendo una función).
- `constructor`, métodos de instancia y campos de clase.
- Getters y setters con `get` / `set` y validación dentro del setter.
- Miembros `static`: propiedades, métodos, getters estáticos y fábricas estáticas.
- Campos y métodos privados con `#`, y comparación con la convención antigua `_`.
- Detalles finos: `toString()`, clases como expresión, hoisting (TDZ), nombres calculados.

**Herencia y polimorfismo**
- `extends` y `super()` en el constructor; `super.metodo()` en los métodos.
- Sobrescritura de métodos y polimorfismo real (un bucle, sin un solo `if`).
- `instanceof`, `typeof`, `Array.isArray`, `constructor.name` y duck typing.
- Clases abstractas simuladas con `new.target` y métodos que lanzan error.
- Composición frente a herencia, con mixins vía `Object.assign`.

**El contexto `this`**
- La regla de oro: `this` depende de cómo se llama la función, no de dónde se escribe.
- Las cuatro formas de invocación y qué vale `this` en cada una.
- Pérdida de contexto en callbacks y las tres soluciones: `bind`, arrow y `self`.
- `call`, `apply` y `bind` con casos prácticos (métodos prestados, aplicación parcial).
- `this` en manejadores de eventos del DOM, con botones reales en la página.

---

## Cómo abrir el proyecto

**Doble clic en `index.html`.** No hace falta nada más: el proyecto no usa módulos
ES ni `fetch`, así que funciona perfectamente con el protocolo `file://`.

Si aun así prefieres servirlo por HTTP (por ejemplo para que las rutas se comporten
igual que en producción), tienes dos opciones sin instalar nada:

- **Extensión Live Server de VS Code**: clic derecho sobre `index.html` → *Open with Live Server*.
- **Servidor de Python** (ya viene instalado en macOS y Linux):

  ```bash
  cd "08-poo"
  python3 -m http.server 8000
  ```

  Y abrir `http://localhost:8000` en el navegador.

> **Navegador recomendado:** cualquier versión reciente de Chrome, Edge, Firefox o
> Safari. El proyecto usa campos privados `#` y la comprobación `#campo in objeto`,
> que requieren navegadores de 2021 en adelante.

### Estructura de archivos

```
08-poo/
├── index.html                        Página con las 6 secciones y el proyecto
├── css/
│   └── estilos.css                   Tema oscuro, tarjetas y consola visual
├── js/
│   ├── 01-objetos-y-constructores.js Pilares, literales, fábricas, new
│   ├── 02-prototipos.js              prototype, cadena, Object.create
│   ├── 03-clases.js                  class, get/set, static, privados
│   ├── 04-herencia-y-polimorfismo.js extends, super, abstractas, mixins
│   ├── 05-this-bind-call-apply.js    this, bind, call, apply
│   └── 06-proyecto-biblioteca.js     Sistema de biblioteca completo
└── README.md                         Esta guía
```

Cada archivo `.js` está envuelto en una **IIFE** (`(function () { ... })();`) para que
sus variables no choquen con las de los demás: los seis se cargan en el mismo
`index.html` y comparten el ámbito global. Sin la IIFE, tener `imprimir` declarado
en seis archivos daría el error *"Identifier 'imprimir' has already been declared"*.

### La consola visual

Cada sección tiene un bloque `<pre class="consola">` donde se escribe lo mismo que
en la consola del navegador. Así se puede explicar todo proyectando sin abrir
DevTools (F12). Cada consola tiene su botón **Limpiar** para reiniciarla y volver a
ejecutar una explicación desde cero recargando la página (F5).

---

## Orden sugerido para explicar en clase

Total aproximado: **6 horas**, es decir, entre 3 y 4 sesiones. Los tiempos incluyen
las pausas para preguntas, pero no los ejercicios propuestos (que van fuera de clase
o al final de cada bloque).

| # | Bloque | Archivo | Tiempo | Contenido y momentos clave |
|---|--------|---------|--------|----------------------------|
| 0 | Apertura | `index.html` | **15 min** | Enseñar la página, el índice y la consola visual. Explicar los 4 pilares con las analogías (coche, banco, perro, gato) **antes** de tocar código. |
| 1 | Objetos y constructoras | `01` | **45 min** | Literal → problema de la repetición → fábrica → constructora. Momento clave: la simulación de `new` en 4 pasos y el error al olvidarlo. |
| 2 | Prototipos | `02` | **60 min** | El bloque más denso: no correr. Momento clave: comparar `p1.conIva === p2.conIva` (false) con `p3.conIva === p4.conIva` (true), y recorrer la cadena con `mostrarCadena()`. |
| — | *Descanso* | — | 10 min | Buen punto de corte entre sesiones. |
| 3 | Clases ES6 | `03` | **75 min** | Empezar demostrando que `typeof Clase === "function"`. Después getters/setters con validación, `static` y, por último, los campos `#`. Momento clave: intentar leer `cuenta.#saldo` desde fuera y ver el `SyntaxError`. |
| 4 | Herencia y polimorfismo | `04` | **60 min** | `extends`/`super` y, sobre todo, el bucle polimórfico sin ningún `if`. Terminar con la tabla "ES UN / TIENE UN / SABE HACER". |
| 5 | El contexto `this` | `05` | **50 min** | Muy interactivo: pulsar los tres botones en directo y comparar salidas. Momento clave: extraer un método de una clase y ver el error de inmediato. |
| 6 | Proyecto biblioteca | `06` | **90 min** | Leer primero la clase `Publicacion` completa (30 min), luego `Libro`/`Revista` (15 min), luego `Biblioteca` (20 min) y por último la capa de interfaz (25 min). Prestar y devolver en directo. |

### Guion detallado del bloque 6 (el proyecto)

1. **Enseñar la aplicación funcionando antes que el código.** Prestar un libro,
   buscarlo, filtrarlo. Preguntar a la clase: *"¿cómo lo habríais hecho vosotros?"*.
2. **Clase `Publicacion`**: señalar uno a uno los campos privados y que **no hay
   ningún setter para `disponible`**. Preguntar: *"¿cómo se cambia entonces?"*
   Respuesta: solo a través de `prestar()` y `devolver()`. Eso es encapsulamiento.
3. **`new.target`**: intentar `new Publicacion(...)` en directo y ver el error.
4. **`Libro` y `Revista`**: enseñar que ninguna reescribe `prestar()`. Herencia.
5. **`descripcion()`**: abrir `crearTarjeta()` y hacer notar que **no hay ni un `if`
   preguntando el tipo**. Ese es el momento "ajá" del polimorfismo.
6. **Contadores estáticos**: explicar por qué se escribe `Publicacion.#ultimoId` y
   nunca `this.constructor.#ultimoId`.
7. **Cerrar con el ejercicio 1**: proponer añadir `Audiolibro` y comprobar que la
   interfaz lo pinta sin tocar una sola línea de la vista.

---

## Ejercicios propuestos (recopilados)

Los enunciados completos están al final de cada archivo `.js`, en un bloque de
comentarios. Aquí van resumidos para preparar la corrección.

### Archivo 01 · Objetos y constructoras
1. Objeto literal `tarea` con `resumen()`.
2. Función fábrica `crearTarea(titulo, prioridad)` con `completar()` encadenable.
3. Convertir el ejercicio 2 en función constructora blindada con `new.target`.
4. `crearMonedero(saldoInicial)` con saldo privado por closure y validaciones.
5. **Reto:** escribir `miNew(Constructora, argumentos)` recibiendo un array.

### Archivo 02 · Prototipos
1. `Cancion` con `duracionFormateada()` en el prototipo; comprobar con `===`.
2. Sombrear el método en una instancia, imprimirlo y borrarlo con `delete`.
3. `baseAnimal` + `pajaro` y `arana` con `Object.create`, sin repetir el método.
4. Función `contarEslabones(objeto)` que recorra la cadena hasta `null`.
5. **Reto:** herencia pre-ES6 completa `Vehiculo` → `Camion` con los tres pasos.

### Archivo 03 · Clases
1. Clase `Producto` con campo de clase `moneda` y método `valorTotal()`.
2. `#precio` privado con setter validado y getter calculado `precioConIva`.
3. `static IVA`, `static contador` y `Producto.masCaro(a, b)`.
4. Método privado `#registrarCambio(motivo)` con historial expuesto por copia.
5. **Reto:** clase `Carrito` con líneas privadas, `total`, `unidades` y sin duplicados.

### Archivo 04 · Herencia y polimorfismo
1. `Vehiculo` → `Motocicleta` y `Camion`, sobrescribiendo `describir()` con `super`.
2. Bucle polimórfico sobre cinco vehículos **sin usar `if` ni `instanceof`**.
3. Clase abstracta `MetodoDePago` → `TarjetaCredito` y `Efectivo`.
4. Mixins `puedeNadar`, `puedeVolar`, `puedeCorrer` sobre `Pato`, `Aguila`, `Tiburon`.
5. **Reto:** refactorizar una cadena de herencia forzada usando composición.

### Archivo 05 · this, bind, call y apply
1. Predecir el resultado de tres formas de llamar al mismo método.
2. Arreglar un `setInterval` roto de tres maneras distintas.
3. Método prestado entre dos carritos con `call` y con `apply`.
4. Aplicación parcial con `bind`: `descuento10` y `descuento50`.
5. **Reto:** implementar `miBind(funcion, objeto, ...argumentosFijos)`.

### Archivo 06 · Proyecto biblioteca
1. Clase `Audiolibro` que herede de `Publicacion` (y comprobar que la vista no cambia).
2. Filtro nuevo "recientes" usando el getter `antiguedad`.
3. Fecha de devolución calculada según `diasDePrestamo()` de cada tipo.
4. Método `masPrestadas(n)` analizando el historial privado.
5. **Reto:** clase `Socio` con límite de 3 préstamos simultáneos. ¿Herencia o composición?

---

## Errores comunes que conviene advertir

Están marcados en el código con `// ⚠️ ERROR COMÚN:` para poder buscarlos con
Ctrl+F durante la clase. Estos son los que más se repiten:

**Sobre objetos y `new`**
1. **Olvidar `new`.** Sin él, `this` vale `undefined` en modo estricto y salta
   *"Cannot set properties of undefined"*. Solución didáctica: `new.target`.
2. **Creer que `const b = a` copia un objeto.** No: es otro nombre para el mismo
   objeto. Para copiar (en superficie) se usa el spread `{ ...a }`.
3. **Acceder con corchetes sin comillas**: `objeto[curso]` busca una variable
   llamada `curso`, no la propiedad. Da `ReferenceError`.

**Sobre prototipos**
4. **Confundir `prototype` con `__proto__`.** `prototype` solo lo tienen las
   funciones (es el prototipo que *dan*); `__proto__` lo tienen todos los objetos
   (es el que *tienen*). Insistir con la tabla de la sección 2 del HTML.
5. **`Hija.prototype = Padre.prototype`** en lugar de `Object.create(...)`: no copia,
   comparte el objeto, y todo lo que se añada a la hija aparecerá en el padre.
6. **Olvidar restaurar `constructor`** tras enlazar prototipos.
7. **Usar una arrow function como método del prototipo**: no tiene `this` propio.
8. **Tocar `Object.prototype`**: contamina absolutamente todos los objetos del programa.

**Sobre clases**
9. **Recursión infinita en un setter**: escribir `this.x = valor` dentro de `set x`.
   El error es *"Maximum call stack size exceeded"*. El setter debe guardar en un
   campo distinto (`#x`).
10. **Llamar a un getter con paréntesis**: `obj.celsius()` falla porque el getter ya
    devolvió un número.
11. **Poner comas entre los métodos de una clase.** En un objeto literal sí van; en
    el cuerpo de una clase, no. Es un error de sintaxis muy frecuente.
12. **Llamar a un método `static` desde una instancia**: `m1.resumen()` es `undefined`.
13. **Usar una clase antes de declararla**: las clases no se hoistean como las funciones.
14. **En un método estático heredable, usar `this.#campo`.** Si una subclase llama al
    método, `this` es la subclase y el campo privado no existe allí → `TypeError`.
    En el proyecto se escribe siempre `Publicacion.#ultimoId` por este motivo.

**Sobre herencia**
15. **Usar `this` antes de `super()`** en el constructor de la hija: `this` aún no existe.
16. **Olvidar `super()` por completo** cuando la clase tiene `extends`.
17. **Creer que la hija puede leer los campos `#` del padre.** No puede: debe usar los
    getters públicos que el padre exponga.
18. **Escaleras de `instanceof`.** Si aparecen, casi siempre lo correcto es polimorfismo.
19. **Heredar cuando la frase natural es "tiene un"** en vez de "es un".

**Sobre `this`**
20. **Pasar un método como callback sin atarlo**: `boton.addEventListener('click', obj.metodo)`.
    Aviso importante: en `setTimeout` el `this` es `window`, no `undefined`, así que
    **muchas veces no salta ningún error**; simplemente el contador no sube y aparece
    `NaN`. Un fallo silencioso es peor que uno ruidoso.
21. **Poner paréntesis al registrar el manejador**: `addEventListener('click', f())`
    ejecuta `f` inmediatamente y registra su resultado.
22. **Intentar quitar con `removeEventListener` una función registrada con `.bind()`**:
    cada `bind` crea una función nueva, hay que guardarla en una variable.
23. **Usar una arrow function como método de un objeto literal**: hereda el `this` de
    fuera, que no es el objeto.

---

## Notas técnicas para el docente

- **La métrica "Objetos creados" muestra 7 y el catálogo 6.** No es un fallo: la
  demostración de clase abstracta crea un `Comic` que sí llega a construirse (y por
  tanto incrementa el contador estático) pero nunca se agrega a la biblioteca, porque
  su `descripcion()` lanza error. Es un buen punto de conversación sobre la diferencia
  entre *objetos creados* y *objetos en la colección*.
- **El formulario de alta no tiene `required` a propósito**, para poder pulsar
  "Agregar al catálogo" con el título vacío y ver cómo el propio constructor rechaza
  el objeto. La validación vive en la clase, no en el HTML: ese es el mensaje.
- **Los `setTimeout` del archivo 05 imprimen al final de su consola**, después del
  texto "(Fin del archivo 05)". Conviene anticiparlo en clase para explicar de paso
  que el código asíncrono se ejecuta cuando la pila principal queda libre.
- **Se usa `eval()` dos veces en el archivo 03**, únicamente para poder *capturar* dos
  errores que de otro modo impedirían cargar el archivo entero (leer un campo `#`
  desde fuera y usar una clase antes de declararla). Está comentado en el código;
  merece la pena decir en voz alta que `eval()` no debe usarse en código real.
- **Todos los textos que el usuario escribe se escapan** con la función `escapar()`
  antes de insertarse con `innerHTML`. Es una buena excusa para mencionar el XSS
  aunque el tema se vea a fondo más adelante.
