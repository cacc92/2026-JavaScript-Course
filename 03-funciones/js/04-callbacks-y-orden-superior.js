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

(function () {
  'use strict';

  const { imprimir, titulo } = window.Utilidades.crearConsola('salida-04');

  // Datos compartidos por toda la sección: el catálogo de una tienda.
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

  titulo('1. Funciones de orden superior: la idea');

  /**
   * aplicarDosVeces(): recibe una FUNCIÓN y un valor, y aplica la
   * función dos veces seguidas sobre ese valor.
   * @param {Function} funcion
   * @param {*} valor
   */
  function aplicarDosVeces(funcion, valor) {
    return funcion(funcion(valor));
  }

  const sumarCinco = (n) => n + 5;
  const exclamar = (texto) => texto + '!';

  imprimir('aplicarDosVeces(sumarCinco, 10) ->', aplicarDosVeces(sumarCinco, 10)); // 20
  imprimir('aplicarDosVeces(exclamar, "Hola") ->', aplicarDosVeces(exclamar, 'Hola')); // Hola!!

  // La MISMA función de orden superior sirve para números y para textos.
  // Ese es su valor: la lógica repetitiva (aplicar dos veces) se escribe
  // una sola vez y lo que cambia se recibe desde fuera.

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

  titulo('2. Callbacks: pasar una función como argumento');

  /**
   * procesarPedido(): simula el flujo de un pedido y avisa al final
   * llamando al callback que le hayan dado.
   * @param {string} producto
   * @param {Function} alTerminar - callback que recibe un mensaje
   */
  function procesarPedido(producto, alTerminar) {
    const mensaje = 'Pedido de "' + producto + '" procesado correctamente';

    // Comprobamos que de verdad nos han pasado una función.
    // ✅ BUENA PRÁCTICA: no confiar a ciegas en lo que llega.
    if (typeof alTerminar === 'function') {
      alTerminar(mensaje);
    }
    return mensaje;
  }

  // Un mismo proceso, tres finales distintos según el callback.
  procesarPedido('Teclado mecánico', function (mensaje) {
    imprimir('   [callback 1 - aviso] ' + mensaje);
  });

  procesarPedido('Monitor 27"', (mensaje) => {
    imprimir('   [callback 2 - mayúsculas] ' + mensaje.toUpperCase());
  });

  procesarPedido('Auriculares', (mensaje) => {
    imprimir('   [callback 3 - contador] El mensaje tiene ' + mensaje.length + ' caracteres');
  });

  // Callback con nombre: se puede reutilizar y el código se lee mejor.
  function registrarEnHistorial(mensaje) {
    imprimir('   [historial] ' + mensaje);
  }

  procesarPedido('Webcam HD', registrarEnHistorial);   // ✅ sin paréntesis

  // ============================================================
  // 3. CÓMO FUNCIONAN map, filter Y reduce POR DENTRO
  // ============================================================

  /*
   * Los métodos de array que tanto usamos son funciones de orden
   * superior. Para desmitificarlos, vamos a escribir nuestra propia
   * versión de cada uno y luego compararla con la del lenguaje.
   */

  titulo('3. Escribimos nuestro propio map, filter y reduce');

  /**
   * miMap(): crea un array NUEVO aplicando `transformar` a cada elemento.
   */
  function miMap(array, transformar) {
    const resultado = [];
    for (let i = 0; i < array.length; i++) {
      // A cada vuelta llamamos al callback con (elemento, índice).
      resultado.push(transformar(array[i], i));
    }
    return resultado;
  }

  /**
   * miFilter(): crea un array NUEVO solo con los que pasen la prueba.
   * El callback debe devolver true o false.
   */
  function miFilter(array, cumpleCondicion) {
    const resultado = [];
    for (let i = 0; i < array.length; i++) {
      if (cumpleCondicion(array[i], i)) {
        resultado.push(array[i]);
      }
    }
    return resultado;
  }

  /**
   * miReduce(): reduce todo el array a UN solo valor, arrastrando un
   * acumulador de una vuelta a la siguiente.
   */
  function miReduce(array, combinar, valorInicial) {
    let acumulado = valorInicial;
    for (let i = 0; i < array.length; i++) {
      acumulado = combinar(acumulado, array[i], i);
    }
    return acumulado;
  }

  const nombres = miMap(productos, (producto) => producto.nombre);
  imprimir('miMap -> nombres:', nombres.join(', '));

  const disponibles = miFilter(productos, (producto) => producto.stock > 0);
  imprimir('miFilter -> con stock:', disponibles.length + ' de ' + productos.length);

  const valorTotal = miReduce(productos, (total, producto) => total + producto.precio * producto.stock, 0);
  imprimir('miReduce -> valor del inventario:', valorTotal.toFixed(2) + ' euros');

  // Ahora lo mismo con los métodos nativos: idéntico resultado.
  titulo('3b. Los métodos nativos hacen exactamente lo mismo');

  imprimir('map ->', productos.map((p) => p.nombre).join(', '));
  imprimir('filter ->', productos.filter((p) => p.stock > 0).length + ' con stock');
  imprimir('reduce ->', productos.reduce((t, p) => t + p.precio * p.stock, 0).toFixed(2) + ' euros');

  // Encadenar varios: cada método devuelve un array nuevo sobre el que
  // se puede seguir trabajando. Se lee como una frase.
  const informe = productos
    .filter((producto) => producto.stock > 0)                  // 1. solo los disponibles
    .filter((producto) => producto.precio < 100)               // 2. solo los baratos
    .map((producto) => producto.nombre + ' (' + producto.precio + ')') // 3. a texto
    .join(' + ');                                              // 4. a una sola cadena

  imprimir('Encadenado ->', informe);

  // forEach: recorre sin devolver nada (devuelve undefined).
  // ⚠️ ERROR COMÚN: esperar que forEach devuelva un array. Para eso es map.
  const resultadoForEach = productos.forEach((p) => p.nombre);
  imprimir('¿Qué devuelve forEach? ->', resultadoForEach);   // undefined

  // sort también recibe un callback de comparación:
  // devuelve un número negativo, 0 o positivo.
  // ⚠️ ERROR COMÚN: sort() SIN callback ordena como TEXTO ("10" < "9")
  // y además MODIFICA el array original. Copiamos antes con spread.
  const porPrecio = [...productos].sort((a, b) => a.precio - b.precio);
  imprimir('Ordenados por precio ->', porPrecio.map((p) => p.precio).join(' < '));

  // ============================================================
  // 4. FUNCIONES QUE DEVUELVEN FUNCIONES
  // ============================================================

  /*
   * La otra mitad del orden superior. Ya la vimos como "fábrica de
   * funciones" al estudiar closures; aquí la aplicamos a un caso real:
   * construir validadores y filtros a medida.
   */

  titulo('4. Funciones que devuelven funciones');

  /**
   * crearFiltroPorCategoria(): fabrica un filtro específico.
   * @param {string} categoria
   * @returns {Function} función lista para pasar a .filter()
   */
  function crearFiltroPorCategoria(categoria) {
    return function (producto) {
      return producto.categoria === categoria;
    };
  }

  const esPeriferico = crearFiltroPorCategoria('periféricos');
  const esAudio = crearFiltroPorCategoria('audio');

  imprimir('Periféricos ->', productos.filter(esPeriferico).map((p) => p.nombre).join(', '));
  imprimir('Audio ->', productos.filter(esAudio).map((p) => p.nombre).join(', '));

  /**
   * crearValidadorDeLongitud(): fabrica validadores de texto.
   * Devuelve un objeto con el resultado y un mensaje explicativo.
   */
  function crearValidadorDeLongitud(minimo, maximo) {
    return function (texto) {
      const longitud = String(texto).trim().length;
      if (longitud < minimo) return { valido: false, mensaje: 'Demasiado corto (mínimo ' + minimo + ')' };
      if (longitud > maximo) return { valido: false, mensaje: 'Demasiado largo (máximo ' + maximo + ')' };
      return { valido: true, mensaje: 'Correcto' };
    };
  }

  const validarUsuario = crearValidadorDeLongitud(3, 12);
  const validarContrasena = crearValidadorDeLongitud(8, 30);

  imprimir('Usuario "ana" ->', validarUsuario('ana').mensaje);
  imprimir('Usuario "an" ->', validarUsuario('an').mensaje);
  imprimir('Clave "1234" ->', validarContrasena('1234').mensaje);
  imprimir('Clave "clave-larga-2026" ->', validarContrasena('clave-larga-2026').mensaje);

  // ============================================================
  // 5. COMPOSICIÓN DE FUNCIONES
  // ============================================================

  /*
   * Componer es encadenar funciones pequeñas para formar una grande,
   * como montar una tubería: la salida de una es la entrada de la
   * siguiente. Funciones pequeñas = fáciles de probar y reutilizar.
   */

  titulo('5. Composición: funciones pequeñas encadenadas');

  const quitarEspacios = (texto) => texto.trim();
  const aMinusculas = (texto) => texto.toLowerCase();
  const guionesEnLugarDeEspacios = (texto) => texto.split(' ').join('-');

  /**
   * componer(): recibe cualquier número de funciones y devuelve una
   * función nueva que las aplica en orden, de izquierda a derecha.
   */
  function componer(...funciones) {
    return function (valorInicial) {
      return funciones.reduce(function (valor, funcion) {
        return funcion(valor);
      }, valorInicial);
    };
  }

  const crearSlug = componer(quitarEspacios, aMinusculas, guionesEnLugarDeEspacios);

  imprimir('crearSlug("  Curso de JavaScript  ") ->', crearSlug('  Curso de JavaScript  '));
  imprimir('crearSlug("Funciones A Fondo") ->', crearSlug('Funciones A Fondo'));

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

  titulo('6. Callbacks asíncronos: el orden que sorprende');

  imprimir('(1) Esta línea se ejecuta primero');

  setTimeout(function () {
    imprimir('(3) Yo llego 1 segundo después, aunque estaba escrita en medio');
  }, 1000);

  imprimir('(2) Y esta se ejecuta antes que el mensaje del setTimeout');
  imprimir('    ...espera un segundo y mira el mensaje (3).');

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
