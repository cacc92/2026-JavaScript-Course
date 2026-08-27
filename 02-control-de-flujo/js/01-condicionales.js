/**
 * ============================================================
 * ARCHIVO: js/01-condicionales.js
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
 */

(function () {
  // 'use strict' activa el modo estricto: JavaScript avisa de errores que
  // normalmente perdona en silencio (por ejemplo, usar una variable sin declarar).
  // BUENA PRACTICA: ponerlo siempre al principio de cada IIFE.
  'use strict';

  // ============================================================
  // 0. HERRAMIENTAS DE SALIDA (la "consola visual")
  // ============================================================

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

  titulo('1. EL IF MAS SIMPLE');

  // Datos concretos con los que vamos a trabajar durante todo el archivo.
  const nombreEstudiante = 'Lucia';
  const notaFinal = 8.5;
  const asistencia = 92; // Porcentaje de asistencia a clase

  imprimir('Estudiante:', nombreEstudiante, '| Nota:', notaFinal, '| Asistencia:', asistencia + '%');

  // La condicion notaFinal >= 5 se evalua ANTES de entrar. Devuelve true o false.
  if (notaFinal >= 5) {
    imprimir('El estudiante ha aprobado la asignatura.');
  }

  // Si la condicion es falsa, el bloque no se ejecuta y no pasa nada mas.
  if (notaFinal === 10) {
    imprimir('Matricula de honor'); // Esta linea NO se vera: 8.5 no es 10
  }

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

  titulo('2. IF / ELSE');

  if (notaFinal >= 5) {
    imprimir('APROBADO con un ' + notaFinal);
  } else {
    imprimir('SUSPENSO con un ' + notaFinal);
  }

  // Otro ejemplo con un dato distinto, para ver el camino del else.
  const entregasPendientes = 3;

  if (entregasPendientes === 0) {
    imprimir('No quedan entregas pendientes. Buen trabajo.');
  } else {
    imprimir('Quedan ' + entregasPendientes + ' entregas por subir al aula virtual.');
  }

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

  titulo('3. CADENA IF / ELSE IF / ELSE');

  // ✅ BUENA PRACTICA: ordenar de la condicion MAS restrictiva a la MAS amplia.
  if (notaFinal >= 9) {
    imprimir('Calificacion: EXCELENTE');
  } else if (notaFinal >= 7) {
    imprimir('Calificacion: BUENO'); // 8.5 entra aqui y la cadena se detiene
  } else if (notaFinal >= 5) {
    imprimir('Calificacion: SUFICIENTE');
  } else {
    imprimir('Calificacion: INSUFICIENTE');
  }

  // Fijate en que NO hace falta escribir  notaFinal >= 7 && notaFinal < 9.
  // Si hemos llegado al segundo else if, es porque el primero fallo, asi que
  // ya sabemos que la nota es menor que 9. La cadena arrastra esa informacion.

  // ⚠️ ERROR COMUN: escribir la cadena al reves.
  //   if (nota >= 5) { 'SUFICIENTE' }
  //   else if (nota >= 9) { 'EXCELENTE' }   <-- inalcanzable
  // Un 10 cumple ya la primera condicion, asi que nunca se llega a EXCELENTE.
  // Demostracion:
  const notaDePrueba = 10;
  if (notaDePrueba >= 5) {
    imprimir('Orden incorrecto -> un ' + notaDePrueba + ' se clasifica como SUFICIENTE');
  } else if (notaDePrueba >= 9) {
    imprimir('Esta linea es inalcanzable');
  }

  // ============================================================
  // 4. CONDICIONALES ANIDADOS
  // ------------------------------------------------------------
  // Anidar es meter un if dentro de otro if. Se usa cuando la segunda
  // pregunta solo tiene sentido si la primera se cumplio.
  //
  // Ejemplo real: solo tiene sentido preguntar por la asistencia si el
  // estudiante ya ha aprobado el examen.
  // ============================================================

  titulo('4. CONDICIONALES ANIDADOS');

  if (notaFinal >= 5) {
    // Hemos entrado: sabemos que aprobo. Ahora afinamos.
    imprimir('Ha superado el examen. Revisando asistencia...');

    if (asistencia >= 80) {
      imprimir('  -> Asistencia suficiente. Acta cerrada como APTO.');

      // Se puede anidar un tercer nivel, pero ojo: cada nivel añade
      // sangria y dificultad de lectura.
      if (notaFinal >= 9 && asistencia >= 90) {
        imprimir('  -> Ademas es candidato a MATRICULA DE HONOR.');
      }
    } else {
      imprimir('  -> Asistencia insuficiente. Debe presentar trabajo compensatorio.');
    }
  } else {
    imprimir('No supera el examen. La asistencia no se valora en este caso.');
  }

  // ⚠️ ERROR COMUN: anidar cuatro o cinco niveles. A eso se le llama
  // "codigo flecha" (arrow code) porque la sangria dibuja una flecha hacia
  // la derecha. Es dificil de leer y de depurar.

  // ✅ BUENA PRACTICA: cuando puedas, sustituye la anidacion por una
  // condicion combinada con && (Y logico), que se lee de un vistazo:
  if (notaFinal >= 9 && asistencia >= 90) {
    imprimir('Version plana (sin anidar): candidato a MATRICULA DE HONOR.');
  }

  // ✅ BUENA PRACTICA: "salida temprana" (early return / guard clause).
  // Dentro de una funcion, en lugar de anidar, sales cuanto antes.
  function describirMatricula(nota, porcentajeAsistencia) {
    // Guardas: los casos que descartan pronto, cada uno con su return.
    if (nota < 5) return 'No apto: nota insuficiente';
    if (porcentajeAsistencia < 80) return 'No apto: asistencia insuficiente';
    if (nota >= 9 && porcentajeAsistencia >= 90) return 'Apto con matricula de honor';
    return 'Apto'; // Si llegamos aqui, todas las guardas pasaron
  }

  imprimir('describirMatricula(8.5, 92) ->', describirMatricula(8.5, 92));
  imprimir('describirMatricula(9.5, 95) ->', describirMatricula(9.5, 95));
  imprimir('describirMatricula(4, 100)  ->', describirMatricula(4, 100));
  imprimir('describirMatricula(7, 50)   ->', describirMatricula(7, 50));

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

  titulo('5. VALORES TRUTHY Y FALSY');

  // Metemos los valores en un array para recorrerlos y ver el veredicto.
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

  // Recorremos la lista. Ya usamos aqui un for...of, que veremos a fondo
  // en el archivo 03: se lee como "para cada caso de valoresDePrueba".
  for (const caso of valoresDePrueba) {
    // El doble signo de admiracion !! convierte cualquier valor a booleano.
    // El primer ! lo niega, el segundo deshace la negacion. Truco clasico.
    const esVerdadero = !!caso.valor;
    // padEnd rellena con espacios hasta llegar a 28 caracteres, para que
    // las columnas queden alineadas en la consola monoespaciada.
    imprimir(caso.etiqueta.padEnd(28), '->', esVerdadero ? 'TRUTHY' : 'falsy');
  }

  // Uso practico: comprobar si un campo de texto viene vacio.
  const comentarioDelAlumno = '';

  if (comentarioDelAlumno) {
    imprimir('El alumno escribio un comentario.');
  } else {
    imprimir('El campo de comentario esta vacio (la cadena vacia es falsy).');
  }

  // ⚠️ ERROR COMUN: usar el truthy para comprobar numeros que pueden valer 0.
  const erroresDetectados = 0;

  if (erroresDetectados) {
    imprimir('Nunca entra aqui, porque 0 es falsy...');
  } else {
    imprimir('...y "cero errores" se confunde con "no hay dato". Cuidado.');
  }

  // ✅ BUENA PRACTICA: cuando el 0 sea un valor legitimo, compara de forma
  // explicita en vez de fiarte del truthy.
  if (erroresDetectados > 0) {
    imprimir('Hay errores que corregir.');
  } else {
    imprimir('Comparacion explicita > 0: el examen no tiene errores.');
  }

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

  titulo('6. OPERADORES LOGICOS Y CORTOCIRCUITO');

  const haEntregadoProyecto = true;
  const haHechoExamen = true;
  const tieneConvalidacion = false;

  // && exige que se cumpla todo.
  if (haEntregadoProyecto && haHechoExamen) {
    imprimir('&& : ha entregado el proyecto Y ha hecho el examen. Se puede evaluar.');
  }

  // || se conforma con uno.
  if (haHechoExamen || tieneConvalidacion) {
    imprimir('|| : tiene examen O convalidacion. Aparece en el acta.');
  }

  // ! invierte la respuesta. Se lee "si NO tiene convalidacion".
  if (!tieneConvalidacion) {
    imprimir('!  : no tiene convalidacion, debe cursar la asignatura completa.');
  }

  // Combinacion de los tres. Los parentesis NO son obligatorios (&& tiene
  // mas prioridad que ||), pero los ponemos igual.
  // ✅ BUENA PRACTICA: parentesis explicitos. Ahorran discusiones y errores.
  if ((haEntregadoProyecto && haHechoExamen) || tieneConvalidacion) {
    imprimir('Combinado: cumple los requisitos para cerrar el acta.');
  }

  // El cortocircuito en accion: la funcion de la derecha nunca se llama.
  function registrarAvisoEnConsola() {
    imprimir('  (esta funcion SI se ha ejecutado)');
    return true;
  }

  imprimir('Probando  false && registrarAvisoEnConsola() :');
  const resultadoCorto = false && registrarAvisoEnConsola(); // No se ejecuta nada
  imprimir('  Resultado:', resultadoCorto, '-> la funcion ni se llamo (cortocircuito)');

  imprimir('Probando  true && registrarAvisoEnConsola() :');
  const resultadoLargo = true && registrarAvisoEnConsola(); // Aqui si se ejecuta
  imprimir('  Resultado:', resultadoLargo);

  // Uso practico del cortocircuito: valor por defecto con ||
  const apodoIntroducido = ''; // El usuario no escribio nada
  const apodoMostrado = apodoIntroducido || 'Estudiante anonimo';
  imprimir('Valor por defecto con || ->', apodoMostrado);

  // ⚠️ CUIDADO: || sustituye TODOS los falsy, incluido el 0.
  const puntosExtra = 0;
  imprimir('puntosExtra || 10  ->', puntosExtra || 10, '(convierte un 0 legitimo en 10)');

  // ✅ BUENA PRACTICA: el operador ?? (fusion de nulos, "nullish coalescing")
  // solo sustituye null y undefined. Respeta el 0 y la cadena vacia.
  imprimir('puntosExtra ?? 10  ->', puntosExtra ?? 10, '(respeta el 0)');

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

  titulo('7. EL OPERADOR TERNARIO');

  // Version larga, con if/else:
  let estadoLargo;
  if (notaFinal >= 5) {
    estadoLargo = 'APROBADO';
  } else {
    estadoLargo = 'SUSPENSO';
  }
  imprimir('Con if/else (5 lineas) ->', estadoLargo);

  // Misma logica, con ternario, en una sola linea:
  const estadoCorto = notaFinal >= 5 ? 'APROBADO' : 'SUSPENSO';
  imprimir('Con ternario (1 linea) ->', estadoCorto);

  // Los ternarios brillan dentro de una plantilla de texto (template literal),
  // que son las comillas inclinadas ` ` con ${ } para insertar valores.
  const alumnos = 1;
  imprimir(`Hay ${alumnos} ${alumnos === 1 ? 'alumno' : 'alumnos'} en el aula.`);

  const alumnos2 = 24;
  imprimir(`Hay ${alumnos2} ${alumnos2 === 1 ? 'alumno' : 'alumnos'} en el aula.`);

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

  titulo('8. TERNARIOS ANIDADOS');

  // Version anidada, todo en una linea. Legible... solo si la formateas bien.
  const calificacionTernaria =
    notaFinal >= 9 ? 'EXCELENTE' : notaFinal >= 7 ? 'BUENO' : notaFinal >= 5 ? 'SUFICIENTE' : 'INSUFICIENTE';

  imprimir('Ternario anidado ->', calificacionTernaria);

  // ⚠️ ERROR COMUN: escribirlo sin saltos de linea y sin sangria. Compara
  // el bloque de arriba con esta version, mucho mas amable, que se lee casi
  // como una tabla. Si vas a anidar ternarios, formatealos SIEMPRE asi:
  const calificacionFormateada =
    notaFinal >= 9 ? 'EXCELENTE'
    : notaFinal >= 7 ? 'BUENO'
    : notaFinal >= 5 ? 'SUFICIENTE'
    : 'INSUFICIENTE';

  imprimir('Ternario anidado formateado ->', calificacionFormateada);

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

  titulo('9. == FRENTE A === DENTRO DE CONDICIONES');

  const notaEscrita = '8'; // Llega como TEXTO, por ejemplo desde un <input>

  imprimir("'8' ==  8  ->", notaEscrita == 8); // true  -> convierte el texto a numero
  imprimir("'8' === 8  ->", notaEscrita === 8); // false -> string no es number

  // Casos que suelen sorprender en clase:
  imprimir("'' == 0        ->", '' == 0); // true
  imprimir('null == undefined ->', null == undefined); // true
  imprimir('null === undefined ->', null === undefined); // false
  imprimir('NaN == NaN     ->', NaN == NaN); // false: NaN no es igual ni a si mismo

  // Para saber si algo es NaN se usa Number.isNaN, nunca ===.
  imprimir('Number.isNaN(NaN) ->', Number.isNaN(NaN)); // true

  // ✅ BUENA PRACTICA: usa SIEMPRE === y !==. Si necesitas comparar un texto
  // con un numero, convierte tu mismo con Number(...) y deja la intencion clara.
  if (Number(notaEscrita) === 8) {
    imprimir('Conversion explicita con Number(): ahora si coinciden.');
  }

  // ============================================================
  // 10. LIMPIAR LA CONSOLA VISUAL
  // ------------------------------------------------------------
  // Pequeña utilidad para el aula: un boton que vacia el <pre>.
  // addEventListener conecta un evento ('click') con una funcion que se
  // ejecutara cuando ese evento ocurra.
  // ============================================================

  const botonLimpiar = document.getElementById('btn-limpiar-condicionales');

  // Comprobamos que el boton existe antes de usarlo.
  // ✅ BUENA PRACTICA: nunca des por hecho que un elemento del HTML esta ahi.
  if (botonLimpiar && salida) {
    botonLimpiar.addEventListener('click', function () {
      salida.textContent = 'Consola limpiada. Recarga la pagina (F5) para volver a ejecutar.\n';
    });
  }

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
