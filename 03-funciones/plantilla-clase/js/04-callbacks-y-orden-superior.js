/**
 * ============================================================
 * ARCHIVO: js/04-callbacks-y-orden-superior.js
 * PROYECTO: 03 · Funciones a fondo
 * ------------------------------------------------------------
 * TEMA: funciones que trabajan con otras funciones.
 *
 * QUÉ SE APRENDE AQUÍ:
 *   1. Qué es una función de orden superior.
 *   2. CALLBACKS: pasar una función como argumento.
 *   3. Cómo funcionan por dentro map, filter y reduce
 *      (los escribimos nosotros antes de usar los originales).
 *   4. Funciones que DEVUELVEN funciones (validadores a medida).
 *   5. Composición de funciones.
 *   6. Callbacks asíncronos: setTimeout y por qué el orden de la
 *      consola te sorprenderá.
 *
 * Todo esto se apoya en la idea del archivo 01: una función es un
 * valor, así que puede viajar como argumento y como resultado.
 * ============================================================
 */

// La IIFE ya viene escrita: aísla las variables de este archivo.
(function () {
  'use strict';

  // Andamiaje ya escrito: consola visual del <pre id="salida-04">.
  const { imprimir, titulo } = window.Utilidades.crearConsola('salida-04');

  // DATOS DE PARTIDA (ya escritos: no se teclean en clase).
  // El catálogo de una tienda, compartido por toda la sección.
  const productos = [
    { nombre: 'Teclado mecánico', precio: 89.9, stock: 12, categoria: 'periféricos' },
    { nombre: 'Monitor 27"', precio: 249.0, stock: 4, categoria: 'pantallas' },
    { nombre: 'Ratón inalámbrico', precio: 25.5, stock: 30, categoria: 'periféricos' },
    { nombre: 'Silla ergonómica', precio: 320.0, stock: 0, categoria: 'mobiliario' },
    { nombre: 'Auriculares', precio: 59.99, stock: 7, categoria: 'audio' },
    { nombre: 'Webcam HD', precio: 45.0, stock: 0, categoria: 'periféricos' }
  ];

  // ============================================================
  // 1. ¿QUÉ ES UNA FUNCIÓN DE ORDEN SUPERIOR?
  // ============================================================

  /*
   * Una FUNCIÓN DE ORDEN SUPERIOR (higher-order function) es una
   * función que cumple al menos una de estas dos condiciones:
   *
   *   a) recibe una o varias funciones como argumento, o
   *   b) devuelve una función.
   *
   * El nombre asusta, pero ya has usado muchas sin saberlo:
   * addEventListener, setTimeout, map, filter, sort...
   *
   * Analogía: un jefe de cocina que recibe una receta (la función)
   * y la aplica a los ingredientes que tú le des.
   */

  // TODO (en clase):
  //   1. titulo('1. Funciones de orden superior: la idea').
  //   2. Escribe function aplicarDosVeces(funcion, valor) que devuelva
  //      funcion(funcion(valor)).
  //   3. Declara dos flechas de prueba:
  //        const sumarCinco = (n) => n + 5;
  //        const exclamar = (texto) => texto + '!';
  //   4. Imprime aplicarDosVeces(sumarCinco, 10) y aplicarDosVeces(exclamar, 'Hola').
  //   5. Señala lo importante: la MISMA función de orden superior sirve
  //      para números y para textos.
  //   Resultado esperado en pantalla:
  //      aplicarDosVeces(sumarCinco, 10) -> 20
  //      aplicarDosVeces(exclamar, "Hola") -> Hola!!
  //   (aprox. 8 líneas)

  // ============================================================
  // 2. CALLBACKS
  // ============================================================

  /*
   * Un CALLBACK es simplemente una función que le pasamos a otra para
   * que la llame ella cuando le toque. La palabra viene de
   * "call back": te devuelvo la llamada.
   *
   * ⚠️ ERROR COMÚN (el más frecuente de todos): pasar el callback
   * CON paréntesis. Si escribes mostrar(), estás ejecutando la función
   * ahí mismo y pasando su RESULTADO, no la función.
   *
   *     hacerAlgo(mostrar);    ✅ pasas la función
   *     hacerAlgo(mostrar());  ❌ pasas lo que devuelve (normalmente undefined)
   */

  // TODO (en clase):
  //   1. titulo('2. Callbacks: pasar una función como argumento').
  //   2. Escribe function procesarPedido(producto, alTerminar):
  //        - const mensaje = 'Pedido de "' + producto + '" procesado correctamente';
  //        - ✅ BUENA PRÁCTICA: comprueba con
  //          if (typeof alTerminar === 'function') antes de llamarlo.
  //        - devuelve mensaje.
  //   3. Llámala TRES veces con tres callbacks anónimos distintos, para que
  //      se vea que el proceso es el mismo y el final cambia:
  //        'Teclado mecánico' -> imprime '   [callback 1 - aviso] ' + mensaje
  //        'Monitor 27"'      -> imprime '   [callback 2 - mayúsculas] ' + mensaje.toUpperCase()
  //        'Auriculares'      -> imprime '   [callback 3 - contador] El mensaje tiene '
  //                              + mensaje.length + ' caracteres'
  //   4. Escribe un callback CON NOMBRE, function registrarEnHistorial(mensaje),
  //      que imprima '   [historial] ' + mensaje, y pásalo SIN paréntesis:
  //      procesarPedido('Webcam HD', registrarEnHistorial);
  //   Resultado esperado en pantalla:
  //      [callback 1 - aviso] Pedido de "Teclado mecánico" procesado correctamente
  //      [callback 2 - mayúsculas] PEDIDO DE "MONITOR 27"" PROCESADO CORRECTAMENTE
  //      [callback 3 - contador] El mensaje tiene 52 caracteres
  //      [historial] Pedido de "Webcam HD" procesado correctamente
  //   (aprox. 20 líneas)

  // ============================================================
  // 3. CÓMO FUNCIONAN map, filter Y reduce POR DENTRO
  // ============================================================

  /*
   * Los métodos de array que tanto usamos son funciones de orden
   * superior. Para desmitificarlos, vamos a escribir nuestra propia
   * versión de cada uno y luego compararla con la del lenguaje.
   *
   * CONSEJO DE CLASE: escribe miMap y miFilter en la pizarra ANTES de
   * teclearlos aquí. Son cinco líneas y desmontan toda la magia.
   */

  // TODO (en clase):
  //   1. titulo('3. Escribimos nuestro propio map, filter y reduce').
  //   2. function miMap(array, transformar): crea const resultado = [],
  //      recórrelo con un for clásico y haz
  //      resultado.push(transformar(array[i], i)). Devuelve resultado.
  //   3. function miFilter(array, cumpleCondicion): igual, pero solo hace push
  //      si cumpleCondicion(array[i], i) es true.
  //   4. function miReduce(array, combinar, valorInicial): let acumulado =
  //      valorInicial y en cada vuelta acumulado = combinar(acumulado, array[i], i).
  //   5. Úsalos con `productos`:
  //        const nombres = miMap(productos, (producto) => producto.nombre);
  //        const disponibles = miFilter(productos, (producto) => producto.stock > 0);
  //        const valorTotal = miReduce(productos, (total, producto) =>
  //                             total + producto.precio * producto.stock, 0);
  //      e imprime nombres.join(', '), disponibles.length + ' de ' + productos.length
  //      y valorTotal.toFixed(2) + ' euros'.
  //   Resultado esperado en pantalla:
  //      miMap -> nombres: Teclado mecánico, Monitor 27", Ratón inalámbrico, Silla ergonómica, Auriculares, Webcam HD
  //      miFilter -> con stock: 4 de 6
  //      miReduce -> valor del inventario: 3072.73 euros
  //   (aprox. 26 líneas)

  // TODO (en clase):
  //   1. titulo('3b. Los métodos nativos hacen exactamente lo mismo').
  //   2. Repite los tres resultados anteriores con los métodos nativos
  //      .map(), .filter() y .reduce() y comprueba que salen idénticos.
  //   Resultado esperado en pantalla: las mismas tres líneas de arriba
  //   (nombres separados por comas, '4 con stock' y '3072.73 euros').
  //   (aprox. 3 líneas)

  // TODO (en clase):
  //   1. Encadena varios métodos: cada uno devuelve un array nuevo sobre el
  //      que se sigue trabajando. Guarda en `informe`:
  //        productos
  //          .filter((producto) => producto.stock > 0)      // 1. disponibles
  //          .filter((producto) => producto.precio < 100)   // 2. baratos
  //          .map((producto) => producto.nombre + ' (' + producto.precio + ')')
  //          .join(' + ');
  //   2. Imprímelo con la etiqueta 'Encadenado ->'.
  //   Resultado esperado en pantalla:
  //      Encadenado -> Teclado mecánico (89.9) + Ratón inalámbrico (25.5) + Auriculares (59.99)
  //   (aprox. 6 líneas)

  // ⚠️ ERROR COMÚN: esperar que forEach devuelva un array. Para eso es map.

  // TODO (en clase):
  //   1. const resultadoForEach = productos.forEach((p) => p.nombre);
  //   2. imprimir('¿Qué devuelve forEach? ->', resultadoForEach);
  //   Resultado esperado en pantalla: ¿Qué devuelve forEach? -> undefined
  //   (aprox. 2 líneas)

  // ⚠️ ERROR COMÚN: sort() SIN callback ordena como TEXTO ("10" < "9")
  // y además MODIFICA el array original. Copiamos antes con spread.

  // TODO (en clase):
  //   1. const porPrecio = [...productos].sort((a, b) => a.precio - b.precio);
  //   2. imprimir('Ordenados por precio ->', porPrecio.map((p) => p.precio).join(' < '));
  //   Resultado esperado en pantalla:
  //      Ordenados por precio -> 25.5 < 45 < 59.99 < 89.9 < 249 < 320
  //   (aprox. 2 líneas)

  // ============================================================
  // 4. FUNCIONES QUE DEVUELVEN FUNCIONES
  // ============================================================

  /*
   * La otra mitad del orden superior. Ya la vimos como "fábrica de
   * funciones" al estudiar closures; aquí la aplicamos a un caso real:
   * construir validadores y filtros a medida.
   */

  // TODO (en clase):
  //   1. titulo('4. Funciones que devuelven funciones').
  //   2. Escribe function crearFiltroPorCategoria(categoria) que devuelva
  //      function (producto) { return producto.categoria === categoria; }
  //   3. Fabrica const esPeriferico = crearFiltroPorCategoria('periféricos')
  //      y const esAudio = crearFiltroPorCategoria('audio').
  //   4. Úsalos dentro de productos.filter(...) y muestra los nombres con
  //      .map((p) => p.nombre).join(', ').
  //   Resultado esperado en pantalla:
  //      Periféricos -> Teclado mecánico, Ratón inalámbrico, Webcam HD
  //      Audio -> Auriculares
  //   (aprox. 10 líneas)

  // TODO (en clase):
  //   1. Escribe function crearValidadorDeLongitud(minimo, maximo) que devuelva
  //      una función (texto) que calcule String(texto).trim().length y devuelva
  //      un OBJETO { valido, mensaje }:
  //        - corto  -> { valido: false, mensaje: 'Demasiado corto (mínimo N)' }
  //        - largo  -> { valido: false, mensaje: 'Demasiado largo (máximo N)' }
  //        - si no  -> { valido: true, mensaje: 'Correcto' }
  //   2. Fabrica validarUsuario = crearValidadorDeLongitud(3, 12) y
  //      validarContrasena = crearValidadorDeLongitud(8, 30).
  //   3. Imprime el .mensaje de: validarUsuario('ana'), validarUsuario('an'),
  //      validarContrasena('1234') y validarContrasena('clave-larga-2026').
  //   Resultado esperado en pantalla:
  //      Usuario "ana" -> Correcto
  //      Usuario "an" -> Demasiado corto (mínimo 3)
  //      Clave "1234" -> Demasiado corto (mínimo 8)
  //      Clave "clave-larga-2026" -> Correcto
  //   (aprox. 14 líneas)

  // ============================================================
  // 5. COMPOSICIÓN DE FUNCIONES
  // ============================================================

  /*
   * Componer es encadenar funciones pequeñas para formar una grande,
   * como montar una tubería: la salida de una es la entrada de la
   * siguiente. Funciones pequeñas = fáciles de probar y reutilizar.
   */

  // TODO (en clase):
  //   1. titulo('5. Composición: funciones pequeñas encadenadas').
  //   2. Declara tres flechas mínimas, una por paso:
  //        const quitarEspacios = (texto) => texto.trim();
  //        const aMinusculas = (texto) => texto.toLowerCase();
  //        const guionesEnLugarDeEspacios = (texto) => texto.split(' ').join('-');
  //   3. Escribe function componer(...funciones) que devuelva una función
  //      (valorInicial) que aplique todas en orden con
  //      funciones.reduce(function (valor, funcion) { return funcion(valor); }, valorInicial)
  //   4. Fabrica const crearSlug = componer(quitarEspacios, aMinusculas,
  //      guionesEnLugarDeEspacios); y pruébalo con '  Curso de JavaScript  '
  //      y con 'Funciones A Fondo'.
  //   Resultado esperado en pantalla:
  //      crearSlug("  Curso de JavaScript  ") -> curso-de-javascript
  //      crearSlug("Funciones A Fondo") -> funciones-a-fondo
  //   (aprox. 14 líneas)

  // ============================================================
  // 6. CALLBACKS ASÍNCRONOS (setTimeout)
  // ============================================================

  /*
   * Hasta ahora los callbacks se ejecutaban al instante. Pero su uso
   * más famoso es el ASÍNCRONO: "cuando pase X, llama a esta función".
   *
   * setTimeout(callback, milisegundos) programa una llamada para más
   * tarde y sigue con el resto del código SIN esperar.
   *
   * ⚠️ ERROR COMÚN: creer que setTimeout "pausa" el programa. No lo
   * hace: apunta la tarea y continúa. Por eso los mensajes de abajo
   * aparecerán en la consola en un orden que sorprende.
   */

  // TODO (en clase):
  //   1. titulo('6. Callbacks asíncronos: el orden que sorprende').
  //   2. Escribe TRES instrucciones EN ESTE ORDEN EXACTO en el archivo:
  //        a) imprimir('(1) Esta línea se ejecuta primero');
  //        b) setTimeout(function () {
  //             imprimir('(3) Yo llego 1 segundo después, aunque estaba escrita en medio');
  //           }, 1000);
  //        c) imprimir('(2) Y esta se ejecuta antes que el mensaje del setTimeout');
  //           imprimir('    ...espera un segundo y mira el mensaje (3).');
  //   3. Antes de recargar, pregunta a la clase en qué orden van a salir.
  //   Resultado esperado en pantalla: primero (1), luego (2), y un segundo
  //   más tarde aparece (3) al final del bloque.
  //   (aprox. 6 líneas)

  // También los eventos del navegador funcionan con callbacks:
  // boton.addEventListener('click', miFuncion) significa
  // "cuando alguien haga clic, llama a miFuncion".
  // Lo usamos de verdad en js/07-demos-interactivas.js.

  // ============================================================
  // EJERCICIOS PROPUESTOS
  // ------------------------------------------------------------
  // 1) (Fácil) Escribe repetirAccion(veces, callback) que llame al
  //    callback tantas veces como se indique, pasándole el número de
  //    vuelta actual. Pruébala imprimiendo "Vuelta 1", "Vuelta 2"...
  //
  // 2) (Fácil) Usando el array `productos`, obtén con map un array de
  //    textos "NOMBRE: PRECIO euros" y muéstralo con join('\n').
  //
  // 3) (Media) Escribe miFind(array, condicion) que devuelva el PRIMER
  //    elemento que cumpla la condición, o null si no hay ninguno.
  //    Compárala después con el método nativo .find().
  //
  // 4) (Media) Crea crearFiltroDePrecio(maximo) que devuelva una
  //    función válida para .filter() y úsala para listar los productos
  //    por debajo de 60 euros.
  //
  // 5) (Difícil) Escribe agruparPor(array, obtenerClave) que devuelva
  //    un objeto donde cada clave sea el resultado del callback y su
  //    valor un array con los elementos de ese grupo. Agrupa
  //    `productos` por categoría.
  //    Pista: reduce() con un objeto vacío como valor inicial.
  // ============================================================
})();
