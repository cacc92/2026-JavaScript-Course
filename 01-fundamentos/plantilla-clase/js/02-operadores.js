/**
 * ============================================================
 * ARCHIVO: js/02-operadores.js   ·   PLANTILLA DE CLASE
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
 * ------------------------------------------------------------
 * COMO USAR ESTA PLANTILLA:
 *   Se escribe en vivo el codigo de cada bloque "TODO (en clase)".
 *   La version resuelta esta en ../../js/02-operadores.js
 * ============================================================
 */

/*
  Igual que en el archivo 01, todo va dentro de una IIFE para que las
  constantes de este archivo no choquen con las de los otros tres.
  La IIFE ya viene escrita en la plantilla: no hay que teclearla.
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

  // NOTA DE LA PLANTILLA: estas dos lineas YA VIENEN ESCRITAS. Son
  // andamiaje (sin ellas no se ve nada en pantalla), pero merece la pena
  // pararse a leerlas: el || de la derecha se explica en la seccion 8.
  const imprimir = window.imprimir || function (...mensajes) { console.log(...mensajes); };
  const titulo = window.titulo || function (texto) { console.log('== ' + texto + ' =='); };

  // ============================================================
  // 2. OPERADORES ARITMETICOS
  // ============================================================

  // TODO (en clase):
  //   Abre la seccion con titulo('6. OPERADORES ARITMETICOS').
  //   (aprox. 1 linea)

  /*
    Son los de toda la vida, mas dos que suelen ser nuevos:
      %  -> resto de la division entera (modulo)
      ** -> potencia (elevado a)
  */

  // TODO (en clase):
  //   1. Declara const precioBase = 20; y const unidades = 3;
  //   2. Imprime las seis operaciones, una por linea, con estas etiquetas
  //      exactas (fijate en la alineacion, se proyecta en pantalla):
  //        'Suma           20 + 3  ->', precioBase + unidades       -> 23
  //        'Resta          20 - 3  ->', precioBase - unidades       -> 17
  //        'Multiplicacion 20 * 3  ->', precioBase * unidades       -> 60
  //        'Division       20 / 3  ->', precioBase / unidades       -> 6.666666666666667
  //        'Resto          20 % 3  ->', precioBase % unidades       -> 2
  //        'Potencia       20 ** 3 ->', precioBase ** unidades      -> 8000
  //   (aprox. 8 lineas)

  /*
    EL OPERADOR % (RESTO) EN LA VIDA REAL
    No es "porcentaje": es lo que sobra al repartir. Sirve muchisimo para:
      - saber si un numero es par o impar
      - alternar colores de fila en una tabla
      - dar la vuelta a un contador circular (relojes, carruseles)
  */

  // TODO (en clase):
  //   Imprime tres ejemplos del resto, con su explicacion como tercer argumento:
  //     imprimir('10 % 2 ->', 10 % 2, '(resto 0 = numero PAR)')
  //     imprimir('7 % 2  ->', 7 % 2, '(resto 1 = numero IMPAR)')
  //     imprimir('17 % 5 ->', 17 % 5, '(reparto 17 caramelos entre 5 y sobran 2)')
  //   Resultado esperado en pantalla: 0, 1 y 2.
  //   (aprox. 3 lineas)

  // ⚠️ ERROR COMUN: esperar que el resto de un negativo sea positivo.

  // TODO (en clase):
  //   imprimir('-7 % 3 ->', -7 % 3, '(el signo lo pone el DIVIDENDO, no el divisor)')
  //   Resultado esperado en pantalla: -7 % 3 -> -1
  //   (aprox. 1 linea)

  /*
    LA POTENCIA ** tambien sirve para raices:
    elevar a 0.5 es exactamente lo mismo que hacer raiz cuadrada.
  */

  // TODO (en clase):
  //     imprimir('2 ** 10  ->', 2 ** 10)             -> 1024
  //     imprimir('81 ** 0.5 ->', 81 ** 0.5)          -> 9 (raiz cuadrada)
  //     imprimir('Math.sqrt(81) ->', Math.sqrt(81))  -> 9
  //   (aprox. 3 lineas)

  // ⚠️ ERROR COMUN: escribir -3 ** 2. Es un SyntaxError a proposito,
  // porque no se sabe si es -(3**2) o (-3)**2. Hay que poner parentesis:

  // TODO (en clase):
  //   imprimir('(-3) ** 2 ->', (-3) ** 2)   -> 9
  //   Escribelo primero SIN parentesis para que la clase vea el SyntaxError
  //   en la consola, y despues corrigelo.
  //   (aprox. 1 linea)

  // ============================================================
  // 3. EL PROBLEMA DE LOS DECIMALES
  // ============================================================

  /*
    Los number de JavaScript se guardan en binario (formato IEEE 754).
    Igual que en decimal no podemos escribir 1/3 exacto (0.3333...),
    en binario no se puede escribir 0.1 exacto. De ahi el resultado raro.
  */

  // TODO (en clase):
  //     imprimir('0.1 + 0.2 ->', 0.1 + 0.2)                     -> 0.30000000000000004
  //     imprimir('0.1 + 0.2 === 0.3 ->', 0.1 + 0.2 === 0.3)     -> false
  //   (aprox. 2 lineas)

  // ✅ BUENA PRACTICA: para dinero, trabaja en centimos (enteros)
  // o redondea al comparar.

  // TODO (en clase):
  //     imprimir('Redondeado con toFixed(2) ->', (0.1 + 0.2).toFixed(2))            -> "0.30" (es TEXTO)
  //     imprimir('typeof (0.1+0.2).toFixed(2) ->', typeof (0.1 + 0.2).toFixed(2))   -> "string"
  //     imprimir('Comparando con tolerancia ->', Math.abs(0.1 + 0.2 - 0.3) < 0.00001)  -> true
  //   Insiste en que toFixed devuelve TEXTO, no numero.
  //   (aprox. 3 lineas)

  // ============================================================
  // 4. OPERADORES DE ASIGNACION
  // ============================================================

  // TODO (en clase):
  //   Abre la seccion con titulo('7. ASIGNACION, INCREMENTO Y DECREMENTO').
  //   (aprox. 1 linea)

  /*
    El operador = asigna (no significa "igual a", eso es ===).
    Los operadores compuestos son atajos: x += 5 es lo mismo que x = x + 5.
  */

  // TODO (en clase):
  //   1. Declara let saldoDeLaCuenta = 100; e imprime
  //      imprimir('saldo inicial       ->', saldoDeLaCuenta)     -> 100
  //   2. Aplica los seis operadores compuestos EN ESTE ORDEN, imprimiendo
  //      el saldo despues de cada uno (la cadena de resultados es acumulativa):
  //        saldoDeLaCuenta += 50;   imprimir('saldo += 50         ->', saldoDeLaCuenta)   -> 150
  //        saldoDeLaCuenta -= 30;   imprimir('saldo -= 30         ->', saldoDeLaCuenta)   -> 120
  //        saldoDeLaCuenta *= 2;    imprimir('saldo *= 2          ->', saldoDeLaCuenta)   -> 240
  //        saldoDeLaCuenta /= 4;    imprimir('saldo /= 4          ->', saldoDeLaCuenta)   -> 60
  //        saldoDeLaCuenta %= 7;    imprimir('saldo %= 7          ->', saldoDeLaCuenta)   -> 4
  //        saldoDeLaCuenta **= 3;   imprimir('saldo **= 3         ->', saldoDeLaCuenta)   -> 64
  //   (aprox. 13 lineas)

  // El += tambien funciona con texto, porque el + concatena:

  // TODO (en clase):
  //   1. let mensajeBienvenida = 'Hola';
  //   2. mensajeBienvenida += ', Ana';
  //   3. imprimir('Concatenar con += ->', mensajeBienvenida)
  //   Resultado esperado en pantalla: Concatenar con += -> Hola, Ana
  //   (aprox. 3 lineas)

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

  // TODO (en clase):
  //   1. let contadorPost = 5;
  //      const resultadoPost = contadorPost++;   // devuelve 5 y deja contadorPost en 6
  //      imprimir('POST: resultado =', resultadoPost, '| contador =', contadorPost)
  //   2. let contadorPre = 5;
  //      const resultadoPre = ++contadorPre;     // deja contadorPre en 6 y devuelve 6
  //      imprimir('PRE : resultado =', resultadoPre, '| contador =', contadorPre)
  //   3. let inventario = 3;
  //      inventario--;                           // como no usamos el resultado, da igual la posicion
  //      imprimir('inventario-- ->', inventario)
  //   Resultado esperado en pantalla:
  //      POST: resultado = 5 | contador = 6
  //      PRE : resultado = 6 | contador = 6
  //      inventario-- -> 2
  //   (aprox. 9 lineas)

  // ⚠️ ERROR COMUN: escribir cosas como  let x = i++ + ++i;
  // Es legal, pero nadie sabe leerlo. Separalo en varias lineas.
  // ✅ BUENA PRACTICA: usa ++ solo en solitario o en la cabecera de un for.

  // ============================================================
  // 6. OPERADORES DE COMPARACION: == FRENTE A ===
  // ============================================================

  // TODO (en clase):
  //   Abre la seccion con titulo('8. COMPARACION: == FRENTE A ===').
  //   (aprox. 1 linea)

  /*
    Toda comparacion devuelve un booleano (true o false).

      ==   igualdad DEBIL: convierte los tipos y luego compara el valor
      ===  igualdad ESTRICTA: compara valor Y tipo, sin convertir nada
      !=   distinto debil
      !==  distinto estricto

    Analogia: == es un portero que deja pasar si "se parece bastante";
    === es un portero que exige el DNI exacto.
  */

  // TODO (en clase):
  //   Imprime las cuatro comparaciones basicas (ojo a las comillas dobles
  //   por fuera para poder poner comillas simples dentro):
  //     imprimir("5 == '5'   ->", 5 == '5')     -> true  (convierte '5' a numero)
  //     imprimir("5 === '5'  ->", 5 === '5')    -> false (number no es string)
  //     imprimir("5 != '5'   ->", 5 != '5')     -> false
  //     imprimir("5 !== '5'  ->", 5 !== '5')    -> true  <- la forma correcta de preguntar
  //   (aprox. 4 lineas)

  /*
    Construimos la MISMA tabla que aparece en el HTML, pero calculada de
    verdad por el navegador. Asi el docente puede demostrar que no hay
    trampa: los valores salen del propio motor de JavaScript.
  */

  // TODO (en clase):
  //   1. Crea const tablaIgualdad = [ ... ] con SIETE objetos. Cada objeto
  //      tiene tres propiedades: expresion, conDobleIgual y conTripleIgual.
  //      Las filas, en este orden (izquierda: etiqueta de texto; derecha:
  //      la comparacion de verdad, sin comillas):
  //        "5  y  '5'"        ->  5 == '5'             |  5 === '5'
  //        '0  y  false'      ->  0 == false           |  0 === false
  //        "''  y  false"     ->  '' == false          |  '' === false
  //        'null y undefined' ->  null == undefined    |  null === undefined
  //        'null y 0'         ->  null == 0            |  null === 0
  //        '[]  y  false'     ->  [] == false          |  [] === false
  //        'NaN y NaN'        ->  NaN == NaN           |  NaN === NaN
  //   2. Llama a console.table(tablaIgualdad) y ensena la tabla en DevTools (F12).
  //   3. Imprime la cabecera: imprimir('Tabla == frente a === (mira tambien DevTools con F12):')
  //   4. Recorre la tabla con tablaIgualdad.forEach(function (fila) { ... }) e imprime
  //      cada fila alineada con padEnd:
  //        imprimir('  ' + fila.expresion.padEnd(18, ' ') +
  //                 '  ==  ' + String(fila.conDobleIgual).padEnd(6, ' ') +
  //                 '  ===  ' + fila.conTripleIgual)
  //   Resultado esperado en pantalla: siete filas donde la columna == da
  //   true salvo en 'null y 0' y 'NaN y NaN', y la columna === da false en todas.
  //   (aprox. 17 lineas)

  /*
    NaN es el unico valor de JavaScript que no es igual ni a si mismo.
    Se ve mejor en el archivo 03, donde estudiamos NaN a fondo.
  */

  // ✅ BUENA PRACTICA: usa siempre === y !==.
  // Unica excepcion tolerada: valor == null, que detecta a la vez
  // null y undefined en una sola comparacion.

  // TODO (en clase):
  //   1. const telefono = undefined;
  //   2. imprimir('telefono == null ->', telefono == null, '(detecta null Y undefined)')
  //   Resultado esperado en pantalla: telefono == null -> true (detecta null Y undefined)
  //   (aprox. 2 lineas)

  // ============================================================
  // 7. COMPARADORES RELACIONALES: >  <  >=  <=
  // ============================================================

  /*
    Con numeros son evidentes. La sorpresa aparece con texto: dos strings
    se comparan letra por letra segun su codigo Unicode, como en un
    diccionario, NO por su valor numerico.
  */

  // TODO (en clase):
  //   Imprime estas cinco comparaciones, en este orden:
  //     imprimir('10 > 9      ->', 10 > 9)         -> true
  //     imprimir("'3' > '12'  ->", '3' > '12')     -> true   <- compara '3' contra '1'
  //     imprimir('3 > 12      ->', 3 > 12)         -> false  <- aqui si son numeros
  //     imprimir("'a' < 'b'   ->", 'a' < 'b')      -> true
  //     imprimir("'B' < 'a'   ->", 'B' < 'a')      -> true   <- mayusculas antes en Unicode
  //   (aprox. 5 lineas)

  // ⚠️ ERROR COMUN: ordenar o comparar numeros que llegan como texto
  // desde un input o un prompt. Conviertelos ANTES con Number().

  // ============================================================
  // 8. OPERADORES LOGICOS Y CORTOCIRCUITO
  // ============================================================

  // TODO (en clase):
  //   Abre la seccion con titulo('9. OPERADORES LOGICOS Y CORTOCIRCUITO').
  //   (aprox. 1 linea)

  /*
      &&  Y logico  -> true solo si AMBOS lados son verdaderos
      ||  O logico  -> true si AL MENOS UNO es verdadero
      !   NO logico -> invierte el valor
  */

  // TODO (en clase):
  //   1. const tieneMatricula = true;  y  const pagoLaCuota = false;
  //   2. Imprime las cuatro lineas:
  //        imprimir('matricula && pago ->', tieneMatricula && pagoLaCuota)   -> false
  //        imprimir('matricula || pago ->', tieneMatricula || pagoLaCuota)   -> true
  //        imprimir('!matricula        ->', !tieneMatricula)                 -> false
  //        imprimir('!!"texto"         ->', !!'texto')                       -> true
  //      (el doble ! convierte cualquier cosa a booleano)
  //   (aprox. 6 lineas)

  /*
    EL CORTOCIRCUITO (short-circuit)
    JavaScript es perezoso: deja de evaluar en cuanto ya conoce el
    resultado. Y ademas NO devuelve true/false, devuelve EL VALOR que
    hizo que se detuviera.

      A && B  -> si A es falsy devuelve A; si no, devuelve B
      A || B  -> si A es truthy devuelve A; si no, devuelve B
  */

  // TODO (en clase):
  //   Imprime los cuatro casos y subraya que NO devuelven booleanos:
  //     imprimir("'Ana' && 'Bruno' ->", 'Ana' && 'Bruno')     -> "Bruno"
  //     imprimir("'' && 'Bruno'    ->", '' && 'Bruno')        -> "" (cadena vacia)
  //     imprimir("'' || 'Invitado' ->", '' || 'Invitado')     -> "Invitado"
  //     imprimir("'Ana' || 'Invit' ->", 'Ana' || 'Invitado')  -> "Ana"
  //   (aprox. 4 lineas)

  // Uso practico 1: valor por defecto.

  // TODO (en clase):
  //   1. const nombreRecibido = '';
  //   2. const nombreMostrado = nombreRecibido || 'Invitado';
  //   3. imprimir('Nombre a mostrar ->', nombreMostrado)
  //   Resultado esperado en pantalla: Nombre a mostrar -> Invitado
  //   (aprox. 3 lineas)

  /*
    ⚠️ ERROR COMUN: usar || para valores por defecto cuando 0 o ''
    son valores VALIDOS. El || los considera falsy y los sustituye.
    Para eso existe ?? (fusion de nulos), que solo actua con
    null y undefined.
  */

  // TODO (en clase):
  //   1. const unidadesEnCarrito = 0;
  //   2. imprimir('0 || 5  ->', unidadesEnCarrito || 5, '(mal: 0 era un dato valido)')   -> 5
  //   3. imprimir('0 ?? 5  ->', unidadesEnCarrito ?? 5, '(bien: respeta el 0)')          -> 0
  //   (aprox. 3 lineas)

  // Uso practico 2: proteger un acceso que podria fallar.

  // TODO (en clase):
  //   1. const usuarioSinDatos = null;
  //   2. imprimir('usuario && usuario.nombre ->', String(usuarioSinDatos && usuarioSinDatos.nombre))
  //      -> null   (el && se detiene en el primer falsy y devuelve null)
  //   3. El encadenamiento opcional ?. hace lo mismo de forma mas elegante:
  //      imprimir('usuario?.nombre ->', String(usuarioSinDatos?.nombre))
  //      -> undefined
  //   (aprox. 3 lineas)

  // ============================================================
  // 9. EL OPERADOR TERNARIO
  // ============================================================

  // TODO (en clase):
  //   Abre la seccion con titulo('10. OPERADOR TERNARIO').
  //   (aprox. 1 linea)

  /*
    Es el unico operador de JavaScript con TRES partes:
        condicion ? valorSiEsVerdadero : valorSiEsFalso
    Se lee como una pregunta: "condicion? entonces esto : si no, esto otro".
    A diferencia de if, el ternario DEVUELVE un valor, asi que puede
    asignarse directamente a una variable.
  */

  // TODO (en clase):
  //   1. const notaObtenida = 7.4;
  //   2. const estadoDelCurso = notaObtenida >= 6 ? 'Aprobado' : 'Reprobado';
  //   3. imprimir('Nota', notaObtenida, '->', estadoDelCurso)
  //   Resultado esperado en pantalla: Nota 7.4 -> Aprobado
  //   (aprox. 3 lineas)

  // Equivalente con if (mas largo, pero a veces mas claro):

  // TODO (en clase):
  //   1. Declara let estadoConIf; (sin valor).
  //   2. Escribe el if (notaObtenida >= 6) { estadoConIf = 'Aprobado'; }
  //      else { estadoConIf = 'Reprobado'; }
  //   3. imprimir('Mismo resultado con if ->', estadoConIf)
  //   Resultado esperado en pantalla: Mismo resultado con if -> Aprobado
  //   (aprox. 7 lineas)

  // Muy util dentro de un texto, para singular y plural:

  // TODO (en clase):
  //   1. const cantidadDeTareas = 1;
  //   2. imprimir('Tienes ' + cantidadDeTareas + (cantidadDeTareas === 1 ? ' tarea' : ' tareas'))
  //   Resultado esperado en pantalla: Tienes 1 tarea
  //   (aprox. 2 lineas)

  /*
    ⚠️ ERROR COMUN: anidar ternarios hasta hacerlos ilegibles.
      const x = a ? b ? 1 : 2 : c ? 3 : 4;   // nadie entiende esto
    ✅ BUENA PRACTICA: un ternario simple si; dos anidados, ya conviene un if.
  */

  // TODO (en clase):
  //   1. const puntuacion = 85;
  //   2. Escribe un ternario escalonado, indentado en cascada, que asigne a
  //      const categoria:  >= 90 -> 'Excelente' ; >= 70 -> 'Notable' ;
  //      >= 50 -> 'Suficiente' ; en otro caso -> 'Insuficiente'.
  //   3. imprimir('Ternario escalonado (legible si se indenta) ->', categoria)
  //   Resultado esperado en pantalla: ... -> Notable
  //   (aprox. 6 lineas)

  // ============================================================
  // 10. PRECEDENCIA DE OPERADORES
  // ============================================================

  // TODO (en clase):
  //   Abre la seccion con titulo('11. PRECEDENCIA DE OPERADORES').
  //   (aprox. 1 linea)

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

  // TODO (en clase):
  //   Imprime estas nueve expresiones, en este orden, y pide a la clase que
  //   prediga cada resultado ANTES de pulsar F5:
  //     imprimir('2 + 3 * 4      ->', 2 + 3 * 4)                        -> 14  (primero el *)
  //     imprimir('(2 + 3) * 4    ->', (2 + 3) * 4)                      -> 20  (mandan los parentesis)
  //     imprimir('10 - 4 - 2     ->', 10 - 4 - 2)                       -> 4   (izquierda a derecha)
  //     imprimir('2 ** 3 ** 2    ->', 2 ** 3 ** 2)                      -> 512 (** va de DERECHA a izquierda)
  //     imprimir('true || false && false ->', true || false && false)   -> true  (&& antes que ||)
  //     imprimir('(true || false) && false ->', (true || false) && false) -> false
  //     imprimir("1 + 2 + '3'    ->", 1 + 2 + '3')                      -> "33"
  //     imprimir("'1' + 2 + 3    ->", '1' + 2 + 3)                      -> "123"
  //     imprimir('typeof 5 + 5   ->', typeof 5 + 5)                     -> "number5"
  //   (aprox. 9 lineas)

  // ✅ BUENA PRACTICA: no memorices la tabla. Pon parentesis cuando dudes:
  // cuestan cero y ahorran horas de depuracion.

  // ============================================================
  // 11. VALORES TRUTHY Y FALSY
  // ============================================================

  // TODO (en clase):
  //   Abre la seccion con titulo('12. VALORES TRUTHY Y FALSY').
  //   (aprox. 1 linea)

  /*
    Cuando un valor que no es booleano se usa donde se espera un booleano
    (un if, un &&, un !), JavaScript lo convierte. Los valores que se
    convierten en false se llaman FALSY, y solo hay OCHO:

        false      0      -0      0n      ""      null      undefined      NaN

    TODO lo demas es truthy. Literalmente todo: "0", "false", [], {},
    funciones, Infinity, -1...
  */

  // DATOS DE PARTIDA (ya escritos): los ocho unicos valores falsy.
  const listaFalsy = [false, 0, -0, 0n, '', null, undefined, NaN];

  // TODO (en clase):
  //   1. imprimir('Los 8 valores FALSY convertidos a booleano:')
  //   2. Recorre la lista con listaFalsy.forEach(function (valor) { ... }) e
  //      imprime dentro, en una sola llamada de tres partes:
  //        imprimir('  valor:', String(valor) === '' ? '(cadena vacia)' : String(valor),
  //                 '| typeof:', typeof valor,
  //                 '| Boolean():', Boolean(valor))
  //      El ternario evita que la cadena vacia se vea como un hueco en pantalla.
  //   Resultado esperado en pantalla: ocho lineas, todas terminadas en false.
  //   (aprox. 7 lineas)

  // TODO (en clase):
  //   1. imprimir('--- Sorpresas TRUTHY ---')
  //   2. Imprime los seis casos que sorprenden:
  //        imprimir("Boolean('0')     ->", Boolean('0'))       -> true  (texto con contenido)
  //        imprimir("Boolean('false') ->", Boolean('false'))   -> true  (sigue siendo texto)
  //        imprimir('Boolean([])      ->', Boolean([]))        -> true  (arreglo vacio es objeto)
  //        imprimir('Boolean({})      ->', Boolean({}))        -> true
  //        imprimir('Boolean(-1)      ->', Boolean(-1))        -> true  (solo el 0 es falsy)
  //        imprimir('Boolean(" ")     ->', Boolean(' '))       -> true  (un espacio ya es contenido)
  //   (aprox. 7 lineas)

  /*
    ⚠️ ERROR COMUN: comprobar si un arreglo tiene datos con  if (arreglo).
    Un arreglo vacio es TRUTHY, asi que siempre entra en el if.
    ✅ BUENA PRACTICA: comprobar la longitud, if (arreglo.length > 0).
  */

  // TODO (en clase):
  //   1. const carritoVacio = [];
  //   2. imprimir('if (carritoVacio) entraria? ->', Boolean(carritoVacio))               -> true (enganoso)
  //   3. imprimir('if (carritoVacio.length > 0) entraria? ->', carritoVacio.length > 0)  -> false (correcto)
  //   (aprox. 3 lineas)

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
