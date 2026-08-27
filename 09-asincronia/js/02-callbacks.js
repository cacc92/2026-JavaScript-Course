/**
 * ============================================================================
 * ARCHIVO: js/02-callbacks.js
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
 * ============================================================================
 */

(function () {
  'use strict';

  // ============================================================
  // 0. CONSOLA VISUAL DE ESTA SECCION
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
  // 1. DATOS DE EJEMPLO (nuestra "base de datos" de mentira)
  // ============================================================
  // Trabajamos con un caso realista: un instituto que guarda estudiantes,
  // sus notas y su tutor. Nada de foo, bar ni test123.

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

  function demoCallbackSincronoVsAsincrono() {
    titulo('2.1 - Callback sincrono vs callback asincrono');

    const notas = [8.5, 7, 9, 4, 6];

    // CALLBACK SINCRONO: filter llama a nuestra funcion 5 veces, AHORA MISMO,
    // y no devuelve el resultado hasta terminar.
    imprimir('Antes del filter');
    const aprobadas = notas.filter(function (nota) {
      return nota >= 5;   // este callback se ejecuta 5 veces sin pausa
    });
    imprimir('Notas aprobadas:', aprobadas);   // [8.5, 7, 9, 6]
    imprimir('Despues del filter -> el resultado YA esta listo.');

    imprimir('');

    // CALLBACK ASINCRONO: setTimeout guarda nuestra funcion para despues.
    imprimir('Antes del setTimeout');
    setTimeout(function () {
      imprimir('   ...dentro del callback asincrono (1 segundo despues)');
    }, 1000);
    imprimir('Despues del setTimeout -> esta linea sale ANTES que el callback.');

    imprimir('');
    imprimir('[!] ERROR COMUN: intentar usar el resultado de una operacion asincrona');
    imprimir('   en la linea siguiente. Todavia no existe. Solo existe DENTRO del callback.');
  }

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

  /**
   * buscarEstudiante(): simula una consulta a un servidor.
   * @param {number}   id       - identificador del estudiante
   * @param {Function} callback - se llamara como callback(error, estudiante)
   *
   * Fijate en que la funcion NO devuelve nada con return: el resultado
   * "sale" por el callback. Ese cambio de mentalidad es lo mas dificil
   * de los callbacks al principio.
   */
  function buscarEstudiante(id, callback) {
    imprimir('   -> consultando estudiante ' + id + '...');
    setTimeout(function () {
      const estudiante = BASE_DE_DATOS.estudiantes[id];
      if (!estudiante) {
        // Creamos un objeto Error de verdad: lleva mensaje y traza.
        callback(new Error('No existe ningun estudiante con id ' + id), null);
        return; // [!] ERROR COMUN: olvidar este return y llamar al callback DOS veces
      }
      callback(null, estudiante);
    }, 500);
  }

  /** buscarNotas(): devuelve el array de notas de un estudiante. */
  function buscarNotas(idEstudiante, callback) {
    imprimir('   -> consultando notas de ' + idEstudiante + '...');
    setTimeout(function () {
      const notas = BASE_DE_DATOS.notas[idEstudiante];
      if (!notas || notas.length === 0) {
        callback(new Error('El estudiante ' + idEstudiante + ' no tiene notas cargadas'), null);
        return;
      }
      callback(null, notas);
    }, 500);
  }

  /** buscarTutor(): devuelve los datos del tutor asignado. */
  function buscarTutor(idTutor, callback) {
    imprimir('   -> consultando tutor ' + idTutor + '...');
    setTimeout(function () {
      const tutor = BASE_DE_DATOS.tutores[idTutor];
      if (!tutor) {
        callback(new Error('No existe el tutor ' + idTutor), null);
        return;
      }
      callback(null, tutor);
    }, 500);
  }

  /** enviarBoletin(): simula el envio de un correo con el boletin de notas. */
  function enviarBoletin(correo, promedio, callback) {
    imprimir('   -> enviando boletin a ' + correo + '...');
    setTimeout(function () {
      callback(null, 'Boletin enviado a ' + correo + ' con promedio ' + promedio);
    }, 500);
  }

  /** calcularPromedio(): utilidad sincrona normal, sin callbacks. */
  function calcularPromedio(notas) {
    // reduce recorre el array acumulando un valor. El 0 final es el valor inicial.
    const suma = notas.reduce(function (acumulado, item) {
      return acumulado + item.nota;
    }, 0);
    // toFixed(2) devuelve un STRING con dos decimales. Number() lo vuelve numero.
    return Number((suma / notas.length).toFixed(2));
  }

  function demoErrorFirst() {
    titulo('2.2 - Convencion error-first: callback(error, datos)');
    imprimir('Primero pedimos un estudiante que SI existe (101):');

    buscarEstudiante(101, function (error, estudiante) {
      // ✅ BUENA PRACTICA: el error, lo primero de todo.
      if (error) {
        imprimir('   [ERROR] ' + error.message);
        return;
      }
      imprimir('   [OK] ' + estudiante.nombre + ' (' + estudiante.curso + ')');

      imprimir('');
      imprimir('Ahora pedimos uno que NO existe (999):');

      buscarEstudiante(999, function (error2, estudiante2) {
        if (error2) {
          imprimir('   [ERROR] ' + error2.message);
          imprimir('   Fijate: el error NO se lanza con throw, se ENTREGA por el callback.');
          return;
        }
        imprimir('   [OK] ' + estudiante2.nombre);
      });
    });
  }

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

  function demoCallbackHell() {
    titulo('2.3 - Callback hell: la piramide de la perdicion');
    imprimir('Objetivo: estudiante -> sus notas -> su tutor -> enviar boletin.');
    imprimir('Cuatro operaciones asincronas encadenadas. Mira la sangria del codigo.');
    imprimir('------------------------------------------------------------');

    // NIVEL 1 --------------------------------------------------------------
    buscarEstudiante(101, function (error, estudiante) {
      if (error) {
        imprimir('[ERROR nivel 1] ' + error.message);
        return;
      }
      imprimir('[1] Estudiante: ' + estudiante.nombre);

      // NIVEL 2 ------------------------------------------------------------
      buscarNotas(estudiante.id, function (error, notas) {
        if (error) {                                   // el mismo if OTRA VEZ
          imprimir('[ERROR nivel 2] ' + error.message);
          return;
        }
        const promedio = calcularPromedio(notas);
        imprimir('[2] Promedio: ' + promedio);

        // NIVEL 3 ----------------------------------------------------------
        buscarTutor(estudiante.idTutor, function (error, tutor) {
          if (error) {                                 // y OTRA VEZ
            imprimir('[ERROR nivel 3] ' + error.message);
            return;
          }
          imprimir('[3] Tutor: ' + tutor.nombre);

          // NIVEL 4 --------------------------------------------------------
          enviarBoletin(tutor.correo, promedio, function (error, confirmacion) {
            if (error) {                               // y OTRA VEZ MAS
              imprimir('[ERROR nivel 4] ' + error.message);
              return;
            }
            imprimir('[4] ' + confirmacion);
            imprimir('------------------------------------------------------------');
            imprimir('Cuatro niveles de sangria y CUATRO if (error) identicos.');
            imprimir('Imagina anadir ahora un paso 5 en medio de todo esto.');
            imprimir('[!] ERROR COMUN: pensar que "es solo cuestion de estilo".');
            imprimir('   El problema real es que el manejo de errores no se puede centralizar.');
          });
        });
      });
    });
  }

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
  function promisificar(funcionConCallback) {
    // La funcion devuelta acepta cualquier numero de argumentos (...args)
    // y les anade al final el callback que resuelve o rechaza la promesa.
    return function (...args) {
      return new Promise(function (resolve, reject) {
        funcionConCallback(...args, function (error, resultado) {
          if (error) {
            reject(error);   // error -> promesa rechazada
          } else {
            resolve(resultado); // exito -> promesa cumplida
          }
        });
      });
    };
  }

  // Creamos las versiones "con promesa" de nuestras cuatro funciones.
  const pBuscarEstudiante = promisificar(buscarEstudiante);
  const pBuscarNotas = promisificar(buscarNotas);
  const pBuscarTutor = promisificar(buscarTutor);
  const pEnviarBoletin = promisificar(enviarBoletin);

  function demoSinPiramide() {
    titulo('2.4 - La misma logica SIN piramide');
    imprimir('Mismos cuatro pasos, pero encadenados en vertical con .then().');
    imprimir('Un solo .catch() al final atiende los errores de TODA la cadena.');
    imprimir('------------------------------------------------------------');

    // Guardamos datos intermedios fuera de la cadena porque cada .then()
    // solo recibe el valor del anterior. Es una limitacion real del encadenado.
    let estudianteActual = null;
    let promedioActual = 0;

    pBuscarEstudiante(101)
      .then(function (estudiante) {
        estudianteActual = estudiante;
        imprimir('[1] Estudiante: ' + estudiante.nombre);
        return pBuscarNotas(estudiante.id);  // devolver una promesa la encadena
      })
      .then(function (notas) {
        promedioActual = calcularPromedio(notas);
        imprimir('[2] Promedio: ' + promedioActual);
        return pBuscarTutor(estudianteActual.idTutor);
      })
      .then(function (tutor) {
        imprimir('[3] Tutor: ' + tutor.nombre);
        return pEnviarBoletin(tutor.correo, promedioActual);
      })
      .then(function (confirmacion) {
        imprimir('[4] ' + confirmacion);
      })
      // UN SOLO catch para los cuatro pasos: aqui esta la gran victoria.
      .catch(function (error) {
        imprimir('[ERROR en algun punto de la cadena] ' + error.message);
      })
      .finally(function () {
        imprimir('------------------------------------------------------------');
        imprimir('Cero sangria acumulada, un unico manejo de errores.');
        imprimir('En el archivo 04 veremos que con async/await queda aun mas simple.');
      });
  }

  // ============================================================
  // 6. CONECTAR LOS BOTONES
  // ============================================================
  function alPulsar(id, manejador) {
    const boton = document.getElementById(id);
    if (!boton) {
      console.warn('[02-callbacks] No encuentro el boton con id "' + id + '".');
      return;
    }
    boton.addEventListener('click', manejador);
  }

  alPulsar('btn-callback-simple', demoCallbackSincronoVsAsincrono);
  alPulsar('btn-callback-error', demoErrorFirst);
  alPulsar('btn-callback-hell', demoCallbackHell);
  alPulsar('btn-callback-plano', demoSinPiramide);
  alPulsar('btn-limpiar-2', limpiar);

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
