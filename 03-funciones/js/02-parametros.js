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

(function () {
  'use strict';

  // Consola visual propia de esta sección (<pre id="salida-02">).
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

  titulo('1. Parámetro vs argumento');

  // `nombre` y `curso` son PARÁMETROS.
  function matricular(nombre, curso) {
    return nombre + ' queda matriculado/a en ' + curso;
  }

  // 'Marta' y 'Full Stack 2' son ARGUMENTOS.
  imprimir(matricular('Marta', 'Full Stack 2'));
  imprimir(matricular('Diego', 'Bases de Datos'));

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

  titulo('2. Faltan o sobran argumentos');

  imprimir('Falta el curso ->', matricular('Ana'));
  // "Ana queda matriculado/a en undefined"  <- ⚠️ error silencioso típico

  imprimir('Sobran argumentos ->', matricular('Luis', 'Diseño', 'extra', 42));
  // Los dos últimos argumentos se descartan sin protestar.

  // ✅ BUENA PRÁCTICA: validar lo que llega cuando el dato es crítico.
  function matricularSeguro(nombre, curso) {
    if (typeof nombre !== 'string' || nombre.trim() === '') {
      return 'Error: el nombre es obligatorio';
    }
    if (typeof curso !== 'string' || curso.trim() === '') {
      return 'Error: el curso es obligatorio';
    }
    return nombre + ' queda matriculado/a en ' + curso;
  }

  imprimir('Con validación ->', matricularSeguro('Ana'));
  imprimir('Con validación ->', matricularSeguro('Ana', 'Full Stack 2'));

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

  titulo('3. Parámetros por defecto');

  /**
   * generarCarnet(): arma la línea de un carnet de estudiante.
   * @param {string} nombre - obligatorio en la práctica
   * @param {string} [curso='Full Stack 2'] - valor por defecto
   * @param {number} [anio=2026] - valor por defecto
   */
  function generarCarnet(nombre, curso = 'Full Stack 2', anio = 2026) {
    return nombre + ' | ' + curso + ' | curso ' + anio;
  }

  imprimir(generarCarnet('Marta'));                        // usa los dos por defecto
  imprimir(generarCarnet('Diego', 'Bases de Datos'));      // usa solo el año por defecto
  imprimir(generarCarnet('Ana', 'UX', 2027));              // no usa ninguno

  // Para saltarte un parámetro intermedio y quedarte con su valor
  // por defecto, se pasa `undefined` de forma explícita.
  imprimir(generarCarnet('Sara', undefined, 2028));

  // ⚠️ ERROR COMÚN: creer que el valor por defecto cubre también a null.
  imprimir('Con null ->', generarCarnet('Iván', null));
  // "Iván | null | curso 2026"  -> null es un valor, no activa el defecto.

  // Un parámetro por defecto puede USAR los parámetros anteriores.
  // El orden importa: solo puede mirar hacia su izquierda.
  function crearCorreo(nombre, dominio = 'escuela.edu', usuario = nombre.toLowerCase()) {
    return usuario + '@' + dominio;
  }

  imprimir('crearCorreo("Marta") ->', crearCorreo('Marta'));
  imprimir('crearCorreo("Marta", "gmail.com") ->', crearCorreo('Marta', 'gmail.com'));

  // El valor por defecto se evalúa EN CADA LLAMADA, no una sola vez.
  // Por eso puede ser incluso una llamada a otra función.
  function marcaDeTiempo(etiqueta, momento = obtenerContadorLlamada()) {
    return etiqueta + ' -> llamada nº ' + momento;
  }

  let llamadas = 0;
  function obtenerContadorLlamada() {
    llamadas += 1;
    return llamadas;
  }

  imprimir(marcaDeTiempo('Primera'));   // llamada nº 1
  imprimir(marcaDeTiempo('Segunda'));   // llamada nº 2
  imprimir(marcaDeTiempo('Tercera', 99)); // no evalúa el defecto: usa 99

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

  titulo('4. Parámetro rest: muchos argumentos, un array');

  /**
   * sumarTodo(): suma cualquier cantidad de números.
   * @param {...number} numeros
   * @returns {number}
   */
  function sumarTodo(...numeros) {
    // `numeros` es un array normal: tiene .length, .reduce, .map...
    let total = 0;
    for (const numero of numeros) {
      total += numero;
    }
    return total;
  }

  imprimir('sumarTodo() ->', sumarTodo());                 // 0
  imprimir('sumarTodo(5) ->', sumarTodo(5));               // 5
  imprimir('sumarTodo(1, 2, 3, 4) ->', sumarTodo(1, 2, 3, 4)); // 10

  // Comprobemos que lo que recoge el rest es un array AUTÉNTICO.
  function comprobarRest(...valores) {
    imprimir('   ¿Array.isArray(valores)? ->', Array.isArray(valores)); // true
    imprimir('   valores.length ->', valores.length);
    imprimir('   valores.map(...) ->', valores.map((v) => v * 10));     // los métodos de array funcionan
  }
  comprobarRest(1, 2, 3);

  // Rest combinado con parámetros normales: los fijos van primero.
  /**
   * boletin(): primer argumento el nombre, el resto todas sus notas.
   */
  function boletin(nombre, ...notas) {
    if (notas.length === 0) return nombre + ' todavía no tiene notas.';
    const suma = notas.reduce((acumulado, nota) => acumulado + nota, 0);
    const media = suma / notas.length;
    return nombre + ' | notas: ' + notas.join(', ') + ' | media: ' + media.toFixed(2);
  }

  imprimir(boletin('Marta', 8, 9, 10));
  imprimir(boletin('Diego', 4, 6));
  imprimir(boletin('Nuevo'));

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

  titulo('5. Operador spread al invocar');

  const notasDeAna = [7, 8.5, 9, 10];

  // Sin spread pasamos UN argumento (el array entero) -> resultado incorrecto.
  imprimir('sumarTodo(notasDeAna) ->', sumarTodo(notasDeAna)); // "07,8.5,9,10" (texto)

  // Con spread pasamos CUATRO argumentos numéricos -> resultado correcto.
  imprimir('sumarTodo(...notasDeAna) ->', sumarTodo(...notasDeAna)); // 34.5

  // Caso clásico: Math.max() NO acepta arrays, solo números sueltos.
  imprimir('Math.max(notasDeAna) ->', Math.max(notasDeAna));       // NaN
  imprimir('Math.max(...notasDeAna) ->', Math.max(...notasDeAna)); // 10
  imprimir('Math.min(...notasDeAna) ->', Math.min(...notasDeAna)); // 7

  // Spread también sirve para mezclar valores sueltos y arrays.
  const notasExtra = [6, 5];
  imprimir('Mezcla ->', sumarTodo(1, ...notasDeAna, ...notasExtra, 100));

  // Y fuera de las funciones: copiar y combinar arrays y objetos.
  const copiaDeNotas = [...notasDeAna];          // copia superficial, array nuevo
  const todasLasNotas = [...notasDeAna, ...notasExtra];
  imprimir('Copia ->', copiaDeNotas, '| ¿es el mismo array?', copiaDeNotas === notasDeAna); // false
  imprimir('Combinadas ->', todasLasNotas);

  const alumnoBase = { nombre: 'Ana', curso: 'Full Stack 2' };
  const alumnoConNota = { ...alumnoBase, nota: 9.5 };  // objeto nuevo con una clave más
  imprimir('Objeto ampliado ->', alumnoConNota);

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

  titulo('6. El objeto arguments (código antiguo)');

  function inspeccionarArguments() {
    imprimir('   arguments.length ->', arguments.length);
    imprimir('   arguments[0] ->', arguments[0]);
    imprimir('   ¿Array.isArray(arguments)? ->', Array.isArray(arguments)); // false

    // Para usarlo como array hay que convertirlo primero.
    const comoArray = Array.from(arguments);   // forma moderna
    // const comoArray = [].slice.call(arguments); // forma antigua que verás en código viejo
    imprimir('   Convertido y ordenado ->', comoArray.sort((a, b) => a - b));
    return comoArray.length;
  }

  inspeccionarArguments(30, 10, 20);

  // ⚠️ ERROR COMÚN: usar `arguments` dentro de una función flecha.
  // Las flechas NO tienen `arguments` propio. Si lo escribes dentro de
  // una, JavaScript sube por el código buscando la función normal que
  // la contiene y te devuelve el `arguments` DE ESA otra función.
  // El resultado es un dato que no tiene nada que ver con los
  // argumentos que le pasaste a la flecha (y si no hay ninguna función
  // normal alrededor, es directamente un ReferenceError).
  function envoltorioNormal(a, b) {
    // Esta flecha recibe 3 argumentos, pero `arguments` es el de
    // envoltorioNormal, que recibió solo 2.
    const flechaConfundida = () => arguments.length;
    return 'La flecha recibió 3 argumentos, pero arguments.length dice: ' + flechaConfundida(1, 2, 3);
  }
  imprimir(envoltorioNormal('x', 'y'));   // dice 2, no 3

  // La versión con rest sí cuenta lo que de verdad recibe la flecha.
  const flechaConRest = (...args) => 'Con rest la flecha cuenta bien: ' + args.length;
  imprimir(flechaConRest(1, 2, 3));       // 3

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

  titulo('7. Un objeto como parámetro (opciones con nombre)');

  /**
   * crearProducto(): recibe un objeto y lo desestructura en el propio
   * paréntesis, asignando valores por defecto a lo que no llegue.
   * El `= {}` final evita el error si se llama sin argumentos.
   */
  function crearProducto({ nombre, precio, stock = 0, activo = true, categoria = 'general' } = {}) {
    return {
      nombre: nombre || 'Sin nombre',
      precio: precio || 0,
      stock: stock,
      activo: activo,
      categoria: categoria,
      // Campo calculado: el valor total del stock de ese producto.
      valorInventario: (precio || 0) * stock
    };
  }

  imprimir(crearProducto({ nombre: 'Teclado mecánico', precio: 45, stock: 10 }));
  imprimir(crearProducto({ precio: 20, categoria: 'accesorios', nombre: 'Ratón' }));
  imprimir(crearProducto());   // gracias al `= {}` no revienta

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

  titulo('8. Primitivos se copian, objetos se comparten');

  let contadorLocal = 10;

  function intentarCambiarNumero(numero) {
    numero = 999;          // solo cambia la copia interna
    return numero;
  }

  imprimir('Devuelto por la función ->', intentarCambiarNumero(contadorLocal)); // 999
  imprimir('Variable original ->', contadorLocal);                              // 10 (intacta)

  const carrito = { producto: 'Teclado', unidades: 1 };

  function agregarUnidad(carritoRecibido) {
    carritoRecibido.unidades += 1;   // ⚠️ modifica el objeto ORIGINAL
    return carritoRecibido;
  }

  agregarUnidad(carrito);
  imprimir('Carrito tras la función ->', carrito); // unidades: 2

  // ✅ BUENA PRÁCTICA: no modificar los objetos que recibes. Devuelve
  // uno nuevo con spread. Esto se llama INMUTABILIDAD y lo retomaremos
  // al hablar de funciones puras en js/06-this-y-pureza.js.
  function agregarUnidadSinTocar(carritoRecibido) {
    return { ...carritoRecibido, unidades: carritoRecibido.unidades + 1 };
  }

  const carritoNuevo = agregarUnidadSinTocar(carrito);
  imprimir('Original ->', carrito);       // unidades: 2 (sin tocar)
  imprimir('Copia modificada ->', carritoNuevo); // unidades: 3

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
