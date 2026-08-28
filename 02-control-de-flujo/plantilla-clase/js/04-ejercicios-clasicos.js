/**
 * ============================================================
 * ARCHIVO: js/04-ejercicios-clasicos.js   ·   PLANTILLA DE CLASE
 * PROYECTO: 02 - Control de flujo
 * TEMA: Los ejercicios clasicos resueltos con condicionales y bucles
 * ============================================================
 *
 * QUE VAS A APRENDER EN ESTE ARCHIVO:
 *  - FizzBuzz, el ejercicio de entrevista mas famoso del mundo.
 *  - Contar vocales de una frase recorriendola letra a letra.
 *  - Detectar si un numero es primo (y optimizar la busqueda).
 *  - Calcular el factorial con un bucle acumulador.
 *  - Encontrar el mayor de una lista sin usar Math.max.
 *  - Sumar los numeros pares y los impares por separado.
 *  - Dibujar una piramide de asteriscos con bucles anidados.
 *  - Generar una tabla de multiplicar y pintarla en el HTML.
 *  - Un clasificador de notas interactivo, resuelto DOS VECES:
 *    con if/else y con switch(true), para comparar los dos estilos.
 *
 * TODO lo que hay aqui se resuelve unicamente con lo aprendido en los
 * archivos 01, 02 y 03: no hace falta nada mas avanzado.
 *
 * COMO SE USA ESTA PLANTILLA:
 * El archivo esta vacio de codigo a proposito. Cada seccion conserva su
 * explicacion y trae un bloque "TODO (en clase)" con las instrucciones
 * exactas de lo que hay que escribir. La version resuelta esta en
 * ../../js/04-ejercicios-clasicos.js (carpeta padre del proyecto).
 * Al abrir la pagina sin escribir nada NO debe haber ningun error en la
 * consola: la consola visual estara vacia, el clasificador de notas no
 * respondera y la tabla de multiplicar no aparecera. Eso es lo esperado:
 * las secciones 05 y 06 de la pagina cobran vida en las secciones 9 y 10
 * de este archivo.
 *
 * Como los demas archivos, va envuelto en una IIFE para que su funcion
 * "imprimir" no choque con las de 01, 02 y 03. La IIFE viene YA ESCRITA:
 * todo lo que escribas en clase va dentro de ella.
 */

(function () {
  'use strict';

  // ============================================================
  // 0. HERRAMIENTAS DE SALIDA
  // ============================================================
  // ESTA SECCION VIENE YA HECHA. Es andamiaje, no materia: sin ella no se
  // puede demostrar nada en pantalla desde el primer minuto.

  const salida = document.getElementById('salida-ejercicios');

  /** imprimir(): escribe en DevTools (F12) y en la consola visual de la pagina. */
  function imprimir(...mensajes) {
    console.log(...mensajes);
    if (!salida) return;
    const texto = mensajes
      .map((m) => (typeof m === 'object' && m !== null ? JSON.stringify(m, null, 2) : String(m)))
      .join(' ');
    salida.textContent += texto + '\n';
  }

  /** titulo(): separador visual entre ejercicios. */
  function titulo(texto) {
    imprimir('\n============================================================');
    imprimir('  ' + texto);
    imprimir('============================================================');
  }

  // ------------------------------------------------------------
  // DATOS DE PARTIDA DEL ARCHIVO (vienen ya escritos)
  // Son los enunciados en forma de dato. Teclearlos en clase seria tiempo
  // perdido: lo que se escribe en vivo es el algoritmo que los procesa.
  // ------------------------------------------------------------

  // Seccion 2: frase que analizaremos letra a letra.
  const frase = 'El control de flujo decide que codigo se ejecuta y cuantas veces';

  // Seccion 2: todas las vocales posibles, incluidas las acentuadas y la
  // u con dieresis. En MAYUSCULAS porque es una constante fija del programa.
  const VOCALES = 'aeiouáéíóúàèìòùäëïöü';

  // Seccion 3: numeros con los que probaremos esPrimo().
  const numerosAProbar = [1, 2, 9, 17, 25, 29, 91, 97];

  // Seccion 5: temperaturas de una semana.
  const temperaturas = [18.5, 22.1, 19.8, 25.3, 21.0, 17.2, 24.9];

  // Seccion 6: lista de ventas para separar pares e impares.
  const numerosVentas = [12, 7, 25, 40, 3, 18, 9, 64, 51, 30];

  // Seccion 7 y 8: parametros de la piramide y de la tabla en texto.
  const alturaPiramide = 6;
  const tablaElegida = 7;

  // ============================================================
  // 1. FIZZBUZZ
  // ------------------------------------------------------------
  // EL ENUNCIADO: recorre los numeros del 1 al 20. Por cada uno:
  //   - si es multiplo de 3 Y de 5, escribe "FizzBuzz"
  //   - si solo es multiplo de 3, escribe "Fizz"
  //   - si solo es multiplo de 5, escribe "Buzz"
  //   - en cualquier otro caso, escribe el numero
  //
  // LA CLAVE: el operador % (modulo o resto) devuelve lo que sobra de una
  // division entera. 9 % 3 da 0 porque 9 se divide exacto entre 3.
  // Por tanto  numero % 3 === 0  significa "es multiplo de 3".
  //
  // EL TRUCO DEL ORDEN: hay que preguntar PRIMERO por el caso doble
  // (multiplo de 3 y de 5). Si preguntas antes por el 3 a secas, el 15
  // entraria por ahi y nunca veriamos FizzBuzz. Es el mismo problema de
  // orden que vimos con las notas.
  // ============================================================

  // TODO (en clase) - VERSION CON IF / ELSE IF:
  //   1. titulo('1. FIZZBUZZ (del 1 al 20)').
  //   2. let lineaFizzBuzz = '  ';   // acumulamos todo en una sola linea
  //   3. for (let numero = 1; numero <= 20; numero++) { ... } y dentro:
  //        let resultado;
  //        if (numero % 3 === 0 && numero % 5 === 0) resultado = 'FizzBuzz';
  //        else if (numero % 3 === 0)                resultado = 'Fizz';
  //        else if (numero % 5 === 0)                resultado = 'Buzz';
  //        else                                      resultado = String(numero);
  //        lineaFizzBuzz += resultado + '  ';
  //   4. imprimir(lineaFizzBuzz);
  //   Resultado esperado en pantalla (una sola linea):
  //      1  2  Fizz  4  Buzz  Fizz  7  8  Fizz  Buzz  11  Fizz  13  14
  //      FizzBuzz  16  17  Fizz  19  Buzz
  //   (aprox. 16 lineas)

  // ⚠️ ERROR COMUN: preguntar  if (numero % 3 === 0)  antes que el caso
  // doble. Pruebalo cambiando el orden en vivo: el 15 saldra como "Fizz".

  // TODO (en clase) - VERSION POR ACUMULACION:
  //   ✅ VARIANTE ELEGANTE: construir el texto sumando trozos. Si no se
  //   acumulo nada, es que no era multiplo de ninguno de los dos.
  //   1. imprimir('Misma logica, version por acumulacion:').
  //   2. let lineaAcumulada = '  ';
  //   3. for (let numero = 1; numero <= 20; numero++) { ... } y dentro:
  //        let texto = '';                              // cadena vacia
  //        if (numero % 3 === 0) texto += 'Fizz';
  //        if (numero % 5 === 0) texto += 'Buzz';
  //        lineaAcumulada += (texto || numero) + '  ';   // la cadena vacia es FALSY
  //   4. imprimir(lineaAcumulada);
  //   Aqui se ve para que sirve de verdad lo truthy/falsy del archivo 01.
  //   Resultado esperado: exactamente la misma linea que la version anterior.
  //   (aprox. 10 lineas)

  // ============================================================
  // 2. CONTAR LAS VOCALES DE UNA FRASE
  // ------------------------------------------------------------
  // EL ENUNCIADO: dada una frase, contar cuantas vocales tiene, sin
  // distinguir mayusculas de minusculas y contando tambien las acentuadas.
  //
  // ESTRATEGIA:
  //   1. Pasar la frase a minusculas para no comparar dos veces.
  //   2. Recorrerla letra a letra con for...of.
  //   3. Por cada letra, comprobar si esta dentro de una cadena que
  //      contiene todas las vocales. El metodo .includes() responde
  //      true o false.
  // ============================================================

  // TODO (en clase):
  //   1. titulo('2. CONTAR VOCALES').   (frase y VOCALES ya estan arriba)
  //   2. imprimir('Frase: "' + frase + '"').
  //   3. let totalVocales = 0;  let totalConsonantes = 0;
  //   4. for (const letra of frase.toLowerCase()) { ... } y dentro:
  //        if (VOCALES.includes(letra)) { totalVocales++; }
  //        else if (letra >= 'a' && letra <= 'z') { totalConsonantes++; }
  //      Comparar letras con < y > funciona por orden alfabetico: asi
  //      descartamos espacios, comas y numeros, que no entran en ningun contador.
  //   5. imprimir('Vocales: ' + totalVocales);
  //      imprimir('Consonantes: ' + totalConsonantes);
  //      imprimir('Longitud total (incluidos espacios): ' + frase.length);
  //   Resultado esperado en pantalla:
  //      Vocales: 24
  //      Consonantes: 29
  //      Longitud total (incluidos espacios): 64
  //   (aprox. 14 lineas)

  // TODO (en clase) - DESGLOSE POR VOCAL:
  //   Usamos un objeto como "contador con nombre" y for...in para leerlo.
  //   6. const conteoPorVocal = { a: 0, e: 0, i: 0, o: 0, u: 0 };
  //   7. for (const letra of frase.toLowerCase()) {
  //        if (letra in conteoPorVocal) { conteoPorVocal[letra]++; } }
  //      El operador in comprueba si esa clave existe en el objeto, y los
  //      corchetes son obligatorios porque la clave esta en una variable.
  //   8. imprimir('Desglose por vocal:') y
  //      for (const vocal in conteoPorVocal) {
  //        imprimir('  ' + vocal + ': ' + String(conteoPorVocal[vocal]).padStart(2) +
  //                 '  ' + '#'.repeat(conteoPorVocal[vocal])); }
  //      repeat(n) repite un texto n veces: dibuja una barra de frecuencia.
  //   Resultado esperado en pantalla:
  //      a:  3  ###
  //      e: 10  ##########
  //      i:  2  ##
  //      o:  5  #####
  //      u:  4  ####
  //   (aprox. 10 lineas)

  // ============================================================
  // 3. DETECTAR NUMEROS PRIMOS
  // ------------------------------------------------------------
  // Un numero primo es aquel mayor que 1 que solo se puede dividir de
  // forma exacta entre 1 y entre si mismo. 7 es primo; 9 no lo es,
  // porque tambien se divide entre 3.
  //
  // ESTRATEGIA: probar a dividirlo entre todos los numeros desde 2 hasta
  // el propio numero menos uno. Si alguna division da resto 0, no es primo
  // y podemos parar (break o return).
  //
  // OPTIMIZACION IMPORTANTE: no hace falta llegar hasta n-1. Basta con
  // llegar hasta la RAIZ CUADRADA de n. Razon: si n = a * b y ambos
  // factores fueran mayores que la raiz, su producto se pasaria de n.
  // Para n = 100 pasamos de 98 comprobaciones a solo 9.
  // ============================================================

  // TODO (en clase):
  //   1. titulo('3. NUMEROS PRIMOS').
  //   2. Escribe la funcion esPrimo(n) con su JSDoc
  //      (@param {number} n, @returns {boolean}). Dentro, por este orden:
  //        if (n < 2) return false;        // 0, 1 y los negativos
  //        if (n === 2) return true;       // el unico primo par
  //        if (n % 2 === 0) return false;  // cualquier otro par fuera
  //        for (let divisor = 3; divisor * divisor <= n; divisor += 2) {
  //          if (n % divisor === 0) return false;
  //        }
  //        return true;
  //      Comparamos divisor * divisor <= n en vez de calcular Math.sqrt(n)
  //      en cada vuelta, porque es mas rapido.
  //   3. Prueba la funcion con numerosAProbar (ya declarado arriba):
  //      for (const n of numerosAProbar) {
  //        imprimir('  ' + String(n).padStart(3) + ' -> ' + (esPrimo(n) ? 'PRIMO' : 'no es primo')); }
  //   4. Lista todos los primos hasta 60 en una sola linea:
  //      let listaPrimos = '  ';  let cuantosPrimos = 0;
  //      for (let n = 2; n <= 60; n++) { if (esPrimo(n)) { listaPrimos += n + ' '; cuantosPrimos++; } }
  //      imprimir('Primos hasta 60 (' + cuantosPrimos + ' en total):');
  //      imprimir(listaPrimos);
  //   Resultado esperado en pantalla:
  //        1 -> no es primo /   2 -> PRIMO /   9 -> no es primo /  17 -> PRIMO
  //       25 -> no es primo /  29 -> PRIMO /  91 -> no es primo /  97 -> PRIMO
  //      Primos hasta 60 (17 en total):
  //      2 3 5 7 11 13 17 19 23 29 31 37 41 43 47 53 59
  //   (aprox. 26 lineas)

  // ⚠️ ERROR COMUN: escribir el bucle como  for (let d = 2; d < n; d++)
  // y olvidar el  return false  dentro. Sin el, la funcion recorre todo y
  // devuelve true siempre.

  // ============================================================
  // 4. FACTORIAL CON UN BUCLE
  // ------------------------------------------------------------
  // El factorial de n (se escribe n!) es el producto de todos los enteros
  // del 1 al n:   5! = 1 * 2 * 3 * 4 * 5 = 120
  //
  // ESTRATEGIA DEL ACUMULADOR: creamos una variable que arrastra el
  // resultado parcial y la vamos multiplicando en cada vuelta.
  //
  // ⚠️ El acumulador empieza en 1, NO en 0. Si empezara en 0, cualquier
  // multiplicacion daria 0 y el resultado final seria siempre 0.
  // (En una SUMA el acumulador si empieza en 0; en un PRODUCTO, en 1.)
  // ============================================================

  // TODO (en clase):
  //   1. titulo('4. FACTORIAL').
  //   2. Escribe la funcion factorial(n) con su JSDoc
  //      (@param {number} n, @returns {number|string}). Dentro:
  //        if (n < 0) return 'El factorial no existe para numeros negativos';
  //        let acumulado = 1;               // por definicion, 0! vale 1
  //        for (let i = 2; i <= n; i++) { acumulado *= i; }
  //        return acumulado;
  //   3. Muestra como crece:
  //      for (let n = 0; n <= 10; n++) {
  //        imprimir('  ' + String(n).padStart(2) + '! = ' + factorial(n)); }
  //   4. Enseña el limite de precision de JavaScript:
  //      imprimir('  18! = ' + factorial(18) + '  <- ultimo factorial exacto');
  //      imprimir('  19! = ' + factorial(19) + '  <- ya supera MAX_SAFE_INTEGER');
  //      imprimir('  20! = ' + factorial(20));
  //      imprimir('  21! = ' + factorial(21));
  //      imprimir('  Number.MAX_SAFE_INTEGER = ' + Number.MAX_SAFE_INTEGER);
  //      imprimir('  factorial(21) + 1 === factorial(21)  ->  ' + (factorial(21) + 1 === factorial(21)));
  //      imprimir('  Para enteros enormes existe el tipo BigInt (mas adelante en el curso).');
  //   5. Desglose de 5! vuelta a vuelta, para verlo con detalle:
  //      imprimir('Desglose de 5! vuelta a vuelta:');
  //      let acumuladoDemo = 1;
  //      for (let i = 2; i <= 5; i++) { const anterior = acumuladoDemo;
  //        acumuladoDemo *= i;
  //        imprimir('  i=' + i + ':  ' + anterior + ' * ' + i + ' = ' + acumuladoDemo); }
  //   Resultado esperado en pantalla:
  //       0! = 1 ...  5! = 120 ... 10! = 3628800
  //      18! = 6402373705728000
  //      factorial(21) + 1 === factorial(21)  ->  true   <- la precision se perdio
  //      i=2:  1 * 2 = 2 / i=3:  2 * 3 = 6 / i=4:  6 * 4 = 24 / i=5:  24 * 5 = 120
  //   (aprox. 26 lineas)

  // ⚠️ AVISO IMPORTANTE: el ultimo factorial que JavaScript calcula con
  // total seguridad es 18! (6.402.373.705.728.000). A partir de 19! el
  // resultado ya supera Number.MAX_SAFE_INTEGER (9.007.199.254.740.991,
  // algo mas de 9 mil billones). Por encima de ese limite el lenguaje deja
  // de poder representar TODOS los enteros y redondea al valor
  // representable mas cercano. La prueba: sumarle 1 a un numero tan grande
  // no lo cambia, porque el 1 se pierde en el redondeo.

  // ============================================================
  // 5. ENCONTRAR EL MAYOR DE UNA LISTA
  // ------------------------------------------------------------
  // EL ENUNCIADO: dado un array de numeros, devolver el mas grande.
  //
  // ESTRATEGIA DEL CAMPEON: suponemos que el primer elemento es el mayor
  // y recorremos el resto. Cada vez que encontramos uno mas grande, ese
  // pasa a ser el nuevo campeon. Al terminar, el campeon es el maximo.
  //
  // ⚠️ ERROR COMUN: inicializar el campeon en 0. Si todos los numeros son
  // negativos, el 0 ganaria siempre y devolveriamos un valor que ni
  // siquiera esta en la lista. Inicializa SIEMPRE con el primer elemento.
  // ============================================================

  // TODO (en clase):
  //   1. titulo('5. EL MAYOR DE UNA LISTA').   (temperaturas ya esta arriba)
  //   2. imprimir('Temperaturas de la semana: ' + temperaturas.join(', ')).
  //   3. let mayor = temperaturas[0];   // campeon provisional
  //      let diaDelMayor = 0;
  //   4. Empieza el bucle en 1, porque el elemento 0 ya es el punto de partida:
  //      for (let i = 1; i < temperaturas.length; i++) {
  //        if (temperaturas[i] > mayor) { mayor = temperaturas[i]; diaDelMayor = i;
  //          imprimir('  Nuevo maximo encontrado en la posicion ' + i + ': ' + mayor); } }
  //   5. imprimir('Temperatura maxima: ' + mayor + ' (dia ' + (diaDelMayor + 1) + ' de la semana)');
  //   6. La misma idea para el minimo, cambiando > por <:
  //      let menor = temperaturas[0];
  //      for (const temperatura of temperaturas) { if (temperatura < menor) { menor = temperatura; } }
  //      imprimir('Temperatura minima: ' + menor);
  //   7. ✅ ATAJO QUE YA EXISTE, enseñado DESPUES de hacerlo a mano para
  //      que se entienda que hay debajo. El operador de propagacion (...)
  //      "desparrama" el array en argumentos sueltos:
  //      imprimir('Con Math.max(...temperaturas) -> ' + Math.max(...temperaturas));
  //   Resultado esperado en pantalla:
  //      Nuevo maximo encontrado en la posicion 1: 22.1
  //      Nuevo maximo encontrado en la posicion 3: 25.3
  //      Temperatura maxima: 25.3 (dia 4 de la semana)
  //      Temperatura minima: 17.2
  //      Con Math.max(...temperaturas) -> 25.3
  //   (aprox. 18 lineas)

  // ============================================================
  // 6. SUMAR PARES E IMPARES POR SEPARADO
  // ------------------------------------------------------------
  // EL ENUNCIADO: recorrer una lista de numeros y calcular dos sumas
  // distintas, la de los pares y la de los impares.
  //
  // LA CLAVE: un numero es par si su resto al dividir entre 2 es 0.
  // Necesitamos DOS acumuladores, ambos empezando en 0 (son sumas).
  // ============================================================

  // TODO (en clase):
  //   1. titulo('6. SUMAR PARES E IMPARES').   (numerosVentas ya esta arriba)
  //   2. imprimir('Lista: ' + numerosVentas.join(', ')).
  //   3. let sumaPares = 0;  let sumaImpares = 0;
  //      let cuantosPares = 0;  let cuantosImpares = 0;
  //   4. for (const n of numerosVentas) {
  //        if (n % 2 === 0) { sumaPares += n; cuantosPares++; }
  //        else { sumaImpares += n; cuantosImpares++; } }
  //   5. imprimir('  Pares  : ' + cuantosPares + ' numeros, suman ' + sumaPares);
  //      imprimir('  Impares: ' + cuantosImpares + ' numeros, suman ' + sumaImpares);
  //      imprimir('  Suma total: ' + (sumaPares + sumaImpares));
  //   6. Enseña el detalle de los negativos:
  //      imprimir('Comprobacion: -3 % 2 = ' + (-3 % 2) + ' (por eso usamos === 0 y else)');
  //   7. Variante muy pedida, los pares del 1 al 100 sin lista previa.
  //      Saltando de dos en dos ni siquiera hace falta el if:
  //      let sumaParesHasta100 = 0;
  //      for (let i = 2; i <= 100; i += 2) { sumaParesHasta100 += i; }
  //      imprimir('Suma de todos los pares del 1 al 100: ' + sumaParesHasta100);
  //   Resultado esperado en pantalla:
  //        Pares  : 5 numeros, suman 164
  //        Impares: 5 numeros, suman 95
  //        Suma total: 259
  //      Comprobacion: -3 % 2 = -1 (por eso usamos === 0 y else)
  //      Suma de todos los pares del 1 al 100: 2550
  //   (aprox. 18 lineas)

  // ⚠️ ERROR COMUN con numeros negativos: -3 % 2 da -1, no 1. Por eso la
  // comprobacion segura es  n % 2 === 0  para par, y el else para impar.
  // Escribir  n % 2 === 1  fallaria con los impares negativos.

  // ============================================================
  // 7. PIRAMIDE DE ASTERISCOS
  // ------------------------------------------------------------
  // EL ENUNCIADO: dibujar una piramide centrada de una altura dada.
  //
  // ESTRATEGIA: cada fila necesita dos cosas:
  //   - unos espacios a la izquierda para centrarla: (altura - fila)
  //   - un numero impar de asteriscos: (fila * 2 - 1)
  //
  // Fila 1 -> 1 asterisco, fila 2 -> 3, fila 3 -> 5, fila 4 -> 7...
  //
  // El metodo .repeat(n) nos ahorra el bucle interno, pero mas abajo
  // tambien lo hacemos con bucles anidados, que es lo que suele pedirse
  // en el examen.
  // ============================================================

  // TODO (en clase) - VERSION CON .repeat():
  //   1. titulo('7. PIRAMIDE DE ASTERISCOS').   (alturaPiramide vale 6)
  //   2. imprimir('Version con .repeat():') y
  //      for (let fila = 1; fila <= alturaPiramide; fila++) {
  //        const espacios = ' '.repeat(alturaPiramide - fila);
  //        const asteriscos = '*'.repeat(fila * 2 - 1);
  //        imprimir('  ' + espacios + asteriscos); }
  //   (aprox. 6 lineas)

  // TODO (en clase) - VERSION CON BUCLES ANIDADOS (la que cae en el examen):
  //   3. imprimir('Version con bucles anidados (sin .repeat):') y
  //      for (let fila = 1; fila <= alturaPiramide; fila++) {
  //        let linea = '  ';
  //        for (let espacio = 1; espacio <= alturaPiramide - fila; espacio++) { linea += ' '; }
  //        for (let asterisco = 1; asterisco <= fila * 2 - 1; asterisco++) { linea += '*'; }
  //        imprimir(linea); }
  //      Fijate en que son DOS bucles internos: uno para los espacios y
  //      otro para los asteriscos, y que se imprime una vez por FILA.
  //   Resultado esperado en pantalla (identico en las dos versiones):
  //           *
  //          ***
  //         *****
  //        *******
  //       *********
  //      ***********
  //   (aprox. 10 lineas)

  // TODO (en clase) - VARIANTES RAPIDAS cambiando la formula:
  //   4. imprimir('Triangulo alineado a la izquierda:') y
  //      for (let fila = 1; fila <= alturaPiramide; fila++) { imprimir('  ' + '*'.repeat(fila)); }
  //   5. imprimir('Triangulo invertido:') y
  //      for (let fila = alturaPiramide; fila >= 1; fila--) { imprimir('  ' + '*'.repeat(fila)); }
  //   6. imprimir('Rombo (piramide + piramide invertida):') y DOS bucles seguidos:
  //      for (let fila = 1; fila <= alturaPiramide; fila++) {
  //        imprimir('  ' + ' '.repeat(alturaPiramide - fila) + '*'.repeat(fila * 2 - 1)); }
  //      for (let fila = alturaPiramide - 1; fila >= 1; fila--) {
  //        imprimir('  ' + ' '.repeat(alturaPiramide - fila) + '*'.repeat(fila * 2 - 1)); }
  //      El segundo empieza en alturaPiramide - 1 para no repetir la fila
  //      mas ancha dos veces.
  //   (aprox. 12 lineas)

  // ============================================================
  // 8. TABLA DE MULTIPLICAR EN LA CONSOLA
  // ------------------------------------------------------------
  // Antes de pintarla en el HTML, la generamos como texto. Es el mismo
  // bucle: solo cambia el destino de la salida.
  // ============================================================

  // TODO (en clase):
  //   1. titulo('8. TABLA DE MULTIPLICAR (EN TEXTO)').   (tablaElegida vale 7)
  //   2. for (let i = 1; i <= 10; i++) { ... } y dentro:
  //        const linea = String(tablaElegida).padStart(2) + ' x ' +
  //                      String(i).padStart(2) + ' = ' + String(tablaElegida * i).padStart(3);
  //        imprimir('  ' + linea);
  //      padStart alinea los numeros a la derecha para que las columnas
  //      queden rectas en la fuente monoespaciada.
  //   3. imprimir('En la seccion 06 de la pagina tienes la version en HTML,');
  //      imprimir('generada con el mismo bucle pero creando elementos del DOM.');
  //   Resultado esperado en pantalla:
  //       7 x  1 =   7
  //       7 x  2 =  14
  //      ... hasta
  //       7 x 10 =  70
  //   (aprox. 8 lineas)

  // ============================================================
  // 9. CLASIFICADOR DE NOTAS INTERACTIVO
  // ------------------------------------------------------------
  // Ahora conectamos la teoria con la pagina. El usuario escribe una nota
  // y pulsa un boton; nosotros clasificamos esa nota DOS VECES, con dos
  // tecnicas distintas, y mostramos ambos resultados uno al lado del otro.
  //
  // Escala usada:
  //   9 a 10  -> Excelente
  //   7 a 8.9 -> Bueno
  //   5 a 6.9 -> Suficiente
  //   0 a 4.9 -> Insuficiente
  // ============================================================

  // TODO (en clase) - PASO 1, referencias al HTML (seccion 05 de la pagina):
  //   const campoNota = document.getElementById('nota-input');
  //   const botonClasificar = document.getElementById('btn-clasificar');
  //   const cajaResultadoIf = document.getElementById('resultado-if');
  //   const cajaResultadoSwitch = document.getElementById('resultado-switch');
  //   (aprox. 4 lineas)

  // TODO (en clase) - PASO 2, las dos clasificaciones:
  //   1. Escribe clasificarConIf(nota) con su JSDoc
  //      (@param {number} nota, @returns {{texto: string, nivel: string}}).
  //      Cadena if / else if / else, de la condicion MAS RESTRICTIVA a la
  //      mas amplia, devolviendo objetos:
  //        nota >= 9 -> return { texto: 'Excelente',    nivel: 'exito'  };
  //        nota >= 7 -> return { texto: 'Bueno',        nivel: 'info'   };
  //        nota >= 5 -> return { texto: 'Suficiente',   nivel: 'alerta' };
  //        else      -> return { texto: 'Insuficiente', nivel: 'error'  };
  //      Cambiar este orden rompe la logica: es el error numero uno del ejercicio.
  //   2. Escribe clasificarConSwitch(nota) con EXACTAMENTE la misma logica,
  //      pero con switch (true) y los mismos cuatro tramos en el mismo
  //      orden, usando default para el caso Insuficiente. Los case son
  //      EXPRESIONES que dan true o false, y el switch busca el primero
  //      cuyo resultado sea true.
  //   (aprox. 30 lineas entre las dos funciones)

  // TODO (en clase) - PASO 3, pintar el resultado en la pagina:
  //   3. Escribe pintarResultado(caja, etiqueta, mensaje, nivel) con su JSDoc.
  //      Dentro:
  //        if (!caja) return;                 // nunca des por hecho que existe
  //        caja.textContent = '';             // vaciamos antes de rellenar
  //        const titulillo = document.createElement('strong');
  //        titulillo.textContent = etiqueta;
  //        const parrafo = document.createElement('span');
  //        parrafo.textContent = mensaje;
  //        caja.appendChild(titulillo);
  //        caja.appendChild(parrafo);
  //        caja.className = 'resultado resultado--' + nivel;
  //      className reemplaza TODAS las clases de golpe, asi no se acumulan
  //      los colores de clics anteriores.
  //   (aprox. 12 lineas)

  // TODO (en clase) - PASO 4, el manejador del boton con sus tres validaciones:
  //   4. Escribe manejarClasificacion(). Dentro:
  //        const textoIntroducido = campoNota.value.trim();  // el value SIEMPRE es texto
  //        const nota = Number(textoIntroducido);
  //      VALIDACION 1 (campo vacio, la cadena vacia es falsy - archivo 01):
  //        if (!textoIntroducido) -> pintarResultado en las DOS cajas con
  //        'Escribe una nota antes de pulsar el boton.' y nivel 'error';
  //        despues return (salida temprana).
  //      VALIDACION 2 (que sea un numero de verdad):
  //        if (Number.isNaN(nota)) -> mensaje '"' + textoIntroducido +
  //        '" no es un numero valido.' en las dos cajas, nivel 'error', return.
  //        Number.isNaN es la forma correcta: recuerda que NaN === NaN da false.
  //      VALIDACION 3 (rango):
  //        if (nota < 0 || nota > 10) -> 'La nota debe estar entre 0 y 10. Has escrito ' +
  //        nota + '.' en las dos cajas, nivel 'error', return.
  //      SI TODO ES CORRECTO:
  //        const conIf = clasificarConIf(nota);
  //        const conSwitch = clasificarConSwitch(nota);
  //        pintarResultado(cajaResultadoIf, 'Version if / else if / else',
  //          'Nota ' + nota + ' -> ' + conIf.texto, conIf.nivel);
  //        pintarResultado(cajaResultadoSwitch, 'Version switch (true)',
  //          'Nota ' + nota + ' -> ' + conSwitch.texto, conSwitch.nivel);
  //        imprimir('\nClasificador: nota ' + nota + ' -> if/else: ' + conIf.texto +
  //          ' | switch(true): ' + conSwitch.texto);
  //   (aprox. 34 lineas)

  // TODO (en clase) - PASO 5, conectar los eventos:
  //   5. if (campoNota && botonClasificar) {
  //        botonClasificar.addEventListener('click', manejarClasificacion);
  //        campoNota.addEventListener('keydown', function (evento) {
  //          if (evento.key === 'Enter') { manejarClasificacion(); } });
  //      }
  //      El objeto "evento" trae informacion de la pulsacion; evento.key
  //      es el nombre de la tecla.
  //   Resultado esperado en la pagina: con el 7.5 que trae el input por
  //   defecto, al pulsar "Clasificar nota" las dos cajas de la seccion 05
  //   muestran "Nota 7.5 -> Bueno" y se pintan del mismo color, y en la
  //   consola visual aparece
  //     Clasificador: nota 7.5 -> if/else: Bueno | switch(true): Bueno
  //   (aprox. 8 lineas)

  // ============================================================
  // 10. TABLA DE MULTIPLICAR RENDERIZADA EN EL HTML
  // ------------------------------------------------------------
  // Aqui juntamos bucles y manipulacion del DOM (Document Object Model,
  // el arbol de elementos de la pagina).
  //
  // Los pasos siempre son los mismos:
  //   1. document.createElement('tr')  -> crear el elemento en memoria
  //   2. elemento.textContent = '...'  -> ponerle contenido
  //   3. padre.appendChild(hijo)       -> engancharlo al arbol
  //
  // ✅ BUENA PRACTICA: usamos textContent y no innerHTML para meter texto.
  // innerHTML interpreta etiquetas HTML, y si el texto viniera del usuario
  // podria colar codigo malicioso. textContent lo trata como texto plano.
  // ============================================================

  // TODO (en clase) - PASO 1, referencias al HTML (seccion 06 de la pagina):
  //   const selectTabla = document.getElementById('select-tabla');
  //   const contenedorTabla = document.getElementById('contenedor-tabla');
  //   const botonTablaCompleta = document.getElementById('btn-tabla-completa');
  //   (aprox. 3 lineas)

  // TODO (en clase) - PASO 2, rellenar el desplegable con un bucle:
  //   Escribe rellenarSelect(): crea las 12 opciones en vez de escribir
  //   doce <option> a mano en el HTML.
  //     if (!selectTabla) return;
  //     for (let i = 1; i <= 12; i++) {
  //       const opcion = document.createElement('option');
  //       opcion.value = i;                          // valor interno
  //       opcion.textContent = 'Tabla del ' + i;     // texto que ve el usuario
  //       selectTabla.appendChild(opcion);
  //     }
  //     selectTabla.value = '7';   // dejamos preseleccionada la del 7
  //   (aprox. 10 lineas)

  // TODO (en clase) - PASO 3, ayuda para crear celdas:
  //   Escribe crearCelda(etiqueta, contenido, clase) con su JSDoc, para no
  //   repetir tres lineas cada vez:
  //     const celda = document.createElement(etiqueta);   // 'td' o 'th'
  //     celda.textContent = contenido;
  //     if (clase) celda.classList.add(clase);
  //     return celda;
  //   (aprox. 6 lineas)

  // TODO (en clase) - PASO 4, la tabla de UN numero (un solo bucle):
  //   Escribe dibujarTablaSimple(numero) con su JSDoc:
  //     if (!contenedorTabla) return;
  //     contenedorTabla.textContent = '';   // sin esto las tablas se acumulan
  //     const tabla = document.createElement('table');
  //     tabla.className = 'tabla-multiplicar';
  //     const leyenda = document.createElement('caption');   // titulo accesible
  //     leyenda.textContent = 'Tabla de multiplicar del ' + numero;
  //     tabla.appendChild(leyenda);
  //     -- cabecera --
  //     const cabecera = document.createElement('thead');
  //     const filaCabecera = document.createElement('tr');
  //     filaCabecera.appendChild(crearCelda('th', 'Factor'));
  //     filaCabecera.appendChild(crearCelda('th', 'Operacion'));
  //     filaCabecera.appendChild(crearCelda('th', 'Resultado'));
  //     cabecera.appendChild(filaCabecera);  tabla.appendChild(cabecera);
  //     -- cuerpo: aqui vive el bucle --
  //     const cuerpo = document.createElement('tbody');
  //     for (let i = 1; i <= 12; i++) {
  //       const fila = document.createElement('tr');
  //       fila.appendChild(crearCelda('td', i));
  //       fila.appendChild(crearCelda('td', numero + ' x ' + i));
  //       fila.appendChild(crearCelda('td', numero * i, 'resultado-celda'));
  //       cuerpo.appendChild(fila);
  //     }
  //     tabla.appendChild(cuerpo);
  //     contenedorTabla.appendChild(tabla);   // hasta aqui vivia solo en memoria
  //   OJO al nombre "leyenda": no la llames "titulo", porque taparia
  //   (shadowing) a la funcion titulo() que seguimos necesitando.
  //   (aprox. 28 lineas)

  // TODO (en clase) - PASO 5, la rejilla 12 x 12 (bucles anidados):
  //   Escribe dibujarRejillaCompleta() con su JSDoc. Misma receta que
  //   dibujarTablaSimple, con estas diferencias:
  //     - leyenda.textContent = 'Rejilla completa: todas las tablas del 1 al 12
  //       (144 celdas generadas con dos bucles anidados)'
  //     - cabecera: primero crearCelda('th', 'x') y despues
  //       for (let columna = 1; columna <= 12; columna++) {
  //         filaCabecera.appendChild(crearCelda('th', columna)); }
  //     - cuerpo, BUCLE EXTERNO = filas, BUCLE INTERNO = celdas:
  //       for (let fila = 1; fila <= 12; fila++) {
  //         const tr = document.createElement('tr');
  //         tr.appendChild(crearCelda('th', fila));       // cabecera de la fila
  //         for (let columna = 1; columna <= 12; columna++) {
  //           tr.appendChild(crearCelda('td', fila * columna)); }
  //         cuerpo.appendChild(tr); }
  //     - al final: imprimir('\nRejilla completa dibujada: 12 filas x 12 columnas = 144 celdas.');
  //   (aprox. 30 lineas)

  // TODO (en clase) - PASO 6, poner en marcha la seccion de la tabla:
  //   if (selectTabla && contenedorTabla) {
  //     rellenarSelect();
  //     dibujarTablaSimple(Number(selectTabla.value));   // el value es texto
  //     selectTabla.addEventListener('change', function () {
  //       const numeroElegido = Number(selectTabla.value);
  //       dibujarTablaSimple(numeroElegido);
  //       imprimir('\nSe redibujo la tabla del ' + numeroElegido + ' (12 filas generadas por un for).');
  //     });
  //   }
  //   if (botonTablaCompleta) {
  //     botonTablaCompleta.addEventListener('click', dibujarRejillaCompleta);
  //   }
  //   Resultado esperado en la pagina: al cargar, la seccion 06 muestra ya
  //   la tabla del 7 con 12 filas; al cambiar el desplegable se redibuja; y
  //   el boton "Ver rejilla completa 1 al 12" pinta las 144 celdas.
  //   (aprox. 12 lineas)

  // ============================================================
  // 11. BOTON DE LIMPIAR CONSOLA
  // ============================================================

  // TODO (en clase):
  //   1. const botonLimpiar = document.getElementById('btn-limpiar-ejercicios');
  //   2. if (botonLimpiar && salida) { ... }
  //   3. Dentro, botonLimpiar.addEventListener('click', function () { ... })
  //      y en el cuerpo asigna
  //      salida.textContent = 'Consola limpiada. Recarga la pagina (F5) para volver a ejecutar.\n';
  //   4. Mensaje final, para que el estudiante sepa que la pagina esta viva:
  //      imprimir('\n------------------------------------------------------------');
  //      imprimir('Todos los ejercicios se ejecutaron al cargar la pagina.');
  //      imprimir('Prueba ahora el clasificador de notas y el selector de tablas.');
  //      imprimir('------------------------------------------------------------');
  //   (aprox. 11 lineas)

  /**
   * ============================================================
   * EJERCICIOS PROPUESTOS - 04 EJERCICIOS CLASICOS
   * ============================================================
   *
   * 1) FIZZBUZZ AMPLIADO (facil)
   *    Modifica FizzBuzz para que llegue hasta 50 y añada una regla mas:
   *    los multiplos de 7 escriben "Boom". Un numero que sea multiplo de
   *    3, 5 y 7 a la vez debe escribir "FizzBuzzBoom". Pista: la version
   *    por acumulacion lo resuelve casi sola.
   *
   * 2) CONTADOR DE PALABRAS (facil)
   *    Escribe una funcion que reciba una frase y devuelva cuantas
   *    palabras tiene, recorriendola letra a letra y contando los espacios.
   *    Ten cuidado con los espacios dobles y con los del principio y el final.
   *
   * 3) PALINDROMO (intermedio)
   *    Escribe esPalindromo(texto) que devuelva true si el texto se lee
   *    igual al derecho y al reves ("reconocer", "anilina"). Ignora
   *    mayusculas y espacios. Resuelvelo con un bucle que compare la
   *    primera letra con la ultima, la segunda con la penultima, etc.
   *    Usa dos contadores en la misma cabecera del for.
   *
   * 4) CRIBA DE PRIMOS (intermedio)
   *    Muestra todos los primos entre 1 y 200 en filas de diez numeros.
   *    Cuenta cuantos hay y calcula su suma total.
   *
   * 5) TABLA DE MULTIPLICAR A MEDIDA (intermedio)
   *    Añade a la pagina dos inputs numericos: "desde" y "hasta". Al pulsar
   *    un boton, genera la tabla del numero elegido en el desplegable pero
   *    solo entre esos dos limites. Valida que "desde" no sea mayor que
   *    "hasta".
   *
   * 6) PIRAMIDE NUMERICA (avanzado)
   *    En vez de asteriscos, dibuja una piramide de numeros donde cada
   *    fila muestre el numero de fila repetido:
   *        1
   *       222
   *      33333
   *    Hazlo con bucles anidados, sin usar .repeat().
   *
   * 7) ESTADISTICAS DE CLASE (avanzado)
   *    Dado un array de objetos {nombre, nota}, recorrelo una sola vez y
   *    calcula: la nota media, el mejor alumno, el peor, cuantos aprobaron
   *    y cuantos suspendieron. Muestra el resultado en una tabla HTML
   *    generada dinamicamente, como hicimos con la tabla de multiplicar.
   *
   * 8) CLASIFICADOR CON MAS NIVELES (avanzado)
   *    Amplia el clasificador de notas para que distinga tambien
   *    "Matricula de honor" (exactamente un 10) y "Suspenso alto" (entre
   *    4 y 4.9, con opcion a recuperacion). Hazlo en las dos versiones,
   *    la de if/else y la de switch (true), y comprueba que siguen dando
   *    siempre el mismo resultado.
   * ============================================================
   */
})();
