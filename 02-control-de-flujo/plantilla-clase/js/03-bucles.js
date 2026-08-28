/**
 * ============================================================
 * ARCHIVO: js/03-bucles.js   ·   PLANTILLA DE CLASE
 * PROYECTO: 02 - Control de flujo
 * TEMA: Bucles (for, while, do...while, for...of, for...in)
 * ============================================================
 *
 * QUE VAS A APRENDER EN ESTE ARCHIVO:
 *  - Las TRES partes del for clasico, explicadas una a una.
 *  - Variantes del for: hacia atras, con saltos, con dos contadores.
 *  - El bucle while y en que se diferencia del for.
 *  - El bucle do...while y el unico caso donde de verdad hace falta.
 *  - for...of para recorrer arrays y textos letra a letra.
 *  - for...in para recorrer las propiedades de un objeto.
 *  - Por que NO se debe usar for...in con arrays.
 *  - break para abandonar el bucle y continue para saltar una vuelta.
 *  - Bucles anidados (un bucle dentro de otro).
 *  - Bucles infinitos: como se producen y como protegerse.
 *
 * COMO SE USA ESTA PLANTILLA:
 * El archivo esta vacio de codigo a proposito. Cada seccion conserva su
 * explicacion y trae un bloque "TODO (en clase)" con las instrucciones
 * exactas de lo que hay que escribir. La version resuelta esta en
 * ../../js/03-bucles.js (carpeta padre del proyecto).
 * Al abrir la pagina sin escribir nada NO debe haber ningun error en la
 * consola: solo se veran las consolas visuales vacias.
 *
 * Como en los archivos anteriores, todo va dentro de una IIFE para que
 * las variables y funciones de este archivo no choquen con las de los otros.
 * La IIFE viene YA ESCRITA en la plantilla: todo lo que escribas en clase
 * va dentro de ella.
 */

(function () {
  'use strict';

  // ============================================================
  // 0. HERRAMIENTAS DE SALIDA
  // ============================================================
  // ESTA SECCION VIENE YA HECHA. Es andamiaje, no materia: sin ella no se
  // puede demostrar nada en pantalla desde el primer minuto.

  const salida = document.getElementById('salida-bucles');

  /** imprimir(): escribe en DevTools (F12) y en la consola visual de la pagina. */
  function imprimir(...mensajes) {
    console.log(...mensajes);
    if (!salida) return;
    const texto = mensajes
      .map((m) => (typeof m === 'object' && m !== null ? JSON.stringify(m, null, 2) : String(m)))
      .join(' ');
    salida.textContent += texto + '\n';
  }

  /** titulo(): separador visual entre secciones. */
  function titulo(texto) {
    imprimir('\n============================================================');
    imprimir('  ' + texto);
    imprimir('============================================================');
  }

  // ------------------------------------------------------------
  // DATOS DE PARTIDA DEL ARCHIVO (vienen ya escritos)
  // Son las colecciones con las que trabajaremos en varias secciones.
  // Teclearlas en clase seria tiempo perdido: lo que se escribe en vivo
  // es la LOGICA que las recorre.
  // ------------------------------------------------------------

  // Seccion 3 y seccion 6: array de textos.
  const asignaturas = ['HTML', 'CSS', 'JavaScript', 'Git', 'Accesibilidad'];

  // Seccion 7: texto que recorreremos letra a letra.
  const palabra = 'JavaScript';

  // Seccion 8: objeto con pares clave: valor.
  const estudiante = {
    nombre: 'Marta Ruiz',
    edad: 21,
    ciudad: 'Valencia',
    notaMedia: 8.2,
    matriculado: true,
  };

  // Seccion 9: array pequeño de notas.
  const notas = [7, 9, 5];

  // Seccion 10: lista de la clase y nombre que buscaremos.
  const listaClase = ['Ana', 'Bruno', 'Carla', 'Diego', 'Elena', 'Fatima'];
  const buscado = 'Diego';

  // Seccion 11: notas de examen donde -1 significa "no presentado".
  const notasExamen = [8, -1, 5, 0, 10, -1, 6.5, 4];

  // Seccion 12: boletin de tres alumnos con dos notas cada uno.
  const boletin = [
    { alumno: 'Ana', notas: [7, 8] },
    { alumno: 'Bruno', notas: [5, 6.5] },
    { alumno: 'Carla', notas: [9, 9.5] },
  ];

  // ============================================================
  // 1. EL BUCLE FOR CLASICO Y SUS TRES PARTES
  // ------------------------------------------------------------
  // Un bucle repite un bloque de codigo. El for se usa cuando sabemos
  // (o podemos calcular) CUANTAS veces hay que repetir.
  //
  // Su cabecera lleva tres partes separadas por punto y coma:
  //
  //   for (INICIALIZACION ; CONDICION ; ACTUALIZACION) { cuerpo }
  //          |                 |              |
  //          |                 |              +-- 3. se ejecuta DESPUES de
  //          |                 |                     cada vuelta
  //          |                 +-- 2. se comprueba ANTES de cada vuelta.
  //          |                        Si da false, el bucle termina.
  //          +-- 1. se ejecuta UNA sola vez, al principio de todo
  //
  // ORDEN REAL DE EJECUCION:
  //   inicializacion -> condicion -> cuerpo -> actualizacion ->
  //   condicion -> cuerpo -> actualizacion -> ... hasta que la condicion
  //   sea falsa.
  //
  // Analogia: subir una escalera. Te colocas en el escalon 1
  // (inicializacion), miras si quedan escalones (condicion), pisas
  // (cuerpo) y subes uno (actualizacion).
  // ============================================================

  // TODO (en clase):
  //   1. titulo('1. EL FOR CLASICO Y SUS TRES PARTES').
  //   2. Escribe el for basico, comentando en voz alta sus tres partes:
  //        for (let i = 0; i < 5; i++) { imprimir('Vuelta numero ' + i); }
  //      let i = 0 crea el contador (por convencion se llama i, de index),
  //      i < 5 es la condicion, i++ es la actualizacion.
  //   3. imprimir('El bucle termino cuando i llego a 5 (5 < 5 es false).').
  //   4. Demuestra la regla del "0 con < / 1 con <=" contando alumnos:
  //        for (let i = 1; i <= 5; i++) { imprimir('Alumno numero ' + i + ' pasa lista'); }
  //   Resultado esperado en pantalla:
  //      Vuelta numero 0 ... Vuelta numero 4   (cinco lineas)
  //      El bucle termino cuando i llego a 5 (5 < 5 es false).
  //      Alumno numero 1 pasa lista ... Alumno numero 5 pasa lista
  //   (aprox. 9 lineas)

  // ⚠️ ERROR COMUN: empezar en 0 y usar <= con el total.
  //   for (let i = 0; i <= 5; i++)  da SEIS vueltas (0,1,2,3,4,5), no cinco.
  // Regla practica: si empiezas en 0, usa <  ; si empiezas en 1, usa <= .

  // ⚠️ ERROR COMUN 2: declarar el contador con var en vez de let.
  // var "se escapa" del bucle y sigue existiendo despues; let vive solo
  // dentro. Con let, escribir  imprimir(i)  aqui fuera daria
  // "ReferenceError: i is not defined", que es justo lo que queremos.

  // ✅ BUENA PRACTICA: usa let para el contador, siempre.

  // ============================================================
  // 2. VARIANTES DEL FOR
  // ------------------------------------------------------------
  // Las tres partes son libres: podemos contar hacia atras, de dos en
  // dos, o incluso mover dos variables a la vez.
  // ============================================================

  // TODO (en clase):
  //   1. titulo('2. VARIANTES DEL FOR').
  //   2.1 Cuenta atras (restamos con i--):
  //       imprimir('Cuenta atras para el examen:') y
  //       for (let i = 5; i > 0; i--) imprimiendo
  //       '  ' + (i === 1 ? 'Queda 1 minuto' : 'Quedan ' + i + ' minutos')
  //       Cierra con imprimir('  Se acabo el tiempo.').
  //   2.2 De dos en dos (i += 2 es igual que i = i + 2):
  //       imprimir('Numeros pares del 0 al 10:') y
  //       for (let i = 0; i <= 10; i += 2) { imprimir('  ' + i); }
  //   2.3 Multiplicando (la actualizacion no tiene que ser una suma):
  //       imprimir('Potencias de 2 hasta 64:') y
  //       for (let i = 1; i <= 64; i *= 2) { imprimir('  ' + i); }
  //   2.4 Dos contadores a la vez, separados por comas:
  //       imprimir('Dos contadores simultaneos (uno sube, otro baja):') y
  //       for (let inicio = 0, fin = 5; inicio < fin; inicio++, fin--)
  //         imprimiendo '  inicio=' + inicio + '  fin=' + fin
  //   Resultado esperado en pantalla (ultimo bloque):
  //      inicio=0  fin=5 / inicio=1  fin=4 / inicio=2  fin=3
  //   (aprox. 20 lineas)

  // ============================================================
  // 3. RECORRER UN ARRAY CON FOR CLASICO
  // ------------------------------------------------------------
  // Un array es una lista ordenada. Sus posiciones se llaman indices y
  // EMPIEZAN EN 0: el primer elemento es lista[0], no lista[1].
  //
  // La propiedad .length dice cuantos elementos hay. Por tanto el ultimo
  // indice valido es siempre length - 1.
  // ============================================================

  // TODO (en clase):
  //   1. titulo('3. RECORRER UN ARRAY CON FOR CLASICO').
  //   2. imprimir('El array tiene', asignaturas.length, 'elementos.').
  //      (asignaturas ya esta declarado arriba, en los datos de partida)
  //   3. for (let i = 0; i < asignaturas.length; i++) imprimiendo
  //      '  Indice ' + i + ' -> ' + asignaturas[i]
  //   4. Demuestra el desbordamiento:
  //      imprimir('asignaturas[5] ->', asignaturas[5], '(undefined: ese indice no existe)');
  //   Resultado esperado en pantalla:
  //      El array tiene 5 elementos.
  //        Indice 0 -> HTML   ...   Indice 4 -> Accesibilidad
  //      asignaturas[5] -> undefined (undefined: ese indice no existe)
  //   (aprox. 7 lineas)

  // ⚠️ ERROR COMUN: pasarse del final del array escribiendo  i <= length.
  // El indice 5 no existe en un array de 5 elementos: devuelve undefined.

  // ============================================================
  // 4. EL BUCLE WHILE
  // ------------------------------------------------------------
  // while significa "mientras". Solo lleva la condicion; la
  // inicializacion va ANTES del bucle y la actualizacion DENTRO.
  //
  //   inicializacion
  //   while (condicion) {
  //     cuerpo
  //     actualizacion   <- si se te olvida, bucle infinito
  //   }
  //
  // CUANDO USARLO: cuando NO sabes de antemano cuantas vueltas daras y
  // dependes de algo que cambia (una busqueda, una division sucesiva,
  // una lista que se va vaciando).
  // ============================================================

  // TODO (en clase):
  //   1. titulo('4. EL BUCLE WHILE').
  //   2. Repartir 17 libros en cajas de 5, sin saber cuantas cajas haran falta:
  //      a) let librosPendientes = 17;  let cajasUsadas = 0;
  //      b) while (librosPendientes > 0) { ... } y dentro:
  //         const librosEnEstaCaja = Math.min(5, librosPendientes);  // en la
  //           ultima caja metemos solo lo que queda, no cinco
  //         cajasUsadas++;
  //         librosPendientes -= librosEnEstaCaja;  // acerca la condicion a false
  //         imprimir('  Caja ' + cajasUsadas + ': ' + librosEnEstaCaja +
  //                  ' libros. Quedan ' + librosPendientes);
  //      c) Al salir: imprimir('Total de cajas necesarias:', cajasUsadas);
  //   3. Segundo ejemplo, dividir entre 2 hasta llegar a 1:
  //      let numero = 100;  let divisiones = 0;
  //      while (numero > 1) { numero = Math.floor(numero / 2); divisiones++;
  //        imprimir('  Division ' + divisiones + ' -> ' + numero); }
  //   4. El for de la seccion 1 escrito como while, para ver que son
  //      equivalentes: imprimir('El for de la seccion 1, escrito como while:'),
  //      let contador = 0; while (contador < 5) { imprimir('  Vuelta numero ' +
  //      contador); contador++; }
  //   Resultado esperado en pantalla:
  //      Caja 1: 5 libros. Quedan 12 / Caja 2: 5 ... Quedan 7 /
  //      Caja 3: 5 ... Quedan 2 / Caja 4: 2 libros. Quedan 0
  //      Total de cajas necesarias: 4
  //      Division 1 -> 50, 2 -> 25, 3 -> 12, 4 -> 6, 5 -> 3, 6 -> 1
  //   (aprox. 24 lineas)

  // ✅ BUENA PRACTICA: si sabes el numero de vueltas, usa for (las tres
  // partes estan juntas y a la vista). Si no lo sabes, usa while.

  // ============================================================
  // 5. EL BUCLE DO...WHILE
  // ------------------------------------------------------------
  // Es un while del reves: primero EJECUTA y despues pregunta. Por eso
  // su cuerpo se ejecuta SIEMPRE al menos una vez, aunque la condicion
  // sea falsa desde el principio.
  //
  //   do { cuerpo } while (condicion);      <- ojo al punto y coma final
  //
  // CUANDO SE USA: cuando la accion tiene que ocurrir al menos una vez
  // antes de poder decidir si hay que repetirla. El caso clasico es
  // pedir un dato al usuario y validarlo: primero hay que pedirlo.
  // ============================================================

  // TODO (en clase):
  //   1. titulo('5. EL BUCLE DO...WHILE').
  //   2. La diferencia clave, con una condicion FALSA de entrada:
  //      a) let intentos = 10;
  //      b) imprimir('Con while y condicion falsa (intentos < 3, intentos vale 10):')
  //         y un while (intentos < 3) que imprima '  Esta linea NUNCA se ve'.
  //         Cierra con imprimir('  (efectivamente, no se imprimio nada)').
  //      c) imprimir('Con do...while y la MISMA condicion falsa:') y
  //         do { imprimir('  Esta linea SI se ve, una vez, antes de comprobar nada'); }
  //         while (intentos < 3);     <- no olvides el punto y coma final
  //   3. Ejemplo realista, tirar un dado hasta sacar un 6:
  //      a) let tirada;  let numeroDeTiradas = 0;
  //      b) do { ... } while (tirada !== 6);  y dentro:
  //         tirada = Math.floor(Math.random() * 6) + 1;   // 1 a 6
  //         numeroDeTiradas++;
  //         imprimir('  Tirada ' + numeroDeTiradas + ': salio un ' + tirada);
  //         if (numeroDeTiradas >= 50) { imprimir('  Cortamos por seguridad tras 50 tiradas.'); break; }
  //      c) imprimir('Se necesitaron ' + numeroDeTiradas + ' tiradas para sacar un 6.');
  //   Resultado esperado en pantalla: el bloque del while no imprime nada,
  //   el do...while imprime su linea una vez, y despues salen tantas
  //   "Tirada N: salio un X" como hagan falta hasta el primer 6
  //   (el numero cambia en cada recarga: es aleatorio).
  //   (aprox. 24 lineas)

  // ⚠️ ERROR COMUN: olvidar el punto y coma final de  } while (...);
  // En un do...while ese punto y coma SI es obligatorio.

  // ============================================================
  // 6. FOR...OF: RECORRER LOS VALORES
  // ------------------------------------------------------------
  // for...of recorre directamente los VALORES de una coleccion, sin
  // contador ni indices. Se lee casi como una frase en español:
  //
  //   for (const asignatura of asignaturas)  ->  "para cada asignatura
  //                                               de asignaturas"
  //
  // Funciona con todo lo "iterable": arrays, textos, Map, Set, NodeList...
  // Es la forma preferida de recorrer un array cuando NO necesitas el indice.
  // ============================================================

  // TODO (en clase):
  //   1. titulo('6. FOR...OF CON ARRAYS').
  //   2. for (const asignatura of asignaturas) { imprimir('  Cursando: ' + asignatura); }
  //   3. El mismo recorrido con for clasico, para comparar el ruido:
  //      imprimir('El mismo recorrido con for clasico:') y
  //      for (let i = 0; i < asignaturas.length; i++) { imprimir('  Cursando: ' + asignaturas[i]); }
  //   4. Cuando SI necesitas el indice, .entries() da los dos a la vez.
  //      La sintaxis [indice, asignatura] es desestructuracion de array:
  //      imprimir('Con indice, usando .entries():') y
  //      for (const [indice, asignatura] of asignaturas.entries()) {
  //        imprimir('  ' + indice + ': ' + asignatura); }
  //   Resultado esperado en pantalla:
  //      Cursando: HTML ... Cursando: Accesibilidad (las 5, tres veces:
  //      con for...of, con for clasico y con indice delante).
  //   (aprox. 12 lineas)

  // ✅ BUENA PRACTICA: declara la variable del bucle con const. En cada
  // vuelta se crea una variable nueva, asi que const no da problemas y
  // ademas te protege de reasignarla por accidente.

  // ============================================================
  // 7. FOR...OF CON TEXTOS (STRINGS)
  // ------------------------------------------------------------
  // Un string es una secuencia de caracteres y tambien es iterable, asi
  // que for...of lo recorre letra a letra. Es comodisimo para contar
  // vocales, buscar caracteres o darle la vuelta a una palabra.
  // ============================================================

  // TODO (en clase):
  //   1. titulo('7. FOR...OF CON TEXTOS').   (palabra ya vale 'JavaScript')
  //   2. imprimir('Recorriendo la palabra "' + palabra + '" letra a letra:').
  //   3. let letrasMayusculas = 0;
  //   4. for (const letra of palabra) { ... } y dentro:
  //        if (letra === letra.toUpperCase()) { letrasMayusculas++;
  //          imprimir('  ' + letra + '  <- mayuscula'); }
  //        else { imprimir('  ' + letra); }
  //   5. imprimir('La palabra tiene ' + letrasMayusculas + ' mayusculas y ' +
  //               palabra.length + ' letras.');
  //   6. La misma palabra del reves, con for clasico hacia atras:
  //      imprimir('La misma palabra, del reves (for clasico hacia atras):')
  //      let alReves = '';
  //      for (let i = palabra.length - 1; i >= 0; i--) { alReves += palabra[i]; }
  //      imprimir('  ' + alReves);
  //   Resultado esperado en pantalla:
  //      J  <- mayuscula / a / v / a / S  <- mayuscula / c / r / i / p / t
  //      La palabra tiene 2 mayusculas y 10 letras.
  //      tpircSavaJ
  //   (aprox. 16 lineas)

  // ============================================================
  // 8. FOR...IN: RECORRER LAS PROPIEDADES DE UN OBJETO
  // ------------------------------------------------------------
  // Un objeto guarda pares "clave: valor". for...in recorre sus CLAVES
  // (los nombres de las propiedades), no los valores.
  //
  //   for (const clave in objeto)  ->  "para cada clave en objeto"
  //
  // Para obtener el valor usamos los corchetes: objeto[clave].
  // OJO: aqui hay que usar corchetes, no el punto. objeto.clave buscaria
  // una propiedad que se llame literalmente "clave".
  // ============================================================

  // TODO (en clase):
  //   1. titulo('8. FOR...IN CON OBJETOS').  (estudiante ya esta declarado arriba)
  //   2. imprimir('Ficha del estudiante, propiedad a propiedad:').
  //   3. for (const clave in estudiante) { imprimir('  ' + clave.padEnd(12) +
  //      ': ' + estudiante[clave]); }
  //      clave es un TEXTO con el nombre de la propiedad; estudiante[clave] su valor.
  //   4. Demuestra el error del punto:
  //      imprimir('estudiante.clave ->', estudiante.clave, '(undefined: hay que usar corchetes)');
  //   5. Alternativa moderna con Object.entries() y for...of:
  //      imprimir('Lo mismo con Object.entries() y for...of:') y
  //      for (const [clave, valor] of Object.entries(estudiante)) {
  //        imprimir('  ' + clave.padEnd(12) + ': ' + valor); }
  //   Resultado esperado en pantalla:
  //      nombre      : Marta Ruiz
  //      edad        : 21
  //      ciudad      : Valencia
  //      notaMedia   : 8.2
  //      matriculado : true
  //      (y despues las mismas cinco lineas otra vez, con Object.entries)
  //   (aprox. 10 lineas)

  // ⚠️ ERROR COMUN: escribir estudiante.clave dentro del bucle.
  // Eso busca una propiedad llamada literalmente "clave", que no existe,
  // y devuelve undefined en todas las vueltas.

  // ============================================================
  // 9. POR QUE NO SE USA FOR...IN CON ARRAYS
  // ------------------------------------------------------------
  // Tecnicamente funciona, porque un array tambien es un objeto y sus
  // indices son propiedades. Pero trae tres problemas serios:
  //
  //   1. Las claves llegan como TEXTO ("0", "1", "2"), no como numeros.
  //      Asi que "1" + 1 da "11" en vez de 2.
  //   2. Tambien recorre otras propiedades que alguien haya añadido al
  //      array, no solo los elementos.
  //   3. El orden no esta garantizado por la especificacion.
  //
  // ✅ BUENA PRACTICA: for...in para OBJETOS, for...of para ARRAYS.
  //    Regla mnemotecnica: "of para objetos" suena mal; "in para
  //    indices/propiedades, of para valores".
  // ============================================================

  // TODO (en clase):
  //   1. titulo('9. FOR...IN CON ARRAYS: NO LO HAGAS').  (notas = [7, 9, 5] ya existe)
  //   2. Añade una propiedad suelta al array para ver el problema 2:
  //        notas.profesor = 'Ana Gil';
  //      (es algo que no deberia hacerse, pero pasa en codigo real)
  //   3. imprimir('Recorriendo el array con for...in (mal):') y
  //      for (const indice in notas) { imprimir('  clave: ' + indice +
  //        ' (tipo ' + typeof indice + ')  valor: ' + notas[indice]); }
  //      Haz notar que typeof dice "string", no "number".
  //   4. imprimir('Aparecio "profesor", que NO es un elemento del array.').
  //   5. imprimir('Recorriendolo con for...of (bien):') y
  //      for (const nota of notas) { imprimir('  nota: ' + nota + ' (tipo ' + typeof nota + ')'); }
  //   6. imprimir('Solo aparecen los 3 valores reales, y son numeros de verdad.').
  //   Resultado esperado en pantalla:
  //      clave: 0 (tipo string)  valor: 7      ... hasta clave: 2
  //      clave: profesor (tipo string)  valor: Ana Gil
  //      nota: 7 (tipo number) / nota: 9 / nota: 5
  //   (aprox. 12 lineas)

  // ============================================================
  // 10. BREAK: ABANDONAR EL BUCLE
  // ------------------------------------------------------------
  // break corta el bucle EN SECO: no termina la vuelta actual ni hace
  // ninguna mas. Se usa cuando ya has encontrado lo que buscabas y
  // seguir buscando seria tiempo perdido.
  // ============================================================

  // TODO (en clase):
  //   1. titulo('10. BREAK').  (listaClase y buscado ya estan declarados arriba)
  //   2. let posicionEncontrada = -1;   // -1 es la convencion para "no encontrado"
  //   3. for (let i = 0; i < listaClase.length; i++) { ... } y dentro:
  //        imprimir('  Comprobando posicion ' + i + ': ' + listaClase[i]);
  //        if (listaClase[i] === buscado) { posicionEncontrada = i;
  //          imprimir('  Encontrado. Salimos del bucle con break.'); break; }
  //   4. imprimir('Resultado: "' + buscado + '" esta en la posicion ' + posicionEncontrada);
  //   5. imprimir('Sin break habriamos hecho 6 comprobaciones en lugar de 4.');
  //   Resultado esperado en pantalla:
  //      Comprobando posicion 0: Ana ... posicion 3: Diego
  //      Encontrado. Salimos del bucle con break.
  //      Resultado: "Diego" esta en la posicion 3
  //      (Elena y Fatima no llegan a comprobarse)
  //   (aprox. 12 lineas)

  // ============================================================
  // 11. CONTINUE: SALTAR ESTA VUELTA
  // ------------------------------------------------------------
  // continue no termina el bucle: solo abandona la vuelta ACTUAL y pasa
  // directamente a la siguiente. Sirve para filtrar casos que no
  // interesan sin anidar un if gigante.
  // ============================================================

  // TODO (en clase):
  //   1. titulo('11. CONTINUE').  (notasExamen ya esta declarado arriba)
  //   2. imprimir('Calculamos la media ignorando los -1 (no presentados):').
  //   3. let suma = 0;  let presentados = 0;
  //   4. for (const nota of notasExamen) { ... } y dentro:
  //        if (nota === -1) { imprimir('  Nota -1 -> no presentado, saltamos con continue');
  //          continue; }
  //        suma += nota;  presentados++;
  //        imprimir('  Sumada la nota ' + nota + ' (llevamos ' + presentados + ' presentados)');
  //   5. imprimir('Media de los presentados: ' + (suma / presentados).toFixed(2));
  //      toFixed(2) formatea con dos decimales y devuelve un TEXTO.
  //   Resultado esperado en pantalla: seis notas sumadas, dos saltadas, y
  //      Media de los presentados: 5.58
  //   (aprox. 14 lineas)

  // ⚠️ ERROR COMUN: usar continue dentro de un while y colocar la
  // actualizacion del contador DESPUES del continue. El contador no se
  // actualiza nunca en las vueltas saltadas -> bucle infinito.
  //   let i = 0;
  //   while (i < 10) {
  //     if (i === 3) continue;  // i se queda clavado en 3 para siempre
  //     i++;
  //   }
  // En un for esto no pasa, porque la actualizacion (i++) esta en la
  // cabecera y se ejecuta igualmente.

  // ============================================================
  // 12. BUCLES ANIDADOS
  // ------------------------------------------------------------
  // Un bucle dentro de otro. El bucle interno completa TODAS sus vueltas
  // por CADA vuelta del externo.
  //
  // Analogia: el externo son las paginas de un libro y el interno las
  // lineas de cada pagina. Lees todas las lineas antes de pasar de pagina.
  //
  // Cuidado con el coste: 10 x 10 son 100 vueltas; 1000 x 1000 ya es un
  // millon. Los bucles anidados multiplican el trabajo, no lo suman.
  // ============================================================

  // TODO (en clase):
  //   1. titulo('12. BUCLES ANIDADOS').
  //   2. Rejilla de coordenadas 3 x 4. Fijate en que se imprime una vez
  //      por FILA, no una vez por celda:
  //      imprimir('Rejilla de coordenadas 3 x 4:')
  //      for (let fila = 1; fila <= 3; fila++) {
  //        let lineaTexto = '  ';
  //        for (let columna = 1; columna <= 4; columna++) {
  //          lineaTexto += '(' + fila + ',' + columna + ') ';
  //        }
  //        imprimir(lineaTexto);
  //      }
  //   3. Medias del boletin (boletin ya esta declarado arriba):
  //      imprimir('Medias del boletin (bucle externo alumnos, interno notas):')
  //      for (const registro of boletin) { let total = 0;
  //        for (const nota of registro.notas) { total += nota; }
  //        const media = total / registro.notas.length;
  //        imprimir('  ' + registro.alumno.padEnd(8) + ' media: ' + media.toFixed(2)); }
  //   4. Demuestra que break solo rompe el bucle INTERNO:
  //      imprimir('Demostracion: break solo rompe el bucle interno.')
  //      for (let i = 1; i <= 3; i++) { for (let j = 1; j <= 5; j++) {
  //        if (j === 3) break; imprimir('  i=' + i + ' j=' + j); } }
  //      imprimir('El bucle externo dio sus 3 vueltas completas.');
  //   Resultado esperado en pantalla:
  //      (1,1) (1,2) (1,3) (1,4)  y dos filas mas
  //      Ana      media: 7.50 / Bruno    media: 5.75 / Carla    media: 9.25
  //      i=1 j=1 / i=1 j=2 / i=2 j=1 / i=2 j=2 / i=3 j=1 / i=3 j=2
  //   (aprox. 26 lineas)

  // ✅ BUENA PRACTICA: si el codigo crece, dales a los contadores nombres
  // con significado (fila, columna, alumno, examen) en lugar de i y j.

  // ============================================================
  // 13. BUCLES INFINITOS: COMO SE PRODUCEN Y COMO EVITARLOS
  // ------------------------------------------------------------
  // Un bucle infinito es aquel cuya condicion NUNCA llega a ser falsa.
  // La pestaña se congela, el ventilador se dispara y hay que forzar el
  // cierre. No es un error de sintaxis: el codigo es valido, simplemente
  // no termina jamas.
  //
  // LAS CUATRO CAUSAS MAS FRECUENTES:
  //
  //   1. Olvidar la actualizacion del contador.
  //        let i = 0;  while (i < 10) { imprimir(i); }   // i nunca cambia
  //
  //   2. Actualizar en la direccion equivocada.
  //        for (let i = 10; i > 0; i++)   // i sube, nunca sera <= 0
  //
  //   3. Una condicion que no puede cumplirse por decimales.
  //        let x = 0;  while (x !== 1) { x += 0.1; }
  //        Los decimales binarios no dan exactamente 1 (dan 0.9999...).
  //        ✅ Usa  x < 1  en lugar de  x !== 1.
  //
  //   4. Modificar dentro del bucle la variable que controla la condicion.
  //        Por ejemplo, añadir elementos a un array mientras lo recorres.
  //
  // COMO PROTEGERSE:
  //   - Antes de escribir el cuerpo, escribe la actualizacion.
  //   - Pregunta siempre: "que hace que esta condicion sea falsa algun dia".
  //   - En codigo dudoso, pon una GUARDA: un contador maximo de vueltas.
  //   - Si se te cuelga la pestaña: en Firefox aparece un aviso de "script
  //     no responde" que permite detenerlo. En Chrome y Edge no hay atajo
  //     fiable: cierra la PESTAÑA con Ctrl+W (Cmd+W en Mac) o usa el
  //     administrador de tareas del navegador (Shift+Esc en Chrome).
  //     Cerrar la pestaña NO cierra el navegador entero.
  // ============================================================

  // TODO (en clase) - PARTE A, los dos ejemplos que si terminan:
  //   1. titulo('13. BUCLES INFINITOS Y COMO EVITARLOS').
  //   2. imprimir('Ejemplo 1: bucle que SI termina, porque actualizamos bien.')
  //      let segundos = 3;  while (segundos > 0) { imprimir('  ' + segundos);
  //        segundos--; }   <- sin esta linea seria infinito
  //      imprimir('  Despegue.');
  //   3. imprimir('Ejemplo 2: el problema de los decimales.')
  //      let acumulado = 0;
  //      for (let i = 0; i < 10; i++) { acumulado += 0.1; }
  //      imprimir('  Sumar 0.1 diez veces da: ' + acumulado);
  //      imprimir('  acumulado === 1 ->', acumulado === 1, '(por eso nunca uses !== con decimales)');
  //   Resultado esperado en pantalla:
  //      3 / 2 / 1 / Despegue.
  //      Sumar 0.1 diez veces da: 0.9999999999999999
  //      acumulado === 1 -> false (por eso nunca uses !== con decimales)
  //   (aprox. 12 lineas)

  // TODO (en clase) - PARTE B, el patron de "guarda de seguridad":
  //   4. Escribe la funcion ejecutarConGuarda() con su comentario JSDoc.
  //      Busca un numero al azar muy improbable, pero con un tope de vueltas:
  //        const MAXIMO_VUELTAS = 1000;   // constante en MAYUSCULAS: es un limite fijo
  //        let vueltas = 0;  let encontrado = false;  let valor = 0;
  //        while (!encontrado) {
  //          vueltas++;
  //          valor = Math.floor(Math.random() * 500) + 1;   // 1 a 500
  //          if (valor === 7) { encontrado = true; }
  //          if (vueltas >= MAXIMO_VUELTAS) {               // LA GUARDA
  //            imprimir('  GUARDA ACTIVADA: ' + MAXIMO_VUELTAS + ' vueltas sin exito. Salimos.');
  //            break;
  //          }
  //        }
  //        if (encontrado) { imprimir('  Se encontro el 7 en la vuelta numero ' + vueltas + '.'); }
  //        imprimir('  El navegador sigue respondiendo: la guarda hizo su trabajo.');
  //   5. Conecta la funcion al boton de la pagina:
  //        const botonGuarda = document.getElementById('btn-bucle-guardado');
  //        if (botonGuarda) { botonGuarda.addEventListener('click', function () {
  //          imprimir('\n--- Ejecutando bucle con guarda de seguridad ---');
  //          ejecutarConGuarda(); }); }
  //   6. imprimir('Pulsa el boton "Ejecutar bucle con guarda de seguridad" para verlo.');
  //   Resultado esperado: al pulsar el boton de la seccion 03 de la pagina
  //   aparece "Se encontro el 7 en la vuelta numero N" (N cambia cada vez)
  //   y la pestaña nunca se cuelga.
  //   (aprox. 30 lineas)

  // ============================================================
  // 14. BOTON DE LIMPIAR CONSOLA
  // ============================================================

  // TODO (en clase):
  //   1. const botonLimpiar = document.getElementById('btn-limpiar-bucles');
  //   2. if (botonLimpiar && salida) { ... }
  //   3. Dentro, botonLimpiar.addEventListener('click', function () { ... })
  //      y en el cuerpo asigna
  //      salida.textContent = 'Consola limpiada. Recarga la pagina (F5) para volver a ejecutar.\n';
  //   Resultado esperado: al pulsar "Limpiar consola" de la seccion 03 de
  //   la pagina, el bloque negro se vacia y muestra esa unica frase.
  //   (aprox. 7 lineas)

  /**
   * ============================================================
   * EJERCICIOS PROPUESTOS - 03 BUCLES
   * ============================================================
   *
   * 1) CUENTA ATRAS PERSONALIZADA (facil)
   *    Escribe un bucle for que cuente desde 20 hasta 0 de tres en tres.
   *    Despues escribe el mismo bucle con while y comprueba que la salida
   *    es identica.
   *
   * 2) INVENTARIO DE LA TIENDA (facil)
   *    Dado el array
   *      const productos = ['teclado', 'raton', 'monitor', 'webcam'];
   *    recorrelo con for...of e imprime cada producto en mayusculas y con
   *    su numero de orden empezando en 1 (pista: usa .entries()).
   *
   * 3) FICHA DE PRODUCTO (intermedio)
   *    Crea un objeto producto con al menos cinco propiedades (nombre,
   *    precio, stock, categoria, enOferta). Recorrelo con for...in e
   *    imprime "clave: valor". Añade una condicion: si el valor es un
   *    numero, marca la linea con el texto "[numerico]".
   *
   * 4) BUSCADOR CON BREAK (intermedio)
   *    Dado un array de al menos diez nombres, busca uno concreto con un
   *    for y break. Cuenta cuantas comprobaciones hiciste y muestralas.
   *    Despues repite la busqueda SIN break y compara el numero de
   *    comprobaciones.
   *
   * 5) FILTRO DE CARRITO CON CONTINUE (intermedio)
   *    Dado un array de objetos {nombre, precio, disponible}, recorrelo y
   *    suma solo el precio de los productos disponibles, saltando el resto
   *    con continue. Imprime el total y cuantos productos se descartaron.
   *
   * 6) DAMERO DE AJEDREZ (avanzado)
   *    Con dos bucles anidados, dibuja en la consola visual un tablero
   *    8 x 8 usando el caracter # para las casillas negras y un espacio
   *    para las blancas. Pista: una casilla es negra cuando la suma de su
   *    fila y su columna es par.
   *
   * 7) DETECTIVE DE BUCLES INFINITOS (avanzado)
   *    Escribe (comentado, sin ejecutarlo) un bucle infinito por cada una
   *    de las cuatro causas de la seccion 13. Debajo de cada uno, escribe
   *    su version corregida y explica en un comentario que cambiaste.
   * ============================================================
   */
})();
