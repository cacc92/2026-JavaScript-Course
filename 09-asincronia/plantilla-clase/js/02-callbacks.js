/**
 * ============================================================================
 * ARCHIVO: js/02-callbacks.js   ·   PLANTILLA DE CLASE (sin resolver)
 * TEMA:    Callbacks asincronos, la convencion error-first y el famoso
 *          "callback hell" (la piramide de la perdicion).
 *
 * QUE VAS A APRENDER
 *  1. Que es exactamente un callback (y que NO tiene nada de magico).
 *  2. La diferencia entre un callback SINCRONO y uno ASINCRONO.
 *  3. La convencion error-first: callback(error, datos).
 *  4. Por que anidar callbacks produce codigo imposible de mantener.
 *  5. Como ese mismo codigo queda plano con promesas (adelanto del archivo 03).
 *
 * IIFE: igual que en el archivo anterior, todo va dentro de
 * (function () { ... })(); para que sus variables no choquen con las de los
 * otros cuatro archivos que carga el mismo index.html.
 *
 * COMO SE USA ESTA PLANTILLA
 * La teoria esta entera; el codigo se escribe en vivo siguiendo cada bloque
 * "TODO (en clase)". La solucion esta en ../js/02-callbacks.js
 * ============================================================================
 */

(function () {
  'use strict';

  // ============================================================
  // 0. CONSOLA VISUAL DE ESTA SECCION   [YA ESCRITO]
  // ============================================================
  // Ojo: esta funcion tambien se llama "imprimir", igual que en
  // 01-event-loop.js. No hay conflicto porque cada una vive DENTRO de su
  // propia IIFE. Ese es justo el problema que la IIFE viene a resolver.
  const consola = document.getElementById('salida-callbacks');

  function imprimir(...mensajes) {
    console.log(...mensajes);
    if (!consola) return;
    const texto = mensajes
      .map((m) => (typeof m === 'object' && m !== null ? JSON.stringify(m, null, 2) : String(m)))
      .join(' ');
    consola.textContent += texto + '\n';
    consola.scrollTop = consola.scrollHeight;
  }

  function titulo(texto) {
    imprimir('\n============================================================');
    imprimir('  ' + texto);
    imprimir('============================================================');
  }

  function limpiar() {
    if (consola) consola.textContent = '';
  }

  // ============================================================
  // 1. DATOS DE EJEMPLO (nuestra "base de datos" de mentira)   [YA ESCRITO]
  // ============================================================
  // Trabajamos con un caso realista: un instituto que guarda estudiantes,
  // sus notas y su tutor. Nada de foo, bar ni test123.
  //
  // Estos datos vienen escritos a proposito: teclearlos en clase es tiempo
  // perdido. Lo que se escribe en vivo es la LOGICA que los consulta.

  const BASE_DE_DATOS = {
    estudiantes: {
      101: { id: 101, nombre: 'Lucia Ferreira', curso: '2.º DAW', idTutor: 7 },
      102: { id: 102, nombre: 'Mateo Aguirre', curso: '2.º DAW', idTutor: 7 },
      103: { id: 103, nombre: 'Sofia Duarte', curso: '1.º DAM', idTutor: 9 }
    },
    notas: {
      101: [{ asignatura: 'JavaScript', nota: 8.5 }, { asignatura: 'CSS', nota: 7 }, { asignatura: 'Bases de datos', nota: 9 }],
      102: [{ asignatura: 'JavaScript', nota: 6 }, { asignatura: 'CSS', nota: 5.5 }, { asignatura: 'Bases de datos', nota: 4 }],
      103: [{ asignatura: 'JavaScript', nota: 9.5 }, { asignatura: 'CSS', nota: 9 }, { asignatura: 'Bases de datos', nota: 10 }]
    },
    tutores: {
      7: { id: 7, nombre: 'Ana Belmonte', correo: 'ana.belmonte@instituto.edu' },
      9: { id: 9, nombre: 'Carlos Prieto', correo: 'carlos.prieto@instituto.edu' }
    }
  };

  // ============================================================
  // 2. QUE ES UN CALLBACK
  // ============================================================
  // Un callback es SOLO esto: una funcion que le pasamos a otra funcion
  // como argumento, para que esa otra la llame cuando le convenga.
  //
  // En JavaScript las funciones son "ciudadanos de primera clase": se pueden
  // guardar en variables, meter en arrays y pasar como argumento, igual que
  // un numero o un texto. Por eso los callbacks son posibles.
  //
  // Ya usas callbacks todos los dias sin llamarlos asi:
  //   array.map(function (x) { ... })            <- callback SINCRONO
  //   boton.addEventListener('click', funcion)   <- callback ASINCRONO
  //
  // La diferencia clave:
  //   SINCRONO  -> se ejecuta durante la llamada, antes de seguir adelante.
  //   ASINCRONO -> se guarda para mas tarde; el programa sigue mientras tanto.

  // TODO (en clase):
  //   1. Declara demoCallbackSincronoVsAsincrono() con
  //      titulo('2.1 - Callback sincrono vs callback asincrono').
  //   2. Crea const notas = [8.5, 7, 9, 4, 6].
  //   3. CALLBACK SINCRONO: imprime 'Antes del filter', filtra el array con
  //      notas.filter(function (nota) { return nota >= 5; }) guardandolo en
  //      'aprobadas', e imprime 'Notas aprobadas:' junto al array y despues
  //      'Despues del filter -> el resultado YA esta listo.'
  //   4. Imprime una linea vacia con imprimir('').
  //   5. CALLBACK ASINCRONO: imprime 'Antes del setTimeout', programa un
  //      setTimeout de 1000 ms que imprima
  //      '   ...dentro del callback asincrono (1 segundo despues)' y despues
  //      imprime 'Despues del setTimeout -> esta linea sale ANTES que el callback.'
  //   6. Cierra con el aviso, en dos lineas:
  //      '[!] ERROR COMUN: intentar usar el resultado de una operacion asincrona'
  //      '   en la linea siguiente. Todavia no existe. Solo existe DENTRO del callback.'
  //   Resultado esperado en pantalla (consola · callbacks): "Notas aprobadas:
  //   [8.5, 7, 9, 6]" sale de inmediato; el mensaje del setTimeout, un segundo
  //   despues del "Despues del setTimeout".
  //   (aprox. 27 lineas)

  // ============================================================
  // 3. LA CONVENCION ERROR-FIRST
  // ============================================================
  // Un callback asincrono no puede usar try/catch normal ni devolver un valor
  // con return: cuando el error ocurre, la funcion que lo llamo ya termino.
  //
  // La solucion historica (nacida en Node.js) es la convencion ERROR-FIRST:
  // el callback recibe SIEMPRE dos parametros y en este orden:
  //
  //     callback(error, datos)
  //
  //   - Si algo fallo: error contiene el problema y datos vale null.
  //   - Si todo fue bien: error vale null y datos trae el resultado.
  //
  // ✅ BUENA PRACTICA: comprobar el error en la PRIMERA linea del callback
  // y salir con return. Asi el resto del codigo ya sabe que todo fue bien.
  //
  // ⚠️ ERROR COMUN: olvidar el return despues de llamar al callback con error,
  // y acabar llamando al callback DOS veces.

  /**
   * buscarEstudiante(): simula una consulta a un servidor.
   * @param {number}   id       - identificador del estudiante
   * @param {Function} callback - se llamara como callback(error, estudiante)
   *
   * Fijate en que la funcion NO devuelve nada con return: el resultado
   * "sale" por el callback. Ese cambio de mentalidad es lo mas dificil
   * de los callbacks al principio.
   */
  // TODO (en clase):
  //   1. Declara buscarEstudiante(id, callback).
  //   2. Imprime '   -> consultando estudiante <id>...'.
  //   3. Dentro de un setTimeout de 500 ms, busca
  //      BASE_DE_DATOS.estudiantes[id]. Si no existe, llama a
  //      callback(new Error('No existe ningun estudiante con id ' + id), null)
  //      y SAL con return. Si existe, llama a callback(null, estudiante).
  //   Resultado esperado: buscarEstudiante(101, ...) entrega tras medio segundo
  //   el objeto de Lucia Ferreira; con el id 999 entrega un Error.
  //   (aprox. 12 lineas)

  /** buscarNotas(): devuelve el array de notas de un estudiante. */
  // TODO (en clase):
  //   1. Declara buscarNotas(idEstudiante, callback) con la misma forma.
  //   2. Imprime '   -> consultando notas de <idEstudiante>...'.
  //   3. Tras 500 ms, lee BASE_DE_DATOS.notas[idEstudiante]. Si no hay array o
  //      esta vacio, entrega el Error
  //      'El estudiante <id> no tiene notas cargadas' y return.
  //      Si lo hay, callback(null, notas).
  //   (aprox. 11 lineas)

  /** buscarTutor(): devuelve los datos del tutor asignado. */
  // TODO (en clase):
  //   1. Declara buscarTutor(idTutor, callback), imprime
  //      '   -> consultando tutor <idTutor>...' y, tras 500 ms, lee
  //      BASE_DE_DATOS.tutores[idTutor].
  //   2. Si no existe, Error 'No existe el tutor <id>'; si existe,
  //      callback(null, tutor).
  //   (aprox. 11 lineas)

  /** enviarBoletin(): simula el envio de un correo con el boletin de notas. */
  // TODO (en clase):
  //   1. Declara enviarBoletin(correo, promedio, callback).
  //   2. Imprime '   -> enviando boletin a <correo>...'.
  //   3. Tras 500 ms llama a callback(null, 'Boletin enviado a <correo> con
  //      promedio <promedio>'). Esta funcion nunca falla.
  //   (aprox. 6 lineas)

  /** calcularPromedio(): utilidad sincrona normal, sin callbacks. */
  // TODO (en clase):
  //   1. Declara calcularPromedio(notas).
  //   2. Suma las notas con notas.reduce(function (acumulado, item) { ... }, 0)
  //      (reduce recorre el array acumulando un valor; el 0 es el valor inicial).
  //   3. Devuelve Number((suma / notas.length).toFixed(2)): toFixed(2) da un
  //      STRING con dos decimales y Number() lo vuelve numero.
  //   Resultado esperado: con las notas del estudiante 101 devuelve 8.17.
  //   (aprox. 8 lineas)

  // TODO (en clase):
  //   1. Declara demoErrorFirst() con
  //      titulo('2.2 - Convencion error-first: callback(error, datos)').
  //   2. Imprime 'Primero pedimos un estudiante que SI existe (101):' y llama a
  //      buscarEstudiante(101, function (error, estudiante) { ... }).
  //   3. Dentro: si hay error imprime '   [ERROR] ' + error.message y return
  //      (el error, LO PRIMERO de todo). Si no, imprime
  //      '   [OK] <nombre> (<curso>)'.
  //   4. A continuacion, dentro de ese mismo callback, imprime una linea vacia y
  //      'Ahora pedimos uno que NO existe (999):' y anida
  //      buscarEstudiante(999, function (error2, estudiante2) { ... }).
  //   5. En ese segundo callback, si hay error2 imprime su mensaje y ademas
  //      '   Fijate: el error NO se lanza con throw, se ENTREGA por el callback.'
  //   Resultado esperado en pantalla: "[OK] Lucia Ferreira (2.º DAW)" y despues
  //   "[ERROR] No existe ningun estudiante con id 999".
  //   (aprox. 25 lineas)

  // ============================================================
  // 4. CALLBACK HELL: LA PIRAMIDE DE LA PERDICION
  // ============================================================
  // Cuando una tarea depende del resultado de la anterior, y esa de la
  // anterior, y asi cuatro o cinco veces, el codigo se desplaza hacia la
  // derecha formando una piramide tumbada:
  //
  //     hacerA(function () {
  //       hacerB(function () {
  //         hacerC(function () {
  //           hacerD(function () {
  //             // aqui ya no cabe en la pantalla del proyector
  //           });
  //         });
  //       });
  //     });
  //
  // Problemas reales, no esteticos:
  //   - El manejo de errores se REPITE en cada nivel.
  //   - Es dificilisimo insertar un paso nuevo en medio.
  //   - No se puede reutilizar ningun trozo por separado.
  //   - Leer el flujo obliga a saltar arriba y abajo continuamente.

  // TODO (en clase):
  //   1. Declara demoCallbackHell() con
  //      titulo('2.3 - Callback hell: la piramide de la perdicion') y dos lineas
  //      de contexto: 'Objetivo: estudiante -> sus notas -> su tutor -> enviar boletin.'
  //      y 'Cuatro operaciones asincronas encadenadas. Mira la sangria del codigo.'
  //      seguidas de una linea de guiones.
  //   2. NIVEL 1: buscarEstudiante(101, ...). Si hay error imprime
  //      '[ERROR nivel 1] ' + error.message y return; si no,
  //      '[1] Estudiante: ' + estudiante.nombre.
  //   3. NIVEL 2 (dentro del anterior): buscarNotas(estudiante.id, ...), con su
  //      propio if (error) -> '[ERROR nivel 2] ...'. Calcula
  //      const promedio = calcularPromedio(notas) e imprime '[2] Promedio: ' + promedio.
  //   4. NIVEL 3 (dentro del 2): buscarTutor(estudiante.idTutor, ...) con
  //      '[ERROR nivel 3] ...' e imprime '[3] Tutor: ' + tutor.nombre.
  //   5. NIVEL 4 (dentro del 3): enviarBoletin(tutor.correo, promedio, ...) con
  //      '[ERROR nivel 4] ...' e imprime '[4] ' + confirmacion.
  //   6. Cierra dentro del nivel 4 con la moraleja:
  //      'Cuatro niveles de sangria y CUATRO if (error) identicos.'
  //      'Imagina anadir ahora un paso 5 en medio de todo esto.'
  //      '[!] ERROR COMUN: pensar que "es solo cuestion de estilo".'
  //      '   El problema real es que el manejo de errores no se puede centralizar.'
  //   Resultado esperado: las cuatro lineas [1] [2] [3] [4] salen con medio segundo
  //   de separacion, y el promedio de Lucia es 8.17.
  //   (aprox. 48 lineas)

  // ============================================================
  // 5. LA MISMA LOGICA, PLANA, CON PROMESAS
  // ============================================================
  // Adelanto de lo que veremos en el archivo 03. La tecnica de convertir una
  // funcion de callbacks en una funcion que devuelve promesa se llama
  // "promisificar". Es un patron que vale para cualquier API antigua.
  //
  // ✅ BUENA PRACTICA: no reescribas la funcion original; envuelvela.

  /**
   * promisificar(funcionConCallback): recibe una funcion estilo error-first
   * y devuelve otra que hace lo mismo pero devolviendo una promesa.
   */
  // TODO (en clase):
  //   1. Declara promisificar(funcionConCallback).
  //   2. Devuelve una funcion que acepte cualquier numero de argumentos
  //      (...args) y que a su vez devuelva un new Promise(function (resolve, reject) { ... }).
  //   3. Dentro del ejecutor, llama a funcionConCallback(...args, function (error, resultado) { ... }):
  //      si hay error -> reject(error); si no -> resolve(resultado).
  //   4. Justo debajo, crea las cuatro versiones "con promesa" con const:
  //        pBuscarEstudiante = promisificar(buscarEstudiante)
  //        pBuscarNotas      = promisificar(buscarNotas)
  //        pBuscarTutor      = promisificar(buscarTutor)
  //        pEnviarBoletin    = promisificar(enviarBoletin)
  //   Resultado esperado: pBuscarEstudiante(101) devuelve una promesa que se
  //   cumple con el objeto de Lucia Ferreira.
  //   (aprox. 19 lineas)

  // TODO (en clase):
  //   1. Declara demoSinPiramide() con titulo('2.4 - La misma logica SIN piramide'),
  //      dos lineas de contexto ('Mismos cuatro pasos, pero encadenados en vertical
  //      con .then().' y 'Un solo .catch() al final atiende los errores de TODA la
  //      cadena.') y una linea de guiones.
  //   2. Declara con let dos variables fuera de la cadena para guardar datos
  //      intermedios: estudianteActual = null y promedioActual = 0. Hacen falta
  //      porque cada .then() solo recibe el valor del anterior.
  //   3. Encadena en vertical:
  //        pBuscarEstudiante(101)
  //          .then -> guarda estudianteActual, imprime '[1] Estudiante: <nombre>'
  //                   y DEVUELVE pBuscarNotas(estudiante.id)
  //          .then -> promedioActual = calcularPromedio(notas), imprime
  //                   '[2] Promedio: <promedio>' y devuelve
  //                   pBuscarTutor(estudianteActual.idTutor)
  //          .then -> imprime '[3] Tutor: <nombre>' y devuelve
  //                   pEnviarBoletin(tutor.correo, promedioActual)
  //          .then -> imprime '[4] ' + confirmacion
  //          .catch -> imprime '[ERROR en algun punto de la cadena] ' + error.message
  //          .finally -> imprime la linea de guiones,
  //                   'Cero sangria acumulada, un unico manejo de errores.' y
  //                   'En el archivo 04 veremos que con async/await queda aun mas simple.'
  //   Resultado esperado: la MISMA salida que demoCallbackHell(), pero el codigo
  //   no se desplaza ni un nivel a la derecha.
  //   (aprox. 39 lineas)

  // ============================================================
  // 6. CONECTAR LOS BOTONES
  // ============================================================
  // TODO (en clase):
  //   1. Escribe alPulsar(id, manejador) igual que en el archivo 01, avisando con
  //      console.warn('[02-callbacks] No encuentro el boton con id "' + id + '".')
  //      cuando el id no exista.
  //   2. Engancha los cinco botones de la seccion 2:
  //        'btn-callback-simple' -> demoCallbackSincronoVsAsincrono
  //        'btn-callback-error'  -> demoErrorFirst
  //        'btn-callback-hell'   -> demoCallbackHell
  //        'btn-callback-plano'  -> demoSinPiramide
  //        'btn-limpiar-2'       -> limpiar
  //   (aprox. 14 lineas)

  // ============================================================
  // 7. EJERCICIOS PROPUESTOS
  // ============================================================
  /*
    EJERCICIO 1 (facil) - Tu primer callback asincrono
    Escribe una funcion saludarDespues(nombre, milisegundos, callback) que
    espere el tiempo indicado y despues llame al callback pasandole el texto
    "Hola, <nombre>". Pruebala con tres nombres y tiempos distintos y observa
    en que orden aparecen los saludos.

    EJERCICIO 2 (facil) - Error-first bien hecho
    Anade a BASE_DE_DATOS un objeto "matriculas". Escribe
    buscarMatricula(idEstudiante, callback) siguiendo la convencion
    error-first. Debe fallar con un Error descriptivo si el estudiante no
    tiene matricula. Prueba los dos casos: uno que existe y otro que no.

    EJERCICIO 3 (medio) - Amplia la piramide
    Anade un quinto paso a demoCallbackHell(): despues de enviar el boletin,
    registrar la accion en un historial con
    registrarHistorial(texto, callback). Cronometra cuanto tardas en hacerlo
    y en no equivocarte con las llaves. Ese tiempo ES el coste del callback hell.

    EJERCICIO 4 (medio) - Callback hell con datos que faltan
    Repite demoCallbackHell() pero pidiendo el estudiante 999 (no existe) y
    despues el 103 (existe, pero cambia su idTutor a 99 para que el tutor falle).
    Comprueba que cada error se captura en su nivel correcto y que la cadena
    se detiene sin dejar la interfaz a medias.

    EJERCICIO 5 (dificil) - Promisificar de verdad
    Usa promisificar() sobre buscarMatricula (ejercicio 2) y reescribe todo el
    flujo del boletin con .then(). Despues, en el archivo 04, vuelve a
    reescribirlo con async/await y compara los tres estilos lado a lado:
    ¿cual es mas corto?, ¿cual se lee mejor?, ¿cual trata mejor los errores?
  */
})();
