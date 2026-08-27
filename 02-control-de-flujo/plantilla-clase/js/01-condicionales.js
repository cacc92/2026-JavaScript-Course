/**
 * ============================================================
 * ARCHIVO: js/01-condicionales.js   ·   PLANTILLA DE CLASE
 * PROYECTO: 02 - Control de flujo
 * TEMA: Condicionales (if, else if, else), truthy/falsy y ternario
 * ============================================================
 *
 * QUE VAS A APRENDER EN ESTE ARCHIVO:
 *  - Como se escribe un if y que es exactamente una "condicion".
 *  - La diferencia entre if, if/else y la cadena if/else if/else.
 *  - Como se anidan condicionales y cuando conviene NO anidarlos.
 *  - Que valores considera JavaScript verdaderos (truthy) y falsos (falsy).
 *  - El operador ternario como alternativa corta al if/else.
 *  - Por que los ternarios anidados son una mala idea.
 *  - Los operadores logicos && y || y su "cortocircuito".
 *
 * COMO SE USA ESTA PLANTILLA:
 * El archivo esta vacio de codigo a proposito. Cada seccion conserva su
 * explicacion y trae un bloque "TODO (en clase)" con las instrucciones
 * exactas de lo que hay que escribir. La version resuelta esta en
 * ../../js/01-condicionales.js (carpeta padre del proyecto).
 * Al abrir la pagina sin escribir nada NO debe haber ningun error en la
 * consola: solo se veran las consolas visuales vacias.
 *
 * NOTA SOBRE LA IIFE:
 * Todo el archivo esta envuelto en una IIFE
 * (Immediately Invoked Function Expression: funcion que se declara y se
 * ejecuta al instante). Se escribe asi:  (function () { ... })();
 *
 * POR QUE LO HACEMOS: el index.html carga cuatro archivos JS y los cuatro
 * definen una funcion llamada "imprimir". Si estuvieran sueltos en el ambito
 * global, el navegador lanzaria el error
 *   "SyntaxError: Identifier 'imprimir' has already been declared".
 * Al meter cada archivo dentro de su propia funcion, sus variables viven
 * encerradas ahi dentro y no se pisan entre archivos.
 * La IIFE viene YA ESCRITA en la plantilla: todo lo que escribas en clase
 * va dentro de ella.
 */

(function () {
  // 'use strict' activa el modo estricto: JavaScript avisa de errores que
  // normalmente perdona en silencio (por ejemplo, usar una variable sin declarar).
  // BUENA PRACTICA: ponerlo siempre al principio de cada IIFE.
  'use strict';

  // ============================================================
  // 0. HERRAMIENTAS DE SALIDA (la "consola visual")
  // ============================================================
  // ESTA SECCION VIENE YA HECHA. Es andamiaje, no materia: sin ella no se
  // puede demostrar nada en pantalla desde el primer minuto.

  // Guardamos una referencia al <pre> del HTML donde escribiremos.
  // getElementById busca en el documento el elemento con ese id exacto.
  const salida = document.getElementById('salida-condicionales');

  /**
   * imprimir(): muestra un mensaje TANTO en la consola del navegador (F12)
   * COMO en el bloque visual de la pagina, para que se vea en clase sin
   * abrir DevTools.
   *
   * Los tres puntos (...mensajes) se llaman "parametros rest": recogen
   * todos los argumentos que reciba la funcion dentro de un array.
   * Asi podemos llamar imprimir('a'), imprimir('a', 'b') o imprimir('a', 1, true).
   */
  function imprimir(...mensajes) {
    console.log(...mensajes); // Salida clasica de DevTools

    if (!salida) return; // Si la pagina no tiene consola visual, no hacemos nada

    // Convertimos cada mensaje a texto. Los objetos y arrays se ven mucho
    // mejor con JSON.stringify (el 2 final es la sangria de dos espacios).
    const texto = mensajes
      .map((m) => (typeof m === 'object' && m !== null ? JSON.stringify(m, null, 2) : String(m)))
      .join(' ');

    // += añade al final del texto existente, sin borrar lo anterior.
    // El \n es un salto de linea.
    salida.textContent += texto + '\n';
  }

  /**
   * titulo(): imprime un separador visual antes de cada seccion.
   * Sirve para que la consola no sea un muro de texto sin estructura.
   */
  function titulo(texto) {
    imprimir('\n============================================================');
    imprimir('  ' + texto);
    imprimir('============================================================');
  }

  // ------------------------------------------------------------
  // DATOS DE PARTIDA DEL ARCHIVO (vienen ya escritos)
  // Son los tres datos con los que trabajaremos en casi todas las
  // secciones. Teclearlos en clase seria tiempo perdido.
  // ------------------------------------------------------------
  const nombreEstudiante = 'Lucia';
  const notaFinal = 8.5;
  const asistencia = 92; // Porcentaje de asistencia a clase

  // ============================================================
  // 1. EL IF MAS SIMPLE
  // ------------------------------------------------------------
  // Un if es una pregunta de si o no. Entre parentesis ponemos una
  // "condicion": cualquier expresion que JavaScript pueda evaluar como
  // verdadera o falsa. Si es verdadera, se ejecuta el bloque entre llaves.
  // Si es falsa, ese bloque se salta por completo.
  //
  // Analogia: "SI llueve, coge el paraguas". Si no llueve, simplemente no
  // haces nada especial y sigues con tu vida.
  // ============================================================

  // TODO (en clase):
  //   1. Llama a titulo('1. EL IF MAS SIMPLE') para abrir la seccion.
  //   2. Imprime la ficha del alumno con una sola llamada:
  //      imprimir('Estudiante:', nombreEstudiante, '| Nota:', notaFinal,
  //               '| Asistencia:', asistencia + '%')
  //   3. Escribe un if (notaFinal >= 5) que imprima
  //      'El estudiante ha aprobado la asignatura.'
  //   4. Escribe un segundo if (notaFinal === 10) que imprima 'Matricula de honor'
  //      y comenta en voz alta por que esa linea NO se vera (8.5 no es 10).
  //   Resultado esperado en pantalla:
  //      Estudiante: Lucia | Nota: 8.5 | Asistencia: 92%
  //      El estudiante ha aprobado la asignatura.
  //   (aprox. 8 lineas)

  // ⚠️ ERROR COMUN: poner punto y coma justo despues del parentesis.
  //   if (notaFinal >= 5); { imprimir('...'); }
  // Ese punto y coma cierra el if con un cuerpo vacio, y el bloque de llaves
  // se ejecuta SIEMPRE, haya aprobado o no. Es un error dificil de ver.

  // ✅ BUENA PRACTICA: usa SIEMPRE llaves, incluso para una sola linea.
  // Sin llaves funciona, pero el dia que añadas una segunda linea se romperá
  // la logica sin que el editor te avise.

  // ============================================================
  // 2. IF / ELSE: EL CAMINO ALTERNATIVO
  // ------------------------------------------------------------
  // else significa "si no". Es el plan B: se ejecuta cuando la condicion
  // del if resulta falsa. Nunca se ejecutan los dos bloques; siempre uno
  // y solo uno.
  // ============================================================

  // TODO (en clase):
  //   1. titulo('2. IF / ELSE').
  //   2. Escribe un if/else sobre notaFinal >= 5 que imprima
  //      'APROBADO con un ' + notaFinal   o bien   'SUSPENSO con un ' + notaFinal.
  //   3. Declara const entregasPendientes = 3.
  //   4. Escribe un segundo if/else sobre entregasPendientes === 0:
  //      si es 0 -> 'No quedan entregas pendientes. Buen trabajo.'
  //      si no   -> 'Quedan ' + entregasPendientes + ' entregas por subir al aula virtual.'
  //      Sirve para recorrer la rama del else, que en el ejemplo anterior no se ve.
  //   Resultado esperado en pantalla:
  //      APROBADO con un 8.5
  //      Quedan 3 entregas por subir al aula virtual.
  //   (aprox. 12 lineas)

  // ⚠️ ERROR COMUN: escribir "else if" cuando en realidad querias "else".
  // Un else NUNCA lleva condicion: else (algo) { } es un error de sintaxis.

  // ============================================================
  // 3. CADENA IF / ELSE IF / ELSE
  // ------------------------------------------------------------
  // Cuando hay mas de dos caminos posibles encadenamos condiciones.
  // JavaScript las evalua DE ARRIBA ABAJO y se queda con la PRIMERA que
  // sea verdadera; el resto ni siquiera las mira. El else final es la
  // red de seguridad: se ejecuta si ninguna anterior se cumplio.
  //
  // Analogia: es un portero de discoteca que revisa la lista por orden.
  // En cuanto encuentra tu nombre, deja de leer.
  // ============================================================

  // ✅ BUENA PRACTICA: ordenar de la condicion MAS restrictiva a la MAS amplia.

  // TODO (en clase):
  //   1. titulo('3. CADENA IF / ELSE IF / ELSE').
  //   2. Escribe la cadena completa sobre notaFinal, EN ESTE ORDEN:
  //        >= 9 -> imprimir('Calificacion: EXCELENTE')
  //        >= 7 -> imprimir('Calificacion: BUENO')
  //        >= 5 -> imprimir('Calificacion: SUFICIENTE')
  //        else -> imprimir('Calificacion: INSUFICIENTE')
  //      Haz notar que NO hace falta escribir notaFinal >= 7 && notaFinal < 9:
  //      si hemos llegado al segundo else if es porque el primero fallo.
  //   3. Declara const notaDePrueba = 10 y escribe la cadena AL REVES
  //      (primero >= 5, despues >= 9) para demostrar el error de orden:
  //        rama 1 -> imprimir('Orden incorrecto -> un ' + notaDePrueba + ' se clasifica como SUFICIENTE')
  //        rama 2 -> imprimir('Esta linea es inalcanzable')
  //   Resultado esperado en pantalla:
  //      Calificacion: BUENO
  //      Orden incorrecto -> un 10 se clasifica como SUFICIENTE
  //   (aprox. 16 lineas)

  // ⚠️ ERROR COMUN: escribir la cadena al reves.
  //   if (nota >= 5) { 'SUFICIENTE' }
  //   else if (nota >= 9) { 'EXCELENTE' }   <-- inalcanzable
  // Un 10 cumple ya la primera condicion, asi que nunca se llega a EXCELENTE.

  // ============================================================
  // 4. CONDICIONALES ANIDADOS
  // ------------------------------------------------------------
  // Anidar es meter un if dentro de otro if. Se usa cuando la segunda
  // pregunta solo tiene sentido si la primera se cumplio.
  //
  // Ejemplo real: solo tiene sentido preguntar por la asistencia si el
  // estudiante ya ha aprobado el examen.
  // ============================================================

  // TODO (en clase):
  //   1. titulo('4. CONDICIONALES ANIDADOS').
  //   2. Escribe un if (notaFinal >= 5) que:
  //        - imprima 'Ha superado el examen. Revisando asistencia...'
  //        - dentro, un if (asistencia >= 80) que imprima
  //          '  -> Asistencia suficiente. Acta cerrada como APTO.'
  //        - dentro de ese, un TERCER nivel if (notaFinal >= 9 && asistencia >= 90)
  //          que imprima '  -> Ademas es candidato a MATRICULA DE HONOR.'
  //        - el else del segundo nivel imprime
  //          '  -> Asistencia insuficiente. Debe presentar trabajo compensatorio.'
  //      Y su else exterior imprime
  //          'No supera el examen. La asistencia no se valora en este caso.'
  //   3. Escribe la version PLANA con && :
  //      if (notaFinal >= 9 && asistencia >= 90) -> imprimir('Version plana (sin anidar): candidato a MATRICULA DE HONOR.')
  //   4. Declara la funcion describirMatricula(nota, porcentajeAsistencia) con
  //      salidas tempranas, en este orden exacto:
  //        nota < 5                              -> return 'No apto: nota insuficiente'
  //        porcentajeAsistencia < 80             -> return 'No apto: asistencia insuficiente'
  //        nota >= 9 && porcentajeAsistencia >= 90 -> return 'Apto con matricula de honor'
  //        y al final                            -> return 'Apto'
  //   5. Pruebala cuatro veces con imprimir('describirMatricula(8.5, 92) ->', describirMatricula(8.5, 92))
  //      y lo mismo con (9.5, 95), (4, 100) y (7, 50).
  //   Resultado esperado en pantalla:
  //      Ha superado el examen. Revisando asistencia...
  //        -> Asistencia suficiente. Acta cerrada como APTO.
  //      describirMatricula(8.5, 92) -> Apto
  //      describirMatricula(9.5, 95) -> Apto con matricula de honor
  //      describirMatricula(4, 100)  -> No apto: nota insuficiente
  //      describirMatricula(7, 50)   -> No apto: asistencia insuficiente
  //   (aprox. 30 lineas)

  // ⚠️ ERROR COMUN: anidar cuatro o cinco niveles. A eso se le llama
  // "codigo flecha" (arrow code) porque la sangria dibuja una flecha hacia
  // la derecha. Es dificil de leer y de depurar.

  // ✅ BUENA PRACTICA: cuando puedas, sustituye la anidacion por una
  // condicion combinada con && (Y logico), que se lee de un vistazo.

  // ✅ BUENA PRACTICA: "salida temprana" (early return / guard clause).
  // Dentro de una funcion, en lugar de anidar, sales cuanto antes.

  // ============================================================
  // 5. VALORES TRUTHY Y FALSY
  // ------------------------------------------------------------
  // Un if no exige un booleano. Acepta CUALQUIER valor y lo convierte
  // internamente a true o false. A esa conversion se le llama
  // "coercion a booleano".
  //
  // Solo hay OCHO valores falsy en todo JavaScript. Merece la pena
  // memorizarlos, porque TODO lo demas es truthy:
  //   false, 0, -0, 0n (BigInt cero), "" (cadena vacia), null, undefined, NaN
  //
  // Sorpresas frecuentes: "0" (el CERO ENTRE COMILLAS) es truthy porque es
  // una cadena con contenido. Y el array vacio [] tambien es truthy.
  // ============================================================

  // Datos de partida de esta seccion (vienen ya escritos).
  // Guardamos tambien una etiqueta de texto, porque imprimir "" o undefined
  // directamente no se veria en pantalla.
  const valoresDePrueba = [
    { etiqueta: 'false', valor: false },
    { etiqueta: '0 (numero)', valor: 0 },
    { etiqueta: '"" (cadena vacia)', valor: '' },
    { etiqueta: 'null', valor: null },
    { etiqueta: 'undefined', valor: undefined },
    { etiqueta: 'NaN', valor: NaN },
    { etiqueta: '"0" (cero entre comillas)', valor: '0' },
    { etiqueta: '"false" (texto false)', valor: 'false' },
    { etiqueta: '[] (array vacio)', valor: [] },
    { etiqueta: '{} (objeto vacio)', valor: {} },
    { etiqueta: '-1', valor: -1 },
    { etiqueta: '" " (un espacio)', valor: ' ' },
  ];

  // TODO (en clase):
  //   1. titulo('5. VALORES TRUTHY Y FALSY').
  //   2. Recorre valoresDePrueba con  for (const caso of valoresDePrueba)
  //      (el for...of se explica a fondo en el archivo 03).
  //      Dentro: const esVerdadero = !!caso.valor;   // el doble ! convierte a booleano
  //      y despues imprimir(caso.etiqueta.padEnd(28), '->', esVerdadero ? 'TRUTHY' : 'falsy')
  //      padEnd(28) alinea las columnas en la fuente monoespaciada.
  //   3. Declara const comentarioDelAlumno = '' y escribe un if/else sobre esa
  //      variable a secas (sin comparar con nada):
  //        rama true  -> 'El alumno escribio un comentario.'
  //        rama false -> 'El campo de comentario esta vacio (la cadena vacia es falsy).'
  //   4. Declara const erroresDetectados = 0 y escribe un if/else sobre esa
  //      variable a secas:
  //        rama true  -> 'Nunca entra aqui, porque 0 es falsy...'
  //        rama false -> '...y "cero errores" se confunde con "no hay dato". Cuidado.'
  //   5. Repite la comprobacion de forma explicita con  if (erroresDetectados > 0)
  //      y en el else imprime 'Comparacion explicita > 0: el examen no tiene errores.'
  //   Resultado esperado en pantalla: las 12 lineas del listado (false -> falsy,
  //   "0" (cero entre comillas) -> TRUTHY, [] (array vacio) -> TRUTHY...) y despues
  //   las tres frases de los apartados 3, 4 y 5.
  //   (aprox. 22 lineas)

  // ⚠️ ERROR COMUN: usar el truthy para comprobar numeros que pueden valer 0.
  // Un contador en 0 es un dato perfectamente valido, pero es falsy.

  // ✅ BUENA PRACTICA: cuando el 0 sea un valor legitimo, compara de forma
  // explicita (> 0, === 0) en vez de fiarte del truthy.

  // ============================================================
  // 6. OPERADORES LOGICOS: &&, || y !
  // ------------------------------------------------------------
  //   &&  (Y)  -> verdadero solo si AMBOS lados son verdaderos.
  //   ||  (O)  -> verdadero si AL MENOS UNO de los lados es verdadero.
  //   !   (NO) -> invierte: convierte true en false y false en true.
  //
  // CORTOCIRCUITO: JavaScript deja de evaluar en cuanto sabe el resultado.
  // En  a && b, si a es falso, b ni se mira. En  a || b, si a es verdadero,
  // b ni se mira. Esto se aprovecha muchisimo en codigo real.
  // ============================================================

  // TODO (en clase):
  //   1. titulo('6. OPERADORES LOGICOS Y CORTOCIRCUITO').
  //   2. Declara tres booleanos:
  //        const haEntregadoProyecto = true;
  //        const haHechoExamen = true;
  //        const tieneConvalidacion = false;
  //   3. Escribe tres if sueltos que demuestren cada operador:
  //        haEntregadoProyecto && haHechoExamen -> '&& : ha entregado el proyecto Y ha hecho el examen. Se puede evaluar.'
  //        haHechoExamen || tieneConvalidacion  -> '|| : tiene examen O convalidacion. Aparece en el acta.'
  //        !tieneConvalidacion                  -> '!  : no tiene convalidacion, debe cursar la asignatura completa.'
  //   4. Combina los tres con parentesis explicitos:
  //        if ((haEntregadoProyecto && haHechoExamen) || tieneConvalidacion)
  //        -> 'Combinado: cumple los requisitos para cerrar el acta.'
  //   5. Declara la funcion registrarAvisoEnConsola() que imprime
  //      '  (esta funcion SI se ha ejecutado)' y devuelve true.
  //   6. Demuestra el cortocircuito con dos pruebas:
  //        imprimir('Probando  false && registrarAvisoEnConsola() :')
  //        const resultadoCorto = false && registrarAvisoEnConsola();
  //        imprimir('  Resultado:', resultadoCorto, '-> la funcion ni se llamo (cortocircuito)')
  //        imprimir('Probando  true && registrarAvisoEnConsola() :')
  //        const resultadoLargo = true && registrarAvisoEnConsola();
  //        imprimir('  Resultado:', resultadoLargo)
  //   7. Valor por defecto con || :
  //        const apodoIntroducido = '';
  //        const apodoMostrado = apodoIntroducido || 'Estudiante anonimo';
  //        imprimir('Valor por defecto con || ->', apodoMostrado)
  //   8. Y el contraste con ?? :
  //        const puntosExtra = 0;
  //        imprimir('puntosExtra || 10  ->', puntosExtra || 10, '(convierte un 0 legitimo en 10)')
  //        imprimir('puntosExtra ?? 10  ->', puntosExtra ?? 10, '(respeta el 0)')
  //   Resultado esperado en pantalla: las cuatro frases de operadores, luego
  //   'Resultado: false -> la funcion ni se llamo (cortocircuito)', luego la
  //   funcion ejecutandose una sola vez, 'Valor por defecto con || -> Estudiante anonimo',
  //   'puntosExtra || 10  -> 10' y 'puntosExtra ?? 10  -> 0'.
  //   (aprox. 30 lineas)

  // ⚠️ CUIDADO: || sustituye TODOS los falsy, incluido el 0. Por eso un 0
  // legitimo (cero puntos extra, cero errores) se convierte en el valor
  // por defecto sin que nadie lo pida.

  // ✅ BUENA PRACTICA: el operador ?? (fusion de nulos, "nullish coalescing")
  // solo sustituye null y undefined. Respeta el 0 y la cadena vacia.

  // ✅ BUENA PRACTICA: parentesis explicitos al mezclar && y ||. Ahorran
  // discusiones y errores, aunque && tenga mas prioridad que ||.

  // ============================================================
  // 7. EL OPERADOR TERNARIO
  // ------------------------------------------------------------
  // Es un if/else comprimido en una sola linea. Su estructura es:
  //
  //   condicion ? valorSiEsVerdadero : valorSiEsFalso
  //
  // Se llama "ternario" porque es el unico operador de JavaScript con
  // TRES operandos. La gran diferencia con el if: el ternario DEVUELVE
  // un valor, asi que se puede guardar en una variable o incrustar
  // dentro de un texto.
  // ============================================================

  // TODO (en clase):
  //   1. titulo('7. EL OPERADOR TERNARIO').
  //   2. Version larga: declara  let estadoLargo;  y asignale 'APROBADO' o
  //      'SUSPENSO' con un if/else sobre notaFinal >= 5.
  //      Imprime  imprimir('Con if/else (5 lineas) ->', estadoLargo)
  //   3. Version corta: const estadoCorto = notaFinal >= 5 ? 'APROBADO' : 'SUSPENSO';
  //      Imprime  imprimir('Con ternario (1 linea) ->', estadoCorto)
  //   4. Ternario dentro de una plantilla de texto (template literal, comillas
  //      inclinadas con ${ }):
  //        const alumnos = 1;
  //        imprimir(`Hay ${alumnos} ${alumnos === 1 ? 'alumno' : 'alumnos'} en el aula.`)
  //        const alumnos2 = 24;   (y la misma linea con alumnos2)
  //   Resultado esperado en pantalla:
  //      Con if/else (5 lineas) -> APROBADO
  //      Con ternario (1 linea) -> APROBADO
  //      Hay 1 alumno en el aula.
  //      Hay 24 alumnos en el aula.
  //   (aprox. 14 lineas)

  // ⚠️ ERROR COMUN: usar el ternario para EJECUTAR acciones en vez de
  // producir valores. Esto funciona, pero es confuso y se desaconseja:
  //   nota >= 5 ? imprimir('bien') : imprimir('mal');
  // Si vas a ejecutar acciones, usa un if. El ternario es para VALORES.

  // ============================================================
  // 8. TERNARIOS ANIDADOS (Y POR QUE EVITARLOS)
  // ------------------------------------------------------------
  // Se pueden encadenar ternarios metiendo uno en la rama del otro.
  // Tecnicamente funciona y es equivalente a una cadena if/else if.
  // El problema es humano, no tecnico: a partir de dos niveles el codigo
  // se vuelve un jeroglifico que nadie quiere tocar dentro de seis meses.
  // ============================================================

  // TODO (en clase):
  //   1. titulo('8. TERNARIOS ANIDADOS').
  //   2. Escribe const calificacionTernaria con la cadena de ternarios TODO
  //      SEGUIDO, en una sola linea larga:
  //        notaFinal >= 9 ? 'EXCELENTE' : notaFinal >= 7 ? 'BUENO' : notaFinal >= 5 ? 'SUFICIENTE' : 'INSUFICIENTE'
  //      e imprimela con imprimir('Ternario anidado ->', calificacionTernaria)
  //   3. Escribe const calificacionFormateada con exactamente la misma logica,
  //      pero partida en cuatro lineas, con los dos puntos al principio de cada
  //      linea, para que se lea como una tabla.
  //      Imprimela con imprimir('Ternario anidado formateado ->', calificacionFormateada)
  //   4. Compara en voz alta las dos versiones: misma logica, distinta legibilidad.
  //   Resultado esperado en pantalla:
  //      Ternario anidado -> BUENO
  //      Ternario anidado formateado -> BUENO
  //   (aprox. 10 lineas)

  // ⚠️ ERROR COMUN: escribirlo sin saltos de linea y sin sangria. Si vas a
  // anidar ternarios, formatealos SIEMPRE alineando los ? y los :

  // ✅ BUENA PRACTICA: mas de dos niveles pide a gritos un if/else if o un
  // switch. La regla practica del curso: un ternario simple, si; ternario
  // dentro de ternario, solo si cabe comodo en una linea y lo entiende
  // cualquiera al primer vistazo. Si dudas, usa if/else.

  // ============================================================
  // 9. UN DETALLE QUE ARRUINA CONDICIONES: == frente a ===
  // ------------------------------------------------------------
  // ==  compara despues de convertir los tipos ("igualdad debil").
  // === compara valor Y tipo, sin conversiones ("igualdad estricta").
  // En condiciones esto provoca sorpresas muy dificiles de depurar.
  // ============================================================

  // TODO (en clase):
  //   1. titulo('9. == FRENTE A === DENTRO DE CONDICIONES').
  //   2. Declara const notaEscrita = '8';  // llega como TEXTO, como desde un <input>
  //   3. Imprime las dos comparaciones:
  //        imprimir("'8' ==  8  ->", notaEscrita == 8)
  //        imprimir("'8' === 8  ->", notaEscrita === 8)
  //   4. Imprime los cuatro casos que siempre sorprenden en clase:
  //        '' == 0, null == undefined, null === undefined, NaN == NaN
  //      con las etiquetas "'' == 0        ->", 'null == undefined ->',
  //      'null === undefined ->' y 'NaN == NaN     ->'.
  //   5. Imprime imprimir('Number.isNaN(NaN) ->', Number.isNaN(NaN)) y explica
  //      que es la unica forma correcta de detectar NaN.
  //   6. Cierra con un if (Number(notaEscrita) === 8) que imprima
  //      'Conversion explicita con Number(): ahora si coinciden.'
  //   Resultado esperado en pantalla:
  //      '8' ==  8  -> true
  //      '8' === 8  -> false
  //      '' == 0        -> true
  //      null == undefined -> true
  //      null === undefined -> false
  //      NaN == NaN     -> false
  //      Number.isNaN(NaN) -> true
  //      Conversion explicita con Number(): ahora si coinciden.
  //   (aprox. 14 lineas)

  // ✅ BUENA PRACTICA: usa SIEMPRE === y !==. Si necesitas comparar un texto
  // con un numero, convierte tu mismo con Number(...) y deja la intencion clara.

  // ============================================================
  // 10. LIMPIAR LA CONSOLA VISUAL
  // ------------------------------------------------------------
  // Pequeña utilidad para el aula: un boton que vacia el <pre>.
  // addEventListener conecta un evento ('click') con una funcion que se
  // ejecutara cuando ese evento ocurra.
  // ============================================================

  // TODO (en clase):
  //   1. Guarda el boton en una constante:
  //      const botonLimpiar = document.getElementById('btn-limpiar-condicionales');
  //   2. Comprueba que existen boton y salida:  if (botonLimpiar && salida) { ... }
  //   3. Dentro, botonLimpiar.addEventListener('click', function () { ... }) y en
  //      el cuerpo asigna
  //      salida.textContent = 'Consola limpiada. Recarga la pagina (F5) para volver a ejecutar.\n';
  //   Resultado esperado: al pulsar "Limpiar consola" de la seccion 01 de la
  //   pagina, el bloque negro se vacia y muestra esa unica frase.
  //   (aprox. 7 lineas)

  // ✅ BUENA PRACTICA: nunca des por hecho que un elemento del HTML esta ahi.
  // Comprueba siempre que getElementById devolvio algo antes de usarlo.

  /**
   * ============================================================
   * EJERCICIOS PROPUESTOS - 01 CONDICIONALES
   * ============================================================
   * Resuelve cada ejercicio en este mismo archivo, justo debajo de este
   * comentario, y comprueba el resultado con imprimir().
   *
   * 1) DESCUENTO POR VOLUMEN (facil)
   *    Declara una variable "unidades" con el numero de libretas que compra
   *    un estudiante. Usando if/else if/else, calcula el descuento:
   *    menos de 5 unidades -> 0 %, de 5 a 9 -> 5 %, de 10 a 19 -> 10 %,
   *    20 o mas -> 15 %. Imprime el porcentaje aplicado.
   *
   * 2) EL MISMO PROBLEMA, EN TERNARIO (facil)
   *    Reescribe el ejercicio 1 con ternarios anidados y formateados en
   *    varias lineas. Despues responde en un comentario: cual de las dos
   *    versiones te parece mas facil de mantener y por que.
   *
   * 3) VALIDADOR DE FORMULARIO (intermedio)
   *    Dadas tres variables (nombre, edad, correo), imprime "Formulario
   *    valido" solo si: el nombre no esta vacio, la edad es un numero mayor
   *    o igual a 16, y el correo contiene una arroba (pista: usa
   *    correo.includes('@')). Si algo falla, imprime QUE campo concreto
   *    esta mal, no un mensaje generico.
   *
   * 4) CAZA DE FALSY (intermedio)
   *    Crea un array con al menos ocho valores mezclados (numeros, textos,
   *    null, undefined, arrays vacios...). Recorrelo y cuenta cuantos son
   *    truthy y cuantos falsy. Imprime el recuento final.
   *
   * 5) PRECIO DE LA ENTRADA AL MUSEO (avanzado)
   *    Escribe una funcion calcularPrecio(edad, esEstudiante, esMiercoles)
   *    que devuelva el precio segun estas reglas, aplicadas en este orden:
   *    menores de 6 anios entran gratis; los miercoles todo el mundo paga 3;
   *    los estudiantes pagan 5; los mayores de 65 pagan 4; el resto paga 9.
   *    Usa salidas tempranas (return) en lugar de anidar ifs, y prueba la
   *    funcion con al menos cinco combinaciones distintas.
   * ============================================================
   */
})();
