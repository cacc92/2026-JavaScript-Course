/**
 * ============================================================
 * ARCHIVO: js/02-switch.js
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
 * RECUERDA: este archivo tambien esta envuelto en una IIFE para que su
 * funcion "imprimir" no choque con la del archivo 01, que se llama igual.
 * Sin la IIFE el navegador lanzaria:
 *   "Identifier 'imprimir' has already been declared".
 */

(function () {
  'use strict';

  // ============================================================
  // 0. HERRAMIENTAS DE SALIDA
  // ============================================================

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

  titulo('1. ANATOMIA DE UN SWITCH');

  // Simulamos el dia de la semana que devuelve el navegador.
  // getDay() da 0 para domingo, 1 para lunes... 6 para sabado.
  // Fijamos un valor concreto para que la clase vea siempre lo mismo.
  const diaSemana = 3; // Miercoles

  imprimir('Valor de diaSemana:', diaSemana);

  switch (diaSemana) {
    case 1:
      imprimir('Lunes: clase de HTML y CSS');
      break; // El break sale del switch. Sin el, seguiria al case 2.
    case 2:
      imprimir('Martes: clase de JavaScript');
      break;
    case 3:
      imprimir('Miercoles: taller de control de flujo'); // <- Se ejecuta este
      break;
    case 4:
      imprimir('Jueves: proyecto en grupo');
      break;
    case 5:
      imprimir('Viernes: repaso y entrega');
      break;
    default:
      // default es el "cajon de sastre": se ejecuta cuando ningun case
      // coincide. Equivale al else final de una cadena if/else if.
      imprimir('Fin de semana: no hay clase');
  }

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

  titulo('2. EL SWITCH COMPARA CON ===');

  const diaComoTexto = '3'; // Ojo: entre comillas, es un string

  imprimir('Comparando el texto "3" contra case 3 (numero):');

  switch (diaComoTexto) {
    case 3:
      imprimir('  Entro en case 3 (numero)'); // NO se ejecuta
      break;
    case '3':
      imprimir('  Entro en case "3" (texto) -> el switch usa ===');
      break;
    default:
      imprimir('  No coincidio ningun case');
  }

  // ✅ BUENA PRACTICA: convierte el dato ANTES de entrar al switch, para
  // que dentro solo compares peras con peras.
  const diaConvertido = Number(diaComoTexto); // Ahora si es el numero 3

  switch (diaConvertido) {
    case 3:
      imprimir('  Tras Number("3") -> ahora si entra en case 3');
      break;
    default:
      imprimir('  No coincidio ningun case');
  }

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

  titulo('3. EL PELIGRO DEL FALL-THROUGH');

  const rolUsuario = 'editor';

  imprimir('Switch SIN break (mal), con rol =', rolUsuario);

  switch (rolUsuario) {
    case 'administrador':
      imprimir('  Puede borrar usuarios');
    // ⚠️ ERROR COMUN: aqui falta un break
    case 'editor':
      imprimir('  Puede publicar articulos'); // Coincide y entra
    // ⚠️ ERROR COMUN: aqui tambien falta el break, asi que sigue cayendo
    case 'lector':
      imprimir('  Puede leer articulos'); // Se ejecuta sin querer
    default:
      imprimir('  Puede ver la pagina de inicio'); // Y este tambien
  }

  imprimir('Resultado: se imprimieron 3 lineas cuando solo esperabamos 1.');

  // La version correcta, con sus break en su sitio:
  imprimir('\nSwitch CON break (bien), con rol =', rolUsuario);

  switch (rolUsuario) {
    case 'administrador':
      imprimir('  Puede borrar usuarios');
      break;
    case 'editor':
      imprimir('  Puede publicar articulos');
      break; // Cortamos aqui: no cae a lector
    case 'lector':
      imprimir('  Puede leer articulos');
      break;
    default:
      imprimir('  Puede ver la pagina de inicio');
  }

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

  titulo('4. FALL-THROUGH UTIL: AGRUPAR CASOS');

  const mes = 'noviembre';

  switch (mes) {
    // Estos tres case comparten cuerpo: no hay codigo entre ellos.
    case 'diciembre':
    case 'enero':
    case 'febrero':
      imprimir(mes + ' -> INVIERNO');
      break;
    case 'marzo':
    case 'abril':
    case 'mayo':
      imprimir(mes + ' -> PRIMAVERA');
      break;
    case 'junio':
    case 'julio':
    case 'agosto':
      imprimir(mes + ' -> VERANO');
      break;
    case 'septiembre':
    case 'octubre':
    case 'noviembre':
      imprimir(mes + ' -> OTOÑO'); // Coincide en el tercer case del grupo
      break;
    default:
      imprimir('Mes no reconocido: ' + mes);
  }

  // Segundo ejemplo util: dias laborables frente a fin de semana.
  const diaAComprobar = 6; // Sabado

  switch (diaAComprobar) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      imprimir('Dia ' + diaAComprobar + ' -> dia lectivo, hay clase');
      break;
    case 0:
    case 6:
      imprimir('Dia ' + diaAComprobar + ' -> fin de semana, el aula esta cerrada');
      break;
    default:
      imprimir('Numero de dia invalido');
  }

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

  titulo('5. SWITCH (TRUE) PARA RANGOS');

  const notaAlumno = 6.4;

  imprimir('Nota del alumno:', notaAlumno);

  switch (true) {
    case notaAlumno >= 9:
      imprimir('  -> EXCELENTE');
      break;
    case notaAlumno >= 7:
      imprimir('  -> BUENO');
      break;
    case notaAlumno >= 5:
      imprimir('  -> SUFICIENTE'); // 6.4 entra aqui
      break;
    default:
      imprimir('  -> INSUFICIENTE');
  }

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

  titulo('6. SWITCH FRENTE A IF / ELSE');

  const estadoPedido = 'enviado';

  // VERSION IF / ELSE: repetimos "estadoPedido ===" en cada linea.
  imprimir('Version if/else:');
  if (estadoPedido === 'pendiente') {
    imprimir('  Tu pedido esta pendiente de pago.');
  } else if (estadoPedido === 'preparando') {
    imprimir('  Estamos preparando tu pedido.');
  } else if (estadoPedido === 'enviado') {
    imprimir('  Tu pedido va de camino.');
  } else if (estadoPedido === 'entregado') {
    imprimir('  Pedido entregado. Gracias por tu compra.');
  } else {
    imprimir('  Estado desconocido.');
  }

  // VERSION SWITCH: la variable se nombra UNA sola vez, arriba.
  imprimir('Version switch (misma logica, menos repeticion):');
  switch (estadoPedido) {
    case 'pendiente':
      imprimir('  Tu pedido esta pendiente de pago.');
      break;
    case 'preparando':
      imprimir('  Estamos preparando tu pedido.');
      break;
    case 'enviado':
      imprimir('  Tu pedido va de camino.');
      break;
    case 'entregado':
      imprimir('  Pedido entregado. Gracias por tu compra.');
      break;
    default:
      imprimir('  Estado desconocido.');
  }

  // Un caso donde el switch NO sirve: condiciones con varias variables.
  const edad = 20;
  const tieneCarnetBiblioteca = true;

  // Esto solo se puede expresar bien con if:
  if (edad >= 18 && tieneCarnetBiblioteca) {
    imprimir('Caso multi-variable: puede llevarse libros a casa (solo con if).');
  }

  // ============================================================
  // 7. EL AMBITO DE LAS VARIABLES DENTRO DE UN SWITCH
  // ------------------------------------------------------------
  // Todos los case comparten UN MISMO bloque: el del switch entero, no
  // uno por case. Por eso, si declaras  let mensaje  en dos case
  // distintos, obtienes un error de "ya declarada".
  //
  // Solucion: envolver el cuerpo del case en sus propias llaves { }.
  // ============================================================

  titulo('7. AMBITO DE VARIABLES EN UN SWITCH');

  const tipoUsuario = 'premium';

  switch (tipoUsuario) {
    // Las llaves crean un bloque propio para este case.
    case 'gratuito': {
      const limiteDescargas = 3; // Vive solo dentro de estas llaves
      imprimir('Plan gratuito: ' + limiteDescargas + ' descargas al mes');
      break;
    }
    case 'premium': {
      // Podemos repetir el mismo nombre porque estamos en otro bloque.
      const limiteDescargas = 100;
      imprimir('Plan premium: ' + limiteDescargas + ' descargas al mes');
      break;
    }
    default: {
      imprimir('Tipo de usuario no reconocido');
    }
  }

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

  titulo('8. SWITCH CON RETURN (SIN BREAK)');

  /**
   * traducirCodigoHttp(): devuelve el significado de un codigo de estado.
   * @param {number} codigo - Codigo HTTP, por ejemplo 404
   * @returns {string} Descripcion en español
   */
  function traducirCodigoHttp(codigo) {
    switch (codigo) {
      case 200:
        return 'OK: todo ha ido bien'; // return ya sale: no hace falta break
      case 301:
        return 'Movido permanentemente';
      case 400:
        return 'Peticion incorrecta';
      case 401:
      case 403:
        // Fall-through intencionado: los dos comparten respuesta.
        return 'No tienes permiso para ver esto';
      case 404:
        return 'No encontrado';
      case 500:
        return 'Error interno del servidor';
      default:
        return 'Codigo no catalogado: ' + codigo;
    }
  }

  // Probamos la funcion con varios codigos. Ya usamos un for...of, que
  // se explica a fondo en el archivo 03.
  const codigosDePrueba = [200, 301, 403, 404, 500, 418];

  for (const codigo of codigosDePrueba) {
    // String(codigo).padEnd(5) alinea la columna de codigos.
    imprimir(String(codigo).padEnd(5), '->', traducirCodigoHttp(codigo));
  }

  // ============================================================
  // 9. DEMOSTRACION DE alert() BAJO DEMANDA
  // ------------------------------------------------------------
  // alert() abre una ventana emergente que DETIENE la ejecucion hasta que
  // el usuario pulsa Aceptar. Por eso nunca se llama al cargar la pagina:
  // congelaria la carga y molestaria en cada recarga.
  //
  // Lo conectamos a un boton para que el docente lo muestre cuando quiera.
  // ============================================================

  const botonAlert = document.getElementById('btn-alert-demo');

  if (botonAlert) {
    // addEventListener('click', funcion) ejecuta la funcion en cada clic.
    botonAlert.addEventListener('click', function () {
      const momento = new Date().getHours(); // Hora actual: 0 a 23
      let saludo;

      // Otro switch (true), ahora sobre la hora del dia.
      switch (true) {
        case momento < 6:
          saludo = 'Buenas noches (madrugada)';
          break;
        case momento < 12:
          saludo = 'Buenos dias';
          break;
        case momento < 20:
          saludo = 'Buenas tardes';
          break;
        default:
          saludo = 'Buenas noches';
      }

      // El alert solo ocurre AQUI, dentro del clic, nunca al cargar.
      window.alert(saludo + '. Son las ' + momento + ' horas.');
      imprimir('Se mostro un alert con el mensaje:', saludo);
    });
  }

  // ============================================================
  // 10. BOTON DE LIMPIAR CONSOLA
  // ============================================================

  const botonLimpiar = document.getElementById('btn-limpiar-switch');

  if (botonLimpiar && salida) {
    botonLimpiar.addEventListener('click', function () {
      salida.textContent = 'Consola limpiada. Recarga la pagina (F5) para volver a ejecutar.\n';
    });
  }

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
