/**
 * ============================================================================
 * ARCHIVO: js/03-promesas.js
 * TEMA:    Promesas. Los tres estados, new Promise(resolve, reject),
 *          then / catch / finally, el encadenado, los errores clasicos
 *          y los cuatro combinadores (all, allSettled, race, any).
 *
 * QUE VAS A APRENDER
 *  1. Que es una promesa y por que resuelve los problemas de los callbacks.
 *  2. Los tres estados y la regla de que solo se cambia de estado UNA vez.
 *  3. A crear promesas propias con new Promise((resolve, reject) => ...).
 *  4. A encadenar .then() devolviendo valores y devolviendo promesas.
 *  5. Los dos errores que TODO el mundo comete: olvidar el return dentro de
 *     un then, y colocar el catch donde no captura nada.
 *  6. Cuando usar Promise.all, allSettled, race o any.
 *
 * IIFE: todo encerrado para que no choque con los otros archivos .js.
 * ============================================================================
 */

(function () {
  'use strict';

  // ============================================================
  // 0. CONSOLA VISUAL DE ESTA SECCION
  // ============================================================
  const consola = document.getElementById('salida-promesas');

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

  /**
   * cronometro(): devuelve una funcion que, cada vez que se llama, informa de
   * los milisegundos transcurridos desde que se creo.
   * performance.now() es mas preciso que Date.now() para medir duraciones.
   */
  function cronometro() {
    const inicio = performance.now();
    return function () {
      return Math.round(performance.now() - inicio) + ' ms';
    };
  }

  // ============================================================
  // 1. QUE ES UNA PROMESA
  // ============================================================
  // Una promesa es un OBJETO que representa un resultado que todavia no
  // existe pero que existira: o un valor, o un error.
  //
  // Analogia: pides una hamburguesa y te dan un ticket con un numero.
  // El ticket NO es la hamburguesa, pero te garantiza que va a pasar una de
  // dos cosas: o te llaman y te la dan (cumplida), o te dicen que se acabo
  // la carne y te devuelven el dinero (rechazada). Nunca las dos.
  //
  // LOS TRES ESTADOS
  //   pending   (pendiente)  -> aun trabajando. Es el estado inicial.
  //   fulfilled (cumplida)   -> hay un VALOR. Se llamo a resolve(valor).
  //   rejected  (rechazada)  -> hay un ERROR. Se llamo a reject(error).
  //
  // REGLA DE HIERRO: una promesa cambia de estado UNA SOLA VEZ y ya no
  // vuelve atras. La segunda llamada a resolve() o reject() se ignora
  // en silencio. Esto es una garantia, no un fallo.

  // ============================================================
  // 2. CREAR UNA PROMESA CON new Promise
  // ============================================================
  // new Promise recibe una funcion llamada EJECUTOR con dos parametros:
  //
  //     new Promise(function (resolve, reject) { ... })
  //
  //   resolve(valor) -> pasa la promesa a CUMPLIDA con ese valor.
  //   reject(error)  -> pasa la promesa a RECHAZADA con ese error.
  //
  // El ejecutor se ejecuta INMEDIATAMENTE y de forma SINCRONA, en el mismo
  // momento en que se crea la promesa. Lo asincrono es lo que hay dentro.

  /**
   * cocinarPedido(): simula la cocina de un restaurante.
   * @param {string} plato       - nombre del plato
   * @param {number} milisegundos- lo que tarda en prepararse
   * @param {boolean} hayIngredientes - si es false, el pedido se rechaza
   * @returns {Promise<string>} promesa que se cumple con el mensaje de entrega
   */
  function cocinarPedido(plato, milisegundos, hayIngredientes) {
    return new Promise(function (resolve, reject) {
      imprimir('   [cocina] recibido el pedido de ' + plato + ' (ejecutor SINCRONO)');

      setTimeout(function () {
        if (!hayIngredientes) {
          // ✅ BUENA PRACTICA: rechazar SIEMPRE con un objeto Error,
          // nunca con un simple string. El Error lleva mensaje y traza.
          reject(new Error('Se acabaron los ingredientes para: ' + plato));
          return;
        }
        resolve(plato + ' listo para servir');

        // Esta segunda llamada se IGNORA: la promesa ya cambio de estado.
        resolve('esto no se vera nunca');
      }, milisegundos);
    });
  }

  /**
   * esperar(): promesa de uso general que se cumple tras N milisegundos.
   * Es el "sleep" que JavaScript no trae de serie. La usaremos mucho.
   */
  function esperar(milisegundos, valor) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(valor);
      }, milisegundos);
    });
  }

  /** fallarTras(): promesa de uso general que se rechaza tras N milisegundos. */
  function fallarTras(milisegundos, mensaje) {
    return new Promise(function (_, reject) {
      // El primer parametro (resolve) no lo usamos; el guion bajo es una
      // convencion para decir "existe, pero lo ignoro a proposito".
      setTimeout(function () {
        reject(new Error(mensaje));
      }, milisegundos);
    });
  }

  // ============================================================
  // 3. CONSUMIR UNA PROMESA: then / catch / finally
  // ============================================================
  //   .then(fn)    -> fn se ejecuta si la promesa se CUMPLE. Recibe el valor.
  //   .catch(fn)   -> fn se ejecuta si la promesa se RECHAZA. Recibe el error.
  //   .finally(fn) -> fn se ejecuta SIEMPRE, pase lo que pase. No recibe nada.
  //
  // finally es el sitio perfecto para "apagar el spinner": tanto si hubo
  // exito como si hubo error, la interfaz debe dejar de mostrar "cargando".

  function demoPromesaCumplida() {
    titulo('3.1 - Una promesa que se CUMPLE');
    const t = cronometro();

    cocinarPedido('Ensalada cesar', 1200, true)
      .then(function (mensaje) {
        imprimir('[then]    ' + mensaje + '  (' + t() + ')');
      })
      .catch(function (error) {
        imprimir('[catch]   ' + error.message);   // aqui no entrara
      })
      .finally(function () {
        imprimir('[finally] La cocina cierra el ticket. Se ejecuta siempre.');
      });

    imprimir('Esta linea sale ANTES que el [then]: la promesa aun esta pendiente.');
  }

  function demoPromesaRechazada() {
    titulo('3.2 - Una promesa que se RECHAZA');
    const t = cronometro();

    cocinarPedido('Risotto de setas', 1200, false)
      .then(function (mensaje) {
        imprimir('[then]    ' + mensaje);          // aqui no entrara
      })
      .catch(function (error) {
        imprimir('[catch]   ' + error.message + '  (' + t() + ')');
        imprimir('          error instanceof Error ->', error instanceof Error);
      })
      .finally(function () {
        imprimir('[finally] Igual que antes: se ejecuta pase lo que pase.');
        imprimir('[OK] BUENA PRACTICA: apagar el spinner de carga siempre en finally.');
      });
  }

  function demoEstados() {
    titulo('3.3 - Ver los tres estados en vivo');

    const promesa = cocinarPedido('Tarta de queso', 1500, true);

    // Justo despues de crearla, la promesa esta PENDIENTE.
    imprimir('Estado ahora mismo: PENDIENTE (pending)');
    imprimir('El objeto promesa existe ya, pero no tiene valor todavia:', String(promesa));

    promesa.then(function (valor) {
      imprimir('Estado ahora: CUMPLIDA (fulfilled) con el valor -> "' + valor + '"');
      imprimir('A partir de aqui la promesa ya no cambiara nunca mas.');

      // Volver a hacer .then sobre una promesa YA cumplida funciona:
      // devuelve el mismo valor al instante (bueno, en la siguiente microtarea).
      promesa.then(function (v) {
        imprimir('Segundo .then sobre la MISMA promesa -> "' + v + '" (valor cacheado)');
      });
    });

    const fallida = fallarTras(2000, 'Horno averiado');
    fallida.catch(function (error) {
      imprimir('Otra promesa distinta: RECHAZADA con -> "' + error.message + '"');
    });
  }

  // ============================================================
  // 4. ENCADENAR then: LA CADENA DE MONTAJE
  // ============================================================
  // .then() devuelve SIEMPRE una promesa nueva. Eso es lo que permite
  // encadenar. Y hay dos maneras de alimentar el siguiente eslabon:
  //
  //   a) devolver un VALOR normal:   return precio * 1.21;
  //      -> el siguiente then recibe ese valor ya calculado.
  //
  //   b) devolver una PROMESA:       return pedirDatos();
  //      -> la cadena ESPERA a que esa promesa se resuelva y el siguiente
  //         then recibe su valor, no la promesa. A esto se le llama
  //         "aplanar" (flattening) y es lo que evita la piramide.

  function demoEncadenar() {
    titulo('3.4 - Encadenar then: valores y promesas');
    const t = cronometro();

    cocinarPedido('Pizza margarita', 800, true)
      .then(function (mensaje) {
        imprimir('[1] ' + mensaje + '  (' + t() + ')');
        // (a) devolvemos un VALOR normal
        return { plato: 'Pizza margarita', precio: 12.5 };
      })
      .then(function (pedido) {
        // Recibimos el objeto del eslabon anterior, no una promesa.
        imprimir('[2] Precio base: ' + pedido.precio + ' EUR');
        const conIva = Number((pedido.precio * 1.21).toFixed(2));
        return conIva;                       // otro valor normal
      })
      .then(function (conIva) {
        imprimir('[3] Precio con IVA: ' + conIva + ' EUR');
        // (b) devolvemos una PROMESA: la cadena espera 700 ms aqui
        return esperar(700, 'Cobro de ' + conIva + ' EUR confirmado');
      })
      .then(function (confirmacion) {
        // Fijate: recibimos el STRING, no la promesa. La cadena la desenvolvio.
        imprimir('[4] ' + confirmacion + '  (' + t() + ')');
        imprimir('    La cadena espero sola a la promesa del paso 3.');
      })
      .catch(function (error) {
        imprimir('[catch] ' + error.message);
      });
  }

  // ============================================================
  // 5. ERROR CLASICO 1: OLVIDAR EL return DENTRO DE UN then
  // ============================================================
  // Si dentro de un .then() creamos una promesa pero NO la devolvemos,
  // la cadena no la espera: sigue adelante inmediatamente y el siguiente
  // .then() recibe undefined.
  //
  // ⚠️ ERROR COMUN: es silencioso. No hay error rojo en consola. Simplemente
  // los datos llegan "vacios" y el alumno pasa media hora buscando el fallo.

  function demoOlvidarReturn() {
    titulo('3.5 - [!] ERROR COMUN: olvidar el return dentro de then');
    const t = cronometro();

    imprimir('--- VERSION INCORRECTA (sin return) ---');
    esperar(200, 'paso A')
      .then(function (valor) {
        imprimir('[mal 1] ' + valor);
        esperar(600, 'paso B');       // [!] falta el return: nadie espera esto
      })
      .then(function (valor) {
        imprimir('[mal 2] recibo: ' + valor + '   <-- undefined, y ademas llego demasiado pronto (' + t() + ')');
      })
      .then(function () {
        imprimir('');
        imprimir('--- VERSION CORRECTA (con return) ---');
        const t2 = cronometro();

        return esperar(200, 'paso A')
          .then(function (valor) {
            imprimir('[bien 1] ' + valor);
            return esperar(600, 'paso B');   // [OK] con return: la cadena espera
          })
          .then(function (valor) {
            imprimir('[bien 2] recibo: ' + valor + '   <-- el valor correcto, tras esperar (' + t2() + ')');
            imprimir('');
            imprimir('REGLA: dentro de un then, si creas una promesa, DEVUELVELA.');
            imprimir('Truco: con funciones flecha de una sola linea el return es implicito:');
            imprimir('   .then(v => esperar(600, v))   ya devuelve la promesa.');
          });
      });
  }

  // ============================================================
  // 6. ERROR CLASICO 2: EL catch QUE NO CAPTURA
  // ============================================================
  // El .catch() solo atrapa lo que ocurre ANTES de el en la cadena.
  // Si lo colocamos en medio, todo lo que venga despues queda desprotegido.
  //
  // Y hay un segundo caso mucho mas traicionero: un throw dentro de un
  // setTimeout NO lo captura nadie. Cuando el temporizador se dispara, la
  // cadena de promesas ya termino: ese error se escapa al ambito global.

  // Bandera para que el vigilante global de errores solo hable durante la demo.
  let esperandoErrorDeLaDemo = false;

  // Escuchamos los errores globales de la ventana SOLO para poder mostrar en
  // la consola visual el error que se escapa. En una app real no se usa asi.
  window.addEventListener('error', function (evento) {
    if (!esperandoErrorDeLaDemo) return;
    imprimir('[window.onerror] Se escapo un error al ambito global: ' + evento.message);
    imprimir('                 Ningun .catch() pudo verlo. La promesa quedo PENDIENTE para siempre.');
    esperandoErrorDeLaDemo = false;
  });

  function demoCatchQueNoCaptura() {
    titulo('3.6 - [!] ERROR COMUN: el catch que no captura');

    imprimir('CASO A: el catch colocado ANTES del paso que falla.');
    esperar(200, 'todo bien de momento')
      .then(function (valor) {
        imprimir('  [A1] ' + valor);
      })
      .catch(function () {
        // Este catch esta demasiado arriba: vigila solo lo de encima.
        imprimir('  [A-catch temprano] no me entero de nada, ya he pasado');
      })
      .then(function () {
        imprimir('  [A2] ahora lanzo un error a proposito...');
        throw new Error('Fallo posterior al catch');
      })
      .catch(function (error) {
        // ✅ BUENA PRACTICA: el catch va SIEMPRE al final de la cadena.
        imprimir('  [A-catch final] SI lo capturo: ' + error.message);
        imprimir('  REGLA: el catch cubre lo que esta POR ENCIMA de el, nunca lo de debajo.');

        // Encadenamos el caso B despues, para que la consola no se mezcle.
        return esperar(600);
      })
      .then(function () {
        imprimir('');
        imprimir('CASO B: un throw dentro de un setTimeout dentro del ejecutor.');
        imprimir('Vas a ver un error ROJO en DevTools. Es a proposito.');

        esperandoErrorDeLaDemo = true;

        // ⚠️ ANTIPATRON A PROPOSITO: lanzar dentro del setTimeout.
        const promesaRota = new Promise(function (resolve, reject) {
          setTimeout(function () {
            // Cuando esto se ejecuta, el ejecutor ya termino hace rato.
            // El throw NO llega a reject: se pierde.
            throw new Error('Error lanzado dentro de setTimeout');
          }, 300);
        });

        promesaRota.catch(function (error) {
          // Esta linea NUNCA se ejecuta.
          imprimir('  [B-catch] esto no se vera jamas: ' + error.message);
        });

        return esperar(900);
      })
      .then(function () {
        imprimir('');
        imprimir('  [OK] LA FORMA CORRECTA del caso B: llamar a reject(), no lanzar.');
        const promesaSana = new Promise(function (resolve, reject) {
          setTimeout(function () {
            reject(new Error('Error entregado con reject()'));   // asi SI funciona
          }, 200);
        });
        return promesaSana.catch(function (error) {
          imprimir('  [B-catch correcto] capturado sin problemas: ' + error.message);
        });
      });
  }

  // ============================================================
  // 7. COMBINADORES: TRABAJAR CON VARIAS PROMESAS A LA VEZ
  // ============================================================
  // Los cuatro reciben un ARRAY (o cualquier iterable) de promesas.
  // La diferencia esta en CUANDO deciden que han terminado.

  // --- 7.1 Promise.all -------------------------------------------------
  // Se cumple cuando TODAS se cumplen, y devuelve un array de resultados
  // EN EL MISMO ORDEN del array de entrada (aunque terminen desordenadas).
  // Se rechaza en cuanto UNA falla: es "todo o nada".
  // Usalo cuando necesitas todos los datos para poder pintar la pantalla.

  function demoAll() {
    titulo('3.7 - Promise.all: todo o nada');
    const t = cronometro();
    imprimir('Lanzo 3 tareas a la vez: 900 ms, 400 ms y 1300 ms.');
    imprimir('Si fueran secuenciales tardarian 2600 ms. En paralelo: lo que tarde la mas lenta.');

    Promise.all([
      esperar(900, 'perfil del usuario'),
      esperar(400, 'lista de pedidos'),
      esperar(1300, 'historial de pagos')
    ])
      .then(function (resultados) {
        imprimir('CUMPLIDA en ' + t() + ' (aprox. la duracion de la mas lenta)');
        imprimir('Resultados EN ORDEN DE ENTRADA, no de llegada:', resultados);
      })
      .catch(function (error) {
        imprimir('[catch] ' + error.message);
      })
      .then(function () {
        imprimir('');
        imprimir('Ahora lo mismo, pero una de las tres falla a los 500 ms:');
        const t2 = cronometro();

        return Promise.all([
          esperar(900, 'perfil del usuario'),
          fallarTras(500, 'La API de pedidos devolvio un 500'),
          esperar(1300, 'historial de pagos')
        ])
          .then(function (r) {
            imprimir('esto no se vera:', r);
          })
          .catch(function (error) {
            imprimir('RECHAZADA en ' + t2() + ' -> ' + error.message);
            imprimir('[!] Las otras dos promesas NO se cancelan: siguen corriendo en segundo plano.');
            imprimir('   Simplemente su resultado ya no le importa a nadie.');
          });
      });
  }

  // --- 7.2 Promise.allSettled ------------------------------------------
  // NUNCA se rechaza. Espera a que todas terminen (bien o mal) y devuelve
  // un array de objetos con esta forma:
  //   { status: 'fulfilled', value: ... }   o   { status: 'rejected', reason: ... }
  // Usalo cuando quieras mostrar resultados parciales: "3 de 5 correos enviados".

  function demoAllSettled() {
    titulo('3.8 - Promise.allSettled: quiero saberlo todo');
    const t = cronometro();
    imprimir('Enviamos 4 correos. Dos funcionan, dos fallan. Ninguno cancela a los demas.');

    Promise.allSettled([
      esperar(400, 'correo a lucia@instituto.edu enviado'),
      fallarTras(600, 'buzon lleno: mateo@instituto.edu'),
      esperar(800, 'correo a sofia@instituto.edu enviado'),
      fallarTras(300, 'direccion inexistente: pruebas@@instituto.edu')
    ]).then(function (resultados) {
      imprimir('Terminado en ' + t() + '. Ni un solo catch necesario.');
      imprimir('------------------------------------------------------------');

      // forEach con indice: recorremos los resultados uno a uno.
      resultados.forEach(function (resultado, indice) {
        if (resultado.status === 'fulfilled') {
          imprimir('  [' + (indice + 1) + '] OK    -> ' + resultado.value);
        } else {
          // En los rechazados el error viene en .reason, no en .value.
          imprimir('  [' + (indice + 1) + '] FALLO -> ' + resultado.reason.message);
        }
      });

      const correctos = resultados.filter(function (r) { return r.status === 'fulfilled'; }).length;
      imprimir('------------------------------------------------------------');
      imprimir('Resumen: ' + correctos + ' de ' + resultados.length + ' correos enviados.');
      imprimir('[OK] Este es el combinador que quieres para envios masivos e informes.');
    });
  }

  // --- 7.3 Promise.race -------------------------------------------------
  // Termina con la PRIMERA promesa que cambie de estado, sea cumplida o
  // rechazada. Su uso estrella es imponer un tiempo limite (timeout).

  function demoRace() {
    titulo('3.9 - Promise.race: gana la primera en terminar');
    const t = cronometro();

    imprimir('CASO 1: servidor lento (2500 ms) contra un limite de 1000 ms.');

    Promise.race([
      esperar(2500, 'datos del servidor lento'),
      fallarTras(1000, 'Tiempo de espera agotado (1000 ms)')
    ])
      .then(function (valor) {
        imprimir('  Gano el servidor: ' + valor);
      })
      .catch(function (error) {
        imprimir('  Gano el reloj en ' + t() + ' -> ' + error.message);
        imprimir('  [OK] Este es el patron "timeout": una carrera contra un cronometro.');
      })
      .then(function () {
        imprimir('');
        imprimir('CASO 2: el mismo limite, pero ahora el servidor tarda solo 400 ms.');
        const t2 = cronometro();

        return Promise.race([
          esperar(400, 'datos del servidor rapido'),
          fallarTras(1000, 'Tiempo de espera agotado (1000 ms)')
        ])
          .then(function (valor) {
            imprimir('  Gano el servidor en ' + t2() + ' -> ' + valor);
          })
          .catch(function (error) {
            imprimir('  ' + error.message);
          });
      });
  }

  // --- 7.4 Promise.any --------------------------------------------------
  // Se cumple con la primera que se CUMPLA, ignorando las que fallen.
  // Solo se rechaza si fallan TODAS, y entonces lanza un AggregateError
  // que contiene el array de todos los errores en su propiedad .errors.
  // Usalo con servidores espejo: te vale el primero que responda bien.

  function demoAny() {
    titulo('3.10 - Promise.any: la primera que funcione');

    // Promise.any es relativamente reciente (2021). Comprobamos que existe
    // antes de usarla: es lo que se llama "deteccion de caracteristicas".
    if (typeof Promise.any !== 'function') {
      imprimir('Tu navegador no soporta Promise.any. Actualizalo para probar esta demo.');
      return;
    }

    const t = cronometro();
    imprimir('Tres servidores espejo. Los dos primeros fallan, el tercero responde.');

    Promise.any([
      fallarTras(300, 'espejo-1 caido'),
      fallarTras(500, 'espejo-2 no responde'),
      esperar(900, 'catalogo descargado desde espejo-3')
    ])
      .then(function (valor) {
        imprimir('CUMPLIDA en ' + t() + ' -> ' + valor);
        imprimir('Los dos fallos anteriores se ignoraron por completo.');
        imprimir('(Con Promise.race habriamos fallado a los 300 ms.)');
      })
      .catch(function (error) {
        imprimir('[catch] ' + error.message);
      })
      .then(function () {
        imprimir('');
        imprimir('Ahora el caso en que fallan TODOS:');
        const t2 = cronometro();

        return Promise.any([
          fallarTras(200, 'espejo-1 caido'),
          fallarTras(400, 'espejo-2 no responde'),
          fallarTras(600, 'espejo-3 sin certificado')
        ])
          .then(function (v) { imprimir('esto no se vera: ' + v); })
          .catch(function (error) {
            imprimir('RECHAZADA en ' + t2() + ' con un ' + error.constructor.name);
            imprimir('El AggregateError guarda TODOS los errores dentro de .errors:');
            // error.errors es un array con los tres errores originales.
            (error.errors || []).forEach(function (e, i) {
              imprimir('   errors[' + i + '] -> ' + e.message);
            });
          });
      });
  }

  // ============================================================
  // 8. CONECTAR LOS BOTONES
  // ============================================================
  function alPulsar(id, manejador) {
    const boton = document.getElementById(id);
    if (!boton) {
      console.warn('[03-promesas] No encuentro el boton con id "' + id + '".');
      return;
    }
    boton.addEventListener('click', manejador);
  }

  alPulsar('btn-promesa-ok', demoPromesaCumplida);
  alPulsar('btn-promesa-fallo', demoPromesaRechazada);
  alPulsar('btn-estados', demoEstados);
  alPulsar('btn-encadenar', demoEncadenar);
  alPulsar('btn-olvidar-return', demoOlvidarReturn);
  alPulsar('btn-catch-tardio', demoCatchQueNoCaptura);
  alPulsar('btn-all', demoAll);
  alPulsar('btn-allsettled', demoAllSettled);
  alPulsar('btn-race', demoRace);
  alPulsar('btn-any', demoAny);
  alPulsar('btn-limpiar-3', limpiar);

  // ============================================================
  // 9. EJERCICIOS PROPUESTOS
  // ============================================================
  /*
    EJERCICIO 1 (facil) - Tu primera promesa
    Escribe lanzarDado() que devuelva una promesa. Tras 800 ms debe cumplirse
    con un numero aleatorio del 1 al 6... salvo que salga un 1, en cuyo caso
    debe rechazarse con new Error('Has sacado un 1: pierdes el turno').
    Consumela con then/catch/finally y muestra los tres casos en la consola.

    EJERCICIO 2 (facil) - La cadena del carrito
    Partiendo de una promesa que se cumple con el array
    [{ producto: 'Teclado', precio: 45 }, { producto: 'Raton', precio: 22 }],
    encadena tres .then(): el primero suma los precios, el segundo aplica un
    21 % de IVA, el tercero muestra el total con dos decimales. Cada then debe
    devolver un valor al siguiente.

    EJERCICIO 3 (medio) - Reintentos automaticos
    Escribe reintentar(crearPromesa, intentos) que llame a crearPromesa() y,
    si la promesa se rechaza, lo vuelva a intentar hasta "intentos" veces
    antes de rendirse. Pruebalo con una funcion que falle las dos primeras
    veces y funcione a la tercera. Pista: recursion dentro del .catch().

    EJERCICIO 4 (medio) - Timeout reutilizable
    Escribe conLimite(promesa, milisegundos) que devuelva una nueva promesa:
    la original si termina a tiempo, o un rechazo con
    new Error('Tiempo agotado') si no. Usa Promise.race por dentro.
    Aplicalo despues a la funcion obtenerUsuarios() del archivo 05.

    EJERCICIO 5 (dificil) - Panel de estado de servicios
    Tienes cinco servicios (autenticacion, catalogo, pagos, correo, informes).
    Cada uno tarda un tiempo aleatorio y falla con un 40 % de probabilidad.
    Usa Promise.allSettled para pintar en la pagina una lista con un punto
    verde o rojo por servicio, el tiempo que tardo cada uno y un resumen
    final del tipo "3 de 5 servicios operativos". Nada de <pre>: tarjetas.
  */
})();
