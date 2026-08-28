/**
 * ============================================================
 * ARCHIVO: js/02-switch.js   ·   PLANTILLA DE CLASE
 * PROYECTO: 02 - Control de flujo
 * TEMA: La sentencia switch
 * ============================================================
 *
 * QUE VAS A APRENDER EN ESTE ARCHIVO:
 *  - La anatomia de un switch: switch, case, break y default.
 *  - Por que olvidar un break provoca el temido "fall-through".
 *  - Un caso real donde el fall-through es exactamente lo que queremos.
 *  - Que el switch compara con === (comparacion estricta) y que implica.
 *  - El truco de switch (true) para trabajar con rangos.
 *  - Cuando usar switch y cuando es mejor un if/else.
 *  - Como el ambito (scope) de las variables dentro de un case da problemas.
 *
 * COMO SE USA ESTA PLANTILLA:
 * El archivo esta vacio de codigo a proposito. Cada seccion conserva su
 * explicacion y trae un bloque "TODO (en clase)" con las instrucciones
 * exactas de lo que hay que escribir. La version resuelta esta en
 * ../../js/02-switch.js (carpeta padre del proyecto).
 * Al abrir la pagina sin escribir nada NO debe haber ningun error en la
 * consola: solo se veran las consolas visuales vacias.
 *
 * RECUERDA: este archivo tambien esta envuelto en una IIFE para que su
 * funcion "imprimir" no choque con la del archivo 01, que se llama igual.
 * Sin la IIFE el navegador lanzaria:
 *   "Identifier 'imprimir' has already been declared".
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

  const salida = document.getElementById('salida-switch');

  /**
   * imprimir(): escribe a la vez en la consola del navegador (F12) y en el
   * bloque visual de la pagina, para poder seguir la clase sin abrir DevTools.
   */
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
  // 1. ANATOMIA DE UN SWITCH
  // ------------------------------------------------------------
  // El switch compara UN valor contra una lista de posibilidades.
  // Su estructura es:
  //
  //   switch (valorAComparar) {
  //     case posibilidad1:
  //       ...codigo...
  //       break;
  //     case posibilidad2:
  //       ...codigo...
  //       break;
  //     default:
  //       ...codigo si no coincide ninguno...
  //   }
  //
  // Analogia: una maquina de vending. Marcas el codigo A3 y cae UN
  // producto. El break es la puerta que se cierra despues de que caiga
  // tu producto; sin break seguirian cayendo los siguientes.
  // ============================================================

  // DATO DE PARTIDA (ya escrito). Simulamos el dia de la semana que
  // devuelve el navegador. getDay() da 0 para domingo, 1 para lunes...
  // 6 para sabado. Fijamos un valor concreto para que la clase vea
  // siempre exactamente lo mismo.
  const diaSemana = 3; // Miercoles

  // TODO (en clase):
  //   1. titulo('1. ANATOMIA DE UN SWITCH').
  //   2. imprimir('Valor de diaSemana:', diaSemana).
  //   3. Escribe switch (diaSemana) { ... } con cinco case y un default:
  //        case 1 -> imprimir('Lunes: clase de HTML y CSS');       break;
  //        case 2 -> imprimir('Martes: clase de JavaScript');       break;
  //        case 3 -> imprimir('Miercoles: taller de control de flujo'); break;
  //        case 4 -> imprimir('Jueves: proyecto en grupo');         break;
  //        case 5 -> imprimir('Viernes: repaso y entrega');         break;
  //        default -> imprimir('Fin de semana: no hay clase');
  //   4. Explica en voz alta que el break sale del switch: sin el se
  //      seguiria ejecutando el case siguiente.
  //   Resultado esperado en pantalla:
  //      Valor de diaSemana: 3
  //      Miercoles: taller de control de flujo
  //   (aprox. 20 lineas)

  // ✅ BUENA PRACTICA: pon SIEMPRE un default, aunque solo sea para
  // registrar un aviso. Te avisara de valores inesperados que, sin el,
  // pasarian en silencio.

  // ============================================================
  // 2. EL SWITCH COMPARA CON === (COMPARACION ESTRICTA)
  // ------------------------------------------------------------
  // Este es el detalle que mas veces rompe un switch en clase. El switch
  // NO convierte tipos: compara igual que ===, exigiendo mismo valor
  // Y mismo tipo.
  //
  // Consecuencia practica: si el valor viene de un <input>, llega como
  // TEXTO. El case 3 (numero) no coincidira nunca con "3" (texto).
  // ============================================================

  // DATO DE PARTIDA (ya escrito). Ojo: entre comillas, es un string.
  const diaComoTexto = '3';

  // TODO (en clase):
  //   1. titulo('2. EL SWITCH COMPARA CON ===').
  //   2. imprimir('Comparando el texto "3" contra case 3 (numero):').
  //   3. switch (diaComoTexto) con tres ramas:
  //        case 3   -> imprimir('  Entro en case 3 (numero)');  break;   // NO se ejecuta
  //        case '3' -> imprimir('  Entro en case "3" (texto) -> el switch usa ===');  break;
  //        default  -> imprimir('  No coincidio ningun case');
  //   4. Declara const diaConvertido = Number(diaComoTexto);  // ahora si es el numero 3
  //   5. Escribe un segundo switch (diaConvertido) con
  //        case 3  -> imprimir('  Tras Number("3") -> ahora si entra en case 3'); break;
  //        default -> imprimir('  No coincidio ningun case');
  //   Resultado esperado en pantalla:
  //      Comparando el texto "3" contra case 3 (numero):
  //        Entro en case "3" (texto) -> el switch usa ===
  //        Tras Number("3") -> ahora si entra en case 3
  //   (aprox. 20 lineas)

  // ✅ BUENA PRACTICA: convierte el dato ANTES de entrar al switch, para
  // que dentro solo compares peras con peras.

  // ============================================================
  // 3. EL PELIGRO DEL FALL-THROUGH (OLVIDAR EL BREAK)
  // ------------------------------------------------------------
  // "Fall-through" significa "caer hacia abajo". Cuando un case coincide,
  // JavaScript ejecuta su codigo Y SIGUE ejecutando los case siguientes
  // hasta encontrar un break o llegar al final del switch.
  //
  // Es asi por diseño, no es un fallo del lenguaje. Pero cuando se te
  // olvida un break, el resultado es un error silencioso muy dificil de
  // detectar leyendo el codigo por encima.
  // ============================================================

  // DATO DE PARTIDA (ya escrito).
  const rolUsuario = 'editor';

  // TODO (en clase):
  //   1. titulo('3. EL PELIGRO DEL FALL-THROUGH').
  //   2. imprimir('Switch SIN break (mal), con rol =', rolUsuario).
  //   3. Escribe el switch (rolUsuario) MAL, SIN un solo break, con:
  //        case 'administrador' -> imprimir('  Puede borrar usuarios');
  //        case 'editor'        -> imprimir('  Puede publicar articulos');
  //        case 'lector'        -> imprimir('  Puede leer articulos');
  //        default              -> imprimir('  Puede ver la pagina de inicio');
  //      Marca con un comentario "aqui falta un break" cada hueco.
  //   4. imprimir('Resultado: se imprimieron 3 lineas cuando solo esperabamos 1.').
  //   5. imprimir('\nSwitch CON break (bien), con rol =', rolUsuario).
  //   6. Repite el MISMO switch pero ahora con su break en cada case.
  //   Resultado esperado en pantalla (fijate en las 3 lineas de la version mala):
  //      Switch SIN break (mal), con rol = editor
  //        Puede publicar articulos
  //        Puede leer articulos
  //        Puede ver la pagina de inicio
  //      Resultado: se imprimieron 3 lineas cuando solo esperabamos 1.
  //      Switch CON break (bien), con rol = editor
  //        Puede publicar articulos
  //   (aprox. 26 lineas)

  // ⚠️ ERROR COMUN: es exactamente el switch de arriba. No da ningun
  // error en consola; simplemente hace mas cosas de las que pediste.
  // Por eso es tan traicionero.

  // ✅ BUENA PRACTICA: escribe primero el break y despues el codigo del
  // case. Suena raro, pero asi es imposible que se te olvide.

  // ============================================================
  // 4. CUANDO EL FALL-THROUGH ES UTIL: AGRUPAR CASOS
  // ------------------------------------------------------------
  // Si varios valores distintos deben ejecutar EXACTAMENTE el mismo
  // codigo, se apilan los case uno encima de otro sin nada en medio.
  // El primero que coincida "cae" hasta el bloque compartido.
  //
  // Esta es la unica forma de escribir un "case A o B o C" en JavaScript,
  // y es totalmente idiomatica: nadie la considera un error.
  // ============================================================

  // DATOS DE PARTIDA (ya escritos).
  const mes = 'noviembre';
  const diaAComprobar = 6; // Sabado

  // TODO (en clase):
  //   1. titulo('4. FALL-THROUGH UTIL: AGRUPAR CASOS').
  //   2. switch (mes) agrupando los meses de tres en tres, SIN codigo
  //      entre los case apilados:
  //        'diciembre' / 'enero' / 'febrero'      -> imprimir(mes + ' -> INVIERNO');   break;
  //        'marzo' / 'abril' / 'mayo'             -> imprimir(mes + ' -> PRIMAVERA');  break;
  //        'junio' / 'julio' / 'agosto'           -> imprimir(mes + ' -> VERANO');     break;
  //        'septiembre' / 'octubre' / 'noviembre' -> imprimir(mes + ' -> OTOÑO');      break;
  //        default -> imprimir('Mes no reconocido: ' + mes);
  //   3. Segundo ejemplo, switch (diaAComprobar):
  //        case 1..5 apilados -> imprimir('Dia ' + diaAComprobar + ' -> dia lectivo, hay clase'); break;
  //        case 0 y case 6    -> imprimir('Dia ' + diaAComprobar + ' -> fin de semana, el aula esta cerrada'); break;
  //        default            -> imprimir('Numero de dia invalido');
  //   Resultado esperado en pantalla:
  //      noviembre -> OTOÑO
  //      Dia 6 -> fin de semana, el aula esta cerrada
  //   (aprox. 32 lineas)

  // ✅ BUENA PRACTICA: cuando dejes un fall-through A PROPOSITO con codigo
  // en medio (no simples case apilados), escribe un comentario explicito
  // que lo diga. Ejemplo:  // fall-through intencionado
  // Asi quien lea el codigo sabe que no es un despiste tuyo.

  // ============================================================
  // 5. SWITCH (TRUE): TRABAJAR CON RANGOS
  // ------------------------------------------------------------
  // Un switch normal compara IGUALDAD, asi que no sirve para rangos:
  // no se puede escribir  case nota >= 9.
  //
  // El truco: en lugar de pasar el valor, pasamos el booleano true. Y en
  // cada case escribimos una expresion que se evalua a true o false. El
  // switch buscara el primer case cuyo resultado sea exactamente true.
  //
  // Resultado: una cadena if/else if disfrazada de switch, con una
  // alineacion visual muy comoda de leer.
  // ============================================================

  // DATO DE PARTIDA (ya escrito).
  const notaAlumno = 6.4;

  // TODO (en clase):
  //   1. titulo('5. SWITCH (TRUE) PARA RANGOS').
  //   2. imprimir('Nota del alumno:', notaAlumno).
  //   3. Escribe switch (true) { ... } (el valor comparado es el booleano
  //      true, no la nota) con estos cuatro tramos EN ESTE ORDEN:
  //        case notaAlumno >= 9 -> imprimir('  -> EXCELENTE');   break;
  //        case notaAlumno >= 7 -> imprimir('  -> BUENO');       break;
  //        case notaAlumno >= 5 -> imprimir('  -> SUFICIENTE');  break;
  //        default              -> imprimir('  -> INSUFICIENTE');
  //   4. Antes de ejecutar, pregunta a la clase por que rama entrara un 6.4.
  //   Resultado esperado en pantalla:
  //      Nota del alumno: 6.4
  //        -> SUFICIENTE
  //   (aprox. 14 lineas)

  // ⚠️ ERROR COMUN: escribir  switch (notaAlumno)  y luego
  // case notaAlumno >= 9. Eso compara la nota (6.4) contra un booleano
  // (false), no coincide nunca y siempre cae en el default.
  // Recuerda: switch (true), no switch (variable).

  // ⚠️ ERROR COMUN 2: en switch (true) el ORDEN manda, igual que en la
  // cadena if/else if. Si pones  case nota >= 5  el primero, un 10 se
  // clasificaria como SUFICIENTE.

  // ============================================================
  // 6. SWITCH FRENTE A IF / ELSE: CUAL USO
  // ------------------------------------------------------------
  // Los dos hacen lo mismo, asi que la eleccion es de LEGIBILIDAD:
  //
  //   Usa SWITCH cuando comparas UNA variable contra MUCHOS valores
  //   concretos y cerrados: un codigo de pais, un tipo de evento, un
  //   estado de pedido, la opcion de un menu. Se lee como una tabla.
  //
  //   Usa IF / ELSE cuando las condiciones son distintas entre si,
  //   combinan varias variables, o usan rangos y operadores logicos:
  //     if (edad >= 18 && tieneCarnet) ...
  //
  // Con dos o tres opciones simples, el if/else casi siempre gana. A
  // partir de cuatro o cinco valores fijos, el switch se lee mejor.
  // ============================================================

  // DATOS DE PARTIDA (ya escritos).
  const estadoPedido = 'enviado';
  const edad = 20;
  const tieneCarnetBiblioteca = true;

  // TODO (en clase):
  //   1. titulo('6. SWITCH FRENTE A IF / ELSE').
  //   2. imprimir('Version if/else:') y escribe la cadena
  //      if / else if / else sobre estadoPedido, repitiendo
  //      "estadoPedido ===" en cada linea, con estos mensajes:
  //        'pendiente'  -> '  Tu pedido esta pendiente de pago.'
  //        'preparando' -> '  Estamos preparando tu pedido.'
  //        'enviado'    -> '  Tu pedido va de camino.'
  //        'entregado'  -> '  Pedido entregado. Gracias por tu compra.'
  //        else         -> '  Estado desconocido.'
  //   3. imprimir('Version switch (misma logica, menos repeticion):') y
  //      reescribe EXACTAMENTE lo mismo con switch (estadoPedido),
  //      nombrando la variable una sola vez.
  //   4. Cierra con el caso que el switch NO puede expresar:
  //      if (edad >= 18 && tieneCarnetBiblioteca) que imprima
  //      'Caso multi-variable: puede llevarse libros a casa (solo con if).'
  //   Resultado esperado en pantalla:
  //      Version if/else:
  //        Tu pedido va de camino.
  //      Version switch (misma logica, menos repeticion):
  //        Tu pedido va de camino.
  //      Caso multi-variable: puede llevarse libros a casa (solo con if).
  //   (aprox. 30 lineas)

  // ============================================================
  // 7. EL AMBITO DE LAS VARIABLES DENTRO DE UN SWITCH
  // ------------------------------------------------------------
  // Todos los case comparten UN MISMO bloque: el del switch entero, no
  // uno por case. Por eso, si declaras  let mensaje  en dos case
  // distintos, obtienes un error de "ya declarada".
  //
  // Solucion: envolver el cuerpo del case en sus propias llaves { }.
  // ============================================================

  // DATO DE PARTIDA (ya escrito).
  const tipoUsuario = 'premium';

  // TODO (en clase):
  //   1. titulo('7. AMBITO DE VARIABLES EN UN SWITCH').
  //   2. switch (tipoUsuario) con CADA case envuelto en sus propias llaves:
  //        case 'gratuito': { const limiteDescargas = 3;
  //           imprimir('Plan gratuito: ' + limiteDescargas + ' descargas al mes'); break; }
  //        case 'premium': { const limiteDescargas = 100;
  //           imprimir('Plan premium: ' + limiteDescargas + ' descargas al mes'); break; }
  //        default: { imprimir('Tipo de usuario no reconocido'); }
  //   3. DEMOSTRACION EN VIVO: quita las llaves de los dos primeros case y
  //      recarga. Enseña el SyntaxError en consola y vuelve a ponerlas.
  //   Resultado esperado en pantalla:
  //      Plan premium: 100 descargas al mes
  //   (aprox. 16 lineas)

  // ⚠️ ERROR COMUN: sin esas llaves, el segundo  const limiteDescargas
  // provoca "SyntaxError: Identifier 'limiteDescargas' has already been
  // declared" y NO SE EJECUTA NADA del archivo. Es un error de sintaxis,
  // asi que rompe el archivo entero, no solo el switch.

  // ============================================================
  // 8. UN SWITCH QUE DEVUELVE VALORES DESDE UNA FUNCION
  // ------------------------------------------------------------
  // Dentro de una funcion, return sale de la funcion inmediatamente, asi
  // que hace innecesario el break: no hay forma de caer al case siguiente.
  // Es un patron muy usado y muy limpio.
  // ============================================================

  // DATOS DE PARTIDA (ya escritos). Codigos con los que probaremos la funcion.
  const codigosDePrueba = [200, 301, 403, 404, 500, 418];

  // TODO (en clase):
  //   1. titulo('8. SWITCH CON RETURN (SIN BREAK)').
  //   2. Escribe la funcion traducirCodigoHttp(codigo) con su comentario
  //      JSDoc (@param {number} codigo, @returns {string}). Dentro,
  //      switch (codigo) devolviendo con return y SIN ningun break:
  //        200 -> 'OK: todo ha ido bien'
  //        301 -> 'Movido permanentemente'
  //        400 -> 'Peticion incorrecta'
  //        401 y 403 apilados -> 'No tienes permiso para ver esto'
  //        404 -> 'No encontrado'
  //        500 -> 'Error interno del servidor'
  //        default -> 'Codigo no catalogado: ' + codigo
  //   3. Recorre codigosDePrueba con  for (const codigo of codigosDePrueba)
  //      e imprime:  imprimir(String(codigo).padEnd(5), '->', traducirCodigoHttp(codigo));
  //      padEnd(5) alinea la columna de codigos.
  //   Resultado esperado en pantalla:
  //      200   -> OK: todo ha ido bien
  //      301   -> Movido permanentemente
  //      403   -> No tienes permiso para ver esto
  //      404   -> No encontrado
  //      500   -> Error interno del servidor
  //      418   -> Codigo no catalogado: 418
  //   (aprox. 28 lineas)

  // ============================================================
  // 9. DEMOSTRACION DE alert() BAJO DEMANDA
  // ------------------------------------------------------------
  // alert() abre una ventana emergente que DETIENE la ejecucion hasta que
  // el usuario pulsa Aceptar. Por eso nunca se llama al cargar la pagina:
  // congelaria la carga y molestaria en cada recarga.
  //
  // Lo conectamos a un boton para que el docente lo muestre cuando quiera.
  // ============================================================

  // TODO (en clase):
  //   1. const botonAlert = document.getElementById('btn-alert-demo');
  //   2. Protege con  if (botonAlert) { ... }  antes de usarlo.
  //   3. Dentro, botonAlert.addEventListener('click', function () { ... }).
  //   4. En el cuerpo del clic:
  //      a) const momento = new Date().getHours();  // hora actual, 0 a 23
  //      b) let saludo;
  //      c) switch (true) con
  //           case momento < 6  -> saludo = 'Buenas noches (madrugada)'; break;
  //           case momento < 12 -> saludo = 'Buenos dias';               break;
  //           case momento < 20 -> saludo = 'Buenas tardes';             break;
  //           default           -> saludo = 'Buenas noches';
  //      d) window.alert(saludo + '. Son las ' + momento + ' horas.');
  //      e) imprimir('Se mostro un alert con el mensaje:', saludo);
  //   Resultado esperado: al pulsar "Ver un alert() de ejemplo" salta la
  //   ventana emergente y, al aceptarla, aparece en la consola visual
  //   "Se mostro un alert con el mensaje: ..." con el saludo de la hora.
  //   (aprox. 24 lineas)

  // ============================================================
  // 10. BOTON DE LIMPIAR CONSOLA
  // ============================================================

  // TODO (en clase):
  //   1. const botonLimpiar = document.getElementById('btn-limpiar-switch');
  //   2. if (botonLimpiar && salida) { ... }
  //   3. Dentro, botonLimpiar.addEventListener('click', function () { ... })
  //      y en el cuerpo asigna
  //      salida.textContent = 'Consola limpiada. Recarga la pagina (F5) para volver a ejecutar.\n';
  //   Resultado esperado: al pulsar "Limpiar consola" de la seccion 02 de
  //   la pagina, el bloque negro se vacia y muestra esa unica frase.
  //   (aprox. 7 lineas)

  // ✅ BUENA PRACTICA: nunca des por hecho que un elemento del HTML esta ahi.
  // Comprueba siempre que getElementById devolvio algo antes de usarlo.

  /**
   * ============================================================
   * EJERCICIOS PROPUESTOS - 02 SWITCH
   * ============================================================
   *
   * 1) MENU DE LA CAFETERIA (facil)
   *    Crea una variable "pedido" con un texto ('cafe', 'te', 'zumo',
   *    'agua'). Con un switch, imprime el precio de cada uno y usa el
   *    default para avisar de que ese producto no esta en la carta.
   *
   * 2) AGRUPAR CON FALL-THROUGH (facil)
   *    Escribe un switch que reciba una letra y diga si es vocal o
   *    consonante. Agrupa los cinco case de las vocales apilandolos, sin
   *    repetir el mismo codigo cinco veces.
   *
   * 3) CONVERSOR DE NOTA A LETRA (intermedio)
   *    Escribe una funcion notaALetra(nota) que devuelva 'A', 'B', 'C',
   *    'D' o 'F' segun el rango (9-10 es A, 7-8.9 es B, 6-6.9 es C,
   *    5-5.9 es D, menos de 5 es F). Usa switch (true) y return sin break.
   *    Valida ademas que la nota este entre 0 y 10; si no, devuelve
   *    'Nota invalida'.
   *
   * 4) CALCULADORA CON SWITCH (intermedio)
   *    Escribe calcular(a, operador, b) donde el operador es un texto:
   *    '+', '-', '*', '/' o '%'. Devuelve el resultado con un switch.
   *    Controla la division entre cero devolviendo un mensaje de error en
   *    lugar de Infinity.
   *
   * 5) DIAS DEL MES (avanzado)
   *    Escribe diasDelMes(mes, anio) que devuelva cuantos dias tiene ese
   *    mes. Agrupa con fall-through los meses de 31 dias y los de 30.
   *    Para febrero, calcula si el anio es bisiesto: lo es si es divisible
   *    entre 4, salvo que sea divisible entre 100 y no entre 400.
   *    Comprueba tu funcion con los anios 2024, 1900 y 2000.
   * ============================================================
   */
})();
