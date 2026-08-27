/**
 * ============================================================
 * ARCHIVO: js/03-bucles.js
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
 * Como en los archivos anteriores, todo va dentro de una IIFE para que
 * las variables y funciones de este archivo no choquen con las de los otros.
 */

(function () {
  'use strict';

  // ============================================================
  // 0. HERRAMIENTAS DE SALIDA
  // ============================================================

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

  titulo('1. EL FOR CLASICO Y SUS TRES PARTES');

  // let i = 0     -> creamos el contador. Por convencion se llama i (index).
  // i < 5         -> mientras i sea menor que 5, seguimos.
  // i++           -> al final de cada vuelta, i aumenta en 1.
  for (let i = 0; i < 5; i++) {
    imprimir('Vuelta numero ' + i);
  }
  imprimir('El bucle termino cuando i llego a 5 (5 < 5 es false).');

  // ⚠️ ERROR COMUN: empezar en 0 y usar <= con el total.
  //   for (let i = 0; i <= 5; i++)  da SEIS vueltas (0,1,2,3,4,5), no cinco.
  // Regla practica: si empiezas en 0, usa <  ; si empiezas en 1, usa <= .

  // Demostracion de la regla, contando alumnos del 1 al 5:
  for (let i = 1; i <= 5; i++) {
    imprimir('Alumno numero ' + i + ' pasa lista');
  }

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

  titulo('2. VARIANTES DEL FOR');

  // 2.1 Cuenta atras: empezamos alto y RESTAMOS con i--
  imprimir('Cuenta atras para el examen:');
  for (let i = 5; i > 0; i--) {
    // Reutilizamos el ternario del archivo 01 para que el singular no chirrie:
    // "Queda 1 minuto" en vez de "Quedan 1 minutos".
    imprimir('  ' + (i === 1 ? 'Queda 1 minuto' : 'Quedan ' + i + ' minutos'));
  }
  imprimir('  Se acabo el tiempo.');

  // 2.2 De dos en dos: la actualizacion puede ser cualquier operacion.
  // i += 2 es lo mismo que escribir i = i + 2.
  imprimir('Numeros pares del 0 al 10:');
  for (let i = 0; i <= 10; i += 2) {
    imprimir('  ' + i);
  }

  // 2.3 Multiplicando: la actualizacion no tiene por que ser una suma.
  imprimir('Potencias de 2 hasta 64:');
  for (let i = 1; i <= 64; i *= 2) {
    imprimir('  ' + i);
  }

  // 2.4 Dos contadores a la vez, separados por comas.
  // Uno sube y el otro baja: util para comparar extremos de una lista.
  imprimir('Dos contadores simultaneos (uno sube, otro baja):');
  for (let inicio = 0, fin = 5; inicio < fin; inicio++, fin--) {
    imprimir('  inicio=' + inicio + '  fin=' + fin);
  }

  // ============================================================
  // 3. RECORRER UN ARRAY CON FOR CLASICO
  // ------------------------------------------------------------
  // Un array es una lista ordenada. Sus posiciones se llaman indices y
  // EMPIEZAN EN 0: el primer elemento es lista[0], no lista[1].
  //
  // La propiedad .length dice cuantos elementos hay. Por tanto el ultimo
  // indice valido es siempre length - 1.
  // ============================================================

  titulo('3. RECORRER UN ARRAY CON FOR CLASICO');

  const asignaturas = ['HTML', 'CSS', 'JavaScript', 'Git', 'Accesibilidad'];

  imprimir('El array tiene', asignaturas.length, 'elementos.');

  for (let i = 0; i < asignaturas.length; i++) {
    // Accedemos al elemento con los corchetes y el indice.
    imprimir('  Indice ' + i + ' -> ' + asignaturas[i]);
  }

  // ⚠️ ERROR COMUN: pasarse del final del array escribiendo  i <= length.
  // El indice 5 no existe en un array de 5 elementos: devuelve undefined.
  imprimir('asignaturas[5] ->', asignaturas[5], '(undefined: ese indice no existe)');

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

  titulo('4. EL BUCLE WHILE');

  // Ejemplo real: repartir 17 libros en cajas de 5, sin saber cuantas
  // cajas haran falta hasta que lo calculamos.
  let librosPendientes = 17;
  let cajasUsadas = 0;

  while (librosPendientes > 0) {
    // Math.min devuelve el menor de dos numeros: en la ultima caja
    // metemos solo lo que queda, no cinco.
    const librosEnEstaCaja = Math.min(5, librosPendientes);
    cajasUsadas++; // Equivale a cajasUsadas = cajasUsadas + 1
    librosPendientes -= librosEnEstaCaja; // Actualizacion: acerca la condicion a false
    imprimir('  Caja ' + cajasUsadas + ': ' + librosEnEstaCaja + ' libros. Quedan ' + librosPendientes);
  }

  imprimir('Total de cajas necesarias:', cajasUsadas);

  // Segundo ejemplo: dividir entre 2 hasta llegar a 1.
  let numero = 100;
  let divisiones = 0;

  while (numero > 1) {
    numero = Math.floor(numero / 2); // Math.floor redondea hacia abajo
    divisiones++;
    imprimir('  Division ' + divisiones + ' -> ' + numero);
  }

  // El mismo for de la seccion 1, escrito como while, para ver que son
  // equivalentes. Un for es un while con las tres partes recogidas arriba.
  imprimir('El for de la seccion 1, escrito como while:');
  let contador = 0; // 1. inicializacion
  while (contador < 5) {
    // 2. condicion
    imprimir('  Vuelta numero ' + contador); // cuerpo
    contador++; // 3. actualizacion
  }

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

  titulo('5. EL BUCLE DO...WHILE');

  // Diferencia clave, demostrada con una condicion falsa de entrada:
  let intentos = 10;

  imprimir('Con while y condicion falsa (intentos < 3, intentos vale 10):');
  while (intentos < 3) {
    imprimir('  Esta linea NUNCA se ve');
  }
  imprimir('  (efectivamente, no se imprimio nada)');

  imprimir('Con do...while y la MISMA condicion falsa:');
  do {
    imprimir('  Esta linea SI se ve, una vez, antes de comprobar nada');
  } while (intentos < 3);

  // Ejemplo realista: simulamos tiradas de dado hasta sacar un 6.
  // Hay que tirar al menos una vez, asi que do...while encaja perfecto.
  let tirada;
  let numeroDeTiradas = 0;

  do {
    // Math.random() da un decimal entre 0 (incluido) y 1 (excluido).
    // Lo multiplicamos por 6, redondeamos hacia abajo y sumamos 1 -> 1 a 6.
    tirada = Math.floor(Math.random() * 6) + 1;
    numeroDeTiradas++;
    imprimir('  Tirada ' + numeroDeTiradas + ': salio un ' + tirada);

    // Guarda de seguridad: aunque la probabilidad de no sacar un 6 en 50
    // tiradas es ridicula, nunca dejamos un bucle sin tope.
    if (numeroDeTiradas >= 50) {
      imprimir('  Cortamos por seguridad tras 50 tiradas.');
      break;
    }
  } while (tirada !== 6);

  imprimir('Se necesitaron ' + numeroDeTiradas + ' tiradas para sacar un 6.');

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

  titulo('6. FOR...OF CON ARRAYS');

  // ✅ BUENA PRACTICA: declara la variable del bucle con const. En cada
  // vuelta se crea una variable nueva, asi que const no da problemas y
  // ademas te protege de reasignarla por accidente.
  for (const asignatura of asignaturas) {
    imprimir('  Cursando: ' + asignatura);
  }

  // Comparacion directa: lo mismo con for clasico. Mas ruido, mas sitios
  // donde equivocarse (el 0, el <, el length, los corchetes).
  imprimir('El mismo recorrido con for clasico:');
  for (let i = 0; i < asignaturas.length; i++) {
    imprimir('  Cursando: ' + asignaturas[i]);
  }

  // Si SI necesitas el indice, .entries() te da los dos a la vez.
  // La sintaxis [indice, valor] se llama "desestructuracion de array":
  // reparte los dos elementos del par en dos variables de golpe.
  imprimir('Con indice, usando .entries():');
  for (const [indice, asignatura] of asignaturas.entries()) {
    imprimir('  ' + indice + ': ' + asignatura);
  }

  // ============================================================
  // 7. FOR...OF CON TEXTOS (STRINGS)
  // ------------------------------------------------------------
  // Un string es una secuencia de caracteres y tambien es iterable, asi
  // que for...of lo recorre letra a letra. Es comodisimo para contar
  // vocales, buscar caracteres o darle la vuelta a una palabra.
  // ============================================================

  titulo('7. FOR...OF CON TEXTOS');

  const palabra = 'JavaScript';

  imprimir('Recorriendo la palabra "' + palabra + '" letra a letra:');

  let letrasMayusculas = 0;

  for (const letra of palabra) {
    // Comparamos la letra con su version en mayuscula: si son iguales y
    // ademas es una letra, es que ya venia en mayuscula.
    if (letra === letra.toUpperCase()) {
      letrasMayusculas++;
      imprimir('  ' + letra + '  <- mayuscula');
    } else {
      imprimir('  ' + letra);
    }
  }

  imprimir('La palabra tiene ' + letrasMayusculas + ' mayusculas y ' + palabra.length + ' letras.');

  // Los strings tambien se pueden recorrer con for clasico y charAt / [i].
  // Se usa cuando necesitas el indice o ir hacia atras.
  imprimir('La misma palabra, del reves (for clasico hacia atras):');
  let alReves = '';
  for (let i = palabra.length - 1; i >= 0; i--) {
    alReves += palabra[i]; // Vamos concatenando cada letra al final
  }
  imprimir('  ' + alReves);

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

  titulo('8. FOR...IN CON OBJETOS');

  const estudiante = {
    nombre: 'Marta Ruiz',
    edad: 21,
    ciudad: 'Valencia',
    notaMedia: 8.2,
    matriculado: true,
  };

  imprimir('Ficha del estudiante, propiedad a propiedad:');

  for (const clave in estudiante) {
    // clave es un TEXTO con el nombre de la propiedad.
    // estudiante[clave] es su valor.
    imprimir('  ' + clave.padEnd(12) + ': ' + estudiante[clave]);
  }

  // ⚠️ ERROR COMUN: escribir estudiante.clave dentro del bucle.
  // Eso busca una propiedad llamada literalmente "clave", que no existe,
  // y devuelve undefined en todas las vueltas.
  imprimir('estudiante.clave ->', estudiante.clave, '(undefined: hay que usar corchetes)');

  // Alternativa moderna, cada vez mas habitual: Object.entries() convierte
  // el objeto en un array de pares [clave, valor] y lo recorremos con for...of.
  imprimir('Lo mismo con Object.entries() y for...of:');
  for (const [clave, valor] of Object.entries(estudiante)) {
    imprimir('  ' + clave.padEnd(12) + ': ' + valor);
  }

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

  titulo('9. FOR...IN CON ARRAYS: NO LO HAGAS');

  const notas = [7, 9, 5];

  // Añadimos una propiedad suelta al array para ver el problema 2.
  // (Es algo que no deberia hacerse, pero pasa en codigo real.)
  notas.profesor = 'Ana Gil';

  imprimir('Recorriendo el array con for...in (mal):');
  for (const indice in notas) {
    // typeof nos dice el tipo del dato. Fijate en que sale "string".
    imprimir('  clave: ' + indice + ' (tipo ' + typeof indice + ')  valor: ' + notas[indice]);
  }
  imprimir('Aparecio "profesor", que NO es un elemento del array.');

  imprimir('Recorriendolo con for...of (bien):');
  for (const nota of notas) {
    imprimir('  nota: ' + nota + ' (tipo ' + typeof nota + ')');
  }
  imprimir('Solo aparecen los 3 valores reales, y son numeros de verdad.');

  // ============================================================
  // 10. BREAK: ABANDONAR EL BUCLE
  // ------------------------------------------------------------
  // break corta el bucle EN SECO: no termina la vuelta actual ni hace
  // ninguna mas. Se usa cuando ya has encontrado lo que buscabas y
  // seguir buscando seria tiempo perdido.
  // ============================================================

  titulo('10. BREAK');

  const listaClase = ['Ana', 'Bruno', 'Carla', 'Diego', 'Elena', 'Fatima'];
  const buscado = 'Diego';

  let posicionEncontrada = -1; // -1 es la convencion para "no encontrado"

  for (let i = 0; i < listaClase.length; i++) {
    imprimir('  Comprobando posicion ' + i + ': ' + listaClase[i]);

    if (listaClase[i] === buscado) {
      posicionEncontrada = i;
      imprimir('  Encontrado. Salimos del bucle con break.');
      break; // Elena y Fatima ni se comprueban
    }
  }

  imprimir('Resultado: "' + buscado + '" esta en la posicion ' + posicionEncontrada);
  imprimir('Sin break habriamos hecho 6 comprobaciones en lugar de 4.');

  // ============================================================
  // 11. CONTINUE: SALTAR ESTA VUELTA
  // ------------------------------------------------------------
  // continue no termina el bucle: solo abandona la vuelta ACTUAL y pasa
  // directamente a la siguiente. Sirve para filtrar casos que no
  // interesan sin anidar un if gigante.
  // ============================================================

  titulo('11. CONTINUE');

  const notasExamen = [8, -1, 5, 0, 10, -1, 6.5, 4];

  imprimir('Calculamos la media ignorando los -1 (no presentados):');

  let suma = 0;
  let presentados = 0;

  for (const nota of notasExamen) {
    if (nota === -1) {
      imprimir('  Nota -1 -> no presentado, saltamos con continue');
      continue; // Nos saltamos el resto del cuerpo y vamos a la siguiente
    }

    suma += nota;
    presentados++;
    imprimir('  Sumada la nota ' + nota + ' (llevamos ' + presentados + ' presentados)');
  }

  // toFixed(2) formatea el numero con dos decimales y devuelve un texto.
  imprimir('Media de los presentados: ' + (suma / presentados).toFixed(2));

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

  titulo('12. BUCLES ANIDADOS');

  // Por convencion el contador externo es i y el interno j.
  // ✅ BUENA PRACTICA: si el codigo crece, dales nombres con significado
  // (fila, columna, alumno, examen) en lugar de i y j.
  imprimir('Rejilla de coordenadas 3 x 4:');

  for (let fila = 1; fila <= 3; fila++) {
    let lineaTexto = '  ';

    for (let columna = 1; columna <= 4; columna++) {
      lineaTexto += '(' + fila + ',' + columna + ') ';
    }

    // Imprimimos una vez por fila, no una vez por celda.
    imprimir(lineaTexto);
  }

  // Ejemplo con datos reales: notas de tres alumnos en dos examenes.
  const boletin = [
    { alumno: 'Ana', notas: [7, 8] },
    { alumno: 'Bruno', notas: [5, 6.5] },
    { alumno: 'Carla', notas: [9, 9.5] },
  ];

  imprimir('Medias del boletin (bucle externo alumnos, interno notas):');

  for (const registro of boletin) {
    let total = 0;

    for (const nota of registro.notas) {
      total += nota;
    }

    const media = total / registro.notas.length;
    imprimir('  ' + registro.alumno.padEnd(8) + ' media: ' + media.toFixed(2));
  }

  // break dentro de un bucle anidado solo rompe el bucle INTERNO.
  imprimir('Demostracion: break solo rompe el bucle interno.');
  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 5; j++) {
      if (j === 3) break; // Corta el bucle de j, no el de i
      imprimir('  i=' + i + ' j=' + j);
    }
  }
  imprimir('El bucle externo dio sus 3 vueltas completas.');

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

  titulo('13. BUCLES INFINITOS Y COMO EVITARLOS');

  imprimir('Ejemplo 1: bucle que SI termina, porque actualizamos bien.');
  let segundos = 3;
  while (segundos > 0) {
    imprimir('  ' + segundos);
    segundos--; // Sin esta linea, seria infinito
  }
  imprimir('  Despegue.');

  imprimir('Ejemplo 2: el problema de los decimales.');
  let acumulado = 0;
  for (let i = 0; i < 10; i++) {
    acumulado += 0.1;
  }
  imprimir('  Sumar 0.1 diez veces da: ' + acumulado);
  imprimir('  acumulado === 1 ->', acumulado === 1, '(por eso nunca uses !== con decimales)');

  /**
   * ejecutarConGuarda(): demuestra el patron de "guarda de seguridad".
   * El bucle busca un numero al azar que cumpla una condicion muy
   * improbable; sin la guarda podria tardar muchisimo. El contador
   * MAXIMO_VUELTAS garantiza que el navegador nunca se quede colgado.
   */
  function ejecutarConGuarda() {
    const MAXIMO_VUELTAS = 1000; // Constante en MAYUSCULAS: es un limite fijo
    let vueltas = 0;
    let encontrado = false;
    let valor = 0;

    while (!encontrado) {
      vueltas++;
      valor = Math.floor(Math.random() * 500) + 1; // Numero de 1 a 500

      if (valor === 7) {
        encontrado = true;
      }

      // LA GUARDA: si nos pasamos del limite, salimos si o si.
      if (vueltas >= MAXIMO_VUELTAS) {
        imprimir('  GUARDA ACTIVADA: ' + MAXIMO_VUELTAS + ' vueltas sin exito. Salimos.');
        break;
      }
    }

    if (encontrado) {
      imprimir('  Se encontro el 7 en la vuelta numero ' + vueltas + '.');
    }

    imprimir('  El navegador sigue respondiendo: la guarda hizo su trabajo.');
  }

  // Conectamos la demostracion a un boton, para que se ejecute solo
  // cuando el docente lo decida.
  const botonGuarda = document.getElementById('btn-bucle-guardado');

  if (botonGuarda) {
    botonGuarda.addEventListener('click', function () {
      imprimir('\n--- Ejecutando bucle con guarda de seguridad ---');
      ejecutarConGuarda();
    });
  }

  imprimir('Pulsa el boton "Ejecutar bucle con guarda de seguridad" para verlo.');

  // ============================================================
  // 14. BOTON DE LIMPIAR CONSOLA
  // ============================================================

  const botonLimpiar = document.getElementById('btn-limpiar-bucles');

  if (botonLimpiar && salida) {
    botonLimpiar.addEventListener('click', function () {
      salida.textContent = 'Consola limpiada. Recarga la pagina (F5) para volver a ejecutar.\n';
    });
  }

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
