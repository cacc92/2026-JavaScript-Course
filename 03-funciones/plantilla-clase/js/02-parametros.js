/**
 * ============================================================
 * ARCHIVO: js/02-parametros.js
 * PROYECTO: 03 · Funciones a fondo
 * ------------------------------------------------------------
 * TEMA: cómo entran los datos en una función y cómo salen.
 *
 * QUÉ SE APRENDE AQUÍ:
 *   1. La diferencia exacta entre PARÁMETRO y ARGUMENTO.
 *   2. Qué pasa si sobran o faltan argumentos.
 *   3. Parámetros por defecto (valores de reserva).
 *   4. El parámetro REST (...args): recoger muchos en un array.
 *   5. El operador SPREAD (...) al invocar: repartir un array
 *      en argumentos sueltos.
 *   6. El objeto `arguments` (legado) y por qué ya casi no se usa.
 *   7. Objetos como parámetro y desestructuración de parámetros.
 *   8. Valores primitivos vs objetos: qué se copia y qué se comparte.
 * ============================================================
 */

// La IIFE ya viene escrita: aísla las variables de este archivo para
// que no choquen con las de los demás .js que carga el index.html.
(function () {
  'use strict';

  // Consola visual propia de esta sección (<pre id="salida-02">).
  // Andamiaje ya escrito: no se teclea en clase.
  const { imprimir, titulo } = window.Utilidades.crearConsola('salida-02');

  // ============================================================
  // 1. PARÁMETRO vs ARGUMENTO
  // ============================================================

  /*
   * Son dos palabras que se confunden constantemente:
   *
   *   PARÁMETRO -> el nombre que escribes al DEFINIR la función.
   *                Es una caja vacía, un hueco a rellenar.
   *   ARGUMENTO -> el valor real que envías al LLAMARLA.
   *                Es lo que metes dentro de la caja.
   *
   * Analogía: en un formulario impreso, el hueco que pone "Nombre:"
   * es el parámetro; lo que tú escribes ahí, "Marta", es el argumento.
   */

  // TODO (en clase):
  //   1. titulo('1. Parámetro vs argumento').
  //   2. Escribe function matricular(nombre, curso) que devuelva
  //      nombre + ' queda matriculado/a en ' + curso
  //      (nombre y curso son los PARÁMETROS; se reutiliza en la sección 2).
  //   3. Llámala dos veces e imprime el resultado:
  //      matricular('Marta', 'Full Stack 2') y matricular('Diego', 'Bases de Datos')
  //      ('Marta' y 'Full Stack 2' son los ARGUMENTOS).
  //   Resultado esperado en pantalla:
  //      Marta queda matriculado/a en Full Stack 2
  //      Diego queda matriculado/a en Bases de Datos
  //   (aprox. 6 líneas)

  // Los parámetros son variables LOCALES: solo existen dentro de la función.
  // ⚠️ ERROR COMÚN: intentar usar `nombre` fuera de matricular().
  //    Daría "ReferenceError: nombre is not defined".

  // ============================================================
  // 2. CUANDO FALTAN O SOBRAN ARGUMENTOS
  // ============================================================

  /*
   * JavaScript es muy permisivo: no comprueba cuántos argumentos
   * mandas. Si faltan, los parámetros sobrantes valen `undefined`;
   * si sobran, simplemente se ignoran (aunque siguen accesibles a
   * través del objeto `arguments`, que veremos más abajo).
   *
   * Esto es cómodo, pero es fuente de bugs silenciosos: nadie te avisa.
   */

  // TODO (en clase):
  //   1. titulo('2. Faltan o sobran argumentos').
  //   2. Llama a matricular('Ana') con un solo argumento e imprímelo con
  //      la etiqueta 'Falta el curso ->'. Señala el undefined en pantalla.
  //   3. Llama a matricular('Luis', 'Diseño', 'extra', 42) con la etiqueta
  //      'Sobran argumentos ->' y señala que los dos últimos se descartan
  //      sin protestar.
  //   Resultado esperado en pantalla:
  //      Falta el curso -> Ana queda matriculado/a en undefined
  //      Sobran argumentos -> Luis queda matriculado/a en Diseño
  //   (aprox. 4 líneas)

  // ✅ BUENA PRÁCTICA: validar lo que llega cuando el dato es crítico.

  // TODO (en clase):
  //   1. Escribe function matricularSeguro(nombre, curso) que, ANTES de
  //      construir la frase, compruebe con dos guardas:
  //        if (typeof nombre !== 'string' || nombre.trim() === '')
  //           return 'Error: el nombre es obligatorio';
  //        y lo mismo para curso -> 'Error: el curso es obligatorio'.
  //      Si todo va bien devuelve la misma frase que matricular().
  //   2. Imprime dos llamadas con la etiqueta 'Con validación ->':
  //      matricularSeguro('Ana') y matricularSeguro('Ana', 'Full Stack 2').
  //   Resultado esperado en pantalla:
  //      Con validación -> Error: el curso es obligatorio
  //      Con validación -> Ana queda matriculado/a en Full Stack 2
  //   (aprox. 11 líneas)

  // ============================================================
  // 3. PARÁMETROS POR DEFECTO
  // ============================================================

  /*
   * Desde ES6 podemos dar un valor de reserva a un parámetro:
   *
   *     function f(a = 10) { ... }
   *
   * Ese valor se usa SOLO si el argumento llega como `undefined`
   * (o si directamente no llega). Ojo: null, 0, '' y false SÍ son
   * valores, así que NO activan el valor por defecto.
   */

  // TODO (en clase):
  //   1. titulo('3. Parámetros por defecto').
  //   2. Escribe function generarCarnet(nombre, curso = 'Full Stack 2', anio = 2026)
  //      que devuelva nombre + ' | ' + curso + ' | curso ' + anio.
  //   3. Imprime CUATRO llamadas, en este orden:
  //        generarCarnet('Marta')                 -> usa los dos por defecto
  //        generarCarnet('Diego', 'Bases de Datos') -> usa solo el año por defecto
  //        generarCarnet('Ana', 'UX', 2027)       -> no usa ninguno
  //        generarCarnet('Sara', undefined, 2028) -> saltarse uno intermedio
  //   Resultado esperado en pantalla:
  //      Marta | Full Stack 2 | curso 2026
  //      Diego | Bases de Datos | curso 2026
  //      Ana | UX | curso 2027
  //      Sara | Full Stack 2 | curso 2028
  //   (aprox. 8 líneas)

  // ⚠️ ERROR COMÚN: creer que el valor por defecto cubre también a null.

  // TODO (en clase):
  //   1. imprimir('Con null ->', generarCarnet('Iván', null));
  //   2. Lee en voz alta la salida: null es un valor, no activa el defecto.
  //   Resultado esperado en pantalla: Con null -> Iván | null | curso 2026
  //   (aprox. 1 línea)

  // TODO (en clase):
  //   1. Un parámetro por defecto puede USAR los parámetros anteriores
  //      (solo mira hacia su izquierda). Escribe:
  //      function crearCorreo(nombre, dominio = 'escuela.edu', usuario = nombre.toLowerCase())
  //      que devuelva usuario + '@' + dominio.
  //   2. Imprime crearCorreo('Marta') y crearCorreo('Marta', 'gmail.com').
  //   Resultado esperado en pantalla:
  //      crearCorreo("Marta") -> marta@escuela.edu
  //      crearCorreo("Marta", "gmail.com") -> marta@gmail.com
  //   (aprox. 5 líneas)

  // TODO (en clase):
  //   1. El valor por defecto se evalúa EN CADA LLAMADA, no una sola vez.
  //      Escribe function marcaDeTiempo(etiqueta, momento = obtenerContadorLlamada())
  //      que devuelva etiqueta + ' -> llamada nº ' + momento.
  //   2. Debajo, let llamadas = 0; y function obtenerContadorLlamada() que
  //      haga llamadas += 1 y devuelva llamadas.
  //   3. Imprime marcaDeTiempo('Primera'), marcaDeTiempo('Segunda') y
  //      marcaDeTiempo('Tercera', 99) -> esta última NO evalúa el defecto.
  //   Resultado esperado en pantalla:
  //      Primera -> llamada nº 1
  //      Segunda -> llamada nº 2
  //      Tercera -> llamada nº 99
  //   (aprox. 10 líneas)

  // ============================================================
  // 4. PARÁMETRO REST (...args)
  // ============================================================

  /*
   * A veces no sabemos cuántos datos van a llegar: sumar 3 notas,
   * o 12, o ninguna. El parámetro REST recoge "todo lo que quede"
   * dentro de un ARRAY DE VERDAD.
   *
   * Reglas:
   *   - Se escribe con tres puntos delante del nombre: ...notas
   *   - Solo puede haber UNO por función.
   *   - Debe ser SIEMPRE el último parámetro.
   */

  // TODO (en clase):
  //   1. titulo('4. Parámetro rest: muchos argumentos, un array').
  //   2. Escribe function sumarTodo(...numeros) que acumule con
  //      for (const numero of numeros) y devuelva el total
  //      (se reutiliza en la sección 5: no la borres).
  //   3. Imprime tres llamadas: sumarTodo(), sumarTodo(5) y sumarTodo(1, 2, 3, 4).
  //   Resultado esperado en pantalla:
  //      sumarTodo() -> 0
  //      sumarTodo(5) -> 5
  //      sumarTodo(1, 2, 3, 4) -> 10
  //   (aprox. 10 líneas)

  // TODO (en clase):
  //   1. Demuestra que lo que recoge el rest es un array AUTÉNTICO.
  //      Escribe function comprobarRest(...valores) que imprima
  //      Array.isArray(valores), valores.length y valores.map((v) => v * 10).
  //   2. Llámala con comprobarRest(1, 2, 3).
  //   Resultado esperado en pantalla:
  //      ¿Array.isArray(valores)? -> true
  //      valores.length -> 3
  //      valores.map(...) -> [10, 20, 30]
  //   (aprox. 7 líneas)

  // TODO (en clase):
  //   1. Rest combinado con parámetros normales: los fijos van primero.
  //      Escribe function boletin(nombre, ...notas):
  //        - si notas.length === 0 devuelve nombre + ' todavía no tiene notas.'
  //        - si no, calcula la suma con notas.reduce((acumulado, nota) => acumulado + nota, 0),
  //          la media, y devuelve
  //          nombre + ' | notas: ' + notas.join(', ') + ' | media: ' + media.toFixed(2)
  //   2. Imprime boletin('Marta', 8, 9, 10), boletin('Diego', 4, 6) y boletin('Nuevo').
  //   Resultado esperado en pantalla:
  //      Marta | notas: 8, 9, 10 | media: 9.00
  //      Diego | notas: 4, 6 | media: 5.00
  //      Nuevo todavía no tiene notas.
  //   (aprox. 10 líneas)

  // ⚠️ ERROR COMÚN: colocar el rest en medio.
  //    function mal(...notas, nombre) {}
  //    -> SyntaxError: Rest parameter must be last formal parameter
  //    (está comentado a propósito: descomentarlo rompe TODO el archivo)

  // ============================================================
  // 5. OPERADOR SPREAD AL INVOCAR
  // ============================================================

  /*
   * SPREAD usa los mismos tres puntos que REST, pero hace lo CONTRARIO.
   * La forma de distinguirlos es mirar DÓNDE están escritos:
   *
   *   - En la DEFINICIÓN de la función  -> REST   (agrupa: muchos -> array)
   *   - En la LLAMADA a la función      -> SPREAD (reparte: array -> muchos)
   *
   * Analogía: rest mete la compra en una bolsa; spread la saca y la
   * coloca en la mesa, cada producto por separado.
   */

  // DATOS DE PARTIDA (ya escritos).
  const notasDeAna = [7, 8.5, 9, 10];
  const notasExtra = [6, 5];

  // TODO (en clase):
  //   1. titulo('5. Operador spread al invocar').
  //   2. Llama a sumarTodo(notasDeAna) SIN spread: pasa UN argumento (el array
  //      entero) y el resultado es un texto pegado. Imprímelo.
  //   3. Llama a sumarTodo(...notasDeAna) CON spread: pasa cuatro números.
  //   Resultado esperado en pantalla:
  //      sumarTodo(notasDeAna) -> 07,8.5,9,10
  //      sumarTodo(...notasDeAna) -> 34.5
  //   (aprox. 3 líneas)

  // TODO (en clase):
  //   1. Caso clásico: Math.max() NO acepta arrays, solo números sueltos.
  //      Imprime Math.max(notasDeAna), Math.max(...notasDeAna) y Math.min(...notasDeAna).
  //   Resultado esperado en pantalla:
  //      Math.max(notasDeAna) -> NaN
  //      Math.max(...notasDeAna) -> 10
  //      Math.min(...notasDeAna) -> 7
  //   (aprox. 3 líneas)

  // TODO (en clase):
  //   1. Spread también mezcla valores sueltos y arrays. Imprime con la
  //      etiqueta 'Mezcla ->' el resultado de
  //      sumarTodo(1, ...notasDeAna, ...notasExtra, 100).
  //   Resultado esperado en pantalla: Mezcla -> 146.5
  //   (aprox. 1 línea)

  // TODO (en clase):
  //   1. Fuera de las funciones, spread copia y combina arrays:
  //        const copiaDeNotas = [...notasDeAna];
  //        const todasLasNotas = [...notasDeAna, ...notasExtra];
  //   2. Imprime la copia junto a la comparación copiaDeNotas === notasDeAna
  //      (sale false: es un array NUEVO) y luego todasLasNotas.
  //   3. Repite la idea con objetos:
  //        const alumnoBase = { nombre: 'Ana', curso: 'Full Stack 2' };
  //        const alumnoConNota = { ...alumnoBase, nota: 9.5 };
  //      e imprime alumnoConNota con la etiqueta 'Objeto ampliado ->'.
  //   Resultado esperado en pantalla:
  //      Copia -> [7, 8.5, 9, 10] | ¿es el mismo array? false
  //      Combinadas -> [7, 8.5, 9, 10, 6, 5]
  //      Objeto ampliado -> { "nombre": "Ana", "curso": "Full Stack 2", "nota": 9.5 }
  //   (aprox. 8 líneas)

  // ============================================================
  // 6. EL OBJETO `arguments` (LEGADO)
  // ============================================================

  /*
   * Antes de ES6 no existía el parámetro rest. Para recoger todos
   * los argumentos se usaba `arguments`, una variable que aparece
   * automáticamente dentro de cualquier función NORMAL.
   *
   * Su gran problema: PARECE un array pero NO lo es. Es un objeto
   * "array-like": tiene .length y se accede por índice, pero no
   * tiene .map(), .filter() ni .reduce().
   */

  // TODO (en clase):
  //   1. titulo('6. El objeto arguments (código antiguo)').
  //   2. Escribe function inspeccionarArguments() SIN ningún parámetro
  //      declarado, y dentro imprime arguments.length, arguments[0] y
  //      Array.isArray(arguments) (sale false).
  //   3. Conviértelo con const comoArray = Array.from(arguments); y muestra
  //      comoArray.sort((a, b) => a - b) con la etiqueta 'Convertido y ordenado ->'.
  //      Deja comentada la forma antigua: [].slice.call(arguments).
  //   4. Llámala con inspeccionarArguments(30, 10, 20).
  //   Resultado esperado en pantalla:
  //      arguments.length -> 3
  //      arguments[0] -> 30
  //      ¿Array.isArray(arguments)? -> false
  //      Convertido y ordenado -> [10, 20, 30]
  //   (aprox. 9 líneas)

  // ⚠️ ERROR COMÚN: usar `arguments` dentro de una función flecha.
  // Las flechas NO tienen `arguments` propio. Si lo escribes dentro de
  // una, JavaScript sube por el código buscando la función normal que
  // la contiene y te devuelve el `arguments` DE ESA otra función.
  // El resultado es un dato que no tiene nada que ver con los
  // argumentos que le pasaste a la flecha (y si no hay ninguna función
  // normal alrededor, es directamente un ReferenceError).

  // TODO (en clase):
  //   1. Escribe function envoltorioNormal(a, b) y, DENTRO, una flecha:
  //        const flechaConfundida = () => arguments.length;
  //      Devuelve la frase
  //      'La flecha recibió 3 argumentos, pero arguments.length dice: ' + flechaConfundida(1, 2, 3)
  //   2. Llámala con envoltorioNormal('x', 'y') e imprime el resultado:
  //      dice 2 (los de envoltorioNormal), no 3.
  //   3. Escribe la versión correcta con rest:
  //      const flechaConRest = (...args) => 'Con rest la flecha cuenta bien: ' + args.length;
  //      e imprime flechaConRest(1, 2, 3).
  //   Resultado esperado en pantalla:
  //      La flecha recibió 3 argumentos, pero arguments.length dice: 2
  //      Con rest la flecha cuenta bien: 3
  //   (aprox. 8 líneas)

  // ✅ BUENA PRÁCTICA: en código nuevo usa SIEMPRE ...rest.
  // Es más claro, funciona en flechas y te da un array de verdad.

  // ============================================================
  // 7. OBJETOS COMO PARÁMETRO Y DESESTRUCTURACIÓN
  // ============================================================

  /*
   * Cuando una función necesita cinco o seis datos, la lista de
   * parámetros se vuelve imposible de recordar:
   *
   *     crearProducto('Teclado', 45, 10, true, 'periféricos')
   *     ¿qué era el 10? ¿y el true?
   *
   * Solución profesional: pasar UN objeto con nombres. El orden deja
   * de importar y la llamada se documenta sola.
   */

  // TODO (en clase):
  //   1. titulo('7. Un objeto como parámetro (opciones con nombre)').
  //   2. Escribe crearProducto desestructurando EN EL PROPIO PARÉNTESIS:
  //      function crearProducto({ nombre, precio, stock = 0, activo = true,
  //                               categoria = 'general' } = {}) { ... }
  //      Presta atención al `= {}` final: evita el error si se llama sin argumentos.
  //   3. Debe devolver un objeto con nombre (o 'Sin nombre'), precio (o 0),
  //      stock, activo, categoria y un campo calculado
  //      valorInventario: (precio || 0) * stock.
  //   4. Imprime tres llamadas:
  //        crearProducto({ nombre: 'Teclado mecánico', precio: 45, stock: 10 })
  //        crearProducto({ precio: 20, categoria: 'accesorios', nombre: 'Ratón' })
  //        crearProducto()   -> gracias al `= {}` no revienta
  //   Resultado esperado en pantalla: tres objetos en formato JSON; el primero
  //   con "valorInventario": 450, el segundo con "stock": 0 y "valorInventario": 0,
  //   y el tercero con "nombre": "Sin nombre" y "categoria": "general".
  //   (aprox. 14 líneas)

  // ⚠️ ERROR COMÚN: olvidar el `= {}`. Sin él, llamar a la función sin
  // argumentos intenta desestructurar `undefined` y lanza un TypeError.

  // ============================================================
  // 8. ¿SE COPIA O SE COMPARTE? PRIMITIVOS VS OBJETOS
  // ============================================================

  /*
   * Al pasar un argumento, JavaScript siempre copia el VALOR.
   * La trampa está en qué es "el valor":
   *
   *   - En un primitivo (número, texto, booleano) el valor es el dato
   *     en sí: la función recibe una copia y no puede tocar el original.
   *   - En un objeto o array, el valor es la DIRECCIÓN de memoria.
   *     La copia apunta al mismo sitio, así que modificar sus
   *     propiedades SÍ afecta al original.
   *
   * Analogía: con un primitivo le das a la función una fotocopia;
   * con un objeto le das la llave de tu casa.
   */

  // TODO (en clase):
  //   1. titulo('8. Primitivos se copian, objetos se comparten').
  //   2. Declara let contadorLocal = 10; y escribe
  //      function intentarCambiarNumero(numero) { numero = 999; return numero; }
  //   3. Imprime lo que devuelve la función y, después, contadorLocal:
  //      la variable original sigue intacta.
  //   Resultado esperado en pantalla:
  //      Devuelto por la función -> 999
  //      Variable original -> 10
  //   (aprox. 6 líneas)

  // TODO (en clase):
  //   1. Declara const carrito = { producto: 'Teclado', unidades: 1 };
  //   2. Escribe function agregarUnidad(carritoRecibido) que haga
  //      carritoRecibido.unidades += 1 y lo devuelva. ⚠️ Modifica el ORIGINAL.
  //   3. Llámala con agregarUnidad(carrito) e imprime carrito con la etiqueta
  //      'Carrito tras la función ->'.
  //   Resultado esperado en pantalla:
  //      Carrito tras la función -> { "producto": "Teclado", "unidades": 2 }
  //   (aprox. 6 líneas)

  // ✅ BUENA PRÁCTICA: no modificar los objetos que recibes. Devuelve
  // uno nuevo con spread. Esto se llama INMUTABILIDAD y lo retomaremos
  // al hablar de funciones puras en js/06-this-y-pureza.js.

  // TODO (en clase):
  //   1. Escribe la versión que NO toca nada:
  //      function agregarUnidadSinTocar(carritoRecibido) {
  //        return { ...carritoRecibido, unidades: carritoRecibido.unidades + 1 };
  //      }
  //   2. Guarda const carritoNuevo = agregarUnidadSinTocar(carrito); e imprime
  //      primero carrito ('Original ->') y luego carritoNuevo ('Copia modificada ->').
  //   Resultado esperado en pantalla:
  //      Original -> { "producto": "Teclado", "unidades": 2 }
  //      Copia modificada -> { "producto": "Teclado", "unidades": 3 }
  //   (aprox. 5 líneas)

  // ============================================================
  // EJERCICIOS PROPUESTOS
  // ------------------------------------------------------------
  // 1) (Fácil) Escribe saludar(nombre, saludo = 'Hola') que devuelva
  //    "Hola, Marta". Pruébala con y sin el segundo argumento.
  //
  // 2) (Fácil) Crea contarArgumentos(...datos) que devuelva una frase
  //    con cuántos argumentos recibió y de qué tipo es el primero.
  //
  // 3) (Media) Escribe mayorDeTodos(...numeros) que devuelva el número
  //    más grande SIN usar Math.max, recorriendo el array con un bucle.
  //    Luego compárala con Math.max(...numeros).
  //
  // 4) (Media) Crea aplicarDescuento({ precio, porcentaje = 10 }) que
  //    devuelva el precio final. Valida que el porcentaje esté entre
  //    0 y 100 y, si no lo está, devuelve el precio sin tocar.
  //
  // 5) (Difícil) Escribe fusionarAlumnos(alumnoBase, ...actualizaciones)
  //    que reciba un objeto de partida y cualquier cantidad de objetos
  //    con cambios, y devuelva un objeto NUEVO con todo combinado
  //    (el último gana). No modifiques ninguno de los originales.
  //    Pista: reduce() + spread.
  // ============================================================
})();
