/**
 * ============================================================
 * ARCHIVO: js/04-ejercicios-clasicos.js
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
 * Como los demas archivos, va envuelto en una IIFE para que su funcion
 * "imprimir" no choque con las de 01, 02 y 03.
 */

(function () {
  'use strict';

  // ============================================================
  // 0. HERRAMIENTAS DE SALIDA
  // ============================================================

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

  titulo('1. FIZZBUZZ (del 1 al 20)');

  // Acumulamos la salida en una linea para que quepa mejor en pantalla.
  let lineaFizzBuzz = '  ';

  for (let numero = 1; numero <= 20; numero++) {
    let resultado;

    // Primero el caso mas restrictivo: multiplo de 3 Y de 5 a la vez.
    if (numero % 3 === 0 && numero % 5 === 0) {
      resultado = 'FizzBuzz';
    } else if (numero % 3 === 0) {
      resultado = 'Fizz';
    } else if (numero % 5 === 0) {
      resultado = 'Buzz';
    } else {
      // String(numero) convierte el numero a texto para que la variable
      // resultado siempre contenga el mismo tipo de dato.
      resultado = String(numero);
    }

    lineaFizzBuzz += resultado + '  ';
  }

  imprimir(lineaFizzBuzz);

  // ⚠️ ERROR COMUN: preguntar  if (numero % 3 === 0)  antes que el caso
  // doble. Pruebalo cambiando el orden: el 15 saldra como "Fizz".

  // ✅ VARIANTE ELEGANTE: construir el texto por acumulacion. Si no se
  // acumulo nada, es que no era multiplo de ninguno de los dos.
  imprimir('Misma logica, version por acumulacion:');

  let lineaAcumulada = '  ';

  for (let numero = 1; numero <= 20; numero++) {
    let texto = ''; // Empezamos con la cadena vacia

    if (numero % 3 === 0) texto += 'Fizz'; // Añade Fizz si toca
    if (numero % 5 === 0) texto += 'Buzz'; // Y Buzz si tambien toca

    // La cadena vacia es FALSY: si texto sigue vacio, usamos el numero.
    // Aqui se ve para que sirve de verdad lo del archivo 01.
    lineaAcumulada += (texto || numero) + '  ';
  }

  imprimir(lineaAcumulada);

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

  titulo('2. CONTAR VOCALES');

  const frase = 'El control de flujo decide que codigo se ejecuta y cuantas veces';

  // Todas las vocales posibles, incluidas las acentuadas y la u con dieresis.
  const VOCALES = 'aeiouáéíóúàèìòùäëïöü';

  imprimir('Frase: "' + frase + '"');

  let totalVocales = 0;
  let totalConsonantes = 0;

  // toLowerCase() devuelve una copia en minusculas; no modifica el original.
  for (const letra of frase.toLowerCase()) {
    if (VOCALES.includes(letra)) {
      totalVocales++;
    } else if (letra >= 'a' && letra <= 'z') {
      // Comparar letras con < y > funciona por orden alfabetico.
      // Asi descartamos espacios, comas y numeros.
      totalConsonantes++;
    }
    // Los espacios y signos no entran en ninguno de los dos contadores.
  }

  imprimir('Vocales: ' + totalVocales);
  imprimir('Consonantes: ' + totalConsonantes);
  imprimir('Longitud total (incluidos espacios): ' + frase.length);

  // Version detallada: cuantas hay de cada vocal. Usamos un objeto como
  // "contador con nombre" y for...in para leerlo al final.
  const conteoPorVocal = { a: 0, e: 0, i: 0, o: 0, u: 0 };

  for (const letra of frase.toLowerCase()) {
    // El operador in comprueba si esa clave existe en el objeto.
    if (letra in conteoPorVocal) {
      conteoPorVocal[letra]++; // Corchetes: la clave esta en una variable
    }
  }

  imprimir('Desglose por vocal:');
  for (const vocal in conteoPorVocal) {
    // repeat(n) repite un texto n veces: dibujamos una barra de frecuencia.
    imprimir('  ' + vocal + ': ' + String(conteoPorVocal[vocal]).padStart(2) + '  ' + '#'.repeat(conteoPorVocal[vocal]));
  }

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

  titulo('3. NUMEROS PRIMOS');

  /**
   * esPrimo(): indica si un numero entero es primo.
   * @param {number} n - Numero a comprobar
   * @returns {boolean} true si es primo
   */
  function esPrimo(n) {
    // Guardas iniciales (salidas tempranas), del archivo 01.
    if (n < 2) return false; // 0, 1 y los negativos no son primos
    if (n === 2) return true; // 2 es el unico primo par
    if (n % 2 === 0) return false; // Cualquier otro par se descarta ya

    // Empezamos en 3 y saltamos de dos en dos: los pares ya estan fuera.
    // Math.sqrt(n) es la raiz cuadrada. Comparamos divisor * divisor <= n
    // para no calcular la raiz en cada vuelta (es mas rapido).
    for (let divisor = 3; divisor * divisor <= n; divisor += 2) {
      if (n % divisor === 0) {
        return false; // Encontramos un divisor: no es primo
      }
    }

    return true; // Si el bucle acabo sin encontrar divisores, es primo
  }

  // Probamos con algunos numeros concretos.
  const numerosAProbar = [1, 2, 9, 17, 25, 29, 91, 97];

  for (const n of numerosAProbar) {
    imprimir('  ' + String(n).padStart(3) + ' -> ' + (esPrimo(n) ? 'PRIMO' : 'no es primo'));
  }

  // Listado de todos los primos hasta 60, acumulados en una sola linea.
  let listaPrimos = '  ';
  let cuantosPrimos = 0;

  for (let n = 2; n <= 60; n++) {
    if (esPrimo(n)) {
      listaPrimos += n + ' ';
      cuantosPrimos++;
    }
  }

  imprimir('Primos hasta 60 (' + cuantosPrimos + ' en total):');
  imprimir(listaPrimos);

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

  titulo('4. FACTORIAL');

  /**
   * factorial(): calcula n! con un bucle for.
   * @param {number} n - Numero entero no negativo
   * @returns {number|string} El factorial, o un mensaje de error
   */
  function factorial(n) {
    if (n < 0) return 'El factorial no existe para numeros negativos';

    // Por definicion matematica, 0! vale 1.
    let acumulado = 1;

    for (let i = 2; i <= n; i++) {
      acumulado *= i; // Equivale a: acumulado = acumulado * i
    }

    return acumulado;
  }

  // Mostramos como crece, para que se vea la explosion de los factoriales.
  for (let n = 0; n <= 10; n++) {
    imprimir('  ' + String(n).padStart(2) + '! = ' + factorial(n));
  }

  imprimir('  18! = ' + factorial(18) + '  <- ultimo factorial exacto');
  imprimir('  19! = ' + factorial(19) + '  <- ya supera MAX_SAFE_INTEGER');
  imprimir('  20! = ' + factorial(20));
  imprimir('  21! = ' + factorial(21));

  // ⚠️ AVISO IMPORTANTE: el ultimo factorial que JavaScript calcula con
  // total seguridad es 18! (6.402.373.705.728.000). A partir de 19! el
  // resultado ya supera Number.MAX_SAFE_INTEGER (9.007.199.254.740.991,
  // algo mas de 9 mil billones). Por encima de ese limite el lenguaje deja
  // de poder representar TODOS los enteros y redondea al valor
  // representable mas cercano.
  imprimir('  Number.MAX_SAFE_INTEGER = ' + Number.MAX_SAFE_INTEGER);

  // La prueba de que la precision se ha perdido: sumarle 1 a un numero tan
  // grande no lo cambia, porque el 1 se pierde en el redondeo. Si esto
  // imprime "true", es que ya no podemos fiarnos del resultado.
  imprimir('  factorial(21) + 1 === factorial(21)  ->  ' + (factorial(21) + 1 === factorial(21)));
  imprimir('  Para enteros enormes existe el tipo BigInt (mas adelante en el curso).');

  // Version paso a paso de 5!, para verlo en clase con detalle.
  imprimir('Desglose de 5! vuelta a vuelta:');
  let acumuladoDemo = 1;
  for (let i = 2; i <= 5; i++) {
    const anterior = acumuladoDemo;
    acumuladoDemo *= i;
    imprimir('  i=' + i + ':  ' + anterior + ' * ' + i + ' = ' + acumuladoDemo);
  }

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

  titulo('5. EL MAYOR DE UNA LISTA');

  const temperaturas = [18.5, 22.1, 19.8, 25.3, 21.0, 17.2, 24.9];

  imprimir('Temperaturas de la semana: ' + temperaturas.join(', '));

  // Empezamos con el primero como campeon provisional.
  let mayor = temperaturas[0];
  let diaDelMayor = 0;

  // Empezamos el bucle en 1: el elemento 0 ya es nuestro punto de partida.
  for (let i = 1; i < temperaturas.length; i++) {
    if (temperaturas[i] > mayor) {
      mayor = temperaturas[i];
      diaDelMayor = i;
      imprimir('  Nuevo maximo encontrado en la posicion ' + i + ': ' + mayor);
    }
  }

  imprimir('Temperatura maxima: ' + mayor + ' (dia ' + (diaDelMayor + 1) + ' de la semana)');

  // La misma idea sirve para el minimo, cambiando > por <.
  let menor = temperaturas[0];
  for (const temperatura of temperaturas) {
    if (temperatura < menor) {
      menor = temperatura;
    }
  }
  imprimir('Temperatura minima: ' + menor);

  // ✅ ATAJO QUE YA EXISTE: Math.max con el operador de propagacion (...)
  // "desparrama" el array en argumentos sueltos. Lo enseñamos DESPUES de
  // hacerlo a mano, para que se entienda que hay debajo.
  imprimir('Con Math.max(...temperaturas) -> ' + Math.max(...temperaturas));

  // ============================================================
  // 6. SUMAR PARES E IMPARES POR SEPARADO
  // ------------------------------------------------------------
  // EL ENUNCIADO: recorrer una lista de numeros y calcular dos sumas
  // distintas, la de los pares y la de los impares.
  //
  // LA CLAVE: un numero es par si su resto al dividir entre 2 es 0.
  // Necesitamos DOS acumuladores, ambos empezando en 0 (son sumas).
  // ============================================================

  titulo('6. SUMAR PARES E IMPARES');

  const numerosVentas = [12, 7, 25, 40, 3, 18, 9, 64, 51, 30];

  imprimir('Lista: ' + numerosVentas.join(', '));

  let sumaPares = 0;
  let sumaImpares = 0;
  let cuantosPares = 0;
  let cuantosImpares = 0;

  for (const n of numerosVentas) {
    if (n % 2 === 0) {
      sumaPares += n;
      cuantosPares++;
    } else {
      sumaImpares += n;
      cuantosImpares++;
    }
  }

  imprimir('  Pares  : ' + cuantosPares + ' numeros, suman ' + sumaPares);
  imprimir('  Impares: ' + cuantosImpares + ' numeros, suman ' + sumaImpares);
  imprimir('  Suma total: ' + (sumaPares + sumaImpares));

  // ⚠️ ERROR COMUN con numeros negativos: -3 % 2 da -1, no 1. Por eso la
  // comprobacion segura es  n % 2 === 0  para par, y el else para impar.
  // Escribir  n % 2 === 1  fallaria con los impares negativos.
  imprimir('Comprobacion: -3 % 2 = ' + (-3 % 2) + ' (por eso usamos === 0 y else)');

  // Variante muy pedida: sumar los pares del 1 al 100 sin lista previa.
  let sumaParesHasta100 = 0;
  for (let i = 2; i <= 100; i += 2) {
    // Saltando de dos en dos ni siquiera hace falta el if.
    sumaParesHasta100 += i;
  }
  imprimir('Suma de todos los pares del 1 al 100: ' + sumaParesHasta100);

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

  titulo('7. PIRAMIDE DE ASTERISCOS');

  const alturaPiramide = 6;

  imprimir('Version con .repeat():');

  for (let fila = 1; fila <= alturaPiramide; fila++) {
    const espacios = ' '.repeat(alturaPiramide - fila);
    const asteriscos = '*'.repeat(fila * 2 - 1);
    imprimir('  ' + espacios + asteriscos);
  }

  // La misma piramide, construida con bucles anidados carácter a carácter.
  // Es la version que suele exigirse en clase porque practica la anidacion.
  imprimir('Version con bucles anidados (sin .repeat):');

  for (let fila = 1; fila <= alturaPiramide; fila++) {
    let linea = '  ';

    // Bucle interno 1: los espacios de la izquierda.
    for (let espacio = 1; espacio <= alturaPiramide - fila; espacio++) {
      linea += ' ';
    }

    // Bucle interno 2: los asteriscos.
    for (let asterisco = 1; asterisco <= fila * 2 - 1; asterisco++) {
      linea += '*';
    }

    imprimir(linea);
  }

  // Variantes rapidas cambiando la formula.
  imprimir('Triangulo alineado a la izquierda:');
  for (let fila = 1; fila <= alturaPiramide; fila++) {
    imprimir('  ' + '*'.repeat(fila));
  }

  imprimir('Triangulo invertido:');
  for (let fila = alturaPiramide; fila >= 1; fila--) {
    imprimir('  ' + '*'.repeat(fila));
  }

  imprimir('Rombo (piramide + piramide invertida):');
  for (let fila = 1; fila <= alturaPiramide; fila++) {
    imprimir('  ' + ' '.repeat(alturaPiramide - fila) + '*'.repeat(fila * 2 - 1));
  }
  for (let fila = alturaPiramide - 1; fila >= 1; fila--) {
    imprimir('  ' + ' '.repeat(alturaPiramide - fila) + '*'.repeat(fila * 2 - 1));
  }

  // ============================================================
  // 8. TABLA DE MULTIPLICAR EN LA CONSOLA
  // ------------------------------------------------------------
  // Antes de pintarla en el HTML, la generamos como texto. Es el mismo
  // bucle: solo cambia el destino de la salida.
  // ============================================================

  titulo('8. TABLA DE MULTIPLICAR (EN TEXTO)');

  const tablaElegida = 7;

  for (let i = 1; i <= 10; i++) {
    // padStart alinea los numeros a la derecha para que las columnas
    // queden rectas en la fuente monoespaciada.
    const linea = String(tablaElegida).padStart(2) + ' x ' + String(i).padStart(2) + ' = ' + String(tablaElegida * i).padStart(3);
    imprimir('  ' + linea);
  }

  imprimir('En la seccion 06 de la pagina tienes la version en HTML,');
  imprimir('generada con el mismo bucle pero creando elementos del DOM.');

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

  // Guardamos las referencias a los elementos del HTML que vamos a usar.
  const campoNota = document.getElementById('nota-input');
  const botonClasificar = document.getElementById('btn-clasificar');
  const cajaResultadoIf = document.getElementById('resultado-if');
  const cajaResultadoSwitch = document.getElementById('resultado-switch');

  /**
   * clasificarConIf(): clasifica una nota con una cadena if/else if/else.
   * @param {number} nota - Nota entre 0 y 10
   * @returns {{texto: string, nivel: string}} Etiqueta y nivel de color
   */
  function clasificarConIf(nota) {
    // De la condicion mas restrictiva a la mas amplia. Cambiar este orden
    // rompe la logica: es el error numero uno de este ejercicio.
    if (nota >= 9) {
      return { texto: 'Excelente', nivel: 'exito' };
    } else if (nota >= 7) {
      return { texto: 'Bueno', nivel: 'info' };
    } else if (nota >= 5) {
      return { texto: 'Suficiente', nivel: 'alerta' };
    } else {
      return { texto: 'Insuficiente', nivel: 'error' };
    }
  }

  /**
   * clasificarConSwitch(): exactamente la misma logica, con switch (true).
   * Fijate en que los case son EXPRESIONES que dan true o false, y en que
   * el switch busca el primer case cuyo resultado sea true.
   * @param {number} nota - Nota entre 0 y 10
   * @returns {{texto: string, nivel: string}} Etiqueta y nivel de color
   */
  function clasificarConSwitch(nota) {
    switch (true) {
      case nota >= 9:
        return { texto: 'Excelente', nivel: 'exito' };
      case nota >= 7:
        return { texto: 'Bueno', nivel: 'info' };
      case nota >= 5:
        return { texto: 'Suficiente', nivel: 'alerta' };
      default:
        return { texto: 'Insuficiente', nivel: 'error' };
    }
  }

  /**
   * pintarResultado(): escribe el veredicto dentro de una de las cajas del
   * HTML y le pone el color que corresponde.
   * @param {HTMLElement} caja - El div .resultado donde escribir
   * @param {string} etiqueta - Titulo pequeño de la caja
   * @param {string} mensaje - Texto principal
   * @param {string} nivel - exito | info | alerta | error
   */
  function pintarResultado(caja, etiqueta, mensaje, nivel) {
    if (!caja) return;

    // Vaciamos la caja antes de volver a llenarla.
    caja.textContent = '';

    // Creamos el <strong> con la etiqueta pequeña.
    const titulillo = document.createElement('strong');
    titulillo.textContent = etiqueta;

    // Y el <span> con el mensaje principal.
    const parrafo = document.createElement('span');
    parrafo.textContent = mensaje;

    caja.appendChild(titulillo);
    caja.appendChild(parrafo);

    // className reemplaza TODAS las clases del elemento de golpe.
    // Asi nos aseguramos de que no se acumulen colores de clics anteriores.
    caja.className = 'resultado resultado--' + nivel;
  }

  /**
   * manejarClasificacion(): se ejecuta al pulsar el boton. Lee el input,
   * valida el dato y muestra los dos resultados.
   */
  function manejarClasificacion() {
    // El valor de un input SIEMPRE llega como texto, aunque el input sea
    // de tipo number. Por eso convertimos con Number().
    const textoIntroducido = campoNota.value.trim(); // trim quita espacios
    const nota = Number(textoIntroducido);

    // VALIDACION 1: campo vacio. La cadena vacia es falsy (archivo 01).
    if (!textoIntroducido) {
      pintarResultado(cajaResultadoIf, 'Version if / else if / else', 'Escribe una nota antes de pulsar el boton.', 'error');
      pintarResultado(cajaResultadoSwitch, 'Version switch (true)', 'Escribe una nota antes de pulsar el boton.', 'error');
      return; // Salida temprana: no seguimos con un dato invalido
    }

    // VALIDACION 2: que sea un numero de verdad.
    // Number.isNaN es la forma correcta de detectar NaN (recuerda que
    // NaN === NaN da false).
    if (Number.isNaN(nota)) {
      pintarResultado(cajaResultadoIf, 'Version if / else if / else', '"' + textoIntroducido + '" no es un numero valido.', 'error');
      pintarResultado(cajaResultadoSwitch, 'Version switch (true)', '"' + textoIntroducido + '" no es un numero valido.', 'error');
      return;
    }

    // VALIDACION 3: que este dentro del rango permitido.
    if (nota < 0 || nota > 10) {
      pintarResultado(cajaResultadoIf, 'Version if / else if / else', 'La nota debe estar entre 0 y 10. Has escrito ' + nota + '.', 'error');
      pintarResultado(cajaResultadoSwitch, 'Version switch (true)', 'La nota debe estar entre 0 y 10. Has escrito ' + nota + '.', 'error');
      return;
    }

    // Si llegamos hasta aqui, el dato es correcto. Clasificamos dos veces.
    const conIf = clasificarConIf(nota);
    const conSwitch = clasificarConSwitch(nota);

    pintarResultado(cajaResultadoIf, 'Version if / else if / else', 'Nota ' + nota + ' -> ' + conIf.texto, conIf.nivel);

    pintarResultado(cajaResultadoSwitch, 'Version switch (true)', 'Nota ' + nota + ' -> ' + conSwitch.texto, conSwitch.nivel);

    // Dejamos constancia tambien en la consola visual.
    imprimir('\nClasificador: nota ' + nota + ' -> if/else: ' + conIf.texto + ' | switch(true): ' + conSwitch.texto);
  }

  // Conectamos el boton. Comprobamos antes que todo existe en el HTML.
  if (campoNota && botonClasificar) {
    botonClasificar.addEventListener('click', manejarClasificacion);

    // Detalle de usabilidad: pulsar Enter dentro del input tambien clasifica.
    // El objeto "evento" que recibe la funcion trae informacion de la
    // pulsacion; event.key es el nombre de la tecla.
    campoNota.addEventListener('keydown', function (evento) {
      if (evento.key === 'Enter') {
        manejarClasificacion();
      }
    });
  }

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

  const selectTabla = document.getElementById('select-tabla');
  const contenedorTabla = document.getElementById('contenedor-tabla');
  const botonTablaCompleta = document.getElementById('btn-tabla-completa');

  /**
   * rellenarSelect(): crea las 12 opciones del desplegable con un bucle,
   * en vez de escribir doce <option> a mano en el HTML.
   */
  function rellenarSelect() {
    if (!selectTabla) return;

    for (let i = 1; i <= 12; i++) {
      const opcion = document.createElement('option');
      opcion.value = i; // Valor interno que leeremos despues
      opcion.textContent = 'Tabla del ' + i; // Texto que ve el usuario
      selectTabla.appendChild(opcion);
    }

    // Dejamos preseleccionada la tabla del 7, que da mas juego en clase.
    selectTabla.value = '7';
  }

  /**
   * crearCelda(): crea un <td> o un <th> con un texto dentro.
   * Es una pequeña ayuda para no repetir tres lineas cada vez.
   * @param {string} etiqueta - 'td' o 'th'
   * @param {string|number} contenido - Lo que va dentro de la celda
   * @param {string} [clase] - Clase CSS opcional
   * @returns {HTMLElement} La celda ya construida
   */
  function crearCelda(etiqueta, contenido, clase) {
    const celda = document.createElement(etiqueta);
    celda.textContent = contenido;
    if (clase) celda.classList.add(clase); // classList.add añade una clase
    return celda;
  }

  /**
   * dibujarTablaSimple(): pinta la tabla de multiplicar de un numero,
   * del 1 al 12, con un unico bucle for.
   * @param {number} numero - Numero cuya tabla queremos
   */
  function dibujarTablaSimple(numero) {
    if (!contenedorTabla) return;

    // Vaciamos lo que hubiera antes. Sin esto, las tablas se acumularian
    // una debajo de otra en cada cambio del desplegable.
    contenedorTabla.textContent = '';

    const tabla = document.createElement('table');
    tabla.className = 'tabla-multiplicar';

    // <caption> es el titulo accesible de una tabla: los lectores de
    // pantalla lo anuncian antes de leer el contenido.
    // La llamamos "leyenda" y no "titulo" para no tapar (shadowing) a la
    // funcion titulo() que definimos arriba y que seguimos necesitando.
    const leyenda = document.createElement('caption');
    leyenda.textContent = 'Tabla de multiplicar del ' + numero;
    tabla.appendChild(leyenda);

    // --- Cabecera de la tabla ---
    const cabecera = document.createElement('thead');
    const filaCabecera = document.createElement('tr');

    filaCabecera.appendChild(crearCelda('th', 'Factor'));
    filaCabecera.appendChild(crearCelda('th', 'Operacion'));
    filaCabecera.appendChild(crearCelda('th', 'Resultado'));

    cabecera.appendChild(filaCabecera);
    tabla.appendChild(cabecera);

    // --- Cuerpo de la tabla: aqui vive el bucle ---
    const cuerpo = document.createElement('tbody');

    for (let i = 1; i <= 12; i++) {
      const fila = document.createElement('tr');

      fila.appendChild(crearCelda('td', i));
      fila.appendChild(crearCelda('td', numero + ' x ' + i));
      fila.appendChild(crearCelda('td', numero * i, 'resultado-celda'));

      cuerpo.appendChild(fila);
    }

    tabla.appendChild(cuerpo);

    // Hasta este momento la tabla vivia solo en memoria. Al añadirla al
    // contenedor es cuando aparece en pantalla.
    contenedorTabla.appendChild(tabla);
  }

  /**
   * dibujarRejillaCompleta(): pinta la rejilla 12 x 12 con TODAS las
   * tablas a la vez. Es el ejemplo perfecto de bucles anidados: el bucle
   * externo genera las filas y el interno las celdas de cada fila.
   */
  function dibujarRejillaCompleta() {
    if (!contenedorTabla) return;

    contenedorTabla.textContent = '';

    const tabla = document.createElement('table');
    tabla.className = 'tabla-multiplicar';

    const leyenda = document.createElement('caption');
    leyenda.textContent = 'Rejilla completa: todas las tablas del 1 al 12 (144 celdas generadas con dos bucles anidados)';
    tabla.appendChild(leyenda);

    // Cabecera: una celda vacia en la esquina y los numeros del 1 al 12.
    const cabecera = document.createElement('thead');
    const filaCabecera = document.createElement('tr');

    filaCabecera.appendChild(crearCelda('th', 'x'));

    for (let columna = 1; columna <= 12; columna++) {
      filaCabecera.appendChild(crearCelda('th', columna));
    }

    cabecera.appendChild(filaCabecera);
    tabla.appendChild(cabecera);

    // Cuerpo: 12 filas x 12 columnas = 144 celdas.
    const cuerpo = document.createElement('tbody');

    // BUCLE EXTERNO: cada vuelta es una FILA de la tabla.
    for (let fila = 1; fila <= 12; fila++) {
      const tr = document.createElement('tr');

      // Primera celda de la fila: el numero de la tabla, en negrita (th).
      tr.appendChild(crearCelda('th', fila));

      // BUCLE INTERNO: se ejecuta 12 veces por CADA vuelta del externo.
      for (let columna = 1; columna <= 12; columna++) {
        tr.appendChild(crearCelda('td', fila * columna));
      }

      cuerpo.appendChild(tr);
    }

    tabla.appendChild(cuerpo);
    contenedorTabla.appendChild(tabla);

    imprimir('\nRejilla completa dibujada: 12 filas x 12 columnas = 144 celdas.');
  }

  // --- Puesta en marcha de la seccion de la tabla ---

  if (selectTabla && contenedorTabla) {
    rellenarSelect();

    // Dibujamos una tabla nada mas cargar, para que la seccion no aparezca
    // vacia. Number(selectTabla.value) porque el value es texto.
    dibujarTablaSimple(Number(selectTabla.value));

    // El evento 'change' se dispara cuando el usuario elige otra opcion.
    selectTabla.addEventListener('change', function () {
      const numeroElegido = Number(selectTabla.value);
      dibujarTablaSimple(numeroElegido);
      imprimir('\nSe redibujo la tabla del ' + numeroElegido + ' (12 filas generadas por un for).');
    });
  }

  if (botonTablaCompleta) {
    botonTablaCompleta.addEventListener('click', dibujarRejillaCompleta);
  }

  // ============================================================
  // 11. BOTON DE LIMPIAR CONSOLA
  // ============================================================

  const botonLimpiar = document.getElementById('btn-limpiar-ejercicios');

  if (botonLimpiar && salida) {
    botonLimpiar.addEventListener('click', function () {
      salida.textContent = 'Consola limpiada. Recarga la pagina (F5) para volver a ejecutar.\n';
    });
  }

  // Mensaje final para que el estudiante sepa que la pagina esta viva.
  imprimir('\n------------------------------------------------------------');
  imprimir('Todos los ejercicios se ejecutaron al cargar la pagina.');
  imprimir('Prueba ahora el clasificador de notas y el selector de tablas.');
  imprimir('------------------------------------------------------------');

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
