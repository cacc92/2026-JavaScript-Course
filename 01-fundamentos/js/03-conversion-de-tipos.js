/**
 * ============================================================
 * ARCHIVO: js/03-conversion-de-tipos.js
 * PROYECTO: 01 - Fundamentos de JavaScript
 * ------------------------------------------------------------
 * QUE ENSENA ESTE ARCHIVO:
 *   1. Conversion EXPLICITA: Number(), String(), Boolean(),
 *      parseInt() y parseFloat().
 *   2. Conversion IMPLICITA (coercion): lo que el motor hace solo
 *      cuando mezclamos tipos: '5' * 2, '5' + 2, [] + {}...
 *   3. NaN: que es, de donde sale y por que isNaN() puede enganar.
 *      Diferencia entre isNaN() y Number.isNaN().
 *   4. Template literals: interpolacion, expresiones y texto multilinea.
 *
 * QUE SE APRENDE AL TERMINAR:
 *   A no volver a sumar '2' + '3' esperando 5, y a construir textos
 *   legibles sin concatenar con + por todas partes.
 * ============================================================
 */

(function () {
  'use strict';

  // Recuperamos las funciones de salida definidas en el archivo 01.
  const imprimir = window.imprimir || function (...mensajes) { console.log(...mensajes); };
  const titulo = window.titulo || function (texto) { console.log('== ' + texto + ' =='); };

  // ============================================================
  // 1. CONVERSION EXPLICITA A NUMERO
  // ============================================================

  titulo('13. CONVERSION EXPLICITA DE TIPOS');

  /*
    Conversion explicita = la pedimos nosotros, con un nombre claro.
    Es la unica forma segura de trabajar: dejamos por escrito que
    queremos que pase, en lugar de confiar en la magia del motor.

    Number(valor) intenta convertir CUALQUIER cosa en un numero.
    Si no puede, devuelve NaN (Not a Number).
  */

  imprimir("Number('42')      ->", Number('42'));         // 42
  imprimir("Number('42.5')    ->", Number('42.5'));       // 42.5
  imprimir("Number('  7  ')   ->", Number('  7  '));      // 7   -> ignora espacios de los extremos
  imprimir("Number('')        ->", Number(''));           // 0   <- sorprendente: vacio vale 0
  imprimir("Number('  ')      ->", Number('  '));         // 0   <- solo espacios tambien vale 0
  imprimir("Number('42px')    ->", Number('42px'));       // NaN <- si sobra algo, falla entero
  imprimir("Number('hola')    ->", Number('hola'));       // NaN
  imprimir('Number(true)      ->', Number(true));         // 1
  imprimir('Number(false)     ->', Number(false));        // 0
  imprimir('Number(null)      ->', Number(null));         // 0   <- null se comporta como 0
  imprimir('Number(undefined) ->', Number(undefined));    // NaN <- undefined NO
  imprimir('Number([])        ->', Number([]));           // 0
  imprimir('Number([7])       ->', Number([7]));          // 7   <- un arreglo de un elemento
  imprimir('Number([1, 2])    ->', Number([1, 2]));       // NaN
  imprimir('Number({})        ->', Number({}));           // NaN

  // ⚠️ ERROR COMUN: dar por hecho que Number('') es NaN. Vale 0, y eso
  // hace que un campo de formulario vacio se cuele como un cero valido.

  /*
    parseInt() y parseFloat() son mas tolerantes: leen el texto de
    izquierda a derecha y se paran en el primer caracter que no encaja.

    Analogia: Number() es un examen de todo o nada;
    parseInt() aprueba con lo que haya entendido hasta el fallo.
  */

  imprimir("parseInt('42px')      ->", parseInt('42px', 10));       // 42
  imprimir("parseInt('3.99')      ->", parseInt('3.99', 10));       // 3  <- corta los decimales
  imprimir("parseInt('px42')      ->", parseInt('px42', 10));       // NaN <- empieza mal
  imprimir("parseInt('1010', 2)   ->", parseInt('1010', 2));        // 10 <- lo lee en binario
  imprimir("parseFloat('3.14 metros') ->", parseFloat('3.14 metros'));  // 3.14
  imprimir("parseFloat('.5')          ->", parseFloat('.5'));           // 0.5

  // ⚠️ ERROR COMUN: creer que parseInt() redondea. No redondea: TRUNCA.
  // parseInt('3.99') da 3, no 4. Para redondear se usa Math.round().
  imprimir("Math.round('3.99')    ->", Math.round('3.99'));         // 4

  // ✅ BUENA PRACTICA: pasa SIEMPRE la base 10 como segundo argumento de
  // parseInt. Evita sorpresas historicas con textos que empiezan por 0.

  // El operador + delante de un valor tambien convierte a numero
  // (unario). Es corto, pero menos explicito que Number().
  imprimir("+'25'   ->", +'25', '| typeof:', typeof +'25');   // 25 number

  // ============================================================
  // 2. CONVERSION EXPLICITA A TEXTO
  // ============================================================

  imprimir('');
  imprimir('--- Convertir a TEXTO ---');

  imprimir('String(123)      ->', String(123), '| typeof:', typeof String(123));  // "123" string
  imprimir('String(true)     ->', String(true));         // "true"
  imprimir('String(null)     ->', String(null));         // "null"
  imprimir('String(undefined)->', String(undefined));    // "undefined"
  imprimir('String([1,2,3])  ->', String([1, 2, 3]));    // "1,2,3" <- une con comas
  imprimir('String({})       ->', String({}));           // "[object Object]" <- casi nunca util

  // (123).toString() hace lo mismo, pero falla con null y undefined.
  imprimir('(255).toString(16) ->', (255).toString(16)); // "ff" -> en hexadecimal
  // ⚠️ ERROR COMUN: null.toString() lanza TypeError. String(null) no.

  // ============================================================
  // 3. CONVERSION EXPLICITA A BOOLEANO
  // ============================================================

  imprimir('');
  imprimir('--- Convertir a BOOLEANO ---');

  imprimir("Boolean('texto') ->", Boolean('texto'));   // true
  imprimir("Boolean('')      ->", Boolean(''));        // false
  imprimir('Boolean(0)       ->', Boolean(0));         // false
  imprimir('Boolean(NaN)     ->', Boolean(NaN));       // false
  imprimir('Boolean([])      ->', Boolean([]));        // true  <- recuerda: objeto vacio pero truthy
  imprimir("!!'texto'        ->", !!'texto');          // true  <- atajo con doble negacion

  // ============================================================
  // 4. CONVERSION IMPLICITA (COERCION)
  // ============================================================

  titulo('14. COERCION: LA CONVERSION QUE HACE EL MOTOR SOLO');

  /*
    Cuando mezclamos tipos, JavaScript no se queja: convierte por su
    cuenta siguiendo unas reglas. A esto se le llama COERCION.

    LA REGLA DE ORO DEL OPERADOR + :
      si UNO de los dos lados es texto, el + CONCATENA (une textos).
      En cualquier otro caso, suma.
    Todos los demas operadores aritmeticos (- * / % **) convierten
    siempre a numero.
  */

  imprimir("'5' * 2   ->", '5' * 2, '| typeof:', typeof ('5' * 2));   // 10   number
  imprimir("'5' + 2   ->", '5' + 2, '| typeof:', typeof ('5' + 2));   // "52" string
  imprimir("'5' - 2   ->", '5' - 2);        // 3
  imprimir("'10' / '2' ->", '10' / '2');    // 5   -> convierte los DOS
  imprimir("2 + '2'   ->", 2 + '2');        // "22"

  /*
    El orden importa, porque el + se resuelve de izquierda a derecha:
  */
  imprimir("2 + 2 + '2' ->", 2 + 2 + '2');  // "42"  -> primero suma 4, luego concatena
  imprimir("'2' + 2 + 2 ->", '2' + 2 + 2);  // "222" -> desde el primer texto ya todo concatena

  imprimir('true + 1      ->', true + 1);        // 2   -> true vale 1
  imprimir('false + 1     ->', false + 1);       // 1
  imprimir('true + true   ->', true + true);     // 2
  imprimir('null + 1      ->', null + 1);        // 1   -> null vale 0
  imprimir('undefined + 1 ->', undefined + 1);   // NaN -> undefined no es convertible

  /*
    LOS CLASICOS DE INTERNET
    Estos ejemplos salen en todos los memes sobre JavaScript. Conviene
    entenderlos una vez y despues no escribir NUNCA codigo asi.
  */
  imprimir('');
  imprimir('--- Los clasicos ---');
  imprimir('[] + []   ->', '"' + ([] + []) + '"');   // "" (dos textos vacios unidos)
  imprimir('[] + {}   ->', [] + {});                 // "[object Object]"
  imprimir('[1,2] + [3] ->', [1, 2] + [3]);          // "1,23"
  imprimir("'5' * '2' ->", '5' * '2');               // 10

  /*
    Por que [] + {} da "[object Object]":
      1. El + no sabe sumar objetos, asi que convierte ambos lados a texto.
      2. []  ->  ''                  (arreglo vacio unido con comas)
      3. {}  ->  '[object Object]'   (representacion por defecto de un objeto)
      4. ''  +  '[object Object]'    ->  "[object Object]"

    CURIOSIDAD PARA CLASE: si en la CONSOLA de DevTools escribes {} + []
    obtienes 0. Alli las llaves del principio se interpretan como un
    BLOQUE de codigo vacio, no como un objeto, y solo queda +[] , que
    vale 0. Dentro de un archivo .js, como aqui, no pasa eso.
  */

  // ✅ BUENA PRACTICA: convierte siempre de forma explicita antes de operar.
  const cantidadEscrita = '3';                 // como llega desde un formulario
  const cantidadReal = Number(cantidadEscrita);
  imprimir('Suma sin convertir ->', cantidadEscrita + 1);   // "31"  <- error clasico
  imprimir('Suma convirtiendo  ->', cantidadReal + 1);      // 4     <- correcto

  // ============================================================
  // 5. NaN: NOT A NUMBER
  // ============================================================

  titulo('15. NaN, isNaN Y Number.isNaN');

  /*
    NaN significa "Not a Number" y aparece cuando una operacion
    matematica no tiene un resultado numerico posible. Lo curioso es
    que su tipo... es number. Es un numero que representa
    "aqui deberia haber un numero, pero el calculo fallo".
  */

  imprimir('typeof NaN        ->', typeof NaN);            // "number"
  imprimir("Number('hola')    ->", Number('hola'));        // NaN
  imprimir('0 / 0             ->', 0 / 0);                 // NaN
  imprimir('Math.sqrt(-1)     ->', Math.sqrt(-1));         // NaN
  imprimir("'texto' * 3       ->", 'texto' * 3);           // NaN
  imprimir('Infinity - Infinity ->', Infinity - Infinity); // NaN

  // Ojo: dividir un numero distinto de 0 entre 0 NO da NaN, da Infinity.
  imprimir('10 / 0 ->', 10 / 0);        // Infinity
  imprimir('-10 / 0 ->', -10 / 0);      // -Infinity

  /*
    NaN NO ES IGUAL A NADA, NI SIQUIERA A SI MISMO.
    Es el unico valor del lenguaje con esa propiedad, y es la razon
    de que exista una funcion especial para detectarlo.
  */
  imprimir('NaN === NaN ->', NaN === NaN);   // false
  imprimir('NaN == NaN  ->', NaN == NaN);    // false

  /*
    isNaN() (la antigua) convierte primero el valor a numero y despues
    pregunta. Por eso miente con textos que no son numeros.

    Number.isNaN() (la moderna) NO convierte nada: responde true solo si
    el valor es exactamente NaN. Es la que debemos usar.
  */
  imprimir('');
  imprimir("isNaN('hola')          ->", isNaN('hola'));              // true  <- enganoso
  imprimir("Number.isNaN('hola')   ->", Number.isNaN('hola'));       // false <- correcto: es un string
  imprimir("isNaN('42')            ->", isNaN('42'));                // false
  imprimir('isNaN(undefined)       ->', isNaN(undefined));           // true  <- enganoso
  imprimir('Number.isNaN(undefined)->', Number.isNaN(undefined));    // false
  imprimir('Number.isNaN(NaN)      ->', Number.isNaN(NaN));          // true

  // ✅ BUENA PRACTICA: para validar entradas usa Number.isNaN(Number(valor))
  // o, mejor todavia, Number.isFinite(), que rechaza tambien Infinity.
  function esNumeroValido(valorRecibido) {
    const convertido = Number(valorRecibido);
    return Number.isFinite(convertido);          // true solo si es un numero real y acotado
  }

  imprimir("esNumeroValido('42')    ->", esNumeroValido('42'));      // true
  imprimir("esNumeroValido('42px')  ->", esNumeroValido('42px'));    // false
  imprimir("esNumeroValido('')      ->", esNumeroValido(''));        // true  <- ojo, '' se convierte en 0
  imprimir('esNumeroValido(Infinity)->', esNumeroValido(Infinity));  // false

  // ============================================================
  // 6. TEMPLATE LITERALS (PLANTILLAS DE TEXTO)
  // ============================================================

  titulo('16. TEMPLATE LITERALS');

  /*
    Un template literal se escribe con acentos graves (tecla a la
    izquierda del 1 en el teclado espanol) en lugar de comillas.
    Aporta tres superpoderes:
      1. Interpolar valores con ${ }
      2. Escribir varias lineas sin usar \n
      3. Meter dentro comillas simples y dobles sin escaparlas
  */

  const nombreEstudiante = 'Ana Rojas';
  const notaMedia = 8.4;
  const asignaturas = 5;

  // Antes (concatenacion con +): incomodo y facil de romper.
  const frasePorConcatenacion = 'La estudiante ' + nombreEstudiante +
    ' tiene una media de ' + notaMedia + ' en ' + asignaturas + ' asignaturas.';
  imprimir('Con + ->', frasePorConcatenacion);

  // Ahora (template literal): se lee casi como una frase normal.
  const fraseConPlantilla = `La estudiante ${nombreEstudiante} tiene una media de ${notaMedia} en ${asignaturas} asignaturas.`;
  imprimir('Con `` ->', fraseConPlantilla);

  /*
    Dentro de ${ } cabe cualquier EXPRESION, no solo una variable:
    operaciones, llamadas a funciones, ternarios...
  */
  imprimir(`Suma dentro de la plantilla: ${notaMedia} + 1 = ${notaMedia + 1}`);
  imprimir(`Redondeada: ${notaMedia.toFixed(1)}`);
  imprimir(`Estado: ${notaMedia >= 5 ? 'Aprobada' : 'Suspensa'}`);
  imprimir(`En mayusculas: ${nombreEstudiante.toUpperCase()}`);

  // TEXTO MULTILINEA: los saltos de linea se respetan tal cual.
  const fichaDelEstudiante = `
  FICHA DEL ESTUDIANTE
  --------------------
  Nombre      : ${nombreEstudiante}
  Nota media  : ${notaMedia}
  Asignaturas : ${asignaturas}
  Situacion   : ${notaMedia >= 5 ? 'Curso superado' : 'Debe recuperar'}`;

  imprimir(fichaDelEstudiante);

  // Comillas dentro del texto, sin escapar nada:
  imprimir(`El docente dijo: "usad siempre ===", y anadio: 'sin excepciones'.`);

  /*
    ⚠️ ERROR COMUN 1: usar comillas normales y esperar interpolacion.
       'Hola ${nombre}'  ->  se imprime literalmente Hola ${nombre}
    ⚠️ ERROR COMUN 2: olvidar el simbolo $ y escribir solo {nombre}.
  */
  imprimir('Con comillas normales NO interpola -> Hola ${nombreEstudiante}');

  // ✅ BUENA PRACTICA: usa template literals siempre que mezcles texto y
  // variables. Seran imprescindibles al generar HTML desde JavaScript.
  const producto = { nombre: 'Teclado mecanico', precio: 79.9, stock: 4 };
  const tarjetaHtml = `<article class="producto">
  <h3>${producto.nombre}</h3>
  <p>Precio: ${producto.precio.toFixed(2)} euros</p>
  <p>${producto.stock > 0 ? 'Disponible' : 'Agotado'}</p>
</article>`;

  imprimir('');
  imprimir('HTML generado con una plantilla:');
  imprimir(tarjetaHtml);

  /*
    ============================================================
    EJERCICIOS PROPUESTOS
    ============================================================
    1) Convierte estos cuatro textos a numero y muestra el resultado y su
       typeof: '15', '15.5', '15 euros' y ''. Explica en un comentario
       por que el ultimo da 0.

    2) Escribe una funcion sumarSeguro(a, b) que convierta ambos
       argumentos a numero antes de sumar y que devuelva el texto
       'Datos no validos' si alguno no es un numero real.

    3) Predice el resultado de cada linea antes de ejecutarla:
          '10' - 5      |   '10' + 5
          10 + true     |   '10' * null
       Comprueba despues cuantas acertaste.

    4) Usando un template literal multilinea, imprime una factura con
       tres productos, sus precios y el total calculado dentro de la
       propia plantilla.

    5) RETO: escribe una funcion aNumeroONulo(valor) que devuelva el
       numero si la conversion es valida y null si no lo es. Debe tratar
       la cadena vacia y la cadena de espacios como NO validas, aunque
       Number() las convierta en 0.
    ============================================================
  */
})();
