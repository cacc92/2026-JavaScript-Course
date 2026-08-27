/**
 * ============================================================
 * ARCHIVO: js/02-operadores.js
 * PROYECTO: 01 - Fundamentos de JavaScript
 * ------------------------------------------------------------
 * QUE ENSENA ESTE ARCHIVO:
 *   1. Operadores aritmeticos, incluidos % (resto) y ** (potencia).
 *   2. Operadores de asignacion compuesta (+=, -=, *=, /=, %=).
 *   3. Incremento y decremento: diferencia entre i++ e ++i.
 *   4. Operadores de comparacion: == frente a === (tabla comentada).
 *   5. Operadores logicos && || ! y el cortocircuito.
 *   6. El operador ternario como if de una sola linea.
 *   7. La precedencia de operadores y por que los parentesis salvan vidas.
 *   8. Valores truthy y falsy.
 *
 * QUE SE APRENDE AL TERMINAR:
 *   A leer cualquier expresion de JavaScript sabiendo en que orden se
 *   resuelve y que valor devuelve exactamente.
 * ============================================================
 */

/*
  Igual que en el archivo 01, todo va dentro de una IIFE para que las
  constantes de este archivo no choquen con las de los otros tres.
*/
(function () {
  'use strict';

  // ============================================================
  // 1. REUTILIZAMOS LAS FUNCIONES DE SALIDA DEL ARCHIVO 01
  // ============================================================

  /*
    El archivo 01 dejo imprimir() y titulo() colgadas del objeto window.
    Aqui las recogemos en constantes locales.

    El || de la derecha es un plan B: si por lo que sea el archivo 01 no
    se cargo, usamos una version minima que al menos escribe en DevTools.
    Es el primer ejemplo de "valor por defecto con ||" del curso.
  */
  const imprimir = window.imprimir || function (...mensajes) { console.log(...mensajes); };
  const titulo = window.titulo || function (texto) { console.log('== ' + texto + ' =='); };

  // ============================================================
  // 2. OPERADORES ARITMETICOS
  // ============================================================

  titulo('6. OPERADORES ARITMETICOS');

  /*
    Son los de toda la vida, mas dos que suelen ser nuevos:
      %  -> resto de la division entera (modulo)
      ** -> potencia (elevado a)
  */

  const precioBase = 20;
  const unidades = 3;

  imprimir('Suma           20 + 3  ->', precioBase + unidades);    // 23
  imprimir('Resta          20 - 3  ->', precioBase - unidades);    // 17
  imprimir('Multiplicacion 20 * 3  ->', precioBase * unidades);    // 60
  imprimir('Division       20 / 3  ->', precioBase / unidades);    // 6.666666666666667
  imprimir('Resto          20 % 3  ->', precioBase % unidades);    // 2
  imprimir('Potencia       20 ** 3 ->', precioBase ** unidades);   // 8000

  /*
    EL OPERADOR % (RESTO) EN LA VIDA REAL
    No es "porcentaje": es lo que sobra al repartir. Sirve muchisimo para:
      - saber si un numero es par o impar
      - alternar colores de fila en una tabla
      - dar la vuelta a un contador circular (relojes, carruseles)
  */
  imprimir('10 % 2 ->', 10 % 2, '(resto 0 = numero PAR)');
  imprimir('7 % 2  ->', 7 % 2, '(resto 1 = numero IMPAR)');
  imprimir('17 % 5 ->', 17 % 5, '(reparto 17 caramelos entre 5 y sobran 2)');

  // ⚠️ ERROR COMUN: esperar que el resto de un negativo sea positivo.
  imprimir('-7 % 3 ->', -7 % 3, '(el signo lo pone el DIVIDENDO, no el divisor)');  // -1

  /*
    LA POTENCIA ** tambien sirve para raices:
    elevar a 0.5 es exactamente lo mismo que hacer raiz cuadrada.
  */
  imprimir('2 ** 10  ->', 2 ** 10);          // 1024
  imprimir('81 ** 0.5 ->', 81 ** 0.5);       // 9 (raiz cuadrada)
  imprimir('Math.sqrt(81) ->', Math.sqrt(81));

  // ⚠️ ERROR COMUN: escribir -3 ** 2. Es un SyntaxError a proposito,
  // porque no se sabe si es -(3**2) o (-3)**2. Hay que poner parentesis:
  imprimir('(-3) ** 2 ->', (-3) ** 2);       // 9

  // ============================================================
  // 3. EL PROBLEMA DE LOS DECIMALES
  // ============================================================

  /*
    Los number de JavaScript se guardan en binario (formato IEEE 754).
    Igual que en decimal no podemos escribir 1/3 exacto (0.3333...),
    en binario no se puede escribir 0.1 exacto. De ahi el resultado raro.
  */
  imprimir('0.1 + 0.2 ->', 0.1 + 0.2);                       // 0.30000000000000004
  imprimir('0.1 + 0.2 === 0.3 ->', 0.1 + 0.2 === 0.3);       // false

  // ✅ BUENA PRACTICA: para dinero, trabaja en centimos (enteros)
  // o redondea al comparar.
  imprimir('Redondeado con toFixed(2) ->', (0.1 + 0.2).toFixed(2));           // "0.30" (es TEXTO)
  imprimir('typeof (0.1+0.2).toFixed(2) ->', typeof (0.1 + 0.2).toFixed(2));  // "string"
  imprimir('Comparando con tolerancia ->', Math.abs(0.1 + 0.2 - 0.3) < 0.00001); // true

  // ============================================================
  // 4. OPERADORES DE ASIGNACION
  // ============================================================

  titulo('7. ASIGNACION, INCREMENTO Y DECREMENTO');

  /*
    El operador = asigna (no significa "igual a", eso es ===).
    Los operadores compuestos son atajos: x += 5 es lo mismo que x = x + 5.
  */

  let saldoDeLaCuenta = 100;
  imprimir('saldo inicial       ->', saldoDeLaCuenta);   // 100

  saldoDeLaCuenta += 50;   // igual que: saldoDeLaCuenta = saldoDeLaCuenta + 50
  imprimir('saldo += 50         ->', saldoDeLaCuenta);   // 150

  saldoDeLaCuenta -= 30;   // resta y guarda
  imprimir('saldo -= 30         ->', saldoDeLaCuenta);   // 120

  saldoDeLaCuenta *= 2;    // multiplica y guarda
  imprimir('saldo *= 2          ->', saldoDeLaCuenta);   // 240

  saldoDeLaCuenta /= 4;    // divide y guarda
  imprimir('saldo /= 4          ->', saldoDeLaCuenta);   // 60

  saldoDeLaCuenta %= 7;    // resto y guarda
  imprimir('saldo %= 7          ->', saldoDeLaCuenta);   // 4

  saldoDeLaCuenta **= 3;   // potencia y guarda
  imprimir('saldo **= 3         ->', saldoDeLaCuenta);   // 64

  // El += tambien funciona con texto, porque el + concatena:
  let mensajeBienvenida = 'Hola';
  mensajeBienvenida += ', Ana';
  imprimir('Concatenar con += ->', mensajeBienvenida);   // "Hola, Ana"

  // ============================================================
  // 5. INCREMENTO Y DECREMENTO: i++ FRENTE A ++i
  // ============================================================

  /*
    ++ suma 1 y -- resta 1. La diferencia entre ponerlo delante o detras
    solo importa cuando USAMOS el resultado en la misma linea:

      i++  (POSTincremento) -> primero DEVUELVE el valor viejo, luego suma
      ++i  (PREincremento)  -> primero SUMA, luego devuelve el valor nuevo

    Analogia: i++ es "toma el ticket y despues avanza el contador";
    ++i es "avanza el contador y despues toma el ticket".
  */

  let contadorPost = 5;
  const resultadoPost = contadorPost++;   // devuelve 5 y deja contadorPost en 6
  imprimir('POST: resultado =', resultadoPost, '| contador =', contadorPost);  // 5 | 6

  let contadorPre = 5;
  const resultadoPre = ++contadorPre;     // deja contadorPre en 6 y devuelve 6
  imprimir('PRE : resultado =', resultadoPre, '| contador =', contadorPre);    // 6 | 6

  let inventario = 3;
  inventario--;                            // como no usamos el resultado, da igual la posicion
  imprimir('inventario-- ->', inventario);  // 2

  // ⚠️ ERROR COMUN: escribir cosas como  let x = i++ + ++i;
  // Es legal, pero nadie sabe leerlo. Separalo en varias lineas.
  // ✅ BUENA PRACTICA: usa ++ solo en solitario o en la cabecera de un for.

  // ============================================================
  // 6. OPERADORES DE COMPARACION: == FRENTE A ===
  // ============================================================

  titulo('8. COMPARACION: == FRENTE A ===');

  /*
    Toda comparacion devuelve un booleano (true o false).

      ==   igualdad DEBIL: convierte los tipos y luego compara el valor
      ===  igualdad ESTRICTA: compara valor Y tipo, sin convertir nada
      !=   distinto debil
      !==  distinto estricto

    Analogia: == es un portero que deja pasar si "se parece bastante";
    === es un portero que exige el DNI exacto.
  */

  imprimir("5 == '5'   ->", 5 == '5');    // true  -> convierte '5' a numero
  imprimir("5 === '5'  ->", 5 === '5');   // false -> number no es string
  imprimir("5 != '5'   ->", 5 != '5');    // false
  imprimir("5 !== '5'  ->", 5 !== '5');   // true  <- la forma correcta de preguntar

  /*
    Construimos la MISMA tabla que aparece en el HTML, pero calculada de
    verdad por el navegador. Asi el docente puede demostrar que no hay
    trampa: los valores salen del propio motor de JavaScript.
  */
  const tablaIgualdad = [
    { expresion: "5  y  '5'",         conDobleIgual: 5 == '5',              conTripleIgual: 5 === '5' },
    { expresion: '0  y  false',       conDobleIgual: 0 == false,            conTripleIgual: 0 === false },
    { expresion: "''  y  false",      conDobleIgual: '' == false,           conTripleIgual: '' === false },
    { expresion: 'null y undefined',  conDobleIgual: null == undefined,     conTripleIgual: null === undefined },
    { expresion: 'null y 0',          conDobleIgual: null == 0,             conTripleIgual: null === 0 },
    { expresion: '[]  y  false',      conDobleIgual: [] == false,           conTripleIgual: [] === false },
    { expresion: 'NaN y NaN',         conDobleIgual: NaN == NaN,            conTripleIgual: NaN === NaN }
  ];

  console.table(tablaIgualdad);                  // tabla real en DevTools (F12)
  imprimir('Tabla == frente a === (mira tambien DevTools con F12):');
  tablaIgualdad.forEach(function (fila) {
    imprimir('  ' + fila.expresion.padEnd(18, ' ') +
             '  ==  ' + String(fila.conDobleIgual).padEnd(6, ' ') +
             '  ===  ' + fila.conTripleIgual);
  });

  /*
    NaN es el unico valor de JavaScript que no es igual ni a si mismo.
    Se ve mejor en el archivo 03, donde estudiamos NaN a fondo.
  */

  // ✅ BUENA PRACTICA: usa siempre === y !==.
  // Unica excepcion tolerada: valor == null, que detecta a la vez
  // null y undefined en una sola comparacion.
  const telefono = undefined;
  imprimir('telefono == null ->', telefono == null, '(detecta null Y undefined)');

  // ============================================================
  // 7. COMPARADORES RELACIONALES: >  <  >=  <=
  // ============================================================

  /*
    Con numeros son evidentes. La sorpresa aparece con texto: dos strings
    se comparan letra por letra segun su codigo Unicode, como en un
    diccionario, NO por su valor numerico.
  */
  imprimir('10 > 9      ->', 10 > 9);        // true
  imprimir("'3' > '12'  ->", '3' > '12');    // true  <- compara '3' contra '1'
  imprimir('3 > 12      ->', 3 > 12);        // false <- aqui si son numeros
  imprimir("'a' < 'b'   ->", 'a' < 'b');     // true
  imprimir("'B' < 'a'   ->", 'B' < 'a');     // true  <- las mayusculas van antes en Unicode

  // ⚠️ ERROR COMUN: ordenar o comparar numeros que llegan como texto
  // desde un input o un prompt. Conviertelos ANTES con Number().

  // ============================================================
  // 8. OPERADORES LOGICOS Y CORTOCIRCUITO
  // ============================================================

  titulo('9. OPERADORES LOGICOS Y CORTOCIRCUITO');

  /*
      &&  Y logico  -> true solo si AMBOS lados son verdaderos
      ||  O logico  -> true si AL MENOS UNO es verdadero
      !   NO logico -> invierte el valor
  */

  const tieneMatricula = true;
  const pagoLaCuota = false;

  imprimir('matricula && pago ->', tieneMatricula && pagoLaCuota);   // false
  imprimir('matricula || pago ->', tieneMatricula || pagoLaCuota);   // true
  imprimir('!matricula        ->', !tieneMatricula);                 // false
  imprimir('!!"texto"         ->', !!'texto');                       // true (doble ! convierte a booleano)

  /*
    EL CORTOCIRCUITO (short-circuit)
    JavaScript es perezoso: deja de evaluar en cuanto ya conoce el
    resultado. Y ademas NO devuelve true/false, devuelve EL VALOR que
    hizo que se detuviera.

      A && B  -> si A es falsy devuelve A; si no, devuelve B
      A || B  -> si A es truthy devuelve A; si no, devuelve B
  */

  imprimir("'Ana' && 'Bruno' ->", 'Ana' && 'Bruno');   // "Bruno" (los dos son truthy, devuelve el ultimo)
  imprimir("'' && 'Bruno'    ->", '' && 'Bruno');      // "" (se detiene en el primero, que es falsy)
  imprimir("'' || 'Invitado' ->", '' || 'Invitado');   // "Invitado"
  imprimir("'Ana' || 'Invit' ->", 'Ana' || 'Invitado');// "Ana"

  // Uso practico 1: valor por defecto.
  const nombreRecibido = '';
  const nombreMostrado = nombreRecibido || 'Invitado';
  imprimir('Nombre a mostrar ->', nombreMostrado);     // "Invitado"

  /*
    ⚠️ ERROR COMUN: usar || para valores por defecto cuando 0 o ''
    son valores VALIDOS. El || los considera falsy y los sustituye.
    Para eso existe ?? (fusion de nulos), que solo actua con
    null y undefined.
  */
  const unidadesEnCarrito = 0;
  imprimir('0 || 5  ->', unidadesEnCarrito || 5, '(mal: 0 era un dato valido)');   // 5
  imprimir('0 ?? 5  ->', unidadesEnCarrito ?? 5, '(bien: respeta el 0)');          // 0

  // Uso practico 2: proteger un acceso que podria fallar.
  const usuarioSinDatos = null;
  imprimir('usuario && usuario.nombre ->', String(usuarioSinDatos && usuarioSinDatos.nombre)); // null

  // El encadenamiento opcional ?. hace lo mismo de forma mas elegante:
  imprimir('usuario?.nombre ->', String(usuarioSinDatos?.nombre));    // undefined

  // ============================================================
  // 9. EL OPERADOR TERNARIO
  // ============================================================

  titulo('10. OPERADOR TERNARIO');

  /*
    Es el unico operador de JavaScript con TRES partes:
        condicion ? valorSiEsVerdadero : valorSiEsFalso
    Se lee como una pregunta: "condicion? entonces esto : si no, esto otro".
    A diferencia de if, el ternario DEVUELVE un valor, asi que puede
    asignarse directamente a una variable.
  */

  const notaObtenida = 7.4;
  const estadoDelCurso = notaObtenida >= 6 ? 'Aprobado' : 'Reprobado';
  imprimir('Nota', notaObtenida, '->', estadoDelCurso);   // "Aprobado"

  // Equivalente con if (mas largo, pero a veces mas claro):
  let estadoConIf;
  if (notaObtenida >= 6) {
    estadoConIf = 'Aprobado';
  } else {
    estadoConIf = 'Reprobado';
  }
  imprimir('Mismo resultado con if ->', estadoConIf);

  // Muy util dentro de un texto, para singular y plural:
  const cantidadDeTareas = 1;
  imprimir('Tienes ' + cantidadDeTareas + (cantidadDeTareas === 1 ? ' tarea' : ' tareas'));

  /*
    ⚠️ ERROR COMUN: anidar ternarios hasta hacerlos ilegibles.
      const x = a ? b ? 1 : 2 : c ? 3 : 4;   // nadie entiende esto
    ✅ BUENA PRACTICA: un ternario simple si; dos anidados, ya conviene un if.
  */
  const puntuacion = 85;
  const categoria = puntuacion >= 90 ? 'Excelente'
    : puntuacion >= 70 ? 'Notable'
      : puntuacion >= 50 ? 'Suficiente'
        : 'Insuficiente';
  imprimir('Ternario escalonado (legible si se indenta) ->', categoria);   // "Notable"

  // ============================================================
  // 10. PRECEDENCIA DE OPERADORES
  // ============================================================

  titulo('11. PRECEDENCIA DE OPERADORES');

  /*
    La precedencia decide QUE se resuelve primero, igual que en
    matematicas. De mayor a menor prioridad (version resumida):

      1. ( )                      agrupacion
      2. ++  --  !  typeof        unarios
      3. **                       potencia
      4. *  /  %                  multiplicativos
      5. +  -                     aditivos
      6. <  >  <=  >=             relacionales
      7. ==  !=  ===  !==         igualdad
      8. &&                       Y logico
      9. ||  ??                   O logico / fusion de nulos
     10. ? :                      ternario
     11. =  +=  -=  ...           asignacion
  */

  imprimir('2 + 3 * 4      ->', 2 + 3 * 4);       // 14 -> primero el *
  imprimir('(2 + 3) * 4    ->', (2 + 3) * 4);     // 20 -> los parentesis mandan
  imprimir('10 - 4 - 2     ->', 10 - 4 - 2);      // 4  -> se resuelve de izquierda a derecha
  imprimir('2 ** 3 ** 2    ->', 2 ** 3 ** 2);     // 512 -> ** va de DERECHA a izquierda: 2**(3**2)
  imprimir('true || false && false ->', true || false && false);       // true -> && antes que ||
  imprimir('(true || false) && false ->', (true || false) && false);   // false
  imprimir("1 + 2 + '3'    ->", 1 + 2 + '3');     // "33" -> 1+2=3, luego 3+'3' concatena
  imprimir("'1' + 2 + 3    ->", '1' + 2 + 3);     // "123" -> desde el primer string, todo concatena
  imprimir('typeof 5 + 5   ->', typeof 5 + 5);    // "number5" -> typeof se aplica ANTES que el +

  // ✅ BUENA PRACTICA: no memorices la tabla. Pon parentesis cuando dudes:
  // cuestan cero y ahorran horas de depuracion.

  // ============================================================
  // 11. VALORES TRUTHY Y FALSY
  // ============================================================

  titulo('12. VALORES TRUTHY Y FALSY');

  /*
    Cuando un valor que no es booleano se usa donde se espera un booleano
    (un if, un &&, un !), JavaScript lo convierte. Los valores que se
    convierten en false se llaman FALSY, y solo hay OCHO:

        false      0      -0      0n      ""      null      undefined      NaN

    TODO lo demas es truthy. Literalmente todo: "0", "false", [], {},
    funciones, Infinity, -1...
  */

  const listaFalsy = [false, 0, -0, 0n, '', null, undefined, NaN];
  imprimir('Los 8 valores FALSY convertidos a booleano:');
  listaFalsy.forEach(function (valor) {
    // El typeof nos ayuda a distinguir un 0 de un "0" en la salida.
    imprimir('  valor:', String(valor) === '' ? '(cadena vacia)' : String(valor),
             '| typeof:', typeof valor,
             '| Boolean():', Boolean(valor));
  });

  imprimir('--- Sorpresas TRUTHY ---');
  imprimir("Boolean('0')     ->", Boolean('0'));        // true: es texto con contenido
  imprimir("Boolean('false') ->", Boolean('false'));    // true: sigue siendo texto
  imprimir('Boolean([])      ->', Boolean([]));         // true: un arreglo vacio es un objeto
  imprimir('Boolean({})      ->', Boolean({}));         // true
  imprimir('Boolean(-1)      ->', Boolean(-1));         // true: solo el 0 es falsy
  imprimir('Boolean(" ")     ->', Boolean(' '));        // true: un espacio ya es contenido

  /*
    ⚠️ ERROR COMUN: comprobar si un arreglo tiene datos con  if (arreglo).
    Un arreglo vacio es TRUTHY, asi que siempre entra en el if.
    ✅ BUENA PRACTICA: comprobar la longitud, if (arreglo.length > 0).
  */
  const carritoVacio = [];
  imprimir('if (carritoVacio) entraria? ->', Boolean(carritoVacio));               // true (enganoso)
  imprimir('if (carritoVacio.length > 0) entraria? ->', carritoVacio.length > 0);  // false (correcto)

  /*
    ============================================================
    EJERCICIOS PROPUESTOS
    ============================================================
    1) Calcula el precio final de un producto de 250 con un descuento del
       15% y un IVA del 21%. Imprime el resultado con dos decimales.

    2) Usando el operador %, escribe un bucle del 1 al 20 que imprima
       cada numero indicando si es PAR o IMPAR (usa un ternario).

    3) Predice en un comentario el resultado de estas cuatro expresiones
       y despues comprueba si acertaste:
          '' == false        |   [] === []
          2 + 2 + '2'        |   true + true + true

    4) Escribe una funcion precioConDescuento(precio, descuento) donde el
       descuento sea opcional: si no llega, debe valer 0. Cuidado, tiene
       que seguir funcionando si alguien pasa un descuento de 0.

    5) RETO: escribe una funcion clasificarEdad(edad) que devuelva
       'Menor', 'Adulto' o 'Jubilado' usando SOLO operadores ternarios,
       y despues reescribela con if/else. Compara cual se lee mejor.
    ============================================================
  */
})();
